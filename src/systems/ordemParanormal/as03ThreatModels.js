// Arquivos Secretos #03 v1.1 — Hexatombe Parte 2 (Jambô Editora).
// 18 blocos "PESSOA" conferidos no PDF disponibilizado pelo usuário no Drive.
// Apenas dados de referência e resumos mecânicos originais; nenhuma ficha é completa.
// Estatísticas de transformação/máscara NÃO são aplicadas automaticamente.
const DR='Balístico, impacto e perfuração 5; Sangue 10';
const mk=(nome,pagina,vd,pv,defesa,atributos,ataques=[],habilidades=[],resto={})=>({
 nome,pagina,vd,status:{pvAtual:pv,pvMax:pv,defesa,deslocamento:'9 m'},
 atributos,ataques,habilidades,...resto
});
const attack=(nome,teste,dano,critico='',alcance='Corpo a corpo',desc='')=>({
 nome,teste,dano,critico,alcance,desc
});
const ability=(nome,desc)=>({nome,desc});
const blood={resistencias:DR,vulnerabilidades:'Morte'};
const models=[
 mk('Alê','10–11',80,45,28,{agi:3,for:1,int:3,pre:3,vig:1},
  [attack('Cortar com teclado','1d20+10','2d6+10 corte','19')],
  [ability('Hora do Show','Máscara com bônus temporários de ataque, Defesa e PV. Aplique somente após a ação indicada na ficha oficial.')]),
 mk('Caio','16–17',80,60,17,{agi:2,for:2,int:1,pre:2,vig:2},
  [attack('Ataque com espada','2d20+10','2d8+10 corte','19')],
  [ability('Berrão','Ataque especial contra ser adjacente; o alvo pode reduzir a consequência soltando o que segura. Confira p. 16–17.')]),
 mk('Eloy','22–23',80,70,16,{agi:2,for:3,int:1,pre:1,vig:3},
  [attack('Pancada','3d20+10','4d4+10 impacto','19')],
  [ability('Hora do Show','Máscara com estatísticas temporárias. Não utilizar PV e Defesa transformados como valores iniciais.')]),
 mk('Franco','28–29',80,55,16,{agi:2,for:2,int:1,pre:1,vig:2},
  [attack('Bater com guitarra','2d20+5','1d10+5 impacto')],
  [ability('Hora do Show','A máscara altera atributos de combate temporariamente. Consulte p. 28–29.')]),
 mk('Cindy','36–37',80,50,17,{agi:3,for:1,int:2,pre:3,vig:1},
  [attack('Pancada com baixo','1d20+10','1d6+10 impacto'),
   attack('Disparo com baixo','3d20+10','2d8+10 balístico','19/x3','Médio')],
  [ability('Hora do Show','A máscara altera valores de combate temporariamente; confira também os demais poderes especiais na fonte.')]),
 mk('Caíto','40–41',20,20,17,{agi:2,for:1,int:2,pre:1,vig:1},
  [attack('Disparo de pistola','2d20+5','1d12+5 balístico','18','Curto')],
  [ability('Ódio Suprimido','Ação completa em área de alcance curto; exige resistências de Fortitude e Reflexos contra DT 20.')]),
 mk('Ana','46–47',100,90,27,{agi:2,for:3,int:1,pre:1,vig:3},
  [attack('Ataque com maça','3d20+15','6d4+10 perfuração + 1d6 Sangue','x3'),
   attack('Ataque com florete','3d20+15','4d6+10 corte + 2d4 Sangue','18')],
  [ability('Paixão Servil','Recebe bônus aos testes e rolagens quando está perto de Escarlata; o bônus pode crescer se ela for atacada.')],
  {...blood}),
 mk('Argano','50–51',100,120,26,{agi:1,for:4,int:1,pre:0,vig:4},
  [attack('Maça pesada','4d20+15','4d8+20 perfuração','x3')],
  [ability('Coração Exposto','Ataques direcionados ao coração enfrentam Defesa 31 e, se acertarem, causam dano crítico.'),
   ability('Guardião','Pode interceptar dano que seria sofrido por Escarlata quando está perto dela.')],
  {...blood}),
 mk('Chispa','56–57',100,90,26,{agi:3,for:1,int:4,pre:1,vig:1},
  [attack('Tiro de escopeta','3d20+15','6d6+20 balístico','x3','Curto')],
  [ability('Motor Frágil','Motor do triciclo: Defesa 26, RD 5, PV 20. Sua destruição afeta movimento e habilidades de Chispa.')],
  {...blood,status:{pvAtual:90,pvMax:90,defesa:26,deslocamento:'15 m'}}),
 mk('Torvo','62–63',20,30,21,{agi:1,for:1,int:1,pre:1,vig:2},
  [attack('Manopla espinhenta','1d20+10','1d6+5 perfuração')],
  [ability('Fonte de Rituais','Escarlata pode fortalecer rituais à custa dos PV de Torvo, se ele estiver em alcance curto.')],
  {...blood,status:{pvAtual:30,pvMax:30,defesa:21,deslocamento:'0 m'}}),
 mk('Escarlata','68–69',120,100,28,{agi:3,for:2,int:3,pre:4,vig:2},
  [attack('Rasgar com garras','3d20+15','4d10+10 corte','19')],
  [ability('Dominação','Pode impor ordens a alvos sob efeito de Sedução, com resistência de Vontade DT 23 e novas tentativas.')],
  {...blood}),
 mk('Miasma','72–73',40,30,18,{agi:2,for:2,int:1,pre:1,vig:2},
  [attack('Golpe com correntes','2d20+5','2d8+5 impacto')],
  [ability('Despertar Obsessão','O alvo escolhe desviar o olhar ou tentar resistir ao efeito. Consulte as consequências e testes na fonte.')]),
 mk('Coruja','80–81',40,50,19,{agi:3,for:1,int:3,pre:2,vig:1},
  [attack('Tiro de zarabatana','3d20+10','1d4+1 perfuração + sedativo','19','Curto')],
  [ability('Dardos Sedativos','Ao atingir, pode deixar o alvo inconsciente até ser acordado ou fim da cena; Fortitude DT 20 evita.')]),
 mk('Corvo','87–88',40,60,18,{agi:2,for:1,int:3,pre:3,vig:1},
  [attack('Pancada','1d20+5','1d4+5 impacto')],
  [ability('Silêncio Fúnebre','Após sua morte, o corpo ganha 30 PV temporários e causa uma penalidade aos testes contra seus aliados em área.')]),
 mk('Papagaio','91–92',40,60,21,{agi:2,for:2,int:1,pre:3,vig:2},
  [attack('Garrafada','2d20+10','1d4+10 impacto')],
  [ability('Cachimbo do Capeta','Pode asfixiar um alvo adjacente; Fortitude DT 20 evita, e recuperar o fôlego exige ação padrão.')]),
 mk('Pomba','94–95',40,50,20,{agi:2,for:1,int:3,pre:3,vig:1},
  [attack('Ataque com canivete','2d20+10','1d4+5 corte')],
  [ability('Ensinamentos do Ninho','Ao testemunhar a morte de um aliado, pode usar uma habilidade dele uma vez até o fim da cena.')]),
 mk('Harpia','100–101',80,100,22,{agi:3,for:3,int:2,pre:2,vig:3},
  [attack('Garra do Harpia','3d20+10','2d8+10 corte','19'),
   attack('Pistola','3d20+10','1d12+10 balístico','18','Curto')],
  [ability('Assobio do Harpia','Comanda aves contra um alvo de alcance longo, com efeitos alternativos e testes de resistência.')]),
 mk('Suellen','104–105',20,30,15,{agi:1,for:2,int:2,pre:2,vig:2},
  [attack('Golpe com cutelo','2d20+5','1d8+5 corte')],
  [ability('Estimular Hedonismo','Afeta uma pessoa a curto alcance; Vontade DT 20 evita a perda temporária de autopreservação.')])
];
export const AS03_HEXATOMBE_THREAT_MODELS=models.map(item=>({
 ...item,type:'pnj',categoria:'Pessoa',elemento:'',tamanho:'Médio',
 fonte:'Arquivos Secretos #03 — Hexatombe Parte 2',
 descricao:'Referência parcial do Arquivos Secretos #03 v1.1. PV, Defesa e demais dados são os valores de ficha inicial. Consulte a fonte para ações, rituais, condições especiais e modificações temporárias.',
 notas:'Fonte: Arquivos Secretos #03 v1.1, p. '+item.pagina+'. Modelo de consulta editável, não substitui a ficha completa.'
}));
