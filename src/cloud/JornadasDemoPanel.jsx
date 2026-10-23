import * as React from 'react';
import './jornadas-demo.css';

const KEY='pjlite_jornadas_demo_v1';
const defaults={
  campaign:'Crônicas do Abismo',system:'Dragonbane',description:'Uma expedição em busca do que existe abaixo da última camada.',
  notes:'Uma porta antiga foi descoberta além da passagem inundada.',
  team:[{id:'demo1',name:'Explorador',initiative:12,hp:22},{id:'demo2',name:'Guardião',initiative:8,hp:28},{id:'demo3',name:'Criatura desconhecida',initiative:15,hp:18}],
  messages:[{id:'welcome',name:'Sistema',body:'Bem-vindo à demonstração de Jornadas. Nenhuma mensagem será enviada a jogadores reais.'}],
  resources:[{id:'guide',title:'Guia da campanha',url:'https://example.com/guia',kind:'Link'}],
  sheets:[{id:'c1',name:'Explorador (exemplo)',permission:false},{id:'c2',name:'Guardião (exemplo)',permission:true}]
};
const newId=()=>String(Date.now())+'-'+Math.random().toString(36).slice(2,8);
function initial(){
  try {
    const saved=JSON.parse(localStorage.getItem(KEY)||'null');
    if(saved&&typeof saved==='object')return {...defaults,...saved,
      team:Array.isArray(saved.team)?saved.team:defaults.team,
      messages:Array.isArray(saved.messages)?saved.messages:defaults.messages,
      resources:Array.isArray(saved.resources)?saved.resources:defaults.resources,
      sheets:Array.isArray(saved.sheets)?saved.sheets:defaults.sheets};
  }catch{}
  return {...defaults};
}
export default function JornadasDemoPanel({onExit,showToast}){
  const [data,setData]=React.useState(initial);
  const [page,setPage]=React.useState('resumo');
  const [role,setRole]=React.useState('dm');
  const [memberName,setMemberName]=React.useState('');
  const [message,setMessage]=React.useState('');
  const [resourceTitle,setResourceTitle]=React.useState('');
  const [resourceUrl,setResourceUrl]=React.useState('');
  const [resourceKind,setResourceKind]=React.useState('Link');
  const [result,setResult]=React.useState('');
  const [upload,setUpload]=React.useState(null);
  const update=patch=>setData(current=>({...current,...(typeof patch==='function'?patch(current):patch)}));
  React.useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}},[data]);
  React.useEffect(()=>()=>{if(upload?.url)URL.revokeObjectURL(upload.url)},[upload?.url]);
  const isDm=role==='dm';
  const addCombatant=()=>{
    if(!memberName.trim())return;
    update(d=>({team:[...d.team,{id:newId(),name:memberName.trim().slice(0,80),initiative:0,hp:20}]}));
    setMemberName('');
  };
  const rollAll=()=>update(d=>({team:d.team.map(t=>({...t,initiative:Math.ceil(Math.random()*20)}))}));
  const addMessage=()=>{
    if(!message.trim())return;
    update(d=>({messages:[...d.messages,{id:newId(),name:isDm?'Mestre':'Jogador',body:message.trim().slice(0,1500)}]}));
    setMessage('');
  };
  const addResource=()=>{
    if(!resourceTitle.trim()||!resourceUrl.trim())return;
    let url;
    try{
      url=new URL(resourceUrl.trim());
      if(url.protocol!=='https:')throw new Error('https');
    }catch{return showToast?.('Use um link HTTPS válido.');}
    update(d=>({resources:[...d.resources,{id:newId(),title:resourceTitle.trim().slice(0,100),url:url.href,kind:resourceKind}]}));
    setResourceTitle('');setResourceUrl('');
  };
  const chooseFile=e=>{
    const file=e.target.files?.[0];
    if(!file)return;
    if(file.size>25*1024*1024)return showToast?.('Arquivo de até 25 MB.');
    if(!['image/png','image/jpeg','image/webp','application/pdf','video/mp4','video/webm'].includes(file.type))
      return showToast?.('Tipo de arquivo não suportado.');
    const url=URL.createObjectURL(file);
    setUpload({name:file.name,url,type:file.type});
    e.target.value='';
  };
  return <div className="pjlite-jornadas-demo">
    <div className="pjlite-jornadas-demo__head">
      <div><strong>🧭 Jornadas • Laboratório</strong><p>Ambiente fictício neste navegador. Sem conta, nuvem ou dados de jogadores reais.</p></div>
      <button type="button" className="secondary" onClick={onExit}>Sair do teste</button>
    </div>
    <div className="pjlite-jornadas-demo__toolbar">
      <label>Visualizar como <select value={role} onChange={e=>setRole(e.target.value)}><option value="dm">Mestre</option><option value="player">Jogador</option></select></label>
      <button type="button" onClick={()=>{if(window.confirm('Apagar apenas os dados desta demonstração?')){setData({...defaults});setResult('')}}}>↺ Reiniciar teste</button>
    </div>
    <nav className="pjlite-jornadas-demo__nav" aria-label="Seções de Jornadas">
      {[
        ['resumo','🏕 Resumo'],['combate','⚔ Combate'],['chat','✉ Chat'],
        ['materiais','📁 Materiais'],['fichas','🗂 Fichas']
      ].map(([id,label])=><button type="button" key={id} className={page===id?'active':''} onClick={()=>setPage(id)}>{label}</button>)}
    </nav>
    {page==='resumo'&&<section className="pjlite-jornadas-demo__section">
      <h3>Campanha de exemplo</h3>
      <label>Nome <input disabled={!isDm} value={data.campaign} onChange={e=>update({campaign:e.target.value})}/></label>
      <label>Sistema <select disabled={!isDm} value={data.system} onChange={e=>update({system:e.target.value})}>{['Dragonbane','D&D 5.5e','Skyfall','Tormenta20','Ordem Paranormal','3DeT Victory','Livre'].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Sinopse <textarea rows={2} disabled={!isDm} value={data.description} onChange={e=>update({description:e.target.value})}/></label>
      <label>Anotações da mesa <textarea rows={4} disabled={!isDm} value={data.notes} onChange={e=>update({notes:e.target.value})}/></label>
      <p className="pjlite-jornadas-demo__hint">As alterações desta demonstração são guardadas apenas neste dispositivo. Troque para Jogador acima e confira os campos de leitura.</p>
    </section>}
    {page==='combate'&&<section className="pjlite-jornadas-demo__section">
      <h3>Iniciativa e combate</h3>
      <div className="pjlite-jornadas-demo__actions"><button disabled={!isDm} onClick={rollAll}>🎲 Rolar iniciativa (d20)</button>{result&&<span role="status">{result}</span>}</div>
      <div className="pjlite-jornadas-demo__team">{[...data.team].sort((a,b)=>b.initiative-a.initiative).map((t,i)=><article key={t.id}>
        <strong>{i+1}. {t.name}</strong><span>Iniciativa: {t.initiative}</span><label>PV <input aria-label={'PV de '+t.name} type="number" disabled={!isDm} value={t.hp} onChange={e=>update(d=>({team:d.team.map(m=>m.id===t.id?{...m,hp:Number(e.target.value)}:m)}))}/></label>
        {isDm&&<button title="Remover do combate" onClick={()=>update(d=>({team:d.team.filter(m=>m.id!==t.id)}))}>×</button>}
      </article>)}</div>
      {isDm&&<div className="pjlite-jornadas-demo__actions"><input aria-label="Nome do combatente" placeholder="Novo combatente" value={memberName} onChange={e=>setMemberName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCombatant()}/><button onClick={addCombatant}>+ Adicionar</button></div>}
      <button type="button" className="secondary" onClick={()=>setResult('🎲 d20: '+Math.ceil(Math.random()*20))}>Rolar dado rápido</button>
    </section>}
    {page==='chat'&&<section className="pjlite-jornadas-demo__section">
      <h3>Chat de demonstração • somente neste dispositivo</h3><div className="pjlite-jornadas-demo__chat">{data.messages.map(m=><article key={m.id}><strong>{m.name}</strong><p>{m.body}</p></article>)}</div>
      <label>Mensagem <textarea rows={2} placeholder="Escreva algo para a mesa..." value={message} onChange={e=>setMessage(e.target.value)}/></label>
      <button onClick={addMessage}>Enviar na demonstração</button>
      <p className="pjlite-jornadas-demo__hint">Este chat simula o comportamento. Não envia mensagens pela internet.</p>
    </section>}
    {page==='materiais'&&<section className="pjlite-jornadas-demo__section">
      <h3>Mapas, músicas e documentos</h3><div className="pjlite-jornadas-demo__resources">{data.resources.map(r=><article key={r.id}><span>{r.kind}</span><a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a>{isDm&&<button onClick={()=>update(d=>({resources:d.resources.filter(x=>x.id!==r.id)}))}>×</button>}</article>)}</div>
      {isDm&&<><div className="pjlite-jornadas-demo__actions"><input aria-label="Título" placeholder="Nome do material" value={resourceTitle} onChange={e=>setResourceTitle(e.target.value)}/><select aria-label="Tipo" value={resourceKind} onChange={e=>setResourceKind(e.target.value)}>{['Link','Mapa','Imagem','Música','Vídeo','PDF'].map(x=><option key={x}>{x}</option>)}</select></div><input aria-label="Endereço HTTPS" placeholder="https://..." value={resourceUrl} onChange={e=>setResourceUrl(e.target.value)}/><button onClick={addResource}>+ Adicionar material</button></>}
      <label>Experimentar arquivo local (até 25 MB) <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf,video/mp4,video/webm" onChange={chooseFile}/></label>
      {upload&&<div><strong>{upload.name}</strong><p>{upload.type.startsWith('image/')?<img className="pjlite-jornadas-demo__image" src={upload.url} alt="Imagem local de teste"/>:<a href={upload.url} target="_blank" rel="noopener noreferrer">Abrir arquivo local</a>}</p></div>}
      <p className="pjlite-jornadas-demo__hint">Arquivos selecionados ficam somente nesta sessão do navegador; o envio privado para a nuvem exige uma Conta Lite autenticada.</p>
    </section>}
    {page==='fichas'&&<section className="pjlite-jornadas-demo__section">
      <h3>Fichas vinculadas à campanha</h3><p>Teste a diferença entre visualização e autorização para o mestre editar. Nenhuma ficha real é carregada.</p>
      {data.sheets.map(s=><article key={s.id} className="pjlite-jornadas-demo__sheet"><div><strong>{s.name}</strong><small>{s.permission?'Mestre autorizado a editar':'Mestre somente visualiza'}</small></div><label><input type="checkbox" checked={!!s.permission} disabled={isDm} onChange={e=>update(d=>({sheets:d.sheets.map(f=>f.id===s.id?{...f,permission:e.target.checked}:f)}))}/> Permitir edição pelo mestre</label><button type="button" onClick={()=>showToast?.(isDm&&s.permission?'Prévia de edição autorizada (ficha fictícia).':'Ficha fictícia em modo de leitura.')}>{isDm&&s.permission?'Abrir/editar':'Ver ficha'}</button></article>)}
      <p className="pjlite-jornadas-demo__hint">Como Jogador, altere uma permissão; como Mestre, observe como a ação muda. Para vincular fichas reais, entre normalmente na Conta Lite.</p>
    </section>}
  </div>;
}
