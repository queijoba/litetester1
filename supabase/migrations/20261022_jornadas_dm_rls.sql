
-- Jornadas LiteTester: campanhas privadas herdando membros dos grupos.
alter table public.groups add column if not exists is_dm boolean not null default false;

create table if not exists public.campaigns(
 id uuid primary key default gen_random_uuid(),
 group_id uuid not null references public.groups(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null check (char_length(name) between 1 and 120),
 system text not null default 'Livre' check (char_length(system) <= 70),
 description text not null default '',
 notes text not null default '',
 board jsonb not null default '{"round":1,"initiative":[],"encounter":""}'::jsonb,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists campaigns_group_idx on public.campaigns(group_id);
alter table public.campaigns enable row level security;
drop policy if exists campaign_members_read on public.campaigns;
create policy campaign_members_read on public.campaigns for select to authenticated
 using (public.pjlite_is_group_member(group_id,(select auth.uid())));
drop policy if exists campaign_dm_create on public.campaigns;
create policy campaign_dm_create on public.campaigns for insert to authenticated
 with check (owner_id=(select auth.uid()) and exists(
 select 1 from public.groups g where g.id=group_id and g.owner_id=(select auth.uid()) and g.is_dm=true
 ));
drop policy if exists campaign_dm_update on public.campaigns;
create policy campaign_dm_update on public.campaigns for update to authenticated
 using (owner_id=(select auth.uid()) and exists(select 1 from public.groups g where g.id=group_id and g.owner_id=(select auth.uid()) and g.is_dm))
 with check (owner_id=(select auth.uid()) and exists(select 1 from public.groups g where g.id=group_id and g.owner_id=(select auth.uid()) and g.is_dm));
drop policy if exists campaign_dm_delete on public.campaigns;
create policy campaign_dm_delete on public.campaigns for delete to authenticated
 using (owner_id=(select auth.uid()));

create table if not exists public.campaign_messages(
 id uuid primary key default gen_random_uuid(),
 campaign_id uuid not null references public.campaigns(id) on delete cascade,
 author_id uuid not null references auth.users(id) on delete cascade,
 kind text not null default 'text' check(kind in ('text','image','video','youtube','link')),
 body text not null default '' check(char_length(body)<=8000),
 url text not null default '' check(char_length(url)<=2000),
 created_at timestamptz not null default now()
);
create index if not exists campaign_messages_idx on public.campaign_messages(campaign_id,created_at);
alter table public.campaign_messages enable row level security;
drop policy if exists campaign_messages_member_read on public.campaign_messages;
create policy campaign_messages_member_read on public.campaign_messages for select to authenticated
 using(exists(select 1 from public.campaigns c where c.id=campaign_id and public.pjlite_is_group_member(c.group_id,(select auth.uid()))));
drop policy if exists campaign_messages_member_post on public.campaign_messages;
create policy campaign_messages_member_post on public.campaign_messages for insert to authenticated
 with check(author_id=(select auth.uid()) and exists(select 1 from public.campaigns c where c.id=campaign_id and public.pjlite_is_group_member(c.group_id,(select auth.uid()))));
drop policy if exists campaign_messages_delete_own on public.campaign_messages;
create policy campaign_messages_delete_own on public.campaign_messages for delete to authenticated
 using(author_id=(select auth.uid()));

create table if not exists public.campaign_resources(
 id uuid primary key default gen_random_uuid(),
 campaign_id uuid not null references public.campaigns(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(char_length(title) between 1 and 160),
 kind text not null default 'link' check(kind in ('link','map','image','video','youtube','pdf','table')),
 url text not null check(char_length(url) between 5 and 2000),
 created_at timestamptz not null default now()
);
create index if not exists campaign_resources_idx on public.campaign_resources(campaign_id);
alter table public.campaign_resources enable row level security;
drop policy if exists campaign_resources_member_read on public.campaign_resources;
create policy campaign_resources_member_read on public.campaign_resources for select to authenticated
 using(exists(select 1 from public.campaigns c where c.id=campaign_id and public.pjlite_is_group_member(c.group_id,(select auth.uid()))));
drop policy if exists campaign_resources_dm_insert on public.campaign_resources;
create policy campaign_resources_dm_insert on public.campaign_resources for insert to authenticated
 with check(owner_id=(select auth.uid()) and exists(select 1 from public.campaigns c where c.id=campaign_id and c.owner_id=(select auth.uid())));
drop policy if exists campaign_resources_dm_delete on public.campaign_resources;
create policy campaign_resources_dm_delete on public.campaign_resources for delete to authenticated
 using(owner_id=(select auth.uid()));

create table if not exists public.campaign_sheet_links(
 campaign_id uuid not null references public.campaigns(id) on delete cascade,
 sheet_id uuid not null references public.sheets(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete cascade,
 dm_can_edit boolean not null default false,
 linked_at timestamptz not null default now(),
 primary key (campaign_id,sheet_id)
);
create index if not exists campaign_sheet_links_sheet_idx on public.campaign_sheet_links(sheet_id);
alter table public.campaign_sheet_links enable row level security;
drop policy if exists campaign_links_member_select on public.campaign_sheet_links;
create policy campaign_links_member_select on public.campaign_sheet_links for select to authenticated
 using(exists(select 1 from public.campaigns c where c.id=campaign_id and public.pjlite_is_group_member(c.group_id,(select auth.uid()))));
drop policy if exists campaign_links_owner_insert on public.campaign_sheet_links;
create policy campaign_links_owner_insert on public.campaign_sheet_links for insert to authenticated
 with check(owner_id=(select auth.uid()) and exists(select 1 from public.sheets s where s.id=sheet_id and s.owner_id=(select auth.uid()))
 and exists(select 1 from public.campaigns c where c.id=campaign_id and public.pjlite_is_group_member(c.group_id,(select auth.uid()))));
drop policy if exists campaign_links_owner_update on public.campaign_sheet_links;
create policy campaign_links_owner_update on public.campaign_sheet_links for update to authenticated
 using(owner_id=(select auth.uid()))
 with check(owner_id=(select auth.uid()) and exists(select 1 from public.sheets s where s.id=sheet_id and s.owner_id=(select auth.uid())));
drop policy if exists campaign_links_owner_delete on public.campaign_sheet_links;
create policy campaign_links_owner_delete on public.campaign_sheet_links for delete to authenticated
 using(owner_id=(select auth.uid()));

drop policy if exists sheets_campaign_member_read on public.sheets;
create policy sheets_campaign_member_read on public.sheets for select to authenticated
 using(exists(select 1 from public.campaign_sheet_links l join public.campaigns c on c.id=l.campaign_id
 where l.sheet_id=sheets.id and public.pjlite_is_group_member(c.group_id,(select auth.uid()))));
drop policy if exists sheets_campaign_dm_edit on public.sheets;
create policy sheets_campaign_dm_edit on public.sheets for update to authenticated
 using(exists(select 1 from public.campaign_sheet_links l join public.campaigns c on c.id=l.campaign_id join public.groups g on g.id=c.group_id
 where l.sheet_id=sheets.id and l.dm_can_edit and g.is_dm and c.owner_id=(select auth.uid()) and g.owner_id=(select auth.uid())))
 with check(exists(select 1 from public.campaign_sheet_links l join public.campaigns c on c.id=l.campaign_id join public.groups g on g.id=c.group_id
 where l.sheet_id=sheets.id and l.dm_can_edit and g.is_dm and c.owner_id=(select auth.uid()) and g.owner_id=(select auth.uid())));

create or replace function public.pjlite_keep_sheet_identity()
returns trigger language plpgsql security invoker set search_path=public,pg_temp as $$
begin
 if old.owner_id is distinct from new.owner_id or old.local_id is distinct from new.local_id
 or old.sheet_type is distinct from new.sheet_type or old.system is distinct from new.system then
  raise exception 'sheet_identity_immutable';
 end if;
 return new;
end $$;
drop trigger if exists trg_pjlite_sheet_identity on public.sheets;
create trigger trg_pjlite_sheet_identity before update on public.sheets
 for each row execute function public.pjlite_keep_sheet_identity();

grant select,insert,update,delete on public.campaigns to authenticated;
grant select,insert,delete on public.campaign_messages to authenticated;
grant select,insert,delete on public.campaign_resources to authenticated;
grant select,insert,update,delete on public.campaign_sheet_links to authenticated;
