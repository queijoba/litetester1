-- Corrige a geração dos códigos de convite LITE-XXXXXX.
-- A migração de hardening fixa search_path=public; por isso não dependemos
-- mais de gen_random_bytes() do pgcrypto para gerar o código.

create or replace function public.pjlite_invite_code()
returns text
language plpgsql
set search_path = public
as $$
declare
  candidate text;
begin
  loop
    candidate := 'LITE-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (
      select 1
      from public.groups
      where invite_code = candidate
    );
  end loop;

  return candidate;
end;
$$;
