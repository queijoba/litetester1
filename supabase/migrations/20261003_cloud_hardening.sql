-- Ajustes aplicados ao projeto PJ Lite Cloud após o schema inicial.
alter function public.pjlite_invite_code() set search_path = public;
alter function public.pjlite_touch_updated_at() set search_path = public;

create or replace function public.pjlite_group_add_owner()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.group_members(group_id,user_id,role)
  values(new.id,new.owner_id,'owner')
  on conflict do nothing;
  return new;
end;$$;

drop trigger if exists trg_groups_add_owner on public.groups;
create trigger trg_groups_add_owner
after insert on public.groups
for each row execute function public.pjlite_group_add_owner();

revoke all on function public.pjlite_group_add_owner() from public, anon, authenticated;
revoke all on function public.pjlite_handle_new_user() from public, anon, authenticated;

revoke all on function public.pjlite_is_group_member(uuid,uuid) from public, anon;
grant execute on function public.pjlite_is_group_member(uuid,uuid) to authenticated;

revoke all on function public.pjlite_join_group_by_code(text) from public, anon;
revoke all on function public.pjlite_rotate_group_code(uuid) from public, anon;
revoke all on function public.pjlite_share_sheet_to_email(text,text) from public, anon;
revoke all on function public.pjlite_share_sheet_to_group(text,uuid) from public, anon;

grant execute on function public.pjlite_join_group_by_code(text) to authenticated;
grant execute on function public.pjlite_rotate_group_code(uuid) to authenticated;
grant execute on function public.pjlite_share_sheet_to_email(text,text) to authenticated;
grant execute on function public.pjlite_share_sheet_to_group(text,uuid) to authenticated;
