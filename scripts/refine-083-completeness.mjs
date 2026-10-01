import { readFile, writeFile } from 'node:fs/promises';

const skyDataPath='src/systems/skyfall/data.js';
const skyEditorPath='src/systems/skyfall/components/CharacterEditor.jsx';
const skyCssPath='src/systems/skyfall/skyfall-theme.css';
const ordemDataPath='src/systems/ordemParanormal/data.js';
const ordemEditorPath='src/systems/ordemParanormal/components/CharacterEditor.jsx';
const ordemCssPath='src/systems/ordemParanormal/ordem-theme.css';
const ordemChatPath='src/systems/ordemParanormal/chat.js';
const appPath='src/PJLiteApp.jsx';

const replaceOnce=(text,from,to,label)=>{
  if(!text.includes(from)) throw new Error(`Completude 0.8.3: marcador não encontrado (${label}).`);
  return text.replace(from,to);
};

// ============================================================
// SKYFALL — completar campos da ficha oficial e proteções.
// ============================================================
let skyData=await readFile(skyDataPath,'utf8');
if(!skyData.includes('PJ LITE 0.8.3 SKYFALL COMPLETE')){
  skyData=replaceOnce(
    skyData,
    "  atributos:{ for:10, con:10, des:10, sab:10, int:10, car:10 },\n  proficiencia:2,",
    "  atributos:{ for:10, con:10, des:10, sab:10, int:10, car:10 },\n  protecoes:{for:{proficiente:false,bonus:0},con:{proficiente:false,bonus:0},des:{proficiente:false,bonus:0},sab:{proficiente:false,bonus:0},int:{proficiente:false,bonus:0},car:{proficiente:false,bonus:0}},\n  proficiencia:2,",
    'proteções Skyfall'
  );
  skyData=skyData.replace("enfase:{atual:0,max:0}","enfase:{atual:0,max:0,outro:0}");
  skyData=replaceOnce(
    skyData,
    "  SKYFALL_ATTRIBUTES.forEach(([k])=>s.atributos[k]=Number(s.atributos[k]??10)||0);\n  s.proficiencia=Number(s.proficiencia??2)||0;",
    "  SKYFALL_ATTRIBUTES.forEach(([k])=>s.atributos[k]=Number(s.atributos[k]??10)||0);\n  s.protecoes={...clone(initialSkyfallPcData.protecoes),...(s.protecoes||{})}; SKYFALL_ATTRIBUTES.forEach(([k])=>{const p=s.protecoes[k]||{};s.protecoes[k]={proficiente:!!p.proficiente,bonus:Number(p.bonus||0)||0};});\n  s.proficiencia=Number(s.proficiencia??2)||0;",
    'normalização proteções Skyfall'
  );
  skyData=skyData.replace(
    "s.habilidades=list(s.habilidades).map(x=>({nome:'',origem:'',desc:'',...(x||{})}));",
    "s.habilidades=list(s.habilidades).map(x=>({nome:'',origem:'',custoEnfase:'',descritores:'',desc:'',...(x||{})}));"
  );
  skyData=`/* PJ LITE 0.8.3 SKYFALL COMPLETE */\n${skyData}`;
  await writeFile(skyDataPath,skyData,'utf8');
}

