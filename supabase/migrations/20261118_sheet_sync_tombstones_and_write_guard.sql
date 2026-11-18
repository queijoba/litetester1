-- PJLite 1.1.3 Alpha — prevenção de exclusões ressuscitadas e versões antigas.
-- Migração não destrutiva: nenhuma ficha existente é removida ou alterada.
create table if not exists public.sheet_deletions (
 owner_id uuid not null references auth.users(id) on delete cascade,
 local_id text not null,
 deleted_at timestamptz not null default now(),
 primary key (owner_id, local_id)
);
create index if not exists idx_sheet_deletions_owner_date on public.sheet_deletions (owner_id, deleted_at desc);

alter table public.sheet_deletions enable row level security;
drop policy if exists sheet_deletions_select on public.sheet_deletions;
create policy sheet_deletions_select on public.sheet_deletions for select
 to authenticated using (owner_id = (select auth.uid()));
drop policy if exists sheet_deletions_insert on public.sheet_deletions;
create policy sheet_deletions_insert on public.sheet_deletions for insert
 to authenticated with check (owner_id = (select auth.uid()));
drop policy if exists sheet_deletions_update on public.sheet_deletions;
create policy sheet_deletions_update on public.sheet_deletions for update
 to authenticated using (owner_id = (select auth.uid()))
 with check (owner_id = (select auth.uid()));
-- Intencionalmente sem DELETE para clientes: evitar reativação silenciosa.
revoke all on public.sheet_deletions from anon;
revoke all on public.sheet_deletions from authenticated;
grant select,insert,update on public.sheet_deletions to authenticated;

-- Protege inclusive clientes antigos que tentarem regravar fichas excluídas
-- ou sobrescrever a ficha de outro dispositivo com timestamp inferior.
create or replace function public.pjlite_guard_sheet_sync()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
 if exists (
  select 1 from public.sheet_deletions d
  where d.owner_id = new.owner_id and d.local_id = new.local_id
 ) then
  return null;
 end if;
 if tg_op='UPDATE' and
    coalesce(new.client_updated_at, '-infinity'::timestamptz)
      < coalesce(old.client_updated_at,'-infinity'::timestamptz) then
  return null;
 end if;
 return new;
end;
$function$;
drop trigger if exists pjlite_sheet_sync_guard on public.sheets;
create trigger pjlite_sheet_sync_guard
 before insert or update on public.sheets
 for each row execute function public.pjlite_guard_sheet_sync();
