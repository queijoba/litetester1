import React,{useEffect,useMemo,useRef,useState} from 'react';
import {toBlob} from 'html-to-image';
import {createPortal} from 'react-dom';
import {buildThreatCardData} from './threatCardData.js';
import './threat-card.css';
const statLabel={dragonbane:'Dragonbane',dnd5e:'D&D 5.5e',fabula:'Fábula Última',ordemParanormal:'Ordem Paranormal',skyfall:'Skyfall RPG','3det':'3D&T Victory',somdas6:'O Som das Seis',rotaZero:'Rota Zero'};
const systemClass=v=>String(v||'').replace(/[^a-z0-9]/gi,'').toLowerCase();
export function ThreatStatCard({data,compact=false}){
 const card=buildThreatCardData(data);
 return <article className={'pj-threat-card pj-threat-card--'+systemClass(card.system)+(compact?' is-compact':'')} aria-label={'Card de ameaça: '+card.name}>
  <header className="pj-threat-card-head"><div><small>{statLabel[card.system]||'RPG'} • BESTIÁRIO</small><h2>{card.name}</h2><p>{card.subtitle||'Criatura ou personagem do mestre'}</p></div>{card.badge&&<span className="pj-threat-card-badge">{card.badge}</span>}</header>
  {card.image&&<div className="pj-threat-card-art"><img src={card.image} alt={'Retrato de '+card.name}/></div>}
  {card.summary&&<p className="pj-threat-card-summary">{card.summary}</p>}
  {card.stats.length>0&&<div className="pj-threat-card-stats">{card.stats.map((s,i)=><div key={i}><strong>{s.title}</strong><span>{s.value}</span></div>)}</div>}
  {card.attributes.length>0&&<div className="pj-threat-card-attributes">{card.attributes.map((a,i)=><div key={i}><strong>{a.title}</strong><span>{a.value}</span></div>)}</div>}
  {card.details.length>0&&<div className="pj-threat-card-details">{card.details.map(([key,value],i)=><p key={i}><b>{key}.</b> {value}</p>)}</div>}
  {card.sections.map((section,i)=><section className="pj-threat-card-section" key={i}><h3>{section.label}</h3>{section.items.map((entry,index)=><p key={index}><strong>{entry.nome}{entry.nome&&entry.desc?'. ':''}</strong>{entry.desc}</p>)}</section>)}
  {card.extra&&<section className="pj-threat-card-section"><h3>Notas</h3><p>{card.extra}</p></section>}
  <footer className="pj-threat-card-credit">PJLite • referência rápida para uso na mesa</footer>
 </article>;
}
export default function ThreatCardModal({open=false,data,onClose}){
 useEffect(()=>{if(!open)return;const onKey=e=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[open,onClose]);
 const display=useMemo(()=>data?buildThreatCardData(data):null,[data]);
 const cardRef=useRef(null);
 const [exporting,setExporting]=useState(false);
 const [imageError,setImageError]=useState('');
 useEffect(()=>{if(open)setImageError('');},[open]);
 if(!open||!data||typeof document==='undefined')return null;
 const downloadPng=async()=>{
  const node=cardRef.current;
  if(!node||exporting)return;
  setImageError('');
  setExporting(true);
  try{
   // Reduz a resolução em cards muito longos para evitar o limite de canvas no celular.
   const box=node.getBoundingClientRect();
   const width=Math.max(1,Math.ceil(node.scrollWidth||box.width));
   const height=Math.max(1,Math.ceil(node.scrollHeight||box.height));
   const pixelRatio=Math.min(2,8192/Math.max(width,height),Math.sqrt(20000000/(width*height)));
   const blob=await toBlob(node,{cacheBust:true,pixelRatio:Math.max(.75,pixelRatio)});
   if(!blob)throw new Error('Não foi possível criar o arquivo de imagem.');
   const filename=(display.name||'Ameaca').normalize('NFD').replace(/\p{M}/gu,'').replace(/[^a-zA-Z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,70)||'Ameaca';
   const url=URL.createObjectURL(blob);
   const a=document.createElement('a');
   a.href=url;
   a.download='Card_Ameaca_'+filename+'.png';
   document.body.appendChild(a);
   a.click();
   a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(error){
   console.error('Falha ao exportar card em PNG:',error);
   setImageError('Não foi possível baixar a imagem. Caso use retrato de uma URL externa, tente outro retrato ou faça uma captura de tela.');
  }finally{
   setExporting(false);
  }
 };
 const copy=()=>{
  const rows=[display.name,display.subtitle,display.badge,...display.stats.map(x=>x.title+': '+x.value),...display.attributes.map(x=>x.title+': '+x.value),...display.sections.flatMap(x=>[x.label,...x.items.map(y=>y.nome+' — '+y.desc)])];
  const value=rows.filter(Boolean).join('\n');
  if(navigator.clipboard?.writeText)navigator.clipboard.writeText(value).catch(()=>{window.prompt('Copie o card:',value);});
  else window.prompt('Copie o card:',value);
 };
 return createPortal(<div className="pj-threat-card-modal" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
  <section className="pj-threat-card-panel" role="dialog" aria-modal="true" aria-label="Card de apresentação da ameaça">
   <nav className="pj-threat-card-toolbar no-print"><div><strong>🃏 Card da ameaça</strong><small>Imagem pronta para enviar à sua mesa • sem PDF</small></div><div><button type="button" onClick={copy}>Copiar texto</button><button type="button" className="pj-threat-card-png-btn" onClick={downloadPng} disabled={exporting} aria-label="Baixar imagem PNG do card">{exporting?'Gerando PNG…':'↓ Baixar PNG'}</button><button type="button" onClick={onClose} aria-label="Fechar card">✕</button></div></nav>
   {imageError&&<div className="pj-threat-card-alert" role="alert">{imageError}</div>}
   <div className="pj-threat-card-scroll"><div ref={cardRef} className="pj-threat-card-capture"><ThreatStatCard data={data}/></div></div>
  </section>
 </div>,document.body);
}
