import * as React from 'react';
import {getJourneySheetSummary} from './journeySheetSummary.js';
import './sheet-quick-view.css';

const displaySystem={dragonbane:'Dragonbane',dnd5e:'D&D 5.5e',fabula:'Fábula Última',ordemParanormal:'Ordem Paranormal',skyfall:'Skyfall',somdas6:'O Som das Seis','3det':'3D&T Victory',rotaZero:'Rota Zero'};
const safeImage=url=>{
 if(typeof url!=='string'||!url)return '';
 if(url.startsWith('data:image/')&&url.length<2_000_000)return url;
 try {const u=new URL(url);return u.protocol==='https:'?u.href:''}catch{return ''}
};
export function CharacterPortrait({url,name,size='small'}){
 const src=safeImage(url);
 return <span className={'journey-portrait is-'+size}>
  {src?<img src={src} alt={'Retrato de '+name} loading="lazy"/>:<span aria-hidden="true">{(name||'?').trim().charAt(0).toUpperCase()}</span>}
 </span>;
}

function CharacterResourceBar({resource,label,tone}){
 if(!resource)return null;
 const current=Number(resource.current);
 const maximum=Number(resource.max);
 const fill=Number.isFinite(current)&&Number.isFinite(maximum)&&maximum>0
  ?Math.max(0,Math.min(100,(current/maximum)*100)):null;
 return <div className={'journey-mini-resource is-'+tone}>
  <div className="journey-mini-resource__caption"><span>{label}</span><strong>{resource.current} / {resource.max}</strong></div>
  <div className="journey-mini-resource__track" role={fill===null?undefined:'progressbar'}
   aria-label={label} aria-valuenow={fill===null?undefined:Math.max(0,Math.min(maximum,current))}
   aria-valuemin={fill===null?undefined:0} aria-valuemax={fill===null?undefined:maximum}>
   {fill!==null?<span style={{width:fill+'%'}}/>:<span className="is-unknown"/>}
  </div>
 </div>;
}
// Miniatura inspirada na leitura rápida do CRIS, sem copiar suas artes ou
// transformar fichas em imagens estáticas. Os dados vêm da ficha na nuvem.
export function CharacterMiniSheet({row,ownerLabel,onView}){
 const sheet=getJourneySheetSummary(row);
 const title=[sheet.profession,sheet.ancestry].filter(Boolean).join(' · ');
 return <article className="journeys-character-card journey-mini-sheet" role="button" tabIndex={0}
   aria-label={'Abrir minificha de '+sheet.name} onClick={()=>onView?.()}
   onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onView?.()}}}>
  <div className="journey-mini-sheet__identity">
   <CharacterPortrait url={sheet.portrait} name={sheet.name} size="card"/>
   <div className="journey-mini-sheet__heading">
    <span className="journey-mini-sheet__system">{displaySystem[sheet.system]||sheet.system||'Ficha de RPG'}</span>
    <h4 title={sheet.name}>{sheet.name}</h4>
    <p title={title}>{title||'Personagem'}</p>
    {sheet.level&&<small>Nível {sheet.level}</small>}
    <small className="journey-mini-sheet__owner">👤 {ownerLabel||'Jogador'}</small>
   </div>
  </div>
  {sheet.hasPayload?<>
   {sheet.attributes.length>0&&<div className="journey-mini-sheet__attributes" aria-label="Atributos da ficha">
    {sheet.attributes.slice(0,6).map(attribute=><div key={attribute.label}>
     <span>{attribute.label}</span><strong>{attribute.value}</strong>
    </div>)}
   </div>}
   <div className="journey-mini-sheet__resources">
    {sheet.hp&&<CharacterResourceBar label="VIDA" tone="life" resource={sheet.hp}/>}
    {sheet.resource&&<CharacterResourceBar label={sheet.resource.label.toUpperCase()} tone="power" resource={sheet.resource}/>}
    {!sheet.hp&&!sheet.resource&&<small className="journey-mini-sheet__no-data">Sem recursos padronizados nesta ficha.</small>}
   </div>
   {sheet.combat.length>0&&<div className="journey-mini-sheet__combat">
    {sheet.combat.map(stat=><div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}
   </div>}
   {sheet.conditions.length>0&&<small className="journey-mini-sheet__conditions" title={sheet.conditions.join(', ')}>
    ● {sheet.conditions.length} {sheet.conditions.length===1?'condição':'condições'} ativa{sheet.conditions.length===1?'':'s'}
   </small>}
  </>:<p className="journey-mini-sheet__no-data">Prévia indisponível para esta ficha.</p>}
  <span className="journey-mini-sheet__open" aria-hidden="true">
   <span>▤ Abrir ficha</span><span>→</span>
  </span>
 </article>;
}

