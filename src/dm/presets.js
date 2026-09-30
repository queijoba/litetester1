import { DEFAULT_SETTINGS } from './constants.js';
import { uid } from './storage.js';

function ref(title, subtitle, sections, x, y, w = 430, h = 330) {
  return { id: uid('widget'), type: 'reference', title, subtitle, sections, x, y, w, h, z: 1, locked: false, minimized: false };
}

function basic(type, title, x, y, w = 360, h = 310) {
  const base = { id: uid('widget'), type, title, x, y, w, h, z: 2, locked: false, minimized: false };
  if (type === 'dice') Object.assign(base, { result: '—', qty: 1, mod: 0, formula: '', history: [] });
  if (type === 'initiative') Object.assign(base, { combatants: [], activeId: null, round: 1 });
  if (type === 'npc') Object.assign(base, { npc: { name: 'Novo NPC', hp: 10, hpMax: 10, def: '', init: '', attack: '', damage: '', cond: '', notes: '' } });
  if (type === 'clock') Object.assign(base, { clock: { name: 'Objetivo', value: 0, max: 6 } });
  return base;
}

const dragonbaneRefs = [
  ref('Dragonbane — Combate', 'Ações e lembretes rápidos', [
    { title: 'Dragão e Demônio', body: ['Resultado 1 pode gerar benefício adicional e não pode ser forçado.', 'Resultado 20 pode trazer complicações adequadas à situação.'] },
    { title: 'Ações comuns', body: ['Arrancada dobra o movimento na rodada.', 'Ataque corporal normalmente alcança 2 m; armas longas podem alcançar 4 m.', 'Bloqueio e esquiva funcionam como reações.', 'Pegar item, usar item, ativar habilidade, conjurar magia e ajudar são ações frequentes.'] },
    { title: 'Ataques especiais', body: ['Encontrar ponto fraco', 'Derrubar', 'Desarmar', 'Agarrar'] },
  ], 16, 16),
  ref('Dragonbane — Tempo & Jornada', 'Exploração e recuperação', [
    { title: 'Medidas de tempo', rows: [['Rodada', '10 s'], ['Turno', '15 min'], ['Quarto de dia', '6 h']] },
    { title: 'Descansos', body: ['Rodada: recuperação curta de FV.', 'Turno: recupera PV/FV e pode curar uma condição.', 'Quarto de dia: em local seguro, recupera PV/FV e condições.'] },
    { title: 'Jornadas', body: ['Em terreno sem trilha, o desbravador testa Sobrevivência por quarto de dia.', 'Mapa ajuda a navegação; terreno difícil pode impor perdição.', 'Um Dragão pode representar um atalho e aumentar a distância percorrida.'] },
  ], 462, 16),
  basic('initiative', 'Iniciativa', 16, 360, 470, 330),
  basic('dice', 'Dados', 500, 360, 340, 300),
  basic('npc', 'PNJ Rápido', 854, 360, 350, 330),
];

const fabulaRefs = [
  ref('Fabula Ultima — Testes & Dano', 'Dificuldades e improviso', [
    { title: 'Dificuldades', rows: [['ND 7', 'Fácil'], ['ND 10', 'Normal'], ['ND 13', 'Difícil'], ['ND 16', 'Muito Difícil']] },
    { title: 'Dano improvisado', rows: [['Nível 5+', '10 / 30 / 40'], ['Nível 20+', '20 / 40 / 60'], ['Nível 40+', '30 / 50 / 80']] },
    { title: 'Oportunidades', body: ['Aflição', 'Avaliar', 'Conexão', 'Desmascarar', 'Favor', 'Informações', 'Item Perdido', 'Progresso', 'Reviravolta', 'Vantagem'] },
  ], 16, 16),
  ref('Fabula Ultima — Combate', 'Ações, condições e objetivos', [
    { title: 'Ações no turno', body: ['Ataque', 'Poder', 'Feitiço', 'Estudo', 'Guarda', 'Impedimento', 'Objetivo', 'Inventário', 'Equipamento'] },
    { title: 'Condições', rows: [['Atordoado', 'AST'], ['Abalado', 'VON'], ['Enfurecido', 'DES e AST'], ['Lento', 'DES'], ['Envenenado', 'VIG e VON'], ['Fraco', 'VIG']] },
    { title: 'Relógios', body: ['Objetivo pequeno: 4 seções.', 'Grande: 6 a 8.', 'Resolutivo: 10 a 12.'] },
  ], 462, 16),
  basic('initiative', 'Iniciativa', 16, 360, 470, 330),
  basic('dice', 'Dados', 500, 360, 340, 300),
  basic('clock', 'Relógio de Objetivo', 854, 360, 330, 280),
];

