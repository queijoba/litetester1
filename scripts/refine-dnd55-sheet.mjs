import { readFile, writeFile } from 'node:fs/promises';

const appPath = 'src/PJLiteApp.jsx';
const editorPath = 'src/systems/dnd5e/components/CharacterEditor.jsx';
const cssPath = 'src/pjlite.css';

function replaceOnce(text, search, replacement, label) {
  const first = text.indexOf(search);
  if (first < 0) throw new Error(`Trecho não encontrado: ${label}`);
  const second = text.indexOf(search, first + search.length);
  if (second >= 0) throw new Error(`Trecho duplicado inesperadamente: ${label}`);
  return text.slice(0, first) + replacement + text.slice(first + search.length);
}

function replaceBlock(text, startMarker, endMarker, replacement, label) {
  const start = text.indexOf(startMarker);
  if (start < 0) throw new Error(`Início não encontrado: ${label}`);
  const end = text.indexOf(endMarker, start);
  if (end < 0) throw new Error(`Fim não encontrado: ${label}`);
  return text.slice(0, start) + replacement + text.slice(end);
}

let app = await readFile(appPath, 'utf8');
let editor = await readFile(editorPath, 'utf8');
let css = await readFile(cssPath, 'utf8');

// ---------------------------------------------------------------------------
// Modelo de dados D&D 5.5e / 2024 - compatível com fichas antigas.
// ---------------------------------------------------------------------------
app = replaceOnce(
  app,
  "            bio: { nome: '', classe: '', linhagem: '', antecedente: '', alinhamento: '', xp: 0, nivel: 1, jogador: '', imagem: '' },",
  "            bio: { nome: '', classe: '', subclasse: '', linhagem: '', antecedente: '', alinhamento: '', xp: 0, nivel: 1, jogador: '', imagem: '', aparencia: '', historiaPersonalidade: '' },",
  'bio inicial D&D'
);

app = replaceOnce(
  app,
  "            status: { pvAtual: 10, pvMax: 10, pvTemp: 0, dadosVida: '1d10', ca: 10, iniciativa: '', deslocamento: '9 m', inspiracao: false, percepcaoPassiva: '' },",
  "            status: { pvAtual: 10, pvMax: 10, pvTemp: 0, dadosVida: '1d10', ca: 10, escudo: 0, iniciativa: '', deslocamento: '9 m', tamanho: 'Médio', inspiracao: false, percepcaoPassiva: '' },",
  'status inicial D&D'
);

app = replaceOnce(
  app,
  "            caracteristicas: [],\n            tracosPersonalidade: '', ideais: '', vinculos: '', defeitos: '',\n            outrasProficiencias: '',\n            inventario: '', itensSincronizados: [], moedas: { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 }",
  "            caracteristicas: [],\n            tracosPersonalidade: '', ideais: '', vinculos: '', defeitos: '',\n            outrasProficiencias: '', idiomas: '', armasProficiencias: '', ferramentas: '',\n            treinoArmadura: { leve: false, media: false, pesada: false, escudos: false },\n            sintonizacao: ['', '', ''],\n            inventario: '', itensSincronizados: [], moedas: { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 }",
  'campos extras D&D 2024'
);

app = replaceOnce(
  app,
  "            clone.status.percepcaoPassiva = clone.status.percepcaoPassiva ?? '';\n            clone.atributos = { ...initialDndPcData.atributos, ...(clone.atributos || {}) };\n            clone.proficienciasResistencia = { ...initialDndPcData.proficienciasResistencia, ...(clone.proficienciasResistencia || {}) };",
  "            clone.status.percepcaoPassiva = clone.status.percepcaoPassiva ?? '';\n            clone.status.tamanho = clone.status.tamanho || 'Médio';\n            clone.status.escudo = Number(clone.status.escudo || 0);\n            clone.atributos = { ...initialDndPcData.atributos, ...(clone.atributos || {}) };\n            clone.proficienciasResistencia = { ...initialDndPcData.proficienciasResistencia, ...(clone.proficienciasResistencia || {}) };\n            clone.treinoArmadura = { ...initialDndPcData.treinoArmadura, ...(clone.treinoArmadura || {}) };\n            clone.idiomas = clone.idiomas || '';\n            clone.armasProficiencias = clone.armasProficiencias || '';\n            clone.ferramentas = clone.ferramentas || '';\n            clone.sintonizacao = Array.from({ length: 3 }, (_, i) => String(clone.sintonizacao?.[i] || ''));",
  'normalização de status D&D 2024'
);

