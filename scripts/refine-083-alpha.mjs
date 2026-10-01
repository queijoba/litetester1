import { readFile, writeFile } from 'node:fs/promises';

const skyPath='src/systems/skyfall/components/CharacterEditor.jsx';
const skyCssPath='src/systems/skyfall/skyfall-theme.css';
const ordemPath='src/systems/ordemParanormal/components/CharacterEditor.jsx';
const ordemDataPath='src/systems/ordemParanormal/data.js';
const ordemCssPath='src/systems/ordemParanormal/ordem-theme.css';
const ordemChatPath='src/systems/ordemParanormal/chat.js';
const appPath='src/PJLiteApp.jsx';

const replaceOnce=(text,from,to,label)=>{if(!text.includes(from))throw new Error(`0.8.3: marcador não encontrado (${label}).`);return text.replace(from,to);};

// SKYFALL — atributos abaixo do retrato na aba Identidade.
let sky=await readFile(skyPath,'utf8');
if(!sky.includes('PJ LITE 0.8.3 SKYFALL PROFILE ATTRS')){
  const topStart=sky.indexOf('  <section className="skyfall-card skyfall-attributes-top">');
  const tabsStart=sky.indexOf('  <div className="skyfall-tabs">',topStart);
  if(topStart<0||tabsStart<0)throw new Error('0.8.3: atributos globais do Skyfall não encontrados.');
  sky=sky.slice(0,topStart)+sky.slice(tabsStart);

  const photo=`<div className="skyfall-photo">{b.imagem?<img src={b.imagem} alt="Retrato"/>:<div className="skyfall-photo-empty">☄️</div>}<label>Escolher imagem<input type="file" accept="image/*" className="hidden" onChange={photo}/></label>{b.imagem&&<button onClick={()=>updateField('bio.imagem','')}>Remover</button>}</div>`;
  const attrs=`<div className="skyfall-profile-aside">${photo}<section className="skyfall-profile-attributes"><div className="skyfall-profile-attributes-title">Atributos</div><div className="skyfall-attributes">{SKYFALL_ATTRIBUTES.map(([k,abbr,n])=><label key={k} className="skyfall-attr"><span>{abbr}</span><input type="number" value={a[k]??10} onChange={e=>updateField(\`atributos.\${k}\`,num(e.target.value))}/><small>{mod(a[k])}</small><em>{n}</em></label>)}</div></section></div>`;
  sky=replaceOnce(sky,photo,attrs,'retrato + atributos Skyfall');
  sky=`/* PJ LITE 0.8.3 SKYFALL PROFILE ATTRS */\n${sky}`;
  await writeFile(skyPath,sky,'utf8');
}

let skyCss=await readFile(skyCssPath,'utf8');
if(!skyCss.includes('PJ LITE 0.8.3 SKYFALL THEME')){
  skyCss+=`\n/* PJ LITE 0.8.3 SKYFALL THEME */\nbody.theme-skyfall{background:radial-gradient(circle at 20% 0%,#5a3d70 0,transparent 32%),radial-gradient(circle at 100% 30%,#2b4a68 0,transparent 28%),#17111f;background-attachment:fixed}.skyfall-sheet{background:linear-gradient(180deg,rgba(250,247,238,.98),rgba(235,229,216,.98));border-left:2px solid #6d4480;border-right:2px solid #6d4480}.skyfall-hero{box-shadow:0 7px 22px rgba(30,16,42,.22)}.skyfall-card{border-color:#cbbbd1;box-shadow:0 4px 14px rgba(55,34,69,.07)}.skyfall-tabs button.active{box-shadow:0 2px 8px rgba(59,35,77,.22)}.skyfall-profile-aside{display:flex;flex-direction:column;gap:9px}.skyfall-profile-attributes{background:linear-gradient(180deg,#f4ead6,#eee1c8);border:1px solid #c9ac74;border-radius:8px;padding:7px}.skyfall-profile-attributes-title{text-align:center;text-transform:uppercase;letter-spacing:.08em;font-size:9px;font-weight:900;color:#58386b;margin-bottom:6px}.skyfall-profile-attributes .skyfall-attributes{grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.skyfall-profile-attributes .skyfall-attr{padding:4px 3px}.skyfall-profile-attributes .skyfall-attr input{font-size:15px!important}.skyfall-profile-attributes .skyfall-attr em{font-size:7px}.skyfall-magic-section{background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(247,241,251,.96))}body.theme-dark .skyfall-profile-attributes{background:#2b2430;border-color:#725b7d}body.theme-dark .skyfall-profile-attributes-title{color:#d8c1e4}@media(max-width:760px){.skyfall-profile-aside{max-width:280px;margin:0 auto;width:100%}.skyfall-profile-attributes .skyfall-attributes{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:430px){.skyfall-profile-attributes .skyfall-attr em{display:none}.skyfall-profile-attributes .skyfall-attr span{font-size:10px!important}}\n`;
  await writeFile(skyCssPath,skyCss,'utf8');
}

