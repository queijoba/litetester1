const text = value => value === undefined || value === null ? '' : String(value);
const arr = value => Array.isArray(value) ? value : [];
const obj = value => value && typeof value === 'object' ? value : {};

function setText(form, name, value) {
  try { form.getTextField(name).setText(text(value)); } catch {}
}

function setCheck(form, name, checked) {
  try {
    const field = form.getCheckBox(name);
    checked ? field.check() : field.uncheck();
  } catch {}
}

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function findEquipment(items, wanted) {
  const key = normalize(wanted);
  return arr(items).find(item => normalize(item?.slot).includes(key)) || {};
}

function joinPower(power = {}) {
  const head = [power.nome, power.nivel ? `NP ${power.nivel}` : ''].filter(Boolean).join(' - ');
  return [head, power.desc].filter(Boolean).join(': ');
}

function joinClassPowers(classe = {}) {
  return arr(classe?.poderes).map(joinPower).filter(Boolean).join('\n');
}

function joinHeroicPowers(powers) {
  return arr(powers)
    .map(power => [power?.nome, power?.desc].filter(Boolean).join(': '))
    .filter(Boolean)
    .join('\n\n');
}

function bondHasEmotion(bond, emotion) {
  const source = Array.isArray(bond?.emocoes) ? bond.emocoes.join(', ') : bond?.emocoes;
  return normalize(source).includes(normalize(emotion));
}

function formatInventory(item = {}) {
  const lines = [];
  if (text(item.mochila).trim()) lines.push(text(item.mochila).trim());

  const inventory = arr(item.inventario)
    .map(entry => {
      const qty = entry?.quantidade ?? entry?.qtd;
      const head = [qty && Number(qty) !== 1 ? `${qty}x` : '', entry?.nome].filter(Boolean).join(' ');
      return [head, entry?.notas].filter(Boolean).join(' - ');
    })
    .filter(Boolean);

  if (inventory.length) {
    if (lines.length) lines.push('');
    lines.push('Inventario:', ...inventory.map(value => `- ${value}`));
  }

  const extraNotes = text(item?.extras?.anotacoes?.notas).trim();
  if (extraNotes) {
    if (lines.length) lines.push('');
    lines.push(extraNotes);
  }

  return lines.join('\n');
}

function formatOptionalRules(item = {}) {
  const extras = obj(item.extras);
  const lines = [];
  const rules = text(extras?.anotacoes?.regras).trim();
  if (rules) lines.push(rules);

  const zeroPowers = arr(extras?.poderZero?.lista)
    .map(power => {
      const parts = [power?.nome, power?.gatilho ? `Gatilho: ${power.gatilho}` : '', power?.efeito, power?.notas]
        .filter(Boolean);
      return parts.join(' - ');
    })
    .filter(Boolean);
  if (zeroPowers.length) {
    if (lines.length) lines.push('');
    lines.push('Poderes Zero:', ...zeroPowers.map(value => `- ${value}`));
  }

  const arcanos = arr(extras?.arcanos?.lista)
    .map(arcano => {
      const details = [arcano?.dominios, arcano?.fundir ?? arcano?.efeitoFundir, arcano?.dispensar ?? arcano?.efeitoDispensar]
        .filter(Boolean)
        .join(' - ');
      return [arcano?.nome, details].filter(Boolean).join(': ');
    })
    .filter(Boolean);
  if (arcanos.length) {
    if (lines.length) lines.push('');
    lines.push('Arcanos:', ...arcanos.map(value => `- ${value}`));
  }

  return lines.join('\n');
}

