import { readFile } from 'node:fs/promises';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Temas: ${message}`);
};

const [legacy, polish, tresdet, integration, main] = await Promise.all([
  readFile('src/pjlite.css', 'utf8'),
  readFile('src/theme-polish.css', 'utf8'),
  readFile('src/systems/3det/3det-theme.css', 'utf8'),
  readFile('src/systems/3det/integration.js', 'utf8'),
  readFile('src/main.jsx', 'utf8'),
]);

const legacyThemes = ['theme-default', 'theme-classic', 'theme-dnd', 'theme-fabula', 'theme-som6', 'theme-dark', 'theme-custom'];
for (const theme of legacyThemes) {
  assert(legacy.includes(`body.${theme}`), `tema base ausente no CSS legado: ${theme}.`);
  assert(polish.includes(`body.${theme}`), `tema sem revisão visual complementar: ${theme}.`);
}

assert(tresdet.includes('body.theme-3det'), 'tema 3DeT não possui folha visual própria.');
assert(polish.includes('body.theme-3det'), 'tema 3DeT não participa da revisão visual global.');
assert(integration.includes("option.value = THEME_VALUE"), 'opção 3DeT não é criada no seletor de temas.');
assert(integration.includes("option.textContent = 'Tema: 3DeT Victory'"), 'rótulo do tema 3DeT ausente.');

for (const token of [
  'body.theme-dark .bg-zinc-50',
  'body.theme-dark .bg-amber-50',
  'body.theme-dark .bg-teal-50',
  'body.theme-som6 .bg-white',
  'body.theme-custom .text-gray-900',
  'body.theme-classic .bg-gray-300',
  'body.theme-dnd .bg-gray-300',
  'body.theme-fabula .bg-gray-300',
]) {
  assert(polish.includes(token), `correção de contraste ausente: ${token}.`);
}

assert(polish.includes('.pjlite-3det-guide-panel'), 'guia 3DeT sem ajuste responsivo na revisão visual.');
// main.jsx agora separa PJ Lite e DM Lite por rota. O tema do PJ pode ser carregado via import dinâmico,
// desde que continue depois da integração do 3DeT e apenas na rota principal.
assert(main.includes('./theme-polish.css'), 'theme-polish.css não está carregado no app.');
assert(main.indexOf('./theme-polish.css') > main.indexOf('./systems/3det/integration.js'), 'revisão visual deve ser carregada depois do tema 3DeT.');

console.log('Temas: Padrão, Clássico DB, D&D, Fabula Ultima, O Som das Seis, 3DeT Victory, Modo Escuro e Personalizado verificados.');
