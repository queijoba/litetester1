import React,{useEffect,useMemo,useState} from 'react';
import {createPortal} from 'react-dom';
import {DND_2024_CLASSES,getDndClassByLabel} from '../systems/dnd5e/classPanels.js';
import {removeAbilityPreset} from './abilityPresetLibrary.js';
import {getDndLibraryEntries,canUseDndEntry} from './dndLibraryFilters.js';
import './dndLibraryModal.css';

const circle=value=>Math.max(0,Math.min(9,Number(String(value??'0').match(/\d+/)?.[0]||0)));
const classNameFor=id=>DND_2024_CLASSES.find(entry=>entry.id===id)?.label||'';

export default function DndLibraryModal({open,initialTab='classe',className='',subclass='',onChoose,onClose}){
 const [tab,setTab]=useState(initialTab);
 const [query,setQuery]=useState('');
 const [selected,setSelected]=useState('');
 const [allClasses,setAllClasses]=useState(false);
 const [level,setLevel]=useState('all');
 const [revision,setRevision]=useState(0);
 const currentClass=getDndClassByLabel(className);
 useEffect(()=>{
  if(!open)return;
  setTab(initialTab==='magias'?'magias':'classe');
  setQuery('');setSelected('');setAllClasses(false);setLevel('all');
  setRevision(n=>n+1);
 },[open,initialTab]);
 useEffect(()=>{
  if(!open)return;
  const onKey=event=>{if(event.key==='Escape')onClose();};
  window.addEventListener('keydown',onKey);
  return()=>window.removeEventListener('keydown',onKey);
 },[open,onClose]);
 const entries=useMemo(()=>getDndLibraryEntries({
  tab,classId:currentClass?.id,subclass,query,level,allClasses
 }),[tab,currentClass?.id,subclass,query,level,allClasses,revision]);
 const allowed=item=>canUseDndEntry(item.entry,tab,currentClass?.id,subclass);
 const insert=item=>{
  if(!allowed(item))return;
  onChoose({...item.entry},tab);
  onClose();
 };
 const setCategory=value=>{
  setTab(value);setQuery('');setSelected('');setLevel('all');setAllClasses(false);
 };
 const remove=item=>{
  if(item.source!=='personal'||!window.confirm('Excluir este modelo pessoal? As fichas existentes não serão alteradas.'))return;
  if(removeAbilityPreset(item.id)){setSelected('');setRevision(n=>n+1);}
 };
 if(!open||typeof document==='undefined')return null;
 return createPortal(
  <div className="pjlite-dnd-library-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
   <section className="pjlite-dnd-library" role="dialog" aria-modal="true" aria-label="Biblioteca D&D 5.5e">
    <header className="pjlite-dnd-library-top">
     <div><small>PJ LITE // D&D 5.5e</small><h2>Adicionar habilidades e magias</h2></div>
     <button type="button" className="pjlite-dnd-library-close" aria-label="Fechar" onClick={onClose}>×</button>
    </header>
    <div className="pjlite-dnd-library-tabs" role="tablist" aria-label="Categoria">
     {[['classe','Classe'],['subclasse','Subclasse'],['magias','Magias']].map(([id,label])=>
      <button type="button" role="tab" key={id} aria-selected={tab===id} className={tab===id?'active':''} onClick={()=>setCategory(id)}>{label}</button>)}
    </div>
    <div className="pjlite-dnd-library-filters">
     {tab==='magias'?<>
      <b className="pjlite-dnd-library-context">Grimório • Círculos</b>
      <div className="pjlite-dnd-library-chips">
       {[['all','Todos'],['0','Truques'],...Array.from({length:9},(_,i)=>[String(i+1),(i+1)+'º'])].map(([value,label])=>
        <button type="button" key={value} className={level===value?'active':''} onClick={()=>{setLevel(value);setSelected('');}}>{label}</button>)}
      </div>
     </>:<>
      <div className="pjlite-dnd-library-context"><b>{currentClass?currentClass.icon+' '+currentClass.label:'Selecione uma classe na ficha'}</b>
       <span>{tab==='subclasse'?(subclass?'Subclasse: '+subclass:'Escolha uma subclasse na ficha primeiro.'):'Opções da classe atual'}</span>
      </div>
      <div className="pjlite-dnd-library-chips">
       <button type="button" className={!allClasses?'active':''} onClick={()=>{setAllClasses(false);setSelected('');}}>Minha classe</button>
       <button type="button" className={allClasses?'active':''} onClick={()=>{setAllClasses(true);setSelected('');}}>Todas as classes</button>
      </div>
     </>}
     <label className="pjlite-dnd-library-search"><span aria-hidden="true">⌕</span>
      <input autoFocus type="search" value={query} onChange={e=>{setQuery(e.target.value);setSelected('');}}
       placeholder="Buscar nome, classe, subclasse ou efeito..."/>
     </label>
     <small className="pjlite-dnd-library-count">{entries.length} {entries.length===1?'resultado':'resultados'}</small>
    </div>
    <div className="pjlite-dnd-library-content">
     <div className="pjlite-dnd-library-results">
      {entries.map(item=>{
       const expanded=selected===item.id;
       const entry=item.entry||{};
       return <article className={'pjlite-dnd-library-item'+(expanded?' expanded':'')} key={item.id}>
        <div className="pjlite-dnd-library-item-head">
         <button type="button" className="pjlite-dnd-library-expand" aria-expanded={expanded}
          onClick={()=>setSelected(expanded?'':item.id)}>
          <span className="pjlite-dnd-library-chevron">{expanded?'⌃':'⌄'}</span>
          <span><strong>{item.name}</strong><small>{tab==='magias'
            ?(circle(entry.nivel)===0?'Truque':circle(entry.nivel)+'º círculo')+(entry.escola?' • '+entry.escola:'')
            :[entry.classe||classNameFor(entry.classId)||'Modelo geral',entry.subclasse].filter(Boolean).join(' • ')}</small></span>
         </button>
         <button type="button" className="pjlite-dnd-library-plus" onClick={()=>insert(item)} disabled={!allowed(item)}
          aria-label={'Adicionar '+item.name} title={allowed(item)?'Adicionar à ficha':'Disponível apenas para a classe/subclasse correspondente'}>+</button>
        </div>
        {expanded&&<div className="pjlite-dnd-library-detail">
         <div className="pjlite-dnd-library-metadata">
          {entry.tempo&&<span>Tempo: {entry.tempo}</span>}
          {entry.alcance&&<span>Alcance: {entry.alcance}</span>}
          {entry.duracao&&<span>Duração: {entry.duracao}</span>}
          {entry.dano&&<span>Efeito: {entry.dano}</span>}
          {entry.classId&&<span>Classe: {classNameFor(entry.classId)}</span>}
          {entry.subclasse&&<span>Subclasse: {entry.subclasse}</span>}
         </div>
         <p>{entry.desc||'Sem descrição cadastrada.'}</p>
         <small>{item.source==='personal'?'Modelo pessoal':entry.fonte||'Exemplo original do PJLite'}</small>
         {item.source==='personal'&&<button type="button" className="pjlite-dnd-library-remove" onClick={()=>remove(item)}>Excluir modelo pessoal</button>}
        </div>}
       </article>;
      })}
      {!entries.length&&<p className="pjlite-dnd-library-empty">{tab==='subclasse'&&!subclass&&!allClasses?
       'Escolha uma subclasse na aba Classe para habilitar as opções.':
       'Nenhum modelo encontrado. Tente outra pesquisa ou salve seu próprio modelo.'}</p>}
     </div>
    </div>
    <footer className="pjlite-dnd-library-footer">As habilidades de classe e subclasse são modelos editáveis, não reproduções integrais dos livros. Magias SRD: D&D SRD 5.2.1 sob CC BY 4.0.
     <a href="https://www.dndbeyond.com/srd" target="_blank" rel="noopener noreferrer"> Créditos ↗</a>
    </footer>
   </section>
  </div>,document.body
 );
}
