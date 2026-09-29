import { readFile, stat } from 'node:fs/promises';

const requiredFiles = [
  'src/main.jsx',
  'src/PJLiteApp.jsx',
  'src/pjlite.css',
  'src/mobile-polish.css',
  'src/mobile-systems-v8.css',
  'src/systems/registry.js',
  'src/systems/dragonbane/index.js',
  'src/systems/dragonbane/components/Editor.jsx',
  'src/systems/dragonbane/pdf/export.js',
  'src/systems/dragonbane/pdf/map.js',
  'src/systems/dnd5e/index.js',
  'src/systems/dnd5e/classPanels.js',
  'src/systems/dnd5e/components/CharacterEditor.jsx',
  'src/systems/dnd5e/components/CharacterEditorBase.jsx',
  'src/systems/dnd5e/components/ThreatEditor.jsx',
  'src/systems/dnd5e/dnd-sheet-v7.css',
  'src/systems/dnd5e/pdf/export.js',
  'src/systems/dnd5e/pdf/map.js',
  'src/systems/fabulaUltima/index.js',
  'src/systems/fabulaUltima/components/CharacterEditor.jsx',
  'src/systems/fabulaUltima/components/ThreatEditor.jsx',
  'src/systems/fabulaUltima/pdf/base.js',
  'src/systems/fabulaUltima/pdf/map.js',
  'src/systems/fabulaUltima/pdf/export.js',
  'src/systems/somDasSeis/index.js',
  'src/systems/somDasSeis/components/CharacterEditor.jsx',
  'src/systems/somDasSeis/components/ThreatEditor.jsx',
  'src/systems/somDasSeis/pdf/base.js',
  'src/systems/somDasSeis/pdf/map.js',
  'src/systems/somDasSeis/pdf/export.js',
  'src/systems/3det/index.js',
  'src/systems/3det/data.js',
  'src/systems/3det/chat.js',
  'src/systems/3det/components/CharacterEditor.jsx',
  'public/pdfs/dragonbane-template.pdf',
  'public/pdfs/dnd5e-template.pdf',
  'public/pdfs/FU_Ficha_de_personagemV2.pdf',
  'public/pdfs/som-das-seis-template.pdf',
];

for (const file of requiredFiles) {
  const info = await stat(file).catch(() => null);
  if (!info?.isFile()) throw new Error(`Arquivo obrigatório ausente: ${file}`);
  if (info.size === 0) throw new Error(`Arquivo obrigatório vazio: ${file}`);
}

for (const pdfPath of [
  'public/pdfs/dragonbane-template.pdf',
  'public/pdfs/dnd5e-template.pdf',
  'public/pdfs/FU_Ficha_de_personagemV2.pdf',
  'public/pdfs/som-das-seis-template.pdf',
]) {
  const pdf = await readFile(pdfPath);
  if (pdf.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error(`${pdfPath} não parece ser um PDF válido.`);
  }
}

const main = await readFile('src/main.jsx', 'utf8');
if (!main.includes("./systems/dragonbane/index.js")) throw new Error('main.jsx não está usando o módulo do sistema Dragonbane.');
if (!main.includes("./systems/dnd5e/index.js") || !main.includes('installDndPdfExport')) throw new Error('main.jsx não está ativando a exportação PDF do D&D 5.5e.');
if (!main.includes("./systems/fabulaUltima/index.js") || !main.includes('installFabulaPdfExport')) throw new Error('main.jsx não está ativando a exportação PDF de Fabula Ultima.');
if (!main.includes("./systems/somDasSeis/index.js") || !main.includes('installSom6PdfExport')) throw new Error('main.jsx não está ativando a exportação PDF de O Som das Seis.');
if (!main.includes("./mobile-polish.css")) throw new Error('main.jsx não está carregando o polimento mobile pré-lançamento.');
if (!main.includes("./mobile-systems-v8.css")) throw new Error('main.jsx não está carregando a revisão mobile final dos sistemas.');

const dndPdfExport = await readFile('src/systems/dnd5e/pdf/export.js', 'utf8');
if (!dndPdfExport.includes('/pdfs/dnd5e-template.pdf') || dndPdfExport.includes('dnd55-template.part')) throw new Error('Exportador D&D não está usando diretamente o PDF real dnd5e-template.pdf.');
const fabulaPdfExport = await readFile('src/systems/fabulaUltima/pdf/export.js', 'utf8');
if (!fabulaPdfExport.includes('/pdfs/FU_Ficha_de_personagemV2.pdf') || !fabulaPdfExport.includes('retrato_personagem') || !fabulaPdfExport.includes('Campo testo 10210')) throw new Error('Exportador Fabula Ultima não está usando a ficha editável V2 de 3 páginas com retrato.');
const fabulaPdfMap = await readFile('src/systems/fabulaUltima/pdf/map.js', 'utf8');
for (const token of ['Nome', 'Campo testo 270', 'Campo testo 10207', 'Campo testo 253', 'Campo testo 243', 'Campo testo 10210', 'C208']) {
  if (!fabulaPdfMap.includes(token)) throw new Error(`Mapeamento do novo PDF Fabula Ultima incompleto: ${token}`);
}
const som6PdfExport = await readFile('src/systems/somDasSeis/pdf/export.js', 'utf8');
if (!som6PdfExport.includes('/pdfs/som-das-seis-template.pdf')) throw new Error('Exportador O Som das Seis não está usando o template definitivo.');

