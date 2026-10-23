-- Arquivos da Jornada, privados e restritos aos membros do grupo.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('pjlite-journeys','pjlite-journeys',false,26214400,array[
'image/png','image/jpeg','image/webp','image/gif','video/mp4','video/webm','application/pdf'
])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,
allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists journey_files_group_read on storage.objects;
create policy journey_files_group_read on storage.objects for select to authenticated
using(bucket_id='pjlite-journeys' and exists(
 select 1 from public.campaigns c where c.id::text=(storage.foldername(name))[1]
 and public.pjlite_is_group_member(c.group_id,(select auth.uid()))
));

drop policy if exists journey_files_group_upload on storage.objects;
create policy journey_files_group_upload on storage.objects for insert to authenticated
with check(bucket_id='pjlite-journeys'
 and lower(storage.extension(name))=any(array['png','jpg','jpeg','webp','gif','mp4','webm','pdf'])
 and exists(select 1 from public.campaigns c where c.id::text=(storage.foldername(name))[1]
 and public.pjlite_is_group_member(c.group_id,(select auth.uid())))
);