import { RZ_SKILLS, RZ_ADVANTAGES, RZ_DEFECTS, calcRotaZeroCosts } from './data.js';

const text = (value) => String(value ?? '').trim();
const has = (value) => text(value) !== '';
const val = (value, fallback = '—') => has(value) ? value : fallback;
const compact = (value) => text(value).replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');

const selectedSkills = (data) =>
  RZ_SKILLS.filter(([id]) => !!data?.pericias?.[id]).map(([, name]) => name);

const advantage = (id) => RZ_ADVANTAGES.find((entry) => entry.id === id);
const defect = (id) => RZ_DEFECTS.find((entry) => entry.id === id);

export function generateRotaZeroChatText(data) {
  const d = data || {};
  const b = d.bio || {};
  const a = d.atributos || {};
  const r = d.recursos || {};
  const costs = calcRotaZeroCosts(d);
  const panic = (d.panico || []).filter(Boolean).length;
  const trauma = (d.traumas || []).filter(Boolean).length;

  let out = `🚚 ROTA ZERO — ${val(b.nome, 'Funcionário sem nome')}\n`;
  if (has(b.jogador)) out += `Conta/Jogador: ${b.jogador}\n`;
  out += `Função: ${val(b.kit, 'Não definida')}`;
  if (has(b.idade)) out += ` | Idade/Registro: ${b.idade}`;
  out += '\n';
  if (has(b.conceito)) out += `Conceito: ${compact(b.conceito)}\n`;

  out += `\n📊 ATRIBUTOS & RECURSOS\n`;
  out += `Pulso ${val(a.pulso, 1)} | Técnica ${val(a.tecnica, 1)} | Firmeza ${val(a.firmeza, 1)}\n`;
  out += `ADR ${r.adrenalina?.atual ?? 0}/${r.adrenalina?.max ?? 0} | FOC ${r.foco?.atual ?? 0}/${r.foco?.max ?? 0} | VIT ${r.vitalidade?.atual ?? 0}/${r.vitalidade?.max ?? 0}\n`;
  out += `Pânico ${panic}/${(d.panico || []).length || 4} | Traumas ${trauma}/${(d.traumas || []).length || 3} | Interferência ${Number(d.interferencia || 0)}/6\n`;
  out += `CR: ${costs.remaining} restantes de ${costs.available}${d.contratacao?.horaExtra ? ' • Hora Extra ativa' : ''}\n`;

  const skills = selectedSkills(d);
  if (skills.length) out += `\n🎯 PERÍCIAS\n${skills.map((name) => `• ${name}`).join('\n')}\n`;

  const advantages = (d.vantagens || []).map(advantage).filter(Boolean);
  const defects = (d.defeitos || []).map(defect).filter(Boolean);
  if (advantages.length || defects.length) {
    out += `\n✨ VANTAGENS & DEFEITOS\n`;
    advantages.forEach((entry) => {
      out += `• + ${entry.nome} [${entry.custo} CR]`;
      if (has(entry.tipo)) out += ` — ${entry.tipo}`;
      if (has(entry.efeito)) out += `: ${compact(entry.efeito)}`;
      out += '\n';
    });
    defects.forEach((entry) => {
      out += `• − ${entry.nome} [+1 CR]`;
      if (has(entry.efeito)) out += ` — ${compact(entry.efeito)}`;
      out += '\n';
    });
  }

  const inventory = (d.inventario || []).map(text).filter(Boolean);
  if (inventory.length) out += `\n🎒 INVENTÁRIO\n${inventory.map((item, index) => `• Espaço ${index + 1}: ${item}`).join('\n')}\n`;

  if (has(d.ancora) || has(d.notas)) {
    out += `\n🎭 ÂNCORA & ANOTAÇÕES\n`;
    if (has(d.ancora)) out += `Âncora: ${compact(d.ancora)}\n`;
    if (has(d.notas)) out += `Notas: ${compact(d.notas)}\n`;
  }

  if (d.veiculoAtivo) {
    const v = d.veiculo || {};
    out += `\n🚚 VEÍCULO / TURNO\n`;
    out += `${val(v.nome, 'Veículo sem nome')}`;
    if (has(v.modelo)) out += ` • ${v.modelo}`;
    if (has(v.placaId)) out += ` • ID ${v.placaId}`;
    out += '\n';
    out += `Manejo ${val(v.manejo, 2)} | Tração ${val(v.tracao, 2)} | Casco ${val(v.casco, 2)}\n`;
    out += `Combustível ${val(v.combustivel, 0)}/6 | Integridade ${val(v.integridade, 0)}/6 | Aquecimento ${val(v.aquecimento, 0)}/4\n`;
    const route = [has(v.rotaAtual) ? `Rota: ${v.rotaAtual}` : '', has(v.destino) ? `Destino: ${v.destino}` : ''].filter(Boolean);
    if (route.length) out += route.join(' | ') + '\n';
    const shift = [Number(v.entregas || 0) ? `Entregas: ${v.entregas}` : '', has(v.tempoTurno) ? `Turno: ${v.tempoTurno}` : '', has(v.despesas) ? `Despesas: ${v.despesas}` : ''].filter(Boolean);
    if (shift.length) out += shift.join(' | ') + '\n';
    if (has(v.cargaCompartimentos)) out += `Carga: ${compact(v.cargaCompartimentos)}\n`;
    if (has(v.upgradesSlots)) out += `Upgrades: ${compact(v.upgradesSlots)}\n`;
    if (has(v.desvios)) out += `Desvios: ${compact(v.desvios)}\n`;
    if (has(v.radioMensagens)) out += `Rádio: ${compact(v.radioMensagens)}\n`;
    if (has(v.pistasIncidentes)) out += `Pistas/Incidentes: ${compact(v.pistasIncidentes)}\n`;
    if (has(v.avariasReparos)) out += `Avarias/Reparos: ${compact(v.avariasReparos)}\n`;
  }

  return out.replace(/\n{3,}/g, '\n\n').trim();
}
