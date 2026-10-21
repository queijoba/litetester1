import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  findAbilityPresets,
  removeAbilityPreset,
  abilityPresetKindName,
} from './abilityPresetLibrary.js';
import './abilityPresetPicker.css';

const plain = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function AbilityPresetPicker({ open, system, kind, onChoose, onClose }) {
  const [query, setQuery] = useState('');
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(null);
      setRevision(v=>v+1);
    }
  }, [open, system, kind]);

  useEffect(() => {
    if (!open) return;
    const onKey = event => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown',onKey);
    return () => window.removeEventListener('keydown',onKey);
  }, [open, onClose]);

  const entries = useMemo(() => {
    const search = plain(query);
    return findAbilityPresets(system,kind).filter(p=>{
      if (!search) return true;
      return plain([p.name,p.entry?.tipo,p.entry?.origem,p.entry?.elemento,p.entry?.desc].join(' ')).includes(search);
    });
  }, [system,kind,query,revision]);

  if (!open || typeof document === 'undefined') return null;

  const current = entries.find(e=>e.id===selected) || null;
  const choose = item => {
    onChoose(JSON.parse(JSON.stringify(item.entry)));
    onClose();
  };
  const remove = item => {
    if (item.source !== 'personal') return;
    if (!window.confirm('Remover o modelo "'+item.name+'" da biblioteca deste dispositivo? As fichas existentes não serão alteradas.')) return;
    if (removeAbilityPreset(item.id)) {
      setRevision(v=>v+1);
      setSelected(null);
    }
  };

  return createPortal(
    <div className="pjlite-presets-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
      <section className="pjlite-presets-dialog" role="dialog" aria-modal="true" aria-label={'Biblioteca de '+abilityPresetKindName(kind)}>
        <div className="pjlite-presets-header">
          <div><span className="pjlite-presets-kicker">PJ LITE // MODELOS PRONTOS</span><h3>📚 {abilityPresetKindName(kind)}</h3></div>
          <button type="button" className="pjlite-presets-close" aria-label="Fechar biblioteca" onClick={onClose}>×</button>
        </div>
        <div className="pjlite-presets-search">
          <input type="search" placeholder="Pesquisar nome, origem ou efeito..." value={query} onChange={event=>{setQuery(event.target.value);setSelected(null);}} autoFocus/>
          <small>{entries.length} {entries.length===1?'resultado':'resultados'}</small>
        </div>
        <div className="pjlite-presets-layout">
          <div className="pjlite-presets-results">
            {entries.map(item=><button key={item.id} type="button" className={'pjlite-presets-option '+(selected===item.id?'selected':'')} onClick={()=>setSelected(item.id)}>
              <strong>{item.name}</strong>
              <span>{item.source==='personal'?'Meu modelo':item.entry?.fonte?.includes('SRD')?'D&D SRD 5.2.1 (CC BY 4.0)':'Exemplo PJLite (não oficial)'}</span>
            </button>)}
            {!entries.length&&<div className="pjlite-presets-empty">Nenhum modelo encontrado. Você pode criar uma habilidade na ficha e clicar em “Salvar modelo” para reutilizá-la aqui.</div>}
          </div>
          <div className="pjlite-presets-detail">
            {current?<>
              <span className="pjlite-presets-kicker">{current.source==='personal'?'MODELO SALVO NESTE DISPOSITIVO':current.entry?.fonte?.includes('SRD')?'D&D 5.5e • SRD 5.2.1':'EXEMPLO ORIGINAL DO PJ LITE'}</span>
              <h4>{current.name}</h4>
              <div className="pjlite-presets-meta">{Object.entries(current.entry||{}).filter(([k,v])=>!['nome','desc'].includes(k)&&v!==''&&v!==null&&v!==undefined).map(([k,v])=><span key={k}><b>{k}:</b> {String(v)}</span>)}</div>
              <p>{current.entry?.desc||'Sem descrição.'}</p>
              <div className="pjlite-presets-footer">
                <button type="button" className="pjlite-presets-use" onClick={()=>choose(current)}>+ Adicionar à ficha</button>
                {current.source==='personal'&&<button type="button" className="pjlite-presets-delete" onClick={()=>remove(current)}>Excluir modelo</button>}
              </div>
            </>:<div className="pjlite-presets-placeholder">Selecione um modelo para ver os campos e a descrição antes de adicioná-lo.</div>}
          </div>
        </div>
        <div className="pjlite-presets-note">Seus modelos pessoais ficam salvos neste navegador, mesmo offline. {system==='dnd5e'&&<>As magias de exemplo vêm do <a href="https://www.dndbeyond.com/srd" target="_blank" rel="noopener noreferrer">D&D SRD 5.2.1</a> de Wizards of the Coast LLC, sob <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>, com resumos traduzidos/adaptados pelo PJLite. </>}Consulte sempre as regras oficiais da mesa.</div>
      </section>
    </div>,
    document.body
  );
}
