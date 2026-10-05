-- Corrige a geração dos códigos de convite LITE-XXXXXX.
-- O pgcrypto do Supabase vive no schema "extensions". Como o hardening
-- fixa search_path=public, qualificamos gen_random_bytes explicitamente.

create or replace function public.pjlite_invite_code()
returns text
language plpgsql
set search_path = public
as $$
declare
  candidate text;
begin
  loop
    candidate := 'LITE-' || upper(substr(encode(extensions.gen_random_bytes(4), 'hex'), 1, 6));
    exit when not exists (
      select 1
      from public.groups
      where invite_code = candidate
    );
  end loop;

  return candidate;
end;
$$;
