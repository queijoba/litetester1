import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const api=readFileSync('src/cloud/jornadasCloud.js','utf8');
const panel=readFileSync('src/cloud/JornadasPanel.jsx','utf8');
const css=readFileSync('src/cloud/jornadas-cris.css','utf8');
const migrations=readFileSync('supabase/migrations/20261022_jornadas_dm_rls.sql','utf8');

// O banco exige owner_id não nulo e a permissão pertence ao usuário que criou a ficha.
assert.ok(migrations.includes('owner_id uuid not null'));
assert.ok(migrations.includes('campaign_links_owner_insert'));
const insert=api.slice(api.indexOf('export async function linkMySheet'),api.indexOf('export async function setMasterSheetEdit'));
assert.ok(insert.includes('.insert({campaign_id:campaignId,sheet_id:sheetId,owner_id:actor.id})'),
  'Envie owner_id e use insert, sem regravar a permissão do DM no upsert');
assert.ok(!insert.includes('.upsert('),'Não substituir edição consentida em links existentes');
assert.ok(insert.includes("error.code==='23505'"),'Vínculo existente deve continuar intacto');
assert.ok(insert.includes("error.code==='42501'"),'Aviso específico para falta de acesso');
assert.ok(insert.includes('owner_id===actor.id'),'Confirmar que vínculo existente pertence ao usuário');

assert.ok(panel.includes('Promise.allSettled(['),'Fichas devem carregar mesmo se chat/biblioteca falharem');
assert.ok(panel.includes('results[2]'),'Consulta de vínculos deve ser independente');
assert.ok(panel.includes('results[3]'),'Fichas próprias devem ser consultadas independentemente');
assert.ok(panel.includes("role=\"alert\""),'Falha no carregamento das fichas precisa ser visível');
assert.ok(panel.includes('onClick={refreshRoom}'),'Repetir carregamento de perfis e fichas');
assert.ok(panel.includes('addLinkFrom(s.id)'),'Botão de vinculação direta nas fichas disponíveis');
assert.ok(panel.includes('await listJourneySheets(current.id);'),'Ler o vínculo de volta depois da gravação');
assert.ok(panel.includes('if(!confirmed.some(row=>row.sheet_id===id))'),'Não declarar sucesso sem confirmação do servidor');
assert.ok(panel.includes('Fichas sincronizadas na Conta Lite não aparecem automaticamente'),
  'Explicar que o vínculo é uma ação separada da sincronização');

assert.ok(css.includes('@media (max-width:1110px)'),'Barra lateral adaptativa em janela reduzida');
assert.ok(css.includes('grid-template-columns:repeat(4,minmax(0,1fr))'),'Menu com 4 atalhos sem sobreposição');
assert.ok(css.includes('@media (max-width:480px)'),'Menu em duas linhas no celular');
assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),'Menu pequeno legível');
assert.ok(css.includes('.journeys-sheet-error'),'Erro de sincronização legível');
console.log('✓ Vinculação confirma persistência, preserva RLS/consentimento, fichas independentes e menu responsivo.');
