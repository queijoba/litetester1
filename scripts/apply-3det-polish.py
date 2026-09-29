from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: esperado 1 trecho, encontrado {count}")
    return text.replace(old, new, 1)


# -----------------------------------------------------------------------------
# PJLiteApp: tema, guia e textos da prévia.
# -----------------------------------------------------------------------------
app_path = Path('src/PJLiteApp.jsx')
app = app_path.read_text(encoding='utf-8')

app = replace_once(
    app,
    "theme === 'fabula' ? 'theme-fabula' : theme === 'som6' ? 'theme-som6' : theme === 'dark' ? 'theme-dark' :",
    "theme === 'fabula' ? 'theme-fabula' : theme === 'som6' ? 'theme-som6' : theme === '3det' ? 'theme-3det' : theme === 'dark' ? 'theme-dark' :",
    'classe do tema 3DeT',
)

app = replace_once(
    app,
    '<option value="som6">Tema: O Som das Seis</option>\n                                        <option value="dark">Tema: Modo Escuro</option>',
    '<option value="som6">Tema: O Som das Seis</option>\n                                        <option value="3det">Tema: 3DeT Victory</option>\n                                        <option value="dark">Tema: Modo Escuro</option>',
    'opção de tema 3DeT',
)

app = replace_once(
    app,
    '<button onClick={() => setGuideTab(\'fabula\')} className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap ${guideTab === \'fabula\' ? \'border-teal-600 text-teal-900 bg-white\' : \'border-transparent text-gray-500 hover:bg-gray-300\'}`}>Fabula Ultima</button>\n                                        <button onClick={() => setGuideTab(\'som6\')}',
    '<button onClick={() => setGuideTab(\'fabula\')} className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap ${guideTab === \'fabula\' ? \'border-teal-600 text-teal-900 bg-white\' : \'border-transparent text-gray-500 hover:bg-gray-300\'}`}>Fabula Ultima</button>\n                                        <button onClick={() => setGuideTab(\'3det\')} className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap ${guideTab === \'3det\' ? \'border-amber-500 text-amber-900 bg-white\' : \'border-transparent text-gray-500 hover:bg-gray-300\'}`}>3DeT Victory</button>\n                                        <button onClick={() => setGuideTab(\'som6\')}',
    'aba de guia 3DeT',
)

