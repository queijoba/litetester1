import {buildFeatApplication} from './dndSpeciesFeatActions.js';

export const DND_BACKGROUND_SOURCE='pjlite-phb2024-backgrounds';

export function buildBackgroundApplication(background, currentFeatures=[], availableFeats=[]) {
 if(!background?.id||!Array.isArray(background.pericias)||!Array.isArray(background.atributosPermitidos))
  throw new Error('Antecedente inválido.');
 const current=Array.isArray(currentFeatures)?currentFeatures:[];
 const keep=current.filter(entry=>entry?.bibliotecaOrigem!==DND_BACKGROUND_SOURCE);
 const backgroundRecord={
  tipo:'outro',origem:'antecedente',nome:'Antecedente: '+background.nome,
  backgroundId:background.id,bibliotecaOrigem:DND_BACKGROUND_SOURCE,
  paginaLivro:background.paginaLivro,
  desc:background.desc,
  fonte:background.fonte
 };
 const result={background:background.nome,features:[...keep,backgroundRecord],featRegistered:false,
  abilityChoices:background.atributosPermitidos,skills:background.pericias,tool:background.ferramenta,
  moneyAlternative:50};
 const feat=availableFeats.find(row=>row?.entry?.nomeOriginal===background.talentoOriginal)?.entry;
 if(!feat)return {...result,featMissing:background.talentoOriginal};
 const enhanced={...feat,nome:background.talentoNome,
  desc:[feat.resumoPt||feat.desc, 'Concedido pelo antecedente '+background.nome+'. Verifique e configure as escolhas necessárias.'].filter(Boolean).join('\n\n')};
 const added=buildFeatApplication(enhanced,result.features);
 if(added.duplicate)return {...result,featAlreadyPresent:true};
 return {...result,features:added.features.map((entry,index)=>index===added.features.length-1?
  {...entry,origem:'antecedente',bibliotecaOrigem:DND_BACKGROUND_SOURCE,backgroundId:background.id}:entry),
  featRegistered:true};
}