const app = await readFile('src/PJLiteApp.jsx', 'utf8');
if (!app.includes("versao: '0.8.0v Alpha'")) throw new Error('PJLiteApp.jsx não anuncia a versão 0.8.0v Alpha.');
if (!app.includes('Tutorial de 3 minutos')) throw new Error('Guias e Tutoriais não contêm o tutorial rápido da prévia.');
if (app.includes('Exibir código-fonte da página')) throw new Error('A orientação antiga de copiar o HTML ainda está presente.');
if (!app.includes('@ralseibaiano') || !app.includes('inabakaoru')) throw new Error('A orientação de contato para o código aberto está incompleta.');
if (!app.includes("initial3DetPcData") || !app.includes('TresDeTCharacterEditor') || !app.includes('generate3DetChatText')) throw new Error('PJLiteApp.jsx não está integrando completamente o 3DeT Victory.');

const indexHtml = await readFile('index.html', 'utf8');
if (!indexHtml.includes('0.8.0v Alpha') || !indexHtml.includes('3DeT Victory')) throw new Error('index.html não anuncia a prévia 0.8.0 com 3DeT Victory.');
for (const modulePath of [
  './systems/dragonbane/components/Editor.jsx',
  './systems/dnd5e/components/CharacterEditor.jsx',
  './systems/dnd5e/components/ThreatEditor.jsx',
  './systems/fabulaUltima/components/CharacterEditor.jsx',
  './systems/fabulaUltima/components/ThreatEditor.jsx',
  './systems/somDasSeis/components/CharacterEditor.jsx',
  './systems/somDasSeis/components/ThreatEditor.jsx',
  './systems/3det/components/CharacterEditor.jsx',
]) {
  if (!app.includes(modulePath)) throw new Error(`PJLiteApp.jsx não está usando o editor modular: ${modulePath}`);
}

const dndEditor = await readFile('src/systems/dnd5e/components/CharacterEditor.jsx', 'utf8');
const dndMobileCss = await readFile('src/systems/dnd5e/dnd-sheet-v7.css', 'utf8');
if (!dndEditor.includes('../dnd-sheet-v7.css')) throw new Error('O editor D&D não está usando a folha de estilo mobile mais recente.');
if (!dndEditor.includes('ClassWorkspace') || !dndEditor.includes('SpellWorkspace')) throw new Error('O editor D&D não contém os workspaces separados de classe e magias.');
for (const token of ['@media (max-width: 520px)', '@media (max-width: 430px)', 'overflow-x: clip', 'font-size: 16px', '.dnd-v6-wrapper .dnd-v3-skills-grid']) {
  if (!dndMobileCss.includes(token)) throw new Error(`Revisão mobile D&D incompleta: ${token}`);
}

const tresDetEditor = await readFile('src/systems/3det/components/CharacterEditor.jsx', 'utf8');
for (const token of ['3DeT', 'Poder', 'Habilidade', 'Resistência', 'TRESDET_SKILLS', 'TRESDET_RARITIES', 'bio.imagem']) {
  if (!tresDetEditor.includes(token)) throw new Error(`Editor 3DeT incompleto: ${token}`);
}
const tresDetData = await readFile('src/systems/3det/data.js', 'utf8');
for (const token of ['initial3DetPcData', 'normalize3DetPcData', "system: '3det'", 'animais', 'sobrevivencia']) {
  if (!tresDetData.includes(token)) throw new Error(`Modelo de dados 3DeT incompleto: ${token}`);
}

const mobilePolish = await readFile('src/mobile-polish.css', 'utf8');
for (const token of [
  '.dnd-v6-wrapper .dnd-v3-portrait-tools',
  '.fabula-portrait-frame > .absolute',
  '.fabula-bond-panel .bond-row',
  '.fabula-threat-editor',
  '.som6-paper > .pj-mobile-tabs',
  '.som6-sheet > .som6-frame:first-of-type > .grid',
  '@media (max-width: 430px)',
]) {
  if (!mobilePolish.includes(token)) throw new Error(`Polimento mobile incompleto: ${token}`);
}
if (mobilePolish.includes('.db-')) throw new Error('O polimento mobile geral não deve alterar seletores próprios de Dragonbane.');

const systemsMobileCss = await readFile('src/mobile-systems-v8.css', 'utf8');
for (const token of [
  '.db-bio .db-portrait',
  '.db-attributes-strip',
  '.fabula-profile-grid',
  '.fabula-attr-grid',
  '.fabula-threat-resource-grid',
  '.som6-paper > .pj-mobile-tabs',
  '.som6-sheet .grid.grid-cols-\\[1fr_92px\\]',
  "[class*='grid-cols-[1fr_70px_1fr_22px]']",
  '@media (max-width: 520px)',
  '@media (max-width: 400px)',
]) {
  if (!systemsMobileCss.includes(token)) throw new Error(`Revisão mobile final dos sistemas incompleta: ${token}`);
}

if (!app.includes('D&D 5.5e (2024) • revisado') || app.includes('novo sistema em adaptação')) throw new Error('Textos atuais de D&D ainda indicam uma etapa antiga de adaptação.');

const registry = await readFile('src/systems/registry.js', 'utf8');
if (!registry.includes("{ id: 'dnd5e', name: 'D&D 5.5e', status: 'active', enabled: true }")) throw new Error('Registro D&D não está identificado como D&D 5.5e.');
for (const id of ['dragonbane', 'dnd5e', 'fabulaUltima', 'somDasSeis', '3det']) {
  if (!registry.includes(`id: '${id}'`)) throw new Error(`Sistema ativo ausente do registro: ${id}`);
}
if (!registry.includes("{ id: '3det', name: '3DeT Victory', status: 'active', enabled: true }")) throw new Error('Registro 3DeT Victory não está ativo.');

console.log('PJ Lite: cinco sistemas ativos, quatro exportadores PDF, editores modulares e revisões mobile verificados com sucesso.');
