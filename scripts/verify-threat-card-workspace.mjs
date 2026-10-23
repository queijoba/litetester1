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
assert.ok(modal.includes('Copiar texto')&&modal.includes('Baixar PNG')&&!modal.includes('window.print()'),'Card para imagem sem PDF');
assert.ok(modal.includes("import {toBlob} from 'html-to-image'"),'Conversão real do card em PNG');
assert.ok(modal.includes('ref={cardRef}')&&modal.includes('pixelRatio')&&modal.includes("a.download='Card_Ameaca_'"),'PNG com conteúdo integral e nome da ameaça');
assert.ok(modal.includes('Gerando PNG')&&modal.includes('role="alert"'),'Feedback durante download de imagem');
assert.ok(wrapper.includes('baixe o card em PNG'),'Prévia orienta compartilhar PNG');
assert.ok(app.includes('baixar PNG do card da ameaça'),'Barra indica PNG, não impressão');
const packageJson=JSON.parse(readFileSync('package.json','utf8'));
assert.ok(packageJson.dependencies['html-to-image'],'Biblioteca HTML para PNG instalada');

assert.ok(!cardCss.includes('@page{size:A5 portrait'),'Sem necessidade de gerar PDF');
assert.ok(!dragonbane.includes('ThreatCardWorkspace'),'O editor Dragonbane original deve permanecer intacto');
assert.ok(app.includes("enabled={data.system==='dragonbane' && data.type!=='pc'}"),'Somente as ameaças Dragonbane recebem workspace');
assert.ok(app.includes('<DragonbaneEditor scope={systemEditorScope} />'),'Editor Dragonbane preservado no app');
assert.equal(app.split('<DragonbaneEditor scope={systemEditorScope} />').length-1,1,'Editor Dragonbane não pode montar duas vezes');
assert.ok(wrapper.includes('enabled=true')&&wrapper.includes('!enabled'), 'Workspace deve ignorar personagens Dragonbane');
assert.ok(modal.includes("dragonbane:'Dragonbane'"),'Nome Dragonbane no card de PNG');
assert.ok(cardCss.includes('.pj-threat-card--dragonbane'), 'Visual próprio de Dragonbane');
assert.ok(css.includes('.pj-threat-workspace--dragonbane'), 'Layout de edição e prévia Dragonbane');


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


const drMonstro={
 system:'dragonbane',type:'ameaca',nome:'Troll Ancião',ferocidade:2,tamanho:'Grande',movimento:'12',armadura:'4',
 status:{pv:{atual:38,max:47}},
 habilidades:[{nome:'Regeneração',desc:'Recupera vida.'}],
 ataques:[{id:1,descricao:'Garras: 2d8'},{id:2,descricao:'Mordida: 2d6'},{id:3,descricao:''},{id:4,descricao:''},{id:5,descricao:''},{id:6,descricao:'Clava gigante: 3d6'}],
 equipamento:'SEGREDO DO TESOURO',notas:'SEGREDO DO MESTRE'
};
const originalDr=structuredClone(drMonstro);
const drCard=buildThreatCardData(drMonstro);
assert.equal(drCard.name,'Troll Ancião');
assert.equal(drCard.badge,'Ferocidade 2');
assert.equal(drCard.stats.find(x=>x.title==='PV').value,'38 / 47');
assert.equal(drCard.stats.find(x=>x.title==='Armadura').value,'4');
assert.equal(drCard.stats.find(x=>x.title==='Ações').value,'2');
assert.equal(drCard.sections.find(x=>x.label.includes('1d6')).items.length,3,'Ataques vazios não aparecem no card');
assert.deepEqual(drCard.sections.find(x=>x.label.includes('1d6')).items.map(x=>x.nome),['1','2','6'],'Respeitar a numeração original');
assert.ok(drCard.sections.some(x=>x.label==='Habilidades especiais'),'Poderes de monstros devem aparecer');
assert.ok(!JSON.stringify(drCard).includes('SEGREDO'),'Não compartilhar material oculto do mestre');
assert.deepEqual(drMonstro,originalDr,'Visualizador não altera objeto original');

const dbLacaio={system:'dragonbane',type:'pnj',tipoPnj:'lacaio',nome:'Batedor',ancestralidade:'Lupino',profissao:'Guarda',
 movimento:10,danoBonus:'+D4',armaduraTipica:{nome:'Couro',valor:2},
 status:{pv:{atual:7,max:10},pd:{atual:0,max:0}},
 pericias:[{nome:'Atiraria',valor:12}],armas:[{nome:'Arco',pericia:14,dano:'D10'}],
 feiticos:[{nome:'Instinto',desc:'Alerta'}],atitude:'Hostil',motivacao:'ARMAÇÃO SECRETA',
 tracoMarcante:'Olhos azuis',equipamento:'RECOMPENSA SECRETA'
};
const scout=buildThreatCardData(dbLacaio);
assert.equal(scout.badge,'PNJ • Lacaio');
assert.equal(scout.stats.find(x=>x.title==='PV').value,'7 / 10');
assert.ok(!scout.stats.some(x=>x.title==='PD'),'Lacaio não apresenta pontos de determinação');
assert.ok(scout.details.some(x=>x[0]==='Perícias'),'Exibir perícias de PNJ');
assert.equal(scout.sections.find(x=>x.label==='Armas e ataques').items.length,1);
assert.equal(scout.sections.find(x=>x.label==='Armas e ataques').items[0].desc,'Perícia 14 • Dano D10');
assert.ok(!JSON.stringify(scout).includes('SECRETA'),'Não revelar tesouro nem motivação do mestre');
const chief=buildThreatCardData({...dbLacaio,tipoPnj:'chefe',status:{pv:{atual:10,max:16},pd:{atual:4,max:7}}});
assert.equal(chief.badge,'PNJ • Chefe');
assert.equal(chief.stats.find(x=>x.title==='PD').value,'4 / 7','PNJ chefe apresenta determinação');

console.log('✓ Cards de ameaças incluindo monstros e PNJs Dragonbane com PNG, 1d6 e notas privadas preservadas.');
