import { readFile, writeFile } from 'node:fs/promises';

const skyCssPath='src/systems/skyfall/skyfall-theme.css';
const ordemDataPath='src/systems/ordemParanormal/data.js';
const ordemEditorPath='src/systems/ordemParanormal/components/CharacterEditor.jsx';
const ordemCssPath='src/systems/ordemParanormal/ordem-theme.css';
const ordemChatPath='src/systems/ordemParanormal/chat.js';
const appPath='src/PJLiteApp.jsx';

const replaceOnce=(text,from,to,label)=>{
  if(!text.includes(from)) throw new Error(`Automação 0.8.3: marcador não encontrado (${label}).`);
  return text.replace(from,to);
};

// SKYFALL — manter os atributos abaixo do retrato, mas com leitura próxima da ficha oficial.
let skyCss=await readFile(skyCssPath,'utf8');
if(!skyCss.includes('PJ LITE 0.8.3 SKYFALL ATTR CARDS')){
  skyCss+=`\n/* PJ LITE 0.8.3 SKYFALL ATTR CARDS */\n@media(min-width:761px){.skyfall-profile-grid{grid-template-columns:minmax(320px,360px) minmax(0,1fr)!important;align-items:start}.skyfall-profile-aside{width:100%!important;max-width:none!important}.skyfall-profile-aside .skyfall-photo{max-width:190px;margin:0 auto}.skyfall-profile-attributes .skyfall-attributes{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important}}.skyfall-profile-attributes{background:#dbe1e7!important;border:1px solid #8793a4!important;padding:9px!important}.skyfall-profile-attributes-title{color:#39485f!important;letter-spacing:.13em!important}.skyfall-profile-attributes .skyfall-attr{position:relative;background:#eef2f5!important;border:1px solid #7e8a9a!important;border-radius:12px 12px 5px 5px!important;padding:8px 6px 6px!important;box-shadow:inset 0 -3px 0 rgba(57,72,95,.08);min-height:122px;display:flex;flex-direction:column;justify-content:flex-start}.skyfall-profile-attributes .skyfall-attr>span{font-family:Georgia,serif!important;font-size:12px!important;letter-spacing:.06em}.skyfall-profile-attributes .skyfall-attr>input[type=number]{height:40px!important;font-size:20px!important;border:1px solid #8793a4!important;background:#fff!important}.skyfall-profile-attributes .skyfall-attr>small{font-size:10px!important;margin-top:2px}.skyfall-profile-attributes .skyfall-attr>em{font-size:7px!important;min-height:11px}.skyfall-profile-attributes .skyfall-protection-line{margin-top:auto!important;padding-top:6px!important;border-top:1px solid #8e9aa9!important;grid-template-columns:1fr!important;gap:4px!important}.skyfall-profile-attributes .skyfall-protection-line>strong{display:block;background:#fff;border:1px solid #8793a4;border-radius:4px;padding:4px 3px;font-size:9px!important;color:#39485f!important;text-align:center}.skyfall-profile-attributes .skyfall-protection-line label{justify-content:flex-start!important;font-size:7px!important;color:#4c5868!important}.skyfall-profile-attributes .skyfall-protection-line>input[type=number]{height:24px!important;font-size:9px!important}.skyfall-profile-attributes .skyfall-protection-line>input[type=number]::placeholder{font-size:8px}.theme-skyfall .skyfall-profile-attributes,body.theme-skyfall .skyfall-profile-attributes{background:#dce2e8!important;border-color:#79879a!important}.theme-skyfall .skyfall-profile-attributes .skyfall-attr,body.theme-skyfall .skyfall-profile-attributes .skyfall-attr{background:#edf1f4!important;border-color:#7c8999!important}.theme-skyfall .skyfall-profile-attributes .skyfall-attr input,body.theme-skyfall .skyfall-profile-attributes .skyfall-attr input{color:#273548!important}@media(max-width:760px){.skyfall-profile-aside{max-width:460px!important;margin:0 auto!important;width:100%!important}.skyfall-profile-aside .skyfall-photo{max-width:200px!important}.skyfall-profile-attributes .skyfall-attributes{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}}@media(max-width:430px){.skyfall-profile-attributes{padding:7px!important}.skyfall-profile-attributes .skyfall-attr{min-height:108px;padding:6px 4px 5px!important}.skyfall-profile-attributes .skyfall-attr>input[type=number]{height:34px!important;font-size:18px!important}.skyfall-profile-attributes .skyfall-protection-line label{font-size:6px!important}}\n`;
  await writeFile(skyCssPath,skyCss,'utf8');
}

