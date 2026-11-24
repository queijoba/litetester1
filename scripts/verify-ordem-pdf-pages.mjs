import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORDEM_ATTRIBUTES,ORDEM_SKILLS,initialOrdemPcData,normalizeOrdemPcData} from '../src/systems/ordemParanormal/data.js';

const editor=readFileSync('src/systems/ordemParanormal/components/CharacterEditor.jsx','utf8');
const pages=readFileSync('src/systems/ordemParanormal/components/PdfPages.jsx','utf8');
const css=readFileSync('src/systems/ordemParanormal/ordem-theme.css','utf8');
const map=readFileSync('src/systems/ordemParanormal/pdf/map.js','utf8');
const template=readFileSync('src/systems/ordemParanormal/pdf/export.js','utf8');

assert.equal(ORDEM_ATTRIBUTES.length,5,'Cinco atributos da ficha');
assert.equal(ORDEM_SKILLS.length,28,'28 perícias do PDF Sobrevivendo ao Horror');
assert.equal(new Set(ORDEM_SKILLS.map(x=>x[0])).size,28,'Perícias sem duplicatas');
assert.ok(!editor.includes("['pdf1','Folha 1 · PDF']")&&!editor.includes("['pdf2','Folha 2 · PDF']"),'Não reintroduzir abas de folhas duplicadas na navegação');
assert.ok(editor.includes("useState('agente')"),'Abrir diretamente no dossiê de agente');
assert.ok(editor.includes('ordem-dossier-content')&&editor.includes('ordem-dossier-record'),'Dossiê mostra registro principal e mantém campos narrativos acessíveis');
assert.ok(editor.includes("['agente','Agente']")&&editor.includes("['pericias','Perícias']")&&editor.includes("['combate','Combate']")&&editor.includes("['poderes','Poderes & Rituais']")&&editor.includes("['inventario','Inventário']"),'Abas originais continuam disponíveis');
assert.ok(editor.includes('role="tablist"')&&editor.includes('aria-selected={tab===id}'),'Navegação acessível');
assert.ok(pages.includes('page===\'pdf2\'?<ContinuationPage'),'Modelo auxiliar das duas folhas continua preservado em código, sem abas de navegação');
assert.ok(pages.includes('ordem-pdf-attributes--orbit')&&pages.includes('ordem-pdf-attributes-core'),'Cinco atributos dispostos radialmente como o PDF');
assert.ok(pages.includes('data-ordem-attribute={id}')&&pages.includes('aria-label="Cinco atributos do agente'),'Campos radiais continuam identificados e acessíveis');
for(const key of ['agi','for','int','pre','vig']){
 assert.ok(css.includes('[data-ordem-attribute="'+key+'"]'),'Posição específica do atributo '+key);
}
assert.ok(css.includes('.ordem-pdf-attributes--orbit')&&css.includes('.ordem-pdf-attributes-core'),'Círculo central no CSS');
assert.ok(css.includes('.ordem-pdf-description-grid'),'Quatro campos narrativos na folha 2');
assert.ok(pages.includes("['aparencia','APARÊNCIA']")&&pages.includes("['personalidade','PERSONALIDADE']")&&pages.includes("['historico','HISTÓRICO']")&&pages.includes("['objetivo','OBJETIVO']"),'Áreas narrativas conforme o PDF');
assert.ok(pages.includes("updateField('bio.'+key,e.target.value)"),'Áreas narrativas devem persistir na ficha original');

