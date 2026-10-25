import * as React from 'react';
import {SheetQuickView,CharacterPortrait,CharacterMiniSheet} from './SheetQuickView.jsx';
import {getJourneySheetSummary} from './journeySheetSummary.js';
import {pushSheets} from './supabaseCloud.js';
import {
 listJourneys,createJourney,saveJourney,deleteJourney,listJourneyMessages,sendJourneyMessage,
 listJourneyResources,addJourneyResource,removeJourneyResource,uploadJourneyMedia,
 getMyCloudSheets,listJourneySheets,linkMySheet,setMasterSheetEdit,unlinkMySheet,saveJourneySheet,
 listJourneyDmSheets,linkDmSheet,unlinkDmSheet
} from './jornadasCloud.js';
import './jornadas.css';
import {CampaignLibrary,CampaignMindmap,CampaignRecords,CampaignNotes,CampaignShield,CampaignSectionBoundary} from './CampaignWorkspace.jsx';

const systemLabel={dragonbane:'Dragonbane',dnd5e:'D&D 5.5e',fabula:'Fábula Última',ordemParanormal:'Ordem Paranormal',skyfall:'Skyfall',somdas6:'O Som das Seis','3det':'3D&T Victory',rotaZero:'Rota Zero'};
const cleanBoard=v=>({round:1,initiative:[],encounter:'',...(v&&typeof v==='object'&&!Array.isArray(v)?v:{})});
const validHttp=value=>{try{return new URL(value).protocol==='https:'}catch{return false}};
const sheetName=s=>s?.name||s?.payload?.bio?.nome||s?.payload?.nome||'Ficha sem nome';
const previewField=(p,k)=>p?.status?.[k]??p?.[k]??'';
const levels={fabula:'Crise = metade do PV máximo; pontos de Fabula/Ultima dependem da criatura.',dragonbane:'Ferocidade indica quantas ações do monstro ocorrem por rodada. Na tabela de ataques, role 1d6.',dnd5e:'A iniciativa determina a ordem dos turnos; cada rodada reúne os turnos de todos os participantes.',ordemParanormal:'Compare Defesa e os testes de ataque; acompanhe PV e condições.',skyfall:'Acompanhe os recursos do personagem e efeitos narrativos da Sombra.',somdas6:'Acompanhe a iniciativa, a munição e as ações do turno.','3det':'Calcule FA e FD de acordo com o sistema; acompanhe PV, PM e PA.'};
export default function JornadasPanel({account,groups,showToast,onCreateThreat,onRequestGroups,onRefreshGroups}){
 const [journeys,setJourneys]=React.useState([]),[active,setActive]=React.useState(''),[tab,setTab]=React.useState('fichas');
 const [campaignName,setCampaignName]=React.useState(''),[groupId,setGroupId]=React.useState(''),[system,setSystem]=React.useState('dragonbane'),[busy,setBusy]=React.useState(false);
 const [draft,setDraft]=React.useState(null),[messages,setMessages]=React.useState([]),[resources,setResources]=React.useState([]),[links,setLinks]=React.useState([]),[dmLinks,setDmLinks]=React.useState([]),[mySheets,setMySheets]=React.useState([]);
 const [message,setMessage]=React.useState(''),[messageKind,setMessageKind]=React.useState('text'),[messageUrl,setMessageUrl]=React.useState('');
 const [resourceTitle,setResourceTitle]=React.useState(''),[resourceKind,setResourceKind]=React.useState('map'),[resourceUrl,setResourceUrl]=React.useState('');
 const [chatFile,setChatFile]=React.useState(null),[resourceFile,setResourceFile]=React.useState(null);
 const [sheetId,setSheetId]=React.useState(''),[editSheet,setEditSheet]=React.useState(null),[sheetDraft,setSheetDraft]=React.useState('');
 const [previewSheet,setPreviewSheet]=React.useState(null),[sheetError,setSheetError]=React.useState('');
 const [initiativeName,setInitiativeName]=React.useState(''),[initiativeScore,setInitiativeScore]=React.useState(''),[status,setStatus]=React.useState('');
 const [tableTitle,setTableTitle]=React.useState(''),[tableEntries,setTableEntries]=React.useState(''),[rollResult,setRollResult]=React.useState('');
 const [activeResource,setActiveResource]=React.useState('');
 const [deleteTarget,setDeleteTarget]=React.useState(null),[deleteName,setDeleteName]=React.useState('');
 const current=journeys.find(c=>c.id===active);
 const group=groups.find(g=>g.id===current?.group_id);
 const members=Array.isArray(group?.members)?group.members:[];
 const ownerId=group?.owner_id;
 const memberName=id=>id===account?.id
   ? (account?.name||'Você')
   : (members.find(m=>m.userId===id)?.name||'Jogador');
 const isDm=!!current&&current.owner_id===account?.id&&!!group?.is_dm;
 const dmGroups=groups.filter(g=>g.isOwner&&g.is_dm);
 const playerSheets=mySheets.filter(s=>s.sheet_type==='pc');
 const dmSheets=mySheets.filter(s=>s.sheet_type!=='pc');
 React.useEffect(()=>{if(dmGroups.length===1&&groupId!==dmGroups[0].id)setGroupId(dmGroups[0].id);},[groups,groupId]);
 const notify=text=>{setStatus(text);showToast?.(text)};
 const load=React.useCallback(async()=>{try{setJourneys(await listJourneys())}catch(error){console.error('Jornadas: listar',error);setStatus('Não foi possível carregar as campanhas.')}},[account?.id]);
 React.useEffect(()=>{if(account?.id)load();else setJourneys([])},[account?.id,load]);
 React.useEffect(()=>{setPreviewSheet(null);setEditSheet(null);if(!current){setDraft(null);return;}setDraft({...current,board:cleanBoard(current.board)});setTab('fichas');},[current?.id]);
 const refresh=async()=>{if(!current)return;
  // Chat ou PDF indisponível não pode impedir a lista de fichas de carregar.
  const results=await Promise.allSettled([
   listJourneyMessages(current.id),listJourneyResources(current.id),
   listJourneySheets(current.id),getMyCloudSheets(),
   isDm?listJourneyDmSheets(current.id):Promise.resolve([])
  ]);
  const setters=[setMessages,setResources,setLinks,setMySheets,setDmLinks];
  results.forEach((result,index)=>{
   if(result.status==='fulfilled')setters[index](result.value||[]);
   else console.error('Jornadas: carregar '+['chat','biblioteca','personagens','minhas fichas','NPCs/ameaças'][index],result.reason);
  });
  const problems=[];
  if(results[2].status==='rejected')problems.push('fichas vinculadas: '+(results[2].reason?.message||'falha ao consultar'));
  if(results[3].status==='rejected')problems.push('minhas fichas na nuvem: '+(results[3].reason?.message||'falha ao consultar'));
  if(results[4].status==='rejected')problems.push('NPCs/ameaças: '+(results[4].reason?.message||'falha ao consultar'));
  setSheetError(problems.length?'Erro ao carregar '+problems.join(' / '):'');
  return results;
 };
 const refreshRoom=()=>run(async()=>{await Promise.all([refresh(),onRefreshGroups?.()])},'Jogadores e fichas atualizados.');
 React.useEffect(()=>{if(current){setSheetError('');setLinks([]);setDmLinks([]);setMySheets([]);refresh().catch(error=>setSheetError(error?.message||'Falha de conexão com a nuvem.'));}},[current?.id]);
 React.useEffect(()=>{
  if(!current)return;
  const timer=setInterval(()=>{
   if(tab==='chat')listJourneyMessages(current.id).then(setMessages).catch(()=>{});
   if(tab==='combate'&&!isDm)listJourneys().then(rows=>{
    const latest=rows.find(c=>c.id===current.id);
    if(latest)setDraft({...latest,board:cleanBoard(latest.board)});
   }).catch(()=>{});
  },12000);
  return()=>clearInterval(timer);
 },[current?.id,tab,isDm]);
 const run=async(action,success)=>{setBusy(true);try{await action();if(success)notify(success);}catch(error){console.error('Jornadas',error);notify(error?.message||'Não foi possível concluir a operação.')}finally{setBusy(false)}};
 const newCampaign=()=>run(async()=>{
  const selectedGroup=groupId||(dmGroups.length===1?dmGroups[0].id:'');
  if(!selectedGroup)throw new Error('Escolha um grupo de mestre.');
  if(!campaignName.trim())throw new Error('Dê um nome à campanha.');
  const created=await createJourney(selectedGroup,campaignName,system);
  await load();setActive(created.id);setCampaignName('');
 },'Jornada criada. Todos os membros do grupo já podem entrar.');
 const save=()=>run(async()=>{
  const next=await saveJourney(draft,{name:draft.name,system:draft.system,description:draft.description,notes:draft.notes,board:draft.board});
  setJourneys(old=>old.map(c=>c.id===next.id?next:c));setDraft({...next,board:cleanBoard(next.board)});
 },'Anotações e mesa salvas para o grupo.');
 const requestDelete=campaign=>{
  if(busy||!campaign||campaign.owner_id!==account?.id||
     !groups.some(g=>g.id===campaign.group_id&&g.isOwner&&g.is_dm))return;
  setDeleteName('');setDeleteTarget({id:campaign.id,name:campaign.name,owner_id:campaign.owner_id});
 };
 const cancelDelete=()=>{if(busy)return;setDeleteTarget(null);setDeleteName('')};
 const confirmDelete=()=>{
  if(busy||!deleteTarget||deleteName!==deleteTarget.name||deleteTarget.owner_id!==account?.id)return;
  const campaignId=deleteTarget.id;
  return run(async()=>{
   const deleted=await deleteJourney(campaignId);
   setJourneys(previous=>previous.filter(c=>c.id!==deleted.id));
   if(active===deleted.id){
    setActive('');setDraft(null);setPreviewSheet(null);setEditSheet(null);
    setLinks([]);setDmLinks([]);setMessages([]);setResources([]);
   }
   setDeleteTarget(null);setDeleteName('');
   await load();
  },'Campanha excluída. Suas fichas originais foram preservadas.');
 };
 const setBoard=patch=>setDraft(x=>({...x,board:{...cleanBoard(x.board),...patch}}));
 const addInitiative=()=>{const name=initiativeName.trim();if(!name)return;setBoard({initiative:[...(draft.board.initiative||[]),{id:Date.now().toString(36),name,score:Number(initiativeScore)||0}].sort((a,b)=>b.score-a.score)});setInitiativeName('');setInitiativeScore('')};
 const post=()=>run(async()=>{
  const media=chatFile?await uploadJourneyMedia(current.id,chatFile):'';
  const kind=chatFile?(chatFile.type.startsWith('image/')?'image':chatFile.type.startsWith('video/')?'video':'link'):messageKind;
  await sendJourneyMessage(current.id,kind,message,media||messageUrl);
  setMessage('');setMessageUrl('');setChatFile(null);await refresh();
 },'Mensagem enviada.');
 const addResource=()=>run(async()=>{
  const media=resourceFile?await uploadJourneyMedia(current.id,resourceFile):'';
  const kind=resourceFile?(resourceFile.type==='application/pdf'?'pdf':resourceFile.type.startsWith('image/')?'image':'video'):resourceKind;
  await addJourneyResource(current.id,resourceTitle||resourceFile?.name||'',kind,media||resourceUrl);
  setResourceTitle('');setResourceUrl('');setResourceFile(null);await refresh();
 },'Material incluído na campanha.');
 const addLinkFrom=id=>run(async()=>{
  if(!current?.id||!id)throw new Error('Selecione uma ficha sincronizada.');
  await linkMySheet(current.id,id);
  // Só declarar sucesso quando a ficha estiver realmente visível na campanha.
  const confirmed=await listJourneySheets(current.id);
  if(!confirmed.some(row=>row.sheet_id===id))throw new Error('Não foi possível confirmar o vínculo na nuvem. Verifique sua conta e tente atualizar a sala.');
  setLinks(confirmed);setSheetError('');setSheetId('');
  await refresh();
 },'Ficha vinculada e disponível na campanha.');
 const addLink=()=>addLinkFrom(sheetId);
 const addDmLink=id=>run(async()=>{
  if(!isDm||!current?.id||!id)throw new Error('Abra sua campanha como mestre e escolha uma ameaça ou NPC sincronizado.');
  await linkDmSheet(current.id,id);
  const confirmed=await listJourneyDmSheets(current.id);
  if(!confirmed.some(row=>row.sheet_id===id&&row.sheets))throw new Error('O NPC foi enviado, mas não foi possível confirmar a ficha. Atualize a sala.');
  setDmLinks(confirmed);await refresh();
 },'NPC ou ameaça adicionado à área privada do mestre.');
 const removeDmLink=id=>run(async()=>{
  if(!isDm)throw new Error('Área exclusiva do mestre.');
  await unlinkDmSheet(current.id,id);setPreviewSheet(null);await refresh();
 },'NPC ou ameaça removido da campanha. Sua ficha original foi preservada.');
 const syncLocal=()=>run(async()=>{
  const read=(key)=>{try{const rows=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(rows)?rows.filter(x=>x&&typeof x==='object'&&x.id):[]}catch{return []}};
  const chars=read('dragonbane_saved_characters');
  const threats=read('dragonbane_saved_threats');
  if(!chars.length&&!threats.length)throw new Error('Não há fichas salvas neste dispositivo. Crie ou importe uma ficha na Home primeiro.');
  await pushSheets(chars,threats);
  await refresh();
 },'Fichas deste dispositivo enviadas à Conta Lite. Escolha quais vincular à campanha.');
 const openSheet=row=>{setEditSheet(null);setPreviewSheet(row)};
 const openNativeEditor=row=>{
  if(!row?.sheet_id||!current?.id)return;
  const params=new URLSearchParams({editSheet:row.sheet_id,campaignId:current.id});
  window.location.assign('/?'+params.toString());
 };
 const unlinkOwnSheet=row=>{
  if(row?.owner_id!==account.id)return;
  if(!window.confirm('Remover "'+sheetName(row.sheets)+'" desta campanha? A ficha continuará salva na Conta Lite.'))return;
  run(async()=>{await unlinkMySheet(current.id,row.sheet_id);setPreviewSheet(null);await refresh();},
   'Ficha removida da campanha. Ela continua salva na sua conta.');
 };

 const startSheetEdit=row=>{setEditSheet(row);setSheetDraft(JSON.stringify(row.sheets?.payload||{},null,2))};
 const applySheetEdit=()=>run(async()=>{
  let payload;try{payload=JSON.parse(sheetDraft)}catch{throw new Error('A ficha precisa conter JSON válido.')}
  const original=editSheet.sheets?.payload||{};
  // Protege identidade da ficha, inclusive nas edições com permissão do mestre.
  payload.id=original.id;payload.system=original.system;payload.type=original.type;
  await saveJourneySheet(editSheet.sheet_id,payload);setEditSheet(null);await refresh();
 },'Ficha atualizada na nuvem. O jogador deve sincronizar antes de continuar editando.');
 const allTabs=[
  ['fichas','Personagens'],...(isDm?[['npcs','NPCs/Ameaças']]:[]),
  ['jogadores','Jogadores'],['combate','Combates'],['biblioteca','Biblioteca'],
  ['investigacao','Investigação'],['relatorios','Relatórios'],['anotacoes','Anotações'],
  ['chat','Chat'],['tabelas','Dados e tabelas'],
  ...(isDm?[['escudo','Escudo do Mestre'],['mapamental','Mapa mental']]:[]),
  ['resumo','Configurações']
 ];
 if(!account)return <p className="pjlite-jornadas-empty">Entre na Conta Lite para acessar Jornadas.</p>;
 return <div className="pjlite-jornadas">
  {!current&&<div className="pjlite-jornadas-header"><div><small>SUAS MESAS • JORNADAS PJLITE</small><h3>🧭 Campanhas</h3><p>Abra a campanha, organize os personagens, combates, livros e investigações. Tudo vinculado ao seu grupo.</p></div><button type="button" className="secondary" onClick={()=>run(load,'Campanhas atualizadas.')}>↻ Atualizar</button></div>}
  {status&&<div className="pjlite-jornadas-status" role="status">{status}</div>}
  {!current?<><details id="jornadas-create-form" className="pjlite-jornadas-box jornadas-new-campaign"><summary>＋ Nova campanha</summary>{dmGroups.length===0?<div><p>Crie um grupo de mestre para habilitar campanhas compartilhadas.</p><button type="button" className="pjlite-jornadas-primary" onClick={onRequestGroups}>♟ Criar grupo →</button></div>:<div className="pjlite-jornadas-fields"><select aria-label="Grupo com mestre" value={groupId} onChange={e=>setGroupId(e.target.value)}><option value="">Selecione o grupo DM...</option>{dmGroups.map(g=><option value={g.id} key={g.id}>{g.name}</option>)}</select><input aria-label="Nome da campanha" maxLength={120} placeholder="Nome da campanha" value={campaignName} onChange={e=>setCampaignName(e.target.value)}/><select aria-label="Sistema da campanha" value={system} onChange={e=>setSystem(e.target.value)}><option value="Livre">Sistema livre</option>{Object.entries(systemLabel).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select><button type="button" disabled={busy} className="pjlite-jornadas-primary" onClick={newCampaign}>+ Criar Jornada</button></div>}</details>
   <div className="pjlite-jornadas-cards">{journeys.map(c=><div className="jornadas-campaign-tile" key={c.id}><button className="pjlite-jornadas-card jornadas-campaign-card" type="button" onClick={()=>setActive(c.id)}><div className="jornadas-campaign-cover" style={validHttp(c.board?.coverUrl)?{backgroundImage:'linear-gradient(0deg,rgba(18,44,33,.65),transparent 68%),url("'+c.board.coverUrl.replace(/"/g,'%22')+'")'}:{}}>{!validHttp(c.board?.coverUrl)&&<span className="jornadas-campaign-cover__icon">✦</span>}<span className="jornadas-campaign-role">{c.owner_id===account.id?'🛡 Mestre':'👤 Jogador'}</span></div><div className="jornadas-campaign-details"><strong>{c.name}</strong><small>{systemLabel[c.system]||c.system} · {groups.find(g=>g.id===c.group_id)?.name||'Grupo'}</small><small>👥 {groups.find(g=>g.id===c.group_id)?.members?.length||1} {(groups.find(g=>g.id===c.group_id)?.members?.length||1)===1?'participante':'participantes'}</small><span>Entrar na campanha →</span></div></button>
    {c.owner_id===account.id&&groups.some(g=>g.id===c.group_id&&g.isOwner&&g.is_dm)&&
     <button type="button" className="jornadas-campaign-delete-shortcut" aria-label={'Excluir campanha '+c.name}
       title="Excluir campanha" disabled={busy} onClick={()=>requestDelete(c)}>🗑 Excluir</button>}
    </div>)}{journeys.length===0&&<p className="pjlite-jornadas-empty">Ainda não há campanhas nos seus grupos.</p>}</div>
  </>:draft&&<div className="pjlite-jornadas-room">
   <div className="pjlite-jornadas-room-head"><button type="button" className="secondary" onClick={()=>{setActive('');setEditSheet(null)}}>← Campanhas</button><div><strong>{current.name}</strong><small>{group?.name} · {systemLabel[current.system]||current.system} · {isDm?'Mestre':'Jogador'} · 👥 {members.length||1} {members.length===1?'participante':'participantes'}</small></div>{isDm&&group?.invite_code&&<button type="button" className="secondary" title="Copiar convite para jogadores" onClick={async()=>{try{if(!navigator.clipboard?.writeText)throw new Error('clipboard');await navigator.clipboard.writeText(group.invite_code);notify('Código do grupo copiado. Compartilhe com os jogadores.')}catch{notify('Convite do grupo: '+group.invite_code)}}}>✉ Copiar convite</button>}<button type="button" className="secondary" title="Atualizar membros e fichas" onClick={refreshRoom}>↻</button></div>
   <nav className="pjlite-jornadas-tabs pjlite-jornadas-tabs--compact jornadas-tools-two-rows" aria-label="Seções da campanha">
    {allTabs.map(([key,title])=><button key={key} type="button" aria-pressed={tab===key}
      onClick={()=>{setTab(key);setEditSheet(null)}}>{title}</button>)}
   </nav>
   {tab==='resumo'&&<section className="pjlite-jornadas-box"><h4>📜 A campanha</h4><label>Nome<input value={draft.name||''} disabled={!isDm} onChange={e=>setDraft(x=>({...x,name:e.target.value}))}/></label><label>Imagem de capa (URL HTTPS)<input type="url" value={draft.board?.coverUrl||''} disabled={!isDm} onChange={e=>setBoard({coverUrl:e.target.value})} placeholder="https://.../imagem.jpg"/></label><label>Sinopse<textarea rows={3} value={draft.description||''} disabled={!isDm} onChange={e=>setDraft(x=>({...x,description:e.target.value}))}/></label><label>Anotações gerais — visíveis a todos<textarea rows={7} value={draft.notes||''} disabled={!isDm} onChange={e=>setDraft(x=>({...x,notes:e.target.value}))}/></label>{isDm&&<button className="pjlite-jornadas-primary" disabled={busy} onClick={save}>Salvar anotações</button>}
     {isDm&&<div className="jornadas-campaign-danger-zone">
       <strong>Excluir campanha</strong>
       <p>Exclui os dados desta campanha, incluindo chat, registros, materiais e vínculos. As fichas originais dos jogadores, as ameaças e o grupo permanecem salvos na Conta Lite.</p>
       <button type="button" disabled={busy} onClick={()=>requestDelete(current)}>🗑 Excluir esta campanha</button>
     </div>}<aside><b>Regras rápidas do sistema</b><p>{levels[draft.system]||'Consulte o livro básico do sistema para regras de combate, testes e condições.'}</p><small>Este resumo é um lembrete, não substitui o livro.</small></aside></section>}
   {tab==='biblioteca'&&<CampaignLibrary campaignId={current.id} isDm={isDm} notify={notify}/>}
   {tab==='mapamental'&&isDm&&<CampaignMindmap campaignId={current.id} isDm={isDm}/>}
   {tab==='investigacao'&&<CampaignRecords mode="investigacao" draft={draft} setDraft={setDraft} isDm={isDm} onSave={save} busy={busy}/>}
   {tab==='relatorios'&&<CampaignRecords mode="relatorios" draft={draft} setDraft={setDraft} isDm={isDm} onSave={save} busy={busy}/>}
   {tab==='anotacoes'&&<CampaignNotes draft={draft} setDraft={setDraft} isDm={isDm} onSave={save} busy={busy}/>}
   {tab==='escudo'&&isDm&&<CampaignSectionBoundary resetKey={current.id+':'+tab} onTab={setTab}><CampaignShield draft={draft} links={links} dmLinks={dmLinks} isDm={isDm} onTab={setTab} onOpenSheet={openSheet}/></CampaignSectionBoundary>}
   {tab==='combate'&&<section className="pjlite-jornadas-box"><h4>⚔ Iniciativa e combate</h4><div className="pjlite-jornadas-fields"><label>Rodada<input type="number" min={1} disabled={!isDm} value={draft.board.round||1} onChange={e=>setBoard({round:Math.max(1,Number(e.target.value)||1)})}/></label>{isDm&&<button type="button" className="secondary" onClick={()=>setBoard({round:Number(draft.board.round||1)+1})}>Próxima rodada →</button>}</div><label>Cena e encontro<textarea rows={4} value={draft.board.encounter||''} disabled={!isDm} onChange={e=>setBoard({encounter:e.target.value})}/></label>{isDm&&<div className="pjlite-jornadas-fields"><input placeholder="Personagem ou inimigo" value={initiativeName} onChange={e=>setInitiativeName(e.target.value)}/><input type="number" aria-label="Iniciativa" placeholder="Resultado" value={initiativeScore} onChange={e=>setInitiativeScore(e.target.value)}/><button type="button" onClick={addInitiative}>+ Iniciativa</button></div>}<ol className="pjlite-jornadas-initiative">{(draft.board.initiative||[]).map(row=><li key={row.id}><strong>{row.score}</strong> {row.name} {isDm&&<button type="button" onClick={()=>setBoard({initiative:draft.board.initiative.filter(x=>x.id!==row.id)})}>×</button>}</li>)}</ol>{isDm&&<button className="pjlite-jornadas-primary" disabled={busy} onClick={save}>Salvar combate</button>}</section>}
   {tab==='chat'&&<section className="pjlite-jornadas-box"><h4>💬 Chat da mesa</h4><p>Converse com seu grupo e envie fotos, vídeos curtos ou links de músicas. Arquivos privados ficam no armazenamento protegido da campanha (até 25 MB).</p><div className="pjlite-jornadas-chat">{messages.map(m=><article key={m.id}><small>{m.author_id===account.id?'Você':'Membro'} • {new Date(m.created_at).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}</small>{m.body&&<p>{m.body}</p>}{validHttp(m.displayUrl)&&<>{m.kind==='image'&&<img src={m.displayUrl} alt={m.body||'Imagem enviada'} className="pjlite-jornadas-chat-media" loading="lazy"/>}{m.kind==='video'&&m.url?.startsWith('storage:')&&<video className="pjlite-jornadas-chat-media" controls preload="metadata" src={m.displayUrl}/>}<a href={m.displayUrl} target="_blank" rel="noopener noreferrer">{m.kind==='youtube'?'▶ Abrir música no YouTube':m.kind==='image'?'🖼 Abrir imagem':m.kind==='video'?'🎞 Abrir vídeo':'Abrir link ↗'}</a></>}</article>)}</div><textarea rows={3} placeholder="Mensagem para o grupo..." value={message} onChange={e=>setMessage(e.target.value)}/><div className="pjlite-jornadas-fields"><label className="pjlite-jornadas-file-label">📎 Foto, vídeo ou PDF<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,application/pdf" onChange={e=>setChatFile(e.target.files?.[0]||null)}/></label>{chatFile&&<small>{chatFile.name}</small>}<select value={messageKind} aria-label="Tipo de mensagem" onChange={e=>setMessageKind(e.target.value)}><option value="text">Mensagem</option><option value="image">Imagem (link)</option><option value="video">Vídeo (link)</option><option value="youtube">YouTube (link)</option><option value="link">Outro link</option></select>{messageKind!=='text'&&<input placeholder="https://..." value={messageUrl} onChange={e=>setMessageUrl(e.target.value)}/>}<button disabled={busy||(!message.trim()&&!messageUrl.trim()&&!chatFile)} className="pjlite-jornadas-primary" onClick={post}>Enviar</button></div></section>}
   {tab==='materiais'&&<section className="pjlite-jornadas-box"><h4>🗺 Mapas, tabelas e documentos</h4><p>O mestre organiza mapas, tabelas, fotos, vídeos e PDFs autorizados. Os uploads privados ficam restritos ao grupo (até 25 MB); links HTTPS também são aceitos.</p>{isDm&&<div className="pjlite-jornadas-fields"><input placeholder="Título do recurso" maxLength={160} value={resourceTitle} onChange={e=>setResourceTitle(e.target.value)}/><select value={resourceKind} onChange={e=>setResourceKind(e.target.value)}><option value="map">Mapa</option><option value="image">Imagem</option><option value="pdf">PDF (link)</option><option value="table">Tabela</option><option value="youtube">YouTube</option><option value="video">Vídeo</option><option value="link">Link</option></select><input placeholder="https://..." value={resourceUrl} onChange={e=>setResourceUrl(e.target.value)}/><label className="pjlite-jornadas-file-label">📎 Enviar arquivo<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,application/pdf" onChange={e=>setResourceFile(e.target.files?.[0]||null)}/></label>{resourceFile&&<small>{resourceFile.name}</small>}<button disabled={busy||(!resourceFile&&!resourceUrl.trim())} className="pjlite-jornadas-primary" onClick={addResource}>Adicionar</button></div>}<div className="pjlite-jornadas-resources">{resources.map(r=><article key={r.id}><span>{({map:'🗺️',image:'🖼️',pdf:'📄',table:'🎲',youtube:'♫',video:'🎞️'})[r.kind]||'🔗'}</span><a href={validHttp(r.displayUrl)?r.displayUrl:'#'} target="_blank" rel="noopener noreferrer">{r.title}</a>{['image','map'].includes(r.kind)&&validHttp(r.displayUrl)&&<button type="button" className="pjlite-jornadas-resource-preview-button" onClick={()=>setActiveResource(activeResource===r.id?'':r.id)}><img src={r.displayUrl} alt={r.title} className="pjlite-jornadas-resource-thumb" loading="lazy"/></button>}{isDm&&<button type="button" title="Remover material" onClick={()=>run(async()=>{await removeJourneyResource(r.id);await refresh()},'Material removido.')}>×</button>}</article>)}</div>{resources.filter(r=>r.id===activeResource&&validHttp(r.displayUrl)).map(r=><div key={r.id} className="pjlite-jornadas-expanded-map"><strong>{r.title}</strong><img src={r.displayUrl} alt={r.title} loading="lazy"/></div>)}</section>}
   {tab==='tabelas'&&<section className="pjlite-jornadas-box"><h4>🎲 Tabelas da Jornada</h4><p>Crie tabelas de encontros, acontecimentos e tesouros. Um resultado é sorteado entre as linhas preenchidas.</p>{isDm&&<div className="pjlite-jornadas-fields"><input placeholder="Título da tabela" value={tableTitle} onChange={e=>setTableTitle(e.target.value)}/><textarea rows={5} value={tableEntries} onChange={e=>setTableEntries(e.target.value)} placeholder={'Um evento por linha\nExemplo: Nevoeiro\nRuídos no corredor\nCriatura curiosa'}/><button type="button" onClick={()=>{const values=tableEntries.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(!values.length||!tableTitle.trim())return;setBoard({tables:[...(draft.board.tables||[]),{id:Date.now().toString(36),name:tableTitle.trim(),entries:values}]});setTableTitle('');setTableEntries('')}}>+ Criar tabela</button></div>}{(draft.board.tables||[]).map(table=><article className="pjlite-jornadas-table" key={table.id}><strong>{table.name}</strong><small>{table.entries?.length||0} resultados possíveis</small><div className="pjlite-jornadas-fields"><button type="button" onClick={()=>{const list=table.entries||[];if(list.length)setRollResult(table.name+' → '+list[Math.floor(Math.random()*list.length)])}}>🎲 Rolar na tabela</button>{isDm&&<button type="button" onClick={()=>setBoard({tables:(draft.board.tables||[]).filter(t=>t.id!==table.id)})}>Remover</button>}</div></article>)}{rollResult&&<div className="pjlite-jornadas-roll" role="status">{rollResult}</div>}{isDm&&<button className="pjlite-jornadas-primary" disabled={busy} onClick={save}>Salvar tabelas</button>}</section>}
   {tab==='jogadores'&&<section className="pjlite-jornadas-box journeys-compact-panel">
    <div className="journeys-panel-heading"><h4>👥 Jogadores na mesa ({members.length||1})</h4><small>Membros reais do grupo · fichas vinculadas à campanha</small></div>
    <div className="journeys-roster-grid">{(members.length?members:[{userId:account.id,name:account.name||'Você',role:'owner',avatar:account.avatar||''}]).map(m=>{
      const owned=links.filter(link=>link.owner_id===m.userId),name=m.userId===account.id?(account.name||'Você'):(m.name||'Jogador');
      return <article className="journeys-player-card" key={m.userId}>
       <CharacterPortrait name={name} url={m.avatar}/>
       <div className="journeys-player-info"><strong>{name}</strong><small>{m.userId===ownerId?'🛡 Mestre':'Jogador'}{m.userId===account.id?' · Você':''}</small>
        <span>{owned.length?owned.map(link=>sheetName(link.sheets)).join(' · '):'Sem ficha vinculada'}</span></div>
       {owned.length>0&&<button type="button" onClick={()=>{setTab('fichas');setPreviewSheet(owned[0]);}} aria-label={'Ver ficha de '+name}>Ver ficha →</button>}
      </article>;
     })}</div>
    {members.length===0&&<small>Não foi possível carregar os demais perfis. Atualize a seção Grupos e convites para sincronizar os membros.</small>}
   </section>}
   {tab==='fichas'&&<section className="pjlite-jornadas-box journeys-compact-panel">
    <div className="journeys-panel-heading"><h4>🗂 Personagens dos jogadores ({links.length})</h4><button type="button" className="secondary" onClick={()=>setTab('jogadores')}>👥 Jogadores ({members.length||1}) →</button></div>
    {sheetError&&<div className="journeys-sheet-error" role="alert"><strong>Não foi possível carregar todas as fichas.</strong><p>{sheetError}</p><button type="button" onClick={refreshRoom}>↻ Tentar novamente</button></div>}
    {links.length===0&&!sheetError?<div className="journeys-empty-sheets"><strong>Nenhuma ficha vinculada a esta campanha.</strong><p>Fichas sincronizadas na Conta Lite não aparecem automaticamente: cada jogador precisa vinculá-las à campanha aqui embaixo.</p></div>:
     <div className="journeys-character-grid">{links.map(row=>
      <CharacterMiniSheet key={row.sheet_id} row={row} ownerLabel={memberName(row.owner_id)}
       onView={()=>{setEditSheet(null);setPreviewSheet(row)}}/>
     )}</div>}
    <details className="journeys-link-sheet" open={links.length===0}><summary>＋ Vincular ou gerenciar minhas fichas</summary>
     <p>Cada jogador vincula suas próprias fichas para que o mestre e os membros autorizados possam consultá-las. A edição pelo mestre exige permissão do dono.</p>
     {playerSheets.length>0&&<div className="journeys-link-sheet__available"><strong>Meus personagens na Conta Lite</strong>{playerSheets.filter(s=>!links.some(row=>row.sheet_id===s.id)).map(s=><div key={s.id} className="journeys-link-sheet__row"><span>{s.name||'Ficha sem nome'} · {systemLabel[s.system]||s.system}</span><button type="button" disabled={busy} onClick={()=>addLinkFrom(s.id)}>+ Vincular à campanha</button></div>)}{playerSheets.every(s=>links.some(row=>row.sheet_id===s.id))&&<small>Você já vinculou todas as suas fichas disponíveis.</small>}</div>}
     {playerSheets.length>0?<div className="pjlite-jornadas-fields"><select value={sheetId} aria-label="Minha ficha na nuvem" onChange={e=>setSheetId(e.target.value)}>
      <option value="">Escolha uma ficha sua...</option>{playerSheets.map(s=><option key={s.id} value={s.id}>{s.name} · {systemLabel[s.system]||s.system}</option>)}
     </select><button disabled={!sheetId||busy} className="pjlite-jornadas-primary" onClick={addLink}>+ Vincular</button></div>:<p>Você ainda não tem personagens na nuvem. Use “Enviar fichas deste dispositivo” para trazer seus personagens locais.</p>}
     {links.filter(row=>row.owner_id===account.id).map(row=><div key={row.sheet_id} className="journeys-link-sheet__row"><span>{sheetName(row.sheets)}</span><label className="pjlite-jornadas-check"><input type="checkbox" checked={!!row.dm_can_edit} onChange={e=>run(async()=>{await setMasterSheetEdit(current.id,row.sheet_id,e.target.checked);await refresh()},'Permissão atualizada.')}/> Permitir edição pelo DM</label>
      <button type="button" disabled={busy} onClick={()=>unlinkOwnSheet(row)}>Desvincular</button></div>)}
    </details>
    <button type="button" className="journeys-threat-create" disabled={busy} onClick={syncLocal}>☁ Enviar fichas deste dispositivo para a Conta Lite</button>
    {editSheet&&<div className="pjlite-jornadas-sheet-editor"><h4>Edição avançada · {sheetName(editSheet.sheets)}</h4><p>A edição em JSON pode alterar todos os campos. Use somente se conhecer a estrutura desta ficha.</p><textarea spellCheck={false} rows={14} value={sheetDraft} disabled={!(editSheet.owner_id===account.id||(isDm&&editSheet.dm_can_edit))} onChange={e=>setSheetDraft(e.target.value)}/><div className="pjlite-jornadas-fields"><button type="button" onClick={()=>setEditSheet(null)}>Fechar</button>{(editSheet.owner_id===account.id||(isDm&&editSheet.dm_can_edit))&&<button className="pjlite-jornadas-primary" onClick={applySheetEdit} disabled={busy}>Salvar ficha na nuvem</button>}</div></div>}
   </section>}

   {tab==='npcs'&&isDm&&<section className="pjlite-jornadas-box journeys-compact-panel">
     <div className="journeys-panel-heading"><h4>☠ NPCs e Ameaças do Mestre ({dmLinks.length})</h4><small>Área privada: somente o mestre pode consultar ou gerenciar estas fichas</small></div>
     {sheetError&&<div className="journeys-sheet-error" role="alert"><p>{sheetError}</p><button type="button" onClick={refreshRoom}>↻ Atualizar</button></div>}
     {dmLinks.length>0?<div className="journeys-character-grid">{dmLinks.map(row=><div key={row.sheet_id} className="journeys-dm-card">
       <CharacterMiniSheet row={row} ownerLabel="Mestre" onView={()=>openSheet(row)}/>
       <button type="button" className="journeys-dm-card__remove" disabled={busy} onClick={()=>removeDmLink(row.sheet_id)}>Remover da campanha</button>
     </div>)}</div>:<div className="journeys-empty-sheets"><strong>Esta campanha ainda não tem NPCs ou ameaças.</strong><p>Escolha uma ficha sua abaixo para deixá-la à mão durante a sessão. Os jogadores não verão esta seção.</p></div>}
     <div className="journeys-link-sheet__available">
       <strong>NPCs e ameaças disponíveis na sua Conta Lite</strong>
       {dmSheets.filter(sheet=>!dmLinks.some(row=>row.sheet_id===sheet.id)).map(sheet=><div className="journeys-link-sheet__row" key={sheet.id}>
         <span>{sheet.name||'Sem nome'} · {systemLabel[sheet.system]||sheet.system} · {sheet.sheet_type==='ameaca'?'Ameaça':sheet.sheet_type}</span>
         <button type="button" disabled={busy} onClick={()=>addDmLink(sheet.id)}>+ Adicionar à campanha</button>
       </div>)}
       {!dmSheets.length&&<p>Não há ameaças ou NPCs sincronizados nesta conta. Envie suas fichas do dispositivo ou crie uma na Home.</p>}
     </div>
     <button type="button" disabled={busy} className="journeys-threat-create" onClick={syncLocal}>☁ Enviar NPCs e ameaças deste dispositivo</button>
     <a href="/" className="journeys-threat-create">＋ Criar NPC ou ameaça na Home →</a>
     {editSheet&&<div className="pjlite-jornadas-sheet-editor"><h4>Edição avançada · {sheetName(editSheet.sheets)}</h4><p>Edite somente se conhecer a estrutura JSON desta ficha.</p>
       <textarea spellCheck={false} rows={12} value={sheetDraft} disabled={!isDm||editSheet.owner_id!==account.id} onChange={e=>setSheetDraft(e.target.value)}/>
       <div className="pjlite-jornadas-fields"><button type="button" onClick={()=>setEditSheet(null)}>Fechar</button><button type="button" className="pjlite-jornadas-primary" disabled={busy||editSheet.owner_id!==account.id} onClick={applySheetEdit}>Salvar ficha</button></div>
     </div>}
   </section>}
   {deleteTarget&&<div className="jornadas-delete-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)cancelDelete()}}>
    <section className="jornadas-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="jornadas-delete-title"
      onKeyDown={event=>{if(event.key==='Escape')cancelDelete()}}>
      <h3 id="jornadas-delete-title">🗑 Excluir campanha definitivamente?</h3>
      <p>Você está prestes a excluir <strong>{deleteTarget.name}</strong>. Os membros perderão acesso à campanha e às suas mensagens, anotações, relatórios, materiais compartilhados e vínculos.</p>
      <p><strong>As fichas originais dos jogadores e suas ameaças NÃO serão apagadas.</strong> O grupo também continuará existindo.</p>
      <label htmlFor="jornadas-delete-name">Digite o nome exato da campanha para confirmar:</label>
      <input id="jornadas-delete-name" autoFocus type="text" autoComplete="off" maxLength={120}
        value={deleteName} disabled={busy} onChange={event=>setDeleteName(event.target.value)}
        placeholder={deleteTarget.name}/>
      <div className="jornadas-delete-dialog__actions">
       <button type="button" onClick={cancelDelete} disabled={busy}>Cancelar</button>
       <button type="button" className="jornadas-delete-confirm" disabled={busy||deleteName!==deleteTarget.name}
        onClick={confirmDelete}>{busy?'Excluindo...':'Excluir definitivamente'}</button>
      </div>
    </section>
   </div>}
   {previewSheet&&<SheetQuickView row={previewSheet} ownerLabel={memberName(previewSheet.owner_id)} onClose={()=>setPreviewSheet(null)}
      canEdit={previewSheet.owner_id===account.id||(isDm&&previewSheet.dm_can_edit)}
      canUnlink={previewSheet.owner_id===account.id&&!dmLinks.some(row=>row.sheet_id===previewSheet.sheet_id)}
      onUnlink={()=>unlinkOwnSheet(previewSheet)}
      onEdit={()=>openNativeEditor(previewSheet)}/>}

  </div>}
 </div>;
}
