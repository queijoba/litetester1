// Dragonbane (Livro de Regras v1.1): organização original do PJLite.
// Os modelos anteriores permanecem na lista habilidadesFeiticos: não há migração destrutiva.
export const DRAGONBANE_ABILITY_KINDS=[
 {id:'inata',nome:'Inatas da Ancestralidade',caption:'Habilidades próprias de sua ancestralidade • Livro de Regras, pp. 9–12',short:'Inata'},
 {id:'heroica',nome:'Habilidades Heroicas',caption:'Habilidade inicial da profissão e avanços do personagem • pp. 26, 35–39',short:'Heroica'},
 {id:'magia',nome:'Feitiços',caption:'Escola, grau, nível de poder e preparação • pp. 57–69',short:'Feitiço'},
 {id:'truque',nome:'Truques Mágicos',caption:'Sempre preparados, custam 1 PD e dispensam teste • pp. 57–61',short:'Truque'},
 {id:'outro',nome:'Outros / Não Classificados',caption:'Entradas antigas continuam aqui até serem identificadas',short:'Outros'}
];
export const DRAGONBANE_MAGIC_SCHOOLS=['Magia Geral','Animismo','Elementalismo','Mentalismo','Outra'];
export const DRAGONBANE_INNATE_CATALOG={
 humano:[{nome:'Adaptativo',custo:'3 PD',desc:'Permite justificar o uso de outra perícia em um teste, sujeito à avaliação do mestre.'}],
 anao:[{nome:'Implacável',custo:'3 PD',desc:'Favorece um ataque contra alguém que já tenha ferido você anteriormente.'}],
 elfo:[{nome:'Paz Interior',custo:'—',desc:'Meditação durante descanso de entretempo, com recuperação adicional de PV/PD e condição.'}],
 halfling:[{nome:'Difícil de Pegar',custo:'3 PD',desc:'Concede uma dádiva ao se esquivar de um ataque.'}],
 lupino:[{nome:'Instintos de Caça',custo:'3 PD',desc:'Permite rastrear uma presa designada pelo cheiro e obter vantagem ao atacá-la com custo adicional.'}],
 marreco:[
  {nome:'Mal-Humorado',custo:'3 PD',desc:'Favorece testes físicos ou sociais, mas pode deixar o marreco Enraivecido.'},
  {nome:'Pés Palmados',custo:'—',desc:'Facilita testes de Natação e permite deslocamento completo na água.'}
 ]
};
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

const KNOWN_HEROIC_NAMES=new Set(['Tiro Duplo','Veterano','Apunhalar pelas Costas','Pernas do Mar'].map(norm));
const KNOWN_ELEMENTAL_SPELLS=new Set(['Bola de Fogo','Pilar','Lufada de Vento'].map(norm));
const KNOWN_ELEMENTAL_TRICKS=new Set(['Calor/Frio','Nuvem de Fumaça','Ignição'].map(norm));
const KNOWN_INNATES=new Set(Object.values(DRAGONBANE_INNATE_CATALOG).flat().map(x=>norm(x.nome)));
export function dragonbaneMagicSchool(item){
 if(item?.escola)return item.escola;
 const name=norm(String(item?.nome||'').split(/\r?\n/)[0]);
 if(KNOWN_ELEMENTAL_SPELLS.has(name)||KNOWN_ELEMENTAL_TRICKS.has(name))return'Elementalismo';
 return'Magia Geral';
}

