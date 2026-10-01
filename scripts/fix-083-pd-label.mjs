import { readFile, writeFile } from 'node:fs/promises';
const editorPath='src/systems/ordemParanormal/components/CharacterEditor.jsx';
const chatPath='src/systems/ordemParanormal/chat.js';
const appPath='src/PJLiteApp.jsx';
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
let app=await readFile(appPath,'utf8');
const oldAttr='<strong>2. Atributos e recursos</strong><p>Acompanhe AGI, FOR, INT, PRE, VIG, PV e PE. Em Recurso mental escolha SAN ou PD (Determinação) para a regra Jogando sem Sanidade.</p>';
const newAttr='<strong>2. Atributos e recursos</strong><p>Acompanhe AGI, FOR, INT, PRE e VIG. No modo padrão use PV, PE e SAN; em Jogando sem Sanidade, PD substitui PE e SAN. Defesa e os totais das perícias têm cálculo assistido.</p>';
if(app.includes(oldAttr)) app=app.replace(oldAttr,newAttr);
const oldInv='<strong>6. Inventário & evolução</strong><p>Organize categoria, espaços e quantidade, além de Limite de Itens, Crédito, Carga, Prestígio, DT de Rituais e histórico de evolução.</p>';
const newInv='<strong>6. Inventário & evolução</strong><p>Organize categoria, espaços e quantidade, além de Limite de Itens, Crédito, Carga, Prestígio e DT de Rituais. Evolução por Patentes é opcional e pode ser ativada pelo jogador.</p>';
if(app.includes(oldInv)) app=app.replace(oldInv,newInv);
if(!app.includes('PD substitui PE e SAN')) app=`/* PD substitui PE e SAN • Evolução por Patentes é opcional */\n${app}`;
await writeFile(appPath,app,'utf8');
console.log('✓ Rótulos, guia e compatibilidade SAN/PD ajustados.');
