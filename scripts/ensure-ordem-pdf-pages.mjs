// Compatibilidade com geradores legados da etapa prepare:final.
// Alguns refinadores reescrevem a faixa de rituais e removem o novo campo Área.
// Rodar ao final do preparo mantém o editor fonte e o build com os mesmos campos.
import {readFile,writeFile} from 'node:fs/promises';
const path='src/systems/ordemParanormal/components/CharacterEditor.jsx';
let src=await readFile(path,'utf8');
const inputOld=`<input value={x.alcance||''} onChange={e=>patch('rituais',i,'alcance',e.target.value)} placeholder="Alcance"/>`;
const inputArea=`<input value={x.area||''} onChange={e=>patch('rituais',i,'area',e.target.value)} placeholder="Área"/>`;
if(!src.includes(inputArea)){
 if(!src.includes(inputOld)) throw new Error('Ordem: o editor legado mudou; campo Alcance não localizado para Área.');
 src=src.replace(inputOld,inputOld+inputArea);
 await writeFile(path,src,'utf8');
 console.log('✓ Ordem: campo Área restaurado após o preparo do editor legado.');
}
if(!src.includes("const BASE_TABS=[['agente'")||!src.includes('ordem-dossier-content'))
 throw new Error('Ordem: dossiê de agente não sobreviveu ao preparo.');
const dataPath='src/systems/ordemParanormal/data.js';
const oldArea="elemento:'',execucao:'',alcance:'',duracao:'',resistencia:'',custo:''";
let data=await readFile(dataPath,'utf8');
if(data.includes(oldArea)){
 data=data.replace(oldArea,"elemento:'',execucao:'',alcance:'',area:'',duracao:'',resistencia:'',custo:''");
 await writeFile(dataPath,data,'utf8');
}
const pdfPath='src/systems/ordemParanormal/pdf/map.js';
let pdf=await readFile(pdfPath,'utf8');
if(pdf.includes("x.execucao,x.alcance,x.duracao,x.resistencia,x.desc")){
 pdf=pdf.replace("x.execucao,x.alcance,x.duracao,x.resistencia,x.desc","x.execucao,x.alcance,x.area,x.duracao,x.resistencia,x.desc");
 await writeFile(pdfPath,pdf,'utf8');
}