// ORDEM — atributo-base editável nas perícias e evolução opcional.
let ordemData=await readFile(ordemDataPath,'utf8');
if(!ordemData.includes('PJ LITE 0.8.3 ORDEM AUTO DATA')){
  ordemData=replaceOnce(
    ordemData,
    "const skills=()=>Object.fromEntries(ORDEM_SKILLS.map(([id])=>[id,{grau:0,outros:0}]));",
    "const skills=()=>Object.fromEntries(ORDEM_SKILLS.map(([id,,attr])=>[id,{grau:0,outros:0,atributoBase:attr}]));",
    'atributo-base inicial das perícias'
  );
  ordemData=replaceOnce(
    ordemData,
    "dtRituais:{1:'',2:'',3:'',4:''}, evolucao:[], protecao:'',",
    "dtRituais:{1:'',2:'',3:'',4:''}, opcionais:{evolucaoPatentes:false}, evolucao:[], protecao:'',",
    'opções de regras'
  );
  ordemData=replaceOnce(
    ordemData,
    "s.gestao={...initialOrdemPcData.gestao,...(s.gestao||{})}; s.dtRituais={...initialOrdemPcData.dtRituais,...(s.dtRituais||{})}; s.evolucao=",
    "s.gestao={...initialOrdemPcData.gestao,...(s.gestao||{})}; s.dtRituais={...initialOrdemPcData.dtRituais,...(s.dtRituais||{})}; s.opcionais={...initialOrdemPcData.opcionais,...(s.opcionais||{})}; s.opcionais.evolucaoPatentes=!!s.opcionais.evolucaoPatentes; s.evolucao=",
    'normalização de regras opcionais'
  );
  const skillNorm="ORDEM_SKILLS.forEach(([id])=>{const x=s.pericias[id]||{};s.pericias[id]={grau:[0,5,10,15].includes(Number(x.grau))?Number(x.grau):0,outros:Number(x.outros||0)||0};});";
  const skillNormNew="ORDEM_SKILLS.forEach(([id,,attr])=>{const x=s.pericias[id]||{};const atributoBase=ORDEM_ATTRIBUTES.some(([k])=>k===x.atributoBase)?x.atributoBase:attr;s.pericias[id]={grau:[0,5,10,15].includes(Number(x.grau))?Number(x.grau):0,outros:Number(x.outros||0)||0,atributoBase};});";
  ordemData=replaceOnce(ordemData,skillNorm,skillNormNew,'normalização atributo-base');
  ordemData=`/* PJ LITE 0.8.3 ORDEM AUTO DATA */\n${ordemData}`;
  await writeFile(ordemDataPath,ordemData,'utf8');
}

