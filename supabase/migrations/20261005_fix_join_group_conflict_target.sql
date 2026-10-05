-- Corrige ambiguidade do parâmetro de saída group_id no ON CONFLICT.
-- A função RETURNS TABLE cria variáveis PL/pgSQL com os mesmos nomes das colunas,
-- portanto usamos explicitamente a constraint da chave primária.

create or replace function public.pjlite_join_group_by_code(p_code text)
returns table(group_id uuid, group_name text, role text)
language plpgsql
security definer
set search_path = public, auth
as $$
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
$$;

revoke all on function public.pjlite_join_group_by_code(text) from public, anon;
grant execute on function public.pjlite_join_group_by_code(text) to authenticated;
