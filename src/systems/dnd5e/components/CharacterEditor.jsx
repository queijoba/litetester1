import '../dnd-sheet-v4.css';

// Editor modular de personagem D&D 5.5e / regras 2024.
// A ficha prioriza leitura rápida em jogo, compatibilidade com dados antigos
// e uma experiência equivalente no desktop e no celular.
export default function DndCharacterEditor({ scope }) {
  const {
    React,
    data,
    isDnd,
    DND_SKILLS_LIST,
    SVGIcons,
    mobileTab,
    setMobileTab,
    dndPcTab,
    setDndPcTab,
    updateField,
    updateArrayField,
    addToArray,
    removeFromArray,
    getDndAbilityMod,
    getProficiencyBonus,
    formatDndMod,
    optimizeImageFile,
    showToast,
    showUrlInput,
    setShowUrlInput,
    tempUrl,
    setTempUrl,
    addDndSyncedItem,
    updateDndSyncedItem,
    removeDndSyncedItem
  } = scope;

  if (!isDnd || data.type !== 'pc') return null;

  const activeMainTab = ['status', 'recursos', 'magias'].includes(mobileTab) ? mobileTab : 'status';

  const abilities = [
    ['for', 'Força'], ['des', 'Destreza'], ['con', 'Constituição'],
    ['int', 'Inteligência'], ['sab', 'Sabedoria'], ['car', 'Carisma']
  ];

  const features = Array.isArray(data.caracteristicas) ? data.caracteristicas : [];
  const spells = Array.isArray(data.magias?.lista) ? data.magias.lista : [];
  const attunements = Array.isArray(data.sintonizacao) ? data.sintonizacao : ['', '', ''];
  const deathSaves = {
    sucessos: Array.isArray(data.testesMorte?.sucessos) ? data.testesMorte.sucessos : [false, false, false],
    falhas: Array.isArray(data.testesMorte?.falhas) ? data.testesMorte.falhas : [false, false, false]
  };

  const spellLevel = (spell) => {
    const raw = spell?.nivel;
    if (typeof raw === 'number' && Number.isFinite(raw)) return Math.max(0, Math.min(9, raw));
    const text = String(raw ?? '').trim().toLowerCase();
    if (!text || text.includes('truque') || text.includes('cantrip')) return 0;
    const parsed = parseInt(text.match(/\d+/)?.[0] || '0', 10);
    return Math.max(0, Math.min(9, Number.isFinite(parsed) ? parsed : 0));
  };

  const circleName = (level) => level === 0 ? 'Truques' : `${level}º Círculo`;

  const updateSpell = (index, patch) => {
    const next = [...spells];
    next[index] = { ...next[index], ...patch };
    updateField('magias.lista', next);
  };

  const addSpell = (level) => {
    updateField('magias.lista', [
      ...spells,
      {
        nome: '', nivel: level, escola: '', tempo: '', alcance: '', duracao: '',
        verbal: false, somatico: false, material: false,
        concentracao: false, ritual: false, preparada: false, desc: ''
      }
    ]);
  };

  const removeSpell = (index) => {
    updateField('magias.lista', spells.filter((_, i) => i !== index));
  };

  const moveSpellInsideCircle = (index, direction) => {
    const level = spellLevel(spells[index]);
    const sameCircle = spells
      .map((spell, originalIndex) => ({ originalIndex, level: spellLevel(spell) }))
      .filter(item => item.level === level)
      .map(item => item.originalIndex);
    const position = sameCircle.indexOf(index);
    const targetPosition = position + direction;
    if (position < 0 || targetPosition < 0 || targetPosition >= sameCircle.length) return;
    const targetIndex = sameCircle[targetPosition];
    const next = [...spells];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    updateField('magias.lista', next);
  };

  const sortCircleAlphabetically = (level) => {
    const indices = spells
      .map((spell, originalIndex) => ({ spell, originalIndex }))
      .filter(item => spellLevel(item.spell) === level)
      .map(item => item.originalIndex);
    if (indices.length < 2) return;
    const ordered = indices
      .map(index => spells[index])
      .sort((a, b) => String(a?.nome || '').localeCompare(String(b?.nome || ''), 'pt-BR', { sensitivity: 'base' }));
    const next = [...spells];
    indices.forEach((originalIndex, position) => { next[originalIndex] = ordered[position]; });
    updateField('magias.lista', next);
  };

  const renderFeatureCard = (entry, index, allowType = true) => (
    <div key={index} className="dnd-v3-feature-card">
      <div className="dnd-v3-feature-top">
        <input
          value={entry?.nome || ''}
          onChange={e => updateArrayField('caracteristicas', index, 'nome', e.target.value)}
          placeholder="Nome do recurso"
          className="dnd-v3-line-input dnd-v3-feature-name"
        />
        {allowType && (
          <select
            value={entry?.tipo || 'classe'}
            onChange={e => updateArrayField('caracteristicas', index, 'tipo', e.target.value)}
            className="dnd-v3-mini-select"
          >
            <option value="classe">Classe</option>
            <option value="especie">Espécie</option>
            <option value="outro">Outro</option>
            <option value="talento">Talento</option>
          </select>
        )}
        <button type="button" onClick={() => removeFromArray('caracteristicas', index)} className="dnd-v3-icon-danger" title="Remover"><SVGIcons.Trash /></button>
      </div>
      <textarea
        rows="3"
        value={entry?.desc || ''}
        onChange={e => updateArrayField('caracteristicas', index, 'desc', e.target.value)}
        placeholder="Efeito, usos, limite e observações..."
        className="dnd-v3-plain-textarea"
      />
    </div>
  );

  const renderSpellCard = (spell, index, level) => {
    const sameCircle = spells.map((item, originalIndex) => ({ item, originalIndex })).filter(x => spellLevel(x.item) === level);
    const circlePosition = sameCircle.findIndex(x => x.originalIndex === index);
    return (
      <div key={index} className={`dnd-v3-spell-card ${spell?.preparada ? 'is-prepared' : ''}`}>
        <div className="dnd-v3-spell-head">
          <label className="dnd-v3-prepared" title="Magia preparada">
            <input type="checkbox" checked={!!spell?.preparada} onChange={e => updateSpell(index, { preparada: e.target.checked })} />
            <span>Prep.</span>
          </label>
          <input className="dnd-v3-spell-name" value={spell?.nome || ''} onChange={e => updateSpell(index, { nome: e.target.value })} placeholder="Nome da magia" />
          <input className="dnd-v3-spell-school" value={spell?.escola || ''} onChange={e => updateSpell(index, { escola: e.target.value })} placeholder="Escola" />
          <div className="dnd-v3-order-buttons">
            <button type="button" disabled={circlePosition <= 0} onClick={() => moveSpellInsideCircle(index, -1)} title="Mover para cima">↑</button>
            <button type="button" disabled={circlePosition >= sameCircle.length - 1} onClick={() => moveSpellInsideCircle(index, 1)} title="Mover para baixo">↓</button>
            <button type="button" onClick={() => removeSpell(index)} className="danger" title="Remover magia">×</button>
          </div>
        </div>
        <details className="dnd-v3-spell-details">
          <summary>Detalhes da magia</summary>
          <div className="dnd-v3-spell-fields">
            <label><span>Tempo</span><input value={spell?.tempo || ''} onChange={e => updateSpell(index, { tempo: e.target.value })} placeholder="1 ação" /></label>
            <label><span>Alcance</span><input value={spell?.alcance || ''} onChange={e => updateSpell(index, { alcance: e.target.value })} placeholder="18 m" /></label>
            <label><span>Duração</span><input value={spell?.duracao || ''} onChange={e => updateSpell(index, { duracao: e.target.value })} placeholder="Instantânea" /></label>
            <label><span>Círculo</span><select value={level} onChange={e => updateSpell(index, { nivel: Number(e.target.value) })}>{Array.from({ length: 10 }, (_, lvl) => <option key={lvl} value={lvl}>{circleName(lvl)}</option>)}</select></label>
          </div>
          <div className="dnd-v3-spell-flags">
            <label><input type="checkbox" checked={!!spell?.verbal} onChange={e => updateSpell(index, { verbal: e.target.checked })} /><span>V</span></label>
            <label><input type="checkbox" checked={!!spell?.somatico} onChange={e => updateSpell(index, { somatico: e.target.checked })} /><span>S</span></label>
            <label><input type="checkbox" checked={!!spell?.material} onChange={e => updateSpell(index, { material: e.target.checked })} /><span>M</span></label>
            <label className="wide"><input type="checkbox" checked={!!spell?.concentracao} onChange={e => updateSpell(index, { concentracao: e.target.checked })} /><span>Concentração</span></label>
            <label className="wide"><input type="checkbox" checked={!!spell?.ritual} onChange={e => updateSpell(index, { ritual: e.target.checked })} /><span>Ritual</span></label>
          </div>
          <textarea rows="3" value={spell?.desc || ''} onChange={e => updateSpell(index, { desc: e.target.value })} placeholder="Componentes materiais, efeito, dano, alvo, observações..." className="dnd-v3-plain-textarea" />
        </details>
      </div>
    );
  };

  return (
    <div className="dnd-paper dnd-v3 font-dnd">
      <div className="dnd-v3-main-tabs dnd-v4-main-tabs sticky top-0 z-20">
        <button type="button" onClick={() => setMobileTab('status')} className={activeMainTab === 'status' ? 'active' : ''}>Ficha & Combate</button>
        <button type="button" onClick={() => setMobileTab('recursos')} className={activeMainTab === 'recursos' ? 'active' : ''}>Recursos</button>
        <button type="button" onClick={() => setMobileTab('magias')} className={activeMainTab === 'magias' ? 'active' : ''}>Magias</button>
      </div>

      {activeMainTab !== 'status' && (
        <div className="dnd-v3-context">
          <div className="min-w-0">
            <strong>{data.bio?.nome || 'Personagem sem nome'}</strong>
            <span>{[data.bio?.classe, data.bio?.subclasse, data.bio?.nivel ? `Nível ${data.bio.nivel}` : ''].filter(Boolean).join(' • ') || 'D&D 5.5e / 2024'}</span>
          </div>
          <b>D&D 5.5e</b>
        </div>
      )}

      <div className="dnd-v3-sheet">
        {activeMainTab === 'status' && (
          <div className="dnd-v3-pane">
            <header className="dnd-v3-header">
              <div className="dnd-v3-portrait-wrap">
                <div className="dnd-v3-portrait group">
                  {data.bio?.imagem ? <img src={data.bio.imagem} alt="Retrato" /> : <span>Retrato</span>}
                  <div className={`dnd-v3-portrait-tools ${showUrlInput ? 'show' : ''}`}>
                    {!showUrlInput ? (
                      <React.Fragment>
                        <label>Upload<input type="file" accept="image/*" onChange={async e => { const file = e.target.files?.[0]; e.target.value = ''; if (!file) return; try { updateField('bio.imagem', await optimizeImageFile(file, 720, 0.82)); } catch (err) { console.error(err); showToast('Não foi possível usar esta imagem.'); } }} /></label>
                        <button type="button" onClick={() => setShowUrlInput(true)}>URL</button>
                        {data.bio?.imagem && <button type="button" onClick={() => updateField('bio.imagem', '')} className="danger">Remover</button>}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <input value={tempUrl} onChange={e => setTempUrl(e.target.value)} placeholder="https://..." />
                        <button type="button" onClick={() => { if (tempUrl.trim()) updateField('bio.imagem', tempUrl.trim()); setTempUrl(''); setShowUrlInput(false); }}>Aplicar</button>
                        <button type="button" onClick={() => { setTempUrl(''); setShowUrlInput(false); }}>Voltar</button>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>

              <div className="dnd-v3-identity">
                <div className="dnd-v3-brand"><span>D&D 5.5E</span><small>Regras 2024</small></div>
                <input className="dnd-v3-name" value={data.bio?.nome || ''} onChange={e => updateField('bio.nome', e.target.value)} placeholder="Nome do Personagem" />
                <div className="dnd-v3-bio-grid">
                  <label><span>Classe</span><input value={data.bio?.classe || ''} onChange={e => updateField('bio.classe', e.target.value)} /></label>
                  <label><span>Subclasse</span><input value={data.bio?.subclasse || ''} onChange={e => updateField('bio.subclasse', e.target.value)} /></label>
                  <label><span>Nível</span><input type="number" min="1" value={data.bio?.nivel ?? 1} onChange={e => updateField('bio.nivel', Math.max(1, Number(e.target.value) || 1))} /></label>
                  <label><span>Espécie</span><input value={data.bio?.linhagem || ''} onChange={e => updateField('bio.linhagem', e.target.value)} /></label>
                  <label><span>Origem / Antecedente</span><input value={data.bio?.antecedente || ''} onChange={e => updateField('bio.antecedente', e.target.value)} /></label>
                  <label><span>Alinhamento</span><input value={data.bio?.alinhamento || ''} onChange={e => updateField('bio.alinhamento', e.target.value)} /></label>
                  <label><span>XP</span><input type="number" min="0" value={data.bio?.xp ?? 0} onChange={e => updateField('bio.xp', Number(e.target.value) || 0)} /></label>
                  <label><span>Jogador</span><input value={data.bio?.jogador || ''} onChange={e => updateField('bio.jogador', e.target.value)} /></label>
                </div>
              </div>
            </header>

            <section className="dnd-v3-section">
              <div className="dnd-v3-section-title"><span>Atributos & Salvaguardas</span><small>Salvaguarda integrada acima de cada atributo</small></div>
              <div className="dnd-v3-ability-grid">
                {abilities.map(([attr, label]) => {
                  const score = Number(data.atributos?.[attr] ?? 10);
                  const proficient = !!data.proficienciasResistencia?.[attr];
                  const saveTotal = getDndAbilityMod(score) + (proficient ? getProficiencyBonus(data.bio?.nivel || 1) : 0);
                  return (
                    <div key={attr} className="dnd-v3-ability">
                      <label className="dnd-v3-save-line" title={`Salvaguarda de ${label}`}>
                        <input type="checkbox" checked={proficient} onChange={e => updateField(`proficienciasResistencia.${attr}`, e.target.checked)} />
                        <span>Salv.</span>
                        <strong>{formatDndMod(saveTotal)}</strong>
                      </label>
                      <div className="dnd-v3-ability-label">{label}</div>
                      <input type="number" value={score} onChange={e => updateField(`atributos.${attr}`, Number(e.target.value) || 10)} />
                      <div className="dnd-v3-ability-mod">{formatDndMod(getDndAbilityMod(score))}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="dnd-v3-overview-grid">
              <section className="dnd-v3-section dnd-v3-skills-panel">
                <div className="dnd-v3-section-title">
                  <span>Perícias</span>
                  <small>Toque no marcador: sem proficiência → proficiente → expertise</small>
                </div>
                <div className="dnd-v3-quick-row">
                  <div><b>+{getProficiencyBonus(data.bio?.nivel || 1)}</b><span>Proficiência</span></div>
                  <label><input type="checkbox" checked={!!data.status?.inspiracao} onChange={e => updateField('status.inspiracao', e.target.checked)} /><span>Inspiração Heroica</span></label>
                  <label><span>Percepção Passiva</span><input type="number" value={data.status?.percepcaoPassiva ?? ''} onChange={e => updateField('status.percepcaoPassiva', e.target.value)} placeholder={String(10 + getDndAbilityMod(data.atributos?.sab ?? 10) + (((data.pericias || []).find(p => p.id === 'percepcao')?.prof || 0) * getProficiencyBonus(data.bio?.nivel || 1)))} /></label>
                </div>
                <div className="dnd-v3-skills-grid">
                  {DND_SKILLS_LIST.map(skill => {
                    const entry = (data.pericias || []).find(p => p.id === skill.id) || { prof: 0 };
                    const attrMod = getDndAbilityMod(data.atributos?.[skill.attr] ?? 10);
                    const profBonus = getProficiencyBonus(data.bio?.nivel || 1);
                    const total = attrMod + (entry.prof === 1 ? profBonus : entry.prof === 2 ? profBonus * 2 : 0);
                    const toggle = () => {
                      const list = [...(data.pericias || [])];
                      const index = list.findIndex(p => p.id === skill.id);
                      if (index >= 0) list[index] = { ...list[index], prof: entry.prof === 0 ? 1 : entry.prof === 1 ? 2 : 0 };
                      else list.push({ id: skill.id, prof: 1 });
                      updateField('pericias', list);
                    };
                    return (
                      <button type="button" key={skill.id} onClick={toggle} className="dnd-v3-skill-row" title="Alternar proficiência / expertise">
                        <i className={entry.prof === 2 ? 'expert' : entry.prof === 1 ? 'prof' : ''}></i>
                        <b>{formatDndMod(total)}</b>
                        <span>{skill.nome}</span>
                        <small>{skill.attr.toUpperCase()}</small>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="dnd-v3-section dnd-v3-combat-panel">
                <div className="dnd-v3-section-title"><span>Status & Combate</span><small>Valores usados com mais frequência durante a sessão</small></div>
                <div className="dnd-v3-combat-stats">
                  <label className="accent"><span>CA</span><input type="number" value={data.status?.ca ?? 10} onChange={e => updateField('status.ca', Number(e.target.value) || 10)} /><small>Escudo <input type="number" min="0" value={data.status?.escudo ?? 0} onChange={e => updateField('status.escudo', Number(e.target.value) || 0)} /></small></label>
                  <label><span>Iniciativa</span><input value={data.status?.iniciativa || ''} onChange={e => updateField('status.iniciativa', e.target.value)} placeholder="+0" /></label>
                  <label><span>Velocidade</span><input value={data.status?.deslocamento || ''} onChange={e => updateField('status.deslocamento', e.target.value)} /></label>
                  <label><span>Tamanho</span><input value={data.status?.tamanho || ''} onChange={e => updateField('status.tamanho', e.target.value)} /></label>
                </div>

                <div className="dnd-v3-hp-card">
                  <div className="dnd-v3-hp-main"><span>Pontos de Vida</span><input type="number" value={data.status?.pvAtual ?? 0} onChange={e => updateField('status.pvAtual', Number(e.target.value) || 0)} /></div>
                  <div className="dnd-v3-hp-side"><label><span>Máximo</span><input type="number" value={data.status?.pvMax ?? 0} onChange={e => updateField('status.pvMax', Number(e.target.value) || 0)} /></label><label><span>Temporários</span><input type="number" value={data.status?.pvTemp ?? 0} onChange={e => updateField('status.pvTemp', Number(e.target.value) || 0)} /></label></div>
                </div>

                <div className="dnd-v3-survival-grid">
                  <label><span>Dados de Vida</span><input value={data.status?.dadosVida || ''} onChange={e => updateField('status.dadosVida', e.target.value)} /></label>
                  <div className="dnd-v3-death-saves"><span>Testes de Morte</span><div><small>Sucessos</small>{[0,1,2].map(i => <input key={`s${i}`} type="checkbox" checked={!!deathSaves.sucessos[i]} onChange={e => { const list = [...deathSaves.sucessos]; list[i] = e.target.checked; updateField('testesMorte.sucessos', list); }} />)}</div><div><small>Falhas</small>{[0,1,2].map(i => <input key={`f${i}`} type="checkbox" checked={!!deathSaves.falhas[i]} onChange={e => { const list = [...deathSaves.falhas]; list[i] = e.target.checked; updateField('testesMorte.falhas', list); }} />)}</div></div>
                </div>
              </section>
            </div>

            <div className="dnd-v3-bottom-grid">
              <section className="dnd-v3-section">
                <div className="dnd-v3-section-title"><span>Ataques</span><button type="button" onClick={() => addToArray('ataques', { nome: '', bonus: '', dano: '', tipo: '' })}>+ Ataque</button></div>
                <div className="dnd-v3-attack-list">
                  {(data.ataques || []).map((attack, index) => (
                    <div key={index} className={`dnd-v3-attack-row ${attack?.sourceItemId ? 'synced' : ''}`}>
                      <label className="name"><span>Ataque</span><input value={attack?.nome || ''} onChange={e => updateArrayField('ataques', index, 'nome', e.target.value)} placeholder="Nome" /></label>
                      <label><span>Bônus</span><input value={attack?.bonus || ''} onChange={e => updateArrayField('ataques', index, 'bonus', e.target.value)} placeholder="+0" /></label>
                      <label><span>Dano</span><input value={attack?.dano || ''} onChange={e => updateArrayField('ataques', index, 'dano', e.target.value)} placeholder="1d8" /></label>
                      <label><span>Tipo</span><input value={attack?.tipo || ''} onChange={e => updateArrayField('ataques', index, 'tipo', e.target.value)} placeholder="Cortante" /></label>
                      <button type="button" onClick={() => removeFromArray('ataques', index)} title="Remover"><SVGIcons.Trash /></button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="dnd-v3-section">
                <div className="dnd-v3-section-title"><span>Equipamento & Inventário</span><button type="button" onClick={addDndSyncedItem}>+ Item</button></div>
                <div className="dnd-v3-coins">
                  {['pc','pp','pe','po','pl'].map(key => <label key={key}><span>{key.toUpperCase()}</span><input type="number" value={data.moedas?.[key] ?? 0} onChange={e => updateField(`moedas.${key}`, Number(e.target.value) || 0)} /></label>)}
                </div>
                <div className="dnd-v3-item-list">
                  {(Array.isArray(data.itensSincronizados) ? data.itensSincronizados : []).map((item, index) => (
                    <div key={item.syncId || index} className="dnd-v3-item-row">
                      <input className="name" value={item.nome || ''} onChange={e => updateDndSyncedItem(index, { nome: e.target.value })} placeholder="Item" />
                      <input type="number" min="0" value={item.quantidade ?? 1} onChange={e => updateDndSyncedItem(index, { quantidade: Number(e.target.value) })} title="Quantidade" />
                      <select value={item.tipo || 'Equipamento'} onChange={e => updateDndSyncedItem(index, { tipo: e.target.value })}><option>Equipamento</option><option>Arma</option><option>Armadura</option><option>Escudo</option><option>Consumível</option><option>Ferramenta</option><option>Outro</option></select>
                      {item.tipo === 'Arma' && <label className="sync"><input type="checkbox" checked={!!item.sincronizarAtaque} onChange={e => updateDndSyncedItem(index, { sincronizarAtaque: e.target.checked })} /><span>↔ Ataque</span></label>}
                      <button type="button" onClick={() => removeDndSyncedItem(index)} title="Remover"><SVGIcons.Trash /></button>
                    </div>
                  ))}
                </div>
                <textarea rows="4" value={data.inventario || ''} onChange={e => updateField('inventario', e.target.value)} className="dnd-v3-inventory-notes" placeholder="Inventário livre, tesouros e anotações..." />
              </section>
            </div>
          </div>
        )}

        {activeMainTab === 'recursos' && (
          <div className="dnd-v3-pane dnd-v4-resources-page">
            <section className="dnd-v3-roleplay-grid">
              <label><span>Aparência</span><textarea rows="3" value={data.bio?.aparencia || ''} onChange={e => updateField('bio.aparencia', e.target.value)} placeholder="Descrição visual, marcas, roupas, símbolos..." /></label>
              <label><span>História & Personalidade</span><textarea rows="3" value={data.bio?.historiaPersonalidade || ''} onChange={e => updateField('bio.historiaPersonalidade', e.target.value)} placeholder="Passado, motivações, hábitos e interpretação..." /></label>
            </section>

            <div className="dnd-v4-resource-grid">
              <section className="dnd-v4-resource-card class-card">
                <div className="dnd-v3-column-head"><div><b>Características de Classe</b><small>Recursos concedidos pela classe e subclasse</small></div><button type="button" onClick={() => addToArray('caracteristicas', { tipo: 'classe', nome: '', desc: '' })}>+ Classe</button></div>
                <div className="dnd-v4-resource-list">
                  {features.map((entry, index) => ({ entry, index })).filter(item => (item.entry?.tipo || 'classe') === 'classe').length === 0
                    ? <p className="dnd-v4-empty">Nenhuma característica de classe cadastrada.</p>
                    : features.map((entry, index) => ({ entry, index })).filter(item => (item.entry?.tipo || 'classe') === 'classe').map(item => renderFeatureCard(item.entry, item.index, false))}
                </div>
              </section>

              <section className="dnd-v4-resource-card species-card">
                <div className="dnd-v3-column-head"><div><b>Características de Espécie</b><small>Traços, sentidos, deslocamentos e capacidades</small></div><button type="button" onClick={() => addToArray('caracteristicas', { tipo: 'especie', nome: '', desc: '' })}>+ Espécie</button></div>
                <div className="dnd-v4-resource-list">
                  {features.map((entry, index) => ({ entry, index })).filter(item => item.entry?.tipo === 'especie').length === 0
                    ? <p className="dnd-v4-empty">Nenhuma característica de espécie cadastrada.</p>
                    : features.map((entry, index) => ({ entry, index })).filter(item => item.entry?.tipo === 'especie').map(item => renderFeatureCard(item.entry, item.index, false))}
                </div>
              </section>

              <section className="dnd-v4-resource-card extras-card">
                <div className="dnd-v3-column-head"><div><b>Talentos & Outros</b><small>Talentos de origem, gerais, épicos e recursos extras</small></div></div>
                <div className="dnd-v4-split-head"><h4>Talentos</h4><button type="button" onClick={() => addToArray('caracteristicas', { tipo: 'talento', nome: '', desc: '' })}>+ Talento</button></div>
                <div className="dnd-v4-resource-list compact">
                  {features.map((entry, index) => ({ entry, index })).filter(item => item.entry?.tipo === 'talento').length === 0
                    ? <p className="dnd-v4-empty">Nenhum talento cadastrado.</p>
                    : features.map((entry, index) => ({ entry, index })).filter(item => item.entry?.tipo === 'talento').map(item => renderFeatureCard(item.entry, item.index, false))}
                </div>
                <div className="dnd-v4-split-head other"><h4>Outras Habilidades</h4><button type="button" onClick={() => addToArray('caracteristicas', { tipo: 'outro', nome: '', desc: '' })}>+ Outra</button></div>
                <div className="dnd-v4-resource-list compact">
                  {features.map((entry, index) => ({ entry, index })).filter(item => item.entry?.tipo === 'outro').length === 0
                    ? <p className="dnd-v4-empty">Nenhuma habilidade adicional cadastrada.</p>
                    : features.map((entry, index) => ({ entry, index })).filter(item => item.entry?.tipo === 'outro').map(item => renderFeatureCard(item.entry, item.index, false))}
                </div>
              </section>
            </div>

            <div className="dnd-v4-support-grid">
              <section className="dnd-v3-side-card dnd-v4-support-card">
                <h4>Treino & Proficiências</h4>
                <div className="dnd-v3-training-grid">
                  {[['leve','Leve'],['media','Média'],['pesada','Pesada'],['escudos','Escudos']].map(([key,label]) => <label key={key}><input type="checkbox" checked={!!data.treinoArmadura?.[key]} onChange={e => updateField(`treinoArmadura.${key}`, e.target.checked)} /><span>{label}</span></label>)}
                </div>
                <div className="dnd-v4-proficiency-grid">
                  <label><span>Armas</span><textarea rows="2" value={data.armasProficiencias || ''} onChange={e => updateField('armasProficiencias', e.target.value)} placeholder="Simples, marciais e específicas..." /></label>
                  <label><span>Ferramentas</span><textarea rows="2" value={data.ferramentas || ''} onChange={e => updateField('ferramentas', e.target.value)} placeholder="Kits, instrumentos, veículos..." /></label>
                  <label><span>Idiomas</span><textarea rows="2" value={data.idiomas || ''} onChange={e => updateField('idiomas', e.target.value)} placeholder="Comum, Élfico, Dracônico..." /></label>
                </div>
              </section>
              <section className="dnd-v3-side-card dnd-v4-support-card">
                <h4>Sintonização & Interpretação</h4>
                <div className="dnd-v4-attunement-grid">
                  {attunements.map((item, index) => <label key={index} className="dnd-v3-attune"><span>✦</span><input value={item} onChange={e => { const list = [...attunements]; list[index] = e.target.value; updateField('sintonizacao', list); }} placeholder={`Item sintonizado ${index + 1}`} /></label>)}
                </div>
                <details className="dnd-v3-classic-roleplay dnd-v4-classic-roleplay">
                  <summary>Detalhes clássicos de interpretação</summary>
                  <div>
                    <label><span>Traços de Personalidade</span><textarea rows="2" value={data.tracosPersonalidade || ''} onChange={e => updateField('tracosPersonalidade', e.target.value)} /></label>
                    <label><span>Ideais</span><textarea rows="2" value={data.ideais || ''} onChange={e => updateField('ideais', e.target.value)} /></label>
                    <label><span>Vínculos</span><textarea rows="2" value={data.vinculos || ''} onChange={e => updateField('vinculos', e.target.value)} /></label>
                    <label><span>Defeitos</span><textarea rows="2" value={data.defeitos || ''} onChange={e => updateField('defeitos', e.target.value)} /></label>
                  </div>
                </details>
              </section>
            </div>
          </div>
        )}

        {activeMainTab === 'magias' && (
          <div className="dnd-v3-pane dnd-v4-spell-page">
            <section className="dnd-v4-spell-toolbar">
              <div className="dnd-v4-spell-title">
                <div><b>Livro de Magias</b><span>Organização por círculo, preparação e ordem personalizada</span></div>
                <div className="dnd-v4-spell-count"><strong>{spells.filter(spell => spell?.preparada).length}</strong><span>preparadas</span><i>/</i><strong>{spells.length}</strong><span>total</span></div>
              </div>
              <div className="dnd-v3-casting-grid dnd-v4-casting-grid">
                <label><span>Habilidade de Conjuração</span><input value={data.magias?.conjuracao?.habilidade || ''} onChange={e => updateField('magias.conjuracao.habilidade', e.target.value)} placeholder="INT/SAB/CAR" /></label>
                <label><span>CD para Resistir</span><input value={data.magias?.conjuracao?.cd || ''} onChange={e => updateField('magias.conjuracao.cd', e.target.value)} placeholder="13" /></label>
                <label><span>Ataque de Magia</span><input value={data.magias?.conjuracao?.ataque || ''} onChange={e => updateField('magias.conjuracao.ataque', e.target.value)} placeholder="+5" /></label>
              </div>
            </section>

            <div className="dnd-v3-circles dnd-v4-circles">
              {Array.from({ length: 10 }, (_, level) => {
                const circleSpells = spells.map((spell, index) => ({ spell, index })).filter(item => spellLevel(item.spell) === level);
                const slot = data.magias?.slots?.[level] || { atual: 0, max: 0 };
                return (
                  <details key={level} className="dnd-v3-circle dnd-v4-circle" open={circleSpells.length > 0 || level === 0}>
                    <summary>
                      <div><b>{circleName(level)}</b><span>{circleSpells.length} magia{circleSpells.length === 1 ? '' : 's'}</span></div>
                      {level > 0 && <div className="dnd-v3-slot-mini" onClick={e => e.stopPropagation()}><span>Espaços</span><input type="number" min="0" value={slot.atual ?? 0} onChange={e => updateField(`magias.slots.${level}.atual`, Number(e.target.value) || 0)} /><i>/</i><input type="number" min="0" value={slot.max ?? 0} onChange={e => updateField(`magias.slots.${level}.max`, Number(e.target.value) || 0)} /></div>}
                      <div className="dnd-v3-circle-actions" onClick={e => e.stopPropagation()}><button type="button" onClick={() => sortCircleAlphabetically(level)} disabled={circleSpells.length < 2}>A–Z</button><button type="button" onClick={() => addSpell(level)}>+ Magia</button></div>
                    </summary>
                    <div className="dnd-v4-spell-grid">
                      {circleSpells.length === 0 ? <p className="dnd-v4-empty spell-empty">Nenhuma magia neste círculo.</p> : circleSpells.map(item => renderSpellCard(item.spell, item.index, level))}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
