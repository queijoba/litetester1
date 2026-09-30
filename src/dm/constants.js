export const DM_VERSION = '0.4.0 Alpha';

export const STORAGE_KEYS = {
  shields: 'dmlite_shields_v1',
  current: 'dmlite_current_shield_v1',
  pjCharacters: 'dragonbane_saved_characters',
  pjThreats: 'dragonbane_saved_threats',
};

export const THEMES = {
  amber: { label: 'Âmbar', accent: '#f59e0b', bg: '#11100f', panel: '#1c1917' },
  dragonbane: { label: 'Dragonbane', accent: '#2dd4bf', bg: '#071c1b', panel: '#0f2927' },
  fabula: { label: 'Fabula Ultima', accent: '#14b8a6', bg: '#071c22', panel: '#0d2830' },
  dnd: { label: 'D&D', accent: '#ef4444', bg: '#1c0909', panel: '#2a1010' },
  blue: { label: 'Azul', accent: '#60a5fa', bg: '#0b1220', panel: '#111c31' },
  purple: { label: 'Roxo', accent: '#a78bfa', bg: '#140c24', panel: '#21143a' },
};

export const SYSTEM_LABELS = {
  generic: 'Genérico',
  dragonbane: 'Dragonbane',
  fabula: 'Fabula Ultima',
  dnd5e: 'D&D 5.5e',
  som6: 'O Som das Seis',
  '3det': '3DeT Victory',
};

export const SYSTEM_ICONS = {
  generic: '🛡️',
  dragonbane: '🐉',
  fabula: '✨',
  dnd5e: '🐲',
  som6: '🤠',
  '3det': '⭐',
};

export const WIDGET_LABELS = {
  note: 'Anotações',
  dice: 'Dados',
  initiative: 'Iniciativa',
  links: 'Links',
  image: 'Imagem',
  table: 'Tabela',
  npc: 'NPC Rápido',
  clock: 'Relógio',
  reference: 'Referência',
  pj: 'PJ Lite',
};

export const TOOLBAR_WIDGETS = [
  ['note', '📝', 'Nota'],
  ['dice', '🎲', 'Dados'],
  ['initiative', '⚔️', 'Iniciativa'],
  ['links', '🔗', 'Links'],
  ['image', '🖼️', 'Imagem'],
  ['table', '▦', 'Tabela'],
  ['npc', '👹', 'NPC'],
  ['clock', '◷', 'Relógio'],
];

export const DND_SKILLS = [
  ['acrobacia', 'Acrobacia', 'des'], ['arcanismo', 'Arcanismo', 'int'],
  ['atletismo', 'Atletismo', 'for'], ['atuacao', 'Atuação', 'car'],
  ['enganacao', 'Enganação', 'car'], ['furtividade', 'Furtividade', 'des'],
  ['historia', 'História', 'int'], ['intimidacao', 'Intimidação', 'car'],
  ['intuicao', 'Intuição', 'sab'], ['investigacao', 'Investigação', 'int'],
  ['lidaranimais', 'Lidar com Animais', 'sab'], ['medicina', 'Medicina', 'sab'],
  ['natureza', 'Natureza', 'int'], ['percepcao', 'Percepção', 'sab'],
  ['persuasao', 'Persuasão', 'car'], ['prestidigitacao', 'Prestidigitação', 'des'],
  ['religiao', 'Religião', 'int'], ['sobrevivencia', 'Sobrevivência', 'sab'],
];

export const CHANGELOG = [
  {
    version: '0.4.0 Alpha',
    title: 'Migração React & versão funcional',
    text: 'DM Lite agora roda como app React/Vite dentro do repositório do PJ Lite, em /dm/. Mantém saves de escudos, widgets, importação/exportação, integração direta com fichas locais do PJ Lite e um mobile próprio em pilha com reordenação.'
  },
  {
    version: '0.3.6 Alpha',
    title: 'Tabelas formatáveis',
    text: 'Células ganharam tamanho de fonte, cor, negrito, itálico e sublinhado.'
  },
  {
    version: '0.3.5 Alpha',
    title: 'Toque & janelas',
    text: 'Pointer Capture, janelas adaptadas ao celular e melhorias de arraste.'
  },
  {
    version: '0.3.4 Alpha',
    title: 'Saves & compartilhamento',
    text: 'Escudos nomeáveis, gênero/tema, importação e exportação por arquivo ou código.'
  },
  {
    version: '0.3.3 Alpha',
    title: 'Anotações simplificadas',
    text: 'Editor escuro com barra recolhível e formatação aplicada ao trecho selecionado.'
  },
];

export const DEFAULT_SETTINGS = {
  theme: 'amber',
  fontSize: 16,
  backgroundType: 'theme',
  backgroundValue: '',
  backgroundOpacity: 0.28,
};
