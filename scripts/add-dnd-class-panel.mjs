import fs from 'node:fs';

const path = 'src/systems/dnd5e/components/CharacterEditor.jsx';
let src = fs.readFileSync(path, 'utf8');

const mustReplace = (from, to, label) => {
  if (!src.includes(from)) throw new Error(`Trecho não encontrado: ${label}`);
  src = src.replace(from, to);
};

mustReplace(
  "import '../dnd-sheet-v4.css';",
  "import '../dnd-sheet-v5.css';\nimport { DND_2024_CLASSES, getDndClassByLabel } from '../classPanels.js';",
  'imports'
);

src = src.replace(/\n\s*dndPcTab,\n\s*setDndPcTab,/, '');

mustReplace(
  "  const activeMainTab = ['status', 'recursos', 'magias'].includes(mobileTab) ? mobileTab : 'status';",
  `  const selectedClass = getDndClassByLabel(data.bio?.classe || '');\n  const requestedMainTab = ['status', 'recursos', 'magias', 'classe'].includes(mobileTab) ? mobileTab : 'status';\n  const activeMainTab = requestedMainTab === 'classe' && !selectedClass ? 'status' : requestedMainTab;\n  const legacyClass = data.bio?.classe && !selectedClass ? String(data.bio.classe) : '';\n  const classResourceData = selectedClass ? (data.recursosClasse?.[selectedClass.id] || {}) : {};`,
  'activeMainTab'
);

mustReplace(
  "  const renderFeatureCard = (entry, index, allowType = true) => (",
  `  const updateClassResource = (key, value) => {\n    if (!selectedClass) return;\n    updateField(\`recursosClasse.\${selectedClass.id}.\${key}\`, value);\n  };\n\n  const renderClassField = (field) => {\n    if (!selectedClass) return null;\n    const value = classResourceData?.[field.key];\n    if (field.type === 'tracker') {\n      const current = Number(value?.atual ?? 0);\n      const max = Number(value?.max ?? 0);\n      return (\n        <div key={field.key} className=\"dnd-v5-class-resource tracker\">\n          <span>{field.label}</span>\n          <div><input type=\"number\" min=\"0\" value={current} onChange={e => updateClassResource(field.key, { ...(value || {}), atual: Number(e.target.value) || 0 })} /><i>/</i><input type=\"number\" min=\"0\" value={max} onChange={e => updateClassResource(field.key, { ...(value || {}), max: Number(e.target.value) || 0 })} /></div>\n          <small>Atual / Máximo</small>\n        </div>\n      );\n    }\n    if (field.type === 'toggle') {\n      return (\n        <label key={field.key} className=\"dnd-v5-class-resource toggle\">\n          <input type=\"checkbox\" checked={!!value} onChange={e => updateClassResource(field.key, e.target.checked)} />\n          <span>{field.label}</span>\n        </label>\n      );\n    }\n    return (\n      <label key={field.key} className=\"dnd-v5-class-resource\">\n        <span>{field.label}</span>\n        <input type={field.type === 'number' ? 'number' : 'text'} min={field.type === 'number' ? 0 : undefined} value={value ?? ''} onChange={e => updateClassResource(field.key, field.type === 'number' ? (Number(e.target.value) || 0) : e.target.value)} placeholder={field.placeholder || ''} />\n      </label>\n    );\n  };\n\n  const renderFeatureCard = (entry, index, allowType = true) => (`,
  'class helpers'
);

mustReplace(
  `<div className="dnd-v3-main-tabs dnd-v4-main-tabs sticky top-0 z-20">\n        <button type="button" onClick={() => setMobileTab('status')} className={activeMainTab === 'status' ? 'active' : ''}>Ficha & Combate</button>\n        <button type="button" onClick={() => setMobileTab('recursos')} className={activeMainTab === 'recursos' ? 'active' : ''}>Recursos</button>\n        <button type="button" onClick={() => setMobileTab('magias')} className={activeMainTab === 'magias' ? 'active' : ''}>Magias</button>\n      </div>`,
  `<div className={\`dnd-v3-main-tabs dnd-v4-main-tabs dnd-v5-main-tabs sticky top-0 z-20 \${selectedClass ? 'has-class-tab' : ''}\`}>\n        <button type="button" onClick={() => setMobileTab('status')} className={activeMainTab === 'status' ? 'active' : ''}>Ficha & Combate</button>\n        <button type="button" onClick={() => setMobileTab('recursos')} className={activeMainTab === 'recursos' ? 'active' : ''}>Recursos</button>\n        <button type="button" onClick={() => setMobileTab('magias')} className={activeMainTab === 'magias' ? 'active' : ''}>Magias</button>\n        {selectedClass && <button type="button" onClick={() => setMobileTab('classe')} className={activeMainTab === 'classe' ? 'active class-tab' : 'class-tab'}>{selectedClass.icon} {selectedClass.label}</button>}\n      </div>`,
  'main tabs'
);