let sky=await readFile(skyEditorPath,'utf8');
if(!sky.includes('PJ LITE 0.8.3 SKYFALL COMPLETE UI')){
  sky=replaceOnce(
    sky,
    " const a=data.atributos||{},r=data.recursos||{},b=data.bio||{},c=data.combate||{},cj=data.conjuracao||{};",
    " const a=data.atributos||{},r=data.recursos||{},b=data.bio||{},c=data.combate||{},cj=data.conjuracao||{};\n const attrModNum=v=>Math.floor((num(v)-10)/2);\n const protectionTotal=k=>10+attrModNum(a[k])+((data.protecoes?.[k]?.proficiente)?num(data.proficiencia):0)+num(data.protecoes?.[k]?.bonus);\n const skillTotal=(id,attr)=>attrModNum(a[attr])+((data.pericias?.[id]?.proficiente)?num(data.proficiencia):0)+num(data.pericias?.[id]?.bonus);",
    'helpers Skyfall completos'
  );

  const attrOld=`<label key={k} className="skyfall-attr"><span>{abbr}</span><input type="number" value={a[k]??10} onChange={e=>updateField(\`atributos.\${k}\`,num(e.target.value))}/><small>{mod(a[k])}</small><em>{n}</em></label>`;
  const attrNew=`<div key={k} className="skyfall-attr"><span>{abbr}</span><input type="number" value={a[k]??10} onChange={e=>updateField(\`atributos.\${k}\`,num(e.target.value))}/><small>{mod(a[k])}</small><em>{n}</em><div className="skyfall-protection-line"><strong title="Proteção do atributo">🛡 {protectionTotal(k)}</strong><label><input type="checkbox" checked={!!data.protecoes?.[k]?.proficiente} onChange={e=>updateField(\`protecoes.\${k}.proficiente\`,e.target.checked)}/> Prof.</label><input type="number" value={data.protecoes?.[k]?.bonus??0} onChange={e=>updateField(\`protecoes.\${k}.bonus\`,num(e.target.value))} title="Bônus adicional de Proteção"/></div></div>`;
  sky=replaceOnce(sky,attrOld,attrNew,'atributos/proteções Skyfall');

  const skillOld=`<input value={x.bonus||''} onChange={e=>updateField(\`pericias.\${id}.bonus\`,e.target.value)} placeholder="+0"/>`;
  const skillNew=`<input value={x.bonus||''} onChange={e=>updateField(\`pericias.\${id}.bonus\`,e.target.value)} placeholder="+0"/><strong className="skyfall-skill-total" title="Total sugerido">{skillTotal(id,attr)>=0?\`+\${skillTotal(id,attr)}\`:skillTotal(id,attr)}</strong>`;
  sky=replaceOnce(sky,skillOld,skillNew,'total de perícias Skyfall');

  sky=sky.replace("{pair('enfase','Ênfase')}<label className=\"skyfall-resource\"><span>Pontos de Sombra</span>","{pair('enfase','Ênfase')}<label className=\"skyfall-resource\"><span>Ênfase — Outro</span><input type=\"number\" value={r.enfase?.outro??0} onChange={e=>updateField('recursos.enfase.outro',num(e.target.value))}/><small>Ajuste / reserva adicional</small></label><label className=\"skyfall-resource\"><span>Pontos de Sombra</span>");
  sky=sky.replace("['protecao','Proteção']","['protecao','Proteção / armadura']");
  sky=sky.replace("add('habilidades',{nome:'',origem:'',desc:''})","add('habilidades',{nome:'',origem:'',custoEnfase:'',descritores:'',desc:''})");
  sky=replaceOnce(
    sky,
    `<input value={x.origem||''} onChange={e=>patch('habilidades',i,'origem',e.target.value)} placeholder="Origem"/><textarea rows="3" value={x.desc||''}`,
    `<div className="grid grid-cols-2 gap-2"><input value={x.origem||''} onChange={e=>patch('habilidades',i,'origem',e.target.value)} placeholder="Origem"/><input value={x.custoEnfase||''} onChange={e=>patch('habilidades',i,'custoEnfase',e.target.value)} placeholder="Custo de Ênfase"/><input className="col-span-2" value={x.descritores||''} onChange={e=>patch('habilidades',i,'descritores',e.target.value)} placeholder="Descritores"/></div><textarea rows="3" value={x.desc||''}`,
    'habilidades Skyfall completas'
  );
  sky=`/* PJ LITE 0.8.3 SKYFALL COMPLETE UI */\n${sky}`;
  await writeFile(skyEditorPath,sky,'utf8');
}

