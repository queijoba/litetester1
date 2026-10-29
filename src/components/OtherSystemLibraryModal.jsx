import React,{useEffect,useMemo,useState} from 'react';
import {createPortal} from 'react-dom';
import {SYSTEM_LIBRARIES} from './otherSystemLibraryCatalog.js';
import './otherSystemLibrary.css';
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
export default function OtherSystemLibraryModal({open=false,system,data,onChoose,onClose}){
 const config=SYSTEM_LIBRARIES[system];
 const [tab,setTab]=useState('');
 const [query,setQuery]=useState('');
 const [category,setCategory]=useState('Todas');
 const [selected,setSelected]=useState('');
 useEffect(()=>{if(open&&config){setTab(config.tabs[0][0]);setQuery('');setSelected('');setCategory('Todas');}},[open,system]);
 useEffect(()=>{if(!open)return;const close=e=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[open,onClose]);
 const rows=useMemo(()=>config?config.entries.filter(x=>x.tipo===tab).filter(x=>category==='Todas'||x.categoria===category).filter(x=>!query.trim()||norm([x.nome,x.fonte,x.pagina,x.desc,x.custo,x.valor,x.categoria].join(' ')).includes(norm(query))):[],[config,tab,query,category]);
 if(!open||!config||typeof document==='undefined')return null;
 const current=rows.find(x=>x.id===selected)||rows[0]||null;
 const filterGroups=tab==='tecnica'?['Todas','Truque','Comum','Lendária']:['Todas'];
 const pick=()=>{
  if(!current)return;
  const old=system==='3det'&&tab==='arquetipo'?data?.bio?.arquetipo:system==='somdas6'&&tab==='tormento'?data?.tormento?.tipo:'';
  if(old&&norm(old)!==norm(current.nome)&&!window.confirm('Substituir '+old+' por '+current.nome+'? Os registros antigos serão preservados.'))return;
  onChoose(current,tab);onClose();
 };
 return createPortal(<div className={'lite-other-lib-backdrop '+(system==='somdas6'?'lite-other-lib-west':'lite-other-lib-victory')} onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
  <section className="lite-other-lib-dialog" role="dialog" aria-modal="true" aria-label={'Biblioteca '+config.title}>
   <header className="lite-other-lib-header"><div><span>ACERVO PJLITE • LIVRO BÁSICO</span><h2>📚 Biblioteca {config.title}</h2><p>{system==='3det'?'Escolha vendo o efeito, requisitos, custo e referências do livro':'Pesquisar e adicionar referências diretamente à ficha'}</p></div><button type="button" onClick={onClose} aria-label="Fechar biblioteca">×</button></header>
   <nav className="lite-other-lib-tabs">{config.tabs.map(([id,label])=><button key={id} type="button" aria-pressed={tab===id} onClick={()=>{setTab(id);setSelected('');setCategory('Todas');}}>{label}</button>)}</nav>
   <div className="lite-other-lib-search"><input type="search" value={query} onChange={e=>{setQuery(e.target.value);setSelected('');}} placeholder="Pesquisar nome, custo, página ou efeito..." aria-label="Pesquisar biblioteca"/>{filterGroups.length>1&&<select aria-label="Filtrar nível da técnica" value={category} onChange={e=>{setCategory(e.target.value);setSelected('');}}>{filterGroups.map(x=><option key={x}>{x}</option>)}</select>}</div>
   <div className={'lite-other-lib-content'+(selected?' has-choice':'')}>
    <div className="lite-other-lib-results"><small>{rows.length} resultados • {config.entries.length} referências</small>{rows.map(x=><button type="button" key={x.id} className={current?.id===x.id?'active':''} onClick={()=>setSelected(x.id)}><strong>{x.nome}</strong><span>{x.categoria?x.categoria+' • ':''}{x.custo||x.valor||'p. '+x.pagina}</span>{system==='3det'&&<small className="lite-other-lib-result-desc">{x.desc}</small>}</button>)}{!rows.length&&<p>Sem resultados. Ajuste os filtros ou a pesquisa.</p>}</div>
    <div className="lite-other-lib-detail">{current?<><button type="button" className="lite-other-lib-back" onClick={()=>setSelected('')}>← Voltar aos resultados</button><small>REFERÊNCIA DO LIVRO • p. {current.pagina}</small><h3>{current.nome}</h3><div className="lite-other-lib-tags">{[current.fonte,current.categoria,current.custo&&(current.tipo==='tecnica'?'Para aprender: ':'Custo: ')+current.custo,current.valor&&'Valor: '+current.valor].filter(Boolean).map((x,i)=><span key={i}>{x}</span>)}</div><div className="lite-other-lib-explainer"><strong>O que significa na ficha?</strong><p>{current.desc}</p></div>
    {system==='3det'&&current.tipo==='tecnica'&&<div className="lite-other-lib-use"><strong>Regras de uso no livro</strong><dl><div><dt>Requisitos</dt><dd>{current.requisitos||'Confira o manual'}</dd></div><div><dt>Alcance</dt><dd>{current.alcance||'Confira o manual'}</dd></div><div><dt>Gasto para usar</dt><dd>{current.uso||'Confira o manual'}</dd></div><div><dt>Para aprender</dt><dd>{current.custo||'Consulte o manual'}</dd></div></dl></div>}
    {system==='3det'&&current.tipo==='arquetipo'&&<p className="lite-other-lib-note">Selecionar o arquétipo não adiciona suas vantagens, desvantagens ou gastos automaticamente: revise a composição da origem no manual.</p>}
    {system==='3det'&&current.tipo==='pericia'&&<p className="lite-other-lib-note">Esta opção marca a perícia na ficha, mas não altera automaticamente a pontuação total do personagem.</p>}
    <p className="lite-other-lib-notice">Referência de consulta com resumo editorial; confira os efeitos completos no livro antes de jogar. Nenhum atributo ou ponto de recurso é calculado sem sua escolha.</p><button type="button" className="lite-other-lib-add" onClick={pick}>{tab==='arquetipo'||tab==='tormento'?'Selecionar na ficha':tab==='antecedente'?'Marcar 1 ponto na ficha':tab==='pericia'?'Selecionar perícia na ficha':'+ Adicionar à ficha'}</button></>:<p>Escolha um registro para ver sua referência e adicioná-lo à ficha.</p>}</div>
   </div>
   <footer>Som das Seis: regras CC BY-SA 4.0 (Ramon Mineiro). 3DeT Victory: obra dos respectivos titulares. O PJLite é um projeto independente.</footer>
  </section></div>,document.body);
}
