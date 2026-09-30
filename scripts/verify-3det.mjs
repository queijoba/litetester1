import { readFile } from 'node:fs/promises';
import { TRESDET_SKILLS, initial3DetPcData, normalize3DetPcData } from '../src/systems/3det/data.js';
import { MODELOS_3DET_PC } from '../src/systems/3det/models.js';
import { generate3DetChatText } from '../src/systems/3det/chat.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`3DeT: ${message}`);
};

assert(TRESDET_SKILLS.length === 12, 'a lista padrão deve manter 12 perícias.');
assert(initial3DetPcData.system === '3det' && initial3DetPcData.type === 'pc', 'modelo inicial inválido.');
assert(Array.isArray(initial3DetPcData.periciasPersonalizadas), 'modelo inicial sem perícias personalizadas.');
assert(Array.isArray(initial3DetPcData.especializacoes), 'modelo inicial sem especializações.');

assert(MODELOS_3DET_PC.length === 4, 'devem existir quatro modelos prontos de personagem.');
const expectedModels = ['Sans', 'Saitama', 'Jotaro Kujo', 'Maka Albarn'];
for (const nome of expectedModels) {
  const model = MODELOS_3DET_PC.find((entry) => entry.bio?.nome === nome);
  assert(model, `modelo pronto ausente: ${nome}.`);
  assert(model.system === '3det' && model.type === 'pc', `${nome} não é uma ficha 3DeT de personagem.`);
  assert(model.pontos === 10, `${nome} deve permanecer como adaptação iniciante de 10 pontos.`);
  assert(model.status?.pa?.max === Math.max(1, Number(model.atributos?.poder || 0)), `${nome} tem PA incompatível com Poder.`);
  assert(model.status?.pm?.max === Math.max(1, Number(model.atributos?.habilidade || 0) * 5), `${nome} tem PM incompatível com Habilidade.`);
  assert(model.status?.pv?.max === Math.max(1, Number(model.atributos?.resistencia || 0) * 5), `${nome} tem PV incompatível com Resistência.`);
  assert(Array.isArray(model.vantagens) && model.vantagens.length > 0, `${nome} precisa ter ao menos uma vantagem.`);
  assert(Array.isArray(model.desvantagens) && model.desvantagens.length > 0, `${nome} precisa ter ao menos uma desvantagem.`);
}

const sans = MODELOS_3DET_PC.find((entry) => entry.bio?.nome === 'Sans');
assert(sans.atributos.resistencia === 0 && sans.status.pv.max === 1, 'Sans deve preservar a adaptação frágil com R0/1PV.');
assert(sans.pericias.mistica && sans.pericias.percepcao, 'Sans perdeu suas perícias principais.');

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
for (const token of [
  'Tema: 3DeT Victory',
  'Guias e Tutoriais',
  'PJ Lite 0.8.0v Alpha',
  'MutationObserver',
  'GUIDE_PANEL_ATTR',
  'pjlite-3det-guide-panel',
  'guideNeedsInitialScroll',
  "touchAction = 'pan-y'",
  'childList: true',
]) {
  assert(integration.includes(token), `integração visual incompleta: ${token}`);
}
assert(!integration.includes('GUIDE_MODAL_ID'), 'o guia 3DeT voltou a criar uma segunda janela/modal.');
assert(!integration.includes('aria-label="Guia 3DeT Victory"'), 'o guia 3DeT voltou a criar diálogo separado.');
assert(!integration.includes('attributes: true'), 'o guia 3DeT voltou a observar classes/atributos e pode travar a rolagem.');
assert((integration.match(/content\.scrollTop\s*=\s*0/g) || []).length === 1, 'a rolagem do guia está sendo reiniciada em mais de um ponto.');

const theme = await readFile('src/systems/3det/3det-theme.css', 'utf8');
for (const token of ['body.theme-3det', '.tresdet-sheet', 'body.theme-dark .tresdet-sheet', '@media (max-width: 520px)']) {
  assert(theme.includes(token), `tema incompleto: ${token}`);
}

const main = await readFile('src/main.jsx', 'utf8');
assert(main.includes("./systems/3det/integration.js"), 'main.jsx não carrega a integração do tema/guia.');
assert(main.includes("./theme-polish.css"), 'main.jsx não carrega a revisão visual global dos temas.');

const app = await readFile('src/PJLiteApp.jsx', 'utf8');
assert(app.includes("./systems/3det/models.js"), 'PJLiteApp não importa os modelos prontos do 3DeT.');
assert(app.includes('MODELOS_3DET_PC.map'), 'modal de criação não exibe os modelos prontos do 3DeT.');

console.log('3DeT Victory: modelo, migração de saves, perícias, especializações, Ficha Chat, tema, guia, rolagem mobile e quatro modelos prontos verificados com sucesso.');
