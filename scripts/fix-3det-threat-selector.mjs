import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/PJLiteApp.jsx';
let source = await readFile(path, 'utf8');

const old = "                                        {createTarget === 'pc' && (\n                                            <div onClick={() => { setShowSystemModal(false); setShow3DetModelModal(true); }}";
const replacement = "                                        {(\n                                            <div onClick={() => { setShowSystemModal(false); setShow3DetModelModal(true); }}";

if (!source.includes(old)) {
  throw new Error('Bloqueio do cartão 3DeT para createTarget=pc não encontrado.');
}

source = source.replace(old, replacement);
await writeFile(path, source, 'utf8');
console.log('Cartão 3DeT liberado para Personagem e Ameaça/PNJ.');
