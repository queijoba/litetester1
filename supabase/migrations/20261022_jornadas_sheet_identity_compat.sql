-- O proprietário pode atualizar o sistema/tipo de fichas legadas.
-- Editores convidados (DM) nunca podem trocar a identidade da ficha na tabela nem no payload.
create or replace function public.pjlite_keep_sheet_identity()
returns trigger language plpgsql security invoker set search_path=public,pg_temp as $$
begin
 if old.owner_id is distinct from new.owner_id or old.local_id is distinct from new.local_id then
  raise exception 'sheet_identity_immutable';
 end if;
 if (select auth.uid()) is distinct from old.owner_id and
  (old.sheet_type is distinct from new.sheet_type
   or old.system is distinct from new.system
   or old.payload->>'id' is distinct from new.payload->>'id'
   or old.payload->>'type' is distinct from new.payload->>'type'
   or old.payload->>'system' is distinct from new.payload->>'system') then
   raise exception 'only_sheet_owner_can_change_identity';
 end if;
 return new;
end $$;