app = replaceOnce(
  app,
  "            clone.caracteristicas = Array.isArray(clone.caracteristicas)\n                ? clone.caracteristicas\n                : (clone.caracteristicas ? String(clone.caracteristicas).split('\\n').filter(Boolean).map(nome => ({ nome, desc: '' })) : []);",
  "            clone.caracteristicas = Array.isArray(clone.caracteristicas)\n                ? clone.caracteristicas.map(c => ({ tipo: 'classe', nome: '', desc: '', ...(c || {}) }))\n                : (clone.caracteristicas ? String(clone.caracteristicas).split('\\n').filter(Boolean).map(nome => ({ tipo: 'classe', nome, desc: '' })) : []);",
  'normalização de características D&D'
);

app = replaceOnce(
  app,
  "            clone.magias.lista = Array.isArray(oldMagias.lista)\n                ? oldMagias.lista\n                : (oldMagias.lista ? String(oldMagias.lista).split('\\n').filter(Boolean).map(nome => ({ nome, nivel: '', desc: '' })) : []);",
  "            clone.magias.lista = Array.isArray(oldMagias.lista)\n                ? oldMagias.lista.map(m => ({ nome: '', nivel: '', tempo: '', alcance: '', concentracao: false, ritual: false, material: false, desc: '', ...(m || {}) }))\n                : (oldMagias.lista ? String(oldMagias.lista).split('\\n').filter(Boolean).map(nome => ({ nome, nivel: '', tempo: '', alcance: '', concentracao: false, ritual: false, material: false, desc: '' })) : []);",
  'normalização de magias D&D 2024'
);

app = app.replaceAll('D&D 5e - Personagem • EM ADAPTAÇÃO', 'D&D 5.5e / 2024 - Personagem');
app = app.replaceAll('D&D 5e - Bestiário • EM ADAPTAÇÃO', 'D&D 5.5e / 2024 - Bestiário');

// ---------------------------------------------------------------------------
// Editor visual - mantém a identidade atual, aproximando a organização do PDF 2024.
// ---------------------------------------------------------------------------
editor = replaceOnce(
  editor,
  "  return (\n",
  "  const dndFeatureGroups = [\n    { id: 'classe', label: 'Características de Classe' },\n    { id: 'especie', label: 'Características de Espécie' },\n    { id: 'talento', label: 'Talentos' },\n    { id: 'outro', label: 'Outros Recursos' }\n  ];\n  const dndAttunements = Array.isArray(data.sintonizacao) ? data.sintonizacao : ['', '', ''];\n\n  return (\n",
  'helpers visuais D&D'
);

editor = editor.replace("{ id: 'recursos', label: 'Recursos' }", "{ id: 'recursos', label: 'Recursos & Magias' }");
editor = editor.replace('<div className="dnd-brand-row"><span className="dnd-brand-mark">D&amp;D 5E</span><span className="dnd-brand-name">Dungeons &amp; Dragons</span></div>', '<div className="dnd-brand-row"><span className="dnd-brand-mark">D&amp;D 5.5E</span><span className="dnd-brand-name">Dungeons &amp; Dragons • Regras 2024</span></div>');

