// Blocos rápidos de consulta de O Som das Seis, por Ramon Mineiro.
// Conforme o aviso do próprio livro: regras CC BY-SA 4.0 com atribuição.
// Textos de conceito são resumos originais; o livro segue necessário para
// regras completas e efeitos especiais. Os valores dos oito PDJs são do livro.
const PDJS=[["Confederado Fugitivo",3,18,3,"Rifle (2D6)","Revólver (1D6)","Foragido armado; costuma reagir com violência.","Canalhas e patifes",82],["Capanga Ralé",2,11,2,"Revólver (1D6)","","Integrante de um bando de criminosos.","Canalhas e patifes",82],["Pistoleiro Veterano",4,23,4,"Revólver (1D6)","","Atirador experiente com técnica de disparos rápidos.","Canalhas e patifes",82],["Barão da Ferrovia",5,29,5,"Revólver (1D6)","","Poderoso empresário cercado de guarda-costas.","Canalhas e patifes",82],["Caçador",2,21,3,"Rifle","Arco","Rastreador preparado para lidar com o ermo.","PDJs importantes",83],["Espiã Infiltrada",4,31,4,"Revólver","Navalha","Agente que manipula informações e identidades.","PDJs importantes",83],["Agente Pinkerton",3,25,3,"Revólver (1D6)","","Investigador com autoridade na região.","PDJs importantes",83],["Fanático Religioso",2,18,2,"","","Líder radical que se apoia em seguidores leais.","PDJs importantes",83]];
const ANIMAIS=[["Castor","Animal pequeno de rios e áreas alagadas."],["Bisão","Animal de grande porte; pode investir ao defender o rebanho."],["Águia","Ave de rapina veloz que ataca com garras e bico."],["Alce","Herbívoro robusto que pode usar a galhada."],["Coiote","Predador oportunista que caça em grupo."],["Corvo","Ave inteligente; ameaça limitada em bandos."],["Crocodilo","Predador de rios e pântanos; perigoso a curta distância."],["Puma","Felino furtivo que prefere uma emboscada."],["Raposa","Animal arisco que tenta escapar de ameaças."],["Serpente","Animal que pode atacar com veneno."],["Urso","Animal forte capaz de dominar o oponente."],["Lobo","Canídeo que caça em alcateia."]];
const source='O Som das Seis — Ramon Mineiro';
const at=(value,max=value)=>({pvAtual:value,pvMax:max});
const weapon=(text)=>text?{nome:text.replace(/\s*\([^)]*\)/,''),dano:(text.match(/\(([^)]+)\)/)||[])[1]||'',notas:''}:null;
const base=(nome,fonte,pagina,grupo,categoria,descricao)=>({
 id:'',system:'somdas6',type:'ameaca',nome,fonte,pagina,grupo,categoria,
 descricao,tipoPdj:'Comum',np:1,status:{pvAtual:6,pvMax:6,defesa:5,acoes:1,iniciativaBonus:1,ataqueBonus:1},
 armas:[],habilidades:[],notas:''
});
export const MODELOS_SOM6_LIVRO_PDJ=PDJS.map(([nome,np,pv,acoes,a,b,descricao,grupo,pagina])=>{
 const important=grupo==='PDJs importantes';
 const item=base(nome,source,pagina,grupo,'NPC',descricao);
 return {...item,tipoPdj:important?'Importante':'Comum',np,
  status:{pvAtual:pv,pvMax:pv,defesa:5,acoes,iniciativaBonus:np,ataqueBonus:np},
  armas:[weapon(a),weapon(b)].filter(Boolean),
  habilidades:important?[{nome:'Perfil importante',desc:'O livro permite habilidades especiais adicionais; escolha conforme o PDJ.'}]:[],
  notas:'Fonte: O Som das Seis, Ramon Mineiro, p. '+pagina+'. Perfil do livro com NP, PV e ações indicados. Consulte o original para particularidades e equipamentos.'};
});
export const MODELOS_SOM6_LIVRO_ANIMAIS=ANIMAIS.map(([nome,descricao])=>{
 const item=base(nome,source,84,'Animais selvagens','Animal',descricao);
 return {...item,nome,habilidades:[{nome:'Fauna selvagem',desc:'Consulte a tabela Animais Selvagens do livro para sua habilidade.'}],
  notas:'Fonte: O Som das Seis, Ramon Mineiro, tabela de Animais Selvagens, p. 84. NP 1, PV 6 e demais números são apenas valores iniciais EDITÁVEIS do PJLite, não estatísticas oficiais do animal. Ajuste conforme a tabela e a cena.'};
});