let skyCss=await readFile(skyCssPath,'utf8');
if(!skyCss.includes('PJ LITE 0.8.3 SKYFALL THEME STABLE')){
  skyCss+=`\n/* PJ LITE 0.8.3 SKYFALL THEME STABLE */\nbody.theme-skyfall{background:#211a2a!important;color:#29232e}.theme-skyfall .skyfall-sheet,body.theme-skyfall .skyfall-sheet{background:#eee7da!important;color:#30283a!important;border:1px solid #8a7392!important;box-shadow:0 14px 34px rgba(18,12,24,.28)}.theme-skyfall .skyfall-hero,body.theme-skyfall .skyfall-hero{background:#34243f!important;border-color:#b89455!important}.theme-skyfall .skyfall-card,body.theme-skyfall .skyfall-card{background:#fbf8f1!important;border-color:#cbbfca!important;color:#30283a!important}.theme-skyfall .skyfall-entry,body.theme-skyfall .skyfall-entry{background:#f7f2e9!important;border-color:#d5c8d3!important}.theme-skyfall .skyfall-card input,.theme-skyfall .skyfall-card select,.theme-skyfall .skyfall-card textarea,.theme-skyfall .skyfall-entry input,.theme-skyfall .skyfall-entry select,.theme-skyfall .skyfall-entry textarea{background:#fffdf8!important;color:#30283a!important;border-color:#bdb1c0!important}.theme-skyfall .skyfall-tabs button{background:#e8e0e9!important;color:#4d3c58!important}.theme-skyfall .skyfall-tabs button.active{background:#4a3158!important;color:#fff!important}.skyfall-protection-line{display:grid;grid-template-columns:auto 1fr 42px;gap:4px;align-items:center;margin-top:5px;padding-top:5px;border-top:1px solid rgba(104,78,116,.18)}.skyfall-protection-line>strong{font-size:9px;color:#684677;white-space:nowrap}.skyfall-protection-line label{font-size:7px!important;display:flex!important;align-items:center;justify-content:center;gap:2px;margin:0!important}.skyfall-protection-line input[type=checkbox]{width:auto!important;padding:0!important}.skyfall-protection-line input[type=number]{font-size:9px!important;padding:3px!important;text-align:center}.skyfall-skill{grid-template-columns:minmax(100px,1fr) auto auto 55px 42px}.skyfall-skill-total{background:#4a3158;color:#fff;border-radius:999px;text-align:center;padding:4px 5px;font-size:9px}@media(max-width:640px){.skyfall-skill{grid-template-columns:minmax(0,1fr) minmax(0,1fr) 48px 40px}.skyfall-skill>div:first-child{grid-column:1/-1}.skyfall-protection-line{grid-template-columns:auto 1fr 38px}.theme-skyfall .skyfall-sheet{border-left:0!important;border-right:0!important}}\n`;
  await writeFile(skyCssPath,skyCss,'utf8');
}

