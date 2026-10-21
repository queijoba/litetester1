import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { findAbilityPresets, storeAbilityPreset } from '../src/components/abilityPresetLibrary.js';

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

const editor=readFileSync('src/systems/dnd5e/components/CharacterEditor.jsx','utf8');
const css=readFileSync('src/components/abilityPresetPicker.css','utf8');
const picker=readFileSync('src/components/AbilityPresetPicker.jsx','utf8');
const script=readFileSync('scripts/attach-ability-presets.mjs','utf8');
for(const token of [
 'import AbilityPresetPicker',
 'onChoose={insertSpellModel}',
 'onChoose={insertFeatureModel}',
 'kind="magias"',
 'kind="caracteristicas"',
 'className="dnd-v6-preset-toolbar-actions"',
 'className="dnd-v6-preset-header-actions"',
 "addToArray('caracteristicas'",
 'classId:selectedClass.id',
 "updateField('magias.lista'",
 "const [pickerOpen, setPickerOpen] = useState(false)",
 'aria-label="Biblioteca de magias"',
 'aria-label="Biblioteca de habilidades da classe"',
 'aria-label="Biblioteca de habilidades da subclasse"',
 'aria-label="Salvar magia como modelo"',
 'aria-label="Salvar habilidade como modelo"',
])assert.ok(editor.includes(token),'Integração D&D ausente: '+token);
assert.ok(css.includes('width:30px!important'));
assert.ok(picker.includes('D&D SRD 5.2.1'));
assert.ok(script.includes('>📚</button>') && !script.includes('>📚 Biblioteca</button>'));
assert.ok(!editor.includes('>📚 Biblioteca</button>'));
console.log('✓ D&D 5.5e: magias SRD, campos, biblioteca na barra, ícones compactos, modelos locais e créditos validados.');
