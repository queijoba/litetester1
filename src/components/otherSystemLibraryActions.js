// Aplicações não destrutivas: somente campos associados à seleção, sem compra de pontos automática.
const clone=x=>JSON.parse(JSON.stringify(x));
const normal=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
export function applyOtherSystemLibrarySelection(current,entry,kind){
 if(!current||current.type!=='pc'||!['somdas6','3det'].includes(current.system)||!entry?.nome||entry.tipo!==kind)throw Error('Seleção inválida.');
 const data=clone(current);
 const page=entry.pagina?' • Livro Básico, p. '+entry.pagina:'';
 const warning='Consulte a descrição oficial antes de ajustar as regras.';
 if(current.system==='somdas6'){
  if(kind==='antecedente'){
   const key=entry.key;if(!key||!(key in (data.antecedentes||{})))throw Error('Antecedente sem campo na ficha.');
   if(Number(data.antecedentes[key]||0)>0)return {data:current,changed:false,message:'Este antecedente já possui pontos na ficha.'};
   // Primeiro nível: respeitar o limite inicial de distribuição de cinco pontos.
   const total=Object.values(data.antecedentes).reduce((n,v)=>n+(Number(v)||0),0);
   if(Number(data.nivel||1)===1&&total>=5)return {data:current,changed:false,message:'Os cinco pontos de Antecedente iniciais já foram distribuídos. Reorganize-os manualmente.'};
   data.antecedentes[key]=1;
   return {data,changed:true,message:'Antecedente '+entry.nome+' marcado com 1 ponto; confira a distribuição final.'};
  }
  if(kind==='tormento'){
   if(normal(data.tormento?.tipo)===normal(entry.nome))return {data:current,changed:false,message:'Este tormento já está selecionado.'};
   data.tormento={...(data.tormento||{}),tipo:entry.nome};
   return {data,changed:true,message:'Tormento selecionado; personalize sua história na ficha.'};
  }
  if(kind==='habilidade'){
   data.habilidades=Array.isArray(data.habilidades)?data.habilidades:[];
   if(data.habilidades.some(x=>normal(x?.nome)===normal(entry.nome)))return {data:current,changed:false,message:'Esta habilidade já está registrada.'};
   const model={nome:entry.nome,desc:entry.desc||'',fonte:entry.fonte,pagina:entry.pagina,referenciaId:entry.id};
   const empty=data.habilidades.findIndex(x=>!String(x?.nome||'').trim()&&!String(x?.desc||'').trim());
   if(empty>=0)data.habilidades[empty]=model;else data.habilidades.push(model);
   return {data,changed:true,message:'Habilidade '+entry.nome+' adicionada'+page+'. '+warning};
  }
 }else{
  if(kind==='pericia'){
   const key=entry.key;
   if(!key||!Object.prototype.hasOwnProperty.call(data.pericias||{},key))
    throw Error('Esta perícia não possui campo correspondente na ficha 3DeT.');
   if(data.pericias[key])
    return {data:current,changed:false,message:'A perícia '+entry.nome+' já está selecionada.'};
   data.pericias={...(data.pericias||{}),[key]:true};
   return {data,changed:true,message:'Perícia '+entry.nome+' selecionada. Confira o custo de pontos na ficha.'};
  }
  if(kind==='arquetipo'){
   if(normal(data.bio?.arquetipo)===normal(entry.nome))return {data:current,changed:false,message:'Este arquétipo já está selecionado.'};
   data.bio={...(data.bio||{}),arquetipo:entry.nome};
   return {data,changed:true,message:'Arquétipo '+entry.nome+' selecionado. Confira requisitos e gastos de pontos; vantagens não são concedidas automaticamente.'};
  }
  const field={vantagem:'vantagens',desvantagem:'desvantagens',tecnica:'tecnicas'}[kind];
  if(!field)throw Error('Categoria incompatível com 3DeT.');
  data[field]=Array.isArray(data[field])?data[field]:[];
  if(data[field].some(x=>normal(x?.nome)===normal(entry.nome)))return {data:current,changed:false,message:'Esta opção já foi adicionada à ficha.'};
  const base={nome:entry.nome,desc:entry.desc||'',fonte:entry.fonte,pagina:entry.pagina,referenciaId:entry.id};
  if(kind==='desvantagem')base.valor=entry.valor||'';
  else base.custo=entry.custo||'';
  data[field].push(base);
  return {data,changed:true,message:entry.nome+' registrado(a)'+page+'. Os pontos e recursos continuam sob controle do jogador.'};
 }
 throw Error('Categoria incompatível com o sistema.');
}
