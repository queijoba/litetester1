import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORDEM_BASIC_BESTIARY} from '../src/systems/ordemParanormal/basicBestiary.js';
import {ORDEM_SAH_BESTIARY} from '../src/systems/ordemParanormal/sahBestiary.js';
import {MODELOS_ORDEM_AMEACAS,GRUPOS_ORDEM_AMEACAS} from '../src/systems/ordemParanormal/threatModels.js';
import {AS03_HEXATOMBE_THREAT_MODELS} from '../src/systems/ordemParanormal/as03ThreatModels.js';
import {normalizeOrdemThreatData} from '../src/systems/ordemParanormal/threatData.js';

assert.equal(ORDEM_BASIC_BESTIARY.length,67,'Livro Básico: 49 criaturas/reliquias e 18 ameaças da Realidade');
assert.equal(ORDEM_SAH_BESTIARY.length,30,'Sobrevivendo ao Horror: novas criaturas, pessoas, animais e O Terminal');
assert.equal(AS03_HEXATOMBE_THREAT_MODELS.length,18,'Preservar catálogo Hexatombe');
assert.equal(MODELOS_ORDEM_AMEACAS.length,118,'Todos os modelos + 3 exemplos locais');
const names=new Set();
for(const x of [...ORDEM_BASIC_BESTIARY,...ORDEM_SAH_BESTIARY]){
 assert.ok(!names.has(x.fonte+'/'+x.nome),'Não duplicar fichas por fonte e nome');
 names.add(x.fonte+'/'+x.nome);
 assert.ok(x.pagina&&x.fonte&&Number.isFinite(x.vd)&&x.vd>=0,'Fonte, página e VD obrigatórios: '+x.nome);
 assert.ok(x.status?.pvMax>0&&x.status?.pvAtual===x.status.pvMax,'PV referenciado no livro: '+x.nome);
 if(x.nome!=='Anomalia')assert.ok(Number(x.status.defesa)>0,'Defesa referenciada: '+x.nome);
 assert.ok(x.dadosParciais===true,'Avisar sobre ações/efeitos ainda não transcritos no modelo');
 assert.equal(Object.keys(x.atributos||{}).length,5,'Atributos presentes: '+x.nome);
 const restored=normalizeOrdemThreatData(structuredClone(x));
 assert.equal(restored.vd,x.vd,'VD deve persistir');
 assert.equal(restored.status.pvMax,x.status.pvMax,'PV deve persistir');
 assert.equal(restored.nome,x.nome,'Nome deve persistir');
}
const select=(name)=>MODELOS_ORDEM_AMEACAS.find(x=>x.nome===name);
assert.deepEqual([select('Anfitrião').vd,select('Anfitrião').status.pvMax],[413,1413]);
assert.deepEqual([select('Degolificada').vd,select('Degolificada').status.defesa],[320,45]);
assert.deepEqual([select('Medusa').vd,select('Medusa').status.pvMax],[320,380]);
assert.deepEqual([select('O Terminal').vd,select('O Terminal').status.pvMax],[260,700]);
assert.deepEqual([select('Sepultado').vd,select('Sepultado').status.pvMax],[20,50]);
assert.deepEqual([select('Anomalia').vd,select('Anomalia').status.defesa],[380,''],'Anomalia não possui Defesa numérica');
assert.equal(GRUPOS_ORDEM_AMEACAS.reduce((n,g)=>n+g.items.length,0),118,'Cada ameaça em um único grupo');
for(const g of GRUPOS_ORDEM_AMEACAS){
 assert.ok(g.items.every((x,i,a)=>!i||x.vd>=a[i-1].vd),'VD crescente por elemento');
}
const modal=readFileSync('scripts/apply-final-systems.mjs','utf8');
const catalog=readFileSync('src/components/ThreatCatalog.jsx','utf8');
const editor=readFileSync('src/systems/ordemParanormal/components/ThreatEditor.jsx','utf8');
assert.ok(modal.includes('groups={GRUPOS_ORDEM_AMEACAS}')&&modal.includes('system="ordemParanormal"'),'Modal Ordem usa o catálogo filtrável');
for(const label of ['Filtrar livro ou suplemento','Filtrar elemento paranormal','VD mínimo','VD máximo','Ordenar por VD','Limpar filtros']){
 assert.ok(catalog.includes(label),'Filtro do catálogo ausente: '+label);
}
assert.ok(catalog.includes("isOrdem=system==='ordemParanormal'"),'Não mudar experiência de outros sistemas');
assert.ok(editor.includes('data.dadosParciais')&&editor.includes('Abrir livro no Google Drive'),'Avisar sobre resumos e fontes');
console.log('✓ Ordem: 67 Livro Básico + 30 Sobrevivendo ao Horror + 18 Hexatombe + 3 exemplos; filtros e referências preservados.');

const catalogCss=readFileSync('src/systems/ordemParanormal/ordem-theme.css','utf8');
assert.ok(modal.includes('ordem-threat-catalog-modal')&&modal.includes('ordem-catalog-modal-header'),'Apenas seleção de ameaças usa o dossiê claro');
assert.ok(catalog.includes('OrdemGroupIcon')&&catalog.includes('ordemElements(modelo)')&&catalog.includes('kind="type"'),'Ícones no título, nos tipos e em cada elemento');
for(const key of ['sangue','morte','conhecimento','energia','medo','nenhum','criatura','pessoa','animal','reliquia']){
 assert.ok(catalog.includes(key+":"),'Pictograma definido: '+key);
}
assert.ok(catalogCss.includes('background:#f4ecd9!important;color:#282219!important'),'Modal tem fundo claro e texto escuro explícitos');
assert.ok(catalogCss.includes('.ordem-threat-catalog>section>div:first-child'),'Cabeçalhos dos grupos contrastantes');
console.log('✓ Ordem: bestiário claro e pictogramas acessíveis por elemento e tipo.');
