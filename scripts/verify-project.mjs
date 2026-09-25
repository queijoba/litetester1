import { readFile, stat } from 'node:fs/promises';

const requiredFiles = [
  'src/main.jsx',
  'src/PJLiteApp.jsx',
  'src/pjlite.css',
  'src/features/pdf/dragonbane/export.js',
  'src/features/pdf/dragonbane/map.js',
  'public/pdfs/dragonbane-template.pdf',
];

for (const file of requiredFiles) {
  const info = await stat(file).catch(() => null);
  if (!info?.isFile()) {
    throw new Error(`Arquivo obrigatório ausente: ${file}`);
  }
  if (info.size === 0) {
    throw new Error(`Arquivo obrigatório vazio: ${file}`);
  }
}

const pdf = await readFile('public/pdfs/dragonbane-template.pdf');
if (pdf.subarray(0, 5).toString('ascii') !== '%PDF-') {
  throw new Error('public/pdfs/dragonbane-template.pdf não parece ser um PDF válido.');
}

const main = await readFile('src/main.jsx', 'utf8');
if (!main.includes("./features/pdf/dragonbane/export.js")) {
  throw new Error('main.jsx não está usando o exportador PDF modular do Dragonbane.');
}

console.log('PJ Lite: estrutura essencial verificada com sucesso.');