let ordem=await readFile(ordemEditorPath,'utf8');
if(!ordem.includes('PJ LITE 0.8.3 ORDEM AUTO UI')){
  ordem=replaceOnce(
    ordem,
    "const tabs=[['agente','Agente'],['pericias','Perícias'],['combate','Combate'],['poderes','Poderes & Habilidades'],['rituais','Rituais'],['inventario','Inventário'],['evolucao','Evolução']];",
    "const BASE_TABS=[['agente','Agente'],['pericias','Perícias'],['combate','Combate'],['poderes','Poderes & Habilidades'],['rituais','Rituais'],['inventario','Inventário']];",
    'abas base de Ordem'
  );
  ordem=replaceOnce(
    ordem,
    " if(data?.system!=='ordemParanormal'||data?.type!=='pc')return null;",
    " if(data?.system!=='ordemParanormal'||data?.type!=='pc')return null;\n const tabs=[...BASE_TABS,...(data.opcionais?.evolucaoPatentes?[['evolucao','Evolução']]:[])];",
    'aba opcional de evolução'
  );
  ordem=replaceOnce(
    ordem,
    " const mentalMode=s.recursoMental==='pd'?'pd':'sanidade'; const baseDefesa=10+num(a.agi);",
    " const mentalMode=s.recursoMental==='pd'?'pd':'sanidade';\n const defesaTotal=10+num(a.agi)+num(s.defesaEquip)+num(s.defesaOutros);\n const skillAttr=(id,fallback)=>data.pericias?.[id]?.atributoBase||fallback;\n const skillDice=(id,fallback)=>num(a[skillAttr(id,fallback)]);\n const skillBonus=id=>num(data.pericias?.[id]?.grau)+num(data.pericias?.[id]?.outros);",
    'automação de defesa e perícias'
  );

  ordem=replaceOnce(
    ordem,
    `<section className="ordem-panel"><div className="ordem-mental-switch"><div><strong>Recurso mental</strong><small>Sobrevivendo ao Horror permite jogar sem Sanidade.</small></div><select value={mentalMode} onChange={e=>updateField('status.recursoMental',e.target.value)}><option value="sanidade">Sanidade (SAN)</option><option value="pd">Determinação (PD) — sem Sanidade</option></select></div><div className="ordem-meters">{meter('vida','VIDA','pvAtual','pvMax')}{mentalMode==='pd'?meter('determinacao','DETERMINAÇÃO','pdAtual','pdMax'):meter('sanidade','SANIDADE','sanAtual','sanMax')}{meter('esforco','ESFORÇO','peAtual','peMax')}</div>`,
    `<section className="ordem-panel"><div className="ordem-mental-switch"><div><strong>Recursos do personagem</strong><small>No modo PD, Determinação substitui PE e SAN.</small></div><select value={mentalMode} onChange={e=>updateField('status.recursoMental',e.target.value)}><option value="sanidade">Padrão — PE + SAN</option><option value="pd">Sem Sanidade — PD</option></select></div><label className="ordem-optional-rule"><input type="checkbox" checked={!!data.opcionais?.evolucaoPatentes} onChange={e=>{const enabled=e.target.checked;const d=JSON.parse(JSON.stringify(data));d.opcionais={...(d.opcionais||{}),evolucaoPatentes:enabled};if(enabled)d.status={...(d.status||{}),recursoMental:'pd'};setData(d);if(!enabled&&tab==='evolucao')setTab('agente');}}/><span><strong>Usar Evolução por Patentes</strong><small>Regra opcional de Sobrevivendo ao Horror. Ao ativar, o modo PD também é habilitado.</small></span></label>{mentalMode==='pd'?<div className="ordem-meters ordem-meters--pd">{meter('vida','VIDA','pvAtual','pvMax')}{meter('determinacao','DETERMINAÇÃO','pdAtual','pdMax')}</div>:<div className="ordem-meters">{meter('vida','VIDA','pvAtual','pvMax')}{meter('esforco','ESFORÇO','peAtual','peMax')}{meter('sanidade','SANIDADE','sanAtual','sanMax')}</div>}`,
    'PD substitui PE e SAN'
  );

  const defesaManual=`<label><span>Defesa</span><input type="number" value={s.defesa??10} onChange={e=>updateField('status.defesa',num(e.target.value))}/></label>`;
  const defesaAuto=`<label><span>Defesa</span><input type="number" value={defesaTotal} readOnly title="10 + AGI + Equipamento + Outros"/><small className="ordem-auto-note">10 + AGI + Equip. + Outros</small></label>`;
  if(!ordem.includes(defesaManual)) throw new Error('Automação 0.8.3: campo Defesa não encontrado.');
  ordem=ordem.replaceAll(defesaManual,defesaAuto);
  ordem=ordem.replace(`<label><span>Base Defesa</span><input value={baseDefesa} readOnly/></label>`,``);
  ordem=ordem.replace(`<label><span>Limite PE / PD</span><input value={s.limitePePd||''} onChange={e=>updateField('status.limitePePd',e.target.value)}/></label>`,`<label><span>{mentalMode==='pd'?'Limite PD':'Limite PE'}</span><input value={s.limitePePd||''} onChange={e=>updateField('status.limitePePd',e.target.value)}/></label>`);

  const skillsStart=ordem.indexOf(`  {tab==='pericias'&&<section className="ordem-panel">`);
  const combatStart=ordem.indexOf(`\n\n  {tab==='combate'`,skillsStart);
  if(skillsStart<0||combatStart<0) throw new Error('Automação 0.8.3: aba Perícias não localizada.');
  const skillsBlock=`  {tab==='pericias'&&<section className="ordem-panel"><div className="ordem-panel-title"><span>PERÍCIAS</span><small>atributo-base, dados e bônus calculados automaticamente</small></div><div className="ordem-skills-wrap"><div className="ordem-skill-head"><span>Perícia</span><span>Atributo</span><span>Dados</span><span>Bônus</span><span>Treino</span><span>Outros</span></div><div className="ordem-skills">{ORDEM_SKILLS.map(([id,n,attr])=>{const x=data.pericias?.[id]||{};const base=skillAttr(id,attr);const bonus=skillBonus(id);return <div className="ordem-skill" key={id}><div><strong>{n}</strong></div><select className="ordem-skill-attr-select" value={base} onChange={e=>updateField(\`pericias.\${id}.atributoBase\`,e.target.value)} title="Atributo-base da perícia">{ORDEM_ATTRIBUTES.map(([k,abbr])=><option value={k} key={k}>{abbr}</option>)}</select><span className="ordem-skill-dice">{skillDice(id,attr)}d20</span><strong className="ordem-skill-bonus">{bonus>=0?\`+\${bonus}\`:bonus}</strong><select value={x.grau??0} onChange={e=>updateField(\`pericias.\${id}.grau\`,num(e.target.value))}><option value="0">0</option><option value="5">+5</option><option value="10">+10</option><option value="15">+15</option></select><input type="number" value={x.outros??0} onChange={e=>updateField(\`pericias.\${id}.outros\`,num(e.target.value))}/></div>})}</div></div><p className="ordem-auto-help">Dados = valor do atributo-base em d20. Bônus = Treino + Outros. Você pode trocar o atributo-base de cada perícia quando uma regra ou situação pedir.</p></section>}`;
  ordem=ordem.slice(0,skillsStart)+skillsBlock+ordem.slice(combatStart);

  ordem=ordem.replace(`{tab==='evolucao'&&<div className="space-y-3">`,`{tab==='evolucao'&&data.opcionais?.evolucaoPatentes&&<div className="space-y-3">`);
  ordem=ordem.replaceAll('Limite PE / PD','Limite PD');
  ordem=`/* PJ LITE 0.8.3 ORDEM AUTO UI */\n${ordem}`;
  await writeFile(ordemEditorPath,ordem,'utf8');
}

