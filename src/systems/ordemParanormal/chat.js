import { ORDEM_SKILLS } from './data.js';

const t = (value) => String(value ?? '').trim();
const has = (value) => t(value) !== '';
const val = (value, fallback = '—') => has(value) ? value : fallback;
const compact = (value) => t(value).replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
const skillInfo = (id) => ORDEM_SKILLS.find(([key]) => key === id) || [id, id, ''];
const skillName = (id) => skillInfo(id)[1] || id;
const skillDefaultAttr = (id) => skillInfo(id)[2] || '';

export function generateOrdemChatText(data) {
  const d = data || {}, b = d.bio || {}, a = d.atributos || {}, s = d.status || {};
  const pdMode = s.recursoMental === 'pd';
  /* RECURSO MENTAL SAH */
  /* PJ LITE 0.8.3 ORDEM PD CHAT */
  const mentalResources = pdMode
    ? `PV ${s.pvAtual ?? 0}/${s.pvMax ?? 0} | PD ${s.pdAtual ?? 0}/${s.pdMax ?? 0}`
    : `PV ${s.pvAtual ?? 0}/${s.pvMax ?? 0} | PE ${s.peAtual ?? 0}/${s.peMax ?? 0} | SAN ${s.sanAtual ?? 0}/${s.sanMax ?? 0}`;
  const hasAutoDefense = Object.prototype.hasOwnProperty.call(s, 'defesaEquip') || Object.prototype.hasOwnProperty.call(s, 'defesaOutros');
  const defense = hasAutoDefense
    ? 10 + Number(a.agi || 0) + Number(s.defesaEquip || 0) + Number(s.defesaOutros || 0)
    : Number(s.defesa ?? 10);

  let out = `🔻 ORDEM PARANORMAL — ${val(b.nome, 'Sem Nome')}\n`;
  if (has(b.jogador)) out += `Jogador: ${b.jogador}${has(b.idade) ? ` | Idade: ${b.idade}` : ''}\n`;
  out += `${val(b.origem)} • ${val(b.classe)}${has(b.trilha) ? ` • ${b.trilha}` : ''} • NEX ${b.nex ?? 0}% • ${val(b.patente)}\n`;
  if (has(b.profissao)) out += `Profissão/Especialidade: ${b.profissao}\n`;
  if (has(d.afinidade)) out += `Afinidade: ${d.afinidade}\n`;

  out += `\n📊 ATRIBUTOS & STATUS\n`;
  out += `AGI ${a.agi ?? 1} | FOR ${a.for ?? 1} | INT ${a.int ?? 1} | PRE ${a.pre ?? 1} | VIG ${a.vig ?? 1}\n`;
  out += mentalResources + '\n';
  out += `Defesa ${defense} | Bloqueio ${s.bloqueio ?? 0} | Esquiva ${s.esquiva ?? 10}`;
  if (!pdMode) out += ` | PE/Rodada ${s.peRodada ?? 1}`;
  if (has(s.limitePePd)) out += ` | Limite PD ${s.limitePePd}`;
  out += ` | Mov. ${val(s.deslocamento, '9 m')}\n`;

  const skills = Object.entries(d.pericias || {}).filter(([, entry]) =>
    Number(entry?.grau || 0) > 0 || Number(entry?.outros || 0) !== 0
  );
  if (skills.length) {
    out += `\n🎯 PERÍCIAS\n`;
    out += skills.map(([id, entry]) => {
      const total = Number(entry?.grau || 0) + Number(entry?.outros || 0);
      const extra = Number(entry?.outros || 0);
      const attr = t(entry?.atributoBase || skillDefaultAttr(id)).toUpperCase();
      const dice = attr && a[attr.toLowerCase()] !== undefined ? `${a[attr.toLowerCase()]}d20` : '';
      return `• ${skillName(id)}: ${total >= 0 ? '+' : ''}${total}${attr ? ` [${attr}${dice ? ` • ${dice}` : ''}]` : ''}${extra ? ` (outros ${extra >= 0 ? '+' : ''}${extra})` : ''}`;
    }).join('\n') + '\n';
  }

  const attacks = (d.ataques || []).filter((entry) => has(entry?.nome) || has(entry?.dano));
  if (attacks.length) {
    out += `\n⚔️ ATAQUES\n`;
    attacks.forEach((entry) => {
      out += `• ${val(entry.nome, 'Ataque')} | Teste ${val(entry.teste)} | Dano ${val(entry.dano)}`;
      const details = [
        has(entry.critico) ? `Crítico ${entry.critico}` : '',
        has(entry.alcance) ? entry.alcance : '',
        has(entry.tipo) ? entry.tipo : '',
        has(entry.municao) ? `Munição ${entry.municao}` : '',
      ].filter(Boolean);
      if (details.length) out += ` | ${details.join(' | ')}`;
      if (has(entry.desc)) out += ` — ${compact(entry.desc)}`;
      out += '\n';
    });
  }

  const abilities = (d.habilidades || []).filter((entry) => has(entry?.nome) || has(entry?.desc));
  if (abilities.length) {
    out += `\n✨ PODERES & HABILIDADES\n`;
    abilities.forEach((entry) => {
      out += `• ${val(entry.nome, 'Poder')}${has(entry.tipo) ? ` [${entry.tipo}]` : ''}`;
      const details = [has(entry.custo) ? `Custo ${entry.custo}` : '', has(entry.pagina) ? `p. ${entry.pagina}` : ''].filter(Boolean);
      if (details.length) out += ` — ${details.join(' | ')}`;
      if (has(entry.desc)) out += `\n  ${compact(entry.desc)}`;
      out += '\n';
    });
  }

  const paranormalPowers = (d.poderesParanormais || []).filter((entry) => has(entry?.nome) || has(entry?.desc));
  if (paranormalPowers.length) {
    out += `\n👁️ PODERES PARANORMAIS\n`;
    paranormalPowers.forEach((entry) => {
      out += `• ${val(entry.nome, 'Poder Paranormal')}`;
      const details = [
        has(entry.elemento) ? entry.elemento : '',
        has(entry.requisito) ? `Req. ${entry.requisito}` : '',
        has(entry.custo) ? `Custo ${entry.custo}` : '',
        has(entry.pagina) ? `p. ${entry.pagina}` : '',
      ].filter(Boolean);
      if (details.length) out += ` [${details.join(' | ')}]`;
      if (has(entry.desc)) out += ` — ${compact(entry.desc)}`;
      out += '\n';
    });
  }

  const rituals = (d.rituais || []).filter((entry) => has(entry?.nome) || has(entry?.desc));
  const ritualDts = d.dtRituais || {};
  if (rituals.length || Object.values(ritualDts).some(has)) {
    out += `\n🔮 RITUAIS\n`;
    const dts = [1,2,3,4].filter((circle) => has(ritualDts[circle])).map((circle) => `${circle}º: DT ${ritualDts[circle]}`);
    if (dts.length) out += `DT por círculo: ${dts.join(' | ')}\n`;
    rituals.forEach((entry) => {
      out += `• ${val(entry.nome, 'Ritual')} — ${val(entry.circulo, 1)}º círculo`;
      if (has(entry.elemento)) out += ` | ${entry.elemento}`;
      const details = [
        entry.execucao,
        entry.alcance,
        entry.duracao,
        has(entry.resistencia) ? `Resistência: ${entry.resistencia}` : '',
        has(entry.custo) ? `Custo: ${entry.custo}` : '',
        has(entry.pagina) ? `p. ${entry.pagina}` : '',
      ].filter(has);
      if (details.length) out += ` | ${details.join(' | ')}`;
      if (has(entry.desc)) out += `\n  ${compact(entry.desc)}`;
      out += '\n';
    });
  }

  const inventory = (d.inventario || []).filter((entry) => has(entry?.nome));
  const management = d.gestao || {};
  if (inventory.length || Object.values(management).some(has)) {
    out += `\n🎒 INVENTÁRIO\n`;
    const limits = [
      has(management.limiteItens) ? `Limite de Itens ${management.limiteItens}` : '',
      has(management.limiteCredito) ? `Crédito ${management.limiteCredito}` : '',
      has(management.cargaMax) ? `Carga Máx. ${management.cargaMax}` : '',
      has(management.prestigio) ? `Prestígio ${management.prestigio}` : '',
    ].filter(Boolean);
    if (limits.length) out += limits.join(' | ') + '\n';
    inventory.forEach((entry) => {
      out += `• ${entry.quantidade || 1}x ${entry.nome} | Cat. ${val(entry.categoria, '0')} | ${val(entry.espacos, 1)} espaço(s)`;
      if (has(entry.desc)) out += ` — ${compact(entry.desc)}`;
      out += '\n';
    });
  }

  if (has(d.resistencias) || has(d.protecao) || has(d.proficiencias)) {
    out += `\n📚 ESTATÍSTICAS\n`;
    if (has(d.resistencias)) out += `Resistências: ${compact(d.resistencias)}\n`;
    if (has(d.protecao)) out += `Proteção: ${compact(d.protecao)}\n`;
    if (has(d.proficiencias)) out += `Proficiências: ${compact(d.proficiencias)}\n`;
  }

  const evolution = (d.evolucao || []).filter((entry) =>
    has(entry?.nivelNex) || has(entry?.limitePePd) || has(entry?.patente) || has(entry?.nota)
  );
  if (has(d.notas) || evolution.length) {
    out += `\n🎭 ANOTAÇÕES & EVOLUÇÃO\n`;
    if (has(d.notas)) out += compact(d.notas) + '\n';
    evolution.forEach((entry) => {
      const info = [entry.nivelNex, entry.patente, has(entry.limitePePd) ? `Limite PD ${entry.limitePePd}` : ''].filter(has);
      out += `• ${info.length ? info.join(' • ') : 'Marco'}${has(entry.nota) ? ` — ${compact(entry.nota)}` : ''}\n`;
    });
  }

  return out.replace(/\n{3,}/g, '\n\n').trim();
}

