import assert from 'node:assert/strict';
import { DND_2024_CLASSES } from '../src/systems/dnd5e/classPanels.js';
import { findAbilityPresets,DND_SRD_SPELL_COUNT,DND_SRD_FEATURE_COUNT,storeAbilityPreset } from '../src/components/abilityPresetLibrary.js';
import { getDndLibraryEntries,canUseDndEntry } from '../src/components/dndLibraryFilters.js';
import { readFileSync } from 'node:fs';

globalThis.localStorage={
 getItem:()=>null,setItem:()=>{},removeItem:()=>{}
};
const spells=findAbilityPresets('dnd5e','magias');
const features=findAbilityPresets('dnd5e','caracteristicas');
assert.equal(DND_SRD_SPELL_COUNT,339);
assert.equal(DND_SRD_FEATURE_COUNT,220);
assert.equal(spells.length,339,'Não duplicar antigos exemplos');
assert.equal(new Set(spells.map(x=>x.entry.nomeOriginal)).size,339);
assert.ok(features.length>=220);
for(const entry of spells){
 const x=entry.entry;
 assert.ok(x.nome&&x.nomeOriginal);
 assert.ok(x.desc.length>30,'Magia sem descrição '+x.nomeOriginal);
 assert.ok(x.nivel>=0&&x.nivel<=9);
 assert.ok(Array.isArray(x.classes)&&x.classes.length>0);
 assert.equal(x.idiomaDescricao,'pt');
 assert.ok(x.paginaLivro,'Magia sem referência bibliográfica: '+x.nomeOriginal);
 assert.ok(x.fonte.includes('SRD 5.2.1'));
 for(const key of ['tempo','alcance','duracao','escola','verbal','somatico','material','concentracao','ritual'])
  assert.ok(x[key]!==undefined,x.nomeOriginal+' campo ausente '+key);
}
const validClasses=new Set(DND_2024_CLASSES.map(x=>x.id));
const srdf=features.filter(({entry})=>entry._srdId&&!entry._srdId.startsWith('outline:'));
assert.equal(srdf.length,220);
const srds=new Set(srdf.filter(x=>x.entry.origem==='subclasse').map(x=>x.entry.classId));
assert.equal(srds.size,12);
for(const cfg of DND_2024_CLASSES){
 const mine=getDndLibraryEntries({tab:'classe',classId:cfg.id});
 const sub=getDndLibraryEntries({tab:'subclasse',classId:cfg.id,subclass:cfg.subclasses[0]});
 assert.ok(mine.some(x=>x.entry.classId===cfg.id),'Classe SRD sem habilidades: '+cfg.id);
 assert.ok(sub.length>0,'Subclasse sem conteúdo ou modelo: '+cfg.id);
 assert.ok(mine.every(x=>!x.entry.classId||x.entry.classId===cfg.id));
 assert.ok(sub.every(x=>!x.entry.classId||x.entry.classId===cfg.id));
}
assert.ok(spells.every(({entry})=>entry.classes.every(c=>validClasses.has(c))));

const wizard=getDndLibraryEntries({tab:'magias',classId:'mago',level:'3'});
assert.ok(wizard.some(x=>x.entry.nomeOriginal==='Fireball'));
const cleric=getDndLibraryEntries({tab:'magias',classId:'clerigo'});
assert.ok(cleric.some(x=>x.entry.nomeOriginal==='Cure Wounds'));
assert.ok(!cleric.some(x=>x.entry.nomeOriginal==='Fireball'));
const bard=getDndLibraryEntries({tab:'magias',classId:'bardo'});
assert.ok(bard.some(x=>x.entry.nomeOriginal==='Healing Word'));
const arcaneKnight=getDndLibraryEntries({tab:'magias',classId:'guerreiro',subclass:'Cavaleiro Arcano'});
assert.ok(arcaneKnight.some(x=>x.entry.nomeOriginal==='Fireball'));
const noClass=getDndLibraryEntries({tab:'magias'});
assert.equal(noClass.length,339);
const firstLevel=getDndLibraryEntries({tab:'classe',classId:'barbaro',classLevel:1,onlyAvailableLevel:true});
assert.ok(firstLevel.some(x=>x.entry.nivelMinimo===1));
assert.ok(!firstLevel.some(x=>x.entry.nivelMinimo>1));
const high=getDndLibraryEntries({tab:'classe',classId:'barbaro'});
assert.ok(high.some(x=>x.entry.nivelMinimo===20));
const college=getDndLibraryEntries({tab:'subclasse',classId:'bardo',subclass:'Colégio do Conhecimento'});
assert.ok(college.some(x=>x.entry.nomeOriginal==='Cutting Words'));
assert.ok(!college.some(x=>x.entry.subclasse==='Colégio da Dança'));
const other=getDndLibraryEntries({tab:'subclasse',classId:'bardo',subclass:'Colégio da Dança'});
assert.ok(other.some(x=>x.entry.nome.includes('Visão geral — Colégio da Dança')));
assert.ok(other.every(x=>!x.entry.fonte.includes('SRD 5.2.1')||!x.entry._srdId?.startsWith('Bard:subclasse:')));
const cross=getDndLibraryEntries({tab:'classe',classId:'mago',query:'Bárbaro',allClasses:true});
assert.ok(cross.some(x=>x.entry.classId==='barbaro'));
assert.equal(canUseDndEntry({classId:'barbaro'},'classe','mago',''),false);

const modal=readFileSync('src/components/DndLibraryModal.jsx','utf8');
assert.ok(modal.includes('Magias da minha classe'));
assert.ok(modal.includes('Todas as magias SRD'));
assert.ok(modal.includes('onlyAvailableLevel'));
assert.ok(modal.includes('Disponível no nível'));
assert.ok(!modal.includes('Descrição original do SRD em inglês'));
assert.ok(modal.includes('entry.paginaLivro'));
assert.ok(!modal.includes('Nome no SRD:'));
const app=readFileSync('src/PJLiteApp.jsx','utf8');
assert.ok(app.includes('classLevel={Number(data.bio?.nivel || 1)}'));
console.log('✓ D&D SRD: 339 magias, 220 habilidades, 12 classes/subclasses, filtros de nível/classe e créditos verificados.');
