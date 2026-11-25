import * as React from 'react';
import BookThreatReference from './BookThreatReference.jsx';
import PrivateThreatImport from './PrivateThreatImport.jsx';
import {readPrivateThreats} from './privateThreatPack.js';
import {BOOK_THREAT_MODELS} from './bookThreatModels.js';

// Seleciona modelos sem copiar fichas para a Conta Lite automaticamente.
// O fluxo "Escolher modelo -> editar -> Salvar" continua sob controle do usuário.
const fold=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

// Pictogramas originais do PJLite: acompanham rótulos, sem depender de cor ou emoji.
const ORDEM_ICONS={
 sangue:'M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13Z M8 15c0 2 1 3 3 4',
 morte:'M20 12a8 8 0 1 0-8 8 6 6 0 1 0-6-6 4 4 0 1 0 4-4 2 2 0 1 0-2 2',
 conhecimento:'M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
 energia:'M13 2 4 13h7l-1 9 10-13h-8l1-7Z',
 medo:'M12 3 22 20H2L12 3Z M12 9v5 M12 17h.01',
 nenhum:'M3 3h18v18H3z M8 12h8',
 criatura:'M3 4l5 5 4-2 4 2 5-5-2 11-7 6-7-6L3 4Z M8 13h.01 M16 13h.01 M10 17h4',
 pessoa:'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M4 21v-3a8 8 0 0 1 16 0v3',
 animal:'M12 12c-3 0-7 4-7 6s2 3 4 2l3-1 3 1c2 1 4 0 4-2s-4-6-7-6Z M5 6a2 3 0 1 0 0 6 2 3 0 1 0 0-6Z M10 3a2 3 0 1 0 0 6 2 3 0 1 0 0-6Z M16 3a2 3 0 1 0 0 6 2 3 0 1 0 0-6Z M21 6a2 3 0 1 0 0 6 2 3 0 1 0 0-6Z',
 reliquia:'M12 2 21 12 12 22 3 12 12 2Z M12 7 16 12 12 17 8 12 12 7Z',
 outros:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 8v5 M12 16h.01'
};
const iconKey=value=>{const k=fold(value).trim();return k==='humano'||k==='npc'||k==='pnj'?'pessoa':k.startsWith('animal')?'animal':Object.hasOwn(ORDEM_ICONS,k)?k:'outros';};
const ordemElements=item=>String(item.elemento||'').split('/').map(x=>x.trim()).filter(Boolean);
function OrdemIcon({value}){
 const key=iconKey(value);
 return <svg className={'ordem-catalog-icon ordem-icon-'+key} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={ORDEM_ICONS[key]}/></svg>;
}
function OrdemTag({value,kind='element'}){
 return <span className={'ordem-catalog-tag ordem-tag-'+iconKey(value)} data-kind={kind}><OrdemIcon value={value}/>{value}</span>;
}
function OrdemGroupIcon({title}){
 const key=title.startsWith('Elemento · ')?title.split(' · ')[1]:title.startsWith('Realidade')?'Nenhum':'Outros';
 return <OrdemIcon value={key}/>;
}

