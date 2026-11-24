import {AS03_HEXATOMBE_THREAT_MODELS} from './as03ThreatModels.js';
import {ORDEM_BASIC_BESTIARY} from './basicBestiary.js';
import {ORDEM_SAH_BESTIARY} from './sahBestiary.js';
import {initialOrdemThreatData} from './threatData.js';

const clone=x=>JSON.parse(JSON.stringify(x));
const mk=p=>({...clone(initialOrdemThreatData),...p,
 status:{...clone(initialOrdemThreatData.status),...(p.status||{})},
 atributos:{...clone(initialOrdemThreatData.atributos),...(p.atributos||{})}});
const examples=[
 {nome:'Cultista Iniciado',categoria:'Humano',elemento:'Nenhum',vd:20,status:{pvAtual:18,pvMax:18,defesa:13},atributos:{agi:2,for:1,int:2,pre:2,vig:1},ataques:[{nome:'Faca ritual',teste:'Luta',dano:'1d4',critico:'',alcance:'corpo a corpo',desc:''}]},
 {nome:'Manifestação Rubra',categoria:'Criatura',elemento:'Sangue',vd:40,status:{pvAtual:45,pvMax:45,defesa:15},atributos:{agi:2,for:3,int:0,pre:2,vig:3},ataques:[{nome:'Garras',teste:'',dano:'2d6',critico:'',alcance:'corpo a corpo',desc:''}],habilidades:[{nome:'Fome do Outro Lado',desc:'Exemplo original de espaço para habilidade de ameaça.'}]},
 {nome:'Eco da Ruína',categoria:'Criatura',elemento:'Morte',vd:80,status:{pvAtual:90,pvMax:90,defesa:18},atributos:{agi:3,for:2,int:1,pre:4,vig:4},ataques:[{nome:'Toque entrópico',teste:'',dano:'3d8',critico:'',alcance:'curto',desc:''}],enigmaMedo:'Defina um Enigma de Medo apropriado para a missão.'}
].map(item=>({...item,fonte:'Exemplos do PJLite',descricao:'Modelo fictício editável, sem vínculo com o bestiário oficial.'}));
export const MODELOS_ORDEM_AMEACAS=[
 ...ORDEM_BASIC_BESTIARY,
 ...ORDEM_SAH_BESTIARY,
 ...AS03_HEXATOMBE_THREAT_MODELS,
 ...examples
].map(item=>mk(item));

const ELEMENTOS_ORDEM=['Sangue','Morte','Conhecimento','Energia','Medo','Nenhum','Outros'];
const elementoPrimario=m=>{
 if(m.nome==='Degolificada')return 'Medo';
 const part=String(m.elemento||'').split('/')[0].trim();
 return ELEMENTOS_ORDEM.includes(part)&&part?part:'Outros';
};
export const GRUPOS_ORDEM_AMEACAS=ELEMENTOS_ORDEM.map(elemento=>({
 title:elemento==='Nenhum'?'Realidade · pessoas e animais':elemento==='Outros'?'Sem elemento · modelos e NPCs':'Elemento · '+elemento,
 items:MODELOS_ORDEM_AMEACAS.filter(m=>elementoPrimario(m)===elemento)
  .sort((a,b)=>Number(a.vd||0)-Number(b.vd||0)||a.nome.localeCompare(b.nome,'pt-BR'))
})).filter(group=>group.items.length);
