import { readFile, stat } from 'node:fs/promises';

const requiredFiles = [
  'src/main.jsx',
  'src/PJLiteApp.jsx',
  'src/pjlite.css',
  'src/systems/registry.js',
  'src/systems/dragonbane/index.js',
  'src/systems/dragonbane/components/Editor.jsx',
  'src/systems/dragonbane/pdf/export.js',
  'src/systems/dragonbane/pdf/map.js',
  'src/systems/dnd5e/index.js',
  'src/systems/dnd5e/components/CharacterEditor.jsx',
  'src/systems/dnd5e/components/ThreatEditor.jsx',
  'src/systems/fabulaUltima/index.js',
  'src/systems/fabulaUltima/components/CharacterEditor.jsx',
  'src/systems/fabulaUltima/components/ThreatEditor.jsx',
  'src/systems/somDasSeis/index.js',
  'src/systems/somDasSeis/components/CharacterEditor.jsx',
  'src/systems/somDasSeis/components/ThreatEditor.jsx',
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
if (!main.includes("./systems/dragonbane/index.js")) {
  throw new Error('main.jsx não está usando o módulo do sistema Dragonbane.');
}

const app = await readFile('src/PJLiteApp.jsx', 'utf8');
for (const modulePath of [
  './systems/dragonbane/components/Editor.jsx',
  './systems/dnd5e/components/CharacterEditor.jsx',
  './systems/dnd5e/components/ThreatEditor.jsx',
  './systems/fabulaUltima/components/CharacterEditor.jsx',
  './systems/fabulaUltima/components/ThreatEditor.jsx',
  './systems/somDasSeis/components/CharacterEditor.jsx',
  './systems/somDasSeis/components/ThreatEditor.jsx',
]) {
  if (!app.includes(modulePath)) {
    throw new Error(`PJLiteApp.jsx não está usando o editor modular: ${modulePath}`);
  }
}

const registry = await readFile('src/systems/registry.js', 'utf8');
for (const id of ['dragonbane', 'dnd5e', 'fabulaUltima', 'somDasSeis']) {
  if (!registry.includes(`id: '${id}'`)) {
    throw new Error(`Sistema ativo ausente do registro: ${id}`);
  }
}

console.log('PJ Lite: estrutura essencial, editores modulares e módulos de sistemas verificados com sucesso.');
