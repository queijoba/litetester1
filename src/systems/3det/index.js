export const tresDeTSystem = {
  id: '3det',
  name: '3DeT Victory',
  status: 'active',
  enabled: true,
};

export { default as TresDeTCharacterEditor } from './components/CharacterEditor.jsx';
export { default as TresDeTThreatEditor } from './components/ThreatEditor.jsx';
export { initial3DetPcData, normalize3DetPcData, TRESDET_SKILLS, TRESDET_RARITIES } from './data.js';
export { initial3DetThreatData, normalize3DetThreatData, TRESDET_THREAT_CATEGORIES, TRESDET_THREAT_ROLES, TRESDET_SCALES } from './threatData.js';
export { MODELOS_3DET_PC } from './models.js';
export { MODELOS_3DET_NPCS, MODELOS_3DET_CRIATURAS, MODELOS_3DET_AMEACAS } from './threatModels.js';
export { generate3DetChatText } from './chat.js';
export { generate3DetThreatChatText } from './threatChat.js';
export { install3DetPdfExport } from './pdf/export.js';
