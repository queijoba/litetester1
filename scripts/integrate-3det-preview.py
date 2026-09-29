from pathlib import Path


def once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: esperado 1 trecho, encontrado {count}")
    return text.replace(old, new, 1)


# Corrige o editor modular do 3DeT para manter a ordem de hooks estável.
editor_path = Path("src/systems/3det/components/CharacterEditor.jsx")
editor = editor_path.read_text(encoding="utf-8")
editor = once(
    editor,
    "const { useEffect, useMemo, useState } = React;",
    "const { useEffect, useState } = React;",
    "hooks do editor 3DeT",
)
editor = once(
    editor,
    """  const rarityTotals = useMemo(() => {
    const totals = { Comum: 0, Incomum: 0, Raro: 0 };
    (data.inventario || []).forEach((item) => {
      const rarity = TRESDET_RARITIES.includes(item?.raridade) ? item.raridade : 'Comum';
      totals[rarity] += Math.max(0, Number(item?.quantidade || 0));
    });
    return totals;
  }, [data.inventario]);""",
    """  const rarityTotals = { Comum: 0, Incomum: 0, Raro: 0 };
  (data.inventario || []).forEach((item) => {
    const rarity = TRESDET_RARITIES.includes(item?.raridade) ? item.raridade : 'Comum';
    rarityTotals[rarity] += Math.max(0, Number(item?.quantidade || 0));
  });""",
    "resumo de raridade do 3DeT",
)
editor_path.write_text(editor, encoding="utf-8")


# Impede o editor Dragonbane de aparecer por baixo do novo sistema.
db_path = Path("src/systems/dragonbane/components/Editor.jsx")
db = db_path.read_text(encoding="utf-8")
db = once(
    db,
    "    isFabulaExtraUnlocked,\n    isSom6,",
    "    isFabulaExtraUnlocked,\n    is3Det,\n    isSom6,",
    "flag 3DeT no editor Dragonbane",
)
db = once(
    db,
    "      {!isDnd && !isFabula && !isSom6 && (",
    "      {!isDnd && !isFabula && !isSom6 && !is3Det && (",
    "guarda de render do Dragonbane",
)
db_path.write_text(db, encoding="utf-8")


app_path = Path("src/PJLiteApp.jsx")
s = app_path.read_text(encoding="utf-8")

# Imports do módulo.
s = once(
    s,
    "import Som6ThreatEditor from './systems/somDasSeis/components/ThreatEditor.jsx';\nimport DragonbaneEditor from './systems/dragonbane/components/Editor.jsx';",
    "import Som6ThreatEditor from './systems/somDasSeis/components/ThreatEditor.jsx';\nimport TresDeTCharacterEditor from './systems/3det/components/CharacterEditor.jsx';\nimport { initial3DetPcData, normalize3DetPcData } from './systems/3det/data.js';\nimport { generate3DetChatText } from './systems/3det/chat.js';\nimport DragonbaneEditor from './systems/dragonbane/components/Editor.jsx';",
    "imports 3DeT",
)

# Changelog da prévia.
s = once(
    s,
    "        const UPDATE_LOG = [\n            { versao: '0.7.4v Alpha'",
    "        const UPDATE_LOG = [\n            { versao: '0.8.0v Alpha', descricao: '3DeT Victory entra na prévia do PJ Lite com ficha digital modular, retrato opcional, P/H/R, PA/PM/PV, perícias, FA/FD, vantagens, desvantagens, técnicas, inventário por raridade, Kit opcional, Ficha Chat e integração com saves/importação.' },\n            { versao: '0.7.4v Alpha'",
    "changelog 0.8",
)

# Estado do modal de criação.
s = once(
    s,
    "            const [showSom6ModelModal, setShowSom6ModelModal] = useState(false);\n            const [dndPcTab, setDndPcTab] = useState('caracteristicas');",
    "            const [showSom6ModelModal, setShowSom6ModelModal] = useState(false);\n            const [show3DetModelModal, setShow3DetModelModal] = useState(false);\n            const [dndPcTab, setDndPcTab] = useState('caracteristicas');",
    "estado modal 3DeT",
)

