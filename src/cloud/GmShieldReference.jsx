import * as React from 'react';
import {GM_SHIELDS,getGmShield} from './gmShieldCatalog.js';

// Escudo de consulta: apenas resumo editorial e referência ao PDF do Drive.
// Links externos mantêm as permissões originais do proprietário.
export default function GmShieldReference({system}){
 const initial=getGmShield(system);
 const [chosen,setChosen]=React.useState(initial?system:'dragonbane');
 React.useEffect(()=>{setChosen(getGmShield(system)?system:'dragonbane')},[system]);
 const entry=getGmShield(chosen)||GM_SHIELDS.dragonbane;
 return <section className="campaign-workspace__box gm-rules-panel" aria-label="Referência de regras do Escudo do Mestre">
  <div className="gm-rules-panel__head">
   <div><h4>📖 Escudo de regras • consulta rápida</h4><p>Referências do sistema da campanha, sem substituir o material completo.</p></div>
   <label htmlFor="gm-rule-system">Sistema do escudo
    <select id="gm-rule-system" value={chosen} onChange={event=>setChosen(event.target.value)}>
     {Object.entries(GM_SHIELDS).map(([key,value])=><option key={key} value={key}>{value.label}</option>)}
    </select>
   </label>
  </div>
  <div className="gm-rules-panel__source">
   <span>{entry.source}</span>
   {entry.url?<a href={entry.url} target="_blank" rel="noopener noreferrer">📄 Abrir PDF do escudo no Drive ↗</a>:
    <small>Não foi localizado PDF de escudo específico deste sistema no acervo consultado.</small>}
  </div>
  <div className="gm-rules-panel__groups">
   {entry.groups.map(group=><details key={group.title} open={entry.groups.length===1?true:undefined}>
    <summary>{group.title}</summary>
    <dl>{group.items.map(([label,description])=><div key={label}>
     <dt>{label}</dt><dd>{description}</dd>
    </div>)}</dl>
   </details>)}
  </div>
  <p className="gm-rules-panel__notice">Os lembretes são resumos originais para a mesa. Para consultar regras integrais, use o PDF e verifique suas permissões no Drive.</p>
 </section>;
}
