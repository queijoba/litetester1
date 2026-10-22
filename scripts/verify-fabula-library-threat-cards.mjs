import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FABULA_LIBRARY_CATALOG as entries,FABULA_LIBRARY_COUNTS as counts} from '../src/systems/fabulaUltima/libraryCatalog.js';
import {applyFabulaLibrarySelection} from '../src/systems/fabulaUltima/libraryActions.js';
import {buildThreatCardData} from '../src/components/threatCardData.js';
assert.equal(entries.length,298);
assert.deepEqual(counts,{classe:34,poder:170,heroico:61,feitico:33});
assert.equal(new Set(entries.map(x=>x.id)).size,entries.length);
assert.ok(['basico','high','natural','techno','codex'].every(source=>entries.some(x=>x.source===source)));
for(const item of entries)assert.ok(item.nome&&item.pagina&&item.fonte&&item.tipo,'Referência incompleta: '+item.id);
assert.ok(entries.some(x=>x.nome==='Arcanista'&&x.tipo==='classe'&&x.source==='basico'));
assert.ok(entries.some(x=>x.nome==='Mestre de Duelos'&&x.tipo==='heroico'&&x.source==='codex'));
assert.ok(entries.some(x=>x.nome==='Gourmet'&&x.tipo==='classe'&&x.source==='natural'));
assert.ok(entries.some(x=>x.nome==='Esper'&&x.tipo==='classe'&&x.source==='techno'));
assert.ok(entries.some(x=>x.nome==='Comandante'&&x.tipo==='classe'&&x.source==='high'));
assert.ok(entries.some(x=>x.nome==='Curar'&&x.tipo==='feitico'&&x.disciplina==='Espiritualismo'&&x.pm==='10 × A'));
assert.ok(entries.some(x=>x.nome==='Lux'&&x.tipo==='feitico'&&x.ofensiva===true));
assert.ok(!entries.some(x=>x.tipo==='poder'&&x.nome==='Poder Heroico Requisito Descrição'));
const original={id:'old',system:'fabula',type:'pc',nivel:5,bio:{nome:'Herói'},suplementos:{basico:true,natural:false,high:false,techno:false,codex:false},classes:[{nome:'',nivel:1,beneficios:'',poderes:[]},{nome:'',nivel:1,beneficios:'',poderes:[]}],poderesHeroicos:[{nome:'Meu poder',desc:'Minha regra'}],extrasAtivos:[],extras:{magia:{disciplinas:[],feiticos:[{nome:'Meu feitiço',desc:'texto preservado'}],rituais:[]}},notas:'Preservar'};
const snapshot=structuredClone(original);
const classEntry=entries.find(x=>x.nome==='Espiritualista'&&x.tipo==='classe');
let r=applyFabulaLibrarySelection(original,classEntry,'classe');
assert.ok(r.changed);assert.equal(r.data.classes[0].nome,'Espiritualista');
assert.deepEqual(original,snapshot,'Ação não deve alterar original');
assert.equal(applyFabulaLibrarySelection(r.data,classEntry,'classe').changed,false);
const skill=entries.find(x=>x.classe==='Espiritualista'&&x.tipo==='poder');
r=applyFabulaLibrarySelection(r.data,skill,'poder');
assert.equal(r.data.classes[0].poderes[0].nome,skill.nome);
assert.equal(r.data.classes[0].nivel,1);
assert.equal(applyFabulaLibrarySelection(r.data,skill,'poder').changed,false);
const noClass=applyFabulaLibrarySelection(original,skill,'poder');
assert.equal(noClass.changed,false);
const spell=entries.find(x=>x.nome==='Curar'&&x.tipo==='feitico');
r=applyFabulaLibrarySelection(r.data,spell,'feitico');
assert.ok(r.data.extrasAtivos.includes('magia'));
assert.ok(r.data.extras.magia.disciplinas.includes('Espiritualismo'));
assert.equal(r.data.extras.magia.feiticos[0].desc,'texto preservado');
assert.equal(applyFabulaLibrarySelection(r.data,spell,'feitico').changed,false);
const h=entries.find(x=>x.nome==='Poder da Amizade'&&x.tipo==='heroico');
r=applyFabulaLibrarySelection(r.data,h,'heroico');
assert.equal(r.data.suplementos.codex,true);
assert.equal(r.data.poderesHeroicos[0].desc,'Minha regra');
assert.equal(r.data.notas,'Preservar');
const data={
 fabula:{system:'fabula',type:'ameaca',nome:'Serafim',nivel:20,especie:'Demônio',patente:'Elite',atributos:{des:'d8',ast:'d10',vig:'d12',von:'d8'},status:{pvAtual:70,pvMax:90,pmAtual:30,pmMax:50,defesa:12,defesaMagica:10,iniciativa:9},ataques:[{nome:'Garra',dano:'RA +10'}],poderes:[{nome:'Aura',desc:'Luz'}]},
 dnd5e:{system:'dnd5e',type:'ameaca',nome:'Dragão',ca:18,pv:100,atributos:{for:22,des:10,con:20,int:10,sab:11,car:15},acoes:[{nome:'Mordida',desc:'Ataque'}]},
 ordemParanormal:{system:'ordemParanormal',type:'ameaca',nome:'Anomalia',ataques:[{nome:'Impacto',desc:'dano'}]},
 skyfall:{system:'skyfall',type:'ameaca',nome:'Monstro',nivelDesafio:4,status:{pvAtual:20,pvMax:30},habilidades:[{nome:'Rugido',desc:'Assusta'}]},
 '3det':{system:'3det',type:'ameaca',nome:'Autômato',atributos:{poder:2,habilidade:1,resistencia:3},status:{pv:{atual:10,max:12},pa:{atual:1,max:2},pm:{atual:6,max:6}},vantagens:[{nome:'Forte',desc:'P+2'}]},
 somdas6:{system:'somdas6',type:'ameaca',nome:'Bandido',np:2,status:{pvAtual:7,pvMax:12},armas:[{nome:'Pistola',dano:'1d6'}]}
};
for(const [sys,d] of Object.entries(data)){const before=structuredClone(d),card=buildThreatCardData(d);assert.equal(card.name,d.nome);assert.equal(card.system,sys);assert.ok(card.stats.length);assert.deepEqual(d,before,'Card não pode modificar dados '+sys);}
assert.equal(buildThreatCardData(data.fabula).stats.find(x=>x.title==='Crise').value,'45');
assert.ok(buildThreatCardData(data.fabula).sections.some(x=>x.label==='Ataques'));
assert.equal(buildThreatCardData(data['3det']).attributes.length,3);
const app=readFileSync('src/PJLiteApp.jsx','utf8');
const modal=readFileSync('src/systems/fabulaUltima/FabulaLibraryModal.jsx','utf8');
const editor=readFileSync('src/systems/fabulaUltima/components/ThreatEditor.jsx','utf8');
const card=readFileSync('src/components/ThreatCardModal.jsx','utf8');
const printCss=readFileSync('src/components/threat-card.css','utf8');
assert.ok(app.includes('setFabulaLibraryOpen(true)')&&app.includes('<FabulaLibraryModal'));
assert.ok(app.includes('setThreatCardOpen(true)')&&app.includes('<ThreatCardModal'));
assert.ok(app.includes("data.system !== 'dragonbane'"),'Dragonbane fica fora do modo card');
assert.ok(modal.includes('Todos os livros')&&modal.includes('Minhas classes:'));
assert.ok(editor.includes('<ThreatStatCard data={data} compact />'),'Prévia Fabula à direita');
assert.ok(card.includes('window.print()')&&card.includes('createPortal'));
assert.ok(printCss.includes('@page{size:A5 portrait')&&printCss.includes('body:has(.pj-threat-card-modal)'));
console.log('✓ Fabula Ultima: 303 referências de cinco livros e cards de ameaças de seis sistemas com impressão A5.');
