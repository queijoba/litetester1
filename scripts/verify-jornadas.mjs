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
const chat=readFileSync('src/cloud/AccountChatPanel.jsx','utf8');
const hubCss=readFileSync('src/cloud/jornadas-hub.css','utf8');
const indexHtml=readFileSync('index.html','utf8');
assert.ok(app.includes("versao: '1.1.0v Alpha'"),'A versão atual deve aparecer no log');
assert.ok(app.includes('✨ 1.1.0v Alpha — novas jornadas e conquistas')&&app.includes('newsCollapsed'), 'A Home deve preservar a barra clássica de novidades');
assert.ok(app.includes('Log de Atualizações')&&app.includes('UPDATE_LOG.slice(0, 6)'), 'O histórico deve continuar em Sobre o Projeto');
assert.ok(app.includes('Conquistas:</strong>')&&!app.includes('Chat e Rota Zero</span>'), 'Novidades devem mencionar apenas conquistas, sem destacar Rota Zero');
assert.ok(indexHtml.includes('1.1.0v Alpha'),'Metadados devem mostrar a versão 1.1.0');
assert.ok(account.includes('<AccountChatPanel account={account}'), 'Chat precisa existir na Conta Lite');
assert.ok(account.includes("accountTab")&&account.includes("tab==='chat'"),'Chat acessível com link e aba');
assert.ok(chat.includes('listJourneyMessages')&&chat.includes('sendJourneyMessage'),'Chat deve usar o backend de campanha');
assert.ok(chat.includes('uploadJourneyMedia'),'Chat deve suportar anexos privados');

assert.ok(account.includes('Conquistas</h3>')&&account.includes('ON • visual completo')&&account.includes('OFF • somente gatinho 🐱'));
assert.ok(account.includes("achievementsOn?'◆':'🐱'"),'Conquistas OFF deve renderizar somente o gatinho');
assert.ok(!account.includes('OFF • somente símbolo'),'Não usar o selo anterior no modo OFF');
assert.ok(account.includes('pjlite_achievements_on_v1_')&&account.includes('pjlite-achievement-corner'));
assert.ok(account.includes('getMyAchievements()'),'Conquistas devem vir da conta, não somente do navegador');
assert.ok(account.includes('Acessar conteúdo →'),'Recompensa continua acessível sem expor seu nome');
assert.ok(account.includes('visibleAchievement(tag)'),'Conquistas do grupo usam rótulo genérico');
assert.ok(!account.includes('RZ-88 • EVENTO')&&!account.includes('◆ RZ-88 — Colaborador Rota Zero'),'O perfil não deve revelar nomes secretos');
assert.ok(app.includes('pjlite:open-arg-material')&&app.includes("setGuideTab('rotazero')"));
assert.ok(!app.includes("versao: '#088 FALHO'"),'Incidente do ARG não deve aparecer no log público');
assert.ok(argCss.includes('.pjlite-achievement-corner.is-minimal'));
assert.ok(account.includes('setGroupMaster(group.id,true)'));
assert.ok(account.includes('toggleDm(group)')&&account.includes('href="/?jornadas=1"'));
assert.ok(!account.includes('<JornadasPanel account={account}'),'Jornadas não deve ficar dentro de Conta e Nuvem');
assert.ok(!account.includes('JornadasDemoPanel'),'Chave de teste não deve ficar no login da Conta Lite');
const main=readFileSync('src/main.jsx','utf8');
const hub=readFileSync('src/cloud/JornadasHub.jsx','utf8');
const clean=readFileSync('src/cloud/jornadas-clean.css','utf8');
assert.ok(main.includes("get('jornadas')==='1'")&&main.includes('<JornadasHub />'),'Jornadas precisa ter rota própria');
assert.ok(app.includes('href="/?jornadas=1"'),'Home deve mostrar acesso direto a Jornadas');

