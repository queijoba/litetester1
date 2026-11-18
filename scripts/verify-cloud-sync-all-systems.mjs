import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 getSheetTime,mergeSheetVersions,reconcileSheetCollections,getKnownRemoteSheetIds,
 saveKnownRemoteSheetIds,backupRemotelyDeletedSheets,getRemovedSheetBackups
} from '../src/cloud/sheetSyncReconcile.js';
import {markSheetDeleted,getPendingSheetDeletions} from '../src/cloud/cloudSheetDeletions.js';
const db=new Map();
globalThis.localStorage={
 getItem:key=>db.get(key)??null,
 setItem:(key,v)=>db.set(key,String(v)),
 removeItem:key=>db.delete(key)
};
const earlier='2026-11-17T10:00:00.000Z',later='2026-11-18T10:00:00.000Z';
const systems=['dragonbane','dnd5e','fabula','ordemParanormal','skyfall','somdas6','3det','rotaZero','tormenta20'];
const chars=systems.map((system,n)=>({
 id:'pc-'+n,system,type:'pc',bio:{nome:'Personagem '+system},
 meta:{updatedAt:earlier},atributos:{teste:n},notas:'Dados únicos '+system,
 inventario:[{nome:'Lanterna',quantidade:n+1}]
}));
const monsters=systems.map((system,n)=>({
 id:'threat-'+n,system,type:'ameaca',nome:'Ameaça '+system,
 meta:{updatedAt:earlier},acoes:[{nome:'Ataque '+system,dano:'1d6'}],pv:5+n
}));
const rows=[...chars.map(x=>({local_id:x.id,sheet_type:'pc',payload:structuredClone(x),client_updated_at:earlier})),
 ...monsters.map(x=>({local_id:x.id,sheet_type:'ameaca',payload:structuredClone(x),client_updated_at:earlier}))];
const initial=reconcileSheetCollections([],[],rows,[],[]);
assert.equal(initial.characters.length,systems.length);
assert.equal(initial.threats.length,systems.length);
for(let i=0;i<systems.length;i++){
 assert.deepEqual(initial.characters[i],chars[i],'Ficha completa preservada: '+systems[i]);
 assert.deepEqual(initial.threats[i],monsters[i],'Ameaça completa preservada: '+systems[i]);
}
const newer=structuredClone(rows);
newer[0].payload.meta.updatedAt=later;
newer[0].payload.atributos.teste=99;
const deviceB=structuredClone(chars);
const merged=reconcileSheetCollections(deviceB,monsters,newer,rows.map(x=>x.local_id),[]);
assert.equal(merged.characters[0].atributos.teste,99,'Edição feita em outro dispositivo é importada');
assert.equal(merged.overwrittenLocal.length,1,'Cópia antiga deve ser preservável');
backupRemotelyDeletedSheets('u1',merged.overwrittenLocal);
assert.equal(getRemovedSheetBackups('u1')[0].item.atributos.teste,0);
const locallyUpdated=structuredClone(chars);
locallyUpdated[1].meta.updatedAt=later;
locallyUpdated[1].atributos.teste=77;
const kept=reconcileSheetCollections(locallyUpdated,monsters,rows,rows.map(x=>x.local_id),[]);
assert.equal(kept.characters[1].atributos.teste,77,'Edição local mais recente vai para envio');
assert.ok(getSheetTime(kept.characters[1])>getSheetTime(rows[1]));
const localOnly={...chars[2],id:'offline-created',meta:{updatedAt:later}};
const withNew=reconcileSheetCollections([localOnly],[],[],[],[]);
assert.equal(withNew.characters.length,1,'Nova ficha offline não deve desaparecer');
saveKnownRemoteSheetIds('u1',rows.map(x=>x.local_id));
const afterRemoteDeletion=reconcileSheetCollections(chars,monsters,rows.filter(x=>x.local_id!=='pc-3'),getKnownRemoteSheetIds('u1'),[]);
assert.ok(!afterRemoteDeletion.characters.some(x=>x.id==='pc-3'),'Ficha apagada em outro dispositivo não pode voltar');
assert.equal(afterRemoteDeletion.removedLocal[0].id,'pc-3');
backupRemotelyDeletedSheets('u1',afterRemoteDeletion.removedLocal);
assert.equal(getRemovedSheetBackups('u1').length,2);
assert.deepEqual(getKnownRemoteSheetIds('u2'),[],'Cache isolado por conta');
markSheetDeleted('pc-4','u1');
const withPending=reconcileSheetCollections(chars,monsters,rows,getKnownRemoteSheetIds('u1'),getPendingSheetDeletions('u1'));
assert.ok(!withPending.characters.some(x=>x.id==='pc-4'),'Exclusão pendente não deve ser ressuscitada');
const app=readFileSync('src/cloud/RealCloudPanel.jsx','utf8');
const api=readFileSync('src/cloud/supabaseCloud.js','utf8');
assert.ok(app.includes("const nextId=next?.user?.id||''"),'Mudanças de usuário consideradas');
assert.ok(app.includes('authUserIdRef.current!==nextId'),'Refresh do token não deve zerar inicialização');
assert.ok(app.includes("window.addEventListener('focus',refresh)"));
assert.ok(app.includes("window.addEventListener('online',refresh)"));
assert.ok(app.includes('window.setInterval(refresh,60000)'),'Revisão periódica da nuvem');
assert.ok(app.includes('const confirmed=await pullSheets()'),'Verificação depois do push');
assert.ok(app.includes('getSheetTime(remoteIds.get(String(item.id)))<getSheetTime(item)'),'Status sincronizado exige timestamp remoto >= local');
assert.ok(app.includes('backupRemotelyDeletedSheets(ownerId,[...first.removedLocal,...first.overwrittenLocal])'));
assert.ok(app.includes('saveKnownRemoteSheetIds(ownerId,confirmed.map'));
assert.ok(api.includes(".eq('owner_id',user.id)"),'Owner-scoped remote sheets');
console.log('✓ Sincronização dos 9 sistemas, personagens, ameaças, conflitos, exclusões e retorno de dispositivos.');
