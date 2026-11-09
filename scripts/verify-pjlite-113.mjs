import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GM_SHIELDS,getGmShield,getGmShieldKey} from '../src/cloud/gmShieldCatalog.js';
import {getJourneySheetSummary} from '../src/cloud/journeySheetSummary.js';
const text=p=>readFileSync(p,'utf8');
const home=text('src/PJLiteApp.jsx'),hub=text('src/cloud/JornadasHub.jsx');
const shield=text('src/cloud/CampaignWorkspace.jsx'),component=text('src/cloud/GmShieldReference.jsx');
const modal=text('src/components/ThreatCardModal.jsx'),css=text('src/components/threat-card.css');
const night=text('src/cloud/jornadas-night.css');
assert.ok(home.includes("versao: '1.1.3v Alpha'"),'Registro de versão atual');
assert.ok(home.includes('1.1.3v Alpha — Escudos, cards térmicos e Campanhas'),'Novidades do release');
assert.ok(text('index.html').includes('1.1.3v Alpha'),'Metadados versão');
assert.ok(text('.github/workflows/ci.yml').includes('PJ Lite 1.1.3v Alpha'),'Snapshot etiquetado 1.1.3');
for(const system of ['dragonbane','dnd5e','tormenta20','ordemParanormal','fabula','3det','rotaZero','skyfall','somdas6']){
 assert.ok(GM_SHIELDS[system],'Escudo faltando para '+system);
 assert.ok(GM_SHIELDS[system].groups.flatMap(g=>g.items).length>=2,'Escudo incompleto: '+system);
}
for(const system of ['dragonbane','dnd5e','tormenta20','ordemParanormal','fabula','3det','rotaZero']){
 const item=getGmShield(system);
 assert.ok(item.url?.startsWith('https://drive.google.com/file/d/'),'PDF válido para '+system);
}
assert.equal(getGmShield('t20'),GM_SHIELDS.tormenta20);
assert.equal(getGmShield('fabulaUltima'),GM_SHIELDS.fabula);
assert.equal(getGmShieldKey('t20'),'tormenta20','T20 deve selecionar opção real no menu');
assert.equal(getGmShieldKey('fabulaUltima'),'fabula','Fábula deve selecionar opção real no menu');
assert.equal(getGmShieldKey('rotazero'),'rotaZero','Alias Rota Zero');
assert.equal(getGmShieldKey('unknown-system'),null,'Sistemas desconhecidos não devem receber regras Dragonbane');
for(const system of ['dragonbane','dnd5e','tormenta20','ordemParanormal','fabula','3det','rotaZero']){
 const entry=getGmShield(system);
 assert.ok(entry.groups.length>=4,'Consulta ampliada deve ter 4+ grupos: '+system);
 assert.ok(entry.groups.flatMap(g=>g.items).length>=10,'Regras rápidas suficientes no escudo: '+system);
 assert.ok(entry.groups.every(g=>g.items.every(([name,summary])=>name&&summary&&summary.length>18)),
  'Todos os lembretes têm título e descrição: '+system);
}
assert.ok(GM_SHIELDS.rotaZero.groups.flatMap(g=>g.items).some(([k])=>k==='Pressão'),
 'O escudo Rota Zero inclui Pressão/Pânico do PDF');

assert.equal(GM_SHIELDS.skyfall.url,null);
assert.equal(GM_SHIELDS.somdas6.url,null);
assert.ok(component.includes("target=\"_blank\" rel=\"noopener noreferrer\""),'Referências só em nova guia');
assert.ok(component.includes("getGmShieldKey(system)")&&component.includes('!entry?'),
 'O seletor de regras deve usar chave canônica e exibir aviso neutro quando não reconhecer o sistema');
assert.ok(component.includes('open={index===0}'),'Abrir primeiro painel de consulta ao iniciar');