mustReplace(
  `<label><span>Classe</span><input value={data.bio?.classe || ''} onChange={e => updateField('bio.classe', e.target.value)} /></label>`,
  `<label><span>Classe</span><select value={data.bio?.classe || ''} onChange={e => updateField('bio.classe', e.target.value)}><option value="">Selecione a classe...</option>{legacyClass && <option value={legacyClass}>{legacyClass} (legado)</option>}{DND_2024_CLASSES.map(item => <option key={item.id} value={item.label}>{item.label}</option>)}</select></label>`,
  'class selector'
);

const anchor = `        {activeMainTab === 'magias' && (\n          <div className="dnd-v3-pane dnd-v4-spell-page">`;
if (!src.includes(anchor)) throw new Error('Âncora da aba de magias não encontrada.');

const classPanel = `        {activeMainTab === 'classe' && selectedClass && (\n          <div className="dnd-v3-pane dnd-v5-class-page">\n            <section className="dnd-v5-class-hero">\n              <div className="dnd-v5-class-icon" aria-hidden="true">{selectedClass.icon}</div>\n              <div className="dnd-v5-class-heading">\n                <small>Painel de Classe</small>\n                <h2>{selectedClass.label}</h2>\n                <p>{selectedClass.summary}</p>\n              </div>\n              <div className="dnd-v5-class-switcher">\n                <label><span>Classe</span><select value={data.bio?.classe || ''} onChange={e => updateField('bio.classe', e.target.value)}>{DND_2024_CLASSES.map(item => <option key={item.id} value={item.label}>{item.label}</option>)}</select></label>\n                <label><span>Subclasse</span><input value={data.bio?.subclasse || ''} onChange={e => updateField('bio.subclasse', e.target.value)} placeholder="Subclasse" /></label>\n              </div>\n            </section>\n\n            <div className="dnd-v5-class-layout">\n              <section className="dnd-v3-section dnd-v5-class-trackers">\n                <div className="dnd-v3-section-title"><span>Recursos Rápidos</span><small>Contadores e valores próprios desta classe</small></div>\n                <div className="dnd-v5-class-resource-grid">{selectedClass.fields.map(renderClassField)}</div>\n                <label className="dnd-v5-class-notes"><span>Anotações da Classe</span><textarea rows="5" value={classResourceData?.notas || ''} onChange={e => updateClassResource('notas', e.target.value)} placeholder="Usos especiais, efeitos da subclasse, lembretes de descanso e observações..." /></label>\n              </section>\n\n              <section className="dnd-v3-section dnd-v5-class-features">\n                <div className="dnd-v3-section-title"><span>Habilidades da Classe</span><button type="button" onClick={() => addToArray('caracteristicas', { tipo: 'classe', nome: '', desc: '' })}>+ Habilidade</button></div>\n                <div className="dnd-v5-class-feature-grid">\n                  {features.map((entry, index) => ({ entry, index })).filter(item => (item.entry?.tipo || 'classe') === 'classe').length === 0\n                    ? <p className="dnd-v4-empty">Nenhuma habilidade de classe cadastrada ainda.</p>\n                    : features.map((entry, index) => ({ entry, index })).filter(item => (item.entry?.tipo || 'classe') === 'classe').map(item => renderFeatureCard(item.entry, item.index, false))}\n                </div>\n              </section>\n            </div>\n          </div>\n        )}\n\n`;
src = src.replace(anchor, classPanel + anchor);

fs.writeFileSync(path, src);
console.log('Painel dinâmico de classe aplicado.');
