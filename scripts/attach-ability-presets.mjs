import { readFile, writeFile } from 'node:fs/promises';

const ordemPath='src/systems/ordemParanormal/components/CharacterEditor.jsx';
const skyfallPath='src/systems/skyfall/components/CharacterEditor.jsx';

function addButton(block, target, kind) {
  const text="setPresetKind('"+kind+"')";
  if (block.includes(text)) return block;
  if (!block.includes(target)) throw new Error('Modelos prontos: botão não encontrado: '+kind);
  return block.replace(target,'<button type="button" className="pjlite-preset-button" onClick={()=>setPresetKind(\''+kind+'\')}>📚 Biblioteca</button>'+target);
}
function addSave(block, target, kind) {
  const text="savePreset('"+kind+"'";
  if (block.includes(text)) return block;
  if (!block.includes(target)) throw new Error('Modelos prontos: editor não encontrado: '+kind);
  return block.replace(target,target+'<button type="button" className="pjlite-preset-save" onClick={()=>savePreset(\''+kind+'\',x)}>☆ Salvar modelo</button>');
}
function patchZone(text,start,end,fn){
  const a=text.indexOf(start),b=text.indexOf(end,a+start.length);
  if(a<0||b<a)throw new Error('Modelos prontos: trecho não encontrado '+start+' -> '+end);
  return text.slice(0,a)+fn(text.slice(a,b))+text.slice(b);
}

let ordem=await readFile(ordemPath,'utf8');
ordem=patchZone(ordem,'<span>HABILIDADES & PODERES</span>','<span>PODERES PARANORMAIS</span>',zone=>{
  zone=addButton(zone,'<button className="ordem-add" onClick={()=>add(\'habilidades\',{nome:\'\',tipo:\'Poder\',custo:\'\',desc:\'\'})}>+ Poder</button>','habilidades');
  return addSave(zone,'<textarea rows="3" value={x.desc||\'\'} onChange={e=>patch(\'habilidades\',i,\'desc\',e.target.value)} placeholder="Descrição / lembrete"/>','habilidades');
});
ordem=patchZone(ordem,'<span>PODERES PARANORMAIS</span>',"{tab==='rituais'",zone=>{
  zone=addButton(zone,'<button className="ordem-add" onClick={()=>add(\'poderesParanormais\',{nome:\'\',elemento:\'\',requisito:\'\',custo:\'\',desc:\'\'})}>+ Poder Paranormal</button>','poderesParanormais');
  return addSave(zone,'<textarea rows="3" value={x.desc||\'\'} onChange={e=>patch(\'poderesParanormais\',i,\'desc\',e.target.value)} placeholder="Efeito / lembrete"/>','poderesParanormais');
});
ordem=patchZone(ordem,'<span>RITUAIS</span>',"{tab==='inventario'",zone=>{
  zone=addButton(zone,'<button className="ordem-add" onClick={()=>add(\'rituais\',{nome:\'\',circulo:1,elemento:\'\',execucao:\'\',alcance:\'\',duracao:\'\',resistencia:\'\',desc:\'\'})}>+ Ritual</button>','rituais');
  return addSave(zone,'<textarea rows="3" value={x.desc||\'\'} onChange={e=>patch(\'rituais\',i,\'desc\',e.target.value)} placeholder="Efeito / lembrete"/>','rituais');
});
if(!ordem.includes('<AbilityPresetPicker'))throw new Error('Seletor ausente do editor Ordem');
await writeFile(ordemPath,ordem,'utf8');

let skyfall=await readFile(skyfallPath,'utf8');
skyfall=patchZone(skyfall,"{tab==='poderes'","{tab==='magias'",zone=>{
  zone=addButton(zone,'<button className="skyfall-add" onClick={()=>{const categoria=novaCategoriaHabilidade.trim()||\'Geral\';add(\'habilidades\',{nome:\'\',origem:\'\',categoria,custoEnfase:\'\',descritores:\'\',desc:\'\' });setNovaCategoriaHabilidade(categoria);}}>+ Habilidade nessa categoria</button>','habilidades');
  return addSave(zone,'<textarea rows="3" value={x.desc||\'\'} onChange={e=>patch(\'habilidades\',i,\'desc\',e.target.value)} placeholder="Descrição / lembrete"/>','habilidades');
});
if(!skyfall.includes("setPresetKind('magias')"))throw new Error('Seletor de magias removido por script anterior');
if(!skyfall.includes("savePreset('magias'"))throw new Error('Salvamento de magias removido por script anterior');
if(!skyfall.includes('<AbilityPresetPicker'))throw new Error('Seletor ausente do editor Skyfall');
await writeFile(skyfallPath,skyfall,'utf8');
console.log('✓ Catálogos de Habilidades, Poderes Paranormais, Rituais e Magias ligados após o build final.');
