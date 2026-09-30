import { initial3DetPcData } from './data.js';

const clone = (value) => JSON.parse(JSON.stringify(value));

const buildModel = ({
  nome,
  arquetipo,
  conceito,
  atributos,
  pericias,
  vantagens,
  desvantagens,
  inventario = [],
  notas,
}) => {
  const model = clone(initial3DetPcData);
  model.bio = {
    ...model.bio,
    nome,
    arquetipo,
    kit: '',
    conceito,
    escala: 'Ningen',
    imagem: '',
  };
  model.pontos = 10;
  model.xp = 0;
  model.atributos = { ...model.atributos, ...atributos };
  model.status = {
    pa: { atual: Math.max(1, Number(atributos.poder || 0)), max: Math.max(1, Number(atributos.poder || 0)) },
    pm: { atual: Math.max(1, Number(atributos.habilidade || 0) * 5), max: Math.max(1, Number(atributos.habilidade || 0) * 5) },
    pv: { atual: Math.max(1, Number(atributos.resistencia || 0) * 5), max: Math.max(1, Number(atributos.resistencia || 0) * 5) },
  };
  model.pericias = {
    ...model.pericias,
    ...Object.fromEntries(pericias.map((id) => [id, true])),
  };
  model.vantagens = vantagens;
  model.desvantagens = desvantagens;
  model.inventario = inventario;
  model.notas = notas;
  return model;
};

export const MODELOS_3DET_PC = [
  buildModel({
    nome: 'Sans',
    arquetipo: 'Criatura sobrenatural (adaptação)',
    conceito: 'Esqueleto relaxado, perceptivo e difícil de acertar; luta com teleporte e ataques à distância.',
    atributos: { poder: 1, habilidade: 4, resistencia: 0 },
    pericias: ['mistica', 'percepcao'],
    vantagens: [
      { nome: 'Ágil', custo: '1', desc: 'Representa reflexos e esquivas rápidas.' },
      { nome: 'Alcance', custo: '1', desc: 'Ataques de ossos e energia podem alcançar alvos mais distantes.' },
      { nome: 'Ataque Especial (Preciso)', custo: '1', desc: 'Permite representar ataques guiados pela Habilidade.' },
      { nome: 'Teleporte', custo: '1', desc: 'Reposicionamento instantâneo e defesa imprevisível.' },
    ],
    desvantagens: [
      { nome: 'Frágil', valor: '-1', desc: 'Pouquíssima resistência física; a adaptação usa R0 e apenas 1 PV.' },
    ],
    inventario: [
      { nome: 'Jaqueta e chinelos', quantidade: 1, raridade: 'Comum', notas: 'Visual clássico; sem efeito de regra.' },
    ],
    notas: 'Adaptação de fã para personagem iniciante de 10 pontos. Cálculo: P1 + H4 + R0 = 5; Mística + Percepção = 2; Ágil + Alcance + Ataque Especial (Preciso) + Teleporte = 4; Frágil = -1. Total: 10 pontos. Retrato não incluído por padrão.',
  }),

  buildModel({
    nome: 'Saitama',
    arquetipo: 'Humano',
    conceito: 'Herói extremamente forte e direto, especializado em resolver conflitos físicos com um único golpe.',
    atributos: { poder: 4, habilidade: 2, resistencia: 3 },
    pericias: ['luta'],
    vantagens: [
      { nome: 'Forte', custo: '1', desc: 'Força física extraordinária, sobretudo em golpes e feitos de potência.' },
    ],
    desvantagens: [
      { nome: 'Código (Herói)', valor: '-1', desc: 'Não ignora pessoas em perigo e tenta agir como herói quando necessário.' },
    ],
    inventario: [
      { nome: 'Uniforme de herói', quantidade: 1, raridade: 'Comum', notas: 'Sem efeito especial nesta versão iniciante.' },
    ],
    notas: 'Adaptação de fã jogável em escala de personagem iniciante, não uma reprodução do poder absurdo da obra. Cálculo: P4 + H2 + R3 = 9; Luta = 1; Forte = 1; Código (Herói) = -1. Total: 10 pontos. Evolua Poder, Resistência e vantagens para versões mais exageradas.',
  }),

  buildModel({
    nome: 'Jotaro Kujo',
    arquetipo: 'Humano',
    conceito: 'Lutador estoico acompanhado por um Stand de curto alcance, rápido e devastador.',
    atributos: { poder: 2, habilidade: 3, resistencia: 2 },
    pericias: ['luta', 'percepcao'],
    vantagens: [
      { nome: 'Ajudante (Star Platinum)', custo: '1', desc: 'O Stand é tratado como um Ajudante voltado para combate.' },
      { nome: 'Ataque Especial (Múltiplo)', custo: '1', desc: 'Representa uma sequência de golpes rápidos do Stand.' },
    ],
    desvantagens: [
      { nome: 'Código (proteger aliados)', valor: '-1', desc: 'Apesar da postura fria, arrisca-se para proteger companheiros e inocentes.' },
    ],
    inventario: [
      { nome: 'Boné e uniforme', quantidade: 1, raridade: 'Comum', notas: 'Itens de aparência; sem benefício mecânico.' },
    ],
    notas: 'Adaptação de fã de 10 pontos. Cálculo: P2 + H3 + R2 = 7; Luta + Percepção = 2; Ajudante (Star Platinum) + Ataque Especial (Múltiplo) = 2; Código = -1. Total: 10 pontos. O Stand foi simplificado para caber na ficha básica.',
  }),

  buildModel({
    nome: 'Maka Albarn',
    arquetipo: 'Humana',
    conceito: 'Mestra de foice disciplinada, técnica e estudiosa, lutando em sincronia com Soul.',
    atributos: { poder: 2, habilidade: 3, resistencia: 2 },
    pericias: ['luta', 'saber'],
    vantagens: [
      { nome: 'Ajudante (Soul)', custo: '1', desc: 'Soul é representado como Ajudante e arma parceira inteligente.' },
      { nome: 'Ataque Especial (Preciso)', custo: '1', desc: 'Golpes de foice guiados por técnica e sincronia.' },
    ],
    desvantagens: [
      { nome: 'Código (proteger pessoas)', valor: '-1', desc: 'Mantém forte compromisso com proteger aliados e enfrentar ameaças perigosas.' },
    ],
    inventario: [
      { nome: 'Uniforme da DWMA', quantidade: 1, raridade: 'Comum', notas: 'Sem efeito mecânico nesta adaptação.' },
    ],
    notas: 'Adaptação de fã de 10 pontos. Cálculo: P2 + H3 + R2 = 7; Luta + Saber = 2; Ajudante (Soul) + Ataque Especial (Preciso) = 2; Código = -1. Total: 10 pontos. Soul foi tratado como Ajudante para manter a parceria central da personagem.',
  }),
];
