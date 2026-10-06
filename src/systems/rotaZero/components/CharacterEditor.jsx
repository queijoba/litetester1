import * as React from 'react';
import '../rota-zero.css';
import { RZ_SKILLS, RZ_ADVANTAGES, RZ_DEFECTS, RZ_KITS, calcRotaZeroCosts, syncRotaZeroResources } from '../data.js';

const { useEffect, useState } = React;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));
const Field=({label,children,className=''})=><label className={'rz-field '+className}><span>{label}</span>{children}</label>;
const Panel=({title,right,children,className=''})=><section className={'rz-panel '+className}><header><h2>{title}</h2>{right}</header><div className="body">{children}</div></section>;

export default function RotaZeroCharacterEditor({scope}){
  const {data,updateField,setData,optimizeImageFile,showToast}=scope;
  const [tab,setTab]=useState('ficha');
  useEffect(()=>{
    if(data?.system!=='rotaZero')return;
    const hasBuild=Boolean(
      data.bio?.nome ||
      data.bio?.kit ||
      Object.values(data.pericias||{}).some(Boolean) ||
      (data.vantagens||[]).length ||
      (data.defeitos||[]).length
    );
    setTab(hasBuild?'ficha':'contratacao');
  },[data?.id]);
  if(!data||data.system!=='rotaZero'||data.type!=='pc')return null;

  const costs=calcRotaZeroCosts(data);
  const attrs=data.atributos||{};
  const res=data.recursos||{};
  const vehicle=data.veiculo||{};

  const setAttr=(key,value)=>{
    const n=clamp(value,1,3);
    setData(prev=>{
      if(!prev||prev.system!=='rotaZero') return prev;
      return syncRotaZeroResources({
        ...prev,
        atributos:{...(prev.atributos||{}),[key]:n}
      });
    });
  };
  const stepAttr=(key,delta)=>setAttr(key,(Number(attrs[key])||1)+delta);
  const toggleList=(key,id,on)=>{
    const list=Array.isArray(data[key])?[...data[key]]:[];
    const next=on?[...new Set([...list,id])]:list.filter(x=>x!==id);
    updateField(key,next);
    if(key==='vantagens'){
      const synced=syncRotaZeroResources({...data,[key]:next});
      updateField('recursos.foco',synced.recursos.foco);
      updateField('recursos.vitalidade',synced.recursos.vitalidade);
    }
  };
  const applyKit=(kit)=>{
    const skills={}; RZ_SKILLS.forEach(([id])=>skills[id]=kit.skills.includes(id));
    setData(prev=>{
      if(!prev||prev.system!=='rotaZero') return prev;
      const next={
        ...prev,
        bio:{...(prev.bio||{}),kit:kit.nome},
        atributos:{...(prev.atributos||{}),...kit.attrs},
        pericias:skills,
        vantagens:[...(kit.advantages||[])],
        inventario:[kit.item||'',...((prev.inventario||[]).slice(1))]
      };
      return syncRotaZeroResources(next);
    });
    showToast('Kit '+kit.nome+' aplicado. Confira os Créditos antes de salvar.');
  };
  const handlePortrait=async(e)=>{
    const file=e.target.files?.[0];e.target.value='';
    if(!file)return;
    try{const img=await optimizeImageFile(file,900,.84);updateField('bio.imagem',img)}
    catch{showToast('Não foi possível usar essa imagem.')}
  };
  const toggleTrack=(key,index)=>{
    const list=[...(data[key]||[])];
    list[index]=!list[index];
    updateField(key,list);
  };
  const tabs=[['ficha','FICHA'],['contratacao','CONTRATAÇÃO'],['veiculo','VEÍCULO / TURNO'],['notas','NOTAS']];

  return <div className="rz-sheet">
    <div className="rz-head">
      <div className="rz-eyebrow">ROTA ZERO DELIVERY CO. // EMPLOYEE DOSSIER RZ-01</div>
      <div className="rz-title">FICHA DE FUNCIONÁRIO</div>
      <div className="rz-head-stamp">ARQUIVO INTERNO // NÃO RESPONDA AO RÁDIO SE ELE USAR SEU NOME</div>
    </div>

    <nav className="rz-tabs no-print">{tabs.map(([id,label])=><button key={id} className={tab===id?'on':''} onClick={()=>setTab(id)}>{label}</button>)}</nav>
    <div className="rz-content">

    {tab==='ficha'&&<>
      <Panel title="FORMULÁRIO RZ-01 // IDENTIFICAÇÃO" right={<span className="rz-tag">REGISTRO ATIVO</span>} className="rz-id-panel">
        <div className="rz-identification">
          <div className="rz-id-photo">
            <div className="rz-portrait">{data.bio?.imagem?<img src={data.bio.imagem} alt="Foto / crachá"/>:<span className="rz-note">FOTO / CRACHÁ</span>}</div>
            <div className="rz-actions rz-photo-actions">
              <label className="rz-btn" style={{cursor:'pointer'}}>FOTO<input type="file" accept="image/*" hidden onChange={handlePortrait}/></label>
              <button className="rz-btn secondary" onClick={()=>updateField('bio.imagem','')}>REMOVER</button>
            </div>
          </div>

          <div className="rz-id-main">
            <div className="rz-grid two rz-bio-grid">
              <Field label="Nome do funcionário"><input value={data.bio?.nome||''} onChange={e=>updateField('bio.nome',e.target.value)}/></Field>
              <Field label="Jogador / Conta"><input value={data.bio?.jogador||''} onChange={e=>updateField('bio.jogador',e.target.value)}/></Field>
              <Field label="Idade / registro"><input value={data.bio?.idade||''} onChange={e=>updateField('bio.idade',e.target.value)}/></Field>
              <Field label="Função / Kit"><input value={data.bio?.kit||''} onChange={e=>updateField('bio.kit',e.target.value)}/></Field>
              <Field label="Conceito operacional" className="rz-span-2"><input value={data.bio?.conceito||''} onChange={e=>updateField('bio.conceito',e.target.value)}/></Field>
            </div>

            <div className="rz-attr-strip" aria-label="Atributos de Rota Zero">
              {[['pulso','PULSO','P'],['tecnica','TÉCNICA','T'],['firmeza','FIRMEZA','F']].map(([k,label,short])=>
                <div className="rz-attr" key={k}>
                  <div className="rz-attr-code">{short}</div>
                  <div className="rz-attr-name">{label}</div>
                  <div className="rz-attr-control"><button type="button" className="rz-step" onClick={()=>stepAttr(k,-1)} disabled={(Number(attrs[k])||1)<=1}>-</button><input aria-label={label} type="number" min="1" max="3" value={attrs[k]??1} onChange={e=>setAttr(k,e.target.value)}/><button type="button" className="rz-step" onClick={()=>stepAttr(k,1)} disabled={(Number(attrs[k])||1)>=3}>+</button></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="RECURSOS OPERACIONAIS" right={<span className="rz-tag">{costs.remaining} CR restantes</span>}>
        <div className="rz-resource-grid">
          <Field label={'Adrenalina / '+(res.adrenalina?.max??0)}><input type="number" value={res.adrenalina?.atual??0} onChange={e=>updateField('recursos.adrenalina.atual',clamp(e.target.value,0,res.adrenalina?.max||99))}/></Field>
          <Field label={'Foco / '+(res.foco?.max??0)}><input type="number" value={res.foco?.atual??0} onChange={e=>updateField('recursos.foco.atual',clamp(e.target.value,0,res.foco?.max||99))}/></Field>
          <Field label={'Vitalidade / '+(res.vitalidade?.max??0)}><input type="number" value={res.vitalidade?.atual??0} onChange={e=>updateField('recursos.vitalidade.atual',clamp(e.target.value,0,res.vitalidade?.max||99))}/></Field>
          <div className="rz-resource-note">ADR = Pulso<br/>FOC = Técnica × 5<br/>VIT = Firmeza × 5</div>
        </div>
      </Panel>

      <div className="rz-status-row">
        <Panel title="PÂNICO"><div className="rz-track">{(data.panico||[]).map((v,i)=><button key={i} className={v?'':'off'} onClick={()=>toggleTrack('panico',i)}/>)}</div></Panel>
        <Panel title="TRAUMAS"><div className="rz-track">{(data.traumas||[]).map((v,i)=><button key={i} className={v?'':'off'} onClick={()=>toggleTrack('traumas',i)}/>)}</div></Panel>
        <Panel title="INTERFERÊNCIA 0-6"><input className="rz-input rz-interference" type="number" min="0" max="6" value={data.interferencia??0} onChange={e=>updateField('interferencia',clamp(e.target.value,0,6))}/></Panel>
      </div>

      <div className="rz-grid two">
        <Panel title="PERÍCIAS"><div className="rz-chip-list">{RZ_SKILLS.filter(([id])=>data.pericias?.[id]).map(([id,nome])=><span className="rz-tag" key={id}>{nome}</span>)}</div>{!RZ_SKILLS.some(([id])=>data.pericias?.[id])&&<p className="rz-note">Nenhuma Perícia comprada. Use CONTRATAÇÃO.</p>}</Panel>
        <Panel title="VANTAGENS / DEFEITOS"><div className="rz-chip-list">{(data.vantagens||[]).map(id=><span className="rz-tag positive" key={id}>+ {RZ_ADVANTAGES.find(x=>x.id===id)?.nome||id}</span>)}{(data.defeitos||[]).map(id=><span className="rz-tag negative" key={id}>− {RZ_DEFECTS.find(x=>x.id===id)?.nome||id}</span>)}</div></Panel>
      </div>

      <Panel title="INVENTÁRIO // 4 ESPAÇOS"><div className="rz-grid two">{[0,1,2,3].map(i=><Field key={i} label={'Espaço '+(i+1)}><input value={data.inventario?.[i]||''} onChange={e=>updateField('inventario.'+i,e.target.value)}/></Field>)}</div></Panel>
      <div className="rz-grid two">
        <Panel title="ÂNCORA"><Field label="Algo que lembra quem você é quando o Pânico cresce"><textarea value={data.ancora||''} onChange={e=>updateField('ancora',e.target.value)}/></Field></Panel>
        <Panel title="TRAUMAS / GATILHOS / NOTAS"><Field label="Notas"><textarea value={data.notas||''} onChange={e=>updateField('notas',e.target.value)}/></Field></Panel>
      </div>
    </>}

    {tab==='contratacao'&&<>
      <div className="rz-contract-summary">
        <div className="rz-credit-summary">
          <span className="rz-contract-kicker">CRÉDITOS DE CONTRATAÇÃO</span>
          <strong>{costs.remaining}</strong><small>restantes de {costs.available}</small>
          <button type="button" className={'rz-overtime-toggle '+(data.contratacao?.horaExtra?'on':'')} onClick={()=>updateField('contratacao.horaExtra',!data.contratacao?.horaExtra)}>HORA EXTRA</button>
        </div>
        <div className="rz-contract-copy">
          <p>Comece com P/T/F 1. Gaste 6 CR em Atributos, Perícias e Vantagens. Até 2 Defeitos devolvem +1 CR cada.</p>
          {data.contratacao?.horaExtra&&<div className="rz-overtime-box"><div><b>Créditos extras de campanha</b><span>Para grupos que começam acima do nível de contratação comum.</span></div><div className="rz-overtime-step"><button type="button" className="rz-step" onClick={()=>updateField('contratacao.creditosExtras',Math.max(0,(Number(data.contratacao?.creditosExtras)||0)-1))}>-</button><input type="number" min="0" max="99" value={data.contratacao?.creditosExtras??0} onChange={e=>updateField('contratacao.creditosExtras',Math.max(0,Math.min(99,Number(e.target.value)||0)))}/><button type="button" className="rz-step" onClick={()=>updateField('contratacao.creditosExtras',Math.min(99,(Number(data.contratacao?.creditosExtras)||0)+1))}>+</button></div></div>}
        </div>
      </div>
      <div className="rz-credit"><span>BASE <b>6</b></span><span>DEFEITOS +<b>{costs.defectGain}</b></span>{data.contratacao?.horaExtra&&<span>HORA EXTRA +<b>{costs.extraCredits}</b></span>}<span>ATRIBUTOS −<b>{costs.attrCost}</b></span><span>PERÍCIAS −<b>{costs.skillCost}</b></span><span>VANTAGENS −<b>{costs.advantageCost}</b></span><span>RESTAM <b className={costs.remaining<0?'bad':''}>{costs.remaining}</b></span></div>

      <Panel title="KITS DE FUNÇÃO // ATALHOS"><div className="rz-grid rz-kits">{RZ_KITS.map(k=><button key={k.id} className="rz-btn secondary" onClick={()=>applyKit(k)}><b>{k.nome}</b><span className="rz-note">{k.item}</span></button>)}</div></Panel>

      <Panel title="PERÍCIAS // 1 CRÉDITO CADA">
        <div className="rz-table-wrap"><table className="rz-table rz-table-compact"><thead><tr><th>Sel.</th><th>Perícia</th><th>Serve para</th><th>CR</th></tr></thead><tbody>{RZ_SKILLS.map(([id,nome,desc])=><tr key={id}><td><input type="checkbox" checked={!!data.pericias?.[id]} onChange={e=>updateField('pericias.'+id,e.target.checked)}/></td><td><b>{nome}</b></td><td>{desc}</td><td>1</td></tr>)}</tbody></table></div>
      </Panel>

      <Panel title="VANTAGENS // 1 OU 2 CRÉDITOS">
        <div className="rz-table-wrap"><table className="rz-table rz-table-compact"><thead><tr><th>Sel.</th><th>Vantagem</th><th>Tipo / efeito</th><th>CR</th></tr></thead><tbody>{RZ_ADVANTAGES.map(v=><tr key={v.id}><td><input type="checkbox" checked={(data.vantagens||[]).includes(v.id)} onChange={e=>toggleList('vantagens',v.id,e.target.checked)}/></td><td><b>{v.nome}</b></td><td>{v.tipo} — {v.efeito}</td><td>{v.custo}</td></tr>)}</tbody></table></div>
      </Panel>

      <Panel title="DEFEITOS // +1 CRÉDITO, MÁXIMO 2">
        <div className="rz-table-wrap"><table className="rz-table rz-table-compact"><thead><tr><th>Sel.</th><th>Defeito</th><th>Efeito</th><th>Ganho</th></tr></thead><tbody>{RZ_DEFECTS.map(v=><tr key={v.id}><td><input type="checkbox" disabled={!(data.defeitos||[]).includes(v.id)&&(data.defeitos||[]).length>=2} checked={(data.defeitos||[]).includes(v.id)} onChange={e=>toggleList('defeitos',v.id,e.target.checked)}/></td><td><b>{v.nome}</b></td><td>{v.efeito}</td><td>+1</td></tr>)}</tbody></table></div>
      </Panel>
    </>}

    {tab==='veiculo'&&<>
      <div className="rz-vehicle-switch">
        <div><b>INCLUIR VEÍCULO NA FICHA</b><div className="rz-note">Módulo RZ-02 opcional. O veículo fica anexado ao funcionário e registra tanto a máquina quanto o turno.</div></div>
        <label className="rz-pick"><input type="checkbox" checked={!!data.veiculoAtivo} onChange={e=>updateField('veiculoAtivo',e.target.checked)}/><b>{data.veiculoAtivo?'ON / ATIVO':'OFF / DESATIVADO'}</b></label>
      </div>

      {data.veiculoAtivo&&<>
        <Panel title="RZ-02 // IDENTIFICAÇÃO DO VEÍCULO">
          <div className="rz-grid">
            <Field label="Veículo / apelido"><input value={vehicle.nome||''} onChange={e=>updateField('veiculo.nome',e.target.value)}/></Field>
            <Field label="Modelo"><input value={vehicle.modelo||''} onChange={e=>updateField('veiculo.modelo',e.target.value)}/></Field>
            <Field label="Placa / ID"><input value={vehicle.placaId||''} onChange={e=>updateField('veiculo.placaId',e.target.value)}/></Field>
          </div>
          <div className="rz-vehicle-attributes">
            {[['manejo','MANEJO'],['tracao','TRAÇÃO'],['casco','CASCO']].map(([k,n])=><div className="rz-vehicle-attr" key={k}><span>{n}</span><input type="number" min="1" max="3" value={vehicle[k]??2} onChange={e=>updateField('veiculo.'+k,clamp(e.target.value,1,3))}/></div>)}
          </div>
        </Panel>

        <Panel title="PAINEL DE BORDO">
          <div className="rz-dashboard">
            {[['combustivel','COMBUSTÍVEL',6],['integridade','INTEGRIDADE',6],['aquecimento','AQUECIMENTO',4]].map(([k,n,max])=>
              <div className="rz-gauge" key={k}><span>{n}</span><strong>{vehicle[k]??max}/{max}</strong><input type="range" min="0" max={max} value={vehicle[k]??max} onChange={e=>updateField('veiculo.'+k,clamp(e.target.value,0,max))}/></div>
            )}
          </div>
        </Panel>

        <Panel title="TURNO / ROTA / ENTREGA">
          <div className="rz-grid">
            <Field label="Entregas concluídas"><input type="number" min="0" value={vehicle.entregas??0} onChange={e=>updateField('veiculo.entregas',Math.max(0,Number(e.target.value)||0))}/></Field>
            <Field label="Tempo / horário"><input value={vehicle.tempoTurno||''} onChange={e=>updateField('veiculo.tempoTurno',e.target.value)}/></Field>
            <Field label="Despesa do turno"><input value={vehicle.despesas||''} onChange={e=>updateField('veiculo.despesas',e.target.value)}/></Field>
            <Field label="Rota atual" className="rz-span-2"><input value={vehicle.rotaAtual||''} onChange={e=>updateField('veiculo.rotaAtual',e.target.value)}/></Field>
            <Field label="Destino"><input value={vehicle.destino||''} onChange={e=>updateField('veiculo.destino',e.target.value)}/></Field>
          </div>
          <div className="rz-grid two rz-vehicle-notes">
            <Field label="Desvios / rotas que não deveriam existir"><textarea value={vehicle.desvios||''} onChange={e=>updateField('veiculo.desvios',e.target.value)}/></Field>
            <Field label="Rádio / mensagens"><textarea value={vehicle.radioMensagens||''} onChange={e=>updateField('veiculo.radioMensagens',e.target.value)}/></Field>
          </div>
        </Panel>

        <div className="rz-grid two">
          <Panel title="CARGA / COMPARTIMENTOS"><Field label="Carga"><textarea value={vehicle.cargaCompartimentos||''} onChange={e=>updateField('veiculo.cargaCompartimentos',e.target.value)}/></Field></Panel>
          <Panel title="UPGRADES / SLOTS"><Field label="Upgrades"><textarea value={vehicle.upgradesSlots||''} onChange={e=>updateField('veiculo.upgradesSlots',e.target.value)}/></Field></Panel>
        </div>

        <div className="rz-grid two">
          <Panel title="PISTAS / INCIDENTES"><Field label="Registro"><textarea value={vehicle.pistasIncidentes||''} onChange={e=>updateField('veiculo.pistasIncidentes',e.target.value)}/></Field></Panel>
          <Panel title="AVARIAS / REPAROS"><Field label="Registro"><textarea value={vehicle.avariasReparos||''} onChange={e=>updateField('veiculo.avariasReparos',e.target.value)}/></Field></Panel>
        </div>
      </>}
    </>}

    {tab==='notas'&&<Panel title="ARQUIVO PESSOAL"><Field label="Traumas / gatilhos / notas"><textarea rows="12" value={data.notas||''} onChange={e=>updateField('notas',e.target.value)}/></Field></Panel>}
    </div>
  </div>;
}
