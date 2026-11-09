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
 const [pngFormat,setPngFormat]=useState('regular');
 const [imageError,setImageError]=useState('');
 useEffect(()=>{if(open)setImageError('');},[open]);
 if(!open||!data||typeof document==='undefined')return null;
 const downloadPng=async()=>{
  const node=cardRef.current;
  if(!node||exporting)return;
  setImageError('');
  setExporting(true);
  // Uma área de captura fora do modal garante a largura completa do cartão:
  // o scroll da prévia (especialmente no celular) não pode cortar a imagem.
  const isThermal=pngFormat!=='regular';
  const width=pngFormat==='thermal58'?384:pngFormat==='thermal80'?576:560;
  const exportHost=document.createElement('div');
  exportHost.className='pj-threat-card-modal pj-threat-export-host';
  exportHost.setAttribute('aria-hidden','true');
  const exportNode=node.cloneNode(true);
  exportNode.classList.toggle('is-thermal',isThermal);
  exportNode.style.width=width+'px';
  exportNode.style.maxWidth='none';
  exportNode.style.margin='0';
  exportHost.appendChild(exportNode);
  document.body.appendChild(exportHost);
  try{
   if(document.fonts?.ready)await document.fonts.ready;
   await Promise.all(Array.from(exportNode.querySelectorAll('img')).map(img=>{
    if(img.complete)return Promise.resolve();
    return new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;});
   }));
   const height=Math.ceil(exportNode.scrollHeight);
   if(height<1)throw new Error('O card não possui altura de exportação.');
   const desiredRatio=isThermal?1:2;
   const ratio=Math.min(desiredRatio,8192/height,8192/width,Math.sqrt(19000000/(width*height)));
   if(ratio<0.45)throw new Error('Card longo demais para uma imagem única. Reduza as notas ou divida em duas fichas.');
   // width e height explícitos são essenciais ao html-to-image; assim textos
   // que ultrapassariam o modal não são truncados no PNG exportado.
   const blob=await toBlob(exportNode,{
    cacheBust:true,backgroundColor:'#ffffff',width,height,
    pixelRatio:ratio,canvasWidth:Math.ceil(width*ratio),canvasHeight:Math.ceil(height*ratio)
   });
   if(!blob)throw new Error('Não foi possível criar o arquivo de imagem.');
   const filename=(display.name||'Ameaca').normalize('NFD').replace(/\p{M}/gu,'').replace(/[^a-zA-Z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,70)||'Ameaca';
   const url=URL.createObjectURL(blob);
   const a=document.createElement('a');
   a.href=url;
   a.download='Card_Ameaca_'+filename+(isThermal?'_termica_'+(pngFormat==='thermal58'?'58mm':'80mm'):'')+'.png';
   document.body.appendChild(a);
   a.click();
   a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),2000);
  }catch(error){
   console.error('Falha ao exportar card em PNG:',error);
   setImageError(error?.message||'Não foi possível gerar o PNG. Verifique se o retrato está disponível.');
  }finally{
   exportHost.remove();
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
   <nav className="pj-threat-card-toolbar no-print"><div><strong>🃏 Card da ameaça</strong><small>PNG completo para a mesa ou para impressão em tira térmica</small></div><div>
    <label className="pj-threat-card-print-mode">Tamanho do PNG
     <select value={pngFormat} onChange={event=>setPngFormat(event.target.value)} disabled={exporting} aria-label="Formato do card para impressão">
      <option value="regular">Card normal</option>
      <option value="thermal80">Térmica 80 mm • 576 px</option>
      <option value="thermal58">Térmica 58 mm • 384 px</option>
     </select>
    </label>
    <button type="button" onClick={copy}>Copiar texto</button><button type="button" className="pj-threat-card-png-btn" onClick={downloadPng} disabled={exporting} aria-label="Baixar imagem PNG do card">{exporting?'Gerando PNG…':'↓ Baixar PNG'}</button><button type="button" onClick={onClose} aria-label="Fechar card">✕</button></div></nav>
   {imageError&&<div className="pj-threat-card-alert" role="alert">{imageError}</div>}
   <div className="pj-threat-card-scroll"><div ref={cardRef} className={'pj-threat-card-capture '+(pngFormat==='regular'?'':'is-thermal')}><ThreatStatCard data={data}/></div></div>
  </section>
 </div>,document.body);
}
