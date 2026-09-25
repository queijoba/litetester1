import fs from 'node:fs';

const editorPath = 'src/systems/dnd5e/components/CharacterEditor.jsx';
const cssPath = 'src/systems/dnd5e/dnd-sheet-v4.css';
let src = fs.readFileSync(editorPath, 'utf8');

const mustReplace = (from, to, label) => {
  if (!src.includes(from)) throw new Error(`Trecho não encontrado: ${label}`);
  src = src.replace(from, to);
};

mustReplace("import '../dnd-sheet-v3.css';", "import '../dnd-sheet-v4.css';", 'import CSS');

mustReplace(
`  const activeMainTab = mobileTab === 'recursos' ? 'recursos' : 'status';
  const activeResourceTab = ['caracteristicas', 'talentos', 'magias'].includes(dndPcTab)
    ? dndPcTab
    : 'caracteristicas';`,
`  const activeMainTab = ['status', 'recursos', 'magias'].includes(mobileTab) ? mobileTab : 'status';`,
'controle das abas'
);

mustReplace(
`      <div className="dnd-v3-main-tabs sticky top-0 z-20">
        <button type="button" onClick={() => setMobileTab('status')} className={activeMainTab === 'status' ? 'active' : ''}>Ficha & Combate</button>
        <button type="button" onClick={() => setMobileTab('recursos')} className={activeMainTab === 'recursos' ? 'active' : ''}>Recursos & Magias</button>
      </div>

      {activeMainTab === 'recursos' && (`,
`      <div className="dnd-v3-main-tabs dnd-v4-main-tabs sticky top-0 z-20">
        <button type="button" onClick={() => setMobileTab('status')} className={activeMainTab === 'status' ? 'active' : ''}>Ficha & Combate</button>
        <button type="button" onClick={() => setMobileTab('recursos')} className={activeMainTab === 'recursos' ? 'active' : ''}>Recursos</button>
        <button type="button" onClick={() => setMobileTab('magias')} className={activeMainTab === 'magias' ? 'active' : ''}>Magias</button>
      </div>

      {activeMainTab !== 'status' && (`,
'navegação principal'
);

const resourceStart = src.indexOf(`        {activeMainTab === 'recursos' && (\n          <div className="dnd-v3-pane">`);
const resourceEndMarker = `\n        )}\n      </div>\n    </div>\n  );\n}`;
const resourceEnd = src.lastIndexOf(resourceEndMarker);
if (resourceStart < 0 || resourceEnd < resourceStart) throw new Error('Não foi possível localizar a área de Recursos/Magias.');

const newResourceAndSpellPanes = `        {activeMainTab === 'recursos' && (
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
                  {[['leve','Leve'],['media','Média'],['pesada','Pesada'],['escudos','Escudos']].map(([key,label]) => <label key={key}><input type="checkbox" checked={!!data.treinoArmadura?.[key]} onChange={e => updateField(\`treinoArmadura.\${key}\`, e.target.checked)} /><span>{label}</span></label>)}
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
                  {attunements.map((item, index) => <label key={index} className="dnd-v3-attune"><span>✦</span><input value={item} onChange={e => { const list = [...attunements]; list[index] = e.target.value; updateField('sintonizacao', list); }} placeholder={\`Item sintonizado \${index + 1}\`} /></label>)}
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
                      {level > 0 && <div className="dnd-v3-slot-mini" onClick={e => e.stopPropagation()}><span>Espaços</span><input type="number" min="0" value={slot.atual ?? 0} onChange={e => updateField(\`magias.slots.\${level}.atual\`, Number(e.target.value) || 0)} /><i>/</i><input type="number" min="0" value={slot.max ?? 0} onChange={e => updateField(\`magias.slots.\${level}.max\`, Number(e.target.value) || 0)} /></div>}
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
        )}`;

src = src.slice(0, resourceStart) + newResourceAndSpellPanes + src.slice(resourceEnd + '\n        )}'.length);
fs.writeFileSync(editorPath, src);

