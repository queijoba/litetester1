import { readFile } from 'node:fs/promises';
const app=await readFile('src/PJLiteApp.jsx','utf8');
const html=await readFile('index.html','utf8');
const must=['PJ LITE 0.9.1 RELEASE BASE','PJ LITE 0.9.5 RELEASE','Skyfall RPG — Guia da Ficha','Ordem Paranormal RPG — Guia da Ficha','Determinação (PD)','NEX & Experiência','Baixar PDF'];
for(const token of must)if(!app.includes(token))throw new Error(`Release 0.9.5: ausente ${token}`);
if(!app.includes("versao: '0.9.1v Alpha'")||!app.includes("versao: '0.9.5v Alpha'"))throw new Error('Release 0.9.5: histórico/log atual incompleto.');
if(!html.includes('0.9.5v Alpha'))throw new Error('Release 0.9.5: metadados do index não atualizados.');
console.log('✓ Novidades, Guias e metadados da base 0.9.5v Alpha verificados.');