assert.ok(shield.includes('<GmShieldReference system={draft?.system}/>'),'Escudo usa o sistema da campanha');
assert.ok(shield.includes('<GmShieldReference system={draft?.system}/>'),'Escudo enxuto mantém regras do sistema; fichas estão nas abas próprias');
assert.ok(!shield.slice(shield.indexOf('export function CampaignShield')).includes('Rolagem rápida'),'Rolagem não duplicada no escudo');
const rota=getJourneySheetSummary({sheets:{name:'Funcionário',system:'rotaZero',sheet_type:'pc',payload:{
 system:'rotaZero',type:'pc',bio:{nome:'CABLE'},atributos:{pulso:1,tecnica:2,firmeza:2},
 recursos:{adrenalina:{atual:2,max:2},foco:{atual:5,max:10},vitalidade:{atual:7,max:10}},
 pericias:{navegacao:true,manutencao:true,observacao:false},
 vantagens:[{nome:'Cabeça Fria'}],inventario:['Lanterna','Kit de reparo']
}}});
assert.deepEqual(rota.hp,{current:'7',max:'10'},'Vitalidade Rota Zero aparece como Vida');
assert.equal(rota.resource.label,'FOC');
assert.equal(rota.resource.current,'5');
assert.equal(rota.extraResources[0].label,'ADR');
assert.equal(rota.attributes.length,3);
assert.ok(rota.skills.some(x=>x.includes('navegacao')),'Perícia de mapa deve ser listada');
assert.ok(!rota.skills.some(x=>x.includes('observacao')),'Perícia não selecionada não aparece');
assert.ok(rota.traits.includes('Cabeça Fria'),'Vantagens na miniatura da campanha');
const three=getJourneySheetSummary({sheets:{system:'3det',payload:{system:'3det',
 bio:{nome:'Heroína'},atributos:{poder:2,habilidade:3,resistencia:1},
 status:{pv:{atual:4,max:8},pm:{atual:1,max:4},pa:{atual:2,max:3}},
 pericias:{animais:false,esporte:true},tecnicas:[{nome:'Ataque especial'}],vantagens:[{nome:'Ágil'}]
}}});
assert.equal(three.hp.current,'4');
assert.equal(three.resource.label,'PM');
assert.equal(three.extraResources[0].label,'PA');
assert.ok(three.skills.includes('esporte'));
assert.ok(three.traits.includes('Ataque especial'));
const fallback=getJourneySheetSummary({sheets:{name:'Ficha multi-sistema',system:'rotaZero',payload:{
 system:'rotaZero',bio:{nome:'Teste'},atributos:{pulso:1,firmeza:1,tecnica:1},
 periciasBase:[],pericias:{navegacao:true},
 equipamentos:[],inventario:['Lanterna'],
 habilidadesFeiticos:[],habilidades:[{nome:'Reparo de emergência'}]
}}});
assert.ok(fallback.skills.includes('navegacao'),'Perícia em campo secundário não pode sumir por existir array vazio');
assert.ok(fallback.equipment.includes('Lanterna'),'Inventário não pode sumir por equipamentos vazio');
assert.ok(fallback.traits.includes('Reparo de emergência'),'Habilidades não devem ser ocultas por campo vazio');

assert.ok(modal.includes("pngFormat==='thermal58'?384:pngFormat==='thermal80'?576:560"),'Larguras térmicas');
assert.ok(modal.includes("const exportNode=node.cloneNode(true)"),'Exportar clone reformatado, não janela com scroll');
assert.ok(modal.includes("document.body.appendChild(exportHost)"),'Captura fora da janela original');
assert.ok(modal.includes("width,height,")&&modal.includes('exportNode.scrollHeight'),'Altura completa no PNG');
assert.ok(modal.includes('thermal80')&&modal.includes('thermal58'),'Seletor térmico em duas larguras');
assert.ok(css.includes('.pj-threat-export-host')&&css.includes('.pj-threat-card-capture.is-thermal'),'CSS de exportação');
assert.ok(css.includes('background:#fff!important;color:#000!important'),'Alto contraste para impressão');
assert.ok(home.includes("{createTarget === 'pc' && ("),'Ficha Rota Zero pública em criação');
assert.ok(home.includes('<option value="rotaZero">Rota Zero</option>'),'Filtro Rota Zero público');
assert.ok(home.includes("{guideTab === 'rotazero' && ("),'Guia Rota Zero público');
assert.ok(home.includes("{rotaZeroUnlocked && <option value=\"rotazero\">Tema: Rota Zero</option>}"),'Tema secreto segue bloqueado');
assert.ok(hub.includes("const THEME_KEY='dragonbane_theme_prefs'"),'Chave de tema igual a Home');
assert.ok(hub.includes('pjlite:theme-changed')&&hub.includes("window.addEventListener('storage',onStorage)"),'Temas sincronizados entre abas');
assert.ok(night.includes('.jornadas-night .journey-sheet-modal'),'Contraste do modal de ficha no escuro');
assert.ok(night.includes('.jornadas-night .journey-sheet-sections>div'),'Seções legíveis no escuro');
assert.ok(home.includes('58 mm')&&home.includes('80 mm'),'Guia térmico');
assert.ok(home.includes('Escudo do Mestre:</strong>'),'Guia escudos');
console.log('✓ PJLite 1.1.3v Alpha: escudos, RZ público, temas, minifichas e PNG térmico verificados.');
