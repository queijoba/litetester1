import { readFile, writeFile } from 'node:fs/promises';

const editorPath='src/systems/skyfall/components/CharacterEditor.jsx';
const themePath='src/systems/skyfall/skyfall-theme.css';

let editor=await readFile(editorPath,'utf8');
let theme=await readFile(themePath,'utf8');

const marker='PJ LITE SKYFALL ABILITY CATEGORIES PREVIEW V1';

editor=editor.replace("['pericias','Perícias']","['pericias','Perícias e atributos']");

if(!editor.includes("const [novaCategoriaHabilidade,setNovaCategoriaHabilidade]")){
  editor=editor.replace(
    " const [tab,setTab]=useState('perfil');",
    " const [tab,setTab]=useState('perfil');\n const [novaCategoriaHabilidade,setNovaCategoriaHabilidade]=useState('Classe');"
  );
}

if(!editor.includes('const habilidadesPorCategoria=useMemo')){
  const anchor=" const magiasPorCamada=useMemo(()=>Object.fromEntries(SKYFALL_MAGIC_LAYERS.map(layer=>[layer,(data.magias||[]).map((m,i)=>({m,i})).filter(({m})=>(m.camada||'Truque')===layer)])),[data.magias]);";
  const addition=`${anchor}\n const habilidadesPorCategoria=useMemo(()=>{\n  const grupos={};\n  (data.habilidades||[]).forEach((h,i)=>{\n   const categoria=String(h?.categoria||'Geral').trim()||'Geral';\n   (grupos[categoria]??=[]).push({h,i});\n  });\n  return grupos;\n },[data.habilidades]);\n const categoriasHabilidades=Object.keys(habilidadesPorCategoria);`;
  if(!editor.includes(anchor)) throw new Error('Não encontrei o ponto de agrupamento das magias para inserir categorias de habilidades.');
  editor=editor.replace(anchor,addition);
}

const start=editor.indexOf("  {tab==='poderes'&&");
const end=editor.indexOf("\n\n  {tab==='magias'&&",start);
if(start<0||end<0) throw new Error('Não encontrei o bloco de Habilidades do Skyfall.');

