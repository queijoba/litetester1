-- Fichas de NPC/ameaças nunca entram na consulta pública de personagens.
drop policy if exists campaign_links_owner_insert on public.campaign_sheet_links;
create policy campaign_links_owner_insert on public.campaign_sheet_links for insert to authenticated
 with check(owner_id=(select auth.uid())
  and exists(select 1 from public.sheets s where s.id=sheet_id and s.owner_id=(select auth.uid()) and s.sheet_type='pc')
  and exists(select 1 from public.campaigns c where c.id=campaign_id
   and public.pjlite_is_group_member(c.group_id,(select auth.uid()))));
drop policy if exists sheets_campaign_member_read on public.sheets;
create policy sheets_campaign_member_read on public.sheets for select to authenticated
 using(sheet_type='pc' and exists(
  select 1 from public.campaign_sheet_links l join public.campaigns c on c.id=l.campaign_id
  where l.sheet_id=sheets.id and public.pjlite_is_group_member(c.group_id,(select auth.uid()))
 ));
