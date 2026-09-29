import { TRESDET_SKILLS } from './data.js';

const hasText = (value) => value !== undefined && value !== null && String(value).trim() !== '';
const safe = (value, fallback = '-') => hasText(value) ? value : fallback;
const compact = (value) => String(value || '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

export const generate3DetChatText = (item) => {
  const bio = item?.bio || {};
  const attrs = item?.atributos || {};
  const status = item?.status || {};
  let text = `🎮 3DeT VICTORY: ${safe(bio.nome, 'Sem Nome')}\n\n`;

  if (hasText(bio.jogador)) text += `Jogador: ${bio.jogador}\n`;
  text += `Arquétipo: ${safe(bio.arquetipo)}`;
  if (hasText(bio.kit)) text += ` | Kit: ${bio.kit}`;
  text += '\n';
  if (hasText(bio.conceito)) text += `Conceito: ${compact(bio.conceito)}\n`;
  if (hasText(bio.escala)) text += `Escala: ${bio.escala}\n`;
  text += `Pontos: ${safe(item.pontos, 0)} | XP: ${safe(item.xp, 0)}\n`;

  text += `\n📊 ATRIBUTOS & RECURSOS\n\n`;
  text += `Poder ${safe(attrs.poder, 0)} | Habilidade ${safe(attrs.habilidade, 0)} | Resistência ${safe(attrs.resistencia, 0)}\n`;
  text += `PA ${safe(status.pa?.atual, 0)}/${safe(status.pa?.max, 0)} | PM ${safe(status.pm?.atual, 0)}/${safe(status.pm?.max, 0)} | PV ${safe(status.pv?.atual, 0)}/${safe(status.pv?.max, 0)}\n`;

  const skills = TRESDET_SKILLS.filter(([id]) => item?.pericias?.[id]).map(([, name]) => name);
  if (skills.length) text += `\n🎯 PERÍCIAS\n\n${skills.join(' • ')}\n`;

  const fa = item?.combate?.fa || {};
  const fd = item?.combate?.fd || {};
  if (hasText(fa.atributo) || hasText(fa.ganho) || hasText(fd.atributo) || hasText(fd.ganho)) {
    text += `\n⚔️ FA / FD\n\n`;
    text += `FA: ${safe(fa.atributo)}${hasText(fa.ganho) ? ` | Ganho: ${fa.ganho}` : ''}\n`;
    text += `FD: ${safe(fd.atributo)}${hasText(fd.ganho) ? ` | Ganho: ${fd.ganho}` : ''}\n`;
  }

  const appendList = (icon, title, list, valueKey = 'custo') => {
    const entries = (list || []).filter((entry) => hasText(entry?.nome) || hasText(entry?.desc));
    if (!entries.length) return;
    text += `\n${icon} ${title}\n\n`;
    entries.forEach((entry) => {
      text += `• ${safe(entry.nome, title.slice(0, -1))}`;
      if (hasText(entry?.[valueKey])) text += ` (${entry[valueKey]})`;
      if (hasText(entry.desc)) text += ` — ${compact(entry.desc)}`;
      text += '\n';
    });
  };

  appendList('⭐', 'VANTAGENS', item?.vantagens, 'custo');
  appendList('⚠️', 'DESVANTAGENS', item?.desvantagens, 'valor');
  appendList('⚡', 'TÉCNICAS', item?.tecnicas, 'custo');

  const inventory = (item?.inventario || []).filter((entry) => hasText(entry?.nome));
  if (inventory.length) {
    text += `\n🎒 INVENTÁRIO\n\n`;
    inventory.forEach((entry) => {
      text += `• ${entry.nome}`;
      if (Number(entry.quantidade || 1) !== 1) text += ` x${entry.quantidade}`;
      text += ` [${safe(entry.raridade, 'Comum')}]`;
      if (hasText(entry.notas)) text += ` — ${compact(entry.notas)}`;
      text += '\n';
    });
  }

  if (hasText(item?.notas)) text += `\n📝 ANOTAÇÕES\n\n${compact(item.notas)}\n`;
  return text.trim();
};
