import { readFile, writeFile } from 'node:fs/promises';
const path='src/PJLiteApp.jsx';
let s=await readFile(path,'utf8');
if(s.includes('PJ LITE 0.9 FINAL SYSTEMS')){console.log('Final systems patch: already applied.');process.exit(0);}
const rep=(from,to,label)=>{if(!s.includes(from))throw new Error(`Final systems patch: marker not found: ${label}`);s=s.replace(from,to);};

rep("import { generate3DetThreatChatText } from './systems/3det/threatChat.js';",`import { generate3DetThreatChatText } from './systems/3det/threatChat.js';
// PJ LITE 0.9 FINAL SYSTEMS — Skyfall RPG + Ordem Paranormal RPG
import SkyfallCharacterEditor from './systems/skyfall/components/CharacterEditor.jsx';
import SkyfallThreatEditor from './systems/skyfall/components/ThreatEditor.jsx';
import { initialSkyfallPcData, normalizeSkyfallPcData } from './systems/skyfall/data.js';
import { initialSkyfallThreatData, normalizeSkyfallThreatData } from './systems/skyfall/threatData.js';
import { MODELOS_SKYFALL_PC } from './systems/skyfall/models.js';
import { MODELOS_SKYFALL_AMEACAS } from './systems/skyfall/threatModels.js';
import { generateSkyfallChatText, generateSkyfallThreatChatText } from './systems/skyfall/chat.js';
import './systems/skyfall/skyfall-theme.css';
import OrdemCharacterEditor from './systems/ordemParanormal/components/CharacterEditor.jsx';
import OrdemThreatEditor from './systems/ordemParanormal/components/ThreatEditor.jsx';
import { initialOrdemPcData, normalizeOrdemPcData } from './systems/ordemParanormal/data.js';
import { initialOrdemThreatData, normalizeOrdemThreatData } from './systems/ordemParanormal/threatData.js';
import { MODELOS_ORDEM_PC } from './systems/ordemParanormal/models.js';
import { MODELOS_ORDEM_AMEACAS } from './systems/ordemParanormal/threatModels.js';
import { generateOrdemChatText, generateOrdemThreatChatText } from './systems/ordemParanormal/chat.js';
import './systems/ordemParanormal/ordem-theme.css';`, 'imports');

rep("const UPDATE_LOG = [",`const UPDATE_LOG = [
            { versao: '0.9.0v Alpha', descricao: 'Skyfall RPG (Livro Básico 1.25) e Ordem Paranormal RPG (Livro de Regras v1.3) entram no PJ Lite com personagens, ameaças, modelos prontos, temas, guias e Ficha Chat; revisão final antes da publicação definitiva.' },`, 'update log');

rep("const [show3DetModelModal, setShow3DetModelModal] = useState(false);",`const [show3DetModelModal, setShow3DetModelModal] = useState(false);
            const [showSkyfallModelModal, setShowSkyfallModelModal] = useState(false);
            const [showOrdemModelModal, setShowOrdemModelModal] = useState(false);`, 'modal states');

if (s.includes("theme === 'som6' ? 'theme-som6' : theme === 'rotazero' ? 'theme-rotazero' : theme === 'dark' ? 'theme-dark'")) {
  s=s.replace("theme === 'som6' ? 'theme-som6' : theme === 'rotazero' ? 'theme-rotazero' : theme === 'dark' ? 'theme-dark'", "theme === 'som6' ? 'theme-som6' : theme === 'skyfall' ? 'theme-skyfall' : theme === 'ordem' ? 'theme-ordem' : theme === 'rotazero' ? 'theme-rotazero' : theme === 'dark' ? 'theme-dark'");
} else {
  rep("theme === 'som6' ? 'theme-som6' : theme === 'dark' ? 'theme-dark'", "theme === 'som6' ? 'theme-som6' : theme === 'skyfall' ? 'theme-skyfall' : theme === 'ordem' ? 'theme-ordem' : theme === 'dark' ? 'theme-dark'", 'theme body');
}
if (!s.includes('<option value="skyfall">Tema: Skyfall RPG</option>')) {
  const som6Theme = '<option value="som6">Tema: O Som das Seis</option>';
  if (!s.includes(som6Theme)) throw new Error('Final systems patch: marker not found: theme options');
  s=s.replace(som6Theme, som6Theme + '\n                                        <option value="skyfall">Tema: Skyfall RPG</option>\n                                        <option value="ordem">Tema: Ordem Paranormal</option>');
}

