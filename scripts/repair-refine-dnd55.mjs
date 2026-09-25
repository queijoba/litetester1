import { readFile, writeFile } from 'node:fs/promises';

const path = 'scripts/refine-dnd55-sheet.mjs';
let source = await readFile(path, 'utf8');

const helperMarker = "  'helpers visuais D&D'\n);";
const helperMarkerPos = source.indexOf(helperMarker);
if (helperMarkerPos < 0) throw new Error('Marcador helpers visuais D&D não encontrado.');
const helperStart = source.lastIndexOf('editor = replaceOnce(', helperMarkerPos);
if (helperStart < 0) throw new Error('Início do replaceOnce dos helpers não encontrado.');
const helperEnd = helperMarkerPos + helperMarker.length;
const correctedHelper = `editor = replaceOnce(
  editor,
  "  } = scope;\\n\\n  return (\\n",
  "  } = scope;\\n\\n  const dndFeatureGroups = [\\n    { id: 'classe', label: 'Características de Classe' },\\n    { id: 'especie', label: 'Características de Espécie' },\\n    { id: 'talento', label: 'Talentos' },\\n    { id: 'outro', label: 'Outros Recursos' }\\n  ];\\n  const dndAttunements = Array.isArray(data.sintonizacao) ? data.sintonizacao : ['', '', ''];\\n\\n  return (\\n",
  'helpers visuais D&D'
);`;
source = source.slice(0, helperStart) + correctedHelper + source.slice(helperEnd);

const badFeatures = "                                                          })}\n                                                      </div>\n                                                  </div>\n                                              ) : (`;";
const goodFeatures = "                                                          })}\n                                                      </div>\n`;";
if (source.includes(badFeatures)) source = source.replace(badFeatures, goodFeatures);

const badProf = "                                          </div>\n                                      </div>\n                                  </div>\n                                  </div>`;";
const goodProf = "                                          </div>\n`;";
if (source.includes(badProf)) source = source.replace(badProf, goodProf);

await writeFile(path, source);
console.log('Codemod D&D 5.5e reparado para execução segura.');
