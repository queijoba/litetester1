// Extraído automaticamente do antigo PJLiteApp monolítico.
// Este arquivo agora é a fonte visual do editor deste sistema.
export default function DndCharacterEditor({ scope }) {
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

  const dndFeatureGroups = [
    { id: 'classe', label: 'Características de Classe' },
    { id: 'especie', label: 'Características de Espécie' },
    { id: 'talento', label: 'Talentos' },
    { id: 'outro', label: 'Outros Recursos' }
  ];
  const dndAttunements = Array.isArray(data.sintonizacao) ? data.sintonizacao : ['', '', ''];

  return (
    <>
      {isDnd && data.type === 'pc' && (
                              <div className="dnd-paper font-dnd">
                                  {/* Abas mobile D&D 5e */}
                                  <div className="md:hidden grid grid-cols-3 bg-[#f3eadc] border-b border-[#c9ad92] sticky top-0 z-20 shadow-sm">
                                      {[
                                          { id: 'status', label: 'Perfil & Atributos' },
                                          { id: 'equipamento', label: 'Combate' },
                                          { id: 'recursos', label: 'Recursos & Magias' }
                                      ].map(tab => (
                                          <button
                                              key={tab.id}
                                              type="button"
                                              onClick={() => setMobileTab(tab.id)}
                                              className={`py-3 px-1 text-[9px] font-bold uppercase text-center border-b-4 transition-colors ${mobileTab === tab.id ? 'border-[#922610] text-[#922610] bg-white' : 'border-transparent text-gray-500'}`}
                                          >
                                              {tab.label}
                                          </button>
                                      ))}
                                  </div>
      
                                  <div className="dnd-sheet p-4 md:p-8 space-y-6">
                                  {/* Header D&D */}
                                  <div className={`${mobileTab === 'status' ? 'flex' : 'hidden md:flex'} dnd-header flex-col md:flex-row gap-5 border-b-2 border-[#922610] pb-4`}>
                                      {/* Retrato D&D 5e - mesma experiência do Dragonbane */}
                                      <div className="flex flex-col items-center gap-2 shrink-0 w-full md:w-36">
                                          <div className="dnd-portrait w-32 h-32 md:w-36 md:h-36 border-2 border-[#922610] rounded bg-gray-100 relative group overflow-hidden flex items-center justify-center shadow-sm">
                                              {data.bio?.imagem ? (
                                                  <img src={data.bio.imagem} alt="Avatar" className="w-full h-full object-cover" />
                                              ) : (
                                                  <span className="text-gray-400 text-sm font-bold uppercase text-center px-4">Retrato</span>
                                              )}
      
                                              <div className={`absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 transition-opacity ${showUrlInput ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100 active:opacity-100'}`}>
                                                  {!showUrlInput ? (
                                                      <React.Fragment>
                                                          <label className="cursor-pointer bg-white text-black px-4 py-2 rounded text-sm font-bold hover:bg-gray-200 w-28 text-center shadow-lg">
                                                              Upload
                                                              <input
                                                                  type="file"
                                                                  accept="image/*"
                                                                  className="hidden"
                                                                  onChange={async (e) => {
                                                                      const file = e.target.files[0];
                                                                      e.target.value = '';
                                                                      if (!file) return;
                                                                      try { updateField('bio.imagem', await optimizeImageFile(file, 720, 0.82)); }
                                                                      catch (err) { console.error(err); showToast('Não foi possível usar esta imagem.'); }
                                                                  }}
                                                              />
                                                          </label>
      
                                                          <button
                                                              type="button"
                                                              onClick={() => setShowUrlInput(true)}
                                                              className="bg-white text-black px-4 py-2 rounded text-sm font-bold hover:bg-gray-200 w-28 text-center shadow-lg"
                                                          >
                                                              Usar URL
                                                          </button>
      
                                                          {data.bio?.imagem && (
                                                              <button
                                                                  type="button"
                                                                  onClick={() => {
                                                                      updateField('bio.imagem', '');
                                                                      setTempUrl('');
                                                                      setShowUrlInput(false);
                                                                  }}
                                                                  className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 w-28 text-center mt-2 shadow-lg"
                                                              >
                                                                  Remover
                                                              </button>
                                                          )}
                                                      </React.Fragment>
                                                  ) : (
                                                      <div className="flex flex-col gap-2 w-full px-3 items-center">
                                                          <input
                                                              type="text"
                                                              placeholder="Cole a URL aqui"
                                                              value={tempUrl}
                                                              onChange={(e) => setTempUrl(e.target.value)}
                                                              onKeyDown={(e) => {
                                                                  if (e.key === 'Enter' && tempUrl.trim()) {
                                                                      updateField('bio.imagem', tempUrl.trim());
                                                                      setTempUrl('');
                                                                      setShowUrlInput(false);
                                                                  }
                                                              }}
                                                              className="w-full p-2 text-xs outline-none rounded text-black"
                                                          />
                                                          <div className="flex gap-2">
                                                              <button
                                                                  type="button"
                                                                  onClick={() => {
                                                                      if (!tempUrl.trim()) return;
                                                                      updateField('bio.imagem', tempUrl.trim());
                                                                      setTempUrl('');
                                                                      setShowUrlInput(false);
                                                                  }}
                                                                  className="bg-green-700 text-white px-3 py-1.5 text-xs rounded font-bold hover:bg-green-600"
                                                              >
                                                                  OK
                                                              </button>
                                                              <button
                                                                  type="button"
                                                                  onClick={() => {
                                                                      setShowUrlInput(false);
                                                                      setTempUrl('');
                                                                  }}
                                                                  className="bg-gray-500 text-white px-3 py-1.5 text-xs rounded font-bold hover:bg-gray-600"
                                                              >
                                                                  Voltar
                                                              </button>
                                                          </div>
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                          <span className="text-[9px] uppercase font-bold text-gray-400">Retrato do personagem</span>
                                      </div>
      
                                      <div className="flex-1 w-full">
                                          <div className="dnd-brand-row"><span className="dnd-brand-mark">D&amp;D 5.5E</span><span className="dnd-brand-name">Dungeons &amp; Dragons • Regras 2024</span></div>
                                          <input type="text" value={data.bio?.nome} onChange={e => updateField('bio.nome', e.target.value)} placeholder="Nome do Personagem" className="dnd-name w-full text-3xl font-title font-bold outline-none text-[#922610]" />
                                          <div className="dnd-bio-grid grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm w-full mt-3">
                                              <div className="border-b border-[#922610]/50"><label className="text-[10px] uppercase font-bold text-gray-500 block">Classe</label><input type="text" value={data.bio?.classe} onChange={e => updateField('bio.classe', e.target.value)} className="w-full outline-none font-bold" /></div>
                                              <div className="border-b border-[#922610]/50"><label className="text-[10px] uppercase font-bold text-gray-500 block">Subclasse</label><input type="text" value={data.bio?.subclasse || ''} onChange={e => updateField('bio.subclasse', e.target.value)} className="w-full outline-none font-bold" /></div>
                                              <div className="border-b border-[#922610]/50"><label className="text-[10px] uppercase font-bold text-gray-500 block">Nível</label><input type="number" value={data.bio?.nivel} onChange={e => updateField('bio.nivel', parseInt(e.target.value)||1)} className="w-full outline-none font-bold" /></div>
                                              <div className="border-b border-[#922610]/50"><label className="text-[10px] uppercase font-bold text-gray-500 block">Espécie</label><input type="text" value={data.bio?.linhagem} onChange={e => updateField('bio.linhagem', e.target.value)} className="w-full outline-none font-bold" /></div>
                                              <div className="border-b border-[#922610]/50"><label className="text-[10px] uppercase font-bold text-gray-500 block">Origem / Antecedente</label><input type="text" value={data.bio?.antecedente} onChange={e => updateField('bio.antecedente', e.target.value)} className="w-full outline-none font-bold" /></div>
                                              <div className="border-b border-[#922610]/50"><label className="text-[10px] uppercase font-bold text-gray-500 block">Alinhamento</label><input type="text" value={data.bio?.alinhamento} onChange={e => updateField('bio.alinhamento', e.target.value)} className="w-full outline-none font-bold" /></div>
                                              <div className="border-b border-[#922610]/50"><label className="text-[10px] uppercase font-bold text-gray-500 block">XP</label><input type="number" value={data.bio?.xp} onChange={e => updateField('bio.xp', parseInt(e.target.value)||0)} className="w-full outline-none font-bold" /></div>
                                              <div className="border-b border-[#922610]/50 lg:col-span-2"><label className="text-[10px] uppercase font-bold text-gray-500 block">Jogador</label><input type="text" value={data.bio?.jogador} onChange={e => updateField('bio.jogador', e.target.value)} className="w-full outline-none font-bold" /></div>
                                          </div>
                                      </div>
                                  </div>
      
                                  <div className="dnd-layout grid grid-cols-1 lg:grid-cols-3 gap-6">
                                      {/* D&D Col 1: Atributos e Perícias */}
                                      <div className={`${mobileTab === 'status' ? 'block' : 'hidden md:block'} dnd-column space-y-4`}>
                                          <div className="flex gap-4">
                                              <div className="flex flex-col gap-2 w-20">
                                                  {['for','des','con','int','sab','car'].map(attr => (
                                                      <div key={attr} className="dnd-ability-card border-2 border-[#922610] rounded-lg p-2 text-center relative bg-gray-50 shadow-sm">
                                                          <div className="dnd-ability-name text-[9px] font-bold uppercase text-[#922610]">{attr}</div>
                                                          <input type="number" value={data.atributos[attr]} onChange={e => updateField(`atributos.${attr}`, parseInt(e.target.value)||10)} className="w-full text-center text-xl font-bold bg-transparent outline-none" />
                                                          <div className="dnd-mod-bubble absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border border-gray-400 rounded-full w-8 h-5 flex items-center justify-center text-xs font-bold shadow-sm">
                                                              {formatDndMod(getDndAbilityMod(data.atributos[attr]))}
                                                          </div>
                                                      </div>
                                                  ))}
                                              </div>
                                              <div className="flex-1 flex flex-col gap-3">
                                                  <div className="dnd-panel border-2 border-gray-300 rounded p-2 flex items-center gap-3 bg-white">
                                                      <div className="dnd-prof-badge w-8 h-8 rounded-full border-2 border-[#922610] flex items-center justify-center font-bold text-[#922610]">+{getProficiencyBonus(data.bio?.nivel || 1)}</div>
                                                      <div className="text-xs font-bold uppercase">Bônus de Proficiência</div>
                                                  </div>
                                                  
                                                  <div className="grid grid-cols-2 gap-2">
                                                      <label className="dnd-panel border border-gray-300 rounded p-2 bg-white flex items-center gap-2 cursor-pointer">
                                                          <input type="checkbox" checked={!!data.status?.inspiracao} onChange={e=>updateField('status.inspiracao',e.target.checked)} />
                                                          <span className="text-[10px] font-bold uppercase">Inspiração Heroica</span>
                                                      </label>
                                                      <label className="dnd-panel border border-gray-300 rounded p-2 bg-white">
                                                          <span className="block text-[8px] font-bold uppercase text-gray-500 text-center">Percepção Passiva</span>
                                                          <input type="number" value={data.status?.percepcaoPassiva ?? ''} onChange={e=>updateField('status.percepcaoPassiva',e.target.value)} placeholder={String(10 + getDndAbilityMod(data.atributos?.sab ?? 10) + (((data.pericias||[]).find(p=>p.id==='percepcao')?.prof||0) * getProficiencyBonus(data.bio?.nivel||1)))} className="w-full text-center bg-transparent outline-none font-bold" title="Deixe vazio para usar como referência o valor calculado mostrado no placeholder" />
                                                      </label>
                                                  </div>
                                                  
                                                  <div className="dnd-panel border border-gray-300 rounded p-2 bg-white space-y-1">
                                                      <div className="dnd-panel-title text-[10px] font-bold uppercase text-center border-b border-gray-200 pb-1 mb-1 text-gray-500">Testes de Resistência</div>
                                                      {['for','des','con','int','sab','car'].map(attr => {
                                                          const isProf = data.proficienciasResistencia[attr];
                                                          const total = getDndAbilityMod(data.atributos[attr]) + (isProf ? getProficiencyBonus(data.bio?.nivel || 1) : 0);
                                                          return (
                                                              <div key={attr} className="flex items-center gap-2 text-xs">
                                                                  <input type="checkbox" checked={isProf} onChange={e => updateField(`proficienciasResistencia.${attr}`, e.target.checked)} className="cursor-pointer" />
                                                                  <span className="w-6 text-center border-b font-bold">{formatDndMod(total)}</span>
                                                                  <span className="uppercase">{attr}</span>
                                                              </div>
                                                          )
                                                      })}
                                                  </div>
      
                                                  <div className="dnd-panel border border-gray-300 rounded p-2 bg-white space-y-1">
                                                      <div className="dnd-panel-title text-[10px] font-bold uppercase text-center border-b border-gray-200 pb-1 mb-1 text-gray-500">Perícias</div>
                                                      {DND_SKILLS_LIST.map((sk, index) => {
                                                          const pericia = data.pericias.find(p => p.id === sk.id) || { prof: 0 };
                                                          const attrMod = getDndAbilityMod(data.atributos[sk.attr]);
                                                          const profBonus = getProficiencyBonus(data.bio?.nivel || 1);
                                                          const total = attrMod + (pericia.prof === 1 ? profBonus : pericia.prof === 2 ? profBonus * 2 : 0);
                                                          
                                                          const toggleProf = () => {
                                                              const pList = [...data.pericias];
                                                              const pIdx = pList.findIndex(p => p.id === sk.id);
                                                              if(pIdx > -1) pList[pIdx].prof = pList[pIdx].prof === 0 ? 1 : pList[pIdx].prof === 1 ? 2 : 0;
                                                              updateField('pericias', pList);
                                                          };
                                                          
                                                          return (
                                                              <div key={sk.id} className="flex items-center gap-2 text-xs hover:bg-gray-50">
                                                                  <button onClick={toggleProf} className={`dnd-skill-dot w-3 h-3 rounded-full border border-gray-500 shrink-0 ${pericia.prof === 1 ? 'prof' : pericia.prof === 2 ? 'expert' : ''}`}></button>
                                                                  <span className="w-6 text-center border-b font-bold shrink-0">{formatDndMod(total)}</span>
                                                                  <span className="truncate flex-1">{sk.nome} <span className="text-[9px] text-gray-400">({sk.attr.toUpperCase()})</span></span>
                                                              </div>
                                                          )
                                                      })}
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
      
                                      {/* D&D Col 2: Combate, HP, Ataques */}
                                      <div className={`${mobileTab === 'equipamento' ? 'block' : 'hidden md:block'} dnd-column space-y-4`}>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                              <div className="dnd-combat-stat dnd-ac-card border-2 border-gray-300 bg-white p-2 rounded text-center flex flex-col items-center shadow-sm">
                                                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Classe de Armadura</div>
                                                  <input type="number" value={data.status?.ca} onChange={e => updateField('status.ca', parseInt(e.target.value)||10)} className="w-full text-center text-3xl font-bold bg-transparent outline-none text-[#922610]" />
                                                  <label className="dnd-shield-field"><span>Escudo</span><input type="number" min="0" value={data.status?.escudo ?? 0} onChange={e => updateField('status.escudo', parseInt(e.target.value)||0)} /></label>
                                              </div>
                                              <div className="dnd-combat-stat border-2 border-gray-300 bg-white p-2 rounded text-center flex flex-col items-center shadow-sm">
                                                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Iniciativa</div>
                                                  <input type="text" value={data.status?.iniciativa} onChange={e => updateField('status.iniciativa', e.target.value)} className="w-full text-center text-2xl font-bold bg-transparent outline-none mt-1" />
                                              </div>
                                              <div className="dnd-combat-stat border-2 border-gray-300 bg-white p-2 rounded text-center flex flex-col items-center shadow-sm">
                                                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Velocidade</div>
                                                  <input type="text" value={data.status?.deslocamento} onChange={e => updateField('status.deslocamento', e.target.value)} className="w-full text-center text-2xl font-bold bg-transparent outline-none mt-1" />
                                              </div>
                                              <div className="dnd-combat-stat dnd-size-card border-2 border-gray-300 bg-white p-2 rounded text-center flex flex-col items-center shadow-sm">
                                                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Tamanho</div>
                                                  <input type="text" value={data.status?.tamanho || ''} onChange={e => updateField('status.tamanho', e.target.value)} className="w-full text-center text-base font-bold bg-transparent outline-none mt-2" placeholder="Médio" />
                                              </div>
                                          </div>
      
                                          <div className="dnd-hp-card border-2 border-gray-300 rounded bg-white overflow-hidden shadow-sm">
                                              <div className="bg-gray-100 p-2 border-b flex justify-between items-center text-xs uppercase font-bold text-gray-600">Pontos de Vida <span className="font-normal text-[10px]">Máx: <input type="number" value={data.status?.pvMax} onChange={e => updateField('status.pvMax', parseInt(e.target.value)||0)} className="w-10 border-b outline-none bg-transparent font-bold text-right" /></span></div>
                                              <div className="p-4 text-center">
                                                  <input type="number" value={data.status?.pvAtual} onChange={e => updateField('status.pvAtual', parseInt(e.target.value)||0)} className="dnd-hp-current w-full text-center text-5xl font-black bg-transparent outline-none text-green-700" />
                                              </div>
                                              <div className="bg-gray-50 p-2 border-t flex justify-between items-center text-[10px] uppercase font-bold text-gray-500">Temporários <input type="number" value={data.status?.pvTemp} onChange={e => updateField('status.pvTemp', parseInt(e.target.value)||0)} className="w-12 text-center border-b outline-none bg-transparent text-sm text-black" /></div>
                                          </div>
      
                                          <div className="grid grid-cols-2 gap-2">
                                              <div className="dnd-small-stat border-2 border-gray-300 bg-white p-2 rounded flex flex-col shadow-sm">
                                                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-1 border-b pb-1">Dados de Vida</div>
                                                  <input type="text" value={data.status?.dadosVida} onChange={e => updateField('status.dadosVida', e.target.value)} className="w-full text-center text-lg font-bold bg-transparent outline-none mt-1" />
                                              </div>
                                              <div className="dnd-small-stat border-2 border-gray-300 bg-white p-2 rounded flex flex-col shadow-sm">
                                                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-1 border-b pb-1">Testes de Morte</div>
                                                  <div className="flex flex-col gap-1 mt-1">
                                                      <div className="flex justify-between items-center text-[10px]"><span className="text-gray-500 font-bold uppercase">Sucessos</span><div className="flex gap-1">{[0,1,2].map(i => <input key={'s'+i} type="checkbox" checked={data.testesMorte.sucessos[i]} onChange={e => { const v = [...data.testesMorte.sucessos]; v[i] = e.target.checked; updateField('testesMorte.sucessos', v); }} />)}</div></div>
                                                      <div className="flex justify-between items-center text-[10px]"><span className="text-gray-500 font-bold uppercase">Falhas</span><div className="flex gap-1">{[0,1,2].map(i => <input key={'f'+i} type="checkbox" checked={data.testesMorte.falhas[i]} onChange={e => { const v = [...data.testesMorte.falhas]; v[i] = e.target.checked; updateField('testesMorte.falhas', v); }} />)}</div></div>
                                                  </div>
                                              </div>
                                          </div>
      
                                          <div className="border border-gray-300 rounded bg-white shadow-sm p-2 min-w-0">
                                              <div className="flex justify-between items-center border-b pb-1 mb-2 gap-2">
                                                  <h3 className="font-bold text-sm uppercase text-gray-600">Ataques</h3>
                                                  <button onClick={() => addToArray('ataques', { nome: '', bonus: '', dano: '', tipo: '' })} className="dnd-add-btn shrink-0"><SVGIcons.Plus/> Adic.</button>
                                              </div>
                                              <div className="space-y-2 min-w-0">
                                                  {(data.ataques || []).map((atk, idx) => (
                                                      <div key={idx} className={`grid grid-cols-12 gap-1.5 items-end bg-gray-50 p-1.5 rounded border min-w-0 ${atk?.sourceItemId?'border-[#922610]/60':''}`}>
                                                          <div className="col-span-12 sm:col-span-5 min-w-0">
                                                              <div className="flex items-center justify-between gap-1"><label className="block text-[8px] uppercase font-bold text-gray-400 mb-0.5">Ataque</label>{atk?.sourceItemId && <span className="dnd-sync-badge">↔ item</span>}</div>
                                                              <input type="text" value={atk?.nome || ''} placeholder="Nome do ataque" onChange={e => updateArrayField('ataques', idx, 'nome', e.target.value)} className="w-full min-w-0 bg-transparent border-b outline-none text-xs font-bold" />
                                                          </div>
                                                          <div className="col-span-4 sm:col-span-2 min-w-0">
                                                              <label className="block text-[8px] uppercase font-bold text-gray-400 mb-0.5 text-center">Bônus</label>
                                                              <input type="text" value={atk?.bonus || ''} placeholder="+0" onChange={e => updateArrayField('ataques', idx, 'bonus', e.target.value)} className="w-full min-w-0 bg-transparent border-b outline-none text-xs text-center" />
                                                          </div>
                                                          <div className="col-span-4 sm:col-span-2 min-w-0">
                                                              <label className="block text-[8px] uppercase font-bold text-gray-400 mb-0.5 text-center">Dano</label>
                                                              <input type="text" value={atk?.dano || ''} placeholder="1d6" onChange={e => updateArrayField('ataques', idx, 'dano', e.target.value)} className="w-full min-w-0 bg-transparent border-b outline-none text-xs text-center font-bold" />
                                                          </div>
                                                          <div className="col-span-3 sm:col-span-2 min-w-0">
                                                              <label className="block text-[8px] uppercase font-bold text-gray-400 mb-0.5">Tipo</label>
                                                              <input type="text" value={atk?.tipo || ''} placeholder="Tipo" onChange={e => updateArrayField('ataques', idx, 'tipo', e.target.value)} className="w-full min-w-0 bg-transparent border-b outline-none text-[10px]" />
                                                          </div>
                                                          <div className="col-span-1 flex justify-end pb-0.5">
                                                              <button onClick={() => removeFromArray('ataques', idx)} className="text-red-500 hover:text-red-700 p-0.5" title={atk?.sourceItemId?'Remover ataque e desativar sincronização do item':'Remover ataque'}><SVGIcons.Trash/></button>
                                                          </div>
                                                      </div>
                                                  ))}
                                              </div>
                                          </div>
                                          
                                          <div className="dnd-section-card border border-gray-300 rounded bg-white shadow-sm p-2">
                                              <h3 className="dnd-section-head font-bold text-sm uppercase text-gray-600 border-b pb-1 mb-2">Inventário e Moedas</h3>
                                              <div className="grid grid-cols-5 gap-1 mb-2 text-center text-[10px] font-bold text-gray-500 uppercase">
                                                  <div><div className="bg-yellow-700/10 rounded mb-1">PC</div><input type="number" value={data.moedas.pc} onChange={e => updateField('moedas.pc', parseInt(e.target.value)||0)} className="w-full text-center border-b outline-none text-sm text-black" /></div>
                                                  <div><div className="bg-gray-400/10 rounded mb-1">PP</div><input type="number" value={data.moedas.pp} onChange={e => updateField('moedas.pp', parseInt(e.target.value)||0)} className="w-full text-center border-b outline-none text-sm text-black" /></div>
                                                  <div><div className="bg-blue-300/10 rounded mb-1">PE</div><input type="number" value={data.moedas.pe} onChange={e => updateField('moedas.pe', parseInt(e.target.value)||0)} className="w-full text-center border-b outline-none text-sm text-black" /></div>
                                                  <div><div className="bg-yellow-400/20 rounded mb-1">PO</div><input type="number" value={data.moedas.po} onChange={e => updateField('moedas.po', parseInt(e.target.value)||0)} className="w-full text-center border-b outline-none text-sm text-black" /></div>
                                                  <div><div className="bg-gray-300/30 rounded mb-1">PL</div><input type="number" value={data.moedas.pl} onChange={e => updateField('moedas.pl', parseInt(e.target.value)||0)} className="w-full text-center border-b outline-none text-sm text-black" /></div>
                                              </div>
                                              <div className="border-t pt-2 mt-2">
                                                  <div className="flex items-start justify-between gap-2 mb-2">
                                                      <div><div className="text-[10px] font-bold uppercase text-gray-600">Itens Sincronizados</div><div className="dnd-sync-hint">Cadastre itens de forma estruturada. Armas podem ser sincronizadas com Ataques; alterações feitas em qualquer um dos dois lados são mantidas juntas.</div></div>
                                                      <button type="button" onClick={addDndSyncedItem} className="dnd-add-btn shrink-0"><SVGIcons.Plus/> Item</button>
                                                  </div>
                                                  <div className="space-y-2">
                                                      {(!Array.isArray(data.itensSincronizados) || data.itensSincronizados.length===0) && <div className="text-[10px] italic text-gray-400 border border-dashed rounded p-2 text-center">Nenhum item sincronizado. O inventário livre abaixo continua disponível.</div>}
                                                      {(Array.isArray(data.itensSincronizados)?data.itensSincronizados:[]).map((it,idx)=><div key={it.syncId||idx} className={`dnd-sync-item ${it.sincronizarAtaque?'is-synced':''}`}>
                                                          <div className="grid grid-cols-[1fr_58px_100px_24px] gap-1 items-end">
                                                              <label className="min-w-0"><span className="block text-[8px] uppercase font-bold text-gray-400">Item</span><input value={it.nome||''} onChange={e=>updateDndSyncedItem(idx,{nome:e.target.value})} className="w-full min-w-0 bg-transparent border-b outline-none text-xs font-bold" placeholder="Nome"/></label>
                                                              <label><span className="block text-[8px] uppercase font-bold text-gray-400 text-center">Qtd.</span><input type="number" min="0" value={it.quantidade??1} onChange={e=>updateDndSyncedItem(idx,{quantidade:Number(e.target.value)})} className="w-full bg-transparent border-b outline-none text-xs text-center"/></label>
                                                              <label><span className="block text-[8px] uppercase font-bold text-gray-400">Tipo</span><select value={it.tipo||'Equipamento'} onChange={e=>updateDndSyncedItem(idx,{tipo:e.target.value})} className="w-full bg-transparent border-b outline-none text-[10px]"><option>Equipamento</option><option>Arma</option><option>Armadura</option><option>Escudo</option><option>Consumível</option><option>Ferramenta</option><option>Outro</option></select></label>
                                                              <button type="button" onClick={()=>removeDndSyncedItem(idx)} className="text-red-500 hover:text-red-700 pb-1" title="Remover item"><SVGIcons.Trash/></button>
                                                          </div>
                                                          {it.tipo==='Arma' && <div className="grid grid-cols-[70px_80px_1fr_auto] gap-1.5 items-end mt-2 pt-2 border-t">
                                                              <label><span className="block text-[8px] uppercase font-bold text-gray-400 text-center">Bônus</span><input value={it.bonusAtaque||''} onChange={e=>updateDndSyncedItem(idx,{bonusAtaque:e.target.value})} className="w-full bg-transparent border-b outline-none text-xs text-center" placeholder="+0"/></label>
                                                              <label><span className="block text-[8px] uppercase font-bold text-gray-400 text-center">Dano</span><input value={it.dano||''} onChange={e=>updateDndSyncedItem(idx,{dano:e.target.value})} className="w-full bg-transparent border-b outline-none text-xs text-center font-bold" placeholder="1d8"/></label>
                                                              <label><span className="block text-[8px] uppercase font-bold text-gray-400">Tipo de dano</span><input value={it.tipoDano||''} onChange={e=>updateDndSyncedItem(idx,{tipoDano:e.target.value})} className="w-full bg-transparent border-b outline-none text-xs" placeholder="Cortante"/></label>
                                                              <label className="flex items-center gap-1 text-[9px] font-bold cursor-pointer pb-1 whitespace-nowrap"><input type="checkbox" checked={!!it.sincronizarAtaque} onChange={e=>updateDndSyncedItem(idx,{sincronizarAtaque:e.target.checked})}/><span>↔ Ataques</span></label>
                                                          </div>}
                                                          <input value={it.notas||''} onChange={e=>updateDndSyncedItem(idx,{notas:e.target.value})} className="w-full bg-transparent border-b outline-none text-[10px] mt-1" placeholder="Notas do item (opcional)"/>
                                                          {it.sincronizarAtaque && <div className="dnd-sync-badge mt-1">↔ sincronizado com Ataques</div>}
                                                      </div>)}
                                                  </div>
                                              </div>
                                              <label className="block mt-2"><span className="text-[9px] font-bold uppercase text-gray-500">Inventário livre / anotações</span><textarea rows="3" value={data.inventario} onChange={e => updateField('inventario', e.target.value)} className="w-full border rounded p-2 text-xs bg-gray-50 resize-y outline-none mt-1" placeholder="Equipamento antigo, tesouro, observações ou itens que você prefere manter em texto..."></textarea></label>
                                          </div>
                                      </div>
      
                                      {/* D&D Col 3: Roleplay e Magias */}
                                      <div className={`${mobileTab === 'recursos' ? 'block' : 'hidden md:block'} dnd-column space-y-4`}>
                                          <div className="dnd-traits-card dnd-section-card border border-gray-300 rounded bg-white shadow-sm p-2 space-y-2">
                                              <div className="dnd-section-head text-sm border-b pb-1">Aparência, História & Personalidade</div>
                                              <label className="dnd-profile-card"><span>Aparência</span><textarea rows="3" value={data.bio?.aparencia || ''} onChange={e => updateField('bio.aparencia', e.target.value)} placeholder="Descrição visual, marcas, roupas, símbolos..."></textarea></label>
                                              <label className="dnd-profile-card"><span>História & Personalidade</span><textarea rows="5" value={data.bio?.historiaPersonalidade || ''} onChange={e => updateField('bio.historiaPersonalidade', e.target.value)} placeholder="Passado, motivações, hábitos e detalhes de interpretação..."></textarea></label>
                                              <details className="dnd-legacy-roleplay">
                                                  <summary>Detalhes clássicos de interpretação</summary>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                      <div><textarea rows="2" value={data.tracosPersonalidade} onChange={e => updateField('tracosPersonalidade', e.target.value)} placeholder="Traços de Personalidade..."></textarea></div>
                                                      <div><textarea rows="2" value={data.ideais} onChange={e => updateField('ideais', e.target.value)} placeholder="Ideais..."></textarea></div>
                                                      <div><textarea rows="2" value={data.vinculos} onChange={e => updateField('vinculos', e.target.value)} placeholder="Vínculos..."></textarea></div>
                                                      <div><textarea rows="2" value={data.defeitos} onChange={e => updateField('defeitos', e.target.value)} placeholder="Defeitos..."></textarea></div>
                                                  </div>
                                              </details>
                                          </div>

                                          <div className="dnd-section-card border border-gray-300 rounded bg-white shadow-sm overflow-hidden">
                                              <div className="dnd-tabbar flex border-b bg-gray-100">
                                                  <button type="button" onClick={() => setDndPcTab('caracteristicas')} className={`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold uppercase transition-colors ${dndPcTab === 'caracteristicas' ? 'dnd-tab-active bg-[#922610] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>Características & Talentos</button>
                                                  <button type="button" onClick={() => setDndPcTab('magias')} className={`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold uppercase transition-colors ${dndPcTab === 'magias' ? 'dnd-tab-active bg-[#922610] text-white' : 'text-gray-600 hover:bg-gray-200'}`}>Magias</button>
                                              </div>
      
                                              {dndPcTab === 'caracteristicas' ? (
                                                  <div className="p-2">
                                                      <div className="dnd-feature-groups space-y-3">
                                                          {dndFeatureGroups.map(group => {
                                                              const entries = (Array.isArray(data.caracteristicas) ? data.caracteristicas : []).map((carac, originalIndex) => ({ ...carac, originalIndex })).filter(carac => (carac.tipo || 'classe') === group.id);
                                                              return (
                                                                  <section key={group.id} className="dnd-feature-group">
                                                                      <div className="dnd-feature-group-head">
                                                                          <span>{group.label}</span>
                                                                          <button type="button" onClick={() => addToArray('caracteristicas', { tipo: group.id, nome: '', desc: '' })} className="dnd-add-btn"><SVGIcons.Plus/> Adic.</button>
                                                                      </div>
                                                                      <div className="space-y-2 p-2">
                                                                          {entries.length === 0 && <p className="text-[10px] italic text-gray-400 py-1">Nenhum registro nesta categoria.</p>}
                                                                          {entries.map(carac => (
                                                                              <div key={carac.originalIndex} className="dnd-feature-card border rounded bg-gray-50 p-2 flex gap-2 items-start">
                                                                                  <div className="flex-1 space-y-1">
                                                                                      <div className="grid grid-cols-[1fr_110px] gap-2">
                                                                                          <input type="text" value={carac?.nome || ''} onChange={e => updateArrayField('caracteristicas', carac.originalIndex, 'nome', e.target.value)} className="w-full bg-transparent border-b outline-none text-xs font-bold" placeholder="Nome do recurso" />
                                                                                          <select value={carac?.tipo || 'classe'} onChange={e => updateArrayField('caracteristicas', carac.originalIndex, 'tipo', e.target.value)} className="dnd-feature-type border rounded px-1 text-[9px] font-bold">
                                                                                              <option value="classe">Classe</option><option value="especie">Espécie</option><option value="talento">Talento</option><option value="outro">Outro</option>
                                                                                          </select>
                                                                                      </div>
                                                                                      <textarea rows="2" value={carac?.desc || ''} onChange={e => updateArrayField('caracteristicas', carac.originalIndex, 'desc', e.target.value)} className="w-full bg-transparent outline-none text-xs resize-y" placeholder="Descrição, uso, limite, efeito..." />
                                                                                  </div>
                                                                                  <button type="button" onClick={() => removeFromArray('caracteristicas', carac.originalIndex)} className="text-red-500 hover:text-red-700"><SVGIcons.Trash/></button>
                                                                              </div>
                                                                          ))}
                                                                      </div>
                                                                  </section>
                                                              );
                                                          })}
                                                      </div>
                                                  </div>
                                              ) : (
                                                  <div className="p-2">
                                                      <div className="grid grid-cols-3 gap-2 mb-3">
                                                          <label className="dnd-small-stat border rounded bg-gray-50 p-1.5 text-center"><span className="block text-[8px] uppercase font-bold text-gray-500">Habilidade Chave</span><input value={data.magias?.conjuracao?.habilidade||''} onChange={e=>updateField('magias.conjuracao.habilidade',e.target.value)} className="w-full bg-transparent outline-none text-center text-xs font-bold" placeholder="INT/SAB/CAR"/></label>
                                                          <label className="dnd-small-stat border rounded bg-gray-50 p-1.5 text-center"><span className="block text-[8px] uppercase font-bold text-gray-500">CD do TR</span><input value={data.magias?.conjuracao?.cd||''} onChange={e=>updateField('magias.conjuracao.cd',e.target.value)} className="w-full bg-transparent outline-none text-center text-sm font-bold" placeholder="13"/></label>
                                                          <label className="dnd-small-stat border rounded bg-gray-50 p-1.5 text-center"><span className="block text-[8px] uppercase font-bold text-gray-500">Ataque de Magia</span><input value={data.magias?.conjuracao?.ataque||''} onChange={e=>updateField('magias.conjuracao.ataque',e.target.value)} className="w-full bg-transparent outline-none text-center text-sm font-bold" placeholder="+5"/></label>
                                                      </div>
                                                      <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Espaços de Magia — Atual / Máx.</div>
                                                      <div className="grid grid-cols-3 gap-1 mb-3">
                                                          {[1,2,3,4,5,6,7,8,9].map(lvl => {
                                                              const slot = data.magias?.slots?.[lvl] || { atual: 0, max: 0 };
                                                              return (
                                                                  <div key={lvl} className="dnd-spell-slot flex border rounded overflow-hidden text-[9px] bg-gray-50">
                                                                      <div className="bg-gray-200 px-1 py-1 font-bold text-gray-700 flex items-center justify-center border-r">N{lvl}</div>
                                                                      <input type="number" min="0" value={slot.atual ?? 0} onChange={e => updateField(`magias.slots.${lvl}.atual`, parseInt(e.target.value)||0)} className="w-7 text-center outline-none bg-transparent" />
                                                                      <span className="text-gray-400 py-1">/</span>
                                                                      <input type="number" min="0" value={slot.max ?? 0} onChange={e => updateField(`magias.slots.${lvl}.max`, parseInt(e.target.value)||0)} className="w-7 text-center outline-none bg-transparent font-bold text-[#922610]" />
                                                                  </div>
                                                              );
                                                          })}
                                                      </div>
                                                      <div className="flex justify-between items-center border-t pt-2 mb-2">
                                                          <span className="text-[10px] text-gray-500">Lista de magias conhecidas/preparadas.</span>
                                                          <button type="button" onClick={() => { const list = Array.isArray(data.magias?.lista) ? data.magias.lista : []; updateField('magias.lista', [...list, { nome: '', nivel: '', tempo: '', alcance: '', concentracao: false, ritual: false, material: false, desc: '' }]); }} className="dnd-add-btn"><SVGIcons.Plus/> Adic.</button>
                                                      </div>
                                                      <div className="space-y-2">
                                                          {(!Array.isArray(data.magias?.lista) || data.magias.lista.length === 0) && <p className="text-[10px] italic text-gray-400 py-2">Nenhuma magia adicionada.</p>}
                                                          {(Array.isArray(data.magias?.lista) ? data.magias.lista : []).map((magia, idx) => (
                                                              <div key={idx} className="dnd-spell-row border rounded bg-gray-50 p-2 flex gap-2 items-start">
                                                                  <div className="flex-1">
                                                                      <div className="flex gap-2 mb-1">
                                                                          <input type="text" value={magia?.nome || ''} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], nome:e.target.value}; updateField('magias.lista', list); }} className="flex-1 min-w-0 bg-transparent border-b outline-none text-xs font-bold" placeholder="Nome da magia" />
                                                                          <input type="text" value={magia?.nivel || ''} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], nivel:e.target.value}; updateField('magias.lista', list); }} className="w-16 bg-transparent border-b outline-none text-[10px] text-center" placeholder="Nível" />
                                                                      </div>
                                                                      <div className="dnd-spell-meta">
                                                                          <label><span>Tempo</span><input type="text" value={magia?.tempo || ''} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], tempo:e.target.value}; updateField('magias.lista', list); }} placeholder="1 ação" /></label>
                                                                          <label><span>Alcance</span><input type="text" value={magia?.alcance || ''} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], alcance:e.target.value}; updateField('magias.lista', list); }} placeholder="18 m" /></label>
                                                                          <label className="dnd-spell-flag"><input type="checkbox" checked={!!magia?.concentracao} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], concentracao:e.target.checked}; updateField('magias.lista', list); }} /><span>C</span></label>
                                                                          <label className="dnd-spell-flag"><input type="checkbox" checked={!!magia?.ritual} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], ritual:e.target.checked}; updateField('magias.lista', list); }} /><span>R</span></label>
                                                                          <label className="dnd-spell-flag"><input type="checkbox" checked={!!magia?.material} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], material:e.target.checked}; updateField('magias.lista', list); }} /><span>M</span></label>
                                                                      </div>
                                                                      <textarea rows="2" value={magia?.desc || ''} onChange={e => { const list=[...data.magias.lista]; list[idx]={...list[idx], desc:e.target.value}; updateField('magias.lista', list); }} className="w-full bg-transparent outline-none text-xs resize-y mt-1" placeholder="Anotações, material necessário, duração ou efeito..." />
                                                                  </div>
                                                                  <button type="button" onClick={() => { const list=data.magias.lista.filter((_,i)=>i!==idx); updateField('magias.lista', list); }} className="text-red-500 hover:text-red-700"><SVGIcons.Trash/></button>
                                                              </div>
                                                          ))}
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
      
                                          <div className="dnd-section-card border border-gray-300 rounded bg-white shadow-sm p-2 flex flex-col gap-2">
                                              <h3 className="dnd-section-head font-bold text-sm uppercase text-gray-600 border-b pb-1">Equipamento, Treino & Proficiências</h3>
                                              <div className="dnd-training-grid">
                                                  {[['leve','Leve'],['media','Média'],['pesada','Pesada'],['escudos','Escudos']].map(([key,label]) => <label key={key}><input type="checkbox" checked={!!data.treinoArmadura?.[key]} onChange={e => updateField('treinoArmadura.' + key, e.target.checked)} /><span>{label}</span></label>)}
                                              </div>
                                              <label className="dnd-profile-card"><span>Armas</span><textarea rows="2" value={data.armasProficiencias || ''} onChange={e => updateField('armasProficiencias', e.target.value)} placeholder="Armas simples, marciais, tipos específicos..."></textarea></label>
                                              <label className="dnd-profile-card"><span>Ferramentas</span><textarea rows="2" value={data.ferramentas || ''} onChange={e => updateField('ferramentas', e.target.value)} placeholder="Ferramentas, kits, instrumentos, veículos..."></textarea></label>
                                              <label className="dnd-profile-card"><span>Idiomas</span><textarea rows="2" value={data.idiomas || ''} onChange={e => updateField('idiomas', e.target.value)} placeholder="Comum, Élfico, Dracônico..."></textarea></label>
                                              <details className="dnd-legacy-roleplay"><summary>Notas antigas de proficiência</summary><textarea rows="2" value={data.outrasProficiencias} onChange={e => updateField('outrasProficiencias', e.target.value)} className="w-full mt-2" /></details>
                                          </div>

                                          <div className="dnd-section-card border border-gray-300 rounded bg-white shadow-sm p-2">
                                              <h3 className="dnd-section-head font-bold text-sm uppercase text-gray-600 border-b pb-1 mb-2">Sintonização de Item Mágico</h3>
                                              <div className="dnd-attunement-list">
                                                  {dndAttunements.map((item, idx) => <label key={idx}><span>✦</span><input value={item} onChange={e => { const list=[...dndAttunements]; list[idx]=e.target.value; updateField('sintonizacao', list); }} placeholder={'Item sintonizado ' + (idx + 1)} /></label>)}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  </div>
                              </div>
                          )}
    </>
  );
}
