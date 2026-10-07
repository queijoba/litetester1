import { SKYFALL_SKILLS } from './data.js';

const t = (value) => String(value ?? '').trim();
const has = (value) => t(value) !== '';
const val = (value, fallback = '—') => has(value) ? value : fallback;
const compact = (value) => t(value).replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
const skillName = (id) => SKYFALL_SKILLS.find(([key]) => key === id)?.[1] || id;

export function generateSkyfallChatText(data) {
  const d = data || {};
  const b = d.bio || {}, a = d.atributos || {}, r = d.recursos || {}, c = d.combate || {};
  let out = `☄️ SKYFALL RPG — ${val(b.nome, 'Sem Nome')}\n`;
  if (has(b.jogador)) out += `Jogador: ${b.jogador}${has(b.pronomes) ? ` | Pronomes: ${b.pronomes}` : ''}\n`;
  out += `${val(b.legado)} • ${val(b.classe)}${has(b.trilha) ? ` • ${b.trilha}` : ''} • Nível ${b.nivel || 1}\n`;
  const identity = [
    has(b.heranca) ? `Herança: ${b.heranca}` : '',
    has(b.antecedente) ? `Antecedente: ${b.antecedente}` : '',
    has(b.maldicao) ? `Maldição: ${b.maldicao}` : '',
  ].filter(Boolean);
  if (identity.length) out += identity.join(' | ') + '\n';
  if (has(b.melancolia)) out += `Melancolia: ${compact(b.melancolia)}\n`;

  out += `\n📊 ATRIBUTOS & RECURSOS\n`;
  out += `FOR ${val(a.for)} | CON ${val(a.con)} | DES ${val(a.des)} | SAB ${val(a.sab)} | INT ${val(a.int)} | CAR ${val(a.car)}\n`;
  out += `PV ${r.pv?.atual ?? 0}/${r.pv?.max ?? 0}${Number(r.pv?.temp || 0) ? ` (+${r.pv.temp} temp.)` : ''} | Catarse ${r.catarse?.atual ?? 0}/${r.catarse?.max ?? 0} | Ênfase ${r.enfase?.atual ?? 0}/${r.enfase?.max ?? 0}\n`;
  out += `Sombra ${r.sombra ?? 0} | Fragmentos ${r.fragmentos?.atual ?? 0}/${r.fragmentos?.max ?? 0} | Volume ${r.volume?.atual ?? 0}/${r.volume?.max ?? 0}\n`;
  if (has(r.dadosVida?.totais) || has(r.dadosVida?.usados)) out += `Dados de Vida: ${val(r.dadosVida?.usados, 0)}/${val(r.dadosVida?.totais, 0)} usados\n`;
  if (Number(r.testesMorte?.sucessos || 0) || Number(r.testesMorte?.falhas || 0)) out += `Testes de Morte: ${r.testesMorte?.sucessos || 0} sucessos | ${r.testesMorte?.falhas || 0} falhas\n`;

  out += `\n⚔️ COMBATE\n`;
  out += `Proteção ${val(c.protecao)} | RD ${val(c.reducaoDano, 0)} | Iniciativa ${val(c.iniciativa)} | Movimento ${val(c.deslocamento, '9 m')}`;
  if (has(c.tamanho)) out += ` | Tamanho ${c.tamanho}`;
  out += '\n';

  const skills = Object.entries(d.pericias || {}).filter(([, entry]) => entry?.proficiente || entry?.enfase || has(entry?.bonus));
  if (skills.length) {
    out += `\n🎯 PERÍCIAS\n`;
    out += skills.map(([id, entry]) => `• ${skillName(id)}${entry.proficiente ? ' [Prof.]' : ''}${entry.enfase ? ' [Ênfase]' : ''}${has(entry.bonus) ? ` ${entry.bonus}` : ''}`).join('\n') + '\n';
  }

  const attacks = (d.ataques || []).filter((entry) => has(entry?.nome) || has(entry?.dano));
  if (attacks.length) {
    out += `\n⚔️ ATAQUES\n`;
    attacks.forEach((entry) => {
      out += `• ${val(entry.nome, 'Ataque')} | ${val(entry.bonus, '—')} | ${val(entry.dano, '—')}${has(entry.tipo) ? ` ${entry.tipo}` : ''}`;
      if (has(entry.alcance)) out += ` | ${entry.alcance}`;
      const desc = entry.descricao || entry.notas;
      if (has(desc)) out += ` — ${compact(desc)}`;
      out += '\n';
    });
  }

  const abilities = (d.habilidades || []).filter((entry) => has(entry?.nome) || has(entry?.desc));
  if (abilities.length) {
    out += `\n✨ HABILIDADES\n`;
    abilities.forEach((entry) => {
      out += `• ${val(entry.nome, 'Habilidade')}${has(entry.origem) ? ` [${entry.origem}]` : ''}${has(entry.desc) ? ` — ${compact(entry.desc)}` : ''}\n`;
    });
  }

  const spells = (d.magias || []).filter((entry) => has(entry?.nome) || has(entry?.desc));
  if (spells.length || Object.values(d.conjuracao || {}).some(has)) {
    const conj = d.conjuracao || {};
    out += `\n🔮 MAGIAS & CONJURAÇÃO\n`;
    const summary = [
      has(conj.atributoChave) ? `Atributo ${conj.atributoChave}` : '',
      has(conj.bonusAtaque) ? `Ataque ${conj.bonusAtaque}` : '',
      has(conj.cd) ? `CD ${conj.cd}` : '',
    ].filter(Boolean);
    if (summary.length) out += summary.join(' | ') + '\n';
    if (has(conj.observacoes)) out += compact(conj.observacoes) + '\n';
    spells.forEach((entry) => {
      out += `• ${val(entry.nome, 'Magia')} [${val(entry.camada, 'Truque')}]`;
      const details = [
        has(entry.custo) ? `Custo ${entry.custo}` : '',
        has(entry.execucao) ? entry.execucao : '',
        has(entry.alcance) ? entry.alcance : '',
        has(entry.duracao) ? entry.duracao : '',
      ].filter(Boolean);
      if (details.length) out += ` — ${details.join(' | ')}`;
      if (has(entry.descritores)) out += ` [${entry.descritores}]`;
      if (has(entry.desc)) out += `\n  ${compact(entry.desc)}`;
      out += '\n';
    });
  }

  const equipment = (d.equipamentos || []).filter((entry) => has(entry?.nome));
  if (equipment.length || Number(d.moedas?.pecas || 0) || Number(d.moedas?.trocados || 0) || has(d.idiomas)) {
    out += `\n🎒 INVENTÁRIO\n`;
    if (Number(d.moedas?.pecas || 0) || Number(d.moedas?.trocados || 0)) out += `Moedas: ${d.moedas?.pecas || 0} Peças | ${d.moedas?.trocados || 0} Trocados\n`;
    equipment.forEach((entry) => {
      out += `• ${entry.quantidade || 1}x ${entry.nome}`;
      if (has(entry.volume)) out += ` | Vol. ${entry.volume}`;
      if (has(entry.fragmentos)) out += ` | Frag. ${entry.fragmentos}`;
      if (has(entry.descritores)) out += ` — ${entry.descritores}`;
      out += '\n';
    });
    if (has(d.idiomas)) out += `Idiomas: ${compact(d.idiomas)}\n`;
  }

  if (has(d.notas)) out += `\n🎭 ANOTAÇÕES\n${compact(d.notas)}\n`;
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

export function generateSkyfallThreatChatText(data) {
  const d = data || {}, a = d.atributos || {}, s = d.status || {};
  let out = `☄️ AMEAÇA SKYFALL — ${val(d.nome, 'Sem Nome')}\n`;
  out += `${val(d.hierarquia, 'Comum')} • ${val(d.tipo, 'Criatura')} • ND ${d.nivelDesafio ?? 0}`;
  if (has(d.arquetipo)) out += ` • ${d.arquetipo}`;
  if (has(d.tamanho)) out += ` • ${d.tamanho}`;
  out += '\n';
  if (has(d.conceito)) out += `Conceito: ${compact(d.conceito)}\n`;
  if (Number(d.xp || 0)) out += `XP: ${d.xp}`;
  if (has(d.recarga)) out += `${Number(d.xp || 0) ? ' | ' : ''}Recarga: ${d.recarga}`;
  if (Number(d.xp || 0) || has(d.recarga)) out += '\n';

  out += `\n📊 ATRIBUTOS & STATUS\n`;
  out += `FOR ${val(a.for)} | CON ${val(a.con)} | DES ${val(a.des)} | SAB ${val(a.sab)} | INT ${val(a.int)} | CAR ${val(a.car)}\n`;
  out += `PV ${s.pvAtual ?? 0}/${s.pvMax ?? 0} | Proteção ${val(s.protecao)} | RD ${val(s.reducaoDano, 0)} | Iniciativa ${val(s.iniciativa)} | Mov. ${val(s.deslocamento)}\n`;

  const skills = (d.pericias || []).filter((entry) => has(entry?.nome) || has(entry?.bonus));
  if (skills.length) out += `\n🎯 PERÍCIAS\n${skills.map((entry) => `• ${val(entry.nome)} ${val(entry.bonus, '')}`.trim()).join('\n')}\n`;

  const attacks = (d.ataques || []).filter((entry) => has(entry?.nome) || has(entry?.dano));
  if (attacks.length) {
    out += `\n⚔️ ATAQUES\n`;
    attacks.forEach((entry) => {
      out += `• ${val(entry.nome)} | ${val(entry.bonus)} | ${val(entry.dano)}`;
      if (has(entry.alcance)) out += ` | ${entry.alcance}`;
      if (has(entry.desc)) out += ` — ${compact(entry.desc)}`;
      out += '\n';
    });
  }

  const powers = (d.habilidades || []).filter((entry) => has(entry?.nome) || has(entry?.desc));
  if (powers.length) out += `\n✨ HABILIDADES\n${powers.map((entry) => `• ${val(entry.nome)}${has(entry.desc) ? ` — ${compact(entry.desc)}` : ''}`).join('\n')}\n`;

  const reactions = (d.reacoes || []).filter((entry) => has(entry?.nome) || has(entry?.desc));
  if (reactions.length) out += `\n🛡️ REAÇÕES\n${reactions.map((entry) => `• ${val(entry.nome)}${has(entry.desc) ? ` — ${compact(entry.desc)}` : ''}`).join('\n')}\n`;

  if (has(d.resistencias) || has(d.vulnerabilidades)) {
    out += `\n📚 ESTATÍSTICAS\n`;
    if (has(d.resistencias)) out += `Resistências: ${compact(d.resistencias)}\n`;
    if (has(d.vulnerabilidades)) out += `Vulnerabilidades: ${compact(d.vulnerabilidades)}\n`;
  }
  if (has(d.notas)) out += `\n🎭 ANOTAÇÕES\n${compact(d.notas)}\n`;
  return out.replace(/\n{3,}/g, '\n\n').trim();
}
