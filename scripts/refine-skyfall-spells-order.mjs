import { readFile, writeFile } from 'node:fs/promises';

const skyPath = 'src/systems/skyfall/components/CharacterEditor.jsx';
const skyCssPath = 'src/systems/skyfall/skyfall-theme.css';
const ordemPath = 'src/systems/ordemParanormal/components/CharacterEditor.jsx';
const ordemCssPath = 'src/systems/ordemParanormal/ordem-theme.css';

const replaceOnce = (text, from, to, label) => {
  if (!text.includes(from)) throw new Error(`Refino final: marcador não encontrado (${label}).`);
  return text.replace(from, to);
};

let sky = await readFile(skyPath, 'utf8');
if (!sky.includes('PJ LITE SKYFALL SPELL ORDER V1')) {
  const moveAnchor = " const move=(field,i,dir)=>{const arr=[...(data[field]||[])];const j=i+dir;if(j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];updateField(field,arr);};";
  sky = replaceOnce(sky, moveAnchor, `${moveAnchor}\n /* PJ LITE SKYFALL SPELL ORDER V1 */\n const moveMagic=(index,dir)=>{const spells=[...(data.magias||[])];const layer=spells[index]?.camada||'Truque';const indices=spells.map((m,i)=>({m,i})).filter(({m})=>(m.camada||'Truque')===layer).map(({i})=>i);const pos=indices.indexOf(index);const target=pos+dir;if(pos<0||target<0||target>=indices.length)return;const targetIndex=indices[target];[spells[index],spells[targetIndex]]=[spells[targetIndex],spells[index]];updateField('magias',spells);};\n const sortMagicLayer=(layer)=>{const spells=[...(data.magias||[])];const indices=spells.map((m,i)=>({m,i})).filter(({m})=>(m.camada||'Truque')===layer).map(({i})=>i);if(indices.length<2)return;const ordered=indices.map(i=>spells[i]).sort((x,y)=>String(x?.nome||'').localeCompare(String(y?.nome||''),'pt-BR',{sensitivity:'base'}));indices.forEach((idx,pos)=>{spells[idx]=ordered[pos];});updateField('magias',spells);};`, 'helpers Skyfall');

  // Atributos devem permanecer na aba Perícias, imediatamente acima da lista de perícias.
  // A versão antiga deste script removia esse bloco e o recolocava acima das abas,
  // desfazendo a organização solicitada no editor fonte durante cada build.
  const desiredAttributesLocation = `{tab==='pericias'&&<div className="space-y-4">\n   <section className="skyfall-card"><h3>Atributos</h3>`;
  if (!sky.includes(desiredAttributesLocation)) {
    throw new Error('Refino final: atributos do Skyfall não estão acima das perícias na aba Perícias.');
  }

  const magicStart = sky.indexOf(`   {SKYFALL_MAGIC_LAYERS.map(layer=>`);
  const magicEndAnchor = `   <section className="skyfall-card"><label><span>Observações de Conjuração</span>`;
  const magicEnd = sky.indexOf(magicEndAnchor, magicStart);
  if (magicStart < 0 || magicEnd < 0) throw new Error('Refino final: bloco de magias Skyfall não localizado.');
  const magicBlock = `   {SKYFALL_MAGIC_LAYERS.map(layer=>{const layerItems=magiasPorCamada[layer];return <section className="skyfall-card skyfall-magic-section" key={layer}><div className="skyfall-section-head"><div><h3>{layer==='Truque'?'Truques Mágicos':\`Camada \${layer}\`}</h3><p className="skyfall-help">{layerItems.length} magia{layerItems.length===1?'':'s'} registrada{layerItems.length===1?'':'s'}. Organize como no grimório de D&D: ordem manual ou A–Z.</p></div><div className="skyfall-magic-actions"><button type="button" className="skyfall-sort-alpha" disabled={layerItems.length<2} onClick={()=>sortMagicLayer(layer)}>A–Z</button><button type="button" className="skyfall-add" onClick={()=>add('magias',{nome:'',camada:layer,custo:'',execucao:'',alcance:'',duracao:'',descritores:'',desc:''})}>+ Magia</button></div></div><div className="grid md:grid-cols-2 gap-2">{layerItems.map(({m,i},position)=><div key={i} className="skyfall-entry skyfall-spell"><div className="skyfall-spell-head"><input className="font-bold" value={m.nome||''} onChange={e=>patch('magias',i,'nome',e.target.value)} placeholder="Nome da magia"/><div className="skyfall-spell-order"><button type="button" disabled={position<=0} onClick={()=>moveMagic(i,-1)} title="Mover para cima">↑</button><button type="button" disabled={position>=layerItems.length-1} onClick={()=>moveMagic(i,1)} title="Mover para baixo">↓</button><button type="button" className="danger" onClick={()=>remove('magias',i)} title="Remover magia">×</button></div></div><div className="grid grid-cols-2 gap-2"><select value={m.camada||layer} onChange={e=>patch('magias',i,'camada',e.target.value)}>{SKYFALL_MAGIC_LAYERS.map(x=><option key={x}>{x}</option>)}</select><input value={m.custo||''} onChange={e=>patch('magias',i,'custo',e.target.value)} placeholder="Custo / PE"/><input value={m.execucao||''} onChange={e=>patch('magias',i,'execucao',e.target.value)} placeholder="Execução"/><input value={m.alcance||''} onChange={e=>patch('magias',i,'alcance',e.target.value)} placeholder="Alcance"/><input value={m.duracao||''} onChange={e=>patch('magias',i,'duracao',e.target.value)} placeholder="Duração"/><input value={m.descritores||''} onChange={e=>patch('magias',i,'descritores',e.target.value)} placeholder="Descritores"/></div><textarea rows="3" value={m.desc||''} onChange={e=>patch('magias',i,'desc',e.target.value)} placeholder="Efeito / lembrete"/></div>)}</div></section>})}\n`;
  sky = sky.slice(0, magicStart) + magicBlock + sky.slice(magicEnd);
  await writeFile(skyPath, sky, 'utf8');
}

