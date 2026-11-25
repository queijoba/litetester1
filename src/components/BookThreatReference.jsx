import React from 'react';
import {BOOK_THREAT_REFERENCES} from './bookThreatReferences.js';
const fold=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export default function BookThreatReference({system}){
 const book=BOOK_THREAT_REFERENCES[system];
 const [query,setQuery]=React.useState('');
 const [limit,setLimit]=React.useState(24);
 if(!book)return null;
 const entries=book.entries.filter(e=>fold([e.name,e.category,e.level,e.page].join(' ')).includes(fold(query.trim())));
 return <details className="lite-book-reference">
  <summary><strong>Referências do livro</strong> <span>· {book.entries.length} registros</span></summary>
  <p className="lite-book-source">{book.source}</p><p>Índice para localizar as fichas no livro. Não são perfis jogáveis nem substituem o material original.</p>
  <label className="lite-book-label">Buscar nome, página, tipo ou nível<input type="search" value={query} onChange={e=>{setQuery(e.target.value);setLimit(24)}} placeholder="Pesquisar referência…"/></label>
  <p role="status">{entries.length} de {book.entries.length} referências</p>
  <div className="lite-book-list">{entries.slice(0,limit).map(e=><div key={e.name+'-'+e.page}><strong>{e.name}</strong><span>{e.category?e.category+' · ':''}{e.level!=null?(system==='fabula'?'Nível ':'ND ')+e.level+' · ':''}p. {e.page}</span></div>)}</div>
  {!entries.length&&<p>Nenhuma referência encontrada.</p>}
  {limit<entries.length&&<button type="button" onClick={()=>setLimit(n=>n+24)}>Mostrar mais referências</button>}
 </details>;
}