# Ficha Chat.
s = once(
    s,
    "            let text = '';\n\n            // ==========================================================\n            // O SOM DAS SEIS",
    "            let text = '';\n\n            if (sys === '3det' && item.type === 'pc') return generate3DetChatText(item);\n\n            // ==========================================================\n            // O SOM DAS SEIS",
    "delegação do chat 3DeT",
)

# Normalização em todos os fluxos de persistência/importação.
for old, new, label in [
    (
        "                    savingData = normalizeSom6PcData(savingData);\n                    savingData = normalizeSom6PdjData(savingData);",
        "                    savingData = normalizeSom6PcData(savingData);\n                    savingData = normalizeSom6PdjData(savingData);\n                    savingData = normalize3DetPcData(savingData);",
        "normalização ao salvar",
    ),
    (
        "                restored = normalizeSom6PcData(restored);\n                restored = normalizeSom6PdjData(restored);",
        "                restored = normalizeSom6PcData(restored);\n                restored = normalizeSom6PdjData(restored);\n                restored = normalize3DetPcData(restored);",
        "normalização do histórico",
    ),
    (
        "                    normalized = normalizeSom6PcData(normalized);\n                    normalized = normalizeSom6PdjData(normalized);\n                    setData(normalized);",
        "                    normalized = normalizeSom6PcData(normalized);\n                    normalized = normalizeSom6PdjData(normalized);\n                    normalized = normalize3DetPcData(normalized);\n                    setData(normalized);",
        "normalização ao abrir personagem",
    ),
    (
        "                templateData = normalizeSom6PcData(templateData);\n                templateData = normalizeSom6PdjData(templateData);\n                templateData.id = Date.now().toString();",
        "                templateData = normalizeSom6PcData(templateData);\n                templateData = normalizeSom6PdjData(templateData);\n                templateData = normalize3DetPcData(templateData);\n                templateData.id = Date.now().toString();",
        "normalização de modelo",
    ),
    (
        "                normalizedData = normalizeSom6PcData(normalizedData);\n                normalizedData = normalizeSom6PdjData(normalizedData);\n                return normalizedData;",
        "                normalizedData = normalizeSom6PcData(normalizedData);\n                normalizedData = normalizeSom6PdjData(normalizedData);\n                normalizedData = normalize3DetPcData(normalizedData);\n                return normalizedData;",
        "normalização de importação",
    ),
]:
    s = once(s, old, new, label)

s = once(
    s,
    "                setShowSom6ModelModal(false);\n                setCreateTarget(null);",
    "                setShowSom6ModelModal(false);\n                setShow3DetModelModal(false);\n                setCreateTarget(null);",
    "fechamento do modal 3DeT",
)

s = once(
    s,
    "if (!silent) showToast(savingData.system === 'fabula' ? 'Personagem Fabula salvo!' : savingData.system === 'somdas6' ? 'Personagem de O Som das Seis salvo!' : 'Personagem salvo!');",
    "if (!silent) showToast(savingData.system === 'fabula' ? 'Personagem Fabula salvo!' : savingData.system === 'somdas6' ? 'Personagem de O Som das Seis salvo!' : savingData.system === '3det' ? 'Personagem 3DeT Victory salvo!' : 'Personagem salvo!');",
    "toast de salvamento",
)

s = once(s, "version: '0.7.4v Alpha', schemaVersion:", "version: '0.8.0v Alpha', schemaVersion:", "versão do backup")

# Busca, filtro e validação.
s = once(
    s,
    "item.bio?.identidade, item.bio?.apelido, item.tormento?.tipo",
    "item.bio?.identidade, item.bio?.apelido, item.bio?.arquetipo, item.bio?.kit, item.bio?.conceito, item.tormento?.tipo",
    "busca 3DeT",
)
s = once(
    s,
    "                    if (item.system === 'somdas6' && Number(item.status?.pvMax || 0) <= 0) warnings.push('Defina os PV máximos.');\n                    if ((item.system || 'dragonbane') === 'dragonbane'",
    "                    if (item.system === 'somdas6' && Number(item.status?.pvMax || 0) <= 0) warnings.push('Defina os PV máximos.');\n                    if (item.system === '3det' && Number(item.status?.pv?.max || 0) <= 0) warnings.push('Defina os PV máximos.');\n                    if ((item.system || 'dragonbane') === 'dragonbane'",
    "validação de PV 3DeT",
)
s = once(
    s,
    '<option value="all">Todos os sistemas</option><option value="dragonbane">Dragonbane</option><option value="dnd5e">D&D 5.5e</option><option value="fabula">Fabula Ultima</option><option value="somdas6">O Som das Seis</option>',
    '<option value="all">Todos os sistemas</option><option value="dragonbane">Dragonbane</option><option value="dnd5e">D&D 5.5e</option><option value="fabula">Fabula Ultima</option><option value="somdas6">O Som das Seis</option><option value="3det">3DeT Victory</option>',
    "filtro por sistema",
)

