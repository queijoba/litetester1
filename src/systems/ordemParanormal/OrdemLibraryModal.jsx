import React,{useEffect,useMemo,useState} from 'react';
import {createPortal} from 'react-dom';
import {findAbilityPresets} from '../../components/abilityPresetLibrary.js';
import {ORDEM_LIBRARY_COUNTS,ORDEM_LIBRARY_CATALOG} from './libraryCatalog.js';
import {getOrdemLibraryWarnings,normalizeOrdemTerm} from './libraryActions.js';
import './ordem-library.css';

const tabs=[['origens','Origens'],['trilhas','Trilhas'],['habilidades','Poderes de Classe'],['poderesParanormais','Poderes Paranormais'],['rituais','Rituais']];
const normalize=normalizeOrdemTerm;
// Títulos editoriais identificados nas pastas Arquivos Secretos do Drive do projeto.
const archiveTitles={
 'Arquivos Secretos #01':'Agatha',
 'Arquivos Secretos #02':'Hexatombe — Parte 1 (HQ Kemi)',
 'Arquivos Secretos #03':'Hexatombe — Parte 2',
 'Arquivos Secretos #04':'A Produção',
 'Arquivos Secretos #05':'Alheios',
 'Arquivos Secretos #06':'Panaceia',
 'Arquivos Secretos #07':'Vampiros',
 'Arquivos Secretos #09':'Hell Hunters'
};
const archive02Reference='https://drive.google.com/file/d/1gamNmCjCg0sGnW3Fjv28D_MWUH4xLsQF/view';
const sourceSet=new Set(ORDEM_LIBRARY_CATALOG.map(e=>e.fonte).filter(Boolean));
sourceSet.add('Arquivos Secretos #02'); // HQ de referência, sem poderes de ficha cadastrados.
const bookSources=['Livro Básico v1.3','Sobrevivendo ao Horror'];
const allSources=['Todas as fontes',...bookSources.filter(value=>sourceSet.has(value)),
 ...[...sourceSet].filter(value=>!bookSources.includes(value)).sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}))];
const sourceLabel=value=>archiveTitles[value]?value+' — '+archiveTitles[value]:value;
const elements=['Todos os elementos','Sangue','Morte','Conhecimento','Energia','Medo','Variável'];
const circles=['Todos os círculos',1,2,3,4];

