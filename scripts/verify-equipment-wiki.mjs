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
