import assert from 'node:assert/strict';
import {SYSTEMS,itemCatalog,addItemToSheet} from '../src/components/equipmentCatalog.js';
import {wikiAbilities} from '../src/components/wikiAbilities.js';
for(const system of Object.keys(SYSTEMS)){
 const items=itemCatalog(system);assert(items.length>=12,system);
 const abilities=wikiAbilities(system);assert(abilities.length>0,system+' wiki vazia');
 const start={type:'pc',system,inventario:system==='dragonbane'?'Antigo':system==='rotaZero'?['Antigo','','','']:[],equipamentos:[],armas:[],ataques:[],itensSincronizados:[]};
 const original=JSON.stringify(start);const item={...items[0],quantidade:1,modificacoes:[{tipo:'Maldição',nome:'Eco',efeito:'Descrição de teste'}]};
 const res=addItemToSheet(start,item);assert(res.ok,system);assert.equal(JSON.stringify(start),original);assert(JSON.stringify(res.data).includes('Eco'),system+' perdeu modificação');assert(!addItemToSheet({...start,type:'ameaca'},item).ok,system);
 console.log(system+': '+items.length+' itens, '+abilities.length+' entradas wiki');
}
const db=addItemToSheet({type:'pc',system:'dragonbane',armas:[]},{...itemCatalog('dragonbane')[0],quantidade:2});assert.equal(db.data.armas.length,2);
const dnd=addItemToSheet({type:'pc',system:'dnd5e',ataques:[],itensSincronizados:[]},itemCatalog('dnd5e')[0]);assert.equal(dnd.data.ataques[0].sourceItemId,dnd.data.itensSincronizados[0].syncId);
const full={type:'pc',system:'rotaZero',inventario:['a','b','c','d']};assert(!addItemToSheet(full,itemCatalog('rotaZero')[0]).ok);assert.deepEqual(full.inventario,['a','b','c','d']);
const fu={type:'pc',system:'fabula',equipamentos:[{slot:'Mão dominante',nome:''}],inventario:[]};const gear={...itemCatalog('fabula')[0],equipar:'Mão dominante'};
assert.equal(addItemToSheet(fu,gear).data.equipamentos[0].nome,gear.nome);assert(!addItemToSheet({...fu,equipamentos:[{slot:'Mão dominante',nome:'Existente'}]},gear).ok);
console.log('Biblioteca, Wiki, oito adaptadores, modificações, slots e vínculo D&D: OK');

import {modificationCatalog,modificationFromPreset,MODIFICATION_TYPES} from '../src/components/modificationCatalog.js';
for(const system of Object.keys(SYSTEMS)){const mods=modificationCatalog(system);assert(mods.length>=10);assert.equal(new Set(mods.map(m=>m.id)).size,mods.length);assert(mods.every(m=>m.system===system&&m.nome&&m.desc&&m.fonte));assert(mods.every(m=>MODIFICATION_TYPES.includes(m.categoria)));assert(['Melhoria','Maldição','Propriedade'].every(t=>mods.some(m=>m.categoria===t)));const mod=modificationFromPreset(mods[0]);assert.equal(mod.tipo,mods[0].categoria);assert(mod.efeito.includes(mods[0].fonte));const item={...itemCatalog(system)[0],modificacoes:[mod]};const result=addItemToSheet({type:'pc',system,inventario:system==='rotaZero'?['','','','']:system==='dragonbane'?'':[],equipamentos:[],armas:[],ataques:[],itensSincronizados:[]},item);assert(result.ok&&JSON.stringify(result.data).includes(mod.nome));console.log(system+': '+mods.length+' modelos de modificação');}
assert.equal(modificationCatalog('desconhecido').length,0);assert.equal(modificationFromPreset(null),null);console.log('Wiki de modificações e aplicação em itens: OK');