let ordemCss=await readFile(ordemCssPath,'utf8');
if(!ordemCss.includes('PJ LITE 0.8.3 ORDEM AUTO THEME')){
  ordemCss+=`\n/* PJ LITE 0.8.3 ORDEM AUTO THEME */\n.ordem-optional-rule{display:flex!important;align-items:flex-start!important;gap:9px!important;margin:9px 0 10px;padding:9px 10px;border:1px solid #3a3033;border-radius:5px;background:#0c0c0e}.ordem-optional-rule>input{width:auto!important;margin-top:3px;accent-color:#a72b32}.ordem-optional-rule>span{display:flex;flex-direction:column;gap:2px}.ordem-optional-rule strong{font-size:10px;color:#f0e8e8}.ordem-optional-rule small{font-size:8px;color:#91888a;line-height:1.35}.ordem-meters--pd{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ordem-auto-note{display:block;font-size:7px;color:#777;margin-top:3px;text-align:center}.ordem-skills-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:4px}.ordem-skill-head,.ordem-skill{grid-template-columns:minmax(150px,1fr) 76px 60px 58px 78px 58px!important;min-width:560px}.ordem-skill-attr-select{text-align:center!important;font-weight:900!important;color:#9fb0c2!important}.ordem-skill-dice,.ordem-skill-bonus{display:block;text-align:center;font-size:10px;font-weight:900}.ordem-skill-dice{color:#9fb0c2}.ordem-skill-bonus{color:#f0d3d3}.ordem-auto-help{font-size:8px;color:#8d8587;line-height:1.4;margin-top:8px}.theme-ordem .ordem-optional-rule,body.theme-ordem .ordem-optional-rule{background:#0d0c0d;border-color:#3e2b2e}.theme-ordem .ordem-skill-dice,body.theme-ordem .ordem-skill-dice{color:#aebed0}@media(max-width:640px){.ordem-meters--pd{grid-template-columns:1fr 1fr!important}.ordem-skill-head,.ordem-skill{grid-template-columns:130px 64px 52px 52px 66px 50px!important;min-width:500px}.ordem-skill-head{font-size:7px}.ordem-skill-attr-select,.ordem-skill select,.ordem-skill input{font-size:11px!important}.ordem-optional-rule{padding:8px}}\n`;
  await writeFile(ordemCssPath,ordemCss,'utf8');
}

