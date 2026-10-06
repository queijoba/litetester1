import * as React from 'react';
import './rota-zero.css';
import { RZ_SKILLS, RZ_ADVANTAGES, RZ_DEFECTS, RZ_KITS, calcRotaZeroCosts, syncRotaZeroResources } from '../data.js';

const { useEffect, useState } = React;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));
const Field=({label,children,className=''})=><label className={'rz-field '+className}><span>{label}</span>{children}</label>;
const Panel=({title,right,children})=><section className="rz-panel"><header><h2>{title}</h2>{right}</header><div className="body">{children}</div></section>;

export default function RotaZeroCharacterEditor({scope}){
  const {data,updateField,optimizeImageFile,showToast}=scope;
  const [tab,setTab]=useState('ficha');
  useEffect(()=>{if(data?.system==='rotaZero')setTab('ficha')},[data?.id]);
  if(!data||data.system!=='rotaZero'||data.type!=='pc')return null;
  const costs=calcRotaZeroCosts(data);
  const attrs=data.atributos||{}; const res=data.recursos||{};
  const setAttr=(key,value)=>{
    const n=clamp(value,1,3);
    const next=syncRotaZeroResources({...data,atributos:{...attrs,[key]:n}});
    updateField('atributos.'+key,n);
    updateField('recursos.adrenalina',next.recursos.adrenalina);
    updateField('recursos.foco',next.recursos.foco);
    updateField('recursos.vitalidade',next.recursos.vitalidade);
  };
  const toggleList=(key,id,on)=>{
    const list=Array.isArray(data[key])?[...data[key]]:[];
    const next=on?[...new Set([...list,id])]:list.filter(x=>x!==id);
    updateField(key,next);
    if(key==='vantagens'){const synced=syncRotaZeroResources({...data,[key]:next});updateField('recursos.foco',synced.recursos.foco);updateField('recursos.vitalidade',synced.recursos.vitalidade);}
  };
  const applyKit=(kit)=>{
    updateField('bio.kit',kit.nome);
    Object.entries(kit.attrs).forEach(([k,v])=>setAttr(k,v));
    const skills={}; RZ_SKILLS.forEach(([id])=>skills[id]=kit.skills.includes(id));
    updateField('pericias',skills); updateField('vantagens',kit.advantages); updateField('inventario.0',kit.item||'');
    showToast('Kit '+kit.nome+' aplicado. Confira os Créditos antes de salvar.');
  };
  const handlePortrait=async(e)=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;try{const img=await optimizeImageFile(file,900,.84);updateField('bio.imagem',img)}catch{showToast('Não foi possível usar essa imagem.')}};
  const toggleTrack=(key,index)=>{const list=[...(data[key]||[])];list[index]=!list[index];updateField(key,list)};
  const tabs=[['ficha','FICHA'],['contratacao','CONTRATAÇÃO'],['veiculo','VEÍCULO'],['notas','NOTAS']];
  return <div className="rz-sheet">
    <div className="rz-head"><div className="rz-eyebrow">ROTA ZERO DELIVERY CO. // EMPLOYEE FILE</div><div className="rz-title">FICHA DE FUNCIONÁRIO</div></div>
    <nav className="rz-tabs no-print">{tabs.map(([id,label])=><button key={id} className={tab===id?'on':''} onClick={()=>setTab(id)}>{label}</button>)}</nav>
    <div className="rz-content">

    {tab==='ficha'&&<>
      <Panel title="FORMULÁRIO RZ-01 // IDENTIFICAÇÃO">
        <div className="rz-grid">
          <div><div className="rz-portrait">{data.bio?.imagem?<img src={data.bio.imagem} alt="Foto / crachá"/>:<span className="rz-note">FOTO / CRACHÁ</span>}</div><div className="rz-actions" style={{marginTop:8}}><label className="rz-btn" style={{cursor:'pointer'}}>FOTO<input type="file" accept="image/*" hidden onChange={handlePortrait}/></label><button className="rz-btn secondary" onClick={()=>updateField('bio.imagem','')}>REMOVER</button></div></div>
          <div className="rz-grid two" style={{gridColumn:'span 2'}}><Field label="Nome"><input value={data.bio?.nome||''} onChange={e=>updateField('bio.nome',e.target.value)}/></Field><Field label="Jogador"><input value={data.bio?.jogador||''} onChange={e=>updateField('bio.jogador',e.target.value)}/></Field><Field label="Conceito"><input value={data.bio?.conceito||''} onChange={e=>updateField('bio.conceito',e.target.value)}/></Field><Field label="Função / Kit"><input value={data.bio?.kit||''} onChange={e=>updateField('bio.kit',e.target.value)}/></Field></div>
        </div>
      </Panel>
      <Panel title="ATRIBUTOS & RECURSOS" right={<span className="rz-tag">{costs.remaining} CR restantes</span>}>
        <div className="rz-grid">{[['pulso','PULSO (P)'],['tecnica','TÉCNICA (T)'],['firmeza','FIRMEZA (F)']].map(([k,label])=><div className="rz-attr" key={k}><strong>{label}</strong><input type="number" min="1" max="3" value={attrs[k]??1} onChange={e=>setAttr(k,e.target.value)}/></div>)}</div>
        <div className="rz-grid" style={{marginTop:10}}><Field label={'Adrenalina / '+(res.adrenalina?.max??0)}><input type="number" value={res.adrenalina?.atual??0} onChange={e=>updateField('recursos.adrenalina.atual',clamp(e.target.value,0,res.adrenalina?.max||99))}/></Field><Field label={'Foco / '+(res.foco?.max??0)}><input type="number" value={res.foco?.atual??0} onChange={e=>updateField('recursos.foco.atual',clamp(e.target.value,0,res.foco?.max||99))}/></Field><Field label={'Vitalidade / '+(res.vitalidade?.max??0)}><input type="number" value={res.vitalidade?.atual??0} onChange={e=>updateField('recursos.vitalidade.atual',clamp(e.target.value,0,res.vitalidade?.max||99))}/></Field></div>
        <p className="rz-note" style={{marginTop:8}}>Máximos automáticos: ADR = Pulso; FOC = Técnica x5; VIT = Firmeza x5.</p>
      </Panel>
      <div className="rz-grid"><Panel title="PÂNICO"><div className="rz-track">{(data.panico||[]).map((v,i)=><button key={i} className={v?'':'off'} onClick={()=>toggleTrack('panico',i)}/>)}</div></Panel><Panel title="TRAUMAS"><div className="rz-track">{(data.traumas||[]).map((v,i)=><button key={i} className={v?'':'off'} onClick={()=>toggleTrack('traumas',i)}/>)}</div></Panel><Panel title="INTERFERÊNCIA 0-6"><input className="rz-input" type="number" min="0" max="6" value={data.interferencia??0} onChange={e=>updateField('interferencia',clamp(e.target.value,0,6))}/></Panel></div>
      <div className="rz-grid two"><Panel title="PERÍCIAS"><div style={{display:'grid',gap:7}}>{RZ_SKILLS.filter(([id])=>data.pericias?.[id]).map(([id,nome])=><span className="rz-tag" key={id}>{nome}</span>)}</div>{!RZ_SKILLS.some(([id])=>data.pericias?.[id])&&<p className="rz-note">Nenhuma Perícia comprada. Use CONTRATAÇÃO.</p>}</Panel><Panel title="VANTAGENS / DEFEITOS"><div style={{display:'grid',gap:7}}>{(data.vantagens||[]).map(id=><span className="rz-tag" key={id}>+ {RZ_ADVANTAGES.find(x=>x.id===id)?.nome||id}</span>)}{(data.defeitos||[]).map(id=><span className="rz-tag" key={id}>- {RZ_DEFECTS.find(x=>x.id===id)?.nome||id}</span>)}</div></Panel></div>
      <Panel title="INVENTÁRIO - 4 ESPAÇOS (ITEM VOLUMOSO USA 2)"><div className="rz-grid two">{[0,1,2,3].map(i=><Field key={i} label={'Espaço '+(i+1)}><input value={data.inventario?.[i]||''} onChange={e=>updateField('inventario.'+i,e.target.value)}/></Field>)}</div></Panel>
      <div className="rz-grid two"><Panel title="ÂNCORA"><Field label="Algo que lembra quem você é quando o Pânico cresce"><textarea value={data.ancora||''} onChange={e=>updateField('ancora',e.target.value)}/></Field></Panel><Panel title="TRAUMAS / GATILHOS / NOTAS"><Field label="Notas"><textarea value={data.notas||''} onChange={e=>updateField('notas',e.target.value)}/></Field></Panel></div>
    </>}

    {tab==='contratacao'&&<>
      <div className="rz-credit"><span>BASE <b>6 CR</b></span><span>DEFEITOS +<b>{costs.defectGain}</b></span><span>ATRIBUTOS -<b>{costs.attrCost}</b></span><span>PERÍCIAS -<b>{costs.skillCost}</b></span><span>VANTAGENS -<b>{costs.advantageCost}</b></span><span>RESTANTE <b className={costs.remaining<0?'bad':''}>{costs.remaining}</b></span></div>
      <Panel title="KITS DE FUNÇÃO // ATALHOS"><div className="rz-grid">{RZ_KITS.map(k=><button key={k.id} className="rz-btn secondary" onClick={()=>applyKit(k)} style={{textAlign:'left'}}><b>{k.nome}</b><br/><span className="rz-note">{k.item}</span></button>)}</div><p className="rz-note" style={{marginTop:10}}>Kit não é classe; é só uma sugestão de gasto dos 6 Créditos de Contratação.</p></Panel>
      <Panel title="PERÍCIAS // 1 CRÉDITO CADA"><table className="rz-table"><thead><tr><th>Sel.</th><th>Perícia</th><th>Serve para</th><th>Custo</th></tr></thead><tbody>{RZ_SKILLS.map(([id,nome,desc])=><tr key={id}><td><input type="checkbox" checked={!!data.pericias?.[id]} onChange={e=>updateField('pericias.'+id,e.target.checked)}/></td><td><b>{nome}</b></td><td>{desc}</td><td>1 CR</td></tr>)}</tbody></table></Panel>
      <Panel title="VANTAGENS // 1 OU 2 CRÉDITOS"><table className="rz-table"><thead><tr><th>Sel.</th><th>Vantagem</th><th>Tipo / efeito</th><th>Custo</th></tr></thead><tbody>{RZ_ADVANTAGES.map(v=><tr key={v.id}><td><input type="checkbox" checked={(data.vantagens||[]).includes(v.id)} onChange={e=>toggleList('vantagens',v.id,e.target.checked)}/></td><td><b>{v.nome}</b></td><td>{v.tipo} - {v.efeito}</td><td>{v.custo} CR</td></tr>)}</tbody></table></Panel>
      <Panel title="DEFEITOS // +1 CRÉDITO, MÁXIMO 2"><table className="rz-table"><thead><tr><th>Sel.</th><th>Defeito</th><th>Efeito</th><th>Ganho</th></tr></thead><tbody>{RZ_DEFECTS.map(v=><tr key={v.id}><td><input type="checkbox" disabled={!(data.defeitos||[]).includes(v.id)&&(data.defeitos||[]).length>=2} checked={(data.defeitos||[]).includes(v.id)} onChange={e=>toggleList('defeitos',v.id,e.target.checked)}/></td><td><b>{v.nome}</b></td><td>{v.efeito}</td><td>+1 CR</td></tr>)}</tbody></table></Panel>
    </>}

    {tab==='veiculo'&&<>
      <div className="rz-vehicle-switch"><div><b>FICHA DE VEÍCULO RZ-02</b><div className="rz-note">Opcional, como a Montaria em O Som das Seis. Fica dentro desta ficha.</div></div><label className="rz-pick"><input type="checkbox" checked={!!data.veiculoAtivo} onChange={e=>updateField('veiculoAtivo',e.target.checked)}/><b>{data.veiculoAtivo?'ATIVO':'DESATIVADO'}</b></label></div>
      {data.veiculoAtivo&&<>
        <Panel title="IDENTIFICAÇÃO DO VEÍCULO"><div className="rz-grid"><Field label="Veículo / apelido"><input value={data.veiculo?.nome||''} onChange={e=>updateField('veiculo.nome',e.target.value)}/></Field><Field label="Modelo"><input value={data.veiculo?.modelo||''} onChange={e=>updateField('veiculo.modelo',e.target.value)}/></Field><Field label="Placa / ID"><input value={data.veiculo?.placaId||''} onChange={e=>updateField('veiculo.placaId',e.target.value)}/></Field></div></Panel>
        <Panel title="MANEJO / TRAÇÃO / CASCO"><div className="rz-grid">{[['manejo','Manejo'],['tracao','Tração'],['casco','Casco']].map(([k,n])=><Field key={k} label={n}><input type="number" min="1" max="3" value={data.veiculo?.[k]??2} onChange={e=>updateField('veiculo.'+k,clamp(e.target.value,1,3))}/></Field>)}</div></Panel>
        <Panel title="TRILHAS"><div className="rz-grid">{[['combustivel','Combustível',6],['integridade','Integridade',6],['aquecimento','Aquecimento',4]].map(([k,n,max])=><Field key={k} label={n+' / '+max}><input type="number" min="0" max={max} value={data.veiculo?.[k]??max} onChange={e=>updateField('veiculo.'+k,clamp(e.target.value,0,max))}/></Field>)}</div></Panel>
        <div className="rz-grid two"><Panel title="CARGA / COMPARTIMENTOS"><Field label="Carga"><textarea value={data.veiculo?.cargaCompartimentos||''} onChange={e=>updateField('veiculo.cargaCompartimentos',e.target.value)}/></Field></Panel><Panel title="UPGRADES / SLOTS"><Field label="Upgrades"><textarea value={data.veiculo?.upgradesSlots||''} onChange={e=>updateField('veiculo.upgradesSlots',e.target.value)}/></Field></Panel></div>
        <Panel title="AVARIAS / REPAROS / OBSERVAÇÕES"><Field label="Registro"><textarea value={data.veiculo?.avariasReparos||''} onChange={e=>updateField('veiculo.avariasReparos',e.target.value)}/></Field></Panel>
      </>}
    </>}

    {tab==='notas'&&<Panel title="ARQUIVO PESSOAL"><Field label="Traumas / gatilhos / notas"><textarea rows="14" value={data.notas||''} onChange={e=>updateField('notas',e.target.value)}/></Field></Panel>}
    </div>
  </div>;
}