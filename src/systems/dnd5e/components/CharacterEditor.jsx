import CharacterEditorBase from './CharacterEditorBase.jsx';
import '../dnd-sheet-v7.css';
import { getDndClassByLabel } from '../classPanels.js';

const clampSpellLevel = (raw) => {
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.max(0, Math.min(9, raw));
  const text = String(raw ?? '').trim().toLowerCase();
  if (!text || text.includes('truque') || text.includes('cantrip')) return 0;
  const parsed = parseInt(text.match(/\d+/)?.[0] || '0', 10);
  return Math.max(0, Math.min(9, Number.isFinite(parsed) ? parsed : 0));
};

const circleName = (level) => level === 0 ? 'Truques' : `${level}º Círculo`;

export default function DndCharacterEditor({ scope }) {
  const { data, isDnd, mobileTab, updateField } = scope;
  if (!isDnd || data.type !== 'pc') return <CharacterEditorBase scope={scope} />;

  const selectedClass = getDndClassByLabel(data.bio?.classe || '');
  const customTab = mobileTab === 'classe' || mobileTab === 'magias';

  const enhancedScope = {
    ...scope,
    updateField: (path, value) => {
      if (path === 'bio.classe' && value !== data.bio?.classe) {
        const previousClass = getDndClassByLabel(data.bio?.classe || '');
        if (previousClass && Array.isArray(data.caracteristicas)) {
          const migrated = data.caracteristicas.map((entry) => {
            if ((entry?.tipo || 'classe') !== 'classe' || entry?.classId) return entry;
            return {
              ...entry,
              classId: previousClass.id,
              ...(entry?.origem === 'subclasse' && data.bio?.subclasse && !entry?.subclasse
                ? { subclasse: data.bio.subclasse }
                : {})
            };
          });
          updateField('caracteristicas', migrated);
        }
        updateField('bio.subclasse', '');
      }
      updateField(path, value);
    }
  };

  return (
    <div className={`dnd-v6-wrapper ${customTab ? 'is-custom-tab' : ''}`}>
      <CharacterEditorBase scope={enhancedScope} />
      {mobileTab === 'classe' && selectedClass && <ClassWorkspace scope={scope} selectedClass={selectedClass} />}
      {mobileTab === 'magias' && <SpellWorkspace scope={scope} />}
    </div>
  );
}

