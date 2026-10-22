// Aplicação não destrutiva da biblioteca Skyfall. Mantém campos legados e modelos pessoais.
export const SKYFALL_LIBRARY_KINDS=['legado','maldicao','antecedente','classe','trilha','habilidade','magia'];
const clone=v=>JSON.parse(JSON.stringify(v));
export const normalizeSkyfallTerm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
export const skyfallLibraryWarnings=(entry,kind,{classe='',antecedente='',nivel=1}={})=>{
 const a=[];
 if(entry?.classe&&classe&&normalizeSkyfallTerm(entry.classe)!==normalizeSkyfallTerm(classe))
  a.push('Referência associada à classe '+entry.classe+'.');
 if(kind==='habilidade'&&entry?.antecedente&&antecedente&&normalizeSkyfallTerm(entry.antecedente)!==normalizeSkyfallTerm(antecedente))
  a.push('Habilidade associada ao antecedente '+entry.antecedente+'.');
 if(entry?.nivelMinimo&&Number(nivel)<Number(entry.nivelMinimo))a.push('Exige nível '+entry.nivelMinimo+'.');
 return a;
};
export function applySkyfallLibrarySelection(current,entry,kind){
 if(!current||current.system!=='skyfall'||current.type!=='pc'||!SKYFALL_LIBRARY_KINDS.includes(kind)||!entry?.nome)
  throw new Error('Seleção de Skyfall inválida.');
 const data=clone(current),id=String(entry.id||'');
 data.bio={...(data.bio||{})};
 const bioKey={legado:'legado',maldicao:'maldicao',antecedente:'antecedente',classe:'classe',trilha:'trilha'}[kind];
 if(bioKey){
  if(normalizeSkyfallTerm(data.bio[bioKey])===normalizeSkyfallTerm(entry.nome))
   return {data:current,changed:false,message:'Esta opção já está selecionada.'};
  data.bio[bioKey]=entry.nome;
  // Alterar classe não apaga a trilha existente: o jogador precisa revisar a compatibilidade.
  return {data,changed:true,message:entry.nome+' registrado(a) na ficha. Consulte os detalhes e as escolhas na página '+(entry.pagina||'indicada')+'.'};
 }
 const field=kind==='magia'?'magias':'habilidades';
 data[field]=Array.isArray(data[field])?data[field]:[];
 const dup=data[field].some(x=>x&&((id&&x.referenciaId===id)||normalizeSkyfallTerm(x.nome)===normalizeSkyfallTerm(entry.nome)));
 if(dup)return {data:current,changed:false,message:'Esta habilidade ou magia já está na ficha.'};
 const info={nome:entry.nome,fonte:entry.fonte||'',pagina:entry.pagina||'',referenciaId:id,desc:entry.desc||''};
 if(kind==='magia')data.magias.push({...info,camada:entry.camada||'Truque',custo:entry.custo||'',execucao:entry.execucao||'',alcance:entry.alcance||'',duracao:entry.duracao||'',descritores:entry.descritores||entry.grupo||''});
 else data.habilidades.push({...info,categoria:entry.categoria||(entry.antecedente?'Antecedente':entry.classe?'Classe':'Geral'),origem:entry.origem||[entry.antecedente&&'Antecedente: '+entry.antecedente,entry.classe].filter(Boolean).join(' • ')||'Livro Básico'});
 return {data,changed:true,message:entry.nome+' adicionado(a) à ficha; os campos permanecem editáveis.'};
}