export default function ThreatCatalog({groups,onSelect,system='3det',showReferences=true}){
 const [query,setQuery]=React.useState('');
 const searchId=React.useId();
 const [visibleCount,setVisibleCount]=React.useState(48);
 const [type,setType]=React.useState('todos');
 const [source,setSource]=React.useState('Todas as fontes');
 const [element,setElement]=React.useState('Todos os elementos');
 const [vdMin,setVdMin]=React.useState('');
 const [vdMax,setVdMax]=React.useState('');
 const [vdOrder,setVdOrder]=React.useState('asc');
 const isOrdem=system==='ordemParanormal';
 const isExtended=['dnd5e','fabula','skyfall'].includes(system);
 const [category,setCategory]=React.useState('Todas');
 const [rating,setRating]=React.useState('Todos');
 const categoryOf=x=>String(x.categoria||x.especie||x.tipo||'Outros');
 const ratingOf=x=>String(system==='fabula'?x.nivel??'':system==='skyfall'?x.nivelDesafio??'':String(x.desafio??'').trim().split(/\s+/)[0]);
 const [privateItems,setPrivateItems]=React.useState(()=>readPrivateThreats(system));
 React.useEffect(()=>{setVisibleCount(48);},[system,query,type,source,category,rating]);
 const bookItems=isExtended&&showReferences?(BOOK_THREAT_MODELS[system]||[]):[];
 const catalogGroups=[...groups,...(bookItems.length?[{title:'Livro • fichas mecânicas de referência',items:bookItems}]:[]),...(isExtended&&showReferences&&privateItems.length?[{title:'Meu bestiário particular',items:privateItems}]:[])];
 const all=catalogGroups.flatMap(group=>group.items||[]);
 const count=all.length;
 const categories=[...new Set(all.map(categoryOf))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
 const ratings=[...new Set(all.map(ratingOf).filter(Boolean))].sort((a,b)=>{const n=x=>x.includes('/')?Number(x.split('/')[0])/Number(x.split('/')[1]):Number(x);return n(a)-n(b);});
 const sources=[...new Set(all.map(x=>String(x.fonte||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}));
 const elements=['Sangue','Morte','Conhecimento','Energia','Medo','Nenhum'];
 const filtered=catalogGroups.map(group=>{
  const items=(group.items||[]).filter(item=>{
   const isNpc=item.type==='pnj'||item.categoria==='NPC'||item.papel==='Aliado';
   if(type==='ameacas'&&isNpc)return false;
   if(type==='npcs'&&!isNpc)return false;
   if(isExtended){if(category!=='Todas'&&categoryOf(item)!==category)return false;if(rating!=='Todos'&&ratingOf(item)!==rating)return false;if(source!=='Todas as fontes'&&item.fonte!==source)return false;}
   if(isOrdem){
    if(source!=='Todas as fontes'&&item.fonte!==source)return false;
    const tokens=String(item.elemento||'').split('/').map(v=>fold(v.trim()));
    if(element!=='Todos os elementos'&&!tokens.includes(fold(element)))return false;
    const vd=Number(item.vd);
    if(vdMin!==''&&(!Number.isFinite(vd)||vd<Number(vdMin)))return false;
    if(vdMax!==''&&(!Number.isFinite(vd)||vd>Number(vdMax)))return false;
   }
   return !query.trim()||fold([item.nome,item.descricao,item.conceito,item.grupo,item.papel,item.categoria,item.elemento,item.vd,item.fonte,item.codigo,item.nomeOriginal,item.tipo,item.especie,item.nivel,item.nivelDesafio,item.desafio,group.title].join(' ')).includes(fold(query.trim()));
  }).sort((a,b)=>isOrdem?((vdOrder==='asc'?1:-1)*(Number(a.vd||0)-Number(b.vd||0))||String(a.nome).localeCompare(String(b.nome),'pt-BR')):0);
  return {...group,items};
 }).filter(group=>group.items.length);
 const matchCount=filtered.reduce((n,g)=>n+g.items.length,0);
 let remaining=system==='dnd5e'?visibleCount:Infinity;
 const visibleGroups=filtered.map(group=>{const items=group.items.slice(0,remaining);remaining-=items.length;return {...group,items};}).filter(group=>group.items.length);
 const dark=system==='rotaZero';
 return <div className={isOrdem?'space-y-3 ordem-threat-catalog':'space-y-3 lite-threat-catalog'}>
  <div className={dark?'rounded-md border border-[#9ca8a0] bg-[#f2f0e9] p-3':'rounded-md border border-amber-200 bg-amber-50 p-3'}>
   <label className="block text-xs font-bold text-zinc-800" htmlFor={searchId}>
    Pesquisar modelos ({count})
   </label>
   <input id={searchId} type="search" value={query} onChange={e=>setQuery(e.target.value)}
    placeholder="Nome, livro, categoria ou grupo..." className="mt-2 w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"/>
   <div className="mt-2 flex gap-2">
    {[['todos','Todos'],['ameacas','Ameaças'],['npcs','NPCs']].map(([id,label])=>
     <button key={id} type="button" aria-pressed={type===id} onClick={()=>setType(id)}
      className={'rounded px-3 py-1 text-xs font-bold '+(type===id?'bg-zinc-900 text-white':'border border-zinc-400 bg-white text-zinc-800')}>{label}</button>)}
   </div>
   {isExtended&&<div className="lite-catalog-filters mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"><label className="text-xs font-bold">Categoria<select value={category} onChange={e=>setCategory(e.target.value)} className="mt-1 block w-full rounded border bg-white p-2"><option>Todas</option>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label className="text-xs font-bold">{system==='fabula'?'Nível':'ND'}<select value={rating} onChange={e=>setRating(e.target.value)} className="mt-1 block w-full rounded border bg-white p-2"><option>Todos</option>{ratings.map(x=><option key={x}>{x}</option>)}</select></label><label className="text-xs font-bold">Fonte<select value={source} onChange={e=>setSource(e.target.value)} className="mt-1 block w-full rounded border bg-white p-2"><option>Todas as fontes</option>{sources.map(x=><option key={x}>{x}</option>)}</select></label><button type="button" className="rounded border bg-white p-2 text-xs font-bold self-end" onClick={()=>{setQuery('');setType('todos');setSource('Todas as fontes');setCategory('Todas');setRating('Todos');}}>Limpar filtros</button><p className="col-span-full text-xs" role="status">{filtered.reduce((n,g)=>n+g.items.length,0)} de {count} modelos</p></div>}
   {isOrdem&&<div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Filtros do bestiário de Ordem Paranormal">
    <label className="text-xs font-bold text-zinc-800">Livro / suplemento
     <select aria-label="Filtrar livro ou suplemento" value={source} onChange={e=>setSource(e.target.value)} className="mt-1 block w-full rounded border border-zinc-400 bg-white px-2 py-2 text-zinc-900">
      <option>Todas as fontes</option>{sources.map(x=><option key={x} value={x}>{x}</option>)}
     </select>
    </label>
    <label className="text-xs font-bold text-zinc-800">Elemento
     <select aria-label="Filtrar elemento paranormal" value={element} onChange={e=>setElement(e.target.value)} className="mt-1 block w-full rounded border border-zinc-400 bg-white px-2 py-2 text-zinc-900">
      <option>Todos os elementos</option>{elements.map(x=><option key={x} value={x}>{x==='Nenhum'?'Nenhum · Realidade':x}</option>)}
     </select>
    </label>
    <label className="text-xs font-bold text-zinc-800">VD mínimo
     <input aria-label="VD mínimo" type="number" min="0" step="1" value={vdMin} onChange={e=>setVdMin(e.target.value)} placeholder="Qualquer" className="mt-1 w-full rounded border border-zinc-400 bg-white px-2 py-2 text-zinc-900"/>
    </label>
    <label className="text-xs font-bold text-zinc-800">VD máximo
     <input aria-label="VD máximo" type="number" min="0" step="1" value={vdMax} onChange={e=>setVdMax(e.target.value)} placeholder="Qualquer" className="mt-1 w-full rounded border border-zinc-400 bg-white px-2 py-2 text-zinc-900"/>
    </label>
    <div className="col-span-full flex flex-wrap items-center justify-between gap-2">
     <label className="text-xs font-bold text-zinc-800">Ordenação
      <select aria-label="Ordenar por VD" value={vdOrder} onChange={e=>setVdOrder(e.target.value)} className="ml-2 rounded border border-zinc-400 bg-white p-1.5 text-zinc-900">
       <option value="asc">Menor VD primeiro</option><option value="desc">Maior VD primeiro</option>
      </select>
     </label>
     <button type="button" onClick={()=>{setSource('Todas as fontes');setElement('Todos os elementos');setVdMin('');setVdMax('');setQuery('');setType('todos');setVdOrder('asc');}} className="rounded border border-zinc-500 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900">Limpar filtros</button>
    </div>
    <p role="status" className="col-span-full text-xs font-bold text-zinc-800">{filtered.reduce((n,x)=>n+x.items.length,0)} de {count} modelos encontrados</p>
   </div>}
  </div>
  {isExtended&&showReferences&&<><PrivateThreatImport system={system} items={privateItems} onChange={setPrivateItems}/><BookThreatReference system={system}/></>}
  {visibleGroups.map(group=><section key={group.title}>
   <div className="mb-2 flex items-baseline justify-between gap-2 border-b border-zinc-300 pb-1">
    <h3 className="text-sm font-black text-zinc-900">{isOrdem&&<OrdemGroupIcon title={group.title}/>}<span>{group.title}</span></h3>
    <small className="text-xs text-zinc-700">{group.items.length} modelo(s)</small>
   </div>
   <div className="grid gap-2 sm:grid-cols-2">{group.items.map((modelo,idx)=>
    <button key={modelo.nome+'-'+idx} type="button" onClick={()=>onSelect(modelo)}
     className={'rounded border-2 bg-white p-3 text-left transition hover:shadow-md '+(dark?'border-[#a5aca5] hover:border-[#42594d]':'border-amber-100 hover:border-amber-500')}>
     {isOrdem?<><div className="ordem-catalog-card-heading"><strong>{modelo.nome}</strong><span className="ordem-catalog-vd">VD <b>{modelo.vd}</b></span></div>
      <div className="ordem-catalog-tags"><OrdemTag kind="type" value={modelo.categoria||'Outros'}/>{(ordemElements(modelo).length?ordemElements(modelo):['Não especificado']).map(element=><OrdemTag key={element} value={element==='Nenhum'?'Nenhum':element}/>)}</div></>:<>
      <strong className="block text-sm font-black text-zinc-950">{modelo.nome}</strong>
      <span className="text-xs text-zinc-700">{modelo.categoria||modelo.especie||modelo.tipo}{isExtended&&ratingOf(modelo)?' · '+(system==='fabula'?'Nível ':'ND ')+ratingOf(modelo):''}{modelo.patente?' · '+modelo.patente:''}{modelo.hierarquia?' · '+modelo.hierarquia:''}{modelo.papel?' · '+modelo.papel:''}{Number.isFinite(modelo.pontos)?' · '+modelo.pontos+' pts':''}</span></>}
     <p className="mt-1 line-clamp-2 text-xs text-zinc-700">{modelo.descricao||modelo.conceito||'Modelo personalizável para a mesa.'}</p>
     {modelo.dadosParciais&&isExtended&&<small className="block text-xs text-zinc-700">Ficha editável • revisar efeitos no livro</small>}
     {modelo.fonte&&<small className="mt-1 block text-xs text-zinc-600">{modelo.fonte}{modelo.pagina?' · p. '+modelo.pagina:''}</small>}
     {modelo.grupo&&<small className="block text-xs text-zinc-600">{modelo.grupo}</small>}
    </button>)}</div>
  </section>)}
  {system==='dnd5e'&&matchCount>visibleCount&&<button type="button" className="w-full rounded border border-zinc-400 bg-white p-3 text-sm font-bold text-zinc-900" onClick={()=>setVisibleCount(n=>n+48)}>Mostrar mais modelos ({Math.min(visibleCount,matchCount)} de {matchCount})</button>}
  {!filtered.length&&<p role="status" className="rounded border border-zinc-300 bg-white p-4 text-sm text-zinc-800">Nenhum modelo corresponde à busca. Tente outro nome ou categoria.</p>}
 </div>;
}
