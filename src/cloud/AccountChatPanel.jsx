import * as React from 'react';
import {listJourneys,listJourneyMessages,sendJourneyMessage,uploadJourneyMedia} from './jornadasCloud.js';
import './account-chat.css';

const cleanUrl=s=>{try{return new URL(s).protocol==='https:'}catch{return false}};
export default function AccountChatPanel({account,showToast}){
 const [rooms,setRooms]=React.useState([]);
 const [roomId,setRoomId]=React.useState('');
 const [messages,setMessages]=React.useState([]);
 const [draft,setDraft]=React.useState('');
 const [kind,setKind]=React.useState('text');
 const [url,setUrl]=React.useState('');
 const [file,setFile]=React.useState(null);
 const [loading,setLoading]=React.useState(false);
 const [error,setError]=React.useState('');
 const room=rooms.find(r=>r.id===roomId);
 const bottomRef=React.useRef(null);
 const refreshRooms=React.useCallback(async()=>{
   try{
     const list=await listJourneys();setRooms(list||[]);
     setRoomId(old=>(list||[]).some(r=>r.id===old)?old:(list?.[0]?.id||''));
     setError('');
   }catch(e){setError(e?.message||'Não foi possível carregar as conversas.')}
 },[account?.id]);
 React.useEffect(()=>{refreshRooms()},[refreshRooms]);
 const refreshMessages=React.useCallback(async()=>{
   if(!roomId){setMessages([]);return}
   try{setMessages(await listJourneyMessages(roomId));setError('')}
   catch(e){setError(e?.message||'Não foi possível receber mensagens.')}
 },[roomId]);
 React.useEffect(()=>{
  refreshMessages();
  if(!roomId)return;
  const interval=setInterval(refreshMessages,12000);
  return()=>clearInterval(interval);
 },[refreshMessages,roomId]);
 React.useEffect(()=>{bottomRef.current?.scrollIntoView?.({behavior:'smooth',block:'nearest'})},[messages.length]);
 const send=async e=>{
  e.preventDefault();if(!roomId||loading)return;
  setLoading(true);setError('');
  try{
   const media=file?await uploadJourneyMedia(roomId,file):'';
   const mode=file?(file.type.startsWith('image/')?'image':file.type.startsWith('video/')?'video':'link'):kind;
   await sendJourneyMessage(roomId,mode,draft,media||url);
   setDraft('');setUrl('');setKind('text');setFile(null);
   await refreshMessages();
   showToast?.('Mensagem enviada à campanha.');
  }catch(e){setError(e?.message||'Falha ao enviar mensagem.')}
  finally{setLoading(false)}
 };
 return <div className="pjlite-account-chat">
  <div className="pjlite-account-chat__intro"><span className="pjlite-account-chat__icon">💬</span><div><h3>Chat dos seus grupos</h3><p>Conversas privadas das Jornadas das quais você participa. Só membros autorizados podem acessar mensagens e mídias.</p></div></div>
  <div className="pjlite-account-chat__bar"><label>Escolha a campanha
   <select value={roomId} onChange={e=>setRoomId(e.target.value)} aria-label="Campanha do chat"><option value="">Selecione uma conversa</option>{rooms.map(r=><option key={r.id} value={r.id}>{r.name} • {r.system||'RPG'}</option>)}</select>
  </label><button type="button" className="secondary" onClick={()=>{refreshRooms();refreshMessages()}}>↻ Atualizar</button></div>
  {!rooms.length?<div className="pjlite-account-chat__empty"><strong>Nenhuma conversa disponível.</strong><p>Entre ou crie uma campanha em Jornadas. O chat será exibido aqui para os integrantes do grupo.</p><a href="/?jornadas=1">🧭 Abrir Jornadas →</a></div>:<>
    <div className="pjlite-account-chat__header"><strong>{room?.name||'Campanha'}</strong><small>Atualização automática a cada 12 segundos</small></div>
    <div className="pjlite-account-chat__messages" aria-live="polite">
      {!messages.length&&<div className="pjlite-account-chat__empty"><p>Nenhuma mensagem ainda. Comece a conversa com seu grupo.</p></div>}
      {messages.map(m=><article key={m.id} className={m.author_id===account?.id?'is-mine':''}><div className="pjlite-account-chat__meta"><strong>{m.author_id===account?.id?'Você':'Membro da campanha'}</strong><time>{m.created_at?new Date(m.created_at).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'}):''}</time></div>{m.body&&<p>{m.body}</p>}{cleanUrl(m.displayUrl)&&<div className="pjlite-account-chat__media">{m.kind==='image'&&<img src={m.displayUrl} alt={m.body||'Imagem da campanha'} loading="lazy"/>}{m.kind==='video'&&m.url?.startsWith('storage:')&&<video src={m.displayUrl} controls preload="metadata"/>}<a href={m.displayUrl} target="_blank" rel="noopener noreferrer">{m.kind==='youtube'?'▶ Abrir música':m.kind==='image'?'🖼 Abrir imagem':m.kind==='video'?'🎬 Abrir vídeo':'📎 Abrir anexo ou link'}</a></div>}</article>)}
      <div ref={bottomRef}/>
    </div>
    <form onSubmit={send} className="pjlite-account-chat__composer">
      <label>Mensagem<textarea rows={3} maxLength={8000} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Escreva para o seu grupo..."/></label>
      <div className="pjlite-account-chat__options"><label>Tipo<select value={kind} onChange={e=>setKind(e.target.value)} disabled={!!file}><option value="text">Mensagem</option><option value="image">Imagem (link)</option><option value="youtube">YouTube</option><option value="video">Vídeo (link)</option><option value="link">Outro link</option></select></label>
      <label className="pjlite-account-chat__attach">📎 Anexar foto, vídeo ou PDF<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,application/pdf" onChange={e=>setFile(e.target.files?.[0]||null)}/></label>
      </div>
      {file&&<p className="pjlite-account-chat__chosen">📎 {file.name} <button type="button" onClick={()=>setFile(null)}>Remover</button></p>}
      {kind!=='text'&&!file&&<label>Link HTTPS<input type="url" placeholder="https://..." value={url} onChange={e=>setUrl(e.target.value)}/></label>}
      <button type="submit" className="pjlite-account-chat__send" disabled={loading||!roomId||(!draft.trim()&&!file&&!url.trim())}>{loading?'Enviando…':'Enviar mensagem →'}</button>
    </form>
    <small className="pjlite-account-chat__hint">As mensagens são armazenadas na nuvem com permissões do grupo. Anexos privados de até 25 MB.</small>
  </>}
  {error&&<p className="pjlite-account-chat__error" role="alert">{error}</p>}
 </div>;
}