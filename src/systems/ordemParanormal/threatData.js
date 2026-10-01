import { ORDEM_ATTRIBUTES } from './data.js';
const c=v=>JSON.parse(JSON.stringify(v)); const list=v=>Array.isArray(v)?v:[];
export const initialOrdemThreatData={
 id:'',system:'ordemParanormal',type:'ameaca',nome:'',categoria:'Criatura',elemento:'',vd:0,tamanho:'Médio',presencaPerturbadora:'',
 atributos:{agi:1,for:1,int:1,pre:1,vig:1}, status:{pvAtual:10,pvMax:10,defesa:10,deslocamento:'9 m'},
 sentidos:'',resistencias:'',imunidades:'',vulnerabilidades:'',pericias:{percepcao:'',iniciativa:'',fortitude:'',reflexos:'',vontade:''},
 ataques:[],habilidades:[],enigmaMedo:'',notas:''
};
export function normalizeOrdemThreatData(item){
 const s=c(item||{}); if(s.system!=='ordemParanormal'||s.type==='pc')return s;
 s.atributos={...initialOrdemThreatData.atributos,...(s.atributos||{})}; ORDEM_ATTRIBUTES.forEach(([k])=>s.atributos[k]=Number(s.atributos[k]??1)||0);
 s.status={...initialOrdemThreatData.status,...(s.status||{})}; s.pericias={...initialOrdemThreatData.pericias,...(s.pericias||{})}; s.vd=Number(s.vd??0)||0;
 s.ataques=list(s.ataques).map(x=>({nome:'',teste:'',dano:'',critico:'',alcance:'',desc:'',...(x||{})})); s.habilidades=list(s.habilidades).map(x=>({nome:'',desc:'',...(x||{})}));
 return {...c(initialOrdemThreatData),...s};
}
