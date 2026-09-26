import { getDndClassByLabel } from '../classPanels.js';

const clean = value => String(value ?? '')
  .replace(/[–—]/g, '-')
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/…/g, '...')
  .replace(/•/g, '-')
  .replace(/[^\u0009\u000A\u000D\u0020-\u007E\u00A0-\u00FF]/g, '');

const normalize = value => String(value ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const hasValue = value => value !== undefined && value !== null && String(value).trim() !== '';

const setText = (form, name, value) => {
  try { form.getTextField(name).setText(clean(value)); } catch {}
};

const setCheck = (form, name, checked) => {
  try {
    const field = form.getCheckBox(name);
    checked ? field.check() : field.uncheck();
  } catch {}
};

const abilityMod = score => Math.floor(((Number(score) || 10) - 10) / 2);
const proficiencyBonus = level => Math.max(2, Math.min(6, 2 + Math.floor((Math.max(1, Number(level) || 1) - 1) / 4)));
const formatMod = value => `${Number(value) >= 0 ? '+' : ''}${Number(value) || 0}`;

const textFrom = value => {
  if (Array.isArray(value)) return value.map(textFrom).filter(Boolean).join(', ');
  if (value && typeof value === 'object') {
    if (hasValue(value.nome)) return String(value.nome);
    if (hasValue(value.label)) return String(value.label);
    if (hasValue(value.valor)) return String(value.valor);
    return '';
  }
  return hasValue(value) ? String(value) : '';
};

function featureText(entries) {
  return (entries || [])
    .map(entry => {
      const name = clean(entry?.nome).trim();
      const desc = clean(entry?.desc ?? entry?.descricao).trim();
      if (name && desc) return `${name}: ${desc}`;
      return name || desc;
    })
    .filter(Boolean)
    .join('\n\n');
}

function classResourceText(item) {
  const selectedClass = getDndClassByLabel(item?.bio?.classe || '');
  if (!selectedClass) return '';
  const values = item?.recursosClasse?.[selectedClass.id] || {};
  const lines = [];

  (selectedClass.fields || []).forEach(field => {
    const value = values?.[field.key];
    if (field.type === 'tracker') {
      const current = value?.atual;
      const max = value?.max;
      if (hasValue(current) || hasValue(max)) lines.push(`${field.label}: ${current ?? 0}/${max ?? 0}`);
      return;
    }
    if (field.type === 'toggle') {
      if (value) lines.push(field.label);
      return;
    }
    if (hasValue(value)) lines.push(`${field.label}: ${value}`);
  });

  if (hasValue(values?.notas)) lines.push(`Notas: ${values.notas}`);
  return lines.join('\n');
}

const SKILLS = [
  ['acrobacia', 'des', ['acrobacia']],
  ['arcanismo', 'int', ['arcanismo']],
  ['atletismo', 'for', ['atletismo']],
  ['atuacao', 'car', ['atuacao']],
  ['enganacao', 'car', ['enganacao']],
  ['furtividade', 'des', ['furtividade']],
  ['historia', 'int', ['historia']],
  ['intimidacao', 'car', ['intimidacao']],
  ['intuicao', 'sab', ['intuicao']],
  ['investigacao', 'int', ['investigacao']],
  ['lidar_com_animais', 'sab', ['lidar_com_animais', 'lidar_animais', 'lidarcomanimais']],
  ['medicina', 'sab', ['medicina']],
  ['natureza', 'int', ['natureza']],
  ['percepcao', 'sab', ['percepcao']],
  ['persuasao', 'car', ['persuasao']],
  ['prestidigitacao', 'des', ['prestidigitacao']],
  ['religiao', 'int', ['religiao']],
  ['sobrevivencia', 'sab', ['sobrevivencia']],
];

function findSkill(item, aliases) {
  const accepted = new Set(aliases.map(normalize));
  return (item?.pericias || []).find(skill => {
    const id = normalize(skill?.id);
    const name = normalize(skill?.nome);
    return accepted.has(id) || accepted.has(name);
  }) || null;
}

function skillRank(skill) {
  if (!skill) return 0;
  if (skill.especialista || skill.expertise) return 2;
  if (skill.proficiente === true || skill.treinada === true) return 1;
  const rank = Number(skill.prof ?? skill.proficiencia ?? 0);
  return rank >= 2 ? 2 : rank >= 1 ? 1 : 0;
}

function fillSkills(form, item, pb) {
  SKILLS.forEach(([pdfName, attr, aliases]) => {
    const skill = findSkill(item, aliases);
    const rank = skillRank(skill);
    const explicit = skill?.total ?? skill?.valor;
    const total = hasValue(explicit)
      ? explicit
      : abilityMod(item?.atributos?.[attr] ?? 10) + pb * rank;

    setCheck(form, `pericia_${pdfName}_prof`, rank >= 1);
    setCheck(form, `pericia_${pdfName}_especialista`, rank >= 2);
    setText(form, `pericia_${pdfName}`, formatMod(total));
  });
}

function fillAttacks(form, item) {
  (item?.ataques || []).slice(0, 5).forEach((attack, index) => {
    const n = index + 1;
    const damageType = [attack?.dano, attack?.tipo].filter(hasValue).join(' ');
    setText(form, `ataque_${n}_nome`, attack?.nome);
    setText(form, `ataque_${n}_bonus`, attack?.bonus ?? attack?.ataque);
    setText(form, `ataque_${n}_dano`, damageType);
    setText(form, `ataque_${n}_notas`, attack?.notas ?? attack?.obs ?? '');
  });
}

function fillInventory(form, item) {
  const items = Array.isArray(item?.itensSincronizados)
    ? item.itensSincronizados
    : Array.isArray(item?.inventario)
      ? item.inventario
      : [];

  items.slice(0, 12).forEach((entry, index) => {
    const n = index + 1;
    setText(form, `item_${n}_item`, entry?.nome ?? entry?.item);
    setText(form, `item_${n}_qtd`, entry?.quantidade ?? entry?.qtd ?? 1);
    setText(form, `item_${n}_peso`, entry?.peso ?? '');
    setText(form, `item_${n}_tipo`, entry?.tipo ?? '');
  });

  const carga = item?.carga;
  if (carga && typeof carga === 'object') {
    setText(form, 'carga', [carga.atual, carga.max ?? carga.capacidade].filter(hasValue).join(' / '));
  } else {
    setText(form, 'carga', carga ?? item?.capacidadeCarga ?? '');
  }
}

function fillRoleplay(form, item) {
  const bio = item?.bio || {};
  setText(form, 'aparencia', bio.aparencia ?? item?.aparencia ?? '');
  setText(form, 'historia', bio.historiaPersonalidade ?? item?.historia ?? '');
  setText(form, 'personalidade', item?.tracosPersonalidade ?? item?.personalidade ?? '');
  setText(form, 'ideais', item?.ideais ?? '');
  setText(form, 'vinculos', item?.vinculos ?? '');
  setText(form, 'defeitos', item?.defeitos ?? '');
}

function fillFeatures(form, item) {
  const features = Array.isArray(item?.caracteristicas) ? item.caracteristicas : [];
  const classFeatures = features.filter(entry => (entry?.tipo || 'classe') === 'classe');
  const speciesFeatures = features.filter(entry => entry?.tipo === 'especie');
  const featsAndOther = features.filter(entry => entry?.tipo === 'talento' || entry?.tipo === 'outro');

  const resourceSummary = classResourceText(item);
  const classSummary = featureText(classFeatures);
  setText(form, 'caracteristicas_classe', [resourceSummary, classSummary].filter(Boolean).join('\n\n'));
  setText(form, 'caracteristicas_especie', featureText(speciesFeatures));
  setText(form, 'talentos', featureText(featsAndOther));
}

function fillTraining(form, item) {
  const training = item?.treinoArmadura || {};
  setCheck(form, 'armadura_leve', !!training.leve);
  setCheck(form, 'armadura_media', !!training.media);
  setCheck(form, 'armadura_pesada', !!training.pesada);
  setCheck(form, 'armadura_escudos', !!training.escudos);
  setText(form, 'proficiencias_armas', textFrom(item?.armasProficiencias));
  setText(form, 'proficiencias_ferramentas', textFrom(item?.ferramentas));
  setText(form, 'idiomas', textFrom(item?.idiomas));
}

function fillAttunement(form, item) {
  const list = Array.isArray(item?.sintonizacao) ? item.sintonizacao : [];
  for (let i = 0; i < 3; i += 1) {
    const raw = list[i];
    const text = textFrom(raw);
    const checked = raw && typeof raw === 'object'
      ? raw.sintonizado !== false && !!text
      : !!text;
    setCheck(form, `sintonizado_${i + 1}`, checked);
    setText(form, `sintonizacao_${i + 1}`, text);
  }
}

function spellLevel(spell) {
  const raw = spell?.nivel;
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.max(0, Math.min(9, raw));
  const text = normalize(raw);
  if (!text || text.includes('truque') || text.includes('cantrip')) return 0;
  const match = text.match(/\d+/);
  return Math.max(0, Math.min(9, Number(match?.[0]) || 0));
}

function spellNotes(spell) {
  const parts = [];
  if (hasValue(spell?.escola)) parts.push(`Escola: ${spell.escola}`);
  if (hasValue(spell?.alvo)) parts.push(`Alvo/Area: ${spell.alvo}`);
  if (hasValue(spell?.salvaguarda)) parts.push(`Salv.: ${spell.salvaguarda}`);
  if (hasValue(spell?.dano)) parts.push(`Dano/Efeito: ${spell.dano}`);
  if (hasValue(spell?.materialDetalhe)) parts.push(`Material: ${spell.materialDetalhe}`);
  if (hasValue(spell?.desc)) parts.push(spell.desc);
  return parts.join(' | ');
}

function fillSpells(form, item) {
  const casting = item?.magias?.conjuracao || {};
  const ability = String(casting.habilidade || '').trim().toUpperCase();
  const attrKey = ({ FOR:'for', DES:'des', CON:'con', INT:'int', SAB:'sab', CAR:'car' })[ability.split(/[^A-Z]+/)[0]];
  const calculatedMod = attrKey ? abilityMod(item?.atributos?.[attrKey] ?? 10) : '';

  setText(form, 'conjuracao_atributo', casting.habilidade ?? '');
  setText(form, 'conjuracao_mod', hasValue(casting.modificador ?? casting.mod) ? (casting.modificador ?? casting.mod) : (calculatedMod === '' ? '' : formatMod(calculatedMod)));
  setText(form, 'conjuracao_cd', casting.cd ?? '');
  setText(form, 'conjuracao_ataque', casting.ataque ?? '');

  for (let level = 1; level <= 9; level += 1) {
    const slot = item?.magias?.slots?.[level] || item?.magias?.slots?.[String(level)] || {};
    setText(form, `espacos_${level}_atual`, slot?.atual ?? '');
    setText(form, `espacos_${level}_max`, slot?.max ?? slot?.maximo ?? '');
  }

  const spells = (Array.isArray(item?.magias?.lista) ? item.magias.lista : [])
    .map((spell, index) => ({ spell, index, level: spellLevel(spell) }))
    .sort((a, b) => a.level - b.level || a.index - b.index)
    .slice(0, 30);

  spells.forEach(({ spell, level }, index) => {
    const n = index + 1;
    setCheck(form, `magia_${n}_preparada`, !!spell?.preparada);
    setText(form, `magia_${n}_nivel`, level);
    setText(form, `magia_${n}_nome`, spell?.nome);
    setText(form, `magia_${n}_tempo`, spell?.tempo);
    setText(form, `magia_${n}_alcance`, spell?.alcance);
    setCheck(form, `magia_${n}_concentracao`, !!spell?.concentracao);
    setCheck(form, `magia_${n}_ritual`, !!spell?.ritual);
    setCheck(form, `magia_${n}_material`, !!spell?.material || hasValue(spell?.materialDetalhe));
    setText(form, `magia_${n}_duracao`, spell?.duracao);
    setText(form, `magia_${n}_notas`, spellNotes(spell));
  });
}

export function fillDndPdf(form, item) {
  const bio = item?.bio || {};
  const attributes = item?.atributos || {};
  const status = item?.status || {};
  const level = Math.max(1, Number(bio.nivel) || 1);
  const pb = proficiencyBonus(level);

  setText(form, 'nome', bio.nome);
  setText(form, 'jogador', bio.jogador);
  setText(form, 'classe', bio.classe);
  setText(form, 'subclasse', bio.subclasse);
  setText(form, 'nivel', level);
  setText(form, 'xp', bio.xp ?? '');
  setText(form, 'especie', bio.linhagem ?? bio.especie ?? '');
  setText(form, 'origem', bio.antecedente ?? bio.origem ?? '');
  setText(form, 'alinhamento', bio.alinhamento ?? '');
  setText(form, 'tamanho', status.tamanho ?? bio.tamanho ?? '');

  ['for','des','con','int','sab','car'].forEach(attr => {
    const score = Number(attributes?.[attr] ?? 10);
    const proficient = !!item?.proficienciasResistencia?.[attr];
    setText(form, `atributo_${attr}`, score);
    setText(form, `mod_${attr}`, formatMod(abilityMod(score)));
    setCheck(form, `salvaguarda_${attr}_proficiente`, proficient);
    setText(form, `salvaguarda_${attr}`, formatMod(abilityMod(score) + (proficient ? pb : 0)));
  });

  setText(form, 'proficiencia', formatMod(pb));
  fillSkills(form, item, pb);

  const perception = findSkill(item, ['percepcao']);
  const perceptionRank = skillRank(perception);
  const passive = hasValue(status.percepcaoPassiva)
    ? status.percepcaoPassiva
    : 10 + abilityMod(attributes?.sab ?? 10) + pb * perceptionRank;
  setText(form, 'percepcao_passiva', passive);

  setText(form, 'ca', status.ca ?? 10);
  setText(form, 'iniciativa', status.iniciativa ?? formatMod(abilityMod(attributes?.des ?? 10)));
  setText(form, 'deslocamento', status.deslocamento ?? '');
  setText(form, 'pv_atual', status.pvAtual ?? '');
  setText(form, 'pv_max', status.pvMax ?? '');
  setText(form, 'pv_temporarios', status.pvTemp ?? '');

  const hitDice = status.dadosVida;
  if (hitDice && typeof hitDice === 'object') {
    setText(form, 'dados_vida', hitDice.dado ?? hitDice.tipo ?? '');
    setText(form, 'dados_vida_max', hitDice.total ?? hitDice.max ?? '');
    setText(form, 'dados_vida_gastos', hitDice.gastos ?? '');
  } else {
    setText(form, 'dados_vida', hitDice ?? '');
    setText(form, 'dados_vida_max', status.dadosVidaMax ?? '');
    setText(form, 'dados_vida_gastos', status.dadosVidaGastos ?? '');
  }

  (item?.testesMorte?.sucessos || []).slice(0, 3).forEach((value, index) => setCheck(form, `morte_sucessos_${index + 1}`, !!value));
  (item?.testesMorte?.falhas || []).slice(0, 3).forEach((value, index) => setCheck(form, `morte_falhas_${index + 1}`, !!value));
  setCheck(form, 'inspiracao_heroica', !!status.inspiracao);
  setText(form, 'exaustao', status.exaustao ?? item?.exaustao ?? '');

  fillAttacks(form, item);
  const defenseNotes = [
    hasValue(status.escudo) && Number(status.escudo) !== 0 ? `Escudo: +${status.escudo}` : '',
    item?.defesasCondicoes ?? status?.defesasCondicoes ?? ''
  ].filter(Boolean).join('\n');
  setText(form, 'defesas_condicoes', defenseNotes);

  fillFeatures(form, item);
  fillRoleplay(form, item);
  fillInventory(form, item);
  ['pc','pp','pe','po','pl'].forEach(key => setText(form, `moedas_${key}`, item?.moedas?.[key] ?? ''));
  fillAttunement(form, item);
  fillTraining(form, item);
  fillSpells(form, item);
}