for (const [oldv,newv,label] of [
 ["savingData = normalize3DetThreatData(savingData);",`savingData = normalize3DetThreatData(savingData);
                    savingData = normalizeSkyfallPcData(savingData);
                    savingData = normalizeSkyfallThreatData(savingData);
                    savingData = normalizeOrdemPcData(savingData);
                    savingData = normalizeOrdemThreatData(savingData);`,'save'],
 ["restored = normalize3DetThreatData(restored);",`restored = normalize3DetThreatData(restored);
                restored = normalizeSkyfallPcData(restored);
                restored = normalizeSkyfallThreatData(restored);
                restored = normalizeOrdemPcData(restored);
                restored = normalizeOrdemThreatData(restored);`,'history'],
 ["normalizedData = normalize3DetThreatData(normalizedData);",`normalizedData = normalize3DetThreatData(normalizedData);
                normalizedData = normalizeSkyfallPcData(normalizedData);
                normalizedData = normalizeSkyfallThreatData(normalizedData);
                normalizedData = normalizeOrdemPcData(normalizedData);
                normalizedData = normalizeOrdemThreatData(normalizedData);`,'import'],
 ["templateData = normalize3DetThreatData(templateData);",`templateData = normalize3DetThreatData(templateData);
                templateData = normalizeSkyfallPcData(templateData);
                templateData = normalizeSkyfallThreatData(templateData);
                templateData = normalizeOrdemPcData(templateData);
                templateData = normalizeOrdemThreatData(templateData);`,'template']]) rep(oldv,newv,label);

if (s.includes(`normalized = normalize3DetThreatData(normalized);\n                    normalized = normalizeRotaZeroPcData(normalized);\n                    setData(normalized);`)) {
  s=s.replace(`normalized = normalize3DetThreatData(normalized);\n                    normalized = normalizeRotaZeroPcData(normalized);\n                    setData(normalized);`, `normalized = normalize3DetThreatData(normalized);
                    normalized = normalizeSkyfallPcData(normalized);
                    normalized = normalizeSkyfallThreatData(normalized);
                    normalized = normalizeOrdemPcData(normalized);
                    normalized = normalizeOrdemThreatData(normalized);
                    normalized = normalizeRotaZeroPcData(normalized);
                    setData(normalized);`);
} else {
  rep(`normalized = normalize3DetThreatData(normalized);\n                    setData(normalized);`, `normalized = normalize3DetThreatData(normalized);
                    normalized = normalizeSkyfallPcData(normalized);
                    normalized = normalizeSkyfallThreatData(normalized);
                    normalized = normalizeOrdemPcData(normalized);
                    normalized = normalizeOrdemThreatData(normalized);
                    setData(normalized);`, 'load character');
}

rep(`normalized = normalizeSom6PdjData(normalized);\n                    setData(normalized);`, `normalized = normalizeSom6PdjData(normalized);\n                    normalized = normalize3DetThreatData(normalized);\n                    normalized = normalizeSkyfallThreatData(normalized);\n                    normalized = normalizeOrdemThreatData(normalized);\n                    setData(normalized);`, 'load threat');

rep(`if (sys === '3det') return item.type === 'pc' ? generate3DetChatText(item) : generate3DetThreatChatText(item);`, `if (sys === '3det') return item.type === 'pc' ? generate3DetChatText(item) : generate3DetThreatChatText(item);\n                if (sys === 'skyfall') return item.type === 'pc' ? generateSkyfallChatText(item) : generateSkyfallThreatChatText(item);\n                if (sys === 'ordem') return item.type === 'pc' ? generateOrdemChatText(item) : generateOrdemThreatChatText(item);`, 'chat routing');

rep(`<option value="3det">3DeT Victory</option>`, `<option value="3det">3DeT Victory</option><option value="skyfall">Skyfall RPG</option><option value="ordem">Ordem Paranormal</option>`, 'filters');

