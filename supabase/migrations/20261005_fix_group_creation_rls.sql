-- Corrige a criação de grupos via PostgREST quando o INSERT usa RETURNING.
-- A policy de leitura por membro depende da associação do grupo; durante o
-- RETURNING da linha recém-criada, o proprietário precisa conseguir ler a
-- própria linha diretamente.

drop policy if exists groups_select_owner on public.groups;
create policy groups_select_owner on public.groups
for select
to authenticated
using (owner_id = auth.uid());

-- Mantém também uma API segura de criação para uso futuro pelo cliente.
create or replace function public.pjlite_create_group(p_name text)
returns public.groups
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  clean_name text;
  created_group public.groups%rowtype;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  clean_name := trim(coalesce(p_name, ''));
  if clean_name = '' then
    raise exception 'group_name_required';
  end if;

  insert into public.groups(owner_id, name)
  values(auth.uid(), clean_name)
  returning * into created_group;

  return created_group;
end;
$$;

revoke all on function public.pjlite_create_group(text) from public, anon;
grant execute on function public.pjlite_create_group(text) to authenticated;
