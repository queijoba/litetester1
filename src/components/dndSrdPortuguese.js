import spellNames from '../systems/dnd5e/srd521-spell-names-pt.js';
import featureNames from '../systems/dnd5e/srd521-feature-names-pt.js';
import {DND_SPECIES_PAGES,DND_FEAT_PAGES,DND_CLASS_START_PAGES,DND_SPELL_PAGES_VERIFIED,DND_FEATURE_PAGES_VERIFIED,DND_BOOK_SPELL_CHAPTER} from '../systems/dnd5e/srd521-page-references.js';

const schoolPt={Abjuration:'Abjuração',Conjuration:'Conjuração',Divination:'Adivinhação',Enchantment:'Encantamento',Evocation:'Evocação',Illusion:'Ilusão',Necromancy:'Necromancia',Transmutation:'Transmutação'};
const classPt={barbaro:'Bárbaro',bardo:'Bardo',bruxo:'Bruxo',clerigo:'Clérigo',druida:'Druida',feiticeiro:'Feiticeiro',guerreiro:'Guerreiro',ladino:'Ladino',mago:'Mago',monge:'Monge',paladino:'Paladino',patrulheiro:'Guardião'};
const damagePt={Acid:'ácido',Bludgeoning:'concussão',Cold:'frio',Fire:'fogo',Force:'energia',Lightning:'elétrico',Necrotic:'necrótico',Piercing:'perfurante',Poison:'veneno',Psychic:'psíquico',Radiant:'radiante',Slashing:'cortante',Thunder:'trovejante'};
const portugueseTime=v=>String(v||'').replace(/Concentration, up to/gi,'Concentração, até').replace(/Instantaneous/gi,'Instantânea').replace(/Until dispelled/gi,'Até ser dissipada').replace(/Bonus Action/gi,'Ação Bônus').replace(/Reaction/gi,'Reação').replace(/\bAction\b/gi,'Ação').replace(/\bminute(s)?\b/gi,(_,s)=>s?'minutos':'minuto').replace(/\bhour(s)?\b/gi,(_,s)=>s?'horas':'hora').replace(/\bday(s)?\b/gi,(_,s)=>s?'dias':'dia').replace(/\bround(s)?\b/gi,(_,s)=>s?'rodadas':'rodada').replace(/\bSelf\b/gi,'Pessoal').replace(/\bTouch\b/gi,'Toque').replace(/\bSight\b/gi,'Visão').replace(/\bfeet\b/gi,'pés').replace(/\bfoot\b/gi,'pé');
const portugueseDamage=v=>String(v||'').replace(/\b(Acid|Bludgeoning|Cold|Fire|Force|Lightning|Necrotic|Piercing|Poison|Psychic|Radiant|Slashing|Thunder)\b/gi,s=>damagePt[Object.keys(damagePt).find(key=>key.toLowerCase()===s.toLowerCase())]||s);

export const getDndPrintedPage=(entry,kind)=>{
 const exact=kind==='especies'?DND_SPECIES_PAGES[entry.id]:kind==='talentos'?DND_FEAT_PAGES[entry.nomeOriginal]:kind==='magias'?DND_SPELL_PAGES_VERIFIED[entry.nomeOriginal]:kind==='caracteristicas'?DND_FEATURE_PAGES_VERIFIED[entry._srdId]:null;
 if(Number.isInteger(exact)&&exact>0)return {value:exact,label:'p. '+exact,verified:true};
 if(kind==='magias')return {value:null,label:DND_BOOK_SPELL_CHAPTER,verified:false};
 if(kind==='caracteristicas'){
  const p=DND_CLASS_START_PAGES[entry.classId];
  return {value:null,label:p?'Cap. 3, '+(classPt[entry.classId]||'classe')+' (início na p. '+p+')':'Cap. 3',verified:false};
 }
 return {value:null,label:'Página não confirmada',verified:false};
};

