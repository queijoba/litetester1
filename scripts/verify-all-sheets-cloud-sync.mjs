import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mergeSheetsByRevision,filterSheetsByIds,sheetId,localSheetStamp,cloudSheetStamp} from '../src/cloud/sheetSyncMerge.js';
const text=p=>readFileSync(p,'utf8');
const iso=time=>new Date(time).toISOString();
const make=(id,system,type,when)=>({id,system,type,bio:{nome:id},meta:{updatedAt:iso(when)}});
const now=Date.parse('2026-11-18T13:46:00Z');
const systems=['dragonbane','dnd5e','tormenta20','ordemParanormal','skyfall','somdas6','3det','fabula','rotaZero'];
for(const system of systems){
 for(const type of ['pc','ameaca','pnj']){
  const current=make('sheet-'+system+'-'+type,system,type,now);
  const old=make(current.id,system,type,now-100000);
  const newer=make(current.id,system,type,now+100000);
  assert.deepEqual(mergeSheetsByRevision([current],[{local_id:old.id,payload:old,client_updated_at:old.meta.updatedAt}]),[current],
   'Nunca substituir ficha atual por versão anterior: '+system+'/'+type);
  assert.deepEqual(mergeSheetsByRevision([current],[{local_id:newer.id,payload:newer,client_updated_at:newer.meta.updatedAt}]),[newer],
   'Baixar edição feita em outro dispositivo: '+system+'/'+type);
  assert.deepEqual(mergeSheetsByRevision([], [{local_id:current.id,payload:current,client_updated_at:current.meta.updatedAt}]),[current],
   'Ficha nova de outro dispositivo deve aparecer: '+system+'/'+type);
  assert.deepEqual(mergeSheetsByRevision([current],[{local_id:current.id,payload:newer,client_updated_at:newer.meta.updatedAt}],[current.id]),[],
   'Exclusões impedem ressurreição: '+system+'/'+type);
 }
}
const a=make('a','dragonbane','pc',now),b=make('b','3det','ameaca',now),c=make('c','rotaZero','pnj',now);
assert.deepEqual(mergeSheetsByRevision([a,b],[{local_id:'c',payload:c,client_updated_at:c.meta.updatedAt}]).map(x=>x.id),['a','b','c']);
assert.deepEqual(filterSheetsByIds([a,b,c],['b']).map(x=>x.id),['a','c']);
assert.equal(sheetId({id:12345}),'12345','Identidade estável mesmo para id numérico legado');
const legacy={system:'dragonbane',type:'pc'};
assert.equal(localSheetStamp(legacy),0);
assert.ok(cloudSheetStamp({payload:legacy,updated_at:iso(now)})>0);
assert.equal(mergeSheetsByRevision([a],[{local_id:'a',payload:b,client_updated_at:a.meta.updatedAt}])[0].id,'a',
 'Em empate não aceitar resultado atrasado sobre versão local');
const sql=text('supabase/migrations/20261118_sheet_sync_tombstones_and_write_guard.sql');
for(const fragment of ['create table if not exists public.sheet_deletions','enable row level security',
 'owner_id = (select auth.uid())','before insert or update on public.sheets','return null;',
 "tg_op='UPDATE'",'client_updated_at']){
 assert.ok(sql.includes(fragment),'Migração segura para exclusões e revisões: '+fragment);
}
assert.ok(!sql.includes('delete from public.sheets'),'Migração não remove fichas existentes');
const backend=text('src/cloud/supabaseCloud.js');
assert.ok(backend.includes('export async function fetchDeletedSheetIds'),'Carregar tombstones centralizados');
assert.ok(backend.includes('.from(\'sheet_deletions\').upsert('),'Registrar exclusão antes de apagar ficha');
assert.ok(backend.indexOf(".from('sheet_deletions').upsert(")<backend.indexOf(".from('sheets').delete()"),
 'Ordem da remoção: tombstone antes da deleção');
assert.ok(backend.includes('...await fetchDeletedSheetIds()'),'Upload filtra tombstones remotos');
assert.ok(backend.includes(".eq('owner_id',user.id)"),'Somente fichas próprias');
assert.ok(backend.includes('.range(from,from+499)'),'Paginação evita limite de 1000 fichas');
assert.ok(backend.includes("onConflict: 'owner_id,local_id'"),'Persistir id local sem duplicações');
const panel=text('src/cloud/RealCloudPanel.jsx');
assert.ok(panel.includes('currentOwnerRef.current!==nextId'),'Renovação de token não reinicializa a sincronização');
assert.ok(panel.includes('syncQueueRef.current.then(job,job)'),'Operações em série');
assert.ok(panel.includes('window.addEventListener(\'focus\',refresh)'), 'Sincronizar ao voltar ao navegador');
assert.ok(panel.includes('document.addEventListener(\'visibilitychange\',refresh)'),'Sincronizar ao voltar à aba');
assert.ok(panel.includes('window.setInterval(refresh,60000)'), 'Consultar atualizações entre dispositivos');
assert.ok(panel.includes('const latestChars')&&panel.includes('readCurrentLocal()'),'Não sobrescrever edições feitas durante chamada de rede');
assert.ok(panel.includes('filterSheetsByIds(nowChars,blocked)'),'Não restaurar exclusões ao enviar nuvem');
assert.ok(panel.includes('mergeSheetsByRevision'),'Todos os sistemas usam a mesma regra de revisão');
assert.ok(panel.includes('if(exact){'),'Excluir cloud-only somente com confirmação');
const app=text('src/PJLiteApp.jsx');
assert.ok(app.includes('favorite: !x.meta?.favorite, updatedAt: new Date().toISOString()'),
 'Favoritos alteram timestamp para sincronizar dispositivos');
const journey=text('src/cloud/jornadasCloud.js');
assert.ok(journey.includes('saveJourneySheet(sheetId,payload)')&&journey.includes('client_updated_at:now'),
 'Fichas editadas pelo DM também marcam revisão');
console.log('✓ Sincronização: 27 casos de PJ/NPC/ameaça e 9 sistemas, versionamento, tombstones, autenticação, foco, concorrência e Campanhas.');
