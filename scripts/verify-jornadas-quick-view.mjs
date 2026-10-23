import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getJourneySheetSummary} from '../src/cloud/journeySheetSummary.js';

const dragonbane={
 owner_id:'user-a',sheets:{name:'Liria',system:'dragonbane',payload:{
 bio:{nome:'Liria',profissao:'Caçadora',ancestralidade:'Elfa',imagem:'https://example.org/liria.png'},
 atributos:{car:{valor:9},von:{valor:11},int:{valor:12},agl:{valor:17},con:{valor:14},for:{valor:13}},
 status:{pv:{atual:7,max:14},pd:{atual:8,max:11}},
 periciasBase:[{nome:'Caça e Pesca'},{nome:'Sobrevivência'}],
 habilidadesFeiticos:[{nome:'Tiro Duplo'}]
 }}};
const d=getJourneySheetSummary(dragonbane);
assert.equal(d.name,'Liria');
assert.equal(d.profession,'Caçadora');
assert.deepEqual(d.attributes.map(a=>a.label),['FOR','CON','AGL','INT','VON','CAR']);
assert.deepEqual(d.attributes.map(a=>a.value),['13','14','17','12','11','9']);
assert.deepEqual(d.hp,{current:'7',max:'14'});
assert.deepEqual(d.resource,{current:'8',max:'11',label:'PD'});
assert.deepEqual(d.skills,['Caça e Pesca','Sobrevivência']);
assert.deepEqual(d.traits,['Tiro Duplo']);

const dnd=getJourneySheetSummary({sheets:{system:'dnd5e',name:'Neri',payload:{
 system:'dnd5e',bio:{nome:'Neri',classe:'Bardo',nivel:6},atributos:{for:8,des:16,con:12,int:14,sab:10,car:18},
 status:{pvAtual:19,pvMax:32,ca:15},caracteristicas:[{nome:'Inspiração Bárdica'}]}}});
assert.equal(dnd.profession,'Bardo');
assert.deepEqual(dnd.hp,{current:'19',max:'32'});
assert.deepEqual(dnd.attributes.map(a=>a.label),['FOR','DES','CON','INT','SAB','CAR']);

const fabula=getJourneySheetSummary({sheets:{system:'fabula',payload:{
 bio:{nome:'Eli'},atributos:{des:{atual:'d10'},ast:{atual:'d6'},vig:{atual:'d8'},von:{atual:'d12'}},
 status:{pvAtual:25,pvMax:40,pmAtual:8,pmMax:20}}}});
assert.deepEqual(fabula.attributes.map(a=>a.value),['d10','d6','d8','d12']);
assert.equal(fabula.resource.label,'PM');
assert.equal(fabula.resource.current,'8');
assert.equal(getJourneySheetSummary({sheets:{name:'Sem permissão'}}).hasPayload,false);
assert.equal(getJourneySheetSummary({}).name,'Ficha sem nome');

const panel=readFileSync('src/cloud/JornadasPanel.jsx','utf8');
const hub=readFileSync('src/cloud/JornadasHub.jsx','utf8');
const preview=readFileSync('src/cloud/SheetQuickView.jsx','utf8');
const css=readFileSync('src/cloud/jornadas-cris.css','utf8');
for(const item of ["['jogadores','Jogadores']","tab==='jogadores'","journeys-character-grid","journeys-roster-grid","<SheetQuickView","onRefreshGroups","getJourneySheetSummary(row)"]){
 assert.ok(panel.includes(item),'Jornadas precisa incluir '+item);
}
assert.ok(hub.includes('onRefreshGroups={refresh}'),'Atualizar membros reais do grupo no mesmo botão de atualizar sala');
assert.ok(!panel.includes('className="jornadas-room-tools"'),'A navegação duplicada deve ser removida');
assert.equal(panel.split('className="pjlite-jornadas-tabs"').length-1,1,'A campanha tem uma única navegação');
assert.ok(panel.includes("setTab('fichas')"),'Abrir uma campanha diretamente na área de personagens');
assert.ok(preview.includes('role="dialog"')&&preview.includes('aria-modal="true"'),'A prévia abre em diálogo acessível');
assert.ok(preview.includes('canEdit&&sheet.hasPayload'),'Só editores autorizados têm acesso à edição avançada');
assert.ok(css.includes('.journeys-character-card')&&css.includes('.journeys-player-card'),'Cards de personagens e jogadores devem ser responsivos');
console.log('✓ Jornadas: uma navegação, jogadores reais, fichas vinculadas e resumo multi-sistema protegido.');
