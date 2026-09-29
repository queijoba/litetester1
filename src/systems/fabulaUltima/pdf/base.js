export const FABULA_PDF_TEMPLATE = '/pdfs/FU_Ficha_de_personagemV2.pdf';
export const FABULA_PDF_SYSTEM_ID = 'fabula';

const asArray = value => Array.isArray(value) ? value : [];
const obj = value => value && typeof value === 'object' ? value : {};

/**
 * Adapta a ficha atual de Fabula Ultima para um formato estável de exportação.
 * O template V2 de 3 páginas usa AcroForm e possui um campo editável próprio
 * para retrato na primeira página.
 */
export function buildFabulaPdfSnapshot(item = {}) {
  const bio = obj(item.bio);
  const atributos = obj(item.atributos);
  const status = obj(item.status);
  const extras = obj(item.extras);
  const magia = obj(extras.magia);

  return {
    system: FABULA_PDF_SYSTEM_ID,
    type: item.type || 'pc',
    portrait: bio.imagem || '',
    identity: {
      nome: bio.nome || '',
      jogador: bio.jogador || '',
      genero: bio.genero || '',
      identidade: bio.identidade || '',
      tema: bio.tema || '',
      origem: bio.origem || '',
      tracos: bio.tracos || '',
    },
    progress: {
      nivel: Number(item.nivel || 0),
      experiencia: Number(item.experiencia || 0),
      zenites: Number(item.zenites || 0),
    },
    attributes: {
      des: { ...obj(atributos.des) },
      ast: { ...obj(atributos.ast) },
      vig: { ...obj(atributos.vig) },
      von: { ...obj(atributos.von) },
    },
    conditions: { ...obj(item.condicoes) },
    resources: {
      pvAtual: Number(status.pvAtual || 0),
      pvMax: Number(status.pvMax || 0),
      pmAtual: Number(status.pmAtual || 0),
      pmMax: Number(status.pmMax || 0),
      piAtual: Number(status.piAtual || 0),
      piMax: Number(status.piMax || 0),
      fabula: Number(status.fabula || 0),
      defesa: Number(status.defesa || 0),
      defesaMagica: Number(status.defesaMagica || 0),
      iniciativa: Number(status.iniciativa || 0),
    },
    bonds: asArray(item.lacos).map(x => ({ ...obj(x) })),
    classes: asArray(item.classes).map(classe => ({
      ...obj(classe),
      poderes: asArray(classe?.poderes).map(poder => ({ ...obj(poder) })),
    })),
    heroicPowers: asArray(item.poderesHeroicos).map(x => ({ ...obj(x) })),
    equipment: {
      slots: asArray(item.equipamentos).map(x => ({ ...obj(x) })),
      equipavel: { ...obj(item.equipavel) },
      inventario: asArray(item.inventario).map(x => ({ ...obj(x) })),
      mochila: item.mochila || '',
      caracteristicas: item.caracteristicas || '',
    },
    magic: {
      disciplinas: asArray(magia.disciplinas),
      feiticos: asArray(magia.feiticos).map(x => ({ ...obj(x) })),
      rituais: asArray(magia.rituais).map(x => ({ ...obj(x) })),
    },
    supplements: { ...obj(item.suplementos) },
    extrasAtivos: asArray(item.extrasAtivos),
  };
}

export const FABULA_PDF_FIELDS = Object.freeze({
  portrait: 'retrato_personagem',
  name: 'Nome',
  namePage2: 'Campo testo 252',
  namePage3: 'Campo testo 236',
  level: 'Campo testo 10207',
  rituals: 'Campo testo 10210',
});
