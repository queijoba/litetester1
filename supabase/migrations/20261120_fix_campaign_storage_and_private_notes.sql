-- DM Lite: corrigir paths de anexos e isolar o planejamento privado do mestre.
-- Sem alteração de fichas, personagens ou registros existentes.
create table if not exists public.campaign_dm_notes (
 campaign_id uuid primary key references public.campaigns(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete cascade,
 notes text not null default '',
 updated_at timestamptz not null default now(),
 constraint campaign_dm_notes_size check (char_length(notes)<=50000)
);
alter table public.campaign_dm_notes enable row level security;
grant select,insert,update,delete on public.campaign_dm_notes to authenticated;
revoke all on public.campaign_dm_notes from anon;
drop policy if exists campaign_dm_notes_owner on public.campaign_dm_notes;
create policy campaign_dm_notes_owner on public.campaign_dm_notes
 for all to authenticated
 using (owner_id=(select auth.uid()) and exists (
  select 1 from public.campaigns c
  where c.id=campaign_dm_notes.campaign_id and c.owner_id=(select auth.uid())
 ))
 with check (owner_id=(select auth.uid()) and exists (
  select 1 from public.campaigns c
  where c.id=campaign_dm_notes.campaign_id and c.owner_id=(select auth.uid())
 ));

-- No subselect, "name" sem qualificação resolvia c.name (título da campanha),
-- não o caminho do objeto. Usar sempre storage.objects.name.
drop policy if exists journey_files_group_upload on storage.objects;
create policy journey_files_group_upload on storage.objects
 for insert to authenticated
 with check(
  bucket_id='pjlite-journeys'
  and lower(storage.extension(storage.objects.name))=any(array['png','jpg','jpeg','webp','gif','mp4','webm','pdf'])
  and exists(
   select 1 from public.campaigns c
   where c.id::text=(storage.foldername(storage.objects.name))[1]
    and public.pjlite_is_group_member(c.group_id,(select auth.uid()))
  )
 );

drop policy if exists journey_files_group_read on storage.objects;
create policy journey_files_group_read on storage.objects
 for select to authenticated
 using (
  bucket_id='pjlite-journeys'
  and exists(
   select 1 from public.campaigns c
   where c.id::text=(storage.foldername(storage.objects.name))[1]
    and public.pjlite_is_group_member(c.group_id,(select auth.uid()))
    and (c.owner_id=(select auth.uid())
      or exists(select 1 from public.campaign_resources r
       where r.campaign_id=c.id and r.url='storage:'||storage.objects.name
       and r.visible_to_players)
      or exists(select 1 from public.campaign_messages m
       where m.campaign_id=c.id and m.url='storage:'||storage.objects.name))
  )
 );

-- Permitir limpeza de uploads removidos apenas ao mestre desta campanha.
drop policy if exists journey_files_dm_cleanup on storage.objects;
create policy journey_files_dm_cleanup on storage.objects
 for delete to authenticated
 using (
  bucket_id='pjlite-journeys'
  and exists(
   select 1 from public.campaigns c
   where c.id::text=(storage.foldername(storage.objects.name))[1]
    and c.owner_id=(select auth.uid())
  )
 );
