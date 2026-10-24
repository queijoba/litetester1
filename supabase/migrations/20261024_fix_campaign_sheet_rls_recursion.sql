-- PJLite 1.1.0 Alpha: elimina referência circular de RLS entre
-- public.sheets e public.campaign_sheet_links sem liberar dados privados.
-- Helpers são SECURITY DEFINER, pertencem ao postgres e verificam auth.uid().
create or replace function public.pjlite_can_view_campaign_link(p_campaign_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
 select (select auth.uid()) is not null and exists(
  select 1 from public.campaigns c
  join public.groups g on g.id=c.group_id
  where c.id=p_campaign_id and
   (g.owner_id=(select auth.uid()) or exists(
    select 1 from public.group_members gm
    where gm.group_id=g.id and gm.user_id=(select auth.uid())
   ))
 );
$$;
create or replace function public.pjlite_owns_pc_sheet(p_sheet_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
 select (select auth.uid()) is not null and exists(
  select 1 from public.sheets s
  where s.id=p_sheet_id and s.owner_id=(select auth.uid()) and s.sheet_type='pc'
 );
$$;
create or replace function public.pjlite_can_read_campaign_sheet(p_sheet_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
 select (select auth.uid()) is not null and exists(
  select 1 from public.sheets s
  join public.campaign_sheet_links l on l.sheet_id=s.id
  join public.campaigns c on c.id=l.campaign_id
  join public.groups g on g.id=c.group_id
  where s.id=p_sheet_id and s.sheet_type='pc' and
   (g.owner_id=(select auth.uid()) or exists(
    select 1 from public.group_members gm
    where gm.group_id=g.id and gm.user_id=(select auth.uid())
   ))
 );
$$;
create or replace function public.pjlite_can_edit_campaign_sheet(p_sheet_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
 select (select auth.uid()) is not null and exists(
  select 1 from public.campaign_sheet_links l
  join public.campaigns c on c.id=l.campaign_id
  join public.groups g on g.id=c.group_id
  where l.sheet_id=p_sheet_id and l.dm_can_edit=true
    and c.owner_id=(select auth.uid()) and g.owner_id=(select auth.uid()) and g.is_dm=true
 );
$$;
-- não executáveis por visitantes; somente usuários autenticados.
revoke all on function public.pjlite_can_view_campaign_link(uuid) from public,anon;
revoke all on function public.pjlite_owns_pc_sheet(uuid) from public,anon;
revoke all on function public.pjlite_can_read_campaign_sheet(uuid) from public,anon;
revoke all on function public.pjlite_can_edit_campaign_sheet(uuid) from public,anon;
grant execute on function public.pjlite_can_view_campaign_link(uuid) to authenticated;
grant execute on function public.pjlite_owns_pc_sheet(uuid) to authenticated;
grant execute on function public.pjlite_can_read_campaign_sheet(uuid) to authenticated;
grant execute on function public.pjlite_can_edit_campaign_sheet(uuid) to authenticated;

drop policy if exists campaign_links_member_select on public.campaign_sheet_links;
create policy campaign_links_member_select on public.campaign_sheet_links
 for select to authenticated
 using(public.pjlite_can_view_campaign_link(campaign_id));

drop policy if exists campaign_links_owner_insert on public.campaign_sheet_links;
create policy campaign_links_owner_insert on public.campaign_sheet_links
 for insert to authenticated
 with check(owner_id=(select auth.uid())
   and public.pjlite_owns_pc_sheet(sheet_id)
   and public.pjlite_can_view_campaign_link(campaign_id));

drop policy if exists campaign_links_owner_update on public.campaign_sheet_links;
create policy campaign_links_owner_update on public.campaign_sheet_links
 for update to authenticated
 using(owner_id=(select auth.uid()))
 with check(owner_id=(select auth.uid()) and public.pjlite_owns_pc_sheet(sheet_id));

drop policy if exists sheets_campaign_member_read on public.sheets;
create policy sheets_campaign_member_read on public.sheets
 for select to authenticated
 using(sheet_type='pc' and public.pjlite_can_read_campaign_sheet(id));

drop policy if exists sheets_campaign_dm_edit on public.sheets;
create policy sheets_campaign_dm_edit on public.sheets
 for update to authenticated
 using(public.pjlite_can_edit_campaign_sheet(id))
 with check(public.pjlite_can_edit_campaign_sheet(id));