editor = replaceOnce(
  editor,
  "                                              <div className=\"border-b border-[#922610]/50\"><label className=\"text-[10px] uppercase font-bold text-gray-500 block\">Classe</label><input type=\"text\" value={data.bio?.classe} onChange={e => updateField('bio.classe', e.target.value)} className=\"w-full outline-none font-bold\" /></div>",
  "                                              <div className=\"border-b border-[#922610]/50\"><label className=\"text-[10px] uppercase font-bold text-gray-500 block\">Classe</label><input type=\"text\" value={data.bio?.classe} onChange={e => updateField('bio.classe', e.target.value)} className=\"w-full outline-none font-bold\" /></div>\n                                              <div className=\"border-b border-[#922610]/50\"><label className=\"text-[10px] uppercase font-bold text-gray-500 block\">Subclasse</label><input type=\"text\" value={data.bio?.subclasse || ''} onChange={e => updateField('bio.subclasse', e.target.value)} className=\"w-full outline-none font-bold\" /></div>",
  'subclasse no cabeçalho'
);
editor = editor.replace('Linhagem/Espécie', 'Espécie');
editor = editor.replace('>Antecedente</label>', '>Origem / Antecedente</label>');
editor = editor.replace('>Inspiração</span>', '>Inspiração Heroica</span>');

editor = replaceOnce(
  editor,
  "                                                  <input type=\"number\" value={data.status?.ca} onChange={e => updateField('status.ca', parseInt(e.target.value)||10)} className=\"w-full text-center text-3xl font-bold bg-transparent outline-none text-[#922610]\" />",
  "                                                  <input type=\"number\" value={data.status?.ca} onChange={e => updateField('status.ca', parseInt(e.target.value)||10)} className=\"w-full text-center text-3xl font-bold bg-transparent outline-none text-[#922610]\" />\n                                                  <label className=\"dnd-shield-field\"><span>Escudo</span><input type=\"number\" min=\"0\" value={data.status?.escudo ?? 0} onChange={e => updateField('status.escudo', parseInt(e.target.value)||0)} /></label>",
  'campo de escudo'
);

editor = replaceOnce(
  editor,
  "                                          <div className=\"grid grid-cols-3 gap-2\">",
  "                                          <div className=\"grid grid-cols-2 md:grid-cols-4 gap-2\">",
  'grade de estatísticas de combate'
);

editor = replaceOnce(
  editor,
  "                                              <div className=\"dnd-combat-stat border-2 border-gray-300 bg-white p-2 rounded text-center flex flex-col items-center shadow-sm\">\n                                                  <div className=\"text-[10px] uppercase font-bold text-gray-500 mb-1\">Deslocamento</div>\n                                                  <input type=\"text\" value={data.status?.deslocamento} onChange={e => updateField('status.deslocamento', e.target.value)} className=\"w-full text-center text-2xl font-bold bg-transparent outline-none mt-1\" />\n                                              </div>",
  "                                              <div className=\"dnd-combat-stat border-2 border-gray-300 bg-white p-2 rounded text-center flex flex-col items-center shadow-sm\">\n                                                  <div className=\"text-[10px] uppercase font-bold text-gray-500 mb-1\">Velocidade</div>\n                                                  <input type=\"text\" value={data.status?.deslocamento} onChange={e => updateField('status.deslocamento', e.target.value)} className=\"w-full text-center text-2xl font-bold bg-transparent outline-none mt-1\" />\n                                              </div>\n                                              <div className=\"dnd-combat-stat dnd-size-card border-2 border-gray-300 bg-white p-2 rounded text-center flex flex-col items-center shadow-sm\">\n                                                  <div className=\"text-[10px] uppercase font-bold text-gray-500 mb-1\">Tamanho</div>\n                                                  <input type=\"text\" value={data.status?.tamanho || ''} onChange={e => updateField('status.tamanho', e.target.value)} className=\"w-full text-center text-base font-bold bg-transparent outline-none mt-2\" placeholder=\"Médio\" />\n                                              </div>",
  'velocidade e tamanho'
);

