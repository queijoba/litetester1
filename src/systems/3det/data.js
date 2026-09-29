export const TRESDET_SKILLS = [
  ['animais', 'Animais'],
  ['arte', 'Arte'],
  ['esporte', 'Esporte'],
  ['influencia', 'Influência'],
  ['luta', 'Luta'],
  ['manha', 'Manha'],
  ['maquinas', 'Máquinas'],
  ['medicina', 'Medicina'],
  ['mistica', 'Mística'],
  ['percepcao', 'Percepção'],
  ['saber', 'Saber'],
  ['sobrevivencia', 'Sobrevivência'],
];

export const TRESDET_RARITIES = ['Comum', 'Incomum', 'Raro'];

export const initial3DetPcData = {
  id: '',
  system: '3det',
  type: 'pc',
  bio: {
    nome: '',
    jogador: '',
    arquetipo: '',
    kit: '',
    conceito: '',
    escala: '',
    imagem: '',
  },
  pontos: 10,
  xp: 0,
  atributos: {
    poder: 0,
    habilidade: 0,
    resistencia: 0,
  },
  status: {
    pa: { atual: 0, max: 0 },
    pm: { atual: 0, max: 0 },
    pv: { atual: 0, max: 0 },
  },
  pericias: Object.fromEntries(TRESDET_SKILLS.map(([id]) => [id, false])),
  periciasPersonalizadas: [],
  especializacoes: [],
  combate: {
    fa: { atributo: '', ganho: '' },
    fd: { atributo: '', ganho: '' },
  },
  vantagens: [],
  desvantagens: [],
  tecnicas: [],
  inventario: [],
  notas: '',
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const listOrEmpty = (value) => (Array.isArray(value) ? value : []);
const cleanText = (value) => String(value || '').trim();

const normalizeCustomSkills = (value) => {
  const seen = new Set();
  return listOrEmpty(value)
    .map((entry, index) => {
      const nome = cleanText(entry?.nome ?? entry?.name);
      if (!nome) return null;
      const normalizedName = nome.toLocaleLowerCase('pt-BR');
      if (seen.has(normalizedName)) return null;
      seen.add(normalizedName);
      return {
        id: cleanText(entry?.id) || `custom-${index + 1}`,
        nome,
        selecionada: entry?.selecionada !== false,
      };
    })
    .filter(Boolean);
};

export const normalize3DetPcData = (item) => {
  const source = clone(item || {});
  if (source.system !== '3det' || source.type !== 'pc') return source;

  source.bio = { ...initial3DetPcData.bio, ...(source.bio || {}) };
  source.atributos = { ...initial3DetPcData.atributos, ...(source.atributos || {}) };
  source.status = { ...clone(initial3DetPcData.status), ...(source.status || {}) };
  source.status.pa = { ...initial3DetPcData.status.pa, ...(source.status?.pa || {}) };
  source.status.pm = { ...initial3DetPcData.status.pm, ...(source.status?.pm || {}) };
  source.status.pv = { ...initial3DetPcData.status.pv, ...(source.status?.pv || {}) };
  source.pericias = { ...initial3DetPcData.pericias, ...(source.pericias || {}) };
  source.combate = { ...clone(initial3DetPcData.combate), ...(source.combate || {}) };
  source.combate.fa = { ...initial3DetPcData.combate.fa, ...(source.combate?.fa || {}) };
  source.combate.fd = { ...initial3DetPcData.combate.fd, ...(source.combate?.fd || {}) };

  source.pontos = Number(source.pontos ?? initial3DetPcData.pontos) || 0;
  source.xp = Number(source.xp ?? 0) || 0;
  Object.keys(initial3DetPcData.atributos).forEach((key) => {
    source.atributos[key] = Number(source.atributos[key] ?? 0) || 0;
  });
  ['pa', 'pm', 'pv'].forEach((key) => {
    source.status[key].atual = Number(source.status[key].atual ?? 0) || 0;
    source.status[key].max = Number(source.status[key].max ?? 0) || 0;
  });
  TRESDET_SKILLS.forEach(([id]) => { source.pericias[id] = !!source.pericias[id]; });

  source.periciasPersonalizadas = normalizeCustomSkills(source.periciasPersonalizadas);
  source.especializacoes = listOrEmpty(source.especializacoes).map((entry) => ({
    nome: '', periciaBase: '', notas: '', ...(entry || {}),
    nome: cleanText(entry?.nome),
    periciaBase: cleanText(entry?.periciaBase),
    notas: String(entry?.notas || ''),
  }));

  source.vantagens = listOrEmpty(source.vantagens).map((entry) => ({
    nome: '', custo: '', desc: '', ...(entry || {}),
  }));
  source.desvantagens = listOrEmpty(source.desvantagens).map((entry) => ({
    nome: '', valor: '', desc: '', ...(entry || {}),
  }));
  source.tecnicas = listOrEmpty(source.tecnicas).map((entry) => ({
    nome: '', custo: '', desc: '', ...(entry || {}),
  }));
  source.inventario = listOrEmpty(source.inventario).map((entry) => ({
    nome: '', quantidade: 1, raridade: 'Comum', notas: '', ...(entry || {}),
    quantidade: Math.max(0, Number(entry?.quantidade ?? 1) || 0),
    raridade: TRESDET_RARITIES.includes(entry?.raridade) ? entry.raridade : 'Comum',
  }));
  source.notas = String(source.notas || '');

  return { ...clone(initial3DetPcData), ...source };
};
