import { initial3DetThreatData } from './threatData.js';

const clone = (value) => JSON.parse(JSON.stringify(value));

const build = ({ nome, categoria, papel, conceito, pontos, escala = 'Ningen', atributos, pericias = [], vantagens = [], desvantagens = [], tecnicas = [], acoes = [], notas = '' }) => {
  const model = clone(initial3DetThreatData);
  model.nome = nome;
  model.categoria = categoria;
  model.papel = papel;
  model.conceito = conceito;
  model.pontos = pontos;
  model.escala = escala;
  model.atributos = { ...model.atributos, ...atributos };
  const numeric = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  model.status = {
    pa: { atual: Math.max(0, numeric(atributos.poder)), max: Math.max(0, numeric(atributos.poder)) },
    pm: { atual: Math.max(0, numeric(atributos.habilidade) * 5), max: Math.max(0, numeric(atributos.habilidade) * 5) },
    pv: { atual: Math.max(0, numeric(atributos.resistencia) * 5), max: Math.max(0, numeric(atributos.resistencia) * 5) },
  };
  model.pericias = { ...model.pericias, ...Object.fromEntries(pericias.map((id) => [id, true])) };
  model.vantagens = vantagens;
  model.desvantagens = desvantagens;
  model.tecnicas = tecnicas;
  model.acoes = acoes;
  model.notas = notas;
  return model;
};

// Perfis rápidos baseados nas faixas e sugestões do Compêndio de NPCs do Manual Básico.
export const MODELOS_3DET_NPCS = [
  build({
    nome: 'Civil Comum', categoria: 'NPC', papel: 'Comum', pontos: 5,
    conceito: 'Pessoa comum com profissão, formação ou hobby útil para a cena.',
    atributos: { poder: 2, habilidade: 2, resistencia: 1 },
    pericias: ['saber'],
    desvantagens: [{ nome: 'Limitação de cena', valor: '-1', desc: 'Escolha uma desvantagem adequada ao indivíduo.' }],
    notas: 'Perfil rápido para figurantes e pessoas comuns. Troque Saber pela perícia que melhor represente sua profissão.'
  }),
  build({
    nome: 'Bandido de Rua', categoria: 'NPC', papel: 'Capanga', pontos: 4,
    conceito: 'Ladrão, malandro ou capanga oportunista; perigoso em grupo, mas pouco resistente.',
    atributos: { poder: 1, habilidade: 2, resistencia: 0 },
    pericias: ['manha'],
    vantagens: [{ nome: 'Aceleração', custo: '1', desc: 'Foge, persegue e se reposiciona rapidamente.' }],
    desvantagens: [{ nome: 'Infame', valor: '-1', desc: 'Má reputação e histórico problemático.' }],
    acoes: [{ nome: 'Golpe baixo', custo: '', desc: 'Ataque ou truque simples usando Manha ou combate físico.' }]
  }),
  build({
    nome: 'Brutamontes', categoria: 'NPC', papel: 'Especialista', pontos: 7,
    conceito: 'Oponente fisicamente dominante, simples e direto, feito para segurar a linha de frente.',
    atributos: { poder: 4, habilidade: 1, resistencia: 2 },
    pericias: ['luta'],
    desvantagens: [{ nome: 'Tapado', valor: '-1', desc: 'Resolve quase tudo pela força bruta.' }],
    acoes: [{ nome: 'Soco devastador', custo: '', desc: 'Ataque físico direto baseado em Poder.' }]
  }),
  build({
    nome: 'Guardião Treinado', categoria: 'NPC', papel: 'Rival', pontos: 8,
    conceito: 'Soldado, guarda ou agente treinado para proteger pessoas e manter posição.',
    atributos: { poder: 2, habilidade: 2, resistencia: 2 },
    pericias: ['luta'],
    vantagens: [
      { nome: 'Patrono', custo: '1', desc: 'Recebe apoio de uma organização, força ou corporação.' },
      { nome: 'Defesa Especial', custo: '1', desc: 'Treinamento defensivo e equipamento apropriado.' }
    ],
    desvantagens: [{ nome: 'Código', valor: '-1', desc: 'Segue ordens, deveres ou um código profissional.' }],
    acoes: [{ nome: 'Cobertura tática', custo: '', desc: 'Protege aliados, segura posição ou cria uma abertura.' }]
  }),
];

