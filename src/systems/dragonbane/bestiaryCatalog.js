import {DRAGONBANE_LIBRARY,dragonbaneAncestryKey} from './abilities.js';
// Índice das 63 criaturas do Bestiário Dragonbane v1.1 (Tria / Free League).
// Ações são listadas por títulos curtos para consulta e personalização; a
// descrição e a mecânica completa de cada ataque permanecem no livro original.
// PNJs mantêm o formato de ficha humana; os demais têm tabela de seis ataques.
const RECORDS=[
 {
  "nome": "Goblin",
  "pagina": 6,
  "grupo": "Notívagos",
  "tipo": "pnj",
  "movimento": "10",
  "pv": 9,
  "pd": 8,
  "armadura": "Couro (1) PD: 8",
  "variantes": [
   "BATEDOR",
   "GUERREIRO"
  ]
 },
 {
  "nome": "Hobgoblin",
  "pagina": 8,
  "grupo": "Notívagos",
  "tipo": "pnj",
  "movimento": "10",
  "pv": 9,
  "pd": 8,
  "armadura": "Couro (1) PD: 8",
  "variantes": [
   "BATEDOR",
   "GUERREIRO",
   "LADRÃO"
  ]
 },
 {
  "nome": "Ogro",
  "pagina": 10,
  "grupo": "Notívagos",
  "tipo": "pnj",
  "movimento": "10",
  "pv": 16,
  "pd": 12,
  "armadura": "Couro (1) PD: 12",
  "variantes": [
   "GUERREIRO"
  ]
 },
 {
  "nome": "Orc",
  "pagina": 12,
  "grupo": "Notívagos",
  "tipo": "pnj",
  "movimento": "10",
  "pv": 10,
  "pd": 9,
  "armadura": "Couro Batido (2) PD: 9",
  "variantes": [
   "GUERREIRO",
   "XAMÃ"
  ]
 },
 {
  "nome": "Anurídeo",
  "pagina": 16,
  "grupo": "Ancestralidades raras",
  "tipo": "pnj",
  "movimento": "10",
  "pv": 6,
  "pd": 10,
  "armadura": "Couro (1) PD: 10",
  "variantes": [
   "CAÇADOR",
   "XAMÃ"
  ]
 },
 {
  "nome": "Arbóreo",
  "pagina": 18,
  "grupo": "Ancestralidades raras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "8",
  "armadura": "6",
  "pv": "64",
  "ataques": [
   "Comando",
   "Morte de Cima",
   "Estocada de Lança",
   "Golpe Esmagador",
   "Para o Alto e Avante",
   "Enforcamento"
  ]
 },
 {
  "nome": "Centauro",
  "pagina": 20,
  "grupo": "Ancestralidades raras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "20",
  "armadura": "—",
  "pv": "28",
  "ataques": [
   "Coice",
   "Estocada de Lança",
   "Cascos Esmagadores",
   "Tiro Rápido",
   "Ataque de Impulsão",
   "Riso Zombeteiro"
  ]
 },
 {
  "nome": "Donzela-cisne",
  "pagina": 22,
  "grupo": "Ancestralidades raras",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Normal",
  "movimento": "14",
  "armadura": "—",
  "pv": "16",
  "ataques": [
   "Bater de Asas",
   "Ataque Bicador",
   "Canção do Cisne",
   "Bando de Cisnes",
   "Olhar Suplicante",
   "Dom dos Deuses"
  ]
 },
 {
  "nome": "Fada",
  "pagina": 24,
  "grupo": "Ancestralidades raras",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Pequeno",
  "movimento": "16",
  "armadura": "—",
  "pv": "6",
  "ataques": [
   "Provocação",
   "Alfinetadas",
   "Pó Cegante",
   "Bons Sonhos",
   "Beijo Encantado",
   "Flecha Mágica"
  ]
 },
 {
  "nome": "Felídeo",
  "pagina": 26,
  "grupo": "Ancestralidades raras",
  "tipo": "pnj",
  "movimento": "12",
  "pv": 8,
  "pd": 9,
  "armadura": "Couro (1) PD: 9",
  "variantes": [
   "CAÇADOR",
   "LADRÃO"
  ]
 },
 {
  "nome": "Harpia",
  "pagina": 28,
  "grupo": "Ancestralidades raras",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Normal",
  "movimento": "24",
  "armadura": "—",
  "pv": "12",
  "ataques": [
   "Gargalhada Ameaçadora",
   "Ataque Coordenado",
   "Morte de Cima",
   "Arrancar os Olhos",
   "Ataque em Massa",
   "Ataque de Excremento"
  ]
 },
 {
  "nome": "Karkion",
  "pagina": 30,
  "grupo": "Ancestralidades raras",
  "tipo": "pnj",
  "movimento": "12",
  "pv": 12,
  "pd": 14,
  "armadura": "— PD: 14"
 },
 {
  "nome": "Minotauro",
  "pagina": 32,
  "grupo": "Ancestralidades raras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "16",
  "armadura": "—",
  "pv": "32",
  "ataques": [
   "Punho de Touro",
   "Coice",
   "Chifrada em Corrida",
   "Trespassar",
   "Ataque de Amplitude",
   "Pisão"
  ]
 },
 {
  "nome": "Náiade",
  "pagina": 34,
  "grupo": "Ancestralidades raras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Normal",
  "movimento": "12",
  "armadura": "—",
  "pv": "24",
  "ataques": [
   "Estrangulamento",
   "Coração Partido",
   "Unhas Afiadas",
   "Ataque de Afogamento",
   "Canto Encantador",
   "Onda Marítima"
  ]
 },
 {
  "nome": "Reptídeo",
  "pagina": 36,
  "grupo": "Ancestralidades raras",
  "tipo": "pnj",
  "movimento": "10",
  "pv": 8,
  "pd": 8,
  "armadura": "— PD: 8",
  "variantes": [
   "CAÇADOR",
   "GUERREIRO"
  ]
 },
 {
  "nome": "Sátiro",
  "pagina": 38,
  "grupo": "Ancestralidades raras",
  "tipo": "pnj",
  "movimento": "10",
  "pv": 10,
  "pd": 12,
  "armadura": "— PD: 12"
 },
 {
  "nome": "Sereia",
  "pagina": 40,
  "grupo": "Ancestralidades raras",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Normal",
  "movimento": "14",
  "armadura": "—",
  "pv": "16",
  "ataques": [
   "Arremesso de Arpão",
   "Estocada de Lança",
   "Sorte da Pesca",
   "Ataque de Afogamento",
   "Ataque de Onda",
   "Redemoinho"
  ]
 },
 {
  "nome": "Aracnino",
  "pagina": 44,
  "grupo": "Insetoides",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Normal",
  "movimento": "16",
  "armadura": "—",
  "pv": "28",
  "ataques": [
   "Mordida Venenosa",
   "Olhos Demais",
   "Visão Agourenta",
   "Ferroada Venenosa",
   "Teia Pegajosa",
   "Olhos Hipnóticos"
  ]
 },
 {
  "nome": "Besourino",
  "pagina": 46,
  "grupo": "Insetoides",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Normal",
  "movimento": "12",
  "armadura": "6",
  "pv": "18",
  "ataques": [
   "Golpe Esmagador",
   "Golpe Duplo",
   "Mordida",
   "Chute Surpresa",
   "Cuspe Ácido",
   "Grito Ensurdecedor"
  ]
 },
 {
  "nome": "Formídeo",
  "pagina": 48,
  "grupo": "Insetoides",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Pequeno",
  "movimento": "14",
  "armadura": "2",
  "pv": "8",
  "ataques": [
   "Mordida Dolorosa",
   "Espada de Bronze",
   "Ataque Imobilizante",
   "Eletrocussão",
   "Dança Confusa",
   "Beijo Curativo"
  ]
 },
 {
  "nome": "Troll da Caverna",
  "pagina": 52,
  "grupo": "Trolls",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "12",
  "armadura": "2",
  "pv": "42",
  "ataques": [
   "Ataque Rolante",
   "Morcegos da Caverna",
   "Cabeçada",
   "Engolir",
   "Cuspe Dourado",
   "Arremesso de Troll"
  ]
 },
 {
  "nome": "Troll da Floresta",
  "pagina": 54,
  "grupo": "Trolls",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "12",
  "armadura": "—",
  "pv": "44",
  "ataques": [
   "Arrancar Árvores",
   "metros uma da outra sofrem 3D6 de dano contundente e são d",
   "Hálito Podre",
   "Buraco",
   "Pisão",
   "Clava Pesada"
  ]
 },
 {
  "nome": "Troll da Montanha",
  "pagina": 56,
  "grupo": "Trolls",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Grande",
  "movimento": "10",
  "armadura": "—",
  "pv": "42",
  "ataques": [
   "Cem Anos de Solidão",
   "Investida com Chifres",
   "Raízes Emaranhadoras",
   "Lapsos de Memória",
   "Visões Aterrorizantes",
   "Golpe de Amplitude"
  ]
 },
 {
  "nome": "Gigante da Floresta",
  "pagina": 60,
  "grupo": "Gigantes",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Grande",
  "movimento": "14",
  "armadura": "—",
  "pv": "56",
  "ataques": [
   "Amigos Mordedores",
   "Clava Esmagadora",
   "Colisão Corporal",
   "Abraço de Urso",
   "Arremesso Brutal",
   "Raízes Enlaçantes"
  ]
 },
 {
  "nome": "Gigante do Mar",
  "pagina": 62,
  "grupo": "Gigantes",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Enorme",
  "movimento": "20",
  "armadura": "—",
  "pv": "82",
  "ataques": [
   "Trovão e Relâmpago",
   "Arremesso de Rocha",
   "Lança Perfurante",
   "Investida Giratória",
   "Sorte da Pesca",
   "Ataque de Onda"
  ]
 },
 {
  "nome": "Gigante da Montanha",
  "pagina": 64,
  "grupo": "Gigantes",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Enorme",
  "movimento": "16",
  "armadura": "—",
  "pv": "78",
  "ataques": [
   "Golpe Esmagador",
   "Onde Você Foi",
   "Pisão",
   "Golpe de Amplitude",
   "Chega",
   "Arremesso de Pedra"
  ]
 },
 {
  "nome": "Titã",
  "pagina": 66,
  "grupo": "Gigantes",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Enorme",
  "movimento": "14",
  "armadura": "6",
  "pv": "64",
  "ataques": [
   "Golpe de Martelo",
   "Aríete",
   "Sai da Frente",
   "Sacudida Feroz",
   "Rugido Ensurdecedor",
   "Terremoto"
  ]
 },
 {
  "nome": "Ameba Gigante",
  "pagina": 70,
  "grupo": "Feras",
  "tipo": "monstro",
  "movimento": "8",
  "pv": "64",
  "armadura": "—",
  "ferocidade": 2,
  "tamanho": "Grande",
  "ataques": [
   "Ataque de Tentáculos",
   "Faces dos Mortos",
   "Roubo",
   "Bola de Lodo",
   "Nuvem de Veneno",
   "Absorção"
  ]
 },
 {
  "nome": "Aranha Gigante",
  "pagina": 72,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Normal",
  "movimento": "24",
  "armadura": "—",
  "pv": "36",
  "ataques": [
   "Mandíbulas",
   "Ataque de Rasgar",
   "Olhos Hipnotizantes",
   "Ferroada Venenosa",
   "Ataque de Teia",
   "Ataque de Impulsão"
  ]
 },
 {
  "nome": "Basilisco",
  "pagina": 74,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "16",
  "armadura": "6",
  "pv": "38",
  "ataques": [
   "Ataque Cortante",
   "Bicar",
   "Cocoricó",
   "Ataque de Chicote",
   "Nuvem de Veneno",
   "Olhar Petrificante"
  ]
 },
 {
  "nome": "Calidão",
  "pagina": 76,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "14",
  "armadura": "—",
  "pv": "52",
  "ataques": [
   "Investida",
   "Presas Perfurantes",
   "Cascos Esmagadores",
   "Ataque Arremessador",
   "Grunhido Odioso",
   "Sopro de Fogo"
  ]
 },
 {
  "nome": "Cavalo-do-Riacho",
  "pagina": 78,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "24",
  "armadura": "—",
  "pv": "34",
  "ataques": [
   "Coice",
   "Mordida Voraz",
   "Cascos Esmagadores",
   "Olhar Odioso",
   "Afogamento",
   "Cavalgada Selvagem"
  ]
 },
 {
  "nome": "Grifo",
  "pagina": 80,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "30",
  "armadura": "—",
  "pv": "38",
  "ataques": [
   "Bico Afiado",
   "Golpe Angustiante",
   "Garras em Amplitude",
   "Lançamento",
   "Redemoinho",
   "Queda Alta"
  ]
 },
 {
  "nome": "Hidra",
  "pagina": 82,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Grande",
  "movimento": "8",
  "armadura": "3",
  "pv": "10/",
  "ataques": [
   "Mordida Rápida",
   "Cuspe Venenoso",
   "Garras Rasgantes",
   "Ataque de Cauda",
   "Golpe Esmagador",
   "Sopro Tóxico"
  ]
 },
 {
  "nome": "Hipogrifo",
  "pagina": 84,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "24",
  "armadura": "—",
  "pv": "36",
  "ataques": [
   "Coice",
   "Bico Afiado",
   "Corte Angustiante",
   "Bater de Asas",
   "Chamado de Caça",
   "Queda Longa"
  ]
 },
 {
  "nome": "Lobisomem",
  "pagina": 86,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Normal",
  "movimento": "16",
  "armadura": "—",
  "pv": "32",
  "ataques": [
   "Uivo Furioso",
   "Garras Rasgantes",
   "Mandíbulas Salivantes",
   "Ataque Surpresa",
   "Arremesso Brutal",
   "Frenesi"
  ]
 },
 {
  "nome": "Mantícora",
  "pagina": 88,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "16",
  "armadura": "—",
  "pv": "44",
  "ataques": [
   "Golpe de Cauda",
   "Mordida Afiada",
   "Ataque de Garra",
   "Ataque de Amplitude",
   "Investida Esmagadora",
   "Chuva de Espinhos"
  ]
 },
 {
  "nome": "Medusa",
  "pagina": 90,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Normal",
  "movimento": "12",
  "armadura": "—",
  "pv": "36",
  "ataques": [
   "Mordida de Cobra",
   "Línguas de Cobra",
   "Punhos de Bronze",
   "Para o Alto",
   "Lufada de Vento",
   "Olhar Petrificante"
  ]
 },
 {
  "nome": "Pégaso",
  "pagina": 92,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "30",
  "armadura": "—",
  "pv": "32",
  "ataques": [
   "Coice",
   "Mordida de Cavalo",
   "Cascos Esmagadores",
   "Redemoinho",
   "Mergulho",
   "Golpe Mental"
  ]
 },
 {
  "nome": "Polvo Gigante",
  "pagina": 94,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 4,
  "tamanho": "Grande",
  "movimento": "16",
  "armadura": "3",
  "pv": "32",
  "ataques": [
   "Desarmar",
   "Abraço Esmagador",
   "Golpe de Tentáculo",
   "Afogamento",
   "Devorar",
   "metros e o engole inteiro"
  ]
 },
 {
  "nome": "Quimera",
  "pagina": 96,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 3,
  "tamanho": "Grande",
  "movimento": "14",
  "armadura": "—",
  "pv": "42",
  "ataques": [
   "Ataque de Garra",
   "Boca de Leão",
   "Cabeça de Cabra",
   "Mordida de Cobra",
   "Tudo Junto",
   "Cacofonia"
  ]
 },
 {
  "nome": "Roca",
  "pagina": 98,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Enorme",
  "movimento": "28",
  "armadura": "—",
  "pv": "80",
  "ataques": [
   "Ataque de Garra",
   "Ataque Bicador",
   "Grito Perfurante",
   "Golpe de Asa",
   "Lufada de Vento",
   "Queda Alta"
  ]
 },
 {
  "nome": "Serpente Marinha",
  "pagina": 100,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Normal/Grande/Enorme",
  "movimento": "18",
  "armadura": "1/3/5",
  "pv": "40/56/72",
  "ataques": [
   "Golpe de Cauda",
   "Devorar",
   "Mordida Feroz",
   "Afogamento",
   "Golpe Esmagador",
   "Constringir"
  ]
 },
 {
  "nome": "Worg",
  "pagina": 102,
  "grupo": "Feras",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Normal",
  "movimento": "20",
  "armadura": "—",
  "pv": "18",
  "ataques": [
   "Uivo Voraz",
   "Bufada Fétida",
   "Mordida de Worg",
   "Investida",
   "Arrasto da Morte",
   "Sacudida Mortal"
  ]
 },
 {
  "nome": "Carniçal",
  "pagina": 106,
  "grupo": "Mortos-vivos",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Normal",
  "movimento": "10",
  "armadura": "—",
  "pv": "16",
  "ataques": [
   "Cuspe Repugnante",
   "Clava de Ossos",
   "Garras Dilacerantes",
   "Mordida Infectada",
   "Dilacerar, Morder e Golpear",
   "Grito dos Mortos"
  ]
 },
 {
  "nome": "Esqueleto",
  "pagina": 108,
  "grupo": "Mortos-vivos",
  "tipo": "pnj",
  "movimento": "8",
  "pv": 8,
  "pd": 15,
  "armadura": "Couro batido (2)",
  "variantes": [
   "GUERREIRO"
  ]
 },
 {
  "nome": "Fantasma",
  "pagina": 110,
  "grupo": "Mortos-vivos",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Normal",
  "movimento": "12",
  "armadura": "—",
  "pv": "27",
  "ataques": [
   "Golpe Fantasma",
   "Toque da Morte",
   "Grito Fantasma",
   "Olhar da Morte",
   "Abraço Fantasmagórico",
   "Golpe Frio"
  ]
 },
 {
  "nome": "Fogo-fátuo",
  "pagina": 112,
  "grupo": "Mortos-vivos",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Pequeno",
  "movimento": "16",
  "armadura": "—",
  "pv": "12",
  "ataques": [
   "Buraco",
   "Pesadelos",
   "Cabeçada Espectral",
   "Luz Cegante",
   "Agonia Mortal",
   "Controle"
  ]
 },
 {
  "nome": "Meio-vivo",
  "pagina": 114,
  "grupo": "Mortos-vivos",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Normal",
  "movimento": "6",
  "armadura": "—",
  "pv": "9",
  "ataques": [
   "Cabeçada",
   "Ataque de Garras",
   "Mordida Infectada",
   "Vômito Repugnante",
   "Abraço do Morto-Vivo",
   "Fome Avassaladora"
  ]
 },
 {
  "nome": "Múmia",
  "pagina": 116,
  "grupo": "Mortos-vivos",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Normal",
  "movimento": "6",
  "armadura": "—",
  "pv": "42",
  "ataques": [
   "Maldição",
   "Golpe Duplo",
   "Enxame de Insetos",
   "Arremesso Mortal",
   "Estrangulamento",
   "Coração Partido"
  ]
 },
 {
  "nome": "Vampiro",
  "pagina": 118,
  "grupo": "Mortos-vivos",
  "tipo": "monstro",
  "movimento": "16",
  "pv": "32",
  "armadura": "—",
  "ferocidade": 2,
  "tamanho": "Normal",
  "ataques": [
   "Maldição",
   "Golpe Duplo",
   "Enxame de Insetos",
   "Arremesso Mortal",
   "Estrangulamento",
   "Coração Partido"
  ]
 },
 {
  "nome": "Vulto",
  "pagina": 120,
  "grupo": "Mortos-vivos",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Normal",
  "movimento": "10",
  "armadura": "Igual à armadura",
  "pv": "38",
  "ataques": [
   "Rugido Profano",
   "Olhar Pavoroso",
   "Mão dos Mortos",
   "Ataque de Amplitude",
   "Frio Incapacitante",
   "Ataque Poderoso"
  ]
 },
 {
  "nome": "Dragão Filhote",
  "pagina": 124,
  "grupo": "Dragões",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Normal",
  "movimento": "16",
  "armadura": "2",
  "pv": "36",
  "ataques": [
   "Grito de Dragão",
   "Ataque de Garra",
   "Ataque de Impulsão",
   "Golpe de Cauda",
   "Mordida Dracônica",
   "Fumaça Tóxica"
  ]
 },
 {
  "nome": "Dragão Jovem",
  "pagina": 126,
  "grupo": "Dragões",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "24",
  "armadura": "4",
  "pv": "60",
  "ataques": [
   "Rugido Dracônico",
   "Ataque de Garra",
   "Lufada de Vento",
   "Golpe de Cauda",
   "Mordida Dracônica",
   "Sopro de Fogo"
  ]
 },
 {
  "nome": "Dragão Adulto",
  "pagina": 128,
  "grupo": "Dragões",
  "tipo": "monstro",
  "ferocidade": 3,
  "tamanho": "Enorme",
  "movimento": "24",
  "armadura": "6",
  "pv": "84",
  "ataques": [
   "Rugido Dracônico",
   "Ataque de Garra",
   "Vento Dracônico",
   "Golpe de Cauda",
   "Mordida Dracônica",
   "Sopro de Fogo"
  ]
 },
 {
  "nome": "Dragão Ancião",
  "pagina": 130,
  "grupo": "Dragões",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Enorme",
  "movimento": "20",
  "armadura": "8",
  "pv": "108",
  "ataques": [
   "Rugido Dracônico",
   "Ataque de Garra",
   "Tempestade Dracônica",
   "Cauda Esmagadora",
   "Mordida Dracônica",
   "Conflagração"
  ]
 },
 {
  "nome": "Lindorme",
  "pagina": 132,
  "grupo": "Dragões",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "18",
  "armadura": "6",
  "pv": "64",
  "ataques": [
   "Rugido Sibilante",
   "Ataque de Garra",
   "Espinhos Dorsais",
   "Abraço Mortal",
   "Mordida Voraz",
   "Ataque Devorador"
  ]
 },
 {
  "nome": "Demônio do Caos",
  "pagina": 136,
  "grupo": "Demônios",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Normal",
  "movimento": "12",
  "armadura": "2",
  "pv": "36",
  "ataques": [
   "Espada Rúnica",
   "Ataque de Chifres",
   "Sibilar Ameaçador",
   "Picada de Escorpião",
   "Força Invisível",
   "Cuspe Ácido"
  ]
 },
 {
  "nome": "Demônio do Fogo",
  "pagina": 138,
  "grupo": "Demônios",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "18",
  "armadura": "—",
  "pv": "64",
  "ataques": [
   "Cajado Abrangente",
   "Diabretes",
   "Mangual Flamejante",
   "Redemoinho de Fogo",
   "Chute Esmagador",
   "Sopro de Fogo"
  ]
 },
 {
  "nome": "Demônio Guardião",
  "pagina": 140,
  "grupo": "Demônios",
  "tipo": "monstro",
  "ferocidade": 1,
  "tamanho": "Normal",
  "movimento": "14",
  "armadura": "2",
  "pv": "28",
  "ataques": [
   "Rasteira de Lança",
   "Golpe de Escudo",
   "Estocada Paralisante",
   "Chifres Empaladores",
   "Corda Enroscante",
   "Teletransporte"
  ]
 },
 {
  "nome": "Demônio do Sangue",
  "pagina": 142,
  "grupo": "Demônios",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "14",
  "armadura": "2",
  "pv": "48",
  "ataques": [
   "Sede de Sangue",
   "Rugido Aterrorizante",
   "Garras Venenosas",
   "Grito Ensurdecedor",
   "Queda Longa",
   "Sangue Fervente"
  ]
 },
 {
  "nome": "Demônio das Sombras",
  "pagina": 144,
  "grupo": "Demônios",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "12",
  "armadura": "—",
  "pv": "54",
  "ataques": [
   "Ataque de Ansiedade",
   "Mordida Psíquica",
   "Abraço Sombrio",
   "Dúvida",
   "Comando",
   "Visões de Estrelas"
  ]
 },
 {
  "nome": "Golem",
  "pagina": 146,
  "grupo": "Demônios",
  "tipo": "monstro",
  "ferocidade": 2,
  "tamanho": "Grande",
  "movimento": "8",
  "armadura": "6",
  "pv": "64",
  "ataques": [
   "Rajada Selvagem",
   "Cabeça Dura",
   "Arremesso de Pedra",
   "Estrondo",
   "Soco Potente",
   "Terremoto"
  ]
 }
];
export const GRUPOS_DRAGONBANE_BESTIARIO=[...new Set(RECORDS.map(x=>x.grupo))];
const blankAttacks=Array.from({length:6},(_,i)=>({id:i+1,descricao:'Ataque '+(i+1)+' — consulte o Bestiário para os efeitos.'}));
const entry=(row)=>{
 const base={id:'',system:'dragonbane',nome:row.nome,
  fonte:'Dragonbane — Bestiário v1.1',pagina:row.pagina,grupo:row.grupo,
  categoria:row.tipo==='pnj'?'NPC':'Monstro',
  descricao:'Modelo de consulta do Bestiário Dragonbane v1.1, página '+row.pagina+'. Edite livremente antes de salvar.',
  notas:'Fonte: Dragonbane Bestiário v1.1, p. '+row.pagina+'. Regras detalhadas, efeitos e variantes devem ser consultados no livro.'
 };
 if(row.tipo==='pnj')return {...base,type:'pnj',tipoPnj:'lacaio',
  ancestralidade:row.nome,profissao:'',movimento:row.movimento,
  danoBonus:'',armaduraTipica:{nome:row.armadura,valor:''},
  status:{pv:{atual:row.pv,max:row.pv},pd:{atual:row.pd,max:row.pd}},
  pericias:[],feiticos:[],armas:[],equipamento:'',atitude:'',motivacao:'',tracoMarcante:'',
  notas:base.notas+(row.pv===0?'\nFicha de PNJ: PV não confirmado na leitura, preencha consultando o livro.':'')+
   (row.variantes?.length?'\nPerfis possíveis: '+row.variantes.join(', '):'')};
 const max=Number(row.pv.split('/')[0])||0;
 const arm=row.armadura==='—'?'':row.armadura;
 return {...base,type:'ameaca',ferocidade:row.ferocidade,tamanho:row.tamanho.split('/')[0],
  movimento:String(row.movimento),armadura:arm,status:{pv:{atual:max,max}},
  habilidades:[
   ...(row.pv.includes('/')?[{nome:'Variações',desc:'PV no livro: '+row.pv+'. Verifique a versão/tamanho na página.'}]:[]),
   ...(row.tamanho.includes('/')?[{nome:'Tamanhos',desc:'Escalas disponíveis: '+row.tamanho+'.'}]:[]),
   ...(row.armadura.includes('/')?[{nome:'Armadura por porte',desc:'Valores do manual: '+row.armadura+'.'}]:[])
  ],
  ataques:row.ataques.map((nome,i)=>({id:i+1,descricao:nome+' — consulte o livro para resolução e dano (p. '+row.pagina+').'}))};
};
const PROFILES=[["Goblin","Batedor",10,9,8,"Couro",1,"—","Evasão:10,Furtividade:12,Percepção:10","Arco curto:12:D10,Espada curta:10:D10"],["Goblin","Guerreiro",10,10,8,"Couro batido",2,"—","Evasão:10,Furtividade:12,Percepção:10","Lança longa:12:2D8"],["Hobgoblin","Batedor",10,9,8,"Couro",1,"—","Evasão:12,Furtividade:14,Percepção:12","Arco curto:10:D10,Adaga:8:D8"],["Hobgoblin","Guerreiro",10,12,8,"Couro batido",2,"—","Evasão:10,Furtividade:10,Percepção:10","Lança curta:10:D10","","Escudo pequeno"],["Ogro","Guerreiro",10,16,12,"Couro",1,"FOR +D6","Briga:12,Evasão:6,Percepção:8","Clava de madeira grande:10:2D8"],["Ogro","Chefe",10,24,16,"Couro batido",2,"FOR +D6","Briga:14,Evasão:8,Percepção:12","Martelo de guerra pesado:12:2D10","Veterano,Robusto","Robusto ×4"],["Orc","Guerreiro",10,12,9,"Couro batido",2,"FOR +D4","Evasão:8,Percepção:10","Cimitarra:12:2D6"],["Orc","Xamã",10,10,16,"",0,"—","Animismo:14,Evasão:8,Percepção:12","Cajado:10:D8","Clarão Lampejante,Raízes Enredantes,Tratar Ferimento"],["Anurídeo","Caçador",12,8,10,"Couro",1,"AGL +D4","Acrobatismo:14,Furtividade:10,Percepção:8","Lança curta:10:D10,Arco curto:12:D10"],["Anurídeo","Xamã",10,6,12,"",0,"—","Acrobatismo:12,Animismo:12,Cura:10,Evasão:8,Furtividade:8","Cajado:8:D8","Clarão Lampejante,Encantador de Animais,Raízes Enredantes,Tratar Ferimento,Sono"],["Felídeo","Caçador",12,8,9,"Couro",1,"AGL +D4","Acrobatismo:14,Percepção:12,Furtividade:14","Lança curta:14:D10,Arco curto:12:D10"],["Felídeo","Ladrão",12,8,9,"",0,"AGL +D4","Evasão:12,Furtividade:14,Percepção:14,Prestidigitação:12","Adaga:14:D8,Estilingue:10:D8"],["Karkion","Estudioso",12,12,14,"",0,"AGL +D4","Cura:10,Encontrar:12,Evasão:12,Furtividade:12,Idiomas:14,Mitos e Lendas:14,Percepção:14,Saber de Feras:14","Espada curta:12:D10,Arco curto:14:D10"],["Karkion","Mago",12,12,16,"",0,"AGL +D4","Animismo:14,Evasão:12,Furtividade:12,Mitos e Lendas:12","Cajado:12:D8","Banimento,Canto dos Pássaros,Cozinhar Alimentos,Curar Ferimento,Encantador de Animais,Floresta Engalfinhadora,Relâmpago,Sono"],["Reptídeo","Caçador",12,9,8,"",0,"AGL +D4","Evasão:14,Furtividade:14,Percepção:12","Arco curto:12:D10,Adaga:10:D8"],["Reptídeo","Guerreiro",10,10,8,"",0,"FOR +D4","Percepção:12,Evasão:12,Furtividade:10","Lança curta:12:D10,Estilingue:10:D8","","Escudo pequeno"],["Reptídeo","Mago",10,8,14,"",0,"—","Animismo:12,Cura:10,Evasão:12,Furtividade:12","Faca:10:D8","Banimento,Clarão Lampejante,Curar Ferimento,Encantador de Animais,Floresta Engalfinhadora,Sono"],["Sátiro","Bardo",10,10,12,"",0,"—","Blefe:10,Evasão:10,Performance:14,Persuasão:12","Lança curta:10:D10"]];
const abilityFor=(name,kind)=>{const x=DRAGONBANE_LIBRARY.find(e=>e.nome===name&&(!kind||e.tipo===kind));return {nome:name,desc:x?x.fv_nvl+' · '+x.desc+' · '+x.fonte+' p. '+x.pagina:'Consulte a referência do livro.'};};
const profile=(base,p,variant)=>{const [ancestralidade,profissao,mov,pv,pd,arm,valor,bonus,skills,weapons,magic='',equipamento='']=p;const innate=DRAGONBANE_LIBRARY.filter(x=>x.tipo==='inata'&&x.ancestralidade===dragonbaneAncestryKey(ancestralidade)).map(x=>abilityFor(x.nome,'inata'));return {...base,nome:variant?ancestralidade+' — '+profissao:ancestralidade,ancestralidade,profissao,tipoPnj:profissao==='Chefe'?'chefe':'lacaio',movimento:String(mov),danoBonus:bonus,armaduraTipica:{nome:arm,valor:String(valor)},status:{pv:{atual:pv,max:pv},pd:{atual:pd,max:pd}},pericias:skills.split(',').map(x=>{const [nome,valor]=x.split(':');return {nome,valor:Number(valor)}}),armas:weapons.split(',').map(x=>{const [nome,pericia,dano]=x.split(':');return {nome,pericia:Number(pericia),dano}}),feiticos:[...innate,...(magic?magic.split(',').map(n=>abilityFor(n)):[])],equipamento};};
export const MODELOS_DRAGONBANE_BESTIARIO=RECORDS.map(row=>{const base=entry(row);const p=PROFILES.find(x=>x[0]===row.nome);return p?profile(base,p,false):base;});
export const MODELOS_DRAGONBANE_VARIANTES=PROFILES.map(p=>profile(entry(RECORDS.find(x=>x.nome===p[0])),p,true));
const soloBase={id:'',system:'dragonbane',type:'pnj',categoria:'NPC',grupo:'Sozinho em Fenda de Quedafunda',fonte:'Sozinho em Fenda de Quedafunda v1.1',pagina:3,ancestralidade:'',profissao:'',atitude:'',motivacao:'',tracoMarcante:'',feiticos:[],equipamento:'',danoBonus:'—'};
const soloRoles={
 'Corpo a corpo':'1–3: ataque normal. 4: se PJ ainda não agiu, troca iniciativa e defende com dádiva; se não houver ataque ou já atacou, ataque com revés. 5: ataque com dádiva, +D6 e derruba; PJ recebe dádiva contra PNJ até próximo turno. 6: teste de VON do PJ contra medo.',
 'À distância':'1–3: disparo normal. 4: prepara disparo; próximo turno acerto automático salvo defesa. 5: dois ataques com revés. 6: ataque com revés, +2D6 se acertar.',
 'Furtivo':'1–3: ataque com arma atual. 4: muda distância/arma, próximo ataque com dádiva. 5: PJ testa INT livre; sucesso permite defesa com dádiva, falha acerto automático sem defesa e +D6. 6: esconde-se; PJ testa Percepção livre; falha permite acerto automático sem defesa e +2D6 no próximo turno.',
 'Mágico':'1–3: projétil 2D6 contra um alvo. 4: explosão 3D6 contra alvos até 10 m. 5: escudo reduz 2D6, manutenção por teste livre a cada rodada; uso adicional +D6. 6: determine efeito pela tabela de inspiração p. 3. Magia abstrata sem PD.'};