function spellSummary(entry){
 if(entry.resumoPt)return entry.resumoPt;
 const text=String(entry.desc||'');
 const notes=[];
 if(/regain.*hit points|restore.*hit points|heal(?:s|ing)?\b/i.test(text))notes.push('Recupera pontos de vida ou produz cura.');
 else if(/you summon|you conjure (?:a|an|one|several)|summoned creature/i.test(text))notes.push('Invoca ou manifesta uma criatura ou um efeito mágico.');
 else if(/teleport/i.test(text))notes.push('Permite deslocamento mágico ou teletransporte.');
 else if(/you create|you cause|appears within range/i.test(text))notes.push('Cria ou modifica um efeito mágico sobre a área ou o alvo.');
 else if(/you learn|you know|you sense|you detect|you see/i.test(text))notes.push('Permite perceber ou obter informações especiais.');
 else if(/you touch|a creature you touch/i.test(text))notes.push('Afeta uma criatura ou objeto tocado.');
 else if(/each creature|creatures in|target must make|attack roll/i.test(text))notes.push('Afeta uma criatura ou área especificada nas regras.');
 else notes.push('Produz o efeito indicado pelo nome desta magia.');
 const abilities={Strength:'Força',Dexterity:'Destreza',Constitution:'Constituição',Intelligence:'Inteligência',Wisdom:'Sabedoria',Charisma:'Carisma'};
 const save=text.match(/\b(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving throw/i);
 if(save)notes.push('Salvaguarda de '+abilities[save[1]]+'.');
 else if(/saving throw/i.test(text))notes.push('Pode exigir salvaguarda.');
 if(entry.dano)notes.push('Dano/efeito: '+portugueseDamage(entry.dano)+'.');
 else if(/damage/i.test(text)){
  const dice=[...new Set(text.match(/\b\d{1,2}d\d{1,3}\b/g)||[])].slice(0,3);
  if(dice.length)notes.push('Dados mencionados: '+dice.join(', ')+'.');
 }
 if(entry.concentracao)notes.push('Exige concentração.');
 if(entry.ritual)notes.push('Pode ser conjurada como ritual.');
 return 'Resumo em português: '+notes.join(' ')+' Consulte a regra completa no livro.';
}
function featureSummary(entry){
 if(entry.idiomaDescricao!=='en')return entry.desc||'';
 const src=String(entry.desc||'');
 const notes=[];
 if(/gain proficiency|proficient|expertise/i.test(src))notes.push('Concede proficiência ou especialização.');
 if(/hit points|heal/i.test(src))notes.push('Afeta pontos de vida ou cura.');
 if(/damage|attack/i.test(src))notes.push('Pode modificar ataques e dano.');
 if(/spell|cantrip|magic/i.test(src))notes.push('Interage com conjuração ou magias.');
 if(/speed|movement|teleport/i.test(src))notes.push('Altera deslocamento ou movimento.');
 if(/advantage|saving throw|ability check/i.test(src))notes.push('Pode afetar testes ou salvaguardas.');
 if(/short rest/i.test(src))notes.push('Relaciona-se com Descanso Curto.');
 if(/long rest/i.test(src))notes.push('Relaciona-se com Descanso Longo.');
 if(!notes.length)notes.push('Benefícios e limitações devem ser consultados no livro.');
 return 'Característica de '+(classPt[entry.classId]||entry.classe||'classe')+', nível '+(entry.nivelMinimo||1)+': '+notes.join(' ')+' Resumo de referência; consulte o livro.';
}
export function localizeDndSrdEntry(entry,kind) {
 if(!entry||typeof entry!=='object')return entry;
 if(!entry.fonte?.includes('SRD 5.2.1')||entry._srdId?.startsWith('outline:'))return entry;
 const p=getDndPrintedPage(entry,kind);
 const name=kind==='magias'?(spellNames[entry.nomeOriginal]||entry.nome):kind==='caracteristicas'?(featureNames[entry.nomeOriginal]||entry.nome):entry.nome;
 const out={...entry,nome:name,paginaLivro:p.label,paginaConferida:p.verified,paginaImpressa:p.value,idiomaDescricao:'pt'};
 const ref=' Referência: Livro do Jogador 2024, '+p.label+'.';
 if(kind==='magias'){
  out.tempo=portugueseTime(entry.tempo);
  out.alcance=portugueseTime(entry.alcance);
  out.duracao=portugueseTime(entry.duracao);
  out.escola=schoolPt[entry.escola]||entry.escola;
  out.dano=portugueseDamage(entry.dano);
  out.salvaguarda=portugueseTime(entry.salvaguarda);
  out.materialDetalhe=entry.material?'Consulte o material exigido no livro.':'';
  out.desc=spellSummary(entry)+ref;
 } else if(kind==='caracteristicas')out.desc=featureSummary(entry)+ref;
 else if(kind==='talentos'){
  out.requisitoOriginal=entry.requisito;
  out.requisito=entry.requisitoPt||'Sem pré-requisito adicional.';
  out.desc=(entry.resumoPt||'Confira o benefício no livro.')+ref;
 } else if(kind==='especies'){
  out.tracos=entry.tracos.map(t=>({...t,idiomaDescricao:'pt',desc:(t.resumoPt||'Consulte o livro.')+ref}));
  out.desc=out.tracos.map(t=>t.nome+': '+t.resumoPt).join('\n')+ref;
 }
 return out;
}
