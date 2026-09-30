import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/PJLiteApp.jsx';
let source = await readFile(path, 'utf8');
const must = (condition, message) => { if (!condition) throw new Error(message); };

const characterImport = "import TresDeTCharacterEditor from './systems/3det/components/CharacterEditor.jsx';";
if (!source.includes("TresDeTThreatEditor")) {
  must(source.includes(characterImport), 'Import do CharacterEditor 3DeT não encontrado.');
  source = source.replace(characterImport, `${characterImport}\nimport TresDeTThreatEditor from './systems/3det/components/ThreatEditor.jsx';`);
}

const pcDataImport = "import { initial3DetPcData, normalize3DetPcData } from './systems/3det/data.js';";
if (!source.includes("./systems/3det/threatData.js")) {
  must(source.includes(pcDataImport), 'Import de dados 3DeT não encontrado.');
  source = source.replace(pcDataImport, `${pcDataImport}\nimport { initial3DetThreatData, normalize3DetThreatData } from './systems/3det/threatData.js';`);
}

const pcModelsImport = "import { MODELOS_3DET_PC } from './systems/3det/models.js';";
if (!source.includes("./systems/3det/threatModels.js")) {
  must(source.includes(pcModelsImport), 'Import de modelos 3DeT não encontrado.');
  source = source.replace(pcModelsImport, `${pcModelsImport}\nimport { MODELOS_3DET_NPCS, MODELOS_3DET_CRIATURAS } from './systems/3det/threatModels.js';`);
}

const pcChatImport = "import { generate3DetChatText } from './systems/3det/chat.js';";
if (!source.includes("generate3DetThreatChatText")) {
  must(source.includes(pcChatImport), 'Import de chat 3DeT não encontrado.');
  source = source.replace(pcChatImport, `${pcChatImport}\nimport { generate3DetThreatChatText } from './systems/3det/threatChat.js';`);
}

// Todo caminho que já normalizava PC 3DeT passa também pelo normalizador de ameaça.
if (!source.includes('normalize3DetThreatData(savingData)')) {
  source = source.replace(/^(\s*)(savingData|restored|normalized|templateData|normalizedData) = normalize3DetPcData\(\2\);$/gm, (line, indent, variable) => `${line}\n${indent}${variable} = normalize3DetThreatData(${variable});`);
}

// loadThreat não passa pelo normalizador de PC, então precisa de integração explícita.
const loadThreatOld = `                    normalized = normalizeFabulaThreatData(normalized);\n                    normalized = normalizeSom6PdjData(normalized);\n                    setData(normalized);`;
const loadThreatNew = `                    normalized = normalizeFabulaThreatData(normalized);\n                    normalized = normalizeSom6PdjData(normalized);\n                    normalized = normalize3DetThreatData(normalized);\n                    setData(normalized);`;
if (!source.includes('normalized = normalize3DetThreatData(normalized);\n                    setData(normalized);')) {
  must(source.includes(loadThreatOld), 'Bloco loadThreat não encontrado.');
  source = source.replace(loadThreatOld, loadThreatNew);
}

const chatOld = `            if (sys === '3det' && item.type === 'pc') return generate3DetChatText(item);`;
const chatNew = `${chatOld}\n            if (sys === '3det' && item.type !== 'pc') return generate3DetThreatChatText(item);`;
if (!source.includes("item.type !== 'pc') return generate3DetThreatChatText")) {
  must(source.includes(chatOld), 'Dispatch da Ficha Chat 3DeT não encontrado.');
  source = source.replace(chatOld, chatNew);
}

const editorOld = `                    {/* 3DeT Victory — primeira prévia modular */}\n                    <TresDeTCharacterEditor scope={systemEditorScope} />`;
const editorNew = `                    {/* 3DeT Victory — personagem e ameaças modularizados */}\n                    <TresDeTCharacterEditor scope={systemEditorScope} />\n                    <TresDeTThreatEditor scope={systemEditorScope} />`;
if (!source.includes('<TresDeTThreatEditor scope={systemEditorScope} />')) {
  must(source.includes(editorOld), 'Ponto de render do editor 3DeT não encontrado.');
  source = source.replace(editorOld, editorNew);
}

// Busca também por dados próprios das ameaças 3DeT.
source = source.replace(
  `item.bio?.kit, item.bio?.conceito, item.tormento?.tipo`,
  `item.bio?.kit, item.bio?.conceito, item.conceito, item.categoria, item.papel, item.tormento?.tipo`
);

