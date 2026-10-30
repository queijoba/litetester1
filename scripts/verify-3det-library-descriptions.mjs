import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SYSTEM_LIBRARIES} from '../src/components/otherSystemLibraryCatalog.js';
import {TRESDET_EXPLANATIONS,TRESDET_SKILL_ENTRIES,TRESDET_TECH_USAGE} from '../src/components/tresdetVictoryExplanations.js';
import {applyOtherSystemLibrarySelection} from '../src/components/otherSystemLibraryActions.js';
import {initial3DetPcData} from '../src/systems/3det/data.js';
const entries=SYSTEM_LIBRARIES['3det'].entries;
assert.equal(Object.keys(TRESDET_EXPLANATIONS).length,127,'All 127 entries should have unique explanations');
assert.equal(TRESDET_SKILL_ENTRIES.length,12,'All original skills present');
assert.equal(entries.length,139,'Old references plus 12 skills');
for(const [kind,count] of Object.entries({vantagem:48,desvantagem:23,arquetipo:24,tecnica:32,pericia:12}))
 assert.equal(entries.filter(x=>x.tipo===kind).length,count,'Missing '+kind);
for(const entry of entries){
 assert.ok(entry.desc.length>34,'Missing useful explanation: '+entry.nome);
 assert.ok(!/Consulte efeitos, modificadores|do Livro Básico\. Consulte|descrição da técnica/i.test(entry.desc),'Placeholder for '+entry.nome);
 assert.ok(entry.pagina&&entry.fonte,'Missing source '+entry.nome);
 assert.ok(entry.custo||entry.valor,'Missing point/XP cost '+entry.nome);
}
assert.equal(Object.keys(TRESDET_TECH_USAGE).length,32);
for(const entry of entries.filter(x=>x.tipo==='tecnica')){
 assert.ok(entry.requisitos&&entry.alcance&&entry.uso,'Missing technical data '+entry.nome);
 assert.ok(entry.custo.endsWith('XP'),'Learning cost must stay in XP '+entry.nome);
}
const example=structuredClone(initial3DetPcData);
const perk=entries.find(x=>x.nome==='Aceleração');
const skill=entries.find(x=>x.nome==='Percepção');
const tech=entries.find(x=>x.nome==='Raio Místico');
const a=applyOtherSystemLibrarySelection(example,perk,'vantagem');
assert.ok(a.changed&&a.data.vantagens[0].desc.includes('movimentos extras'));
assert.equal(a.data.pontos,example.pontos,'Do not auto-charge points for advantage');
const b=applyOtherSystemLibrarySelection(a.data,skill,'pericia');
assert.ok(b.changed&&b.data.pericias.percepcao);
assert.equal(b.data.pontos,example.pontos,'Do not auto-charge skill points');
assert.equal(applyOtherSystemLibrarySelection(b.data,skill,'pericia').changed,false,'Prevent duplicate skills');
const c=applyOtherSystemLibrarySelection(b.data,tech,'tecnica');
assert.ok(c.changed&&c.data.tecnicas[0].desc.includes('energia arcana'));
assert.equal(c.data.pontos,example.pontos,'Do not auto-charge XP');
const ui=readFileSync('src/components/OtherSystemLibraryModal.jsx','utf8');
assert.ok(ui.includes('O que significa na ficha?'),'User should understand any selected entry');
assert.ok(ui.includes('Gasto para usar')&&ui.includes('Para aprender'),'Explain difference between PM and XP');
assert.ok(ui.includes('Selecionar perícia na ficha'),'Skill action must be explicit');

