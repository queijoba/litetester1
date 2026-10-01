import { readFile, writeFile } from 'node:fs/promises';

const skyCssPath='src/systems/skyfall/skyfall-theme.css';
const ordemDataPath='src/systems/ordemParanormal/data.js';
const ordemEditorPath='src/systems/ordemParanormal/components/CharacterEditor.jsx';
const ordemCssPath='src/systems/ordemParanormal/ordem-theme.css';
const appPath='src/PJLiteApp.jsx';

const replaceOnce=(text,from,to,label)=>{
  if(!text.includes(from)) throw new Error(`0.8.3 original/nivel: marcador não encontrado (${label}).`);
  return text.replace(from,to);
};

let skyCss=await readFile(skyCssPath,'utf8');
if(!skyCss.includes('PJ LITE 0.8.3 SKYFALL ORIGINAL SHEET LAYOUT')){
  skyCss+=`\n/* PJ LITE 0.8.3 SKYFALL ORIGINAL SHEET LAYOUT */\n.skyfall-profile-grid{display:grid!important;grid-template-columns:180px minmax(0,1fr)!important;grid-template-areas:"photo identity" "attrs attrs"!important;gap:16px!important;align-items:start!important}.skyfall-profile-aside{display:contents!important}.skyfall-profile-aside>.skyfall-photo{grid-area:photo!important;width:100%!important;max-width:180px!important;margin:0!important}.skyfall-profile-grid>.grid{grid-area:identity!important;align-self:start!important}.skyfall-profile-attributes{grid-area:attrs!important;width:100%!important;max-width:none!important;margin:0!important;background:#d8e0e7!important;border:0!important;border-radius:2px!important;padding:12px 14px!important;box-shadow:inset 0 0 0 1px #9ba8b5!important}.skyfall-profile-attributes-title{text-align:left!important;margin:0 0 9px!important;color:#33445a!important;font-family:Georgia,serif!important;font-size:10px!important;font-weight:800!important;letter-spacing:.16em!important}.skyfall-profile-attributes .skyfall-attributes{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:10px!important}.skyfall-profile-attributes .skyfall-attr{min-width:0!important;min-height:0!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;text-align:center!important}.skyfall-profile-attributes .skyfall-attr>span{font-family:Georgia,serif!important;color:#2d3440!important;font-size:11px!important;font-weight:800!important;letter-spacing:.06em!important;margin-bottom:3px!important}.skyfall-profile-attributes .skyfall-attr>input[type=number]{order:1!important;width:100%!important;height:54px!important;padding:8px 4px 12px!important;background:#fff!important;color:#182234!important;border:1px solid #68778a!important;border-radius:0!important;clip-path:polygon(13% 0,87% 0,100% 16%,100% 77%,50% 100%,0 77%,0 16%)!important;font-family:Georgia,serif!important;font-size:23px!important;font-weight:800!important;text-align:center!important;box-shadow:none!important}.skyfall-profile-attributes .skyfall-attr>small{order:2!important;margin-top:2px!important;color:#6e4c31!important;font-size:9px!important;font-weight:800!important}.skyfall-profile-attributes .skyfall-attr>em{order:3!important;min-height:13px!important;color:#4e5967!important;font-size:7px!important;font-style:normal!important}.skyfall-profile-attributes .skyfall-protection-line{order:4!important;display:grid!important;grid-template-columns:1fr!important;gap:3px!important;margin-top:5px!important;padding:0!important;border:0!important}.skyfall-profile-attributes .skyfall-protection-line>strong{display:block!important;background:#fff!important;border:1px solid #68778a!important;border-radius:2px!important;padding:4px 2px!important;color:#26384d!important;font-size:9px!important;font-weight:800!important}.skyfall-profile-attributes .skyfall-protection-line label{display:flex!important;align-items:center!important;justify-content:center!important;gap:3px!important;color:#4b5968!important;font-size:7px!important;margin:0!important}.skyfall-profile-attributes .skyfall-protection-line>input[type=number]{height:25px!important;padding:2px 3px!important;background:#fff!important;border:1px solid #9ca8b6!important;border-radius:3px!important;font-size:9px!important;text-align:center!important}.theme-skyfall .skyfall-profile-attributes,body.theme-skyfall .skyfall-profile-attributes{background:#d8e0e7!important;border-color:#9ba8b5!important}.theme-skyfall .skyfall-profile-attributes .skyfall-attr,body.theme-skyfall .skyfall-profile-attributes .skyfall-attr{background:transparent!important;border:0!important}.theme-skyfall .skyfall-profile-attributes .skyfall-attr>input[type=number],body.theme-skyfall .skyfall-profile-attributes .skyfall-attr>input[type=number]{background:#fff!important;color:#182234!important;border-color:#68778a!important}.theme-skyfall .skyfall-card:first-of-type{background:#f7f8f7!important;border-color:#9aa8b5!important}.theme-skyfall .skyfall-card:first-of-type .skyfall-profile-grid>.grid label>span{color:#34445a!important}.theme-skyfall .skyfall-card:first-of-type input,.theme-skyfall .skyfall-card:first-of-type textarea{border-color:#a8b4c0!important}.skyfall-photo{border-radius:4px!important;border:1px solid #75879a!important;background:#e7edf1!important}.skyfall-photo-empty{border-radius:3px!important}.skyfall-photo label{border-radius:3px!important;background:#394a60!important}.skyfall-photo button{border-radius:3px!important}@media(max-width:860px){.skyfall-profile-grid{grid-template-columns:150px minmax(0,1fr)!important}.skyfall-profile-aside>.skyfall-photo{max-width:150px!important}.skyfall-profile-attributes .skyfall-attributes{grid-template-columns:repeat(3,minmax(0,1fr))!important}}@media(max-width:640px){.skyfall-profile-grid{grid-template-columns:1fr!important;grid-template-areas:"photo" "identity" "attrs"!important}.skyfall-profile-aside>.skyfall-photo{max-width:190px!important;margin:0 auto!important}.skyfall-profile-attributes{padding:10px!important}.skyfall-profile-attributes .skyfall-attributes{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}}@media(max-width:390px){.skyfall-profile-attributes .skyfall-attributes{grid-template-columns:repeat(2,minmax(0,1fr))!important}.skyfall-profile-attributes .skyfall-attr>input[type=number]{height:50px!important}}\n`;
  await writeFile(skyCssPath,skyCss,'utf8');
}

