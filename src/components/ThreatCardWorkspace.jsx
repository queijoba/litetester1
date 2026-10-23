import React from 'react';
import {ThreatStatCard} from './ThreatCardModal.jsx';
import './threat-workspace.css';

// O formulário continua editável; a prévia usa somente o objeto em memória.
export default function ThreatCardWorkspace({data,onOpen,children,enabled=true}){
 if(!enabled||!data||data.type==='pc')return children;
 return <div className={'pj-threat-workspace pj-threat-workspace--'+String(data.system||'').replace(/[^a-z0-9]/gi,'').toLowerCase()}>
  <main className="pj-threat-workspace-editor" aria-label="Editor da ameaça">{children}</main>
  <aside className="pj-threat-workspace-preview" aria-label="Prévia em card">
   <div className="pj-threat-workspace-bar">
    <div><strong>🃏 Card da ameaça</strong><small>Atualizado enquanto você edita</small></div>
    <button type="button" onClick={onOpen}>Ampliar card <span aria-hidden="true">↗</span></button>
   </div>
   <div className="pj-threat-workspace-preview-scroll"><ThreatStatCard data={data} compact /></div>
   <p className="pj-threat-workspace-tip">Para compartilhar com a mesa, amplie e baixe o card em PNG. As anotações privadas do mestre não aparecem na imagem.</p>
  </aside>
 </div>;
}
