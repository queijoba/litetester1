import React,{useEffect,useState} from 'react';
import {ROTA_ZERO_THREAT_CATEGORIES,ROTA_ZERO_THREAT_ROLES} from '../threatData.js';
import {RZ_SKILLS} from '../data.js';

const entry=(data,key,empty={})=>Array.isArray(data?.[key])?data[key]:[];
const Box=({title,help,children})=><section className="rz-threat-box">
 <header><h2>{title}</h2>{help&&<small>{help}</small>}</header><div className="rz-threat-box__body">{children}</div></section>;
const Field=({label,children})=><label className="rz-threat-field"><span>{label}</span>{children}</label>;
const NumberField=({label,value,onChange,min=0,max=999})=><Field label={label}><input type="number" min={min} max={max} value={value??0} onChange={e=>onChange(Math.max(min,Math.min(max,Number(e.target.value)||0)))}/></Field>;
const Entries=({title,items,onChange,extra=false})=><Box title={title}><div className="rz-threat-list">
 {(items||[]).map((item,i)=><div key={i} className="rz-threat-entry">
  <label><span>Nome</span><input value={item.nome||''} onChange={e=>onChange(items.map((v,j)=>i===j?{...v,nome:e.target.value}:v))}/></label>
  {extra&&<label><span>Dano / custo</span><input value={item.dano||''} onChange={e=>onChange(items.map((v,j)=>i===j?{...v,dano:e.target.value}:v))} placeholder="Ex.: 1d6 (opcional)"/></label>}
  <label className="rz-threat-entry__description"><span>Efeito / descrição</span><textarea rows="2" value={item.desc||''} onChange={e=>onChange(items.map((v,j)=>i===j?{...v,desc:e.target.value}:v))}/></label>
  <button type="button" onClick={()=>onChange(items.filter((_,j)=>i!==j))} aria-label={'Remover '+(item.nome||title)}>Remover</button>
 </div>)}
 <button type="button" className="rz-threat-add" onClick={()=>onChange([...(items||[]),{nome:'',desc:'',...(extra?{dano:''}:{})}])}>+ Adicionar {title.toLowerCase()}</button>
 </div></Box>;