let ordemData=await readFile(ordemDataPath,'utf8');
if(!ordemData.includes('PJ LITE 0.8.3 ORDEM NEX NIVEL DATA')){
  if(!ordemData.includes('nivelExperiencia:')) ordemData=ordemData.replace('nex:5,patente:','nex:5,nivelExperiencia:1,patente:');
  ordemData=ordemData.replace('opcionais:{evolucaoPatentes:false}','opcionais:{evolucaoPatentes:false,nivelExperiencia:false}');
  ordemData=ordemData.replace('s.bio.nex=Math.max(0,Number(s.bio.nex??5)||0);','s.bio.nex=Math.max(0,Number(s.bio.nex??5)||0); s.bio.nivelExperiencia=Math.max(1,Number(s.bio.nivelExperiencia??1)||1);');
  ordemData=ordemData.replace('s.opcionais.evolucaoPatentes=!!s.opcionais.evolucaoPatentes;','s.opcionais.evolucaoPatentes=!!s.opcionais.evolucaoPatentes; s.opcionais.nivelExperiencia=!!s.opcionais.nivelExperiencia;');
  ordemData=`/* PJ LITE 0.8.3 ORDEM NEX NIVEL DATA */\n${ordemData}`;
  await writeFile(ordemDataPath,ordemData,'utf8');
}

