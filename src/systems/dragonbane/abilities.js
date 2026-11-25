import {DRAGONBANE_BOOK,DRAGONBANE_HEROIC_LIBRARY,DRAGONBANE_TRICK_LIBRARY,DRAGONBANE_SPELL_LIBRARY} from './libraryCatalog.js';
// Dragonbane (Livro de Regras v1.1): organização original do PJLite.
// Os modelos anteriores permanecem na lista habilidadesFeiticos: não há migração destrutiva.
export const DRAGONBANE_ABILITY_KINDS=[
 {id:'inata',nome:'Inatas da Ancestralidade',caption:'Habilidades próprias de sua ancestralidade • Livro de Regras, pp. 9–13',short:'Inata'},
 {id:'heroica',nome:'Habilidades Heroicas',caption:'Habilidade inicial da profissão e avanços do personagem • pp. 26, 35–39',short:'Heroica'},
 {id:'magia',nome:'Feitiços',caption:'Escola, grau, nível de poder e preparação • pp. 57–71',short:'Feitiço'},
 {id:'truque',nome:'Truques Mágicos',caption:'Sempre preparados, custam 1 PD e dispensam teste • pp. 58, 61–69',short:'Truque'},
 {id:'outro',nome:'Outros / Não Classificados',caption:'Entradas antigas continuam aqui até serem identificadas',short:'Outros'}
];
export const DRAGONBANE_MAGIC_SCHOOLS=['Magia Geral','Animismo','Elementalismo','Mentalismo','Outra'];
export const DRAGONBANE_INNATE_CATALOG={
 humano:[{nome:'Adaptativo',custo:'3 PD',desc:"3 PD: substitua a perícia normal do teste por outra, justificando como a utiliza. O mestre aprova a substituição."}],
 anao:[{nome:'Implacável',custo:'3 PD',desc:"3 PD: obtenha uma dádiva ao atacar alguém que já causou pelo menos 1 ponto de dano em você, independentemente de quando."}],
 elfo:[{nome:'Paz Interior',custo:'—',desc:"Meditação durante descanso de entretempo: recupera D6 PV e D6 PD adicionais e mais uma condição. Durante a meditação, não responde a estímulos nem pode ser despertado."}],
 halfling:[{nome:'Difícil de Pegar',custo:'3 PD',desc:"3 PD: ao esquivar-se de um ataque, recebe uma dádiva no teste de Evasão."}],
 lupino:[{nome:'Instintos de Caça',custo:'3 PD',desc:"3 PD: escolha uma presa visível ou cujo cheiro perceba (uma ação em combate). Rastreia seu cheiro por um dia. Por 1 PD adicional, sem ação, recebe uma dádiva em um ataque contra ela."}],
 marreco:[
  {nome:'Mal-Humorado',custo:'3 PD',desc:"3 PD, sem gastar ação: dádiva em teste de perícia e fica Enraivecido, se ainda não estiver. Não pode usar em testes de INT nem perícias baseadas em INT."},
  {nome:'Pés Palmados',custo:'—',desc:"Passiva: dádiva em todos os testes de Natação; deslocamento integral dentro e debaixo da água."}
 ]
};
export const DRAGONBANE_RARE_ANCESTRIES=[["goblin","Goblin",6,"Resiliente","1 PD","Dádiva em CON contra doença ou veneno, ou sucesso automático ao acampar. Pode comer alimento cru sem adoecer, sem custo."],["hobgoblin","Hobgoblin",8,"Destemido","2 PD","Resiste ao medo sem teste de VON; declare antes de rolar."],["ogro","Ogro",10,"Investida Corporal","3 PD","Ataque desarmado com dádiva, 2D6 contundente + bônus; não aparável. Pode correr antes. Humanoide Normal ou menor atingido cai."],["orc","Orc",12,"Resistente","3 PD","A 0 PV, restabelece-se automaticamente sem teste de VON ou Persuasão. Normalmente apenas PJs e PNJs importantes."],["anurideo","Anurídeo",16,"Salto","3 PD","Salta horizontalmente até o movimento ou verticalmente até metade, sem Acrobatismo; pode terminar com ataque corpo a corpo com dádiva."],["felideo","Felídeo",26,"Sete Vidas","Variável","2 PD para dádiva em teste de morte; reduz um D6 de dano de queda por PD, até 3, após Acrobatismo."],["karkion","Karkion",30,"Asas","1 PD/rodada","Voa à mesma velocidade de caminhada, pagando 1 PD por rodada."],["reptideo","Reptídeo",36,"Camuflagem","2 PD","Dádiva em Furtividade."],["satiro","Sátiro",38,"Levantar o Ânimo","3 PD","Ação: remove uma condição escolhida de outra pessoa que possa ouvir a até 10 m; não pode usar em si."]];
for(const [key,label,pagina,nome,custo,desc] of DRAGONBANE_RARE_ANCESTRIES)DRAGONBANE_INNATE_CATALOG[key]=[{nome,custo,desc,fonte:'Dragonbane — Bestiário v1.1',pagina:String(pagina)}];
export const DRAGONBANE_ANCESTRIES=[['humano','Humano'],['anao','Anão'],['elfo','Elfo'],['halfling','Halfling'],['lupino','Lupino'],['marreco','Marreco'],...DRAGONBANE_RARE_ANCESTRIES.map(([key,label])=>[key,label])];
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

