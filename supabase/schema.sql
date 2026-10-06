-- PJ Lite / Conta Lite — schema inicial para sincronização real
-- Projetado para Supabase Postgres + Auth (Google).

create extension if not exists pgcrypto;

create or replace function public.pjlite_invite_code()
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := 'LITE-' || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6));
    exit when not exists (select 1 from public.groups where invite_code = candidate);
  end loop;
  return candidate;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sheets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  local_id text not null,
  sheet_type text not null default 'pc',
  system text not null default 'RPG',
  name text not null default 'Ficha sem nome',
  payload jsonb not null default '{}'::jsonb,
  client_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, local_id)
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  invite_code text not null unique default public.pjlite_invite_code(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  joined_at timestamptz not null default now(),
  primary key(group_id, user_id)
);

create table if not exists public.sheet_shares (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid references public.groups(id) on delete set null,
  source_local_id text,
  sheet_type text not null default 'pc',
  system text not null default 'RPG',
  name text not null default 'Ficha sem nome',
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending','imported','dismissed')),
  sent_at timestamptz not null default now(),
  acted_at timestamptz
);

create index if not exists idx_sheets_owner_updated on public.sheets(owner_id, updated_at desc);
create index if not exists idx_group_members_user on public.group_members(user_id);
create index if not exists idx_sheet_shares_recipient on public.sheet_shares(recipient_id, status, sent_at desc);

create or replace function public.pjlite_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles for each row execute function public.pjlite_touch_updated_at();
drop trigger if exists trg_sheets_touch on public.sheets;
create trigger trg_sheets_touch before update on public.sheets for each row execute function public.pjlite_touch_updated_at();
drop trigger if exists trg_groups_touch on public.groups;
create trigger trg_groups_touch before update on public.groups for each row execute function public.pjlite_touch_updated_at();

create or replace function public.pjlite_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, email, display_name, avatar_url)
  values(
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(coalesce(new.email,''),'@',1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict(id) do update set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, public.profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.pjlite_handle_new_user();

create or replace function public.pjlite_is_group_member(p_group_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.group_members gm
    where gm.group_id = p_group_id and gm.user_id = p_user_id
  ) or exists(
    select 1 from public.groups g
    where g.id = p_group_id and g.owner_id = p_user_id
  );
$$;

create or replace function public.pjlite_join_group_by_code(p_code text)
returns table(group_id uuid, group_name text, role text)
language plpgsql
security definer
set search_path = public, auth
as $
declare
  g public.groups%rowtype;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select grp.*
  into g
  from public.groups as grp
  where grp.invite_code = upper(trim(p_code))
  limit 1;

  if g.id is null then
    raise exception 'invalid_invite_code';
  end if;

  insert into public.group_members(group_id, user_id, role)
  values (
    g.id,
    auth.uid(),
    case when g.owner_id = auth.uid() then 'owner' else 'member' end
  )
  on conflict on constraint group_members_pkey do nothing;

  return query
  select
    g.id,
    g.name,
    case when g.owner_id = auth.uid() then 'owner' else 'member' end;
end;
$;

create or replace function public.pjlite_rotate_group_code(p_group_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  code text;
begin
  if not exists(select 1 from public.groups where id = p_group_id and owner_id = auth.uid()) then
    raise exception 'not_group_owner';
  end if;
  code := public.pjlite_invite_code();
  update public.groups set invite_code = code where id = p_group_id;
  return code;
end;
$$;

create or replace function public.pjlite_share_sheet_to_email(p_local_id text, p_recipient_email text)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  s public.sheets%rowtype;
  recipient uuid;
  new_id uuid;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select * into s from public.sheets where owner_id = auth.uid() and local_id = p_local_id limit 1;
  if s.id is null then raise exception 'sheet_not_found'; end if;
  select id into recipient from auth.users where lower(email) = lower(trim(p_recipient_email)) limit 1;
  if recipient is null then raise exception 'recipient_not_found'; end if;
  insert into public.sheet_shares(sender_id, recipient_id, source_local_id, sheet_type, system, name, payload)
  values(auth.uid(), recipient, s.local_id, s.sheet_type, s.system, s.name, s.payload)
  returning id into new_id;
  return new_id;
end;
$$;

create or replace function public.pjlite_share_sheet_to_group(p_local_id text, p_group_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.sheets%rowtype;
  count_inserted integer := 0;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if not public.pjlite_is_group_member(p_group_id, auth.uid()) then raise exception 'not_group_member'; end if;
  select * into s from public.sheets where owner_id = auth.uid() and local_id = p_local_id limit 1;
  if s.id is null then raise exception 'sheet_not_found'; end if;
  insert into public.sheet_shares(sender_id, recipient_id, group_id, source_local_id, sheet_type, system, name, payload)
  select auth.uid(), gm.user_id, p_group_id, s.local_id, s.sheet_type, s.system, s.name, s.payload
  from public.group_members gm
  where gm.group_id = p_group_id and gm.user_id <> auth.uid();
  get diagnostics count_inserted = row_count;
  return count_inserted;
end;
$$;

alter table public.profiles enable row level security;
alter table public.sheets enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.sheet_shares enable row level security;

-- Perfis: o próprio usuário pode ler/editar seu perfil.
drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self on public.profiles for select using (id = auth.uid());
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- Fichas privadas por padrão.
drop policy if exists sheets_owner_all on public.sheets;
create policy sheets_owner_all on public.sheets for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Grupos visíveis a membros; criação pelo usuário autenticado; alteração/exclusão pelo dono.
drop policy if exists groups_select_member on public.groups;
create policy groups_select_member on public.groups for select using (public.pjlite_is_group_member(id, auth.uid()));
drop policy if exists groups_insert_self on public.groups;
create policy groups_insert_self on public.groups for insert with check (owner_id = auth.uid());
drop policy if exists groups_update_owner on public.groups;
create policy groups_update_owner on public.groups for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists groups_delete_owner on public.groups;
create policy groups_delete_owner on public.groups for delete using (owner_id = auth.uid());

-- Membros podem ver a lista do próprio grupo. O dono pode administrar membros.
drop policy if exists group_members_select_member on public.group_members;
create policy group_members_select_member on public.group_members for select using (public.pjlite_is_group_member(group_id, auth.uid()));
drop policy if exists group_members_owner_manage on public.group_members;
create policy group_members_owner_manage on public.group_members for all
using (exists(select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid()))
with check (exists(select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid()));

-- Compartilhamentos: remetente vê o que enviou; destinatário vê e altera o próprio recebimento.
drop policy if exists shares_select_participant on public.sheet_shares;
create policy shares_select_participant on public.sheet_shares for select using (sender_id = auth.uid() or recipient_id = auth.uid());
drop policy if exists shares_insert_sender on public.sheet_shares;
create policy shares_insert_sender on public.sheet_shares for insert with check (sender_id = auth.uid());
drop policy if exists shares_update_recipient on public.sheet_shares;
create policy shares_update_recipient on public.sheet_shares for update using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());
drop policy if exists shares_delete_recipient on public.sheet_shares;
create policy shares_delete_recipient on public.sheet_shares for delete using (recipient_id = auth.uid());

revoke all on function public.pjlite_join_group_by_code(text) from public, anon;
grant execute on function public.pjlite_join_group_by_code(text) to authenticated;
grant execute on function public.pjlite_rotate_group_code(uuid) to authenticated;
grant execute on function public.pjlite_share_sheet_to_email(text,text) to authenticated;
grant execute on function public.pjlite_share_sheet_to_group(text,uuid) to authenticated;