// ORDEM — Rituais em aba própria + Poderes Paranormais separados e ordenáveis.
let ordem=await readFile(ordemPath,'utf8');
if(!ordem.includes('PJ LITE 0.8.3 ORDEM POWERS')){
  ordem=replaceOnce(ordem,"const tabs=[['agente','Agente'],['pericias','Perícias'],['combate','Combate'],['poderes','Poderes & Rituais'],['inventario','Inventário']];","const tabs=[['agente','Agente'],['pericias','Perícias'],['combate','Combate'],['poderes','Poderes & Habilidades'],['rituais','Rituais'],['inventario','Inventário']];",'abas Ordem');

  const hStart=ordem.indexOf('<section className="ordem-panel"><div className="ordem-panel-actions"><div className="ordem-panel-title"><span>HABILIDADES & PODERES</span>');
  const rStart=ordem.indexOf('<section className="ordem-panel"><div className="ordem-panel-actions"><div className="ordem-panel-title"><span>RITUAIS</span>',hStart);
  const ritualTail='</section></div>}\n\n  {tab===\'inventario\'';
  const tailPos=ordem.indexOf(ritualTail,rStart);
  if(hStart<0||rStart<0||tailPos<0)throw new Error('0.8.3: blocos de Poderes/Rituais de Ordem não localizados.');
  const rEnd=tailPos+'</section>'.length;
  let ritualBlock=ordem.slice(rStart,rEnd).replaceAll('className="ordem-entry"','className="ordem-entry ordem-ritual-entry"');

  const powersBlock=`<section className="ordem-panel"><div className="ordem-panel-actions"><div className="ordem-panel-title"><span>HABILIDADES & PODERES</span><small>origem, classe e trilha</small></div><div className="ordem-order-actions"><button type="button" className="ordem-sort-alpha" disabled={(data.habilidades||[]).length<2} onClick={()=>sortByName('habilidades')}>A–Z</button><button className="ordem-add" onClick={()=>add('habilidades',{nome:'',tipo:'Poder',custo:'',desc:''})}>+ Poder</button></div></div><div className="ordem-card-grid">{(data.habilidades||[]).map((x,i)=><div className="ordem-entry" key={i}><div className="ordem-ritual-head"><input className="font-bold" value={x.nome||''} onChange={e=>patch('habilidades',i,'nome',e.target.value)} placeholder="Nome"/><div className="ordem-order"><button type="button" disabled={i===0} onClick={()=>move('habilidades',i,-1)} title="Mover para cima">↑</button><button type="button" disabled={i===(data.habilidades||[]).length-1} onClick={()=>move('habilidades',i,1)} title="Mover para baixo">↓</button><button type="button" className="danger" onClick={()=>rm('habilidades',i)} title="Remover">×</button></div></div><div className="grid grid-cols-2 gap-2"><input value={x.tipo||''} onChange={e=>patch('habilidades',i,'tipo',e.target.value)} placeholder="Tipo / origem"/><input value={x.custo||''} onChange={e=>patch('habilidades',i,'custo',e.target.value)} placeholder="Custo"/></div><textarea rows="3" value={x.desc||''} onChange={e=>patch('habilidades',i,'desc',e.target.value)} placeholder="Descrição / lembrete"/></div>)}</div></section><section className="ordem-panel ordem-paranormal-panel"><div className="ordem-panel-actions"><div className="ordem-panel-title"><span>PODERES PARANORMAIS</span><small>elemento, requisito e custo</small></div><div className="ordem-order-actions"><button type="button" className="ordem-sort-alpha" disabled={(data.poderesParanormais||[]).length<2} onClick={()=>sortByName('poderesParanormais')}>A–Z</button><button className="ordem-add" onClick={()=>add('poderesParanormais',{nome:'',elemento:'',requisito:'',custo:'',desc:''})}>+ Poder Paranormal</button></div></div><div className="ordem-card-grid">{(data.poderesParanormais||[]).map((x,i)=><div className="ordem-entry ordem-paranormal-entry" key={i}><div className="ordem-ritual-head"><input className="font-bold" value={x.nome||''} onChange={e=>patch('poderesParanormais',i,'nome',e.target.value)} placeholder="Nome do poder"/><div className="ordem-order"><button type="button" disabled={i===0} onClick={()=>move('poderesParanormais',i,-1)} title="Mover para cima">↑</button><button type="button" disabled={i===(data.poderesParanormais||[]).length-1} onClick={()=>move('poderesParanormais',i,1)} title="Mover para baixo">↓</button><button type="button" className="danger" onClick={()=>rm('poderesParanormais',i)} title="Remover">×</button></div></div><div className="grid grid-cols-2 gap-2"><input value={x.elemento||''} onChange={e=>patch('poderesParanormais',i,'elemento',e.target.value)} placeholder="Elemento"/><input value={x.custo||''} onChange={e=>patch('poderesParanormais',i,'custo',e.target.value)} placeholder="Custo / PE"/><input className="col-span-2" value={x.requisito||''} onChange={e=>patch('poderesParanormais',i,'requisito',e.target.value)} placeholder="Pré-requisito / afinidade"/></div><textarea rows="3" value={x.desc||''} onChange={e=>patch('poderesParanormais',i,'desc',e.target.value)} placeholder="Efeito / lembrete"/></div>)}</div></section>`;

  ordem=ordem.slice(0,hStart)+powersBlock+ordem.slice(rStart,rStart)+ordem.slice(rEnd);
  const invAnchor="  {tab==='inventario'";
  const invPos=ordem.indexOf(invAnchor);
  if(invPos<0)throw new Error('0.8.3: aba Inventário de Ordem não localizada.');
  const ritualTab=`  {tab==='rituais'&&<div className="space-y-3">${ritualBlock}</div>}\n\n`;
  ordem=ordem.slice(0,invPos)+ritualTab+ordem.slice(invPos);
  ordem=`/* PJ LITE 0.8.3 ORDEM POWERS */\n${ordem}`;
  await writeFile(ordemPath,ordem,'utf8');
}

