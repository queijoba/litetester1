import { readFile, writeFile } from 'node:fs/promises';
const path='src/systems/ordemParanormal/data.js';
let s=await readFile(path,'utf8');
if(!s.includes('poderesParanormais:[]')){
  if(!s.includes('habilidades:[], rituais:[]')) throw new Error('0.8.3 dados: listas de Ordem não encontradas.');
  s=s.replace('habilidades:[], rituais:[]','habilidades:[], poderesParanormais:[], rituais:[]');
  const old=" s.habilidades=list(s.habilidades).map(x=>({nome:'',tipo:'Poder',custo:'',desc:'',...(x||{})}));\n s.rituais=list(s.rituais).map(x=>({nome:'',circulo:1,elemento:'',execucao:'',alcance:'',duracao:'',resistencia:'',desc:'',...(x||{})}));";
  const neu=" const habilidadesOriginais=list(s.habilidades); const migrados=habilidadesOriginais.filter(x=>/paranormal/i.test(String(x?.tipo||'')));\n s.habilidades=habilidadesOriginais.filter(x=>!/paranormal/i.test(String(x?.tipo||''))).map(x=>({nome:'',tipo:'Poder',custo:'',desc:'',...(x||{})}));\n s.poderesParanormais=[...list(s.poderesParanormais),...migrados].map(x=>({nome:'',elemento:'',requisito:'',custo:'',desc:'',...(x||{})}));\n s.rituais=list(s.rituais).map(x=>({nome:'',circulo:1,elemento:'',execucao:'',alcance:'',duracao:'',resistencia:'',desc:'',...(x||{})}));";
  if(!s.includes(old)) throw new Error('0.8.3 dados: normalizador de habilidades não encontrado.');
  s=s.replace(old,neu);
  await writeFile(path,s,'utf8');
}
console.log('✓ Estrutura de Poderes Paranormais preparada para a 0.8.3.');