const traitsStart = '                                          <div className="dnd-traits-card dnd-section-card border border-gray-300 rounded bg-white shadow-sm flex flex-col gap-2 p-2">';
const traitsEnd = '                                          <div className="dnd-section-card border border-gray-300 rounded bg-white shadow-sm overflow-hidden">';
const newTraits = `                                          <div className="dnd-traits-card dnd-section-card border border-gray-300 rounded bg-white shadow-sm p-2 space-y-2">
                                              <div className="dnd-section-head text-sm border-b pb-1">Aparência, História & Personalidade</div>
                                              <label className="dnd-profile-card"><span>Aparência</span><textarea rows="3" value={data.bio?.aparencia || ''} onChange={e => updateField('bio.aparencia', e.target.value)} placeholder="Descrição visual, marcas, roupas, símbolos..."></textarea></label>
                                              <label className="dnd-profile-card"><span>História & Personalidade</span><textarea rows="5" value={data.bio?.historiaPersonalidade || ''} onChange={e => updateField('bio.historiaPersonalidade', e.target.value)} placeholder="Passado, motivações, hábitos e detalhes de interpretação..."></textarea></label>
                                              <details className="dnd-legacy-roleplay">
                                                  <summary>Detalhes clássicos de interpretação</summary>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                      <div><textarea rows="2" value={data.tracosPersonalidade} onChange={e => updateField('tracosPersonalidade', e.target.value)} placeholder="Traços de Personalidade..."></textarea></div>
                                                      <div><textarea rows="2" value={data.ideais} onChange={e => updateField('ideais', e.target.value)} placeholder="Ideais..."></textarea></div>
                                                      <div><textarea rows="2" value={data.vinculos} onChange={e => updateField('vinculos', e.target.value)} placeholder="Vínculos..."></textarea></div>
                                                      <div><textarea rows="2" value={data.defeitos} onChange={e => updateField('defeitos', e.target.value)} placeholder="Defeitos..."></textarea></div>
                                                  </div>
                                              </details>
                                          </div>

`;
editor = replaceBlock(editor, traitsStart, traitsEnd, newTraits, 'bloco de interpretação');

const featStart = '                                                      <div className="flex justify-between items-center mb-2">\n                                                          <span className="text-[10px] text-gray-500">Habilidades de classe, talentos e traços.</span>';
const featEnd = '                                                  </div>\n                                              ) : (';
const newFeatures = `                                                      <div className="dnd-feature-groups space-y-3">
                                                          {dndFeatureGroups.map(group => {
                                                              const entries = (Array.isArray(data.caracteristicas) ? data.caracteristicas : []).map((carac, originalIndex) => ({ ...carac, originalIndex })).filter(carac => (carac.tipo || 'classe') === group.id);
                                                              return (
                                                                  <section key={group.id} className="dnd-feature-group">
                                                                      <div className="dnd-feature-group-head">
                                                                          <span>{group.label}</span>
                                                                          <button type="button" onClick={() => addToArray('caracteristicas', { tipo: group.id, nome: '', desc: '' })} className="dnd-add-btn"><SVGIcons.Plus/> Adic.</button>
                                                                      </div>
                                                                      <div className="space-y-2 p-2">
                                                                          {entries.length === 0 && <p className="text-[10px] italic text-gray-400 py-1">Nenhum registro nesta categoria.</p>}
                                                                          {entries.map(carac => (
                                                                              <div key={carac.originalIndex} className="dnd-feature-card border rounded bg-gray-50 p-2 flex gap-2 items-start">
                                                                                  <div className="flex-1 space-y-1">
                                                                                      <div className="grid grid-cols-[1fr_110px] gap-2">
                                                                                          <input type="text" value={carac?.nome || ''} onChange={e => updateArrayField('caracteristicas', carac.originalIndex, 'nome', e.target.value)} className="w-full bg-transparent border-b outline-none text-xs font-bold" placeholder="Nome do recurso" />
                                                                                          <select value={carac?.tipo || 'classe'} onChange={e => updateArrayField('caracteristicas', carac.originalIndex, 'tipo', e.target.value)} className="dnd-feature-type border rounded px-1 text-[9px] font-bold">
                                                                                              <option value="classe">Classe</option><option value="especie">Espécie</option><option value="talento">Talento</option><option value="outro">Outro</option>
                                                                                          </select>
                                                                                      </div>
                                                                                      <textarea rows="2" value={carac?.desc || ''} onChange={e => updateArrayField('caracteristicas', carac.originalIndex, 'desc', e.target.value)} className="w-full bg-transparent outline-none text-xs resize-y" placeholder="Descrição, uso, limite, efeito..." />
                                                                                  </div>
                                                                                  <button type="button" onClick={() => removeFromArray('caracteristicas', carac.originalIndex)} className="text-red-500 hover:text-red-700"><SVGIcons.Trash/></button>
                                                                              </div>
                                                                          ))}
                                                                      </div>
                                                                  </section>
                                                              );
                                                          })}
                                                      </div>
                                                  </div>
                                              ) : (`;