// Criaturas originais prontas para mesa, construídas com as mesmas peças de regra do Victory.
export const MODELOS_3DET_CRIATURAS = [
  build({
    nome: 'Lobo das Arcas', categoria: 'Animal', papel: 'Capanga', pontos: 8,
    conceito: 'Predador veloz que caça em matilha e percebe ameaças antes que elas se aproximem.',
    atributos: { poder: 2, habilidade: 3, resistencia: 2 },
    pericias: ['percepcao'],
    vantagens: [{ nome: 'Ágil', custo: '1', desc: 'Movimentos rápidos e ataques oportunistas.' }],
    desvantagens: [{ nome: 'Inculto', valor: '-1', desc: 'Animal selvagem, sem conhecimentos ou ferramentas humanas.' }],
    acoes: [
      { nome: 'Mordida', custo: '', desc: 'Ataque físico curto e agressivo.' },
      { nome: 'Caçada em matilha', custo: '', desc: 'Pressiona um alvo já cercado ou distraído por aliados.' }
    ]
  }),
  build({
    nome: 'Espectro de Neon', categoria: 'Criatura', papel: 'Rival', pontos: 12,
    conceito: 'Entidade sobrenatural instável que atravessa sombras e ataca a energia dos vivos.',
    atributos: { poder: 1, habilidade: 4, resistencia: 2 },
    pericias: ['mistica', 'percepcao'],
    vantagens: [
      { nome: 'Teleporte', custo: '1', desc: 'Some e reaparece em pontos visíveis da cena.' },
      { nome: 'Ataque Especial (Espiritual)', custo: '1', desc: 'Pode representar ataques que drenam PM.' },
      { nome: 'Imune', custo: '1', desc: 'Resistência sobrenatural adequada à natureza incorpórea.' }
    ],
    desvantagens: [{ nome: 'Fraqueza', valor: '-1', desc: 'Escolha um elemento, ritual ou condição capaz de ancorar a criatura.' }],
    acoes: [
      { nome: 'Toque espectral', custo: '1PM', desc: 'Ataque de energia sobrenatural.' },
      { nome: 'Passo impossível', custo: '1PM', desc: 'Reposiciona-se com Teleporte.' }
    ]
  }),
  build({
    nome: 'Golem de Sucata', categoria: 'Monstro', papel: 'Rival', pontos: 14,
    conceito: 'Construto pesado feito de metal, peças industriais e um núcleo de energia instável.',
    atributos: { poder: 4, habilidade: 1, resistencia: 4 },
    pericias: ['luta', 'maquinas'],
    vantagens: [
      { nome: 'Forte', custo: '1', desc: 'Força mecânica extrema.' },
      { nome: 'Defesa Especial (Blindada)', custo: '1', desc: 'Carcaça resistente contra ataques diretos.' }
    ],
    desvantagens: [{ nome: 'Lento', valor: '-1', desc: 'Pesado e pouco ágil.' }],
    acoes: [
      { nome: 'Punho hidráulico', custo: '', desc: 'Golpe físico de grande impacto.' },
      { nome: 'Sobrecarga do núcleo', custo: '2PM', desc: 'Libera energia em uma descarga perigosa; o mestre define a consequência.' }
    ]
  }),
  build({
    nome: 'Dragão Jovem das Arcas', categoria: 'Monstro', papel: 'Chefe', pontos: 18,
    conceito: 'Predador dracônico territorial, voador e capaz de varrer uma área com sua baforada.',
    atributos: { poder: 5, habilidade: 3, resistencia: 4 },
    pericias: ['luta', 'percepcao'],
    vantagens: [
      { nome: 'Voo', custo: '1', desc: 'Deslocamento aéreo.' },
      { nome: 'Ataque Especial (Área)', custo: '1', desc: 'Baforada que alcança vários alvos próximos.' },
      { nome: 'Forte', custo: '1', desc: 'Poder físico dracônico.' },
      { nome: 'Defesa Especial', custo: '1', desc: 'Escamas e resistência natural.' }
    ],
    desvantagens: [{ nome: 'Diferente', valor: '-1', desc: 'Corpo grande e monstruoso dificulta o uso de objetos humanos.' }],
    acoes: [
      { nome: 'Garras e presas', custo: '', desc: 'Ataque físico direto.' },
      { nome: 'Baforada', custo: '3PM', desc: 'Ataque Especial em Área; personalize o tipo de energia para a campanha.' },
      { nome: 'Mergulho predatório', custo: '', desc: 'Ataca após ganhar altura e posição favorável.' }
    ]
  }),
];

export const MODELOS_3DET_AMEACAS = [...MODELOS_3DET_NPCS, ...MODELOS_3DET_CRIATURAS];