let ordem=await readFile(ordemEditorPath,'utf8');
if(!ordem.includes('PJ LITE 0.8.3 ORDEM NEX NIVEL UI')){
  const nexOld=`<div className="ordem-nex"><span>NEX</span><div><input type="number" min="0" max="100" value={b.nex??5} onChange={e=>updateField('bio.nex',num(e.target.value))}/><b>%</b></div></div>`;
  const nexNew=`<div className="ordem-progression-badges"><div className="ordem-nex"><span>NEX</span><div><input type="number" min="0" max="100" value={b.nex??5} onChange={e=>updateField('bio.nex',num(e.target.value))}/><b>%</b></div></div>{data.opcionais?.nivelExperiencia&&<div className="ordem-level-badge"><span>NÍVEL</span><input type="number" min="1" max="20" value={b.nivelExperiencia??1} onChange={e=>updateField('bio.nivelExperiencia',Math.max(1,num(e.target.value)))}/></div>}</div>`;
  ordem=replaceOnce(ordem,nexOld,nexNew,'badge NEX/Nível');
  const progressionAnchor=`<label className="ordem-optional-rule"><input type="checkbox" checked={!!data.opcionais?.evolucaoPatentes}`;
  if(!ordem.includes(progressionAnchor)) throw new Error('0.8.3 original/nivel: opção de Evolução por Patentes não localizada.');
  const levelRule=`<label className="ordem-optional-rule ordem-level-rule"><input type="checkbox" checked={!!data.opcionais?.nivelExperiencia} onChange={e=>{const enabled=e.target.checked;const d=JSON.parse(JSON.stringify(data));d.opcionais={...(d.opcionais||{}),nivelExperiencia:enabled,evolucaoPatentes:enabled?false:!!d.opcionais?.evolucaoPatentes};if(enabled)d.bio={...(d.bio||{}),nivelExperiencia:Math.max(1,Number(d.bio?.nivelExperiencia||1))};setData(d);if(enabled&&tab==='evolucao')setTab('agente');}}/><span><strong>Usar NEX & Experiência</strong><small>Regra opcional: Nível mede experiência mundana; NEX continua sendo a exposição paranormal. Para requisitos gerais, 1 nível equivale a 5% de NEX.</small></span></label>`;
  ordem=ordem.replace(progressionAnchor,levelRule+progressionAnchor);
  ordem=ordem.replace('d.opcionais={...(d.opcionais||{}),evolucaoPatentes:enabled};if(enabled)d.status=','d.opcionais={...(d.opcionais||{}),evolucaoPatentes:enabled,nivelExperiencia:enabled?false:!!d.opcionais?.nivelExperiencia};if(enabled)d.status=');
  ordem=`/* PJ LITE 0.8.3 ORDEM NEX NIVEL UI */\n${ordem}`;
  await writeFile(ordemEditorPath,ordem,'utf8');
}

let ordemCss=await readFile(ordemCssPath,'utf8');
if(!ordemCss.includes('PJ LITE 0.8.3 ORDEM NEX NIVEL STYLE')){
  ordemCss+=`\n/* PJ LITE 0.8.3 ORDEM NEX NIVEL STYLE */\n.ordem-progression-badges{display:flex;align-items:stretch;justify-content:flex-end;gap:8px;flex-wrap:wrap}.ordem-level-badge{min-width:78px;border:1px solid #7f1d1d;background:#111114;border-radius:8px;padding:7px 9px;display:flex;flex-direction:column;justify-content:center;align-items:center}.ordem-level-badge>span{font-size:8px;letter-spacing:.13em;color:#fca5a5;font-weight:900}.ordem-level-badge>input{width:58px!important;margin-top:3px!important;text-align:center!important;background:#09090b!important;color:#fff!important;border-color:#7f1d1d!important;font-size:18px!important;font-weight:900!important}.ordem-level-rule{border-color:#6b365c!important;background:linear-gradient(135deg,rgba(73,30,62,.30),rgba(18,18,21,.96))!important}.ordem-level-rule strong{color:#f0abfc!important}@media(max-width:640px){.ordem-progression-badges{width:100%;justify-content:flex-start}.ordem-level-badge,.ordem-nex{flex:1;min-width:110px}.ordem-level-badge>input{width:100%!important}}\n`;
  await writeFile(ordemCssPath,ordemCss,'utf8');
}

let app=await readFile(appPath,'utf8');
if(!app.includes('PJ LITE 0.8.3 GUIA NEX EXPERIENCIA')){
  const ordemGuide='Esta integração usa a edição clássica v1.3 com a ficha de Sobrevivendo ao Horror como referência. Você pode usar SAN ou PD (Determinação) para mesas que jogam sem Sanidade.';
  if(app.includes(ordemGuide)) app=app.replace(ordemGuide,ordemGuide+' Também há suporte à regra opcional NEX & Experiência: o Nível representa a experiência prática, enquanto o NEX permanece como exposição ao Outro Lado.');
  app=`/* PJ LITE 0.8.3 GUIA NEX EXPERIENCIA */\n${app}`;
  await writeFile(appPath,app,'utf8');
}

console.log('✓ Skyfall aproximado da ficha oficial/D&D; Ordem com NEX & Experiência opcional.');
