const arr = value => Array.isArray(value) ? value : [];
const obj = value => value && typeof value === 'object' ? value : {};
const text = value => value === undefined || value === null ? '' : String(value);

function setText(form, name, value) {
  try { form.getTextField(name).setText(text(value)); } catch {}
}

function setChoice(form, name, value) {
  const v = text(value);
  if (!v) return;
  try { form.getDropdown(name).select(v); } catch {
    try { form.getOptionList(name).select(v); } catch {}
  }
}

function setCheck(form, name, checked) {
  try {
    const field = form.getCheckBox(name);
    checked ? field.check() : field.uncheck();
  } catch {}
}

function setPips(form, names, value) {
  const current = Math.max(0, Math.min(names.length, Number(value) || 0));
  names.forEach((name, index) => setCheck(form, name, index < current));
}

const ATTRIBUTE_FIELDS = {
  fisico: ['Button40','Button19','Button11','Button15','Button5'],
  agilidade: ['Button39','Button9','Button21','Button8','Button18'],
  intelecto: ['Button41','Button23','Button7','Button22','Button12'],
  coragem: ['Button42','Button20','Button16','Button10','Button4'],
};

const BACKGROUND_FIELDS = {
  combate: ['Button33','Button67','Button57','Button65','Button26'],
  negocios: ['Button44','Button70','Button58','Button68','Button47'],
  montaria: ['Button50','Button75','Button63','Button69','Button52'],
  tradicao: ['Button51','Button76','Button59','Button74','Button53'],
  labuta: ['Button49','Button77','Button60','Button82','Button54'],
  exploracao: ['Button48','Button78','Button84','Button83','Button55'],
  roubo: ['Button45','Button79','Button62','Button81','Button46'],
  medicina: ['Button43','Button80','Button56','Button64','Button1'],
};

const HORSE_POWER_FIELDS = ['Button87','Button92','Button93','Button94','Button88'];
const HORSE_VIGOR_FIELDS = ['Button90','Button91','Button95','Button96','Button101'];
const HORSE_FIDELITY_FIELDS = ['Button97','Button98','Button99','Button100'];
const HORSE_ITEM_FIELDS = ['Text126','Text125','Text124','Text123','Text122','Text121','Text119','Text118','Text117','Text115','Text114','Text113','Text112','Text111','Text110'];
const EQUIPMENT_NAME_FIELDS = ['Text127','Text128','Text129','Text130','Text131','Text133','Text134','Text135','Text136','Text137'];
const EQUIPMENT_DAMAGE_FIELDS = ['Text138','Text139','Text140','Text141','Text142','Text143','Text144','Text145','Text146','Text147'];

function abilitiesText(abilities) {
  return arr(abilities).filter(x => x?.nome || x?.desc).map((ability, index) => {
    const title = ability?.nome ? `${index + 1}. ${ability.nome}` : `${index + 1}.`;
    return [title, ability?.desc].filter(Boolean).join(' — ');
  }).join('\n\n');
}

function reputationText(reputation) {
  const rep = obj(reputation);
  const main = [rep.titulo, rep.valor !== undefined && rep.valor !== '' ? `(${rep.valor})` : ''].filter(Boolean).join(' ');
  return [main, rep.notas].filter(Boolean).join(' — ');
}

function equipmentRows(item) {
  const rows = [];
  arr(item.armas).forEach(weapon => {
    const details = [];
    if (weapon?.municaoAtual !== '' && weapon?.municaoAtual !== undefined) details.push(`mun. ${weapon.municaoAtual}/${weapon.municaoMax ?? '?'}`);
    if (weapon?.recarga) details.push(`recarga ${weapon.recarga}`);
    if (weapon?.notas) details.push(weapon.notas);
    rows.push({ nome: [weapon?.nome, details.length ? `(${details.join(' • ')})` : ''].filter(Boolean).join(' '), dano: weapon?.dano || '' });
  });
  arr(item.inventario).forEach(entry => {
    const suffix = [];
    if (entry?.quantidade !== undefined) suffix.push(`x${entry.quantidade}`);
    if (entry?.notas) suffix.push(entry.notas);
    rows.push({ nome: [entry?.nome, suffix.length ? `— ${suffix.join(' • ')}` : ''].filter(Boolean).join(' '), dano: '' });
  });
  return rows.slice(0, 10);
}

export function fillSom6Pdf(form, item = {}) {
  const bio = obj(item.bio);
  const status = obj(item.status);
  const attributes = obj(item.atributos);
  const backgrounds = obj(item.antecedentes);
  const mount = obj(item.montaria);

  setText(form, 'Text25', bio.nome);
  setText(form, 'Text29', item.nivel);
  setText(form, 'Text24', status.pvMax && status.pvMax !== status.pvAtual ? `${status.pvAtual}/${status.pvMax}` : status.pvAtual);
  setText(form, 'Text26', status.defesa);
  setText(form, 'Text84', status.iniciativa);
  setText(form, 'Text85', status.acoes);
  setChoice(form, 'Choice32', item?.tormento?.tipo);
  setText(form, 'Text3', item?.tormento?.desc);
  setText(form, 'Text4', item.recompensa);
  setText(form, 'Text1', abilitiesText(item.habilidades));
  setText(form, 'Text66', reputationText(item.reputacao));
  setText(form, 'Text33', item.dinheiro);

  Object.entries(ATTRIBUTE_FIELDS).forEach(([key, names]) => setPips(form, names, attributes?.[key]));
  Object.entries(BACKGROUND_FIELDS).forEach(([key, names]) => setPips(form, names, backgrounds?.[key]));

  equipmentRows(item).forEach((row, index) => {
    setText(form, EQUIPMENT_NAME_FIELDS[index], row.nome);
    setText(form, EQUIPMENT_DAMAGE_FIELDS[index], row.dano);
  });

  setText(form, 'Text86', mount.nome);
  setText(form, 'Text102', mount.fidelidade);
  setText(form, 'Text109', mount.pvMax && mount.pvMax !== mount.pvAtual ? `${mount.pvAtual}/${mount.pvMax}` : mount.pvAtual);
  setText(form, 'Text105', mount.defesa);
  setText(form, 'Text107', mount.dano);
  setPips(form, HORSE_POWER_FIELDS, mount.potencia);
  setPips(form, HORSE_VIGOR_FIELDS, mount.vigor ?? mount.resistencia);
  setPips(form, HORSE_FIDELITY_FIELDS, mount.fidelidade);
  arr(mount.itens).slice(0, HORSE_ITEM_FIELDS.length).forEach((entry, index) => {
    setText(form, HORSE_ITEM_FIELDS[index], typeof entry === 'string' ? entry : entry?.nome);
  });
}