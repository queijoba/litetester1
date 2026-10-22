import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORDEM_LIBRARY_CATALOG,ORDEM_LIBRARY_COUNTS} from '../src/systems/ordemParanormal/libraryCatalog.js';
import {normalizeOrdemPcData,initialOrdemPcData} from '../src/systems/ordemParanormal/data.js';
import {applyOrdemLibrarySelection,getOrdemLibraryWarnings} from '../src/systems/ordemParanormal/libraryActions.js';
import {findAbilityPresets} from '../src/components/abilityPresetLibrary.js';

globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
const entries=ORDEM_LIBRARY_CATALOG;
const basic=entries.filter(x=>x.tipo==='ritual'&&x.fonte==='Livro Básico v1.3');
const sah=entries.filter(x=>x.tipo==='ritual'&&x.fonte==='Sobrevivendo ao Horror');
assert.equal(basic.length,82);
assert.equal(sah.length,16);
assert.equal(ORDEM_LIBRARY_COUNTS.ritual,103);
assert.equal(ORDEM_LIBRARY_COUNTS.origem,41);
assert.equal(ORDEM_LIBRARY_COUNTS.trilha,25);
assert.equal(entries.length,253);
for(const rit of [...basic,...sah]){
 assert.ok(rit.nome&&rit.desc.length>=45);
 assert.ok(rit.circulo>=1&&rit.circulo<=4,rit.nome+' círculo não reconhecido');
 assert.ok(rit.elemento&&rit.pagina&&rit.fonte);
 assert.ok(!/playtest|alpha|ordem 2/i.test([rit.nome,rit.fonte,rit.desc].join(' ')));
}
assert.equal(new Set(basic.map(x=>x.nome)).size,82);
assert.equal(new Set(sah.map(x=>x.nome)).size,16);
assert.ok(basic.some(x=>x.nome==='Amaldiçoar Arma'&&x.circulo===1));
assert.ok(basic.some(x=>x.nome==='Inexistir'&&x.circulo===4));
assert.ok(sah.some(x=>x.nome==='Martírio de Sangue'&&x.circulo===4));
assert.ok(entries.some(x=>x.fonte==='Arquivos Secretos #04'&&x.nome==='Granadeiro Blaster'));
assert.ok(entries.some(x=>x.fonte==='Arquivos Secretos #04'&&x.nome==='Foco Gravitacional'));
for(const [fonte,nome] of [
 ['Arquivos Secretos #01','Maledictólogo'],
 ['Arquivos Secretos #03','Combatente Performático'],
 ['Arquivos Secretos #05','Criptologista do Oculto'],
 ['Arquivos Secretos #06','Monstruoso'],
 ['Arquivos Secretos #09','Incursor'],
 ['Arquivos Secretos #09','Piloto de Drone']
]) assert.ok(entries.some(x=>x.fonte===fonte&&x.nome===nome&&x.tipo==='trilha'),fonte+': '+nome);
assert.ok(entries.some(x=>x.fonte==='Arquivos Secretos #01'&&x.nome==='Passagem de Conhecimento'&&x.circulo===2));
assert.ok(entries.some(x=>x.fonte==='Arquivos Secretos #06'&&x.nome==='Hesitação Forçada'&&x.circulo===1&&x.elemento==='Conhecimento'));
assert.ok(entries.some(x=>x.fonte==='Arquivos Secretos #05'&&x.nome==='Ácido Corrosivo'&&x.tipo==='poderParanormal'));
const ids=new Set();for(const x of entries){assert.ok(!ids.has(x.id),'ID duplicado '+x.id);ids.add(x.id);}

assert.ok(entries.every(x=>!/playtest|ordem 2|alpha/i.test([x.nome,x.fonte,x.desc].join(' '))));
const category={origem:'origens',trilha:'trilhas',habilidade:'habilidades',poderParanormal:'poderesParanormais',ritual:'rituais'};
for(const [kind,tab] of Object.entries(category))
 assert.ok(findAbilityPresets('ordemParanormal',tab).length>=ORDEM_LIBRARY_COUNTS[kind]);