rep(`                                        <div onClick={() => { setShowSystemModal(false); setShowSom6ModelModal(true); }}`, `                                        <div onClick={() => { setShowSystemModal(false); setShowSkyfallModelModal(true); }} className="bg-white border-2 border-gray-300 hover:border-violet-700 rounded p-3 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 group min-h-[82px]">
                                            <div className="w-12 h-12 bg-violet-950 text-violet-100 rounded flex items-center justify-center font-black font-title text-sm">SKY</div>
                                            <div className="flex-1"><div className="flex items-center gap-2"><h3 className="font-title font-bold text-gray-900 group-hover:text-violet-800 text-lg">Skyfall RPG</h3><span className="bg-violet-100 text-violet-900 text-[9px] font-bold uppercase px-2 py-0.5 rounded">1.25</span></div><p className="text-xs text-gray-500">{createTarget === 'pc' ? 'Legado • Herança • Maldição • Catarse' : 'Ameaças • criaturas • antagonistas'}</p></div>
                                        </div>

                                        <div onClick={() => { setShowSystemModal(false); setShowOrdemModelModal(true); }} className="bg-white border-2 border-gray-300 hover:border-red-800 rounded p-3 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 group min-h-[82px]">
                                            <div className="w-12 h-12 bg-black text-red-500 rounded flex items-center justify-center font-black font-title text-sm">OP</div>
                                            <div className="flex-1"><div className="flex items-center gap-2"><h3 className="font-title font-bold text-gray-900 group-hover:text-red-900 text-lg">Ordem Paranormal RPG</h3><span className="bg-red-100 text-red-900 text-[9px] font-bold uppercase px-2 py-0.5 rounded">v1.3</span></div><p className="text-xs text-gray-500">{createTarget === 'pc' ? 'Agente • NEX • Classe • Trilha • Sanidade' : 'Ameaças • criaturas • cultistas'}</p></div>
                                        </div>

                                        <div onClick={() => { setShowSystemModal(false); setShowSom6ModelModal(true); }}`, 'system cards');

const skyfallModal = `
                        {showSkyfallModelModal && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"><div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-violet-800 rounded shadow-2xl"><div className="bg-violet-950 text-white p-3 flex justify-between items-center"><div><h2 className="font-title font-bold text-lg">Criar em Skyfall RPG</h2><p className="text-[10px] text-violet-200">Livro Básico 1.25 • adaptação Lite</p></div><button onClick={()=>{setShowSkyfallModelModal(false);setCreateTarget(null);}} className="text-2xl">×</button></div><div className="p-4 sm:p-6 bg-violet-50 overflow-y-auto space-y-5">{createTarget==='pc'?<><div onClick={()=>loadTemplate(initialSkyfallPcData)} className="bg-white border-2 border-violet-200 hover:border-violet-700 rounded p-4 cursor-pointer"><strong>Novo Personagem</strong><p className="text-xs text-gray-500 mt-1">Ficha em branco com Legado, Herança, Maldição, Classe/Trilha, Catarse, Ênfase, Sombra e recursos.</p></div><div><h3 className="font-title font-bold text-violet-950 mb-2">Modelos prontos</h3><div className="grid sm:grid-cols-2 gap-3">{MODELOS_SKYFALL_PC.map((m,i)=><div key={i} onClick={()=>loadTemplate(m)} className="bg-white border border-violet-200 rounded p-3 cursor-pointer hover:border-violet-700"><strong>{m.bio.nome}</strong><div className="text-[10px] text-gray-500">{m.bio.legado} • {m.bio.classe}</div></div>)}</div></div></>:<><div onClick={()=>loadTemplate(initialSkyfallThreatData)} className="bg-white border-2 border-violet-200 hover:border-violet-700 rounded p-4 cursor-pointer"><strong>Nova Ameaça</strong><p className="text-xs text-gray-500 mt-1">Bloco compacto para criaturas, rivais e antagonistas.</p></div><div className="grid sm:grid-cols-2 gap-3">{MODELOS_SKYFALL_AMEACAS.map((m,i)=><div key={i} onClick={()=>loadTemplate(m)} className="bg-white border border-violet-200 rounded p-3 cursor-pointer"><strong>{m.nome}</strong><div className="text-[10px] text-gray-500">ND {m.nd} • {m.tipo}</div></div>)}</div></>}</div></div></div>, document.body)}

                        {showOrdemModelModal && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4"><div className="bg-[#120d0e] text-gray-100 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-red-900 rounded shadow-2xl"><div className="bg-black text-white p-3 flex justify-between items-center border-b border-red-900"><div><h2 className="font-title font-bold text-lg">Criar em Ordem Paranormal RPG</h2><p className="text-[10px] text-red-300">Livro de Regras v1.3 • dez/2024</p></div><button onClick={()=>{setShowOrdemModelModal(false);setCreateTarget(null);}} className="text-2xl">×</button></div><div className="p-4 sm:p-6 overflow-y-auto space-y-5">{createTarget==='pc'?<><div onClick={()=>loadTemplate(initialOrdemPcData)} className="bg-zinc-950 border-2 border-red-950 hover:border-red-600 rounded p-4 cursor-pointer"><strong>Novo Agente</strong><p className="text-xs text-gray-400 mt-1">Ficha em branco com NEX, Origem, Classe/Trilha, atributos, PV/PE/SAN, perícias, poderes e rituais.</p></div><div><h3 className="font-title font-bold text-red-200 mb-2">Modelos prontos</h3><div className="grid sm:grid-cols-2 gap-3">{MODELOS_ORDEM_PC.map((m,i)=><div key={i} onClick={()=>loadTemplate(m)} className="bg-zinc-950 border border-red-950 rounded p-3 cursor-pointer hover:border-red-600"><strong>{m.bio.nome}</strong><div className="text-[10px] text-gray-400">NEX {m.nex}% • {m.bio.classe}</div></div>)}</div></div></>:<><div onClick={()=>loadTemplate(initialOrdemThreatData)} className="bg-zinc-950 border-2 border-red-950 hover:border-red-600 rounded p-4 cursor-pointer"><strong>Nova Ameaça</strong><p className="text-xs text-gray-400 mt-1">Bloco compacto para criaturas, cultistas e outras ameaças.</p></div><div className="grid sm:grid-cols-2 gap-3">{MODELOS_ORDEM_AMEACAS.map((m,i)=><div key={i} onClick={()=>loadTemplate(m)} className="bg-zinc-950 border border-red-950 rounded p-3 cursor-pointer"><strong>{m.nome}</strong><div className="text-[10px] text-gray-400">VD {m.vd} • {m.tipo}</div></div>)}</div></>}</div></div></div>, document.body)}
`;
rep(`                        {showSom6ModelModal && ReactDOM.createPortal(`, `${skyfallModal}\n                        {showSom6ModelModal && ReactDOM.createPortal(`, 'system modals');