// Cartões de ameaça na home.
source = source.replace(
  `sys === 'somdas6' ? 'border-red-900' : 'border-gray-500'`,
  `sys === 'somdas6' ? 'border-red-900' : sys === '3det' ? 'border-amber-500' : 'border-gray-500'`
);
source = source.replace(
  `sys === 'somdas6' ? 'bg-red-900' : threat.type === 'pnj' ? 'bg-blue-800' : 'bg-red-900'`,
  `sys === 'somdas6' ? 'bg-red-900' : sys === '3det' ? 'bg-zinc-950' : threat.type === 'pnj' ? 'bg-blue-800' : 'bg-red-900'`
);
source = source.replace(
  `sys === 'somdas6' ? 'O Som das Seis • PDJ' : threat.type === 'pnj' ? 'PNJ (DB)' : 'Monstro (DB)'`,
  `sys === 'somdas6' ? 'O Som das Seis • PDJ' : sys === '3det' ? '3DeT Victory • Ameaça' : threat.type === 'pnj' ? 'PNJ (DB)' : 'Monstro (DB)'`
);
source = source.replace(
  `sys === 'somdas6' ? 'text-red-900' : 'text-gray-900'`,
  `sys === 'somdas6' ? 'text-red-900' : sys === '3det' ? 'text-amber-800' : 'text-gray-900'`
);
source = source.replace(
  `sys === 'somdas6' ? \`NP \${threat.np || 1} • \${threat.tipoPdj || 'Comum'} • \${threat.status?.acoes || 1} ação(ões)\` : threat.type === 'pnj' ?`,
  `sys === 'somdas6' ? \`NP \${threat.np || 1} • \${threat.tipoPdj || 'Comum'} • \${threat.status?.acoes || 1} ação(ões)\` : sys === '3det' ? \`\${threat.categoria || 'Criatura'} • \${threat.papel || 'Comum'} • \${threat.pontos || 0} pts\` : threat.type === 'pnj' ?`
);

source = source.replace(
  `Poder • Habilidade • Resistência • ficha compacta`,
  `{createTarget === 'pc' ? 'Poder • Habilidade • Resistência • ficha compacta' : 'NPCs • criaturas • rivais • chefes'}`
);

const modalStart = `                        {show3DetModelModal && ReactDOM.createPortal(`;
const modalEnd = `                        {showSom6ModelModal && ReactDOM.createPortal(`;
const startIndex = source.indexOf(modalStart);
const endIndex = source.indexOf(modalEnd, startIndex);
must(startIndex >= 0 && endIndex > startIndex, 'Modal 3DeT não encontrado para substituição.');