let state=normalizeOrdemPcData({...structuredClone(initialOrdemPcData),bio:{...structuredClone(initialOrdemPcData.bio),nome:'Agente antigo',classe:'Ocultista',nex:50},habilidades:[{nome:'Meu poder',tipo:'Poder',desc:'Texto personalizado'}]});
const ac=entries.find(x=>x.tipo==='origem'&&x.nome==='Acadêmico');
const newOrigin=entries.find(x=>x.tipo==='origem'&&x.nome==='Caçador de Recompensas');
assert.ok(ac&&newOrigin);
const originalCrime=state.pericias.crime.grau;
let r=applyOrdemLibrarySelection(state,ac,'origens');
assert.ok(r.changed);
assert.equal(state.pericias.ciencias.grau,0,'não mutar a ficha de entrada');
assert.equal(r.data.pericias.ciencias.grau,5);
assert.equal(r.data.pericias.investigacao.grau,5);
assert.ok(r.data.habilidades.some(x=>x.nome==='Meu poder'));
r.data.pericias.investigacao.grau=10;
let rr=applyOrdemLibrarySelection(r.data,newOrigin,'origens');
assert.equal(rr.data.bio.origem,'Caçador de Recompensas');
assert.equal(rr.data.pericias.ciencias.grau,0,'desfazer apenas treino automático anterior');
assert.equal(rr.data.pericias.investigacao.grau,10,'não apagar melhoria manual');
assert.equal(rr.data.pericias.crime.grau,5);
assert.equal(state.pericias.crime.grau,originalCrime);
let re=applyOrdemLibrarySelection(rr.data,newOrigin,'origens');
assert.equal(re.data.habilidades.filter(x=>x.tipo==='Origem'&&x.bibliotecaOrigem==='pj-op-official-index').length,1);
const trail=entries.find(x=>x.nome==='Granadeiro Blaster');
assert.ok(getOrdemLibraryWarnings(trail,'trilhas',{classe:'Combatente',nex:5}).length>=2);
const tr=applyOrdemLibrarySelection(rr.data,trail,'trilhas');
const droneTrail=entries.find(x=>x.nome==='Piloto de Drone');
const hasDrone=applyOrdemLibrarySelection(rr.data,droneTrail,'trilhas');
assert.deepEqual(hasDrone.data.habilidades.find(x=>x.tipo==='Trilha').progressao.map(x=>x.nex),[10,40,65,99]);
assert.equal(tr.data.bio.trilha,'Granadeiro Blaster');
assert.equal(tr.data.habilidades.filter(x=>x.tipo==='Trilha').length,1);
const ritual=basic.find(x=>x.nome==='Amaldiçoar Arma');
const spell=applyOrdemLibrarySelection(tr.data,ritual,'rituais');
assert.ok(spell.changed);
assert.equal(spell.data.rituais.at(-1).circulo,1);
assert.equal(spell.data.rituais.at(-1).elemento,'Variável');
assert.equal(spell.data.rituais.at(-1).elementosPossiveis.length,4);
assert.equal(applyOrdemLibrarySelection(spell.data,ritual,'rituais').changed,false);
const hidden=getOrdemLibraryWarnings(basic.find(x=>x.nome==='Inexistir'),'rituais',{classe:'Combatente',nex:5});
assert.ok(hidden.length>=2);

const app=readFileSync('src/PJLiteApp.jsx','utf8');
const editor=readFileSync('src/systems/ordemParanormal/components/CharacterEditor.jsx','utf8');
const modal=readFileSync('src/systems/ordemParanormal/OrdemLibraryModal.jsx','utf8');
const css=readFileSync('src/systems/ordemParanormal/ordem-theme.css','utf8');
assert.ok(app.includes('applyOrdemLibrarySelection'));
assert.ok(editor.includes('ordem-paper-sheet')&&editor.includes('ordem-view-toggle'));
assert.ok(css.includes('.ordem-sheet.ordem-paper-sheet'));
assert.ok(modal.includes('Filtrar círculo')&&modal.includes('Filtrar elemento')&&modal.includes('getOrdemLibraryWarnings'));
console.log('✓ Ordem completa: 82 rituais básicos, 16 SaH, 19 AS04, filtros, NEX, origens reversíveis, sem playtest.');
