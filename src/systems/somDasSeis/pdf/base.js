export const SOM6_PDF_TEMPLATE = '/pdfs/som-das-seis-template.pdf';
export const SOM6_PDF_SYSTEM_ID = 'somdas6';

const asArray = value => Array.isArray(value) ? value : [];
const obj = value => value && typeof value === 'object' ? value : {};

/**
 * Adapta a ficha atual de O Som das Seis para um formato estável de exportação.
 * O mapeamento final para os nomes dos campos do PDF será feito quando o
 * template editável for adicionado em public/pdfs/som-das-seis-template.pdf.
 */
export function buildSom6PdfSnapshot(item = {}) {
  const bio = obj(item.bio);
  const atributos = obj(item.atributos);
  const status = obj(item.status);
  const montaria = obj(item.montaria);

  return {
    system: SOM6_PDF_SYSTEM_ID,
    type: item.type || 'pc',
    portrait: bio.imagem || '',
    identity: {
      nome: bio.nome || '',
      jogador: bio.jogador || '',
      apelido: bio.apelido || '',
      passado: bio.passado || '',
      aparencia: bio.aparencia || '',
    },
    progress: {
      nivel: Number(item.nivel || 0),
      xp: Number(item.xp || 0),
      dinheiro: Number(item.dinheiro || 0),
      recompensa: Number(item.recompensa || 0),
    },
    attributes: {
      fisico: Number(atributos.fisico || 0),
      intelecto: Number(atributos.intelecto || 0),
      coragem: Number(atributos.coragem || 0),
      agilidade: Number(atributos.agilidade || 0),
    },
    status: {
      pvAtual: Number(status.pvAtual || 0),
      pvMax: Number(status.pvMax || 0),
      defesa: Number(status.defesa || 0),
      iniciativa: Number(status.iniciativa || 0),
      acoes: Number(status.acoes || 0),
    },
    backgrounds: { ...obj(item.antecedentes) },
    abilities: asArray(item.habilidades).map(x => ({ ...obj(x) })),
    torment: { ...obj(item.tormento) },
    reputation: { ...obj(item.reputacao) },
    fateCards: asArray(item.cartasSina).map(x => ({ ...obj(x) })),
    weapons: asArray(item.armas).map(x => ({ ...obj(x) })),
    inventory: asArray(item.inventario).map(x => ({ ...obj(x) })),
    mount: {
      ...montaria,
      itens: asArray(montaria.itens).map(x => ({ ...obj(x) })),
    },
  };
}

/**
 * Será preenchido com os nomes reais dos campos AcroForm depois que o PDF
 * definitivo for enviado. Mantê-lo aqui evita espalhar nomes de campos pelo app.
 */
export const SOM6_PDF_FIELDS = Object.freeze({});
