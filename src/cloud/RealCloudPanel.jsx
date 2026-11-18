import * as React from 'react';
import {
  isSupabaseConfigured,
  getSession,
  signInWithGoogle,
  signInWithOtp,
  signOut,
  onAuthStateChange,
  getProfile,
  getMyAchievements,
  pushSheets,
  pullSheets,
  mirrorSheets,
  deleteRemoteSheets,
  fetchDeletedSheetIds,
  listGroups,
  createGroup,
  joinGroupByCode,
  rotateGroupCode,
  deleteGroup,
  shareSheetToEmail,
  shareSheetToGroup,
  listInbox,
  markShareImported,
  dismissShare,
} from './supabaseCloud.js';
import AdminCloudPanel from './AdminCloudPanel.jsx';
import AccountChatPanel from './AccountChatPanel.jsx';
import './account-achievements.css';
import {rememberCloudOwner,getPendingSheetDeletions,clearPendingSheetDeletions,withoutPendingDeletions,getLastCloudOwner} from './cloudSheetDeletions.js';
import {mergeSheetsByRevision,filterSheetsByIds,sameSheetList} from './sheetSyncMerge.js';
import {setGroupMaster} from './jornadasCloud.js';

const STORAGE_KEY = 'dragonbane_saved_characters';
const THREAT_STORAGE_KEY = 'dragonbane_saved_threats';
const ROTA_ZERO_DRIVE_URL='https://drive.google.com/drive/folders/1MVLTsPPATBGd910JWD5j1zYd3A779ytu?usp=drive_link';

const sheetName = item => String(item?.bio?.nome || item?.nome || item?.name || 'Ficha sem nome').trim() || 'Ficha sem nome';
const systemName = item => String(item?.system || 'RPG').replace('dnd5e', 'D&D 5.5e').replace('fabulaUltima', 'Fabula Ultima').replace('3det', '3DeT Victory');

const groupMemberTags = member => Array.isArray(member?.achievementTags) ? member.achievementTags : [];
const visibleAchievement = tag => String(tag?.category||'').toUpperCase()==='EVENTO'||/rz-88|rota.zero/i.test(String(tag?.id||tag?.achievement_id||'')+' '+String(tag?.label||'')) ? 'Conquista' : String(tag?.label||'Conquista');

const GroupMemberProfile = ({ member, currentUserId }) => {
  const tags = groupMemberTags(member);
  const name = String(member?.name || (member?.userId === currentUserId ? 'Você' : 'Jogador')).trim() || 'Jogador';
  const role = member?.role === 'owner' ? 'Dono do grupo' : 'Membro';
  return <div className="pjlite-cloud-member">
    <div className="pjlite-cloud-member__avatar">
      {member?.avatar?<img src={member.avatar} alt="" />:<span>{name.charAt(0).toUpperCase()}</span>}
    </div>
    <div className="pjlite-cloud-member__main">
      <div className="pjlite-cloud-member__name"><strong>{name}</strong>{member?.userId===currentUserId&&<em>Você</em>}</div>
      <small>{role}</small>
      <div className="pjlite-cloud-member__tags">
        {tags.length?tags.map(tag=><span key={tag.id||tag.label} className="pjlite-cloud-member-tag" title="Conquista desbloqueada">{visibleAchievement(tag)}</span>):<span className="pjlite-cloud-member-tag is-empty">Sem conquistas</span>}
      </div>
    </div>
  </div>;
};

