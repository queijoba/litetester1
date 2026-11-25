import assert from 'node:assert/strict';
import {ITEM_LIBRARY,SYSTEM_NAMES,newItem,insertLibraryItem,updateLibraryItem,sheetItems,inventoryKey} from '../src/components/itemLibraryData.js';
for(const system of Object.keys(SYSTEM_NAMES)){
 const catalog=ITEM_LIBRARY.filter(x=>x.system===system);assert(catalog.length>=12,system);
 const data={system,type:'pc',inventario:system==='rotaZero'?['','','','']:[],ataques:[]};
 const item={...catalog[0],quantidade:2,modificacoes:[{tipo:'Maldição',nome:'Teste',efeito:'Efeito de teste'}]};
 const next=insertLibraryItem(data,item,'test-id');assert.notEqual(next,data);const list=sheetItems(next);assert.equal(list.length,1,system);assert(list[0].nome.includes(item.nome),system);
 const updated=updateLibraryItem(next,{...list[0],nome:'Alterado'},'next-id');assert(sheetItems(updated)[0].nome.includes('Alterado'));
 assert.equal(next[inventoryKey(system)].length,system==='rotaZero'?4:1);
}
assert.throws(()=>insertLibraryItem({system:'rotaZero',type:'pc',inventario:['a','b','c','d']},{...newItem('rotaZero'),nome:'x'},'id'));
assert.throws(()=>insertLibraryItem({system:'fabula',type:'pc'},{...newItem('dnd5e'),nome:'x'},'id'));
console.log('Biblioteca de itens: oito sistemas, inserção, atualização e limites.');

const rz={system:'rotaZero',type:'pc',inventario:['','','','']};const ri={...newItem('rotaZero'),nome:'Lanterna',desc:'Luz',quantidade:2,modificacoes:[{tipo:'Melhoria',nome:'Teste',efeito:'Brilha'}]};let rr=insertLibraryItem(rz,ri,'rz-1');assert.equal(sheetItems(rr)[0].nome,'Lanterna');assert.equal(sheetItems(rr)[0].modificacoes.length,1);rr=updateLibraryItem(rr,{...sheetItems(rr)[0],nome:'Lanterna nova'},'rz-2');assert.equal(sheetItems(rr)[0].nome,'Lanterna nova');assert.equal(sheetItems(rr)[0].quantidade,2);assert.equal(sheetItems(rr)[0].modificacoes.length,1);assert.equal(ITEM_LIBRARY.filter(x=>x.system==='fabula'&&x.precisao).length,7);console.log('Referências mecânicas, edição e slots Rota Zero OK:',ITEM_LIBRARY.length,'itens');
