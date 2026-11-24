import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initialOrdemPcData,normalizeOrdemPcData,ORDEM_ATTRIBUTES} from '../src/systems/ordemParanormal/data.js';

const editor=readFileSync('src/systems/ordemParanormal/components/CharacterEditor.jsx','utf8');
const css=readFileSync('src/systems/ordemParanormal/ordem-theme.css','utf8');
const fixer=readFileSync('scripts/ensure-ordem-pdf-pages.mjs','utf8');
const tabs=editor.slice(editor.indexOf('const BASE_TABS='),editor.indexOf('export default function'));
const agent=editor.slice(editor.indexOf("{tab==='agente'"),editor.indexOf("{tab==='pericias'"));

assert.ok(tabs.includes("['agente','Agente']"),'Agente deve ser a primeira aba');
assert.ok(!tabs.includes('pdf1')&&!tabs.includes('pdf2'),'Não mostrar abas Folha PDF no editor');
assert.ok(editor.includes("useState('agente')"),'Abrir no dossiê de agente');
assert.ok(!editor.includes("<OrdemPdfPages page={tab}"),'As visualizações de Folha PDF não devem aparecer no editor');
assert.ok(agent.includes('ordem-dossier-headline')&&agent.includes('ordem-dossier-stamp')&&agent.includes('Dossiê do agente'),'Apresentação de arquivo confidencial');
assert.ok(agent.includes('ordem-agent-grid')&&agent.includes('ordem-attrs--portrait')&&agent.includes('ordem-dossier-identity'),'Retrato e atributos à esquerda, identificação à direita');
assert.ok(agent.includes('ordem-dossier-record')&&agent.includes('REGISTRO PESSOAL E PROTEÇÕES'),'Campos exclusivos das folhas continuam acessíveis');
for(const field of ['aparencia','personalidade','historico','objetivo']){
 assert.ok(agent.includes("['"+field+"',"),'Área narrativa preservada: '+field);
}
for(const field of ['protecao','resistencias']){
 assert.ok(agent.includes("updateField('"+field+"',"),'Campo anterior da folha acessível: '+field);
}
for(const [id] of ORDEM_ATTRIBUTES)assert.ok(css.includes('[data-ordem-attribute="'+id+'"]'),'Atributo '+id+' tem posição orbital');
assert.ok(css.includes('ordem-dossier-hero')&&css.includes('ordem-dossier-identity'),'Cores e identidade do dossiê aplicadas');
assert.ok(css.includes('@container (max-width: 525px)'),'O layout adapta ao espaço interno mesmo com barra lateral');
assert.ok(css.includes('grid-template-columns:minmax(192px,218px) minmax(0,1fr)'),'Desktop tem duas colunas, retrato à esquerda e dados à direita');
assert.ok(fixer.includes("const BASE_TABS=[['agente'"),'Preparador não pode reintroduzir folhas escondidas');
const original=structuredClone(initialOrdemPcData);
original.bio={...original.bio,nome:'Agente salvo',imagem:'data:image/png;base64,abc',historico:'Caso antigo',aparencia:'Cicatriz'};
original.atributos={agi:0,for:2,int:3,pre:1,vig:2};
original.protecao='Jaqueta';
original.resistencias='Fortitude treinada';
original.notas='Arquivo mantido';
const snapshot=structuredClone(original),normalized=normalizeOrdemPcData(original);
assert.deepEqual(original,snapshot,'Normalização não altera o objeto da nuvem');
assert.deepEqual(normalized.atributos,snapshot.atributos,'Atributos mantidos');
assert.equal(normalized.bio.imagem,snapshot.bio.imagem,'Retrato mantido');
assert.equal(normalized.bio.historico,snapshot.bio.historico,'Histórico mantido');
assert.equal(normalized.protecao,snapshot.protecao,'Proteção mantida');
assert.equal(normalized.resistencias,snapshot.resistencias,'Resistências mantidas');
assert.equal(normalized.notas,snapshot.notas,'Notas mantidas');
console.log('✓ Ordem Paranormal: dossiê em 2 colunas, sem folhas redundantes e sem perda de dados.');