for(const field of ['bio.nome','bio.origem','bio.classe','bio.trilha','bio.patente','bio.nex','status.defesaEquip','status.defesaOutros','status.bloqueio','status.esquiva','status.deslocamento','gestao.prestigio','gestao.limiteItens','gestao.limiteCredito','gestao.cargaMax','status.limitePePd','notas']){
 assert.ok(pages.includes(field),'Falta vínculo de campo do PDF: '+field);
}
for(const field of ['ataques','inventario','habilidades','poderesParanormais','rituais']){
 assert.ok(pages.includes("addArray('"+field+"'")||pages.includes('addArray(kind,'),'Adicionar '+field);
 assert.ok(pages.includes('removeArray'),'Remover '+field);
}
assert.ok(pages.includes("ORDEM_SKILLS.map"),'Lista completa de perícias editável na folha 1');
assert.ok(pages.includes("2d20 ↓"),'Atributo zero segue regra dos dois dados, menor');
assert.ok(pages.includes('T_ONLY')&&pages.includes('LOAD_PENALTY'),'Marcar perícias de treino obrigatório e penalidade de carga');
assert.ok(pages.includes('Treino + outros = bônus do teste'),'Exibir cálculo do bônus');
assert.ok(pages.includes("s.recursoMental==='pd'"),'Respeitar variante opcional de Determinação');
assert.ok(pages.includes('FICHA DE AGENTE')&&pages.includes('HABILIDADES & INVENTÁRIO'),'Estrutura das duas folhas');
assert.ok(pages.includes('PONTOS DO AGENTE')&&pages.includes('ATAQUES')&&pages.includes('PERÍCIAS'),'Folha 1 completa');
assert.ok(pages.includes('INVENTÁRIO')&&pages.includes('HABILIDADES')&&pages.includes('RITUAIS CONHECIDOS')&&pages.includes('EVOLUÇÃO DO PERSONAGEM'),'Folha 2 completa');
assert.ok(pages.includes("['area','Área']"),'Campo Área visível na folha 2');
assert.ok(editor.includes("placeholder=\"Área\""),'Campo Área também na edição de rituais detalhada');
assert.ok(map.includes('x.execucao,x.alcance,x.area,x.duracao'),'Área segue para a exportação PDF existente');
assert.ok(template.includes('ordem-sah-template.pdf'),'Modelo PDF exportado original foi preservado');
assert.ok(css.includes('.ordem-pdf-skills-table')&&css.includes('.ordem-pdf-page1-layout')&&css.includes('.ordem-pdf-page2-layout'),'Layout das duas folhas');
assert.ok(css.includes('@media(max-width:650px)')&&css.includes('overflow-x:auto'),'Tabelas consultáveis em celular sem corte');
assert.ok(css.includes('break-inside:avoid'),'Seções evitam quebra na impressão');
const legacy=structuredClone(initialOrdemPcData);
legacy.bio.nome='Agente existente';
legacy.rituais=[{nome:'Ritual antigo',circulo:2,desc:'Nota particular',alcance:'Perto'}];
legacy.pericias.percepcao={grau:10,outros:3,atributoBase:'pre'};
legacy.notas='Manter investigação';
const snapshot=structuredClone(legacy);
const normalized=normalizeOrdemPcData(legacy);
assert.deepEqual(legacy,snapshot,'Normalização não pode mutar fichas salvas');
assert.equal(normalized.rituais[0].nome,'Ritual antigo');
assert.equal(normalized.rituais[0].area,'','Campo Área novo e vazio na ficha antiga');
assert.equal(normalized.rituais[0].desc,'Nota particular');
assert.equal(normalized.pericias.percepcao.grau,10);
assert.equal(normalized.notas,'Manter investigação');
for(const field of ['aparencia','personalidade','historico','objetivo']){
 assert.equal(normalized.bio[field],'','Ficha antiga recebe descrição vazia sem alterar outros dados: '+field);
}
const narrative=normalizeOrdemPcData({...legacy,bio:{...legacy.bio,aparencia:'Capa de chuva cinza',personalidade:'Desconfiado',historico:'Caso do hospital',objetivo:'Encontrar a verdade'}});
assert.equal(narrative.bio.aparencia,'Capa de chuva cinza');
assert.equal(narrative.bio.personalidade,'Desconfiado');
assert.equal(narrative.bio.historico,'Caso do hospital');
assert.equal(narrative.bio.objetivo,'Encontrar a verdade');
assert.equal(narrative.notas,'Manter investigação','Novas descrições não substituem anotações existentes');

const edited=normalizeOrdemPcData({...legacy,rituais:[{...legacy.rituais[0],area:'9m de raio'}]});
assert.equal(edited.rituais[0].area,'9m de raio','Persistir Área sem perda');
console.log('✓ Ordem Paranormal: 2 folhas editáveis próximas ao PDF SaH; 28 perícias, campos, mobile, legado e exportação preservados.');
