// Visualização somente de leitura de fichas autorizadas pela campanha.
// Nunca assume que todos os sistemas possuem a mesma estrutura de dados.
const nice=(value,fallback='')=>{
 if(value===null||value===undefined||value==='')return fallback;
 if(typeof value==='string'||typeof value==='number')return String(value);
 return fallback;
};
const statPair=(data,current,max)=> {
 const a=data?.[current],b=data?.[max];
 if(a===undefined&&b===undefined)return null;
 return {current:nice(a,'—'),max:nice(b,'—')};
};
const textList=(value,max=10)=>{
 const arr=Array.isArray(value)?value:typeof value==='string'?value.split(/\r?\n|;/):[];
 return arr.filter(Boolean).slice(0,max).map(x=>{
  if(typeof x==='string')return x.trim();
  if(typeof x==='object')return nice(x.nome||x.name||x.titulo||x.label||x.slot||x.descricao||x.desc,'');
  return '';
 }).filter(Boolean);
};
const ATTRIBUTE_NAMES={for:'FOR',con:'CON',agl:'AGL',int:'INT',von:'VON',car:'CAR',des:'DES',sab:'SAB',ast:'AST',vig:'VIG',fisico:'Físico',intelecto:'Intelecto',coragem:'Coragem',agilidade:'Agilidade'};
const SYSTEM_ORDERS={
 dragonbane:['for','con','agl','int','von','car'],
 dnd5e:['for','des','con','int','sab','car'],
 fabula:['des','ast','vig','von'],
 fabulaUltima:['des','ast','vig','von'],
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
   bio.identidade||data.tipo||data.cargo,'');
 const ancestry=nice(bio.ancestralidade||bio.linhagem||bio.especie||data.ancestralidade||'');
 const level=nice(data.nivel??bio.nivel,'');
 const status=data.status||{};
 let hp=null,resource=null;
 if(status.pv&&typeof status.pv==='object')hp=statPair(status.pv,'atual','max');
 if(!hp)hp=statPair(status,'pvAtual','pvMax');
 if(!hp&&status.vida)hp=statPair(status.vida,'atual','max');
 if(!hp&&typeof data.pv==='number')hp={current:String(data.pv),max:'—'};
 if(status.pd&&typeof status.pd==='object')resource={...statPair(status.pd,'atual','max'),label:'PD'};
 if(!resource){const mp=statPair(status,'pmAtual','pmMax');if(mp)resource={...mp,label:'PM'}}
 if(!resource){const mp=statPair(status,'sanidadeAtual','sanidadeMax');if(mp)resource={...mp,label:'Sanidade'}}
 if(!resource){const mp=statPair(status,'peAtual','peMax');if(mp)resource={...mp,label:'PE'}}
 const order=SYSTEM_ORDERS[sys]||Object.keys(data.atributos||{}).slice(0,8);
 const attrs=order.filter(key=>data.atributos?.[key]!==undefined).map(key=>({
  label:ATTRIBUTE_NAMES[key]||key.toUpperCase(),value:valueForAttribute(data.atributos[key])
 })).filter(a=>a.value!==null);
 const skills=textList(data.periciasBase||data.pericias||data.perícias||data.antecedentes||[],12);
 const equipment=textList(data.equipamentos||data.inventario||data.equipamento||data.armas||[],10);
 const traits=textList(data.habilidadesFeiticos||data.habilidades||data.caracteristicas||data.poderesHeroicos||[],10);
 const conditions=Object.entries(data.atributos||{}).filter(([,v])=>v&&typeof v==='object'&&v.condicao).map(([k])=>ATTRIBUTE_NAMES[k]||k.toUpperCase());
 const otherConditions=Object.entries(data.condicoes||{}).filter(([,v])=>v===true).map(([k])=>k);
 return {
  name:displayName,profession,ancestry,level,system:sys,
  portrait:nice(bio.imagem||bio.foto||data.imagem||data.retrato||''),
  hp,resource,attributes:attrs,skills,equipment,traits,
  conditions:[...conditions,...otherConditions],
  sheetType:nice(sheet.sheet_type||data.type,'pc'),
  hasPayload:!!sheet.payload
 };
}