let skyCss = await readFile(skyCssPath, 'utf8');
if (!skyCss.includes('.skyfall-attributes-top')) {
  skyCss += `\n/* PJ LITE SKYFALL SPELL ORDER V1 */\n.skyfall-attributes-top{margin-top:10px;padding:10px 12px}.skyfall-attributes-top h3{font-size:13px;margin-bottom:7px}.skyfall-magic-actions{display:flex;gap:5px;align-items:center;flex:0 0 auto}.skyfall-sort-alpha{border:1px solid #bdaac7;background:#f3edf6;color:#4d305f;border-radius:5px;padding:6px 8px;font-size:9px;font-weight:900}.skyfall-sort-alpha:disabled{opacity:.35}.skyfall-spell-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;align-items:center}.skyfall-spell-order{display:flex;gap:4px}.skyfall-spell-order button{border:0;background:#eee1e2;color:#7f3340;border-radius:5px;padding:5px 7px;font-weight:900;min-width:30px}.skyfall-spell-order button:disabled{opacity:.3}.skyfall-spell-order .danger{background:#f3d6d8;color:#8a1f2b}@media(max-width:640px){.skyfall-attributes-top{margin-top:7px;padding:8px}.skyfall-attributes-top .skyfall-attr em{display:none}.skyfall-magic-actions{width:100%;justify-content:flex-end}.skyfall-section-head{flex-wrap:wrap}.skyfall-spell-head{grid-template-columns:1fr}.skyfall-spell-order{justify-content:flex-end}}\n`;
  await writeFile(skyCssPath, skyCss, 'utf8');
}

