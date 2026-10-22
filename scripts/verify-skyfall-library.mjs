import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SKYFALL_LIBRARY_CATALOG as catalog,SKYFALL_LIBRARY_COUNTS as counts} from '../src/systems/skyfall/libraryCatalog.js';
import {applySkyfallLibrarySelection,skyfallLibraryWarnings} from '../src/systems/skyfall/libraryActions.js';
import {initialSkyfallPcData,normalizeSkyfallPcData,SKYFALL_MAGIC_LAYERS} from '../src/systems/skyfall/data.js';

assert.equal(catalog.length,161);
assert.equal(counts.legado,11);
assert.equal(counts.maldicao,4);
assert.equal(counts.antecedente,20);
assert.equal(counts.classe,3);
assert.equal(counts.trilha,18);
assert.equal(counts.habilidade,15);
assert.equal(counts.magia,90);
assert.deepEqual(new Set(catalog.filter(x=>x.tipo==='magia').map(x=>x.camada)),new Set(SKYFALL_MAGIC_LAYERS));
for(const e of catalog){
 assert.ok(e.id&&e.nome&&e.fonte&&e.pagina&&e.desc,'Referência incompleta: '+e.nome);
 assert.ok(!/playtest|ordem paranormal|fabula/i.test(e.fonte),'Fonte misturada');
}
assert.equal(new Set(catalog.map(x=>x.id)).size,catalog.length);
assert.ok(catalog.some(x=>x.nome==='Mestre das Armas'&&x.pagina==='189'));
assert.ok(catalog.some(x=>x.nome==='Bola de Fogo'&&x.camada==='Rasa'));
assert.ok(catalog.some(x=>x.nome==='Mãos Mágicas'&&x.camada==='Truque'));
assert.ok(catalog.some(x=>x.nome==='Alquimista'&&x.tipo==='trilha'));
assert.ok(catalog.some(x=>x.nome==='Cosmopolita'&&x.tipo==='antecedente'));

const original=structuredClone(initialSkyfallPcData);
original.bio.nome='Personagem preservado';original.bio.legado='Humani';original.bio.antecedente='Agouro';
original.bio.classe='Especialista';original.bio.trilha='Protetor dos Ermos';
original.habilidades=[{nome:'Habilidade pessoal',origem:'Minha mesa',desc:'Texto autoral'}];
original.magias=[{nome:'Magia de casa',camada:'Superficial',desc:'Efeito escrito manualmente'}];
const unchanged=structuredClone(original);
const draco=catalog.find(x=>x.nome==='Draco'&&x.tipo==='legado');
let r=applySkyfallLibrarySelection(original,draco,'legado');
assert.ok(r.changed);
assert.equal(r.data.bio.legado,'Draco');
assert.equal(r.data.bio.trilha,'Protetor dos Ermos','Manter trilha de quem já estava editando');
assert.equal(r.data.habilidades[0].desc,'Texto autoral');
assert.deepEqual(original,unchanged,'Não alterar objeto original');
assert.equal(applySkyfallLibrarySelection(r.data,draco,'legado').changed,false);

const trail=catalog.find(x=>x.nome==='Elementalista'&&x.tipo==='trilha');
r=applySkyfallLibrarySelection(r.data,trail,'trilha');
assert.equal(r.data.bio.trilha,'Elementalista');
assert.equal(r.data.bio.classe,'Especialista','Não aplicar classe automaticamente');
const ball=catalog.find(x=>x.nome==='Bola de Fogo'&&x.tipo==='magia');
r=applySkyfallLibrarySelection(r.data,ball,'magia');
assert.equal(r.data.magias.at(-1).camada,'Rasa');
assert.equal(r.data.magias.at(-1).nome,'Bola de Fogo');
assert.equal(r.data.magias[0].desc,'Efeito escrito manualmente');
assert.equal(applySkyfallLibrarySelection(r.data,ball,'magia').changed,false);
const citizen=catalog.find(x=>x.nome==='Popularidade');
assert.ok(skyfallLibraryWarnings(citizen,'habilidade',{antecedente:'Agouro'}).length>0);
const applied=applySkyfallLibrarySelection(r.data,citizen,'habilidade');
assert.ok(applied.data.habilidades.some(x=>x.nome==='Popularidade'));
assert.equal(applied.data.habilidades.find(x=>x.nome==='Popularidade').categoria,'Antecedente');
assert.ok(applied.data.habilidades.some(x=>x.nome==='Habilidade pessoal'));
assert.equal(normalizeSkyfallPcData(applied.data).habilidades.find(x=>x.nome==='Popularidade').pagina,citizen.pagina);
assert.equal(applySkyfallLibrarySelection(applied.data,citizen,'habilidade').changed,false);
assert.throws(()=>applySkyfallLibrarySelection(original,{},'magia'));

const app=readFileSync('src/PJLiteApp.jsx','utf8');
const modal=readFileSync('src/systems/skyfall/SkyfallLibraryModal.jsx','utf8');
const sheet=readFileSync('src/systems/skyfall/components/CharacterEditor.jsx','utf8');
const theme=readFileSync('src/systems/skyfall/skyfall-library.css','utf8');
for(const label of ['Legados','Maldições','Antecedentes','Classes','Trilhas','Habilidades','Magias'])
 assert.ok(modal.includes("'"+label+"'"),'Aba Skyfall faltando: '+label);
assert.ok(modal.includes('Filtrar camada')&&modal.includes('Filtrar tipo de magia'));
assert.ok(modal.includes('createPortal')&&modal.includes('aria-modal="true"'));
assert.ok(modal.includes('skyfall-lib-body--has-selection'));
assert.ok(theme.includes('#3b234d')&&theme.includes('#b9914d'),'Identidade visual Skyfall');
assert.ok(theme.includes('@media(max-width:720px)'),'Visão mobile');
assert.ok(app.includes('<SkyfallLibraryModal')&&app.includes('applySkyfallLibrarySelection'));
assert.ok(app.includes('setSkyfallLibraryOpen(true)'));
assert.ok(!sheet.includes('AbilityPresetPicker')&&!sheet.includes('📚 Biblioteca</button>'));
assert.ok(sheet.includes('storeAbilityPreset'),'Salvar modelo manual continua disponível');
const abilityGenerator=readFileSync('scripts/refine-skyfall-ability-categories.mjs','utf8');
const spellGenerator=readFileSync('scripts/refine-skyfall-spells-order.mjs','utf8');
assert.ok(abilityGenerator.includes("savePreset('habilidades',x)"),'Habilidades geradas mantêm salvar modelo');
assert.ok(spellGenerator.includes("savePreset('magias',m)"),'Magias geradas mantêm salvar modelo');

console.log('✓ Skyfall: 161 referências, camadas, categorias, restauração não destrutiva, biblioteca na barra e responsividade.');
