import React,{useEffect,useMemo,useState} from 'react';
import {createPortal} from 'react-dom';
import {DND_2024_CLASSES,getDndClassByLabel} from '../systems/dnd5e/classPanels.js';
import {removeAbilityPreset} from './abilityPresetLibrary.js';
import {getDndLibraryEntries,canUseDndEntry} from './dndLibraryFilters.js';
import {featRequirementWarnings} from './dndSpeciesFeatActions.js';
import './dndLibraryModal.css';

const circle=value=>Math.max(0,Math.min(9,Number(String(value??'0').match(/\d+/)?.[0]||0)));
const classNameFor=id=>DND_2024_CLASSES.find(entry=>entry.id===id)?.label||'';

export default function DndLibraryModal({open,initialTab='classe',className='',subclass='',classLevel=1,attributes={},features=[],currentSpecies='',onChoose,onClose}){
 const [tab,setTab]=useState(initialTab);
 const [query,setQuery]=useState('');
 const [selected,setSelected]=useState('');
 const [allClasses,setAllClasses]=useState(false);
 const [level,setLevel]=useState('all');
 const [featCategory,setFeatCategory]=useState('todas');
 const [selectedChoice,setSelectedChoice]=useState('');
 const [onlyAvailableLevel,setOnlyAvailableLevel]=useState(false);
 const [revision,setRevision]=useState(0);
 const currentClass=getDndClassByLabel(className);
 useEffect(()=>{
  if(!open)return;
  setTab(['magias','especies','talentos'].includes(initialTab)?initialTab:'classe');
  setQuery('');setSelected('');setAllClasses(false);setLevel('all');setOnlyAvailableLevel(false);setFeatCategory('todas');setSelectedChoice('');
  setRevision(n=>n+1);
 },[open,initialTab]);
 useEffect(()=>{
  if(!open)return;
  const onKey=event=>{if(event.key==='Escape')onClose();};
  window.addEventListener('keydown',onKey);
  return()=>window.removeEventListener('keydown',onKey);
 },[open,onClose]);
 const entries=useMemo(()=>getDndLibraryEntries({
  tab,classId:currentClass?.id,subclass,query,level,allClasses,classLevel,onlyAvailableLevel,featCategory
 }),[tab,currentClass?.id,subclass,query,level,allClasses,classLevel,onlyAvailableLevel,featCategory,revision]);
 const allowed=item=>canUseDndEntry(item.entry,tab,currentClass?.id,subclass);
 const insert=item=>{
  if(!allowed(item))return;
  if(tab==='especies'&&item.entry.escolha&&(!selectedChoice||selected!==item.id||
      !item.entry.escolha.options.some(option=>option.name===selectedChoice))){
    setSelected(item.id);
    setSelectedChoice('');
    return;
  }
  if(tab==='talentos'){
    const warnings=featRequirementWarnings(item.entry,{level:classLevel,attributes,classId:currentClass?.id,selectedFeatures:features});
    if(warnings.length&&!window.confirm('Verifique os pré-requisitos antes de adicionar:\\n• '+warnings.join('\\n• ')+'\\n\\nAdicionar mesmo assim com autorização do Mestre?'))return;
  }
  onChoose({...item.entry},tab,tab==='especies'?selectedChoice:'');
  onClose();
 };
 const setCategory=value=>{
  setTab(value);setQuery('');setSelected('');setLevel('all');setAllClasses(false);setOnlyAvailableLevel(false);setFeatCategory('todas');setSelectedChoice('');
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
     {[['classe','Classe'],['subclasse','Subclasse'],['magias','Magias'],['especies','Espécies'],['talentos','Talentos']].map(([id,label])=>
      <button type="button" role="tab" key={id} aria-selected={tab===id} className={tab===id?'active':''} onClick={()=>setCategory(id)}>{label}</button>)}
    </div>
    <div className="pjlite-dnd-library-filters">
     {tab==='especies'?<>
      <div className="pjlite-dnd-library-context"><b>Espécies do Livro do Jogador 2024</b><span>{currentSpecies?'Ficha atual: '+currentSpecies:'Escolha uma espécie para preencher os traços.'}</span></div>
      <small>Ao aplicar, o PJLite atualiza a espécie e registra seus traços; escolhas de linhagem ficam anotadas na ficha.</small>
     </>:tab==='talentos'?<>
      <div className="pjlite-dnd-library-context"><b>Talentos do Livro do Jogador 2024</b><span>Nível do personagem: {classLevel}</span></div>
      <div className="pjlite-dnd-library-chips">
       {['todas','Origem','Geral','Estilo de Luta','Dádiva Épica'].map(category=><button key={category} type="button"
        className={featCategory===category?'active':''} onClick={()=>{setFeatCategory(category);setSelected('');}}>
        {category==='todas'?'Todos':category}</button>)}
       <button type="button" className={onlyAvailableLevel?'active':''} onClick={()=>{setOnlyAvailableLevel(value=>!value);setSelected('');}}>
        {onlyAvailableLevel?'✓ Até nível '+classLevel:'Todos os níveis'}</button>
      </div>
     </>:tab==='magias'?<>
      <div className="pjlite-dnd-library-context"><b>Grimório • Círculos</b><span>{currentClass?'Classe: '+currentClass.label:'Escolha uma classe para filtrar magias'}</span></div>
      <div className="pjlite-dnd-library-chips">
       <button type="button" className={!allClasses?'active':''} onClick={()=>{setAllClasses(false);setSelected('');}}>Magias da minha classe</button>
       <button type="button" className={allClasses?'active':''} onClick={()=>{setAllClasses(true);setSelected('');}}>Todas as magias SRD</button>
      </div>
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
       <button type="button" className={onlyAvailableLevel?'active':''} onClick={()=>{setOnlyAvailableLevel(value=>!value);setSelected('');}} title="Filtrar habilidades obtidas no nível atual">{onlyAvailableLevel?'✓ Até nível '+classLevel:'Todos os níveis'}</button>
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
          onClick={()=>{setSelected(expanded?'':item.id);setSelectedChoice('');}}>
          <span className="pjlite-dnd-library-chevron">{expanded?'⌃':'⌄'}</span>
          <span><strong>{item.name}</strong>{entry.paginaLivro&&<em className="pjlite-dnd-page-ref">{entry.paginaConferida?'Livro do Jogador, '+entry.paginaLivro:entry.paginaLivro}</em>}<small>{tab==='magias'
            ?(circle(entry.nivel)===0?'Truque':circle(entry.nivel)+'º círculo')+(entry.escola?' • '+entry.escola:'')
            :tab==='especies'?(entry.tamanho+' • '+entry.deslocamentoMetros+' m • '+entry.tracos?.length+' traços')
            :tab==='talentos'?(entry.categoria+(entry.nivelMinimo>1?' • Nível '+entry.nivelMinimo+'+':'')+(entry.fonteTipo==='livro-jogador-2024'?' • Livro do Jogador':' • SRD'))
            :[entry.classe||classNameFor(entry.classId)||'Modelo geral',entry.subclasse,entry.nivelMinimo?'Nível '+entry.nivelMinimo:''].filter(Boolean).join(' • ')}</small></span>
         </button>
         <button type="button" className="pjlite-dnd-library-plus" onClick={()=>insert(item)} disabled={!allowed(item)}
          aria-label={'Adicionar '+item.name} title={allowed(item)?'Adicionar à ficha':'Disponível apenas para a classe/subclasse correspondente'}>+</button>
        </div>
        {expanded&&<div className="pjlite-dnd-library-detail">
         {tab==='especies'&&<>
          <div className="pjlite-dnd-library-metadata"><span>Tipo: {entry.tipoCriatura}</span><span>Tamanho: {entry.tamanho}</span><span>Deslocamento: {entry.deslocamentoMetros} m</span></div>
          <div className="pjlite-dnd-species-traits">
           {(entry.tracos||[]).map(trait=><details key={trait.id}><summary><b>{trait.nome}</b> — {trait.resumoPt}</summary><p>{trait.desc}</p></details>)}
          </div>
          {entry.escolha&&<label className="pjlite-dnd-species-choice"><strong>{entry.escolha.label} (obrigatório)</strong>
           <select value={selectedChoice} onChange={e=>setSelectedChoice(e.target.value)}>
            <option value="">Selecione a opção...</option>
            {entry.escolha.options.map(x=><option key={x.name} value={x.name}>{x.name}</option>)}
           </select>
           {selectedChoice&&<small>{entry.escolha.options.find(x=>x.name===selectedChoice)?.desc}</small>}
          </label>}
          <small>Os efeitos entram na ficha, mas bônus de atributos, PV, magias e proficiências devem ser conferidos manualmente. Nos Aasimar, a transformação celestial é escolhida a cada ativação.</small>
         </>}
         {tab==='talentos'&&<>
          <div className="pjlite-dnd-library-metadata"><span>{entry.categoria}</span><span>Nível {entry.nivelMinimo}+</span>{entry.requisito&&<span>Req.: {entry.requisitoPt||entry.requisito}</span>}</div>
          <p><b>Resumo:</b> {entry.resumoPt}</p>
          {featRequirementWarnings(entry,{level:classLevel,attributes,classId:currentClass?.id,selectedFeatures:features}).length>0&&
            <div className="pjlite-dnd-feat-warning">⚠ {featRequirementWarnings(entry,{level:classLevel,attributes,classId:currentClass?.id,selectedFeatures:features}).join(' • ')}</div>}
         </>}
         <div className="pjlite-dnd-library-metadata">
          {entry.tempo&&<span>Tempo: {entry.tempo}</span>}
          {entry.alcance&&<span>Alcance: {entry.alcance}</span>}
          {entry.duracao&&<span>Duração: {entry.duracao}</span>}
          {entry.dano&&<span>Efeito: {entry.dano}</span>}
          {entry.classId&&<span>Classe: {classNameFor(entry.classId)}</span>}
          {entry.subclasse&&<span>Subclasse: {entry.subclasse}</span>}
          {entry.nivelMinimo!=null&&<span>Disponível no nível {entry.nivelMinimo}</span>}
          {Array.isArray(entry.classes)&&entry.classes.length>0&&<span>Classes: {entry.classes.map(classNameFor).join(', ')}</span>}
         </div>


         {tab==='especies'?null:<p>{entry.desc||'Sem descrição cadastrada.'}</p>}
         {entry.paginaLivro&&<small className="pjlite-dnd-booknote">{entry.paginaConferida?'Página impressa conferida no Livro do Jogador 2024.':'Referência por capítulo/seção do Livro do Jogador; página específica ainda não conferida.'}</small>}
         {entry.fonteTipo==='livro-jogador-2024'&&<small className="pjlite-dnd-library-fansource">Resumo independente criado pelo PJLite; este texto não faz parte do SRD. Confira o Livro do Jogador 2024 para detalhes.</small>}
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
    <footer className="pjlite-dnd-library-footer">
     <strong>PJLite — projeto de fã não oficial.</strong> Não aprovado ou endossado pela Wizards of the Coast.
     Parte do conteúdo pertence à Wizards of the Coast LLC. ©Wizards of the Coast LLC.
     O SRD 5.2.1 segue CC BY 4.0; Aasimar e talentos exclusivos do Livro do Jogador usam somente resumos próprios de consulta.
     <a href="https://www.dndbeyond.com/srd" target="_blank" rel="noopener noreferrer"> SRD</a> ·
     <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer"> Licença</a> ·
     <a href="https://company.wizards.com/pt-BR/legal/fancontentpolicy" target="_blank" rel="noopener noreferrer"> Conteúdo de fãs</a>
    </footer>
   </section>
  </div>,document.body
 );
}
