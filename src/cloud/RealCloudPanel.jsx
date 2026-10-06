import * as React from 'react';
import {
  isSupabaseConfigured,
  getSession,
  signInWithGoogle,
  signInWithOtp,
  signOut,
  onAuthStateChange,
  getProfile,
  pushSheets,
  pullSheets,
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

const STORAGE_KEY = 'dragonbane_saved_characters';
const THREAT_STORAGE_KEY = 'dragonbane_saved_threats';

const stamp = item => {
  const raw = item?.meta?.updatedAt || item?.updatedAt || item?.meta?.createdAt || '';
  const value = Date.parse(raw);
  return Number.isFinite(value) ? value : 0;
};

const mergeById = (local = [], remoteRows = []) => {
  const map = new Map();
  for (const item of Array.isArray(local) ? local : []) if (item?.id) map.set(item.id, item);
  for (const row of Array.isArray(remoteRows) ? remoteRows : []) {
    const item = row?.payload;
    if (!item?.id) continue;
    const current = map.get(item.id);
    if (!current || stamp(item) >= stamp(current)) map.set(item.id, item);
  }
  return Array.from(map.values());
};

const sheetName = item => String(item?.bio?.nome || item?.nome || item?.name || 'Ficha sem nome').trim() || 'Ficha sem nome';
const systemName = item => String(item?.system || 'RPG').replace('dnd5e', 'D&D 5.5e').replace('fabulaUltima', 'Fabula Ultima').replace('3det', '3DeT Victory');

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
  const [inviteCode, setInviteCode] = React.useState('');
  const [shareDraft, setShareDraft] = React.useState({ sheetId: '', email: '', groupId: '' });
  const timerRef = React.useRef(null);
  const initializedRef = React.useRef(false);

  const account = session?.user ? {
    id: session.user.id,
    email: session.user.email || '',
    name: profile?.display_name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Jogador',
    avatar: profile?.avatar_url || session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '',
  } : null;

  const isAdmin = String(account?.email || '').trim().toLowerCase() === 'nickreisgg55@gmail.com';

  const pendingInbox = inbox.filter(item => item.status === 'pending');
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
      setGroups(nextGroups || []);
      setInbox(nextInbox || []);
    } catch (error) {
      console.error('Conta Lite: falha ao atualizar grupos/recebidos', error);
    }
  }, [session?.user?.id]);

  const pullAndMerge = React.useCallback(async (silent = false) => {
    if (!session?.user) return;
    setStatus('syncing');
    try {
      const rows = await pullSheets();
      const remoteChars = rows.filter(row => row.sheet_type === 'pc');
      const remoteThreats = rows.filter(row => row.sheet_type !== 'pc');
      const chars = mergeById(savedChars, remoteChars);
      const threats = mergeById(savedThreats, remoteThreats);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
      localStorage.setItem(THREAT_STORAGE_KEY, JSON.stringify(threats));
      setSavedChars(chars);
      setSavedThreats(threats);
      setRemoteCount(rows.length);
      const now = new Date().toISOString();
      setLastSync(now);
      setStatus('synced');
      if (!silent) showToast('☁️ Fichas da nuvem foram mescladas neste dispositivo.');
    } catch (error) {
      console.error('Conta Lite: falha ao baixar fichas', error);
      setStatus('error');
      if (!silent) showToast('Não foi possível baixar as fichas da nuvem.');
    }
  }, [session?.user?.id, savedChars, savedThreats, setSavedChars, setSavedThreats, showToast]);

  const syncNow = React.useCallback(async (silent = false) => {
    if (!session?.user) return;
    setStatus('syncing');
    try {
      await pushSheets(savedChars, savedThreats);
      const rows = await pullSheets();
      setRemoteCount(rows.length);
      const now = new Date().toISOString();
      setLastSync(now);
      setStatus('synced');
      if (!silent) showToast('☁️ Conta Lite sincronizada com o Supabase.');
    } catch (error) {
      console.error('Conta Lite: falha ao sincronizar', error);
      setStatus('error');
      if (!silent) showToast('Não foi possível sincronizar a Conta Lite.');
    }
  }, [session?.user?.id, savedChars, savedThreats, showToast]);

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('openAccount') === '1') setOpen(true);
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
    getSession().then(next => { if (active) setSession(next); }).catch(error => console.error('Conta Lite: sessão', error));
    const unsubscribe = onAuthStateChange(next => {
      if (!active) return;
      setSession(next);
      initializedRef.current = false;
    });
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
          initializedRef.current = true;
          await pullAndMerge(true);
          await syncNow(true);
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
    timerRef.current = setTimeout(() => syncNow(true), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [savedChars, savedThreats, session?.user?.id]);

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

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return showToast('Dê um nome ao grupo.');
    try {
      const group = await createGroup(groupName);
      setGroupName('');
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
          <button type="button" className={tab==='inbox'?'active':''} onClick={()=>setTab('inbox')}>✉ Recebidos {pendingInbox.length>0&&<span className="pjlite-cloud-tab-badge">{pendingInbox.length}</span>}</button>
          {isAdmin&&<button type="button" className={tab==='admin'?'active':''} onClick={()=>setTab('admin')}>⚙ Administração</button>}
        </div>
        <div className="pjlite-cloud-settings__content">
          {!account ? <>
            <div className="pjlite-cloud-settings__intro"><span className="pjlite-cloud-settings__mark">☁</span><div><strong>Conta Lite real</strong><p>Suas fichas continuam locais, mas ao entrar elas também poderão ser sincronizadas entre dispositivos pelo Supabase.</p></div></div>
            <button type="button" className="pjlite-cloud-google pjlite-cloud-google--wide" onClick={handleGoogle}><span>G</span> Continuar com Google</button>
            <div className="pjlite-cloud-settings__group"><h3>Ou entrar por e-mail</h3><p>Útil para testar a nuvem antes de terminarmos a configuração do Google.</p><div className="pjlite-cloud-form-stack"><label><span>E-mail</span><input type="email" value={emailDraft} onChange={e=>setEmailDraft(e.target.value)} placeholder="voce@gmail.com" onKeyDown={e=>{if(e.key==='Enter')handleEmail()}}/></label><button type="button" className="secondary" onClick={handleEmail}>Enviar link de acesso</button></div></div>
            <div className="pjlite-cloud-settings__hint">Agora esta área usa o projeto real PJ Lite Cloud. A autenticação por Google ficará disponível assim que o provedor OAuth for habilitado.</div>
          </> : tab==='sync' ? <>
            <div className="pjlite-cloud-settings__account">
              <div className="pjlite-cloud-avatar">{account.avatar?<img src={account.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>:String(account.name||account.email||'?').charAt(0).toUpperCase()}</div>
              <div className="min-w-0"><strong>{account.name}</strong><small>{account.email}</small></div>
              <span className={'pjlite-cloud-state pjlite-cloud-state--'+status}>{status==='syncing'?'Sincronizando…':status==='pending'?'Alterações pendentes':status==='error'?'Erro':'☁ Sincronizado'}</span>
            </div>
            <div className="pjlite-cloud-settings__stats"><div><span>Neste dispositivo</span><strong>{savedChars.length+savedThreats.length}</strong><small>fichas</small></div><div><span>Nuvem real</span><strong>{remoteCount}</strong><small>fichas</small></div><div><span>Última sincronização</span><strong>{lastSync?new Date(lastSync).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'—'}</strong><small>{lastSync?new Date(lastSync).toLocaleDateString('pt-BR'):'Ainda não'}</small></div></div>
            <div className="pjlite-cloud-settings__group"><h3>Sincronização</h3><p>O autosave local continua funcionando. Quando a conta está conectada, as alterações também são enviadas para o PJ Lite Cloud.</p><div className="pjlite-cloud-actions"><button type="button" onClick={()=>syncNow(false)}>☁ Sincronizar agora</button><button type="button" onClick={()=>pullAndMerge(false)}>↧ Mesclar da nuvem</button></div></div>
            <div className="pjlite-cloud-settings__group pjlite-cloud-settings__group--quiet"><h3>Conta</h3><div className="pjlite-cloud-actions"><button type="button" className="secondary" onClick={handleLogout}>Sair da Conta Lite</button></div></div>
          </> : tab==='groups' ? <>
            <div className="pjlite-cloud-settings__group"><h3>Compartilhar ficha</h3><p>Envie uma cópia para uma pessoa que já tenha Conta Lite ou para um grupo inteiro.</p><div className="pjlite-cloud-form-stack"><label><span>Ficha</span><select value={shareDraft.sheetId} onChange={e=>setShareDraft(v=>({...v,sheetId:e.target.value}))}><option value="">Escolha uma ficha…</option>{allSheets.map(entry=><option key={entry.key} value={entry.key}>{sheetName(entry.item)} • {systemName(entry.item)}</option>)}</select></label><div className="pjlite-cloud-form-split"><label><span>Grupo</span><select value={shareDraft.groupId} onChange={e=>setShareDraft(v=>({...v,groupId:e.target.value,email:e.target.value?'':v.email}))}><option value="">Nenhum grupo</option>{groups.map(group=><option key={group.id} value={group.id}>{group.name} ({group.members?.length||0})</option>)}</select></label><label><span>Ou enviar para</span><input type="email" disabled={!!shareDraft.groupId} value={shareDraft.email} onChange={e=>setShareDraft(v=>({...v,email:e.target.value,groupId:''}))} placeholder="jogador@gmail.com"/></label></div><button type="button" className="pjlite-cloud-primary" onClick={handleShare}>Enviar cópia da ficha</button></div></div>
            <div className="pjlite-cloud-settings__group"><h3>Entrar em um grupo</h3><p>Digite o código recebido do mestre ou de outro jogador.</p><div className="pjlite-cloud-invite-join"><input value={inviteCode} onChange={e=>setInviteCode(e.target.value.toUpperCase())} placeholder="LITE-XXXXXX" maxLength={11}/><button type="button" className="pjlite-cloud-primary" onClick={handleJoin}>Entrar</button></div></div>
            <div className="pjlite-cloud-settings__group"><h3>Meus grupos</h3><div className="pjlite-cloud-form-stack"><label><span>Nome do grupo</span><input value={groupName} onChange={e=>setGroupName(e.target.value)} placeholder="Ex.: Mesa de sexta"/></label><button type="button" className="secondary" onClick={handleCreateGroup}>+ Criar grupo</button></div><div className="pjlite-cloud-groups-list">{groups.length===0?<div className="pjlite-cloud-empty">Nenhum grupo ainda.</div>:groups.map(group=><article key={group.id} className="pjlite-cloud-group-card"><div><strong>{group.name}</strong><small>{group.members?.length||0} {(group.members?.length||0)===1?'membro':'membros'}</small></div><div className="pjlite-cloud-invite"><div><span>Código de convite</span><code>{group.invite_code}</code></div><div className="pjlite-cloud-invite-actions"><button type="button" onClick={()=>navigator.clipboard?.writeText(group.invite_code).then(()=>showToast('Código copiado.'))}>Copiar</button>{group.isOwner&&<button type="button" onClick={()=>handleRotate(group)}>↻ Novo código</button>}</div></div>{group.isOwner&&<button type="button" className="pjlite-cloud-icon-action" onClick={()=>handleDeleteGroup(group)} title="Remover grupo">×</button>}</article>)}</div></div>
          </> : tab==='admin'&&isAdmin ? <AdminCloudPanel account={account} showToast={showToast} /> : <>
            <div className="pjlite-cloud-settings__group"><h3>Fichas recebidas</h3><p>As fichas compartilhadas aparecem aqui antes de serem incluídas na sua biblioteca.</p><div className="pjlite-cloud-inbox">{pendingInbox.length===0?<div className="pjlite-cloud-empty"><strong>Nenhuma ficha nova.</strong><span>Novos compartilhamentos aparecerão aqui.</span></div>:pendingInbox.map(packet=><article key={packet.id} className="pjlite-cloud-inbox-card is-new"><div className="pjlite-cloud-inbox-icon">✉</div><div className="pjlite-cloud-inbox-main"><strong>{packet.name||sheetName(packet.payload)}</strong><span>{packet.system||systemName(packet.payload)}</span><small>Recebida em {new Date(packet.sent_at).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}</small><div className="pjlite-cloud-inbox-actions"><button type="button" className="pjlite-cloud-primary" onClick={()=>handleImport(packet)}>Incluir nas fichas</button><button type="button" className="secondary" onClick={()=>handleDismiss(packet)}>Descartar</button></div></div></article>)}</div></div>
          </>}
        </div>
      </section>
    </div>}
  </>;
}