// ============================================================
// ORDEM PARANORMAL — base Sobrevivendo ao Horror + SAN/PD.
// ============================================================
let ordemData=await readFile(ordemDataPath,'utf8');
if(!ordemData.includes('PJ LITE 0.8.3 ORDEM SAH COMPLETE')){
  ordemData=ordemData.replace("idade:'',imagem:''","idade:'',profissao:'',imagem:''");
  ordemData=replaceOnce(
    ordemData,
    " status:{pvAtual:10,pvMax:10,peAtual:5,peMax:5,sanAtual:10,sanMax:10,defesa:10,bloqueio:0,esquiva:10,peRodada:1,deslocamento:'9 m'},",
    " status:{pvAtual:10,pvMax:10,peAtual:5,peMax:5,sanAtual:10,sanMax:10,pdAtual:0,pdMax:0,recursoMental:'sanidade',defesa:10,defesaEquip:0,defesaOutros:0,bloqueio:0,esquiva:10,peRodada:1,limitePePd:'',deslocamento:'9 m'},",
    'status SAN/PD Ordem'
  );
  ordemData=replaceOnce(
    ordemData,
    " pericias:skills(), ataques:[], habilidades:[], poderesParanormais:[], rituais:[], inventario:[], resistencias:'', proficiencias:'', afinidade:'', notas:''",
    " gestao:{limiteItens:'',limiteCredito:'',cargaMax:'',prestigio:''}, dtRituais:{1:'',2:'',3:'',4:''}, evolucao:[], protecao:'',\n pericias:skills(), ataques:[], habilidades:[], poderesParanormais:[], rituais:[], inventario:[], resistencias:'', proficiencias:'', afinidade:'', notas:''",
    'gestão Sobrevivendo ao Horror'
  );
  ordemData=replaceOnce(
    ordemData,
    " s.status={...initialOrdemPcData.status,...(s.status||{})};",
    " s.status={...initialOrdemPcData.status,...(s.status||{})}; s.status.recursoMental=s.status.recursoMental==='pd'?'pd':'sanidade';",
    'normalização SAN/PD'
  );
  ordemData=replaceOnce(
    ordemData,
    " s.pericias={...skills(),...(s.pericias||{})};",
    " s.gestao={...initialOrdemPcData.gestao,...(s.gestao||{})}; s.dtRituais={...initialOrdemPcData.dtRituais,...(s.dtRituais||{})}; s.evolucao=list(s.evolucao).map(x=>({nivelNex:'',limitePePd:'',patente:'',nota:'',...(x||{})})); s.protecao=String(s.protecao||'');\n s.pericias={...skills(),...(s.pericias||{})};",
    'normalização extras SaH'
  );
  ordemData=ordemData.replace("map(x=>({nome:'',tipo:'Poder',custo:'',desc:'',...(x||{})}))","map(x=>({nome:'',tipo:'Poder',custo:'',pagina:'',desc:'',...(x||{})}))");
  ordemData=ordemData.replace("map(x=>({nome:'',elemento:'',requisito:'',custo:'',desc:'',...(x||{})}))","map(x=>({nome:'',elemento:'',requisito:'',custo:'',pagina:'',desc:'',...(x||{})}))");
  ordemData=ordemData.replace("map(x=>({nome:'',circulo:1,elemento:'',execucao:'',alcance:'',duracao:'',resistencia:'',desc:'',...(x||{})}))","map(x=>({nome:'',circulo:1,elemento:'',execucao:'',alcance:'',duracao:'',resistencia:'',custo:'',pagina:'',desc:'',...(x||{})}))");
  ordemData=`/* PJ LITE 0.8.3 ORDEM SAH COMPLETE */\n${ordemData}`;
  await writeFile(ordemDataPath,ordemData,'utf8');
}

