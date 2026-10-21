import { DND_2024_CLASSES } from '../systems/dnd5e/classPanels.js';
import { findAbilityPresets } from './abilityPresetLibrary.js';

const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const circle=value=>Math.max(0,Math.min(9,Number(String(value??'0').match(/\d+/)?.[0]||0)));
const classNameFor=id=>DND_2024_CLASSES.find(entry=>entry.id===id)?.label||'';

export const getDndLibraryEntries=({tab,classId,subclass,query='',level='all',allClasses=false})=>{
 const kind=tab==='magias'?'magias':'caracteristicas';
 const needle=normalize(query);
 return findAbilityPresets('dnd5e',kind).filter(({entry})=>{
  if(tab==='magias')return level==='all'||circle(entry.nivel)===Number(level);
  if((entry.origem==='subclasse')!==(tab==='subclasse'))return false;
  if(!allClasses&&entry.classId&&entry.classId!==classId)return false;
  if(!allClasses&&tab==='subclasse'&&!subclass)return false;
  if(!allClasses&&tab==='subclasse'&&entry.subclasse&&entry.subclasse!==subclass)return false;
  return true;
 }).filter(({entry,name})=>!needle||normalize([
   name,entry.desc,entry.classe,classNameFor(entry.classId),entry.subclasse,entry.escola,entry.fonte,
   tab==='magias'?String(circle(entry.nivel))+' círculo':''
 ].join(' ')).includes(needle));
};

export const canUseDndEntry=(entry,tab,classId,subclass)=>{
 if(tab==='magias')return true;
 if(!classId)return false;
 if(entry.classId&&entry.classId!==classId)return false;
 if(tab==='subclasse'&&(!subclass||entry.subclasse&&entry.subclasse!==subclass))return false;
 return true;
};
