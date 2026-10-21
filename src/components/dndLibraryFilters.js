import { DND_2024_CLASSES } from '../systems/dnd5e/classPanels.js';
import { findAbilityPresets } from './abilityPresetLibrary.js';

const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const circle=value=>Math.max(0,Math.min(9,Number(String(value??'0').match(/\d+/)?.[0]||0)));
const classNameFor=id=>DND_2024_CLASSES.find(entry=>entry.id===id)?.label||'';
const eligibleSpellClass=(classId,subclass)=>{
  if(classId==='guerreiro'&&subclass==='Cavaleiro Arcano')return 'mago';
  if(classId==='ladino'&&subclass==='Trapaceiro Arcano')return 'mago';
  return classId;
};

export const getDndLibraryEntries=({
 tab,classId,subclass,query='',level='all',allClasses=false,
 classLevel=20,onlyAvailableLevel=false,featCategory='todas'
})=>{
 const kind=tab==='magias'?'magias':tab==='especies'?'especies':tab==='talentos'?'talentos':tab==='antecedentes'?'antecedentes':'caracteristicas';
 const needle=normalize(query);
 return findAbilityPresets('dnd5e',kind).filter(({entry})=>{
  if(tab==='especies')return true;
  if(tab==='antecedentes')return true;
  if(tab==='talentos')return (featCategory==='todas'||entry.categoria===featCategory)
    && (!onlyAvailableLevel || Number(entry.nivelMinimo||1)<=Number(classLevel||1));
  if(tab==='magias'){
   if(level!=='all'&&circle(entry.nivel)!==Number(level))return false;
   if(!allClasses&&classId && Array.isArray(entry.classes)&&entry.classes.length&&!entry.classes.includes(eligibleSpellClass(classId,subclass)))return false;
   // Personal homebrew spells without class metadata stay available.
   return true;
  }
  if((entry.origem==='subclasse')!==(tab==='subclasse'))return false;
  if(!allClasses&&entry.classId&&entry.classId!==classId)return false;
  if(!allClasses&&tab==='subclasse'&&!subclass)return false;
  if(!allClasses&&tab==='subclasse'&&entry.subclasse&&entry.subclasse!==subclass)return false;
  if(onlyAvailableLevel&&Number(entry.nivelMinimo||1)>Number(classLevel||1))return false;
  return true;
 }).filter(({entry,name})=>!needle||normalize([
   name,entry.nomeOriginal,entry.desc,entry.resumoPt,entry.requisito,entry.categoria,
   entry.pericias?.join(' '),entry.ferramenta,entry.talentoNome,entry.atributosPt?.join(' '),
   entry.tracos?.map(trait=>trait.nome+' '+trait.resumoPt).join(' ')||'',
   entry.escolha?.options?.map(x=>x.name+' '+x.desc).join(' ')||'',
   entry.classe,classNameFor(entry.classId),entry.subclasse,
   entry.escola,entry.fonte,(entry.classes||[]).map(classNameFor).join(' '),
   tab==='magias'?String(circle(entry.nivel))+' círculo':''
 ].join(' ')).includes(needle));
};

export const canUseDndEntry=(entry,tab,classId,subclass)=>{
 if(tab==='magias'||tab==='especies'||tab==='talentos'||tab==='antecedentes')return true;
 if(!classId)return false;
 if(entry.classId&&entry.classId!==classId)return false;
 if(tab==='subclasse'&&(!subclass||entry.subclasse&&entry.subclasse!==subclass))return false;
 return true;
};