editor = replaceBlock(editor, featStart, featEnd, newFeatures, 'características agrupadas');

editor = editor.replace("updateField('magias.lista', [...list, { nome: '', nivel: '', desc: '' }]);", "updateField('magias.lista', [...list, { nome: '', nivel: '', tempo: '', alcance: '', concentracao: false, ritual: false, material: false, desc: '' }]);");

editor = replaceOnce(
  editor,
  "                                                                      <textarea rows=\"2\" value={magia?.desc || ''} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], desc:e.target.value}; updateField('magias.lista', list); }} className=\"w-full bg-transparent outline-none text-xs resize-y\" placeholder=\"Notas, duração, alcance ou efeito...\" />",
  "                                                                      <div className=\"dnd-spell-meta\">\n                                                                          <label><span>Tempo</span><input type=\"text\" value={magia?.tempo || ''} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], tempo:e.target.value}; updateField('magias.lista', list); }} placeholder=\"1 ação\" /></label>\n                                                                          <label><span>Alcance</span><input type=\"text\" value={magia?.alcance || ''} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], alcance:e.target.value}; updateField('magias.lista', list); }} placeholder=\"18 m\" /></label>\n                                                                          <label className=\"dnd-spell-flag\"><input type=\"checkbox\" checked={!!magia?.concentracao} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], concentracao:e.target.checked}; updateField('magias.lista', list); }} /><span>C</span></label>\n                                                                          <label className=\"dnd-spell-flag\"><input type=\"checkbox\" checked={!!magia?.ritual} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], ritual:e.target.checked}; updateField('magias.lista', list); }} /><span>R</span></label>\n                                                                          <label className=\"dnd-spell-flag\"><input type=\"checkbox\" checked={!!magia?.material} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], material:e.target.checked}; updateField('magias.lista', list); }} /><span>M</span></label>\n                                                                      </div>\n                                                                      <textarea rows=\"2\" value={magia?.desc || ''} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], desc:e.target.value}; updateField('magias.lista', list); }} className=\"w-full bg-transparent outline-none text-xs resize-y mt-1\" placeholder=\"Anotações, material necessário, duração ou efeito...\" />",
  'metadados de magia'
);