const KNOWN_HEROIC_NAMES=new Set([...DRAGONBANE_HEROIC_LIBRARY.map(x=>norm(x.nome)),norm('Exército de Um Só'),norm('Único Sobrevivente')]);
const KNOWN_SPELLS=new Set(DRAGONBANE_SPELL_LIBRARY.map(x=>norm(x.nome)));
const KNOWN_TRICKS=new Set(DRAGONBANE_TRICK_LIBRARY.map(x=>norm(x.nome)));
const KNOWN_INNATES=new Set(Object.values(DRAGONBANE_INNATE_CATALOG).flat().map(x=>norm(x.nome)));
export function dragonbaneMagicSchool(item){
 if(item?.escola)return item.escola;
 const name=norm(String(item?.nome||'').split(/\r?\n/)[0]);
 const known=[...DRAGONBANE_SPELL_LIBRARY,...DRAGONBANE_TRICK_LIBRARY].find(x=>norm(x.nome)===name);
 if(known)return known.escola;
 return'Magia Geral';
}

export function dragonbaneAncestryKey(name){
 const n=norm(name);
 const exact=DRAGONBANE_ANCESTRIES.find(([key,label])=>n===key||n===norm(label));if(exact)return exact[0];
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
 if(KNOWN_HEROIC_NAMES.has(name))return'heroica';
 if(KNOWN_INNATES.has(name))return'inata';
 if(KNOWN_SPELLS.has(name))return'magia';
 if(KNOWN_TRICKS.has(name))return'truque';
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

// A preferência é exclusiva da ficha; ocultar não remove nem altera feitiços.
export function dragonbaneMagicTabEnabled(data){
 if(typeof data?.dragonbaneShowMagic==='boolean')return data.dragonbaneShowMagic;
 return dragonbaneAbilityList(data,'magia').length>0||dragonbaneAbilityList(data,'truque').length>0||/\bmag[oa]\b/i.test(String(data?.bio?.profissao||''));
}

export const DRAGONBANE_LIBRARY=[...Object.entries(DRAGONBANE_INNATE_CATALOG).flatMap(([ancestralidade,items])=>items.map(x=>({id:'db-innate-'+norm(x.nome).replace(/\s+/g,'-'),nome:x.nome,tipo:'inata',ancestralidade,requisito:ancestralidade,fv_nvl:x.custo,desc:x.desc,fonte:x.fonte||DRAGONBANE_BOOK,pagina:x.pagina||'9–13'}))),...DRAGONBANE_HEROIC_LIBRARY,...[['Exército de Um Só','—','Ao lutar sozinho, compra duas cartas de iniciativa, mantém ambas e atua duas vezes na rodada.'],['Único Sobrevivente','3 PD','Ao se aventurar sozinho, força um teste sem receber uma condição.']].map(([nome,fv_nvl,desc],i)=>({id:'db-solo-hero-'+i,nome,fv_nvl,desc,tipo:'heroica',requisito:'Aventura solo',fonte:'Sozinho em Fenda de Quedafunda v1.1',pagina:'1'})),...DRAGONBANE_TRICK_LIBRARY,...DRAGONBANE_SPELL_LIBRARY];
export const DRAGONBANE_SPELL_GRADES=[1,2,3,4,5];
export function dragonbaneSpellGrade(item){
 if(dragonbaneAbilityKind(item)!=='magia')return '';
 if(item?.grau!==undefined&&item.grau!==null&&item.grau!==''){
  const g=Number(item.grau);return DRAGONBANE_SPELL_GRADES.includes(g)?g:'';
 }
 return DRAGONBANE_SPELL_LIBRARY.find(x=>norm(x.nome)===norm(String(item?.nome||'').split('\n')[0]))?.grau||'';
}
export function dragonbanePreparedLimit(value){
 const n=Number(value)||0;return n>=16?7:n>=13?6:n>=9?5:n>=6?4:3;
}
export function dragonbaneSpellGroups(data,school='Todas',onlyPrepared=false){
 const spells=dragonbaneAbilityList(data,'magia').filter(({entry})=>(school==='Todas'||dragonbaneMagicSchool(entry)===school)&&(!onlyPrepared||entry.preparada));
 const tricks=dragonbaneAbilityList(data,'truque').filter(({entry})=>school==='Todas'||dragonbaneMagicSchool(entry)===school);
 const sort=(a,b)=>dragonbaneMagicSchool(a.entry).localeCompare(dragonbaneMagicSchool(b.entry),'pt-BR')||String(a.entry.nome||'').localeCompare(String(b.entry.nome||''),'pt-BR');
 return [{kind:'truque',grade:0,title:'Truques mágicos',items:tricks.sort(sort)},...DRAGONBANE_SPELL_GRADES.map(grade=>({kind:'magia',grade,title:'Grau '+grade,items:spells.filter(x=>dragonbaneSpellGrade(x.entry)===grade).sort(sort)})),{kind:'magia',grade:'',title:'Grau não definido',items:spells.filter(x=>!dragonbaneSpellGrade(x.entry)).sort(sort)}];
}
export function dragonbaneLibraryHas(data,entry){
 if(entry.repeatable)return false;
 return (Array.isArray(data?.habilidadesFeiticos)?data.habilidadesFeiticos:[]).some(x=>x&&((x.bibliotecaId===entry.id)||(dragonbaneAbilityKind(x)===entry.tipo&&norm(x.nome)===norm(entry.nome))));
}
export function insertDragonbaneLibraryEntry(data,entry){
 if(!entry||!DRAGONBANE_LIBRARY.some(x=>x.id===entry.id)||dragonbaneLibraryHas(data,entry))return data;
 const {id,repeatable,...fields}=entry;
 const item=createDragonbaneAbility(entry.tipo,{...fields,bibliotecaId:id});
 return {...data,habilidadesFeiticos:[...(Array.isArray(data?.habilidadesFeiticos)?data.habilidadesFeiticos:[]),item],...(['magia','truque'].includes(entry.tipo)?{dragonbaneShowMagic:true}:{})};
}

export function syncDragonbaneInnates(data,ancestry=data?.bio?.ancestralidade){
 const key=dragonbaneAncestryKey(ancestry);if(!key)return data;
 const entries=Array.isArray(data?.habilidadesFeiticos)?data.habilidadesFeiticos:[];
 // Only remove entries generated automatically and still identical to their original reference.
 const retained=entries.filter(item=>{if(!item?.autoAncestralidade||item.autoAncestralidade===key)return true;const original=DRAGONBANE_LIBRARY.find(e=>e.id===item.bibliotecaId);return !original||item.nome!==original.nome||item.desc!==original.desc||item.fv_nvl!==original.fv_nvl;});
 for(const ref of DRAGONBANE_LIBRARY.filter(x=>x.tipo==='inata'&&x.ancestralidade===key))if(!retained.some(x=>x&&norm(x.nome)===norm(ref.nome)&&dragonbaneAbilityKind(x)==='inata')){const {id,...fields}=ref;retained.push(createDragonbaneAbility('inata',{...fields,bibliotecaId:id,autoAncestralidade:key}));}
 if(retained.length===entries.length&&retained.every((x,i)=>x===entries[i]))return data;
 return {...data,habilidadesFeiticos:retained};
}
export function dragonbaneLoad(data){
 const base=Math.ceil(Math.max(0,Number(data?.atributos?.for?.valor)||0)/2)+(data?.dragonbaneBackpack?2:0);
 const rows=Array.isArray(data?.dragonbaneInventory)?data.dragonbaneInventory:[];
 const coinWeight=Math.floor(['ouro','prata','cobre'].reduce((n,k)=>n+Math.max(0,Math.floor(Number(data?.moedas?.[k])||0)),0)/100);
 const current=coinWeight+rows.reduce((sum,item)=>sum+(item?.nome?.trim()?Math.max(0,Number(item.quantidade)||0)*Math.max(0,Number(item.peso)||0):0),0)+Math.max(0,Number(data?.dragonbaneLegacyWeight)||0)+Math.ceil(Math.max(0,Number(data?.dragonbaneRations)||0)/4);
 const manual=data?.status?.manterDerivados&&data?.derivados?.limiteSobrecarga!==''&&data?.derivados?.limiteSobrecarga!=null?Number(data.derivados.limiteSobrecarga):base;
 const limit=Number.isFinite(manual)?manual:base;
 return {base,limit,current,over:current>limit||!!data?.dragonbaneCarryingPerson};
}
