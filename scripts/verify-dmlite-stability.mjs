import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(path,'utf8');
const api=read('src/cloud/jornadasCloud.js');
const panel=read('src/cloud/JornadasPanel.jsx');
const hub=read('src/cloud/JornadasHub.jsx');
const workspace=read('src/cloud/CampaignWorkspace.jsx');
const accountChat=read('src/cloud/AccountChatPanel.jsx');
const migration=read('supabase/migrations/20261120_fix_campaign_storage_and_private_notes.sql');

const must=(data,re,label)=>assert.match(data,re,label);
must(migration,/storage\.foldername\(storage\.objects\.name\)/,'Nome do arquivo deve ser qualificado para não resolver c.name');
assert.ok(!migration.includes('storage.foldername(name)'),'O path precisa ser qualificado');
must(migration,/create policy journey_files_group_read[\s\S]*?visible_to_players/,'Uploads não liberados não podem ser lidos por jogadores');
must(migration,/create policy journey_files_group_upload/,'Uploads precisam verificar grupo');
must(migration,/create policy journey_files_dm_cleanup/,'Apenas mestre limpa uploads removidos');
must(migration,/campaign_dm_notes_owner[\s\S]*?auth\.uid\(\)/,'Notas privadas devem exigir proprietário autenticado');

must(api,/saveJourney[\s\S]*?\.eq\('updated_at',journey\.updated_at\)/,'Salvamento de campanha deve detectar edições concorrentes');
must(api,/saveDmMindmap[\s\S]*?\.eq\('updated_at',expectedRevision\)/,'Mapa mental precisa de controle de versão');
must(api,/saveDmPrivateNotes[\s\S]*?\.eq\('updated_at',expectedRevision\)/,'Notas privadas precisam de controle de versão');
must(api,/listJourneyMessages[\s\S]*?ascending:false[\s\S]*?\.limit/,'Listar mensagens mais recentes antes das antigas');
must(api,/before\.created_at/,'Histórico deve aceitar cursor');
must(api,/removeJourneyResource[\s\S]*?\.remove\(\[item\.url\.slice\(8\)\]\)/,'Remoção do material deve tentar limpar upload');

must(panel,/loadOlderMessages=\(\)=>/,'Chat na campanha precisa de página anterior');
must(panel,/hasOlderMessages&&<button/,'Histórico deve ficar acessível aos jogadores');
must(accountChat,/loadOlder=async/,'Chat da Conta Lite precisa de paginação');
must(accountChat,/loadedOlder\.current=true/,'Atualização não deve reativar histórico já esgotado');
must(panel,/if\(!isDm\)listJourneys\(\)/,'Jogadores devem receber atualizações da campanha inteira');
must(panel,/Atualização parcial: falha em/,'Falha de refresh não pode emitir sucesso falso');
must(panel,/<CampaignNotes campaignId=\{current\.id\}/,'Anotações privadas precisam de ID da campanha');

must(workspace,/if\(!loaded\)return <section className="campaign-workspace">/,'Mapa deve bloquear edições após falha de leitura');
must(workspace,/saveDmMindmap\(campaignId,nodes,links,revision\)/,'Mapa deve salvar apenas sobre revisão conhecida');
must(workspace,/getDmPrivateNotes\(campaignId\)/,'Campo privado deve ler local próprio');
must(workspace,/saveDmPrivateNotes\(campaignId,secret,revision\)/,'Campo privado deve salvar separadamente');
must(workspace,/isDm&&<div className="campaign-workspace__box">[\s\S]*?Planejamento privado do mestre/,'Campo privado deve ficar oculto aos jogadores');
must(workspace,/setInterval\(refresh,15\*60\*1000\)/,'Biblioteca deve renovar links temporários');

must(hub,/PJ LITE · 1\.1\.3v ALPHA/,'Cabeçalho de campanhas deve refletir a versão atual');
assert.ok(!panel.includes("tormenta20:'Tormenta20'"),'Tormenta20 não deve ser habilitado nesta alteração');
console.log('✓ Revisão DM Lite: segurança de anexos, acesso privado, concorrência, chat, biblioteca, interface e T20 preservado fora do seletor.');
