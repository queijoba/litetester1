import * as React from 'react';
import JornadasPanel from './JornadasPanel.jsx';
import JornadasDemoPanel from './JornadasDemoPanel.jsx';
import {
  getSession,onAuthStateChange,getProfile,listGroups,
  signInWithGoogle,signInWithOtp,signOut,createGroup
} from './supabaseCloud.js';
import {setGroupMaster} from './jornadasCloud.js';
import './jornadas-hub.css';

const DEMO_KEY='JORNADAS-TESTE';
const DEMO_STORAGE='pjlite_jornadas_demo_v1';
const SYSTEMS=[
 ['dragonbane','Dragonbane'],['dnd5e','D&D 5.5e'],['skyfall','Skyfall'],
 ['ordemParanormal','Ordem Paranormal'],['tormenta20','Tormenta20'],
 ['fabula','Fábula Última'],['3det','3DeT Victory'],['rotaZero','Rota Zero'],['livre','Sistema livre']
];
function demoName(){
 try{return JSON.parse(localStorage.getItem(DEMO_STORAGE)||'null')?.campaign||'Crônicas do Abismo';}
 catch{return 'Crônicas do Abismo';}
}
export default function JornadasHub(){
 const [mode,setMode]=React.useState('lobby');
 const [code,setCode]=React.useState('');
 const [showCreate,setShowCreate]=React.useState(false);
 const [campaignName,setCampaignName]=React.useState('');
 const [campaignSystem,setCampaignSystem]=React.useState('dragonbane');
 const [demoRevision,setDemoRevision]=React.useState(0);
 const [notice,setNotice]=React.useState('');
 const [session,setSession]=React.useState(null);
 const [profile,setProfile]=React.useState(null);
 const [groups,setGroups]=React.useState([]);
 const [email,setEmail]=React.useState('');
 const [authBusy,setAuthBusy]=React.useState(false);
 const [newGroup,setNewGroup]=React.useState('');
 const [groupBusy,setGroupBusy]=React.useState(false);
 const [groupError,setGroupError]=React.useState('');
 const [demoTitle,setDemoTitle]=React.useState(demoName);
 const account=session?.user?{
   id:session.user.id,
   email:session.user.email||'',
   name:profile?.display_name||session.user.user_metadata?.name||session.user.email?.split('@')[0]||'Jogador'
 }:null;
 React.useEffect(()=>{
   document.body.classList.add('jornadas-standalone');
   document.title='Jornadas — PJ Lite | Campanhas';
   return()=>{document.body.classList.remove('jornadas-standalone');document.title='PJ Lite'};
 },[]);
 React.useEffect(()=>{
   let mounted=true;
   getSession().then(s=>{if(mounted)setSession(s)}).catch(()=>{});
   const dispose=onAuthStateChange(s=>{if(mounted)setSession(s)});
   return()=>{mounted=false;dispose?.()};
 },[]);
 const refresh=React.useCallback(async()=>{
   if(!session?.user)return;
   try {
     const [p,g]=await Promise.all([getProfile(),listGroups()]);
     setProfile(p);setGroups(g||[]);
   }catch(error){setNotice('Não foi possível atualizar seus grupos. A demonstração continua disponível.');}
 },[session?.user?.id]);
 React.useEffect(()=>{if(session?.user)refresh();else{setProfile(null);setGroups([])}},[refresh,session?.user?.id]);
 const openDemo=()=>{setShowCreate(false);setMode('demo');setNotice('')};
 const unlock=e=>{
   e?.preventDefault();
   if(code.trim().toUpperCase()!==DEMO_KEY){setNotice('Chave de demonstração inválida. Use JORNADAS-TESTE.');return;}
   openDemo();setCode('');
 };
 const createDemo=e=>{
   e.preventDefault();
   const name=campaignName.trim();
   if(!name){setNotice('Dê um nome à sua campanha.');return;}
   try{localStorage.setItem(DEMO_STORAGE,JSON.stringify({
     campaign:name.slice(0,110),system:SYSTEMS.find(x=>x[0]===campaignSystem)?.[1]||'Livre',
     description:'Uma nova história começa aqui. Descreva os objetivos da sua campanha.',
     notes:'Prepare a primeira sessão, suas pistas e as personagens.',
     team:[],messages:[],resources:[],sheets:[]
   }))}catch{}
   setDemoTitle(name.slice(0,110));setDemoRevision(x=>x+1);setShowCreate(false);openDemo();
 };
 const login=async e=>{
   e.preventDefault();if(!email.includes('@')){setNotice('Informe um e-mail válido.');return;}
   setAuthBusy(true);
   try{await signInWithOtp(email.trim().toLowerCase());setNotice('Link de acesso enviado. Caso ele direcione ao site oficial, utilize a chave de teste nesta página para conhecer a prévia.')}
   catch(error){setNotice('Não foi possível enviar o link: '+String(error?.message||'erro de autenticação'))}
   finally{setAuthBusy(false)}
 };
 const registerGroup=async e=>{
   e.preventDefault();if(!newGroup.trim())return;
   setGroupBusy(true);setGroupError('');
   try{
     const group=await createGroup(newGroup.trim());
     await setGroupMaster(group.id,true);
     await refresh();setNewGroup('');setNotice('Grupo de mestre criado. Agora você pode criar uma campanha.');
   }catch(error){setGroupError(error?.message||'Não foi possível criar o grupo.')}
   finally{setGroupBusy(false)}
 };
 const exit=()=>{setShowCreate(false);setMode('lobby');setDemoTitle(demoName())};
 return <main className="jornadas-site">
   <header className="jornadas-site__topbar">
     <a className="jornadas-site__brand" href="/" title="Voltar ao PJLite">
       <span className="jornadas-site__brandmark">◆</span>
       <span><strong>PJ LITE</strong><small>JORNADAS</small></span>
     </a>
     <nav aria-label="Navegação principal">
       <a href="/" className="jornadas-site__home-link" title="Voltar para a página inicial do PJ Lite">← Voltar à Home</a>
       <button className={mode==='lobby'?'is-active':''} onClick={exit}>🧭 Campanhas</button>
       <a href="/?openAccount=1&accountTab=chat" title="Abrir Chat na Conta Lite">💬 Chat da Conta</a>
       {account?<span className="jornadas-site__user">● {account.name}</span>:<span className="jornadas-site__user">Prévia Alpha</span>}
     </nav>
   </header>
   <div className="jornadas-site__layout">
     <aside className="jornadas-site__side">
       <a href="/" className="jornadas-site__sidebar-home">← Voltar ao PJLite Home</a>
       <div className="jornadas-site__side-title">SUA MESA</div>
       <button className={mode==='lobby'?'is-active':''} onClick={exit}>▦ Visão geral</button>
       <button className={mode==='demo'?'is-active':''} onClick={openDemo}>⚔ Mesa de demonstração</button>
       <button onClick={()=>{exit();setShowCreate(true)}}>＋ Criar Jornada</button>
       <div className="jornadas-site__side-divider"/>
       <div className="jornadas-site__side-title">FERRAMENTAS</div>
       <a href="/?openAccount=1&accountTab=chat" className="jornadas-site__sidebar-chat">💬 Chat da Conta Lite ↗</a>
       <button onClick={openDemo}>🎲 Combate e dados</button>
       <button onClick={openDemo}>🗂 Fichas da mesa</button>
       <button onClick={openDemo}>📁 Arquivos e chat</button>
       <p>Laboratório experimental: a chave de teste não concede permissões da Conta Lite.</p>
     </aside>
     <div className="jornadas-site__content">
       {showCreate?<form className="jornadas-site__create" onSubmit={createDemo}>
          <span className="jornadas-site__eyebrow">CRIAR JORNADA • DEMONSTRAÇÃO</span>
          <h2>Uma nova aventura começa</h2>
          <p>Crie uma campanha fictícia para experimentar o espaço do mestre. Para campanhas reais com amigos, conecte a Conta Lite na página inicial.</p>
          <label>Nome da campanha <input autoFocus maxLength={110} value={campaignName} onChange={e=>setCampaignName(e.target.value)} placeholder="O Segredo do Subterrâneo" required/></label>
          <label>Sistema de RPG <select value={campaignSystem} onChange={e=>setCampaignSystem(e.target.value)}>{SYSTEMS.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
          <div className="jornadas-site__hero-actions"><button type="submit">Criar e entrar na sala →</button><button type="button" onClick={()=>setShowCreate(false)}>Cancelar</button></div>
        </form>:mode==='demo'?<div className="jornadas-site__demo">
         <div className="jornadas-site__breadcrumb"><button onClick={exit}>Minhas Jornadas</button><span> / </span> Sala de demonstração</div>
         <JornadasDemoPanel key={demoRevision} onExit={exit} showToast={setNotice}/>
       </div>:<>
         <section className="jornadas-site__hero">
           <div>
             <span className="jornadas-site__eyebrow">PJ LITE • JORNADAS 1.1.0v ALPHA</span>
             <h1>Suas histórias têm<br/><em>um lugar próprio.</em></h1>
             <p>Organize suas campanhas e fichas em uma área própria. Experimente sem conta ou entre na Conta Lite para jogar em grupo.</p>
             <div className="jornadas-site__hero-actions">
               <button onClick={()=>setShowCreate(true)}>＋ Criar Jornada</button>
               <button className="is-outline" onClick={openDemo}>Explorar mesa de exemplo →</button>
             </div>
           </div>
           <div className="jornadas-site__hero-icon" aria-hidden="true">✦<span>🧭</span>✦</div>
         </section>
         <div className="jornadas-site__quicksteps" aria-label="Como começar">
            <div><strong>1. Abra uma campanha</strong><small>Escolha a demonstração ou crie sua Jornada</small></div>
            <div><strong>2. Prepare a sessão</strong><small>Organize iniciativa, fichas e materiais</small></div>
            <div><strong>3. Converse com o grupo</strong><small>Chat compartilhado em Conta Lite → Chat</small></div>
         </div>
         <section className="jornadas-site__overview">
           <div className="jornadas-site__section-heading"><div><span className="jornadas-site__eyebrow">BIBLIOTECA</span><h2>Minhas Jornadas</h2></div><span className="jornadas-site__count">Prévia experimental</span></div>
           <div className="jornadas-site__cards">
             <button className="jornadas-site__campaign" onClick={openDemo}>
               <div className="jornadas-site__cover"><span>✦</span><small>EXEMPLO LOCAL</small></div>
               <div className="jornadas-site__card-body"><strong>{demoTitle}</strong><small>Uma mesa pronta para você experimentar</small><span>Entrar na sala <b>→</b></span></div>
             </button>
             <button className="jornadas-site__new" onClick={()=>setShowCreate(true)}><strong>＋</strong><span>Nova campanha</span><small>Monte sua própria história</small></button>
           </div>
         </section>
         <section className="jornadas-site__access">
           <div className="jornadas-site__access-title"><span>🔑</span><div><h2>Chave de teste</h2><p>Acesse sem login para explorar a interface, como mestre ou jogador. Dados de exemplo ficam apenas neste navegador.</p></div></div>
           <form className="jornadas-site__code-form" onSubmit={unlock}><label htmlFor="jornadas-access-code">Chave de acesso à prévia</label><div><input id="jornadas-access-code" autoCapitalize="characters" autoComplete="off" spellCheck={false} value={code} onChange={e=>setCode(e.target.value)} placeholder="JORNADAS-TESTE"/><button>Entrar no teste</button></div></form>
         </section>
         <section className="jornadas-site__real">
           <div><span className="jornadas-site__eyebrow">CONTA LITE • OPCIONAL</span><h2>Minhas campanhas compartilhadas</h2><p>Use o login somente para campanhas com outras pessoas e chats privados. Para testar, escolha a campanha de exemplo, sem precisar de conta.</p><a className="jornadas-site__chat-deeplink" href="/?openAccount=1&accountTab=chat">💬 Abrir Chat na Conta Lite →</a></div>
           {account?<div className="jornadas-site__real-account"><span>✓ Conectado: {account.name}</span><button onClick={async()=>{await signOut();setSession(null);setNotice('Você saiu da Conta Lite.')}}>Sair</button></div>:<div className="jornadas-site__login"><form onSubmit={login}><input aria-label="E-mail da Conta Lite" type="email" placeholder="Seu e-mail da Conta Lite" value={email} onChange={e=>setEmail(e.target.value)}/><button disabled={authBusy}>{authBusy?'Enviando…':'Receber link'}</button></form><button className="jornadas-site__google" onClick={async()=>{try{await signInWithGoogle()}catch(e){setNotice(e?.message||'Não foi possível entrar com Google.')}}}>Continuar com Google</button></div>}
           {account&&<>
             {!groups.some(g=>g.isOwner&&g.is_dm)&&<form className="jornadas-site__create-group" onSubmit={registerGroup}><label>Crie um grupo de mestre para começar</label><div><input placeholder="Nome do seu grupo" value={newGroup} onChange={e=>setNewGroup(e.target.value)}/><button disabled={groupBusy}>{groupBusy?'Criando…':'+ Criar grupo DM'}</button></div>{groupError&&<p role="alert">{groupError}</p>}</form>}
             <JornadasPanel account={account} groups={groups} showToast={setNotice} onCreateThreat={()=>setNotice('Abra suas fichas no PJLite para criar uma ameaça.')} />
           </>}
         </section>
       </>}
       {notice&&<div className="jornadas-site__notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Dispensar aviso">×</button></div>}
     </div>
   </div>
   <footer className="jornadas-site__footer">PJ Lite • 1.1.0v Alpha — Jornadas e Conta Lite são áreas independentes. <a href="/">← Voltar à Home</a></footer>
 </main>;
}