let ordemData=await readFile(ordemDataPath,'utf8');
if(!ordemData.includes('poderesParanormais:[]')){
  ordemData=replaceOnce(ordemData," pericias:skills(), ataques:[], habilidades:[], rituais:[], inventario:[], resistencias:'', afinidade:'', notas:''"," pericias:skills(), ataques:[], habilidades:[], poderesParanormais:[], rituais:[], inventario:[], resistencias:'', afinidade:'', notas:''",'campo Poderes Paranormais');
  const oldNorm=" s.habilidades=list(s.habilidades).map(x=>({nome:'',tipo:'Poder',custo:'',desc:'',...(x||{})}));\n s.rituais=list(s.rituais).map(x=>({nome:'',circulo:1,elemento:'',execucao:'',alcance:'',duracao:'',resistencia:'',desc:'',...(x||{})}));";
  const newNorm=" const habilidadesOriginais=list(s.habilidades); const migrados=habilidadesOriginais.filter(x=>/paranormal/i.test(String(x?.tipo||'')));\n s.habilidades=habilidadesOriginais.filter(x=>!/paranormal/i.test(String(x?.tipo||''))).map(x=>({nome:'',tipo:'Poder',custo:'',desc:'',...(x||{})}));\n s.poderesParanormais=[...list(s.poderesParanormais),...migrados].map(x=>({nome:'',elemento:'',requisito:'',custo:'',desc:'',...(x||{})}));\n s.rituais=list(s.rituais).map(x=>({nome:'',circulo:1,elemento:'',execucao:'',alcance:'',duracao:'',resistencia:'',desc:'',...(x||{})}));";
  ordemData=replaceOnce(ordemData,oldNorm,newNorm,'normalização Poderes Paranormais');
  await writeFile(ordemDataPath,ordemData,'utf8');
}

