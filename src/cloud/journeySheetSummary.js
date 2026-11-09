// Visualização somente de leitura de fichas autorizadas pela campanha.
// Nunca assume que todos os sistemas possuem a mesma estrutura de dados.
const nice=(value,fallback='')=>{
 if(value===null||value===undefined||value==='')return fallback;
 if(typeof value==='string'||typeof value==='number')return String(value);
 return fallback;
};
const firstFilled=(...candidates)=>{
 for(const value of candidates){
  if(value===undefined||value===null||value==='')continue;
  if(Array.isArray(value)&&!value.length)continue;
  if(typeof value==='object'&&!Array.isArray(value)&&!Object.keys(value).length)continue;
  return value;
 }
 return [];
};
const statPair=(data,current,max)=> {
 const a=data?.[current],b=data?.[max];
 if(a===undefined&&b===undefined)return null;
 return {current:nice(a,'—'),max:nice(b,'—')};
};
const textList=(value,max=10)=>{
 const arr=Array.isArray(value)?value:typeof value==='string'?value.split(/\r?\n|;/):
  value&&typeof value==='object'?Object.entries(value).filter(([,v])=>v!==false&&v!==null&&v!==undefined&&v!==''&&v!==0).map(([key,v])=>
   v===true?key:typeof v==='string'||typeof v==='number'?key+': '+v:{nome:v.nome||key,...v}
  ):[];
 return arr.filter(Boolean).slice(0,max).map(x=>{
  if(typeof x==='string')return x.trim();
  if(typeof x==='object')return nice(x.nome||x.name||x.titulo||x.label||x.slot||x.descricao||x.desc,'');
  return '';
 }).filter(Boolean);
};
const ATTRIBUTE_NAMES={for:'FOR',con:'CON',agl:'AGL',int:'INT',von:'VON',car:'CAR',des:'DES',sab:'SAB',ast:'AST',vig:'VIG',
 agi:'AGI',pre:'PRE',poder:'Poder',habilidade:'Habilidade',resistencia:'Resistência',
 pulso:'Pulso',firmeza:'Firmeza',tecnica:'Técnica',fisico:'Físico',intelecto:'Intelecto',coragem:'Coragem',agilidade:'Agilidade'};
