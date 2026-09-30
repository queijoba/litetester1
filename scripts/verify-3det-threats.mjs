import { readFile } from 'node:fs/promises';
import { initial3DetThreatData, normalize3DetThreatData } from '../src/systems/3det/threatData.js';
import { MODELOS_3DET_NPCS, MODELOS_3DET_CRIATURAS } from '../src/systems/3det/threatModels.js';
import { generate3DetThreatChatText } from '../src/systems/3det/threatChat.js';

const assert = (condition, message) => { if (!condition) throw new Error(`3DeT Ameaças: ${message}`); };

assert(initial3DetThreatData.system === '3det' && initial3DetThreatData.type === 'ameaca', 'modelo inicial inválido.');
assert(MODELOS_3DET_NPCS.length === 4, 'devem existir quatro NPCs rápidos.');
assert(MODELOS_3DET_CRIATURAS.length === 4, 'devem existir quatro criaturas prontas.');

for (const model of [...MODELOS_3DET_NPCS, ...MODELOS_3DET_CRIATURAS]) {
  assert(model.system === '3det' && model.type === 'ameaca', `${model.nome} não é ameaça 3DeT.`);
  assert(model.nome && model.categoria && model.papel, 'modelo sem identificação completa.');
  assert(model.status?.pa && model.status?.pm && model.status?.pv, `${model.nome} sem recursos.`);
}

const normalized = normalize3DetThreatData({
  system: '3det', type: 'ameaca', nome: 'Teste', categoria: 'Criatura', papel: 'Rival', pontos: 12,
  atributos: { poder: '—', habilidade: 3, resistencia: 2 },
  pericias: { mistica: true },
  periciasPersonalizadas: [{ nome: 'Caça Dimensional', selecionada: true }, { nome: 'caça dimensional', selecionada: true }],
  vantagens: [{ nome: 'Teleporte', custo: '1', desc: 'Teste' }],
  acoes: [{ nome: 'Golpe Teste', custo: '1PM', desc: 'Teste' }],
});
assert(normalized.atributos.poder === '—', 'atributo nulo foi perdido.');
assert(normalized.pericias.mistica === true, 'perícia oficial foi perdida.');
assert(normalized.periciasPersonalizadas.length === 1, 'duplicata personalizada não foi removida.');

const chat = generate3DetThreatChatText(normalized);
for (const token of ['3DeT VICTORY', 'Teste', 'Mística', 'Caça Dimensional', 'Teleporte', 'Golpe Teste']) {
  assert(chat.includes(token), `Ficha Chat não contém ${token}.`);
}

const app = await readFile('src/PJLiteApp.jsx', 'utf8');
for (const token of [
  "./systems/3det/components/ThreatEditor.jsx",
  'normalize3DetThreatData',
  'generate3DetThreatChatText',
  'MODELOS_3DET_NPCS.map',
  'MODELOS_3DET_CRIATURAS.map',
  '<TresDeTThreatEditor scope={systemEditorScope} />',
  "sys === '3det' ? '3DeT Victory • Ameaça'",
]) assert(app.includes(token), `integração ausente: ${token}`);

console.log('3DeT Victory: Ameaças/NPCs, oito modelos, normalização, Ficha Chat e integração visual verificados com sucesso.');