let ordemChat=await readFile(ordemChatPath,'utf8');
if(!ordemChat.includes('PODERES PARANORMAIS')){
  const old=" if(d.habilidades?.length||d.rituais?.length)o+=`\\n🔮 PODERES & RITUAIS\\n${[...(d.habilidades||[]),...(d.rituais||[])].map(x=>`• ${v(x.nome)}${x.desc?` — ${t(x.desc)}`:''}`).join('\\n')}\\n`;";
  const neu=" if(d.habilidades?.length)o+=`\\n✨ HABILIDADES & PODERES\\n${d.habilidades.map(x=>`• ${v(x.nome)}${x.desc?` — ${t(x.desc)}`:''}`).join('\\n')}\\n`;\n if(d.poderesParanormais?.length)o+=`\\n👁 PODERES PARANORMAIS\\n${d.poderesParanormais.map(x=>`• ${v(x.nome)}${x.elemento?` [${t(x.elemento)}]`:''}${x.desc?` — ${t(x.desc)}`:''}`).join('\\n')}\\n`;\n if(d.rituais?.length)o+=`\\n🔮 RITUAIS\\n${d.rituais.map(x=>`• ${v(x.nome)} • ${x.circulo||1}º círculo${x.desc?` — ${t(x.desc)}`:''}`).join('\\n')}\\n`;";
  ordemChat=replaceOnce(ordemChat,old,neu,'Ficha Chat Ordem');
  await writeFile(ordemChatPath,ordemChat,'utf8');
}

let ordemCss=await readFile(ordemCssPath,'utf8');
if(!ordemCss.includes('PJ LITE 0.8.3 ORDEM THEME')){
  ordemCss+=`\n/* PJ LITE 0.8.3 ORDEM THEME */\nbody.theme-ordem{background:radial-gradient(circle at 15% 0%,#3a0a0d 0,transparent 28%),radial-gradient(circle at 95% 35%,#21102d 0,transparent 24%),#050506;background-attachment:fixed}.ordem-sheet{background:linear-gradient(180deg,#09090a,#0d0b0d);border-left:2px solid #411719;border-right:2px solid #411719}.ordem-hero{box-shadow:0 7px 22px rgba(0,0,0,.45)}.ordem-panel{border-color:#34272a}.ordem-tabs button.active{box-shadow:0 0 0 1px #d05a5f,0 3px 12px rgba(136,22,27,.28)}.ordem-paranormal-panel{border-color:#4f315f;background:linear-gradient(180deg,#151018,#100d12)}.ordem-paranormal-panel .ordem-panel-title>span{color:#d8b4fe}.ordem-paranormal-entry{border-left:3px solid #8b5cf6;background:linear-gradient(135deg,#130f18,#0e0e10)}.ordem-ritual-entry{border-left:3px solid #a93238;background:linear-gradient(135deg,#160d0f,#0e0e10)}.ordem-order-actions{flex-wrap:wrap}.ordem-add{box-shadow:0 2px 8px rgba(126,31,36,.22)}@media(max-width:640px){.ordem-tabs{scroll-snap-type:x proximity}.ordem-tabs button{scroll-snap-align:start}.ordem-paranormal-panel .ordem-card-grid{grid-template-columns:1fr}}\n`;
  await writeFile(ordemCssPath,ordemCss,'utf8');
}

