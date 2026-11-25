import assert from 'node:assert/strict';
import {SRD521_MONSTERS,SRD521_MONSTER_GROUPS} from '../src/systems/dnd5e/srd521-monsters.js';
import {FABULA_LITE_EXAMPLES} from '../src/systems/fabulaUltima/liteThreatExamples.js';
import {MODELOS_SKYFALL_AMEACAS} from '../src/systems/skyfall/threatModels.js';
assert.equal(SRD521_MONSTERS.length,330);assert.equal(new Set(SRD521_MONSTERS.map(x=>x.nomeOriginal)).size,330);assert.equal(SRD521_MONSTER_GROUPS.flatMap(x=>x.items).length,330);for(const m of SRD521_MONSTERS){assert.ok(m.ca&&m.pv&&m.fonte&&m.desafio);assert.ok(Object.values(m.atributos).every(Number.isFinite));assert.ok(Array.isArray(m.acoes));}assert.equal(FABULA_LITE_EXAMPLES.length,8);assert.equal(MODELOS_SKYFALL_AMEACAS.filter(m=>m.fonte==='PJLite • exemplo original').length,6);console.log('✓ 330 entradas D&D SRD + modelos originais Fábula/Skyfall validados');

import {BOOK_THREAT_REFERENCES} from '../src/components/bookThreatReferences.js';
import {readFileSync} from 'node:fs';
for(const [key,count] of Object.entries({dnd5e:434,fabula:56,skyfall:44})){const e=BOOK_THREAT_REFERENCES[key].entries;assert.equal(e.length,count);assert.equal(new Set(e.map(x=>x.name.toLowerCase()+'|'+x.page)).size,count);assert.ok(e.every(x=>x.name&&Number.isInteger(x.page)&&x.page>0));}
const app119=readFileSync('src/PJLiteApp.jsx','utf8');assert.ok(app119.indexOf('Bestiário aberto • SRD 5.2.1')>app119.indexOf('Stat Block D&D 5.5e (Em Branco)'));assert.ok(readFileSync('src/components/ThreatCatalog.jsx','utf8').includes('<BookThreatReference system={system}/>'));

import {parsePrivatePack,mergePrivateThreats} from '../src/components/privateThreatPack.js';
const fake={system:'dnd5e',type:'ameaca',nome:'Teste original',ca:'12',pv:'9',desafio:'1',atributos:{for:10,des:10,con:10,int:10,sab:10,car:10},acoes:[{nome:'Golpe',desc:'1d6'}]};
const p119=parsePrivatePack(JSON.stringify([fake]),'dnd5e');assert.equal(p119.items[0].acoes[0].desc,'1d6');assert.equal(mergePrivateThreats(p119.items,p119.items).length,1);assert.throws(()=>parsePrivatePack(JSON.stringify([fake]),'fabula'));assert.throws(()=>parsePrivatePack(JSON.stringify([{...fake,atributos:{}}]),'dnd5e'));

import {BOOK_THREAT_MODELS} from '../src/components/bookThreatModels.js';
for(const [system,count] of Object.entries({dnd5e:332,fabula:56,skyfall:44})){const ms=BOOK_THREAT_MODELS[system];assert.equal(ms.length,count);assert.ok(ms.every(x=>x.system===system&&x.nome&&x.pagina&&x.dadosParciais&&Object.values(x.atributos).length===(system==='fabula'?4:6)));assert.equal(new Set(ms.map(x=>x.nome)).size,count);assert.equal(parsePrivatePack(JSON.stringify(ms),system).items.length,count);}

const dndCatalog119=readFileSync('src/components/ThreatCatalog.jsx','utf8');
assert.ok(dndCatalog119.includes('React.useId()')&&dndCatalog119.includes('visibleGroups.map')&&dndCatalog119.includes('setVisibleCount(n=>n+48)'));
const dndEditor119=readFileSync('src/systems/dnd5e/components/ThreatEditor.jsx','utf8');
assert.ok(dndEditor119.includes("updateField('iniciativa'")&&dndEditor119.includes('data.dadosParciais')&&dndEditor119.includes('lg:overflow-y-auto'));
