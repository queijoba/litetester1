import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORDEM_ATTRIBUTES} from '../src/systems/ordemParanormal/data.js';
import {initialOrdemThreatData,normalizeOrdemThreatData} from '../src/systems/ordemParanormal/threatData.js';
import {MODELOS_ORDEM_AMEACAS} from '../src/systems/ordemParanormal/threatModels.js';
import {AS03_HEXATOMBE_THREAT_MODELS} from '../src/systems/ordemParanormal/as03ThreatModels.js';
import {AS03_NEW_LIBRARY_ENTRIES} from '../src/systems/ordemParanormal/as03RevisionIndex.js';
import {ORDEM_LIBRARY_CATALOG,ORDEM_LIBRARY_COUNTS} from '../src/systems/ordemParanormal/libraryCatalog.js';
import {buildThreatCardData} from '../src/components/threatCardData.js';

const threat=readFileSync('src/systems/ordemParanormal/components/ThreatEditor.jsx','utf8');
const css=readFileSync('src/systems/ordemParanormal/ordem-theme.css','utf8');
const modal=readFileSync('src/systems/ordemParanormal/OrdemLibraryModal.jsx','utf8');
assert.equal(ORDEM_ATTRIBUTES.length,5);
for(const k of ['ordem-threat-dossier','ordem-dossier-hero','ordem-threat-profile','ordem-attrs--portrait','ordem-dossier-identity','ordem-identity-grid'])
 assert.ok(threat.includes(k),'Dossiê de ameaça incompleto: '+k);
assert.ok(threat.includes("updateField('imagem',image)")&&threat.includes("updateField('imagem','')"),'É preciso poder adicionar e remover o retrato');
assert.ok(threat.includes("updateField('fonte',v)")&&threat.includes("updateField('pagina',v)"),'Fonte e página editáveis');
for(const key of ['percepcao','iniciativa','fortitude','reflexos','vontade'])
 assert.ok(threat.includes("['"+key+"'"),'Perícia da ameaça omitida: '+key);
for(const key of ['critico','alcance','enigmaMedo','imunidades','vulnerabilidades'])
 assert.ok(threat.includes(key),'Campo antigo da ameaça perdido: '+key);