const archetype=entries.find(x=>x.tipo==='arquetipo'&&x.nome==='Alien')||entries.find(x=>x.tipo==='arquetipo');
const disadvantage=entries.find(x=>x.tipo==='desvantagem');
const ar=applyOtherSystemLibrarySelection(c.data,archetype,'arquetipo');
assert.ok(ar.changed&&ar.data.bio.arquetipo===archetype.nome,'Arquétipo selecionado entra no campo da ficha');
const dv=applyOtherSystemLibrarySelection(ar.data,disadvantage,'desvantagem');
assert.ok(dv.changed&&dv.data.desvantagens.some(x=>x.nome===disadvantage.nome),'Desvantagem adicionada à ficha');
assert.equal(applyOtherSystemLibrarySelection(dv.data,disadvantage,'desvantagem').changed,false,'Evitar duplicação');
assert.equal(applyOtherSystemLibrarySelection(dv.data,archetype,'arquetipo').changed,false,'Mesmo arquétipo não duplica');
assert.ok(dv.data.vantagens.some(x=>x.nome==='Aceleração'&&!x.origemArquetipo),'Vantagem manual existente preservada');
assert.equal(dv.data.tecnicas.length,1,'Técnica existente preservada');
assert.ok(ui.includes('const current=rows.find(x=>x.id===selected)||null'), 'Não adicionar primeira opção sem escolha explícita');
assert.ok(ui.includes("if(applied?.changed===false)"),'Biblioteca não fecha quando a ficha rejeitar a opção');
assert.ok(ui.includes('role="status"')&&ui.includes('role="alert"'), 'Confirmar itens adicionados e falhas');
const home=readFileSync('src/PJLiteApp.jsx','utf8');
assert.ok(home.includes('return result;'),'A callback de biblioteca retorna sucesso real');
assert.ok(home.includes('setTresDetLibraryFocus(previous=>('),'Após escolher, abrir aba correspondente da ficha');
assert.ok(home.includes('tresDetLibraryFocus,')&&home.includes('<TresDeTCharacterEditor scope={systemEditorScope} />'),'Editor recebe qual aba destacar');
const archetypes=entries.filter(x=>x.tipo==='arquetipo');
assert.equal(archetypes.length,24,'Todos os arquétipos do catálogo');
for(const origin of archetypes){
 assert.ok(origin.vantagensArquetipo?.length&&origin.desvantagensArquetipo?.length,
  'Arquétipo precisa mostrar benefícios e limitações: '+origin.nome);
 assert.ok(/^\\d+$/.test(origin.pagina),'Página individual no Livro Básico: '+origin.nome);
 const chosen=applyOtherSystemLibrarySelection(structuredClone(initial3DetPcData),origin,'arquetipo');
 assert.ok(chosen.changed&&chosen.data.bio.arquetipo===origin.nome,'Selecionar arquétipo '+origin.nome);
 for(const [field,source] of [['vantagens',origin.vantagensArquetipo],['desvantagens',origin.desvantagensArquetipo]]){
  for(const option of source)assert.ok(chosen.data[field].some(item=>
   item.pacoteItem===option.nome&&item.origemArquetipo===origin.nome&&item.desc===option.desc
  ),'Pacote não registrado: '+origin.nome+' / '+option.nome);
 }
 assert.equal(chosen.data.pontos,initial3DetPcData.pontos,'Arquétipo não cobra custos automaticamente');
 assert.equal(applyOtherSystemLibrarySelection(chosen.data,origin,'arquetipo').changed,false,
  'Arquétipo repetido não duplica pacote');
}
const fresh=archetypes.find(x=>x.nome==='Aberrante');
const second=archetypes.find(x=>x.nome==='Anão');
const oldSave={...structuredClone(initial3DetPcData),bio:{...initial3DetPcData.bio,arquetipo:fresh.nome}};
const patched=applyOtherSystemLibrarySelection(oldSave,fresh,'arquetipo');
assert.ok(patched.changed&&patched.data.vantagens.some(x=>x.origemArquetipo===fresh.nome),
 'Ficha antiga com arquétipo deve receber pacote ausente');
const manual=structuredClone(patched.data);
manual.vantagens.push({nome:'Minha habilidade exclusiva',desc:'Adicionada manualmente',custo:'1pt'});
manual.desvantagens.push({nome:'Minha fraqueza pessoal',desc:'Anotação manual',valor:'-1pt'});
const changed=applyOtherSystemLibrarySelection(manual,second,'arquetipo');
assert.ok(changed.changed&&changed.data.bio.arquetipo===second.nome);
assert.ok(changed.data.vantagens.some(x=>x.nome==='Minha habilidade exclusiva'),'Preservar vantagem manual');
assert.ok(changed.data.desvantagens.some(x=>x.nome==='Minha fraqueza pessoal'),'Preservar desvantagem manual');
assert.ok(!changed.data.vantagens.some(x=>x.origemArquetipo===fresh.nome),'Excluir apenas benefícios do pacote antigo');
assert.ok(!changed.data.desvantagens.some(x=>x.origemArquetipo===fresh.nome),'Excluir apenas fraquezas do pacote antigo');
assert.ok(changed.data.vantagens.some(x=>x.origemArquetipo===second.nome),'Adicionar o novo pacote');
assert.ok(ui.includes('Benefícios e vantagens do arquétipo')&&ui.includes('Desvantagens e limitações'),
 'Explicar vantagens e desvantagens antes de aplicar arquétipo');
assert.ok(ui.includes("current[index===0?'vantagensArquetipo':'desvantagensArquetipo']"),
 'Arquétipo já escolhido pode receber pacote ausente na ficha antiga');
assert.ok(home.includes("'tecnica','arquetipo'].includes(kind)"),'Abrir vantagens após aplicar arquétipo');

const editor=readFileSync('src/systems/3det/components/CharacterEditor.jsx','utf8');
assert.ok(editor.includes('setTab(tresDetLibraryFocus.tab)'),'Editor seleciona aba de Vantagens & Técnicas ou Ficha');
assert.ok(ui.includes('Selecione uma opção na lista'),'Biblioteca explica fluxo antes de alterar dados');

console.log('✓ 3DeT Victory: 127 efeitos explicados, 12 perícias, uso técnico em PM e 139 entradas selecionáveis.');
