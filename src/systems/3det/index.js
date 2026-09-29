export const tresDeTSystem = {
  id: '3det',
  name: '3DeT Victory',
  status: 'active',
  enabled: true,
};

export { default as TresDeTCharacterEditor } from './components/CharacterEditor.jsx';
export { initial3DetPcData, normalize3DetPcData, TRESDET_SKILLS, TRESDET_RARITIES } from './data.js';
export { generate3DetChatText } from './chat.js';