export default function OrdemLibraryModal({open=false,initialTab='habilidades',classe='',trilha='',nex=5,onChoose,onClose}){
 const [tab,setTab]=useState('habilidades');
 const [source,setSource]=useState('Todas as fontes');
 const [query,setQuery]=useState('');
 const [allClasses,setAllClasses]=useState(false);
 const [element,setElement]=useState('Todos os elementos');
 const [circle,setCircle]=useState('Todos os círculos');
 const [onlyEligible,setOnlyEligible]=useState(false);
 const [selectedRitualElement,setSelectedRitualElement]=useState('');
 const [selected,setSelected]=useState('');
 const [revision,setRevision]=useState(0);
 useEffect(()=>{if(!open)return;setTab(tabs.some(x=>x[0]===initialTab)?initialTab:'habilidades');setQuery('');setSource('Todas as fontes');setAllClasses(false);setSelected('');setElement('Todos os elementos');setCircle('Todos os círculos');setOnlyEligible(false);setSelectedRitualElement('');setRevision(i=>i+1);},[open,initialTab]);
 useEffect(()=>{if(!open)return;const f=e=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',f);return()=>window.removeEventListener('keydown',f);},[open,onClose]);
 const entries=useMemo(()=>findAbilityPresets('ordemParanormal',tab).filter(x=>{
  const e=x.entry||{};
  if(source!=='Todas as fontes'&&e.fonte!==source)return false;
  if(tab==='rituais'&&circle!=='Todos os círculos'&&Number(e.circulo)!==Number(circle))return false;
  if((tab==='rituais'||tab==='poderesParanormais')&&element!=='Todos os elementos'){
   const values=[...String(e.elemento||'').split(/\s*[\/,+]\s*/), ...(e.elementosPossiveis||[])].map(normalize);
   if(!values.includes(normalize(element))&&!values.includes('variavel'))return false;
  }
  if(onlyEligible&&getOrdemLibraryWarnings(e,tab,{classe,trilha,nex}).length>0)return false;
  if(!allClasses&&classe&&tab==='trilhas'&&e.classe&&normalize(e.classe)!==normalize(classe)&&normalize(e.classe)!=='geral')return false;
  if(!allClasses&&classe&&tab==='habilidades'&&e.classe&&!['Geral',classe].some(name=>normalize(e.classe)===normalize(name)))return false;
  const needle=normalize(query);if(!needle)return true;
  return normalize([x.name,e.nome,e.tipo,e.fonte,e.desc,e.pagina,e.classe,e.trilha,e.poderOrigem,e.elemento,(e.pericias||[]).join(' ')].join(' ')).includes(needle);
 }),[tab,source,query,classe,trilha,nex,allClasses,element,circle,onlyEligible,revision]);
 if(!open||typeof document==='undefined')return null;
 const chosen=entries.find(x=>x.id===selected)||entries[0]||null;
 const choose=x=>{
  const e=x.entry||{};
  const warnings=getOrdemLibraryWarnings(e,tab,{classe,trilha,nex});
  if(warnings.length&&!window.confirm('Atenção aos requisitos:\\n• '+warnings.join('\\n• ')+'\\n\\nAdicionar mesmo assim com aprovação do Mestre?'))return;
  const needsChoice=tab==='rituais'&&e.elementosPossiveis?.length>1;
  if(needsChoice&&!e.elementosPossiveis.includes(selectedRitualElement))return;
  onChoose({...e,...(needsChoice?{elemento:selectedRitualElement}:{})},tab);onClose();
 };
 return createPortal(<div className="ordem-library-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
 <section className="ordem-library-modal" role="dialog" aria-modal="true" aria-label="Biblioteca Ordem Paranormal">
  <header className="ordem-library-header"><div><small>ORDO REALITAS // ACERVO DE AGENTES</small><h2>📚 Biblioteca Paranormal</h2><p>Livro Básico • Sobrevivendo ao Horror • Arquivos Secretos</p></div><button onClick={onClose} type="button" aria-label="Fechar biblioteca">×</button></header>
  <nav className="ordem-library-tabs" aria-label="Categorias da biblioteca">{tabs.map(([id,label])=><button type="button" key={id} className={tab===id?'active':''} aria-current={tab===id?'page':undefined} aria-pressed={tab===id} onClick={()=>{setTab(id);setSelected('');setSelectedRitualElement('');}}>{label}</button>)}</nav>
  <div className="ordem-library-controls"><input type="search" placeholder="Pesquisar nome, classe, origem ou efeito..." value={query} onChange={e=>{setQuery(e.target.value);setSelected('');}}/><select aria-label="Filtrar fonte" value={source} onChange={e=>{setSource(e.target.value);setSelected('');}}>{allSources.map(x=><option key={x} value={x}>{sourceLabel(x)}</option>)}</select>{(tab==='rituais'||tab==='poderesParanormais')&&<select aria-label="Filtrar elemento" value={element} onChange={e=>{setElement(e.target.value);setSelected('');}}>{elements.map(x=><option key={x} value={x}>{x}</option>)}</select>}{tab==='rituais'&&<select aria-label="Filtrar círculo" value={circle} onChange={e=>{setCircle(e.target.value);setSelected('');}}>{circles.map(x=><option key={x} value={x}>{typeof x==='number'?x+'º círculo':x}</option>)}</select>}</div>
  <div className="ordem-library-context"><span>Classe: <strong>{classe||'Não definida'}</strong>{trilha?' • Trilha: '+trilha:''} • NEX {nex}%</span><button type="button" className={onlyEligible?'active':''} onClick={()=>{setOnlyEligible(x=>!x);setSelected('');}}>{onlyEligible?'✓ Compatíveis':'Mostrar só compatíveis'}</button>{['habilidades','trilhas'].includes(tab)&&<button className={allClasses?'active':''} type="button" onClick={()=>{setAllClasses(x=>!x);setSelected('');}}>{allClasses?'✓ Mostrar tudo':'Ver todas as classes'}</button>}</div>
  <div className={'ordem-library-body'+(selected?' ordem-library-body--has-selection':'')}><div className="ordem-library-results" aria-label="Resultados da biblioteca"><div className="ordem-library-count">{entries.length} resultado{entries.length===1?'':'s'} de {Object.values(ORDEM_LIBRARY_COUNTS).reduce((a,b)=>a+b,0)} referências</div>{entries.map(x=><button type="button" key={x.id} className={selected===x.id||(!selected&&entries[0]?.id===x.id)?'selected':''} aria-pressed={selected===x.id} onClick={()=>{setSelected(x.id);setSelectedRitualElement('');}}><strong>{x.name}</strong><small>{x.entry.fonte||'Modelo pessoal'}{x.entry.classe?' • '+x.entry.classe:''}{x.entry.elemento?' • '+x.entry.elemento:''}{x.entry.circulo?' • '+x.entry.circulo+'º círculo':''}</small></button>)}{!entries.length&&(source==='Arquivos Secretos #02'
 ?<div className="ordem-library-empty"><p><strong>Arquivos Secretos #02 — Hexatombe, parte 1</strong></p><p>Este pacote do Drive contém a HQ Kemi e materiais extras de narrativa. Não foram identificadas opções de personagem neste arquivo; por isso não há poderes, trilhas ou rituais para adicionar automaticamente.</p><a href={archive02Reference} target="_blank" rel="noopener noreferrer">Consultar HQ Kemi no Google Drive ↗</a></div>
 :<p className="ordem-library-empty">Nenhuma referência encontrada. Experimente remover os filtros ou salvar seu próprio modelo na ficha.</p>)}</div>
  <div className="ordem-library-detail" aria-label="Detalhes da referência">{chosen?<><button className="ordem-library-back" type="button" onClick={()=>{setSelected('');setSelectedRitualElement('');}}>← Voltar aos resultados</button><span className="ordem-library-source">{chosen.source==='personal'?'Modelo personalizado':'Acervo • fonte verificada'}</span><h3>{chosen.name}</h3><div className="ordem-library-tags">{[chosen.entry.fonte,chosen.entry.pagina?'p. '+chosen.entry.pagina:'',chosen.entry.classe,chosen.entry.elemento,chosen.entry.nexMinimo?'NEX '+chosen.entry.nexMinimo+'%':'',chosen.entry.circulo?'Círculo '+chosen.entry.circulo:'',chosen.entry.custo?'Custo '+chosen.entry.custo:''].filter(Boolean).map((tag,i)=><span key={i}>{tag}</span>)}</div>
    {chosen.entry.pericias?.length>0&&<p><b>Perícias:</b> {chosen.entry.pericias.join(', ')}</p>}
    {chosen.entry.poderOrigem&&<p><b>Habilidade de origem:</b> {chosen.entry.poderOrigem}</p>}
    {chosen.entry.elementosPossiveis?.length>1&&<label className="ordem-library-element-choice"><b>Escolha o elemento do ritual</b><select aria-label="Elemento do ritual escolhido" value={selectedRitualElement} onChange={e=>setSelectedRitualElement(e.target.value)}><option value="">Selecione o elemento...</option>{chosen.entry.elementosPossiveis.map(e=><option key={e} value={e}>{e}</option>)}</select></label>}
    {getOrdemLibraryWarnings(chosen.entry,tab,{classe,trilha,nex}).length>0&&<div className="ordem-library-warning">⚠ {getOrdemLibraryWarnings(chosen.entry,tab,{classe,trilha,nex}).join(' • ')}</div>}
    <p className="ordem-library-description">{chosen.entry.desc||'Preencha a descrição deste modelo na ficha.'}</p>
    {tab==='trilhas'&&Array.isArray(chosen.entry.progressao)&&chosen.entry.progressao.length>0&&<section className="ordem-library-progression" aria-label="Progressão da trilha"><strong>Habilidades por NEX</strong><small>Adicione apenas os poderes já adquiridos. Os efeitos completos devem ser consultados no livro.</small><div>{chosen.entry.progressao.map(step=><div className="ordem-library-progression-item" key={step.nex}><span><b>{step.nex}%</b> — {step.nome}</span><button type="button" disabled={Number(nex)<Number(step.nex)} onClick={()=>onChoose({id:chosen.entry.id+'-nex-'+step.nex,nome:step.nome,tipo:'habilidade',classe:chosen.entry.classe,trilha:chosen.entry.nome,nexMinimo:step.nex,fonte:chosen.entry.fonte,pagina:chosen.entry.pagina,desc:'Habilidade de trilha ('+step.nex+'% NEX). Consulte o efeito na página indicada.',bibliotecaOrigem:chosen.entry.bibliotecaOrigem},'habilidades')}>{Number(nex)<Number(step.nex)?'Bloqueado':'＋ Adicionar'}</button></div>)}</div></section>}
    <p className="ordem-library-copyright">Resumo de consulta do PJLite. Consulte a página citada para aplicar regras, restrições e progressão completas. Fontes oficiais, sem playtest.</p>
    <button className="ordem-library-insert" type="button" disabled={tab==='rituais'&&chosen.entry.elementosPossiveis?.length>1&&!chosen.entry.elementosPossiveis.includes(selectedRitualElement)} onClick={()=>choose(chosen)}>+ {tab==='origens'?'Usar origem':tab==='trilhas'?'Selecionar trilha':'Adicionar à ficha'}</button></>:<div className="ordem-library-placeholder">{source==='Arquivos Secretos #02'?'HQ Kemi: fonte de leitura disponível no menu. Não há habilidades jogáveis catalogadas para este pacote.':'Nenhum item corresponde aos filtros. Altere a pesquisa ou escolha outra categoria para continuar.'}</div>}</div></div>
  <footer className="ordem-library-footer">PJLite — projeto independente de fãs. Ordem Paranormal é propriedade de seus respectivos titulares. A biblioteca é um índice auxiliar e não substitui os livros.</footer>
 </section></div>,document.body);
}
