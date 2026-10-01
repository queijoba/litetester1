import { readFile } from 'node:fs/promises';
const app=await readFile('src/PJLiteApp.jsx','utf8');
const html=await readFile('index.html','utf8');
const must=['PJ LITE 0.8.3 RELEASE BASE','nova base oficial do PJ Lite','Skyfall RPG — Guia da Ficha','Ordem Paranormal RPG — Guia da Ficha','Determinação (PD)','NEX & Experiência','Baixar PDF'];
for(const token of must)if(!app.includes(token))throw new Error(`Release 0.8.3: ausente ${token}`);
if(!html.includes('0.8.3v Alpha'))throw new Error('Release 0.8.3: metadados do index não atualizados.');
console.log('✓ Novidades, Guias e metadados da base 0.8.3v Alpha verificados.');
