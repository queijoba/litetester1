import * as React from 'react';
import {GM_SHIELDS,getGmShieldKey} from './gmShieldCatalog.js';

// Escudo de consulta: apenas resumo editorial e referência ao PDF do Drive.
// Links externos mantêm as permissões originais do proprietário.
export default function GmShieldReference({system}){
 const initial=getGmShieldKey(system);
 const [chosen,setChosen]=React.useState(initial||'');
 React.useEffect(()=>{setChosen(getGmShieldKey(system)||'')},[system]);
 const entry=chosen?GM_SHIELDS[chosen]:null;
 return <section className="campaign-workspace__box gm-rules-panel" aria-label="Referência de regras do Escudo do Mestre">
  <div className="gm-rules-panel__head">
   <div><h4>📖 Escudo de regras • consulta rápida</h4><p>Referências do sistema da campanha, sem substituir o material completo.</p></div>
   <label htmlFor="gm-rule-system">Sistema do escudo
    <select id="gm-rule-system" value={chosen} onChange={event=>setChosen(event.target.value)}>
     {!entry&&<option value="">Selecionar sistema de RPG</option>}
     {Object.entries(GM_SHIELDS).map(([key,value])=><option key={key} value={key}>{value.label}</option>)}
    </select>
   </label>
  </div>
  {!entry?<p role="status" className="gm-rules-panel__notice">Este sistema ainda não possui escudo cadastrado. Selecione um sistema na lista para consultar as referências disponíveis, sem substituir automaticamente por regras de outro RPG.</p>:<>
  <div className="gm-rules-panel__source">
   <span>{entry.source}</span>
   {entry.url?<a href={entry.url} target="_blank" rel="noopener noreferrer">📄 Abrir PDF do escudo no Drive ↗</a>:
    <small>Não foi localizado PDF de escudo específico deste sistema no acervo consultado.</small>}
  </div>
  <div className="gm-rules-panel__groups">
   {entry.groups.map((group,index)=><details key={chosen+'-'+group.title} open={index===0}>
    <summary>{group.title}</summary>
    <dl>{group.items.map(([label,description])=><div key={label}>
     <dt>{label}</dt><dd>{description}</dd>
    </div>)}</dl>
   </details>)}
  </div>
  <p className="gm-rules-panel__notice">Os lembretes são resumos originais para a mesa. Para consultar regras integrais, use o PDF e verifique suas permissões no Drive.</p>
  </>}
 </section>;
}