export function SheetQuickView({row,ownerLabel,onClose,onEdit,onUnlink,canEdit=false,canUnlink=false}){
 const [details,setDetails]=React.useState(false);
 const sheet=getJourneySheetSummary(row);
 React.useEffect(()=>{
  const key=e=>{if(e.key==='Escape')onClose?.()};
  document.addEventListener('keydown',key);
  return()=>document.removeEventListener('keydown',key);
 },[onClose]);
 if(!row)return null;
 return <div className="journey-sheet-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose?.()}}>
  <section className="journey-sheet-modal" role="dialog" aria-modal="true" aria-label={'Consulta rápida: '+sheet.name}>
   <header className="journey-sheet-modal__top">
    <CharacterPortrait url={sheet.portrait} name={sheet.name} size="large"/>
    <div className="journey-sheet-modal__identity"><small>{displaySystem[sheet.system]||sheet.system||'Ficha'} · {ownerLabel||'Jogador'}</small><h3>{sheet.name}</h3><p>{[sheet.profession,sheet.ancestry,sheet.level?'Nível '+sheet.level:''].filter(Boolean).join(' · ')||'Ficha compartilhada pela campanha'}</p></div>
    <button type="button" className="journey-sheet-close" aria-label="Fechar ficha" onClick={onClose}>×</button>
   </header>
   {!sheet.hasPayload?<p className="journey-sheet-empty">A prévia desta ficha não está disponível para a sua conta.</p>:<>
    <div className="journey-sheet-vitals">
     {sheet.hp&&<div><span>❤️ Pontos de Vida</span><strong>{sheet.hp.current} / {sheet.hp.max}</strong></div>}
     {sheet.resource&&<div><span>✦ {sheet.resource.label}</span><strong>{sheet.resource.current} / {sheet.resource.max}</strong></div>}
     {!sheet.hp&&!sheet.resource&&<p>Esta ficha não possui indicadores padronizados de recursos.</p>}
    </div>
    {sheet.attributes.length>0&&<div className="journey-sheet-attributes">{sheet.attributes.map(a=><div key={a.label}><span>{a.label}</span><strong>{a.value}</strong></div>)}</div>}
    {sheet.conditions.length>0&&<p className="journey-sheet-conditions"><strong>Condições:</strong> {sheet.conditions.join(' · ')}</p>}
    <button type="button" className="journey-sheet-details-toggle" onClick={()=>setDetails(v=>!v)} aria-expanded={details}>{details?'− Ocultar detalhes':'＋ Ver perícias, habilidades e equipamentos'}</button>
    {details&&<div className="journey-sheet-sections">
     <div><h4>Perícias</h4>{sheet.skills.length?<ul>{sheet.skills.map((v,i)=><li key={i}>{v}</li>)}</ul>:<p>Nenhuma perícia listada na prévia.</p>}</div>
     <div><h4>Habilidades</h4>{sheet.traits.length?<ul>{sheet.traits.map((v,i)=><li key={i}>{v}</li>)}</ul>:<p>Nenhuma habilidade listada na prévia.</p>}</div>
     <div><h4>Equipamento</h4>{sheet.equipment.length?<ul>{sheet.equipment.map((v,i)=><li key={i}>{v}</li>)}</ul>:<p>Nenhum equipamento listado na prévia.</p>}</div>
    </div>}
   </>}
   <footer className="journey-sheet-modal__footer">
    <small>Consulta da ficha sincronizada. Edição depende da permissão do dono.</small>
    <div><button type="button" onClick={onClose}>Fechar</button>
     {canUnlink&&<button className="journey-sheet-unlink" type="button" onClick={onUnlink}>Desvincular da campanha</button>}
     {canEdit&&sheet.hasPayload&&<button className="journey-sheet-edit" type="button" onClick={onEdit}>✎ Editar no PJLite</button>}</div>
   </footer>
  </section>
 </div>;
}