const profStart = '                                          <div className="dnd-section-card border border-gray-300 rounded bg-white shadow-sm p-2 flex flex-col">\n                                              <h3 className="dnd-section-head font-bold text-sm uppercase text-gray-600 border-b pb-1 mb-2">Outras Proficiências / Idiomas</h3>';
const profEnd = '                                      </div>\n                                  </div>\n                                  </div>';
const newProf = `                                          <div className="dnd-section-card border border-gray-300 rounded bg-white shadow-sm p-2 flex flex-col gap-2">
                                              <h3 className="dnd-section-head font-bold text-sm uppercase text-gray-600 border-b pb-1">Equipamento, Treino & Proficiências</h3>
                                              <div className="dnd-training-grid">
                                                  {[['leve','Leve'],['media','Média'],['pesada','Pesada'],['escudos','Escudos']].map(([key,label]) => <label key={key}><input type="checkbox" checked={!!data.treinoArmadura?.[key]} onChange={e => updateField('treinoArmadura.' + key, e.target.checked)} /><span>{label}</span></label>)}
                                              </div>
                                              <label className="dnd-profile-card"><span>Armas</span><textarea rows="2" value={data.armasProficiencias || ''} onChange={e => updateField('armasProficiencias', e.target.value)} placeholder="Armas simples, marciais, tipos específicos..."></textarea></label>
                                              <label className="dnd-profile-card"><span>Ferramentas</span><textarea rows="2" value={data.ferramentas || ''} onChange={e => updateField('ferramentas', e.target.value)} placeholder="Ferramentas, kits, instrumentos, veículos..."></textarea></label>
                                              <label className="dnd-profile-card"><span>Idiomas</span><textarea rows="2" value={data.idiomas || ''} onChange={e => updateField('idiomas', e.target.value)} placeholder="Comum, Élfico, Dracônico..."></textarea></label>
                                              <details className="dnd-legacy-roleplay"><summary>Notas antigas de proficiência</summary><textarea rows="2" value={data.outrasProficiencias} onChange={e => updateField('outrasProficiencias', e.target.value)} className="w-full mt-2" /></details>
                                          </div>

                                          <div className="dnd-section-card border border-gray-300 rounded bg-white shadow-sm p-2">
                                              <h3 className="dnd-section-head font-bold text-sm uppercase text-gray-600 border-b pb-1 mb-2">Sintonização de Item Mágico</h3>
                                              <div className="dnd-attunement-list">
                                                  {dndAttunements.map((item, idx) => <label key={idx}><span>✦</span><input value={item} onChange={e => { const list=[...dndAttunements]; list[idx]=e.target.value; updateField('sintonizacao', list); }} placeholder={'Item sintonizado ' + (idx + 1)} /></label>)}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  </div>`;
editor = replaceBlock(editor, profStart, profEnd, newProf, 'proficiências e sintonização');