const replacement=`  {tab==='poderes'&&<div className="space-y-4">\n   <section className="skyfall-card skyfall-ability-manager">\n    <div className="skyfall-section-head"><div><h3>Habilidades por categoria</h3><p className="skyfall-help">Separe habilidades como você separa as camadas de magia. Exemplos: Classe, Trilha, Legado, Herança, Antecedente ou qualquer categoria criada por você.</p></div></div>\n    <div className="skyfall-category-create"><label><span>Categoria</span><input list="skyfall-habilidade-categorias" value={novaCategoriaHabilidade} onChange={e=>setNovaCategoriaHabilidade(e.target.value)} placeholder="Ex.: Classe, Legado, Trilha..."/></label><datalist id="skyfall-habilidade-categorias"><option value="Classe"/><option value="Trilha"/><option value="Legado"/><option value="Herança"/><option value="Antecedente"/><option value="Maldição"/><option value="Geral"/></datalist><button className="skyfall-add" onClick={()=>{const categoria=novaCategoriaHabilidade.trim()||'Geral';add('habilidades',{nome:'',origem:'',categoria,custoEnfase:'',descritores:'',desc:''});setNovaCategoriaHabilidade(categoria);}}>+ Habilidade nessa categoria</button></div>\n   </section>\n   {categoriasHabilidades.length===0?<section className="skyfall-card skyfall-category-empty"><h3>Nenhuma habilidade registrada</h3><p className="skyfall-help">Escolha uma categoria acima e adicione a primeira habilidade. “Classe” já vem como sugestão inicial.</p></section>:categoriasHabilidades.map(categoria=><section className="skyfall-card skyfall-category-section" key={categoria}>\n    <div className="skyfall-section-head"><div><div className="skyfall-category-title"><h3>{categoria}</h3><span>{habilidadesPorCategoria[categoria].length}</span></div><p className="skyfall-help">Habilidades agrupadas em {categoria}.</p></div><button className="skyfall-add" onClick={()=>add('habilidades',{nome:'',origem:'',categoria,custoEnfase:'',descritores:'',desc:''})}>+ Habilidade</button></div>\n    <div className="grid md:grid-cols-2 gap-2">{habilidadesPorCategoria[categoria].map(({h:x,i})=><div key={i} className="skyfall-entry skyfall-ability-entry"><div className="flex gap-2"><input className="flex-1 font-bold" value={x.nome||''} onChange={e=>patch('habilidades',i,'nome',e.target.value)} placeholder="Nome da habilidade"/><button className="danger" onClick={()=>remove('habilidades',i)} title="Remover">×</button></div><div className="skyfall-ability-meta"><label><span>Categoria</span><input list="skyfall-habilidade-categorias" value={x.categoria||categoria} onChange={e=>patch('habilidades',i,'categoria',e.target.value)} placeholder="Categoria"/></label><label><span>Origem / classe</span><input value={x.origem||''} onChange={e=>patch('habilidades',i,'origem',e.target.value)} placeholder="Ex.: Combatente, Legado, Trilha..."/></label><label><span>Custo de Ênfase</span><input value={x.custoEnfase||''} onChange={e=>patch('habilidades',i,'custoEnfase',e.target.value)} placeholder="Custo de Ênfase"/></label><label><span>Descritores</span><input value={x.descritores||''} onChange={e=>patch('habilidades',i,'descritores',e.target.value)} placeholder="Descritores"/></label></div><textarea rows="3" value={x.desc||''} onChange={e=>patch('habilidades',i,'desc',e.target.value)} placeholder="Descrição / lembrete"/></div>)}</div>\n   </section>)}\n  </div>}`;

editor=editor.slice(0,start)+replacement+editor.slice(end);

if(!theme.includes(marker)){
  theme+=`\n/* ${marker}\n * Categorias de habilidades no mesmo espírito visual das camadas de magia.\n */\n.skyfall-ability-manager{border-top:4px solid #52657d!important}\n.skyfall-category-create{display:grid;grid-template-columns:minmax(180px,1fr) auto;gap:10px;align-items:end}\n.skyfall-category-create label{min-width:0}\n.skyfall-category-section{border-top:4px solid #6f8197!important}\n.skyfall-category-title{display:flex;align-items:center;gap:8px}\n.skyfall-category-title h3{margin:0!important;border:0!important;padding:0!important}\n.skyfall-category-title span{display:inline-flex;align-items:center;justify-content:center;min-width:26px;height:22px;padding:0 7px;background:#dfe6ec;color:#2c435e;border:1px solid #92a2b3;font-size:9px;font-weight:900}\n.skyfall-ability-meta{display:grid;grid-template-columns:1fr 1fr;gap:6px}\n.skyfall-ability-meta label>span{display:block;margin-bottom:3px;color:#506278!important;text-transform:uppercase;font-size:8px!important;font-weight:900}\n.skyfall-ability-entry{border-left:4px solid #8395aa!important}\n.skyfall-category-empty{border-style:dashed!important}\nbody.theme-dark .skyfall-category-title span{background:#52657d;color:#fff;border-color:#91a0b1}\nbody.theme-dark .skyfall-category-section{border-top-color:#91a0b1!important}\nbody.theme-dark .skyfall-ability-entry{border-left-color:#91a0b1!important}\n@media(max-width:640px){.skyfall-category-create{grid-template-columns:1fr}.skyfall-category-create .skyfall-add{width:100%}.skyfall-ability-meta{grid-template-columns:1fr}}\n`;
}

await writeFile(editorPath,editor,'utf8');
await writeFile(themePath,theme,'utf8');
console.log('✓ Skyfall: aba renomeada e habilidades organizadas por categorias, preservando custo de Ênfase e descritores.');
