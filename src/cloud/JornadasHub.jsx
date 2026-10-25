import * as React from 'react';
import JornadasPanel from './JornadasPanel.jsx';
import AccountChatPanel from './AccountChatPanel.jsx';
import {getSession,onAuthStateChange,getMyAchievements,getProfile,listGroups,createGroup,joinGroupByCode,rotateGroupCode,signInWithGoogle,signInWithOtp,signOut} from './supabaseCloud.js';
import {setGroupMaster} from './jornadasCloud.js';
import './jornadas-hub.css';
import './jornadas-clean.css';
import './jornadas-cris.css';
import './account-achievements.css';
import './jornadas-night.css';


const BG_KEY='pjlite_jornadas_bg_v1';
const SHADE_KEY='pjlite_jornadas_shade_v1';
const THEME_KEY='dragonbane_theme_prefs'; // mesma preferência usada na Home
const HOME_THEME_OPTIONS=[
 ['default','Padrão'],['classic','Clássico DB'],
 ['dnd','Dungeons & Dragons'],['fabula','Fábula Última'],
 ['som6','O Som das Seis'],['dark','Modo Escuro'],
 ['custom','Personalizado']
];
const allowedHomeThemes=new Set([...HOME_THEME_OPTIONS.map(([value])=>value),'rotazero']);
const safeImage=value=>String(value||'').startsWith('data:image/')||(()=>{try{return new URL(value).protocol==='https:'}catch{return false}})();
const compressBackground=file=>new Promise((resolve,reject)=>{
 if(!file||!file.type.startsWith('image/')){reject(new Error('Selecione uma imagem.'));return}
 const object=URL.createObjectURL(file),img=new Image();
 img.onload=()=>{try{const canvas=document.createElement('canvas'),scale=Math.min(1,1440/img.width,960/img.height);canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
 const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);const url=canvas.toDataURL('image/jpeg',0.77);URL.revokeObjectURL(object);resolve(url)}
 catch(e){URL.revokeObjectURL(object);reject(e)}};
 img.onerror=()=>{URL.revokeObjectURL(object);reject(new Error('Não foi possível abrir a imagem.'))};img.src=object;
});

