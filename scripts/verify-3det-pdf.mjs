import { readFile } from 'node:fs/promises';

const assert = (condition, message) => {
  if (!condition) throw new Error(`3DeT PDF: ${message}`);
};

const templatePath = 'public/pdfs/3DeT_Victory_PJlite_A4_Horizontal_Editavel (2).pdf';
const template = await readFile(templatePath);
assert(template.subarray(0, 5).toString('ascii') === '%PDF-', 'template não é um PDF válido.');
assert(template.length > 100_000, 'template parece incompleto ou vazio.');

const exportSource = await readFile('src/systems/3det/pdf/export.js', 'utf8');
for (const token of [
  '3DeT_Victory_PJlite_A4_Horizontal_Editavel%20(2).pdf',
  'retrato_personagem',
  'bio_nome',
  'pericia_linha_1',
  'install3DetPdfExport',
  'fill3DetPdf',
]) {
  assert(exportSource.includes(token), `exportador incompleto: ${token}`);
}

const mapSource = await readFile('src/systems/3det/pdf/map.js', 'utf8');
for (const token of [
  'bio_nome', 'bio_jogador', 'atributo_poder', 'atributo_habilidade', 'atributo_resistencia',
  'pa_atual', 'pm_atual', 'pv_atual', 'pericia_linha_7', 'vantagens', 'desvantagens',
  'tecnicas', 'kits', 'condicoes', 'inventario', 'anotacoes', 'especializacoes',
]) {
  assert(mapSource.includes(token), `mapeamento incompleto: ${token}`);
}

const indexSource = await readFile('src/systems/3det/index.js', 'utf8');
assert(indexSource.includes("export { install3DetPdfExport } from './pdf/export.js';"), 'index.js não expõe o exportador PDF.');

const main = await readFile('src/main.jsx', 'utf8');
assert(main.includes('install3DetPdfExport'), 'main.jsx não instala o exportador PDF do 3DeT.');

console.log('3DeT PDF: template A4 horizontal, mapeamento, retrato e integração do botão verificados com sucesso.');
