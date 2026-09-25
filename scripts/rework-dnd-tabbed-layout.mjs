import { readFile, writeFile } from 'node:fs/promises';

const editorPath = 'src/systems/dnd5e/components/CharacterEditor.jsx';
const cssPath = 'src/pjlite.css';

let editor = await readFile(editorPath, 'utf8');
let css = await readFile(cssPath, 'utf8');

const marker = '/* D&D 5.5e — layout principal em três abas */';
if (editor.includes('dnd-main-tabs') && css.includes(marker)) {
  console.log('Layout D&D em abas já aplicado.');
  process.exit(0);
}

function replaceRequired(text, search, replacement, label) {
  if (!text.includes(search)) throw new Error(`Trecho não encontrado: ${label}`);
  return text.replace(search, replacement);
}

editor = replaceRequired(
  editor,
  '                                  {/* Abas mobile D&D 5e */}\n                                  <div className="md:hidden grid grid-cols-3 bg-[#f3eadc] border-b border-[#c9ad92] sticky top-0 z-20 shadow-sm">',
  '                                  {/* Navegação principal D&D 5.5e — desktop e mobile */}\n                                  <div className="dnd-main-tabs grid grid-cols-3 sticky top-0 z-20">',
  'barra de abas'
);

editor = replaceRequired(editor, "{ id: 'status', label: 'Perfil & Atributos' }", "{ id: 'status', label: 'Personagem' }", 'rótulo Personagem');
editor = replaceRequired(editor, "{ id: 'equipamento', label: 'Combate' }", "{ id: 'equipamento', label: 'Combate & Equipamento' }", 'rótulo Combate');

editor = replaceRequired(
  editor,
  "                                              className={`py-3 px-1 text-[9px] font-bold uppercase text-center border-b-4 transition-colors ${mobileTab === tab.id ? 'border-[#922610] text-[#922610] bg-white' : 'border-transparent text-gray-500'}`}",
  "                                              className={`dnd-main-tab ${mobileTab === tab.id ? 'is-active' : ''}`}",
  'estilo dos botões de aba'
);

const tabsEnd = `                                  </div>\n      \n                                  <div className="dnd-sheet p-4 md:p-8 space-y-6">`;
const tabsEndReplacement = `                                  </div>\n\n                                  {mobileTab !== 'status' && (\n                                      <div className="dnd-tab-context">\n                                          <div className="min-w-0">\n                                              <div className="dnd-tab-context-name">{data.bio?.nome || 'Personagem sem nome'}</div>\n                                              <div className="dnd-tab-context-meta">\n                                                  {[data.bio?.classe, data.bio?.subclasse, data.bio?.nivel ? 'Nível ' + data.bio.nivel : ''].filter(Boolean).join(' • ') || 'D&D 5.5e / 2024'}\n                                              </div>\n                                          </div>\n                                          <span className="dnd-tab-context-badge">D&D 5.5e</span>\n                                      </div>\n                                  )}\n      \n                                  <div className="dnd-sheet p-3 sm:p-4 md:p-6 lg:p-8 space-y-5">`;
editor = replaceRequired(editor, tabsEnd, tabsEndReplacement, 'contexto compacto entre abas');

editor = replaceRequired(
  editor,
  "                                  <div className={`${mobileTab === 'status' ? 'flex' : 'hidden md:flex'} dnd-header flex-col md:flex-row gap-5 border-b-2 border-[#922610] pb-4`}>",
  "                                  <div className={`${mobileTab === 'status' ? 'flex' : 'hidden'} dnd-header flex-col md:flex-row gap-5 border-b-2 border-[#922610] pb-4`}>",
  'visibilidade do cabeçalho'
);

editor = replaceRequired(
  editor,
  '                                  <div className="dnd-layout grid grid-cols-1 lg:grid-cols-3 gap-6">',
  '                                  <div className="dnd-layout dnd-tab-content grid grid-cols-1 gap-0">',
  'layout principal'
);

