import * as React from 'react';
import './news-banner.css';

const featured=[
 {icon:'🧭',title:'Jornadas independentes',body:'Centro de campanhas com uma página própria, retorno à Home, grupos DM, iniciativa, fichas e arquivos de sessão.'},
 {icon:'💬',title:'Chat na Conta Lite',body:'Nova aba Chat para mensagens, fotos, vídeos, links e PDFs das campanhas. Cada conversa é privada para membros autorizados.'},
 {icon:'◆',title:'Conquistas e Rota Zero',body:'Conquistas ON/OFF nas configurações; com RZ-88, o material do ARG fica acessível em Recebidos.'}
];
export default function NewsBanner({collapsed,onToggle,log=[]}){
 const [section,setSection]=React.useState('novidades');
 const [showAll,setShowAll]=React.useState(false);
 const [argOpened,setArgOpened]=React.useState(false);
 const important=log.filter(entry=>entry.versao==='1.1.0v Alpha'||entry.versao==='#088 FALHO');
 const other=log.filter(entry=>entry.versao!=='1.1.0v Alpha'&&entry.versao!=='#088 FALHO');
 const entries=showAll?[...important,...other]:[...important,...other.slice(0,4)];
 return <section className="pjlite-110-news no-print" aria-label="Novidades e registro de atualizações">
  <header className="pjlite-110-news__header">
    <div className="pjlite-110-news__mark">✦</div>
    <div className="pjlite-110-news__headline"><small>ATUALIZAÇÃO EM PRÉVIA • PJ LITE</small><strong>1.1.0v Alpha <span>— Jornadas, Chat e Rota Zero</span></strong></div>
    <span className="pjlite-110-news__status">ALPHA</span>
    <button type="button" className="pjlite-110-news__collapse" aria-expanded={!collapsed} onClick={onToggle} title={collapsed?'Expandir novidades':'Recolher novidades'}>{collapsed?'＋':'−'}</button>
  </header>
  {!collapsed&&<div className="pjlite-110-news__body">
    <nav aria-label="Seções das novidades"><button type="button" aria-current={section==='novidades'?'page':undefined} className={section==='novidades'?'active':''} onClick={()=>setSection('novidades')}>✨ Novidades</button><button type="button" aria-current={section==='log'?'page':undefined} className={section==='log'?'active':''} onClick={()=>setSection('log')}>📋 Log de atualizações <span>↗</span></button></nav>
    {section==='novidades'?<>
      <p className="pjlite-110-news__lead">Nesta versão, cada ferramenta fica no lugar certo: <strong>fichas na Home</strong>, <strong>campanhas em Jornadas</strong> e <strong>conversas em Conta Lite</strong>.</p>
      <div className="pjlite-110-news__features">{featured.map(row=><article key={row.title}><span aria-hidden="true">{row.icon}</span><div><strong>{row.title}</strong><p>{row.body}</p></div></article>)}</div>
      <div className="pjlite-110-news__bottom"><a className="pjlite-110-news__action" href="/?jornadas=1">🧭 Conhecer Jornadas →</a><button type="button" onClick={()=>setSection('log')}>Ver registro de alterações</button></div>
    </>:<div className="pjlite-110-news__log">
      <div className="pjlite-110-news__log-title"><strong>Histórico e registros</strong><small>Atualizações públicas da prévia, preservando o log do ARG</small></div>
      {entries.map((entry,i)=>entry.versao==='#088 FALHO'?<article className="pjlite-110-news__arg" key={entry.versao}><button type="button" aria-expanded={argOpened} onClick={()=>setArgOpened(v=>!v)}><span aria-hidden="true">◆</span><strong>#088 FALHO</strong><small>RZ-HR-12 • REGISTRO INCONSISTENTE</small><span>{argOpened?'−':'＋'}</span></button>{argOpened&&<p>{entry.descricao}</p>}</article>:<article className="pjlite-110-news__entry" key={entry.versao+i}><span className={entry.versao==='1.1.0v Alpha'?'is-latest':''}>{entry.versao}</span><p>{entry.descricao}</p></article>)}
      {!showAll&&other.length>4&&<button type="button" className="pjlite-110-news__more" onClick={()=>setShowAll(true)}>Mostrar todas as versões anteriores ↓</button>}
      {showAll&&<button type="button" className="pjlite-110-news__more" onClick={()=>setShowAll(false)}>Ver apenas recentes ↑</button>}
    </div>}
  </div>}
 </section>;
}