export function generateOrdemThreatChatText(data) {
  const d = data || {}, a = d.atributos || {}, s = d.status || {};
  let out = `🔻 AMEAÇA ORDEM — ${val(d.nome, 'Sem Nome')}\n`;
  out += `${val(d.categoria, 'Criatura')} • ${val(d.elemento, 'Sem elemento')} • VD ${d.vd ?? 0} • ${val(d.tamanho, 'Médio')}\n`;
  if (has(d.presencaPerturbadora)) out += `Presença Perturbadora: ${compact(d.presencaPerturbadora)}\n`;

  out += `\n📊 ATRIBUTOS & STATUS\n`;
  out += `AGI ${a.agi ?? 1} | FOR ${a.for ?? 1} | INT ${a.int ?? 1} | PRE ${a.pre ?? 1} | VIG ${a.vig ?? 1}\n`;
  out += `PV ${s.pvAtual ?? 0}/${s.pvMax ?? 0} | Defesa ${s.defesa ?? 10} | Mov. ${val(s.deslocamento)}\n`;

  const pericias = Object.entries(d.pericias || {}).filter(([, value]) => has(value));
  if (pericias.length) out += `\n🎯 PERÍCIAS\n${pericias.map(([id, value]) => `• ${id.charAt(0).toUpperCase() + id.slice(1)}: ${value}`).join('\n')}\n`;

  const attacks = (d.ataques || []).filter((entry) => has(entry?.nome) || has(entry?.dano));
  if (attacks.length) {
    out += `\n⚔️ ATAQUES\n`;
    attacks.forEach((entry) => {
      out += `• ${val(entry.nome)} | ${val(entry.teste)} | ${val(entry.dano)}`;
      const details = [has(entry.critico) ? `Crítico ${entry.critico}` : '', entry.alcance].filter(has);
      if (details.length) out += ` | ${details.join(' | ')}`;
      if (has(entry.desc)) out += ` — ${compact(entry.desc)}`;
      out += '\n';
    });
  }

  const powers = (d.habilidades || []).filter((entry) => has(entry?.nome) || has(entry?.desc));
  if (powers.length) out += `\n✨ HABILIDADES\n${powers.map((entry) => `• ${val(entry.nome)}${has(entry.desc) ? ` — ${compact(entry.desc)}` : ''}`).join('\n')}\n`;

  if (has(d.sentidos) || has(d.resistencias) || has(d.imunidades) || has(d.vulnerabilidades)) {
    out += `\n📚 ESTATÍSTICAS\n`;
    if (has(d.sentidos)) out += `Sentidos: ${compact(d.sentidos)}\n`;
    if (has(d.resistencias)) out += `Resistências: ${compact(d.resistencias)}\n`;
    if (has(d.imunidades)) out += `Imunidades: ${compact(d.imunidades)}\n`;
    if (has(d.vulnerabilidades)) out += `Vulnerabilidades: ${compact(d.vulnerabilidades)}\n`;
  }

  if (has(d.enigmaMedo)) out += `\n👁️ ENIGMA DE MEDO\n${compact(d.enigmaMedo)}\n`;
  if (has(d.notas)) out += `\n🎭 ANOTAÇÕES\n${compact(d.notas)}\n`;
  return out.replace(/\n{3,}/g, '\n\n').trim();
}
