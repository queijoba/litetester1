import React,{useEffect,useMemo,useState} from 'react';
import {createPortal} from 'react-dom';
import {SKYFALL_LIBRARY_CATALOG,SKYFALL_LIBRARY_COUNTS} from './libraryCatalog.js';
import {skyfallLibraryWarnings,normalizeSkyfallTerm} from './libraryActions.js';
import {findAbilityPresets} from '../../components/abilityPresetLibrary.js';
import './skyfall-library.css';

const sections=[['legado','Legados'],['maldicao','Maldições'],['antecedente','Antecedentes'],['classe','Classes'],['trilha','Trilhas'],['habilidade','Habilidades'],['magia','Magias']];
const layers=['Todas as camadas','Truque','Superficial','Rasa','Profunda'];
const groups=['Todos os tipos','Controle','Ofensivo','Utilitário'];
const sourceOptions=['Todas as fontes','Skyfall RPG — Livro Básico 1.25','Meus modelos'];
const plural={habilidade:'habilidades',magia:'magias'};
const count=Object.values(SKYFALL_LIBRARY_COUNTS).reduce((n,x)=>n+x,0);
const normalized=normalizeSkyfallTerm;

export default function SkyfallLibraryModal({open=false,initialTab='legado',bio={},onChoose,onClose}){
 const [tab,setTab]=useState('legado');
 const [query,setQuery]=useState('');
 const [source,setSource]=useState('Todas as fontes');
 const [layer,setLayer]=useState('Todas as camadas');
 const [group,setGroup]=useState('Todos os tipos');
 const [onlyEligible,setOnlyEligible]=useState(false);
 const [selected,setSelected]=useState('');
 useEffect(()=>{if(!open)return;setTab(sections.some(x=>x[0]===initialTab)?initialTab:'legado');setQuery('');setSource('Todas as fontes');setLayer('Todas as camadas');setGroup('Todos os tipos');setOnlyEligible(false);setSelected('');},[open,initialTab]);
 useEffect(()=>{if(!open)return;const key=e=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[open,onClose]);
 const items=useMemo(()=>{
  const official=SKYFALL_LIBRARY_CATALOG.filter(x=>x.tipo===tab).map(entry=>({id:entry.id,name:entry.nome,entry,source:'official'}));
  const personal=plural[tab]?findAbilityPresets('skyfall',plural[tab]).filter(x=>x.source==='personal'):[];
  return [...personal,...official].filter(x=>{
   const e=x.entry||{};
   if(source==='Meus modelos'&&x.source!=='personal')return false;
   if(source!=='Todas as fontes'&&source!=='Meus modelos'&&e.fonte!==source)return false;
   if(tab==='magia'&&layer!=='Todas as camadas'&&e.camada!==layer)return false;
   if(tab==='magia'&&group!=='Todos os tipos'&&e.grupo!==group)return false;
   if(onlyEligible&&skyfallLibraryWarnings(e,tab,{...bio,nivel:bio.nivel||1}).length)return false;
   if(!query.trim())return true;
   return normalized([e.nome,e.fonte,e.pagina,e.desc,e.origem,e.antecedente,e.classe,e.camada,e.grupo].join(' ')).includes(normalized(query));
  }).sort((a,b)=>a.source===b.source?a.name.localeCompare(b.name,'pt-BR'):a.source==='personal'?-1:1);
 },[tab,query,source,layer,group,onlyEligible,bio.classe,bio.antecedente,bio.nivel,open]);
 if(!open||typeof document==='undefined')return null;
 const current=items.find(x=>x.id===selected)||items[0]||null;
 const selectTab=kind=>{setTab(kind);setSelected('');setLayer('Todas as camadas');setGroup('Todos os tipos');};
 const choose=()=>{
  if(!current)return;
  const e=current.entry,field={legado:'legado',maldicao:'maldicao',antecedente:'antecedente',classe:'classe',trilha:'trilha'}[tab];
  const warnings=skyfallLibraryWarnings(e,tab,{...bio,nivel:bio.nivel||1});
  if(field&&bio[field]&&normalized(bio[field])!==normalized(e.nome))warnings.unshift('A seleção atual de '+field+' ('+bio[field]+') será substituída. Habilidades e anotações antigas permanecerão.');
  if(warnings.length&&!window.confirm('Antes de aplicar:\n• '+warnings.join('\n• ')+'\n\nContinuar?'))return;
  onChoose(e,tab);onClose();
 };
 return createPortal(<div className="skyfall-lib-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
  <section className="skyfall-lib-modal" role="dialog" aria-modal="true" aria-label="Biblioteca Skyfall RPG">
   <header className="skyfall-lib-header"><div><small>SKYFALL RPG // ARQUIVO DO ARCANUM</small><h2>📚 Biblioteca Skyfall</h2><p>Livro Básico 1.25 • Criação de personagem • Magias</p></div><button type="button" onClick={onClose} aria-label="Fechar biblioteca">×</button></header>
   <nav className="skyfall-lib-tabs" aria-label="Categorias da biblioteca">{sections.map(([id,name])=><button type="button" key={id} aria-pressed={id===tab} className={id===tab?'active':''} onClick={()=>selectTab(id)}>{name}</button>)}</nav>
   <div className="skyfall-lib-search"><input type="search" aria-label="Pesquisar biblioteca Skyfall" placeholder="Pesquisar nome, origem, classe ou referência..." value={query} onChange={e=>{setQuery(e.target.value);setSelected('');}}/><select aria-label="Filtrar fonte" value={source} onChange={e=>{setSource(e.target.value);setSelected('');}}>{sourceOptions.map(x=><option key={x}>{x}</option>)}</select>{tab==='magia'&&<><select aria-label="Filtrar camada" value={layer} onChange={e=>{setLayer(e.target.value);setSelected('');}}>{layers.map(x=><option key={x}>{x}</option>)}</select><select aria-label="Filtrar tipo de magia" value={group} onChange={e=>{setGroup(e.target.value);setSelected('');}}>{groups.map(x=><option key={x}>{x}</option>)}</select></>}</div>
   <div className="skyfall-lib-context"><span><b>{bio?.classe||'Classe indefinida'}</b>{bio?.trilha?' • '+bio.trilha:''} • Nível {bio?.nivel||1}</span><button type="button" aria-pressed={onlyEligible} onClick={()=>{setOnlyEligible(x=>!x);setSelected('');}}>{onlyEligible?'✓ Mostrar todas':'Somente opções compatíveis'}</button></div>
   <div className={'skyfall-lib-body'+(selected?' skyfall-lib-body--has-selection':'')}>
    <div className="skyfall-lib-results" aria-label="Resultados da biblioteca"><div className="skyfall-lib-count">{items.length} resultado{items.length===1?'':'s'} • {count} referências do Livro Básico</div>{items.map(x=><button type="button" key={x.id} className={current?.id===x.id?'active':''} onClick={()=>setSelected(x.id)}><strong>{x.name}</strong><small>{x.source==='personal'?'Meu modelo':(x.entry.camada?'Camada '+x.entry.camada+' • ':'')+(x.entry.pagina?'p. '+x.entry.pagina:'Livro Básico')}</small></button>)}{!items.length&&<p className="skyfall-lib-empty">Nenhuma referência encontrada. Experimente outra palavra ou retire os filtros.</p>}</div>
    <div className="skyfall-lib-detail">{current?<><button type="button" className="skyfall-lib-back" onClick={()=>setSelected('')}>← Voltar aos resultados</button><small className="skyfall-lib-kicker">{current.source==='personal'?'MODELO SALVO NESTE DISPOSITIVO':'LIVRO BÁSICO 1.25 • ÍNDICE DE CONSULTA'}</small><h3>{current.name}</h3><div className="skyfall-lib-tags">{[current.entry.fonte,current.entry.pagina?'Página '+current.entry.pagina:'',current.entry.camada&&'Camada '+current.entry.camada,current.entry.grupo,current.entry.classe,current.entry.antecedente].filter(Boolean).map((x,i)=><span key={i}>{x}</span>)}</div><p className="skyfall-lib-description">{current.entry.desc||'Modelo pessoal sem descrição.'}</p>{skyfallLibraryWarnings(current.entry,tab,{...bio,nivel:bio.nivel||1}).length>0&&<p className="skyfall-lib-warning">⚠ {skyfallLibraryWarnings(current.entry,tab,{...bio,nivel:bio.nivel||1}).join(' • ')}</p>}<p className="skyfall-lib-note">As descrições são lembretes editoriais e não substituem as regras do livro. O registro permanece editável na ficha.</p><button type="button" className="skyfall-lib-use" onClick={choose}>+ {tab==='magia'||tab==='habilidade'?'Adicionar à ficha':'Selecionar '+({legado:'legado',maldicao:'maldição',antecedente:'antecedente',classe:'classe',trilha:'trilha'}[tab]||'')}</button></>:<div className="skyfall-lib-placeholder">Escolha uma referência ou altere os filtros para consultar a biblioteca.</div>}</div>
   </div>
   <footer className="skyfall-lib-footer">PJLite é um projeto independente de fãs. Os direitos de Skyfall RPG pertencem aos seus titulares. Nenhum efeito é aplicado automaticamente a PV, atributos ou perícias.</footer>
  </section>
 </div>,document.body);
}
