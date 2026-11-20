import * as React from 'react';

// Seleciona modelos sem copiar fichas para a Conta Lite automaticamente.
// O fluxo "Escolher modelo -> editar -> Salvar" continua sob controle do usuário.
const fold=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export default function ThreatCatalog({groups,onSelect,system='3det'}){
 const [query,setQuery]=React.useState('');
 const [type,setType]=React.useState('todos');
 const all=groups.flatMap(group=>group.items||[]);
 const count=all.length;
 const filtered=groups.map(group=>{
  const items=(group.items||[]).filter(item=>{
   const isNpc=item.categoria==='NPC'||item.papel==='Aliado';
   if(type==='ameacas'&&isNpc)return false;
   if(type==='npcs'&&!isNpc)return false;
   return !query.trim()||fold([item.nome,item.descricao,item.conceito,item.grupo,item.papel,item.categoria,item.fonte,item.codigo,group.title].join(' ')).includes(fold(query.trim()));
  });
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
     <span className="text-xs text-zinc-700">{modelo.categoria} · {modelo.papel}{Number.isFinite(modelo.pontos)?' · '+modelo.pontos+' pts':''}</span>
     <p className="mt-1 line-clamp-2 text-xs text-zinc-700">{modelo.descricao||modelo.conceito||'Modelo personalizável para a mesa.'}</p>
     {modelo.fonte&&<small className="mt-1 block text-xs text-zinc-600">{modelo.fonte}{modelo.pagina?' · p. '+modelo.pagina:''}</small>}
     {modelo.grupo&&<small className="block text-xs text-zinc-600">{modelo.grupo}</small>}
    </button>)}</div>
  </section>)}
  {!filtered.length&&<p role="status" className="rounded border border-zinc-300 bg-white p-4 text-sm text-zinc-800">Nenhum modelo corresponde à busca. Tente outro nome ou categoria.</p>}
 </div>;
}
