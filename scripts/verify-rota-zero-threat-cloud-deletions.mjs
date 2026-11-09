import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initialRotaZeroThreatData,MODELOS_ROTA_ZERO_AMEACAS,normalizeRotaZeroThreatData} from '../src/systems/rotaZero/threatData.js';
import {buildThreatCardData} from '../src/components/threatCardData.js';
import {
 rememberCloudOwner,getLastCloudOwner,markSheetDeleted,getPendingSheetDeletions,
 withoutPendingDeletions,clearPendingSheetDeletions,unmarkSheetDeleted
} from '../src/cloud/cloudSheetDeletions.js';

const db=new Map();
globalThis.localStorage={
 getItem:k=>db.has(k)?db.get(k):null,
 setItem:(k,v)=>db.set(k,String(v)),
 removeItem:k=>db.delete(k)
};
rememberCloudOwner('user-A');
assert.equal(getLastCloudOwner(),'user-A');
assert.equal(markSheetDeleted('sheet-11'),true);
assert.equal(markSheetDeleted('sheet-11'),true);
assert.deepEqual(getPendingSheetDeletions('user-A'),['sheet-11'],'Sem duplicações');
assert.equal(withoutPendingDeletions([{id:'sheet-11'},{id:'sheet-22'}],'user-A').length,1);
assert.equal(withoutPendingDeletions([{local_id:'sheet-11'},{local_id:'sheet-22'}],'user-A')[0].local_id,'sheet-22');
assert.deepEqual(getPendingSheetDeletions('user-B'),[],'Exclusão não vazará para outra conta');
clearPendingSheetDeletions('user-A',['sheet-11']);
assert.deepEqual(getPendingSheetDeletions('user-A'),[],'Excluir apenas após confirmação remota');
markSheetDeleted('sheet-33','user-A');
unmarkSheetDeleted('sheet-33','user-A');
assert.deepEqual(getPendingSheetDeletions('user-A'),[],'Salvar explicitamente restaura ficha');

const threat=normalizeRotaZeroThreatData({...initialRotaZeroThreatData,nome:'Presa dos Cabos',
 recursos:{vitalidade:{atual:7,max:11}},
 atributos:{pulso:2},ataques:[{nome:'Cabos',dano:'1d6',desc:'Prende um alvo próximo'}],
 habilidades:[{nome:'Ruído',desc:'Causa interferência'}],
 fraquezas:[{nome:'Luz constante',desc:'Recua quando iluminado'}],notas:'Segredo do mestre'});
assert.equal(threat.type,'ameaca');
assert.equal(threat.recursos.vitalidade.max,11);
assert.equal(threat.atributos.firmeza,1);
const card=buildThreatCardData(threat);
assert.equal(card.system,'rotaZero');
assert.equal(card.name,'Presa dos Cabos');
assert.ok(card.stats.some(v=>v.title==='VIT'&&v.value==='7 / 11'));
assert.ok(card.attributes.some(v=>v.title==='Pulso'&&v.value==='2'));
assert.ok(card.sections.some(v=>v.label==='Ataques'&&v.items.some(e=>e.nome==='Cabos')));
assert.ok(card.sections.some(v=>v.label==='Fraquezas'));
assert.ok(!JSON.stringify(card).includes('Segredo do mestre'),'Nota privada jamais deve aparecer no PNG');
assert.equal(normalizeRotaZeroThreatData({system:'rotaZero',type:'pc'}).type,'pc');
assert.equal(MODELOS_ROTA_ZERO_AMEACAS.length,2);
assert.ok(MODELOS_ROTA_ZERO_AMEACAS.every(x=>x.system==='rotaZero'&&x.type==='ameaca'));

const txt=p=>readFileSync(p,'utf8');
const app=txt('src/PJLiteApp.jsx'),account=txt('src/cloud/RealCloudPanel.jsx');
const store=txt('src/cloud/supabaseCloud.js'),shield=txt('src/cloud/CampaignWorkspace.jsx');
const editor=txt('src/systems/rotaZero/components/ThreatEditor.jsx');
assert.ok(app.includes('<RotaZeroThreatEditor scope={systemEditorScope} />'),'RZ conectado ao editor');
assert.ok(app.includes('setShowRotaZeroThreatModal(true)'),'Criar RZ ameaça disponível no seletor');
assert.ok(app.includes("['fabula','somdas6','3det','ordemParanormal','skyfall','rotaZero'].includes(data.system)"),'Workspace RZ');
assert.ok(app.includes('markSheetDeleted(id)'),'Grava exclusão antes do filtro local');
assert.ok(app.includes('unmarkSheetDeleted(savingData.id)'),'Salvar explicitamente desfaz exclusão pendente');
assert.ok(editor.includes('Pressão')&&editor.includes('Fraquezas')&&editor.includes('Notas'));
assert.ok(!shield.slice(shield.indexOf('export function CampaignShield')).includes('Rodada</span>'),'Escudo sem contador duplicado');
assert.ok(!shield.slice(shield.indexOf('export function CampaignShield')).includes('🎲 Rolagem rápida'),'Escudo sem rolagem duplicada');
assert.ok(store.includes(".eq('owner_id',user.id)")&&store.includes('export async function deleteRemoteSheets'),'Deleção só do proprietário');
assert.ok(store.includes('getPendingSheetDeletions(user.id)'),'Não enviar pendentes por upload');
const pull=store.slice(store.indexOf('export async function pullSheets'),store.indexOf('export async function mirrorSheets'));
assert.ok(pull.includes(".eq('owner_id',user.id)"),'Importar da nuvem apenas fichas próprias, nunca compartilhadas de outros usuários');
assert.ok(account.includes('await flushDeletions();'),'Excluir da nuvem antes de sincronizar');
assert.ok(account.includes('readCurrentLocal()'),'Capturar as fichas locais atualizadas para evitar render obsoleto');
assert.ok(account.includes('withoutPendingDeletions(mergeById'),'Não restaurar exclusões no merge');
console.log('✓ Rota Zero ameaça, card PNG, escudo compacto e exclusões persistentes sem restauração de fichas.');