export function dragonbaneAncestryKey(name){
 const n=norm(name);
 if(n.includes('humano'))return'humano';
 if(n.includes('ana')&&/\ban[ao]\b/.test(n))return'anao';
 if(n==='anao'||n.includes('anão'))return'anao';
 if(n.includes('elfo')||n.includes('elfa'))return'elfo';
 if(n.includes('halfling'))return'halfling';
 if(n.includes('lupino')||n.includes('lupina'))return'lupino';
 if(n.includes('marreco')||n.includes('marreca'))return'marreco';
 return'';
}
export function dragonbaneAbilityKind(item){
 const raw=norm(item?.tipo||item?.categoria||'');
 if(['inata','ancestral','ancestralidade','habilidade inata','especie','especie/linhagem'].includes(raw))return'inata';
 if(['heroica','habilidade heroica','profissao'].includes(raw))return'heroica';
 if(raw.includes('truque'))return'truque';
 if(raw.includes('magia')||raw.includes('feitico')||raw.includes('spell'))return'magia';
 if(raw==='outro')return'outro';
 if(item?.magia===true||item?.isSpell===true)return'magia';
 // Migração virtual: apenas nomes inequívocos já presentes nos modelos antigos.
 // Os demais continuam editáveis em Outros, sem alterar o save original.
 const name=norm(String(item?.nome||'').split(/\r?\n/)[0]);
 if(KNOWN_INNATES.has(name))return'inata';
 if(KNOWN_HEROIC_NAMES.has(name))return'heroica';
 if(KNOWN_ELEMENTAL_SPELLS.has(name))return'magia';
 if(KNOWN_ELEMENTAL_TRICKS.has(name))return'truque';
 return'outro';
}
export function dragonbaneAbilityList(data,kind){
 const list=Array.isArray(data?.habilidadesFeiticos)?data.habilidadesFeiticos:[];
 return list.map((entry,index)=>({entry,index})).filter(({entry})=>entry&&typeof entry==='object'&&!Array.isArray(entry)&&dragonbaneAbilityKind(entry)===kind);
}
export function createDragonbaneAbility(kind='heroica',values={}){
 const tipo=DRAGONBANE_ABILITY_KINDS.some(x=>x.id===kind)?kind:'outro';
 return{
  nome:'',desc:'',tipo,fv_nvl:tipo==='truque'?'1 PD':'',
  escola:tipo==='magia'||tipo==='truque'?'Magia Geral':'',
  grau:tipo==='magia'?1:'',preparada:tipo==='truque'?true:false,
  fonte:'',pagina:'',...values
 };
}
export function dragonbaneInnateSuggestions(ancestry,abilities){
 const key=dragonbaneAncestryKey(ancestry);
 const existing=(Array.isArray(abilities)?abilities:[]).map(entry=>norm(entry?.nome).split('\n')[0]);
 return(DRAGONBANE_INNATE_CATALOG[key]||[]).filter(entry=>!existing.includes(norm(entry.nome)));
}
// Ao editar um nome legado, fixa a classificação inferida naquele momento.
 // Isso evita que o cartão mude de seção enquanto o usuário está digitando.
export function renameDragonbaneAbility(data,index,name){
 const entries=data?.habilidadesFeiticos;
 if(!Array.isArray(entries)||index<0||index>=entries.length||!entries[index])return data;
 const original=entries[index];
 const pinnedType=original.tipo||dragonbaneAbilityKind(original);
 const updated=[...entries];
 updated[index]={...original,tipo:pinnedType,nome:String(name)};
 return {...data,habilidadesFeiticos:updated};
}

export function dragonbanePdfAbilityOrder(items){
 const list=Array.isArray(items)?items:[];
 const rank={inata:0,heroica:1,magia:2,truque:3,outro:4};
 return list.map((item,i)=>({item,i,rank:rank[dragonbaneAbilityKind(item)]})).sort((a,b)=>a.rank-b.rank||a.i-b.i).map(x=>x.item);
}
export function dragonbanePdfAbilityName(item){
 const kind=dragonbaneAbilityKind(item);
 const tag={inata:'Inata',heroica:'Heroica',magia:'Feitiço',truque:'Truque',outro:''}[kind];
 const name=String(item?.nome||'').split(/\r?\n/)[0].trim();
 return tag&&name?'['+tag+'] '+name:name;
}