const TABS=['campaigns','groups','chat','account'];
const startTab=()=>{
 try{const t=new URLSearchParams(window.location.search).get('tab');return TABS.includes(t)?t:'campaigns'}catch{return 'campaigns'}
};
export default function JornadasHub(){
 const [tab,setTab]=React.useState(startTab);
 const [session,setSession]=React.useState(null);
 const [profile,setProfile]=React.useState(null);
 const [groups,setGroups]=React.useState([]);
 const [checking,setChecking]=React.useState(true);
 const [loading,setLoading]=React.useState(false);
 const [error,setError]=React.useState('');
 const [notice,setNotice]=React.useState('');
 const [email,setEmail]=React.useState('');
 const [newGroup,setNewGroup]=React.useState('');
 const [invite,setInvite]=React.useState('');
 const [showBg,setShowBg]=React.useState(false);
 const [theme,setTheme]=React.useState(()=>{try{const saved=localStorage.getItem(THEME_KEY)||'default';return allowedHomeThemes.has(saved)?saved:'default'}catch{return 'default'}});
 const [achievements,setAchievements]=React.useState([]);
 const [achievementsOn,setAchievementsOn]=React.useState(true);
 const setJornadasTheme=next=>{
  if(!allowedHomeThemes.has(next))return;
  setTheme(next);try{localStorage.setItem(THEME_KEY,next)}catch{}
 };
 const rotaZeroThemeUnlocked=()=>{try{return localStorage.getItem('pjlite_rz_theme_unlocked_v1')==='1'}catch{return false}};
 const toggleAchievements=enabled=>{setAchievementsOn(enabled);try{if(account?.id)localStorage.setItem('pjlite_achievements_on_v1_'+account.id,enabled?'1':'0')}catch{}window.dispatchEvent(new CustomEvent('pjlite:achievements-visibility',{detail:{enabled}}));};
 const [background,setBackground]=React.useState(()=>{try{return localStorage.getItem(BG_KEY)||''}catch{return ''}});
 const [bgInput,setBgInput]=React.useState('');
 const [shade,setShade]=React.useState(()=>{try{return Number(localStorage.getItem(SHADE_KEY)||'0.22')}catch{return .22}});
 const homeBackground=(()=>{try{return localStorage.getItem('dragonbane_custom_bg')||''}catch{return ''}})();
 const effectiveBackground=background||(theme==='custom'?homeBackground:'');
 const backgroundStyle=effectiveBackground&&safeImage(effectiveBackground)
  ?{backgroundImage:'linear-gradient(rgba(23,38,29,'+shade+'),rgba(23,38,29,'+shade+')),url("'+effectiveBackground.replace(/"/g,'%22')+'")',
    backgroundPosition:'center',backgroundSize:'cover',backgroundAttachment:'fixed'}:{};
 const saveBackground=v=>{try{localStorage.setItem(BG_KEY,v);setBackground(v);setError('')}catch{setError('Imagem grande demais para salvar neste navegador. Tente outra imagem ou use um link HTTPS.')}};
 const setHomeBackground=()=>{try{const v=localStorage.getItem('dragonbane_custom_bg')||'';if(!v){setNotice('Nenhum fundo personalizado salvo na Home.');return}saveBackground(v)}catch{setError('Não foi possível carregar o fundo da Home.')}};
 const uploadBg=async e=>{const file=e.target.files?.[0];if(!file)return;try{const compressed=await compressBackground(file);saveBackground(compressed)}catch(ex){setError(ex.message||'Falha ao enviar o fundo.')}};
 const applyBg=()=>{const next=bgInput.trim();if(!safeImage(next)){setError('Use um link HTTPS válido para a imagem.');return}saveBackground(next);setShowBg(false)};
 
 const account=session?.user?{
  id:session.user.id,email:session.user.email||'',
  name:profile?.display_name||session.user.user_metadata?.full_name||session.user.user_metadata?.name||session.user.email?.split('@')[0]||'Jogador',
  avatar:profile?.avatar_url||session.user.user_metadata?.avatar_url||''
 }:null;
 React.useEffect(()=>{
   if(!account?.id){setAchievements([]);return}
   let active=true;
   const storageKey='pjlite_achievements_on_v1_'+account.id;
   const read=()=>{try{if(active)setAchievementsOn(localStorage.getItem(storageKey)!=='0')}catch{if(active)setAchievementsOn(true)}};
   read();
   getMyAchievements().then(rows=>{if(active)setAchievements(rows||[])}).catch(()=>{if(active)setAchievements([])});
   const changed=event=>{if(!event?.key||event.key===storageKey)read()};
   window.addEventListener('storage',changed);
   window.addEventListener('pjlite:achievements-visibility',read);
   return()=>{active=false;window.removeEventListener('storage',changed);window.removeEventListener('pjlite:achievements-visibility',read)};
 },[account?.id]);
 const navigate=React.useCallback(next=>{
  setTab(next);setError('');setNotice('');
  try{const u=new URL(window.location.href);u.searchParams.set('jornadas','1');u.searchParams.set('tab',next);window.history.replaceState({},'',u.pathname+u.search)}catch{}
  window.scrollTo?.({top:0,behavior:'smooth'});
 },[]);
 React.useEffect(()=>{
  document.body.classList.add('jornadas-standalone');
  document.title='Campanhas — PJ Lite 1.1.0v Alpha';
  return()=>{document.body.classList.remove('jornadas-standalone');document.title='PJ Lite'};
 },[]);
 React.useEffect(()=>{
  let live=true;
  getSession().then(s=>{if(live)setSession(s)}).catch(e=>{if(live)setError(e?.message||'Falha na sessão')}).finally(()=>{if(live)setChecking(false)});
  const dispose=onAuthStateChange(s=>{if(live){setSession(s);setChecking(false)}});
  return()=>{live=false;dispose?.()};
 },[]);
 const refresh=React.useCallback(async()=>{
  if(!session?.user)return;
  const result=await Promise.allSettled([getProfile(),listGroups()]);
  if(result[0].status==='fulfilled')setProfile(result[0].value);
  if(result[1].status==='fulfilled')setGroups(result[1].value||[]);
  else setError(result[1].reason?.message||'Não foi possível carregar os grupos.');
 },[session?.user?.id]);
 React.useEffect(()=>{if(session?.user)refresh();else{setProfile(null);setGroups([])}},[refresh,session?.user?.id]);
 const run=async(action,success)=>{
  if(loading)return;
  setLoading(true);setError('');setNotice('');
  try{await action();if(success)setNotice(success)}
  catch(e){setError(e?.message||'Não foi possível concluir esta ação.')}
  finally{setLoading(false)}
 };
 const loginMail=e=>{e.preventDefault();if(!email.trim().includes('@')){setError('Informe um e-mail válido.');return}
  run(async()=>{await signInWithOtp(email.trim().toLowerCase())},'Enviamos um link de acesso para seu e-mail. Abra-o neste dispositivo.')};
 const loginGoogle=()=>run(async()=>{await signInWithGoogle()});
 const logout=()=>run(async()=>{await signOut();setSession(null);navigate('account')},'Você saiu da Conta Lite.');
 const register=e=>{e.preventDefault();if(!newGroup.trim())return;
  run(async()=>{
   const group=await createGroup(newGroup.trim());
   await setGroupMaster(group.id,true);
   setNewGroup('');await refresh();
   navigate('campaigns');
  },'Seu grupo de mestre está pronto. Crie a primeira campanha abaixo.')};
 const join=e=>{e.preventDefault();if(!invite.trim())return;
  run(async()=>{await joinGroupByCode(invite);setInvite('');await refresh();navigate('campaigns')},'Você entrou no grupo. As campanhas compartilhadas aparecem abaixo.')};
 const rotate=group=>run(async()=>{await rotateGroupCode(group.id);await refresh()},'Novo código de convite criado.');
 const activeContent=tab==='campaigns'?'Minhas campanhas':tab==='groups'?'Grupos e convites':tab==='chat'?'Conversas':'Conta Lite';
 return <main className={'jornadas-site jornadas-clean '+(theme==='dark'?'jornadas-night':'jornadas-classic')+' jornadas-home-theme-'+theme} style={backgroundStyle}>
  <header className="jornadas-site__topbar">
   <a className="jornadas-site__brand" href="/" title="Voltar para o PJLite"><span className="jornadas-site__brandmark">◆</span><span><strong>PJ LITE</strong><small>CAMPANHAS</small></span></a>
   <nav aria-label="Atalhos principais">
    <a className="jornadas-site__home-link" href="/">← Home</a>
    <label className="jornadas-theme-picker">◐ <span>Tema</span>
      <select aria-label="Tema de Campanhas — igual à Home" value={theme}
        onChange={event=>setJornadasTheme(event.target.value)}>
        {HOME_THEME_OPTIONS.map(([value,label])=><option value={value} key={value}>{label}</option>)}
        {rotaZeroThemeUnlocked()&&<option value="rotazero">Rota Zero</option>}
      </select>
    </label>
    <button type="button" onClick={()=>setShowBg(v=>!v)} aria-expanded={showBg}>🖼 Fundo</button>
    <button type="button" className={tab==='account'?'is-active':''} onClick={()=>navigate('account')}>☁ Conta Lite</button>
    <button type="button" className={tab==='chat'?'is-active':''} onClick={()=>navigate('chat')}>💬 Chat</button>
    {account&&<span className="jornadas-site__user" title={account.email}>● {account.name}</span>}
   </nav>
  </header>
  <div className="jornadas-site__layout">
   <aside className="jornadas-site__side" aria-label="Áreas de Campanhas">
    <div className="jornadas-site__side-title">SUAS CAMPANHAS</div>
    <button className={tab==='campaigns'?'is-active':''} onClick={()=>navigate('campaigns')}>🧭 Campanhas</button>
    <button className={tab==='groups'?'is-active':''} onClick={()=>navigate('groups')}>♟ Grupos e convites</button>
    <button className={tab==='chat'?'is-active':''} onClick={()=>navigate('chat')}>💬 Chat</button>
    <button className={tab==='account'?'is-active':''} onClick={()=>navigate('account')}>☁ Conta Lite</button>
    <a className="jornadas-site__sidebar-home" href="/">← Voltar à Home</a>
    <p className="jornadas-clean__sidebar-note">Campanhas reais ficam na Conta Lite e são compartilhadas apenas com membros dos grupos.</p>
   </aside>
   <div className="jornadas-site__content">
    <div className="jornadas-clean__pagehead">
     <div><span className="jornadas-site__eyebrow">PJ LITE · 1.1.0v ALPHA</span><h1>{activeContent}</h1>
      <p>{tab==='campaigns'?'Prepare sua aventura, abra sua mesa e convide jogadores com um código de grupo.':tab==='groups'?'Crie um grupo como mestre ou entre em um grupo usando o convite recebido.':tab==='chat'?'Mensagens das campanhas dos seus grupos em um só lugar.':'Seu perfil, conexão e atalhos de organização.'}</p>
     </div>
     <a href="/" className="jornadas-clean__back">← Voltar à Home</a>
    </div>
    {showBg&&<section className="jornadas-background-options" aria-label="Personalizar fundo de Jornadas">
      <div><h2>🖼 Personalizar plano de fundo</h2><p>Mantenha o tema PJLite e altere somente a imagem de fundo, como na Home.</p></div>
      <div className="jornadas-background-options__row"><label>Imagem por URL HTTPS<input type="url" value={bgInput} onChange={e=>setBgInput(e.target.value)} placeholder="https://.../fundo.jpg"/></label><button type="button" onClick={applyBg}>Aplicar URL</button></div>
      <div className="jornadas-background-options__row"><label>Ou carregar uma imagem do dispositivo<input type="file" accept="image/*" onChange={uploadBg}/></label><button type="button" onClick={setHomeBackground}>Usar fundo da Home</button></div>
      <label>Escurecimento do fundo ({Math.round(shade*100)}%)<input type="range" min="0" max="0.65" step="0.05" value={shade} onChange={e=>{const v=Number(e.target.value);setShade(v);try{localStorage.setItem(SHADE_KEY,String(v))}catch{}}}/></label>
      <div className="jornadas-background-options__row"><button type="button" onClick={()=>{saveBackground('');setBgInput('')}}>Restaurar fundo padrão</button><button type="button" onClick={()=>setShowBg(false)}>Fechar</button></div>
     </section>}
    {error&&<div role="alert" className="jornadas-clean__alert">{error}<button onClick={()=>setError('')} aria-label="Fechar aviso">×</button></div>}
    {notice&&<div role="status" className="jornadas-clean__notice">{notice}<button onClick={()=>setNotice('')} aria-label="Fechar aviso">×</button></div>}
    {checking?<div className="jornadas-clean__box">Verificando sua Conta Lite…</div>:!account?
     <section className="jornadas-clean__auth">
      <div className="jornadas-clean__auth-description"><span>☁</span><h2>Entre na sua Conta Lite</h2><p>Para que as campanhas realmente funcionem com outros jogadores, o mestre e cada participante precisam entrar com uma Conta Lite. Seus dados ficam na nuvem e o acesso é protegido por grupos.</p></div>
      <button type="button" className="jornadas-clean__primary" disabled={loading} onClick={loginGoogle}>Continuar com Google</button>
      <form onSubmit={loginMail}><label>Ou receba um link por e-mail<input type="email" placeholder="Seu e-mail" value={email} onChange={e=>setEmail(e.target.value)} required/></label><button disabled={loading}>{loading?'Enviando…':'Enviar link de acesso'}</button></form>
      <small>Para criar fichas sem conta, volte à <a href="/">Home do PJLite</a>.</small>
     </section>:
     <>
      {tab==='campaigns'&&<div className="jornadas-clean__main">
       <div className="jornadas-clean__intro">
        <div><strong>Suas campanhas</strong><p>Crie um grupo de mestre, escolha o sistema e abra uma sala compartilhada. Os jogadores entram pelo código do grupo.</p></div>
        <button type="button" onClick={()=>navigate('groups')}>♟ Gerenciar grupos</button>
       </div>
       {!groups.some(g=>g.isOwner&&g.is_dm)&&
        <div className="jornadas-clean__onboarding"><strong>Primeiro passo: criar um grupo de mestre</strong><p>É o grupo que permite convidar pessoas e controlar as permissões da mesa.</p><button onClick={()=>navigate('groups')}>+ Criar grupo e continuar →</button></div>}
       <JornadasPanel account={account} groups={groups} onRefreshGroups={refresh} showToast={setNotice} onRequestGroups={()=>navigate('groups')} onCreateThreat={()=>setNotice('Abra a Home e crie uma ameaça nas suas fichas; depois sincronize e vincule à Jornada.')}/>
      </div>}
      {tab==='groups'&&<div className="jornadas-clean__groups">
       <div className="jornadas-clean__group-actions">
        <form className="jornadas-clean__box" onSubmit={register}><h2>♟ Criar grupo de mestre</h2><p>Crie sua mesa e receba um código de convite para compartilhar com os jogadores.</p><label>Nome do grupo<input value={newGroup} maxLength={80} onChange={e=>setNewGroup(e.target.value)} placeholder="Ex.: Mesa do Abismo" required/></label><button className="jornadas-clean__primary" disabled={loading}>+ Criar grupo de mestre</button></form>
        <form className="jornadas-clean__box" onSubmit={join}><h2>✉ Entrar com convite</h2><p>Recebeu um código do mestre? Entre no grupo e abra as campanhas disponíveis.</p><label>Código de convite<input value={invite} onChange={e=>setInvite(e.target.value.toUpperCase())} maxLength={40} placeholder="LITE-XXXXXX" required/></label><button disabled={loading}>Entrar no grupo →</button></form>
       </div>
       <div className="jornadas-clean__box"><div className="jornadas-clean__listhead"><h2>Meus grupos ({groups.length})</h2><button type="button" onClick={refresh}>↻ Atualizar</button></div>
        {groups.length===0?<p>Nenhum grupo ainda. Crie um ou utilize um convite.</p>:<div className="jornadas-clean__group-list">{groups.map(g=><article key={g.id}><div><strong>♟ {g.name}</strong><small>{g.isOwner?'Você é o mestre':'Você é jogador'} · {g.members?.length||1} membro(s)</small></div>{g.isOwner&&<div className="jornadas-clean__invite"><span>Convide os jogadores com este código:</span><code>{g.invite_code}</code><button type="button" onClick={async()=>{try{if(!navigator.clipboard?.writeText)throw new Error('clipboard');await navigator.clipboard.writeText(g.invite_code);setNotice('Código copiado.')}catch{setError('Copie manualmente o código exibido.')}}}>Copiar</button><button type="button" disabled={loading} onClick={()=>rotate(g)}>Novo código</button></div>}{g.isOwner&&!g.is_dm&&<button type="button" onClick={()=>run(async()=>{await setGroupMaster(g.id,true);await refresh()},'Grupo habilitado para criar campanhas.')}>Ativar mestre</button>}<button type="button" className="jornadas-clean__enter" onClick={()=>navigate('campaigns')}>🧭 Abrir campanhas →</button></article>)}</div>}
       </div>
      </div>}
      {tab==='chat'&&<div className="jornadas-clean__box jornadas-clean__chat"><AccountChatPanel account={account} showToast={setNotice}/></div>}
      {tab==='account'&&<div className="jornadas-clean__box jornadas-clean__account">
        <div className="jornadas-clean__identity"><div className="jornadas-clean__avatar">{account.avatar?<img src={account.avatar} alt=""/>:account.name.charAt(0).toUpperCase()}</div><div><strong>{account.name}</strong><small>{account.email}</small><span>● Conta conectada</span></div></div>
        <p>Suas campanhas e conversas são compartilhadas com os grupos aos quais você pertence. As fichas são criadas e sincronizadas na Home.</p>
        <div className="jornadas-account-achievements"><strong>🏆 Conquistas</strong>
          <label className="pjlite-cloud-achievement-switch">
            <input type="checkbox" checked={achievementsOn} onChange={event=>toggleAchievements(event.target.checked)}/>
            <span>{achievementsOn?'ON · Conquistas visíveis':'OFF · Apenas o gatinho 🐱 no canto'}</span>
          </label>
          <small>Essa configuração vale também para a Home e não altera nenhuma conquista.</small>
        </div>
        <div className="jornadas-clean__account-actions"><button type="button" onClick={()=>navigate('campaigns')}>🧭 Minhas campanhas</button><button type="button" onClick={()=>navigate('groups')}>♟ Meus grupos</button><button type="button" onClick={()=>navigate('chat')}>💬 Abrir Chat</button><a href="/?openAccount=1">☁ Configurações e sincronização →</a></div>
        <button type="button" className="jornadas-clean__logout" disabled={loading} onClick={logout}>Sair da Conta Lite</button>
       </div>}
     </>}
   </div>
  </div>
  {account&&achievements.length>0&&<button type="button"
    className={'pjlite-achievement-corner '+(achievementsOn?'is-full':'is-minimal')}
    aria-label="Conquistas — acessar conta" title={achievementsOn?'Ver conquistas':'Conquistas minimizadas'}
    onClick={()=>navigate('account')}>
    <span className="pjlite-achievement-emblem" aria-hidden="true">{achievementsOn?'◆':'🐱'}</span>
    {achievementsOn&&<span className="pjlite-achievement-corner-text"><strong>CONQUISTAS</strong><small>{achievements.length} desbloqueada{achievements.length===1?'':'s'}</small></span>}
  </button>}
  <footer className="jornadas-site__footer">PJ Lite 1.1.0v Alpha · Campanhas vinculadas à Conta Lite · <a href="/">Voltar à Home</a></footer>
 </main>;
}
