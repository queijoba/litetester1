export const ORDEM_ATTRIBUTES=[['agi','AGI','Agilidade'],['for','FOR','Força'],['int','INT','Intelecto'],['pre','PRE','Presença'],['vig','VIG','Vigor']];
export const ORDEM_SKILLS=[
 ['acrobacia','Acrobacia','agi'],['adestramento','Adestramento','pre'],['artes','Artes','pre'],['atletismo','Atletismo','for'],
 ['atualidades','Atualidades','int'],['ciencias','Ciências','int'],['crime','Crime','agi'],['diplomacia','Diplomacia','pre'],
 ['enganacao','Enganação','pre'],['fortitude','Fortitude','vig'],['furtividade','Furtividade','agi'],['iniciativa','Iniciativa','agi'],
 ['intimidacao','Intimidação','pre'],['intuicao','Intuição','pre'],['investigacao','Investigação','int'],['luta','Luta','for'],
 ['medicina','Medicina','int'],['ocultismo','Ocultismo','int'],['percepcao','Percepção','pre'],['pilotagem','Pilotagem','agi'],
 ['pontaria','Pontaria','agi'],['profissao','Profissão','int'],['reflexos','Reflexos','agi'],['religiao','Religião','pre'],
 ['sobrevivencia','Sobrevivência','int'],['tatica','Tática','int'],['tecnologia','Tecnologia','int'],['vontade','Vontade','pre']
];
const skills=()=>Object.fromEntries(ORDEM_SKILLS.map(([id])=>[id,{grau:0,outros:0}]));
export const initialOrdemPcData={
 id:'',system:'ordemParanormal',type:'pc',
 bio:{nome:'',jogador:'',origem:'',classe:'',trilha:'',nex:5,patente:'Recruta',idade:'',imagem:''},
 atributos:{agi:1,for:1,int:1,pre:1,vig:1}, status:{pvAtual:10,pvMax:10,peAtual:5,peMax:5,sanAtual:10,sanMax:10,defesa:10,deslocamento:'9 m'},
 pericias:skills(), ataques:[], habilidades:[], rituais:[], inventario:[], resistencias:'', afinidade:'', notas:''
};
const c=v=>JSON.parse(JSON.stringify(v)); const list=v=>Array.isArray(v)?v:[];
export function normalizeOrdemPcData(item){
 const s=c(item||{}); if(s.system!=='ordemParanormal'||s.type!=='pc')return s;
 s.bio={...initialOrdemPcData.bio,...(s.bio||{})}; s.bio.nex=Math.max(0,Number(s.bio.nex??5)||0);
 s.atributos={...initialOrdemPcData.atributos,...(s.atributos||{})}; ORDEM_ATTRIBUTES.forEach(([k])=>s.atributos[k]=Number(s.atributos[k]??1)||0);
 s.status={...initialOrdemPcData.status,...(s.status||{})};
 s.pericias={...skills(),...(s.pericias||{})}; ORDEM_SKILLS.forEach(([id])=>{const x=s.pericias[id]||{};s.pericias[id]={grau:[0,5,10,15].includes(Number(x.grau))?Number(x.grau):0,outros:Number(x.outros||0)||0};});
 s.ataques=list(s.ataques).map(x=>({nome:'',teste:'',dano:'',critico:'',alcance:'',tipo:'',municao:'',...(x||{})}));
 s.habilidades=list(s.habilidades).map(x=>({nome:'',tipo:'Poder',custo:'',desc:'',...(x||{})}));
 s.rituais=list(s.rituais).map(x=>({nome:'',circulo:1,elemento:'',execucao:'',alcance:'',duracao:'',resistencia:'',desc:'',...(x||{})}));
 s.inventario=list(s.inventario).map(x=>({nome:'',categoria:'0',espacos:1,quantidade:1,desc:'',...(x||{})})); return {...c(initialOrdemPcData),...s};
}