# Cartões da home.
s = once(
    s,
    "                                        const isSom6 = char.system === 'somdas6';\n                                        return (",
    "                                        const isSom6 = char.system === 'somdas6';\n                                        const is3Det = char.system === '3det';\n                                        return (",
    "flag 3DeT nos cartões",
)
s = once(s, "${isDnd ? 'border-[#922610]' : isFabula ? 'border-teal-700' : isSom6 ? 'border-red-900' : 'border-dragon-dark'}", "${isDnd ? 'border-[#922610]' : isFabula ? 'border-teal-700' : isSom6 ? 'border-red-900' : is3Det ? 'border-amber-500' : 'border-dragon-dark'}", "borda do cartão")
s = once(s, "${isDnd ? 'bg-[#922610]' : isFabula ? 'bg-teal-700' : isSom6 ? 'bg-red-900' : 'bg-dragon-dark'}", "${isDnd ? 'bg-[#922610]' : isFabula ? 'bg-teal-700' : isSom6 ? 'bg-red-900' : is3Det ? 'bg-zinc-950' : 'bg-dragon-dark'}", "selo do cartão")
s = once(s, "{isDnd ? 'D&D 5.5e' : isFabula ? 'Fabula Ultima' : isSom6 ? 'O Som das Seis' : 'Dragonbane'}", "{isDnd ? 'D&D 5.5e' : isFabula ? 'Fabula Ultima' : isSom6 ? 'O Som das Seis' : is3Det ? '3DeT Victory' : 'Dragonbane'}", "nome do sistema no cartão")
s = once(s, "${isDnd ? 'text-[#922610]' : isFabula ? 'text-teal-800' : isSom6 ? 'text-red-900' : 'text-red-900'}", "${isDnd ? 'text-[#922610]' : isFabula ? 'text-teal-800' : isSom6 ? 'text-red-900' : is3Det ? 'text-amber-700' : 'text-red-900'}", "cor do nome")
s = once(
    s,
    "{isDnd ? `${char.bio?.linhagem || '?'} • ${char.bio?.classe || '?'}` : isFabula ? `${char.bio?.identidade || 'Sem identidade'} • ${char.bio?.tema || 'Sem tema'}` : isSom6 ? `${char.bio?.apelido || 'Sem apelido'} • ${char.tormento?.tipo || 'Sem tormento'}` : `${char.bio?.ancestralidade || '?'} • ${char.bio?.profissao || '?'}`}",
    "{isDnd ? `${char.bio?.linhagem || '?'} • ${char.bio?.classe || '?'}` : isFabula ? `${char.bio?.identidade || 'Sem identidade'} • ${char.bio?.tema || 'Sem tema'}` : isSom6 ? `${char.bio?.apelido || 'Sem apelido'} • ${char.tormento?.tipo || 'Sem tormento'}` : is3Det ? `${char.bio?.arquetipo || 'Sem arquétipo'}${char.bio?.kit ? ` • ${char.bio.kit}` : char.bio?.conceito ? ` • ${char.bio.conceito}` : ''}` : `${char.bio?.ancestralidade || '?'} • ${char.bio?.profissao || '?'}`}",
    "subtítulo do cartão",
)
s = once(
    s,
    '<p className="text-[10px] text-gray-500 mt-2 truncate italic">Nível {isFabula ? (char.nivel || 5) : isSom6 ? (char.nivel || 1) : (char.bio?.nivel || 1)}</p>',
    '<p className="text-[10px] text-gray-500 mt-2 truncate italic">{is3Det ? `Pontos ${char.pontos ?? 0} • XP ${char.xp ?? 0}` : `Nível ${isFabula ? (char.nivel || 5) : isSom6 ? (char.nivel || 1) : (char.bio?.nivel || 1)}`}</p>',
    "linha de pontos do cartão",
)

