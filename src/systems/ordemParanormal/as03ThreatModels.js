// Referências parciais conferidas diretamente em Arquivos Secretos #03, v1.1,
// Hexatombe Parte 2, PDF do Google Drive. Campos principais, não transcrição
// integral das fichas; ações e habilidades adicionais ficam no suplemento.
// Páginas em faixa por causa do posicionamento da ficha na abertura dupla.
export const AS03_HEXATOMBE_THREAT_MODELS=[
 {nome:'Alê',vd:80,pagina:'10–11',status:{pvAtual:45,pvMax:45,defesa:28,deslocamento:'9 m'},atributos:{agi:3,for:1,int:3,pre:3,vig:1},ataques:[{nome:'Cortar com teclado',teste:'1d20+10',dano:'2d6+10 corte',critico:'19',alcance:'Corpo a corpo',desc:''}]},
 {nome:'Caio',vd:80,pagina:'16–17',status:{pvAtual:60,pvMax:60,defesa:17,deslocamento:'9 m'},atributos:{agi:2,for:2,int:1,pre:2,vig:2},ataques:[{nome:'Ataque com espada',teste:'2d20+10',dano:'2d8+10 corte',critico:'19',alcance:'Corpo a corpo',desc:''}]},
 {nome:'Cindy',vd:80,pagina:'36–37',status:{pvAtual:50,pvMax:50,defesa:17,deslocamento:'9 m'},atributos:{agi:3,for:1,int:2,pre:3,vig:1},ataques:[{nome:'Pancada com baixo',teste:'1d20+10',dano:'1d6+10 impacto',critico:'',alcance:'Corpo a corpo',desc:''},{nome:'Disparo com baixo',teste:'3d20+10',dano:'2d8+10 balístico',critico:'19/x3',alcance:'Médio',desc:''}]},
 {nome:'Caíto',vd:20,pagina:'40–41',status:{pvAtual:20,pvMax:20,defesa:17,deslocamento:'9 m'},atributos:{agi:2,for:1,int:2,pre:1,vig:1},ataques:[{nome:'Disparo de pistola',teste:'2d20+5',dano:'1d12+5 balístico',critico:'18',alcance:'Curto',desc:''}]},
 {nome:'Ana',vd:100,pagina:'46–47',status:{pvAtual:90,pvMax:90,defesa:27,deslocamento:'9 m'},atributos:{agi:2,for:3,int:1,pre:1,vig:3},resistencias:'Balístico, impacto e perfuração 5; Sangue 10',vulnerabilidades:'Morte'},
 {nome:'Escarlata',vd:120,pagina:'68–69',status:{pvAtual:100,pvMax:100,defesa:28,deslocamento:'9 m'},atributos:{agi:3,for:2,int:3,pre:4,vig:2},resistencias:'Balístico, impacto e perfuração 5; Sangue 10',vulnerabilidades:'Morte'},
 {nome:'Coruja',vd:40,pagina:'80–81',status:{pvAtual:50,pvMax:50,defesa:19,deslocamento:'9 m'},atributos:{agi:3,for:1,int:3,pre:2,vig:1},habilidades:[{nome:'Dardos sedativos',desc:'Aplique os detalhes e a resistência conforme a ficha oficial, p. 80–81.'}]},
 {nome:'Pomba',vd:40,pagina:'94–95',status:{pvAtual:50,pvMax:50,defesa:20,deslocamento:'9 m'},atributos:{agi:2,for:1,int:3,pre:3,vig:1},habilidades:[{nome:'Ensinamentos do Ninho',desc:'Consulte a ficha oficial para condições e limite de uso.'}]}
].map(item=>({
 ...item,
 type:'pnj',categoria:'Pessoa',elemento:'',tamanho:'Médio',
 fonte:'Arquivos Secretos #03 — Hexatombe Parte 2',
 descricao:'Referência parcial do livro: VD, PV, Defesa, atributos e algumas ações conferidas. Complete as habilidades e condições consultando as páginas indicadas antes da sessão.'
}));
