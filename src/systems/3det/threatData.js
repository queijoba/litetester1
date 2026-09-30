import { TRESDET_SKILLS } from './data.js';

export const TRESDET_THREAT_CATEGORIES = ['NPC', 'Criatura', 'Animal', 'Monstro', 'Vilão'];
export const TRESDET_THREAT_ROLES = ['Comum', 'Capanga', 'Especialista', 'Rival', 'Chefe'];
export const TRESDET_SCALES = ['Ningen', 'Sugoi', 'Kiodai', 'Kami'];

export const initial3DetThreatData = {
  id: '',
  system: '3det',
  type: 'ameaca',
  nome: '',
  categoria: 'Criatura',
  papel: 'Comum',
  conceito: '',
  escala: 'Ningen',
  pontos: 5,
  imagem: '',
  atributos: { poder: 1, habilidade: 1, resistencia: 1 },
  status: {
    pa: { atual: 1, max: 1 },
    pm: { atual: 5, max: 5 },
    pv: { atual: 5, max: 5 },
  },
  pericias: Object.fromEntries(TRESDET_SKILLS.map(([id]) => [id, false])),
  periciasPersonalizadas: [],
  vantagens: [],
  desvantagens: [],
  tecnicas: [],
  acoes: [],
  notas: '',
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const list = (value) => Array.isArray(value) ? value : [];
const text = (value) => String(value ?? '').trim();

const normalizeAttr = (value, fallback = 0) => {
  if (value === '—' || value === '-') return '—';
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const normalize3DetThreatData = (item) => {
  const source = clone(item || {});
  if (source.system !== '3det' || source.type === 'pc') return source;

  const result = { ...clone(initial3DetThreatData), ...source };
  result.type = 'ameaca';
  result.nome = text(source.nome);
  result.categoria = TRESDET_THREAT_CATEGORIES.includes(source.categoria) ? source.categoria : 'Criatura';
  result.papel = TRESDET_THREAT_ROLES.includes(source.papel) ? source.papel : 'Comum';
  result.escala = TRESDET_SCALES.includes(source.escala) ? source.escala : 'Ningen';
  result.pontos = Math.max(0, Number(source.pontos ?? 0) || 0);
  result.conceito = String(source.conceito || '');
  result.imagem = String(source.imagem || '');

  result.atributos = { ...initial3DetThreatData.atributos, ...(source.atributos || {}) };
  for (const key of ['poder', 'habilidade', 'resistencia']) {
    result.atributos[key] = normalizeAttr(result.atributos[key], 0);
  }

  result.status = { ...clone(initial3DetThreatData.status), ...(source.status || {}) };
  for (const key of ['pa', 'pm', 'pv']) {
    result.status[key] = { ...initial3DetThreatData.status[key], ...(source.status?.[key] || {}) };
    result.status[key].atual = Math.max(0, Number(result.status[key].atual ?? 0) || 0);
    result.status[key].max = Math.max(0, Number(result.status[key].max ?? 0) || 0);
  }

  result.pericias = { ...initial3DetThreatData.pericias, ...(source.pericias || {}) };
  TRESDET_SKILLS.forEach(([id]) => { result.pericias[id] = !!result.pericias[id]; });
  const seen = new Set();
  result.periciasPersonalizadas = list(source.periciasPersonalizadas).map((entry, index) => {
    const nome = text(entry?.nome ?? entry);
    if (!nome) return null;
    const key = nome.toLocaleLowerCase('pt-BR');
    if (seen.has(key)) return null;
    seen.add(key);
    return { id: text(entry?.id) || `threat-skill-${index + 1}`, nome, selecionada: entry?.selecionada !== false };
  }).filter(Boolean);

  result.vantagens = list(source.vantagens).map((entry) => ({ nome: '', custo: '', desc: '', ...(entry || {}) }));
  result.desvantagens = list(source.desvantagens).map((entry) => ({ nome: '', valor: '', desc: '', ...(entry || {}) }));
  result.tecnicas = list(source.tecnicas).map((entry) => ({ nome: '', custo: '', desc: '', ...(entry || {}) }));
  result.acoes = list(source.acoes).map((entry) => ({ nome: '', custo: '', desc: '', ...(entry || {}) }));
  result.notas = String(source.notas || '');
  return result;
};
