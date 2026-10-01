import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/PJLiteApp.jsx';
let s = await readFile(path, 'utf8');

if (!s.includes('PJ LITE 0.9 FINAL SYSTEMS')) {
  const oldRouting = `            if (sys === '3det' && item.type === 'pc') return generate3DetChatText(item);\n            if (sys === '3det' && item.type !== 'pc') return generate3DetThreatChatText(item);`;
  const normalizedRouting = `            if (sys === '3det') return item.type === 'pc' ? generate3DetChatText(item) : generate3DetThreatChatText(item);`;
  if (s.includes(oldRouting)) {
    s = s.replace(oldRouting, normalizedRouting);
    await writeFile(path, s, 'utf8');
    console.log('✓ Compatibilidade do roteamento 3DeT preparada.');
  } else if (!s.includes(normalizedRouting)) {
    throw new Error('Não foi possível localizar o roteamento da Ficha Chat do 3DeT.');
  }
}
