import assert from 'node:assert/strict';
import { findAbilityPresets,storeAbilityPreset,removeAbilityPreset } from '../src/components/abilityPresetLibrary.js';
import { readFileSync } from 'node:fs';

const map=new Map();
globalThis.localStorage={
 getItem:key=>map.has(key)?map.get(key):null,
 setItem:(key,value)=>map.set(key,String(value)),
 removeItem:key=>map.delete(key)
};

assert.ok(findAbilityPresets('ordemParanormal','habilidades').some(x=>x.source==='example'));
assert.ok(findAbilityPresets('ordemParanormal','rituais').some(x=>x.source==='example'));
assert.ok(findAbilityPresets('skyfall','magias').some(x=>x.source==='example'));
assert.equal(findAbilityPresets('ordemParanormal','magias').length,0);

const data={nome:'Caminho da Aurora',tipo:'Poder',custo:'3 PE',desc:'Efeito de teste autoral'};
const saved=storeAbilityPreset('ordemParanormal','habilidades',data);
assert.equal(saved.ok,true);
data.desc='Mutação não persistida';
const own=findAbilityPresets('ordemParanormal','habilidades').find(x=>x.name==='Caminho da Aurora');
assert.equal(own.entry.desc,'Efeito de teste autoral','O modelo deve armazenar uma cópia');
assert.ok(!findAbilityPresets('skyfall','habilidades').some(x=>x.name==='Caminho da Aurora'),'Não misturar sistemas');
assert.ok(!findAbilityPresets('ordemParanormal','rituais').some(x=>x.name==='Caminho da Aurora'),'Não misturar tipos');

const updated=storeAbilityPreset('ordemParanormal','habilidades',{nome:'caminho da aurora',tipo:'Poder',custo:'5 PE',desc:'Revisado'});
assert.equal(updated.updated,true,'Mesmo nome atualizado, sem duplicação');
assert.equal(findAbilityPresets('ordemParanormal','habilidades').filter(x=>x.source==='personal').length,1);
assert.equal(removeAbilityPreset(own.id),true);
assert.equal(findAbilityPresets('ordemParanormal','habilidades').filter(x=>x.source==='personal').length,0);
assert.equal(storeAbilityPreset('skyfall','magias',{nome:'',desc:'Nada'}).reason,'name');

const ordem=readFileSync('src/systems/ordemParanormal/components/CharacterEditor.jsx','utf8');
const skyfall=readFileSync('src/systems/skyfall/components/CharacterEditor.jsx','utf8');
const picker=readFileSync('src/components/AbilityPresetPicker.jsx','utf8');
const ordemModal=readFileSync('src/systems/ordemParanormal/OrdemLibraryModal.jsx','utf8');
const app=readFileSync('src/PJLiteApp.jsx','utf8');
assert.ok(app.includes('<OrdemLibraryModal'),'Ordem usa a biblioteca na barra principal');
assert.ok(ordemModal.includes("['habilidades','Poderes']")&&ordemModal.includes("['rituais','Rituais']"),'Ordem oferece poderes e rituais');
assert.ok(ordem.includes('storeAbilityPreset'),'Ordem permite salvar modelos próprios');
assert.ok(!ordem.includes("setPresetKind('"),'Ordem não deve render botões de biblioteca dentro da ficha');
assert.ok(skyfall.includes('AbilityPresetPicker'),'Skyfall deve montar o seletor');
assert.ok(skyfall.includes('storeAbilityPreset'),'Skyfall deve salvar modelos');
for(const kind of ['habilidades','magias'])assert.ok(skyfall.includes("setPresetKind('"+kind+"')"),'Skyfall abre '+kind);
assert.ok(picker.includes('createPortal'),'Modal deve ficar acima da ficha');
assert.ok(picker.includes('role="dialog"'),'Modal deve ser acessível');
assert.ok(picker.includes('aria-modal="true"'));
console.log('✓ Modelos prontos: salvar, atualizar, remover, isolar sistemas e integrar editores.');
