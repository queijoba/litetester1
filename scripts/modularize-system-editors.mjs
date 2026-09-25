import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname } from 'node:path';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';

const traverse = traverseModule.default || traverseModule;
const appPath = 'src/PJLiteApp.jsx';
const source = await readFile(appPath, 'utf8');

if (source.includes("./systems/dnd5e/components/CharacterEditor.jsx")) {
  console.log('Editores de sistema já foram modularizados.');
  process.exit(0);
}

const ast = parse(source, {
  sourceType: 'module',
  plugins: ['jsx'],
  errorRecovery: false,
});

const editorStart = source.indexOf("const isDnd = data.system === 'dnd5e';");
if (editorStart < 0) throw new Error('Não encontrei o início do editor multissistema.');

const defs = [
  {
    key: 'dnd-pc',
    re: /^\{\s*isDnd\s*&&\s*data\.type\s*===\s*['"]pc['"]\s*&&/,
    component: 'DndCharacterEditor',
    file: 'src/systems/dnd5e/components/CharacterEditor.jsx',
    importPath: './systems/dnd5e/components/CharacterEditor.jsx',
  },
  {
    key: 'dnd-threat',
    re: /^\{\s*isDnd\s*&&\s*data\.type\s*===\s*['"]ameaca['"]\s*&&/,
    component: 'DndThreatEditor',
    file: 'src/systems/dnd5e/components/ThreatEditor.jsx',
    importPath: './systems/dnd5e/components/ThreatEditor.jsx',
  },
  {
    key: 'fabula-pc',
    re: /^\{\s*isFabula\s*&&\s*data\.type\s*===\s*['"]pc['"]\s*&&/,
    component: 'FabulaCharacterEditor',
    file: 'src/systems/fabulaUltima/components/CharacterEditor.jsx',
    importPath: './systems/fabulaUltima/components/CharacterEditor.jsx',
  },
  {
    key: 'fabula-threat',
    re: /^\{\s*isFabula\s*&&\s*data\.type\s*!==\s*['"]pc['"]\s*&&/,
    component: 'FabulaThreatEditor',
    file: 'src/systems/fabulaUltima/components/ThreatEditor.jsx',
    importPath: './systems/fabulaUltima/components/ThreatEditor.jsx',
  },
  {
    key: 'som6-pc',
    re: /^\{\s*isSom6\s*&&\s*data\.type\s*===\s*['"]pc['"]\s*&&/,
    component: 'Som6CharacterEditor',
    file: 'src/systems/somDasSeis/components/CharacterEditor.jsx',
    importPath: './systems/somDasSeis/components/CharacterEditor.jsx',
  },
  {
    key: 'som6-threat',
    re: /^\{\s*isSom6\s*&&\s*data\.type\s*!==\s*['"]pc['"]\s*&&/,
    component: 'Som6ThreatEditor',
    file: 'src/systems/somDasSeis/components/ThreatEditor.jsx',
    importPath: './systems/somDasSeis/components/ThreatEditor.jsx',
  },
  {
    key: 'dragonbane',
    re: /^\{\s*!isDnd\s*&&\s*!isFabula\s*&&\s*!isSom6\s*&&/,
    component: 'DragonbaneEditor',
    file: 'src/systems/dragonbane/components/Editor.jsx',
    importPath: './systems/dragonbane/components/Editor.jsx',
  },
];

const found = new Map();
let scopeNames = null;
let scopeInsertAt = null;

traverse(ast, {
  VariableDeclarator(path) {
    if (path.node.id?.type === 'Identifier' && path.node.id.name === 'topBarColor' && path.node.start > editorStart) {
      scopeNames = Object.keys(path.scope.getAllBindings())
        .filter(name => name !== 'systemEditorScope' && name !== 'scope')
        .sort((a, b) => a.localeCompare(b));
      scopeInsertAt = path.parentPath.node.end;
    }
  },
  JSXExpressionContainer(path) {
    const node = path.node;
    if (node.start < editorStart) return;
    const raw = source.slice(node.start, node.end);
    for (const def of defs) {
      if (def.re.test(raw)) {
        if (found.has(def.key)) throw new Error(`Mais de um bloco encontrado para ${def.key}.`);
        found.set(def.key, { def, start: node.start, end: node.end, raw });
        break;
      }
    }
  },
});

if (!scopeNames?.length || scopeInsertAt == null) {
  throw new Error('Não foi possível montar o escopo compartilhado dos editores.');
}

const missing = defs.filter(def => !found.has(def.key)).map(def => def.key);
if (missing.length) {
  throw new Error(`Blocos de editor não encontrados: ${missing.join(', ')}`);
}

const scopeDestructure = scopeNames.join(',\n    ');
for (const def of defs) {
  const entry = found.get(def.key);
  await mkdir(dirname(def.file), { recursive: true });
  const componentSource = `// Extraído automaticamente do antigo PJLiteApp monolítico.\n// Este arquivo agora é a fonte visual do editor deste sistema.\nexport default function ${def.component}({ scope }) {\n  const {\n    ${scopeDestructure}\n  } = scope;\n\n  return (\n    <>\n${entry.raw.split('\n').map(line => `      ${line}`).join('\n')}\n    </>\n  );\n}\n`;
  await writeFile(def.file, componentSource, 'utf8');
}

let next = source;
const replacements = [...found.values()].sort((a, b) => b.start - a.start);
for (const entry of replacements) {
  const replacement = `<${entry.def.component} scope={systemEditorScope} />`;
  next = next.slice(0, entry.start) + replacement + next.slice(entry.end);
}

const scopeBlock = `\n            // Escopo de compatibilidade dos editores modularizados.\n            // Será reduzido conforme modelos e lógica forem migrados para cada sistema.\n            const systemEditorScope = {\n                ${scopeNames.join(',\n                ')}\n            };`;
next = next.slice(0, scopeInsertAt) + scopeBlock + next.slice(scopeInsertAt);

const imports = defs.map(def => `import ${def.component} from '${def.importPath}';`).join('\n') + '\n';
next = imports + next;

await writeFile(appPath, next, 'utf8');
console.log(`Modularização concluída: ${defs.length} blocos de editor extraídos.`);
console.log(`Escopo de compatibilidade: ${scopeNames.length} bindings.`);
