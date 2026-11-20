import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MODELOS_SOM6_LIVRO_PDJ,MODELOS_SOM6_LIVRO_ANIMAIS} from '../src/systems/somDasSeis/bestiaryCatalog.js';
import {MODELOS_DRAGONBANE_BESTIARIO,GRUPOS_DRAGONBANE_BESTIARIO} from '../src/systems/dragonbane/bestiaryCatalog.js';
import {buildThreatCardData} from '../src/components/threatCardData.js';
const check=(rows,number,system)=>{
 assert.equal(rows.length,number,system+' incompleto.');
 assert.equal(new Set(rows.map(x=>x.nome)).size,number,system+' contém duplicatas.');
 for(const row of rows){
  assert.equal(row.system,system,'Sistema errado: '+row.nome);
  assert.ok(row.nome&&row.fonte&&row.pagina,'Entrada sem identificação/fonte: '+row.nome);
  assert.equal(buildThreatCardData(row).name,row.nome,'Card não reconhece: '+row.nome);
 }
};
check(MODELOS_SOM6_LIVRO_PDJ,8,'somdas6');
check(MODELOS_SOM6_LIVRO_ANIMAIS,12,'somdas6');
for(const row of MODELOS_SOM6_LIVRO_PDJ){
 assert.equal(row.type,'ameaca');
 assert.ok(row.np>=1&&row.np<=6,'NP inválido: '+row.nome);
 assert.ok(row.status.pvAtual>0&&row.status.pvAtual===row.status.pvMax,'PV inválidos: '+row.nome);
 assert.ok(row.status.acoes>0,'ações ausentes: '+row.nome);
}
for(const row of MODELOS_SOM6_LIVRO_ANIMAIS){
 assert.equal(row.categoria,'Animal');
 assert.ok(row.notas.includes('EDITÁVEIS'),'Alertar para stats de animais que não constam no livro.');
}
check(MODELOS_DRAGONBANE_BESTIARIO,63,'dragonbane');
assert.equal(GRUPOS_DRAGONBANE_BESTIARIO.length,9,'Índice de grupos do Bestiário incompleto.');
assert.equal(MODELOS_DRAGONBANE_BESTIARIO.filter(x=>x.type==='ameaca').length,53,'Faltam monstros.');
assert.equal(MODELOS_DRAGONBANE_BESTIARIO.filter(x=>x.type==='pnj').length,10,'Faltam PNJs.');
for(const row of MODELOS_DRAGONBANE_BESTIARIO){
 assert.ok(row.status?.pv?.max>0,'PV Dragonbane inválido: '+row.nome);
 if(row.type==='ameaca'){
  assert.ok(row.ferocidade>0,'Ferocidade inválida: '+row.nome);
  assert.equal(row.ataques.length,6,'Tabela D6 incompleta: '+row.nome);
  assert.deepEqual(row.ataques.map(a=>a.id),[1,2,3,4,5,6],'IDs dos ataques D6: '+row.nome);
 }else{
  assert.ok(Array.isArray(row.pericias)&&Array.isArray(row.armas),'PNJ não usa editor correto: '+row.nome);
 }
}
const selected=MODELOS_DRAGONBANE_BESTIARIO.find(x=>x.nome==='Troll da Caverna');
assert.equal(selected.status.pv.max,42);assert.equal(selected.ferocidade,2);
assert.equal(MODELOS_DRAGONBANE_BESTIARIO.find(x=>x.nome==='Dragão Jovem').status.pv.max,60);
assert.equal(MODELOS_DRAGONBANE_BESTIARIO.find(x=>x.nome==='Vampiro').status.pv.max,32);
const app=readFileSync('src/PJLiteApp.jsx','utf8');
for(const part of ['MODELOS_SOM6_LIVRO_PDJ','MODELOS_SOM6_LIVRO_ANIMAIS','MODELOS_DRAGONBANE_BESTIARIO',
 'GRUPOS_DRAGONBANE_BESTIARIO','<ThreatCatalog system="somdas6"','<ThreatCatalog system="dragonbane"',
 'loadTemplate(initialAmeacaData)','loadTemplate(initialPnjData)','loadTemplate(initialSom6PdjData)']){
 assert.ok(app.includes(part),'Integração omitida: '+part);
}
console.log('✓ Som das Seis: 8 PDJs, 12 animais; Dragonbane: 63 fichas (53 monstros / 10 PNJs), cards e editor verificados.');
