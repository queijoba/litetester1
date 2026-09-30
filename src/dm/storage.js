import LZString from 'lz-string';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants.js';

export const SHIELD_SCHEMA_VERSION = 2;

export function uid(prefix = 'dm') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function deepClone(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function migrateWidget(widget) {
  const w = { ...widget };
  w.id = String(w.id || uid('widget'));
  w.type = w.type || 'note';
  w.title = w.title || 'Janela';
  w.x = Number.isFinite(Number(w.x)) ? Number(w.x) : 16;
  w.y = Number.isFinite(Number(w.y)) ? Number(w.y) : 16;
  w.w = Math.max(250, Number(w.w) || 360);
  w.h = Math.max(200, Number(w.h) || 310);
  w.z = Number(w.z) || 1;
  w.locked = !!w.locked;
  w.minimized = !!w.minimized;
  w.maximized = false;
  w.restoreGeom = null;

  if (w.type === 'note') {
    w.pages = Array.isArray(w.pages) && w.pages.length ? w.pages : [{ id: uid('page'), title: 'Nova Página', content: '' }];
    w.activePageId = w.activePageId || w.pages[0].id;
    w.noteToolsHidden = !!w.noteToolsHidden;
  }
  if (w.type === 'dice') {
    w.result = w.result ?? '—';
    w.qty = Math.max(1, Number(w.qty) || 1);
    w.mod = Number(w.mod) || 0;
    w.formula = w.formula || '';
    w.history = Array.isArray(w.history) ? w.history.slice(0, 12) : [];
  }
  if (w.type === 'initiative') {
    w.combatants = Array.isArray(w.combatants) ? w.combatants.map(c => ({ id: String(c.id || uid('c')), name: c.name || 'Combatente', init: c.init ?? '', hp: c.hp ?? '', cond: c.cond ?? '' })) : [];
    w.activeId = w.activeId || w.combatants[0]?.id || null;
    w.round = Math.max(1, Number(w.round) || 1);
  }
  if (w.type === 'links') w.links = Array.isArray(w.links) ? w.links : [];
  if (w.type === 'image') {
    w.zoom = Math.min(300, Math.max(40, Number(w.zoom) || 100));
    w.imageData = w.imageData || '';
    w.imageUrlInput = w.imageUrlInput || '';
  }
  if (w.type === 'table') {
    w.rows = Array.isArray(w.rows) && w.rows.length ? w.rows : [['', ''], ['', '']];
    w.cellStyles = w.cellStyles && typeof w.cellStyles === 'object' ? w.cellStyles : {};
    w.selectedCell = null;
    w.struct = !!w.struct;
  }
  if (w.type === 'npc') {
    w.npc = {
      name: 'Novo NPC', hp: 10, hpMax: 10, def: '', init: '', attack: '', damage: '', cond: '', notes: '',
      ...(w.npc || {}),
    };
  }
  if (w.type === 'clock') {
    w.clock = { name: 'Relógio', value: 0, max: 6, ...(w.clock || {}) };
    w.clock.max = [4, 6, 8, 10, 12].includes(Number(w.clock.max)) ? Number(w.clock.max) : 6;
    w.clock.value = Math.max(0, Math.min(w.clock.max, Number(w.clock.value) || 0));
  }
  return w;
}

export function migrateShield(input) {
  const shield = { ...(input || {}) };
  shield.id = String(shield.id || uid('shield'));
  shield.name = String(shield.name || 'Escudo sem nome');
  shield.genre = String(shield.genre || '');
  shield.system = shield.system || 'generic';
  shield.widgets = Array.isArray(shield.widgets) ? shield.widgets.map(migrateWidget) : [];
  shield.settings = { ...DEFAULT_SETTINGS, ...(shield.settings || {}) };
  shield.topZ = Math.max(Number(shield.topZ) || 10, ...shield.widgets.map(w => Number(w.z) || 1), 10);
  shield.createdAt = shield.createdAt || new Date().toISOString();
  shield.updatedAt = shield.updatedAt || shield.createdAt;
  shield.schemaVersion = SHIELD_SCHEMA_VERSION;
  return shield;
}

export function loadShields() {
  if (typeof window === 'undefined') return [];
  const raw = safeParse(window.localStorage.getItem(STORAGE_KEYS.shields), []);
  const list = Array.isArray(raw) ? raw : [];
  const migrated = list.map(migrateShield);
  if (JSON.stringify(list) !== JSON.stringify(migrated)) saveShields(migrated);
  return migrated;
}

export function saveShields(shields) {
  if (typeof window === 'undefined') return { ok: false, error: 'no-window' };
  try {
    window.localStorage.setItem(STORAGE_KEYS.shields, JSON.stringify(shields));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export function loadCurrentShieldId() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(STORAGE_KEYS.current) || '';
}

export function saveCurrentShieldId(id) {
  if (typeof window === 'undefined') return;
  if (id) window.localStorage.setItem(STORAGE_KEYS.current, String(id));
  else window.localStorage.removeItem(STORAGE_KEYS.current);
}

export function makeShieldTransferPayload(shield) {
  const copy = deepClone(migrateShield(shield));
  delete copy.id;
  return {
    app: 'DM Lite',
    format: 'shield',
    version: 2,
    exportedAt: new Date().toISOString(),
    shield: copy,
  };
}

export function encodeShieldCode(shield) {
  const json = JSON.stringify(makeShieldTransferPayload(shield));
  return `DMLITE2:${LZString.compressToBase64(json)}`;
}

function decodeLegacyBase64(payload) {
  try {
    const binary = atob(payload.replace(/\s/g, ''));
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

export function decodeShieldCode(code) {
  const raw = String(code || '').trim();
  let json = '';
  if (raw.startsWith('DMLITE2:')) {
    json = LZString.decompressFromBase64(raw.slice(8)) || '';
  } else if (raw.startsWith('DMLITE1:')) {
    json = decodeLegacyBase64(raw.slice(8));
  } else if (raw.startsWith('{')) {
    json = raw;
  }
  if (!json) throw new Error('Código de escudo inválido.');
  return JSON.parse(json);
}

export function importShieldPayload(payload, existing = []) {
  const source = payload?.shield || payload;
  if (!source || typeof source !== 'object' || !Array.isArray(source.widgets)) {
    throw new Error('Arquivo de escudo inválido.');
  }
  const shield = migrateShield(source);
  shield.id = uid('shield');
  const baseName = shield.name || 'Escudo Importado';
  let candidate = baseName;
  let n = 2;
  while (existing.some(x => x.name === candidate)) candidate = `${baseName} (${n++})`;
  shield.name = candidate;
  shield.createdAt = new Date().toISOString();
  shield.updatedAt = shield.createdAt;
  return shield;
}

export function downloadShieldJson(shield) {
  const payload = makeShieldTransferPayload(shield);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const safe = String(shield.name || 'Escudo').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]+/gi, '_');
  a.download = `DM_Lite_${safe || 'Escudo'}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
