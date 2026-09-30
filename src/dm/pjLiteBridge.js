import LZString from 'lz-string';
import { DND_SKILLS, STORAGE_KEYS, SYSTEM_LABELS } from './constants.js';

function safeParse(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

function value(v, fallback = '—') {
  return v === undefined || v === null || v === '' ? fallback : v;
}

function dndMod(score) {
  return Math.floor((Number(score || 10) - 10) / 2);
}

function signed(n) {
  const v = Number(n) || 0;
  return v >= 0 ? `+${v}` : String(v);
}

function proficiencyBonus(level) {
  return 2 + Math.floor((Math.max(1, Number(level) || 1) - 1) / 4);
}

function trainedDndSkills(item) {
  const prof = proficiencyBonus(item.bio?.nivel || 1);
  const attrs = item.atributos || {};
  return DND_SKILLS.map(([id, name, attr]) => {
    const entry = (item.pericias || []).find(p => p.id === id);
    if (!entry?.prof) return null;
    const bonus = dndMod(attrs[attr] ?? 10) + Number(entry.prof) * prof;
    return `${entry.prof === 2 ? 'Expertise' : 'Treinada'} · ${name} ${signed(bonus)}`;
  }).filter(Boolean);
}

function section(title, items) {
  const clean = (items || []).filter(Boolean);
  return clean.length ? { title, items: clean } : null;
}

export function buildPJQuick(item) {
  const system = item.system || 'dragonbane';
  const type = item.type || 'pc';
  const name = item.bio?.nome || item.nome || 'Sem Nome';
  const stats = [];
  const sections = [];
  let initiative = '';
  let hp = '';
  let subtitle = SYSTEM_LABELS[system] || system;

  if (system === 'dnd5e' && type === 'pc') {
    const st = item.status || {};
    const bio = item.bio || {};
    stats.push(['PV', `${value(st.pvAtual, 0)}/${value(st.pvMax, 0)}`], ['CA', value(st.ca, 10)], ['Inic.', value(st.iniciativa, signed(dndMod(item.atributos?.des)))], ['Mov.', value(st.deslocamento)], ['Nível', value(bio.nivel, 1)], ['Classe', value(bio.classe)]);
    initiative = st.iniciativa ?? signed(dndMod(item.atributos?.des));
    hp = `${value(st.pvAtual, 0)}/${value(st.pvMax, 0)}`;
    subtitle = `${value(bio.linhagem)} · ${value(bio.classe)} Nv. ${value(bio.nivel, 1)}`;

    sections.push(section('Perícias treinadas', trainedDndSkills(item)));
    sections.push(section('Características & Talentos', (Array.isArray(item.caracteristicas) ? item.caracteristicas : []).map(x => x?.nome ? `${x.nome}${x.desc ? ` — ${x.desc}` : ''}` : null)));
    sections.push(section('Ataques', (item.ataques || []).map(x => x?.nome ? `${x.nome} · ${value(x.bonus)} · ${value(x.dano)} ${value(x.tipo, '')}`.trim() : null)));
    sections.push(section('Magias', (item.magias?.lista || []).map(x => x?.nome ? `${x.nome}${x.nivel !== undefined && x.nivel !== '' ? ` · ${x.nivel}` : ''}` : null)));
    if (item.outrasProficiencias) sections.push(section('Outras proficiências', [item.outrasProficiencias]));
  } else if (system === 'dnd5e') {
    stats.push(['PV', value(item.pv)], ['CA', value(item.ca)], ['ND', value(item.desafio)], ['Mov.', value(item.deslocamento)], ['Tipo', value(item.tipo)], ['Tam.', value(item.tamanho)]);
    hp = String(value(item.pv, ''));
    subtitle = `${value(item.tamanho)} ${value(item.tipo)}`;
    sections.push(section('Perícias', item.pericias ? [item.pericias] : []));
    sections.push(section('Traços', (item.tracos || []).map(x => x?.nome ? `${x.nome}${x.desc ? ` — ${x.desc}` : ''}` : null)));
    sections.push(section('Ações', (item.acoes || []).map(x => x?.nome ? `${x.nome}${x.desc ? ` — ${x.desc}` : ''}` : null)));
  } else if (system === 'fabula' && type === 'pc') {
    const st = item.status || {};
    stats.push(['PV', `${value(st.pvAtual, 0)}/${value(st.pvMax, 0)}`], ['PM', `${value(st.pmAtual, 0)}/${value(st.pmMax, 0)}`], ['DEF', value(st.defesa)], ['DEF.M', value(st.defesaMagica)], ['Inic.', value(st.iniciativa)], ['Nível', value(item.nivel, 5)]);
    initiative = st.iniciativa ?? '';
    hp = `${value(st.pvAtual, 0)}/${value(st.pvMax, 0)}`;
    subtitle = `${value(item.bio?.identidade)} · ${value(item.bio?.tema)}`;
    sections.push(section('Classes', (item.classes || []).map(c => c?.nome ? `${c.nome} · Nv. ${value(c.nivel, 1)}` : null)));
    sections.push(section('Poderes', [
      ...(item.classes || []).flatMap(c => (c?.poderes || []).map(p => p?.nome ? `${p.nome}${p.desc ? ` — ${p.desc}` : ''}` : null)),
      ...(item.poderesHeroicos || []).map(p => p?.nome ? `${p.nome}${p.desc ? ` — ${p.desc}` : ''}` : null),
    ]));
    sections.push(section('Equipamentos', (item.equipamentos || []).map(e => e?.nome ? `${e.slot || 'Item'}: ${e.nome}${e.descricao ? ` — ${e.descricao}` : ''}` : null)));
    const conditions = Object.entries(item.condicoes || {}).filter(([, on]) => on).map(([k]) => k[0].toUpperCase() + k.slice(1));
    sections.push(section('Condições', conditions));
    const spells = item.extras?.magia?.feiticos || [];
    sections.push(section('Magias & Rituais', [
      ...spells.map(s => s?.nome ? `${s.nome}${s.pm ? ` · ${s.pm} PM` : ''}` : null),
      ...(item.extras?.magia?.rituais || []).map(r => r?.nome ? `Ritual: ${r.nome}` : null),
    ]));
  } else if (system === 'fabula') {
    const st = item.status || {};
    stats.push(['PV', `${value(st.pvAtual, 0)}/${value(st.pvMax, 0)}`], ['PM', `${value(st.pmAtual, 0)}/${value(st.pmMax, 0)}`], ['DEF', value(st.defesa)], ['DEF.M', value(st.defesaMagica)], ['Inic.', value(st.iniciativa)], ['Nível', value(item.nivel, 5)]);
    initiative = st.iniciativa ?? '';
    hp = `${value(st.pvAtual, 0)}/${value(st.pvMax, 0)}`;
    subtitle = `${value(item.tipoNpc || item.type)} · ${value(item.patente)}`;
    sections.push(section('Ataques', (item.ataques || []).map(a => a?.nome ? `${a.nome} · ${value(a.teste)} · ${value(a.dano)} ${value(a.tipoDano, '')}`.trim() : null)));
    sections.push(section('Poderes & Regras', [...(item.poderes || []), ...(item.outrasAcoes || []), ...(item.regrasEspeciais || [])].map(x => x?.nome ? `${x.nome}${x.desc ? ` — ${x.desc}` : ''}` : null)));
  } else if (system === 'dragonbane' && type === 'pc') {
    const st = item.status || {};
    stats.push(['PV', `${value(st.pv?.atual, 0)}/${value(st.pv?.max, 0)}`], ['PD/FV', `${value(st.pd?.atual, 0)}/${value(st.pd?.max, 0)}`], ['Mov.', value(item.derivados?.movimento)], ['FOR dano', value(item.derivados?.danoBonusFor)], ['AGL dano', value(item.derivados?.danoBonusAgl)], ['Prof.', value(item.bio?.profissao)]);
    hp = `${value(st.pv?.atual, 0)}/${value(st.pv?.max, 0)}`;
    subtitle = `${value(item.bio?.ancestralidade)} · ${value(item.bio?.profissao)}`;
    const skills = [...(item.periciasBase || []), ...(item.periciasArmas || []), ...(item.periciasSecundarias || [])]
      .filter(p => p?.treinada || Number(p?.valor) >= 12)
      .map(p => `${p.treinada ? 'Treinada · ' : ''}${value(p.nome)} ${value(p.valor)}`);
    sections.push(section('Perícias treinadas / altas', skills));
    sections.push(section('Habilidades & Feitiços', (item.habilidadesFeiticos || []).map(h => h?.nome ? `${h.nome}${h.fv_nvl ? ` · ${h.fv_nvl}` : ''}${h.descricao || h.desc ? ` — ${h.descricao || h.desc}` : ''}` : null)));
    sections.push(section('Armas', (item.armas || []).map(a => a?.nome ? `${a.nome} · ${value(a.dano)}${a.tracos ? ` · ${a.tracos}` : ''}` : null)));
  } else if (system === 'dragonbane' && type === 'pnj') {
    const st = item.status || {};
    stats.push(['PV', `${value(st.pv?.atual, 0)}/${value(st.pv?.max, 0)}`], ['PD', `${value(st.pd?.atual, 0)}/${value(st.pd?.max, 0)}`], ['Mov.', value(item.movimento)], ['Dano+', value(item.danoBonus)], ['Armadura', value(item.armaduraTipica?.valor)], ['Tipo', value(item.tipoPnj)]);
    hp = `${value(st.pv?.atual, 0)}/${value(st.pv?.max, 0)}`;
    subtitle = `${value(item.ancestralidade)} · ${value(item.profissao)}`;
    sections.push(section('Perícias', (item.pericias || []).map(p => p?.nome ? `${p.nome} ${value(p.valor)}` : null)));
    sections.push(section('Armas', (item.armas || []).map(a => a?.nome ? `${a.nome} · ${value(a.dano)}` : null)));
    sections.push(section('Habilidades', (item.feiticos || []).map(f => f?.nome ? `${f.nome}${f.desc ? ` — ${f.desc}` : ''}` : null)));
  } else if (system === 'dragonbane') {
    const st = item.status || {};
    stats.push(['PV', `${value(st.pv?.atual, 0)}/${value(st.pv?.max, 0)}`], ['Feroc.', value(item.ferocidade)], ['Mov.', value(item.movimento)], ['Armadura', value(item.armadura)], ['Tam.', value(item.tamanho)], ['Tipo', 'Ameaça']);
    hp = `${value(st.pv?.atual, 0)}/${value(st.pv?.max, 0)}`;
    subtitle = `${value(item.tamanho)} · Ameaça`;
    sections.push(section('Habilidades', (item.habilidades || []).map(h => h?.nome ? `${h.nome}${h.desc ? ` — ${h.desc}` : ''}` : null)));
    sections.push(section('Ataques', (item.ataques || []).map(a => a?.descricao || null)));
  } else if (system === '3det') {
    const st = item.status || item.recursos || {};
    const pvAtual = st.pvAtual ?? st.pv?.atual ?? item.pvAtual ?? '';
    const pvMax = st.pvMax ?? st.pv?.max ?? item.pvMax ?? '';
    const pmAtual = st.pmAtual ?? st.pm?.atual ?? item.pmAtual ?? '';
    const pmMax = st.pmMax ?? st.pm?.max ?? item.pmMax ?? '';
    stats.push(['PV', pvMax !== '' ? `${value(pvAtual, 0)}/${pvMax}` : value(pvAtual)], ['PM', pmMax !== '' ? `${value(pmAtual, 0)}/${pmMax}` : value(pmAtual)], ['P', value(item.poder ?? item.atributos?.p)], ['H', value(item.habilidade ?? item.atributos?.h)], ['R', value(item.resistencia ?? item.atributos?.r)], ['Tipo', value(type)]);
    hp = pvMax !== '' ? `${value(pvAtual, 0)}/${pvMax}` : String(value(pvAtual, ''));
    subtitle = `3DeT Victory · ${value(item.bio?.conceito || item.conceito || type)}`;
    sections.push(section('Vantagens', (item.vantagens || []).map(v => typeof v === 'string' ? v : v?.nome)));
    sections.push(section('Técnicas / Habilidades', [...(item.tecnicas || []), ...(item.habilidades || [])].map(v => typeof v === 'string' ? v : v?.nome)));
  } else {
    const status = item.status || {};
    const maybePv = status.pvAtual ?? status.pv?.atual ?? item.pv ?? item.pvAtual;
    const maybeMax = status.pvMax ?? status.pv?.max ?? item.pvMax;
    if (maybePv !== undefined) stats.push(['PV', maybeMax !== undefined ? `${maybePv}/${maybeMax}` : maybePv]);
    if (status.iniciativa !== undefined) stats.push(['Inic.', status.iniciativa]);
    subtitle = `${SYSTEM_LABELS[system] || system} · ${value(type)}`;
    hp = maybePv !== undefined ? String(maybeMax !== undefined ? `${maybePv}/${maybeMax}` : maybePv) : '';
  }

  return {
    name,
    system,
    type,
    subtitle,
    stats: stats.slice(0, 6).map(([label, val]) => ({ label, value: String(value(val)) })),
    sections: sections.filter(Boolean),
    initiative: String(initiative ?? ''),
    hp: String(hp ?? ''),
  };
}

export function readPJLiteSaves() {
  if (typeof window === 'undefined') return [];
  const chars = safeParse(window.localStorage.getItem(STORAGE_KEYS.pjCharacters), []);
  const threats = safeParse(window.localStorage.getItem(STORAGE_KEYS.pjThreats), []);
  return [...(Array.isArray(chars) ? chars : []), ...(Array.isArray(threats) ? threats : [])]
    .filter(Boolean)
    .map(item => ({ item, quick: buildPJQuick(item) }))
    .sort((a, b) => a.quick.name.localeCompare(b.quick.name, 'pt-BR'));
}

export function decodePJLiteSeed(seed) {
  const raw = String(seed || '').trim();
  if (!raw) throw new Error('Cole um código de ficha.');
  let json = '';
  if (raw.startsWith('{')) json = raw;
  if (!json) json = LZString.decompressFromBase64(raw) || '';
  if (!json) {
    try { json = atob(raw); } catch { /* ignore */ }
  }
  if (!json) throw new Error('Código de ficha inválido.');
  const item = JSON.parse(json);
  return { item, quick: buildPJQuick(item) };
}