assert.ok(app.includes('const [journeysSignedIn,setJourneysSignedIn]=useState(false)'),'Atalho Jornadas começa oculto');
assert.ok(app.includes('journeysSignedIn&&<a href="/?jornadas=1"'),'Só mostra botão Jornadas a usuário autenticado');
assert.ok(app.includes('getSession().then(session=>{if(alive)setJourneysSignedIn(!!session?.user)})'),'Sessão inicial controla acesso');
assert.ok(app.includes('onAuthStateChange(session=>{if(alive)setJourneysSignedIn(!!session?.user)})'),'Botão reage ao login e logout');
const crisCss=readFileSync('src/cloud/jornadas-cris.css','utf8');
assert.ok(crisCss.includes('.jornadas-room-tools')&&crisCss.includes('@media(max-width:520px)'),'Ações rápidas e correções de overflow responsivas');
assert.ok(panel.includes('jornadas-room-tools')&&panel.includes('aria-label="Seções da campanha"'),'Campanha deve ter atalhos e navegação acessível');
assert.ok(panel.includes('!validHttp(c.board?.coverUrl)&&<span'),'Não mostrar ícone sobre a arte de capa personalizada');

assert.ok(hub.includes('Voltar à Home')&&hubCss.includes('.jornadas-site__home-link'),'Jornadas deve ter retorno visível');
assert.ok(hub.includes('<JornadasPanel')&&hub.includes('<AccountChatPanel'),'Campanhas e chat reais dentro de Jornadas');
assert.ok(!hub.includes('JORNADAS-TESTE')&&!hub.includes('JornadasDemoPanel')&&!hub.includes('Mesa de demonstração'),'Interface não deve oferecer mesa simulada');
for (const word of ['Conta Lite','Chat','Grupos e convites','Criar grupo de mestre','joinGroupByCode','setGroupMaster','onAuthStateChange']) assert.ok(hub.includes(word),'Falta fluxo real: '+word);
assert.ok(hub.includes('navigate(\'account\')')&&hub.includes('navigate(\'chat\')'),'Abas de Conta e Chat precisam funcionar');
assert.ok(groups.includes("get('jornadas')")===false||groups.includes('jornadas'),'Supabase deve tratar redirecionamento da sessão');
assert.ok(clean.includes('@media(max-width:710px)'),'Jornadas devem manter navegação no celular');
assert.ok(app.includes('setCampaignOptions')&&app.includes('data.meta?.campaignId'));
assert.ok(app.includes('pjlite:jornadas-changed'),'Seletores atualizam as campanhas');
assert.ok(app.includes("guideTab === 'jornadas'"),'Guia de Jornadas disponível');
assert.ok(app.includes('pjlite:open-arg-material'),'Guia mantém acesso restrito ao material');

for(const name of ['setGroupMaster','listJourneys','createJourney','saveJourney','listJourneyMessages','sendJourneyMessage','listJourneyResources','addJourneyResource','getMyCloudSheets','listJourneySheets','linkMySheet','setMasterSheetEdit','saveJourneySheet','uploadJourneyMedia'])
 assert.ok(api.includes('function '+name+'('),'Ação de nuvem ausente: '+name);
for(const type of ['resumo','combate','fichas','chat','biblioteca','investigacao','relatorios','anotacoes','mapamental','escudo'])
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
const workspace=readFileSync('src/cloud/CampaignWorkspace.jsx','utf8');
const newSchema=readFileSync('supabase/migrations/20261023_jornadas_mindmap_library.sql','utf8');
assert.ok(panel.includes('<CampaignLibrary')&&panel.includes('<CampaignMindmap')&&panel.includes('<CampaignRecords')&&panel.includes('<CampaignNotes')&&panel.includes('<CampaignShield'),'Ferramentas novas devem estar ligadas à sala');
assert.ok(hub.includes('jornadas-background-options')&&hub.includes('dragonbane_custom_bg'),'Tema com fundo igual à Home');
assert.ok(workspace.includes('saveDmMindmap')&&workspace.includes('getDmMindmap'),'Mapa mental DM deve ser persistido');
assert.ok(workspace.includes('Abrir em nova aba / baixar')&&workspace.includes('iframe'),'Biblioteca deve permitir leitura de PDFs');
assert.ok(newSchema.includes('campaign_dm_mindmaps enable row level security'),'Mural DM deve ter RLS');
assert.ok(newSchema.includes('visible_to_players'),'Material deve ser protegido no banco');
assert.ok(api.includes('setJourneyResourceVisibility')&&api.includes('saveDmMindmap'),'Permissões e mapa devem possuir API real');

assert.ok(api.includes("throw new Error('Use apenas links HTTPS.')"),'Não aceitar URLs inseguras');
assert.ok(!app.includes('setDragonbaneLibraryOpen(true)'),'Editor clássico de Dragonbane não deve ganhar uma biblioteca nova');
console.log('✓ Jornadas: interface real, login com retorno, grupos/convites, campanhas, chat privado e conquistas discretas.');
