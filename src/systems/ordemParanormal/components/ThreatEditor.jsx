import '../ordem-theme.css';
import React,{useState} from 'react';
import {ORDEM_ATTRIBUTES} from '../data.js';

const number=value=>{const n=Number(value);return Number.isFinite(n)?n:0;};
const tabs=[['perfil','Dossiê'],['acoes','Ataques e habilidades'],['paranormal','Paranormal']];

function Field({label,value,onChange,type='text',className='',placeholder='',min}){
 return <label className={className}><span>{label}</span><input
  aria-label={label} type={type} min={min} placeholder={placeholder}
  value={value??''} onChange={e=>onChange(type==='number'?number(e.target.value):e.target.value)}/></label>;
}
function NotesField({label,value,onChange,rows=3}){
 return <label><span>{label}</span><textarea aria-label={label} rows={rows} value={value??''} onChange={e=>onChange(e.target.value)}/></label>;
}
export default function OrdemThreatEditor({scope}){
 const {data,updateField,setData,optimizeImageFile,showToast}=scope;
 const [tab,setTab]=useState('perfil');
 const [paperMode,setPaperMode]=useState(true);
 if(data?.system!=='ordemParanormal'||data?.type==='pc')return null;
 const attributes=data.atributos||{},status=data.status||{},skills=data.pericias||{};
 const threatName=data.nome||'IDENTIDADE NÃO CLASSIFICADA';
 const sourceUrl=data.fonte==='Livro Básico v1.3'
  ?'https://drive.google.com/file/d/1v_V0j04dBXP0HvLRV5DfPh_hbvRDOIQC/view'
  :data.fonte==='Sobrevivendo ao Horror'
   ?'https://drive.google.com/file/d/1CXTBOfII8buhmQ84HOZQr8nN9VrU-AT9/view':null;
 const patch=(field,index,key,value)=>setData(previous=>{
  const items=Array.isArray(previous[field])?previous[field]:[];
  return {...previous,[field]:items.map((item,i)=>i===index?{...item,[key]:value}:item)};
 });
 const add=(field,item)=>updateField(field,[...(data[field]||[]),item]);
 const remove=(field,index)=>updateField(field,(data[field]||[]).filter((_,i)=>i!==index));
 const photo=async event=>{
  const file=event.target.files?.[0];event.target.value='';
  if(!file)return;
  try{
   if(!file.type.startsWith('image/'))throw new Error('Arquivo não é imagem');
   const image=await optimizeImageFile(file,900,.8);
   updateField('imagem',image);
   showToast?.('Retrato da ameaça atualizado.');
  }catch{showToast?.('Não foi possível carregar este retrato.');}
 };
 return <div className={paperMode?'ordem-sheet ordem-paper-sheet ordem-threat-dossier p-3 sm:p-5':'ordem-sheet ordem-threat-dossier p-3 sm:p-5'}>
  <header className="ordem-hero ordem-threat-hero ordem-dossier-hero">
   <div className="ordem-seal" aria-hidden="true"><span>O</span><small>R</small></div>
   <div className="ordem-dossier-brand">
    <div className="ordem-kicker">ORDO REALITAS // ARQUIVO DE CONTENÇÃO</div>
    <h2>REGISTRO DE AMEAÇA</h2>
    <p>Relatório confidencial do mestre · Ordem Paranormal RPG</p>
   </div>
   <label className="ordem-nex"><span>VD</span><div><input aria-label="Valor de Desafio" type="number" min="0" value={data.vd??0} onChange={e=>updateField('vd',number(e.target.value))}/></div></label>
  </header>
  <div className="ordem-file-ribbon">
   <span>DOCUMENTO SIGILOSO</span><span>AMEAÇA / NPC</span>
   <span className="ordem-file-agent-name">{threatName}</span>
   <button className="ordem-view-toggle" type="button" aria-pressed={paperMode}
    onClick={()=>setPaperMode(v=>!v)} title="Alternar dossiê claro e tema escuro">
     {paperMode?'◐ Escuro':'▤ Dossiê'}
   </button>
  </div>
  <nav className="ordem-tabs" role="tablist" aria-label="Seções da ameaça">
   {tabs.map(([id,title])=><button type="button" role="tab" aria-selected={tab===id} key={id}
    className={tab===id?'active':''} onClick={()=>setTab(id)}>{title}</button>)}
  </nav>

  {tab==='perfil'&&<div className="space-y-3 ordem-dossier-content">
   <section className="ordem-panel ordem-agent-panel ordem-threat-profile">
    <div className="ordem-dossier-headline"><div><span className="ordem-dossier-kicker">FICHA OPERACIONAL · IDENTIFICAÇÃO</span>
     <h3>Registro de entidade</h3></div><span className="ordem-dossier-stamp">EM OBSERVAÇÃO</span></div>
    <div className="ordem-agent-grid">
     <div className="ordem-attrs ordem-attrs--portrait" role="group" aria-label="Atributos da ameaça ao redor do retrato">
      <div className="ordem-photo ordem-photo--portrait">
       {data.imagem?<img src={data.imagem} alt="Retrato da ameaça"/>:<div className="ordem-photo-empty">△</div>}
       <label>Escolher imagem<input type="file" accept="image/*" className="hidden" aria-label="Escolher retrato da ameaça" onChange={photo}/></label>
       {data.imagem&&<button type="button" onClick={()=>updateField('imagem','')}>Remover</button>}
      </div>
      {ORDEM_ATTRIBUTES.map(([key,abbr,name])=><label className="ordem-attr" data-ordem-attribute={key} key={key}>
       <span className="ordem-attr-name">{name}</span>
       <input aria-label={'Atributo '+name} type="number" min="0" value={attributes[key]??1}
        onChange={e=>updateField('atributos.'+key,number(e.target.value))}/>
       <strong>{abbr}</strong></label>)}
     </div>
     <div className="ordem-dossier-identity">
      <div className="ordem-dossier-miniheading">CLASSIFICAÇÃO E PROTOCOLO <span>IDENTIFICAÇÃO RESTRITA</span></div>
      <div className="ordem-identity-grid">
       <Field label="Nome ou identificação" className="wide" value={data.nome} onChange={v=>updateField('nome',v)}/>
       <Field label="Categoria" value={data.categoria} onChange={v=>updateField('categoria',v)}/>
       <Field label="Elemento" value={data.elemento} onChange={v=>updateField('elemento',v)}/>
       <Field label="Tamanho" value={data.tamanho} onChange={v=>updateField('tamanho',v)}/>
       <Field label="Presença perturbadora" value={data.presencaPerturbadora} onChange={v=>updateField('presencaPerturbadora',v)}/>
       <Field label="Fonte / livro" value={data.fonte} onChange={v=>updateField('fonte',v)}
        placeholder="Ex.: Arquivos Secretos #03"/>
       <Field label="Página da fonte" value={data.pagina} onChange={v=>updateField('pagina',v)} placeholder="Ex.: 68"/>
       <div className="ordem-threat-description-wide"><NotesField label="Descrição / comportamento" value={data.descricao} onChange={v=>updateField('descricao',v)} rows={2}/></div>
      </div>
     </div>
    </div>
    {data.dadosParciais&&<p className="ordem-threat-source-notice"><strong>FICHA RESUMIDA · FONTE VERIFICADA</strong> VD, PV, Defesa e atributos foram conferidos no livro; ataques, poderes, condições e enigmas devem ser consultados na página indicada antes da sessão. {sourceUrl&&<a href={sourceUrl} target="_blank" rel="noopener noreferrer">Abrir livro no Google Drive</a>}</p>}
    {String(data.fonte||'').includes('Arquivos Secretos #03')&&<p className="ordem-threat-source-notice"><strong>HEXATOMBE · PARTE 2</strong> Referência parcial da v1.1. Máscaras, rituais e outras modificações temporárias não são aplicados automaticamente; confira as páginas indicadas. <a href="https://drive.google.com/file/d/1MiiIGyZRjlr4lI_MCoNZbbJvDjOvNxD0/view" target="_blank" rel="noopener noreferrer">Consultar suplemento #03</a></p>}
    {String(data.fonte||'').includes('Arquivos Secretos #02')&&<p className="ordem-threat-source-notice"><strong>HEXATOMBE · PARTE 1</strong> Suplemento de regras v1.1 recebido. Confira estatísticas e habilidades na página da sua cópia; as ameaças deste pacote ainda não foram integradas ao catálogo.</p>}
    <div className="ordem-dossier-footer"><span>ORDEM PARANORMAL · USO EXCLUSIVO DO MESTRE</span><span>AVALIAÇÃO DE RISCO / CONTENÇÃO</span></div>
   </section>

   <div className="ordem-threat-operational-grid">
   <section className="ordem-panel ordem-threat-stat-panel">
    <div className="ordem-panel-title"><span>SITUAÇÃO E RECURSOS</span><small>vida, defesa, mobilidade e sentidos</small></div>
    <div className="ordem-threat-stat-grid">
     <Field label="PV atual" type="number" value={status.pvAtual??0} onChange={v=>updateField('status.pvAtual',v)}/>
     <Field label="PV máximo" type="number" value={status.pvMax??0} onChange={v=>updateField('status.pvMax',v)}/>
     <Field label="Defesa" type="number" value={status.defesa??10} onChange={v=>updateField('status.defesa',v)}/>
     <Field label="Deslocamento" value={status.deslocamento} onChange={v=>updateField('status.deslocamento',v)}/>
    </div>
    <Field label="Sentidos" value={data.sentidos} onChange={v=>updateField('sentidos',v)}/>
   </section>
   <section className="ordem-panel">
    <div className="ordem-panel-title"><span>TESTES E PERÍCIAS</span><small>valores conforme o material da ameaça</small></div>
    <div className="ordem-threat-skill-grid">
     {[['percepcao','Percepção'],['iniciativa','Iniciativa'],['fortitude','Fortitude'],['reflexos','Reflexos'],['vontade','Vontade']].map(([key,label])=>
      <Field key={key} label={label} value={skills[key]} onChange={v=>updateField('pericias.'+key,v)}/>)}
    </div>
   </section>
   </div>
  </div>}

  {tab==='acoes'&&<div className="space-y-3 ordem-dossier-content">
   <section className="ordem-panel"><div className="ordem-panel-actions"><div className="ordem-panel-title"><span>ATAQUES</span>
    <small>teste, dano, crítico, alcance e efeito</small></div><button type="button" className="ordem-add"
     onClick={()=>add('ataques',{nome:'',teste:'',dano:'',critico:'',alcance:'',desc:''})}>+ Ataque</button></div>
    <div className="ordem-threat-entry-list">
     {(data.ataques||[]).map((item,index)=><div className="ordem-entry ordem-threat-action-entry" key={index}>
      <div className="ordem-threat-action-grid">
       {[['nome','Ataque'],['teste','Teste'],['dano','Dano'],['critico','Crítico'],['alcance','Alcance']].map(([key,label])=>
        <Field key={key} label={label} value={item[key]} onChange={v=>patch('ataques',index,key,v)}/>)}
      </div>
      <NotesField label="Efeito / condição" value={item.desc} onChange={v=>patch('ataques',index,'desc',v)} rows={2}/>
      <button type="button" className="ordem-threat-remove" onClick={()=>remove('ataques',index)}>Remover ataque</button>
     </div>)}
     {(data.ataques||[]).length===0&&<p className="ordem-threat-empty">Nenhum ataque registrado.</p>}
    </div>
   </section>
   <section className="ordem-panel"><div className="ordem-panel-actions"><div className="ordem-panel-title"><span>HABILIDADES E PODERES</span>
    <small>ações especiais e traços</small></div><button type="button" className="ordem-add"
     onClick={()=>add('habilidades',{nome:'',desc:''})}>+ Habilidade</button></div>
    <div className="ordem-threat-entry-list">
     {(data.habilidades||[]).map((item,index)=><div className="ordem-entry" key={index}>
      <Field label={'Nome da habilidade '+(index+1)} value={item.nome} onChange={v=>patch('habilidades',index,'nome',v)}/>
      <NotesField label="Descrição / efeito" rows={3} value={item.desc} onChange={v=>patch('habilidades',index,'desc',v)}/>
      <button type="button" className="ordem-threat-remove" onClick={()=>remove('habilidades',index)}>Remover habilidade</button>
     </div>)}
     {(data.habilidades||[]).length===0&&<p className="ordem-threat-empty">Nenhuma habilidade registrada.</p>}
    </div>
   </section>
  </div>}

  {tab==='paranormal'&&<div className="space-y-3 ordem-dossier-content">
   <section className="ordem-panel"><div className="ordem-panel-title"><span>RESISTÊNCIAS E VULNERABILIDADES</span><small>propriedades da ameaça</small></div>
    <div className="ordem-threat-text-grid">
     {[['resistencias','Resistências'],['imunidades','Imunidades'],['vulnerabilidades','Vulnerabilidades'],['enigmaMedo','Enigma de Medo']].map(([key,label])=>
      <NotesField key={key} label={label} value={data[key]} onChange={v=>updateField(key,v)} rows={4}/>)}
    </div>
   </section>
   <section className="ordem-panel"><NotesField label="Anotações confidenciais do mestre" rows={7} value={data.notas} onChange={v=>updateField('notas',v)}/></section>
  </div>}
 </div>;
}