export default function RotaZeroThreatEditor({scope}){
 const {data,updateField,optimizeImageFile,showToast}=scope;
 const [tab,setTab]=useState('ficha');
 useEffect(()=>{setTab('ficha')},[data?.id]);
 if(data?.system!=='rotaZero'||data?.type==='pc')return null;
 const attrs=data.atributos||{},res=data.recursos||{};
 const change=(key,value)=>updateField(key,value);
 const updateImage=async e=>{
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  try{const src=await optimizeImageFile(file,900,.82);change('imagem',src);showToast('Retrato da ameaça atualizado.')}
  catch(err){console.error(err);showToast('Não foi possível abrir a imagem.')}
 };
 const recalc=()=>change('recursos.vitalidade',{atual:Number(attrs.firmeza||0)*5,max:Number(attrs.firmeza||0)*5});
 const tabs=[['ficha','Identidade'],['combate','Confronto'],['recursos','Recursos'],['notas','Notas']];
 return <div className="rz-threat-editor">
  <div className="rz-threat-intro"><small>RZ // REGISTRO DE CAMPO</small><h2>AMEAÇA / NPC</h2><p>Ficha para criaturas, anomalias, personagens hostis e eventos da Rota Zero. Estatísticas definidas pelo mestre.</p></div>
  <nav aria-label="Abas da ameaça Rota Zero" className="rz-threat-tabs">{tabs.map(([id,label])=><button key={id} type="button" onClick={()=>setTab(id)} aria-current={tab===id?'page':undefined} className={tab===id?'is-active':''}>{label}</button>)}</nav>
  {tab==='ficha'&&<>
   <Box title="Identificação" help="Dados exibidos no card; notas privadas ficam na aba Notas.">
    <div className="rz-threat-identity">
     <div className="rz-threat-portrait">{data.imagem?<img src={data.imagem} alt="Retrato da ameaça"/>:<div>◈</div>}<label>Escolher imagem<input type="file" accept="image/*" onChange={updateImage}/></label></div>
     <div className="rz-threat-fields">
      <Field label="Nome"><input value={data.nome||''} onChange={e=>change('nome',e.target.value)} placeholder="Nome ou codinome"/></Field>
      <Field label="Registro"><input value={data.codigo||''} onChange={e=>change('codigo',e.target.value)} placeholder="ID / anomalia (opcional)"/></Field>
      <Field label="Categoria"><select value={data.categoria||'Anomalia'} onChange={e=>change('categoria',e.target.value)}>{ROTA_ZERO_THREAT_CATEGORIES.map(x=><option key={x}>{x}</option>)}</select></Field>
      <Field label="Papel"><select value={data.papel||'Comum'} onChange={e=>change('papel',e.target.value)}>{ROTA_ZERO_THREAT_ROLES.map(x=><option key={x}>{x}</option>)}</select></Field>
      <Field label="Descrição pública"><textarea rows="3" value={data.descricao||''} onChange={e=>change('descricao',e.target.value)} placeholder="Aparência e comportamento observável..."/></Field>
     </div>
    </div>
   </Box>
   <Box title="Atributos"><div className="rz-threat-stats">{[['pulso','Pulso'],['firmeza','Firmeza'],['tecnica','Técnica']].map(([id,label])=><NumberField key={id} label={label} value={attrs[id]} max={10} onChange={v=>change('atributos.'+id,v)}/>)}</div></Box>
   <Box title="Perícias" help="Marque apenas as perícias que esta ameaça possui."><div className="rz-threat-skills">{RZ_SKILLS.map(([id,label])=><label key={id}><input type="checkbox" checked={!!data.pericias?.[id]} onChange={e=>change('pericias.'+id,e.target.checked)}/>{label}</label>)}</div></Box>
  </>}
  {tab==='combate'&&<>
   <Box title="Defesa e recursos"><div className="rz-threat-stats"><NumberField label="Defesa" value={data.defesa} onChange={v=>change('defesa',v)}/><NumberField label="Proteção" value={data.armadura} onChange={v=>change('armadura',v)}/><NumberField label="Pressão" value={data.pressao} onChange={v=>change('pressao',v)}/></div></Box>
   <Entries title="Ataques" extra items={entry(data,'ataques')} onChange={v=>change('ataques',v)}/>
   <Entries title="Habilidades" items={entry(data,'habilidades')} onChange={v=>change('habilidades',v)}/>
   <Entries title="Fraquezas" items={entry(data,'fraquezas')} onChange={v=>change('fraquezas',v)}/>
   <Entries title="Ações" items={entry(data,'acoes')} onChange={v=>change('acoes',v)}/>
  </>}
  {tab==='recursos'&&<>
   <Box title="Recursos" help="O mestre pode alterar os valores livremente; recalcular ajusta apenas Vitalidade.">
    <div className="rz-threat-stats">{[['vitalidade','VIT'],['foco','FOC'],['adrenalina','ADR']].map(([id,label])=><div key={id} className="rz-threat-resource"><strong>{label}</strong><NumberField label="Atual" value={res[id]?.atual} onChange={v=>change('recursos.'+id+'.atual',v)}/><NumberField label="Máximo" value={res[id]?.max} onChange={v=>change('recursos.'+id+'.max',v)}/></div>)}</div>
    <button type="button" onClick={recalc} className="rz-threat-add">Recalcular VIT = Firmeza × 5</button>
   </Box>
   <Box title="Pressão e ambiente"><div className="rz-threat-stats"><NumberField label="Pânico" value={data.panico} max={4} onChange={v=>change('panico',v)}/><NumberField label="Calor" value={data.calor} max={4} onChange={v=>change('calor',v)}/></div></Box>
  </>}
  {tab==='notas'&&<Box title="Anotações privadas"><textarea rows="10" value={data.notas||''} onChange={e=>change('notas',e.target.value)} placeholder="Motivação, segredos e instruções exclusivas do mestre..."/></Box>}
  <p className="rz-threat-hint">Use <strong>Salvar</strong> na barra superior do PJLite. O card pode ser exportado em PNG normal, térmico 58 mm ou 80 mm.</p>
 </div>;
}
