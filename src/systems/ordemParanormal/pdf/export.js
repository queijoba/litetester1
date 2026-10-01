import { installPdfTemplateExport } from '../../pdfTemplateExport.js';
import { fillOrdemPdf } from './map.js';
export function installOrdemPdfExport(){installPdfTemplateExport({systemId:'ordemParanormal',label:'Ordem Paranormal - Sobrevivendo ao Horror',templateUrl:'/pdfs/ordem-sah-template.pdf?v=20261001',editorSelector:'.ordem-sheet',buttonId:'pjlite-ordem-pdf-export',filenamePrefix:'PJ_Lite_Ordem_Paranormal',fillPdf:fillOrdemPdf,requiredFields:['Personagem','AGI','PV','NEX']});}