# Opção no seletor de sistemas — personagem apenas nesta primeira prévia.
s = once(
    s,
    """                                        <div onClick={() => { setShowSystemModal(false); setShowSom6ModelModal(true); }} className=\"bg-white border-2 border-gray-300 hover:border-red-900 rounded p-4 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group\">""",
    """                                        {createTarget === 'pc' && (
                                            <div onClick={() => { setShowSystemModal(false); setShow3DetModelModal(true); }} className=\"bg-white border-2 border-gray-300 hover:border-amber-500 rounded p-4 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group\">
                                                <div className=\"w-14 h-14 bg-zinc-950 group-hover:bg-amber-400 text-amber-400 group-hover:text-zinc-950 rounded flex items-center justify-center font-black font-title text-lg shadow-inner transition-colors\">3D&T</div>
                                                <div className=\"flex-1\">
                                                    <div className=\"flex items-center gap-2\"><h3 className=\"font-title font-bold text-gray-900 group-hover:text-amber-700 text-lg transition-colors\">3DeT Victory</h3><span className=\"bg-amber-100 text-amber-900 text-[9px] font-bold uppercase px-2 py-0.5 rounded\">Prévia 0.8</span></div>
                                                    <p className=\"text-xs text-gray-500\">Poder • Habilidade • Resistência • ficha compacta</p>
                                                </div>
                                            </div>
                                        )}

                                        <div onClick={() => { setShowSystemModal(false); setShowSom6ModelModal(true); }} className=\"bg-white border-2 border-gray-300 hover:border-red-900 rounded p-4 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group\">""",
    "cartão do seletor",
)

# Modal de criação 3DeT.
s = once(
    s,
    """                        {showSom6ModelModal && ReactDOM.createPortal(""",
    """                        {show3DetModelModal && ReactDOM.createPortal(
                            <div className=\"fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 transition-opacity\">
                                <div className=\"bg-white rounded-sm shadow-2xl w-full max-w-2xl border-2 border-amber-500 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up\">
                                    <div className=\"bg-zinc-950 text-white p-3 flex justify-between items-center shrink-0 border-b-4 border-amber-400\">
                                        <div><h2 className=\"font-title font-black text-lg\">Criar em 3DeT Victory</h2><p className=\"text-[10px] text-amber-300\">Primeira prévia modular no PJ Lite</p></div>
                                        <button onClick={() => { setShow3DetModelModal(false); setCreateTarget(null); }} className=\"text-zinc-300 hover:text-white text-2xl font-bold px-2 leading-none\">&times;</button>
                                    </div>
                                    <div className=\"p-6 bg-zinc-100 flex-1 overflow-y-auto space-y-4\">
                                        <div onClick={() => loadTemplate(initial3DetPcData)} className=\"bg-white border-2 border-zinc-300 hover:border-amber-500 rounded p-4 cursor-pointer flex items-center gap-4 transition-all hover:shadow-lg\">
                                            <div className=\"w-14 h-14 bg-zinc-950 text-amber-400 rounded flex items-center justify-center font-black font-title text-lg shadow-inner shrink-0\">3D&T</div>
                                            <div><h3 className=\"font-bold text-sm text-zinc-950\">Novo Personagem</h3><p className=\"text-xs text-zinc-500 mt-1\">Ficha em branco com P/H/R, PA/PM/PV, perícias, vantagens, desvantagens, técnicas e inventário.</p></div>
                                        </div>
                                        <div className=\"rounded border border-amber-300 bg-amber-50 p-3 text-[10px] leading-relaxed text-amber-950\"><strong>Primeira prévia:</strong> retrato e Kit são opcionais. Os campos de FA/FD ficam livres para registrar a referência usada pela mesa, sem forçar automações de regra.</div>
                                    </div>
                                </div>
                            </div>, document.body
                        )}

                        {showSom6ModelModal && ReactDOM.createPortal(""",
    "modal de criação 3DeT",
)