three_det_guide = '''
                                        {guideTab === '3det' && (
                                            <div className="space-y-5">
                                                <div className="rounded-lg border-2 border-amber-400 bg-zinc-950 p-5 text-white">
                                                    <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-amber-400">0.8.0v Alpha • 3DeT Victory</div>
                                                    <h3 className="font-title text-xl font-black text-amber-300">🎮 3DeT Victory — guia da ficha</h3>
                                                    <p className="mt-2 text-xs text-zinc-200">A ficha do PJ Lite prioriza criação rápida e consulta em mesa. Ela usa as perícias padrão do Livro Básico, mas também permite opções personalizadas para suplementos ou regras da mesa sem misturar essas opções com as oficiais.</p>
                                                </div>

                                                <div className="rounded border border-amber-300 bg-amber-50 p-4">
                                                    <h3 className="mb-2 font-bold text-amber-950">🧭 Ordem recomendada</h3>
                                                    <p className="text-xs"><strong>Retrato e conceito → Arquétipo/Kit → Pontos e XP → P/H/R → PA/PM/PV → Perícias → Especializações → Vantagens/Desvantagens → Técnicas → Inventário → Salvar.</strong></p>
                                                </div>

                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <div className="rounded border bg-white p-4"><strong>1. Identidade</strong><p className="mt-1 text-xs">Preencha Nome, Jogador, Arquétipo, Conceito e Escala. <strong>Kit</strong> fica opcional para mesas e materiais que o utilizem. O retrato usa o mesmo fluxo de escolher imagem/remover das demais fichas.</p></div>
                                                    <div className="rounded border bg-white p-4"><strong>2. Atributos e recursos</strong><p className="mt-1 text-xs">Registre Poder, Habilidade e Resistência. PA, PM e PV possuem campos Atual/Máximo para facilitar o uso durante a sessão. O PJ Lite evita forçar cálculos que possam variar com vantagens ou regras da mesa.</p></div>
                                                    <div className="rounded border bg-white p-4"><strong>3. Perícias padrão</strong><p className="mt-1 text-xs">As 12 perícias do Livro Básico já aparecem prontas. Clique apenas nas que o personagem comprou. Cada seleção entra no contador de pontos da área, evitando digitar nomes repetidamente.</p></div>
                                                    <div className="rounded border bg-white p-4"><strong>4. Perícias personalizadas</strong><p className="mt-1 text-xs">Para suplemento ou regra caseira, escreva o nome e confirme. A nova perícia é criada já selecionada. Use <strong>Editar</strong> para remover opções personalizadas que não quer mais manter na ficha.</p></div>
                                                    <div className="rounded border bg-white p-4"><strong>5. Especializações</strong><p className="mt-1 text-xs">Especializações ficam em uma área própria. Informe o nome e, se ajudar na consulta, associe uma perícia-base e uma nota curta. Assim elas não são confundidas com a lista de perícias completas.</p></div>
                                                    <div className="rounded border bg-white p-4"><strong>6. Vantagens, Desvantagens e Técnicas</strong><p className="mt-1 text-xs">Adicione somente o que o personagem possui. Os campos de custo/valor e resumo são lembretes de mesa; consulte o livro para o texto completo da regra.</p></div>
                                                    <div className="rounded border bg-white p-4"><strong>7. Inventário</strong><p className="mt-1 text-xs">Cadastre item, quantidade, raridade e uma nota curta. Os contadores de Comum, Incomum e Raro servem como visão rápida do que está registrado.</p></div>
                                                    <div className="rounded border bg-white p-4"><strong>8. Ficha Chat e backup</strong><p className="mt-1 text-xs">A Ficha Chat inclui perícias oficiais, personalizadas e especializações. Depois de mudanças importantes, salve e mantenha um backup fora do navegador antes de uma sessão importante.</p></div>
                                                </div>

                                                <div className="rounded border border-zinc-300 bg-zinc-100 p-4">
                                                    <h3 className="mb-2 font-bold text-zinc-900">🎨 Tema 3DeT Victory</h3>
                                                    <p className="text-xs">No seletor de temas do topo, escolha <strong>Tema: 3DeT Victory</strong> para usar a identidade preta e amarela preparada para o sistema. A ficha também recebeu tratamento próprio para continuar legível no Modo Escuro e no celular.</p>
                                                </div>

                                                <div className="rounded border border-amber-300 bg-amber-50 p-4">
                                                    <h3 className="mb-2 font-bold text-amber-950">ℹ️ Sobre regras</h3>
                                                    <p className="text-xs">O PJ Lite organiza a ficha e automatiza apenas tarefas de interface. Para custos, requisitos, efeitos, limites e exceções, use o material de 3DeT Victory adotado pela sua mesa como referência.</p>
                                                </div>
                                            </div>
                                        )}

'''

app = replace_once(
    app,
    "\n                                        {guideTab === 'som6' && (",
    "\n" + three_det_guide + "                                        {guideTab === 'som6' && (",
    'conteúdo do guia 3DeT',
)

old_log = "{ versao: '0.8.0v Alpha', descricao: '3DeT Victory entra na prévia do PJ Lite com ficha digital modular, retrato opcional, P/H/R, PA/PM/PV, perícias, FA/FD, vantagens, desvantagens, técnicas, inventário por raridade, Kit opcional, Ficha Chat e integração com saves/importação.' }"
new_log = "{ versao: '0.8.0v Alpha', descricao: '3DeT Victory entra na prévia do PJ Lite e recebe refinamento completo: ficha modular, retrato, P/H/R, PA/PM/PV, perícias padrão e personalizadas, especializações separadas, FA/FD, vantagens, desvantagens, técnicas, inventário, Ficha Chat, tema próprio preto/amarelo, guia dedicado e revisão de compatibilidade com saves, importação, modo escuro e mobile.' }"
app = replace_once(app, old_log, new_log, 'changelog 0.8.0')

