const clean = v => String(v ?? '')
  .replace(/[–—]/g, '-')
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/…/g, '...')
  .replace(/•/g, '-')
  .replace(/[^\u0009\u000A\u000D\u0020-\u007E\u00A0-\u00FF]/g, '');

const slug = v => String(v || '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const setText = (form, name, value) => {
  try { form.getTextField(name).setText(clean(value)); } catch {}
};

const setCheck = (form, name, checked) => {
  try {
    const field = form.getCheckBox(name);
    checked ? field.check() : field.uncheck();
  } catch {}
};

function mapSkills(form, skills, prefix) {
  (skills || []).forEach(skill => {
    const id = slug(skill?.nome);
    if (!id) return;
    setText(form, `${prefix}${id}`, skill?.valor ?? '');
    setCheck(form, `${prefix}av_${id}`, !!skill?.avanco);
    setCheck(form, `${prefix}treinada_${id}`, !!skill?.treinada);
  });
}

function inventoryLines(value) {
  return String(value || '').split(/\r?\n|;/).map(v => v.trim()).filter(Boolean).slice(0, 10);
}

function wrap3(value, width = 39) {
  const words = clean(value).replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length <= width || !line) line = next;
    else {
      lines.push(line);
      line = word;
      if (lines.length === 2) break;
    }
  }
  if (line && lines.length < 3) lines.push(line);
  return [lines[0] || '', lines[1] || '', lines[2] || ''];
}

export function fillDragonbanePdf(form, item) {
  const bio = item?.bio || {};
  const atr = item?.atributos || {};
  const der = item?.derivados || {};
  const status = item?.status || {};
  const defesa = item?.defesa || {};

  setText(form, 'nome', bio.nome);
  setText(form, 'jogador', bio.jogador);
  setText(form, 'ancestralidade', bio.ancestralidade);
  setText(form, 'profissao', bio.profissao);
  setText(form, 'idade', bio.idade);
  setText(form, 'fraqueza', bio.fraqueza);
  setText(form, 'aparencia', bio.aparencia);

  ['for', 'con', 'agl', 'int', 'von', 'car'].forEach(key => {
    setText(form, key, atr?.[key]?.valor ?? '');
    setCheck(form, `condicao_${key}`, !!atr?.[key]?.condicao);
  });

  setText(form, 'bonus_for', der.danoBonusFor);
  setText(form, 'bonus_agl', der.danoBonusAgl);
  setText(form, 'movimento', der.movimento);
  setText(form, 'sobrecarga', der.limiteSobrecarga);

  mapSkills(form, item?.periciasBase, 'pericia_');
  mapSkills(form, item?.periciasArmas, 'arma_pericia_');

  (item?.periciasSecundarias || []).slice(0, 7).forEach((skill, index) => {
    const n = index + 1;
    setCheck(form, `secundaria_${n}_av`, !!skill?.avanco);
    setText(form, `secundaria_${n}_nome`, skill?.nome);
    setText(form, `secundaria_${n}_attr`, skill?.attr);
    setText(form, `secundaria_${n}_valor`, skill?.valor);
  });

  setText(form, 'armadura', defesa?.armadura?.nome);
  setText(form, 'armadura_valor', defesa?.armadura?.valor);
  setText(form, 'armadura_reves', defesa?.armadura?.reves);
  setText(form, 'elmo', defesa?.elmo?.nome);
  setText(form, 'elmo_valor', defesa?.elmo?.valor);
  setText(form, 'elmo_reves', defesa?.elmo?.reves);

  (item?.armas || []).slice(0, 3).forEach((arma, index) => {
    const n = index + 1;
    setText(form, `equip_${n}_nome`, arma?.nome);
    setText(form, `equip_${n}_emp`, arma?.empunhadura ?? arma?.emp);
    setText(form, `equip_${n}_alcance`, arma?.alcance);
    setText(form, `equip_${n}_dano`, arma?.dano);
    setText(form, `equip_${n}_dur`, arma?.durabilidade ?? arma?.dur);
    setText(form, `equip_${n}_tracos`, arma?.tracos);
  });

  setText(form, 'pv_atual', status?.pv?.atual);
  setText(form, 'pv_max', status?.pv?.max);
  setText(form, 'pd_atual', status?.pd?.atual);
  setText(form, 'pd_max', status?.pd?.max);

  (status?.testesMorte?.sucessos || []).slice(0, 3).forEach((v, i) => setCheck(form, `morte_sucesso_${i + 1}`, !!v));
  (status?.testesMorte?.falhas || []).slice(0, 3).forEach((v, i) => setCheck(form, `morte_falha_${i + 1}`, !!v));
  setCheck(form, 'descanso_rodada', !!status?.descansoRodada);
  setCheck(form, 'descanso_entretempo', !!status?.descansoEntretempo);

  inventoryLines(item?.inventario).forEach((value, index) => {
    setText(form, `inventario_${String(index + 1).padStart(2, '0')}`, value);
  });
  setText(form, 'memento', bio.memento);
  setText(form, 'itens_minusculos', item?.itensMiudos);
  setText(form, 'ouro', item?.moedas?.ouro ?? '');
  setText(form, 'prata', item?.moedas?.prata ?? '');
  setText(form, 'cobre', item?.moedas?.cobre ?? '');

  setText(form, 'nome_pagina_2', bio.nome);
  (item?.habilidadesFeiticos || []).slice(0, 24).forEach((hab, index) => {
    const n = String(index + 1).padStart(2, '0');
    const rawLines = String(hab?.nome || '').split(/\r?\n/).map(v => v.trim()).filter(Boolean);
    const cardName = rawLines.shift() || '';
    const description = [hab?.descricao ?? hab?.desc ?? '', rawLines.join(' ')].filter(Boolean).join(' ');
    const lines = wrap3(description);
    const kind = String(hab?.tipo || '').toLowerCase();
    const isMagic = hab?.magia === true || hab?.isSpell === true || kind.includes('magia') || kind.includes('spell');
    setCheck(form, `cartao_${n}_habilidade`, !isMagic);
    setCheck(form, `cartao_${n}_magia`, isMagic);
    setText(form, `cartao_${n}_nome`, cardName);
    setText(form, `cartao_${n}_fv_nivel`, hab?.fv_nvl ?? hab?.pd_nivel ?? '');
    setText(form, `cartao_${n}_descricao_1`, lines[0]);
    setText(form, `cartao_${n}_descricao_2`, lines[1]);
    setText(form, `cartao_${n}_descricao_3`, lines[2]);
  });
}
