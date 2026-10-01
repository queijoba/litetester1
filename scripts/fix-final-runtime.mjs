import { readFile, writeFile } from 'node:fs/promises';

const path='src/PJLiteApp.jsx';
let s=await readFile(path,'utf8');
if(s.includes('PJ LITE 0.9 RUNTIME FIX')){
  console.log('Runtime final: correções já aplicadas.');
  process.exit(0);
}

// Os editores novos precisam ser exclusivos. Dragonbane não deve tentar renderizar
// dados de Skyfall/Ordem, pois seus formatos de atributos e listas são diferentes.
s=s.replace(
  '<DragonbaneEditor scope={systemEditorScope} />',
  "{data.system === 'dragonbane' && <DragonbaneEditor scope={systemEditorScope} />}"
);

// Skyfall e Ordem são sistemas reconhecidos; não mostrar o aviso de formato desconhecido.
s=s.replace(
  "!['dragonbane','dnd5e','fabula','somdas6','3det'].includes(data.system || 'dragonbane')",
  "!['dragonbane','dnd5e','fabula','somdas6','3det','skyfall','ordemParanormal'].includes(data.system || 'dragonbane')"
);

// Ao escolher um template novo, feche também os modais dos dois sistemas finais.
s=s.replace(
  "setShowSom6ModelModal(false);\n                setShow3DetModelModal(false);\n                setCreateTarget(null);",
  "setShowSom6ModelModal(false);\n                setShow3DetModelModal(false);\n                setShowSkyfallModelModal(false);\n                setShowOrdemModelModal(false);\n                setCreateTarget(null);"
);

// Trocar entre fichas longas preservava o scroll antigo. Em mobile isso podia abrir
// a ficha seguinte abaixo do seu próprio conteúdo e parecer uma tela vazia.
s=s.replaceAll(
  "setView('editor');",
  "setView('editor');\n                    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));"
);

// Pequeno acerto do cartão de modelo de Ordem.
s=s.replaceAll('NEX {m.nex}% • {m.bio.classe}', 'NEX {m.bio?.nex ?? 5}% • {m.bio?.classe || \'Sem classe\'}');

s=`/* PJ LITE 0.9 RUNTIME FIX */\n${s}`;
await writeFile(path,s,'utf8');
console.log('✓ Isolamento Dragonbane/Skyfall/Ordem e reset de scroll aplicados.');