// APP — versão, novidades, changelog e Guias.
let app=await readFile(appPath,'utf8');
if(!app.includes('PJ LITE 0.8.3 ALPHA FINAL')){
  app=app.replace('const SCHEMA_VERSION = 6;','const SCHEMA_VERSION = 7;');
  const logAnchor='        const UPDATE_LOG = [\n';
  const logEntry="            { versao: '0.8.3v Alpha', descricao: 'Skyfall RPG e Ordem Paranormal recebem acabamento de interface e fluxo: atributos do Skyfall ficam junto ao retrato, Status & Combate são consolidados, magias ganham Camadas com ordenação manual/A–Z; Ordem separa Rituais em aba própria, adiciona Poderes Paranormais organizáveis, melhora painel inspirado em consulta rápida, temas, mobile, Guias e Tutoriais. Novidades e integração geral revisadas para a reta final da prévia.' },\n";
  if(!app.includes("versao: '0.8.3v Alpha'"))app=replaceOnce(app,logAnchor,logAnchor+logEntry,'UPDATE_LOG 0.8.3');
  app=app.replace("version: '0.8.0v Alpha'","version: '0.8.3v Alpha'");
  app=app.replace('✨ 0.7.4v Alpha — prévia pronta para homologação','✨ 0.8.3v Alpha — Skyfall + Ordem refinados');
  app=app.replace('0.7.4v • alpha','0.8.3v • alpha');
  const newsStart=app.indexOf('<div className="text-xs text-gray-700 space-y-1.5"><p>A <strong>0.7.4v Alpha</strong>');
  if(newsStart>=0){const newsEnd=app.indexOf('</div>',newsStart)+6;const news='<div className="text-xs text-gray-700 space-y-1.5"><p>A <strong>0.8.3v Alpha</strong> fecha a principal rodada de integração antes da publicação definitiva do PJ Lite.</p><p><strong>Skyfall RPG:</strong> ficha baseada no PDF oficial, atributos junto ao retrato, Status & Combate integrados e grimório por Truques/Camadas com A–Z e setas. <strong>Ordem Paranormal:</strong> painel compacto, Poderes Paranormais separados, Rituais em aba própria e organização manual.</p><p><strong>Projeto:</strong> temas Skyfall/Ordem refinados, mobile revisado, Guias e Tutoriais atualizados, Ficha Chat e migração de saves preservadas.</p></div>';app=app.slice(0,newsStart)+news+app.slice(newsEnd);}
  app=app.replace('PJ Lite 0.7.4v Alpha','PJ Lite 0.8.3v Alpha');

  const skyGuideStart=app.indexOf("                                        {guideTab === 'skyfall' && (");
  const ordemGuideStart=app.indexOf("                                        {guideTab === 'ordem' && (",skyGuideStart);
  const somGuideStart=app.indexOf("                                        {guideTab === 'som6' && (",ordemGuideStart);
  if(skyGuideStart<0||ordemGuideStart<0||somGuideStart<0)throw new Error('0.8.3: guias finais não localizados.');
  const skyGuide=`                                        {guideTab === 'skyfall' && (\n                                            <div className="space-y-5"><div className="bg-violet-950 text-white rounded p-4 border border-violet-700"><div className="text-[10px] font-bold uppercase text-violet-200">0.8.3v Alpha • Livro Básico 1.25</div><h3 className="font-title font-bold text-lg">☄️ Skyfall RPG — guia da ficha</h3><p className="text-xs mt-1">A organização acompanha a ficha editável oficial: identidade, atributos, recursos, combate, Arcanum e inventário ficam separados para consulta rápida.</p></div><div className="grid sm:grid-cols-2 gap-3 text-xs"><div className="bg-white border rounded p-3"><strong>1. Identidade & atributos</strong><p>Comece pelo retrato, Nome, Legado, Herança, Antecedente, Maldição, Classe e Trilha. Os seis atributos ficam logo abaixo da foto.</p></div><div className="bg-white border rounded p-3"><strong>2. Status & Combate</strong><p>PV, Catarse, Ênfase, Sombra, Fragmentos, Volume, Proteção, RD, iniciativa, deslocamento e ataques ficam reunidos. Use ↑ ↓ para ordenar ataques.</p></div><div className="bg-white border rounded p-3"><strong>3. Perícias</strong><p>Marque Proficiência e Ênfase e registre apenas bônus adicionais quando necessários.</p></div><div className="bg-white border rounded p-3"><strong>4. Habilidades</strong><p>Guarde nome, origem e um lembrete curto das habilidades realmente usadas pelo personagem.</p></div><div className="bg-white border rounded p-3"><strong>5. Magias</strong><p>O Arcanum é dividido em Truques, Superficial, Rasa e Profunda. Cada Camada permite A–Z e ↑ ↓, sem misturar a ordem entre Camadas.</p></div><div className="bg-white border rounded p-3"><strong>6. Inventário</strong><p>Acompanhe equipamentos, descritores, Volume, Fragmentos Arcanos, Peças, Trocados e proficiências.</p></div></div></div>\n                                        )}\n\n`;
  const ordemGuide=`                                        {guideTab === 'ordem' && (\n                                            <div className="space-y-5"><div className="bg-black text-white rounded p-4 border border-red-900"><div className="text-[10px] font-bold uppercase text-red-300">0.8.3v Alpha • Livro de Regras v1.3</div><h3 className="font-title font-bold text-lg">△ Ordem Paranormal RPG — guia da ficha</h3><p className="text-xs mt-1">A integração usa a v1.3 clássica. A ficha prioriza consulta rápida no estilo de painel, mantendo identidade própria do PJ Lite.</p></div><div className="grid sm:grid-cols-2 gap-3 text-xs"><div className="bg-white border rounded p-3"><strong>1. Agente</strong><p>Preencha Nome, Origem, Patente, Classe, Trilha e NEX. Atributos e barras de Vida, Sanidade e Esforço ficam no painel inicial.</p></div><div className="bg-white border rounded p-3"><strong>2. Perícias</strong><p>Escolha o grau de treino e use Outros para bônus adicionais. A lista compacta mantém atributo, treino e ajuste lado a lado.</p></div><div className="bg-white border rounded p-3"><strong>3. Combate</strong><p>Registre Defesa, Bloqueio, Esquiva, ataques, teste, dano, crítico, alcance, munição, resistências e proficiências.</p></div><div className="bg-white border rounded p-3"><strong>4. Poderes & Habilidades</strong><p>Habilidades de origem/classe/trilha ficam separadas dos Poderes Paranormais. As duas listas aceitam A–Z e ↑ ↓.</p></div><div className="bg-white border rounded p-3"><strong>5. Rituais</strong><p>Rituais têm aba própria com Círculo, Elemento, Execução, Alcance, Duração, Resistência e descrição; organize com A–Z ou ↑ ↓.</p></div><div className="bg-white border rounded p-3"><strong>6. Inventário</strong><p>Organize Categoria, Espaços, Quantidade e observações dos itens. Use Anotações para informações que não cabem nas áreas anteriores.</p></div></div></div>\n                                        )}\n\n`;
  app=app.slice(0,skyGuideStart)+skyGuide+ordemGuide+app.slice(somGuideStart);
  app=`/* PJ LITE 0.8.3 ALPHA FINAL */\n${app}`;
  await writeFile(appPath,app,'utf8');
}

console.log('✓ PJ Lite 0.8.3v Alpha: Skyfall, Ordem, temas, novidades, log e guias refinados.');
