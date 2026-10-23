import * as React from 'react';
import {
 listJourneyResources,addJourneyResource,removeJourneyResource,
 uploadJourneyMedia,setJourneyResourceVisibility,getDmMindmap,saveDmMindmap
} from './jornadasCloud.js';
import './campaign-workspace.css';

const categories=[['livro','📚 Livros'],['mapa','🗺️ Mapas'],['documento','📜 Documentos'],['regras','📖 Regras'],['pista','🔎 Pistas'],['relatorio','📝 Relatórios'],['outro','📎 Outros']];
const secureUrl=u=>{try{return new URL(u).protocol==='https:'}catch{return false}};
const bookIcon=r=>r.kind==='pdf'?'📕':r.kind==='image'?'🖼️':r.kind==='map'?'🗺️':r.kind==='youtube'?'🎵':'📄';
const asBoard=draft=>draft?.board&&typeof draft.board==='object'?draft.board:{};
const labelOf=s=>s?.name||s?.payload?.bio?.nome||s?.payload?.nome||'Ficha sem nome';
const statsOf=s=>s?.sheets?.payload||{};
export function CampaignLibrary({campaignId,isDm,notify}){
 const [files,setFiles]=React.useState([]),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
 const [title,setTitle]=React.useState(''),[kind,setKind]=React.useState('pdf'),[category,setCategory]=React.useState('livro'),[description,setDescription]=React.useState('');
 const [url,setUrl]=React.useState(''),[file,setFile]=React.useState(null),[visible,setVisible]=React.useState(true);
 const [filter,setFilter]=React.useState('todos'),[reader,setReader]=React.useState(null);
 const refresh=React.useCallback(async()=>{try{setFiles(await listJourneyResources(campaignId));setError('')}catch(e){setError(e?.message||'Não foi possível abrir a biblioteca.')}},[campaignId]);
 React.useEffect(()=>{refresh()},[refresh]);
 const submit=async e=>{e.preventDefault();if(busy)return;setBusy(true);setError('');
  try{
   let media=file?await uploadJourneyMedia(campaignId,file):url.trim();
   const type=file?(file.type==='application/pdf'?'pdf':file.type.startsWith('image/')?'image':'video'):kind;
   await addJourneyResource(campaignId,title.trim()||file?.name||'',type,media,{visible_to_players:visible,category,description});
   setTitle('');setDescription('');setUrl('');setFile(null);setVisible(true);
   await refresh();notify?.('Material incluído na biblioteca.');
  }catch(e){setError(e?.message||'Não foi possível adicionar o material.')}finally{setBusy(false)}
 };
 const flip=async item=>{setBusy(true);try{await setJourneyResourceVisibility(item.id,!item.visible_to_players);await refresh()}catch(e){setError(e?.message||'Não foi possível alterar a permissão.')}finally{setBusy(false)}};
 const remove=async item=>{if(!window.confirm('Remover este material da biblioteca?'))return;setBusy(true);
  try{await removeJourneyResource(item.id);await refresh()}catch(e){setError(e?.message||'Erro ao remover material.')}finally{setBusy(false)}};
 const filtered=files.filter(x=>filter==='todos'||x.category===filter);
 return <section className="campaign-workspace">
  <header className="campaign-workspace__heading"><div><h3>📚 Biblioteca da campanha</h3><p>Livros, PDFs, mapas e documentos. Os jogadores só recebem acesso aos materiais liberados pelo mestre.</p></div><span>{files.length} materiais</span></header>
  {isDm&&<form className="campaign-workspace__box campaign-library-form" onSubmit={submit}>
   <strong>＋ Adicionar à biblioteca</strong>
   <div className="campaign-workspace__fields"><label>Nome do material<input maxLength={160} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ex.: Livro básico, mapa da cidade..." required={!file}/></label><label>Categoria<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(([id,l])=><option key={id} value={id}>{l}</option>)}</select></label><label>Formato<select value={kind} onChange={e=>setKind(e.target.value)}><option value="pdf">Livro / PDF</option><option value="map">Mapa</option><option value="image">Imagem</option><option value="link">Link</option><option value="youtube">Música / YouTube</option><option value="video">Vídeo</option><option value="table">Tabela</option></select></label></div>
   <label>Descrição curta<input maxLength={650} value={description} onChange={e=>setDescription(e.target.value)} placeholder="O que os jogadores encontrarão nesse arquivo?"/></label>
   <div className="campaign-workspace__fields"><label>Arquivo (até 25 MB)<input type="file" accept="application/pdf,image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" onChange={e=>setFile(e.target.files?.[0]||null)}/></label><label>Ou link HTTPS<input type="url" disabled={!!file} value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..."/></label></div>
   <label className="campaign-workspace__check"><input type="checkbox" checked={visible} onChange={e=>setVisible(e.target.checked)}/> Disponível para os jogadores agora</label>
   <button type="submit" className="campaign-workspace__primary" disabled={busy||(!file&&!url.trim())}>{busy?'Salvando…':'Adicionar material →'}</button>
  </form>}
  <div className="campaign-workspace__filter">{[['todos','Tudo'],...categories].map(([id,label])=><button key={id} type="button" className={filter===id?'active':''} onClick={()=>setFilter(id)}>{label}</button>)}<button type="button" onClick={refresh}>↻ Atualizar</button></div>
  {error&&<p className="campaign-workspace__error" role="alert">{error}</p>}
  <div className="campaign-library-grid">{filtered.map(item=><article key={item.id} className="campaign-library-card">
   <div className="campaign-library-cover">{item.kind==='image'&&secureUrl(item.displayUrl)?<img src={item.displayUrl} alt="" loading="lazy"/>:<span>{bookIcon(item)}</span>}<small>{categories.find(x=>x[0]===item.category)?.[1]||item.kind}</small></div>
   <div className="campaign-library-card__info"><strong>{item.title}</strong>{item.description&&<p>{item.description}</p>}{isDm&&<small>{item.visible_to_players?'👁 Compartilhado com jogadores':'🔒 Somente mestre'}</small>}</div>
   <div className="campaign-library-card__actions"><button type="button" onClick={()=>setReader(item)}>📖 Abrir</button>{isDm&&<><button type="button" onClick={()=>flip(item)} disabled={busy}>{item.visible_to_players?'🔒 Ocultar':'👁 Liberar'}</button><button type="button" onClick={()=>remove(item)} disabled={busy} title="Remover">×</button></>}</div>
  </article>)}</div>
  {filtered.length===0&&<div className="campaign-workspace__empty">{isDm?'Nenhum arquivo nessa categoria. Adicione o primeiro acima.':'O mestre ainda não liberou materiais nessa categoria.'}</div>}
  {reader&&<div className="campaign-reader" role="dialog" aria-modal="true" aria-label={'Leitura: '+reader.title}>
   <div className="campaign-reader__head"><div><strong>📖 {reader.title}</strong><small>{reader.description}</small></div><button type="button" onClick={()=>setReader(null)} aria-label="Fechar leitor">×</button></div>
   {secureUrl(reader.displayUrl)?reader.kind==='pdf'||reader.displayUrl.toLowerCase().includes('.pdf')?<iframe src={reader.displayUrl+'#view=FitH'} title={reader.title} loading="lazy"/>:['image','map'].includes(reader.kind)?<img src={reader.displayUrl} alt={reader.title}/>:<div className="campaign-reader__external"><p>Este material abre no site ou aplicativo de origem.</p><a href={reader.displayUrl} target="_blank" rel="noopener noreferrer">Abrir material ↗</a></div>:<p>Não foi possível criar o link de acesso. Atualize a biblioteca e tente novamente.</p>}
   {secureUrl(reader.displayUrl)&&<a href={reader.displayUrl} target="_blank" rel="noopener noreferrer">Abrir em nova aba / baixar ↗</a>}
  </div>}
 </section>;
}

