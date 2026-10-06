import { initialRotaZeroPcData } from './data.js';
const c=v=>JSON.parse(JSON.stringify(v));
const base=()=>c(initialRotaZeroPcData);
const make=(nome,conceito,attrs,skills,adv,def,ancora)=>({
  ...base(),
  bio:{...base().bio,nome,conceito,kit:'Modelo pronto'},
  atributos:attrs,
  pericias:Object.fromEntries(skills.map(id=>[id,true])),
  vantagens:[adv],
  defeitos:[def],
  ancora,
});
export const MODELOS_ROTA_ZERO_PC=[
  make('NIX-17','Entregadora nova, curiosa demais',{pulso:1,tecnica:3,firmeza:2},['conducao','observacao','manutencao'],'cabecaFria','esgotado','fita de música'),
  make('MILO-2','Despachante de campo que leva toda entrega a sério',{pulso:2,tecnica:2,firmeza:2},['logistica','influencia','navegacao'],'redeContatos','codigoRigido','recibos antigos'),
  make('LUME-5','Observadora de sinais e padrões que não deveriam existir',{pulso:1,tecnica:2,firmeza:3},['pesquisa','observacao','sobrevivencia'],'leitorRuido','fotossensivel','luz de emergência vermelha'),
  make('BRASA-8','Mecânico de estrada, direto e barulhento',{pulso:3,tecnica:1,firmeza:2},['manutencao','sobrevivencia','conducao'],'maosOficina','barulhento','ritual de apertar parafusos'),
];
