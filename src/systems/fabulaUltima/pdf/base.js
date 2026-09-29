export const FABULA_PDF_TEMPLATE = '/pdfs/fabula-ultima-template.pdf';
export const FABULA_PDF_SYSTEM_ID = 'fabula';

const asArray = value => Array.isArray(value) ? value : [];
const obj = value => value && typeof value === 'object' ? value : {};

/**
 * Adapta a ficha atual de Fabula Ultima para um formato estável de exportação.
 * O mapeamento final para os nomes dos campos do PDF será feito quando o
 * template editável for adicionado em public/pdfs/fabula-ultima-template.pdf.
 */
export function buildFabulaPdfSnapshot(item = {}) {
  const bio = obj(item.bio);
  const atributos = obj(item.atributos);
  const status = obj(item.status);

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
      slots: obj(item.equipamentos),
      proficiencias: obj(item.proficienciasEquipamento),
      inventario: asArray(item.inventario).map(x => ({ ...obj(x) })),
    },
    magic: {
      disciplinas: item.disciplinasMagicas || item.disciplinas || '',
      feiticos: asArray(item.feiticos).map(x => ({ ...obj(x) })),
      rituais: asArray(item.rituais).map(x => ({ ...obj(x) })),
    },
    supplements: { ...obj(item.suplementos) },
    extrasAtivos: asArray(item.extrasAtivos),
  };
}

/**
 * Será preenchido com os nomes reais dos campos AcroForm depois que o PDF
 * definitivo for enviado. Mantê-lo aqui evita espalhar nomes de campos pelo app.
 */
export const FABULA_PDF_FIELDS = Object.freeze({});
