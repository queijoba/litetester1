import { readFile, stat } from 'node:fs/promises';

const required = [
  'src/dm/DMLiteApp.jsx',
  'src/dm/dmlite.css',
  'src/dm/constants.js',
  'src/dm/storage.js',
  'src/dm/pjLiteBridge.js',
  'src/dm/presets.js',
  'vercel.json',
];

for (const file of required) {
  const info = await stat(file).catch(() => null);
  if (!info?.isFile() || info.size === 0) throw new Error(`DM Lite: arquivo obrigatório ausente ou vazio: ${file}`);
}

const main = await readFile('src/main.jsx', 'utf8');
for (const token of ["'/dm'", "./dm/DMLiteApp.jsx", './dm/dmlite.css']) {
  if (!main.includes(token)) throw new Error(`DM Lite: rota principal incompleta: ${token}`);
}

const app = await readFile('src/dm/DMLiteApp.jsx', 'utf8');
for (const token of ['Meus Escudos', 'Importar do PJ Lite', 'dm-workspace--mobile', 'TableWidget', 'NoteWidget', 'Iniciativa']) {
  if (!app.includes(token)) throw new Error(`DM Lite: recurso obrigatório ausente: ${token}`);
}

const constants = await readFile('src/dm/constants.js', 'utf8');
for (const token of ['dmlite_shields_v1', 'dmlite_current_shield_v1', 'dragonbane_saved_characters', 'dragonbane_saved_threats']) {
  if (!constants.includes(token)) throw new Error(`DM Lite: chave de armazenamento ausente: ${token}`);
}

const storage = await readFile('src/dm/storage.js', 'utf8');
for (const token of ['DMLITE2:', 'DMLITE1:', 'migrateShield']) {
  if (!storage.includes(token)) throw new Error(`DM Lite: persistência/migração incompleta: ${token}`);
}

const bridge = await readFile('src/dm/pjLiteBridge.js', 'utf8');
for (const token of ['decodePJLiteSeed', 'buildPJQuick', 'readPJLiteSaves']) {
  if (!bridge.includes(token)) throw new Error(`DM Lite: integração PJ Lite incompleta: ${token}`);
}

const css = await readFile('src/dm/dmlite.css', 'utf8');
for (const token of ['@media(max-width:760px)', '.dm-workspace--mobile', '.dm-widget', '.dm-note__paper']) {
  if (!css.includes(token)) throw new Error(`DM Lite: mobile/visual incompleto: ${token}`);
}

const vercel = await readFile('vercel.json', 'utf8');
if (!vercel.includes('/dm') || !vercel.includes('/index.html')) throw new Error('DM Lite: rewrite do Vercel ausente.');

console.log('DM Lite: rota /dm, saves, migração, integração PJ Lite e mobile próprios verificados.');
