import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORDEM_ATTRIBUTES,initialOrdemPcData,normalizeOrdemPcData} from '../src/systems/ordemParanormal/data.js';

const pdf=readFileSync('src/systems/ordemParanormal/components/PdfPages.jsx','utf8');
const editor=readFileSync('src/systems/ordemParanormal/components/CharacterEditor.jsx','utf8');
const css=readFileSync('src/systems/ordemParanormal/ordem-theme.css','utf8');
const identity=pdf.slice(pdf.indexOf('function Identity('),pdf.indexOf('function AgentPage('));
const agent=editor.slice(editor.indexOf("{tab==='agente'"),editor.indexOf("{tab==='pericias'"));
assert.equal(ORDEM_ATTRIBUTES.length,5,'A ficha de Ordem precisa manter exatamente 5 atributos');
assert.ok(identity.includes('ordem-pdf-portrait-orbit')&&identity.includes('ordem-pdf-mini-photo ordem-pdf-attributes-core'),'O retrato deve ocupar o centro dos cinco atributos na Folha 1');
assert.ok(identity.includes('ORDEM_ATTRIBUTES.map')&&identity.includes("updateField('atributos.'+k,v)"),'A edição na Folha 1 atualiza os campos compartilhados');
assert.ok(!pdf.includes('subtitle="Cinco atributos fundamentais"'),'Remover o painel de atributos duplicado da Folha 1');
assert.ok(agent.includes('ordem-attrs--portrait')&&agent.includes('ordem-photo--portrait')&&agent.includes('ORDEM_ATTRIBUTES.map'),'A aba Agente deve posicionar os atributos ao redor da foto');
assert.ok(!agent.includes('<span>ATRIBUTOS</span><small>consulta rápida</small>'),'Remover a seção ampla de atributos da aba Agente');
assert.ok(agent.includes("updateField('atributos.'+k,num(e.target.value))"),'Atributos na aba Agente continuam editáveis');
assert.ok(editor.includes("dice<=0?'2d20 ↓':dice+'d20'"),'Atributo zero usa 2d20 e seleciona o menor');
assert.ok(!editor.includes('{skillDice(id,attr)}d20'),'Não acrescentar d20 duplicado na formatação corrigida');
assert.ok(editor.includes("ORDEM_ATTRIBUTES.some(([key])=>key===chosen)?chosen:fallback"),'Atributo-base inválido não deve quebrar o cálculo das perícias');
assert.ok(css.includes('.ordem-attrs.ordem-attrs--portrait')&&css.includes('.ordem-pdf-portrait-orbit'),'O CSS deve tratar retrato e atributos nos dois modos');
assert.ok(css.includes('@media(max-width:850px)')&&css.includes('@media(max-width:650px)'),'O layout deve reorganizar-se em telas estreitas');
assert.match(css,/\.ordem-sheet \.ordem-skill-head,\.ordem-sheet \.ordem-skill\{\s*grid-template-columns:[^}]*!important;/,'Cabeçalho e linhas devem compartilhar seis colunas');
for(const [key] of ORDEM_ATTRIBUTES){
 assert.ok(css.includes('[data-ordem-attribute="'+key+'"]'),'Posição de '+key+' ausente no layout orbital');
}
const saved=structuredClone(initialOrdemPcData);
saved.bio.imagem='data:image/png;base64,TESTE';
saved.atributos={agi:0,for:3,int:4,pre:1,vig:2};
saved.pericias.acrobacia={grau:10,outros:2,atributoBase:'agi'};
saved.notas='Personagem veterano salvo na nuvem';
const untouched=structuredClone(saved);
const normalized=normalizeOrdemPcData(saved);
assert.deepEqual(saved,untouched,'Não alterar o objeto original ao abrir dados salvos');
assert.equal(normalized.atributos.agi,0,'Não substituir atributo zero por 1');
assert.equal(normalized.bio.imagem,'data:image/png;base64,TESTE');
assert.deepEqual(normalized.atributos,untouched.atributos,'Manter todos os valores de atributos antigos');
assert.equal(normalized.pericias.acrobacia.grau,10,'Manter perícias existentes');
assert.equal(normalized.notas,untouched.notas,'Manter anotações existentes');
console.log('✓ Ordem Paranormal: retrato central, cinco atributos compactos, perícias e dados legados preservados.');