assert.ok(css.includes('ordem-sheet.ordem-threat-dossier')&&css.includes('@container (max-width: 525px)'),'Estilo do dossiê e responsividade');
assert.ok(threat.includes('ordem-threat-operational-grid')&&threat.includes("updateField('descricao',v)"),'Dados operacionais compactos e descrição editável');
assert.ok(threat.includes('HEXATOMBE · PARTE 1')&&threat.includes('HEXATOMBE · PARTE 2'),'Avisos de fonte e limites do acervo');
assert.ok(css.includes('.ordem-threat-operational-grid'),'Recursos e perícias em colunas');
assert.ok(!threat.includes('Folha 1')&&!threat.includes('Folha 2'),'Não criar páginas duplicadas na ameaça');
assert.equal(ORDEM_LIBRARY_CATALOG.length,295);
assert.equal(ORDEM_LIBRARY_COUNTS.ritual,107);
assert.equal(AS03_NEW_LIBRARY_ENTRIES.length,7,'Uma opção geral e seis poderes de sacrifício');
const idx=new Map(ORDEM_LIBRARY_CATALOG.map(x=>[x.id,x]));
assert.equal(idx.size,ORDEM_LIBRARY_CATALOG.length,'IDs de biblioteca devem permanecer exclusivos');
assert.ok(ORDEM_LIBRARY_CATALOG.some(x=>x.nome==='Papinho Sedutor'&&x.fonte==='Arquivos Secretos #03'&&x.pagina==='108'));
assert.ok(ORDEM_LIBRARY_CATALOG.some(x=>x.nome==='Fruto da Ambição'&&x.requisito.includes('sacrifício do Desejo')));
const trail=ORDEM_LIBRARY_CATALOG.find(x=>x.nome==='Combatente Performático'&&x.fonte==='Arquivos Secretos #03');
assert.deepEqual(trail.progressao.map(x=>x.nex),[10,40,65,99]);
assert.equal(trail.classe,'Geral','Trilha geral oficial admite as 3 classes');
assert.ok(ORDEM_LIBRARY_CATALOG.some(x=>x.nome==='Conhecimento de Direção Precognitiva'&&x.pagina==='108'));
assert.ok(modal.includes('archive03Reference')&&modal.includes('Consultar Hexatombe Parte 2'));
assert.ok(modal.includes('Hexatombe — Parte 1 (PDF v1.1)')&&!modal.includes('Não localizei um PDF de regras completo'));
assert.equal(AS03_HEXATOMBE_THREAT_MODELS.length,18,'Todos os 18 blocos Pessoa do Hexatombe Parte 2');
assert.equal(new Set(AS03_HEXATOMBE_THREAT_MODELS.map(x=>x.nome)).size,18,'Personagens sem duplicatas');
for(const m of AS03_HEXATOMBE_THREAT_MODELS){
 assert.ok(m.fonte.includes('Arquivos Secretos #03')&&m.pagina&&m.descricao);
 assert.ok(Number.isFinite(m.vd)&&Number.isFinite(m.status.pvMax)&&Number.isFinite(m.status.defesa));
 assert.equal(Object.keys(m.atributos).length,5);
}
const al=AS03_HEXATOMBE_THREAT_MODELS.find(x=>x.nome==='Alê');
const es=AS03_HEXATOMBE_THREAT_MODELS.find(x=>x.nome==='Escarlata');
assert.deepEqual([al.vd,al.status.pvMax,al.status.defesa],[80,45,28]);
assert.deepEqual([es.vd,es.status.pvMax,es.status.defesa],[120,100,28]);
assert.ok(MODELOS_ORDEM_AMEACAS.length>=21,'Modelos anteriores somados aos 18 de #03');
for(const [nome,vd,pv,defesa] of [['Eloy',80,70,16],['Argano',100,120,26],['Chispa',100,90,26],['Torvo',20,30,21],['Harpia',80,100,22],['Suellen',20,30,15]]){
 const model=AS03_HEXATOMBE_THREAT_MODELS.find(x=>x.nome===nome);
 assert.ok(model,'Falta modelo '+nome);
 assert.deepEqual([model.vd,model.status.pvMax,model.status.defesa],[vd,pv,defesa], 'Valores do suplemento: '+nome);
}
assert.equal(AS03_HEXATOMBE_THREAT_MODELS.find(x=>x.nome==='Chispa').status.deslocamento,'15 m');
assert.equal(AS03_HEXATOMBE_THREAT_MODELS.find(x=>x.nome==='Torvo').status.deslocamento,'0 m');
const legacy=structuredClone(initialOrdemThreatData);
legacy.nome='Anomalia do usuário';legacy.imagem='data:image/png;base64,preservar';
legacy.status.pvAtual=6;legacy.atributos.int=0;legacy.notas='Segredo que não pode sumir';
const original=structuredClone(legacy),restored=normalizeOrdemThreatData(legacy);
assert.deepEqual(legacy,original,'Normalização não altera dados salvos');
assert.equal(restored.atributos.int,0,'Atributo zero é válido');
assert.equal(restored.imagem,original.imagem);
assert.equal(restored.notas,original.notas);
assert.equal(restored.status.pvAtual,6);
const info=buildThreatCardData({...restored,fonte:'Arquivos Secretos #03',pagina:'68',nome:'Ameaça de teste'});
assert.ok(info.details.some(([label,value])=>label==='Fonte'&&value.includes('p. 68')),'Card de impressão também referencia página');
console.log('✓ Ordem Paranormal: dossiê de ameaças, Hexatombe #02 revisado, suplemento #03, modelos, fichas legadas e impressão.');
