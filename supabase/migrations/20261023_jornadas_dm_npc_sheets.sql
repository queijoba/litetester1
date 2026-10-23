-- NPCs e ameaças adicionados pelo mestre são privados por padrão.
-- Mantidos separadamente dos personagens compartilhados pelos jogadores.
create table if not exists public.campaign_dm_sheets (
 campaign_id uuid not null references public.campaigns(id) on delete cascade,
 sheet_id uuid not null references public.sheets(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete cascade,
 added_at timestamptz not null default now(),
 primary key (campaign_id,sheet_id)
);
create index if not exists campaign_dm_sheets_owner_idx on public.campaign_dm_sheets(owner_id,campaign_id);
alter table public.campaign_dm_sheets enable row level security;

create policy campaign_dm_sheets_select on public.campaign_dm_sheets for select to authenticated
 using (owner_id=(select auth.uid()) and exists(
 select 1 from public.campaigns c join public.groups g on g.id=c.group_id
 where c.id=campaign_id and c.owner_id=(select auth.uid()) and g.owner_id=(select auth.uid()) and g.is_dm
 ));
create policy campaign_dm_sheets_insert on public.campaign_dm_sheets for insert to authenticated
 with check (owner_id=(select auth.uid())
 and exists(select 1 from public.sheets s where s.id=sheet_id and s.owner_id=(select auth.uid()) and s.sheet_type<>'pc')
 and exists(select 1 from public.campaigns c join public.groups g on g.id=c.group_id
 where c.id=campaign_id and c.owner_id=(select auth.uid()) and g.owner_id=(select auth.uid()) and g.is_dm)
 );
create policy campaign_dm_sheets_delete on public.campaign_dm_sheets for delete to authenticated
 using (owner_id=(select auth.uid()) and exists(
 select 1 from public.campaigns c join public.groups g on g.id=c.group_id
 where c.id=campaign_id and c.owner_id=(select auth.uid()) and g.owner_id=(select auth.uid()) and g.is_dm
 ));
grant select,insert,delete on public.campaign_dm_sheets to authenticated;
revoke all on public.campaign_dm_sheets from anon;
