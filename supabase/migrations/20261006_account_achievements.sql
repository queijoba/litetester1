create table if not exists public.account_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null,
  label text not null,
  name text not null,
  category text not null default 'GERAL',
  unlocked_at timestamptz not null default now(),
  is_public boolean not null default true,
  source text,
  primary key (user_id, achievement_id)
);

alter table public.account_achievements enable row level security;

drop policy if exists account_achievements_select_own on public.account_achievements;
create policy account_achievements_select_own
  on public.account_achievements
  for select
  to authenticated
  using (user_id = (select auth.uid()));

revoke insert, update, delete on public.account_achievements from anon, authenticated;
grant select on public.account_achievements to authenticated;
grant all on public.account_achievements to service_role;

create or replace function public.pjlite_award_rz88()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.account_achievements(
    user_id, achievement_id, label, name, category, unlocked_at, is_public, source
  )
  values (
    new.user_id, 'rz-88', 'RZ-88', 'Colaborador Rota Zero', 'EVENTO',
    coalesce(new.unlocked_at, now()), true, 'rota_zero_collaborators'
  )
  on conflict (user_id, achievement_id) do update
    set label = excluded.label,
        name = excluded.name,
        category = excluded.category,
        is_public = true,
        source = excluded.source;
  return new;
end;
$$;

revoke all on function public.pjlite_award_rz88() from public, anon, authenticated;

drop trigger if exists trg_pjlite_award_rz88 on public.rota_zero_collaborators;
create trigger trg_pjlite_award_rz88
  after insert or update of unlocked_at
  on public.rota_zero_collaborators
  for each row execute function public.pjlite_award_rz88();

insert into public.account_achievements(
  user_id, achievement_id, label, name, category, unlocked_at, is_public, source
)
select
  r.user_id, 'rz-88', 'RZ-88', 'Colaborador Rota Zero', 'EVENTO',
  coalesce(r.unlocked_at, now()), true, 'rota_zero_collaborators'
from public.rota_zero_collaborators r
on conflict (user_id, achievement_id) do nothing;

insert into public.account_achievements(
  user_id, achievement_id, label, name, category, unlocked_at, is_public, source
)
select u.id, 'rz-88', 'RZ-88', 'Colaborador Rota Zero', 'EVENTO', now(), true, 'manual_founder_event'
from auth.users u
where lower(u.email) = lower('nickreisgg55@gmail.com')
on conflict (user_id, achievement_id) do update
  set label = excluded.label, name = excluded.name, category = excluded.category, is_public = true;

insert into public.account_achievements(
  user_id, achievement_id, label, name, category, unlocked_at, is_public, source
)
select u.id, 'founder', 'FUNDADOR', 'Fundador do PJ Lite', 'ESPECIAL', now(), true, 'founder'
from auth.users u
where lower(u.email) = lower('nickreisgg55@gmail.com')
on conflict (user_id, achievement_id) do update
  set label = excluded.label, name = excluded.name, category = excluded.category, is_public = true;