# Estado do editor e escopo modular.
s = once(
    s,
    "            const isSom6 = data.system === 'somdas6';\n            const topBarColor = isDnd ? 'bg-[#922610]' : isFabula ? 'bg-teal-800' : isSom6 ? 'bg-red-950' :",
    "            const isSom6 = data.system === 'somdas6';\n            const is3Det = data.system === '3det';\n            const topBarColor = isDnd ? 'bg-[#922610]' : isFabula ? 'bg-teal-800' : isSom6 ? 'bg-red-950' : is3Det ? 'bg-zinc-950' :",
    "flag 3DeT no editor principal",
)
s = once(
    s,
    "                isFabulaExtraUnlocked,\n                isSom6,",
    "                isFabulaExtraUnlocked,\n                is3Det,\n                isSom6,",
    "flag 3DeT no escopo",
)
s = once(s, "${(!isDnd && !isFabula && !isSom6 && data.type === 'pc') ? 'max-w-[90rem]' : 'max-w-6xl'}", "${(!isDnd && !isFabula && !isSom6 && !is3Det && data.type === 'pc') ? 'max-w-[90rem]' : 'max-w-6xl'}", "largura do editor")
s = once(s, "${isDnd ? 'border-[#922610]' : isFabula ? 'border-teal-700' : isSom6 ? 'border-red-900' : 'border-gray-500'}", "${isDnd ? 'border-[#922610]' : isFabula ? 'border-teal-700' : isSom6 ? 'border-red-900' : is3Det ? 'border-amber-500' : 'border-gray-500'}", "borda do editor")
s = once(s, "style={(isDnd || isFabula || isSom6) ? {} : getBarStyle()}", "style={(isDnd || isFabula || isSom6 || is3Det) ? {} : getBarStyle()}", "tema da barra do editor")
s = once(
    s,
    "{isDnd ? (data.type === 'pc' ? 'D&D 5.5e / 2024 - Personagem' : 'D&D 5.5e / 2024 - Bestiário') : isFabula ? (data.type === 'pc' ? 'FABULA ULTIMA • PERSONAGEM • INTEGRADO' : 'FABULA ULTIMA • AMEAÇA / PNJ • INTEGRADO') : isSom6 ? (data.type === 'pc' ? 'O SOM DAS SEIS • PERSONAGEM • INTEGRADO' : 'O SOM DAS SEIS • PDJ • INTEGRADO') : (data.type === 'pc' ? 'DRAGONBANE' : data.type === 'pnj' ? 'PNJ (DB)' : 'AMEAÇA (DB)')}",
    "{isDnd ? (data.type === 'pc' ? 'D&D 5.5e / 2024 - Personagem' : 'D&D 5.5e / 2024 - Bestiário') : isFabula ? (data.type === 'pc' ? 'FABULA ULTIMA • PERSONAGEM • INTEGRADO' : 'FABULA ULTIMA • AMEAÇA / PNJ • INTEGRADO') : isSom6 ? (data.type === 'pc' ? 'O SOM DAS SEIS • PERSONAGEM • INTEGRADO' : 'O SOM DAS SEIS • PDJ • INTEGRADO') : is3Det ? '3DeT VICTORY • PERSONAGEM • PRÉVIA' : (data.type === 'pc' ? 'DRAGONBANE' : data.type === 'pnj' ? 'PNJ (DB)' : 'AMEAÇA (DB)')}",
    "título do editor 3DeT",
)

# Render modular e formato reconhecido.
s = once(
    s,
    """                    {/* Editor Dragonbane (Intacto) */}
                    {!['dragonbane','dnd5e','fabula','somdas6'].includes(data.system || 'dragonbane') && (""",
    """                    {/* 3DeT Victory — primeira prévia modular */}
                    <TresDeTCharacterEditor scope={systemEditorScope} />

                    {/* Editor Dragonbane (Intacto) */}
                    {!['dragonbane','dnd5e','fabula','somdas6','3det'].includes(data.system || 'dragonbane') && (""",
    "render do editor 3DeT",
)

app_path.write_text(s, encoding="utf-8")
print("Integração 3DeT aplicada com sucesso.")
