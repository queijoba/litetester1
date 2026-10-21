import React from 'react';
import {
 DRAGONBANE_ABILITY_KINDS,DRAGONBANE_MAGIC_SCHOOLS,dragonbaneAbilityList,
 dragonbaneInnateSuggestions,createDragonbaneAbility
} from '../abilities.js';
import './abilityPanels.css';

const MAX_PDF_CARDS=24;
const n=v=>String(v??'').trim();
export default function DragonbaneAbilityPanels({
 data,addToArray,updateArrayField,removeFromArray
}){
 const abilities=Array.isArray(data?.habilidadesFeiticos)?data.habilidadesFeiticos:[];
 const ancestry=data?.bio?.ancestralidade||'';
 const proposals=dragonbaneInnateSuggestions(ancestry,abilities);
 const counted=abilities.length;

 const add=(kind,extra={})=>addToArray('habilidadesFeiticos',createDragonbaneAbility(kind,extra));
 const change=(index,field,value)=>updateArrayField('habilidadesFeiticos',index,field,value);
 return <div className="db-resources" aria-label="Habilidades e magias de Dragonbane">
   <div className="db-resources-banner">
    <div>
     <span className="db-resources-kicker">REGISTRO DE PERSONAGEM</span>
     <h2>Habilidades e Magia</h2>
     <p>Inatas, heroicas, feitiços e truques agora ficam em seções distintas.</p>
    </div>
    <span className="db-resources-counter">{counted} registro{counted===1?'':'s'}</span>
   </div>
   {DRAGONBANE_ABILITY_KINDS.map(kind=>{
    const entries=dragonbaneAbilityList(data,kind.id);
    const isMagic=kind.id==='magia'||kind.id==='truque';
    const legacy=kind.id==='outro';
    return <section className={'db-resource-section db-resource-section--'+kind.id} key={kind.id} aria-label={kind.nome}>
     <div className="db-resource-section-head">
      <div><h3>{kind.nome}</h3><p>{kind.caption}</p></div>
      <button type="button" className="db-resource-add" onClick={()=>add(kind.id)} aria-label={'Adicionar em '+kind.nome}>+ Adicionar</button>
     </div>
     {kind.id==='inata'&&<div className="db-innate-suggestions">
       <div><b>Ancestralidade: {ancestry||'não informada'}</b><small>A sugestão é opcional. Alterar a ancestralidade não apaga habilidades já salvas.</small></div>
       {proposals.length>0&&<div className="db-innate-suggestion-actions">{proposals.map(x=><button type="button" key={x.nome}
        onClick={()=>add('inata',{nome:x.nome,fv_nvl:x.custo,desc:x.desc,fonte:'Livro de Regras v1.1',pagina:'10–12'})}
        title={'Adicionar habilidade inata: '+x.nome}>+ {x.nome}</button>)}</div>}
       {!ancestry&&<small>Preencha a ancestralidade na parte superior da ficha para receber sugestões do livro.</small>}
     </div>}
     {entries.length===0&&<p className="db-resource-empty">{legacy?'Suas anotações antigas sem categoria aparecerão aqui.':'Nenhum registro nesta seção. Use + Adicionar quando precisar.'}</p>}
     <div className="db-resource-list">
      {entries.map(({entry,index})=><article className="db-resource-card" key={'resource-'+index}>
       <div className="db-resource-main">
        <label className="db-resource-name">
         <span>Nome</span>
         <textarea rows={legacy||n(entry.nome).includes('\n')?2:1} value={entry.nome||''}
          onChange={e=>change(index,'nome',e.target.value)} placeholder={isMagic?'Nome do '+(kind.id==='truque'?'truque':'feitiço'):'Nome da habilidade'} />
        </label>
        <label className="db-resource-cost">
         <span>{kind.id==='magia'?'PD / Poder':'Custo em PD'}</span>
         <input type="text" value={entry.fv_nvl??entry.pd_nivel??''} onChange={e=>change(index,'fv_nvl',e.target.value)}
          placeholder={kind.id==='truque'?'1 PD':'—'} aria-label={'Custo ou nível de '+(entry.nome||kind.nome)}/>
        </label>
       </div>
       <div className="db-resource-summary-row">
        <label><span>Categoria</span><select value={kind.id} onChange={e=>change(index,'tipo',e.target.value)}
          aria-label={'Categoria de '+(entry.nome||'habilidade')}>
         {DRAGONBANE_ABILITY_KINDS.map(option=><option value={option.id} key={option.id}>{option.short}</option>)}
        </select></label>
        <button className="db-resource-delete" type="button" onClick={()=>removeFromArray('habilidadesFeiticos',index)}
         aria-label={'Remover '+(entry.nome||'registro')}>Remover</button>
       </div>
       {isMagic&&<div className="db-resource-magic-row">
         <label><span>Escola</span><select value={entry.escola||'Magia Geral'} onChange={e=>change(index,'escola',e.target.value)}>
          {DRAGONBANE_MAGIC_SCHOOLS.concat(entry.escola&&!DRAGONBANE_MAGIC_SCHOOLS.includes(entry.escola)?[entry.escola]:[]).map(s=><option key={s}>{s}</option>)}
         </select></label>
         {kind.id==='magia'&&<>
           <label><span>Grau</span><select value={entry.grau||1} onChange={e=>change(index,'grau',Number(e.target.value))}>
            {[1,2,3].map(n=><option key={n} value={n}>{n}</option>)}
           </select></label>
           <label className="db-resource-prepared"><input type="checkbox" checked={!!entry.preparada} onChange={e=>change(index,'preparada',e.target.checked)} />Preparado</label>
         </>}
         {kind.id==='truque'&&<span className="db-resource-trick-note">Sempre preparado · 1 PD</span>}
        </div>}
       <label className="db-resource-description"><span>Efeito / Observações</span>
        <textarea rows={2} value={entry.desc??entry.descricao??''} onChange={e=>change(index,'desc',e.target.value)}
         placeholder="Escreva um resumo do efeito, incluindo limites e condições." />
       </label>
       <details className="db-resource-extra">
        <summary>Fonte, página{isMagic?' e detalhes de conjuração':''}</summary>
        <div className="db-resource-extra-grid">
         <label><span>Fonte</span><input value={entry.fonte||''} onChange={e=>change(index,'fonte',e.target.value)} placeholder="Livro / suplemento"/></label>
         <label><span>Página</span><input value={entry.pagina||''} onChange={e=>change(index,'pagina',e.target.value)} placeholder="p. 35"/></label>
         {isMagic&&<>
          <label><span>Tempo de conjuração</span><input value={entry.conjuracao||''} onChange={e=>change(index,'conjuracao',e.target.value)} placeholder="Ação"/></label>
          <label><span>Alcance</span><input value={entry.alcance||''} onChange={e=>change(index,'alcance',e.target.value)} placeholder="Toque"/></label>
          <label><span>Duração</span><input value={entry.duracao||''} onChange={e=>change(index,'duracao',e.target.value)} placeholder="Instantâneo"/></label>
         </>}
        </div>
       </details>
      </article>)}
     </div>
    </section>;
   })}
   <div className="db-resource-notes">
    <b>Compatível com fichas antigas.</b> Entradas sem categoria permanecem em “Outros”; basta mudar a Categoria para organizá-las.
    {counted>MAX_PDF_CARDS&&<p>O PDF editável original possui {MAX_PDF_CARDS} cartões. Você cadastrou {counted} registros; somente os primeiros {MAX_PDF_CARDS} cabem nesse modelo.</p>}
   </div>
 </div>;
}