let ordem=await readFile(ordemEditorPath,'utf8');
if(!ordem.includes('PJ LITE 0.8.3 ORDEM SAH COMPLETE UI')){
  ordem=replaceOnce(
    ordem,
    "const tabs=[['agente','Agente'],['pericias','Perícias'],['combate','Combate'],['poderes','Poderes & Habilidades'],['rituais','Rituais'],['inventario','Inventário']];",
    "const tabs=[['agente','Agente'],['pericias','Perícias'],['combate','Combate'],['poderes','Poderes & Habilidades'],['rituais','Rituais'],['inventario','Inventário'],['evolucao','Evolução']];",
    'aba Evolução Ordem'
  );
  ordem=replaceOnce(
    ordem,
    " const b=data.bio||{},a=data.atributos||{},s=data.status||{};",
    " const b=data.bio||{},a=data.atributos||{},s=data.status||{};\n const mentalMode=s.recursoMental==='pd'?'pd':'sanidade'; const baseDefesa=10+num(a.agi);",
    'modo mental Ordem'
  );
  ordem=ordem.replace("<label><span>Idade</span><input value={b.idade||''} onChange={e=>updateField('bio.idade',e.target.value)}/></label>","<label><span>Idade</span><input value={b.idade||''} onChange={e=>updateField('bio.idade',e.target.value)}/></label><label><span>Profissão / especialidade</span><input value={b.profissao||''} onChange={e=>updateField('bio.profissao',e.target.value)}/></label>");

  ordem=replaceOnce(
    ordem,
    `<section className="ordem-panel"><div className="ordem-meters">{meter('vida','VIDA','pvAtual','pvMax')}{meter('sanidade','SANIDADE','sanAtual','sanMax')}{meter('esforco','ESFORÇO','peAtual','peMax')}</div>`,
    `<section className="ordem-panel"><div className="ordem-mental-switch"><div><strong>Recurso mental</strong><small>Sobrevivendo ao Horror permite jogar sem Sanidade.</small></div><select value={mentalMode} onChange={e=>updateField('status.recursoMental',e.target.value)}><option value="sanidade">Sanidade (SAN)</option><option value="pd">Determinação (PD) — sem Sanidade</option></select></div><div className="ordem-meters">{meter('vida','VIDA','pvAtual','pvMax')}{mentalMode==='pd'?meter('determinacao','DETERMINAÇÃO','pdAtual','pdMax'):meter('sanidade','SANIDADE','sanAtual','sanMax')}{meter('esforco','ESFORÇO','peAtual','peMax')}</div>`,
    'seletor SAN/PD'
  );
  ordem=ordem.replace(
    `<label><span>Afinidade</span><input value={data.afinidade||''} onChange={e=>updateField('afinidade',e.target.value)}/></label>`,
    `<label><span>Afinidade</span><input value={data.afinidade||''} onChange={e=>updateField('afinidade',e.target.value)}/></label><label><span>Base Defesa</span><input value={baseDefesa} readOnly/></label><label><span>Equip. Defesa</span><input type="number" value={s.defesaEquip??0} onChange={e=>updateField('status.defesaEquip',num(e.target.value))}/></label><label><span>Outros Defesa</span><input type="number" value={s.defesaOutros??0} onChange={e=>updateField('status.defesaOutros',num(e.target.value))}/></label><label><span>Limite PE / PD</span><input value={s.limitePePd||''} onChange={e=>updateField('status.limitePePd',e.target.value)}/></label>`
  );

  ordem=ordem.replace(
    `<div className="ordem-skill-head"><span>Perícia</span><span>Attr.</span><span>Treino</span><span>Outros</span></div>`,
    `<div className="ordem-skill-head"><span>Perícia</span><span>Attr.</span><span>Dados</span><span>Treino</span><span>Outros</span></div>`
  );
  ordem=ordem.replace(
    `<span className="ordem-skill-attr">{attr.toUpperCase()}</span><select value={x.grau??0}`,
    `<span className="ordem-skill-attr">{attr.toUpperCase()}</span><strong className="ordem-skill-dice">{a[attr]??1}d20</strong><select value={x.grau??0}`
  );

  ordem=replaceOnce(
    ordem,
    `<div className="grid md:grid-cols-2 gap-3"><label><span>Resistências / proteção</span><textarea rows="4" value={data.resistencias||''} onChange={e=>updateField('resistencias',e.target.value)}/></label><label><span>Proficiências</span><textarea rows="4" value={data.proficiencias||''} onChange={e=>updateField('proficiencias',e.target.value)} placeholder="Armas simples, táticas, proteções..."/></label></div>`,
    `<div className="grid md:grid-cols-3 gap-3"><label><span>Resistências</span><textarea rows="4" value={data.resistencias||''} onChange={e=>updateField('resistencias',e.target.value)}/></label><label><span>Proteção</span><textarea rows="4" value={data.protecao||''} onChange={e=>updateField('protecao',e.target.value)} placeholder="Proteções, RD e efeitos"/></label><label><span>Proficiências</span><textarea rows="4" value={data.proficiencias||''} onChange={e=>updateField('proficiencias',e.target.value)} placeholder="Armas simples, táticas, proteções..."/></label></div>`,
    'resistências/proteção Ordem'
  );

  ordem=ordem.replace("add('habilidades',{nome:'',tipo:'Poder',custo:'',desc:''})","add('habilidades',{nome:'',tipo:'Poder',custo:'',pagina:'',desc:''})");
  ordem=ordem.replace(
    `<div className="grid grid-cols-2 gap-2"><input value={x.tipo||''} onChange={e=>patch('habilidades',i,'tipo',e.target.value)} placeholder="Tipo / origem"/><input value={x.custo||''} onChange={e=>patch('habilidades',i,'custo',e.target.value)} placeholder="Custo"/></div>`,
    `<div className="grid grid-cols-3 gap-2"><input value={x.tipo||''} onChange={e=>patch('habilidades',i,'tipo',e.target.value)} placeholder="Categoria / origem"/><input value={x.custo||''} onChange={e=>patch('habilidades',i,'custo',e.target.value)} placeholder="Custo"/><input value={x.pagina||''} onChange={e=>patch('habilidades',i,'pagina',e.target.value)} placeholder="Página"/></div>`
  );
  ordem=ordem.replace("add('poderesParanormais',{nome:'',elemento:'',requisito:'',custo:'',desc:''})","add('poderesParanormais',{nome:'',elemento:'',requisito:'',custo:'',pagina:'',desc:''})");
  ordem=ordem.replace(
    `<input className="col-span-2" value={x.requisito||''} onChange={e=>patch('poderesParanormais',i,'requisito',e.target.value)} placeholder="Pré-requisito / afinidade"/>`,
    `<input value={x.requisito||''} onChange={e=>patch('poderesParanormais',i,'requisito',e.target.value)} placeholder="Pré-requisito / afinidade"/><input value={x.pagina||''} onChange={e=>patch('poderesParanormais',i,'pagina',e.target.value)} placeholder="Página"/>`
  );
  ordem=ordem.replace("add('rituais',{nome:'',circulo:1,elemento:'',execucao:'',alcance:'',duracao:'',resistencia:'',desc:''})","add('rituais',{nome:'',circulo:1,elemento:'',execucao:'',alcance:'',duracao:'',resistencia:'',custo:'',pagina:'',desc:''})");
  ordem=ordem.replace(
    `<input value={x.resistencia||''} onChange={e=>patch('rituais',i,'resistencia',e.target.value)} placeholder="Resistência"/>`,
    `<input value={x.resistencia||''} onChange={e=>patch('rituais',i,'resistencia',e.target.value)} placeholder="Resistência"/><input value={x.custo||''} onChange={e=>patch('rituais',i,'custo',e.target.value)} placeholder="Custo"/><input value={x.pagina||''} onChange={e=>patch('rituais',i,'pagina',e.target.value)} placeholder="Página"/>`
  );

  ordem=replaceOnce(
    ordem,
    `  {tab==='rituais'&&<div className="space-y-3">`,
    `  {tab==='rituais'&&<div className="space-y-3"><section className="ordem-panel ordem-dt-panel"><div className="ordem-panel-title"><span>DT DE RITUAIS</span><small>por círculo</small></div><div className="ordem-dt-grid">{[1,2,3,4].map(c=><label key={c}><span>{c}º Círculo</span><input value={data.dtRituais?.[c]??''} onChange={e=>updateField(\`dtRituais.\${c}\`,e.target.value)}/></label>)}</div></section>`,
    'DT de rituais'
  );

  ordem=replaceOnce(
    ordem,
    `  {tab==='inventario'&&<div className="space-y-3">`,
    `  {tab==='inventario'&&<div className="space-y-3"><section className="ordem-panel ordem-gear-limits"><div className="ordem-panel-title"><span>LIMITES & RECURSOS</span><small>Sobrevivendo ao Horror</small></div><div className="ordem-derived"><label><span>Limite de Itens</span><input value={data.gestao?.limiteItens??''} onChange={e=>updateField('gestao.limiteItens',e.target.value)}/></label><label><span>Limite de Crédito</span><input value={data.gestao?.limiteCredito??''} onChange={e=>updateField('gestao.limiteCredito',e.target.value)}/></label><label><span>Carga Máx.</span><input value={data.gestao?.cargaMax??''} onChange={e=>updateField('gestao.cargaMax',e.target.value)}/></label><label><span>Prestígio</span><input value={data.gestao?.prestigio??''} onChange={e=>updateField('gestao.prestigio',e.target.value)}/></label></div></section>`,
    'limites inventário SaH'
  );

  const end='\n </div>;\n}';
  const evolution=`\n  {tab==='evolucao'&&<div className="space-y-3"><section className="ordem-panel"><div className="ordem-panel-title"><span>EVOLUÇÃO DO PERSONAGEM</span><small>NEX, patente e limite de PE / PD</small></div><div className="ordem-derived"><label><span>NEX Atual</span><input value={b.nex??5} readOnly/></label><label><span>Patente Atual</span><input value={b.patente||''} readOnly/></label><label><span>Limite PE / PD</span><input value={s.limitePePd||''} onChange={e=>updateField('status.limitePePd',e.target.value)}/></label><label><span>Prestígio</span><input value={data.gestao?.prestigio??''} onChange={e=>updateField('gestao.prestigio',e.target.value)}/></label></div></section><section className="ordem-panel"><div className="ordem-panel-actions"><div className="ordem-panel-title"><span>HISTÓRICO DE EVOLUÇÃO</span><small>registre marcos importantes</small></div><button className="ordem-add" onClick={()=>add('evolucao',{nivelNex:'',limitePePd:'',patente:'',nota:''})}>+ Marco</button></div><div className="space-y-2">{(data.evolucao||[]).map((x,i)=><div className="ordem-entry" key={i}><div className="ordem-evolution-grid"><input value={x.nivelNex||''} onChange={e=>patch('evolucao',i,'nivelNex',e.target.value)} placeholder="Nível / NEX"/><input value={x.limitePePd||''} onChange={e=>patch('evolucao',i,'limitePePd',e.target.value)} placeholder="Limite PE / PD"/><input value={x.patente||''} onChange={e=>patch('evolucao',i,'patente',e.target.value)} placeholder="Patente"/><button onClick={()=>rm('evolucao',i)}>×</button></div><textarea rows="2" value={x.nota||''} onChange={e=>patch('evolucao',i,'nota',e.target.value)} placeholder="Observação / marco"/></div>)}</div></section></div>}\n`;
  if(!ordem.includes(end)) throw new Error('Completude 0.8.3: fim do editor Ordem não localizado.');
  ordem=ordem.replace(end,evolution+end);
  ordem=`/* PJ LITE 0.8.3 ORDEM SAH COMPLETE UI */\n${ordem}`;
  await writeFile(ordemEditorPath,ordem,'utf8');
}

