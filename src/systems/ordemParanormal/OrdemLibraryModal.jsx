import React,{useEffect,useMemo,useState} from 'react';
import {createPortal} from 'react-dom';
import {findAbilityPresets} from '../../components/abilityPresetLibrary.js';
import {ORDEM_LIBRARY_COUNTS} from './libraryCatalog.js';
import './ordem-library.css';

const tabs=[['origens','Origens'],['trilhas','Trilhas'],['habilidades','Poderes'],['poderesParanormais','Paranormais'],['rituais','Rituais']];
const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const allSources=['Todas as fontes','Livro Básico v1.3','Sobrevivendo ao Horror','Arquivos Secretos #01','Arquivos Secretos #03','Arquivos Secretos #05','Arquivos Secretos #06','Arquivos Secretos #07','Arquivos Secretos #09'];
export default function OrdemLibraryModal({open=false,initialTab='habilidades',classe='',trilha='',nex=5,onChoose,onClose}){
 const [tab,setTab]=useState('habilidades');
 const [source,setSource]=useState('Todas as fontes');
 const [query,setQuery]=useState('');
 const [allClasses,setAllClasses]=useState(false);
 const [selected,setSelected]=useState('');
 const [revision,setRevision]=useState(0);
 useEffect(()=>{if(!open)return;setTab(tabs.some(x=>x[0]===initialTab)?initialTab:'habilidades');setQuery('');setSource('Todas as fontes');setAllClasses(false);setSelected('');setRevision(i=>i+1);},[open,initialTab]);
 useEffect(()=>{if(!open)return;const f=e=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',f);return()=>window.removeEventListener('keydown',f);},[open,onClose]);
 const entries=useMemo(()=>findAbilityPresets('ordemParanormal',tab).filter(x=>{
  const e=x.entry||{};
  if(source!=='Todas as fontes'&&e.fonte!==source)return false;
  if(!allClasses&&classe&&tab==='trilhas'&&e.classe&&normalize(e.classe)!==normalize(classe))return false;
  if(!allClasses&&classe&&tab==='habilidades'&&e.classe&&!['Geral',classe].some(name=>normalize(e.classe)===normalize(name)))return false;
  const needle=normalize(query);if(!needle)return true;
  return normalize([x.name,e.nome,e.tipo,e.fonte,e.desc,e.pagina,e.classe,e.trilha,e.poderOrigem,e.elemento,(e.pericias||[]).join(' ')].join(' ')).includes(needle);
 }),[tab,source,query,classe,allClasses,revision]);
 if(!open||typeof document==='undefined')return null;
 const chosen=entries.find(x=>x.id===selected);
 const choose=x=>{
  const e=x.entry||{};
  if(tab==='trilhas'&&e.nexMinimo>Number(nex||0)&&!window.confirm('Esta trilha costuma ser escolhida a partir de NEX 10%. Adicionar mesmo assim?'))return;
  onChoose({...e},tab);onClose();
 };
 return createPortal(<div className="ordem-library-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
 <section className="ordem-library-modal" role="dialog" aria-modal="true" aria-label="Biblioteca Ordem Paranormal">
  <header className="ordem-library-header"><div><small>ORDO REALITAS // ACERVO DE AGENTES</small><h2>📚 Biblioteca Paranormal</h2><p>Livro Básico • Sobrevivendo ao Horror • Arquivos Secretos</p></div><button onClick={onClose} type="button" aria-label="Fechar biblioteca">×</button></header>
  <nav className="ordem-library-tabs" aria-label="Categorias da biblioteca">{tabs.map(([id,label])=><button type="button" key={id} className={tab===id?'active':''} onClick={()=>{setTab(id);setSelected('');}}>{label}</button>)}</nav>
  <div className="ordem-library-controls"><input type="search" placeholder="Pesquisar nome, classe, origem ou efeito..." value={query} onChange={e=>{setQuery(e.target.value);setSelected('');}}/><select aria-label="Filtrar fonte" value={source} onChange={e=>{setSource(e.target.value);setSelected('');}}>{allSources.map(x=><option key={x}>{x}</option>)}</select></div>
  <div className="ordem-library-context"><span>Classe: <strong>{classe||'Não definida'}</strong>{trilha?' • Trilha: '+trilha:''} • NEX {nex}%</span>{['habilidades','trilhas'].includes(tab)&&<button className={allClasses?'active':''} type="button" onClick={()=>{setAllClasses(x=>!x);setSelected('');}}>{allClasses?'✓ Mostrar tudo':'Ver todas as classes'}</button>}</div>
  <div className="ordem-library-body"><div className="ordem-library-results"><div className="ordem-library-count">{entries.length} resultados • Catálogo com {Object.values(ORDEM_LIBRARY_COUNTS).reduce((a,b)=>a+b,0)} referências</div>{entries.map(x=><button type="button" key={x.id} className={selected===x.id?'selected':''} onClick={()=>setSelected(x.id)}><strong>{x.name}</strong><small>{x.entry.fonte||'Modelo pessoal'}{x.entry.classe?' • '+x.entry.classe:''}{x.entry.elemento?' • '+x.entry.elemento:''}</small></button>)}{!entries.length&&<p className="ordem-library-empty">Nenhuma referência encontrada. Experimente remover os filtros ou salvar seu próprio modelo na ficha.</p>}</div>
  <div className="ordem-library-detail">{chosen?<><span className="ordem-library-source">{chosen.source==='personal'?'Modelo personalizado':'Acervo • fonte verificada'}</span><h3>{chosen.name}</h3><div className="ordem-library-tags">{[chosen.entry.fonte,chosen.entry.pagina?'p. '+chosen.entry.pagina:'',chosen.entry.classe,chosen.entry.elemento,chosen.entry.nexMinimo?'NEX '+chosen.entry.nexMinimo+'%':''].filter(Boolean).map((tag,i)=><span key={i}>{tag}</span>)}</div>
    {chosen.entry.pericias?.length>0&&<p><b>Perícias:</b> {chosen.entry.pericias.join(', ')}</p>}
    {chosen.entry.poderOrigem&&<p><b>Habilidade de origem:</b> {chosen.entry.poderOrigem}</p>}
    <p className="ordem-library-description">{chosen.entry.desc||'Preencha a descrição deste modelo na ficha.'}</p>
    <p className="ordem-library-copyright">Resumo de consulta do PJLite. Consulte a página citada para aplicar regras, restrições e progressão completas. Fontes oficiais, sem playtest.</p>
    <button className="ordem-library-insert" type="button" onClick={()=>choose(chosen)}>+ {tab==='origens'?'Usar origem':tab==='trilhas'?'Selecionar trilha':'Adicionar à ficha'}</button></>:<div className="ordem-library-placeholder">Selecione um item para ver a fonte, a página e um resumo antes de adicionar à ficha.</div>}</div></div>
  <footer className="ordem-library-footer">PJLite — projeto independente de fãs. Ordem Paranormal é propriedade de seus respectivos titulares. A biblioteca é um índice auxiliar e não substitui os livros.</footer>
 </section></div>,document.body);
}