const css = `@import './dnd-sheet-v3.css';

/* D&D v4 — três áreas principais e leitura em colunas */
.dnd-v4-main-tabs { grid-template-columns:repeat(3,minmax(0,1fr)); }
.dnd-v4-main-tabs button { min-width:0; }

.dnd-v4-resource-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; align-items:start; }
.dnd-v4-resource-card { min-width:0; border:1px solid #cdbca9; border-radius:14px 4px 14px 4px; background:#fffdf9; box-shadow:0 4px 16px rgba(60,42,27,.065); overflow:hidden; }
.dnd-v4-resource-card .dnd-v3-column-head { padding:11px 12px; background:linear-gradient(180deg,#f7efe5,#f1e6d9); border-bottom:2px solid rgba(146,38,16,.2); }
.dnd-v4-resource-card.class-card .dnd-v3-column-head { border-top:3px solid #922610; }
.dnd-v4-resource-card.species-card .dnd-v3-column-head { border-top:3px solid #75604d; }
.dnd-v4-resource-card.extras-card .dnd-v3-column-head { border-top:3px solid #b17a26; }
.dnd-v4-resource-list { display:grid; gap:8px; padding:10px; }
.dnd-v4-resource-list.compact { padding-top:7px; }
.dnd-v4-resource-list .dnd-v3-feature-card { margin:0; }
.dnd-v4-empty { margin:0; padding:12px; border:1px dashed #d4c5b6; border-radius:8px; color:#94887d; background:#faf7f2; font-size:10px; font-style:italic; text-align:center; }
.dnd-v4-split-head { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:10px 11px 2px; }
.dnd-v4-split-head.other { margin-top:3px; padding-top:9px; border-top:1px solid #e1d5c8; }
.dnd-v4-split-head h4 { margin:0; color:#6e5844; font:900 10px/1.2 Georgia,'Times New Roman',serif; text-transform:uppercase; letter-spacing:.05em; }
.dnd-v4-split-head button { border:1px solid rgba(146,38,16,.3); border-radius:999px; padding:4px 8px; background:#fff8f3; color:#922610; font-size:8px; font-weight:900; text-transform:uppercase; }

.dnd-v4-support-grid { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr); gap:14px; align-items:start; }
.dnd-v4-support-card { margin:0; }
.dnd-v4-proficiency-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; margin-top:10px; }
.dnd-v4-proficiency-grid label span { display:block; margin-bottom:3px; color:#766d65; font-size:8px; font-weight:900; text-transform:uppercase; }
.dnd-v4-proficiency-grid textarea { width:100%; border:1px solid #d3c5b6; border-radius:8px; padding:7px; background:#fffdfa; resize:vertical; font-size:10px; }
.dnd-v4-attunement-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:6px; }
.dnd-v4-classic-roleplay { margin-top:10px; }

.dnd-v4-spell-page { gap:14px; }
.dnd-v4-spell-toolbar { position:sticky; top:48px; z-index:12; padding:12px; border:1px solid #cdbca9; border-radius:14px 4px 14px 4px; background:rgba(255,253,249,.96); box-shadow:0 6px 20px rgba(60,42,27,.09); backdrop-filter:blur(8px); }
.dnd-v4-spell-title { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:10px; }
.dnd-v4-spell-title>div:first-child b,.dnd-v4-spell-title>div:first-child span { display:block; }
.dnd-v4-spell-title>div:first-child b { color:#4c4038; font:900 16px/1.1 Georgia,'Times New Roman',serif; }
.dnd-v4-spell-title>div:first-child span { margin-top:3px; color:#8a8179; font-size:9px; }
.dnd-v4-spell-count { display:flex; align-items:baseline; gap:4px; padding:6px 9px; border:1px solid #d9cab9; border-radius:999px; background:#faf5ee; white-space:nowrap; }
.dnd-v4-spell-count strong { color:#922610; font-size:14px; }
.dnd-v4-spell-count span,.dnd-v4-spell-count i { color:#81766c; font-size:8px; font-style:normal; text-transform:uppercase; }
.dnd-v4-casting-grid { max-width:720px; }
.dnd-v4-circles { display:grid; gap:10px; }
.dnd-v4-circle>summary { position:sticky; top:154px; z-index:8; background:#f5ede3; }
.dnd-v4-spell-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:9px; padding:10px; align-items:start; }
.dnd-v4-spell-grid>.dnd-v3-spell-card { min-width:0; margin:0; height:max-content; }
.dnd-v4-spell-grid .spell-empty { grid-column:1/-1; }
.dnd-v4-spell-grid .dnd-v3-spell-head { grid-template-columns:auto minmax(0,1fr) minmax(58px,.45fr) auto; }
.dnd-v4-spell-grid .dnd-v3-spell-details[open] { background:#fffaf3; }

@media (max-width:1100px) {
  .dnd-v4-resource-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .dnd-v4-resource-card.extras-card { grid-column:1/-1; }
  .dnd-v4-spell-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
}

@media (max-width:760px) {
  .dnd-v4-main-tabs button { min-height:44px; padding:8px 4px; font-size:9px; letter-spacing:.02em; }
  .dnd-v4-resource-grid,.dnd-v4-support-grid { grid-template-columns:1fr; }
  .dnd-v4-resource-card.extras-card { grid-column:auto; }
  .dnd-v4-proficiency-grid { grid-template-columns:1fr 1fr; }
  .dnd-v4-attunement-grid { grid-template-columns:1fr; }
  .dnd-v4-spell-toolbar { top:44px; }
  .dnd-v4-circle>summary { top:158px; }
  .dnd-v4-spell-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; padding:7px; }
  .dnd-v4-spell-grid .dnd-v3-spell-head { grid-template-columns:auto minmax(0,1fr) auto; }
  .dnd-v4-spell-grid .dnd-v3-spell-school { grid-column:2/3; }
}

@media (max-width:430px) {
  .dnd-v4-spell-title { align-items:flex-start; }
  .dnd-v4-spell-count { flex-wrap:wrap; justify-content:flex-end; border-radius:10px; }
  .dnd-v4-casting-grid { grid-template-columns:repeat(3,minmax(0,1fr)); gap:5px; }
  .dnd-v4-casting-grid label { min-width:0; }
  .dnd-v4-casting-grid label span { font-size:6px; }
  .dnd-v4-casting-grid input { font-size:10px; }
  .dnd-v4-circle>summary { position:static; }
  .dnd-v4-spell-grid { grid-template-columns:1fr 1fr; }
}

@media (max-width:350px) {
  .dnd-v4-main-tabs button { font-size:8px; }
  .dnd-v4-spell-grid { grid-template-columns:1fr; }
  .dnd-v4-proficiency-grid { grid-template-columns:1fr; }
}
`;

fs.writeFileSync(cssPath, css);
console.log('D&D v4 aplicado.');