// ---------------------------------------------------------------------------
// Polimento visual adicional, sem substituir a linguagem visual já existente.
// ---------------------------------------------------------------------------
const cssMarker = '/* D&D 5.5e / 2024 - refinamento inspirado na ficha oficial PT-BR */';
if (!css.includes(cssMarker)) {
  css += `\n\n        ${cssMarker}\n        .dnd-brand-row::after { content:'2024'; margin-left:auto; padding:2px 7px; border:1px solid #777; border-radius:999px; font:900 8px/1 Georgia,serif; letter-spacing:.08em; color:#555; background:#fff; }\n        .dnd-shield-field { margin-top:auto; display:grid; grid-template-columns:auto 36px; align-items:center; gap:5px; padding-top:3px; border-top:1px solid #c9c9c9; width:100%; font-size:8px; font-weight:900; text-transform:uppercase; color:#666; }\n        .dnd-shield-field input { width:36px !important; height:25px; border:1px solid #777 !important; transform:rotate(45deg); border-radius:3px !important; text-align:center; font-size:11px !important; padding:0 !important; }\n        .dnd-shield-field input:focus { transform:rotate(45deg) scale(1.05); }\n        .dnd-size-card input { font-family:Georgia,'Times New Roman',serif; }\n        .dnd-profile-card { display:block; border:1px solid #969696; border-radius:10px 3px 10px 3px; padding:7px; background:#fbfbfa; }\n        .dnd-profile-card > span { display:block; margin-bottom:4px; font:900 9px/1 Georgia,'Times New Roman',serif; text-transform:uppercase; letter-spacing:.045em; color:#4a4a4a; }\n        .dnd-profile-card textarea, .dnd-profile-card input { width:100%; background:transparent !important; border:0 !important; box-shadow:none !important; padding:2px !important; }\n        .dnd-legacy-roleplay { border:1px dashed #a0a0a0; border-radius:8px; padding:6px 8px; background:#f8f8f7; }\n        .dnd-legacy-roleplay summary { cursor:pointer; font-size:9px; font-weight:900; text-transform:uppercase; color:#666; }\n        .dnd-legacy-roleplay textarea { background:#fff !important; border:1px solid #c8c8c8 !important; border-radius:6px; padding:5px; }\n        .dnd-feature-group { overflow:hidden; border:1.5px solid #777; border-radius:12px 3px 12px 3px; background:#fff; }\n        .dnd-feature-group-head { min-height:34px; display:flex; align-items:center; justify-content:space-between; gap:8px; padding:5px 7px 5px 10px; background:linear-gradient(180deg,#f1f1ef,#e6e6e3); border-bottom:1px solid #8d8d8d; font:900 10px/1 Georgia,'Times New Roman',serif; text-transform:uppercase; letter-spacing:.04em; color:#333; }\n        .dnd-feature-type { background:#fff !important; min-height:27px; }\n        .dnd-training-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; }\n        .dnd-training-grid label { min-height:34px; display:flex; align-items:center; gap:7px; padding:5px 7px; border:1px solid #929292; border-radius:9px 2px 9px 2px; background:#f8f8f6; font-size:9px; font-weight:900; text-transform:uppercase; }\n        .dnd-attunement-list { display:grid; gap:5px; }\n        .dnd-attunement-list label { display:grid; grid-template-columns:22px 1fr; align-items:center; gap:4px; border-bottom:1px solid #aaa; }\n        .dnd-attunement-list label > span { text-align:center; color:#922610; font-size:16px; }\n        .dnd-attunement-list input { border:0 !important; background:transparent !important; padding:5px 3px !important; }\n        .dnd-spell-meta { display:grid; grid-template-columns:minmax(72px,1fr) minmax(72px,1fr) 30px 30px 30px; gap:4px; align-items:end; margin-top:5px; padding-top:5px; border-top:1px dotted #aaa; }\n        .dnd-spell-meta label > span { display:block; font-size:7px; font-weight:900; text-transform:uppercase; color:#777; }\n        .dnd-spell-meta label:not(.dnd-spell-flag) input { width:100%; border:0 !important; border-bottom:1px solid #aaa !important; background:transparent !important; font-size:9px; padding:2px !important; }\n        .dnd-spell-flag { display:flex; flex-direction:column; align-items:center; gap:2px; font-size:8px; font-weight:900; color:#555; }\n        .dnd-spell-flag input[type='checkbox'] { width:13px; height:13px; }\n        @media (max-width:767px) { .dnd-spell-meta { grid-template-columns:1fr 1fr 28px 28px 28px; } .dnd-brand-row::after { display:none; } }\n        body.theme-dark .dnd-profile-card, body.theme-dark .dnd-legacy-roleplay, body.theme-dark .dnd-feature-group, body.theme-dark .dnd-training-grid label { background:#171b1f !important; border-color:#727980 !important; color:#ece8df !important; }\n        body.theme-dark .dnd-feature-group-head { background:#252a2f !important; border-color:#727980 !important; color:#ece8df !important; }\n        body.theme-dark .dnd-profile-card > span, body.theme-dark .dnd-legacy-roleplay summary, body.theme-dark .dnd-spell-meta label > span { color:#bcc5ce !important; }\n        body.theme-dark .dnd-attunement-list { color:#ece8df !important; }\n        body.theme-dark .dnd-brand-row::after { background:#171b1f; color:#d9d4cb; border-color:#737a80; }\n        body.theme-custom .dnd-profile-card, body.theme-custom .dnd-legacy-roleplay, body.theme-custom .dnd-feature-group, body.theme-custom .dnd-training-grid label { background:color-mix(in srgb,var(--custom-window-color) 93%,var(--custom-accent-color) 7%) !important; color:var(--custom-text-color) !important; border-color:color-mix(in srgb,var(--custom-accent-color) 45%,#888) !important; }\n`;
}

await writeFile(appPath, app);
await writeFile(editorPath, editor);
await writeFile(cssPath, css);
console.log('Ficha D&D 5.5e / 2024 refinada com compatibilidade para dados antigos.');