editor = replaceRequired(
  editor,
  "                                      <div className={`${mobileTab === 'status' ? 'block' : 'hidden md:block'} dnd-column space-y-4`}>",
  "                                      <div className={`${mobileTab === 'status' ? 'block' : 'hidden'} dnd-column dnd-tab-pane space-y-4`}>",
  'aba Personagem'
);
editor = replaceRequired(
  editor,
  "                                      <div className={`${mobileTab === 'equipamento' ? 'block' : 'hidden md:block'} dnd-column space-y-4`}>",
  "                                      <div className={`${mobileTab === 'equipamento' ? 'block' : 'hidden'} dnd-column dnd-tab-pane space-y-4`}>",
  'aba Combate'
);
editor = replaceRequired(
  editor,
  "                                      <div className={`${mobileTab === 'recursos' ? 'block' : 'hidden md:block'} dnd-column space-y-4`}>",
  "                                      <div className={`${mobileTab === 'recursos' ? 'block' : 'hidden'} dnd-column dnd-tab-pane space-y-4`}>",
  'aba Recursos'
);

editor = replaceRequired(
  editor,
  '                                          <div className="flex gap-4">\n                                              <div className="flex flex-col gap-2 w-20">',
  '                                          <div className="dnd-status-grid flex flex-col sm:flex-row gap-4">\n                                              <div className="dnd-ability-stack grid grid-cols-3 sm:flex sm:flex-col gap-2 w-full sm:w-20">',
  'atributos responsivos'
);