export default function RealCloudPanel({ savedChars, savedThreats, setSavedChars, setSavedThreats, showToast }) {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState('sync');
  const [session, setSession] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [status, setStatus] = React.useState('idle');
  const [lastSync, setLastSync] = React.useState('');
  const [remoteCount, setRemoteCount] = React.useState(0);
  const [groups, setGroups] = React.useState([]);
  const [inbox, setInbox] = React.useState([]);
  const [emailDraft, setEmailDraft] = React.useState('');
  const [groupName, setGroupName] = React.useState('');
  const [createAsDm, setCreateAsDm] = React.useState(false);
  const [achievements, setAchievements] = React.useState([]);
  const [achievementsOn,setAchievementsOn] = React.useState(true);
  const [inviteCode, setInviteCode] = React.useState('');
  const [shareDraft, setShareDraft] = React.useState({ sheetId: '', email: '', groupId: '' });
  const timerRef = React.useRef(null);
  const initializedRef = React.useRef(false);
  const currentOwnerRef = React.useRef(null);
  const syncQueueRef=React.useRef(Promise.resolve());
  const lastNetworkRef=React.useRef(0);
  const runSerialized=React.useCallback(job=>{
    const next=syncQueueRef.current.then(job,job);
    syncQueueRef.current=next.catch(()=>{});
    return next;
  },[]);

  const account = session?.user ? {
    id: session.user.id,
    email: session.user.email || '',
    name: profile?.display_name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Jogador',
    avatar: profile?.avatar_url || session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
  } : null;

  const isAdmin = String(account?.email || '').trim().toLowerCase() === 'nickreisgg55@gmail.com';

  const pendingInbox = inbox.filter(item => item.status === 'pending');
  const argUnlocked=achievements.some(x=>String(x.achievement_id||'').toLowerCase()==='rz-88');
  const achievementKey='pjlite_achievements_on_v1_'+(account?.id||'anonymous');
  React.useEffect(()=>{if(!account){setAchievements([]);return;}let active=true;
   try{setAchievementsOn(localStorage.getItem(achievementKey)!=='0')}catch{setAchievementsOn(true)}
   getMyAchievements().then(rows=>{if(active)setAchievements(rows||[])}).catch(err=>console.error('Conta Lite: conquistas',err));
   return()=>{active=false};
  },[account?.id]);
  const toggleAchievements=next=>{
   setAchievementsOn(next);
   try{localStorage.setItem(achievementKey,next?'1':'0')}catch{}
   // Mantenha a mesma preferência em Jornadas, na Home e em outras abas.
   window.dispatchEvent(new CustomEvent('pjlite:achievements-visibility',{detail:{enabled:next}}));
  };
  const allSheets = [
    ...savedChars.map(item => ({ key: 'pc:' + item.id, item })),
    ...savedThreats.map(item => ({ key: 'threat:' + item.id, item })),
  ];

  const refreshSocial = React.useCallback(async () => {
    if (!session?.user) {
      setGroups([]);
      setInbox([]);
      return;
    }
    try {
      const [nextGroups, nextInbox] = await Promise.all([listGroups(), listInbox()]);
      window.dispatchEvent(new CustomEvent('pjlite:jornadas-changed'));
      setGroups(nextGroups || []);
      setInbox(nextInbox || []);
    } catch (error) {
      console.error('Conta Lite: falha ao atualizar grupos/recebidos', error);
    }
  }, [session?.user?.id]);

  const flushDeletions = React.useCallback(async()=>{
    const ownerId=session?.user?.id;
    if(!ownerId)return 0;
    const pending=getPendingSheetDeletions(ownerId);
    if(!pending.length)return 0;
    const count=await deleteRemoteSheets(pending);
    clearPendingSheetDeletions(ownerId,pending);
    return count;
  },[session?.user?.id]);

  const readCurrentLocal=()=>{
    const safe=(key,fallback)=>{try{const data=JSON.parse(localStorage.getItem(key)||'null');return Array.isArray(data)?data:fallback}catch{return fallback}};
    return [safe(STORAGE_KEY,savedChars),safe(THREAT_STORAGE_KEY,savedThreats)];
  };

  const syncNow=React.useCallback(async(silent=false,exact=false)=>{
    const ownerId=session?.user?.id;
    if(!ownerId)return false;
    return runSerialized(async()=>{
      if(currentOwnerRef.current!==ownerId)return false;
      setStatus('syncing');
      try{
        // Não enviar automaticamente fichas locais de outra conta à nuvem.
        const lastOwner=getLastCloudOwner();
        if(lastOwner&&lastOwner!==ownerId)throw new Error('cloud_owner_mismatch');
        rememberCloudOwner(ownerId);
        const queuedDeletedCount=await flushDeletions();
        const remoteDeleted=await fetchDeletedSheetIds();
        const blocked=[...remoteDeleted,...getPendingSheetDeletions(ownerId)];
        let rows=[];
        let deletedCount=queuedDeletedCount;
        if(exact){
          // Só o comando com confirmação explícita pode excluir fichas que
          // existam somente na nuvem; nunca usar mirror no login automático.
          const [nowChars,nowThreats]=readCurrentLocal();
          const result=await mirrorSheets(
            filterSheetsByIds(nowChars,blocked),
            filterSheetsByIds(nowThreats,blocked));
          rows=result?.rows||[];
          deletedCount+=Number(result?.deletedCount||0);
        }else{
          // Reconciliar em ambas as direções a cada salvamento e ao recuperar foco.
          const before=await pullSheets();
          if(currentOwnerRef.current!==ownerId)return false;
          const [nowChars,nowThreats]=readCurrentLocal();
          const mergedChars=mergeSheetsByRevision(nowChars,before.filter(r=>r.sheet_type==='pc'),blocked);
          const mergedThreats=mergeSheetsByRevision(nowThreats,before.filter(r=>r.sheet_type!=='pc'),blocked);
          // Atualizar state somente quando algo realmente mudou.
          if(!sameSheetList(nowChars,mergedChars)){
            localStorage.setItem(STORAGE_KEY,JSON.stringify(mergedChars));
            setSavedChars(mergedChars);
          }
          if(!sameSheetList(nowThreats,mergedThreats)){
            localStorage.setItem(THREAT_STORAGE_KEY,JSON.stringify(mergedThreats));
            setSavedThreats(mergedThreats);
          }
          await pushSheets(mergedChars,mergedThreats);
          rows=await pullSheets();
          // Uma edição pode ser salva DURANTE a chamada de rede. Reler dados
          // atuais antes de gravar o resultado, evitando perda dessa edição.
          if(currentOwnerRef.current!==ownerId)return false;
          const [latestChars,latestThreats]=readCurrentLocal();
          const finalChars=mergeSheetsByRevision(latestChars,rows.filter(r=>r.sheet_type==='pc'),blocked);
          const finalThreats=mergeSheetsByRevision(latestThreats,rows.filter(r=>r.sheet_type!=='pc'),blocked);
          if(!sameSheetList(latestChars,finalChars)){
            localStorage.setItem(STORAGE_KEY,JSON.stringify(finalChars));
            setSavedChars(finalChars);
          }
          if(!sameSheetList(latestThreats,finalThreats)){
            localStorage.setItem(THREAT_STORAGE_KEY,JSON.stringify(finalThreats));
            setSavedThreats(finalThreats);
          }
        }
        if(currentOwnerRef.current!==ownerId)return false;
        setRemoteCount(rows.length);
        const now=new Date().toISOString();
        setLastSync(now);
        lastNetworkRef.current=Date.now();
        setStatus('synced');
        initializedRef.current=true;
        if(!silent){
          if(deletedCount)showToast('☁️ '+deletedCount+' exclusão(ões) confirmada(s) na nuvem.');
          else showToast(exact?'☁️ Nuvem atualizada conforme suas fichas deste dispositivo.':'☁️ Todas as fichas verificadas e sincronizadas.');
        }
        return true;
      }catch(error){
        console.error('Conta Lite: falha ao reconciliar fichas',error);
        if(currentOwnerRef.current===ownerId)setStatus('error');
        if(!silent)showToast(error?.message==='cloud_owner_mismatch'
          ?'Outra Conta Lite foi usada neste dispositivo. Faça backup antes de trocar de conta para não misturar fichas.'
          :'Falha ao sincronizar fichas; as alterações locais foram preservadas. Tente novamente.');
        return false;
      }
    });
  },[session?.user?.id,savedChars,savedThreats,showToast,flushDeletions,runSerialized,setSavedChars,setSavedThreats]);

  const pullAndMerge=React.useCallback(async(silent=false)=>syncNow(silent,false),[syncNow]);

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('openAccount') === '1') { setOpen(true); if (['chat','groups','inbox','sync'].includes(params.get('accountTab')))setTab(params.get('accountTab')); }
    } catch {}
  }, []);

  React.useEffect(() => {
    if (!session?.user) return;
    let returnTo = '';
    try { returnTo = String(localStorage.getItem('pjlite_auth_return_v1') || ''); } catch {}
    if (!returnTo || !returnTo.startsWith('/')) return;
    try { localStorage.removeItem('pjlite_auth_return_v1'); } catch {}
    const timer = setTimeout(() => window.location.replace(returnTo), 220);
    return () => clearTimeout(timer);
  }, [session?.user?.id]);

  React.useEffect(() => {
    let active = true;
    const updateSession=next=>{
      if(!active)return;
      const nextId=next?.user?.id||null;
      // TOKEN_REFRESHED não é troca de conta. Não desligar a sincronização.
      if(currentOwnerRef.current!==nextId)initializedRef.current=false;
      currentOwnerRef.current=nextId;
      setSession(next);
    };
    getSession().then(updateSession).catch(error => console.error('Conta Lite: sessão', error));
    const unsubscribe = onAuthStateChange(updateSession);
    return () => { active = false; unsubscribe?.(); };
  }, []);

  React.useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setRemoteCount(0);
      setLastSync('');
      setStatus('idle');
      return;
    }
    let active = true;
    (async () => {
      try {
        const nextProfile = await getProfile();
        if (active) setProfile(nextProfile);
        await refreshSocial();
        if (!initializedRef.current) {
          // Uma única reconciliação não destrutiva no login. Não assumir
          // sucesso quando houve erro de rede ou permissão.
          const worked=await syncNow(true,false);
          if(active&&worked)initializedRef.current=true;
        }
      } catch (error) {
        console.error('Conta Lite: inicialização', error);
        if (active) setStatus('error');
      }
    })();
    return () => { active = false; };
  }, [session?.user?.id]);

  React.useEffect(() => {
    if (!session?.user || !initializedRef.current) return;
    setStatus('pending');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => syncNow(true,false), 1200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [savedChars, savedThreats, session?.user?.id]);

  React.useEffect(()=>{
    if(!session?.user)return;
    const refresh=()=>{
      if(document.visibilityState==='hidden')return;
      if(Date.now()-lastNetworkRef.current<15000)return;
      void syncNow(true,false);
    };
    window.addEventListener('focus',refresh);
    document.addEventListener('visibilitychange',refresh);
    const interval=window.setInterval(refresh,60000);
    return ()=>{
      window.removeEventListener('focus',refresh);
      document.removeEventListener('visibilitychange',refresh);
      window.clearInterval(interval);
    };
  },[session?.user?.id,syncNow]);

  const handleGoogle = async () => {
    try { await signInWithGoogle(); }
    catch (error) {
      console.error('Conta Lite: Google OAuth', error);
      showToast(error?.message?.includes('provider') ? 'Login Google ainda precisa ser ativado no Supabase.' : 'Não foi possível abrir o login Google.');
    }
  };

  const handleEmail = async () => {
    const email = String(emailDraft || '').trim().toLowerCase();
    if (!email.includes('@')) return showToast('Digite um e-mail válido.');
    try {
      await signInWithOtp(email);
      showToast('✉️ Link de acesso enviado para o seu e-mail.');
      setEmailDraft('');
    } catch (error) {
      console.error('Conta Lite: magic link', error);
      showToast('Não foi possível enviar o link de acesso.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setSession(null);
      setOpen(false);
      showToast('Conta Lite desconectada. Suas fichas locais foram mantidas.');
    } catch (error) {
      console.error('Conta Lite: logout', error);
      showToast('Não foi possível sair da Conta Lite.');
    }
  };

  const toggleDm=async(group)=>{
    try{
      await setGroupMaster(group.id,!group.is_dm);
      await refreshSocial();
      showToast(group.is_dm?'Modo DM desativado.':'Modo DM ativado. Este grupo pode criar Jornadas.');
    }catch(error){console.error('Modo DM:',error);showToast('Não foi possível modificar o modo DM.');}
  };

    const handleCreateGroup = async () => {
    if (!groupName.trim()) return showToast('Dê um nome ao grupo.');
    try {
      const group = await createGroup(groupName);
      if(createAsDm)await setGroupMaster(group.id,true);
      setGroupName('');
      setCreateAsDm(false);
      await refreshSocial();
      showToast('Grupo criado. Código: ' + group.invite_code);
    } catch (error) {
      console.error('Conta Lite: criar grupo', error);
      showToast('Não foi possível criar o grupo.');
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) return showToast('Digite o código do grupo.');
    try {
      const joined = await joinGroupByCode(inviteCode);
      setInviteCode('');
      await refreshSocial();
      showToast('✓ Você entrou em ' + (joined?.group_name || 'um grupo') + '.');
    } catch (error) {
      console.error('Conta Lite: entrar no grupo', error);
      showToast('Código inválido ou grupo indisponível.');
    }
  };

  const handleRotate = async group => {
    if (!window.confirm('Gerar um novo código? O código anterior deixará de funcionar.')) return;
    try {
      const code = await rotateGroupCode(group.id);
      await refreshSocial();
      showToast('Novo código: ' + code);
    } catch (error) {
      console.error('Conta Lite: novo código', error);
      showToast('Não foi possível gerar um novo código.');
    }
  };

  const handleDeleteGroup = async group => {
    if (!window.confirm('Remover este grupo?')) return;
    try {
      await deleteGroup(group.id);
      await refreshSocial();
      showToast('Grupo removido.');
    } catch (error) {
      console.error('Conta Lite: excluir grupo', error);
      showToast('Não foi possível remover o grupo.');
    }
  };

  const handleShare = async () => {
    const entry = allSheets.find(x => x.key === shareDraft.sheetId);
    if (!entry) return showToast('Escolha uma ficha.');
    try {
      await syncNow(true);
      if (shareDraft.groupId) {
        const count = await shareSheetToGroup(entry.item.id, shareDraft.groupId);
        showToast('📨 Ficha enviada para ' + count + (count === 1 ? ' pessoa.' : ' pessoas.'));
      } else {
        if (!String(shareDraft.email).includes('@')) return showToast('Informe o e-mail do destinatário.');
        await shareSheetToEmail(entry.item.id, shareDraft.email);
        showToast('📨 Ficha compartilhada.');
      }
      setShareDraft(v => ({ ...v, email: '' }));
      await refreshSocial();
    } catch (error) {
      console.error('Conta Lite: compartilhar', error);
      if (String(error?.message || '').includes('recipient_not_found')) showToast('Essa pessoa ainda não possui uma Conta Lite.');
      else showToast('Não foi possível compartilhar a ficha.');
    }
  };

  const handleImport = async packet => {
    try {
      const source = JSON.parse(JSON.stringify(packet.payload || {}));
      const now = new Date().toISOString();
      source.id = 'shared-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
      source.meta = { ...(source.meta || {}), createdAt: now, updatedAt: now, sharedFrom: packet.sender_id || '' };
      if (packet.sheet_type === 'pc') {
        const next = [...savedChars, source];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setSavedChars(next);
      } else {
        const next = [...savedThreats, source];
        localStorage.setItem(THREAT_STORAGE_KEY, JSON.stringify(next));
        setSavedThreats(next);
      }
      await markShareImported(packet.id);
      await refreshSocial();
      showToast('✓ Ficha incluída nas suas fichas.');
    } catch (error) {
      console.error('Conta Lite: importar recebida', error);
      showToast('Não foi possível incluir a ficha.');
    }
  };

  const handleDismiss = async packet => {
    try {
      await dismissShare(packet.id);
      await refreshSocial();
      showToast('Compartilhamento descartado.');
    } catch (error) {
      console.error('Conta Lite: descartar recebida', error);
      showToast('Não foi possível descartar o compartilhamento.');
    }
  };

  if (!isSupabaseConfigured) return null;

  return <>
    {!!account&&achievements.length>0&&<button type="button" className={'pjlite-achievement-corner '+(achievementsOn?'is-full':'is-minimal')+(achievements.some(x=>x.category==='EVENTO'||String(x.achievement_id).toLowerCase()==='rz-88')?' has-event':'')} title="Suas conquistas — abrir Recebidos" onClick={()=>{setOpen(true);setTab('inbox')}} aria-label="Abrir conquistas e recebidos">
      <span className="pjlite-achievement-emblem" aria-hidden="true">{achievementsOn?'◆':'🐱'}</span>{achievementsOn&&<span className="pjlite-achievement-corner-text"><strong>CONQUISTAS</strong><small>{achievements.length} {achievements.length===1?'desbloqueada':'desbloqueadas'}</small></span>}
    </button>}
    <div className="pjlite-cloud-compact no-print">
      <button type="button" className="pjlite-cloud-compact__button" onClick={()=>setOpen(true)} title="Conta e sincronização">
        <span className={'pjlite-cloud-compact__dot '+(account?(status==='error'?'is-error':status==='syncing'||status==='pending'?'is-working':'is-online'):'')}></span>
        <span className="pjlite-cloud-compact__icon">☁</span>
        <span className="pjlite-cloud-compact__label">Conta & Nuvem</span>
        {pendingInbox.length>0&&<span className="pjlite-cloud-notification">{pendingInbox.length}</span>}
        <small>{account?(status==='syncing'?'Sincronizando…':status==='pending'?'Pendente':status==='error'?'Erro':'Ativa'):'Opcional'}</small>
      </button>
    </div>

    {open&&<div className="pjlite-cloud-settings-shell no-print" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
      <section className="pjlite-cloud-settings" role="dialog" aria-modal="true" aria-label="Conta e Nuvem">
        <header className="pjlite-cloud-settings__header">
          <div><span className="pjlite-cloud-settings__eyebrow">CONTA LITE</span><h2>Conta & Nuvem</h2></div>
          <button type="button" className="pjlite-cloud-settings__close" onClick={()=>setOpen(false)} aria-label="Fechar">×</button>
        </header>
        <div className="pjlite-cloud-settings__tabs">
          <button type="button" className={tab==='sync'?'active':''} onClick={()=>setTab('sync')}>☁ Sincronização</button>
          <button type="button" className={tab==='groups'?'active':''} onClick={()=>setTab('groups')}>♟ Grupos</button>
          <button type="button" className={tab==='chat'?'active':''} onClick={()=>setTab('chat')}>💬 Chat</button>
          <button type="button" className={tab==='inbox'?'active':''} onClick={()=>setTab('inbox')}>✉ Recebidos {pendingInbox.length>0&&<span className="pjlite-cloud-tab-badge">{pendingInbox.length}</span>}</button>
          {isAdmin&&<button type="button" className={tab==='admin'?'active':''} onClick={()=>setTab('admin')}>⚙ Administração</button>}
        </div>
        <div className="pjlite-cloud-settings__content">
          {!account ? <>
            <div className="pjlite-cloud-settings__intro"><span className="pjlite-cloud-settings__mark">☁</span><div><strong>Conta Lite real</strong><p>Suas fichas continuam locais, mas ao entrar elas também poderão ser sincronizadas entre dispositivos pelo Supabase.</p></div></div>
            <button type="button" className="pjlite-cloud-google pjlite-cloud-google--wide" onClick={handleGoogle}><span>G</span> Continuar com Google</button>
            <div className="pjlite-cloud-settings__group"><h3>Entrar por e-mail</h3><p>Use o e-mail da sua Conta Lite para sincronizar suas fichas e grupos.</p><div className="pjlite-cloud-form-stack"><label><span>E-mail</span><input type="email" value={emailDraft} onChange={e=>setEmailDraft(e.target.value)} placeholder="voce@gmail.com" onKeyDown={e=>{if(e.key==='Enter')handleEmail()}}/></label><button type="button" className="secondary" onClick={handleEmail}>Enviar link de acesso</button></div></div>
            <div className="pjlite-cloud-settings__hint">Para experimentar as Jornadas sem login, abra a página 🧭 Jornadas no menu principal do PJ Lite.</div>
          </> : tab==='sync' ? <>
            <div className="pjlite-cloud-settings__account">
              <div className="pjlite-cloud-avatar">{account.avatar?<img src={account.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>:String(account.name||account.email||'?').charAt(0).toUpperCase()}</div>
              <div className="min-w-0"><strong>{account.name}</strong><small>{account.email}</small></div>
              <span className={'pjlite-cloud-state pjlite-cloud-state--'+status}>{status==='syncing'?'Sincronizando…':status==='pending'?'Alterações pendentes':status==='error'?'Erro':'☁ Sincronizado'}</span>
            </div>
            <div className="pjlite-cloud-settings__stats"><div><span>Neste dispositivo</span><strong>{savedChars.length+savedThreats.length}</strong><small>fichas</small></div><div><span>Nuvem real</span><strong>{remoteCount}</strong><small>fichas</small></div><div><span>Última sincronização</span><strong>{lastSync?new Date(lastSync).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'—'}</strong><small>{lastSync?new Date(lastSync).toLocaleDateString('pt-BR'):'Ainda não'}</small></div></div>
            <div className="pjlite-cloud-settings__group"><h3>Sincronização</h3><p><strong>Excluir na Home</strong> registra uma remoção pendente: quando houver conexão, a Conta Lite a aplica também na nuvem, sem recriar a ficha ao mesclar. <strong>Sincronizar agora</strong> faz a nuvem refletir exatamente as fichas deste dispositivo e pode remover outras fichas antigas da nuvem mediante confirmação. <strong>Mesclar da nuvem</strong> reúne suas fichas restantes sem restaurar exclusões pendentes. Se a exclusão tiver falhado, uma nova sincronização tenta novamente.</p><div className="pjlite-cloud-actions"><button type="button" onClick={()=>{if(window.confirm('Sincronizar agora fará a nuvem ficar igual às fichas deste dispositivo. Fichas que existirem apenas na nuvem serão removidas. Continuar?'))syncNow(false,true)}}>☁ Sincronizar agora</button><button type="button" onClick={()=>pullAndMerge(false)}>↧ Mesclar da nuvem</button></div></div>
            <div className="pjlite-cloud-settings__group"><h3>🏆 Conquistas</h3><p>Em ON, suas conquistas aparecem na tela. Em OFF, o selo é substituído apenas pelo gatinho 🐱 no mesmo canto, sem nomes ou notificações. A conquista continua na sua conta.</p><label className="pjlite-cloud-achievement-switch"><input type="checkbox" checked={achievementsOn} onChange={e=>toggleAchievements(e.target.checked)}/> <strong>{achievementsOn?'ON • visual completo':'OFF • somente gatinho 🐱'}</strong></label>{achievementsOn&&<div className="pjlite-cloud-achievement-list">{achievements.map(tag=><span key={tag.achievement_id} className={tag.category==='EVENTO'?'is-event':''}>◆ {visibleAchievement(tag)}</span>)}</div>}</div>
            <div className="pjlite-cloud-settings__group pjlite-cloud-settings__group--quiet"><h3>Conversas dos grupos</h3><p>O chat das campanhas também fica na aba <strong>💬 Chat</strong> da Conta Lite. Cada grupo tem sua própria conversa privada.</p><button type="button" onClick={()=>setTab('chat')}>💬 Abrir Chat</button></div>
            <div className="pjlite-cloud-settings__group pjlite-cloud-settings__group--quiet"><h3>Conta</h3><div className="pjlite-cloud-actions"><button type="button" className="secondary" onClick={handleLogout}>Sair da Conta Lite</button></div></div>
          </> : tab==='chat' ? <AccountChatPanel account={account} showToast={showToast} /> : tab==='groups' ? <>
            <div className="pjlite-cloud-settings__group"><h3>Compartilhar ficha</h3><p>Envie uma cópia para uma pessoa que já tenha Conta Lite ou para um grupo inteiro.</p><div className="pjlite-cloud-form-stack"><label><span>Ficha</span><select value={shareDraft.sheetId} onChange={e=>setShareDraft(v=>({...v,sheetId:e.target.value}))}><option value="">Escolha uma ficha…</option>{allSheets.map(entry=><option key={entry.key} value={entry.key}>{sheetName(entry.item)} • {systemName(entry.item)}</option>)}</select></label><div className="pjlite-cloud-form-split"><label><span>Grupo</span><select value={shareDraft.groupId} onChange={e=>setShareDraft(v=>({...v,groupId:e.target.value,email:e.target.value?'':v.email}))}><option value="">Nenhum grupo</option>{groups.map(group=><option key={group.id} value={group.id}>{group.name} ({group.members?.length||0})</option>)}</select></label><label><span>Ou enviar para</span><input type="email" disabled={!!shareDraft.groupId} value={shareDraft.email} onChange={e=>setShareDraft(v=>({...v,email:e.target.value,groupId:''}))} placeholder="jogador@gmail.com"/></label></div><button type="button" className="pjlite-cloud-primary" onClick={handleShare}>Enviar cópia da ficha</button></div></div>
            <div className="pjlite-cloud-settings__group"><h3>Entrar em um grupo</h3><p>Digite o código recebido do mestre ou de outro jogador.</p><div className="pjlite-cloud-invite-join"><input value={inviteCode} onChange={e=>setInviteCode(e.target.value.toUpperCase())} placeholder="LITE-XXXXXX" maxLength={11}/><button type="button" className="pjlite-cloud-primary" onClick={handleJoin}>Entrar</button></div></div>
            <div className="pjlite-cloud-settings__group"><h3>Meus grupos</h3><div className="pjlite-cloud-form-stack"><label><span>Nome do grupo</span><input value={groupName} onChange={e=>setGroupName(e.target.value)} placeholder="Ex.: Mesa de sexta"/></label><label className="pjlite-cloud-achievement-switch"><input type="checkbox" checked={createAsDm} onChange={e=>setCreateAsDm(e.target.checked)}/><strong>DM — este grupo terá um mestre e poderá criar Jornadas</strong></label><button type="button" className="secondary" onClick={handleCreateGroup}>+ Criar grupo</button></div><div className="pjlite-cloud-groups-list">{groups.length===0?<div className="pjlite-cloud-empty">Nenhum grupo ainda.</div>:groups.map(group=><article key={group.id} className="pjlite-cloud-group-card"><div className="pjlite-cloud-group-card__head"><div><strong>{group.name}</strong><span>{group.isOwner?'Você criou este grupo':'Você participa deste grupo'} {group.is_dm?'• 🎲 DM':''}</span></div><small>{group.members?.length||0} {(group.members?.length||0)===1?'membro':'membros'}</small></div><div className="pjlite-cloud-group-members"><div className="pjlite-cloud-group-members__title"><span>PERFIS DO GRUPO</span><small>Conquistas públicas da Conta Lite</small></div><div className="pjlite-cloud-group-members__grid">{(group.members||[]).map(member=><GroupMemberProfile key={member.userId||member.user_id} member={member} currentUserId={account?.id}/>)}</div></div><div className="pjlite-cloud-invite"><div><span>Código de convite</span><code>{group.invite_code}</code></div><div className="pjlite-cloud-invite-actions"><button type="button" onClick={()=>navigator.clipboard?.writeText(group.invite_code).then(()=>showToast('Código copiado.'))}>Copiar</button>{group.isOwner&&<button type="button" onClick={()=>handleRotate(group)}>↻ Novo código</button>}</div></div><div className="pjlite-cloud-group-master-actions">{group.isOwner&&<button type="button" className="secondary" onClick={()=>toggleDm(group)}>{group.is_dm?'✓ DM ativo • Desativar':'🎲 Ativar DM'}</button>}{group.is_dm&&<a href="/?jornadas=1" className="pjlite-cloud-primary" style={{display:'inline-flex',alignItems:'center',textDecoration:'none'}}>🧭 Abrir Jornadas ↗</a>}{group.isOwner&&<button type="button" className="pjlite-cloud-icon-action" onClick={()=>handleDeleteGroup(group)} title="Remover grupo">×</button>}</div></article>)}</div></div>
          </> : tab==='admin'&&isAdmin ? <AdminCloudPanel account={account} showToast={showToast} /> : <>
            {argUnlocked&&<div className="pjlite-cloud-settings__group pjlite-cloud-arg-material"><h3>◆ Recompensa — Rota Zero</h3><p>Acesse os materiais do projeto Rota Zero disponíveis no Google Drive. O acesso depende das permissões da pasta.</p><a className="pjlite-cloud-primary" href={ROTA_ZERO_DRIVE_URL} target="_blank" rel="noopener noreferrer" aria-label="Abrir pasta Rota Zero no Google Drive">📁 Abrir Rota Zero no Drive ↗</a></div>}
            <div className="pjlite-cloud-settings__group"><h3>Fichas recebidas</h3><p>As fichas compartilhadas aparecem aqui antes de serem incluídas na sua biblioteca.</p><div className="pjlite-cloud-inbox">{pendingInbox.length===0?<div className="pjlite-cloud-empty"><strong>Nenhuma ficha nova.</strong><span>Novos compartilhamentos aparecerão aqui.</span></div>:pendingInbox.map(packet=><article key={packet.id} className="pjlite-cloud-inbox-card is-new"><div className="pjlite-cloud-inbox-icon">✉</div><div className="pjlite-cloud-inbox-main"><strong>{packet.name||sheetName(packet.payload)}</strong><span>{packet.system||systemName(packet.payload)}</span><small>Recebida em {new Date(packet.sent_at).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}</small><div className="pjlite-cloud-inbox-actions"><button type="button" className="pjlite-cloud-primary" onClick={()=>handleImport(packet)}>Incluir nas fichas</button><button type="button" className="secondary" onClick={()=>handleDismiss(packet)}>Descartar</button></div></div></article>)}</div></div>
          </>}
        </div>
      </section>
    </div>}
  </>;
}
