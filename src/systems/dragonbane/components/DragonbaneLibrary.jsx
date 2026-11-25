import * as React from 'react';
import {DRAGONBANE_LIBRARY,DRAGONBANE_MAGIC_SCHOOLS,DRAGONBANE_SPELL_GRADES,dragonbaneLibraryHas,dragonbaneAncestryKey,DRAGONBANE_ANCESTRIES} from '../abilities.js';
const LABELS={inata:'Inata',heroica:'Heroica',magia:'Feitiço',truque:'Truque'};
const ANCESTRIES=Object.fromEntries(DRAGONBANE_ANCESTRIES);
const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export default function DragonbaneLibrary({data,initialFilter,onClose,onAdd}){
 const [kind,setKind]=React.useState(initialFilter?.kind||'todos');
 const [school,setSchool]=React.useState(initialFilter?.school||'Todas');
 const [grade,setGrade]=React.useState(initialFilter?.grade?String(initialFilter.grade):'todos');
 const [query,setQuery]=React.useState('');
 const [ancestry,setAncestry]=React.useState(dragonbaneAncestryKey(data.bio?.ancestralidade)||'Todas');
 const [selected,setSelected]=React.useState('');
 const [hideAdded,setHideAdded]=React.useState(false);
 const searchRef=React.useRef(null);
 React.useEffect(()=>{searchRef.current?.focus();const onKey=e=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey)},[onClose]);
 const magical=kind==='magia'||kind==='truque'||kind==='todos';
 const results=DRAGONBANE_LIBRARY.filter(x=>(kind==='todos'||x.tipo===kind)&&(!magical||school==='Todas'||x.escola===school)&&(kind!=='magia'||grade==='todos'||String(x.grau)===grade)&&(kind!=='inata'||ancestry==='Todas'||x.ancestralidade===ancestry)&&(!hideAdded||!dragonbaneLibraryHas(data,x))&&fold([x.nome,x.desc,x.escola,x.requisito,x.pagina].join(' ')).includes(fold(query))).sort((a,b)=>a.tipo.localeCompare(b.tipo)||((a.grau||0)-(b.grau||0))||a.nome.localeCompare(b.nome,'pt-BR'));
 const item=results.find(x=>x.id===selected)||results[0];
 const added=item&&dragonbaneLibraryHas(data,item);
 const otherAncestry=item?.tipo==='inata'&&dragonbaneAncestryKey(data.bio?.ancestralidade)!==item.ancestralidade;
 return <div className="db-library-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="db-library-dialog" role="dialog" aria-modal="true" aria-label="Biblioteca de Dragonbane">
   <header className="db-library-heading"><div><small>Livro de Regras v1.1</small><h2>Biblioteca de Dragonbane</h2></div><button type="button" onClick={onClose} aria-label="Fechar biblioteca">×</button></header>
   <div className="db-library-filters">
    <div className="db-library-kinds" aria-label="Categoria">{[['todos','Todas'],...Object.entries(LABELS)].map(([k,label])=><button key={k} type="button" aria-pressed={kind===k} onClick={()=>{setKind(k);setSchool('Todas');setGrade('todos');setAncestry('Todas');setSelected('')}}>{label}</button>)}</div>
    <label>Buscar<input ref={searchRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nome, efeito ou requisito"/></label>
    {magical&&<label>Escola<select value={school} onChange={e=>setSchool(e.target.value)}><option>Todas</option>{DRAGONBANE_MAGIC_SCHOOLS.filter(x=>x!=='Outra').map(x=><option key={x}>{x}</option>)}</select></label>}
    {kind==='magia'&&<label>Grau<select value={grade} onChange={e=>setGrade(e.target.value)}><option value="todos">Todos</option>{DRAGONBANE_SPELL_GRADES.map(g=><option key={g} value={g}>Grau {g}</option>)}</select></label>}
    {kind==='inata'&&<label>Ancestralidade<select value={ancestry} onChange={e=>setAncestry(e.target.value)}><option>Todas</option>{Object.entries(ANCESTRIES).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>}
    <label className="db-library-check"><input type="checkbox" checked={hideAdded} onChange={e=>setHideAdded(e.target.checked)}/> Ocultar já adicionados</label>
    <small role="status">{results.length} de {DRAGONBANE_LIBRARY.length} referências</small>
   </div>
   <div className="db-library-body">
    <div className="db-library-results" aria-label="Resultados">{results.map(x=><button type="button" key={x.id} aria-pressed={item?.id===x.id} onClick={()=>setSelected(x.id)}><strong>{x.nome}</strong><small>{LABELS[x.tipo]}{x.escola?' · '+x.escola:''}{x.grau?' · Grau '+x.grau:''} · p. {x.pagina}{dragonbaneLibraryHas(data,x)?' · Na ficha':''}</small></button>)}{!results.length&&<p>Nenhuma referência encontrada.</p>}</div>
    {item&&<article className="db-library-detail"><small>{LABELS[item.tipo]}{item.grau?' · Grau '+item.grau:''}{item.escola?' · '+item.escola:''}</small><h3>{item.nome}</h3><dl>{[['Custo',item.fv_nvl],['Requisito',item.ancestralidade?ANCESTRIES[item.ancestralidade]:item.requisito],['Conjuração',item.execucao],['Alcance',item.alcance],['Duração',item.duracao],['Componentes',item.componentes]].filter(([,v])=>v).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><p>{item.desc}</p><p className="db-library-reference">{item.fonte} · p. {item.pagina}</p>
    {item.tipo==='heroica'&&<small>Pré-requisitos não se aplicam à habilidade heroica inicial da profissão. Confira regras opcionais com o mestre (p. 35).</small>}
    {otherAncestry&&<small>Esta habilidade pertence a outra ancestralidade. Adicione apenas se o mestre autorizar.</small>}
    {item.repeatable&&<small>Este talento permite aquisições repetidas. Ajuste os recursos da ficha manualmente.</small>}
    <button type="button" className="db-library-insert" disabled={added} onClick={()=>onAdd(item)}>{added?'Já adicionada':'Adicionar à ficha'}</button></article>}
   </div>
  </section>
 </div>;
}
