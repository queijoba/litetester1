import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync('src/PJLiteApp.jsx','utf8');
const account=readFileSync('src/cloud/RealCloudPanel.jsx','utf8');
const api=readFileSync('src/cloud/jornadasCloud.js','utf8');
const panel=readFileSync('src/cloud/JornadasPanel.jsx','utf8');
const migration=readFileSync('supabase/migrations/20261022_jornadas_dm_rls.sql','utf8');
const storage=readFileSync('supabase/migrations/20261022_jornadas_private_uploads.sql','utf8');
const css=readFileSync('src/cloud/jornadas.css','utf8');
const argCss=readFileSync('src/cloud/account-achievements.css','utf8');
const groups=readFileSync('src/cloud/supabaseCloud.js','utf8');

assert.ok(groups.includes('id,name,owner_id,is_dm,invite_code'));
const news=readFileSync('src/cloud/NewsBanner.jsx','utf8');
const chat=readFileSync('src/cloud/AccountChatPanel.jsx','utf8');
const hubCss=readFileSync('src/cloud/jornadas-hub.css','utf8');
const indexHtml=readFileSync('index.html','utf8');
assert.ok(app.includes("versao: '1.1.0v Alpha'"),'A versão atual deve aparecer no log');
assert.ok(app.includes('<NewsBanner collapsed={newsCollapsed}'), 'A Home deve mostrar a barra de novidades');
assert.ok(news.includes('Log de atualizações')&&news.includes('argOpened'),'O log deve oferecer o registro #088');
assert.ok(news.includes('RZ-88')&&news.includes('Conquistas ON/OFF'),'A barra deve explicar os controles do ARG');
assert.ok(indexHtml.includes('1.1.0v Alpha'),'Metadados devem mostrar a versão 1.1.0');
assert.ok(account.includes('<AccountChatPanel account={account}'), 'Chat precisa existir na Conta Lite');
assert.ok(account.includes("accountTab")&&account.includes("tab==='chat'"),'Chat acessível com link e aba');
assert.ok(chat.includes('listJourneyMessages')&&chat.includes('sendJourneyMessage'),'Chat deve usar o backend de campanha');
assert.ok(chat.includes('uploadJourneyMedia'),'Chat deve suportar anexos privados');

assert.ok(account.includes('Conquistas ON')&&account.includes('ON • visual completo')&&account.includes('OFF • somente símbolo'));
assert.ok(account.includes('pjlite_achievements_on_v1_')&&account.includes('pjlite-achievement-corner'));
assert.ok(account.includes('getMyAchievements()'),'Conquistas devem vir da conta, não somente do navegador');
assert.ok(account.includes('Para acessar o material do ARG'));
assert.ok(app.includes('pjlite:open-arg-material')&&app.includes("setGuideTab('rotazero')"));
assert.ok(app.includes('#088 FALHO')&&app.includes('RZ-HR-12')&&app.includes('SINAL INCONSISTENTE'));
assert.ok(argCss.includes('.pjlite-achievement-corner.is-minimal'));
assert.ok(account.includes('setGroupMaster(group.id,true)'));
assert.ok(account.includes('toggleDm(group)')&&account.includes('href="/?jornadas=1"'));
assert.ok(!account.includes('<JornadasPanel account={account}'),'Jornadas não deve ficar dentro de Conta e Nuvem');
assert.ok(!account.includes('JornadasDemoPanel'),'Chave de teste não deve ficar no login da Conta Lite');
const main=readFileSync('src/main.jsx','utf8');
const hub=readFileSync('src/cloud/JornadasHub.jsx','utf8');
const demo=readFileSync('src/cloud/JornadasDemoPanel.jsx','utf8');
assert.ok(main.includes("get('jornadas')==='1'")&&main.includes('<JornadasHub />'),'Jornadas precisa ter rota própria');
assert.ok(app.includes('href="/?jornadas=1"'),'Home deve mostrar acesso direto a Jornadas');
assert.ok(hub.includes('Voltar à Home')&&hubCss.includes('.jornadas-site__home-link'),'Jornadas deve ter retorno visível');
assert.ok(hub.includes('JORNADAS-TESTE')&&hub.includes('<JornadasDemoPanel')&&hub.includes('<JornadasPanel'),'Prévia própria, teste e campanhas reais');
assert.ok(demo.includes('pjlite_jornadas_demo_v1'),'Demonstração deve ser local e isolada');
assert.ok(app.includes('setCampaignOptions')&&app.includes('data.meta?.campaignId'));
assert.ok(app.includes('pjlite:jornadas-changed'),'Seletores atualizam as campanhas');
assert.ok(app.includes("guideTab === 'jornadas'"),'Guia de Jornadas disponível');
assert.ok(app.includes('Para acessar o material do ARG'),'Guia registra a recompensa');

for(const name of ['setGroupMaster','listJourneys','createJourney','saveJourney','listJourneyMessages','sendJourneyMessage','listJourneyResources','addJourneyResource','getMyCloudSheets','listJourneySheets','linkMySheet','setMasterSheetEdit','saveJourneySheet','uploadJourneyMedia'])
 assert.ok(api.includes('function '+name+'('),'Ação de nuvem ausente: '+name);
for(const type of ['resumo','combate','fichas','chat','materiais'])
 assert.ok(panel.includes("['"+type+"'"),'Aba Jornada ausente: '+type);
assert.ok(panel.includes('Permitir edição pelo DM'),'Consentimento explícito do jogador');
assert.ok(panel.includes('saveJourneySheet(editSheet.sheet_id'),'Mestre deve poder salvar uma ficha autorizada');
assert.ok(panel.includes('Acompanhe')||panel.includes('iniciativa'),'Guia ou iniciativa básica');
assert.ok(panel.includes('uploadJourneyMedia'),'Upload de mídia no chat e documentos');
assert.ok(panel.includes('12'+'000'),'Atualização periódica da mesa');
assert.ok(css.includes('@media(max-width:580px)'),'Layout móvel de Jornadas');
assert.ok(migration.includes('alter table public.groups add column if not exists is_dm'));
for(const table of ['campaigns','campaign_messages','campaign_resources','campaign_sheet_links'])
 assert.ok(migration.includes('alter table public.'+table+' enable row level security'),'Tabela de Jornada sem RLS: '+table);
assert.ok(migration.includes('dm_can_edit boolean not null default false'),'Permissão por ficha deve começar desativada');
assert.ok(migration.includes('campaign_links_owner_insert')&&migration.includes('campaign_links_owner_update'));
assert.ok(migration.includes('pjlite_keep_sheet_identity'),'Não permitir troca do dono de ficha via DM');
assert.ok(migration.includes('sheets_campaign_dm_edit')&&migration.includes('l.dm_can_edit'));
assert.ok(storage.includes("false,26214400"),'Bucket privado limitado a 25 MB');
assert.ok(storage.includes("journey_files_group_read")&&storage.includes("journey_files_group_upload"));
assert.ok(storage.includes('pjlite_is_group_member'),'Mídia só para membros do grupo');
assert.ok(api.includes("createSignedUrl(path,60*30)"),'Acesso temporário aos arquivos privados');
assert.ok(api.includes("throw new Error('Use apenas links HTTPS.')"),'Não aceitar URLs inseguras');
assert.ok(!app.includes('setDragonbaneLibraryOpen(true)'),'Editor clássico de Dragonbane não deve ganhar uma biblioteca nova');
console.log('✓ Jornadas: DM, grupos, fichas compartilhadas com consentimento, materiais privados, chat, guia e ARG.');
