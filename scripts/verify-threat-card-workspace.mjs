import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildThreatCardData} from '../src/components/threatCardData.js';

const app=readFileSync('src/PJLiteApp.jsx','utf8');
const wrapper=readFileSync('src/components/ThreatCardWorkspace.jsx','utf8');
const css=readFileSync('src/components/threat-workspace.css','utf8');
const modal=readFileSync('src/components/ThreatCardModal.jsx','utf8');
const cardCss=readFileSync('src/components/threat-card.css','utf8');
const fabula=readFileSync('src/systems/fabulaUltima/components/ThreatEditor.jsx','utf8');
const ordem=readFileSync('src/systems/ordemParanormal/components/ThreatEditor.jsx','utf8');
const skyfall=readFileSync('src/systems/skyfall/components/ThreatEditor.jsx','utf8');
const dragonbane=readFileSync('src/systems/dragonbane/components/Editor.jsx','utf8');

assert.ok(app.includes('<ThreatCardWorkspace data={data} onOpen={()=>setThreatCardOpen(true)}>'),'Workspace conectado ao app');
for(const system of ['fabula','somdas6','3det','ordemParanormal','skyfall'])
 assert.ok(app.includes("'"+system+"'"),'Sistema ausente no workspace: '+system);
for(const editor of ['Som6ThreatEditor','FabulaThreatEditor','TresDeTThreatEditor','OrdemThreatEditor','SkyfallThreatEditor'])
 assert.equal(app.split('<'+editor+' scope={systemEditorScope} />').length-1,1,'Editor deve montar uma única vez: '+editor);
assert.ok(app.includes('<DndThreatEditor scope={systemEditorScope} />'),'D&D mantém statblock clássico');
assert.ok(wrapper.includes('<ThreatStatCard data={data} compact />'),'Prévia sincronizada');
assert.ok(wrapper.includes('onOpen'),'Prévia ampliável');
assert.ok(css.includes('position:sticky')&&css.includes('@media(max-width:700px)'),'Layout desktop/mobile');
assert.ok(!fabula.includes('<ThreatStatCard data={data} compact />'),'Fabula não duplica card');
assert.ok(ordem.includes("import '../ordem-theme.css'"),'Ordem importa seu tema');
assert.ok(skyfall.includes("import '../skyfall-theme.css'"),'Skyfall importa seu tema');
assert.ok(modal.includes('Copiar texto')&&!modal.includes('window.print()'),'Card para imagem sem PDF');
assert.ok(!cardCss.includes('@page{size:A5 portrait'),'Sem necessidade de gerar PDF');
assert.ok(!dragonbane.includes('ThreatCardWorkspace'),'Dragonbane sem alterações');

const ordemData={system:'ordemParanormal',type:'ameaca',nome:'Aberração',categoria:'Criatura',elemento:'Sangue',tamanho:'Médio',vd:60,
 atributos:{agi:2,for:3,int:1,pre:2,vig:3},status:{pvAtual:32,pvMax:50,defesa:16,deslocamento:'12 m'},
 resistencias:'Corte 10',imunidades:'Medo',vulnerabilidades:'Fogo',pericias:{percepcao:'+5'},enigmaMedo:'SEGREDO DO MESTRE',notas:'PLANO SECRETO DO MESTRE',
 ataques:[{nome:'Garras',teste:'+8',dano:'2d6',critico:'20',alcance:'Corpo a corpo',desc:'Ferida profunda'}]};
const ordemCopy=structuredClone(ordemData),o=buildThreatCardData(ordemData);
assert.equal(o.subtitle,'Criatura • Sangue • Médio');
assert.equal(o.stats[0].value,'32 / 50');
assert.ok(o.details.some(([key])=>key==='Imunidades'));
assert.ok(o.sections[0].items[0].desc.includes('2d6'));
assert.ok(!JSON.stringify(o).includes('SEGREDO DO MESTRE'));
assert.ok(!JSON.stringify(o).includes('PLANO SECRETO DO MESTRE'));
assert.deepEqual(ordemData,ordemCopy,'Prévia não pode alterar dados');

const det=buildThreatCardData({system:'3det',type:'ameaca',nome:'Robô',conceito:'Guarda',notas:'TRAIDOR REVELADO',
 atributos:{poder:2,habilidade:3,resistencia:4},status:{pv:{atual:10,max:20},pa:{atual:2,max:4},pm:{atual:5,max:10}},
 tecnicas:[{nome:'Raio',custo:'2 PM',notas:'surpresa',desc:'Projétil'}]});
assert.equal(det.summary,'Guarda');
assert.ok(!JSON.stringify(det).includes('TRAIDOR REVELADO'));
assert.ok(!JSON.stringify(det).includes('surpresa'),'Notas internas de cada técnica ficam ocultas');
const som=buildThreatCardData({system:'somdas6',type:'ameaca',nome:'Pistoleiro',np:3,status:{pvAtual:8,pvMax:12,defesa:6,acoes:1,ataqueBonus:2,iniciativaBonus:1},notas:'ENCONTRA ARMADILHA'});
assert.ok(!JSON.stringify(som).includes('ENCONTRA ARMADILHA'));

console.log('✓ Cards de ameaças sincronizados em cinco editores, responsivos e sem revelar anotações do mestre ou gerar PDF.');
