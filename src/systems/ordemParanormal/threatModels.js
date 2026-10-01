import { initialOrdemThreatData } from './threatData.js';
const c=v=>JSON.parse(JSON.stringify(v)); const mk=p=>({...c(initialOrdemThreatData),...p,status:{...c(initialOrdemThreatData.status),...(p.status||{})},atributos:{...c(initialOrdemThreatData.atributos),...(p.atributos||{})}});
export const MODELOS_ORDEM_AMEACAS=[
 mk({nome:'Cultista Iniciado',categoria:'Humano',elemento:'',vd:20,status:{pvAtual:18,pvMax:18,defesa:13},atributos:{agi:2,for:1,int:2,pre:2,vig:1},ataques:[{nome:'Faca ritual',teste:'Luta',dano:'1d4',critico:'',alcance:'corpo a corpo',desc:''}]}),
 mk({nome:'Manifestação Rubra',categoria:'Criatura',elemento:'Sangue',vd:40,status:{pvAtual:45,pvMax:45,defesa:15},atributos:{agi:2,for:3,int:0,pre:2,vig:3},ataques:[{nome:'Garras',teste:'',dano:'2d6',critico:'',alcance:'corpo a corpo',desc:''}],habilidades:[{nome:'Fome do Outro Lado',desc:'Exemplo original de espaço para habilidade de ameaça.'}]}),
 mk({nome:'Eco da Ruína',categoria:'Criatura',elemento:'Morte',vd:80,status:{pvAtual:90,pvMax:90,defesa:18},atributos:{agi:3,for:2,int:1,pre:4,vig:4},ataques:[{nome:'Toque entrópico',teste:'',dano:'3d8',critico:'',alcance:'curto',desc:''}],enigmaMedo:'Defina um Enigma de Medo apropriado para a missão.'}),
];
