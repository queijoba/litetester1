import { installPdfTemplateExport } from '../../pdfTemplateExport.js';
import { fillSkyfallPdf } from './map.js';
export function installSkyfallPdfExport(){installPdfTemplateExport({systemId:'skyfall',label:'Skyfall RPG',templateUrl:'/pdfs/skyfall-template.pdf?v=20261001',editorSelector:'.skyfall-sheet',buttonId:'pjlite-skyfall-pdf-export',filenamePrefix:'PJ_Lite_Skyfall',fillPdf:fillSkyfallPdf,requiredFields:['CampoNome','CampoFor','CampoPVAt','CampoNível']});}
