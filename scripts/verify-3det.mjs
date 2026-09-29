import { readFile } from 'node:fs/promises';
import { TRESDET_SKILLS, initial3DetPcData, normalize3DetPcData } from '../src/systems/3det/data.js';
import { generate3DetChatText } from '../src/systems/3det/chat.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`3DeT: ${message}`);
};

assert(TRESDET_SKILLS.length === 12, 'a lista padrão deve manter 12 perícias.');
assert(initial3DetPcData.system === '3det' && initial3DetPcData.type === 'pc', 'modelo inicial inválido.');
assert(Array.isArray(initial3DetPcData.periciasPersonalizadas), 'modelo inicial sem perícias personalizadas.');
assert(Array.isArray(initial3DetPcData.especializacoes), 'modelo inicial sem especializações.');

const legacy = normalize3DetPcData({
  id: 'legacy-test',
  system: '3det',
  type: 'pc',
  bio: { nome: 'Teste Legado' },
  pericias: { luta: true },
});
assert(legacy.pericias.luta === true, 'save legado perdeu perícia oficial.');
assert(Array.isArray(legacy.periciasPersonalizadas) && legacy.periciasPersonalizadas.length === 0, 'save legado não recebeu lista personalizada segura.');
assert(Array.isArray(legacy.especializacoes) && legacy.especializacoes.length === 0, 'save legado não recebeu especializações seguras.');

const normalized = normalize3DetPcData({
  id: 'full-test',
  system: '3det',
  type: 'pc',
  bio: { nome: 'Heroína Teste', arquetipo: 'Aventureira', kit: 'Opcional' },
  pontos: 10,
  xp: 2,
  atributos: { poder: 2, habilidade: 3, resistencia: 1 },
  status: {
    pa: { atual: 2, max: 2 },
    pm: { atual: 10, max: 15 },
    pv: { atual: 5, max: 5 },
  },
  pericias: { luta: true, percepcao: true },
  periciasPersonalizadas: [
    { id: 'custom-a', nome: 'Pilotagem de Mecha', selecionada: true },
    { id: 'custom-b', nome: 'pilotagem de mecha', selecionada: true },
    { id: 'custom-c', nome: 'Culinária Dimensional', selecionada: false },
  ],
  especializacoes: [
    { nome: 'Tiro à distância', periciaBase: 'Luta', notas: 'Especialização de teste.' },
  ],
  vantagens: [{ nome: 'Ágil', custo: '1', desc: 'Teste' }],
  desvantagens: [{ nome: 'Código', valor: '-1', desc: 'Teste' }],
  tecnicas: [{ nome: 'Golpe Teste', custo: '2PM', desc: 'Teste' }],
  inventario: [{ nome: 'Poção', quantidade: 2, raridade: 'Comum', notas: 'Teste' }],
});

assert(normalized.periciasPersonalizadas.length === 2, 'normalização não removeu duplicata de perícia personalizada.');
assert(normalized.periciasPersonalizadas[0].selecionada === true, 'perícia personalizada ativa foi perdida.');
assert(normalized.periciasPersonalizadas[1].selecionada === false, 'estado desmarcado da perícia personalizada foi perdido.');
assert(normalized.especializacoes[0]?.periciaBase === 'Luta', 'especialização perdeu a perícia-base.');

const chat = generate3DetChatText(normalized);
for (const token of ['3DeT VICTORY', 'Luta', 'Percepção', 'Pilotagem de Mecha', 'ESPECIALIZAÇÕES', 'Tiro à distância', 'Golpe Teste', 'Poção']) {
  assert(chat.includes(token), `Ficha Chat não contém ${token}.`);
}
assert(!chat.includes('Culinária Dimensional'), 'Ficha Chat incluiu perícia personalizada desmarcada.');

const integration = await readFile('src/systems/3det/integration.js', 'utf8');
for (const token of ['Tema: 3DeT Victory', 'Guias e Tutoriais', 'PJ Lite 0.8.0v Alpha', 'MutationObserver', 'GUIDE_MODAL_ID']) {
  assert(integration.includes(token), `integração visual incompleta: ${token}`);
}

const theme = await readFile('src/systems/3det/3det-theme.css', 'utf8');
for (const token of ['body.theme-3det', '.tresdet-sheet', 'body.theme-dark .tresdet-sheet', '@media (max-width: 520px)']) {
  assert(theme.includes(token), `tema incompleto: ${token}`);
}

const main = await readFile('src/main.jsx', 'utf8');
assert(main.includes("./systems/3det/integration.js"), 'main.jsx não carrega a integração do tema/guia.');

console.log('3DeT Victory: modelo, migração de saves, perícias, especializações, Ficha Chat, tema e guia verificados com sucesso.');
