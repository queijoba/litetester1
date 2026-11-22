import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SYSTEM_LIBRARIES} from '../src/components/otherSystemLibraryCatalog.js';
import {TRESDET_MECHANICS,TRESDET_LIBRARY_EXTRAS,getTresDetMechanicalInfo} from '../src/components/tresdetVictoryMechanics.js';
import {TRESDET_TECH_USAGE} from '../src/components/tresdetVictoryExplanations.js';
import {applyOtherSystemLibrarySelection} from '../src/components/otherSystemLibraryActions.js';
import {initial3DetPcData,normalize3DetPcData} from '../src/systems/3det/data.js';

const entries=SYSTEM_LIBRARIES['3det'].entries;
const types=entries.reduce((acc,entry)=>(acc[entry.tipo]=(acc[entry.tipo]||0)+1,acc),{});
assert.deepEqual(types,{vantagem:59,desvantagem:32,arquetipo:24,tecnica:32,pericia:12});
assert.equal(entries.length,159);
assert.equal(Object.keys(TRESDET_MECHANICS).length,123);
assert.equal(TRESDET_LIBRARY_EXTRAS.length,20);
assert.equal(new Set(entries.map(x=>x.id)).size,entries.length,'Sem IDs duplicados');
assert.equal(new Set(entries.map(x=>x.tipo+'|'+x.nome)).size,entries.length,'Sem nomes repetidos na categoria');
for(const entry of entries.filter(x=>['vantagem','desvantagem','tecnica'].includes(x.tipo))){
 assert.ok(/^\d+$/.test(String(entry.pagina)),'Referência individual precisa de página: '+entry.nome);
 const page=+entry.pagina;
 assert.ok(entry.tipo==='tecnica'?(page>=143&&page<=166):(page>=42&&page<=74),'Página fora da seção: '+entry.nome);
 assert.ok(entry.fonte.includes('3DeT'),'Sem fonte do livro: '+entry.nome);
 assert.equal(entry.pagina,getTresDetMechanicalInfo(entry.nome)?.pagina,'Página inconsistente: '+entry.nome);
 if(entry.tipo!=='tecnica'){
  assert.ok(entry.mecanica?.length>30,'Efeito insuficiente: '+entry.nome);
  assert.ok(entry.ativacao?.length>3,'Ativação insuficiente: '+entry.nome);
  assert.ok(!/Consulte efeitos, modificadores|ver regras/i.test(entry.mecanica),'Placeholder: '+entry.nome);
 }
 if(entry.tipo==='tecnica') assert.ok(TRESDET_TECH_USAGE[entry.nome]?.uso,'Técnica sem custo PM: '+entry.nome);
}
for(const expected of ['+Ação','Alcance','Inimigo','Invisível','Inventário','Paralisia','Punição','Regeneração','Riqueza','Sentido','Transformação','Assombrado','Aura','Código','Fraqueza','Inculto','Maldição','Pacifista','Restrição','Utensílio']){
 assert.ok(entries.some(x=>x.nome===expected),'Ausente opção do livro: '+expected);
}
assert.equal(getTresDetMechanicalInfo('Aceleração').pagina,'43');
assert.equal(getTresDetMechanicalInfo('+Vida').pagina,'64');
assert.equal(getTresDetMechanicalInfo('Ás Indomável').pagina,'143');
assert.equal(getTresDetMechanicalInfo('Absorver Mana').pagina,'151');
const old=structuredClone(initial3DetPcData);
old.pontos=13;old.xp=87;old.vantagens.push({nome:'Minha vantagem caseira',custo:'2',desc:'Não apagar'});
const unchanged=structuredClone(old);
const perk=entries.find(x=>x.nome==='Paralisia'&&x.tipo==='vantagem');
const selected=applyOtherSystemLibrarySelection(old,perk,'vantagem');
assert.ok(selected.changed,'Nova vantagem aplicada');
assert.equal(selected.data.vantagens[1].nome,'Paralisia');
assert.ok(selected.data.vantagens[1].mecanica.includes('Imobiliza'));
assert.equal(selected.data.vantagens[1].pagina,perk.pagina);
assert.equal(selected.data.pontos,old.pontos);
assert.equal(selected.data.xp,old.xp);
assert.deepEqual(old,unchanged,'Objeto original intacto');
assert.equal(applyOtherSystemLibrarySelection(selected.data,perk,'vantagem').changed,false,'Não duplicar vantagem');
const oldNormalized=normalize3DetPcData(selected.data);
assert.deepEqual(oldNormalized.vantagens[0],unchanged.vantagens[0],'Não alterar vantagens caseiras/legadas');
const drawback=entries.find(x=>x.nome==='Restrição'&&x.tipo==='desvantagem');
const negative=applyOtherSystemLibrarySelection(oldNormalized,drawback,'desvantagem');
assert.equal(negative.data.desvantagens[0].valor,drawback.valor);
assert.equal(negative.data.pontos,13);
const technique=entries.find(x=>x.nome==='Raio Místico'&&x.tipo==='tecnica');
const performed=applyOtherSystemLibrarySelection(negative.data,technique,'tecnica');
assert.equal(performed.data.tecnicas[0].requisitos,technique.requisitos);
assert.equal(performed.data.tecnicas[0].alcance,technique.alcance);
assert.equal(performed.data.tecnicas[0].uso,technique.uso);
assert.equal(performed.data.tecnicas[0].pagina,technique.pagina);
const modal=readFileSync('src/components/OtherSystemLibraryModal.jsx','utf8');
const editor=readFileSync('src/systems/3det/components/CharacterEditor.jsx','utf8');
assert.ok(modal.includes('Efeito mecânico')&&modal.includes('Ativação ou condição'));
assert.ok(modal.includes('Regra')&&modal.includes('p. {x.pagina}'));
assert.ok(editor.includes('getTresDetMechanicalInfo(entry?.nome)')&&editor.includes('Consultar regra'),'Legados devem receber referência sem alterar dados');
assert.ok(editor.includes('TRESDET_TECH_USAGE[entry?.nome]'),'Técnicas antigas devem exibir requisitos');
console.log('✓ 3DeT: 59 vantagens, 32 desvantagens, 32 técnicas com páginas; biblioteca e legados compatíveis.');
