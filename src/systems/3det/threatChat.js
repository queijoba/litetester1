import { TRESDET_SKILLS } from './data.js';

const has = (value) => value !== undefined && value !== null && String(value).trim() !== '';
const safe = (value, fallback = '-') => has(value) ? value : fallback;
const compact = (value) => String(value || '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

export const generate3DetThreatChatText = (item) => {
  const attrs = item?.atributos || {};
  const status = item?.status || {};
  let text = `👾 3DeT VICTORY • ${safe(item?.categoria, 'Ameaça')}: ${safe(item?.nome, 'Sem Nome')}\n\n`;
  text += `Papel: ${safe(item?.papel, 'Comum')} | Escala: ${safe(item?.escala, 'Ningen')} | Pontos: ${safe(item?.pontos, 0)}\n`;
  if (has(item?.conceito)) text += `Conceito: ${compact(item.conceito)}\n`;
  text += `\n📊 ATRIBUTOS & RECURSOS\n\n`;
  text += `P ${safe(attrs.poder, 0)} | H ${safe(attrs.habilidade, 0)} | R ${safe(attrs.resistencia, 0)}\n`;
  text += `PA ${safe(status.pa?.atual, 0)}/${safe(status.pa?.max, 0)} | PM ${safe(status.pm?.atual, 0)}/${safe(status.pm?.max, 0)} | PV ${safe(status.pv?.atual, 0)}/${safe(status.pv?.max, 0)}\n`;

  const official = TRESDET_SKILLS.filter(([id]) => item?.pericias?.[id]).map(([, name]) => name);
  const custom = (item?.periciasPersonalizadas || []).filter((entry) => entry?.selecionada !== false && has(entry?.nome)).map((entry) => entry.nome.trim());
  const skills = [...official, ...custom];
  if (skills.length) text += `\n🎯 PERÍCIAS\n\n${skills.join(' • ')}\n`;

  const append = (icon, title, entries, valueKey) => {
    const list = (entries || []).filter((entry) => has(entry?.nome) || has(entry?.desc));
    if (!list.length) return;
    text += `\n${icon} ${title}\n\n`;
    list.forEach((entry) => {
      text += `• ${safe(entry.nome, title)}`;
      if (has(entry?.[valueKey])) text += ` (${entry[valueKey]})`;
      if (has(entry.desc)) text += ` — ${compact(entry.desc)}`;
      text += '\n';
    });
  };

  append('⭐', 'VANTAGENS', item?.vantagens, 'custo');
  append('⚠️', 'DESVANTAGENS', item?.desvantagens, 'valor');
  append('⚡', 'TÉCNICAS', item?.tecnicas, 'custo');
  append('⚔️', 'AÇÕES / PODERES RÁPIDOS', item?.acoes, 'custo');
  if (has(item?.notas)) text += `\n📝 ANOTAÇÕES DO MESTRE\n\n${compact(item.notas)}\n`;
  return text.trim();
};
