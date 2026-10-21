import assert from 'node:assert/strict';
import {DND_2024_CLASSES} from '../src/systems/dnd5e/classPanels.js';
import {findAbilityPresets,DND_PHB2024_EXTRA_SUBCLASSES_COUNT,DND_PHB2024_CLASS_OPTIONS_COUNT} from '../src/components/abilityPresetLibrary.js';
import {getDndLibraryEntries} from '../src/components/dndLibraryFilters.js';
globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
assert.equal(DND_PHB2024_EXTRA_SUBCLASSES_COUNT,36);
assert.equal(DND_PHB2024_CLASS_OPTIONS_COUNT,38);
const all=findAbilityPresets('dnd5e','caracteristicas');
const extra=all.filter(x=>x.entry.catalogId?.startsWith('phb2024:'));
assert.equal(extra.length,74);
const profiles=extra.filter(x=>x.entry.origem==='subclasse');
assert.equal(profiles.length,36);
assert.equal(new Set(profiles.map(x=>x.entry.classId+'::'+x.entry.subclasse)).size,36);
for(const item of profiles) {
 assert.ok(item.entry.desc.length>80);
 assert.match(item.entry.paginaLivro,/^p\. \d+$/);
 assert.ok(item.entry.fonte.includes('Livro do Jogador'));
 const selected=getDndLibraryEntries({tab:'subclasse',classId:item.entry.classId,subclass:item.entry.subclasse});
 assert.ok(selected.some(x=>x.entry.catalogId===item.entry.catalogId));
}
const inv=getDndLibraryEntries({tab:'classe',classId:'bruxo',query:'Pacto da Lâmina'});
assert.ok(inv.some(x=>x.entry.categoria==='Invocações Místicas'));
const meta=getDndLibraryEntries({tab:'classe',classId:'feiticeiro',query:'Magia Sutil'});
assert.ok(meta.some(x=>x.entry.categoria==='Metamagia'));
assert.ok(!getDndLibraryEntries({tab:'classe',classId:'guerreiro'}).some(x=>x.entry.categoria==='Metamagia'));
for(const c of DND_2024_CLASSES) {
 for(const sub of c.subclasses) {
  const entries=getDndLibraryEntries({tab:'subclasse',classId:c.id,subclass:sub});
  assert.ok(entries.length>0,'Subclasse não pesquisável: '+c.label+' / '+sub);
 }
}
console.log('✓ D&D: 36 perfis de subclasses com páginas, 28 invocações, 10 metamagias e filtros de classe.');
