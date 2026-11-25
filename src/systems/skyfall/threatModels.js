import { initialSkyfallThreatData } from './threatData.js';
const c=v=>JSON.parse(JSON.stringify(v));
const mk=p=>({...c(initialSkyfallThreatData),...p,status:{...c(initialSkyfallThreatData.status),...(p.status||{})},atributos:{...c(initialSkyfallThreatData.atributos),...(p.atributos||{})}});
export const MODELOS_SKYFALL_AMEACAS = [
  mk({nome:'Saqueador de Opath',conceito:'Humano oportunista acostumado a atacar viajantes.',hierarquia:'Comum',arquetipo:'Humanoide',tipo:'Humanoide',nivelDesafio:1,status:{pvAtual:12,pvMax:12,protecao:'12',iniciativa:'+2'},ataques:[{nome:'Sabre',bonus:'+3',dano:'1d6+1',alcance:'corpo a corpo',desc:''}]}),
  mk({nome:'Fera da Queda',conceito:'Predador alterado por uma região de Queda.',hierarquia:'Elite',arquetipo:'Predador',tipo:'Monstruosidade',tamanho:'Grande',nivelDesafio:3,status:{pvAtual:42,pvMax:42,protecao:'14',iniciativa:'+3'},atributos:{for:16,con:15,des:14},ataques:[{nome:'Garras',bonus:'+5',dano:'2d6+3',alcance:'corpo a corpo',desc:''}],habilidades:[{nome:'Instinto da Queda',desc:'Use como espaço para uma característica especial definida pela mesa.'}]}),
  mk({nome:'Sentinela Magitec',conceito:'Construto de patrulha alimentado por Aetherium.',hierarquia:'Chefe',arquetipo:'Construto',tipo:'Construto',nivelDesafio:5,status:{pvAtual:72,pvMax:72,protecao:'16',reducaoDano:'',iniciativa:'+1'},atributos:{for:18,con:18,int:6},ataques:[{nome:'Raio Magitec',bonus:'+6',dano:'2d8+4',alcance:'18 m',desc:''}]}),
];

// Exemplos originais para personalizar, não extraídos do Livro Básico.
const lite=(nome,tipo,hierarquia,nivelDesafio,pv,protecao,ataque,bonus,dano)=>mk({nome,tipo,categoria:tipo,hierarquia,nivelDesafio,fonte:'PJLite • exemplo original',conceito:'Modelo de treino editável; calibre à mesa.',status:{pvAtual:pv,pvMax:pv,protecao:String(protecao)},ataques:[{nome:ataque,bonus,dano,alcance:'corpo a corpo',desc:''}]});
MODELOS_SKYFALL_AMEACAS.push(lite('Vigia das Ruínas','Humanoide','Comum',1,14,12,'Lança','+3','1d6+1'),lite('Rastejante de Vidro','Monstruosidade','Comum',2,22,13,'Garras','+4','1d8+2'),lite('Autômato Abandonado','Construto','Elite',3,42,14,'Punho','+5','2d6+2'),lite('Sombra do Pântano','Morto-vivo','Elite',4,50,14,'Toque','+5','2d8+2'),lite('Predador de Cinzas','Fera','Elite',4,48,15,'Mordida','+5','2d8+3'),lite('Guardião do Abismo','Monstruosidade','Chefe',6,88,16,'Golpe','+7','2d10+4'));
