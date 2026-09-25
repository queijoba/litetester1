// Extraído automaticamente do antigo PJLiteApp monolítico.
// Este arquivo agora é a fonte visual do editor deste sistema.
export default function DragonbaneEditor({ scope }) {
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
      {!isDnd && !isFabula && !isSom6 && (
                              data.type === 'pc' ? (
                                  <React.Fragment>
                                      {/* Mobile Tabs for PC */}
                                      <div className="md:hidden flex bg-gray-200 border-b border-gray-300">
                                          {[ { id: 'status', label: 'Perfil & Status' }, { id: 'pericias', label: 'Perícias' }, { id: 'equipamento', label: 'Combate & Equip' } ].map(tab => (
                                              <button key={tab.id} onClick={() => setMobileTab(tab.id)} className={`flex-1 py-3 text-xs font-bold uppercase text-center border-b-4 transition-colors ${mobileTab === tab.id ? 'border-red-700 text-red-900 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-300'}`}>{tab.label}</button>
                                          ))}
                                      </div>
      
                                      <div className="db-paper db-sheet p-3 md:p-5 space-y-4">
                                          <div className="db-brand">
                                              <div className="db-brand-line"></div>
                                              <div>
                                                  <div className="db-logo"><span>Dragon</span><span>Bane</span></div>
                                                  <div className="db-brand-sub">Ficha de Personagem • teste visual PJ Lite</div>
                                              </div>
                                              <div className="db-brand-line"></div>
                                          </div>
      
                                          {/* Biografia PC */}
                                          <div className={`db-bio flex flex-col md:flex-row gap-4 items-start ${mobileTab === 'status' ? 'block' : 'hidden md:flex'}`}>
                                              <div className="flex flex-col items-center gap-2 mx-auto md:mx-0 w-full md:w-auto">
                                                  <div className="db-portrait w-36 h-36 md:w-40 md:h-40 shrink-0 relative group overflow-hidden flex flex-col items-center justify-center">
                                                      {data.bio?.imagem ? ( <img src={data.bio.imagem} alt="Avatar" className="w-full h-full object-cover" /> ) : ( <span className="text-gray-400 text-sm font-bold uppercase text-center px-4">Retrato</span> )}
                                                      
                                                      <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 transition-opacity ${showUrlInput ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100 active:opacity-100'}`}>
                                                          {!showUrlInput ? (
                                                              <React.Fragment>
                                                                  <label className="cursor-pointer bg-white text-black px-4 py-2 rounded text-sm font-bold hover:bg-gray-200 w-28 text-center shadow-lg">Upload<input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files[0]; e.target.value=''; if (!file) return; try { updateField('bio.imagem', await optimizeImageFile(file, 720, 0.82)); } catch(err) { console.error(err); showToast('Não foi possível usar esta imagem.'); } }} /></label>
                                                                  <button onClick={() => setShowUrlInput(true)} className="bg-white text-black px-4 py-2 rounded text-sm font-bold hover:bg-gray-200 w-28 text-center shadow-lg">Usar URL</button>
                                                                  {data.bio?.imagem && ( <button onClick={() => updateField('bio.imagem', '')} className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 w-28 text-center mt-2 shadow-lg">Remover</button> )}
                                                              </React.Fragment>
                                                          ) : (
                                                              <div className="flex flex-col gap-2 w-full px-4 items-center">
                                                                  <input type="text" placeholder="Cole a URL aqui" value={tempUrl} onChange={e => setTempUrl(e.target.value)} className="w-full p-2 text-sm outline-none rounded text-black border-2 border-white" />
                                                                  <div className="flex gap-2 mt-1">
                                                                      <button onClick={() => { if (tempUrl) { updateField('bio.imagem', tempUrl); setTempUrl(''); setShowUrlInput(false); } }} className="bg-green-600 text-white px-4 py-1.5 text-sm rounded font-bold hover:bg-green-700 shadow-lg">OK</button>
                                                                      <button onClick={() => { setShowUrlInput(false); setTempUrl(''); }} className="bg-gray-500 text-white px-4 py-1.5 text-sm rounded font-bold hover:bg-gray-600 shadow-lg">Voltar</button>
                                                                  </div>
                                                              </div>
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                              
                                              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                  <div className="sm:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase">Nome do Personagem</label><input type="text" value={data.bio?.nome} onChange={e => updateField('bio.nome', e.target.value)} className="w-full text-2xl md:text-3xl font-title font-bold border-b-2 border-gray-400 focus:border-red-600 outline-none bg-transparent" /></div>
                                                  <div className="sm:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase">Jogador</label><input type="text" value={data.bio?.jogador} onChange={e => updateField('bio.jogador', e.target.value)} className="w-full text-xl md:text-2xl font-title border-b-2 border-gray-400 focus:border-red-600 outline-none bg-transparent" /></div>
                                                  <div><label className="block text-xs font-bold text-gray-500 uppercase">Ancestralidade</label><input type="text" value={data.bio?.ancestralidade} onChange={e => handleAncestryChange(e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent" /></div>
                                                  <div><label className="block text-xs font-bold text-gray-500 uppercase">Profissão</label><input type="text" value={data.bio?.profissao} onChange={e => updateField('bio.profissao', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent" /></div>
                                                  <div><label className="block text-xs font-bold text-gray-500 uppercase">Idade</label><input type="text" value={data.bio?.idade} onChange={e => updateField('bio.idade', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent" /></div>
                                                  <div><label className="block text-xs font-bold text-gray-500 uppercase">Fraqueza</label><input type="text" value={data.bio?.fraqueza} onChange={e => updateField('bio.fraqueza', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent" /></div>
                                                  <div className="sm:col-span-2 lg:col-span-4"><label className="block text-xs font-bold text-gray-500 uppercase">Aparência</label><input type="text" value={data.bio?.aparencia} onChange={e => updateField('bio.aparencia', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent" /></div>
                                              </div>
                                          </div>
      
                                          <div className={`${mobileTab === 'status' ? 'block' : 'hidden md:block'}`}>
                                              <div className="db-attributes-strip">
                                                  {Object.keys(data.atributos || {}).map(attr => (
                                                      <div key={`strip-${attr}`} className="db-attr-medallion">
                                                          <div className="db-attr-circle">
                                                              <span className="db-attr-name">{attr}</span>
                                                              <input type="number" value={data.atributos[attr].valor} onChange={e => handleAttributeChange(attr, parseInt(e.target.value)||0)} />
                                                          </div>
                                                          <label className={`db-condition ${data.atributos[attr].condicao ? 'active' : ''}`}>
                                                              <input type="checkbox" checked={data.atributos[attr].condicao} onChange={e => updateField(`atributos.${attr}.condicao`, e.target.checked)} className="cursor-pointer" />
                                                              {{ for: 'Exausto', con: 'Adoecido', agl: 'Aturdido', int: 'Enraivecido', von: 'Assustado', car: 'Desanimado' }[attr]}
                                                          </label>
                                                      </div>
                                                  ))}
                                              </div>
                                              <div className="db-derived-strip">
                                                  <div className="db-derived-box"><span>Dano Bônus FOR</span><input value={data.derivados?.danoBonusFor} onChange={e=>updateField('derivados.danoBonusFor',e.target.value)} /></div>
                                                  <div className="db-derived-box"><span>Dano Bônus AGL</span><input value={data.derivados?.danoBonusAgl} onChange={e=>updateField('derivados.danoBonusAgl',e.target.value)} /></div>
                                                  <div className="db-derived-box"><span>Movimento</span><input value={data.derivados?.movimento} onChange={e=>updateField('derivados.movimento',e.target.value)} /></div>
                                                  <div className="db-derived-box"><span>Limite de Sobrecarga</span><input value={data.derivados?.limiteSobrecarga} onChange={e=>updateField('derivados.limiteSobrecarga',e.target.value)} /></div>
                                              </div>
                                          </div>
      
                                          {/* Grades e Blocos PC */}
                                          <div className="db-layout grid grid-cols-1 lg:grid-cols-12">
                                              <div className={`db-column lg:col-span-4 xl:col-span-3 space-y-4 min-w-0 ${mobileTab === 'status' ? 'block' : 'hidden md:block'}`}>
                                                  <div className="hidden">
                                                      <h2 style={getBarStyle()} className="font-title font-bold text-lg bg-dragon-dark text-white text-center py-1 mb-3 rounded-sm">ATRIBUTOS E CONDIÇÕES</h2>
                                                      <div className="grid grid-cols-2 gap-4">
                                                          {Object.keys(data.atributos || {}).map(attr => (
                                                              <div key={attr} className="border-2 border-gray-300 p-2 text-center rounded bg-gray-50 relative">
                                                                  <div className="font-title font-bold text-xl uppercase text-red-800">{attr}</div>
                                                                  <input type="number" value={data.atributos[attr].valor} onChange={e => handleAttributeChange(attr, parseInt(e.target.value)||0)} className="w-full text-center text-2xl font-bold bg-transparent outline-none mb-2" />
                                                                  <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs">
                                                                      <input type="checkbox" checked={data.atributos[attr].condicao} onChange={e => updateField(`atributos.${attr}.condicao`, e.target.checked)} className="cursor-pointer" />
                                                                      <label className={`uppercase font-bold ${data.atributos[attr].condicao ? 'text-red-600' : 'text-gray-500'}`}>{{ for: 'Exausto', con: 'Adoecido', agl: 'Aturdido', int: 'Enraivecido', von: 'Assustado', car: 'Desanimado' }[attr]}</label>
                                                                  </div>
                                                              </div>
                                                          ))}
                                                      </div>
                                                  </div>
      
                                                  <div className="hidden">
                                                      <div className="flex justify-between items-center mb-1">
                                                          <h2 className="font-title font-bold text-lg">VALORES DERIVADOS</h2>
                                                          <div className="flex gap-1">
                                                              <button onClick={() => updateField('status.manterDerivados', !data.status?.manterDerivados)} className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-sm font-bold uppercase transition-colors ${data.status?.manterDerivados ? 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                                                                  {data.status?.manterDerivados ? <SVGIcons.Lock /> : <SVGIcons.Unlock />} {data.status?.manterDerivados ? 'Mantendo' : 'Manter'}
                                                              </button>
                                                          </div>
                                                      </div>
                                                      <div className="grid grid-cols-2 gap-2 text-sm font-bold uppercase">
                                                          <div className="border border-gray-300 p-2 flex flex-col justify-between"><span className="text-gray-500 text-[10px] leading-tight mb-1">Dano Bônus FOR</span><input type="text" value={data.derivados?.danoBonusFor} onChange={e => updateField('derivados.danoBonusFor', e.target.value)} className="w-full border-b border-gray-300 outline-none text-center" /></div>
                                                          <div className="border border-gray-300 p-2 flex flex-col justify-between"><span className="text-gray-500 text-[10px] leading-tight mb-1">Dano Bônus AGL</span><input type="text" value={data.derivados?.danoBonusAgl} onChange={e => updateField('derivados.danoBonusAgl', e.target.value)} className="w-full border-b border-gray-300 outline-none text-center" /></div>
                                                          <div className="border border-gray-300 p-2 flex flex-col justify-between"><span className="text-gray-500 text-[10px] leading-tight mb-1">Movimento</span><input type="text" value={data.derivados?.movimento} onChange={e => updateField('derivados.movimento', e.target.value)} className="w-full border-b border-gray-300 outline-none text-center" /></div>
                                                          <div className="border border-gray-300 p-2 flex flex-col justify-between"><span className="text-gray-500 text-[10px] leading-tight mb-1">Lim. Sobrecarga</span><input type="text" value={data.derivados?.limiteSobrecarga} onChange={e => updateField('derivados.limiteSobrecarga', e.target.value)} className="w-full border-b border-gray-300 outline-none text-center" /></div>
                                                      </div>
                                                  </div>
      
                                                  <div className="grid grid-cols-2 gap-2">
                                                      <div className="db-resource-life border-2 p-2 flex flex-col items-center justify-center text-center">
                                                          <div className="font-title font-bold text-red-900 text-[10px] md:text-[11px] leading-tight uppercase">PONTOS DE VIDA</div>
                                                          <div className="flex items-center justify-center gap-1 mt-2">
                                                              <input type="number" value={data.status?.pv.atual} onChange={e => updateField('status.pv.atual', parseInt(e.target.value)||0)} className="w-8 xl:w-10 text-center text-lg xl:text-xl font-bold border-b-2 border-red-300 bg-transparent outline-none" />
                                                              <span className="text-lg xl:text-xl">/</span>
                                                              <input type="number" value={data.status?.pv.max} onChange={e => updateField('status.pv.max', parseInt(e.target.value)||0)} className="w-8 xl:w-10 text-center text-lg xl:text-xl font-bold border-b-2 border-red-300 bg-transparent outline-none" />
                                                          </div>
                                                      </div>
                                                      <div className="db-resource-will border-2 p-2 flex flex-col items-center justify-center text-center">
                                                          <div className="font-title font-bold text-blue-900 text-[10px] md:text-[11px] leading-tight uppercase">PONTOS DE DET.</div>
                                                          <div className="flex items-center justify-center gap-1 mt-1">
                                                              <input type="number" value={data.status?.pd.atual} onChange={e => updateField('status.pd.atual', parseInt(e.target.value)||0)} className="w-8 xl:w-10 text-center text-lg xl:text-xl font-bold border-b-2 border-blue-300 bg-transparent outline-none" />
                                                              <span className="text-lg xl:text-xl">/</span>
                                                              <input type="number" value={data.status?.pd.max} onChange={e => updateField('status.pd.max', parseInt(e.target.value)||0)} className="w-8 xl:w-10 text-center text-lg xl:text-xl font-bold border-b-2 border-blue-300 bg-transparent outline-none" />
                                                          </div>
                                                      </div>
                                                  </div>
      
                                                  <div className="db-death-box border p-3">
                                                      <div className="font-title font-bold text-center text-sm mb-2">TESTES DE MORTE</div>
                                                      <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold uppercase text-gray-500">Sucessos</span><div className="flex gap-2">{[0, 1, 2].map(i => <input key={`suc-${i}`} type="checkbox" checked={data.status?.testesMorte.sucessos[i]} onChange={e => { const newArr = [...data.status.testesMorte.sucessos]; newArr[i] = e.target.checked; updateField('status.testesMorte.sucessos', newArr); }} className="w-4 h-4 cursor-pointer" />)}</div></div>
                                                      <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase text-gray-500">Falhas</span><div className="flex gap-2">{[0, 1, 2].map(i => <input key={`fal-${i}`} type="checkbox" checked={data.status?.testesMorte.falhas[i]} onChange={e => { const newArr = [...data.status.testesMorte.falhas]; newArr[i] = e.target.checked; updateField('status.testesMorte.falhas', newArr); }} className="w-4 h-4 cursor-pointer" />)}</div></div>
                                                  </div>
      
                                                  {/* Desktop: Combate e Inventário ficam logo abaixo dos Testes de Morte */}
                                                  <div className="hidden lg:block space-y-4 db-combat-desktop-slot">
                                                  <div>
                                                      <h2 style={getBarStyle()} className="db-section-title font-title font-bold text-base bg-dragon-dark text-white text-center py-1 mb-2">COMBATE</h2>
                                                      <div className="space-y-3 mb-4">
                                                          <div className="db-armor-card border p-2 space-y-1">
                                                              <div className="flex gap-2 items-end">
                                                                  <div className="flex-1"><label className="block text-[10px] font-bold text-gray-500 uppercase">Armadura</label><input type="text" value={data.defesa?.armadura.nome} onChange={e => updateField('defesa.armadura.nome', e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold border-b border-gray-300" /></div>
                                                                  <div className="w-14 shrink-0"><label className="block text-[10px] font-bold text-gray-500 uppercase text-center">Val.</label><input type="text" value={data.defesa?.armadura.valor} onChange={e => updateField('defesa.armadura.valor', e.target.value)} className="w-full bg-transparent outline-none text-sm text-center font-bold border-b border-gray-300" /></div>
                                                              </div>
                                                              <input type="text" value={data.defesa?.armadura.reves} onChange={e => updateField('defesa.armadura.reves', e.target.value)} className="w-full bg-transparent outline-none text-[11px] text-gray-600 italic border-b border-gray-200" placeholder="Revés..." />
                                                          </div>
      
                                                          <div className="db-armor-card border p-2 space-y-1">
                                                              <div className="flex gap-2 items-end">
                                                                  <div className="flex-1"><label className="block text-[10px] font-bold text-gray-500 uppercase">Elmo</label><input type="text" value={data.defesa?.elmo.nome} onChange={e => updateField('defesa.elmo.nome', e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold border-b border-gray-300" /></div>
                                                                  <div className="w-12"><label className="block text-[10px] font-bold text-gray-500 uppercase text-center">Val.</label><input type="text" value={data.defesa?.elmo.valor} onChange={e => updateField('defesa.elmo.valor', e.target.value)} className="w-full bg-transparent outline-none text-sm text-center font-bold border-b border-gray-300" /></div>
                                                              </div>
                                                              <input type="text" value={data.defesa?.elmo.reves} onChange={e => updateField('defesa.elmo.reves', e.target.value)} className="w-full bg-transparent outline-none text-[11px] text-gray-600 italic border-b border-gray-200" placeholder="Revés..." />
                                                          </div>
                                                      </div>
      
                                                      <div className="mb-6">
                                                          <div className="flex justify-between items-center bg-gray-200 py-1 px-3 mb-2 rounded-sm border border-gray-300">
                                                              <h3 className="font-title font-bold text-sm text-gray-700">ARMAS</h3>
                                                              <button onClick={() => addToArray('armas', { nome: '', empunhadura: '', alcance: '', dano: '', tracos: '' })} className="db-add-btn db-add-neutral"><SVGIcons.Plus/> Adic.</button>
                                                          </div>
                                                          <div className="space-y-3">
                                                              {(data.armas || []).map((arma, index) => (
                                                                  <div key={index} className="db-weapon-card border p-2 shadow-sm flex flex-col gap-2">
                                                                      <div className="flex gap-2 items-end">
                                                                          <div className="flex-1"><label className="block text-[9px] font-bold text-gray-500 uppercase">Arma / Escudo</label><input type="text" value={arma.nome} onChange={e => updateArrayField('armas', index, 'nome', e.target.value)} className="w-full border-b border-gray-400 outline-none text-sm font-bold bg-transparent"/></div>
                                                                          <button onClick={() => removeFromArray('armas', index)} className="text-red-500 hover:text-red-700 mb-1"><SVGIcons.Trash/></button>
                                                                      </div>
                                                                      <div className="grid grid-cols-3 gap-2">
                                                                          <div><label className="text-[9px] font-bold text-gray-500 uppercase">Empunh.</label><input type="text" value={arma.empunhadura} onChange={e => updateArrayField('armas', index, 'empunhadura', e.target.value)} className="w-full border-b border-gray-300 outline-none text-xs bg-transparent"/></div>
                                                                          <div><label className="text-[9px] font-bold text-gray-500 uppercase">Alcance</label><input type="text" value={arma.alcance} onChange={e => updateArrayField('armas', index, 'alcance', e.target.value)} className="w-full border-b border-gray-300 outline-none text-xs bg-transparent"/></div>
                                                                          <div><label className="text-[9px] font-bold text-gray-500 uppercase">Dano</label><input type="text" value={arma.dano} onChange={e => updateArrayField('armas', index, 'dano', e.target.value)} className="w-full border-b border-gray-300 outline-none text-xs bg-transparent font-bold"/></div>
                                                                      </div>
                                                                      <textarea rows="1" value={arma.tracos} onChange={e => updateArrayField('armas', index, 'tracos', e.target.value)} className="w-full border border-gray-200 rounded outline-none text-xs bg-white p-1 resize-y" placeholder="Traços..."></textarea>
                                                                  </div>
                                                              ))}
                                                          </div>
                                                      </div>
      
                                                      <h2 style={getBarStyle()} className="db-section-title font-title font-bold text-base bg-dragon-dark text-white text-center py-1 mb-3 mt-5">INVENTÁRIO</h2>
                                                      
                                                      <div className="grid grid-cols-3 gap-2 mb-3">
                                                          <div className="db-money-gold border-2 rounded flex flex-col items-center justify-center p-2 shadow-sm"><label className="text-[10px] font-bold text-yellow-700 uppercase mb-1">Ouro</label><input type="number" value={data.moedas?.ouro} onChange={e => updateField('moedas.ouro', parseInt(e.target.value) || 0)} className="w-full bg-transparent text-center font-title font-bold text-xl outline-none text-yellow-900" /></div>
                                                          <div className="db-money-silver border-2 rounded flex flex-col items-center justify-center p-2 shadow-sm"><label className="text-[10px] font-bold text-gray-500 uppercase mb-1">Prata</label><input type="number" value={data.moedas?.prata} onChange={e => updateField('moedas.prata', parseInt(e.target.value) || 0)} className="w-full bg-transparent text-center font-title font-bold text-xl outline-none text-gray-800" /></div>
                                                          <div className="db-money-copper border-2 rounded flex flex-col items-center justify-center p-2 shadow-sm"><label className="text-[10px] font-bold text-orange-800 uppercase mb-1">Cobre</label><input type="number" value={data.moedas?.cobre} onChange={e => updateField('moedas.cobre', parseInt(e.target.value) || 0)} className="w-full bg-transparent text-center font-title font-bold text-xl outline-none text-orange-900" /></div>
                                                      </div>
      
                                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 mt-2">Equipamento</label>
                                                      <textarea rows="6" value={data.inventario} onChange={e => updateField('inventario', e.target.value)} className="db-inventory-box w-full border-2 p-2 text-sm outline-none resize-y mb-3"></textarea>
                                                      
                                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Itens Miúdos</label>
                                                      <textarea rows="3" value={data.itensMiudos || ''} onChange={e => updateField('itensMiudos', e.target.value)} className="db-inventory-box w-full border-2 p-2 text-sm outline-none resize-y"></textarea>
      
                                                      <div className="mt-4 pb-10 md:pb-0">
                                                          <label className="block text-xs font-bold text-gray-500 uppercase">Memento (Item Especial)</label>
                                                          <input type="text" value={data.bio?.memento} onChange={e => updateField('bio.memento', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent text-sm italic" />
                                                      </div>
                                                  </div>
                                                  </div>
                                              </div>
      
                                              <div className={`db-column lg:col-span-5 xl:col-span-5 flex flex-col min-w-0 ${mobileTab === 'pericias' ? 'flex' : 'hidden md:flex'}`}>
                                                  <div className="flex justify-end mb-3">
                                                      <button onClick={() => updateField('status.armasPrimeiro', !data.status?.armasPrimeiro)} className="text-[10px] bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded flex items-center gap-1 shadow-sm font-bold uppercase transition-colors">
                                                          <SVGIcons.Refresh /> Alternar Ordem
                                                      </button>
                                                  </div>
                                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-4 xl:gap-5 items-start">
                                                      <div className={`flex flex-col ${data.status?.armasPrimeiro ? 'order-2' : 'order-1'}`}>
                                                          <h2 style={getBarStyle()} className="db-section-title font-title font-bold text-base bg-dragon-dark text-white text-center py-1 mb-2 px-3 flex justify-between"><span>PERÍCIAS</span><span className="text-[10px] font-normal self-center hidden sm:inline">T: Treinar | Av: Avanço</span></h2>
                                                          <div className="space-y-1">
                                                              {(data.periciasBase || []).map((pericia, index) => {
                                                                  const attrValue = data.atributos?.[pericia.attr.toLowerCase()]?.valor || 10;
                                                                  const baseChance = getChanceBase(attrValue);
                                                                  return (
                                                                      <div key={index} className="db-skill-row flex items-center hover:bg-gray-100 p-1 rounded gap-2">
                                                                          <input type="checkbox" checked={pericia.avanco} onChange={e => updateArrayField('periciasBase', index, 'avanco', e.target.checked)} className="cursor-pointer" />
                                                                          <button onClick={() => toggleTreinada('periciasBase', index)} className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center border ${pericia.treinada ? 'bg-red-800 text-white border-red-800' : 'bg-gray-200 text-gray-500 border-gray-400'}`}>T</button>
                                                                          <span className="flex-1 font-bold text-sm text-gray-800 min-w-0 leading-tight">{pericia.nome} <span className="text-[10px] text-gray-500 font-normal whitespace-nowrap">({pericia.attr})</span></span>
                                                                          <div className="flex flex-col items-center"><input type="number" value={pericia.valor} onChange={e => updateArrayField('periciasBase', index, 'valor', e.target.value)} className="w-10 text-center border-b border-gray-400 outline-none bg-transparent font-bold" /><span className="text-[9px] text-gray-500 mt-0.5">Base {baseChance}</span></div>
                                                                      </div>
                                                                  );
                                                              })}
                                                          </div>
                                                      </div>
      
                                                      <div className={`space-y-6 flex flex-col ${data.status?.armasPrimeiro ? 'order-1' : 'order-2'}`}>
                                                          <div>
                                                              <h2 style={getBarStyle()} className="db-section-title font-title font-bold text-base bg-dragon-dark text-white text-center py-1 mb-2 px-3 flex justify-between"><span>ARMAS <span className="text-[10px] font-normal uppercase">(Perícias)</span></span></h2>
                                                              <div className="space-y-1">
                                                                  {(data.periciasArmas || []).map((pericia, index) => {
                                                                      const attrValue = data.atributos?.[pericia.attr.toLowerCase()]?.valor || 10;
                                                                      const baseChance = getChanceBase(attrValue);
                                                                      return (
                                                                          <div key={index} className="db-skill-row flex items-center hover:bg-gray-100 p-1 rounded gap-2">
                                                                              <input type="checkbox" checked={pericia.avanco} onChange={e => updateArrayField('periciasArmas', index, 'avanco', e.target.checked)} className="cursor-pointer" />
                                                                              <button onClick={() => toggleTreinada('periciasArmas', index)} className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center border ${pericia.treinada ? 'bg-red-800 text-white border-red-800' : 'bg-gray-200 text-gray-500 border-gray-400'}`}>T</button>
                                                                              <span className="flex-1 font-bold text-sm text-gray-800 min-w-0 leading-tight">{pericia.nome} <span className="text-[10px] text-gray-500 font-normal whitespace-nowrap">({pericia.attr})</span></span>
                                                                              <div className="flex flex-col items-center"><input type="number" value={pericia.valor} onChange={e => updateArrayField('periciasArmas', index, 'valor', e.target.value)} className="w-10 text-center border-b border-gray-400 outline-none bg-transparent font-bold" /><span className="text-[9px] text-gray-500 mt-0.5">Base {baseChance}</span></div>
                                                                          </div>
                                                                      );
                                                                  })}
                                                              </div>
                                                          </div>
                                                          
                                                          <div>
                                                              <div className="flex justify-between items-center bg-gray-200 py-1 px-3 mb-2 rounded-sm border border-gray-300">
                                                                  <h3 className="font-title font-bold text-sm text-gray-700">SECUNDÁRIAS</h3>
                                                                  <button onClick={() => addToArray('periciasSecundarias', { nome: '', attr: '', valor: '', avanco: false })} className="db-add-btn db-add-neutral"><SVGIcons.Plus/> Adic.</button>
                                                              </div>
                                                              <div className="space-y-1">
                                                                  {(data.periciasSecundarias || []).map((pericia, index) => (
                                                                      <div key={index} className="db-skill-row flex items-center gap-1 p-1 rounded hover:bg-gray-100">
                                                                          <input type="checkbox" checked={pericia.avanco} onChange={e => updateArrayField('periciasSecundarias', index, 'avanco', e.target.checked)} className="cursor-pointer" />
                                                                          <input type="text" value={pericia.nome} placeholder="Nome" onChange={e => updateArrayField('periciasSecundarias', index, 'nome', e.target.value)} className="flex-1 border-b border-gray-400 outline-none bg-transparent text-sm font-bold min-w-0" />
                                                                          <input type="text" value={pericia.attr} placeholder="At" onChange={e => updateArrayField('periciasSecundarias', index, 'attr', e.target.value)} className="w-8 text-center border-b border-gray-400 outline-none bg-transparent text-[10px]" />
                                                                          <input type="number" value={pericia.valor} onChange={e => updateArrayField('periciasSecundarias', index, 'valor', e.target.value)} className="w-10 text-center border-b border-gray-400 outline-none bg-transparent font-bold" />
                                                                          <button onClick={() => removeFromArray('periciasSecundarias', index)} className="text-red-500 hover:text-red-700 ml-1"><SVGIcons.Trash/></button>
                                                                      </div>
                                                                  ))}
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
      
                                              <div className={`db-column lg:col-span-3 xl:col-span-4 space-y-4 min-w-0 ${mobileTab === 'equipamento' ? 'block' : 'hidden md:block'}`}>
                                                  <div>
                                                      <div style={getBarStyle()} className="db-section-title flex justify-between items-center bg-dragon-dark text-white py-1 px-3 mb-2">
                                                          <h2 className="font-title font-bold text-lg">HABILIDADES E MAGIAS</h2>
                                                          <button onClick={() => addToArray('habilidadesFeiticos', { nome: '', fv_nvl: '' })} className="db-add-btn db-add-red"><SVGIcons.Plus/> Adic.</button>
                                                      </div>
                                                      <div className="db-ability-list">
                                                          {(data.habilidadesFeiticos || []).map((hab, index) => (
                                                              <div key={index} className="db-ability-card flex gap-2 items-start min-w-0">
                                                                  <div className="flex-1">
                                                                      {index === 0 && <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Habilidade / Magia</label>}
                                                                      <textarea rows="2" value={hab.nome} onChange={e => updateArrayField('habilidadesFeiticos', index, 'nome', e.target.value)} className="w-full border border-gray-300 rounded bg-gray-50 outline-none text-sm p-1 resize-y"></textarea>
                                                                  </div>
                                                                  <div className="w-12">
                                                                      {index === 0 && <label className="block text-[10px] font-bold text-gray-400 uppercase text-center mb-1">PD/Nv.</label>}
                                                                      <input type="text" value={hab.fv_nvl} onChange={e => updateArrayField('habilidadesFeiticos', index, 'fv_nvl', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent text-center text-sm mt-1" />
                                                                  </div>
                                                                  <button onClick={() => removeFromArray('habilidadesFeiticos', index)} className="text-red-500 hover:text-red-700 mt-2"><SVGIcons.Trash/></button>
                                                              </div>
                                                          ))}
                                                      </div>
                                                  </div>
      
      <div className="lg:hidden db-combat-mobile-slot">
                                                  <div>
                                                      <h2 style={getBarStyle()} className="db-section-title font-title font-bold text-base bg-dragon-dark text-white text-center py-1 mb-2">COMBATE</h2>
                                                      <div className="space-y-3 mb-4">
                                                          <div className="db-armor-card border p-2 space-y-1">
                                                              <div className="flex gap-2 items-end">
                                                                  <div className="flex-1"><label className="block text-[10px] font-bold text-gray-500 uppercase">Armadura</label><input type="text" value={data.defesa?.armadura.nome} onChange={e => updateField('defesa.armadura.nome', e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold border-b border-gray-300" /></div>
                                                                  <div className="w-12"><label className="block text-[10px] font-bold text-gray-500 uppercase text-center">Val.</label><input type="text" value={data.defesa?.armadura.valor} onChange={e => updateField('defesa.armadura.valor', e.target.value)} className="w-full bg-transparent outline-none text-sm text-center font-bold border-b border-gray-300" /></div>
                                                              </div>
                                                              <input type="text" value={data.defesa?.armadura.reves} onChange={e => updateField('defesa.armadura.reves', e.target.value)} className="w-full bg-transparent outline-none text-[11px] text-gray-600 italic border-b border-gray-200" placeholder="Revés..." />
                                                          </div>
      
                                                          <div className="db-armor-card border p-2 space-y-1">
                                                              <div className="flex gap-2 items-end">
                                                                  <div className="flex-1"><label className="block text-[10px] font-bold text-gray-500 uppercase">Elmo</label><input type="text" value={data.defesa?.elmo.nome} onChange={e => updateField('defesa.elmo.nome', e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold border-b border-gray-300" /></div>
                                                                  <div className="w-12"><label className="block text-[10px] font-bold text-gray-500 uppercase text-center">Val.</label><input type="text" value={data.defesa?.elmo.valor} onChange={e => updateField('defesa.elmo.valor', e.target.value)} className="w-full bg-transparent outline-none text-sm text-center font-bold border-b border-gray-300" /></div>
                                                              </div>
                                                              <input type="text" value={data.defesa?.elmo.reves} onChange={e => updateField('defesa.elmo.reves', e.target.value)} className="w-full bg-transparent outline-none text-[11px] text-gray-600 italic border-b border-gray-200" placeholder="Revés..." />
                                                          </div>
                                                      </div>
      
                                                      <div className="mb-6">
                                                          <div className="flex justify-between items-center bg-gray-200 py-1 px-3 mb-2 rounded-sm border border-gray-300">
                                                              <h3 className="font-title font-bold text-sm text-gray-700">ARMAS</h3>
                                                              <button onClick={() => addToArray('armas', { nome: '', empunhadura: '', alcance: '', dano: '', tracos: '' })} className="db-add-btn db-add-neutral"><SVGIcons.Plus/> Adic.</button>
                                                          </div>
                                                          <div className="space-y-3">
                                                              {(data.armas || []).map((arma, index) => (
                                                                  <div key={index} className="db-weapon-card border p-2 shadow-sm flex flex-col gap-2">
                                                                      <div className="flex gap-2 items-end">
                                                                          <div className="flex-1"><label className="block text-[9px] font-bold text-gray-500 uppercase">Arma / Escudo</label><input type="text" value={arma.nome} onChange={e => updateArrayField('armas', index, 'nome', e.target.value)} className="w-full border-b border-gray-400 outline-none text-sm font-bold bg-transparent"/></div>
                                                                          <button onClick={() => removeFromArray('armas', index)} className="text-red-500 hover:text-red-700 mb-1"><SVGIcons.Trash/></button>
                                                                      </div>
                                                                      <div className="grid grid-cols-3 gap-2">
                                                                          <div><label className="text-[9px] font-bold text-gray-500 uppercase">Empunh.</label><input type="text" value={arma.empunhadura} onChange={e => updateArrayField('armas', index, 'empunhadura', e.target.value)} className="w-full border-b border-gray-300 outline-none text-xs bg-transparent"/></div>
                                                                          <div><label className="text-[9px] font-bold text-gray-500 uppercase">Alcance</label><input type="text" value={arma.alcance} onChange={e => updateArrayField('armas', index, 'alcance', e.target.value)} className="w-full border-b border-gray-300 outline-none text-xs bg-transparent"/></div>
                                                                          <div><label className="text-[9px] font-bold text-gray-500 uppercase">Dano</label><input type="text" value={arma.dano} onChange={e => updateArrayField('armas', index, 'dano', e.target.value)} className="w-full border-b border-gray-300 outline-none text-xs bg-transparent font-bold"/></div>
                                                                      </div>
                                                                      <textarea rows="1" value={arma.tracos} onChange={e => updateArrayField('armas', index, 'tracos', e.target.value)} className="w-full border border-gray-200 rounded outline-none text-xs bg-white p-1 resize-y" placeholder="Traços..."></textarea>
                                                                  </div>
                                                              ))}
                                                          </div>
                                                      </div>
      
                                                      <h2 style={getBarStyle()} className="db-section-title font-title font-bold text-base bg-dragon-dark text-white text-center py-1 mb-3 mt-5">INVENTÁRIO</h2>
                                                      
                                                      <div className="grid grid-cols-3 gap-2 mb-3">
                                                          <div className="db-money-gold border-2 rounded flex flex-col items-center justify-center p-2 shadow-sm"><label className="text-[10px] font-bold text-yellow-700 uppercase mb-1">Ouro</label><input type="number" value={data.moedas?.ouro} onChange={e => updateField('moedas.ouro', parseInt(e.target.value) || 0)} className="w-full bg-transparent text-center font-title font-bold text-xl outline-none text-yellow-900" /></div>
                                                          <div className="db-money-silver border-2 rounded flex flex-col items-center justify-center p-2 shadow-sm"><label className="text-[10px] font-bold text-gray-500 uppercase mb-1">Prata</label><input type="number" value={data.moedas?.prata} onChange={e => updateField('moedas.prata', parseInt(e.target.value) || 0)} className="w-full bg-transparent text-center font-title font-bold text-xl outline-none text-gray-800" /></div>
                                                          <div className="db-money-copper border-2 rounded flex flex-col items-center justify-center p-2 shadow-sm"><label className="text-[10px] font-bold text-orange-800 uppercase mb-1">Cobre</label><input type="number" value={data.moedas?.cobre} onChange={e => updateField('moedas.cobre', parseInt(e.target.value) || 0)} className="w-full bg-transparent text-center font-title font-bold text-xl outline-none text-orange-900" /></div>
                                                      </div>
      
                                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 mt-2">Equipamento</label>
                                                      <textarea rows="6" value={data.inventario} onChange={e => updateField('inventario', e.target.value)} className="db-inventory-box w-full border-2 p-2 text-sm outline-none resize-y mb-3"></textarea>
                                                      
                                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Itens Miúdos</label>
                                                      <textarea rows="3" value={data.itensMiudos || ''} onChange={e => updateField('itensMiudos', e.target.value)} className="db-inventory-box w-full border-2 p-2 text-sm outline-none resize-y"></textarea>
      
                                                      <div className="mt-4 pb-10 md:pb-0">
                                                          <label className="block text-xs font-bold text-gray-500 uppercase">Memento (Item Especial)</label>
                                                          <input type="text" value={data.bio?.memento} onChange={e => updateField('bio.memento', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent text-sm italic" />
                                                      </div>
                                                  </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </React.Fragment>
                              ) : data.type === 'pnj' ? (
                                  <div className="p-4 md:p-8 space-y-6 bg-white" >
                                      <div className="flex flex-col md:flex-row gap-6 pb-4 border-b-2 border-blue-900 items-end">
                                          <div className="flex-1 w-full"><label className="block text-xs font-bold text-blue-900 uppercase tracking-widest mb-1">Nome do PNJ / Ameaça Humanoide</label><input type="text" value={data.nome} onChange={e => updateField('nome', e.target.value)} className="w-full text-3xl font-title font-bold border-b-2 border-gray-400 focus:border-blue-600 outline-none bg-transparent" placeholder="Nome do Personagem" /></div>
                                          <div className="w-full md:w-64"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Classificação</label><select value={data.tipoPnj} onChange={e => updateField('tipoPnj', e.target.value)} className="w-full p-2 border-2 border-gray-300 rounded text-sm font-bold text-gray-800 bg-gray-50 focus:border-blue-600 outline-none cursor-pointer"><option value="lacaio">Lacaio (Sem PD, Estatísticas base)</option><option value="chefe">Chefe (Tem PD e Iniciativa própria)</option></select></div>
                                      </div>
      
                                      <div className="bg-gray-100 p-4 border border-gray-300 rounded relative">
                                          <div className="absolute -top-3 left-4 bg-white px-2 font-title font-bold text-blue-900 text-xs uppercase shadow-sm border border-gray-200">Gerador Rápido de PNJ (Improviso)</div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
                                              <div><label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">Nome <button onClick={() => generatePnjAspect('nome')} className="text-blue-600 hover:text-blue-800" title="Sortear"><SVGIcons.Dice/></button></label><input type="text" value={data.nome} onChange={e => updateField('nome', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent text-sm font-bold" /></div>
                                              <div><label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">Profissão/Tipo <button onClick={() => generatePnjAspect('profissao')} className="text-blue-600 hover:text-blue-800" title="Sortear"><SVGIcons.Dice/></button></label><input type="text" value={data.profissao} onChange={e => updateField('profissao', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent text-sm font-bold" /></div>
                                              <div><label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">Atitude <button onClick={() => generatePnjAspect('atitude')} className="text-blue-600 hover:text-blue-800" title="Sortear"><SVGIcons.Dice/></button></label><input type="text" value={data.atitude} onChange={e => updateField('atitude', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent text-sm italic" /></div>
                                              <div><label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">Motivação <button onClick={() => generatePnjAspect('motivacao')} className="text-blue-600 hover:text-blue-800" title="Sortear"><SVGIcons.Dice/></button></label><input type="text" value={data.motivacao} onChange={e => updateField('motivacao', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent text-sm italic" /></div>
                                              <div><label className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">Traço Marcante <button onClick={() => generatePnjAspect('tracoMarcante')} className="text-blue-600 hover:text-blue-800" title="Sortear"><SVGIcons.Dice/></button></label><input type="text" value={data.tracoMarcante} onChange={e => updateField('tracoMarcante', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent text-sm italic" /></div>
                                          </div>
                                      </div>
      
                                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                                          <div className="md:col-span-5 space-y-6">
                                              <div className="flex flex-col gap-4">
                                                  <div className="grid grid-cols-2 gap-4">
                                                      <div><label className="block text-xs font-bold text-gray-500 uppercase">Ancestralidade</label><input type="text" value={data.ancestralidade} onChange={e => updateField('ancestralidade', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent font-bold" /></div>
                                                      <div><label className="block text-xs font-bold text-gray-500 uppercase">Movimento</label><input type="number" value={data.movimento} onChange={e => updateField('movimento', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent font-bold" /></div>
                                                  </div>
                                                  <div className="grid grid-cols-2 gap-4">
                                                      <div><label className="block text-xs font-bold text-gray-500 uppercase">Dano Bônus</label><input type="text" value={data.danoBonus} onChange={e => updateField('danoBonus', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent font-bold" placeholder="Ex: +D4" /></div>
                                                      <div className="flex gap-2 items-end"><div className="flex-1"><label className="block text-[10px] font-bold text-gray-500 uppercase">Armadura</label><input type="text" value={data.armaduraTipica?.nome} onChange={e => updateField('armaduraTipica.nome', e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold border-b border-gray-300" placeholder="Tipo..." /></div><div className="w-12"><label className="block text-[10px] font-bold text-gray-500 uppercase text-center">Val.</label><input type="text" value={data.armaduraTipica?.valor} onChange={e => updateField('armaduraTipica.valor', e.target.value)} className="w-full bg-transparent outline-none text-sm text-center font-bold border-b border-gray-300" /></div></div>
                                                  </div>
                                              </div>
      
                                              <div className="grid grid-cols-2 gap-2">
                                                  <div className="border-2 border-red-800 rounded bg-red-50 p-3 flex flex-col items-center justify-center text-center shadow-sm">
                                                      <div className="font-title font-bold text-red-900 text-xs uppercase">PONTOS DE VIDA</div>
                                                      <div className="flex items-center justify-center gap-1 mt-2"><input type="number" value={data.status?.pv.atual} onChange={e => updateField('status.pv.atual', parseInt(e.target.value)||0)} className="w-12 text-center text-2xl font-bold border-b-2 border-red-300 bg-transparent outline-none" /><span className="text-xl">/</span><input type="number" value={data.status?.pv.max} onChange={e => updateField('status.pv.max', parseInt(e.target.value)||0)} className="w-12 text-center text-2xl font-bold border-b-2 border-red-300 bg-transparent outline-none" /></div>
                                                  </div>
                                                  <div className={`border-2 rounded p-3 flex flex-col items-center justify-center text-center shadow-sm transition-opacity ${data.tipoPnj === 'lacaio' ? 'border-gray-300 bg-gray-100 opacity-50' : 'border-blue-800 bg-blue-50'}`}>
                                                      <div className={`font-title font-bold text-xs uppercase ${data.tipoPnj === 'lacaio' ? 'text-gray-500' : 'text-blue-900'}`}>PONTOS DE DET.</div>
                                                      <div className="flex items-center justify-center gap-1 mt-2"><input type="number" disabled={data.tipoPnj === 'lacaio'} value={data.status?.pd.atual} onChange={e => updateField('status.pd.atual', parseInt(e.target.value)||0)} className="w-12 text-center text-2xl font-bold border-b-2 border-blue-300 bg-transparent outline-none disabled:border-transparent" /><span className="text-xl">/</span><input type="number" disabled={data.tipoPnj === 'lacaio'} value={data.status?.pd.max} onChange={e => updateField('status.pd.max', parseInt(e.target.value)||0)} className="w-12 text-center text-2xl font-bold border-b-2 border-blue-300 bg-transparent outline-none disabled:border-transparent" /></div>
                                                      {data.tipoPnj === 'lacaio' && <span className="text-[9px] mt-1 text-gray-500">Lacaios raramente usam PD</span>}
                                                  </div>
                                              </div>
      
                                              <div>
                                                  <div className="flex justify-between items-center bg-gray-200 py-1 px-3 mb-2 rounded-sm border border-gray-300"><h3 className="font-title font-bold text-sm text-gray-700">PERÍCIAS PRINCIPAIS</h3><button onClick={() => addToArray('pericias', { nome: '', valor: '' })} className="text-[10px] bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded flex items-center gap-1 shadow-sm"><SVGIcons.Plus/> Adic.</button></div>
                                                  <div className="space-y-1">
                                                      {data.pericias?.length === 0 && <p className="text-[10px] text-gray-400 italic">Nenhuma perícia adicionada.</p>}
                                                      {(data.pericias || []).map((pericia, index) => (
                                                          <div key={index} className="flex items-center gap-2 p-1 rounded hover:bg-gray-100"><input type="text" value={pericia.nome} placeholder="Perícia..." onChange={e => updateArrayField('pericias', index, 'nome', e.target.value)} className="flex-1 border-b border-gray-400 outline-none bg-transparent text-sm font-bold min-w-0" /><input type="number" value={pericia.valor} onChange={e => updateArrayField('pericias', index, 'valor', e.target.value)} className="w-12 text-center border-b border-gray-400 outline-none bg-transparent font-bold" /><button onClick={() => removeFromArray('pericias', index)} className="text-red-500 hover:text-red-700"><SVGIcons.Trash/></button></div>
                                                      ))}
                                                  </div>
                                              </div>
                                          </div>
      
                                          <div className="md:col-span-7 space-y-6">
                                              <div className="mb-6">
                                                  <div className="flex justify-between items-center bg-gray-200 py-1 px-3 mb-2 rounded-sm border border-gray-300"><h3 className="font-title font-bold text-sm text-gray-700">ARMAS E ATAQUES</h3><button onClick={() => addToArray('armas', { nome: '', pericia: '', dano: '' })} className="text-[10px] bg-gray-500 text-white px-2 py-1 rounded flex items-center gap-1 shadow-sm font-bold"><SVGIcons.Plus/> Adic.</button></div>
                                                  <div className="space-y-3">
                                                      {data.armas?.length === 0 && <p className="text-[10px] text-gray-400 italic">Nenhuma arma adicionada.</p>}
                                                      {(data.armas || []).map((arma, index) => (
                                                          <div key={index} className="border border-gray-300 p-2 rounded bg-gray-50 shadow-sm flex flex-col gap-2"><div className="flex gap-2 items-end"><div className="flex-1"><label className="block text-[9px] font-bold text-gray-500 uppercase">Arma</label><input type="text" value={arma.nome} onChange={e => updateArrayField('armas', index, 'nome', e.target.value)} className="w-full border-b border-gray-400 outline-none text-sm font-bold bg-transparent"/></div><div className="w-16"><label className="block text-[9px] font-bold text-gray-500 uppercase text-center">Nív. Per.</label><input type="number" value={arma.pericia} onChange={e => updateArrayField('armas', index, 'pericia', e.target.value)} className="w-full border-b border-gray-400 outline-none text-sm font-bold bg-transparent text-center"/></div><div className="w-24"><label className="block text-[9px] font-bold text-gray-500 uppercase text-center">Dano</label><input type="text" value={arma.dano} placeholder="Ex: 2d6+d4" onChange={e => updateArrayField('armas', index, 'dano', e.target.value)} className="w-full border-b border-gray-400 outline-none text-sm font-bold bg-transparent text-center text-red-800"/></div><button onClick={() => removeFromArray('armas', index)} className="text-red-500 hover:text-red-700 mb-1 ml-2"><SVGIcons.Trash/></button></div></div>
                                                      ))}
                                                  </div>
                                              </div>
      
                                              <div>
                                                  <div className="flex justify-between items-center bg-gray-200 py-1 px-3 mb-2 rounded-sm border border-gray-300"><h3 className="font-title font-bold text-sm text-gray-700">HABILIDADES E FEITIÇOS</h3><button onClick={() => addToArray('feiticos', { nome: '', desc: '' })} className="text-[10px] bg-gray-500 text-white px-2 py-1 rounded flex items-center gap-1 shadow-sm font-bold"><SVGIcons.Plus/> Adic.</button></div>
                                                  <div className="space-y-2">
                                                      {data.feiticos?.length === 0 && <p className="text-[10px] text-gray-400 italic">Nenhuma habilidade listada.</p>}
                                                      {(data.feiticos || []).map((hab, index) => (
                                                          <div key={index} className="flex gap-2 items-start p-2 border border-gray-200 rounded bg-gray-50"><div className="flex-1 space-y-1"><input type="text" value={hab.nome} onChange={e => updateArrayField('feiticos', index, 'nome', e.target.value)} className="w-full border-b border-gray-300 bg-transparent font-bold text-sm outline-none" placeholder="Nome do Feitiço/Habilidade..." /><textarea rows="2" value={hab.desc} onChange={e => updateArrayField('feiticos', index, 'desc', e.target.value)} className="w-full bg-transparent outline-none text-xs resize-y" placeholder="Descrição do efeito..."></textarea></div><button onClick={() => removeFromArray('feiticos', index)} className="text-red-500 hover:text-red-700 mt-1"><SVGIcons.Trash/></button></div>
                                                      ))}
                                                  </div>
                                              </div>
      
                                              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1 mt-2">Equipamento & Tesouro</label><textarea rows="4" value={data.equipamento} onChange={e => updateField('equipamento', e.target.value)} className="w-full border-2 border-gray-300 rounded p-2 text-sm outline-none bg-gray-50 resize-y mb-3"></textarea></div>
                                          </div>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="p-4 md:p-8 space-y-6 bg-white" >
                                      <div className="flex flex-col md:flex-row gap-6 pb-4 border-b-4 border-red-900 items-end">
                                          <div className="flex-1 w-full"><label className="block text-xs font-bold text-red-900 uppercase tracking-widest mb-1">Nome da Ameaça / Monstro</label><input type="text" value={data.nome} onChange={e => updateField('nome', e.target.value)} className="w-full text-3xl font-title font-bold border-b-2 border-gray-400 focus:border-red-600 outline-none bg-transparent" placeholder="Ex: Troll Antigo, Demônio..." /></div>
                                          <div className="w-full md:w-48 text-center bg-red-50 border-2 border-red-900 rounded p-2 shadow-sm"><label className="block text-xs font-bold text-red-900 uppercase mb-1" title="Número de ações/cartas de iniciativa por rodada">Ferocidade (Ações)</label><input type="number" value={data.ferocidade} onChange={e => updateField('ferocidade', parseInt(e.target.value)||1)} className="w-full text-center text-3xl font-black bg-transparent outline-none text-red-900" /></div>
                                      </div>
      
                                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
                                          <div className="md:col-span-4 space-y-6">
                                              <div className="border border-gray-300 p-4 bg-gray-50 rounded shadow-sm space-y-4">
                                                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tamanho</label><select value={data.tamanho} onChange={e => updateField('tamanho', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm font-bold text-gray-800 bg-white outline-none cursor-pointer"><option value="Pequeno">Pequeno</option><option value="Normal">Normal</option><option value="Grande">Grande</option><option value="Enorme">Enorme</option><option value="Enxame">Enxame</option></select></div>
                                                  <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-gray-500 uppercase">Movimento</label><input type="text" value={data.movimento} onChange={e => updateField('movimento', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent font-bold text-center text-lg" /></div><div><label className="block text-xs font-bold text-gray-500 uppercase">Armadura</label><input type="text" value={data.armadura} onChange={e => updateField('armadura', e.target.value)} className="w-full border-b border-gray-400 outline-none bg-transparent font-bold text-center text-lg" placeholder="Ex: 4" /></div></div>
                                              </div>
      
                                              <div className="border-2 border-red-900 rounded bg-red-50 p-4 flex flex-col items-center justify-center text-center shadow">
                                                  <div className="font-title font-black text-red-900 text-sm uppercase tracking-widest">PONTOS DE VIDA</div>
                                                  <div className="flex items-center justify-center gap-1 mt-3"><input type="number" value={data.status?.pv.atual} onChange={e => updateField('status.pv.atual', parseInt(e.target.value)||0)} className="w-16 text-center text-4xl font-black border-b-2 border-red-300 bg-transparent outline-none text-red-900" /><span className="text-2xl text-red-900 font-black">/</span><input type="number" value={data.status?.pv.max} onChange={e => updateField('status.pv.max', parseInt(e.target.value)||0)} className="w-16 text-center text-4xl font-black border-b-2 border-red-300 bg-transparent outline-none text-red-900" /></div>
                                              </div>
      
                                              <div>
                                                  <div className="flex justify-between items-center bg-gray-200 py-1 px-3 mb-2 rounded-sm border border-gray-300"><h3 className="font-title font-bold text-sm text-gray-700">HABILIDADES ESPECIAIS</h3><button onClick={() => addToArray('habilidades', { nome: '', desc: '' })} className="text-[10px] bg-red-900 text-white px-2 py-1 rounded flex items-center gap-1 shadow-sm font-bold"><SVGIcons.Plus/> Adic.</button></div>
                                                  <div className="space-y-3">
                                                      {data.habilidades?.length === 0 && <p className="text-[10px] text-gray-400 italic">Nenhuma habilidade listada.</p>}
                                                      {(data.habilidades || []).map((hab, index) => (
                                                          <div key={index} className="flex gap-2 items-start p-2 border border-red-200 rounded bg-red-50/50"><div className="flex-1 space-y-1"><input type="text" value={hab.nome} onChange={e => updateArrayField('habilidades', index, 'nome', e.target.value)} className="w-full border-b border-red-300 bg-transparent font-bold text-sm outline-none text-red-900" placeholder="Ex: Imunidade a Fogo..." /><textarea rows="3" value={hab.desc} onChange={e => updateArrayField('habilidades', index, 'desc', e.target.value)} className="w-full bg-transparent outline-none text-xs resize-y" placeholder="Detalhes..."></textarea></div><button onClick={() => removeFromArray('habilidades', index)} className="text-red-500 hover:text-red-700 mt-1"><SVGIcons.Trash/></button></div>
                                                      ))}
                                                  </div>
                                              </div>
                                          </div>
      
                                          <div className="md:col-span-8">
                                              <div className="bg-red-900 text-white py-2 px-4 rounded-t-sm shadow-sm flex items-center gap-2"><SVGIcons.Dice /><h2 className="font-title font-bold text-lg tracking-widest uppercase">ATAQUES DO MONSTRO (Role D6)</h2></div>
                                              <div className="border-x border-b border-red-900 bg-white rounded-b-sm shadow-sm overflow-hidden">
                                                  {[1, 2, 3, 4, 5, 6].map((num, idx) => {
                                                      const ataque = (data.ataques && data.ataques[idx]) || { id: num, descricao: '' };
                                                      return (
                                                          <div key={num} className={`flex border-b border-gray-200 last:border-0 ${num % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                              <div className="w-12 md:w-16 flex items-center justify-center font-black text-2xl text-red-900 border-r border-gray-200 bg-red-50/30">{num}</div>
                                                              <div className="flex-1 p-2"><textarea rows="3" value={ataque.descricao} onChange={e => { const newAtaques = [...(data.ataques || Array(6).fill({descricao:''}))]; newAtaques[idx] = { ...newAtaques[idx], descricao: e.target.value, id: num }; updateField('ataques', newAtaques); }} className="w-full bg-transparent outline-none text-sm resize-y leading-relaxed" placeholder={`Descrição do ataque ${num} (Nome, alvo, dano, efeitos especiais como derrubar, veneno, etc)...`}></textarea></div>
                                                          </div>
                                                      );
                                                  })}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              )
                          )}
    </>
  );
}
