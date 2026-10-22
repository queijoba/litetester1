import React,{useEffect,useMemo,useState} from 'react';
import {createPortal} from 'react-dom';
import {FABULA_LIBRARY_CATALOG,FABULA_LIBRARY_SOURCES} from './libraryCatalog.js';
import './fabula-library.css';
const tabs=[['classe','Classes'],['poder','Poderes de Classe'],['feitico','Feitiços'],['heroico','Poderes Heroicos']];
const normal=t=>String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
export default function FabulaLibraryModal({open=false,data,onChoose,onClose}){
 const [tab,setTab]=useState('classe'),[source,setSource]=useState('todas'),[search,setSearch]=useState(''),[classFilter,setClassFilter]=useState('Todas as classes'),[ownedOnly,setOwnedOnly]=useState(false),[selected,setSelected]=useState('');
 useEffect(()=>{if(!open)return;setTab('classe');setSearch('');setSource('todas');setClassFilter('Todas as classes');setOwnedOnly(false);setSelected('');},[open]);
 useEffect(()=>{if(!open)return;const fn=e=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn);},[open,onClose]);
 const classes=(data?.classes||[]).filter(x=>x?.nome).map(x=>x.nome);
 const filters=useMemo(()=>[...new Set(FABULA_LIBRARY_CATALOG.filter(x=>x.tipo==='poder'||x.tipo==='feitico').map(x=>x.classe))].sort((a,b)=>a.localeCompare(b,'pt-BR')) ,[]);
 const list=useMemo(()=>FABULA_LIBRARY_CATALOG.filter(x=>x.tipo===tab&&(source==='todas'||x.source===source)).filter(x=>(tab!=='poder'&&tab!=='feitico')||classFilter==='Todas as classes'||x.classe===classFilter).filter(x=>!ownedOnly||tab!=='poder'&&tab!=='feitico'||classes.some(c=>normal(c)===normal(x.classe))).filter(x=>!search.trim()||normal([x.nome,x.classe,x.fonte,x.pagina].join(' ')).includes(normal(search))).sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR')),[tab,source,search,classFilter,ownedOnly,data?.classes]);
 if(!open||typeof document==='undefined')return null;
 const current=list.find(x=>x.id===selected)||list[0]||null;
 const choose=()=>{
  if(!current)return;
  if(current.tipo==='poder'&&!classes.some(x=>normal(x)===normal(current.classe)))return window.alert('Inclua primeiro a classe '+current.classe+'. A biblioteca não atribui níveis de classe automaticamente.');
  const hasSource=current.source!=='basico'&&!data?.suplementos?.[current.source];
  if(hasSource&&!window.confirm('Este registro pertence a '+current.fonte+'. Ativar o suplemento na ficha e adicionar a referência?'))return;
  onChoose(current,tab);onClose();
 };
 return createPortal(<div className="fabula-lib-shade" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
  <section className="fabula-lib-dialog" role="dialog" aria-modal="true" aria-label="Biblioteca de Fabula Ultima">
   <header className="fabula-lib-head"><div><small>FABULA ULTIMA • ACERVO DO PERSONAGEM</small><h2>📚 Biblioteca de Fábula Última</h2><p>Livro Básico, Atlas e Codex Extra</p></div><button type="button" onClick={onClose} aria-label="Fechar biblioteca">×</button></header>
   <nav className="fabula-lib-tabs" aria-label="Tipos de referência">{tabs.map(([id,label])=><button key={id} type="button" aria-pressed={tab===id} onClick={()=>{setTab(id);setSelected('');}}>{label}</button>)}</nav>
   <div className="fabula-lib-filters"><input type="search" value={search} onChange={e=>{setSearch(e.target.value);setSelected('');}} placeholder="Pesquisar nome, classe, livro ou página..." aria-label="Pesquisar na biblioteca"/><select value={source} onChange={e=>{setSource(e.target.value);setSelected('');}} aria-label="Filtrar livro"><option value="todas">Todos os livros</option>{FABULA_LIBRARY_SOURCES.map(x=><option key={x.key} value={x.key}>{x.name}</option>)}</select>{['poder','feitico'].includes(tab)&&<select value={classFilter} aria-label="Filtrar classe" onChange={e=>{setClassFilter(e.target.value);setSelected('');}}><option>Todas as classes</option>{filters.map(x=><option key={x}>{x}</option>)}</select>}</div>
   <div className="fabula-lib-current"><span>Minhas classes: {classes.join(' • ')||'Nenhuma selecionada'}</span>{['poder','feitico'].includes(tab)&&<button type="button" aria-pressed={ownedOnly} onClick={()=>{setOwnedOnly(v=>!v);setSelected('');}}>{ownedOnly?'✓ Apenas minhas classes':'Filtrar pelas minhas classes'}</button>}</div>
   <div className={'fabula-lib-body'+(selected?' has-selection':'')}>
    <div className="fabula-lib-results"><small>{list.length} referências encontradas</small>{list.map(x=><button type="button" key={x.id} className={current?.id===x.id?'active':''} onClick={()=>setSelected(x.id)}><strong>{x.nome}</strong><span>{x.classe?x.classe+' • ':''}{x.fonte} — p. {x.pagina}</span></button>)}{!list.length&&<p>Sem resultados para os filtros escolhidos.</p>}</div>
    <div className="fabula-lib-detail">{current?<><button className="fabula-lib-back" type="button" onClick={()=>setSelected('')}>← Voltar</button><small>CONSULTA DO LIVRO • p. {current.pagina}</small><h3>{current.nome}</h3><div className="fabula-lib-tags">{[current.fonte,current.classe&&'Classe: '+current.classe,current.nivelMaximo&&'NP máx.: '+current.nivelMaximo,current.disciplina].filter(Boolean).map((x,i)=><span key={i}>{x}</span>)}</div><p>{current.desc}</p>{current.tipo==='poder'&&!classes.some(x=>normal(x)===normal(current.classe))&&<p className="fabula-lib-alert">Adicione a classe {current.classe} à ficha antes de adquirir esta habilidade.</p>}{current.source!=='basico'&&!data?.suplementos?.[current.source]&&<p className="fabula-lib-alert">Esta escolha ativa o suplemento {current.fonte} na ficha.</p>}<p className="fabula-lib-help">A biblioteca registra referências e lembretes editáveis; requisitos, níveis, custos e efeitos completos devem ser conferidos no livro.</p><button type="button" className="fabula-lib-use" onClick={choose}>{tab==='classe'?'Escolher classe':'＋ Adicionar à ficha'}</button></>:<p>Escolha uma referência para consultar e registrar na ficha.</p>}</div>
   </div>
   <footer>Acervo de consulta do PJLite • projeto independente de fãs • textos completos permanecem nos livros das editoras.</footer>
  </section>
 </div>,document.body);
}
