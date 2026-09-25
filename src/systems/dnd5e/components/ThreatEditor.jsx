// Extraído automaticamente do antigo PJLiteApp monolítico.
// Este arquivo agora é a fonte visual do editor deste sistema.
export default function DndThreatEditor({ scope }) {
  const {
    addDndSyncedItem,
    addToArray,
    App,
    applyCustomPreset,
    CHAT_MODES,
    chatModal,
    codeModal,
    copyChatFromModal,
    copySheetToChat,
    copyToClipboard,
    createTarget,
    CUSTOM_ACCENT_COLOR_KEY,
    CUSTOM_BAR_COLOR_KEY,
    CUSTOM_BG_KEY,
    CUSTOM_BG_POSITION_KEY,
    CUSTOM_BG_SIZE_KEY,
    CUSTOM_BLUR_KEY,
    CUSTOM_OPACITY_KEY,
    CUSTOM_OVERLAY_KEY,
    CUSTOM_TEXT_COLOR_KEY,
    CUSTOM_WIN_COLOR_KEY,
    customAccentColor,
    customBarColor,
    customBgLink,
    customBgPosition,
    customBgSize,
    customBgUrl,
    customBlur,
    customOpacity,
    customOverlay,
    customTextColor,
    customWinColor,
    dashboardView,
    data,
    deleteCharacter,
    deleteConfirmId,
    deleteThreat,
    DND_SKILLS_LIST,
    dndPcTab,
    duplicateItem,
    exportFullBackup,
    FABULA_DEFAULT_SUPPLEMENTS,
    FABULA_EXTRA_OPTIONS,
    FABULA_MAGIC_DISCIPLINES,
    FABULA_RITUAL_AREA,
    FABULA_RITUAL_POTENCY,
    FABULA_SPELL_DISCIPLINES,
    FABULA_SUPPLEMENT_OPTIONS,
    FabulaAcampamentoPanel,
    FabulaArcanosPanel,
    FabulaArmasPersonalizadasPanel,
    FabulaComercioPanel,
    fabulaCreateSupplements,
    FabulaInvocacoesPanel,
    FabulaJardimPanel,
    FabulaMagicPanel,
    FabulaMateriaisPanel,
    FabulaMnemosferaPanel,
    FabulaNotasPanel,
    FabulaPeculiaridadePanel,
    FabulaPoderZeroPanel,
    FabulaProjetosPanel,
    FabulaReceitasPanel,
    FabulaRecursosClassePanel,
    fabulaTab,
    FabulaTecnosferasPanel,
    FabulaThreatList,
    FabulaVeiculoPanel,
    filterAndSortItems,
    filterChatText,
    formatDndMod,
    generateChatText,
    generatePnjAspect,
    getBarStyle,
    getChanceBase,
    getDanoBonus,
    getDndAbilityMod,
    getFabulaDieClass,
    getFabulaMagicTestHint,
    getFabulaRitualRef,
    getHistory,
    getMovimento,
    getProficiencyBonus,
    getSavedCharacters,
    getSavedThreats,
    getSelectedFabulaSupplements,
    getValidationWarnings,
    getWindowStyle,
    guideTab,
    handleAncestryChange,
    handleAttributeChange,
    handleCodeImport,
    handleExport,
    handleImport,
    hexToRgb,
    HISTORY_STORAGE_KEY,
    historySignature,
    initialAmeacaData,
    initialData,
    initialDndMonsterData,
    initialDndPcData,
    initialFabulaPcData,
    initialFabulaThreatData,
    initialPnjData,
    initialSom6PcData,
    initialSom6PdjData,
    isDnd,
    isFabula,
    isFabulaExtraUnlocked,
    isSom6,
    JSZip,
    loadCharacter,
    loadFabulaTemplateWithSupplements,
    loadTemplate,
    loadThreat,
    LZString,
    mobileTab,
    MODELOS_AMEACAS_GENERICOS,
    MODELOS_DND_AMEACA,
    MODELOS_DND_PC,
    MODELOS_DRAGONBANE_PC,
    MODELOS_FABULA_AMEACA,
    MODELOS_FABULA_PC,
    MODELOS_SOM6_PC,
    MODELOS_SOM6_PDJ,
    moveArrayItem,
    moveNestedArrayItem,
    NEWS_COLLAPSED_KEY,
    newsCollapsed,
    normalizeDndPcData,
    normalizeFabulaPcData,
    normalizeFabulaThreatData,
    normalizeImportedSheet,
    normalizeMetaItem,
    normalizeSom6PcData,
    normalizeSom6PdjData,
    onlyFavorites,
    openChatOptions,
    openCodeExport,
    openCodeImport,
    optimizeImageFile,
    pushHistorySnapshot,
    React,
    ReactDOM,
    readableTextColor,
    removeDndSyncedItem,
    removeFromArray,
    renderFabulaDieSelect,
    renderHistoryModal,
    restoreFabulaEquipmentSlots,
    restoreFullBackup,
    restoreHistorySnapshot,
    returnToDashboard,
    savedChars,
    savedThreats,
    saveStatus,
    saveToLocal,
    SCHEMA_VERSION,
    searchQuery,
    setChatModal,
    setCodeModal,
    setCreateTarget,
    setCustomAccentColor,
    setCustomBarColor,
    setCustomBgLink,
    setCustomBgPosition,
    setCustomBgSize,
    setCustomBgUrl,
    setCustomBlur,
    setCustomOpacity,
    setCustomOverlay,
    setCustomTextColor,
    setCustomWinColor,
    setDashboardView,
    setData,
    setDeleteConfirmId,
    setDndPcTab,
    setFabulaCreateSupplements,
    setFabulaSupplementEnabled,
    setFabulaTab,
    setGuideTab,
    setMobileTab,
    setNewsCollapsed,
    setOnlyFavorites,
    setSavedChars,
    setSavedThreats,
    setSaveStatus,
    setSearchQuery,
    setShowCustomBgModal,
    setShowDbModelModal,
    setShowDndModelModal,
    setShowFabulaExtras,
    setShowFabulaModelModal,
    setShowFilters,
    setShowGuideModal,
    setShowHistoryModal,
    setShowSom6ModelModal,
    setShowSystemModal,
    setShowThreatModal,
    setShowUrlInput,
    setSom6Tab,
    setSortMode,
    setSystemFilter,
    setTempUrl,
    setTheme,
    setToastMsg,
    setUndoState,
    setView,
    showCustomBgModal,
    showDbModelModal,
    showDndModelModal,
    showFabulaExtras,
    showFabulaModelModal,
    showFilters,
    showGuideModal,
    showHistoryModal,
    showSom6ModelModal,
    showSystemModal,
    showThreatModal,
    showToast,
    showUrlInput,
    SOM6_ANTECEDENTES,
    SOM6_HABILIDADES,
    SOM6_LEVELS,
    Som6Pips,
    som6Tab,
    sortMode,
    STORAGE_KEY,
    stripHeavyHistoryMedia,
    SVGIcons,
    systemFilter,
    tempUrl,
    theme,
    THEME_PREF_KEY,
    THREAT_STORAGE_KEY,
    toastMsg,
    toastTimerRef,
    toggleFabulaCreateSupplement,
    toggleFavorite,
    toggleTreinada,
    topBarColor,
    undoLastRemoval,
    undoState,
    UPDATE_LOG,
    updateArrayField,
    updateDndSyncedItem,
    updateField,
    useEffect,
    useRef,
    useState,
    view
  } = scope;

  return (
    <>
      {isDnd && data.type === 'ameaca' && (
                              <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-8 bg-gray-100 font-dnd">
                                  {/* Lado Esquerdo: Formulário */}
                                  <div className="w-full lg:w-1/2 bg-white p-6 rounded shadow border space-y-4 max-h-[75vh] overflow-y-auto">
                                      <h3 className="font-title font-bold text-base text-[#922610] border-b pb-1">Configuração do Stat Block</h3>
                                      <div>
                                          <label className="block text-[10px] font-bold uppercase text-gray-500">Nome da Criatura</label>
                                          <input type="text" value={data.nome} onChange={e => updateField('nome', e.target.value)} className="w-full border-b-2 p-1 font-title font-bold text-lg outline-none" />
                                      </div>
                                      <div className="grid grid-cols-3 gap-2">
                                          <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Tamanho</label><input type="text" value={data.tamanho} onChange={e => updateField('tamanho', e.target.value)} className="w-full border-b p-1 text-xs outline-none" /></div>
                                          <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Tipo</label><input type="text" value={data.tipo} onChange={e => updateField('tipo', e.target.value)} className="w-full border-b p-1 text-xs outline-none" /></div>
                                          <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Alinhamento</label><input type="text" value={data.alinhamento} onChange={e => updateField('alinhamento', e.target.value)} className="w-full border-b p-1 text-xs outline-none" /></div>
                                      </div>
                                      <div className="grid grid-cols-3 gap-2">
                                          <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Classe de Armadura</label><input type="text" value={data.ca} onChange={e => updateField('ca', e.target.value)} className="w-full border-b p-1 text-xs outline-none" /></div>
                                          <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Pontos de Vida</label><input type="text" value={data.pv} onChange={e => updateField('pv', e.target.value)} className="w-full border-b p-1 text-xs outline-none" /></div>
                                          <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Deslocamento</label><input type="text" value={data.deslocamento} onChange={e => updateField('deslocamento', e.target.value)} className="w-full border-b p-1 text-xs outline-none" /></div>
                                      </div>
      
                                      <div className="bg-gray-50 p-2 rounded border">
                                          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Atributos Base</label>
                                          <div className="grid grid-cols-6 gap-1 text-center">
                                              {['for','des','con','int','sab','car'].map(attr => (
                                                  <div key={attr}>
                                                      <span className="text-[10px] font-bold uppercase">{attr}</span>
                                                      <input type="number" value={data.atributos[attr]} onChange={e => updateField(`atributos.${attr}`, parseInt(e.target.value)||10)} className="w-full border bg-white text-center text-xs font-bold p-1 outline-none" />
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                          <div className="flex items-center gap-2"><label className="text-[10px] font-bold text-gray-500 uppercase w-20">Testes Res.</label><input type="text" value={data.testesResistencia} onChange={e => updateField('testesResistencia', e.target.value)} className="flex-1 border-b p-1 text-xs outline-none" placeholder="Ex: Des +4, Sab +1" /></div>
                                          <div className="flex items-center gap-2"><label className="text-[10px] font-bold text-gray-500 uppercase w-20">Perícias</label><input type="text" value={data.pericias} onChange={e => updateField('pericias', e.target.value)} className="flex-1 border-b p-1 text-xs outline-none" placeholder="Ex: Furtividade +6" /></div>
                                          <div className="flex items-center gap-2"><label className="text-[10px] font-bold text-gray-500 uppercase w-20">Vuln. Dano</label><input type="text" value={data.vulnerabilidades} onChange={e => updateField('vulnerabilidades', e.target.value)} className="flex-1 border-b p-1 text-xs outline-none" /></div>
                                          <div className="flex items-center gap-2"><label className="text-[10px] font-bold text-gray-500 uppercase w-20">Resis. Dano</label><input type="text" value={data.resistencias} onChange={e => updateField('resistencias', e.target.value)} className="flex-1 border-b p-1 text-xs outline-none" /></div>
                                          <div className="flex items-center gap-2"><label className="text-[10px] font-bold text-gray-500 uppercase w-20">Imun. Dano</label><input type="text" value={data.imunidadesDano} onChange={e => updateField('imunidadesDano', e.target.value)} className="flex-1 border-b p-1 text-xs outline-none" /></div>
                                          <div className="flex items-center gap-2"><label className="text-[10px] font-bold text-gray-500 uppercase w-20">Imun. Cond.</label><input type="text" value={data.imunidadesCondicao} onChange={e => updateField('imunidadesCondicao', e.target.value)} className="flex-1 border-b p-1 text-xs outline-none" /></div>
                                          <div className="flex items-center gap-2"><label className="text-[10px] font-bold text-gray-500 uppercase w-20">Sentidos</label><input type="text" value={data.sentidos} onChange={e => updateField('sentidos', e.target.value)} className="flex-1 border-b p-1 text-xs outline-none" /></div>
                                          <div className="flex items-center gap-2"><label className="text-[10px] font-bold text-gray-500 uppercase w-20">Idiomas</label><input type="text" value={data.idiomas} onChange={e => updateField('idiomas', e.target.value)} className="flex-1 border-b p-1 text-xs outline-none" /></div>
                                      </div>
      
                                      <div className="grid grid-cols-2 gap-2">
                                          <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Desafio (CR e XP)</label><input type="text" value={data.desafio} onChange={e => updateField('desafio', e.target.value)} className="w-full border-b p-1 text-xs outline-none" /></div>
                                          <div><label className="block text-[10px] font-bold text-gray-500 uppercase">Bônus de Proficiência</label><input type="text" value={data.proficienciaBonus} onChange={e => updateField('proficienciaBonus', e.target.value)} className="w-full border-b p-1 text-xs outline-none" /></div>
                                      </div>
      
                                      {/* Sessões Dinâmicas (Ações, Tracos, etc) */}
                                      {['tracos', 'acoes', 'acoesBonus', 'reacoes', 'acoesLendarias'].map(sec => {
                                          const titleMap = { tracos: 'Traços / Habilidades', acoes: 'Ações', acoesBonus: 'Ações Bônus', reacoes: 'Reações', acoesLendarias: 'Ações Lendárias' };
                                          return (
                                              <div key={sec} className="bg-gray-50 p-2 rounded border">
                                                  <div className="flex justify-between items-center bg-gray-200 p-1.5 rounded text-xs font-bold text-gray-700 mb-2">
                                                      {titleMap[sec]} <button onClick={() => addToArray(sec, { nome: '', desc: '' })} className="text-[#922610] hover:text-red-900">+ Adic.</button>
                                                  </div>
                                                  {(data[sec] || []).map((item, idx) => (
                                                      <div key={idx} className="border bg-white p-2 mb-2 flex flex-col gap-1 relative">
                                                          <input type="text" value={item.nome} onChange={e => updateArrayField(sec, idx, 'nome', e.target.value)} className="font-bold border-b text-xs outline-none" placeholder="Nome (Ex: Ataque Furtivo)" />
                                                          <textarea rows="2" value={item.desc} onChange={e => updateArrayField(sec, idx, 'desc', e.target.value)} className="text-xs outline-none resize-y w-full" placeholder="Descrição do efeito..."></textarea>
                                                          <button onClick={() => removeFromArray(sec, idx)} className="text-red-500 text-[10px] self-end mt-1"><SVGIcons.Trash/></button>
                                                      </div>
                                                  ))}
                                              </div>
                                          )
                                      })}
                                  </div>
      
                                  {/* Lado Direito: Preview (Stat Block) */}
                                  <div className="w-full lg:w-1/2 bg-[#fdf1dc] p-6 rounded shadow-lg border-2 border-[#922610] max-h-[75vh] overflow-y-auto" style={{boxShadow: '4px 4px 10px rgba(0,0,0,0.1)'}}>
                                      <h1 className="text-3xl font-title text-[#922610] font-bold">{data.nome || 'Criatura Sem Nome'}</h1>
                                      <p className="italic text-xs text-black mb-1">{data.tamanho} {data.tipo}, {data.alinhamento}</p>
                                      
                                      <div className="dnd-stat-block-line"></div>
                                      
                                      <div className="text-xs space-y-1 text-red-950">
                                          <p><strong className="text-[#922610]">Classe de Armadura</strong> {data.ca}</p>
                                          <p><strong className="text-[#922610]">Pontos de Vida</strong> {data.pv}</p>
                                          <p><strong className="text-[#922610]">Deslocamento</strong> {data.deslocamento}</p>
                                      </div>
                                      
                                      <div className="dnd-stat-block-line"></div>
                                      
                                      <div className="grid grid-cols-6 text-center text-xs text-[#922610]">
                                          {['for','des','con','int','sab','car'].map(attr => (
                                              <div key={attr} className="flex flex-col">
                                                  <span className="font-bold uppercase">{attr}</span>
                                                  <span>{data.atributos[attr]} ({formatDndMod(getDndAbilityMod(data.atributos[attr]))})</span>
                                              </div>
                                          ))}
                                      </div>
                                      
                                      <div className="dnd-stat-block-line"></div>
      
                                      <div className="text-xs space-y-1 text-red-950">
                                          {data.testesResistencia && <p><strong className="text-[#922610]">Testes de Resistência</strong> {data.testesResistencia}</p>}
                                          {data.pericias && <p><strong className="text-[#922610]">Perícias</strong> {data.pericias}</p>}
                                          {data.vulnerabilidades && <p><strong className="text-[#922610]">Vulnerabilidade a Dano</strong> {data.vulnerabilidades}</p>}
                                          {data.resistencias && <p><strong className="text-[#922610]">Resistência a Dano</strong> {data.resistencias}</p>}
                                          {data.imunidadesDano && <p><strong className="text-[#922610]">Imunidade a Dano</strong> {data.imunidadesDano}</p>}
                                          {data.imunidadesCondicao && <p><strong className="text-[#922610]">Imunidade a Condição</strong> {data.imunidadesCondicao}</p>}
                                          <p><strong className="text-[#922610]">Sentidos</strong> {data.sentidos}</p>
                                          <p><strong className="text-[#922610]">Idiomas</strong> {data.idiomas}</p>
                                          <p><strong className="text-[#922610]">Nível de Desafio</strong> {data.desafio} <span className="float-right"><strong className="text-[#922610]">Bônus de Proficiência</strong> {data.proficienciaBonus}</span></p>
                                      </div>
      
                                      <div className="dnd-stat-block-line"></div>
      
                                      {data.tracos && data.tracos.length > 0 && (
                                          <div className="space-y-2 mt-3 text-xs text-red-950">
                                              {data.tracos.map((tr, idx) => (
                                                  <p key={idx} className="leading-relaxed"><strong className="text-[#922610] italic">{tr.nome}.</strong> {tr.desc}</p>
                                              ))}
                                          </div>
                                      )}
      
                                      {data.acoes && data.acoes.length > 0 && (
                                          <div className="mt-4 text-xs text-red-950">
                                              <h3 className="font-title font-bold text-lg text-[#922610] border-b border-[#922610]/30 pb-0.5 mb-2">Ações</h3>
                                              <div className="space-y-2">
                                                  {data.acoes.map((ac, idx) => (
                                                      <p key={idx} className="leading-relaxed"><strong className="text-[#922610] italic">{ac.nome}.</strong> {ac.desc}</p>
                                                  ))}
                                              </div>
                                          </div>
                                      )}
      
                                      {data.acoesBonus && data.acoesBonus.length > 0 && (
                                          <div className="mt-4 text-xs text-red-950">
                                              <h3 className="font-title font-bold text-lg text-[#922610] border-b border-[#922610]/30 pb-0.5 mb-2">Ações Bônus</h3>
                                              <div className="space-y-2">
                                                  {data.acoesBonus.map((ac, idx) => (
                                                      <p key={idx} className="leading-relaxed"><strong className="text-[#922610] italic">{ac.nome}.</strong> {ac.desc}</p>
                                                  ))}
                                              </div>
                                          </div>
                                      )}
      
                                      {data.reacoes && data.reacoes.length > 0 && (
                                          <div className="mt-4 text-xs text-red-950">
                                              <h3 className="font-title font-bold text-lg text-[#922610] border-b border-[#922610]/30 pb-0.5 mb-2">Reações</h3>
                                              <div className="space-y-2">
                                                  {data.reacoes.map((ac, idx) => (
                                                      <p key={idx} className="leading-relaxed"><strong className="text-[#922610] italic">{ac.nome}.</strong> {ac.desc}</p>
                                                  ))}
                                              </div>
                                          </div>
                                      )}
      
                                      {data.acoesLendarias && data.acoesLendarias.length > 0 && (
                                          <div className="mt-4 text-xs text-red-950">
                                              <h3 className="font-title font-bold text-lg text-[#922610] border-b border-[#922610]/30 pb-0.5 mb-2">Ações Lendárias</h3>
                                              <div className="space-y-2">
                                                  {data.acoesLendarias.map((ac, idx) => (
                                                      <p key={idx} className="leading-relaxed"><strong className="text-[#922610] italic">{ac.nome}.</strong> {ac.desc}</p>
                                                  ))}
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          )}
    </>
  );
}