const dndRefs = [
  ref('D&D 5.5e — Condições', 'Referência rápida', [
    { title: 'Condições frequentes', body: ['Cego: afeta testes de visão e ataques.', 'Amedrontado: penalidades enquanto a fonte do medo estiver visível.', 'Agarrado: movimento 0 e limitações de ataque.', 'Caído: rastejar ou gastar movimento para levantar.', 'Contido: movimento 0; ataques contra recebem Vantagem.', 'Atordoado: incapacitado e vulnerável a ataques.'] },
    { title: 'Exaustão', body: ['Níveis cumulativos afetam jogadas de d20 e movimento. Consulte a regra completa quando o efeito for decisivo.'] },
  ], 16, 16),
  ref('D&D 5.5e — Ações & Cobertura', 'Combate e terreno', [
    { title: 'Ações comuns', body: ['Ataque', 'Disparada', 'Desengajar', 'Esquivar', 'Ajudar', 'Esconder-se', 'Influenciar', 'Preparar', 'Procurar', 'Estudar', 'Magia'] },
    { title: 'Cobertura', rows: [['1/2', '+2 CA e Salvaguarda de Destreza'], ['3/4', '+5 CA e Salvaguarda de Destreza'], ['Total', 'Alvo não pode ser atingido diretamente']] },
  ], 462, 16),
  ref('D&D 5.5e — Viagem & Descanso', 'Exploração', [
    { title: 'Ritmo de viagem', rows: [['Rápido', '6 km/h · 45 km/dia'], ['Normal', '4,5 km/h · 36 km/dia'], ['Lento', '3 km/h · 27 km/dia']] },
    { title: 'Descanso curto', body: ['Período de inatividade e atividades leves.', 'Pode permitir gasto de Dados de Vida e recuperação de recursos.'] },
    { title: 'Descanso longo', body: ['Repouso prolongado com sono e atividades leves.', 'Recupera recursos conforme as regras do sistema.'] },
  ], 908, 16),
  basic('initiative', 'Iniciativa', 16, 360, 470, 330),
  basic('dice', 'Dados', 500, 360, 340, 300),
  basic('npc', 'NPC / Monstro Rápido', 854, 360, 350, 330),
];

export const READY_PRESETS = {
  blank: {
    label: 'Mesa em Branco', icon: '🛡️', system: 'generic', genre: 'Genérico', theme: 'amber',
    description: 'Comece limpo e monte apenas o que precisa.', widgets: [],
  },
  dragonbane: {
    label: 'Dragonbane', icon: '🐉', system: 'dragonbane', genre: 'Fantasia Medieval', theme: 'dragonbane',
    description: 'Combate, jornada, iniciativa, dados e PNJ rápido.', widgets: dragonbaneRefs,
  },
  fabula: {
    label: 'Fabula Ultima', icon: '✨', system: 'fabula', genre: 'JRPG / Fantasia', theme: 'fabula',
    description: 'Testes, oportunidades, condições, relógio e iniciativa.', widgets: fabulaRefs,
  },
  dnd5e: {
    label: 'D&D 5.5e', icon: '🐲', system: 'dnd5e', genre: 'Fantasia Medieval', theme: 'dnd',
    description: 'Condições, ações, cobertura, viagem, iniciativa e NPC.', widgets: dndRefs,
  },
};

export function presetShield(kind, name, genre) {
  const preset = READY_PRESETS[kind] || READY_PRESETS.blank;
  const now = new Date().toISOString();
  return {
    id: uid('shield'),
    name: name || `Escudo ${preset.label}`,
    genre: genre || preset.genre,
    system: preset.system,
    widgets: JSON.parse(JSON.stringify(preset.widgets)).map((w, index) => ({ ...w, id: uid('widget'), z: index + 1 })),
    settings: { ...DEFAULT_SETTINGS, theme: preset.theme },
    topZ: Math.max(10, preset.widgets.length + 1),
    createdAt: now,
    updatedAt: now,
    schemaVersion: 2,
  };
}
