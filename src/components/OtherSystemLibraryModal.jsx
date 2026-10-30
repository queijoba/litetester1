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
 const [feedback,setFeedback]=useState('');
 useEffect(()=>{if(open&&config){setTab(config.tabs[0][0]);setQuery('');setSelected('');setCategory('Todas');setFeedback('');}},[open,system]);
 useEffect(()=>{if(!open)return;const close=e=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[open,onClose]);
 const rows=useMemo(()=>config?config.entries.filter(x=>x.tipo===tab).filter(x=>category==='Todas'||x.categoria===category).filter(x=>!query.trim()||norm([x.nome,x.fonte,x.pagina,x.desc,x.custo,x.valor,x.categoria].join(' ')).includes(norm(query))):[],[config,tab,query,category]);
 if(!open||!config||typeof document==='undefined')return null;
 // Não aplicar o primeiro resultado automaticamente: o usuário deve escolher.
 const current=rows.find(x=>x.id===selected)||null;
 const alreadyAdded=current&&system==='3det'&&(
  tab==='pericia'?!!data?.pericias?.[current.key]:
  tab==='arquetipo'?(
    norm(data?.bio?.arquetipo)===norm(current.nome)&&
    ['vantagens','desvantagens'].every((key,index)=>
      (current[index===0?'vantagensArquetipo':'desvantagensArquetipo']||[])
       .every(item=>(data?.[key]||[]).some(saved=>norm(saved?.pacoteItem||saved?.nome)===norm(item.nome)))
    )
  ):
  ({vantagem:'vantagens',desvantagem:'desvantagens',tecnica:'tecnicas'}[tab]
    ?(data?.[{vantagem:'vantagens',desvantagem:'desvantagens',tecnica:'tecnicas'}[tab]]||[]).some(item=>norm(item?.nome)===norm(current.nome)):false)
 );
 const filterGroups=tab==='tecnica'?['Todas','Truque','Comum','Lendária']:['Todas'];
 const pick=()=>{
  if(!current)return;
  const old=system==='3det'&&tab==='arquetipo'?data?.bio?.arquetipo:system==='somdas6'&&tab==='tormento'?data?.tormento?.tipo:'';
  if(old&&norm(old)!==norm(current.nome)&&!window.confirm(
  system==='3det'&&tab==='arquetipo'
   ?'Substituir '+old+' por '+current.nome+'? Os benefícios e limitações vinculados ao arquétipo antigo serão removidos; registros adicionados manualmente serão preservados.'
   :'Substituir '+old+' por '+current.nome+'? Os registros antigos serão preservados.'
 ))return;
  try{
   const applied=onChoose(current,tab);
   // Não fechar o modal quando a ficha não foi alterada (erro, campo ausente
   // ou item já existente). Evita a sensação de que a seleção desapareceu.
   if(applied?.changed===false){setFeedback(applied.message||'Não foi possível inserir esta referência.');return;}
   setFeedback('');
   onClose();
  }catch(error){setFeedback(error?.message||'Falha ao adicionar à ficha.');}
 };
 return createPortal(<div className={'lite-other-lib-backdrop '+(system==='somdas6'?'lite-other-lib-west':'lite-other-lib-victory')} onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
  <section className="lite-other-lib-dialog" role="dialog" aria-modal="true" aria-label={'Biblioteca '+config.title}>
   <header className="lite-other-lib-header"><div><span>ACERVO PJLITE • LIVRO BÁSICO</span><h2>📚 Biblioteca {config.title}</h2><p>{system==='3det'?'Escolha vendo o efeito, requisitos, custo e referências do livro':'Pesquisar e adicionar referências diretamente à ficha'}</p></div><button type="button" onClick={onClose} aria-label="Fechar biblioteca">×</button></header>
   <nav className="lite-other-lib-tabs">{config.tabs.map(([id,label])=><button key={id} type="button" aria-pressed={tab===id} onClick={()=>{setTab(id);setSelected('');setCategory('Todas');setFeedback('');}}>{label}</button>)}</nav>
   <div className="lite-other-lib-search"><input type="search" value={query} onChange={e=>{setQuery(e.target.value);setSelected('');setFeedback('');}} placeholder="Pesquisar nome, custo, página ou efeito..." aria-label="Pesquisar biblioteca"/>{filterGroups.length>1&&<select aria-label="Filtrar nível da técnica" value={category} onChange={e=>{setCategory(e.target.value);setSelected('');setFeedback('');}}>{filterGroups.map(x=><option key={x}>{x}</option>)}</select>}</div>
   <div className={'lite-other-lib-content'+(selected?' has-choice':'')}>
    <div className="lite-other-lib-results"><small>{rows.length} resultados • {config.entries.length} referências · selecione para ver a explicação</small>{rows.map(x=><button type="button" key={x.id} aria-pressed={current?.id===x.id} className={current?.id===x.id?'active':''} onClick={()=>{setSelected(x.id);setFeedback('')}}><strong>{x.nome}</strong><span>{x.categoria?x.categoria+' • ':''}{x.custo||x.valor||'p. '+x.pagina}</span>{system==='3det'&&<small className="lite-other-lib-result-desc">{x.desc}</small>}</button>)}{!rows.length&&<p>Sem resultados. Ajuste os filtros ou a pesquisa.</p>}</div>
    <div className="lite-other-lib-detail">{current?<><button type="button" className="lite-other-lib-back" onClick={()=>{setSelected('');setFeedback('')}}>← Voltar aos resultados</button><small>REFERÊNCIA DO LIVRO • p. {current.pagina}</small><h3>{current.nome}</h3><div className="lite-other-lib-tags">{[current.fonte,current.categoria,current.custo&&(current.tipo==='tecnica'?'Para aprender: ':'Custo: ')+current.custo,current.valor&&'Valor: '+current.valor].filter(Boolean).map((x,i)=><span key={i}>{x}</span>)}</div><div className="lite-other-lib-explainer"><strong>O que significa na ficha?</strong><p>{current.desc}</p></div>
    {system==='3det'&&current.tipo==='tecnica'&&<div className="lite-other-lib-use"><strong>Regras de uso no livro</strong><dl><div><dt>Requisitos</dt><dd>{current.requisitos||'Confira o manual'}</dd></div><div><dt>Alcance</dt><dd>{current.alcance||'Confira o manual'}</dd></div><div><dt>Gasto para usar</dt><dd>{current.uso||'Confira o manual'}</dd></div><div><dt>Para aprender</dt><dd>{current.custo||'Consulte o manual'}</dd></div></dl></div>}
    {system==='3det'&&current.tipo==='arquetipo'&&<div className="lite-other-lib-archetype">
      <section className="lite-other-lib-archetype__benefits"><h4>★ Benefícios e vantagens do arquétipo</h4>
       {(current.vantagensArquetipo||[]).map(item=><div key={item.nome}><strong>{item.nome}</strong><p>{item.desc}</p></div>)}
      </section>
      <section className="lite-other-lib-archetype__weaknesses"><h4>− Desvantagens e limitações</h4>
       {(current.desvantagensArquetipo||[]).map(item=><div key={item.nome}><strong>{item.nome}</strong><p>{item.desc}</p></div>)}
      </section>
      {current.observacaoArquetipo&&<p className="lite-other-lib-archetype__note">{current.observacaoArquetipo}</p>}
      <p className="lite-other-lib-note">Ao escolher, o PJLite inclui estes registros nas abas de Vantagens e Desvantagens. Se houver uma escolha pendente, personalize-a na ficha. O custo do pacote não será descontado automaticamente.</p>
     </div>}
    {system==='3det'&&current.tipo==='pericia'&&<p className="lite-other-lib-note">Esta opção marca a perícia na ficha, mas não altera automaticamente a pontuação total do personagem.</p>}
    <p className="lite-other-lib-notice">Referência de consulta com resumo editorial; confira os efeitos completos no livro antes de jogar. Nenhum atributo ou ponto de recurso é calculado sem sua escolha.</p>
    {alreadyAdded&&<p className="lite-other-lib-added" role="status">✓ Esta opção já está registrada na ficha.</p>}
    {feedback&&<p className="lite-other-lib-feedback" role="alert">{feedback}</p>}
    <button type="button" className="lite-other-lib-add" disabled={!!alreadyAdded} onClick={pick}>{alreadyAdded?'✓ Já está na ficha':tab==='arquetipo'?'Aplicar arquétipo e seu pacote':tab==='tormento'?'Selecionar na ficha':tab==='antecedente'?'Marcar 1 ponto na ficha':tab==='pericia'?'Selecionar perícia na ficha':'+ Adicionar à ficha'}</button></>:<div className="lite-other-lib-empty"><strong>Como usar a biblioteca</strong><p>1. Selecione uma opção na lista. 2. Leia o efeito, custo e página. 3. Clique em Adicionar à ficha. O PJLite mostrará o campo preenchido no editor do personagem.</p>{feedback&&<p role="alert">{feedback}</p>}</div>}</div>
   </div>
   {current&&<div className="lite-other-lib-mobile-action" role="group" aria-label="Ação da referência selecionada">
     {feedback&&<p role="alert" className="lite-other-lib-mobile-feedback">{feedback}</p>}
     <button type="button" className="lite-other-lib-add" disabled={!!alreadyAdded} onClick={pick}>
      {alreadyAdded?'✓ Já está na ficha':tab==='arquetipo'?'✓ Aplicar arquétipo e seu pacote':tab==='tormento'?'Selecionar na ficha':tab==='antecedente'?'Marcar 1 ponto na ficha':tab==='pericia'?'Selecionar perícia na ficha':'+ Adicionar à ficha'}
     </button>
   </div>}
   <footer>Som das Seis: regras CC BY-SA 4.0 (Ramon Mineiro). 3DeT Victory: obra dos respectivos titulares. O PJLite é um projeto independente.</footer>
  </section></div>,document.body);
}
