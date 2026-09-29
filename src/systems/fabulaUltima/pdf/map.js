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

function setChoice(form, name, value) {
  const v = text(value);
  if (!v) return;
  try { form.getDropdown(name).select(v); } catch {
    try { form.getOptionList(name).select(v); } catch {}
  }
}

function normalize(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function findEquipment(items, wanted) {
  const key = normalize(wanted);
  return arr(items).find(item => normalize(item?.slot).includes(key)) || {};
}

function joinPower(power = {}) {
  const head = [power.nome, power.nivel ? `NP ${power.nivel}` : ''].filter(Boolean).join(' — ');
  return [head, power.desc].filter(Boolean).join(': ');
}

function ritualRef(potencia = 'Menor', area = 'Individual') {
  const base = {
    Menor: { pm: 20, nd: 7, relogio: 4 },
    'Média': { pm: 30, nd: 10, relogio: 6 },
    Maior: { pm: 40, nd: 13, relogio: 6 },
    Extrema: { pm: 50, nd: 16, relogio: 8 },
  }[potencia] || { pm: 20, nd: 7, relogio: 4 };
  const mult = { Individual: 1, Pequena: 2, Grande: 3, Enorme: 4 }[area] || 1;
  return { pm: base.pm * mult, nd: base.nd, relogio: base.relogio };
}

export function fillFabulaPdf(form, item = {}) {
  const bio = obj(item.bio);
  const atributos = obj(item.atributos);
  const status = obj(item.status);
  const extras = obj(item.extras);

  setText(form, 'bio_nome', bio.nome);
  setText(form, 'bio_jogador', bio.jogador);
  setText(form, 'bio_genero', bio.genero);
  setText(form, 'bio_identidade', bio.identidade);
  setText(form, 'bio_tema', bio.tema);
  setText(form, 'bio_origem', bio.origem);
  setText(form, 'nivel', item.nivel);
  setText(form, 'experiencia', item.experiencia);
  setText(form, 'zenites', item.zenites);
  setText(form, 'bio_tracos', bio.tracos);

  arr(item.lacos).slice(0, 6).forEach((bond, index) => {
    const n = index + 1;
    setText(form, `laco_${n}_alvo`, bond?.alvo);
    setChoice(form, `laco_${n}_forca`, bond?.forca);
    setText(form, `laco_${n}_emocoes`, bond?.emocoes);
  });

  ['des', 'ast', 'vig', 'von'].forEach(key => {
    setChoice(form, `atributo_${key}_base`, atributos?.[key]?.base || 'd8');
    setChoice(form, `atributo_${key}_atual`, atributos?.[key]?.atual || atributos?.[key]?.base || 'd8');
  });

  ['lento', 'atordoado', 'fraco', 'abalado', 'enfurecido', 'envenenado'].forEach(key => {
    setCheck(form, `condicao_${key}`, !!item?.condicoes?.[key]);
  });

  setText(form, 'pv_atual', status.pvAtual);
  setText(form, 'pv_max', status.pvMax);
  setText(form, 'pm_atual', status.pmAtual);
  setText(form, 'pm_max', status.pmMax);
  setText(form, 'pi_atual', status.piAtual);
  setText(form, 'pi_max', status.piMax);
  setText(form, 'fabula_atual', status.fabula);
  setText(form, 'defesa', status.defesa);
  setText(form, 'defesa_magica', status.defesaMagica);
  setText(form, 'iniciativa', status.iniciativa);
  setText(form, 'pv_crise', Math.floor(Number(status.pvMax || 0) / 2));

  const equipment = arr(item.equipamentos);
  [
    ['mao_dominante', 'mão dominante'],
    ['mao_secundaria', 'mão secundária'],
    ['armadura', 'armadura'],
    ['acessorio', 'acessório'],
  ].forEach(([field, label]) => {
    const eq = findEquipment(equipment, label);
    setText(form, `equip_${field}_nome`, eq.nome);
    setText(form, `equip_${field}_descricao`, eq.descricao);
  });

  setCheck(form, 'equipavel_armadura_marcial', !!item?.equipavel?.armaduraMarcial);
  setCheck(form, 'equipavel_escudo_marcial', !!item?.equipavel?.escudoMarcial);
  setCheck(form, 'equipavel_arma_corpo_marcial', !!item?.equipavel?.armaCorpoMarcial);
  setCheck(form, 'equipavel_arma_distancia_marcial', !!item?.equipavel?.armaDistanciaMarcial);
  setText(form, 'caracteristicas', item.caracteristicas);
  setText(form, 'mochila', item.mochila);

  arr(item.inventario).slice(0, 16).forEach((entry, index) => {
    const n = index + 1;
    setText(form, `inventario_${n}_nome`, entry?.nome);
    setText(form, `inventario_${n}_quantidade`, entry?.quantidade ?? 1);
    setText(form, `inventario_${n}_notas`, entry?.notas);
  });

  arr(item.classes).slice(0, 7).forEach((classe, index) => {
    const n = index + 1;
    setText(form, `classe_${n}_nome`, classe?.nome);
    setText(form, `classe_${n}_nivel`, classe?.nivel);
    setText(form, `classe_${n}_beneficios`, classe?.beneficios);
    const powers = arr(classe?.poderes);
    if (n <= 3) {
      powers.slice(0, 5).forEach((power, pi) => {
        const p = pi + 1;
        setText(form, `classe_${n}_poder_${p}_nome`, power?.nome);
        setText(form, `classe_${n}_poder_${p}_nivel`, power?.nivel);
        setText(form, `classe_${n}_poder_${p}_desc`, power?.desc);
      });
    } else {
      setText(form, `classe_${n}_poderes`, powers.map(joinPower).filter(Boolean).join('\n'));
    }
  });

  arr(item.poderesHeroicos).slice(0, 3).forEach((power, index) => {
    const n = index + 1;
    setText(form, `heroico_${n}_nome`, power?.nome);
    setText(form, `heroico_${n}_desc`, power?.desc);
  });

  arr(extras?.recursosClasse?.lista).slice(0, 4).forEach((resource, index) => {
    const n = index + 1;
    setText(form, `recurso_${n}_nome`, resource?.nome);
    setText(form, `recurso_${n}_atual`, resource?.atual);
    setText(form, `recurso_${n}_max`, resource?.max ?? resource?.maximo);
    setText(form, `recurso_${n}_notas`, resource?.notas ?? resource?.desc);
  });

  const magic = obj(extras.magia);
  setText(form, 'magia_disciplinas', arr(magic.disciplinas).join(', '));
  arr(magic.feiticos).slice(0, 8).forEach((spell, index) => {
    const n = index + 1;
    setText(form, `feitico_${n}_nome`, spell?.nome);
    setCheck(form, `feitico_${n}_ofensiva`, !!(spell?.ofensiva ?? spell?.ofensivo));
    setText(form, `feitico_${n}_disciplina`, spell?.disciplina);
    setText(form, `feitico_${n}_pm`, spell?.pm);
    setText(form, `feitico_${n}_alvos`, spell?.alvos ?? spell?.alvo);
    setText(form, `feitico_${n}_duracao`, spell?.duracao);
    setText(form, `feitico_${n}_teste`, spell?.teste);
    setText(form, `feitico_${n}_desc`, spell?.desc ?? spell?.efeito);
  });

  arr(magic.rituais).slice(0, 3).forEach((ritual, index) => {
    const n = index + 1;
    const ref = ritualRef(ritual?.potencia, ritual?.area);
    setText(form, `ritual_${n}_nome`, ritual?.nome);
    setText(form, `ritual_${n}_disciplina`, ritual?.disciplina);
    setText(form, `ritual_${n}_teste`, ritual?.teste);
    setChoice(form, `ritual_${n}_potencia`, ritual?.potencia || 'Menor');
    setChoice(form, `ritual_${n}_area`, ritual?.area || 'Individual');
    setText(form, `ritual_${n}_ref_pm`, ref.pm);
    setText(form, `ritual_${n}_ref_nd`, ref.nd);
    setText(form, `ritual_${n}_relogio`, ref.relogio);
    setText(form, `ritual_${n}_pm`, ritual?.pm || ref.pm);
    setText(form, `ritual_${n}_nd`, ritual?.nd || ref.nd);
    setText(form, `ritual_${n}_desc`, ritual?.desc);
    setText(form, `ritual_${n}_falha`, ritual?.falha);
  });

  arr(extras?.arcanos?.lista).slice(0, 3).forEach((arcano, index) => {
    const n = index + 1;
    setText(form, `arcano_${n}_nome`, arcano?.nome);
    setText(form, `arcano_${n}_dominios`, arcano?.dominios);
    setText(form, `arcano_${n}_fundir`, arcano?.fundir ?? arcano?.efeitoFundir);
    setText(form, `arcano_${n}_dispensar`, arcano?.dispensar ?? arcano?.efeitoDispensar);
  });

  arr(extras?.projetos?.lista).slice(0, 2).forEach((project, index) => {
    const n = index + 1;
    setText(form, `projeto_${n}_nome`, project?.nome);
    setText(form, `projeto_${n}_descricao`, project?.descricao);
    setText(form, `projeto_${n}_custo_material`, project?.custoMaterial);
    setText(form, `projeto_${n}_progresso_atual`, project?.progressoAtual);
    setText(form, `projeto_${n}_progresso_necessario`, project?.progressoNecessario);
    setText(form, `projeto_${n}_material_especial`, project?.materialEspecial);
    setText(form, `projeto_${n}_defeito`, project?.defeito);
  });

  const pec = obj(extras.peculiaridade);
  setText(form, 'peculiaridade_nome', pec.nome);
  setText(form, 'peculiaridade_origem', pec.origem);
  setText(form, 'peculiaridade_efeito', pec.efeito);
  setText(form, 'peculiaridade_notas', pec.notas);

  arr(extras?.armaPersonalizada?.lista).slice(0, 2).forEach((weapon, index) => {
    const n = index + 1;
    setText(form, `arma_personalizada_${n}_nome`, weapon?.nome);
    setText(form, `arma_personalizada_${n}_categoria`, weapon?.categoria);
    setText(form, `arma_personalizada_${n}_alcance`, weapon?.alcance);
    setText(form, `arma_personalizada_${n}_teste`, weapon?.teste ?? weapon?.precisao);
    setText(form, `arma_personalizada_${n}_dano`, weapon?.dano);
    setText(form, `arma_personalizada_${n}_tipo_dano`, weapon?.tipoDano ?? weapon?.tipo);
    setText(form, `arma_personalizada_${n}_caracteristicas`, weapon?.caracteristicas ?? weapon?.notas);
  });

  const recipes = obj(extras.receitas);
  setText(form, 'receitas_max_ingredientes', recipes.maxIngredientes);
  ['amargo', 'salgado', 'azedo', 'doce', 'umami'].forEach(key => setText(form, `receitas_${key}`, recipes?.ingredientes?.[key]));
  setText(form, 'receitas_combinacoes', recipes.combinacoes);
  setText(form, 'receitas_notas', recipes.notas);

  const camp = obj(extras.acampamento);
  arr(camp.atividades).slice(0, 2).forEach((activity, index) => {
    const n = index + 1;
    setText(form, `acampamento_${n}_nome`, activity?.nome);
    setText(form, `acampamento_${n}_alvo`, activity?.alvo);
    setText(form, `acampamento_${n}_efeito`, activity?.efeito);
  });
  arr(camp.beneficios).slice(0, 3).forEach((benefit, index) => {
    const n = index + 1;
    const value = typeof benefit === 'string' ? { nome: benefit, usado: false } : obj(benefit);
    setCheck(form, `acampamento_beneficio_${n}_usado`, !!value.usado);
    setText(form, `acampamento_beneficio_${n}_nome`, value.nome ?? value.desc);
  });

  const garden = obj(extras.jardim);
  setText(form, 'jardim_magissemente_atual', garden.magissementeAtual);
  setChoice(form, 'jardim_germinacao', garden.germinacao);
  arr(garden.conhecidas).slice(0, 4).forEach((seed, index) => {
    const n = index + 1;
    setText(form, `jardim_conhecida_${n}_nome`, seed?.nome);
    setText(form, `jardim_conhecida_${n}_efeito`, seed?.efeito ?? seed?.desc);
  });

  const summons = obj(extras.invocacoes);
  ['agua', 'ar', 'fogo', 'raio', 'terra'].forEach(key => setCheck(form, `manancial_${key}`, !!summons?.mananciais?.[key]));
  arr(summons.lista).slice(0, 4).forEach((summon, index) => {
    const n = index + 1;
    setText(form, `invocacao_${n}_nome`, summon?.nome);
    setText(form, `invocacao_${n}_manancial`, summon?.manancial);
    setText(form, `invocacao_${n}_tipo`, summon?.tipo);
    setText(form, `invocacao_${n}_efeito`, summon?.efeito ?? summon?.desc);
  });

  const trade = obj(extras.comercio);
  setText(form, 'comercio_atual', trade.atual);
  setText(form, 'comercio_max', trade.max);
  arr(trade.assentamentos).slice(0, 4).forEach((place, index) => {
    const n = index + 1;
    setText(form, `assentamento_${n}_nome`, place?.nome);
    setText(form, `assentamento_${n}_prosperidade`, place?.prosperidade);
    setText(form, `assentamento_${n}_notas`, place?.notas);
  });

  arr(extras?.materiais?.lista).slice(0, 6).forEach((material, index) => {
    const n = index + 1;
    setText(form, `material_${n}_nome`, material?.nome);
    setText(form, `material_${n}_quantidade`, material?.quantidade ?? material?.qtd);
    setText(form, `material_${n}_valor`, material?.valor);
    setText(form, `material_${n}_uso`, material?.uso ?? material?.destino ?? material?.notas);
  });

  const mnemo = obj(extras.mnemosfera);
  setText(form, 'mnemosfera_nome', mnemo.nome);
  setText(form, 'mnemosfera_classe', mnemo.classe);
  setText(form, 'mnemosfera_nivel', mnemo.nivel);
  arr(mnemo.poderes).slice(0, 6).forEach((power, index) => {
    const n = index + 1;
    setText(form, `mnemosfera_poder_${n}_nome`, power?.nome);
    setText(form, `mnemosfera_poder_${n}_nivel`, power?.nivel);
  });
  setText(form, 'mnemosfera_poder_heroico', mnemo.poderHeroico);

  arr(extras?.tecnosferas?.lista).slice(0, 3).forEach((sphere, index) => {
    const n = index + 1;
    setText(form, `tecnosfera_${n}_nome`, sphere?.nome);
    setText(form, `tecnosfera_${n}_tipo`, sphere?.tipo);
    setText(form, `tecnosfera_${n}_equipamento`, sphere?.equipamento);
    setText(form, `tecnosfera_${n}_efeito`, sphere?.efeito ?? sphere?.desc);
  });

  const vehicle = obj(extras.veiculo);
  setText(form, 'veiculo_nome', vehicle.nome);
  setText(form, 'veiculo_tipo', vehicle.tipo);
  setText(form, 'veiculo_estrutura', vehicle.estrutura);
  setText(form, 'veiculo_passageiros', vehicle.passageiros);
  setText(form, 'veiculo_notas', vehicle.notas);
  arr(vehicle.modulos).slice(0, 3).forEach((module, index) => {
    const n = index + 1;
    setText(form, `veiculo_modulo_${n}_nome`, module?.nome);
    setText(form, `veiculo_modulo_${n}_efeito`, module?.efeito ?? module?.desc);
  });

  arr(extras?.poderZero?.lista).slice(0, 2).forEach((power, index) => {
    const n = index + 1;
    setText(form, `poder_zero_${n}_nome`, power?.nome);
    setText(form, `poder_zero_${n}_gatilho`, power?.gatilho ?? power?.condicao);
    setText(form, `poder_zero_${n}_efeito`, power?.efeito ?? power?.desc);
    setText(form, `poder_zero_${n}_notas`, power?.notas);
  });

  setText(form, 'anotacoes_regras', extras?.anotacoes?.regras);
  setText(form, 'anotacoes_notas', extras?.anotacoes?.notas);

  const supplements = obj(item.suplementos);
  setCheck(form, 'suplemento_basico', supplements.basico !== false);
  setCheck(form, 'suplemento_natural', !!supplements.natural);
  setCheck(form, 'suplemento_high', !!supplements.high);
  setCheck(form, 'suplemento_techno', !!supplements.techno);
  setCheck(form, 'suplemento_codex', !!supplements.codex);
}