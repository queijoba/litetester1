// Estruturas para adicionar opções SRD à ficha sem modificar dados existentes
// fora dos campos específicos explicitamente escolhidos.
export const DND_CATALOG_ORIGIN = 'pjlite-srd-5.2.1';

export function buildSpeciesApplication(species, choiceName, features=[], status={}) {
 if (!species?.id || !Array.isArray(species.tracos)) throw new Error('Espécie inválida.');
 const choice = species.escolha?.options?.find(item=>item.name===choiceName) || null;
 if (species.escolha && !choice) throw new Error('Escolha uma linhagem ou ancestralidade antes de aplicar.');
 const original=Array.isArray(features)?features:[];
 // Só substituímos recursos que o PJLite colocou automaticamente antes.
 // Fichas personalizadas e habilidades de fontes externas são preservadas.
 const retained=original.filter(entry=>!(entry?.tipo==='especie'&&entry?.bibliotecaOrigem===DND_CATALOG_ORIGIN));
 const newTraits=species.tracos.map(trait=>({
  tipo:'especie',origem:'especie',
  especieId:species.id,traitId:trait.id,
  nome:trait.nome,
  desc:[trait.resumoPt,trait.desc].filter(Boolean).join('\n\n'),
  bibliotecaOrigem:DND_CATALOG_ORIGIN,
  fonte:trait.fonte||species.fonte
 }));
 if(choice){
  newTraits.push({
   tipo:'especie',origem:'especie',especieId:species.id,
   traitId:'choice-'+choice.name,
   nome:species.escolha.label+' — '+choice.name,
   desc:choice.desc,
   bibliotecaOrigem:DND_CATALOG_ORIGIN,
   fonte:species.fonte
  });
 }
 const size=species.tamanho==='Médio ou Pequeno'
  ?(['Médio','Pequeno'].includes(status?.tamanho)?status.tamanho:'Médio')
  :species.tamanho;
 const speed=species.id==='elfo'&&choice?.name==='Elfo da Floresta'
  ? '10,5 m'
  :String(species.deslocamentoMetros).replace('.',',')+' m';
 const prevSpeed=String(status?.deslocamento||'').trim();
 // Evitar sobrepor modificadores de deslocamento introduzidos manualmente.
 const safeSpeed=!prevSpeed||prevSpeed==='9 m'||prevSpeed==='30 pés'||prevSpeed==='10,5 m';
 return {
  especie:species.nome,variacao:choice?.name||'',features:[...retained,...newTraits],
  size,speed:safeSpeed?speed:null,choiceApplied:choice,
  traitCount:newTraits.length
 };
}

export function featRequirementWarnings(feat,{level=1,attributes={},classId='',selectedFeatures=[]}={}) {
 const warnings=[];
 if (!feat) return ['Talento inválido.'];
 const currentLevel=Number(level)||1;
 if(feat.nivelMinimo && currentLevel<Number(feat.nivelMinimo))
  warnings.push('Exige nível '+feat.nivelMinimo+' ou maior (ficha: '+currentLevel+').');
 const req=String(feat.requisito||'');
 const strength=Number(attributes.for??10),dex=Number(attributes.des??10);
 if(/Strength or Dexterity 13/i.test(req) && Math.max(strength,dex)<13)
  warnings.push('Exige Força ou Destreza 13 ou maior.');
 if(/Fighting Style Feature/i.test(req)) {
  const likely=(classId==='guerreiro'&&currentLevel>=1)
   ||(['paladino','patrulheiro'].includes(classId)&&currentLevel>=2)
   ||selectedFeatures.some(entry=>/fighting style|estilo de luta/i.test(entry.nome||''));
  if(!likely)warnings.push('Exige a característica Estilo de Luta; confirme com o Mestre.');
 }
 if(/Spellcasting Feature/i.test(req)){
  const likely=['bardo','clerigo','druida','feiticeiro','mago','paladino','patrulheiro'].includes(classId)
   ||selectedFeatures.some(entry=>/spellcasting|conjuração|magia de pacto/i.test(entry.nome||''));
  if(!likely)warnings.push('Exige Conjuração; confirme se seu personagem atende.');
 }
 return warnings;
}

export function buildFeatApplication(feat,features=[]) {
 if(!feat?.nome)throw new Error('Talento inválido.');
 const list=Array.isArray(features)?features:[];
 const duplicated=!feat.repetivel && list.some(entry=>
   entry?.tipo==='talento' && (
    entry.featId===feat.id ||
    String(entry.nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    === String(feat.nome).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
   )
 );
 if(duplicated)return {duplicate:true,features:list};
 return {duplicate:false,features:[...list,{
  tipo:'talento',origem:'talento',
  featId:feat.id,nome:feat.nome,categoria:feat.categoria,
  nivelMinimo:feat.nivelMinimo,requisito:feat.requisito,
  desc:[feat.resumoPt,feat.desc].filter(Boolean).join('\n\n'),
  repetivel:feat.repetivel,
  bibliotecaOrigem:DND_CATALOG_ORIGIN,
  fonte:feat.fonte
 }]};
}
