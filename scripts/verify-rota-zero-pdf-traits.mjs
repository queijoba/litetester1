
import assert from 'node:assert/strict';
import { initialRotaZeroPcData } from '../src/systems/rotaZero/data.js';
import { getRotaZeroPdfTraits, buildRotaZeroPdfBytes } from '../src/systems/rotaZero/pdf/export.js';

const documents=[];
const mockFont={widthOfTextAtSize(text,size){return String(text).length * size * .6;}};
const mockLib={
 StandardFonts:{Courier:'Courier',CourierBold:'CourierBold'},
 rgb(...values){return values;},
 PDFDocument:{
  async create(){
   const pages=[];
   const doc={
    pages,
    addPage(){
     const calls=[];
     const page={
      calls,
      drawText(text,options){calls.push({text,options});},
      drawRectangle(){},drawLine(){},drawImage(){}
     };
     pages.push(page);
     return page;
    },
    getPages(){return pages;},
    getPageCount(){return pages.length;},
    async embedFont(){return mockFont;},
    async save(){return new Uint8Array([37,80,68,70]);}
   };
   documents.push(doc);
   return doc;
  }
 }
};
globalThis.window={PDFLib:mockLib};

const fresh=()=>JSON.parse(JSON.stringify(initialRotaZeroPcData));
const render=async(item)=>{
 const bytes=await buildRotaZeroPdfBytes(item);
 assert.ok(bytes instanceof Uint8Array);
 const doc=documents.at(-1);
 return {
  doc,
  text:doc.pages.map(page=>page.calls.map(call=>call.text).join(' ')).join(' '),
  panel:doc.pages[0].calls.filter(call=>call.options?.x===312 && call.options?.y<=473 && call.options?.y>=395)
 };
};

const item=fresh();
item.bio.nome='Cable';
item.vantagens=['leitorRuido'];
item.defeitos=['fobia','esgotado'];
const selected=getRotaZeroPdfTraits(item);
assert.equal(selected.advantages[0].name,'Leitor de Ruído');
assert.match(selected.advantages[0].summary,/Reconhece sinais contaminados por Ruído/);
assert.deepEqual(selected.defects.map(x=>x.name),['Fobia','Esgotado']);
let result=await render(item);
assert.equal(result.doc.pages.length,1);
const panel=result.panel.map(call=>call.text).join(' ');
assert.match(panel,/Leitor de Ruído:/);
assert.match(panel,/Reconhece sinais/);
assert.match(panel,/DEFEITOS \/\/ Fobia, Esgotado/);
assert.doesNotMatch(panel,/leitorRuido|esgotado/);
assert.ok(result.panel.every(call=>call.options.y>=395),'O quadro não pode extrapolar para o painel seguinte.');

const full=fresh();
full.vantagens=['cabecaFria','maosOficina','memoriaRotas','bolsoEscondido','durao','reservaFoco','autocontrole','reflexosEntrega','redeContatos','leitorRuido'];
full.defeitos=['fobia','esgotado'];
result=await render(full);
assert.ok(result.doc.pages.length>=2,'Deve criar anexo se faltar espaço para as vantagens.');
assert.match(result.text,/VER ANEXO RZ-04/);
const annex=result.doc.pages.slice(1).map(page=>page.calls.map(call=>call.text).join(' ')).join(' ');
for(const adv of getRotaZeroPdfTraits(full).advantages)assert.ok(annex.includes(adv.name), 'Vantagem faltando no anexo: '+adv.name);
assert.match(annex,/DEFEITOS/);
assert.match(annex,/Fobia/);
assert.match(annex,/Esgotado/);

const none=await render(fresh());
assert.match(none.text,/Nenhuma vantagem ou defeito/);
console.log('✓ Rota Zero PDF: vantagens resumidas, defeitos separados, IDs resolvidos e anexo sem cortes verificados.');
