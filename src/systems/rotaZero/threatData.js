// Modelos originais de ameaças para Rota Zero, sem atributos oficiais
// presumidos. Os valores podem ser ajustados livremente pelo Mestre.
export const ROTA_ZERO_THREAT_CATEGORIES=['Anomalia','Animal','Humano hostil','Criatura','Máquina','NPC'];
export const ROTA_ZERO_THREAT_ROLES=['Comum','Perseguidor','Sentinela','Predador','Chefe','Aliado'];
export const initialRotaZeroThreatData={
 id:'',system:'rotaZero',type:'ameaca',
 nome:'',categoria:'Anomalia',papel:'Comum',descricao:'',imagem:'',codigo:'',
 atributos:{pulso:1,tecnica:1,firmeza:1},
 recursos:{vitalidade:{atual:5,max:5},foco:{atual:0,max:0},adrenalina:{atual:0,max:0}},
 defesa:0,armadura:0,calor:4,pressao:0,panico:0,
 pericias:{},ataques:[],habilidades:[],fraquezas:[],acoes:[],
 inventario:[],notas:''
};
const text=x=>String(x??'');
const clone=x=>JSON.parse(JSON.stringify(x));
const limit=(x,max=999)=>Math.min(max,Math.max(0,Number.isFinite(Number(x))?Number(x):0));
const list=x=>Array.isArray(x)?x:[];
export function normalizeRotaZeroThreatData(data){
 if(data?.system!=='rotaZero'||(data?.type||'pc')==='pc')return data;
 const base=clone(initialRotaZeroThreatData),src=clone(data);
 const out={...base,...src};
 out.type='ameaca';out.system='rotaZero';
 for(const name of ['nome','descricao','imagem','codigo','notas'])out[name]=text(src[name]);
 out.categoria=ROTA_ZERO_THREAT_CATEGORIES.includes(src.categoria)?src.categoria:base.categoria;
 out.papel=ROTA_ZERO_THREAT_ROLES.includes(src.papel)?src.papel:base.papel;
 out.atributos={...base.atributos,...(src.atributos||{})};
 for(const name of Object.keys(base.atributos))out.atributos[name]=limit(out.atributos[name],10);
 out.recursos={...base.recursos,...(src.recursos||{})};
 for(const name of Object.keys(base.recursos)){
  out.recursos[name]={...base.recursos[name],...(src.recursos?.[name]||{})};
  out.recursos[name].max=limit(out.recursos[name].max);
  out.recursos[name].atual=Math.min(out.recursos[name].max,limit(out.recursos[name].atual));
 }
 for(const name of ['defesa','armadura','calor','pressao','panico'])out[name]=limit(out[name],99);
 out.pericias={...(src.pericias||{})};
 for(const name of ['ataques','habilidades','fraquezas','acoes']){
  out[name]=list(src[name]).map(e=>typeof e==='string'?{nome:e,desc:''}:{nome:'',desc:'',...(e||{})});
 }
 out.inventario=list(src.inventario);
 return out;
}
export const MODELOS_ROTA_ZERO_AMEACAS=[
 { ...clone(initialRotaZeroThreatData),nome:'Vulto na Estrada',papel:'Perseguidor',
  descricao:'Exemplo original para encontros de suspense. Não é estatística oficial de Rota Zero.',
  atributos:{pulso:2,tecnica:1,firmeza:2},recursos:{...clone(initialRotaZeroThreatData.recursos),vitalidade:{atual:10,max:10}},
  pressao:1,ataques:[{nome:'Investida',dano:'1d6',desc:'Ataca quando alguém se aproxima do trecho escuro.'}],
  habilidades:[{nome:'Persistência',desc:'Não interrompe a perseguição até perder o rastro.'}]},
 { ...clone(initialRotaZeroThreatData),nome:'Sinal Interrompido',papel:'Sentinela',
  categoria:'Anomalia',descricao:'Exemplo original: presença que interfere em equipamentos e comunicações.',
  atributos:{pulso:1,tecnica:3,firmeza:1},recursos:{...clone(initialRotaZeroThreatData.recursos),vitalidade:{atual:5,max:5}},
  pressao:2,habilidades:[{nome:'Interferência',desc:'O Mestre pode introduzir complicações de comunicação na cena.'}]}
];
