import * as React from 'react';
import {
 DRAGONBANE_ABILITY_KINDS,DRAGONBANE_MAGIC_SCHOOLS,
 createDragonbaneAbility,dragonbaneAbilityList,dragonbaneInnateSuggestions,
 dragonbaneMagicSchool,renameDragonbaneAbility,DRAGONBANE_SPELL_GRADES,dragonbaneSpellGrade,dragonbaneSpellGroups,dragonbanePreparedLimit
} from '../abilities.js';

import {dragonbaneAttributeValue} from '../attributes.js';
const KIND_LABELS={inata:'Inata',heroica:'Heroica',magia:'Feitiço',truque:'Truque',outro:'Outro'};
const SECTIONS={
 habilidades:[
  {kind:'inata',title:'Dádivas da ancestralidade',subtitle:'Habilidades inatas — próprias da ancestralidade do personagem',page:'Livro de Regras, pp. 9–13'},
  {kind:'heroica',title:'Habilidades heroicas',subtitle:'Talentos adquiridos pela profissão ou durante a jornada',page:'Livro de Regras, pp. 26 e 35–39'},
  {kind:'outro',title:'Outras habilidades',subtitle:'Anotações livres e registros antigos ainda sem classificação',page:'Registros legados preservados'}
 ],
 magias:[
  {kind:'magia',title:'Feitiços',subtitle:'Escola, grau, preparação e custo de determinação',page:'Livro de Regras, pp. 57–69'},
  {kind:'truque',title:'Truques mágicos',subtitle:'Magias menores que permanecem à disposição do conjurador',page:'Livro de Regras, pp. 57–61'}
 ]
};
const LINE='w-full rounded-sm border border-[#c9bda0] bg-[#fffdf5] px-2 py-2 text-sm text-[#29261e] outline-none focus:border-[#28695d] focus:ring-1 focus:ring-[#28695d]';
function AbilityCard({item,index,kind,onChange,onRemove,onRename}){
 const spell=kind==='magia'||kind==='truque';
 const set=(key,value)=>onChange(index,key,value);
 return <article className="db-rework-ability-card">
  <div className="db-rework-card-heading">
   <span className="db-rework-kind">{KIND_LABELS[kind]}</span>
   <label className="db-rework-small-label" htmlFor={'db-kind-'+index}>Classificar</label>
   <select id={'db-kind-'+index} aria-label={'Tipo de '+(item.nome||'habilidade')}
    value={kind} onChange={e=>set('tipo',e.target.value)} className="db-rework-kind-select">
    {DRAGONBANE_ABILITY_KINDS.map(opt=><option key={opt.id} value={opt.id}>{opt.short}</option>)}
   </select>
   <button type="button" onClick={()=>onRemove(index)}
    className="db-rework-delete" aria-label={'Remover '+(item.nome||'habilidade sem nome')}>Remover</button>
  </div>
  <div className="db-rework-fields">
   <label className="db-rework-field db-rework-name">Nome
    <textarea rows={String(item.nome||'').includes('\n')?3:1} value={item.nome||''} onChange={e=>onRename(index,e.target.value)} className={LINE+' resize-y font-bold'} placeholder={spell?'Nome do feitiço':'Nome da habilidade'}/>
   </label>
   <label className="db-rework-field db-rework-cost">PD / Nível
    <input value={item.fv_nvl||''} onChange={e=>set('fv_nvl',e.target.value)} className={LINE} placeholder={kind==='truque'?'1 PD':'Ex.: 3 PD'}/>
   </label>
  </div>
  {spell&&<div className="db-rework-magic-fields">
   <label className="db-rework-field">Escola
    <select value={dragonbaneMagicSchool(item)} onChange={e=>set('escola',e.target.value)} className={LINE}>
     {DRAGONBANE_MAGIC_SCHOOLS.map(name=><option key={name} value={name}>{name}</option>)}
    </select>
   </label>
   {kind==='magia'&&<>
    <label className="db-rework-field">Grau
     <select value={dragonbaneSpellGrade(item)||''} onChange={e=>set('grau',e.target.value?Number(e.target.value):'')} className={LINE}>
      <option value="">Não definido</option>{DRAGONBANE_SPELL_GRADES.map(g=><option key={g} value={g}>{g}</option>)}
     </select>
    </label>
    <label className="db-rework-checkbox">
     <input type="checkbox" checked={!!item.preparada} onChange={e=>set('preparada',e.target.checked)}/>
     Preparado
    </label>
   </>}
  </div>}
  {kind==='magia'&&<div className="db-power-row"><label>Nível de poder <select value={item.nivelPoder||1} onChange={e=>set('nivelPoder',Number(e.target.value))}>{[1,2,3].map(n=><option key={n} value={n}>{n}</option>)}</select></label><small>Custo padrão: {2*(Number(item.nivelPoder)||1)} PD (ver exceções no efeito)</small></div>}
  {(item.requisito||item.execucao||item.alcance||item.duracao||item.componentes)&&<dl className="db-library-card-meta">{[['Requisito',item.requisito],['Conjuração',item.execucao],['Alcance',item.alcance],['Duração',item.duracao],['Componentes',item.componentes]].filter(([,v])=>v).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
  <label className="db-rework-field">Efeito e observações
   <textarea rows={4} value={item.desc!==undefined?item.desc:(item.descricao||'')} onChange={e=>set('desc',e.target.value)} className={LINE+' resize-y'} placeholder="Descreva o efeito, duração, custo ou condição..."/>
  </label>
  <details className="db-ability-source"><summary>Fonte e página</summary><div className="db-rework-citation-fields">
   <label className="db-rework-field">Fonte
    <input value={item.fonte||''} onChange={e=>set('fonte',e.target.value)} className={LINE} placeholder="Livro, suplemento ou regra própria"/>
   </label>
   <label className="db-rework-field">Página
    <input value={item.pagina||''} onChange={e=>set('pagina',e.target.value)} className={LINE} placeholder="Ex.: 37"/>
   </label>
  </div></details>
 </article>;
}

export default function DragonbaneAbilitiesPanel({mode,data,addToArray,updateArrayField,removeFromArray,setData,onOpenLibrary}){
 const [school,setSchool]=React.useState('Todas');
 const [onlyPrepared,setOnlyPrepared]=React.useState(false);
 const isMagic=mode==='magias';
 const groups=dragonbaneSpellGroups(data,school,onlyPrepared);
 const prepared=dragonbaneAbilityList(data,'magia').filter(({entry})=>entry.preparada).length;
 const limit=dragonbanePreparedLimit(dragonbaneAttributeValue(data.atributos,'int'));
 const defs=isMagic?groups.map(g=>({...g,subtitle:g.kind==='truque'?'Sempre preparados · 1 PD · sem teste':'Feitiços organizados por grau, escola e nome',page:'Livro de Regras, pp. 57–71'})):SECTIONS.habilidades;
 const pdfCount=Array.isArray(data.habilidadesFeiticos)?data.habilidadesFeiticos.length:0;
 const suggestions=mode==='habilidades'
  ?dragonbaneInnateSuggestions(data.bio?.ancestralidade,data.habilidadesFeiticos):[];
 const add=(kind,grade)=>addToArray('habilidadesFeiticos',createDragonbaneAbility(kind,{...(kind==='magia'?{grau:grade||'',escola:school==='Todas'?'Magia Geral':school}:kind==='truque'&&school!=='Todas'?{escola:school}:{})}));
 const rename=(index,name)=>setData(prev=>renameDragonbaneAbility(prev,index,name));
 return <div className="db-rework-page" data-dragonbane-page={mode}>
  <div className="db-rework-page-title">
   <div>
    <p className="db-rework-eyebrow">{mode==='magias'?'Grimório do aventureiro':'Legado e experiência'}</p>
    <h2>{mode==='magias'?'Magias e Truques':'Habilidades do Personagem'}</h2>
    <p>{mode==='magias'?'Feitiços por escola e grau; truques em seção própria.':'Habilidades inatas, heroicas e outros registros.'}</p>
   </div>
   <span className="db-rework-chapter">{mode==='magias'?'CAP. 5':'CAP. 2–3'}</span>
  </div>
  {isMagic&&<div className="db-grimoire-controls"><div><strong>Preparados: {prepared}/{limit}</strong><small>Limite pela chance base de INT · truques não contam (pp. 57–58).</small>{prepared>limit&&<p role="status">Acima do limite normal; ajuste os preparados conforme as regras da mesa.</p>}</div><label>Escola<select value={school} onChange={e=>setSchool(e.target.value)}><option>Todas</option>{DRAGONBANE_MAGIC_SCHOOLS.map(s=><option key={s}>{s}</option>)}</select></label><label className="db-grimoire-check"><input type="checkbox" checked={onlyPrepared} onChange={e=>setOnlyPrepared(e.target.checked)}/> Só preparados</label></div>}
  {pdfCount>24&&<div className="db-rework-pdf-warning" role="alert">
   <strong>Atenção ao PDF editável:</strong> sua ficha tem {pdfCount} cartões, mas o modelo PDF permite 24. Os demais continuam salvos no PJLite; revise a exportação.
  </div>}
  {suggestions.length>0&&<aside className="db-rework-suggestions" aria-label="Sugestões de habilidades inatas">
   <div><strong>Habilidades da ancestralidade</strong><p>Adicionar é opcional; nada será inserido automaticamente.</p></div>
   <div className="db-rework-suggestion-buttons">
    {suggestions.map(s=><button key={s.nome} type="button" onClick={()=>addToArray('habilidadesFeiticos',
     createDragonbaneAbility('inata',{nome:s.nome,desc:s.desc,fv_nvl:s.custo,fonte:'Livro de Regras Dragonbane',pagina:'9–13'}))}
     className="db-rework-suggestion">+ {s.nome}</button>)}
   </div>
  </aside>}
  {defs.map(section=>{
   const list=isMagic?section.items:dragonbaneAbilityList(data,section.kind);
   if(isMagic&&section.grade===''&&!list.length)return null;
   return <section key={section.kind+String(section.grade??'')} className="db-rework-section">
    <div className="db-rework-section-bar">
     <div><h3>{section.title} <span className="db-rework-count">{list.length}</span></h3><p>{section.subtitle} · {section.page}</p></div>
     <div className="db-section-actions">{section.kind!=='outro'&&<button type="button" className="db-rework-add" onClick={()=>onOpenLibrary({kind:section.kind,grade:section.grade,school})}>Biblioteca</button>}<button type="button" className="db-rework-add" onClick={()=>add(section.kind,section.grade)}>+ Criar</button></div>
    </div>
    {list.length?
     <div className="db-rework-cards">{list.map(({entry,index})=><AbilityCard key={index}
      item={entry} index={index} kind={section.kind}
      onChange={(i,key,val)=>updateArrayField('habilidadesFeiticos',i,key,val)}
      onRemove={i=>removeFromArray('habilidadesFeiticos',i)} onRename={rename}/>)}</div>
     :<div className="db-rework-empty">Nenhum registro nesta categoria. Use a biblioteca ou <strong>+ Criar</strong>.</div>}
   </section>;
  })}
  <p className="db-rework-footnote">Os dados usam a lista original da ficha de Dragonbane. Ao alterar o tipo, o cartão pode mudar de aba. O PDF editável comporta até 24 cartões; o conteúdo completo das regras deve ser consultado no livro.</p>
 </div>;
}
