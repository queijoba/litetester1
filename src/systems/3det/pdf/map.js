import { TRESDET_SKILLS, TRESDET_RARITIES } from '../data.js';

const text = value => value === undefined || value === null ? '' : String(value);
const arr = value => Array.isArray(value) ? value : [];
const obj = value => value && typeof value === 'object' ? value : {};

function setText(form, name, value) {
  try { form.getTextField(name).setText(text(value)); } catch {}
}

function setChoice(form, name, value) {
  try {
    const field = form.getDropdown(name);
    const option = text(value).trim();
    const options = field.getOptions();
    field.select(options.includes(option) ? option : '');
  } catch {}
}

function formatEntry(entry = {}, valueKey = 'custo') {
  const head = [entry.nome, entry[valueKey] ? `(${entry[valueKey]})` : ''].filter(Boolean).join(' ');
  return [head, entry.desc].filter(Boolean).join(' - ');
}

function formatList(items, valueKey = 'custo') {
  return arr(items).map(entry => formatEntry(entry, valueKey)).filter(Boolean).join('\n');
}

function formatInventory(items) {
  return arr(items).map(entry => {
    const qty = Math.max(0, Number(entry?.quantidade ?? 1) || 0);
    const rarity = TRESDET_RARITIES.includes(entry?.raridade) ? entry.raridade : 'Comum';
    const head = [qty && qty !== 1 ? `${qty}x` : '', entry?.nome, rarity ? `[${rarity}]` : ''].filter(Boolean).join(' ');
    return [head, entry?.notas].filter(Boolean).join(' - ');
  }).filter(Boolean).join('\n');
}

function combatLine(label, block = {}) {
  const parts = [];
  if (text(block.atributo).trim()) parts.push(text(block.atributo).trim());
  if (text(block.ganho).trim()) parts.push(`Ganhos: ${text(block.ganho).trim()}`);
  return parts.length ? `${label}: ${parts.join(' | ')}` : '';
}

function buildSkillLines(item = {}) {
  const official = TRESDET_SKILLS
    .filter(([id]) => !!item?.pericias?.[id])
    .map(([, label]) => label);

  const custom = arr(item.periciasPersonalizadas)
    .filter(entry => entry?.selecionada !== false && text(entry?.nome).trim())
    .map(entry => text(entry.nome).trim());

  const specializations = arr(item.especializacoes)
    .filter(entry => text(entry?.nome).trim())
    .map(entry => {
      const base = text(entry?.periciaBase).trim();
      const note = text(entry?.notas).trim();
      return `Esp.: ${text(entry.nome).trim()}${base ? ` (${base})` : ''}${note ? ` - ${note}` : ''}`;
    });

  const all = [...official, ...custom, ...specializations];
  const lines = all.slice(0, 7);
  const overflow = all.slice(7);
  if (overflow.length && lines.length === 7) lines[6] = `+${overflow.length + 1} opções; ver Anotações`;
  return { lines, overflow };
}

export function fill3DetPdf(form, item = {}) {
  const bio = obj(item.bio);
  const attrs = obj(item.atributos);
  const status = obj(item.status);
  const combat = obj(item.combate);
  const { lines: skills, overflow } = buildSkillLines(item);

  setText(form, 'bio_nome', bio.nome);
  setText(form, 'bio_jogador', bio.jogador);
  setText(form, 'pontos', item.pontos);
  setText(form, 'xp', item.xp);
  setText(form, 'arquetipo', bio.arquetipo);
  setText(form, 'conceito', bio.conceito);
  setChoice(form, 'escala', bio.escala);

  setText(form, 'atributo_poder', attrs.poder);
  setText(form, 'atributo_habilidade', attrs.habilidade);
  setText(form, 'atributo_resistencia', attrs.resistencia);
  setText(form, 'pa_atual', status?.pa?.atual);
  setText(form, 'pa_max', status?.pa?.max);
  setText(form, 'pm_atual', status?.pm?.atual);
  setText(form, 'pm_max', status?.pm?.max);
  setText(form, 'pv_atual', status?.pv?.atual);
  setText(form, 'pv_max', status?.pv?.max);

  for (let index = 0; index < 7; index += 1) {
    setText(form, `pericia_linha_${index + 1}`, skills[index] || '');
  }

  setText(form, 'vantagens', formatList(item.vantagens, 'custo'));
  setText(form, 'desvantagens', formatList(item.desvantagens, 'valor'));
  setText(form, 'tecnicas', formatList(item.tecnicas, 'custo'));
  setText(form, 'kits', bio.kit);

  const combatText = [
    combatLine('FA', combat.fa),
    combatLine('FD', combat.fd),
  ].filter(Boolean).join('\n');
  setText(form, 'condicoes', combatText);

  setText(form, 'inventario', formatInventory(item.inventario));

  // A ficha digital atual ainda não possui regras próprias para nível/limites de consumíveis.
  // Estes campos ficam vazios e continuam editáveis no PDF para uso manual da mesa.
  setText(form, 'inventario_nivel', '');
  setText(form, 'consumiveis_comuns_atual', '');
  setText(form, 'consumiveis_comuns_max', '');
  setText(form, 'consumiveis_incomuns_atual', '');
  setText(form, 'consumiveis_incomuns_max', '');
  setText(form, 'consumiveis_raros_atual', '');
  setText(form, 'consumiveis_raros_max', '');

  const notes = [];
  if (text(item.notas).trim()) notes.push(text(item.notas).trim());
  if (overflow.length) {
    if (notes.length) notes.push('');
    notes.push('Perícias / especializações adicionais:', ...overflow.map(value => `- ${value}`));
  }
  setText(form, 'anotacoes', notes.join('\n'));
}