const SYSTEM_ORDERS={
 dragonbane:['for','con','agl','int','von','car'],
 dnd5e:['for','des','con','int','sab','car'],
 fabula:['des','ast','vig','von'],
 fabulaUltima:['des','ast','vig','von'],
 '3det':['poder','habilidade','resistencia'],
 rotaZero:['pulso','firmeza','tecnica'],
 ordemParanormal:['agi','for','int','pre','vig'],
 somdas6:['for','des','int','car'],
};
const valueForAttribute=v=>{
 if(v===null||v===undefined)return null;
 if(typeof v==='number'||typeof v==='string')return nice(v);
 if(typeof v==='object')return nice(v.valor??v.atual??v.base,null);
 return null;
};
export function getJourneySheetSummary(row){
 const sheet=row?.sheets||{};
 const data=sheet.payload&&typeof sheet.payload==='object'?sheet.payload:{};
 const bio=data.bio||{};
 const sys=nice(sheet.system||data.system,'');
 const displayName=nice(bio.nome||data.nome||sheet.name,'Ficha sem nome');
 const profession=nice(bio.classe||bio.profissao||bio.profissão||data.profissao||data.classe||
   (Array.isArray(data.classes)?data.classes.map(c=>c.nome).filter(Boolean).join(' · '):'')||
   bio.identidade||data.tipoNpc||data.tipoPdj||data.patente||data.tipo||data.cargo,'');
 const ancestry=nice(bio.ancestralidade||bio.linhagem||bio.especie||data.ancestralidade||'');
 const level=nice(data.nivel??bio.nivel,'');
 const status=data.status||{};
 let hp=null,resource=null;
 const extraResources=[];
 if(status.pv&&typeof status.pv==='object')hp=statPair(status.pv,'atual','max');
 if(!hp)hp=statPair(status,'pvAtual','pvMax');
 if(!hp&&status.vida)hp=statPair(status.vida,'atual','max');
 if(!hp&&(typeof data.pv==='number'||(typeof data.pv==='string'&&data.pv.trim())))hp={current:String(data.pv),max:'—'};
 if(!hp&&data.recursos?.vitalidade)hp=statPair(data.recursos.vitalidade,'atual','max');
 if(!hp&&data.recursos?.vida)hp=statPair(data.recursos.vida,'atual','max');
 if(!hp&&data.status?.pv&&typeof data.status.pv==='number')hp={current:String(data.status.pv),max:String(data.status.pvMax??'—')};
 if(status.pd&&typeof status.pd==='object')resource={...statPair(status.pd,'atual','max'),label:'PD'};
 if(!resource){const mp=statPair(status,'pmAtual','pmMax');if(mp)resource={...mp,label:'PM'}}
 if(!resource){const mp=statPair(status,'sanidadeAtual','sanidadeMax');if(mp)resource={...mp,label:'Sanidade'}}
 if(!resource){const mp=statPair(status,'peAtual','peMax');if(mp)resource={...mp,label:'PE'}}
 if(!resource&&status.pm&&typeof status.pm==='object')resource={...statPair(status.pm,'atual','max'),label:'PM'};
 if(!resource&&data.recursos?.foco)resource={...statPair(data.recursos.foco,'atual','max'),label:'FOC'};
 if(!resource&&data.recursos?.energia)resource={...statPair(data.recursos.energia,'atual','max'),label:'Energia'};
 if(data.recursos?.adrenalina)extraResources.push({...statPair(data.recursos.adrenalina,'atual','max'),label:'ADR'});
 if(status.pa&&typeof status.pa==='object')extraResources.push({...statPair(status.pa,'atual','max'),label:'PA'});
 if(data.recursos?.panico&&typeof data.recursos.panico==='object')extraResources.push({...statPair(data.recursos.panico,'atual','max'),label:'Pânico'});
 const order=SYSTEM_ORDERS[sys]||Object.keys(data.atributos||{}).slice(0,8);
 const attrs=order.filter(key=>data.atributos?.[key]!==undefined).map(key=>({
  label:ATTRIBUTE_NAMES[key]||key.toUpperCase(),value:valueForAttribute(data.atributos[key])
 })).filter(a=>a.value!==null);
 const skills=textList(firstFilled(data.periciasBase,data.pericias,data.perícias,data.antecedentes),12);
 const equipment=textList(firstFilled(data.equipamentos,data.inventario,data.equipamento,data.armas),10);
 const traits=[
  ...textList(firstFilled(data.habilidadesFeiticos,data.habilidades,data.caracteristicas,data.poderesHeroicos),9),
  ...textList(data.vantagens||[],6),
  ...textList(data.tecnicas||[],6),
  ...textList(data.poderes||[],6),
  ...textList(firstFilled(data.feitiços,data.feiticos),5)
 ].slice(0,18);
 const conditions=Object.entries(data.atributos||{}).filter(([,v])=>v&&typeof v==='object'&&v.condicao).map(([k])=>ATTRIBUTE_NAMES[k]||k.toUpperCase());
 const otherConditions=Object.entries(data.condicoes||{}).filter(([,v])=>v===true).map(([k])=>k);
 // Dados de combate opcionais para a miniatura; não inventar números para sistemas
 // ou fichas que não possuam determinado recurso.
 const combat=[
  {label:sys==='dnd5e'?'CA':'DEF',value:status.ca??status.defesa??data.ca??data.defesa??status.protecao},
  {label:'INIC',value:status.iniciativa??data.iniciativa},
  {label:'DESL',value:status.deslocamento??data.derivados?.movimento??data.deslocamento}
 ].filter(item=>item.value!==undefined&&item.value!==null&&item.value!=='')
  .map(item=>({label:item.label,value:nice(item.value)}));
 return {
  name:displayName,profession,ancestry,level,system:sys,
  portrait:nice(bio.imagem||bio.foto||data.imagem||data.retrato||''),
  hp,resource,extraResources,attributes:attrs,skills,equipment,traits,combat,
  conditions:[...conditions,...otherConditions],
  sheetType:nice(sheet.sheet_type||data.type,'pc'),
  hasPayload:!!sheet.payload
 };
}
