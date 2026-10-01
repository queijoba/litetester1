import { SKYFALL_ATTRIBUTES } from './data.js';
const clone=v=>JSON.parse(JSON.stringify(v));
const list=v=>Array.isArray(v)?v:[];

export const initialSkyfallThreatData = {
  id:'', system:'skyfall', type:'ameaca', nome:'', conceito:'', hierarquia:'Comum', arquetipo:'', tipo:'Criatura', tamanho:'Médio',
  nivelDesafio:1, xp:0, recarga:'', atributos:{for:10,con:10,des:10,sab:10,int:10,car:10},
  status:{pvAtual:10,pvMax:10,protecao:'',reducaoDano:'',iniciativa:'',deslocamento:'9 m'},
  pericias:[], ataques:[], habilidades:[], reacoes:[], resistencias:'', vulnerabilidades:'', notas:''
};

export function normalizeSkyfallThreatData(item){
  const s=clone(item||{});
  if(s.system!=='skyfall'||s.type==='pc') return s;
  s.nome=String(s.nome||''); s.conceito=String(s.conceito||'');
  s.atributos={...initialSkyfallThreatData.atributos,...(s.atributos||{})};
  SKYFALL_ATTRIBUTES.forEach(([k])=>s.atributos[k]=Number(s.atributos[k]??10)||0);
  s.status={...initialSkyfallThreatData.status,...(s.status||{})};
  s.nivelDesafio=Number(s.nivelDesafio??1)||0; s.xp=Number(s.xp??0)||0;
  s.pericias=list(s.pericias).map(x=>({nome:'',bonus:'',...(x||{})}));
  s.ataques=list(s.ataques).map(x=>({nome:'',bonus:'',dano:'',alcance:'',desc:'',...(x||{})}));
  s.habilidades=list(s.habilidades).map(x=>({nome:'',desc:'',...(x||{})}));
  s.reacoes=list(s.reacoes).map(x=>({nome:'',desc:'',...(x||{})}));
  return {...clone(initialSkyfallThreatData),...s};
}
