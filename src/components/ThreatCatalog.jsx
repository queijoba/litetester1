import * as React from 'react';

// Seleciona modelos sem copiar fichas para a Conta Lite automaticamente.
// O fluxo "Escolher modelo -> editar -> Salvar" continua sob controle do usuário.
const fold=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export default function ThreatCatalog({groups,onSelect,system='3det'}){
 const [query,setQuery]=React.useState('');
 const [type,setType]=React.useState('todos');
 const [source,setSource]=React.useState('Todas as fontes');
 const [element,setElement]=React.useState('Todos os elementos');
 const [vdMin,setVdMin]=React.useState('');
 const [vdMax,setVdMax]=React.useState('');
 const [vdOrder,setVdOrder]=React.useState('asc');
 const isOrdem=system==='ordemParanormal';
 const all=groups.flatMap(group=>group.items||[]);
 const count=all.length;
 const sources=[...new Set(all.map(x=>String(x.fonte||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}));
 const elements=['Sangue','Morte','Conhecimento','Energia','Medo','Nenhum'];
 const filtered=groups.map(group=>{
  const items=(group.items||[]).filter(item=>{
   const isNpc=item.type==='pnj'||item.categoria==='NPC'||item.papel==='Aliado';
   if(type==='ameacas'&&isNpc)return false;
   if(type==='npcs'&&!isNpc)return false;
   if(isOrdem){
    if(source!=='Todas as fontes'&&item.fonte!==source)return false;
    const tokens=String(item.elemento||'').split('/').map(v=>fold(v.trim()));
    if(element!=='Todos os elementos'&&!tokens.includes(fold(element)))return false;
    const vd=Number(item.vd);
    if(vdMin!==''&&(!Number.isFinite(vd)||vd<Number(vdMin)))return false;
    if(vdMax!==''&&(!Number.isFinite(vd)||vd>Number(vdMax)))return false;
   }
   return !query.trim()||fold([item.nome,item.descricao,item.conceito,item.grupo,item.papel,item.categoria,item.elemento,item.vd,item.fonte,item.codigo,group.title].join(' ')).includes(fold(query.trim()));
  }).sort((a,b)=>isOrdem?((vdOrder==='asc'?1:-1)*(Number(a.vd||0)-Number(b.vd||0))||String(a.nome).localeCompare(String(b.nome),'pt-BR')):0);
  return {...group,items};
 }).filter(group=>group.items.length);
 const dark=system==='rotaZero';
 return <div className="space-y-3">
  <div className={dark?'rounded-md border border-[#9ca8a0] bg-[#f2f0e9] p-3':'rounded-md border border-amber-200 bg-amber-50 p-3'}>
   <label className="block text-xs font-bold text-zinc-800" htmlFor={'threat-search-'+system}>
    Pesquisar modelos ({count})
   </label>
   <input id={'threat-search-'+system} type="search" value={query} onChange={e=>setQuery(e.target.value)}
    placeholder="Nome, livro, categoria ou grupo..." className="mt-2 w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"/>
   <div className="mt-2 flex gap-2">
    {[['todos','Todos'],['ameacas','Ameaças'],['npcs','NPCs']].map(([id,label])=>
     <button key={id} type="button" aria-pressed={type===id} onClick={()=>setType(id)}
      className={'rounded px-3 py-1 text-xs font-bold '+(type===id?'bg-zinc-900 text-white':'border border-zinc-400 bg-white text-zinc-800')}>{label}</button>)}
   </div>
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
  {filtered.map(group=><section key={group.title}>
   <div className="mb-2 flex items-baseline justify-between gap-2 border-b border-zinc-300 pb-1">
    <h3 className="text-sm font-black text-zinc-900">{group.title}</h3>
    <small className="text-xs text-zinc-700">{group.items.length} modelo(s)</small>
   </div>
   <div className="grid gap-2 sm:grid-cols-2">{group.items.map((modelo,idx)=>
    <button key={modelo.nome+'-'+idx} type="button" onClick={()=>onSelect(modelo)}
     className={'rounded border-2 bg-white p-3 text-left transition hover:shadow-md '+(dark?'border-[#a5aca5] hover:border-[#42594d]':'border-amber-100 hover:border-amber-500')}>
     <strong className="block text-sm font-black text-zinc-950">{modelo.nome}</strong>
     <span className="text-xs text-zinc-700">{modelo.categoria}{modelo.papel?' · '+modelo.papel:''}{Number.isFinite(modelo.pontos)?' · '+modelo.pontos+' pts':''}{isOrdem?' · '+(modelo.elemento||'Não especificado')+' · VD '+modelo.vd:''}</span>
     <p className="mt-1 line-clamp-2 text-xs text-zinc-700">{modelo.descricao||modelo.conceito||'Modelo personalizável para a mesa.'}</p>
     {modelo.fonte&&<small className="mt-1 block text-xs text-zinc-600">{modelo.fonte}{modelo.pagina?' · p. '+modelo.pagina:''}</small>}
     {modelo.grupo&&<small className="block text-xs text-zinc-600">{modelo.grupo}</small>}
    </button>)}</div>
  </section>)}
  {!filtered.length&&<p role="status" className="rounded border border-zinc-300 bg-white p-4 text-sm text-zinc-800">Nenhum modelo corresponde à busca. Tente outro nome ou categoria.</p>}
 </div>;
}
