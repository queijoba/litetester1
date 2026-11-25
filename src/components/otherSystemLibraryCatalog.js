import {TRESDET_EXPLANATIONS,TRESDET_SKILL_ENTRIES,TRESDET_TECH_USAGE} from './tresdetVictoryExplanations.js';
import {TRESDET_ARCHETYPE_PACKAGES} from './tresdetVictoryArchetypes.js';
import {TRESDET_MECHANICS,TRESDET_LIBRARY_EXTRAS} from './tresdetVictoryMechanics.js';
// Índice editorial de consulta: nomes e referências dos livros disponibilizados no Drive.
// Som das Seis: regras em CC BY-SA 4.0; resumos novos do PJLite, sem transcrição integral.
// 3DeT Victory: referência por nome, seção e página; consulte o livro para os efeitos.
export const SOM6_LIBRARY=[
  {
    "id": "som6-habilidade-1",
    "tipo": "habilidade",
    "nome": "LIGHT MY FIRE",
    "pagina": "23",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Revólver: +1 no teste de ataque e dano adicional igual à Agilidade.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-2",
    "tipo": "habilidade",
    "nome": "LET’S DANCE",
    "pagina": "23",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Dois disparos por ação, com −1 no teste de Combate.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-3",
    "tipo": "habilidade",
    "nome": "FORTUNATE SON",
    "pagina": "23",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Ao cair a 0 PV pela primeira vez no combate, recupera 3 PV e levanta no turno seguinte; não funciona novamente no mesmo combate.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-4",
    "tipo": "habilidade",
    "nome": "DON’T STOP BELIEVING",
    "pagina": "23",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Arma de longa distância: +1 no ataque e dano adicional igual à Inteligência.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-5",
    "tipo": "habilidade",
    "nome": "IMMIGRANT SONG",
    "pagina": "23",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Dano desarmado de 1d6 + Físico, em vez de 1d3.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-6",
    "tipo": "habilidade",
    "nome": "GIMME SHELTER",
    "pagina": "23",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Ataque surpresa com faca/navalha: +1d6 no nível 1, +2d6 no 2, +3d6 no 4, +4d6 no 6.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-7",
    "tipo": "habilidade",
    "nome": "ANOTHER ONE BITES THE DUST",
    "pagina": "24",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Escolha uma manobra por aquisição: rasteira (teste oposto; alvo cai e gasta ação para levantar), suplex (teste oposto, 2d6), briga de bar (objetos pequenos 1d6+1, médios 1d6+2, grandes 1d6+3), tapa (alvo gasta ação para se recuperar) ou kung-fu (3 golpes em uma ação, −1 no teste). Pode adquirir outras manobras; registre a escolha na ficha.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-8",
    "tipo": "habilidade",
    "nome": "RIDERS ON THE STORM",
    "pagina": "24",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Uma vez por combate, cada 3 PV sacrificados acrescenta 1d6 por nível ao dano corpo a corpo.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-9",
    "tipo": "habilidade",
    "nome": "BORN TO BE WILD",
    "pagina": "24",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "+1 em testes de Antecedente de furtividade ou percepção.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-10",
    "tipo": "habilidade",
    "nome": "SMOKE ON THE WATER",
    "pagina": "24",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Armas rústicas: +1 no ataque e dano adicional igual ao Físico.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-11",
    "tipo": "habilidade",
    "nome": "UNDER PRESSURE",
    "pagina": "24",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "+1 no Físico para resistir a fatores adversos. No descanso, some Físico aos PV recuperados.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-12",
    "tipo": "habilidade",
    "nome": "HEARTBREAKER",
    "pagina": "25",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Uma vez por sessão, escolha um alvo por nível: −1 nas ações ofensivas dele contra você. Pode transferir o benefício para outro aliado.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-13",
    "tipo": "habilidade",
    "nome": "BARRACUDA",
    "pagina": "25",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "+1 por nível (máx. +5) em testes para obter informações.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-14",
    "tipo": "habilidade",
    "nome": "SWEET EMOTION",
    "pagina": "25",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Inspira aliados. Nível 1: ação extra em combate; 2: 1d6 PV temporários; 3: +1 em ataques; 4: +2 em ataques; 5: 2d6 PV temporários; 6: +1 jogada em teste de morte. Benefícios anteriores ficam disponíveis; consulte a tabela de usos por sessão da p. 25.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-15",
    "tipo": "habilidade",
    "nome": "CRAZY TRAIN",
    "pagina": "25",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Com peças, aumenta dano de uma arma de fogo em até 1d6, uma vez por nível. Após um combate a arma fica inutilizável.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-16",
    "tipo": "habilidade",
    "nome": "CARRY ON MY WAYWARD SON",
    "pagina": "25",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Repetições de testes falhos por sessão iguais ao nível; pode cedê-las a outros personagens.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-17",
    "tipo": "habilidade",
    "nome": "WAR PIGS",
    "pagina": "25",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "+1 em teste de Antecedente ao usar explosivos; dano adicional igual ao Intelecto.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-18",
    "tipo": "habilidade",
    "nome": "ACE OF SPADES",
    "pagina": "25",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "+1 em Roubo para trapacear ou perceber trapaça em jogos.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-19",
    "tipo": "habilidade",
    "nome": "A HORSE WITH NO NAME",
    "pagina": "26",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "+1 em cavalgar, saltar e controlar a própria montaria.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-20",
    "tipo": "habilidade",
    "nome": "I WANT TO HOLD YOUR HAND",
    "pagina": "26",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Ao tratar a si ou outro personagem, acrescenta 1d6 PV recuperados por nível.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-21",
    "tipo": "habilidade",
    "nome": "PARANOID",
    "pagina": "26",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "+1 Iniciativa; nunca é pego desprevenido.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-22",
    "tipo": "habilidade",
    "nome": "RAMBLE ON",
    "pagina": "26",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Dois movimentos por ação; +1 em testes de fuga.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-23",
    "tipo": "habilidade",
    "nome": "AQUALUNG",
    "pagina": "27",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "+1 em testes atléticos (nadar, escalar, saltar).",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-habilidade-24",
    "tipo": "habilidade",
    "nome": "MORE THAN A FEELING",
    "pagina": "27",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Uma vez por sessão, teste Negócios se desconfiar de alguém; sucesso permite duas perguntas à Juíza.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-antecedente-25",
    "tipo": "antecedente",
    "nome": "Combate",
    "pagina": "19",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Ataques armados/desarmados e estratégia. Na criação, distribua 4 pontos no total, até 2 por Antecedente.",
    "key": "combate",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-antecedente-26",
    "tipo": "antecedente",
    "nome": "Negócios",
    "pagina": "19",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Negociação, persuasão e percepção de mentiras. Na criação, distribua 4 pontos no total, até 2 por Antecedente.",
    "key": "negocios",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-antecedente-27",
    "tipo": "antecedente",
    "nome": "Montaria",
    "pagina": "20",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Controle e manobras de montaria, avaliação de cavalos e pecuária. Na criação, distribua 4 pontos no total, até 2 por Antecedente.",
    "key": "montaria",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-antecedente-28",
    "tipo": "antecedente",
    "nome": "Tradição",
    "pagina": "19",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Cultura, fauna, flora, remédios e rastros. Na criação, distribua 4 pontos no total, até 2 por Antecedente.",
    "key": "tradicao",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-antecedente-29",
    "tipo": "antecedente",
    "nome": "Labuta",
    "pagina": "19",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Ofícios, reparos, construção e esforço físico. Na criação, distribua 4 pontos no total, até 2 por Antecedente.",
    "key": "labuta",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-antecedente-30",
    "tipo": "antecedente",
    "nome": "Exploração",
    "pagina": "20",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Sobrevivência, perceber ameaças, rastrear e ocultar rastros. Na criação, distribua 4 pontos no total, até 2 por Antecedente.",
    "key": "exploracao",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-antecedente-31",
    "tipo": "antecedente",
    "nome": "Roubo",
    "pagina": "20",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Furtividade, trapaça, destreza manual e furtos. Na criação, distribua 4 pontos no total, até 2 por Antecedente.",
    "key": "roubo",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-antecedente-32",
    "tipo": "antecedente",
    "nome": "Medicina",
    "pagina": "20",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Cura no descanso, anatomia, doenças e remédios. Na criação, distribua 4 pontos no total, até 2 por Antecedente.",
    "key": "medicina",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-tormento-33",
    "tipo": "tormento",
    "nome": "Vingança",
    "pagina": "28–29",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Conflito pessoal ligado a vingança. Quando o Tormento enriquecer a cena, a Juíza pode conceder Carta de Sina: refazer um teste ou reduzir dano em 1d6; também pode ser usada em duelo.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-tormento-34",
    "tipo": "tormento",
    "nome": "Vício",
    "pagina": "28–29",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Conflito pessoal ligado a vício. Quando o Tormento enriquecer a cena, a Juíza pode conceder Carta de Sina: refazer um teste ou reduzir dano em 1d6; também pode ser usada em duelo.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-tormento-35",
    "tipo": "tormento",
    "nome": "Doença",
    "pagina": "28–29",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Conflito pessoal ligado a doença. Quando o Tormento enriquecer a cena, a Juíza pode conceder Carta de Sina: refazer um teste ou reduzir dano em 1d6; também pode ser usada em duelo.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-tormento-36",
    "tipo": "tormento",
    "nome": "Fugindo",
    "pagina": "28–29",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Conflito pessoal ligado a fugindo. Quando o Tormento enriquecer a cena, a Juíza pode conceder Carta de Sina: refazer um teste ou reduzir dano em 1d6; também pode ser usada em duelo.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-tormento-37",
    "tipo": "tormento",
    "nome": "Segredo",
    "pagina": "28–29",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Conflito pessoal ligado a segredo. Quando o Tormento enriquecer a cena, a Juíza pode conceder Carta de Sina: refazer um teste ou reduzir dano em 1d6; também pode ser usada em duelo.",
    "mecanicaRevisada": true
  },
  {
    "id": "som6-tormento-38",
    "tipo": "tormento",
    "nome": "Dever",
    "pagina": "28–29",
    "fonte": "O Som das Seis — Livro Básico",
    "desc": "Conflito pessoal ligado a dever. Quando o Tormento enriquecer a cena, a Juíza pode conceder Carta de Sina: refazer um teste ou reduzir dano em 1d6; também pode ser usada em duelo.",
    "mecanicaRevisada": true
  }
];
export const TRESDET_LIBRARY=[
  {
    "id": "3det-vantagem-1",
    "tipo": "vantagem",
    "nome": "Aceleração",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-2",
    "tipo": "vantagem",
    "nome": "Acumulador",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-3",
    "tipo": "vantagem",
    "nome": "Ágil",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-4",
    "tipo": "vantagem",
    "nome": "Ajudante",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-5",
    "tipo": "vantagem",
    "nome": "Anulação",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "2 pt"
  },
  {
    "id": "3det-vantagem-6",
    "tipo": "vantagem",
    "nome": "Arena",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-7",
    "tipo": "vantagem",
    "nome": "Artefato",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-8",
    "tipo": "vantagem",
    "nome": "Ataque Especial",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-9",
    "tipo": "vantagem",
    "nome": "Base",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-10",
    "tipo": "vantagem",
    "nome": "Brutal",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-11",
    "tipo": "vantagem",
    "nome": "Carismático",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-12",
    "tipo": "vantagem",
    "nome": "Clone",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-13",
    "tipo": "vantagem",
    "nome": "Confusão",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-14",
    "tipo": "vantagem",
    "nome": "Cura",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-15",
    "tipo": "vantagem",
    "nome": "Defesa Especial",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-16",
    "tipo": "vantagem",
    "nome": "Desgaste",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-17",
    "tipo": "vantagem",
    "nome": "Devoto",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-18",
    "tipo": "vantagem",
    "nome": "Elo Mental",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-19",
    "tipo": "vantagem",
    "nome": "Estender",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-20",
    "tipo": "vantagem",
    "nome": "Famoso",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-21",
    "tipo": "vantagem",
    "nome": "Foco",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-22",
    "tipo": "vantagem",
    "nome": "Forte",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-23",
    "tipo": "vantagem",
    "nome": "Gênio",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-24",
    "tipo": "vantagem",
    "nome": "Golpe Final",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-25",
    "tipo": "vantagem",
    "nome": "Grimório",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-26",
    "tipo": "vantagem",
    "nome": "Ilusão",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "2 pt"
  },
  {
    "id": "3det-vantagem-27",
    "tipo": "vantagem",
    "nome": "Imitar",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-28",
    "tipo": "vantagem",
    "nome": "Imortal",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-29",
    "tipo": "vantagem",
    "nome": "Improviso",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "2 pt"
  },
  {
    "id": "3det-vantagem-30",
    "tipo": "vantagem",
    "nome": "Imune",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-31",
    "tipo": "vantagem",
    "nome": "Incorpóreo",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "2 pt"
  },
  {
    "id": "3det-vantagem-32",
    "tipo": "vantagem",
    "nome": "Inofensivo",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-33",
    "tipo": "vantagem",
    "nome": "Instrutor",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-34",
    "tipo": "vantagem",
    "nome": "Irresistível",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-35",
    "tipo": "vantagem",
    "nome": "Maestria",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-36",
    "tipo": "vantagem",
    "nome": "Magia",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "2 pt"
  },
  {
    "id": "3det-vantagem-37",
    "tipo": "vantagem",
    "nome": "Mana",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-38",
    "tipo": "vantagem",
    "nome": "Membros",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "2 pt"
  },
  {
    "id": "3det-vantagem-39",
    "tipo": "vantagem",
    "nome": "Mentor",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-40",
    "tipo": "vantagem",
    "nome": "Obstinado",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-41",
    "tipo": "vantagem",
    "nome": "Patrono",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-42",
    "tipo": "vantagem",
    "nome": "Resoluto",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-43",
    "tipo": "vantagem",
    "nome": "Telepata",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-44",
    "tipo": "vantagem",
    "nome": "Teleporte",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-45",
    "tipo": "vantagem",
    "nome": "Torcida",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-46",
    "tipo": "vantagem",
    "nome": "+Vida",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-47",
    "tipo": "vantagem",
    "nome": "Vigoroso",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-vantagem-48",
    "tipo": "vantagem",
    "nome": "Voo",
    "pagina": "42–63",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Vantagem do Livro Básico. Consulte efeitos, modificadores, requisitos e possíveis compras repetidas na referência.",
    "custo": "1 pt"
  },
  {
    "id": "3det-desvantagem-49",
    "tipo": "desvantagem",
    "nome": "Ambiente",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-50",
    "tipo": "desvantagem",
    "nome": "Amnésia",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–2pt"
  },
  {
    "id": "3det-desvantagem-51",
    "tipo": "desvantagem",
    "nome": "Antipático",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-52",
    "tipo": "desvantagem",
    "nome": "Atrapalhado",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-53",
    "tipo": "desvantagem",
    "nome": "Bateria",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-54",
    "tipo": "desvantagem",
    "nome": "Dependência",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–2pt"
  },
  {
    "id": "3det-desvantagem-55",
    "tipo": "desvantagem",
    "nome": "Diferente",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-56",
    "tipo": "desvantagem",
    "nome": "Elo Vital",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-57",
    "tipo": "desvantagem",
    "nome": "Fracote",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-58",
    "tipo": "desvantagem",
    "nome": "Frágil",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-59",
    "tipo": "desvantagem",
    "nome": "Fúria",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–2pt"
  },
  {
    "id": "3det-desvantagem-60",
    "tipo": "desvantagem",
    "nome": "Inapto",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-61",
    "tipo": "desvantagem",
    "nome": "Indeciso",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-62",
    "tipo": "desvantagem",
    "nome": "Infame",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-63",
    "tipo": "desvantagem",
    "nome": "Lento",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-64",
    "tipo": "desvantagem",
    "nome": "Monstruoso",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-65",
    "tipo": "desvantagem",
    "nome": "Munição",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-66",
    "tipo": "desvantagem",
    "nome": "Pobreza",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-67",
    "tipo": "desvantagem",
    "nome": "Ponto Fraco",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-68",
    "tipo": "desvantagem",
    "nome": "Protegido",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-69",
    "tipo": "desvantagem",
    "nome": "Sem Vida",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–2pt"
  },
  {
    "id": "3det-desvantagem-70",
    "tipo": "desvantagem",
    "nome": "Tapado",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-desvantagem-71",
    "tipo": "desvantagem",
    "nome": "Transtorno",
    "pagina": "64–74",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Desvantagem do Livro Básico. Revise suas limitações e os pontos recebidos; o saldo não é alterado automaticamente.",
    "valor": "–1pt"
  },
  {
    "id": "3det-arquetipo-72",
    "tipo": "arquetipo",
    "nome": "Aberrante",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-73",
    "tipo": "arquetipo",
    "nome": "Abissal",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-74",
    "tipo": "arquetipo",
    "nome": "Alien",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-75",
    "tipo": "arquetipo",
    "nome": "Anão",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-76",
    "tipo": "arquetipo",
    "nome": "Anfíbio",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-77",
    "tipo": "arquetipo",
    "nome": "Celestial",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-78",
    "tipo": "arquetipo",
    "nome": "Centauro",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "2 pt"
  },
  {
    "id": "3det-arquetipo-79",
    "tipo": "arquetipo",
    "nome": "Ciborgue",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "2 pt"
  },
  {
    "id": "3det-arquetipo-80",
    "tipo": "arquetipo",
    "nome": "Construto",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-81",
    "tipo": "arquetipo",
    "nome": "Dahllan",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-82",
    "tipo": "arquetipo",
    "nome": "Elfo",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-83",
    "tipo": "arquetipo",
    "nome": "Fada",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-84",
    "tipo": "arquetipo",
    "nome": "Fantasma",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "2 pt"
  },
  {
    "id": "3det-arquetipo-85",
    "tipo": "arquetipo",
    "nome": "Goblin",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-86",
    "tipo": "arquetipo",
    "nome": "Hynne",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-87",
    "tipo": "arquetipo",
    "nome": "Kallyanach",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "2 pt"
  },
  {
    "id": "3det-arquetipo-88",
    "tipo": "arquetipo",
    "nome": "Kemono",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-89",
    "tipo": "arquetipo",
    "nome": "Medusa",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-90",
    "tipo": "arquetipo",
    "nome": "Minotauro",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-91",
    "tipo": "arquetipo",
    "nome": "Ogro",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-arquetipo-92",
    "tipo": "arquetipo",
    "nome": "Osteon",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "2 pt"
  },
  {
    "id": "3det-arquetipo-93",
    "tipo": "arquetipo",
    "nome": "Qareen",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "2 pt"
  },
  {
    "id": "3det-arquetipo-94",
    "tipo": "arquetipo",
    "nome": "Sauroide",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "2 pt"
  },
  {
    "id": "3det-arquetipo-95",
    "tipo": "arquetipo",
    "nome": "Vampiro",
    "pagina": "75–102",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Arquétipo de personagem. Confira requisitos, vantagens ou limitações vinculadas no capítulo de Arquétipos.",
    "custo": "1 pt"
  },
  {
    "id": "3det-tecnica-96",
    "tipo": "tecnica",
    "nome": "Ás Indomável",
    "pagina": "143–150",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica truque do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Truque",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-97",
    "tipo": "tecnica",
    "nome": "Barreira Mística",
    "pagina": "143–150",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica truque do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Truque",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-98",
    "tipo": "tecnica",
    "nome": "Cancioneiro Popular",
    "pagina": "143–150",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica truque do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Truque",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-99",
    "tipo": "tecnica",
    "nome": "Grimório Debilitante",
    "pagina": "143–150",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica truque do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Truque",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-100",
    "tipo": "tecnica",
    "nome": "Grimório Irritante",
    "pagina": "143–150",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica truque do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Truque",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-101",
    "tipo": "tecnica",
    "nome": "Pequenos Desejos",
    "pagina": "143–150",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica truque do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Truque",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-102",
    "tipo": "tecnica",
    "nome": "Praga",
    "pagina": "143–150",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica truque do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Truque",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-103",
    "tipo": "tecnica",
    "nome": "Raio Místico",
    "pagina": "143–150",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica truque do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Truque",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-104",
    "tipo": "tecnica",
    "nome": "Absorver Mana",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-105",
    "tipo": "tecnica",
    "nome": "Área de Batalha",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-106",
    "tipo": "tecnica",
    "nome": "Bola de Fogo",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-107",
    "tipo": "tecnica",
    "nome": "Combo",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-108",
    "tipo": "tecnica",
    "nome": "Desprezo",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-109",
    "tipo": "tecnica",
    "nome": "Disparo de Energia",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-110",
    "tipo": "tecnica",
    "nome": "Consertar",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-111",
    "tipo": "tecnica",
    "nome": "Gambiarra",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-112",
    "tipo": "tecnica",
    "nome": "Golpe Púrpura",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-113",
    "tipo": "tecnica",
    "nome": "Inspirar",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-114",
    "tipo": "tecnica",
    "nome": "Invocar Elemental",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-115",
    "tipo": "tecnica",
    "nome": "Megalon",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-116",
    "tipo": "tecnica",
    "nome": "Mikron",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-117",
    "tipo": "tecnica",
    "nome": "Poeira Glacial",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-118",
    "tipo": "tecnica",
    "nome": "Queimar o Cosmo",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-119",
    "tipo": "tecnica",
    "nome": "Raio da Fúria",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-120",
    "tipo": "tecnica",
    "nome": "Rajada de Golpes",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-121",
    "tipo": "tecnica",
    "nome": "Relâmpago",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-122",
    "tipo": "tecnica",
    "nome": "Sabedoria dos Ermos",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-123",
    "tipo": "tecnica",
    "nome": "Setas Infalíveis de Petrovna",
    "pagina": "151–158",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica comum do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Comum",
    "custo": "10 XP"
  },
  {
    "id": "3det-tecnica-124",
    "tipo": "tecnica",
    "nome": "Abrir Chakra",
    "pagina": "159–166",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica lendária do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Lendária",
    "custo": "20 XP"
  },
  {
    "id": "3det-tecnica-125",
    "tipo": "tecnica",
    "nome": "Bomba Vital",
    "pagina": "159–166",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica lendária do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Lendária",
    "custo": "20 XP"
  },
  {
    "id": "3det-tecnica-126",
    "tipo": "tecnica",
    "nome": "Dim Mak",
    "pagina": "159–166",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica lendária do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Lendária",
    "custo": "20 XP"
  },
  {
    "id": "3det-tecnica-127",
    "tipo": "tecnica",
    "nome": "Megalon Superior",
    "pagina": "159–166",
    "fonte": "3DeT Victory — Livro Básico",
    "desc": "Técnica lendária do livro. Consulte os requisitos, custo em PM, duração e descrição da técnica.",
    "categoria": "Lendária",
    "custo": "20 XP"
  }
].concat(TRESDET_LIBRARY_EXTRAS).map(entry=>{
 const pacote=entry.tipo==='arquetipo'?TRESDET_ARCHETYPE_PACKAGES[entry.nome]:null;
 const rules=TRESDET_MECHANICS[entry.nome];
 return {
  ...entry,
  desc:pacote?'Inclui '+pacote.vantagens.map(x=>x.nome).join(', ')+'. Limitações: '+pacote.desvantagens.map(x=>x.nome).join(', ')+'.':(TRESDET_EXPLANATIONS[entry.nome]||entry.desc),
  ...(entry.tipo==='tecnica'?(TRESDET_TECH_USAGE[entry.nome]||{}):{}),
  ...(rules?{pagina:rules.pagina,mecanica:rules.mecanica||'',ativacao:rules.ativacao||''}:{}),
  ...(pacote?{pagina:pacote.pagina,vantagensArquetipo:pacote.vantagens,desvantagensArquetipo:pacote.desvantagens,observacaoArquetipo:pacote.observacao}:{}),
 };
}).concat(TRESDET_SKILL_ENTRIES);
export const SYSTEM_LIBRARIES={somdas6:{title:"O Som das Seis",entries:SOM6_LIBRARY,tabs:[["habilidade","Habilidades"],["antecedente","Antecedentes"],["tormento","Tormentos"]],source:"O Som das Seis — Livro Básico"},'3det':{title:"3DeT Victory",entries:TRESDET_LIBRARY,tabs:[["vantagem","Vantagens"],["desvantagem","Desvantagens"],["pericia","Perícias"],["arquetipo","Arquétipos"],["tecnica","Técnicas"]],source:"3DeT Victory — Livro Básico"}};
