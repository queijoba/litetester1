import {ORDEM_SKILLS} from './data.js';
const clone=v=>JSON.parse(JSON.stringify(v));
export const ORDEM_INDEX_ORIGIN='pj-op-official-index';
export const normalizeOrdemTerm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
const skillMap=new Map(ORDEM_SKILLS.flatMap(([id,label])=>[[normalizeOrdemTerm(label),id],[normalizeOrdemTerm(id),id]]));

export function getOrdemLibraryWarnings(entry,kind,{classe='',trilha='',nex=5}={}){
 const warnings=[];
 const e=entry||{},n=Number(nex)||0;
 if(e.classe&&e.classe!=='Geral'&&classe&&normalizeOrdemTerm(e.classe)!==normalizeOrdemTerm(classe)&&['trilhas','habilidades'].includes(kind))
  warnings.push('Opção descrita para '+e.classe+' (ficha: '+classe+').');
 if(e.trilha&&trilha&&normalizeOrdemTerm(e.trilha)!==normalizeOrdemTerm(trilha)&&kind==='habilidades')
  warnings.push('Poder associado à trilha '+e.trilha+'.');
 if(e.nexMinimo&&n<Number(e.nexMinimo))warnings.push('Requer NEX '+e.nexMinimo+'%; ficha atual: '+n+'%.');
 if(kind==='rituais'&&e.circulo){
  const minNex={1:5,2:25,3:55,4:85}[Number(e.circulo)];
  if(minNex&&n<minNex)warnings.push('Rituais de '+e.circulo+'º círculo normalmente exigem NEX '+minNex+'% para Ocultistas. Verifique regras alternativas e outros requisitos.');
  if(classe&&normalizeOrdemTerm(classe)!=='ocultista')warnings.push('Acesso a rituais por outras classes depende de poderes ou permissões específicas do sistema.');
 }
 if(e.requisito)warnings.push('Confira requisito: '+e.requisito+'.');
 return warnings;
}
const same=(a,b)=>normalizeOrdemTerm(a)===normalizeOrdemTerm(b);
const fromCatalog=(a)=>a?.bibliotecaOrigem===ORDEM_INDEX_ORIGIN;
const tag=(entry,kind)=>({
 nome:entry.nome,tipo:kind==='habilidades'?'Poder':kind==='poderesParanormais'?'Poder paranormal':kind==='trilhas'?'Trilha':'Origem',
 custo:entry.custo||'',desc:entry.desc||'',pagina:entry.pagina||'',fonte:entry.fonte||'Modelo pessoal',
 classe:entry.classe||'',trilha:entry.trilha||'',elemento:entry.elemento||'',
 bibliotecaOrigem:entry.bibliotecaOrigem||ORDEM_INDEX_ORIGIN,referenciaId:entry.id||''
});
export function applyOrdemLibrarySelection(current,entry,kind){
 if(!current||!entry?.nome||!['origens','trilhas','habilidades','poderesParanormais','rituais'].includes(kind))
  throw new Error('Seleção de biblioteca inválida.');
 const data=clone(current),feature=tag(entry,kind);
 data.bio={...(data.bio||{})};
 data.habilidades=Array.isArray(data.habilidades)?data.habilidades:[];
 data.poderesParanormais=Array.isArray(data.poderesParanormais)?data.poderesParanormais:[];
 data.rituais=Array.isArray(data.rituais)?data.rituais:[];
 if(kind==='origens'){
  const control=data.bio.origemBibliotecaControle;
  if(control?.pericias&&data.pericias){
   for(const [id,info] of Object.entries(control.pericias)){
    if(data.pericias[id]&&Number(data.pericias[id].grau)===Number(info.aplicado))
     data.pericias[id].grau=Number(info.anterior)||0;
   }
  }
  const trained={};
  const map=data.pericias||{};
  for(const skill of entry.pericias||[]){
   const id=skillMap.get(normalizeOrdemTerm(skill));if(!id||!map[id])continue;
   const prior=Number(map[id].grau||0);
   if(prior<5){map[id].grau=5;trained[id]={anterior:prior,aplicado:5};}
  }
  data.pericias=map;
  data.bio.origem=entry.nome;
  data.bio.origemBibliotecaControle={id:entry.id||'',pericias:trained};
  data.habilidades=data.habilidades.filter(x=>!(x.tipo==='Origem'&&fromCatalog(x)));
  data.habilidades.push({...feature,nome:entry.poderOrigem||entry.nome,desc:[entry.desc,(entry.pericias||[]).length?'Perícias da origem: '+entry.pericias.join(', '):''].filter(Boolean).join('\n')});
  return {changed:true,data,message:'Origem '+entry.nome+' aplicada. Perícias reconhecidas foram treinadas sem diminuir valores anteriores; revise as escolhas.'};
 }
 if(kind==='trilhas'){
  data.bio.trilha=entry.nome;
  data.habilidades=data.habilidades.filter(x=>!(x.tipo==='Trilha'&&fromCatalog(x)));
  data.habilidades.push({...feature,nome:'Trilha: '+entry.nome,progressao:Array.isArray(entry.progressao)?clone(entry.progressao):[],nexMinimo:entry.nexMinimo||0});
  return {changed:true,data,message:'Trilha '+entry.nome+' selecionada; registre os poderes adquiridos no NEX atual.'};
 }
 if(kind==='poderesParanormais'){
  if(data.poderesParanormais.some(x=>(entry.id&&x.referenciaId===entry.id)||(same(x.nome,entry.nome)&&same(x.fonte,entry.fonte))))
   return {changed:false,data:current,message:'O poder paranormal já existe na ficha.'};
  data.poderesParanormais.push({...feature,tipo:'Poder paranormal',requisito:entry.requisito||''});
  return {changed:true,data,message:'Poder paranormal '+entry.nome+' registrado.'};
 }
 if(kind==='rituais'){
  if(data.rituais.some(x=>(entry.id&&x.referenciaId===entry.id)||(same(x.nome,entry.nome)&&same(x.fonte,entry.fonte))))
   return {changed:false,data:current,message:'Esse ritual já consta na ficha.'};
  data.rituais.push({
   nome:entry.nome,circulo:Number(entry.circulo)||1,elemento:entry.elemento||'',
   elementosPossiveis:entry.elementosPossiveis||[],
   execucao:entry.execucao||'',alcance:entry.alcance||'',duracao:entry.duracao||'',
   resistencia:entry.resistencia||'',custo:entry.custo||'',pagina:entry.pagina||'',
   fonte:entry.fonte||'',desc:entry.desc||'',referenciaId:entry.id||'',
   bibliotecaOrigem:entry.bibliotecaOrigem||ORDEM_INDEX_ORIGIN
  });
  return {changed:true,data,message:'Ritual '+entry.nome+' adicionado. Confira os componentes e as formas Discente/Verdadeiro.'};
 }
 if(data.habilidades.some(x=>(entry.id&&x.referenciaId===entry.id)||(same(x.nome,entry.nome)&&same(x.fonte,entry.fonte))))
  return {changed:false,data:current,message:'Essa habilidade já consta da ficha.'};
 data.habilidades.push(feature);
 return {changed:true,data,message:'Habilidade '+entry.nome+' adicionada.'};
}
