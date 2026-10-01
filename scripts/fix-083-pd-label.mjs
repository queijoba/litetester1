import { readFile, writeFile } from 'node:fs/promises';
const path='src/systems/ordemParanormal/components/CharacterEditor.jsx';
let s=await readFile(path,'utf8');
if(s.includes('Sem Sanidade — PD')){
  s=s.replace('Sem Sanidade — PD','Sem Sanidade — Determinação (PD)');
  await writeFile(path,s,'utf8');
}
console.log('✓ Rótulo do modo sem Sanidade ajustado para Determinação (PD).');
