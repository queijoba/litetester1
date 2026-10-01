import { readFile, access } from 'node:fs/promises';

const mustExist = [
  'src/systems/skyfall/data.js','src/systems/skyfall/threatData.js','src/systems/skyfall/models.js','src/systems/skyfall/threatModels.js','src/systems/skyfall/chat.js','src/systems/skyfall/components/CharacterEditor.jsx','src/systems/skyfall/components/ThreatEditor.jsx','src/systems/skyfall/skyfall-theme.css',
  'src/systems/ordemParanormal/data.js','src/systems/ordemParanormal/threatData.js','src/systems/ordemParanormal/models.js','src/systems/ordemParanormal/threatModels.js','src/systems/ordemParanormal/chat.js','src/systems/ordemParanormal/components/CharacterEditor.jsx','src/systems/ordemParanormal/components/ThreatEditor.jsx','src/systems/ordemParanormal/ordem-theme.css'
];
for (const p of mustExist) await access(p);

const app = await readFile('src/PJLiteApp.jsx','utf8');
const requiredTokens = [
  'PJ LITE 0.9 FINAL SYSTEMS','PJ LITE 0.9 FINAL POLISH',
  'SkyfallCharacterEditor','SkyfallThreatEditor','OrdemCharacterEditor','OrdemThreatEditor',
  "theme === 'skyfall'","theme === 'ordem'","data.system === 'ordemParanormal'",
  'initialSkyfallPcData','initialSkyfallThreatData','initialOrdemPcData','initialOrdemThreatData',
  'MODELOS_SKYFALL_PC','MODELOS_SKYFALL_AMEACAS','MODELOS_ORDEM_PC','MODELOS_ORDEM_AMEACAS',
  "setGuideTab('skyfall')","setGuideTab('ordem')",'Skyfall RPG • Personagem','Ordem Paranormal • Agente'
];
for (const token of requiredTokens) if (!app.includes(token)) throw new Error(`Integração final ausente: ${token}`);
if (app.includes("if (sys === 'ordem')")) throw new Error('ID antigo "ordem" ainda está sendo usado como sistema no roteamento.');

const skyData = await import('../src/systems/skyfall/data.js');
const skyThreat = await import('../src/systems/skyfall/threatData.js');
const ordemData = await import('../src/systems/ordemParanormal/data.js');
const ordemThreat = await import('../src/systems/ordemParanormal/threatData.js');

const skyPc = skyData.normalizeSkyfallPcData({ system:'skyfall', type:'pc', bio:{nome:'Teste'} });
if (skyPc.system !== 'skyfall' || skyPc.type !== 'pc' || !skyPc.bio) throw new Error('Normalização Skyfall PC falhou.');
const skyNpc = skyThreat.normalizeSkyfallThreatData({ system:'skyfall', type:'ameaca', nome:'Teste' });
if (skyNpc.system !== 'skyfall' || skyNpc.type !== 'ameaca') throw new Error('Normalização Skyfall ameaça falhou.');
const ordemPc = ordemData.normalizeOrdemPcData({ system:'ordemParanormal', type:'pc', bio:{nome:'Teste'} });
if (ordemPc.system !== 'ordemParanormal' || ordemPc.type !== 'pc' || !ordemPc.pericias) throw new Error('Normalização Ordem PC falhou.');
const ordemNpc = ordemThreat.normalizeOrdemThreatData({ system:'ordemParanormal', type:'ameaca', nome:'Teste' });
if (ordemNpc.system !== 'ordemParanormal' || ordemNpc.type !== 'ameaca' || !ordemNpc.atributos) throw new Error('Normalização Ordem ameaça falhou.');

console.log('✓ Skyfall RPG e Ordem Paranormal: módulos, IDs, guias, normalização e integração presentes.');
