import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getJourneySheetSummary} from '../src/cloud/journeySheetSummary.js';

const panel=readFileSync('src/cloud/JornadasPanel.jsx','utf8');
const api=readFileSync('src/cloud/jornadasCloud.js','utf8');
const css=readFileSync('src/cloud/jornadas-cris.css','utf8');
const preview=readFileSync('src/cloud/SheetQuickView.jsx','utf8');
const dmSql=readFileSync('supabase/migrations/20261023_jornadas_dm_npc_sheets.sql','utf8');
const privateSql=readFileSync('supabase/migrations/20261023_jornadas_private_npc_read.sql','utf8');

assert.ok(panel.includes("['npcs','NPCs e Ameaças']"),'Apenas o mestre deve ter aba NPCs/Ameaças');
assert.ok(panel.includes("tab==='npcs'&&isDm"),'A seção de NPCs deve ter proteção de papel');
assert.ok(panel.includes("dmSheets=mySheets.filter(s=>s.sheet_type!=='pc')"),'A lista de NPCs separada das fichas de jogador');
assert.ok(panel.includes("playerSheets=mySheets.filter(s=>s.sheet_type==='pc')"),'A lista de PCs não inclui ameaças');
assert.ok(panel.includes("isDm?listJourneyDmSheets(current.id):Promise.resolve([])"),'Não requisitar NPCs privados para jogadores');
assert.ok(panel.includes("listJourneyDmSheets(current.id)"),'Área privada deve consultar backend');
assert.ok(panel.includes("addDmLink(sheet.id)")&&panel.includes("removeDmLink(row.sheet_id)"),'Mestre deve adicionar/remover ameaças');
assert.ok(panel.includes("setTab(dmOnly?'npcs':'fichas')"),'A edição retorna à aba correta');
assert.ok(panel.includes("const syncLocal=()=>run(async()=>"),'Permitir enviar fichas locais explicitamente');
assert.ok(panel.includes("pushSheets(chars,threats)"),'Personagens, NPCs e ameaças devem ter sincronização');
assert.ok(api.includes("getLinkedSheetRows(table,campaignId)"),'Evitar nested join que oculta todas as fichas');
assert.ok(api.includes("return rows.map(row=>({...row,sheets:byId.get(row.sheet_id)||null}))"),'Associar fichas pelo ID do vínculo');
assert.ok(api.includes("linkDmSheet(campaignId,sheetId)")&&api.includes("unlinkDmSheet(campaignId,sheetId)"),'RPC do mestre em tabela privada');
assert.ok(api.includes("mine.sheet_type!=='pc'"),'Impedir ameaças no compartilhamento público');
assert.ok(dmSql.includes("campaign_dm_sheets enable row level security"),'Tabela DM precisa RLS');
assert.ok(dmSql.includes("s.sheet_type<>'pc'"),'Tabela privada precisa recusar personagens');
assert.ok(dmSql.includes("g.owner_id=(select auth.uid())"),'Só o mestre do grupo pode ler/escrever NPCs');
assert.ok(privateSql.includes("s.sheet_type='pc'"),'Leitura de personagens não expõe NPCs');
assert.ok(privateSql.includes("sheet_type='pc' and exists("),'Política de sheets deve bloquear ameaças dos jogadores');
assert.ok(preview.includes("role=\"button\" tabIndex={0}")&&preview.includes("onKeyDown={event=>"),'Miniaturas inteiras clicáveis por mouse/teclado');
assert.ok(css.includes(".journeys-dm-card"),'Fichas de NPCs responsivas');
const monster=getJourneySheetSummary({sheets:{name:'Horncrier',system:'dnd5e',sheet_type:'ameaca',payload:{
  nome:'Horncrier',tipo:'Monstro',pv:'11 (2d8 + 2)',ca:'10',atributos:{for:16,des:12}
}}});
assert.equal(monster.name,'Horncrier');
assert.equal(monster.profession,'Monstro');
assert.deepEqual(monster.hp,{current:'11 (2d8 + 2)',max:'—'});
assert.deepEqual(monster.combat,[{label:'CA',value:'10'}]);
console.log('✓ Campanhas: personagens compartilhados, NPCs privados do DM, cards clicáveis e sync local explícita.');
