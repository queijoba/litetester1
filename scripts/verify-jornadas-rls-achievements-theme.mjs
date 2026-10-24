import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const sql=readFileSync('supabase/migrations/20261024_fix_campaign_sheet_rls_recursion.sql','utf8');
const html=readFileSync('index.html','utf8');
const app=readFileSync('src/cloud/RealCloudPanel.jsx','utf8');
const hub=readFileSync('src/cloud/JornadasHub.jsx','utf8');
const css=readFileSync('src/cloud/jornadas-night.css','utf8');
const legacy=readFileSync('public/dispatch/reward.js','utf8');
// SECURITY DEFINER avoids two RLS policies recursing into each other.
for(const name of [
 'pjlite_can_view_campaign_link','pjlite_owns_pc_sheet',
 'pjlite_can_read_campaign_sheet','pjlite_can_edit_campaign_sheet'
]){
 assert.ok(sql.includes('function public.'+name+'('),'RLS helper missing: '+name);
 assert.ok(sql.includes('security definer set search_path'),'Helper must isolate RLS and fix search_path');
 assert.ok(sql.includes('grant execute on function public.'+name),'Authenticated permission for '+name);
}
assert.ok(sql.includes('s.sheet_type=\\'pc\\'')&&sql.includes('l.dm_can_edit=true'),'Restrict PC access and DM edits');
assert.ok(sql.includes("g.owner_id=(select auth.uid())"),'DM permissions must enforce owner');
assert.ok(sql.includes('drop policy if exists sheets_campaign_member_read'),'Remove mutually recursive sheet lookup');
assert.ok(sql.includes('drop policy if exists campaign_links_member_select'),'Remove mutually recursive link lookup');
assert.ok(sql.includes('with check(owner_id=(select auth.uid())'),'Do not grant write to arbitrary owners');
assert.ok(!html.includes('/dispatch/reward.js'),'Remove globally injected legacy RZ badges, keep private reward route intact');
assert.ok(!html.includes('lite-signal-preview'),'Remove misleading ARG preview icon from app');
assert.ok(legacy.includes("badge.id='rz-achievement'"),'Legacy reward route remains available as a standalone resource');
assert.ok(app.includes('pjlite:achievements-visibility'),'Account setting must notify the other UI');
assert.ok(hub.includes("localStorage.getItem('pjlite_achievements_on_v1_'+account.id)"),'Jornadas should use account-specific preference');
assert.ok(hub.includes('pjlite:achievements-visibility'),'React to achievement toggle without reloading');
assert.ok(hub.includes("achievementsOn?'◆':'🐱'"),'OFF means cat only');
assert.ok(hub.includes('{achievementsOn&&<span className="pjlite-achievement-corner-text">'),'Never render label in OFF');
assert.ok(hub.includes("className={'jornadas-site jornadas-clean '+(theme==='night'"),'Night theme and classic selector required');
assert.ok(hub.includes("localStorage.setItem(THEME_KEY,next)"),'Theme persisted');
assert.ok(css.includes('.jornadas-clean.jornadas-night')&&css.includes('.jornadas-night .jornadas-site__side'),'Night theme entire room + navigation');
assert.ok(css.includes('.jornadas-night .pjlite-jornadas-tabs')&&css.includes('.jornadas-night .journeys-character-card'),'Night theme includes cards');
console.log('✓ RLS sem recursão; conquistas OFF sem overlays ARG; tema escuro/clássico com configurações persistidas.');