app = replace_once(
    app,
    'Esta aba reúne as ameaças e personagens do Mestre dos sistemas disponíveis. Dragonbane usa PNJs e monstros; D&D 5.5e usa blocos de estatísticas; Fabula Ultima usa Ameaças/PNJs; O Som das Seis usa PDJs. Escolha primeiro o sistema e depois preencha apenas o que realmente será consultado em mesa.',
    'Esta aba reúne as ameaças e personagens do Mestre dos sistemas que já possuem editor de ameaça. Dragonbane usa PNJs e monstros; D&D 5.5e usa blocos de estatísticas; Fabula Ultima usa Ameaças/PNJs; O Som das Seis usa PDJs. Nesta prévia, 3DeT Victory ainda possui apenas ficha de personagem. Escolha primeiro o sistema e depois preencha apenas o que realmente será consultado em mesa.',
    'texto do guia de ameaças',
)

app_path.write_text(app, encoding='utf-8')


# -----------------------------------------------------------------------------
# Editor 3DeT: carrega CSS próprio e marca o escopo para tema/dark mode.
# -----------------------------------------------------------------------------
editor_path = Path('src/systems/3det/components/CharacterEditor.jsx')
editor = editor_path.read_text(encoding='utf-8')
editor = replace_once(
    editor,
    "import * as React from 'react';\nimport { TRESDET_RARITIES, TRESDET_SKILLS } from '../data.js';",
    "import * as React from 'react';\nimport { TRESDET_RARITIES, TRESDET_SKILLS } from '../data.js';\nimport '../3det-theme.css';",
    'import do tema 3DeT',
)
editor = replace_once(
    editor,
    '<div className="bg-[#f5f5f2] text-zinc-900">',
    '<div className="tresdet-sheet bg-[#f5f5f2] text-zinc-900">',
    'escopo visual 3DeT',
)
editor = replace_once(
    editor,
    '<Input value={newCustomSkill} onChange={(e) => setNewCustomSkill(e.target.value)} onKeyDown={(e) => { if (e.key === \'Enter\') { e.preventDefault(); addCustomSkill(); } }} placeholder="Escreva o nome da nova perícia..." />',
    '<Input value={newCustomSkill} maxLength={80} onChange={(e) => setNewCustomSkill(e.target.value)} onKeyDown={(e) => { if (e.key === \'Enter\') { e.preventDefault(); addCustomSkill(); } }} placeholder="Escreva o nome da nova perícia..." />',
    'limite de nome de perícia personalizada',
)
editor_path.write_text(editor, encoding='utf-8')


# -----------------------------------------------------------------------------
# Versão de pacote: alinha metadados com a prévia 0.8.0.
# -----------------------------------------------------------------------------
package_path = Path('package.json')
package = package_path.read_text(encoding='utf-8')
package = replace_once(package, '"version": "0.7.4-alpha.1"', '"version": "0.8.0-alpha.1"', 'versão package.json')
package_path.write_text(package, encoding='utf-8')

lock_path = Path('package-lock.json')
lock = lock_path.read_text(encoding='utf-8')
count = lock.count('"version": "0.7.4-alpha.1"')
if count != 2:
    raise SystemExit(f'package-lock: esperado 2 versões raiz antigas, encontrado {count}')
lock = lock.replace('"version": "0.7.4-alpha.1"', '"version": "0.8.0-alpha.1"')
lock_path.write_text(lock, encoding='utf-8')


# -----------------------------------------------------------------------------
# README: documenta tema, perícias flexíveis e guia.
# -----------------------------------------------------------------------------
readme_path = Path('README.md')
readme = readme_path.read_text(encoding='utf-8')
readme = replace_once(
    readme,
    '- 3DeT Victory entra na 0.8.0 com ficha de personagem modular: retrato opcional, Arquétipo, Kit opcional, Conceito, Escala, Pontos/XP, P/H/R, PA/PM/PV, 12 Perícias, FA/FD, Vantagens, Desvantagens, Técnicas, Inventário por raridade e Anotações.',
    '- 3DeT Victory entra na 0.8.0 com ficha de personagem modular: retrato opcional, Arquétipo, Kit opcional, Conceito, Escala, Pontos/XP, P/H/R, PA/PM/PV, 12 Perícias padrão clicáveis, Perícias personalizadas, Especializações separadas, FA/FD, Vantagens, Desvantagens, Técnicas, Inventário por raridade e Anotações.',
    'README recursos 3DeT',
)
readme = replace_once(
    readme,
    '- A ficha 3DeT já participa de saves, autosave, histórico, backup, importação, filtros e Ficha Chat. Exportação PDF será tratada em uma etapa própria.',
    '- A ficha 3DeT já participa de saves, autosave, histórico, backup, importação, filtros e Ficha Chat; também possui tema próprio preto/amarelo, tratamento de modo escuro/mobile e guia dedicado em Guias e Tutoriais. Exportação PDF será tratada em uma etapa própria.',
    'README integração 3DeT',
)
readme = replace_once(
    readme,
    '      ├─ chat.js\n      └─ components/',
    '      ├─ chat.js\n      ├─ 3det-theme.css\n      └─ components/',
    'README árvore 3DeT',
)
readme_path.write_text(readme, encoding='utf-8')


