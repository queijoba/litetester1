import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MODELOS_ROTA_ZERO_BESTIARIO,MODELOS_ROTA_ZERO_NPCS} from '../src/systems/rotaZero/bestiaryCatalog.js';
import {MODELOS_ROTA_ZERO_AMEACAS,normalizeRotaZeroThreatData} from '../src/systems/rotaZero/threatData.js';
import {MODELOS_3DET_LIVRO,GRUPOS_3DET_LIVRO} from '../src/systems/3det/bookThreatCatalog.js';
import {MODELOS_3DET_NPCS,MODELOS_3DET_CRIATURAS} from '../src/systems/3det/threatModels.js';
import {normalize3DetThreatData} from '../src/systems/3det/threatData.js';
import {buildThreatCardData} from '../src/components/threatCardData.js';

assert.equal(MODELOS_ROTA_ZERO_BESTIARIO.length,13,'Livro RZ v0.5 lista 13 ameaças.');
assert.equal(MODELOS_ROTA_ZERO_NPCS.length,5,'Livro RZ v0.5 lista 5 NPCs.');
assert.equal(MODELOS_ROTA_ZERO_AMEACAS.length,2,'Exemplos preexistentes RZ continuam disponíveis.');
assert.equal(MODELOS_3DET_LIVRO.length,64,'Manual 3DeT traz 64 perfis no compêndio e nos núcleos.');
assert.equal(GRUPOS_3DET_LIVRO.length,10,'O índice deve incluir compêndio e cenários.');
assert.equal(MODELOS_3DET_NPCS.length,4);
assert.equal(MODELOS_3DET_CRIATURAS.length,4);
const unique=(rows)=>assert.equal(new Set(rows.map(x=>x.nome.toLocaleLowerCase('pt-BR'))).size,rows.length,'Duplicações no catálogo.');
unique(MODELOS_ROTA_ZERO_BESTIARIO);unique(MODELOS_ROTA_ZERO_NPCS);unique(MODELOS_3DET_LIVRO);
for(const entry of [...MODELOS_ROTA_ZERO_BESTIARIO,...MODELOS_ROTA_ZERO_NPCS]){
 assert.equal(entry.system,'rotaZero');
 assert.equal(entry.type,'ameaca');
 assert.ok(entry.fonte&&entry.pagina,'Toda ficha RZ precisa de referência.');
 assert.ok(Number.isFinite(entry.pressao));
 const item=normalizeRotaZeroThreatData(entry);
 assert.equal(item.nome,entry.nome);
 assert.equal(item.system,'rotaZero');
 assert.equal(buildThreatCardData(item).name,entry.nome);
}
for(const entry of MODELOS_3DET_LIVRO){
 assert.equal(entry.system,'3det');
 assert.equal(entry.type,'ameaca');
 assert.ok(entry.grupo&&entry.fonte,'Toda entrada 3DeT precisa de grupo e fonte.');
 assert.ok(Number.isFinite(entry.pontos));
 for(const k of ['poder','habilidade','resistencia'])assert.ok(Number.isFinite(entry.atributos[k]),entry.nome+' sem '+k);
 for(const k of ['pa','pm','pv'])assert.ok(entry.status?.[k]?.max>=0,entry.nome+' sem '+k);
 const item=normalize3DetThreatData(entry);
 assert.equal(item.nome,entry.nome);
 assert.equal(item.system,'3det');
 assert.equal(buildThreatCardData(item).name,entry.nome);
}
const rz=MODELOS_ROTA_ZERO_BESTIARIO.find(x=>x.nome==='Passageiro Vazio');
assert.equal(rz.defesa,12);assert.equal(rz.recursos.vitalidade.max,18);assert.equal(rz.ataques[0].dano,'2D6');
const entity=MODELOS_ROTA_ZERO_BESTIARIO.find(x=>x.nome==='O Retrovisor');
assert.equal(entity.recursos.vitalidade.max,0,'Anomalias sem PV não devem ganhar valores inventados.');
const kaiju=MODELOS_3DET_LIVRO.find(x=>x.nome==='Kaiju');
assert.equal(kaiju.escala,'Kiodai');assert.equal(kaiju.pontos,34);
const horda=MODELOS_3DET_LIVRO.find(x=>x.nome==='Horda Kobold');
assert.equal(horda.status.pm.max,0,'Horda não usa PM.');
const tatiane=MODELOS_3DET_LIVRO.find(x=>x.nome==='Tatiane, a Maior Nave da Frota Estelar');
assert.equal(tatiane.escala,'Kiodai');assert.equal(tatiane.pontos,120);
const app=readFileSync('src/PJLiteApp.jsx','utf8');
for(const token of ['ThreatCatalog','MODELOS_ROTA_ZERO_BESTIARIO','MODELOS_ROTA_ZERO_NPCS','MODELOS_3DET_LIVRO','GRUPOS_3DET_LIVRO']){
 assert.ok(app.includes(token),'Integração não encontrada: '+token);
}
const ui=readFileSync('src/components/ThreatCatalog.jsx','utf8');
assert.ok(ui.includes('Pesquisar modelos')&&ui.includes('ameaças'),'Pesquisa e filtros obrigatórios.');
console.log('✓ Bestiários: Rota Zero (13 ameaças + 5 NPCs) e 3DeT (64 perfis) validados; 10 modelos antigos mantidos.');
