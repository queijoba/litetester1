import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
const read=p=>readFile(p,'utf8');
const need=(txt,tokens,label)=>{for(const t of tokens)if(!txt.includes(t))throw new Error(`${label}: ausente ${t}`);};
const [skyCss,ordemData,ordemEditor,main,skyIndex,ordemIndex]=await Promise.all([
 read('src/systems/skyfall/skyfall-theme.css'),read('src/systems/ordemParanormal/data.js'),read('src/systems/ordemParanormal/components/CharacterEditor.jsx'),read('src/main.jsx'),read('src/systems/skyfall/index.js'),read('src/systems/ordemParanormal/index.js')
]);
need(skyCss,['PJ LITE 0.8.3 SKYFALL ORIGINAL SHEET LAYOUT','grid-template-columns:repeat(6','grid-template-areas:"photo identity" "attrs attrs"'],'Skyfall original');
need(ordemData,['nivelExperiencia:1','nivelExperiencia:false'],'Ordem NEX/Nível data');
need(ordemEditor,['Usar NEX & Experiência','ordem-level-badge','1 nível equivale a 5% de NEX'],'Ordem NEX/Nível UI');
need(main,['installSkyfallPdfExport','installOrdemPdfExport'],'PDF installs');
need(skyIndex,['installSkyfallPdfExport'],'Skyfall PDF index');
need(ordemIndex,['installOrdemPdfExport'],'Ordem PDF index');
for(const p of ['public/pdfs/skyfall-template.pdf','public/pdfs/ordem-sah-template.pdf','src/systems/skyfall/pdf/export.js','src/systems/skyfall/pdf/map.js','src/systems/ordemParanormal/pdf/export.js','src/systems/ordemParanormal/pdf/map.js','src/systems/pdfTemplateExport.js'])if(!existsSync(p))throw new Error(`Integração PDF: ausente ${p}`);
console.log('✓ Skyfall fiel à ficha/D&D, Ordem NEX & Experiência e PDFs Skyfall/Ordem verificados.');