# -----------------------------------------------------------------------------
# Verificador: transforma a revisão em proteção contra regressões futuras.
# -----------------------------------------------------------------------------
verify_path = Path('scripts/verify-project.mjs')
verify = verify_path.read_text(encoding='utf-8')
verify = replace_once(
    verify,
    "  'src/systems/3det/chat.js',\n  'src/systems/3det/components/CharacterEditor.jsx',",
    "  'src/systems/3det/chat.js',\n  'src/systems/3det/3det-theme.css',\n  'src/systems/3det/components/CharacterEditor.jsx',",
    'arquivo de tema no verify',
)
verify = replace_once(
    verify,
    "if (!app.includes(\"initial3DetPcData\") || !app.includes('TresDeTCharacterEditor') || !app.includes('generate3DetChatText')) throw new Error('PJLiteApp.jsx não está integrando completamente o 3DeT Victory.');",
    "if (!app.includes(\"initial3DetPcData\") || !app.includes('TresDeTCharacterEditor') || !app.includes('generate3DetChatText')) throw new Error('PJLiteApp.jsx não está integrando completamente o 3DeT Victory.');\nif (!app.includes(\"theme === '3det'\") || !app.includes('Tema: 3DeT Victory')) throw new Error('Tema do 3DeT Victory não está integrado ao seletor global.');\nif (!app.includes(\"setGuideTab('3det')\") || !app.includes(\"guideTab === '3det'\")) throw new Error('Guias e Tutoriais não possuem a seção do 3DeT Victory.');",
    'verify integração visual/guia 3DeT',
)
verify = replace_once(
    verify,
    "for (const token of ['3DeT', 'Poder', 'Habilidade', 'Resistência', 'TRESDET_SKILLS', 'TRESDET_RARITIES', 'bio.imagem']) {",
    "for (const token of ['3DeT', 'Poder', 'Habilidade', 'Resistência', 'TRESDET_SKILLS', 'TRESDET_RARITIES', 'bio.imagem', 'periciasPersonalizadas', 'especializacoes', '3det-theme.css', 'tresdet-sheet']) {",
    'tokens do editor 3DeT',
)
verify = replace_once(
    verify,
    "for (const token of ['initial3DetPcData', 'normalize3DetPcData', \"system: '3det'\", 'animais', 'sobrevivencia']) {",
    "for (const token of ['initial3DetPcData', 'normalize3DetPcData', \"system: '3det'\", 'animais', 'sobrevivencia', 'periciasPersonalizadas', 'especializacoes']) {",
    'tokens do modelo 3DeT',
)
verify = replace_once(
    verify,
    "const mobilePolish = await readFile('src/mobile-polish.css', 'utf8');",
    "const tresDetTheme = await readFile('src/systems/3det/3det-theme.css', 'utf8');\nfor (const token of ['body.theme-3det', '.tresdet-sheet', 'body.theme-dark .tresdet-sheet', '@media (max-width: 520px)']) {\n  if (!tresDetTheme.includes(token)) throw new Error(`Tema 3DeT incompleto: ${token}`);\n}\n\nconst packageJson = JSON.parse(await readFile('package.json', 'utf8'));\nif (packageJson.version !== '0.8.0-alpha.1') throw new Error('package.json não está alinhado à prévia 0.8.0.');\n\nconst mobilePolish = await readFile('src/mobile-polish.css', 'utf8');",
    'verify CSS e versão',
)
verify_path.write_text(verify, encoding='utf-8')

print('Revisão 3DeT aplicada: tema, guia, dark/mobile, metadados e verificações.')
