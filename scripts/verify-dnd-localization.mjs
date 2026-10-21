import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {findAbilityPresets} from '../src/components/abilityPresetLibrary.js';
import {getDndPrintedPage} from '../src/components/dndSrdPortuguese.js';
import {buildSpeciesApplication,buildFeatApplication,featRequirementWarnings} from '../src/components/dndSpeciesFeatActions.js';

globalThis.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const items={magias:339,caracteristicas:220,especies:9,talentos:17};
for(const [kind,count] of Object.entries(items)){
 const list=findAbilityPresets('dnd5e',kind);
 const official=list.filter(x=>x.entry.fonte?.includes('SRD 5.2.1')&&!x.entry._srdId?.startsWith('outline:'));
 assert.equal(official.length,count,kind+' count');
 for(const item of official){
  const entry=item.entry;
  assert.equal(entry.idiomaDescricao,'pt',kind+' não localizado: '+entry.nome);
  assert.ok(entry.nome,'Sem nome');
  assert.ok(entry.paginaLivro,'Sem referência do livro: '+entry.nome);
  assert.ok(/p\. \d+|Cap\./.test(entry.paginaLivro),'Página incorreta: '+entry.paginaLivro);
  assert.ok(!/\bYou (?:can|gain|cast|create|make|have|know)\b/i.test(entry.desc),'Texto visível em inglês: '+entry.nome);
  assert.ok(item.name===entry.nome);
 }
}
const feats=findAbilityPresets('dnd5e','talentos').map(x=>x.entry);
const species=findAbilityPresets('dnd5e','especies').map(x=>x.entry);
const halfling=species.find(x=>x.id==='halfling');
assert.equal(halfling.paginaImpressa,195);
assert.equal(species.find(x=>x.id==='elfo').paginaImpressa,189);
const skilled=feats.find(x=>x.nomeOriginal==='Skilled');
assert.equal(skilled.paginaImpressa,201);
assert.equal(feats.find(x=>x.nomeOriginal==='Alert').paginaImpressa,200);
assert.equal(featRequirementWarnings(feats.find(x=>x.nomeOriginal==='Grappler'),{level:2,attributes:{for:10,des:10}}).length,2);
const applied=buildSpeciesApplication(halfling,'',[],{});
assert.ok(applied.features.every(x=>x.desc.includes('Livro do Jogador')));
assert.ok(applied.features.every(x=>!x.desc.includes('You ')));
const inserted=buildFeatApplication(skilled,[]);
assert.ok(inserted.features.at(-1).desc.includes('Livro do Jogador'));
assert.ok(!inserted.features.at(-1).desc.includes('You '));
const fireball=findAbilityPresets('dnd5e','magias').find(x=>x.entry.nomeOriginal==='Fireball').entry;
assert.equal(fireball.nome,'Bola de Fogo');
assert.ok(fireball.desc.includes('Referência: Livro do Jogador 2024'));
assert.ok(!fireball.desc.includes('TEXTO DO SRD (inglês)'));
const features=findAbilityPresets('dnd5e','caracteristicas');
assert.ok(features.some(x=>x.entry.nome==='Fúria'));
assert.ok(features.some(x=>x.entry.nome==='Mente Tática'));
const modal=readFileSync('src/components/DndLibraryModal.jsx','utf8');
assert.ok(modal.includes('entry.paginaLivro'));
assert.ok(!modal.includes('Nome no SRD:'));
assert.ok(!modal.includes('Descrição original do SRD em inglês'));
console.log('✓ D&D 5.5e PT-BR: 339 magias, 220 características, 9 espécies, 17 talentos e páginas verificadas.');