export const MODELOS_DRAGONBANE_SOLO=[...['Lacaio','Chefe'].flatMap((rank,i)=>Object.entries(soloRoles).map(([role,desc])=>({...soloBase,nome:rank+' solo — '+role,tipoPnj:i?'chefe':'lacaio',profissao:role,pagina:'3–4',movimento:i?'12':'10',armaduraTipica:{nome:i?'Armadura':'—',valor:i?'4':'0'},status:{pv:{atual:i?20:12,max:i?20:12},pd:{atual:0,max:0}},pericias:[{nome:'Perícias relevantes',valor:i?15:12},{nome:'Outras perícias',valor:i?8:6}],armas:[{nome:'Ataque típico',pericia:i?15:12,dano:i?'2D8':'2D6'}],descricao:'Modelo simples; atributos '+(i?14:10)+'. Sem habilidades heroicas ou PD. Teste ataques salvo exceção expressa.',notas:'Tabela D6 de ações do PNJ, p. 4: '+desc}))),{...soloBase,nome:'Ingolfr Pedrolho',pagina:6,tipoPnj:'chefe',movimento:'12',danoBonus:'FOR +D4',armaduraTipica:{nome:'—',valor:'0'},status:{pv:{atual:16,max:16},pd:{atual:14,max:14}},pericias:[{nome:'Cura',valor:10},{nome:'Mitos e Lendas',valor:14},{nome:'Percepção',valor:14}],armas:[{nome:'Triturademo',pericia:16,dano:'2D8 (+D6 contra demônios)'}],feiticos:[abilityFor('Olho de Águia'),abilityFor('Veterano')],descricao:'Vigia a Fenda de Quedafunda a partir de uma capela abandonada.',notas:'PNJ da aventura solo, p. 6.'}];
