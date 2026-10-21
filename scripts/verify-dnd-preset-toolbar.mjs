import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { findAbilityPresets, storeAbilityPreset } from '../src/components/abilityPresetLibrary.js';
import { getDndLibraryEntries, canUseDndEntry } from '../src/components/dndLibraryFilters.js';

const memory=new Map();
globalThis.localStorage={
 getItem:key=>memory.get(key)??null,
 setItem:(key,value)=>memory.set(key,String(value)),
 removeItem:key=>memory.delete(key)
};

const spells=findAbilityPresets('dnd5e','magias');
const find=name=>spells.find(x=>x.name===name);
for(const name of ['Mãos Mágicas','Curar Ferimentos','Bola de Fogo']){
 const spell=find(name);
 assert.ok(spell,'Magia ausente: '+name);
 assert.equal(spell.entry?.fonte?.includes('SRD'),true,'Attribution missing: '+name);
 assert.equal(typeof spell.entry.desc,'string');
 assert.ok(spell.entry.desc.length>65,'Descrição curta insuficiente: '+name);
 for(const field of ['nome','nivel','escola','tempo','alcance','duracao','alvo','verbal','somatico','material','concentracao','ritual','preparada','salvaguarda','dano','desc'])
  assert.ok(Object.hasOwn(spell.entry,field),name+' sem campo '+field);
}
assert.equal(find('Mãos Mágicas').entry.nivel,0);
assert.equal(find('Curar Ferimentos').entry.nivel,1);
assert.equal(find('Bola de Fogo').entry.nivel,3);
assert.equal(find('Curar Ferimentos').entry.dano,'Cura 2d8 + modificador de conjuração');
assert.equal(find('Bola de Fogo').entry.dano,'8d6 fogo');
assert.equal(find('Bola de Fogo').entry.salvaguarda,'Destreza (metade do dano)');
assert.equal(find('Bola de Fogo').entry.concentracao,false);

const features=findAbilityPresets('dnd5e','caracteristicas');
assert.ok(features.length>=2);
assert.equal(findAbilityPresets('ordemParanormal','caracteristicas').length,0);
const saved=storeAbilityPreset('dnd5e','magias',{nome:'Magia de Teste',nivel:5,desc:'Modelo próprio'});
assert.equal(saved.ok,true);
assert.ok(findAbilityPresets('dnd5e','magias').some(x=>x.name==='Magia de Teste'));
assert.ok(!findAbilityPresets('skyfall','magias').some(x=>x.name==='Magia de Teste'));


const fighter=getDndLibraryEntries({tab:'classe',classId:'guerreiro',subclass:'Mestre de Batalha'});
assert.ok(fighter.some(item=>item.entry.classId==='guerreiro'));
assert.ok(!fighter.some(item=>item.entry.classId==='bardo'));
const bardo=getDndLibraryEntries({tab:'classe',classId:'bardo',subclass:'Colégio do Conhecimento'});
assert.ok(bardo.some(item=>item.entry.classId==='bardo'));
assert.ok(!bardo.some(item=>item.entry.classId==='guerreiro'));
const college=getDndLibraryEntries({tab:'subclasse',classId:'bardo',subclass:'Colégio do Conhecimento'});
assert.ok(college.some(item=>item.entry.subclasse==='Colégio do Conhecimento'));
assert.ok(!college.some(item=>item.entry.subclasse==='Colégio da Bravura'));
assert.ok(!college.some(item=>item.entry.classId==='mago'));
const spellCircle=getDndLibraryEntries({tab:'magias',level:'3'});
assert.ok(spellCircle.some(item=>item.name==='Bola de Fogo'));
assert.ok(!spellCircle.some(item=>item.name==='Mãos Mágicas'));
const named=getDndLibraryEntries({tab:'classe',classId:'mago',query:'mago'});
assert.ok(named.length>0,'A pesquisa também deve localizar a classe');
const cross=getDndLibraryEntries({tab:'classe',allClasses:true,query:'Guerreiro'});
assert.ok(cross.some(item=>item.entry.classId==='guerreiro'),'Pesquisar classes além da atual');
assert.equal(canUseDndEntry({classId:'guerreiro'},'classe','bardo',''),false);
assert.equal(canUseDndEntry({classId:'bardo'},'classe','bardo',''),true);
assert.equal(canUseDndEntry({classId:'bardo',subclasse:'Colégio da Bravura'},'subclasse','bardo','Colégio do Conhecimento'),false);
assert.equal(canUseDndEntry({classId:'bardo',subclasse:'Colégio do Conhecimento'},'subclasse','bardo','Colégio do Conhecimento'),true);

const editor=readFileSync('src/systems/dnd5e/components/CharacterEditor.jsx','utf8');
const app=readFileSync('src/PJLiteApp.jsx','utf8');
const picker=readFileSync('src/components/DndLibraryModal.jsx','utf8');
const css=readFileSync('src/components/dndLibraryModal.css','utf8');
const script=readFileSync('scripts/attach-ability-presets.mjs','utf8');

for(const token of [
 'import DndLibraryModal',
 'onChoose={addFromDndLibrary}',
 "setDndLibraryTab(mobileTab === 'magias' ? 'magias' : 'classe')",
 'className="pjlite-toolbar-library"',
 'aria-label="Biblioteca de habilidades e magias"',
 'updateField(\'magias.lista\'',
 'updateField(\'caracteristicas\'',
])assert.ok(app.includes(token),'Barra principal D&D sem '+token);
assert.ok(!editor.includes('AbilityPresetPicker'),'Não exibir biblioteca dentro da ficha');
assert.ok(!editor.includes('📚'),'Sem botão de biblioteca dentro dos cartões D&D');
assert.ok(editor.includes('saveSpellModel')&&editor.includes('saveFeatureModel'),'Salvamento de modelos mantido');
assert.ok(picker.includes("['classe','Classe']")&&picker.includes("['subclasse','Subclasse']")&&picker.includes("['magias','Magias']"));
assert.ok(picker.includes('aria-expanded={expanded}')&&picker.includes('pjlite-dnd-library-plus'));
assert.ok(picker.includes('Buscar nome, classe, subclasse ou efeito'));
assert.ok(css.includes('height:min(75dvh'));
assert.ok(script.includes('>📚</button>')&&!script.includes('>📚 Biblioteca</button>'));

console.log('✓ D&D 5.5e: toolbar externa, filtros por classe/subclasse e magias, pesquisa e prevenção de mistura validados.');
