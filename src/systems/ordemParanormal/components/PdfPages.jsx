import React from 'react';
import {ORDEM_ATTRIBUTES,ORDEM_SKILLS} from '../data.js';

// Visualização de referência: os campos são os MESMOS da ficha digital;
// nenhuma conversão, sincronização paralela ou cópia de estado é criada.
const num=value=>{const n=Number(value);return Number.isFinite(n)?n:0;};
const T_ONLY=new Set(['adestramento','artes','ciencias','crime','ocultismo','pilotagem','profissao','religiao','tatica','tecnologia']);
const LOAD_PENALTY=new Set(['acrobacia','crime','furtividade']);
const ATTR_LABEL=Object.fromEntries(ORDEM_ATTRIBUTES.map(([id,short])=>[id,short]));
const shortDice=value=>num(value)<=0?'2d20 ↓':num(value)+'d20';
const totalLoad=items=>(items||[]).reduce((sum,x)=>sum+Math.max(0,num(x.espacos))*Math.max(0,num(x.quantidade??1)),0);

function SheetSection({title,subtitle,action,children,className=''}) {
 return <section className={'ordem-pdf-section '+className}>
   <div className="ordem-pdf-section-head"><div><h3>{title}</h3>{subtitle&&<small>{subtitle}</small>}</div>{action}</div>
   {children}
  </section>;
}
function PaperField({label,value,onChange,type='text',className='',placeholder='',readOnly=false,help,ariaLabel}) {
 return <label className={'ordem-pdf-field '+className}><span>{label}</span>
   <input aria-label={ariaLabel||label} type={type} value={value??''} placeholder={placeholder}
    onChange={onChange} readOnly={readOnly}/>
   {help&&<small>{help}</small>}
  </label>;
}
function PageHeading({page,title}) {
 return <header className="ordem-pdf-heading">
   <div className="ordem-pdf-wordmark"><span className="ordem-pdf-emblem" aria-hidden="true">O</span><div>
    <p>ORDEM PARANORMAL RPG · REGISTRO DE PERSONAGEM</p><h2>{title}</h2>
    <small>Modelo de consulta inspirado na ficha editável de Sobrevivendo ao Horror</small>
   </div></div>
   <div className="ordem-pdf-page-number">FOLHA <strong>{page}</strong> / 02</div>
  </header>;
}
function SkillTable({data,updateField}) {
 const a=data.atributos||{};
 return <SheetSection title="PERÍCIAS" subtitle="Treino + outros = bônus do teste">
   <div className="ordem-pdf-skill-scroll" role="region" aria-label="Tabela de perícias editável" tabIndex={0}>
    <table className="ordem-pdf-skills-table"><thead><tr>
     <th scope="col">Perícia</th><th scope="col">Atr.</th><th scope="col">Dados</th>
     <th scope="col">Treino</th><th scope="col">Outros</th><th scope="col">Bônus</th>
    </tr></thead><tbody>
    {ORDEM_SKILLS.map(([id,name,attr])=>{
      const x=data.pericias?.[id]||{};
      const current=ORDEM_ATTRIBUTES.some(([k])=>k===x.atributoBase)?x.atributoBase:attr;
      const bonus=num(x.grau)+num(x.outros);
      return <tr key={id}>
        <th scope="row" title={T_ONLY.has(id)?'Somente treinada':LOAD_PENALTY.has(id)?'Sujeita a penalidade de carga':''}>
         {name}{T_ONLY.has(id)?'*':''}{LOAD_PENALTY.has(id)?'†':''}
        </th>
        <td><select aria-label={'Atributo de '+name} value={current} onChange={e=>updateField('pericias.'+id+'.atributoBase',e.target.value)}>{ORDEM_ATTRIBUTES.map(([k,abbr])=><option key={k} value={k}>{abbr}</option>)}</select></td>
        <td className="ordem-pdf-dice">{shortDice(a[current])}</td>
        <td><select aria-label={'Treino de '+name} value={x.grau??0} onChange={e=>updateField('pericias.'+id+'.grau',num(e.target.value))}>
         {[0,5,10,15].map(v=><option key={v} value={v}>{v===0?'—':'+'+v}</option>)}</select></td>
        <td><input aria-label={'Outros bônus de '+name} type="number" value={x.outros??0} onChange={e=>updateField('pericias.'+id+'.outros',num(e.target.value))}/></td>
        <td className="ordem-pdf-skill-total">{bonus>=0?'+'+bonus:bonus}</td>
       </tr>;
    })}
    </tbody></table>
   </div>
   <p className="ordem-pdf-footnote">* Exige treinamento. † Pode sofrer penalidade de carga. Com atributo 0, role 2d20 e use o menor resultado.</p>
 </SheetSection>;
}
function AttackTable({data,patchArray,addArray,removeArray,onNavigate}) {
 const attacks=data.ataques||[];
 return <SheetSection title="ATAQUES" subtitle="Teste, dano, crítico, alcance e especial"
  action={<button className="ordem-pdf-action" type="button" onClick={()=>addArray('ataques',{nome:'',teste:'',dano:'',critico:'',alcance:'',tipo:'',municao:'',desc:''})}>+ Ataque</button>}>
  <div className="ordem-pdf-table-scroll" role="region" aria-label="Tabela de ataques editável" tabIndex={0}>
   <table className="ordem-pdf-attack-table"><thead><tr><th>Ataque</th><th>Teste</th><th>Dano</th><th>Crítico</th><th>Alcance</th><th>Especial</th><th/></tr></thead>
   <tbody>{attacks.map((x,i)=><tr key={i}>
    {[['nome','Arma ou ataque'],['teste','Teste'],['dano','Dano'],['critico','Crítico'],['alcance','Alcance'],['desc','Especial']].map(([field,name])=><td key={field}><input aria-label={name+' do ataque '+(i+1)} value={x[field]||''} placeholder={name} onChange={e=>patchArray('ataques',i,field,e.target.value)}/></td>)}
    <td><button type="button" className="ordem-pdf-delete" title={'Remover ataque '+(i+1)} aria-label={'Remover ataque '+(i+1)} onClick={()=>removeArray('ataques',i)}>×</button></td>
   </tr>)}
    {attacks.length===0&&<tr><td colSpan="7" className="ordem-pdf-blank-row">Nenhum ataque registrado. Use <strong>+ Ataque</strong> para preencher a linha.</td></tr>}
   </tbody></table>
  </div>
  <button className="ordem-pdf-text-link" type="button" onClick={()=>onNavigate('combate')}>Editar munição, tipo e detalhes avançados em Combate</button>
 </SheetSection>;
}
function AttributeRing({id,name,value,onChange}) {
 return <label className="ordem-pdf-attribute" data-ordem-attribute={id}><span>{name}</span><div className="ordem-pdf-attribute-ring">
   <input aria-label={name} type="number" min="0" value={value??1} onChange={e=>onChange(id,num(e.target.value))}/>
  </div><b>{ATTR_LABEL[id]}</b></label>;
}
function ResourceBox({label,current,max,kind,onChange}) {
 return <div className={'ordem-pdf-resource ordem-pdf-resource-'+kind}>
   <span>{label}</span><div className="ordem-pdf-resource-nums">
    <label><small>Atual</small><input aria-label={label+' atual'} type="number" value={current.value??0} onChange={e=>onChange(current.key,num(e.target.value))}/></label>
    <b>/</b>
    <label><small>Máximo</small><input aria-label={label+' máximo'} type="number" value={max.value??0} onChange={e=>onChange(max.key,num(e.target.value))}/></label>
   </div>
  </div>;
}
function Identity({data,updateField,onPhoto,onNavigate}) {
 const b=data.bio||{};
 return <SheetSection title="PERSONAGEM JOGADOR" className="ordem-pdf-identity-section">
   <div className="ordem-pdf-identity-content">
    <label className="ordem-pdf-mini-photo" title="Escolher retrato">
     {b.imagem?<img src={b.imagem} alt="Retrato do personagem"/>:<span>RETRATO</span>}
     <input type="file" accept="image/*" onChange={onPhoto} aria-label="Carregar retrato"/>
     <small>Alterar imagem</small>
    </label>
    <div className="ordem-pdf-identity-fields">
     <PaperField label="Personagem" value={b.nome} onChange={e=>updateField('bio.nome',e.target.value)} className="wide"/>
     <PaperField label="Jogador(a)" value={b.jogador} onChange={e=>updateField('bio.jogador',e.target.value)}/>
     <PaperField label="Origem" value={b.origem} onChange={e=>updateField('bio.origem',e.target.value)}/>
     <label className="ordem-pdf-field"><span>Classe</span><select value={b.classe||''} onChange={e=>updateField('bio.classe',e.target.value)}>
      <option value="">—</option><option>Combatente</option><option>Especialista</option><option>Ocultista</option><option>Sobrevivente</option>
     </select></label>
     <PaperField label="Trilha" value={b.trilha} onChange={e=>updateField('bio.trilha',e.target.value)}/>
     <PaperField label="Patente" value={b.patente} onChange={e=>updateField('bio.patente',e.target.value)}/>
     <PaperField label="NEX %" type="number" value={b.nex??5} onChange={e=>updateField('bio.nex',Math.max(0,num(e.target.value)))}/>
    </div>
   </div>
   <button className="ordem-pdf-text-link" type="button" onClick={()=>onNavigate('agente')}>Mais informações do agente, evolução e regras opcionais</button>
 </SheetSection>;
}
function AgentPage({data,updateField,patchArray,addArray,removeArray,onPhoto,onNavigate}) {
 const a=data.atributos||{},s=data.status||{},baseDef=10+num(a.agi)+num(s.defesaEquip)+num(s.defesaOutros);
 const pd=s.recursoMental==='pd';
 const resource=(name,kind,cur,max)=><ResourceBox key={kind} label={name} kind={kind}
  current={{key:cur,value:s[cur]}} max={{key:max,value:s[max]}} onChange={(key,value)=>updateField('status.'+key,value)}/>;
 return <div className="ordem-pdf-preview ordem-pdf-sheet" data-page="1">
   <PageHeading page="01" title="FICHA DE AGENTE"/>
   <div className="ordem-pdf-page1-layout">
    <div className="ordem-pdf-primary-column">
      <Identity data={data} updateField={updateField} onPhoto={onPhoto} onNavigate={onNavigate}/>
      <SheetSection title="ATRIBUTOS" subtitle="Cinco atributos fundamentais">
       <div className="ordem-pdf-attributes ordem-pdf-attributes--orbit" role="group" aria-label="Cinco atributos do agente, organizados ao redor do núcleo">
        <div className="ordem-pdf-attributes-core" aria-hidden="true"><span>ATRIBUTOS</span></div>
        {ORDEM_ATTRIBUTES.map(([id,,name])=><AttributeRing key={id} id={id} name={name} value={a[id]} onChange={(k,v)=>updateField('atributos.'+k,v)}/>)}
       </div>
      </SheetSection>
      <SheetSection title="PONTOS DO AGENTE" subtitle={pd?'Regra alternativa: Determinação':'Vida, Esforço e Sanidade'}>
       <div className="ordem-pdf-resources">{resource('PV','vida','pvAtual','pvMax')}
        {pd?resource('PD','determinacao','pdAtual','pdMax'):<>{resource('PE','esforco','peAtual','peMax')}{resource('SAN','sanidade','sanAtual','sanMax')}</>}</div>
       <p className="ordem-pdf-footnote">O recurso {pd?'PD':'PE e SAN'} segue a opção da aba Agente; mudar de visualização não apaga recursos guardados.</p>
      </SheetSection>
      <SheetSection title="DEFESA" subtitle="10 + AGI + equipamento + outros">
       <div className="ordem-pdf-defense">
        <PaperField label="Defesa total" type="number" value={baseDef} readOnly/>
        <PaperField label="Equipamento" type="number" value={s.defesaEquip??0} onChange={e=>updateField('status.defesaEquip',num(e.target.value))}/>
        <PaperField label="Outros" type="number" value={s.defesaOutros??0} onChange={e=>updateField('status.defesaOutros',num(e.target.value))}/>
        <PaperField label="Bloqueio" type="number" value={s.bloqueio??0} onChange={e=>updateField('status.bloqueio',num(e.target.value))}/>
        <PaperField label="Esquiva" type="number" value={s.esquiva??10} onChange={e=>updateField('status.esquiva',num(e.target.value))}/>
        <PaperField label="Desloc." value={s.deslocamento||''} onChange={e=>updateField('status.deslocamento',e.target.value)}/>
       </div>
       <div className="ordem-pdf-defense-footer">
        <PaperField label="Proteção / RD" value={data.protecao||''} onChange={e=>updateField('protecao',e.target.value)}/>
        <PaperField label="Resistências" value={data.resistencias||''} onChange={e=>updateField('resistencias',e.target.value)}/>
       </div>
      </SheetSection>
      <AttackTable data={data} patchArray={patchArray} addArray={addArray} removeArray={removeArray} onNavigate={onNavigate}/>
    </div>
    <div className="ordem-pdf-skills-column"><SkillTable data={data} updateField={updateField}/></div>
   </div>
   <footer className="ordem-pdf-footer"><span>ORDEM PARANORMAL · FICHA DIGITAL PJLITE</span><span>FOLHA 01 — AGENTE / PERÍCIAS / COMBATE</span></footer>
 </div>;
}
function ItemList({data,patchArray,addArray,removeArray}) {
 const items=data.inventario||[];
 return <SheetSection title="INVENTÁRIO" subtitle="Categorias, espaços e quantidades"
  action={<button type="button" className="ordem-pdf-action" onClick={()=>addArray('inventario',{nome:'',categoria:'0',espacos:1,quantidade:1,desc:''})}>+ Item</button>}>
  <div className="ordem-pdf-table-scroll" role="region" aria-label="Inventário editável" tabIndex={0}>
   <table className="ordem-pdf-inventory-table"><thead><tr><th>Item</th><th>Cat.</th><th>Esp.</th><th>Qtd.</th><th/></tr></thead>
   <tbody>{items.map((x,i)=><tr key={i}>
    <td><input aria-label={'Nome do item '+(i+1)} value={x.nome||''} onChange={e=>patchArray('inventario',i,'nome',e.target.value)}/></td>
    <td><input aria-label={'Categoria do item '+(i+1)} value={x.categoria??''} onChange={e=>patchArray('inventario',i,'categoria',e.target.value)}/></td>
    <td><input aria-label={'Espaços do item '+(i+1)} type="number" min="0" value={x.espacos??1} onChange={e=>patchArray('inventario',i,'espacos',num(e.target.value))}/></td>
    <td><input aria-label={'Quantidade do item '+(i+1)} type="number" min="0" value={x.quantidade??1} onChange={e=>patchArray('inventario',i,'quantidade',num(e.target.value))}/></td>
    <td><button type="button" className="ordem-pdf-delete" aria-label={'Remover item '+(i+1)} onClick={()=>removeArray('inventario',i)}>×</button></td>
   </tr>)}{items.length===0&&<tr><td colSpan="5" className="ordem-pdf-blank-row">Nenhum item cadastrado.</td></tr>}</tbody>
   </table>
  </div>
  </SheetSection>;
}
function AbilityList({kind,title,data,patchArray,addArray,removeArray,onNavigate}) {
 const list=data[kind]||[], paranormal=kind==='poderesParanormais';
 return <SheetSection title={title} subtitle={paranormal?'Elemento, custo e página':'Tipo, custo e página'}
   action={<button type="button" className="ordem-pdf-action" onClick={()=>addArray(kind,paranormal?
    {nome:'',elemento:'',requisito:'',custo:'',pagina:'',desc:''}:
    {nome:'',tipo:'Poder',custo:'',pagina:'',desc:''})}>+ Adicionar</button>}>
   <div className="ordem-pdf-ability-list">
    {list.map((x,i)=><div className="ordem-pdf-ability-row" key={i}>
     <input className="ordem-pdf-ability-name" aria-label={'Nome de '+title+' '+(i+1)} value={x.nome||''} placeholder="Nome da habilidade" onChange={e=>patchArray(kind,i,'nome',e.target.value)}/>
     <input aria-label={'Tipo ou elemento '+(i+1)} value={(paranormal?x.elemento:x.tipo)||''} placeholder={paranormal?'Elemento':'Tipo'} onChange={e=>patchArray(kind,i,paranormal?'elemento':'tipo',e.target.value)}/>
     <input aria-label={'Custo '+(i+1)} value={x.custo||''} placeholder="Custo" onChange={e=>patchArray(kind,i,'custo',e.target.value)}/>
     <input aria-label={'Página '+(i+1)} value={x.pagina||''} placeholder="Pág." onChange={e=>patchArray(kind,i,'pagina',e.target.value)}/>
     <button type="button" className="ordem-pdf-delete" aria-label={'Remover habilidade '+(i+1)} onClick={()=>removeArray(kind,i)}>×</button>
     <textarea aria-label={'Efeito da habilidade '+(i+1)} value={x.desc||''} rows={2} placeholder="Efeito ou lembrete" onChange={e=>patchArray(kind,i,'desc',e.target.value)}/>
    </div>)}
    {list.length===0&&<div className="ordem-pdf-blank-row">Nenhuma habilidade registrada.</div>}
   </div>
   {paranormal&&<button className="ordem-pdf-text-link" type="button" onClick={()=>onNavigate('poderes')}>Requisitos e afinidade em Poderes & Rituais</button>}
  </SheetSection>;
}
function RitualList({data,patchArray,addArray,removeArray}) {
 const rows=data.rituais||[];
 return <SheetSection title="RITUAIS CONHECIDOS" subtitle="Elemento, execução, alcance, área, duração e resistência"
  action={<button type="button" className="ordem-pdf-action" onClick={()=>addArray('rituais',{nome:'',circulo:1,elemento:'',execucao:'',alcance:'',area:'',duracao:'',resistencia:'',custo:'',pagina:'',desc:''})}>+ Ritual</button>}>
   <div className="ordem-pdf-ritual-list">
    {rows.map((x,i)=><article className="ordem-pdf-ritual" key={i}>
     <div className="ordem-pdf-ritual-head">
      <input aria-label={'Nome do ritual '+(i+1)} value={x.nome||''} onChange={e=>patchArray('rituais',i,'nome',e.target.value)} placeholder="Nome do ritual"/>
      <label className="ordem-pdf-field"><span>Círculo</span><select value={x.circulo??1} onChange={e=>patchArray('rituais',i,'circulo',num(e.target.value))}>{[1,2,3,4].map(n=><option key={n} value={n}>{n}º</option>)}</select></label>
      <button type="button" className="ordem-pdf-delete" aria-label={'Remover ritual '+(i+1)} onClick={()=>removeArray('rituais',i)}>×</button>
     </div>
     <div className="ordem-pdf-ritual-fields">
      {[['elemento','Elemento'],['execucao','Execução'],['alcance','Alcance'],['area','Área'],['duracao','Duração'],['resistencia','Resistência'],['custo','Custo'],['pagina','Página']].map(([key,label])=><PaperField key={key} label={label} value={x[key]||''} onChange={e=>patchArray('rituais',i,key,e.target.value)}/>)}
     </div>
     <label className="ordem-pdf-field ordem-pdf-effect"><span>Efeito / descrição</span><textarea rows={2} value={x.desc||''} onChange={e=>patchArray('rituais',i,'desc',e.target.value)}/></label>
    </article>)}
    {rows.length===0&&<div className="ordem-pdf-blank-row">Nenhum ritual registrado.</div>}
   </div>
  </SheetSection>;
}
function ContinuationPage({data,updateField,patchArray,addArray,removeArray,onNavigate}) {
 const b=data.bio||{},s=data.status||{},g=data.gestao||{};
 return <div className="ordem-pdf-preview ordem-pdf-sheet" data-page="2">
  <PageHeading page="02" title="HABILIDADES & INVENTÁRIO"/>
  <SheetSection title="REGISTRO DO AGENTE" subtitle="Patente, prestígio e gerenciamento de carga">
   <div className="ordem-pdf-management">
    <PaperField label="NEX %" type="number" value={b.nex??5} onChange={e=>updateField('bio.nex',Math.max(0,num(e.target.value)))}/>
    <PaperField label="Patente" value={b.patente||''} onChange={e=>updateField('bio.patente',e.target.value)}/>
    <PaperField label="Prestígio" type="number" value={g.prestigio??0} onChange={e=>updateField('gestao.prestigio',num(e.target.value))}/>
    <PaperField label="Limite de itens" value={g.limiteItens||''} onChange={e=>updateField('gestao.limiteItens',e.target.value)}/>
    <PaperField label="Limite de crédito" value={g.limiteCredito||''} onChange={e=>updateField('gestao.limiteCredito',e.target.value)}/>
    <PaperField label="Carga máx." value={g.cargaMax||''} onChange={e=>updateField('gestao.cargaMax',e.target.value)}/>
    <PaperField label="Carga atual" value={totalLoad(data.inventario)} readOnly help="Espaços × quantidade"/>
    <PaperField label="Limite PE / PD" type="number" value={s.limitePePd??1} onChange={e=>updateField('status.limitePePd',num(e.target.value))}/>
   </div>
  </SheetSection>
  <div className="ordem-pdf-page2-layout">
   <div className="ordem-pdf-secondary-column">
    <ItemList data={data} patchArray={patchArray} addArray={addArray} removeArray={removeArray}/>
    <AbilityList kind="habilidades" title="HABILIDADES" data={data} patchArray={patchArray} addArray={addArray} removeArray={removeArray} onNavigate={onNavigate}/>
    <AbilityList kind="poderesParanormais" title="PODERES PARANORMAIS" data={data} patchArray={patchArray} addArray={addArray} removeArray={removeArray} onNavigate={onNavigate}/>
   </div>
   <div className="ordem-pdf-secondary-column">
    <SheetSection title="DT DE RITUAIS" subtitle="Círculos I a IV">
     <div className="ordem-pdf-dt">{[1,2,3,4].map(n=><PaperField key={n} label={n+'º círculo'} value={data.dtRituais?.[n]??''} onChange={e=>updateField('dtRituais.'+n,e.target.value)}/>)}</div>
    </SheetSection>
    <RitualList data={data} patchArray={patchArray} addArray={addArray} removeArray={removeArray}/>
    <SheetSection title="ANOTAÇÕES" subtitle="Missões, pistas, aliados e lembretes">
     <textarea className="ordem-pdf-notes" aria-label="Anotações do agente" value={data.notas||''} onChange={e=>updateField('notas',e.target.value)} rows={7} placeholder="Anotações da investigação..."/>
    </SheetSection>
    <SheetSection title="EVOLUÇÃO DO PERSONAGEM" subtitle="NEX, nível e progressão">
     <div className="ordem-pdf-evolution">
      <PaperField label="NEX %" value={b.nex??5} readOnly/>
      <PaperField label="Nível" value={b.nivelExperiencia??1} readOnly/>
      <PaperField label="Patente" value={b.patente||''} readOnly/>
      <PaperField label="Limite PE / PD" value={s.limitePePd??1} readOnly/>
     </div>
     <button className="ordem-pdf-text-link" type="button" onClick={()=>onNavigate(data.opcionais?.evolucaoPatentes?'evolucao':'agente')}>
      {data.opcionais?.evolucaoPatentes?'Abrir histórico de evolução':'Configurar evolução opcional na aba Agente'}
     </button>
    </SheetSection>
   </div>
  </div>
  <SheetSection title="DESCRIÇÃO" subtitle="Aparência, personalidade, histórico e objetivo do agente" className="ordem-pdf-description-section">
   <div className="ordem-pdf-description-grid">
    {[
      ['aparencia','APARÊNCIA'],
      ['personalidade','PERSONALIDADE'],
      ['historico','HISTÓRICO'],
      ['objetivo','OBJETIVO']
    ].map(([key,label])=><label key={key} className="ordem-pdf-description-field">
      <span>{label}</span>
      <textarea rows={4} aria-label={label+' do personagem'} value={b[key]||''}
       onChange={e=>updateField('bio.'+key,e.target.value)}
       placeholder={'Descreva '+label.toLowerCase()+'...'} />
    </label>)}
   </div>
  </SheetSection>
  <footer className="ordem-pdf-footer"><span>ORDEM PARANORMAL · FICHA DIGITAL PJLITE</span><span>FOLHA 02 — EQUIPAMENTO / HABILIDADES / RITUAIS</span></footer>
 </div>;
}
export default function OrdemPdfPages({page,data,updateField,setData,onPhoto,onNavigate}) {
 const patchArray=(field,index,key,value)=>{
  setData(previous=>{
   const source=Array.isArray(previous[field])?previous[field]:[];
   const next=source.map((item,i)=>i===index?{...item,[key]:value}:item);
   return {...previous,[field]:next};
  });
 };
 const addArray=(field,item)=>setData(previous=>({...previous,[field]:[...(previous[field]||[]),item]}));
 const removeArray=(field,index)=>setData(previous=>({...previous,[field]:(previous[field]||[]).filter((_,i)=>i!==index)}));
 const props={data,updateField,patchArray,addArray,removeArray,onNavigate};
 return page==='pdf2'?<ContinuationPage {...props}/>:<AgentPage {...props} onPhoto={onPhoto}/>;
}