const modal = `                        {show3DetModelModal && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 transition-opacity">
                                <div className="bg-white rounded-sm shadow-2xl w-full max-w-3xl border-2 border-amber-500 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
                                    <div className="bg-zinc-950 text-white p-3 flex justify-between items-center shrink-0 border-b-4 border-amber-400">
                                        <div><h2 className="font-title font-black text-lg">{createTarget === 'pc' ? 'Criar Personagem em 3DeT Victory' : 'Criar Ameaça / NPC em 3DeT Victory'}</h2><p className="text-[10px] text-amber-300">PJ Lite 0.8 • módulo completo de personagem e mestre</p></div>
                                        <button onClick={() => { setShow3DetModelModal(false); setCreateTarget(null); }} className="text-zinc-300 hover:text-white text-2xl font-bold px-2 leading-none">&times;</button>
                                    </div>
                                    <div className="p-4 sm:p-6 bg-zinc-100 flex-1 overflow-y-auto space-y-5">
                                        {createTarget === 'pc' ? <>
                                            <div onClick={() => loadTemplate(initial3DetPcData)} className="bg-white border-2 border-zinc-300 hover:border-amber-500 rounded p-4 cursor-pointer flex items-center gap-4 transition-all hover:shadow-lg">
                                                <div className="w-14 h-14 bg-zinc-950 text-amber-400 rounded flex items-center justify-center font-black font-title text-lg shadow-inner shrink-0">3D&T</div>
                                                <div><h3 className="font-bold text-sm text-zinc-950">Novo Personagem</h3><p className="text-xs text-zinc-500 mt-1">Ficha em branco com P/H/R, PA/PM/PV, perícias, vantagens, desvantagens, técnicas e inventário.</p></div>
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-end justify-between gap-2 border-b-2 border-amber-200 pb-1 mb-3"><div><h3 className="font-title font-black text-zinc-900">Modelos Prontos • adaptações de fã</h3><p className="text-[10px] text-zinc-500 mt-1">Quatro exemplos jogáveis de 10 pontos para aprender a ficha. Você pode editar tudo depois.</p></div><span className="text-[9px] font-black uppercase tracking-widest rounded-full bg-amber-100 text-amber-900 px-2 py-1">10 pts</span></div>
                                                <div className="grid sm:grid-cols-2 gap-3">{MODELOS_3DET_PC.map((modelo, idx) => <div key={idx} onClick={() => loadTemplate(modelo)} className="bg-white border-2 border-amber-200 hover:border-amber-500 rounded p-3 cursor-pointer hover:shadow-md transition-all"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="font-black text-zinc-950 truncate">{modelo.bio.nome}</div><div className="text-[10px] text-zinc-500 mt-0.5">{modelo.bio.arquetipo} • {modelo.bio.escala}</div></div><span className="shrink-0 rounded bg-zinc-950 text-amber-300 text-[9px] font-black px-2 py-1">{modelo.pontos} pts</span></div><p className="text-[10px] text-zinc-600 mt-2 leading-relaxed line-clamp-3">{modelo.bio.conceito}</p><div className="mt-2 flex flex-wrap gap-1 text-[9px] font-bold text-zinc-600"><span className="rounded bg-zinc-100 px-1.5 py-0.5">P{modelo.atributos.poder}</span><span className="rounded bg-zinc-100 px-1.5 py-0.5">H{modelo.atributos.habilidade}</span><span className="rounded bg-zinc-100 px-1.5 py-0.5">R{modelo.atributos.resistencia}</span></div></div>)}</div>
                                                <p className="text-[9px] text-zinc-500 mt-2">Modelos de fã sem retratos embutidos; todos podem ser alterados livremente.</p>
                                            </div>
                                        </> : <>
                                            <div onClick={() => loadTemplate(initial3DetThreatData)} className="bg-white border-2 border-zinc-300 hover:border-amber-500 rounded p-4 cursor-pointer flex items-center gap-4 transition-all hover:shadow-lg">
                                                <div className="w-14 h-14 bg-zinc-950 text-amber-400 rounded flex items-center justify-center text-2xl shadow-inner shrink-0">👾</div>
                                                <div><h3 className="font-bold text-sm text-zinc-950">Nova Ameaça / NPC</h3><p className="text-xs text-zinc-500 mt-1">Ficha em branco e compacta para aliados, inimigos, monstros, rivais e chefes.</p></div>
                                            </div>
                                            <div><div className="border-b-2 border-amber-200 pb-1 mb-3"><h3 className="font-title font-black text-zinc-900">NPCs rápidos • Compêndio</h3><p className="text-[10px] text-zinc-500 mt-1">Perfis leves inspirados nas faixas do Compêndio de NPCs do Manual Básico.</p></div><div className="grid sm:grid-cols-2 gap-3">{MODELOS_3DET_NPCS.map((modelo, idx) => <div key={idx} onClick={() => loadTemplate(modelo)} className="bg-white border-2 border-zinc-200 hover:border-amber-500 rounded p-3 cursor-pointer hover:shadow-md"><div className="flex justify-between gap-2"><div><div className="font-black text-zinc-950">{modelo.nome}</div><div className="text-[10px] text-zinc-500">{modelo.papel} • {modelo.categoria}</div></div><span className="text-[9px] font-black rounded bg-zinc-950 text-amber-300 px-2 py-1 h-fit">{modelo.pontos} pts</span></div><p className="mt-2 text-[10px] text-zinc-600 line-clamp-2">{modelo.conceito}</p></div>)}</div></div>
                                            <div><div className="border-b-2 border-amber-200 pb-1 mb-3"><h3 className="font-title font-black text-zinc-900">Criaturas prontas para mesa</h3><p className="text-[10px] text-zinc-500 mt-1">Exemplos originais construídos com as mesmas peças de regra do Victory; ajuste livremente para sua campanha.</p></div><div className="grid sm:grid-cols-2 gap-3">{MODELOS_3DET_CRIATURAS.map((modelo, idx) => <div key={idx} onClick={() => loadTemplate(modelo)} className="bg-white border-2 border-amber-200 hover:border-amber-500 rounded p-3 cursor-pointer hover:shadow-md"><div className="flex justify-between gap-2"><div><div className="font-black text-zinc-950">{modelo.nome}</div><div className="text-[10px] text-zinc-500">{modelo.papel} • {modelo.escala}</div></div><span className="text-[9px] font-black rounded bg-amber-100 text-amber-900 px-2 py-1 h-fit">{modelo.pontos} pts</span></div><p className="mt-2 text-[10px] text-zinc-600 line-clamp-2">{modelo.conceito}</p></div>)}</div></div>
                                            <div className="rounded border border-amber-300 bg-amber-50 p-3 text-[10px] leading-relaxed text-amber-950"><strong>Modo Mestre:</strong> a pontuação funciona como referência de poder; a ficha permite ajustar recursos e capacidades sem obrigar o NPC a seguir a criação de personagem ao pé da letra.</div>
                                        </>}
                                    </div>
                                </div>
                            </div>, document.body
                        )}

`;
source = source.slice(0, startIndex) + modal + source.slice(endIndex);

await writeFile(path, source, 'utf8');
console.log('PJLiteApp.jsx integrado com Ameaças/NPCs de 3DeT Victory.');
