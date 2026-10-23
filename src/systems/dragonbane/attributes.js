// Dragonbane — ordem da ficha oficial (Livro de Regras v1.1, cap. 3, p. 24).
// A ordem de exibição NÃO deve depender da ordem das chaves no JSON salvo ou importado.
// Importante: as chaves abaixo são as mesmas usadas no armazenamento e no PDF.
export const DRAGONBANE_ATTRIBUTE_ORDER = Object.freeze(['for','con','agl','int','von','car']);
export const DRAGONBANE_ATTRIBUTE_NAMES = Object.freeze({
  for:'Força',con:'Constituição',agl:'Agilidade',int:'Inteligência',von:'Vontade',car:'Carisma'
});

// Sempre renderizar as seis posições oficiais, inclusive em fichas legadas incompletas.
// Jamais remapear valores por posição: o valor pertence ao atributo identificado pela chave.
export function dragonbaneAttributeValue(attributes, key) {
  const record = attributes && typeof attributes === 'object' ? attributes[key] : null;
  return record && typeof record === 'object' ? (record.valor ?? 10) : 10;
}

export function dragonbaneAttributeCondition(attributes, key) {
  const record = attributes && typeof attributes === 'object' ? attributes[key] : null;
  return !!(record && typeof record === 'object' && record.condicao);
}

// Apenas reconstrói a ordem do objeto, sem mudar valores, condições, nem campos extras.
// Uso opcional no carregamento de fichas antigas, sem gravar automaticamente no storage.
export function orderedDragonbaneAttributes(attributes) {
  const source = attributes && typeof attributes === 'object' && !Array.isArray(attributes) ? attributes : {};
  const ordered = {};
  for (const key of DRAGONBANE_ATTRIBUTE_ORDER) {
    const original = source[key];
    ordered[key] = original && typeof original === 'object' && !Array.isArray(original)
      ? {...original}
      : {valor:10,condicao:false};
  }
  for (const [key,value] of Object.entries(source)) {
    if (!Object.prototype.hasOwnProperty.call(ordered,key)) ordered[key] = value;
  }
  return ordered;
}