if (!css.includes(marker)) {
  css += `\n\n        ${marker}\n        .dnd-main-tabs {\n            position:sticky; top:0; z-index:32;\n            gap:0; padding:7px 8px 0;\n            background:linear-gradient(180deg,rgba(246,239,226,.98),rgba(235,224,205,.98));\n            border-bottom:1px solid #b7a184;\n            box-shadow:0 4px 12px rgba(55,39,28,.09);\n            backdrop-filter:blur(10px);\n        }\n        .dnd-main-tab {\n            position:relative; min-width:0; min-height:50px; padding:8px 12px 10px;\n            display:flex; align-items:center; justify-content:center;\n            border:1px solid transparent; border-bottom:0;\n            border-radius:12px 12px 0 0;\n            background:transparent; color:#665e57;\n            font-family:Georgia,'Times New Roman',serif; font-size:10px; font-weight:900;\n            line-height:1.15; letter-spacing:.04em; text-transform:uppercase; text-align:center;\n            transition:background .14s ease,color .14s ease,transform .14s ease,border-color .14s ease;\n        }\n        .dnd-main-tab:hover { color:#922610; background:rgba(255,255,255,.48); }\n        .dnd-main-tab.is-active {\n            color:#922610; background:#fffdf9; border-color:#b7a184;\n            transform:translateY(1px);\n            box-shadow:0 -2px 8px rgba(70,45,30,.06);\n        }\n        .dnd-main-tab.is-active::after {\n            content:''; position:absolute; left:18%; right:18%; bottom:5px; height:3px;\n            border-radius:999px; background:#922610;\n        }\n        .dnd-tab-context {\n            display:flex; align-items:center; justify-content:space-between; gap:12px;\n            padding:10px 16px;\n            background:linear-gradient(90deg,#fffdf8,#f4eadb);\n            border-bottom:1px solid #c8b59b;\n        }\n        .dnd-tab-context-name {\n            overflow:hidden; text-overflow:ellipsis; white-space:nowrap;\n            font:900 15px/1.1 Georgia,'Times New Roman',serif; color:#2e2925;\n        }\n        .dnd-tab-context-meta {\n            overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:3px;\n            font-size:9px; font-weight:800; letter-spacing:.03em; text-transform:uppercase; color:#746a61;\n        }\n        .dnd-tab-context-badge {\n            flex:0 0 auto; padding:5px 8px; border:1px solid #a66a59; border-radius:999px;\n            background:#fff; color:#922610; font:900 8px/1 Georgia,'Times New Roman',serif; letter-spacing:.06em; text-transform:uppercase;\n        }\n        .dnd-tab-content { min-height:520px; }\n        .dnd-tab-pane {\n            width:100%; max-width:1120px; margin:0 auto;\n            padding:14px; border-radius:16px 4px 16px 4px;\n            animation:dndTabEnter .16s ease-out;\n        }\n        @keyframes dndTabEnter { from { opacity:.3; transform:translateY(4px); } to { opacity:1; transform:none; } }\n        .dnd-status-grid { align-items:flex-start; }\n        .dnd-ability-stack { flex:0 0 auto; }\n\n        @media (min-width:768px) {\n            .dnd-main-tabs { padding-left:max(18px,calc((100% - 1120px)/2)); padding-right:max(18px,calc((100% - 1120px)/2)); }\n            .dnd-main-tab { min-height:56px; font-size:11px; }\n            .dnd-tab-context { padding-left:max(28px,calc((100% - 1080px)/2)); padding-right:max(28px,calc((100% - 1080px)/2)); }\n            .dnd-tab-pane { padding:18px; }\n        }\n        @media (max-width:767px) {\n            .dnd-main-tabs { padding:5px 4px 0; }\n            .dnd-main-tab { min-height:46px; padding:7px 4px 9px; font-size:8px; letter-spacing:.015em; }\n            .dnd-main-tab.is-active::after { left:22%; right:22%; bottom:4px; height:2px; }\n            .dnd-tab-context { padding:8px 10px; }\n            .dnd-tab-context-name { font-size:13px; }\n            .dnd-tab-context-meta { font-size:8px; }\n            .dnd-tab-pane { padding:8px 4px; border:0; background:transparent; box-shadow:none; }\n            .dnd-status-grid { gap:12px; }\n            .dnd-ability-stack .dnd-ability-card { min-height:74px; margin-bottom:5px; }\n            .dnd-ability-stack .dnd-mod-bubble { bottom:-8px; }\n            .dnd-sync-item > div:first-child { grid-template-columns:minmax(0,1fr) 54px 88px 24px; }\n            .dnd-feature-card .grid-cols-\\[1fr_110px\\] { grid-template-columns:minmax(0,1fr) 86px; }\n        }\n        @media (max-width:430px) {\n            .dnd-main-tab { font-size:7.5px; }\n            .dnd-tab-context-badge { display:none; }\n            .dnd-sync-item > div:first-child { grid-template-columns:minmax(0,1fr) 48px 72px 22px; gap:3px; }\n            .dnd-feature-card .grid-cols-\\[1fr_110px\\] { grid-template-columns:1fr; }\n            .dnd-spell-meta { grid-template-columns:1fr 1fr 26px 26px 26px; }\n        }\n        body.theme-dark .dnd-main-tabs { background:linear-gradient(180deg,rgba(29,32,36,.98),rgba(18,21,24,.98)); border-color:#5f666c; box-shadow:0 4px 12px rgba(0,0,0,.24); }\n        body.theme-dark .dnd-main-tab { color:#bbb4aa; }\n        body.theme-dark .dnd-main-tab:hover { color:#f09a91; background:rgba(255,255,255,.04); }\n        body.theme-dark .dnd-main-tab.is-active { color:#f08b82; background:#171b1f; border-color:#646b71; }\n        body.theme-dark .dnd-main-tab.is-active::after { background:#d85f54; }\n        body.theme-dark .dnd-tab-context { background:linear-gradient(90deg,#161a1e,#20252a); border-color:#61676d; }\n        body.theme-dark .dnd-tab-context-name { color:#f0ebe2; }\n        body.theme-dark .dnd-tab-context-meta { color:#b4aca2; }\n        body.theme-dark .dnd-tab-context-badge { background:#171b1f; color:#f09a91; border-color:#9e5a52; }\n        body.theme-custom .dnd-main-tabs { background:color-mix(in srgb,var(--custom-window-color) 92%,var(--custom-accent-color) 8%); border-color:var(--custom-accent-color); }\n        body.theme-custom .dnd-main-tab { color:var(--custom-text-color); }\n        body.theme-custom .dnd-main-tab.is-active { background:var(--custom-window-color); color:var(--custom-accent-color); border-color:var(--custom-accent-color); }\n        body.theme-custom .dnd-main-tab.is-active::after { background:var(--custom-accent-color); }\n        body.theme-custom .dnd-tab-context { background:color-mix(in srgb,var(--custom-window-color) 94%,var(--custom-accent-color) 6%); border-color:var(--custom-accent-color); }\n        body.theme-custom .dnd-tab-context-name, body.theme-custom .dnd-tab-context-meta { color:var(--custom-text-color); }\n`;
}

await writeFile(editorPath, editor);
await writeFile(cssPath, css);
console.log('Ficha D&D reorganizada em três abas responsivas e polidas.');