let ordemChat=await readFile(ordemChatPath,'utf8');
if(!ordemChat.includes('PJ LITE 0.8.3 ORDEM PD CHAT')){
  const old=` const mental=s.recursoMental==='pd'?\`🎯 PD \${s.pdAtual??0}/\${s.pdMax??0}\`:\`🧠 SAN \${s.sanAtual??0}/\${s.sanMax??0}\`; /* RECURSO MENTAL SAH */\n o+=\`\\n⚙ STATUS\\n❤️ PV \${s.pvAtual??0}/\${s.pvMax??0} | ⚡ PE \${s.peAtual??0}/\${s.peMax??0} | \${mental} | Defesa \${s.defesa??10}\\n\`;`;
  const neu=` const recursos=s.recursoMental==='pd'?\`❤️ PV \${s.pvAtual??0}/\${s.pvMax??0} | 🎯 PD \${s.pdAtual??0}/\${s.pdMax??0}\`:\`❤️ PV \${s.pvAtual??0}/\${s.pvMax??0} | ⚡ PE \${s.peAtual??0}/\${s.peMax??0} | 🧠 SAN \${s.sanAtual??0}/\${s.sanMax??0}\`; /* PJ LITE 0.8.3 ORDEM PD CHAT */\n const defesa=10+Number(d.atributos?.agi||0)+Number(s.defesaEquip||0)+Number(s.defesaOutros||0);\n o+=\`\\n⚙ STATUS\\n\${recursos} | Defesa \${defesa}\\n\`;`;
  ordemChat=replaceOnce(ordemChat,old,neu,'Ficha Chat PD/PE');
  await writeFile(ordemChatPath,ordemChat,'utf8');
}

let app=await readFile(appPath,'utf8');
if(!app.includes('PJ LITE 0.8.3 AUTO GUIDE')){
  app=app.replace(
    'Acompanhe AGI, FOR, INT, PRE, VIG, PV e PE. Em Recurso mental escolha SAN ou PD (Determinação) para a regra Jogando sem Sanidade.',
    'Acompanhe AGI, FOR, INT, PRE e VIG. No modo padrão use PV, PE e SAN; em Jogando sem Sanidade, PD substitui PE e SAN. Defesa e os totais das perícias têm cálculo assistido.'
  );
  app=app.replace(
    'Organize categoria, espaços e quantidade, além de Limite de Itens, Crédito, Carga, Prestígio, DT de Rituais e histórico de evolução.',
    'Organize categoria, espaços e quantidade, além de Limite de Itens, Crédito, Carga, Prestígio e DT de Rituais. Evolução por Patentes é opcional e pode ser ativada pelo jogador.'
  );
  app=`/* PJ LITE 0.8.3 AUTO GUIDE */\n${app}`;
  await writeFile(appPath,app,'utf8');
}

console.log('✓ Skyfall: atributos reorganizados; Ordem: PD correto, evolução opcional e automações aplicadas.');