function formatRituals(rituals) {
  return arr(rituals)
    .map(ritual => {
      const head = [ritual?.nome, ritual?.disciplina].filter(Boolean).join(' - ');
      const stats = [
        ritual?.teste ? `Teste: ${ritual.teste}` : '',
        ritual?.potencia ? `Potencia: ${ritual.potencia}` : '',
        ritual?.area ? `Area: ${ritual.area}` : '',
        ritual?.pm ? `PM: ${ritual.pm}` : '',
        ritual?.nd ? `ND: ${ritual.nd}` : '',
      ].filter(Boolean).join(' | ');
      const body = [ritual?.desc, ritual?.falha ? `Falha: ${ritual.falha}` : ''].filter(Boolean).join(' ');
      return [head, stats, body].filter(Boolean).join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
}

const BOND_CHECKBOXES = [
  { admiracao: 'C1059', inferioridade: 'C1044', lealdade: 'C185', desconfianca: 'C186', afeto: 'C187', odio: 'C188' },
  { admiracao: 'C1045', inferioridade: 'C1046', lealdade: 'C189', desconfianca: 'C190', afeto: 'C191', odio: 'C192' },
  { admiracao: 'C1047', inferioridade: 'C1048', lealdade: 'C193', desconfianca: 'C194', afeto: 'C195', odio: 'C196' },
  { admiracao: 'C1049', inferioridade: 'C1050', lealdade: 'C197', desconfianca: 'C198', afeto: 'C199', odio: 'C200' },
  { admiracao: 'C1051', inferioridade: 'C1052', lealdade: 'C201', desconfianca: 'C202', afeto: 'C203', odio: 'C204' },
  { admiracao: 'C1053', inferioridade: 'C1054', lealdade: 'C205', desconfianca: 'C206', afeto: 'C207', odio: 'C2010' },
];

const EMOTIONS = {
  admiracao: 'Admiração',
  inferioridade: 'Inferioridade',
  lealdade: 'Lealdade',
  desconfianca: 'Desconfiança',
  afeto: 'Afeto',
  odio: 'Ódio',
};

const CLASS_FIELDS = [
  ['Campo testo 285', 'Campo testo 286', 'Campo testo 10208'],
  ['Campo testo 287', 'Campo testo 288', 'Campo testo 10209'],
  ['Campo testo 289', 'Campo testo 290', 'Campo testo 102010'],
  ['Campo testo 253', 'Campo testo 254', 'Campo testo 10266'],
  ['Campo testo 255', 'Campo testo 256', 'Campo testo 10267'],
  ['Campo testo 257', 'Campo testo 258', 'Campo testo 10268'],
  ['Campo testo 259', 'Campo testo 260', 'Campo testo 10269'],
];

const SPELL_FIELDS = [
  ['Campo testo 243', 'Campo testo 244', 'Campo testo 245', 'Campo testo 246', 'Campo testo 242'],
  ['Campo testo 10237', 'Campo testo 10238', 'Campo testo 10239', 'Campo testo 10240', 'Campo testo 10236'],
  ['Campo testo 10242', 'Campo testo 10243', 'Campo testo 10244', 'Campo testo 10245', 'Campo testo 10241'],
  ['Campo testo 10247', 'Campo testo 10248', 'Campo testo 10249', 'Campo testo 10250', 'Campo testo 10246'],
  ['Campo testo 10252', 'Campo testo 10253', 'Campo testo 10254', 'Campo testo 10255', 'Campo testo 10251'],
  ['Campo testo 10257', 'Campo testo 10258', 'Campo testo 10259', 'Campo testo 10260', 'Campo testo 10256'],
  ['Campo testo 10262', 'Campo testo 10263', 'Campo testo 10264', 'Campo testo 10265', 'Campo testo 10261'],
  ['Campo testo 238', 'Campo testo 239', 'Campo testo 240', 'Campo testo 241', 'Campo testo 237'],
  ['Campo testo 10212', 'Campo testo 10213', 'Campo testo 10214', 'Campo testo 10215', 'Campo testo 10211'],
  ['Campo testo 10217', 'Campo testo 10218', 'Campo testo 10219', 'Campo testo 10220', 'Campo testo 10216'],
  ['Campo testo 10222', 'Campo testo 10223', 'Campo testo 10224', 'Campo testo 10225', 'Campo testo 10221'],
  ['Campo testo 10227', 'Campo testo 10228', 'Campo testo 10229', 'Campo testo 10230', 'Campo testo 10226'],
  ['Campo testo 10232', 'Campo testo 10233', 'Campo testo 10234', 'Campo testo 10235', 'Campo testo 10231'],
];

const DISCIPLINE_CHECKBOXES = {
  arcanismo: 'C208',
  quimerismo: 'C209',
  elementalismo: 'C210',
  entropismo: 'C211',
  ritualismo: 'C212',
  espiritualismo: 'C213',
};

export function fillFabulaPdf(form, item = {}) {
  const bio = obj(item.bio);
  const atributos = obj(item.atributos);
  const status = obj(item.status);
  const extras = obj(item.extras);
  const magic = obj(extras.magia);

  setText(form, 'Nome', bio.nome);
  setText(form, 'Genere', bio.genero);
  setText(form, 'Identita', bio.identidade);
  setText(form, 'Tema', bio.tema);
  setText(form, 'Origine', bio.origem);
  setText(form, 'Campo testo 252', bio.nome);
  setText(form, 'Campo testo 236', bio.nome);

  arr(item.lacos).slice(0, 6).forEach((bond, index) => {
    setText(form, `Legame${index + 1}`, bond?.alvo);
    const fields = BOND_CHECKBOXES[index];
    Object.entries(fields).forEach(([emotionKey, fieldName]) => {
      setCheck(form, fieldName, bondHasEmotion(bond, EMOTIONS[emotionKey]));
    });
  });

  const attributeFields = {
    des: ['Campo testo 270', 'Campo testo 271'],
    ast: ['Campo testo 272', 'Campo testo 273'],
    vig: ['Campo testo 274', 'Campo testo 275'],
    von: ['Campo testo 276', 'Campo testo 277'],
  };
  Object.entries(attributeFields).forEach(([key, fields]) => {
    setText(form, fields[0], atributos?.[key]?.base || 'd8');
    setText(form, fields[1], atributos?.[key]?.atual || atributos?.[key]?.base || 'd8');
  });

  const conditionFields = {
    lento: 'C44',
    atordoado: 'C45',
    fraco: 'C46',
    abalado: 'C47',
    envenenado: 'C48',
    enfurecido: 'C49',
  };
  Object.entries(conditionFields).forEach(([key, field]) => setCheck(form, field, !!item?.condicoes?.[key]));

  setText(form, 'PuntiFabula', status.fabula);
  setText(form, 'PuntiEsperienza', item.experiencia);
  setText(form, 'Zenit 2', item.zenites);
  setText(form, 'ModIniziativa', status.iniciativa);
  setText(form, 'Difesa', status.defesa);
  setText(form, 'DifesaMagica', status.defesaMagica);

  setText(form, 'Campo testo 280', status.pvMax);
  setText(form, 'Campo testo 281', Math.floor(Number(status.pvMax || 0) / 2));
  setText(form, 'Campo testo 282', status.pvAtual);
  setText(form, 'Campo testo 278', status.pmMax);
  setText(form, 'Campo testo 283', status.pmAtual);
  setText(form, 'Campo testo 279', status.piMax);
  setText(form, 'Campo testo 284', status.piAtual);
  setText(form, 'Campo testo 10207', item.nivel);

  const equipment = arr(item.equipamentos);
  [
    ['AccessorioEquip', 'AccessorioEquipDesc', 'acessório'],
    ['ArmaturaEquip', 'ArmaturaEquipDesc', 'armadura'],
    ['Mano1Equip', 'Mano1EquipDesc', 'mão dominante'],
    ['Mano2Equip', 'Mano2EquipDesc', 'mão secundária'],
  ].forEach(([nameField, descField, slot]) => {
    const eq = findEquipment(equipment, slot);
    setText(form, nameField, eq.nome);
    setText(form, descField, eq.descricao);
  });

  setCheck(form, 'EquipArmature', !!item?.equipavel?.armaduraMarcial);
  setCheck(form, 'EquipScudi', !!item?.equipavel?.escudoMarcial);
  setCheck(form, 'EquipMischia', !!item?.equipavel?.armaCorpoMarcial);
  setCheck(form, 'EquipDist', !!item?.equipavel?.armaDistanciaMarcial);

  const characteristics = [
    text(bio.tracos).trim() ? `Tracos: ${text(bio.tracos).trim()}` : '',
    text(item.caracteristicas).trim(),
  ].filter(Boolean).join('\n\n');
  setText(form, 'ZainoAppunti 2', characteristics);
  setText(form, 'ZainoAppunti 3', formatInventory(item));
  setText(form, 'Campo testo 10344', formatOptionalRules(item));

  arr(item.classes).slice(0, CLASS_FIELDS.length).forEach((classe, index) => {
    const [classField, benefitsField, powersField] = CLASS_FIELDS[index];
    const className = [classe?.nome, classe?.nivel ? `Nv. ${classe.nivel}` : ''].filter(Boolean).join(' / ');
    setText(form, classField, className);
    setText(form, benefitsField, classe?.beneficios);
    setText(form, powersField, joinClassPowers(classe));
  });

  setText(form, 'Campo testo 10270', joinHeroicPowers(item.poderesHeroicos));

  arr(magic.feiticos).slice(0, SPELL_FIELDS.length).forEach((spell, index) => {
    const [nameField, pmField, targetsField, durationField, descField] = SPELL_FIELDS[index];
    setText(form, nameField, spell?.nome);
    setText(form, pmField, spell?.pm);
    setText(form, targetsField, spell?.alvos ?? spell?.alvo);
    setText(form, durationField, spell?.duracao);
    const details = [
      spell?.disciplina ? `Disciplina: ${spell.disciplina}` : '',
      spell?.teste ? `Teste: ${spell.teste}` : '',
      (spell?.ofensiva ?? spell?.ofensivo) ? 'Ofensivo' : '',
      spell?.desc ?? spell?.efeito,
    ].filter(Boolean).join(' - ');
    setText(form, descField, details);
  });

  const disciplines = [
    ...arr(magic.disciplinas),
    ...arr(magic.rituais).map(ritual => ritual?.disciplina),
  ].map(normalize).filter(Boolean);
  Object.entries(DISCIPLINE_CHECKBOXES).forEach(([discipline, field]) => {
    setCheck(form, field, disciplines.some(value => value.includes(discipline)));
  });
  setText(form, 'Campo testo 10210', formatRituals(magic.rituais));
}