rep(`const is3Det = data.system === '3det';`, `const is3Det = data.system === '3det';\n            const isSkyfall = data.system === 'skyfall';\n            const isOrdem = data.system === 'ordem';`, 'editor flags');
rep(`const topBarColor = isDnd ? 'bg-[#922610]' : isFabula ? 'bg-teal-800' : isSom6 ? 'bg-red-950' : is3Det ? 'bg-zinc-950'`, `const topBarColor = isDnd ? 'bg-[#922610]' : isFabula ? 'bg-teal-800' : isSom6 ? 'bg-red-950' : is3Det ? 'bg-zinc-950' : isSkyfall ? 'bg-violet-950' : isOrdem ? 'bg-black'`, 'topbar');
rep(`{/* 3DeT Victory — personagem e ameaças modularizados */}\n                    <TresDeTCharacterEditor scope={systemEditorScope} />\n                    <TresDeTThreatEditor scope={systemEditorScope} />`, `{/* 3DeT Victory — personagem e ameaças modularizados */}\n                    <TresDeTCharacterEditor scope={systemEditorScope} />\n                    <TresDeTThreatEditor scope={systemEditorScope} />\n                    <SkyfallCharacterEditor scope={systemEditorScope} />\n                    <SkyfallThreatEditor scope={systemEditorScope} />\n                    <OrdemCharacterEditor scope={systemEditorScope} />\n                    <OrdemThreatEditor scope={systemEditorScope} />`, 'editors');
if (s.includes(`!['dragonbane','dnd5e','fabula','somdas6','3det','rotaZero'].includes`)) {
  s=s.replace(`!['dragonbane','dnd5e','fabula','somdas6','3det','rotaZero'].includes`, `!['dragonbane','dnd5e','fabula','somdas6','3det','skyfall','ordem','rotaZero'].includes`);
} else {
  rep(`!['dragonbane','dnd5e','fabula','somdas6','3det'].includes`, `!['dragonbane','dnd5e','fabula','somdas6','3det','skyfall','ordem'].includes`, 'known systems');
}

await writeFile(path,s,'utf8');
console.log('✓ Final systems patch applied: Skyfall RPG + Ordem Paranormal RPG.');