let ordemChat=await readFile(ordemChatPath,'utf8');
if(!ordemChat.includes('RECURSO MENTAL SAH')){
  ordemChat=replaceOnce(
    ordemChat,
    " o+=`\\n⚙ STATUS\\n❤️ PV ${s.pvAtual??0}/${s.pvMax??0} | ⚡ PE ${s.peAtual??0}/${s.peMax??0} | 🧠 SAN ${s.sanAtual??0}/${s.sanMax??0} | Defesa ${s.defesa??10}\\n`;",
    " const mental=s.recursoMental==='pd'?`🎯 PD ${s.pdAtual??0}/${s.pdMax??0}`:`🧠 SAN ${s.sanAtual??0}/${s.sanMax??0}`; /* RECURSO MENTAL SAH */\n o+=`\\n⚙ STATUS\\n❤️ PV ${s.pvAtual??0}/${s.pvMax??0} | ⚡ PE ${s.peAtual??0}/${s.peMax??0} | ${mental} | Defesa ${s.defesa??10}\\n`;",
    'Ficha Chat SAN/PD'
  );
  await writeFile(ordemChatPath,ordemChat,'utf8');
}

let ordemCss=await readFile(ordemCssPath,'utf8');
if(!ordemCss.includes('PJ LITE 0.8.3 ORDEM THEME STABLE')){
  ordemCss+=`\n/* PJ LITE 0.8.3 ORDEM THEME STABLE */\nbody.theme-ordem{background:#070707!important;color:#eee}.theme-ordem .ordem-sheet,body.theme-ordem .ordem-sheet{background:#0c0c0e!important;color:#f0eeee!important;border:1px solid #3a2729!important;box-shadow:0 14px 34px rgba(0,0,0,.45)}.theme-ordem .ordem-hero,body.theme-ordem .ordem-hero{background:#101012!important;border-color:#64262b!important;border-bottom-color:#9d3038!important}.theme-ordem .ordem-panel,.theme-ordem .ordem-card,body.theme-ordem .ordem-panel,body.theme-ordem .ordem-card{background:#141416!important;border-color:#343238!important;color:#f0eeee!important}.theme-ordem .ordem-entry,body.theme-ordem .ordem-entry{background:#101012!important;border-color:#38343a!important}.theme-ordem .ordem-panel input,.theme-ordem .ordem-panel select,.theme-ordem .ordem-panel textarea,.theme-ordem .ordem-entry input,.theme-ordem .ordem-entry select,.theme-ordem .ordem-entry textarea{background:#0a0a0c!important;color:#f5f3f3!important;border-color:#454149!important}.theme-ordem .ordem-tabs button{background:#1b1a1d!important;color:#d6d0d1!important;border-color:#3b383e!important}.theme-ordem .ordem-tabs button.active{background:#7e252c!important;color:#fff!important;border-color:#a33a43!important}.ordem-meter--determinacao:before{background:#2c7d72}.ordem-mental-switch{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:9px;padding:8px 9px;background:#0d0d0f;border:1px solid #302e33;border-radius:5px}.ordem-mental-switch strong{display:block;font-size:10px;letter-spacing:.05em}.ordem-mental-switch small{display:block;font-size:8px;color:#89848a;margin-top:2px}.ordem-mental-switch select{max-width:240px}.ordem-dt-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.ordem-dt-grid input{text-align:center}.ordem-skill-head,.ordem-skill{grid-template-columns:minmax(120px,1fr) 44px 52px 76px 56px}.ordem-skill-dice{font-size:9px;color:#d2c6d7;text-align:center}.ordem-evolution-grid{display:grid;grid-template-columns:1fr 1fr 1fr 34px;gap:6px}.ordem-gear-limits{border-left:3px solid #8c292f}.ordem-dt-panel{border-left:3px solid #69408a}@media(max-width:640px){.ordem-mental-switch{align-items:stretch;flex-direction:column}.ordem-mental-switch select{max-width:none}.ordem-dt-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ordem-skill-head,.ordem-skill{grid-template-columns:minmax(0,1fr) 34px 45px 64px 45px}.ordem-evolution-grid{grid-template-columns:1fr 1fr}.ordem-evolution-grid button{grid-column:2}.theme-ordem .ordem-sheet{border-left:0!important;border-right:0!important}}\n`;
  await writeFile(ordemCssPath,ordemCss,'utf8');
}

