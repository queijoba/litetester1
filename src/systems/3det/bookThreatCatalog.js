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
  "adaptacao": true
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
  "adaptacao": true
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
  "adaptacao": true
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
  "adaptacao": true
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
  "adaptacao": true
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
  "adaptacao": true
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
  "adaptacao": true
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
  "adaptacao": true
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
  "adaptacao": true
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
  "adaptacao": true
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
  "adaptacao": false
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
  "adaptacao": false
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
  "adaptacao": false
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
  "adaptacao": false
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
  "adaptacao": false
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
  "adaptacao": false
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
  "adaptacao": false
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
  "adaptacao": false
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
  "adaptacao": false
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
  "adaptacao": false
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
  "adaptacao": true
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
  "pagina": 221
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
  "desvantagens": "Código dos Heróis Anão Motociclista Em Vallindra, parece não existir bares que não tenham pelo menos um anão usando jaqueta de couro, ornamentada com peças metálicas ou partes de armaduras, e uma motocicleta ag"
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
  "vantagens": "Anão; Ajudante (Montaria), Vigoroso Os Caçadores de Relíquias Exemplo típico de grupo Arcanautas credenciado pela BUSCA, obriga\u0002toriamente incluindo pelo menos um combatente, um tanque e um curan\u0002deiro. Reunido"
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
  "vantagens": "Ataque Especial (Perigoso), Defesa Especial (Proteção, Provo\u0002cação, Tenaz)",
  "desvantagens": "Assombrado (memórias do fim trágico de seu antigo grupo), Código do Combate"
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
  "desvantagens": "Código do Caçador"
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
  "vantagens": "Alcance, Anulação, Ataque Especial (Penetrante, Preciso), Es\u0002tender, Maestria (Mística), Magia, +Mana ×2, Punição (Aura –1)",
  "desvantagens": "Antipática",
  "tecnicas": "Barreira Mística, Grimório Debilitante"
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
  "tecnicas": "Super-Movimento Finesa Vindorah A medusa Finesa Vindorah tem um currículo extenso como Arca\u0002nauta e menestreamer. Guerreira respeitada, conhecida por sua integri\u0002dade, valendo-lhe o título de “Paladina da Avent"
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
  "vantagens": "Medusa; Cura, Famosa, Magia, Patrono (BUSCA), Riqueza (Su\u0002goi), Torcida",
  "desvantagens": "Código dos Heróis e Honestidade Mímico Pouca coisa deixa os Arcanautas mais felizes que baús de tesouro, es\u0002pecialmente aqueles cheios joias e pedras preciosas, expostos e desprotegi\u0002dos. Mas a alegria pode dur"
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
  "desvantagens": "Diferente Pirâmide Gelatinosa Criatura com o nome mais literal que você vai achar neste livro, a pirâ\u0002mide gelatinosa é exatamente isso: uma gelatina gigante de matéria semi\u0002transparente em formato piramidal, q"
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
  "desvantagens": "Diferente, Inculto, Lento"
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
  "desvantagens": "Código do Caçador Soldados do Exército da Luz No início do período conhecido como Invasão, a humanidade não es\u0002tava pronta para enfrentar a ameaça alienígena. Isso não é mais verdade agora. O Exército da Luz co"
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
  "desvantagens": "Código dos Heróis Mortalha Vagando pela Terra desde muito antes da humanidade surgir, Mortalha é um imortal verdadeiro — e até onde sabe, incapaz de morrer. Por tédio, costuma mudar radicalmente seu estilo de v"
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
  "desvantagens": "Inapto (Máquinas) Ava Nírira Ava Nírira é uma das mais competentes e conhecidas soldados da Terra. Foi membro da elite do Exército da Luz e também serviu na ORDEM durante a Guerra da Galáxia, primeiro na Nau-Ca"
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
  "desvantagens": "Fúria 245 O MUNDO DE 3DET VICTORYMajor Ninja Antigo líder do grupo U.F.O.Team, o misterioso Major Ninja é especia\u0002lista em artes marciais e combate contra alienígenas. Recebeu esse codi\u0002nome por conservar o ros"
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
  "desvantagens": "Infame Comodoro Tatiane NEO (Nave Espacial da ORDEM) Aristóteles é a maior nave da humanidade. Mantida em funcionamento básico graças a uma inteligência artificial desen\u0002volvida pela divisão do Tatic One Telesc"
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
  "vantagens": "Construto; Aceleração, Alcance 2, Ataque Especial (Área, Dis\u0002tante, Poderoso, Titânico), Defesa Especial (Blindada, Robusta, Titânica), Estender, Golpe Final, Sentidos (Radar, Raio X, Visão Aguçada), Voo Metali"
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
  "vantagens": "Alcance 1, Defesa Especial (Reflexão), Imune (abiótico), Senti\u0002do (Radar), Vigoroso",
  "desvantagens": "Fraqueza (água) Traktorianos Os ancestrais da atual espécie dominante de Traktor eram invertebrados marinhos de aspecto viscoso, que trocavam de concha ao crescer. Tal busca por proteções melhores guiou sua evo"
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
  "desvantagens": "Código ou Transtorno, pelo arquétipo Ciborgue Infiltrado Traktorianos estão sempre em busca de corpos melhores. Essa obses\u0002são os torna inimigos dos metalianos, por cobiçarem seus poderosos cor\u0002pos de metal org"
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
  "desvantagens": "Antipático UniPotência As mudanças causadas pela Terceira Convergência não se restringiram ao surgimento das Arcas e à chegada de seres fantásticos. Magia e outras forças sobrenaturais são agora reais e abundan"
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
  "desvantagens": "Código (1ª e 2ª Leis de Asimov) Decadência Decadência começou sua jornada como um aluno promissor da Escola Superior SAVE, por conta de seu poder terrível e único: a habilidade de de\u0002compor a realidade. Ele é c"
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
  "vantagens": "Ogro; Ataque Especial (Investida, Perigoso, Potente), Defesa Es\u0002pecial (Bloqueio), Desgaste",
  "desvantagens": "Antipático, Aura 1, Transtorno (Paranoico) Gadget Gadget era uma criança em Singapura, quando aconteceu a Terceira Convergência e sua vida mudou. Fascinado por tudo o que era mágico, ele sempre foi capaz de enx"
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
  "vantagens": "Anulação, Arena (Hypernet), Defesa Especial (Proteção), Famo\u0002so, Gênio, Instrutor, Magia, +Mana ×2, Patrono (UniPotência)",
  "desvantagens": "Atrapalhado, Código dos Heróis Ibelin Assim como muitos outros Viajantes, Ibelin um dia acordou e estava em uma nova realidade, contando apenas com fragmentos de suas memó\u0002rias antigas. Isso por si só, já seria"
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
  "tecnicas": "Ninjutsu, Rajada de Golpes 259 O MUNDO DE 3DET VICTORYKetua Chong, presidente da Liga Estudantil Herdeira de uma tradicional família chinesa, cujo patriarca não é nin\u0002guém menos do que um poderoso dragão, nunca"
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
  "tecnicas": "Desprezo. Receita: Sashimi de Kraken Tecknicolor Aluna do quarto ano do Liceu de Artes Arcanas, Tecknicolor é uma jo\u0002vem qareen que se destaca pelo carisma e energia contagiante. Filha de um coatl, uma espécie "
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
  "tecnicas": "Encantar, Inspirar 260CAPÍTULO 6Operação ARSENAL No futuro da Terceira Convergência, as artes marciais atingiram um novo patamar de poder e explosão. Alguns dizem mesmo que elas desperta\u0002ram: capacidades extrao"
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
  "desvantagens": "Código do Combate Soldado ARSENAL O Exército ARSENAL é o mais temido e requisitado grupo mercenário da Terceira Convergência. Frequentemente está presente em conflitos atu\u0002ando ao lado de exércitos nacionais ou"
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
  "pagina": null
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
  "vantagens": "Ataque Especial (escolha um entre: Distan\u0002te, Perigoso, Poderoso, Potente), Defesa Especial (es\u0002colha uma entre: Blindada, Robusta, Tenaz)"
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
  "desvantagens": "Código do Combate 265 O MUNDO DE 3DET VICTORYServo da Centelha Lutadores na Ilha do Martelo costumam mencionar uma sensação es\u0002tranha, uma espécie de centelha ou faísca que arde em seus corpos e im\u0002pele a lutar"
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
  "tecnicas": "Monasticismo Rin Asakusa Última campeã do Torneio do Martelo, Rin é filha de uma diplomata ja\u0002ponesa e um atleta brasileiro. Praticante de várias artes marciais tradicionais, como caratê, judô e aikidô, desenvo"
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
  "tecnicas": "Queimar o Cosmo, Rajada de Golpes 266CAPÍTULO 6Shin Reconhecido como prodígio desde a infância, Shin tornou-se uma pe\u0002quena celebridade no Ginásio Ninja Akibara ao receber uma bolsa de estu\u0002dos aos quatorze ano"
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
  "tecnicas": "Ninjutsu, Rajada de Energia (Ryuujin no Kunai) Karator O metaliano Karator chegou à Terra anos antes da Terceira Convergência, em uma missão para proteger o segredo da existência de seu mundo natal. Porém, um a"
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
  "vantagens": "Alien (Forte); Ataque Especial (Poderoso, Titânico), Defesa Es\u0002pecial (Reflexão, Robusta), Imune (Abiótico), Sentido (Radar)",
  "desvantagens": "Amnésia, Assombrado –1, Fraqueza (água) Tormenta ALPHA No mundo da Terceira Convergência, Tormenta ALPHA é o maior fenô\u0002meno dos jogos eletrônicos. Este VRMMORPG — jogo de RPG massivo multi\u0002jogador de realidade"
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
  "desvantagens": "Maldição (nunca recupera PV, mesmo com conserto) Jogadores Muitos jogadores diferentes exploram os cenários d’O Reinado. Toda equipe equilibrada conta com pelo menos um dos quatro tipos mais co\u0002muns de aventure"
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
  "tecnicas": "Rajada de Golpes"
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
  "tecnicas": "Bola de Fogo, Poeira Glacial ou Relâmpago (escolha uma); Raio Místico"
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
  "tecnicas": "Inspirar"
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
  "vantagens": "Kemono (Vigoroso, Antipático); Defesa Especial (Proteção, Pro\u0002vocação, Robusta), +Vida",
  "desvantagens": "Código da Honestidade Avelle d’Elchiori Avelle atualmente lidera a Sociedade das Penas Púrpuras, a mais co\u0002nhecida guilda de jogadores de Tormenta ALPHA. Moreau-coruja arcanista, assumiu o manto depois que a lí"
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
  "tecnicas": "Barreira Mística, Grimório Debilitante, Invocar Elemental, Poei\u0002ra Glacial, Raio Místico, Setas Infalíveis de Petrovna 273 O MUNDO DE 3DET VICTORYCriatura das Zonas Vermelhas Ao adentrar uma Zona Vermelha, os j"
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
  "vantagens": "Aberrante (Luta); Acumulador, Alcance, Anulação, Ataque Es\u0002pecial (Poderoso), Cópia, Golpe Final, Imune (Abiótico), +Membros, Puni\u0002ção (qualquer de –1 ponto), Sentido (Radar)",
  "desvantagens": "Ambiente (Zonas Vermelhas), Aura –2, Diferente",
  "tecnicas": "duas técnicas comuns quaisquer Moderadores Moderadores são membros da administração da PantheonSoft, res\u0002ponsáveis por monitorar e punir jogadores que desrespeitam os termos de serviço de Tormenta ALPHA. Com po"
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
  "vantagens": "Anulação, Base (Central de Moderação), Cura, Defesa Especial (Proteção, Provocação, Tenaz), Devoto (proteger as regras do jogo), Imortal, Irresistível, +Mana, Paralisia, Punição (Pacifista –2),Telepata,Teleport",
  "desvantagens": "Código dos Heróis e 1ª Lei de Asimov (aplicada a jogadores de Tormenta ALPHA)"
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
  "vantagens": "Alcance, Arena (seu covil), Ataque Especial (Área, Distante, Poten\u0002te ×2), Defesa Especial (Blindada), Sentido (Infravisão, Radar), +Vida, Voo",
  "desvantagens": "Diferente Arquilich O Arquilich é uma figura lendária em Tormenta ALPHA, uma criatura de poderes arcanos sombrios e imortalidade. Outrora um mago já podero\u0002so, passou por um processo de transformação em morto-v"
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
  "pericias": "Mística, Percepção 275 O MUNDO DE 3DET VICTORYVantagens: Alcance, Arena (Cidade-Necrópole), Ataque Especial (Penetran\u0002te, Preciso), Cópia, Defesa Especial (Reflexão), Desgaste, Imortal, Imune (Abiótico, Doenças",
  "vantagens": "Alcance, Arena (Cidade-Necrópole), Ataque Especial (Penetran\u0002te, Preciso), Cópia, Defesa Especial (Reflexão), Desgaste, Imortal, Imune (Abiótico, Doenças, Resiliente), Maestria (Mística), Magia, +Mana ×5, Paral",
  "desvantagens": "Sem Vida",
  "tecnicas": "Bola de Fogo, Grimório Debilitante, Metamagia, Poeira Glacial, Relâmpago Outros Núcleos Os cinco núcleos principais são os maiores e mais importantes em Era das Arcas, mas definitivamente não os únicos possívei"
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
