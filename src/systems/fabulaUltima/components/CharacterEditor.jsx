// Extraído automaticamente do antigo PJLiteApp monolítico.
// Este arquivo agora é a fonte visual do editor deste sistema.
export default function FabulaCharacterEditor({ scope }) {
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
      {isFabula && data.type === 'pc' && (
                              <div className="bg-white fabula-pdf-editor">
                                  <div className="pj-mobile-tabs md:hidden flex overflow-x-auto bg-teal-50 border-b border-teal-200 sticky top-0 z-20 shadow-sm">
                                      {[
                                          {id:'perfil',label:'Perfil & Status'}, {id:'combate',label:'Equipamentos'}, {id:'classes',label:'Classes'},
                                          ...(data.extrasAtivos || []).map(id => ({id:`extra-${id}`, label:(FABULA_EXTRA_OPTIONS.find(x=>x.id===id)?.nome || id).split(' ')[0]}))
                                      ].map(tab => <button key={tab.id} onClick={() => setFabulaTab(tab.id)} className={`shrink-0 px-4 py-3 text-[9px] font-bold uppercase border-b-4 ${fabulaTab===tab.id?'border-teal-700 text-teal-900 bg-white':'border-transparent text-gray-500'}`}>{tab.label}</button>)}
                                  </div>
      
                                  <div className="p-4 md:p-7 space-y-6 fabula-sheet-shell">
                                      <div className="hidden md:flex fabula-tabs-desktop">
                                          {[
                                              {id:'perfil',label:'👤 Perfil & Status'}, {id:'combate',label:'🎒 Equipamentos'}, {id:'classes',label:'✨ Classes'},
                                              ...(data.extrasAtivos || []).map(id => ({id:`extra-${id}`, label:`${FABULA_EXTRA_OPTIONS.find(x=>x.id===id)?.icon || '📄'} ${FABULA_EXTRA_OPTIONS.find(x=>x.id===id)?.nome || id}`}))
                                          ].map(tab => <button key={tab.id} onClick={() => setFabulaTab(tab.id)} className={`fabula-tab-btn ${fabulaTab===tab.id?'active':''}`}>{tab.label}</button>)}
                                          <div className="ml-auto flex items-center gap-2">
                                              <div className="fabula-material-icons" aria-label="Materiais habilitados">{FABULA_SUPPLEMENT_OPTIONS.filter(src=>src.locked||data.suplementos?.[src.id]).map(src=><span key={src.id} className="fabula-material-icon" title={src.nome} aria-label={src.nome}>{src.icon}</span>)}</div>
                                              <button onClick={() => setShowFabulaExtras(true)} className="fabula-soft-btn">＋ Fichas Extras</button>
                                          </div>
                                      </div>
                                      <div className="md:hidden flex items-center justify-between gap-3"><div className="fabula-material-icons" aria-label="Materiais habilitados">{FABULA_SUPPLEMENT_OPTIONS.filter(src=>src.locked||data.suplementos?.[src.id]).map(src=><span key={src.id} className="fabula-material-icon" title={src.nome}>{src.icon}</span>)}</div><button onClick={() => setShowFabulaExtras(true)} className="px-3 py-2 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">＋ Fichas Extras</button></div>
      
                                      {fabulaTab === 'perfil' && (
                                          <div className="fabula-profile-layout animate-fade-in-up">
                                              <div className="space-y-2">
                                                  <div className="fabula-portrait-frame relative group">
                                                      {data.bio?.imagem ? <img src={data.bio.imagem} alt="Retrato" className="w-full h-full object-cover"/> : <span className="text-teal-700 font-bold text-xs uppercase">Retrato</span>}
                                                      <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 transition-opacity ${showUrlInput ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100 active:opacity-100'}`}>
                                                          {!showUrlInput ? (
                                                              <React.Fragment>
                                                                  <label className="cursor-pointer bg-white text-black px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-200 w-24 text-center shadow">Upload<input type="file" accept="image/*" className="hidden" onChange={async e=>{const f=e.target.files[0]; e.target.value=''; if(!f)return; try{updateField('bio.imagem',await optimizeImageFile(f,720,0.82));}catch(err){console.error(err);showToast('Não foi possível usar esta imagem.');}}}/></label>
                                                                  <button type="button" onClick={()=>setShowUrlInput(true)} className="bg-white text-black px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-200 w-24 shadow">Usar URL</button>
                                                                  {data.bio?.imagem && <button type="button" onClick={()=>updateField('bio.imagem','')} className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-700 w-24 shadow">Remover</button>}
                                                              </React.Fragment>
                                                          ) : (
                                                              <div className="flex flex-col gap-2 w-full px-3 items-center">
                                                                  <input type="url" placeholder="https://.../imagem.jpg" value={tempUrl} onChange={e=>setTempUrl(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&tempUrl.trim()){updateField('bio.imagem',tempUrl.trim());setTempUrl('');setShowUrlInput(false);}}} className="w-full p-2 text-[10px] outline-none rounded text-black bg-white"/>
                                                                  <div className="flex gap-2">
                                                                      <button type="button" onClick={()=>{if(tempUrl.trim()){updateField('bio.imagem',tempUrl.trim());setTempUrl('');setShowUrlInput(false);}}} className="bg-teal-600 text-white px-3 py-1 rounded text-xs font-bold">Aplicar</button>
                                                                      <button type="button" onClick={()=>{setTempUrl('');setShowUrlInput(false);}} className="bg-gray-500 text-white px-3 py-1 rounded text-xs font-bold">Voltar</button>
                                                                  </div>
                                                              </div>
                                                          )}
                                                      </div>
                                                  </div>
                                                  <p className="text-[10px] text-gray-500 text-center lg:text-left">Passe o mouse/toque no retrato para usar Upload ou URL.</p>
                                              </div>
                                              <div className="space-y-4 fabula-profile-panel"><div className="flex items-end justify-between gap-3 border-b border-teal-200 pb-3"><div><div className="fabula-top-sub">Fabula Ultima</div><div className="fabula-top-title">Ficha de Personagem</div></div><div className="text-right text-[10px] text-gray-500">visual inspirado na ficha em PDF</div></div>
                                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 fabula-profile-grid">
                                                      <label className="md:col-span-2 text-xs font-bold text-gray-600">Nome<input value={data.bio?.nome||''} onChange={e=>updateField('bio.nome',e.target.value)} className="mt-1 w-full border-2 border-teal-200 rounded p-2 text-lg font-bold outline-none focus:border-teal-700"/></label>
                                                      <label className="text-xs font-bold text-gray-600">Jogador<input value={data.bio?.jogador||''} onChange={e=>updateField('bio.jogador',e.target.value)} className="mt-1 w-full border rounded p-2"/></label>
                                                      <label className="text-xs font-bold text-gray-600">Identidade<input value={data.bio?.identidade||''} onChange={e=>updateField('bio.identidade',e.target.value)} className="mt-1 w-full border rounded p-2"/></label>
                                                      <label className="text-xs font-bold text-gray-600">Tema<input value={data.bio?.tema||''} onChange={e=>updateField('bio.tema',e.target.value)} className="mt-1 w-full border rounded p-2"/></label>
                                                      <label className="text-xs font-bold text-gray-600">Origem<input value={data.bio?.origem||''} onChange={e=>updateField('bio.origem',e.target.value)} className="mt-1 w-full border rounded p-2"/></label>
                                                      <label className="text-xs font-bold text-gray-600">Gênero<input value={data.bio?.genero||''} onChange={e=>updateField('bio.genero',e.target.value)} className="mt-1 w-full border rounded p-2"/></label>
                                                      <label className="text-xs font-bold text-gray-600">Nível<input type="number" min="1" value={data.nivel||1} onChange={e=>updateField('nivel',Number(e.target.value))} className="mt-1 w-full border rounded p-2"/></label>
                                                      <label className="text-xs font-bold text-gray-600">Experiência<input type="number" min="0" value={data.experiencia||0} onChange={e=>updateField('experiencia',Number(e.target.value))} className="mt-1 w-full border rounded p-2"/></label>
                                                  </div>
                                                  <label className="text-xs font-bold text-gray-600 block fabula-profile-grid">Traços<textarea value={data.bio?.tracos||''} onChange={e=>updateField('bio.tracos',e.target.value)} rows="3" className="mt-1 w-full border rounded p-2 resize-y" placeholder="Traços que definem o protagonista..."/></label>
                                                  <div className="fabula-bond-panel">
                                                      <div className="flex justify-between items-center mb-2"><h3 className="font-title font-bold text-teal-900">🤝 Laços</h3><button onClick={()=>addToArray('lacos',{alvo:'',forca:1,emocoes:''})} className="text-xs font-bold bg-teal-700 text-white px-2 py-1 rounded">+ Laço</button></div>
                                                      <div className="space-y-2">{(data.lacos||[]).map((l,i)=><div key={i} className="bond-row"><input value={l.alvo||''} onChange={e=>updateArrayField('lacos',i,'alvo',e.target.value)} className="border rounded p-2 text-xs" placeholder="Pessoa / local"/><input type="number" min="1" max="3" value={l.forca||1} onChange={e=>updateArrayField('lacos',i,'forca',Number(e.target.value))} className="border rounded p-2 text-xs"/><input value={l.emocoes||''} onChange={e=>updateArrayField('lacos',i,'emocoes',e.target.value)} className="border rounded p-2 text-xs" placeholder="Afeto, lealdade..."/><button onClick={()=>removeFromArray('lacos',i)} className="text-red-600">×</button></div>)}</div>
                                                  </div>
                                              </div>
                                          </div>
                                      )}
      
                                      {fabulaTab === 'perfil' && (
                                          <div className="space-y-6 animate-fade-in-up">
                                              <div className="fabula-subpanel"><div className="fabula-sheet-heading"><span>📊 Atributos e Condições</span></div><div className="fabula-attr-grid">{[['des','Destreza'],['ast','Astúcia'],['vig','Vigor'],['von','Vontade']].map(([k,n])=><div key={k} className="fabula-attr-card"><div className="fabula-attr-name">{n}</div><div className="fabula-die-pair"><div className="fabula-die-slot">{renderFabulaDieSelect(data.atributos?.[k]?.base||'d8', e=>updateField(`atributos.${k}.base`,e.target.value), `${n} Base`, 'base')}<div className="fabula-die-caption">Base</div></div><div className="fabula-die-slot">{renderFabulaDieSelect(data.atributos?.[k]?.atual||'d8', e=>updateField(`atributos.${k}.atual`,e.target.value), `${n} Atual`, 'current')}<div className="fabula-die-caption">Atual</div></div></div></div>)}</div></div>
                                              <div className="fabula-conditions-grid">{Object.keys(initialFabulaPcData.condicoes).map(k=><label key={k} className={`fabula-condition-chip ${data.condicoes?.[k]?'active':''}`}><input type="checkbox" checked={!!data.condicoes?.[k]} onChange={e=>updateField(`condicoes.${k}`,e.target.checked)}/>{k.charAt(0).toUpperCase()+k.slice(1)}</label>)}</div>
                                              <div className="fabula-track-grid">{[['pv','PV','❤️'],['pm','PM','🔷'],['pi','PI','🎒']].map(([k,n,ic])=><div key={k} className="fabula-track-box"><div className="fabula-track-title">{ic} {n}</div><div className="grid grid-cols-2 gap-2 mt-2"><input type="number" value={data.status?.[`${k}Atual`]??0} onChange={e=>updateField(`status.${k}Atual`,Number(e.target.value))}/><input type="number" value={data.status?.[`${k}Max`]??0} onChange={e=>updateField(`status.${k}Max`,Number(e.target.value))}/></div><div className="grid grid-cols-2 text-[9px] text-gray-500 mt-1"><span>Atual</span><span>Máx.</span></div></div>)}<div className="fabula-track-box" style={{background:'linear-gradient(180deg,#fff8e7 0%, #fff2c6 100%)'}}><div className="fabula-track-title">🌟 Pontos de Fabula</div><input type="number" min="0" value={data.status?.fabula??0} onChange={e=>updateField('status.fabula',Number(e.target.value))} className="mt-2"/></div></div>
                                              <div className="fabula-small-grid">{[['defesa','Defesa'],['defesaMagica','Defesa Mágica'],['iniciativa','Mod. Iniciativa']].map(([k,n])=><label key={k} className="fabula-small-stat"><span className="fabula-meta-box">{n}</span><input type="number" value={data.status?.[k]??0} onChange={e=>updateField(`status.${k}`,Number(e.target.value))}/></label>)}<label className="fabula-small-stat"><span className="fabula-meta-box">Zênites</span><input type="number" min="0" value={data.zenites||0} onChange={e=>updateField('zenites',Number(e.target.value))}/></label></div>
                                          </div>
                                      )}
      
                                      {fabulaTab === 'combate' && (
                                          <div className="space-y-6 animate-fade-in-up fabula-subpanel">
                                              <div className="flex flex-wrap items-center justify-between gap-3">
                                                  <div>
                                                      <div className="fabula-pill-title">🎒 Equipamentos & Mochila</div>
                                                      <p className="text-xs text-gray-500 mt-2">Organize itens equipados, proficiências, consumíveis e o inventário geral.</p>
                                                  </div>
                                                  <div className="flex flex-wrap gap-2"><button type="button" onClick={()=>addToArray('equipamentos',{slot:'Outro',nome:'',descricao:''})} className="fabula-action-btn">+ Equipamento</button><button type="button" onClick={restoreFabulaEquipmentSlots} className="fabula-soft-btn" title="Adiciona apenas os slots básicos que estiverem faltando, sem apagar equipamentos">Restaurar slots básicos</button></div>
                                              </div>
                                              <div className="fabula-list-card"><div className="fabula-list-card-head"><h3 className="font-title font-bold text-teal-900">Equipamentos em uso</h3><p className="text-[10px] text-gray-500">Slots equipados, armas, armaduras e acessórios importantes.</p></div><div className="fabula-list-card-body space-y-2">
                                                      {(data.equipamentos||[]).length===0 && <div className="text-xs text-gray-400 italic text-center py-4 border border-dashed rounded">Nenhum equipamento cadastrado. Use “+ Equipamento” ou restaure os slots básicos.</div>}
                                                      {(data.equipamentos||[]).map((eq,i)=><div key={i} className="fabula-equipment-row grid grid-cols-1 md:grid-cols-[150px_1fr_2fr_36px] gap-2 items-center"><div><div className="fabula-input-label">Slot</div><input value={eq.slot||''} onChange={e=>updateArrayField('equipamentos',i,'slot',e.target.value)} className="border rounded p-2 text-xs font-bold min-w-0" placeholder="Slot"/></div><div><div className="fabula-input-label">Item equipado</div><input value={eq.nome||''} onChange={e=>updateArrayField('equipamentos',i,'nome',e.target.value)} className="border rounded p-2 text-xs min-w-0" placeholder="Item equipado"/></div><div><div className="fabula-input-label">Descrição / efeito</div><input value={eq.descricao||''} onChange={e=>updateArrayField('equipamentos',i,'descricao',e.target.value)} className="border rounded p-2 text-xs min-w-0" placeholder="Precisão, dano, defesa, qualidade..."/></div><button type="button" onClick={()=>removeFromArray('equipamentos',i)} className="fabula-remove-btn" title="Excluir equipamento" aria-label={`Excluir equipamento ${eq.nome||i+1}`}>×</button></div>)}
                                                  </div></div>
                                              <div className="fabula-list-card"><div className="fabula-list-card-head"><h3 className="font-title font-bold text-teal-900">Proficiências de equipamento</h3><p className="text-[10px] text-gray-500">Marque apenas o que este personagem realmente domina.</p></div><div className="fabula-list-card-body"><div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">{[['armaduraMarcial','🛡️','Armadura marcial'],['escudoMarcial','🧷','Escudo marcial'],['armaCorpoMarcial','⚔️','Arma corpo a corpo marcial'],['armaDistanciaMarcial','🏹','Arma à distância marcial']].map(([k,icon,n])=><label key={k} className="fabula-check-card"><input type="checkbox" checked={!!data.equipavel?.[k]} onChange={e=>updateField(`equipavel.${k}`,e.target.checked)}/><div className="fabula-check-icon">{icon}</div><div className="fabula-check-text">{n}</div></label>)}</div></div></div>
                                              <label className="block text-xs font-bold text-gray-600 fabula-list-card"><div className="fabula-list-card-head"><h3 className="font-title font-bold text-teal-900">Características</h3></div><div className="fabula-list-card-body"><textarea value={data.caracteristicas||''} onChange={e=>updateField('caracteristicas',e.target.value)} rows="5" className="w-full border rounded p-2" placeholder="Regras marcantes, qualidade do equipamento, reações defensivas, etc."/></div></label>
                                              <div className="fabula-list-card">
                                                  <div className="fabula-list-card-head flex items-center justify-between gap-3">
                                                      <div><h3 className="font-title font-bold text-teal-900">🎒 Inventário / Mochila</h3><p className="text-[10px] text-gray-500">Itens guardados pelo personagem que não estão equipados.</p></div>
                                                      <button type="button" onClick={()=>addToArray('inventario',{nome:'',quantidade:1,notas:''})} className="fabula-action-btn">+ Item</button>
                                                  </div>
                                                  <div className="fabula-list-card-body space-y-3">
                                                      <details className="rounded-lg border border-teal-200 bg-white overflow-hidden">
                                                          <summary className="cursor-pointer select-none px-3 py-2 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100">🧪 Consulta rápida de PI — itens consumíveis</summary>
                                                          <div className="p-3 space-y-2">
                                                              <p className="text-[10px] text-gray-500">Pontos de Inventário representam consumíveis e utilidades preparados na hora. O item é criado, usado imediatamente e não fica guardado na mochila.</p>
                                                              <div className="overflow-x-auto">
                                                                  <table className="w-full min-w-[520px] text-[11px] border-collapse">
                                                                      <thead><tr className="bg-teal-50 text-teal-900"><th className="text-left border border-teal-200 px-2 py-1.5">Item</th><th className="w-20 text-center border border-teal-200 px-2 py-1.5">PI</th><th className="text-left border border-teal-200 px-2 py-1.5">Uso rápido</th></tr></thead>
                                                                      <tbody>
                                                                          <tr><td className="border border-teal-100 px-2 py-1.5 font-bold">Elixir</td><td className="border border-teal-100 px-2 py-1.5 text-center">3</td><td className="border border-teal-100 px-2 py-1.5">Recupera 50 PM de uma criatura.</td></tr>
                                                                          <tr className="bg-gray-50"><td className="border border-teal-100 px-2 py-1.5 font-bold">Remédio</td><td className="border border-teal-100 px-2 py-1.5 text-center">3</td><td className="border border-teal-100 px-2 py-1.5">Recupera 50 PV de uma criatura.</td></tr>
                                                                          <tr><td className="border border-teal-100 px-2 py-1.5 font-bold">Tônico</td><td className="border border-teal-100 px-2 py-1.5 text-center">2</td><td className="border border-teal-100 px-2 py-1.5">Remove todas as condições de uma criatura.</td></tr>
                                                                          <tr className="bg-gray-50"><td className="border border-teal-100 px-2 py-1.5 font-bold">Fragmento elemental</td><td className="border border-teal-100 px-2 py-1.5 text-center">2</td><td className="border border-teal-100 px-2 py-1.5">Causa 10 de dano de ar, fogo, gelo, raio ou terra a uma criatura visível.</td></tr>
                                                                          <tr><td className="border border-teal-100 px-2 py-1.5 font-bold">Barraca mágica</td><td className="border border-teal-100 px-2 py-1.5 text-center">4</td><td className="border border-teal-100 px-2 py-1.5">Permite que o grupo descanse nos ermos.</td></tr>
                                                                      </tbody>
                                                                  </table>
                                                              </div>
                                                              <p className="text-[10px] text-gray-500">Limite padrão: 6 PI. Classes e poderes podem alterar o limite ou permitir outros usos. Consulte o Livro Básico para exceções e itens especiais.</p>
                                                          </div>
                                                      </details>
                                                      {(data.inventario||[]).length === 0 && <div className="text-xs text-gray-400 italic text-center py-3">Nenhum item guardado.</div>}
                                                      {(data.inventario||[]).map((it,i)=><div key={i} className="fabula-equipment-row grid grid-cols-1 sm:grid-cols-[1fr_90px_1.4fr_32px] gap-2">
                                                          <div><div className="fabula-input-label">Item</div><input value={it.nome||''} onChange={e=>updateArrayField('inventario',i,'nome',e.target.value)} className="border rounded p-2 text-xs" placeholder="Item"/></div>
                                                          <div><div className="fabula-input-label">Qtd.</div><input type="number" min="0" value={it.quantidade??1} onChange={e=>updateArrayField('inventario',i,'quantidade',Number(e.target.value))} className="border rounded p-2 text-xs" placeholder="Qtd."/></div>
                                                          <div><div className="fabula-input-label">Notas</div><input value={it.notas||''} onChange={e=>updateArrayField('inventario',i,'notas',e.target.value)} className="border rounded p-2 text-xs" placeholder="Descrição / efeito / observação"/></div>
                                                          <button type="button" onClick={()=>removeFromArray('inventario',i)} className="fabula-remove-btn">×</button>
                                                      </div>)}
                                                  </div>
                                              </div>
                                              <label className="block text-xs font-bold text-gray-600 fabula-list-card"><div className="fabula-list-card-head"><h3 className="font-title font-bold text-teal-900">Mochila & Anotações</h3></div><div className="fabula-list-card-body"><textarea value={data.mochila||''} onChange={e=>updateField('mochila',e.target.value)} rows="5" className="w-full border rounded p-2" placeholder="Anotações gerais, itens especiais, lembretes..."/></div></label>
                                          </div>
                                      )}
      
                                      {fabulaTab === 'classes' && (
                                          <div className="space-y-5 animate-fade-in-up fabula-subpanel">
                                              <div className="flex justify-between items-center gap-3"><div><div className="fabula-pill-title">✨ Classes & Poderes</div><p className="text-xs text-gray-500 mt-2">Classes, níveis, benefícios, poderes e progressão heroica.</p></div><button onClick={()=>addToArray('classes',{nome:'',nivel:1,beneficios:'',poderes:[]})} className="fabula-action-btn">+ Classe</button></div>
                                              {(data.classes||[]).map((cl,ci)=><div key={ci} className="fabula-list-card"><div className="fabula-list-card-head grid grid-cols-[1fr_90px_38px] gap-2 items-center"><div><div className="fabula-input-label">Classe</div><input value={cl.nome||''} onChange={e=>{const arr=JSON.parse(JSON.stringify(data.classes));arr[ci].nome=e.target.value;updateField('classes',arr)}} className="border rounded p-2 font-bold" placeholder="Classe"/></div><div><div className="fabula-input-label">Nível</div><input type="number" min="1" value={cl.nivel||1} onChange={e=>{const arr=JSON.parse(JSON.stringify(data.classes));arr[ci].nivel=Number(e.target.value);updateField('classes',arr)}} className="border rounded p-2"/></div><button onClick={()=>removeFromArray('classes',ci)} className="fabula-remove-btn">×</button></div><div className="fabula-list-card-body space-y-3"><label className="block"><span className="fabula-input-label">Benefícios gratuitos / observações</span><textarea value={cl.beneficios||''} onChange={e=>{const arr=JSON.parse(JSON.stringify(data.classes));arr[ci].beneficios=e.target.value;updateField('classes',arr)}} className="w-full border rounded p-2 text-xs" rows="2" placeholder="Benefícios gratuitos / observações"/></label><div className="fabula-two-col-grid">{(cl.poderes||[]).map((p,pi)=><div key={pi} className="fabula-power-row grid grid-cols-[1fr_38px] gap-2 items-start"><div className="space-y-2"><div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-2"><div><div className="fabula-input-label">Poder</div><input value={p.nome||''} onChange={e=>{const arr=JSON.parse(JSON.stringify(data.classes));arr[ci].poderes[pi].nome=e.target.value;updateField('classes',arr)}} className="border rounded p-2 text-xs" placeholder="Poder"/></div><div><div className="fabula-input-label">Nível / NP</div><input value={p.nivel||''} onChange={e=>{const arr=JSON.parse(JSON.stringify(data.classes));arr[ci].poderes[pi].nivel=e.target.value;updateField('classes',arr)}} className="border rounded p-2 text-xs" placeholder="NP"/></div></div><div><div className="fabula-input-label">Efeito / lembrete</div><textarea value={p.desc||''} onChange={e=>{const arr=JSON.parse(JSON.stringify(data.classes));arr[ci].poderes[pi].desc=e.target.value;updateField('classes',arr)}} className="w-full border rounded p-2 text-xs" rows="3" placeholder="Efeito / lembrete"/></div></div><div className="fabula-move-col"><button type="button" onClick={()=>moveNestedArrayItem('classes',ci,'poderes',pi,-1)} className="fabula-move-btn" title="Mover para cima">↑</button><button type="button" onClick={()=>moveNestedArrayItem('classes',ci,'poderes',pi,1)} className="fabula-move-btn" title="Mover para baixo">↓</button><button onClick={()=>{const arr=JSON.parse(JSON.stringify(data.classes));arr[ci].poderes.splice(pi,1);updateField('classes',arr)}} className="fabula-remove-btn">×</button></div></div>)}</div><button onClick={()=>{const arr=JSON.parse(JSON.stringify(data.classes));arr[ci].poderes.push({nome:'',nivel:'',desc:''});updateField('classes',arr)}} className="fabula-soft-btn">+ Poder</button></div></div>)}
                                              <div className="fabula-list-card"><div className="fabula-list-card-head flex items-center justify-between gap-2"><h3 className="font-title font-bold text-teal-900">Poderes Heroicos</h3><button onClick={()=>addToArray('poderesHeroicos',{nome:'',desc:''})} className="fabula-action-btn">+ Poder Heroico</button></div><div className="fabula-list-card-body space-y-2">{(data.poderesHeroicos||[]).length===0 && <div className="text-xs text-gray-400 italic">Nenhum poder heroico registrado.</div>}{(data.poderesHeroicos||[]).map((p,i)=><div key={i} className="fabula-hero-row grid grid-cols-[1fr_38px] gap-2 items-start"><div className="space-y-2"><div><div className="fabula-input-label">Nome</div><input value={p.nome||''} onChange={e=>updateArrayField('poderesHeroicos',i,'nome',e.target.value)} className="border rounded p-2 text-xs" placeholder="Nome"/></div><div><div className="fabula-input-label">Efeito / lembrete</div><textarea value={p.desc||''} onChange={e=>updateArrayField('poderesHeroicos',i,'desc',e.target.value)} className="w-full border rounded p-2 text-xs" rows="3" placeholder="Efeito / lembrete"/></div></div><div className="fabula-move-col"><button type="button" onClick={()=>moveArrayItem('poderesHeroicos',i,-1)} className="fabula-move-btn" title="Mover para cima">↑</button><button type="button" onClick={()=>moveArrayItem('poderesHeroicos',i,1)} className="fabula-move-btn" title="Mover para baixo">↓</button><button onClick={()=>removeFromArray('poderesHeroicos',i)} className="fabula-remove-btn">×</button></div></div>)}</div></div>
                                          </div>
                                      )}
      
                                      {fabulaTab === 'extra-magia' && <FabulaMagicPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-arcanos' && <FabulaArcanosPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-mnemosfera' && <FabulaMnemosferaPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-receitas' && <FabulaReceitasPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-projetos' && <FabulaProjetosPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-anotacoes' && <FabulaNotasPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-peculiaridade' && <FabulaPeculiaridadePanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-armaPersonalizada' && <FabulaArmasPersonalizadasPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-recursosClasse' && <FabulaRecursosClassePanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-acampamento' && <FabulaAcampamentoPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-jardim' && <FabulaJardimPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-invocacoes' && <FabulaInvocacoesPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-comercio' && <FabulaComercioPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-materiais' && <FabulaMateriaisPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-poderZero' && <FabulaPoderZeroPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-tecnosferas' && <FabulaTecnosferasPanel data={data} updateField={updateField} />}
                                      {fabulaTab === 'extra-veiculo' && <FabulaVeiculoPanel data={data} updateField={updateField} />}
      
                                      <div className="mt-8 rounded border border-teal-200 bg-teal-50 p-3 text-[10px] text-teal-900">Compatibilidade com Fabula Ultima — interface independente e não oficial do PJ Lite, organizada para consulta e gerenciamento de fichas.</div>
                                  </div>
      
                                  {showFabulaExtras && ReactDOM.createPortal(
                                      <div className="fixed inset-0 z-[150] bg-black/60 p-4 flex items-center justify-center"><div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl border-2 border-teal-700 overflow-hidden max-h-[90vh] flex flex-col"><div className="bg-teal-800 text-white p-3 flex justify-between shrink-0"><div><h3 className="font-title font-bold">Fichas Extras & Materiais</h3><p className="text-[10px] text-teal-100">Mude os suplementos quando precisar; dados de módulos ocultos não são apagados.</p></div><button onClick={()=>setShowFabulaExtras(false)} className="text-2xl">×</button></div><div className="p-4 space-y-4 overflow-y-auto"><div><h4 className="font-title font-bold text-teal-900 mb-1">📚 Materiais habilitados</h4><p className="text-[10px] text-gray-500 mb-3">Clique em um suplemento para ativar ou desativar. O Livro Básico permanece sempre ligado.</p><div className="grid sm:grid-cols-2 gap-2">{FABULA_SUPPLEMENT_OPTIONS.map(src=>{const checked=src.locked||!!data.suplementos?.[src.id];return <button type="button" key={src.id} disabled={!!src.locked} aria-pressed={checked} onClick={()=>!src.locked&&setFabulaSupplementEnabled(src.id,!checked)} className={`fabula-supplement-card ${checked?'active':''} ${src.locked?'locked':''}`}><span className="fabula-supplement-icon">{src.icon}</span><span className="min-w-0 text-left"><span className="flex items-center gap-2"><strong className="text-xs">{src.nome}</strong>{src.locked&&<span className="fabula-supplement-status">sempre</span>}</span><span className="block text-[9px] opacity-70 mt-1">{src.desc}</span></span><span className="fabula-supplement-check" aria-hidden="true">{checked?'✓':'＋'}</span></button>})}</div></div><div className="border-t pt-4"><h4 className="font-title font-bold text-teal-900 mb-1">＋ Fichas Extras disponíveis</h4><p className="text-[10px] text-gray-500 mb-2">Extras do Livro Básico, como Arcanos, Magia & Rituais e Projetos, ficam disponíveis independentemente dos suplementos.</p><div className="space-y-2">{FABULA_EXTRA_OPTIONS.filter(opt=>isFabulaExtraUnlocked(opt,data.suplementos)||(data.extrasAtivos||[]).includes(opt.id)).map(opt=>{const active=(data.extrasAtivos||[]).includes(opt.id);return <label key={opt.id} className={`flex items-start gap-3 border-2 rounded p-3 cursor-pointer ${active?'border-teal-600 bg-teal-50':'border-gray-200'}`}><input type="checkbox" checked={active} onChange={e=>{let arr=[...(data.extrasAtivos||[])]; if(e.target.checked){if(!arr.includes(opt.id))arr.push(opt.id)}else arr=arr.filter(x=>x!==opt.id); updateField('extrasAtivos',arr); if(e.target.checked)setFabulaTab(`extra-${opt.id}`); else if(fabulaTab===`extra-${opt.id}`)setFabulaTab('perfil')}} className="mt-1"/><div><div className="font-bold text-sm">{opt.icon} {opt.nome}</div><div className="text-xs text-gray-500">{opt.desc}</div></div></label>})}</div></div><div className="pt-2 flex justify-end"><button onClick={()=>setShowFabulaExtras(false)} className="bg-teal-800 text-white px-4 py-2 rounded font-bold text-xs">Concluir</button></div></div></div></div>, document.body
                                  )}
                              </div>
                          )}
    </>
  );
}