function ClassWorkspace({ scope, selectedClass }) {
  const { data, SVGIcons, updateField, updateArrayField, addToArray, removeFromArray } = scope;

  const features = Array.isArray(data.caracteristicas) ? data.caracteristicas : [];
  const currentSubclass = String(data.bio?.subclasse || '');
  const subclassOptions = Array.isArray(selectedClass.subclasses) ? selectedClass.subclasses : [];
  const legacySubclass = currentSubclass && !subclassOptions.includes(currentSubclass) ? currentSubclass : '';
  const characterLevel = data.bio?.nivel || '—';
  const classResourceData = data.recursosClasse?.[selectedClass.id] || {};

  const indexedClassFeatures = features
    .map((entry, index) => ({ entry, index }))
    .filter(item => (item.entry?.tipo || 'classe') === 'classe')
    .filter(item => !item.entry?.classId || item.entry.classId === selectedClass.id);

  const baseClassFeatures = indexedClassFeatures.filter(item => item.entry?.origem !== 'subclasse');
  const subclassFeatures = indexedClassFeatures.filter(item =>
    item.entry?.origem === 'subclasse' && (!item.entry?.subclasse || item.entry.subclasse === currentSubclass)
  );

  const updateClassResource = (key, value) => updateField(`recursosClasse.${selectedClass.id}.${key}`, value);

  const changeSubclass = (nextSubclass) => {
    if (nextSubclass === currentSubclass) return;

    if (currentSubclass && Array.isArray(data.caracteristicas)) {
      const migrated = data.caracteristicas.map((entry) => {
        if ((entry?.tipo || 'classe') !== 'classe') return entry;
        if (entry?.origem !== 'subclasse') return entry;
        if (entry?.classId && entry.classId !== selectedClass.id) return entry;
        if (entry?.subclasse) return entry;
        return { ...entry, classId: selectedClass.id, subclasse: currentSubclass };
      });
      updateField('caracteristicas', migrated);
    }

    updateField('bio.subclasse', nextSubclass);
  };

  const renderClassField = (field) => {
    const value = classResourceData?.[field.key];
    if (field.type === 'tracker') {
      const current = Number(value?.atual ?? 0);
      const max = Number(value?.max ?? 0);
      return (
        <div key={field.key} className="dnd-v6-class-resource tracker">
          <span>{field.label}</span>
          <div>
            <label><small>Atual</small><input type="number" min="0" value={current} onChange={e => updateClassResource(field.key, { ...(value || {}), atual: Number(e.target.value) || 0 })} /></label>
            <i>/</i>
            <label><small>Máximo</small><input type="number" min="0" value={max} onChange={e => updateClassResource(field.key, { ...(value || {}), max: Number(e.target.value) || 0 })} /></label>
          </div>
        </div>
      );
    }

    if (field.type === 'toggle') {
      return (
        <label key={field.key} className="dnd-v6-class-resource toggle">
          <input type="checkbox" checked={!!value} onChange={e => updateClassResource(field.key, e.target.checked)} />
          <span>{field.label}</span>
        </label>
      );
    }

    return (
      <label key={field.key} className="dnd-v6-class-resource simple">
        <span>{field.label}</span>
        <input
          type={field.type === 'number' ? 'number' : 'text'}
          min={field.type === 'number' ? 0 : undefined}
          value={value ?? ''}
          onChange={e => updateClassResource(field.key, field.type === 'number' ? (Number(e.target.value) || 0) : e.target.value)}
          placeholder={field.placeholder || ''}
        />
      </label>
    );
  };

  const addFeature = (origin) => addToArray('caracteristicas', {
    tipo: 'classe',
    origem: origin,
    classId: selectedClass.id,
    ...(origin === 'subclasse' ? { subclasse: currentSubclass } : {}),
    nome: '',
    desc: ''
  });

  const renderFeature = ({ entry, index }, origin) => (
    <article key={index} className={`dnd-v6-feature-card ${origin === 'subclasse' ? 'subclass-feature' : ''}`}>
      <div className="dnd-v6-feature-head">
        <span className={`dnd-v6-origin ${origin}`}>{origin === 'subclasse' ? (currentSubclass || 'Subclasse') : selectedClass.label}</span>
        <button type="button" onClick={() => removeFromArray('caracteristicas', index)} title="Remover habilidade"><SVGIcons.Trash /></button>
      </div>
      <input
        className="dnd-v6-feature-name"
        value={entry?.nome || ''}
        onChange={e => updateArrayField('caracteristicas', index, 'nome', e.target.value)}
        placeholder={origin === 'subclasse' ? 'Habilidade da subclasse' : 'Habilidade da classe'}
      />
      <textarea
        rows="4"
        value={entry?.desc || ''}
        onChange={e => updateArrayField('caracteristicas', index, 'desc', e.target.value)}
        placeholder="Efeito, usos, recarga, limites e observações..."
      />
    </article>
  );

  return (
    <div className="dnd-paper dnd-v3 font-dnd dnd-v6-custom-paper">
      <div className="dnd-v3-sheet dnd-v6-sheet">
        <div className="dnd-v6-class-page">
          <section className="dnd-v6-class-hero">
            <div className="dnd-v6-class-icon" aria-hidden="true">{selectedClass.icon}</div>
            <div className="dnd-v6-class-heading">
              <small>Classe & Subclasse</small>
              <h2>{selectedClass.label}</h2>
              <p>{selectedClass.summary} A classe é definida em “Ficha & Combate”; aqui você gerencia apenas seus recursos e a subclasse.</p>
            </div>
            <div className="dnd-v6-class-identity compact">
              <div className="dnd-v6-level-badge" title="O nível é alterado na aba Ficha & Combate">
                <span>Nível</span>
                <strong>{characterLevel}</strong>
              </div>
              <label className="dnd-v6-subclass-select">
                <span>{selectedClass.subclassLabel || 'Subclasse'}</span>
                <select value={currentSubclass} onChange={e => changeSubclass(e.target.value)}>
                  <option value="">Selecione a subclasse...</option>
                  {legacySubclass && <option value={legacySubclass}>{legacySubclass} (legado)</option>}
                  {subclassOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                <small>{currentSubclass ? 'Recursos desta subclasse aparecem separados abaixo.' : 'Escolha quando o personagem adquirir sua subclasse.'}</small>
              </label>
            </div>
          </section>

          <div className="dnd-v6-class-layout">
            <section className="dnd-v3-section dnd-v6-fast-resources">
              <div className="dnd-v3-section-title">
                <span>Recursos da Classe</span>
                <small>Contadores e valores próprios de {selectedClass.label}</small>
              </div>
              <div className="dnd-v6-class-resource-grid">
                {selectedClass.fields.length
                  ? selectedClass.fields.map(renderClassField)
                  : <p className="dnd-v6-empty">Esta classe não possui contadores rápidos configurados.</p>}
              </div>
              <label className="dnd-v6-class-notes">
                <span>Anotações da Classe</span>
                <textarea rows="5" value={classResourceData?.notas || ''} onChange={e => updateClassResource('notas', e.target.value)} placeholder="Usos especiais, descanso, lembretes de regra e observações..." />
              </label>
            </section>

            <section className="dnd-v3-section dnd-v6-class-features">
              <div className="dnd-v3-section-title dnd-v6-feature-title">
                <div>
                  <span>Habilidades da Classe</span>
                  <small>Classe e subclasse ficam separadas para consulta rápida e não se misturam ao trocar de opção.</small>
                </div>
              </div>

              <div className="dnd-v6-feature-columns">
                <div className="dnd-v6-feature-lane">
                  <div className="dnd-v6-lane-head">
                    <div><b>{selectedClass.label}</b><small>Recursos base da classe</small></div>
                    <button type="button" onClick={() => addFeature('classe')}>+ Habilidade</button>
                  </div>
                  <div className="dnd-v6-feature-list">
                    {baseClassFeatures.length === 0
                      ? <p className="dnd-v6-empty">Nenhuma habilidade da classe cadastrada ainda.</p>
                      : baseClassFeatures.map(item => renderFeature(item, 'classe'))}
                  </div>
                </div>

                <div className={`dnd-v6-feature-lane subclass-lane ${currentSubclass ? '' : 'is-disabled'}`}>
                  <div className="dnd-v6-lane-head">
                    <div><b>{currentSubclass || 'Subclasse'}</b><small>{currentSubclass ? 'Recursos específicos da subclasse' : 'Selecione uma subclasse no topo'}</small></div>
                    <button type="button" onClick={() => addFeature('subclasse')} disabled={!currentSubclass}>+ Habilidade</button>
                  </div>
                  <div className="dnd-v6-feature-list">
                    {!currentSubclass
                      ? <p className="dnd-v6-empty">Escolha a subclasse para liberar esta área.</p>
                      : subclassFeatures.length === 0
                        ? <p className="dnd-v6-empty">Nenhuma habilidade da subclasse cadastrada ainda.</p>
                        : subclassFeatures.map(item => renderFeature(item, 'subclasse'))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpellWorkspace({ scope }) {
  const { data, updateField } = scope;
  const spells = Array.isArray(data.magias?.lista) ? data.magias.lista : [];

  const updateSpell = (index, patch) => {
    const next = [...spells];
    next[index] = { ...next[index], ...patch };
    updateField('magias.lista', next);
  };

  const addSpell = (level) => updateField('magias.lista', [
    ...spells,
    {
      nome: '', nivel: level, escola: '', tempo: '', alcance: '', duracao: '', alvo: '',
      verbal: false, somatico: false, material: false, materialDetalhe: '',
      concentracao: false, ritual: false, preparada: false,
      salvaguarda: '', dano: '', desc: ''
    }
  ]);

  const removeSpell = (index) => updateField('magias.lista', spells.filter((_, i) => i !== index));

  const moveSpell = (index, direction) => {
    const level = clampSpellLevel(spells[index]?.nivel);
    const indices = spells
      .map((spell, originalIndex) => ({ originalIndex, level: clampSpellLevel(spell?.nivel) }))
      .filter(item => item.level === level)
      .map(item => item.originalIndex);
    const position = indices.indexOf(index);
    const targetPosition = position + direction;
    if (position < 0 || targetPosition < 0 || targetPosition >= indices.length) return;
    const targetIndex = indices[targetPosition];
    const next = [...spells];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    updateField('magias.lista', next);
  };

  const sortCircle = (level) => {
    const indices = spells
      .map((spell, originalIndex) => ({ spell, originalIndex }))
      .filter(item => clampSpellLevel(item.spell?.nivel) === level)
      .map(item => item.originalIndex);
    if (indices.length < 2) return;
    const ordered = indices
      .map(index => spells[index])
      .sort((a, b) => String(a?.nome || '').localeCompare(String(b?.nome || ''), 'pt-BR', { sensitivity: 'base' }));
    const next = [...spells];
    indices.forEach((originalIndex, position) => { next[originalIndex] = ordered[position]; });
    updateField('magias.lista', next);
  };

  const renderSpell = (spell, index, level, circleItems) => {
    const position = circleItems.findIndex(item => item.index === index);
    const components = [spell?.verbal && 'V', spell?.somatico && 'S', spell?.material && 'M'].filter(Boolean).join(' / ');

    return (
      <article key={index} className={`dnd-v6-spell-card ${spell?.preparada ? 'is-prepared' : ''}`}>
        <div className="dnd-v6-spell-head">
          <label className="dnd-v6-prepared" title="Magia preparada"><input type="checkbox" checked={!!spell?.preparada} onChange={e => updateSpell(index, { preparada: e.target.checked })} /><span>Preparada</span></label>
          <input className="dnd-v6-spell-name" value={spell?.nome || ''} onChange={e => updateSpell(index, { nome: e.target.value })} placeholder="Nome da magia" />
          <input className="dnd-v6-spell-school" value={spell?.escola || ''} onChange={e => updateSpell(index, { escola: e.target.value })} placeholder="Escola" />
          <div className="dnd-v6-spell-order">
            <button type="button" disabled={position <= 0} onClick={() => moveSpell(index, -1)} title="Mover para cima">↑</button>
            <button type="button" disabled={position >= circleItems.length - 1} onClick={() => moveSpell(index, 1)} title="Mover para baixo">↓</button>
            <button type="button" className="danger" onClick={() => removeSpell(index)} title="Remover magia">×</button>
          </div>
        </div>

        <div className="dnd-v6-spell-meta" aria-label="Resumo da magia">
          <span className="accent" title="Círculo definido pela seção">{circleName(level)}</span>
          {spell?.tempo && <span title="Tempo de conjuração">⏱ {spell.tempo}</span>}
          {spell?.alcance && <span title="Alcance">↗ {spell.alcance}</span>}
          {spell?.duracao && <span title="Duração">◷ {spell.duracao}</span>}
          {spell?.alvo && <span title="Alvo">◎ {spell.alvo}</span>}
          {components && <span title="Componentes">{components}</span>}
          {spell?.salvaguarda && <span title="Salvaguarda">Salv. {spell.salvaguarda}</span>}
          {spell?.dano && <span title="Dano ou efeito">{spell.dano}</span>}
          {spell?.concentracao && <span className="accent" title="Concentração">C</span>}
          {spell?.ritual && <span className="accent" title="Ritual">Ritual</span>}
        </div>

        <details className="dnd-v6-spell-details">
          <summary>Editar detalhes</summary>
          <div className="dnd-v6-spell-fields">
            <label><span>Tempo</span><input value={spell?.tempo || ''} onChange={e => updateSpell(index, { tempo: e.target.value })} placeholder="1 ação" /></label>
            <label><span>Alcance</span><input value={spell?.alcance || ''} onChange={e => updateSpell(index, { alcance: e.target.value })} placeholder="18 m" /></label>
            <label><span>Duração</span><input value={spell?.duracao || ''} onChange={e => updateSpell(index, { duracao: e.target.value })} placeholder="Instantânea" /></label>
          </div>
          <div className="dnd-v6-spell-fields">
            <label><span>Alvo / Área</span><input value={spell?.alvo || ''} onChange={e => updateSpell(index, { alvo: e.target.value })} placeholder="1 criatura / cone de 4,5 m" /></label>
            <label><span>Salvaguarda</span><input value={spell?.salvaguarda || ''} onChange={e => updateSpell(index, { salvaguarda: e.target.value })} placeholder="DES / SAB / nenhuma" /></label>
            <label><span>Dano / Efeito</span><input value={spell?.dano || ''} onChange={e => updateSpell(index, { dano: e.target.value })} placeholder="3d6 fogo / cura 2d8" /></label>
          </div>
          <div className="dnd-v6-spell-flags">
            <label><input type="checkbox" checked={!!spell?.verbal} onChange={e => updateSpell(index, { verbal: e.target.checked })} /><span>V</span></label>
            <label><input type="checkbox" checked={!!spell?.somatico} onChange={e => updateSpell(index, { somatico: e.target.checked })} /><span>S</span></label>
            <label><input type="checkbox" checked={!!spell?.material} onChange={e => updateSpell(index, { material: e.target.checked })} /><span>M</span></label>
            <label className="wide"><input type="checkbox" checked={!!spell?.concentracao} onChange={e => updateSpell(index, { concentracao: e.target.checked })} /><span>Concentração</span></label>
            <label className="wide"><input type="checkbox" checked={!!spell?.ritual} onChange={e => updateSpell(index, { ritual: e.target.checked })} /><span>Ritual</span></label>
          </div>
          {spell?.material && (
            <label className="dnd-v6-class-notes">
              <span>Componente material</span>
              <input value={spell?.materialDetalhe || ''} onChange={e => updateSpell(index, { materialDetalhe: e.target.value })} placeholder="Material, foco ou custo consumido..." />
            </label>
          )}
          <textarea rows="4" value={spell?.desc || ''} onChange={e => updateSpell(index, { desc: e.target.value })} placeholder="Efeito completo, condições, escalonamento, observações e lembretes..." />
        </details>
      </article>
    );
  };

  return (
    <div className="dnd-paper dnd-v3 font-dnd dnd-v6-custom-paper">
      <div className="dnd-v3-sheet dnd-v6-sheet">
        <div className="dnd-v6-spell-page">
          <section className="dnd-v6-spell-toolbar">
            <div className="dnd-v6-spell-title">
              <div><small>Conjuração</small><b>Livro de Magias</b><span>Adicione a magia no círculo correto. O círculo fica fixo pela seção e não precisa ser selecionado novamente.</span></div>
              <div className="dnd-v6-spell-count"><strong>{spells.filter(spell => spell?.preparada).length}</strong><span>preparadas</span><i>/</i><strong>{spells.length}</strong><span>total</span></div>
            </div>
            <div className="dnd-v6-casting-grid">
              <label><span>Habilidade</span><input value={data.magias?.conjuracao?.habilidade || ''} onChange={e => updateField('magias.conjuracao.habilidade', e.target.value)} placeholder="INT / SAB / CAR" /></label>
              <label><span>CD para Resistir</span><input value={data.magias?.conjuracao?.cd || ''} onChange={e => updateField('magias.conjuracao.cd', e.target.value)} placeholder="13" /></label>
              <label><span>Ataque de Magia</span><input value={data.magias?.conjuracao?.ataque || ''} onChange={e => updateField('magias.conjuracao.ataque', e.target.value)} placeholder="+5" /></label>
            </div>
          </section>

          <div className="dnd-v6-circles">
            {Array.from({ length: 10 }, (_, level) => {
              const circleItems = spells.map((spell, index) => ({ spell, index })).filter(item => clampSpellLevel(item.spell?.nivel) === level);
              const slot = data.magias?.slots?.[level] || { atual: 0, max: 0 };
              return (
                <details key={level} className="dnd-v6-circle" open={level === 0 || circleItems.length > 0}>
                  <summary>
                    <div className="dnd-v6-circle-name"><b>{circleName(level)}</b><span>{circleItems.length} magia{circleItems.length === 1 ? '' : 's'}</span></div>
                    {level > 0 && (
                      <div className="dnd-v6-slots" onClick={e => e.stopPropagation()}>
                        <span>Espaços</span>
                        <label><small>Atual</small><input type="number" min="0" value={slot.atual ?? 0} onChange={e => updateField(`magias.slots.${level}.atual`, Number(e.target.value) || 0)} /></label>
                        <i>/</i>
                        <label><small>Máx.</small><input type="number" min="0" value={slot.max ?? 0} onChange={e => updateField(`magias.slots.${level}.max`, Number(e.target.value) || 0)} /></label>
                      </div>
                    )}
                    <div className="dnd-v6-circle-actions" onClick={e => e.stopPropagation()}>
                      <button type="button" disabled={circleItems.length < 2} onClick={() => sortCircle(level)}>A–Z</button>
                      <button type="button" className="primary" onClick={() => addSpell(level)}>+ Magia</button>
                    </div>
                  </summary>
                  <div className="dnd-v6-spell-grid">
                    {circleItems.length === 0
                      ? <p className="dnd-v6-empty">Nenhuma magia neste círculo. Use “+ Magia” para criar uma diretamente aqui.</p>
                      : circleItems.map(item => renderSpell(item.spell, item.index, level, circleItems))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
