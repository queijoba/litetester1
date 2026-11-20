import {initial3DetThreatData} from './threatData.js';
import {TRESDET_SKILLS} from './data.js';

// Catálogo de consulta do Manual Básico 3DeT Victory (2024).
// Nomes, pontos e atributos são referências de jogo; textos longos do livro
// não são reproduzidos. Use o original para consultar efeitos completos.
const RECORDS=[
 {
  "nome": "Gente Normal",
  "pontos": 5,
  "atributos": [
   1,
   2,
   1
  ],
  "grupo": "Comuns",
  "categoria": "NPC",
  "papel": "Comum",
  "pagina": 211,
  "escala": "Ningen",
  "adaptacao": true,
  "pericias": "Saber",
  "vantagens": "",
  "desvantagens": "",
  "tecnicas": ""
 },
 {
  "nome": "Animal",
  "pontos": 9,
  "atributos": [
   2,
   2,
   2
  ],
  "grupo": "Comuns",
  "categoria": "Animal",
  "papel": "Comum",
  "pagina": 212,
  "escala": "Ningen",
  "adaptacao": true,
  "pericias": "Percepção",
  "vantagens": "Sentido Aguçado",
  "desvantagens": "Diferente, Inculto",
  "tecnicas": ""
 },
 {
  "nome": "Bandidos Chulé",
  "pontos": 4,
  "atributos": [
   1,
   2,
   1
  ],
  "grupo": "Comuns",
  "categoria": "NPC",
  "papel": "Capanga",
  "pagina": 212,
  "escala": "Ningen",
  "adaptacao": true,
  "pericias": "Manha",
  "vantagens": "Aceleração",
  "desvantagens": "Infame",
  "tecnicas": ""
 },
 {
  "nome": "Brutamontes",
  "pontos": 7,
  "atributos": [
   4,
   1,
   2
  ],
  "grupo": "Comuns",
  "categoria": "NPC",
  "papel": "Rival",
  "pagina": 212,
  "escala": "Ningen",
  "adaptacao": true,
  "pericias": "Luta",
  "vantagens": "",
  "desvantagens": "Tapado",
  "tecnicas": ""
 },
 {
  "nome": "Guardiões",
  "pontos": 8,
  "atributos": [
   2,
   2,
   2
  ],
  "grupo": "Comuns",
  "categoria": "NPC",
  "papel": "Especialista",
  "pagina": 212,
  "escala": "Ningen",
  "adaptacao": true,
  "pericias": "Luta",
  "vantagens": "Patrono, Defesa Especial",
  "desvantagens": "Código",
  "tecnicas": ""
 },
 {
  "nome": "Nobres Ricos",
  "pontos": 7,
  "atributos": [
   2,
   2,
   1
  ],
  "grupo": "Comuns",
  "categoria": "NPC",
  "papel": "Especialista",
  "pagina": 212,
  "escala": "Ningen",
  "adaptacao": true,
  "pericias": "Influência",
  "vantagens": "Riqueza",
  "desvantagens": "Código",
  "tecnicas": ""
 },
 {
  "nome": "Religiosos",
  "pontos": 7,
  "atributos": [
   2,
   1,
   2
  ],
  "grupo": "Comuns",
  "categoria": "NPC",
  "papel": "Especialista",
  "pagina": 212,
  "escala": "Ningen",
  "adaptacao": true,
  "pericias": "Saber",
  "vantagens": "Devoto, Cura",
  "desvantagens": "Código",
  "tecnicas": ""
 },
 {
  "nome": "Malha Justa",
  "pontos": 2,
  "atributos": [
   1,
   1,
   0
  ],
  "grupo": "Grunts",
  "categoria": "NPC",
  "papel": "Capanga",
  "pagina": 213,
  "escala": "Ningen",
  "adaptacao": true,
  "pericias": "Luta",
  "vantagens": "",
  "desvantagens": "Inculto",
  "tecnicas": ""
 },
 {
  "nome": "Funcionário do Mês",
  "pontos": 4,
  "atributos": [
   2,
   2,
   1
  ],
  "grupo": "Grunts",
  "categoria": "NPC",
  "papel": "Capanga",
  "pagina": 213,
  "escala": "Ningen",
  "adaptacao": true,
  "pericias": "Luta",
  "vantagens": "",
  "desvantagens": "Monstruoso",
  "tecnicas": ""
 },
 {
  "nome": "Técnico",
  "pontos": 2,
  "atributos": [
   0,
   2,
   0
  ],
  "grupo": "Grunts",
  "categoria": "NPC",
  "papel": "Comum",
  "pagina": 213,
  "escala": "Ningen",
  "adaptacao": true,
  "pericias": "Máquinas",
  "vantagens": "",
  "desvantagens": "Atrapalhado",
  "tecnicas": ""
 },
 {
  "nome": "Kobold",
  "pontos": 1,
  "atributos": [
   1,
   1,
   0
  ],
  "grupo": "Mini-bestiário",
  "categoria": "Monstro",
  "papel": "Capanga",
  "pagina": 216,
  "escala": "Ningen",
  "adaptacao": false,
  "pericias": "",
  "vantagens": "Alcance",
  "desvantagens": "Diferente, Inculto",
  "tecnicas": ""
 },
 {
  "nome": "Horda Kobold",
  "pontos": 7,
  "atributos": [
   2,
   2,
   1
  ],
  "grupo": "Mini-bestiário",
  "categoria": "Monstro",
  "papel": "Rival",
  "pagina": 216,
  "escala": "Ningen",
  "adaptacao": false,
  "pericias": "Luta",
  "vantagens": "Alcance, +Vida ×2",
  "desvantagens": "Diferente, Inculto",
  "tecnicas": "",
  "stats": [
   2,
   0,
   15
  ]
 },
 {
  "nome": "Monstro da Poluição",
  "pontos": 9,
  "atributos": [
   4,
   1,
   3
  ],
  "grupo": "Mini-bestiário",
  "categoria": "Monstro",
  "papel": "Rival",
  "pagina": 216,
  "escala": "Ningen",
  "adaptacao": false,
  "pericias": "Luta",
  "vantagens": "Imune (Doenças)",
  "desvantagens": "Ponto Fraco, Restrição (Luz)",
  "tecnicas": ""
 },
 {
  "nome": "Fera-Cactus",
  "pontos": 9,
  "atributos": [
   3,
   2,
   2
  ],
  "grupo": "Mini-bestiário",
  "categoria": "Monstro",
  "papel": "Rival",
  "pagina": 217,
  "escala": "Ningen",
  "adaptacao": false,
  "pericias": "Luta",
  "vantagens": "Alcance, Sentido",
  "desvantagens": "Fraqueza (Fogo), Monstruoso",
  "tecnicas": ""
 },
 {
  "nome": "Basilisco",
  "pontos": 14,
  "atributos": [
   5,
   2,
   5
  ],
  "grupo": "Mini-bestiário",
  "categoria": "Monstro",
  "papel": "Chefe",
  "pagina": 217,
  "escala": "Ningen",
  "adaptacao": false,
  "pericias": "Luta",
  "vantagens": "Desgaste, Paralisia, Sentido",
  "desvantagens": "Monstruoso",
  "tecnicas": ""
 },
 {
  "nome": "Kaiju",
  "pontos": 34,
  "atributos": [
   9,
   4,
   8
  ],
  "grupo": "Mini-bestiário",
  "categoria": "Monstro",
  "papel": "Chefe",
  "pagina": 218,
  "escala": "Kiodai",
  "adaptacao": false,
  "pericias": "Luta",
  "vantagens": "Alcance, Ataque Especial, Defesa Especial, Imune, Regeneração",
  "desvantagens": "Diferente, Inculto, Monstruoso",
  "tecnicas": ""
 },
 {
  "nome": "Arauto",
  "pontos": 10,
  "atributos": [
   3,
   2,
   2
  ],
  "grupo": "Generais",
  "categoria": "Vilão",
  "papel": "Rival",
  "pagina": 218,
  "escala": "Ningen",
  "adaptacao": false,
  "pericias": "Luta",
  "vantagens": "Ataque Especial",
  "desvantagens": "",
  "tecnicas": ""
 },
 {
  "nome": "Braço Direito",
  "pontos": 20,
  "atributos": [
   5,
   3,
   4
  ],
  "grupo": "Generais",
  "categoria": "Vilão",
  "papel": "Chefe",
  "pagina": 219,
  "escala": "Ningen",
  "adaptacao": false,
  "pericias": "Luta",
  "vantagens": "Alcance, Ataque Especial, Defesa Especial, +Mana, Patrono",
  "desvantagens": "Infame",
  "tecnicas": ""
 },
 {
  "nome": "Falso Chefão",
  "pontos": 13,
  "atributos": [
   3,
   3,
   3
  ],
  "grupo": "Generais",
  "categoria": "Vilão",
  "papel": "Rival",
  "pagina": 219,
  "escala": "Ningen",
  "adaptacao": false,
  "pericias": "Influência",
  "vantagens": "Aceleração, Imitar, Improviso, Maestria",
  "desvantagens": "Transtorno",
  "tecnicas": ""
 },
 {
  "nome": "Bajulador",
  "pontos": 15,
  "atributos": [
   1,
   3,
   1
  ],
  "grupo": "Generais",
  "categoria": "Vilão",
  "papel": "Especialista",
  "pagina": 219,
  "escala": "Ningen",
  "adaptacao": false,
  "pericias": "Mística",
  "vantagens": "Ajudante, Alcance, Magia, +Mana, Patrono",
  "desvantagens": "Indeciso",
  "tecnicas": ""
 },
 {
  "nome": "Misterioso",
  "pontos": 15,
  "atributos": [
   2,
   3,
   3
  ],
  "grupo": "Generais",
  "categoria": "Vilão",
  "papel": "Rival",
  "pagina": 219,
  "escala": "Ningen",
  "adaptacao": true,
  "pericias": "Luta",
  "vantagens": "Ágil, Alcance, Ataque Especial, Defesa Especial, Invisível, +Mana, Paralisia",
  "desvantagens": "Código",
  "tecnicas": ""
 },
 {
  "nome": "O Censor",
  "pontos": 22,
  "atributos": [
   4,
   6,
   5
  ],
  "grupo": "Antagonistas",
  "categoria": "Vilão",
  "papel": "Chefe",
  "escala": "Sugoi",
  "pagina": 221,
  "stats": [
   4,
   40,
   20
  ]
 },
 {
  "nome": "Agente da BUSCA",
  "pontos": 14,
  "atributos": [
   3,
   3,
   3
  ],
  "grupo": "Era das Arcas",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Saber, Sobrevivência",
  "vantagens": "Ajudante (curandeiro), Defesa Especial (Proteção), Instrutor, Patrono (BUSCA)",
  "desvantagens": "Código dos Heróis",
  "stats": [
   3,
   15,
   15
  ]
 },
 {
  "nome": "Anão Motociclista",
  "pontos": 13,
  "atributos": [
   3,
   2,
   3
  ],
  "grupo": "Era das Arcas",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Máquinas",
  "vantagens": "Anão; Ajudante (Montaria), Vigoroso Os Caçadores de Relíquias Exemplo típico de grupo Arcanautas credenciado pela BUSCA, obrigatoriamente incluindo pelo menos um combatente",
  "stats": [
   3,
   10,
   15
  ]
 },
 {
  "nome": "Pike",
  "pontos": 16,
  "atributos": [
   3,
   2,
   6
  ],
  "grupo": "Era das Arcas",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Esporte, Luta",
  "vantagens": "Ataque Especial (Perigoso), Defesa Especial (Proteção, Provocação, Tenaz)",
  "desvantagens": "Assombrado (memórias do fim trágico de seu antigo grupo), Código do Combate",
  "stats": [
   3,
   10,
   30
  ]
 },
 {
  "nome": "Lucerne",
  "pontos": 15,
  "atributos": [
   2,
   4,
   3
  ],
  "grupo": "Era das Arcas",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Medicina, Sobrevivência",
  "vantagens": "Cura, Maestria (Sobrevivência), +Mana, Resoluta",
  "desvantagens": "Código do Caçador",
  "stats": [
   2,
   30,
   15
  ]
 },
 {
  "nome": "Sovnya",
  "pontos": 23,
  "atributos": [
   3,
   4,
   2
  ],
  "grupo": "Era das Arcas",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Mística, Saber",
  "vantagens": "Alcance, Anulação, Ataque Especial (Penetrante, Preciso), Estender, Maestria (Mística), Magia, +Mana ×2, Punição (Aura –1)",
  "desvantagens": "Antipática",
  "tecnicas": "Barreira Mística, Grimório Debilitante",
  "stats": [
   3,
   45,
   10
  ]
 },
 {
  "nome": "Falkar",
  "pontos": 16,
  "atributos": [
   2,
   5,
   3
  ],
  "grupo": "Era das Arcas",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Esporte, Manha, Percepção",
  "vantagens": "Ágil, Invisível, Maestria (Manha)",
  "desvantagens": "Ponto Fraco (o desaparecimento de sua família)",
  "tecnicas": "Super-Movimento",
  "stats": [
   2,
   25,
   15
  ]
 },
 {
  "nome": "Finesa Vindorah",
  "pontos": 21,
  "atributos": [
   5,
   4,
   3
  ],
  "grupo": "Era das Arcas",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Influência, Luta, Saber",
  "vantagens": "Medusa; Cura, Famosa, Magia, Patrono (BUSCA), Riqueza (Sugoi), Torcida",
  "desvantagens": "Código dos Heróis e Honestidade",
  "stats": [
   5,
   20,
   15
  ]
 },
 {
  "nome": "Mímico",
  "pontos": 10,
  "atributos": [
   2,
   2,
   2
  ],
  "grupo": "Era das Arcas",
  "categoria": "Monstro",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta",
  "vantagens": "Ataque Especial (Penetrante, Perigoso), Inofensivo, Paralisia",
  "desvantagens": "Diferente",
  "stats": [
   2,
   10,
   10
  ]
 },
 {
  "nome": "Pirâmide Gelatinosa",
  "pontos": 10,
  "atributos": [
   4,
   1,
   4
  ],
  "grupo": "Era das Arcas",
  "categoria": "Monstro",
  "papel": "Rival",
  "escala": "Sugoi",
  "pagina": null,
  "vantagens": "Invisível, +Mana, Paralisia",
  "desvantagens": "Diferente, Inculto, Lento",
  "stats": [
   4,
   15,
   20
  ]
 },
 {
  "nome": "Cosmonauta da ORDEM",
  "pontos": 12,
  "atributos": [
   2,
   3,
   3
  ],
  "grupo": "Guerra da Galáxia",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Máquinas, Saber, Sobrevivência",
  "vantagens": "Maestria (Máquinas), Patrono (ORDEM)",
  "desvantagens": "Código do Caçador Soldados do Exército da Luz No início do período conhecido como Invasão, a humanidade não estava pronta para enfrentar a ameaça alienígena. Isso não é mais",
  "stats": [
   2,
   15,
   15
  ]
 },
 {
  "nome": "Soldado do Exército da Luz",
  "pontos": 16,
  "atributos": [
   4,
   3,
   4
  ],
  "grupo": "Guerra da Galáxia",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Esporte, Luta, Sobrevivência",
  "vantagens": "Forte, Patrono (Exército da Luz), Vigoroso",
  "desvantagens": "Código dos Heróis",
  "stats": [
   4,
   15,
   20
  ]
 },
 {
  "nome": "Mortalha",
  "pontos": 15,
  "atributos": [
   3,
   3,
   4
  ],
  "grupo": "Guerra da Galáxia",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Saber",
  "vantagens": "Ataque Especial (Perigoso), Imortal, Regeneração",
  "desvantagens": "Inapto (Máquinas)",
  "stats": [
   3,
   15,
   20
  ]
 },
 {
  "nome": "Ava Nírira",
  "pontos": 18,
  "atributos": [
   4,
   3,
   3
  ],
  "grupo": "Guerra da Galáxia",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Esporte, Luta, Sobrevivência",
  "vantagens": "Alcance 2, Artefato (Dragão de Aço: Acurado, Encantado P+1), Famosa, Inimigo (Aliens)",
  "desvantagens": "Fúria",
  "stats": [
   4,
   15,
   20
  ]
 },
 {
  "nome": "Major Ninja",
  "pontos": 18,
  "atributos": [
   4,
   3,
   5
  ],
  "grupo": "Guerra da Galáxia",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Influência, Luta, Manha",
  "vantagens": "Ataque Especial (Choque, Perigoso), Imortal, Patrono (ORDEM)",
  "desvantagens": "Infame Comodoro Tatiane NEO (Nave Espacial da ORDEM) Aristóteles é a maior nave da humanidade. Mantida em funcionamento básico graças a uma inteligência artificial",
  "stats": [
   4,
   15,
   25
  ]
 },
 {
  "nome": "Tatiane, a Maior Nave da Frota Estelar",
  "pontos": 120,
  "atributos": [
   20,
   7,
   30
  ],
  "grupo": "Guerra da Galáxia",
  "categoria": "NPC",
  "papel": "Chefe",
  "escala": "Kiodai",
  "pagina": null,
  "pericias": "Luta, Máquinas, Percepção, Saber",
  "vantagens": "Construto; Aceleração, Alcance 2, Ataque Especial (Área, Distante, Poderoso, Titânico), Defesa Especial (Blindada, Robusta, Titânica), Estender, Golpe Final, Sentidos (Radar",
  "stats": [
   20,
   35,
   150
  ]
 },
 {
  "nome": "Metaliano",
  "pontos": 20,
  "atributos": [
   6,
   2,
   5
  ],
  "grupo": "Guerra da Galáxia",
  "categoria": "Monstro",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Máquinas, Saber",
  "vantagens": "Alcance 1, Defesa Especial (Reflexão), Imune (abiótico), Sentido (Radar), Vigoroso",
  "desvantagens": "Fraqueza (água)",
  "stats": [
   6,
   10,
   25
  ]
 },
 {
  "nome": "Traktoriano",
  "pontos": 21,
  "atributos": [
   5,
   3,
   4
  ],
  "grupo": "Guerra da Galáxia",
  "categoria": "Monstro",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Máquinas, Percepção",
  "vantagens": "Ciborgue; Alcance, Ataque Especial (Penetrante), Sentido (Raio X, Visão Aguçada)",
  "desvantagens": "Código ou Transtorno, pelo arquétipo Ciborgue Infiltrado Traktorianos estão sempre em busca de corpos melhores. Essa obsessão os torna inimigos dos metalianos, por cobiçarem",
  "stats": [
   5,
   15,
   20
  ]
 },
 {
  "nome": "Traktoriano Infiltrado",
  "pontos": 12,
  "atributos": [
   2,
   4,
   2
  ],
  "grupo": "Guerra da Galáxia",
  "categoria": "Monstro",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Saber, Máquinas",
  "vantagens": "Foco, Gênio, Patrono",
  "desvantagens": "Antipático UniPotência As mudanças causadas pela Terceira Convergência não se restringiram ao surgimento das Arcas e à chegada de seres fantásticos. Magia e outras forças",
  "stats": [
   3,
   20,
   10
  ]
 },
 {
  "nome": "Batalhoide de Segurança da GENIO",
  "pontos": 15,
  "atributos": [
   3,
   3,
   4
  ],
  "grupo": "UniPotência",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Percepção",
  "vantagens": "Construto; Aceleração, Ataque Especial (Penetrante), Paralisia, Sentido (Radar, Raio X)",
  "desvantagens": "Código (1ª e 2ª Leis de Asimov)",
  "stats": [
   3,
   15,
   21
  ]
 },
 {
  "nome": "Decadência",
  "pontos": 24,
  "atributos": [
   6,
   3,
   6
  ],
  "grupo": "UniPotência",
  "categoria": "NPC",
  "papel": "Chefe",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Manha, Percepção",
  "vantagens": "Ogro; Ataque Especial (Investida, Perigoso, Potente), Defesa Especial (Bloqueio), Desgaste",
  "desvantagens": "Antipático, Aura 1, Transtorno (Paranoico)",
  "stats": [
   6,
   15,
   30
  ]
 },
 {
  "nome": "Gadget",
  "pontos": 23,
  "atributos": [
   2,
   5,
   4
  ],
  "grupo": "UniPotência",
  "categoria": "Monstro",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Máquinas, Mística, Saber",
  "vantagens": "Anulação, Arena (Hypernet), Defesa Especial (Proteção), Famoso, Gênio, Instrutor, Magia, +Mana ×2, Patrono (UniPotência)",
  "desvantagens": "Atrapalhado, Código dos Heróis",
  "stats": [
   3,
   50,
   20
  ]
 },
 {
  "nome": "Ibelin",
  "pontos": 19,
  "atributos": [
   3,
   4,
   2
  ],
  "grupo": "UniPotência",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Manha",
  "vantagens": "Fantasma; Ágil, Ataque Especial (Espiritual, Preciso), Devoto (descobrir sua origem), Invisível, Maestria (Manha)",
  "desvantagens": "Código dos Heróis e do Combate",
  "tecnicas": "Ninjutsu, Rajada de Golpes",
  "stats": [
   3,
   20,
   10
  ]
 },
 {
  "nome": "Ketua Chong",
  "pontos": 20,
  "atributos": [
   4,
   4,
   3
  ],
  "grupo": "UniPotência",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Influência, Luta, Sobrevivência",
  "vantagens": "Kallyanach; Artefato (Wok deAdamante: Fortificada), Famosa",
  "desvantagens": "Código de Honra dos Heróis",
  "tecnicas": "Desprezo. Receita: Sashimi de Kraken",
  "stats": [
   4,
   20,
   15
  ]
 },
 {
  "nome": "Tecknicolor",
  "pontos": 17,
  "atributos": [
   2,
   3,
   1
  ],
  "grupo": "UniPotência",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Arte, Influência, Mística",
  "vantagens": "Qareen; Famosa, Ilusão, Inofensiva, +Mana",
  "desvantagens": "Fracote, Indecisa",
  "tecnicas": "Encantar, Inspirar 260CAPÍTULO 6Operação ARSENAL No futuro da Terceira Convergência, as artes marciais atingiram um novo patamar de poder e explosão. Alguns dizem mesmo que",
  "stats": [
   2,
   25,
   5
  ]
 },
 {
  "nome": "Artista Marcial",
  "pontos": 11,
  "atributos": [
   3,
   2,
   4
  ],
  "grupo": "Operação ARSENAL",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta",
  "vantagens": "Ataque Especial (Potente), Mentor",
  "desvantagens": "Código do Combate Soldado ARSENAL O Exército ARSENAL é o mais temido e requisitado grupo mercenário da Terceira Convergência. Frequentemente está presente em conflitos",
  "stats": [
   3,
   10,
   20
  ]
 },
 {
  "nome": "Infantaria",
  "pontos": 2,
  "atributos": [
   1,
   1,
   0
  ],
  "grupo": "Operação ARSENAL",
  "categoria": "NPC",
  "papel": "Capanga",
  "escala": "Ningen",
  "pagina": null,
  "stats": [
   1,
   5,
   1
  ]
 },
 {
  "nome": "Elite",
  "pontos": 9,
  "atributos": [
   2,
   2,
   2
  ],
  "grupo": "Operação ARSENAL",
  "categoria": "NPC",
  "papel": "Capanga",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta",
  "vantagens": "Ataque Especial (escolha um entre: Distante, Perigoso, Poderoso, Potente), Defesa Especial (escolha uma entre: Blindada, Robusta, Tenaz)",
  "stats": [
   1,
   10,
   10
  ]
 },
 {
  "nome": "Arauto do ARSENAL",
  "pontos": 12,
  "atributos": [
   3,
   3,
   4
  ],
  "grupo": "Operação ARSENAL",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta",
  "vantagens": "Acumulador, Forte",
  "desvantagens": "Código do Combate",
  "stats": [
   3,
   15,
   20
  ]
 },
 {
  "nome": "Servo da Centelha",
  "pontos": 15,
  "atributos": [
   4,
   2,
   4
  ],
  "grupo": "Operação ARSENAL",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Percepção",
  "vantagens": "Cura, Defesa Especial (Tenaz), Devoto (promover o Torneio da Ilha do Martelo e garantir seu funcionamento), Resoluto",
  "desvantagens": "Código do Combate e da Derrota",
  "tecnicas": "Monasticismo",
  "stats": [
   4,
   10,
   20
  ]
 },
 {
  "nome": "Rin Asakusa",
  "pontos": 19,
  "atributos": [
   4,
   4,
   3
  ],
  "grupo": "Operação ARSENAL",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Manha",
  "vantagens": "Ataque Especial (Potente, Poderoso), Defesa Especial (Tenaz), Maestria (Luta), +Vida",
  "desvantagens": "Protegida (Emi Asakusa)",
  "tecnicas": "Queimar o Cosmo, Rajada de Golpes 266CAPÍTULO 6",
  "stats": [
   4,
   20,
   25
  ]
 },
 {
  "nome": "Shin",
  "pontos": 20,
  "atributos": [
   3,
   5,
   3
  ],
  "grupo": "Operação ARSENAL",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Manha",
  "vantagens": "Ágil, Ataque Especial (Distante, Perigoso, Penetrante), Defesa Especial (Esquiva), Maestria (Manha)",
  "desvantagens": "Infame",
  "tecnicas": "Ninjutsu, Rajada de Energia (Ryuujin no Kunai)",
  "stats": [
   3,
   25,
   15
  ]
 },
 {
  "nome": "Karator",
  "pontos": 18,
  "atributos": [
   4,
   2,
   5
  ],
  "grupo": "Operação ARSENAL",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Sobrevivência",
  "vantagens": "Alien (Forte); Ataque Especial (Poderoso, Titânico), Defesa Especial (Reflexão, Robusta), Imune (Abiótico), Sentido (Radar)",
  "desvantagens": "Amnésia, Assombrado –1, Fraqueza (água) Tormenta ALPHA No mundo da Terceira Convergência, Tormenta ALPHA é o maior fenômeno dos jogos eletrônicos. Este VRMMORPG — jogo de RPG",
  "stats": [
   4,
   10,
   25
  ]
 },
 {
  "nome": "Tosco",
  "pontos": 5,
  "atributos": [
   2,
   1,
   1
  ],
  "grupo": "Tormenta ALPHA",
  "categoria": "Monstro",
  "papel": "Capanga",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta",
  "vantagens": "Construto; Sentido (Infravisão)",
  "desvantagens": "Maldição (nunca recupera PV, mesmo com conserto) Jogadores Muitos jogadores diferentes exploram os cenários d’O Reinado. Toda equipe equilibrada conta com pelo menos um dos",
  "stats": [
   2,
   5,
   5
  ]
 },
 {
  "nome": "Pirata de Quelina",
  "pontos": 13,
  "atributos": [
   3,
   2,
   3
  ],
  "grupo": "Tormenta ALPHA",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Manha",
  "vantagens": "Minotauro; Arena (Água), Ataque Especial (Penetrante)",
  "desvantagens": "Infame",
  "tecnicas": "Rajada de Golpes",
  "stats": [
   3,
   10,
   15
  ]
 },
 {
  "nome": "Mago da Academia Arcana",
  "pontos": 13,
  "atributos": [
   2,
   4,
   1
  ],
  "grupo": "Tormenta ALPHA",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Mística",
  "vantagens": "Fada (Magia); +Mana",
  "tecnicas": "Bola de Fogo, Poeira Glacial ou Relâmpago (escolha uma); Raio Místico",
  "stats": [
   2,
   30,
   5
  ]
 },
 {
  "nome": "Clérigo de Valkaria",
  "pontos": 13,
  "atributos": [
   2,
   2,
   3
  ],
  "grupo": "Tormenta ALPHA",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Mística",
  "vantagens": "Cura, Devoto (sempre buscar aventuras e missões perigosas), Magia",
  "desvantagens": "Maldição (não pode viver mais de um mês no mesmo lugar)",
  "tecnicas": "Inspirar",
  "stats": [
   2,
   15,
   15
  ]
 },
 {
  "nome": "Samurai de Nitamura",
  "pontos": 13,
  "atributos": [
   2,
   2,
   4
  ],
  "grupo": "Tormenta ALPHA",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta",
  "vantagens": "Kemono (Vigoroso, Antipático); Defesa Especial (Proteção, Provocação, Robusta), +Vida",
  "desvantagens": "Código da Honestidade",
  "stats": [
   2,
   10,
   20
  ]
 },
 {
  "nome": "Avelle d’Elchiori",
  "pontos": 23,
  "atributos": [
   2,
   4,
   3
  ],
  "grupo": "Tormenta ALPHA",
  "categoria": "NPC",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Mística, Percepção",
  "vantagens": "Kemono (Gênie, Frágil); Ataque Especial (Distante, Preciso), Magia, +Mana, Famose, Voo",
  "desvantagens": "Atrapalhade, Código dos Heróis",
  "tecnicas": "Barreira Mística, Grimório Debilitante, Invocar Elemental, Poeira Glacial, Raio Místico, Setas Infalíveis de Petrovna",
  "stats": [
   2,
   30,
   15
  ]
 },
 {
  "nome": "Criatura das Zonas Vermelhas",
  "pontos": 25,
  "atributos": [
   3,
   3,
   6
  ],
  "grupo": "Tormenta ALPHA",
  "categoria": "Monstro",
  "papel": "Rival",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta",
  "vantagens": "Aberrante (Luta); Acumulador, Alcance, Anulação, Ataque Especial (Poderoso), Cópia, Golpe Final, Imune (Abiótico), +Membros, Punição (qualquer de –1 ponto), Sentido (Radar)",
  "desvantagens": "Ambiente (Zonas Vermelhas), Aura –2, Diferente",
  "tecnicas": "duas técnicas comuns quaisquer",
  "stats": [
   3,
   15,
   30
  ]
 },
 {
  "nome": "Moderador",
  "pontos": 26,
  "atributos": [
   3,
   4,
   3
  ],
  "grupo": "Tormenta ALPHA",
  "categoria": "NPC",
  "papel": "Chefe",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Influência, Luta, Saber",
  "vantagens": "Anulação, Base (Central de Moderação), Cura, Defesa Especial (Proteção, Provocação, Tenaz), Devoto (proteger as regras do jogo), Imortal, Irresistível, +Mana, Paralisia",
  "desvantagens": "Código dos Heróis e 1ª Lei de Asimov (aplicada a jogadores de Tormenta ALPHA)",
  "stats": [
   3,
   30,
   15
  ]
 },
 {
  "nome": "Dragão Feral",
  "pontos": 28,
  "atributos": [
   6,
   4,
   5
  ],
  "grupo": "Tormenta ALPHA",
  "categoria": "Monstro",
  "papel": "Chefe",
  "escala": "Ningen",
  "pagina": null,
  "pericias": "Luta, Percepção",
  "vantagens": "Alcance, Arena (seu covil), Ataque Especial (Área, Distante, Potente ×2), Defesa Especial (Blindada), Sentido (Infravisão, Radar), +Vida, Voo",
  "desvantagens": "Diferente",
  "stats": [
   6,
   20,
   25
  ]
 },
 {
  "nome": "Arquilich",
  "pontos": 55,
  "atributos": [
   6,
   8,
   6
  ],
  "grupo": "Tormenta ALPHA",
  "categoria": "Monstro",
  "papel": "Chefe",
  "escala": "Sugoi",
  "pagina": null,
  "pericias": "Mística, Percepção",
  "vantagens": "Alcance, Arena (Cidade-Necrópole), Ataque Especial (Penetrante, Preciso), Cópia, Defesa Especial (Reflexão), Desgaste, Imortal, Imune (Abiótico, Doenças, Resiliente)",
  "desvantagens": "Sem Vida",
  "tecnicas": "Bola de Fogo, Grimório Debilitante, Metamagia, Poeira Glacial, Relâmpago",
  "stats": [
   6,
   90,
   30
  ]
 }
];
const clone=v=>JSON.parse(JSON.stringify(v));
const key=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const skillMap=new Map(TRESDET_SKILLS.map(([id,label])=>[key(label),id]));
const tokens=s=>String(s||'').split(/[,;]/).map(x=>x.trim()).filter(Boolean).slice(0,20);
const abilities=s=>tokens(s).map(nome=>({nome,custo:'',desc:'Consulte os efeitos no Manual Básico.'}));
export const MODELOS_3DET_LIVRO=RECORDS.map((row,i)=>{
 const base=clone(initial3DetThreatData);
 const [p,h,r]=row.atributos;
 const [pa,pm,pv]=row.stats||[p,h*5,r*5];
 const names=tokens(row.pericias);
 const pericias={...base.pericias};
 const extras=[];
 for(const nome of names){
  const id=skillMap.get(key(nome));
  if(id)pericias[id]=true;
  else extras.push({id:'livro-'+i+'-'+extras.length,nome,selecionada:true});
 }
 return {...base,nome:row.nome,pontos:row.pontos,escala:row.escala||'Ningen',
  grupo:row.grupo,categoria:row.categoria,papel:row.papel,
  conceito:'Perfil de referência para uso e adaptação pelo mestre.',
  fonte:'Manual 3DeT Victory (2024)',pagina:row.pagina||null,
  atributos:{poder:p,habilidade:h,resistencia:r},
  status:{pa:{atual:pa,max:pa},pm:{atual:pm,max:pm},pv:{atual:pv,max:pv}},
  pericias,periciasPersonalizadas:extras,
  vantagens:abilities(row.vantagens),desvantagens:tokens(row.desvantagens).map(nome=>({nome,valor:'',desc:'Consulte o Manual Básico.'})),
  tecnicas:abilities(row.tecnicas),
  acoes:row.nome==='Horda Kobold'?[{nome:'Ataque coletivo',custo:'',desc:'Vários inimigos agem como uma única ameaça.'}]:[],
  notas:'Fonte: Manual 3DeT Victory (2024), '+row.grupo+
   (row.pagina?' — página '+row.pagina:' — capítulo 6.')+
   (row.adaptacao?'\nAtributos sugeridos dentro da faixa do livro.':'')+
   '\nConsulte a edição original para descrição e efeitos completos.'
 };
});
export const GRUPOS_3DET_LIVRO=[...new Set(MODELOS_3DET_LIVRO.map(x=>x.grupo))];