const types=[['pessoa','👤 Pessoa'],['local','🗺 Local'],['pista','🔎 Pista'],['grupo','♟ Facção'],['evento','⏳ Evento'],['objeto','💎 Objeto'],['segredo','◆ Segredo']];
const uuid=()=>crypto?.randomUUID?.()||Math.random().toString(36).slice(2);
export function CampaignMindmap({campaignId,isDm}){
 const [nodes,setNodes]=React.useState([]),[links,setLinks]=React.useState([]),[selected,setSelected]=React.useState('');
 const [from,setFrom]=React.useState(''),[to,setTo]=React.useState('');
 const [busy,setBusy]=React.useState(false),[dirty,setDirty]=React.useState(false),[error,setError]=React.useState(''),[loaded,setLoaded]=React.useState(false);
 React.useEffect(()=>{if(!isDm)return;let active=true;
  getDmMindmap(campaignId).then(data=>{if(active){setNodes(data.nodes||[]);setLinks(data.links||[]);setLoaded(true)}}).catch(e=>{if(active){setError(e?.message||'Não foi possível abrir o mapa mental.');setLoaded(true)}});return()=>{active=false};
 },[campaignId,isDm]);
 if(!isDm)return null;
 const node=nodes.find(x=>x.id===selected);
 const change=(id,patch)=>{setNodes(prev=>prev.map(x=>x.id===id?{...x,...patch}:x));setDirty(true)};
 const add=()=>{const id=uuid();setNodes(prev=>[...prev,{id,title:'Novo elemento',type:'pista',note:'',x:20+(prev.length%4)*17,y:20+(Math.floor(prev.length/4)%4)*20}]);setSelected(id);setDirty(true)};
 const remove=()=>{setNodes(p=>p.filter(x=>x.id!==selected));setLinks(p=>p.filter(x=>x.from!==selected&&x.to!==selected));setSelected('');setDirty(true)};
 const connect=()=>{if(!from||!to||from===to||links.some(l=>l.from===from&&l.to===to))return;setLinks(p=>[...p,{id:uuid(),from,to}]);setDirty(true)};
 const save=async()=>{setBusy(true);setError('');try{const saved=await saveDmMindmap(campaignId,nodes,links);setNodes(saved.nodes);setLinks(saved.links);setDirty(false)}catch(e){setError(e?.message||'Falha ao salvar o mapa.')}finally{setBusy(false)}};
 const onDragEnd=(e,id)=>{const board=document.getElementById('dm-mindmap-board');if(!board)return;const b=board.getBoundingClientRect();change(id,{x:Math.max(2,Math.min(83,100*(e.clientX-b.left)/b.width-5)),y:Math.max(3,Math.min(82,100*(e.clientY-b.top)/b.height-5))})};
 return <section className="campaign-workspace">
  <header className="campaign-workspace__heading"><div><h3>🧠 Mapa mental do mestre</h3><p>Organize mistérios, NPCs, locais e pistas com conexões. Este mural fica armazenado separadamente e <strong>não é acessível pelos jogadores</strong>.</p></div><span className="campaign-workspace__private">🔒 Somente DM</span></header>
  <div className="campaign-workspace__actions"><button onClick={add}>＋ Novo cartão</button><button onClick={save} disabled={busy||!loaded||!dirty} className="campaign-workspace__primary">{busy?'Salvando…':dirty?'💾 Salvar mapa *':'✓ Mapa salvo'}</button></div>
  {error&&<p role="alert" className="campaign-workspace__error">{error}</p>}
  <div className="campaign-mindmap-layout">
   <div className="campaign-mindmap-board" id="dm-mindmap-board">
    <svg aria-hidden="true" viewBox="0 0 1000 640" preserveAspectRatio="none" className="campaign-mindmap-lines">{links.map(link=>{const a=nodes.find(x=>x.id===link.from),b=nodes.find(x=>x.id===link.to);if(!a||!b)return null;return <line key={link.id} x1={(a.x+6)*10} y1={(a.y+5)*6.4} x2={(b.x+6)*10} y2={(b.y+5)*6.4} stroke="#8ba899" strokeWidth="2" strokeDasharray="7 5"/>})}</svg>
    {nodes.map(n=><button type="button" draggable onDragEnd={e=>onDragEnd(e,n.id)} onClick={()=>setSelected(n.id)} key={n.id} className={'campaign-mindmap-node '+(selected===n.id?'is-selected':'')} style={{left:n.x+'%',top:n.y+'%'}}><span>{types.find(x=>x[0]===n.type)?.[1]||'🔎 Pista'}</span><strong>{n.title}</strong></button>)}
    {nodes.length===0&&<div className="campaign-workspace__empty">Adicione um cartão para começar a conectar os segredos da campanha.</div>}
   </div>
   <aside className="campaign-workspace__box campaign-mindmap-editor">
    <h4>Editar elemento</h4>
    {node?<><label>Nome<input value={node.title} maxLength={90} onChange={e=>change(node.id,{title:e.target.value})}/></label><label>Tipo<select value={node.type} onChange={e=>change(node.id,{type:e.target.value})}>{types.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label><label>Notas secretas<textarea rows={7} value={node.note||''} maxLength={3000} onChange={e=>change(node.id,{note:e.target.value})}/></label><div className="campaign-workspace__actions"><button onClick={()=>change(node.id,{x:Math.max(0,node.x-4)})}>←</button><button onClick={()=>change(node.id,{y:Math.max(0,node.y-4)})}>↑</button><button onClick={()=>change(node.id,{y:Math.min(85,node.y+4)})}>↓</button><button onClick={()=>change(node.id,{x:Math.min(85,node.x+4)})}>→</button></div><button onClick={remove} className="campaign-workspace__danger">Excluir elemento</button></>:<p>Selecione um cartão no mural para escrever notas e movê-lo.</p>}
    <h4>Conectar pistas</h4><label>Origem<select value={from} onChange={e=>setFrom(e.target.value)}><option value="">Escolha...</option>{nodes.map(n=><option key={n.id} value={n.id}>{n.title}</option>)}</select></label><label>Destino<select value={to} onChange={e=>setTo(e.target.value)}><option value="">Escolha...</option>{nodes.map(n=><option key={n.id} value={n.id}>{n.title}</option>)}</select></label><button onClick={connect} disabled={!from||!to||from===to}>＋ Criar ligação</button>
    {links.map(l=><div key={l.id} className="campaign-mindmap-edge"><small>{nodes.find(n=>n.id===l.from)?.title} → {nodes.find(n=>n.id===l.to)?.title}</small><button onClick={()=>{setLinks(p=>p.filter(x=>x.id!==l.id));setDirty(true)}} title="Remover ligação">×</button></div>)}
    <small>Arraste os cartões no computador ou use as setas no celular. Salve antes de sair.</small>
   </aside>
  </div>
 </section>;
}
export function CampaignRecords({mode,draft,setDraft,isDm,onSave,busy}){
 const board=asBoard(draft);
 const rows=mode==='investigacao'?(board.cases||[]):(board.reports||[]);
 const [editing,setEditing]=React.useState(null);
 const template=mode==='investigacao'?{title:'Novo caso',summary:'',goal:'',questions:'',status:'Em andamento'}:{title:'Novo relatório',team:'',participants:'',clues:'',losses:'',summary:''};
 const [form,setForm]=React.useState(template);
 const putBoard=(key,value)=>setDraft(p=>({...p,board:{...asBoard(p),[key]:value}}));
 const setField=(field,value)=>setForm(p=>({...p,[field]:value}));
 const saveEntry=()=>{const title=form.title.trim();if(!title)return;const item={...form,id:editing||uuid(),title};putBoard(mode==='investigacao'?'cases':'reports',editing?rows.map(r=>r.id===editing?item:r):[...rows,item]);setEditing(null);setForm(template)};
 return <section className="campaign-workspace"><header className="campaign-workspace__heading"><div><h3>{mode==='investigacao'?'🔎 Investigação':'📝 Relatórios de missão'}</h3><p>{mode==='investigacao'?'Organize casos, perguntas, objetivos e pistas.':'Registre missões, participantes, descobertas e consequências.'} Dados compartilhados com os jogadores.</p></div><span>{rows.length} registros</span></header>
  {isDm&&<div className="campaign-workspace__box"><h4>{editing?'Editar registro':'Novo registro'}</h4>{Object.keys(template).map(field=><label key={field}>{({title:'Título',summary:'Resumo',goal:'Objetivo',questions:'Perguntas',status:'Situação',team:'Equipe',participants:'Participantes',clues:'Pistas encontradas',losses:'Baixas e perdas'})[field]}{['summary','questions','clues','losses'].includes(field)?<textarea rows={3} value={form[field]||''} onChange={e=>setField(field,e.target.value)}/>:field==='status'?<select value={form[field]} onChange={e=>setField(field,e.target.value)}>{['Em andamento','Aberto','Resolvido','Arquivado'].map(x=><option key={x}>{x}</option>)}</select>:<input value={form[field]||''} onChange={e=>setField(field,e.target.value)}/>}</label>)}
  <div className="campaign-workspace__actions"><button type="button" onClick={saveEntry}>＋ {editing?'Atualizar':'Adicionar'} à campanha</button><button className="campaign-workspace__primary" onClick={onSave} disabled={busy}>💾 Salvar no grupo</button></div><small>Adicione o registro e clique em Salvar no grupo para publicar.</small></div>}
  <div className="campaign-records-list">{rows.map(r=><article key={r.id} className="campaign-workspace__box"><div className="campaign-workspace__recordhead"><h4>{r.title}</h4><small>{r.status||'Relatório'}</small></div>{Object.entries(r).filter(([k,v])=>!['id','title','status'].includes(k)&&v).map(([k,v])=><div className="campaign-workspace__recordline" key={k}><strong>{({summary:'Resumo',goal:'Objetivo',questions:'Perguntas',team:'Equipe',participants:'Participantes',clues:'Pistas',losses:'Consequências'})[k]||k}</strong><p>{v}</p></div>)}{isDm&&<div className="campaign-workspace__actions"><button onClick={()=>{setEditing(r.id);setForm({...template,...r})}}>Editar</button><button className="campaign-workspace__danger" onClick={()=>putBoard(mode==='investigacao'?'cases':'reports',rows.filter(x=>x.id!==r.id))}>Remover</button></div>}</article>)}</div>
  {!rows.length&&<p className="campaign-workspace__empty">Nenhum registro ainda.</p>}
 </section>;
}
export function CampaignNotes({draft,setDraft,isDm,onSave,busy}){
 const board=asBoard(draft),notes=board.sessionNotes||{general:draft.notes||'',future:'',past:''};
 const setNote=(k,v)=>setDraft(p=>({...p,notes:k==='general'?v:p.notes,board:{...asBoard(p),sessionNotes:{...notes,[k]:v}}}));
 return <section className="campaign-workspace"><header className="campaign-workspace__heading"><div><h3>🗒️ Anotações</h3><p>Resumo geral, próximas sessões e histórico compartilhado da campanha.</p></div></header>
  <div className="campaign-workspace__box">{[['general','Geral','Anotações da história...'],['future','Sessões futuras','Preparativos e próximos objetivos...'],['past','Sessões anteriores','O que aconteceu nas sessões?']].map(([k,title,ph])=><label key={k}>{title}<textarea rows={5} placeholder={ph} disabled={!isDm} value={notes[k]||''} onChange={e=>setNote(k,e.target.value)}/></label>)}{isDm&&<button className="campaign-workspace__primary" onClick={onSave} disabled={busy}>💾 Salvar anotações</button>}</div>
 </section>;
}
export function CampaignShield({draft,links,isDm,onTab}){
 if(!isDm)return null;
 const board=asBoard(draft),round=board.round||1;
 const [dice,setDice]=React.useState('d20'),[result,setResult]=React.useState('');
 const characters=links.map(x=>({id:x.sheet_id,name:labelOf(x.sheets),p:statsOf(x)}));
 const roll=()=>{const n=Math.max(2,Math.min(100,Number(dice.slice(1))||20));setResult('🎲 '+dice+': '+(Math.floor(Math.random()*n)+1))};
 return <section className="campaign-workspace"><header className="campaign-workspace__heading"><div><h3>🛡️ Escudo do Mestre</h3><p>Painel rápido com personagens, combate e atalhos. Acesso exclusivo de quem criou a campanha.</p></div><span className="campaign-workspace__private">🔒 Somente DM</span></header>
 <div className="campaign-shield-stats"><article><span>Rodada</span><strong>{round}</strong><button onClick={()=>onTab('combate')}>Gerenciar combate →</button></article><article><span>Fichas na mesa</span><strong>{characters.length}</strong><button onClick={()=>onTab('fichas')}>Abrir personagens →</button></article><article><span>Combate</span><strong>{board.initiative?.length||0}</strong><small>participantes na iniciativa</small></article></div>
 <div className="campaign-workspace__box"><h4>🎲 Rolagem rápida</h4><div className="campaign-workspace__actions"><select value={dice} onChange={e=>setDice(e.target.value)}>{['d4','d6','d8','d10','d12','d20','d100'].map(x=><option key={x}>{x}</option>)}</select><button onClick={roll}>Rolar</button>{result&&<strong role="status">{result}</strong>}</div></div>
 <div className="campaign-shield-characters">{characters.map(c=><article key={c.id} className="campaign-workspace__box"><h4>👤 {c.name}</h4><p>{c.p.system||'Personagem'}</p><div><small>PV: {c.p?.status?.pv??c.p?.pvAtual??c.p?.pv??'—'}</small><small>Defesa: {c.p?.status?.defesa??c.p?.defesa??'—'}</small></div></article>)}{!characters.length&&<div className="campaign-workspace__empty">Vincule fichas dos jogadores na aba Personagens para acompanhá-las aqui.</div>}</div>
 <div className="campaign-workspace__actions"><button onClick={()=>onTab('mapamental')}>🧠 Mapa mental →</button><button onClick={()=>onTab('biblioteca')}>📚 Biblioteca →</button><button onClick={()=>onTab('anotacoes')}>🗒️ Anotações →</button></div>
 </section>;
}
