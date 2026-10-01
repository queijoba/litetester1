import { readFile, writeFile } from 'node:fs/promises';
const editorPath='src/systems/ordemParanormal/components/CharacterEditor.jsx';
const chatPath='src/systems/ordemParanormal/chat.js';
let s=await readFile(editorPath,'utf8');
if(s.includes('Sem Sanidade — PD')){
  s=s.replace('Sem Sanidade — PD','Sem Sanidade — Determinação (PD)');
  await writeFile(editorPath,s,'utf8');
}
let chat=await readFile(chatPath,'utf8');
if(chat.includes('PJ LITE 0.8.3 ORDEM PD CHAT')&&!chat.includes('RECURSO MENTAL SAH')){
  chat=chat.replace('/* PJ LITE 0.8.3 ORDEM PD CHAT */','/* RECURSO MENTAL SAH • PJ LITE 0.8.3 ORDEM PD CHAT */');
  await writeFile(chatPath,chat,'utf8');
}
console.log('✓ Rótulos e compatibilidade SAN/PD ajustados.');
