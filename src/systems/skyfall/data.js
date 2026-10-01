export const SKYFALL_ATTRIBUTES = [
  ['for', 'FOR', 'Força'], ['con', 'CON', 'Constituição'], ['des', 'DES', 'Destreza'],
  ['sab', 'SAB', 'Sabedoria'], ['int', 'INT', 'Inteligência'], ['car', 'CAR', 'Carisma'],
];

export const SKYFALL_SKILLS = [
  ['acrobacia','Acrobacia','des'], ['adestrarAnimais','Adestrar Animais','sab'],
  ['arcanismo','Arcanismo','int'], ['atletismo','Atletismo','for'],
  ['apresentacao','Apresentação','car'], ['enganacao','Enganação','car'],
  ['furtividade','Furtividade','des'], ['historia','História','int'],
  ['intimidacao','Intimidação','car'], ['intuicao','Intuição','sab'],
  ['investigacao','Investigação','int'], ['medicina','Medicina','sab'],
  ['natureza','Natureza','int'], ['percepcao','Percepção','sab'],
  ['persuasao','Persuasão','car'], ['prestidigitacao','Prestidigitação','des'],
  ['religiao','Religião','int'], ['sobrevivencia','Sobrevivência','sab'],
];

export const SKYFALL_MAGIC_LAYERS = ['Truque', 'Superficial', 'Rasa', 'Profunda'];
const skillObject = () => Object.fromEntries(SKYFALL_SKILLS.map(([id]) => [id, { proficiente:false, enfase:false, bonus:'' }]));

export const initialSkyfallPcData = {
  id:'', system:'skyfall', type:'pc',
  bio:{ nome:'', jogador:'', pronomes:'', legado:'', heranca:'', antecedente:'', maldicao:'', melancolia:'', classe:'', trilha:'', nivel:1, imagem:'' },
  atributos:{ for:10, con:10, des:10, sab:10, int:10, car:10 },
  proficiencia:2,
  recursos:{
    pv:{atual:10,max:10,temp:0}, catarse:{atual:0,max:0}, enfase:{atual:0,max:0}, sombra:0,
    fragmentos:{atual:0,max:0}, volume:{atual:0,max:0}, dadosVida:{totais:'',usados:''}, testesMorte:{sucessos:0,falhas:0},
  },
  combate:{ protecao:'', reducaoDano:'', iniciativa:'', tamanho:'Médio', deslocamento:'9 m' },
  conjuracao:{ atributoChave:'', bonusAtaque:'', cd:'', observacoes:'' },
  pericias:skillObject(), ataques:[], habilidades:[], equipamentos:[], magias:[], idiomas:'', moedas:{ pecas:0, trocados:0 }, notas:'',
};

const clone = (v) => JSON.parse(JSON.stringify(v));
const list = (v) => Array.isArray(v) ? v : [];

export function normalizeSkyfallPcData(item) {
  const s=clone(item||{});
  if (s.system!=='skyfall' || s.type!=='pc') return s;
  s.bio={...initialSkyfallPcData.bio,...(s.bio||{})};
  s.bio.nivel=Math.max(1,Number(s.bio.nivel||1));
  s.atributos={...initialSkyfallPcData.atributos,...(s.atributos||{})};
  SKYFALL_ATTRIBUTES.forEach(([k])=>s.atributos[k]=Number(s.atributos[k]??10)||0);
  s.proficiencia=Number(s.proficiencia??2)||0;
  s.recursos={...clone(initialSkyfallPcData.recursos),...(s.recursos||{})};
  for (const k of ['pv','catarse','enfase','fragmentos','volume','dadosVida','testesMorte']) s.recursos[k]={...clone(initialSkyfallPcData.recursos[k]),...(s.recursos?.[k]||{})};
  s.combate={...initialSkyfallPcData.combate,...(s.combate||{})};
  s.conjuracao={...initialSkyfallPcData.conjuracao,...(s.conjuracao||{})};
  s.pericias={...skillObject(),...(s.pericias||{})};
  SKYFALL_SKILLS.forEach(([id])=>s.pericias[id]={proficiente:false,enfase:false,bonus:'',...(s.pericias[id]||{})});
  s.ataques=list(s.ataques).map(x=>({nome:'',bonus:'',dano:'',tipo:'',alcance:'',descricao:'',notas:'',...(x||{}),descricao:String(x?.descricao||x?.notas||'')}));
  s.habilidades=list(s.habilidades).map(x=>({nome:'',origem:'',desc:'',...(x||{})}));
  s.equipamentos=list(s.equipamentos).map(x=>({nome:'',quantidade:1,volume:'',fragmentos:'',descritores:'',...(x||{})}));
  s.magias=list(s.magias).map(x=>({nome:'',camada:'Truque',custo:'',execucao:'',alcance:'',duracao:'',descritores:'',desc:'',...(x||{}),camada:SKYFALL_MAGIC_LAYERS.includes(x?.camada)?x.camada:(x?.camada||'Truque')}));
  s.moedas={...initialSkyfallPcData.moedas,...(s.moedas||{})};
  s.idiomas=String(s.idiomas||''); s.notas=String(s.notas||'');
  return {...clone(initialSkyfallPcData),...s};
}