// Guia/log: manter a 0.8.3, mas registrar a revisão de completude.
let app=await readFile(appPath,'utf8');
if(!app.includes('PJ LITE 0.8.3 COMPLETUDE SAH')){
  app=app.replace(
    "{ versao: '0.8.3v Alpha', descricao:",
    "{ versao: '0.8.3v Alpha', descricao:"
  );
  app=app.replace(
    'Esta integração usa a edição clássica v1.3, não o playtest de Ordem Paranormal RPG 2.',
    'Esta integração usa a edição clássica v1.3 com a ficha de Sobrevivendo ao Horror como referência. Você pode usar SAN ou PD (Determinação) para mesas que jogam sem Sanidade.'
  );
  app=app.replace(
    '<strong>2. Atributos e recursos</strong><p>Acompanhe AGI, FOR, INT, PRE, VIG e PV/PE/SAN.</p>',
    '<strong>2. Atributos e recursos</strong><p>Acompanhe AGI, FOR, INT, PRE, VIG, PV e PE. Em Recurso mental escolha SAN ou PD (Determinação) para a regra Jogando sem Sanidade.</p>'
  );
  app=app.replace(
    '<strong>6. Inventário</strong><p>Organize categoria, espaços, quantidade e observações dos itens.</p>',
    '<strong>6. Inventário & evolução</strong><p>Organize categoria, espaços e quantidade, além de Limite de Itens, Crédito, Carga, Prestígio, DT de Rituais e histórico de evolução.</p>'
  );
  app=`/* PJ LITE 0.8.3 COMPLETUDE SAH */\n${app}`;
  await writeFile(appPath,app,'utf8');
}

console.log('✓ 0.8.3: Skyfall e Ordem completos; SAN/PD, ficha SaH, proteções e temas estabilizados.');
