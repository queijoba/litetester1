import { readFile, writeFile } from 'node:fs/promises';

const read = (path) => readFile(path, 'utf8');
const write = (path, content) => writeFile(path, content, 'utf8');

function mustReplace(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Trecho não encontrado para ${label}`);
  return source.replace(from, to);
}

const appPath = 'src/PJLiteApp.jsx';
let app = await read(appPath);

const replacements = [
  ['<option value="dnd5e">D&D 5e</option>', '<option value="dnd5e">D&D 5.5e</option>', 'filtro D&D'],
  ["{isDnd ? 'D&D 5e' : isFabula ? 'Fabula Ultima' : isSom6 ? 'O Som das Seis' : 'Dragonbane'}", "{isDnd ? 'D&D 5.5e' : isFabula ? 'Fabula Ultima' : isSom6 ? 'O Som das Seis' : 'Dragonbane'}", 'badge de personagem D&D'],
  ["{sys === 'dnd5e' ? 'D&D 5e (Stat Block)' : sys === 'fabula' ? 'Fabula Ultima' : sys === 'somdas6' ? 'O Som das Seis • PDJ' : threat.type === 'pnj' ? 'PNJ (DB)' : 'Monstro (DB)'}", "{sys === 'dnd5e' ? 'D&D 5.5e (Stat Block)' : sys === 'fabula' ? 'Fabula Ultima' : sys === 'somdas6' ? 'O Som das Seis • PDJ' : threat.type === 'pnj' ? 'PNJ (DB)' : 'Monstro (DB)'}", 'badge de ameaça D&D'],
  ['D&D 5e (2024)</h3>\n                                                <p className="text-xs text-gray-500">Regras do SRD 5.2 • novo sistema em adaptação</p>', 'D&D 5.5e (2024)</h3>\n                                                <p className="text-xs text-gray-500">Regras 2024 / SRD 5.2 • ficha revisada do PJ Lite</p>', 'cartão de criação D&D'],
  ['Criar em D&D 5e (2024)</h2><span className="text-[9px] uppercase font-bold tracking-widest text-orange-100">Novo sistema • em adaptação</span>', 'Criar em D&D 5.5e (2024)</h2><span className="text-[9px] uppercase font-bold tracking-widest text-orange-100">Regras 2024 • ficha revisada</span>', 'cabeçalho do modal D&D'],
  ['<div><h3 className="font-bold text-sm">PC D&D 5e</h3><p className="text-xs text-gray-500">Ficha completa SRD</p></div>', '<div><h3 className="font-bold text-sm">PC D&D 5.5e</h3><p className="text-xs text-gray-500">Ficha completa para as regras 2024</p></div>', 'modelo PC D&D'],
  ['<h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Stat Block D&D 5e (Em Branco)</h3>', '<h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Stat Block D&D 5.5e (Em Branco)</h3>', 'título stat block D&D'],
  [">D&D 5e</button>\n                                        <button onClick={() => setGuideTab('fabula')}", ">D&D 5.5e</button>\n                                        <button onClick={() => setGuideTab('fabula')}", 'aba do guia D&D'],
  ['As abas Dragonbane, D&D 5e, Fabula Ultima e Som das Seis', 'As abas Dragonbane, D&D 5.5e, Fabula Ultima e Som das Seis', 'texto inicial dos guias'],
  ['<h3 className="font-title font-bold text-[#922610]">🐉 D&D 5e — Bloco de Estatísticas</h3>', '<h3 className="font-title font-bold text-[#922610]">🐉 D&D 5.5e — Bloco de Estatísticas</h3>', 'guia de stat block'],
  ['<div className="border rounded p-3"><strong>D&D 5e</strong><br/>1. Defina identidade, CA, PV e movimento.', '<div className="border rounded p-3"><strong>D&D 5.5e</strong><br/>1. Defina identidade, CA, PV e movimento.', 'fluxo de mestre D&D'],
  ['D&D 5e (2024) • em adaptação</div><h3 className="font-title font-bold text-[#922610] mb-2">🐲 Personagem passo a passo', 'D&D 5.5e (2024) • revisado</div><h3 className="font-title font-bold text-[#922610] mb-2">🐲 Personagem passo a passo', 'cabeçalho guia D&D'],
  ['As abas principais ficam fixas e podem ser deslizadas horizontalmente. Atributos usam uma grade compacta, perícias continuam lado a lado quando houver espaço e os painéis de Classe e Magias viram uma coluna confortável para toque. No grimório, cada magia ocupa um cartão por linha para evitar campos espremidos.', 'As abas principais ficam fixas; em telefones estreitos elas viram uma grade para não esconder nenhuma opção e, em telas médias, podem ser deslizadas. Atributos usam uma grade compacta, as perícias passam para uma coluna quando falta espaço e os painéis de Classe e Magias ficam confortáveis para toque. Ataques, inventário e PV também se reorganizam sem criar rolagem lateral; no grimório, cada magia ocupa um cartão por linha.', 'guia mobile D&D'],
  ['<h3 className="font-title font-bold text-[#922610] mb-2">D&D 5e / SRD 5.2</h3><p className="text-xs">A implementação está em adaptação contínua. O PJ Lite não é um produto oficial da Wizards of the Coast.</p>', '<h3 className="font-title font-bold text-[#922610] mb-2">D&D 5.5e / Regras 2024 / SRD 5.2</h3><p className="text-xs">A ficha do PJ Lite foi revisada para esta prévia e segue em evolução conforme o projeto recebe melhorias. O PJ Lite é um projeto independente e não é um produto oficial da Wizards of the Coast.</p>', 'rodapé guia D&D']
];

for (const [from, to, label] of replacements) app = mustReplace(app, from, to, label);
await write(appPath, app);

const registryPath = 'src/systems/registry.js';
let registry = await read(registryPath);
registry = mustReplace(registry, "{ id: 'dnd5e', name: 'D&D 5e', status: 'active', enabled: true }", "{ id: 'dnd5e', name: 'D&D 5.5e', status: 'active', enabled: true }", 'registro D&D');
await write(registryPath, registry);

const dndIndexPath = 'src/systems/dnd5e/index.js';
let dndIndex = await read(dndIndexPath);
dndIndex = mustReplace(dndIndex, "name: 'D&D 5e'", "name: 'D&D 5.5e'", 'nome do módulo D&D');
await write(dndIndexPath, dndIndex);

const verifyPath = 'scripts/verify-project.mjs';
let verify = await read(verifyPath);
verify = mustReplace(
  verify,
  "const dndEditor = await readFile('src/systems/dnd5e/components/CharacterEditor.jsx', 'utf8');\n",
  "const dndEditor = await readFile('src/systems/dnd5e/components/CharacterEditor.jsx', 'utf8');\nconst dndMobileCss = await readFile('src/systems/dnd5e/dnd-sheet-v7.css', 'utf8');\n",
  'leitura do CSS mobile D&D'
);
verify = mustReplace(
  verify,
  "if (!dndEditor.includes('ClassWorkspace') || !dndEditor.includes('SpellWorkspace')) {\n  throw new Error('O editor D&D não contém os workspaces separados de classe e magias.');\n}\n\nconst registry = await readFile('src/systems/registry.js', 'utf8');",
  "if (!dndEditor.includes('ClassWorkspace') || !dndEditor.includes('SpellWorkspace')) {\n  throw new Error('O editor D&D não contém os workspaces separados de classe e magias.');\n}\nfor (const token of ['@media (max-width: 520px)', '@media (max-width: 430px)', 'overflow-x: clip', 'font-size: 16px', '.dnd-v6-wrapper .dnd-v3-skills-grid']) {\n  if (!dndMobileCss.includes(token)) {\n    throw new Error(`Revisão mobile D&D incompleta: ${token}`);\n  }\n}\nif (!app.includes('D&D 5.5e (2024) • revisado') || app.includes('novo sistema em adaptação')) {\n  throw new Error('Textos atuais de D&D ainda indicam uma etapa antiga de adaptação.');\n}\n\nconst registry = await readFile('src/systems/registry.js', 'utf8');",
  'verificações finais mobile D&D'
);
verify = mustReplace(
  verify,
  "for (const id of ['dragonbane', 'dnd5e', 'fabulaUltima', 'somDasSeis']) {",
  "if (!registry.includes(\"{ id: 'dnd5e', name: 'D&D 5.5e', status: 'active', enabled: true }\")) {\n  throw new Error('Registro D&D não está identificado como D&D 5.5e.');\n}\nfor (const id of ['dragonbane', 'dnd5e', 'fabulaUltima', 'somDasSeis']) {",
  'verificação do nome D&D no registro'
);
verify = verify.replace(
  "console.log('PJ Lite: estrutura essencial, editores modulares, D&D mobile e módulos de sistemas verificados com sucesso.');",
  "console.log('PJ Lite: estrutura essencial, editores modulares, revisão mobile D&D e módulos de sistemas verificados com sucesso.');"
);
await write(verifyPath, verify);
