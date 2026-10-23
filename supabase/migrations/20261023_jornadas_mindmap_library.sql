-- PJLite Jornadas 1.1.0: mural mental privado e biblioteca com liberação do mestre.
-- Segurança: o mural não pertence à coluna board (visível aos jogadores).
create table if not exists public.campaign_dm_mindmaps (
 campaign_id uuid primary key references public.campaigns(id) on delete cascade,
 owner_id uuid not null references auth.users(id) on delete cascade,
 nodes jsonb not null default '[]'::jsonb,
 links jsonb not null default '[]'::jsonb,
 updated_at timestamptz not null default now(),
 constraint campaign_dm_mindmaps_nodes_array check (jsonb_typeof(nodes)='array' and jsonb_array_length(nodes)<=200),
 constraint campaign_dm_mindmaps_links_array check (jsonb_typeof(links)='array' and jsonb_array_length(links)<=400),
 constraint campaign_dm_mindmaps_payload_size check (octet_length(nodes::text)+octet_length(links::text)<=250000)
);
alter table public.campaign_dm_mindmaps enable row level security;
drop policy if exists mindmap_dm_owner on public.campaign_dm_mindmaps;
create policy mindmap_dm_owner on public.campaign_dm_mindmaps for all to authenticated
 using (owner_id=(select auth.uid()) and exists(select 1 from public.campaigns c where c.id=campaign_id and c.owner_id=(select auth.uid())))
 with check (owner_id=(select auth.uid()) and exists(select 1 from public.campaigns c where c.id=campaign_id and c.owner_id=(select auth.uid())));
-- Distinção de materiais visíveis a jogadores, padrão permite manter acervo existente.
alter table public.campaign_resources add column if not exists visible_to_players boolean not null default true;
alter table public.campaign_resources add column if not exists description text not null default '';
alter table public.campaign_resources add column if not exists category text not null default 'documento';
alter table public.campaign_resources add constraint campaign_resources_description_size check(char_length(description)<=650);
-- Só o DM vê material não liberado: nunca confiar apenas em ocultação no React.
drop policy if exists campaign_resources_member_read on public.campaign_resources;
create policy campaign_resources_visible_read on public.campaign_resources for select to authenticated
 using (exists(select 1 from public.campaigns c where c.id=campaign_id
  and public.pjlite_is_group_member(c.group_id,(select auth.uid()))
  and (visible_to_players or c.owner_id=(select auth.uid()))));
drop policy if exists campaign_resources_dm_update on public.campaign_resources;
create policy campaign_resources_dm_update on public.campaign_resources for update to authenticated
 using(owner_id=(select auth.uid()) and exists(select 1 from public.campaigns c where c.id=campaign_id and c.owner_id=(select auth.uid())))
 with check(owner_id=(select auth.uid()) and exists(select 1 from public.campaigns c where c.id=campaign_id and c.owner_id=(select auth.uid())));
-- Metadados do recurso podem ser privados, mas o arquivo é protegido separadamente.
-- A leitura de uploads por membros só é concedida a itens liberados ou anexos de chat.
drop policy if exists journey_files_group_read on storage.objects;
create policy journey_files_group_read on storage.objects for select to authenticated
using(bucket_id='pjlite-journeys' and exists(
 select 1 from public.campaigns c where c.id::text=(storage.foldername(name))[1]
 and public.pjlite_is_group_member(c.group_id,(select auth.uid()))
 and (c.owner_id=(select auth.uid())
  or exists(select 1 from public.campaign_resources r where r.campaign_id=c.id
    and r.url='storage:'||storage.objects.name and r.visible_to_players)
  or exists(select 1 from public.campaign_messages m where m.campaign_id=c.id
    and m.url='storage:'||storage.objects.name))
));