let ordem = await readFile(ordemPath, 'utf8');
if (!ordem.includes('PJ LITE ORDEM RITUAL ORDER V1')) {
  const helperAnchor = " const add=(f,o)=>updateField(f,[...(data[f]||[]),o]); const rm=(f,i)=>updateField(f,(data[f]||[]).filter((_,x)=>x!==i));";
  ordem = replaceOnce(ordem, helperAnchor, `${helperAnchor}\n /* PJ LITE ORDEM RITUAL ORDER V1 */\n const move=(f,i,dir)=>{const arr=[...(data[f]||[])];const j=i+dir;if(j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];updateField(f,arr);};\n const sortByName=(f)=>{const arr=[...(data[f]||[])];arr.sort((x,y)=>String(x?.nome||'').localeCompare(String(y?.nome||''),'pt-BR',{sensitivity:'base'}));updateField(f,arr);};`, 'helpers Ordem');

  const ritualStart = ordem.indexOf(`<section className="ordem-panel"><div className="ordem-panel-actions"><div className="ordem-panel-title"><span>RITUAIS</span>`);
  const ritualTail = `</section></div>}\n\n  {tab==='inventario'`;
  const ritualTailPos = ordem.indexOf(ritualTail, ritualStart);
  if (ritualStart < 0 || ritualTailPos < 0) throw new Error('Refino final: bloco de rituais de Ordem não localizado.');
  const ritualEnd = ritualTailPos + `</section>`.length;
  const ritualBlock = `<section className="ordem-panel"><div className="ordem-panel-actions"><div className="ordem-panel-title"><span>RITUAIS</span><small>círculo, elemento e execução</small></div><div className="ordem-order-actions"><button type="button" className="ordem-sort-alpha" disabled={(data.rituais||[]).length<2} onClick={()=>sortByName('rituais')}>A–Z</button><button type="button" className="ordem-add" onClick={()=>add('rituais',{nome:'',circulo:1,elemento:'',execucao:'',alcance:'',duracao:'',resistencia:'',desc:''})}>+ Ritual</button></div></div><div className="ordem-card-grid">{(data.rituais||[]).map((x,i)=><div className="ordem-entry" key={i}><div className="ordem-ritual-head"><input className="font-bold" value={x.nome||''} onChange={e=>patch('rituais',i,'nome',e.target.value)} placeholder="Nome"/><div className="ordem-order"><button type="button" disabled={i===0} onClick={()=>move('rituais',i,-1)} title="Mover para cima">↑</button><button type="button" disabled={i===(data.rituais||[]).length-1} onClick={()=>move('rituais',i,1)} title="Mover para baixo">↓</button><button type="button" className="danger" onClick={()=>rm('rituais',i)} title="Remover ritual">×</button></div></div><div className="ordem-ritual-grid"><label><span>Círculo</span><input type="number" min="1" value={x.circulo??1} onChange={e=>patch('rituais',i,'circulo',num(e.target.value))}/></label><input value={x.elemento||''} onChange={e=>patch('rituais',i,'elemento',e.target.value)} placeholder="Elemento"/><input value={x.execucao||''} onChange={e=>patch('rituais',i,'execucao',e.target.value)} placeholder="Execução"/><input value={x.alcance||''} onChange={e=>patch('rituais',i,'alcance',e.target.value)} placeholder="Alcance"/><input value={x.duracao||''} onChange={e=>patch('rituais',i,'duracao',e.target.value)} placeholder="Duração"/><input value={x.resistencia||''} onChange={e=>patch('rituais',i,'resistencia',e.target.value)} placeholder="Resistência"/></div><textarea rows="3" value={x.desc||''} onChange={e=>patch('rituais',i,'desc',e.target.value)} placeholder="Efeito / lembrete"/></div>)}</div></section>`;
  ordem = ordem.slice(0, ritualStart) + ritualBlock + ordem.slice(ritualEnd);
  await writeFile(ordemPath, ordem, 'utf8');
}

let ordemCss = await readFile(ordemCssPath, 'utf8');
if (!ordemCss.includes('.ordem-order-actions')) {
  ordemCss += `\n/* PJ LITE ORDEM RITUAL ORDER V1 */\n.ordem-order-actions{display:flex;gap:5px;align-items:center}.ordem-sort-alpha{background:#1c1c20;color:#ddd;border:1px solid #3c3c42;border-radius:4px;padding:6px 8px;font-size:9px;font-weight:900}.ordem-sort-alpha:disabled{opacity:.35}.ordem-ritual-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;align-items:center}.ordem-order{display:flex;gap:4px}.ordem-order button{background:#2a2022;color:#f0c3c5;border:1px solid #4c2b2e;border-radius:3px;padding:5px 7px;font-weight:900;min-width:30px}.ordem-order button:disabled{opacity:.3}.ordem-order .danger{background:#491a1e;color:#ffc2c6}@media(max-width:640px){.ordem-order-actions{width:100%;justify-content:flex-end}.ordem-panel-actions{flex-wrap:wrap}.ordem-ritual-head{grid-template-columns:1fr}.ordem-order{justify-content:flex-end}}\n`;
  await writeFile(ordemCssPath, ordemCss, 'utf8');
}

console.log('✓ Atributos Skyfall preservados na aba Perícias; magias e rituais com ordenação manual/A–Z.');
