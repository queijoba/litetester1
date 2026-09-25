// Extraído automaticamente do antigo PJLiteApp monolítico.
// Este arquivo agora é a fonte visual do editor deste sistema.
export default function Som6CharacterEditor({ scope }) {
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
      {isSom6 && data.type === 'pc' && (
                              <div className="som6-paper">
                                  <div className="pj-mobile-tabs flex overflow-x-auto bg-red-950 text-amber-50 border-b border-red-900 sticky top-0 z-20 shadow-sm">
                                      {[['perfil','Ficha'],['montaria','Montaria']].map(([id,label])=><button key={id} onClick={()=>setSom6Tab(id)} className={`shrink-0 px-5 py-3 text-[10px] font-bold uppercase border-b-4 ${som6Tab===id?'border-amber-300 bg-red-900':'border-transparent opacity-75'}`}>{label}</button>)}
                                  </div>
                                  <div className="p-3 md:p-5">
                                      {som6Tab!=='montaria' && <div className="som6-sheet max-w-6xl mx-auto space-y-3 animate-fade-in-up">
                                          <div className="flex items-end justify-between gap-3 px-1">
                                              <div className="som6-logo text-3xl sm:text-5xl">O Som das Seis</div>
                                              <div className="text-[9px] font-bold uppercase tracking-widest text-red-900 text-right">Ficha integrada • v0.7 Alpha</div>
                                          </div>
      
                                          <div className="som6-frame som6-frame-cut">
                                              <div className="grid grid-cols-[98px_1fr] sm:grid-cols-[118px_1fr_108px] gap-2 items-stretch">
                                                  <div className="min-w-0">
                                                      <div className="som6-portrait h-[112px] sm:h-[132px] relative group">
                                                          {data.bio?.imagem ? <img src={data.bio.imagem} alt={`Retrato de ${data.bio?.nome||'personagem'}`} className="som6-portrait-img"/> : <div className="som6-portrait-empty">retrato<br/>da personagem</div>}
                                                      </div>
                                                      {!showUrlInput ? <div className="som6-portrait-actions">
                                                          <label className="bg-amber-50 text-stone-900 border border-stone-400 hover:bg-white" title="Enviar imagem">Upload<input type="file" accept="image/*" className="hidden" onChange={async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;try{updateField('bio.imagem',await optimizeImageFile(f,720,0.82));showToast('Retrato atualizado!');}catch(err){console.error(err);showToast('Não foi possível usar esta imagem.');}}}/></label>
                                                          <button type="button" onClick={()=>setShowUrlInput(true)} className="bg-stone-800 text-white border border-stone-700 hover:bg-black">URL</button>
                                                          {data.bio?.imagem && <button type="button" onClick={()=>updateField('bio.imagem','')} className="col-span-2 bg-red-900 text-white border border-red-950 hover:bg-red-800">Remover</button>}
                                                      </div> : <div className="mt-1 space-y-1">
                                                          <input type="url" value={tempUrl} onChange={e=>setTempUrl(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&tempUrl.trim()){updateField('bio.imagem',tempUrl.trim());setTempUrl('');setShowUrlInput(false);}}} className="w-full border rounded px-1.5 py-1 text-[9px]" placeholder="https://..."/>
                                                          <div className="grid grid-cols-2 gap-1"><button type="button" onClick={()=>{if(tempUrl.trim()){updateField('bio.imagem',tempUrl.trim());setTempUrl('');setShowUrlInput(false);}}} className="rounded bg-red-900 text-white text-[9px] font-bold py-1">Aplicar</button><button type="button" onClick={()=>{setTempUrl('');setShowUrlInput(false)}} className="rounded bg-stone-600 text-white text-[9px] font-bold py-1">Voltar</button></div>
                                                      </div>}
                                                  </div>
                                                  <div className="som6-stat-box min-w-0">
                                                      <span className="font-serif font-black text-lg">nome</span><input value={data.bio?.nome||''} onChange={e=>updateField('bio.nome',e.target.value)} className="w-full border rounded som6-mini-input mt-1 text-lg font-bold"/>
                                                      <div className="grid grid-cols-2 gap-1 mt-2 sm:hidden"><label><span className="som6-label !text-stone-600">nível</span><input type="number" min="1" max="6" value={data.nivel||1} onChange={e=>updateField('nivel',Number(e.target.value))} className="w-full border rounded som6-mini-input mt-1 text-center font-black"/></label><label><span className="som6-label !text-stone-600">jogador</span><input value={data.bio?.jogador||''} onChange={e=>updateField('bio.jogador',e.target.value)} className="w-full border rounded som6-mini-input mt-1 text-xs"/></label></div>
                                                      <label className="hidden sm:block mt-2"><span className="som6-label !text-stone-600">jogador</span><input value={data.bio?.jogador||''} onChange={e=>updateField('bio.jogador',e.target.value)} className="w-full border rounded som6-mini-input mt-1 text-xs" placeholder="Nome de quem joga"/></label>
                                                  </div>
                                                  <div className="som6-stat-box hidden sm:block"><span className="font-serif font-black text-lg">nível</span><input type="number" min="1" max="6" value={data.nivel||1} onChange={e=>updateField('nivel',Number(e.target.value))} className="w-full border rounded som6-mini-input mt-1 text-center text-lg font-black"/><div className="mt-2"><span className="som6-label !text-stone-600">XP</span><input type="number" min="0" value={data.xp||0} onChange={e=>updateField('xp',Number(e.target.value))} className="w-full border rounded som6-mini-input mt-1 text-center"/></div></div>
                                              </div>
                                          </div>
      
                                          <div className="grid lg:grid-cols-[0.9fr_1.5fr] gap-4 items-start">
                                              <div className="space-y-3">
                                                  <div className="grid grid-cols-[1fr_92px] gap-3">
                                                      <div className="som6-frame som6-frame-cut">
                                                          <div className="text-center font-serif font-black text-amber-50 mb-2">atributos</div>
                                                          <div className="space-y-2.5">
                                                              {[['fisico','físico'],['agilidade','agilidade'],['intelecto','intelecto'],['coragem','coragem']].map(([k,n])=><div key={k} className="flex items-center justify-between gap-2"><span className="font-serif font-black text-amber-50 text-sm sm:text-base">{n}</span><Som6Pips value={data.atributos?.[k]||0} onChange={v=>updateField(`atributos.${k}`,v)} title={n}/></div>)}
                                                          </div>
                                                      </div>
                                                      <div className="space-y-3">
                                                          <div className="som6-frame som6-frame-cut"><div className="som6-stat-box text-center"><div className="font-serif font-black">vida</div><div className="grid grid-cols-2 gap-1 mt-1"><input type="number" value={data.status?.pvAtual??0} onChange={e=>updateField('status.pvAtual',Number(e.target.value))} className="w-full border rounded som6-mini-input text-center font-bold" title="PV atual"/><input type="number" value={data.status?.pvMax??0} onChange={e=>updateField('status.pvMax',Number(e.target.value))} className="w-full border rounded som6-mini-input text-center font-bold" title="PV máximo"/></div><div className="text-[8px] uppercase mt-1 opacity-60">atual / máx.</div></div></div>
                                                          <div className="som6-frame som6-frame-cut"><div className="som6-stat-box text-center"><div className="font-serif font-black">defesa</div><input type="number" value={data.status?.defesa??5} onChange={e=>updateField('status.defesa',Number(e.target.value))} className="w-full border rounded som6-mini-input mt-1 text-center text-lg font-black"/></div></div>
                                                      </div>
                                                  </div>
      
                                                  <div className="grid grid-cols-2 gap-3">
                                                      <div className="som6-frame som6-frame-cut"><div className="som6-stat-box"><div className="font-serif font-black">iniciativa</div><input type="number" value={data.status?.iniciativa??1} onChange={e=>updateField('status.iniciativa',Number(e.target.value))} className="w-full border rounded som6-mini-input mt-1 text-center font-black"/></div></div>
                                                      <div className="som6-frame som6-frame-cut"><div className="som6-stat-box"><div className="font-serif font-black">ações</div><input type="number" min="1" value={data.status?.acoes??1} onChange={e=>updateField('status.acoes',Number(e.target.value))} className="w-full border rounded som6-mini-input mt-1 text-center font-black"/></div></div>
                                                  </div>
      
                                                  <div className="som6-frame som6-frame-cut">
                                                      <div className="som6-cream rounded-xl p-3">
                                                          <div className="flex items-center justify-between gap-2 mb-2"><div className="font-serif font-black text-center flex-1">antecedentes</div><span className="text-[8px] font-bold uppercase text-red-900">4 pontos iniciais</span></div>
                                                          <div className="space-y-2">{SOM6_ANTECEDENTES.map(([id,nome])=><div key={id} className="flex items-center justify-between gap-2"><span className="font-serif font-black text-sm">{nome.toLowerCase()}</span><Som6Pips value={data.antecedentes?.[id]??0} onChange={v=>updateField(`antecedentes.${id}`,v)} title={nome}/></div>)}</div>
                                                      </div>
                                                  </div>
                                              </div>
      
                                              <div className="space-y-3">
                                                  <div className="grid sm:grid-cols-2 gap-3">
                                                      <div className="som6-frame som6-frame-cut"><div className="som6-stat-box"><div className="font-serif font-black">tormento</div><select value={data.tormento?.tipo||''} onChange={e=>updateField('tormento.tipo',e.target.value)} className="w-full border rounded som6-mini-input mt-1 text-xs"><option value="">Tipo...</option>{['Vingança','Fugindo','Vício','Segredo','Doença','Dever'].map(x=><option key={x}>{x}</option>)}</select><textarea rows="2" value={data.tormento?.desc||''} onChange={e=>updateField('tormento.desc',e.target.value)} className="w-full border rounded p-2 mt-1 text-xs som6-compact-textarea" placeholder="Descreva o Tormento..."/></div></div>
                                                      <div className="som6-frame som6-frame-cut"><div className="som6-stat-box"><div className="font-serif font-black">recompensa</div><div className="flex items-center gap-1 mt-1"><span className="font-black">$</span><input type="number" min="0" value={data.recompensa??0} onChange={e=>updateField('recompensa',Number(e.target.value))} className="w-full border rounded som6-mini-input font-bold"/></div><div className="mt-2 sm:hidden"><span className="som6-label !text-stone-600">XP</span><input type="number" min="0" value={data.xp||0} onChange={e=>updateField('xp',Number(e.target.value))} className="w-full border rounded som6-mini-input mt-1"/></div></div></div>
                                                  </div>
      
                                                  <div className="som6-frame som6-frame-cut h-full">
                                                      <div className="som6-cream rounded-xl p-3 h-full">
                                                          <div className="flex flex-wrap justify-between items-center gap-2 mb-2"><div><div className="font-serif font-black text-lg">habilidades</div><div className="som6-help-chip mt-1">2 iniciais • arraste a ordem com ↑ ↓</div></div><button type="button" onClick={()=>updateField('habilidades',[...(data.habilidades||[]),{nome:'',desc:''}])} className="bg-red-900 text-white rounded px-2 py-1 text-[10px] font-bold">＋ habilidade</button></div>
                                                          <div className="som6-skill-grid">{(data.habilidades||[]).map((h,i)=><div key={i} className="som6-skill-card grid grid-cols-[1fr_28px] gap-2"><div className="min-w-0"><input list="som6-habs" value={h.nome||''} onChange={e=>{const x=[...(data.habilidades||[])];x[i]={...x[i],nome:e.target.value};updateField('habilidades',x)}} className="w-full border rounded som6-mini-input text-xs font-black" placeholder={`Habilidade ${i+1}`}/>{i===0&&<datalist id="som6-habs">{SOM6_HABILIDADES.map(n=><option key={n} value={n}/>)}</datalist>}<textarea rows="3" value={h.desc||''} onChange={e=>{const x=[...(data.habilidades||[])];x[i]={...x[i],desc:e.target.value};updateField('habilidades',x)}} className="w-full border rounded p-1.5 mt-1 text-[11px] som6-compact-textarea" placeholder="Gatilho e resumo do efeito"/></div><div className="som6-order-col"><button type="button" disabled={i===0} onClick={()=>moveArrayItem('habilidades',i,-1)} className="som6-order-btn" title="Mover para cima">↑</button><button type="button" disabled={i===(data.habilidades||[]).length-1} onClick={()=>moveArrayItem('habilidades',i,1)} className="som6-order-btn" title="Mover para baixo">↓</button><button type="button" onClick={()=>updateField('habilidades',(data.habilidades||[]).filter((_,j)=>j!==i))} className="som6-order-btn !text-red-800" title="Remover">×</button></div></div>)}</div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
      
                                          <div className="grid md:grid-cols-[1fr_230px] gap-3">
                                              <div className="som6-frame som6-frame-cut"><div className="som6-stat-box"><div className="font-serif font-black">reputação</div><div className="grid sm:grid-cols-[110px_1fr] gap-2 mt-1"><select value={data.reputacao?.valor??0} onChange={e=>updateField('reputacao.valor',Number(e.target.value))} className="border rounded som6-mini-input text-xs"><option value={-1}>-1 Má</option><option value={0}>0 Neutra</option><option value={1}>+1 Boa</option></select><input value={data.reputacao?.titulo||''} onChange={e=>updateField('reputacao.titulo',e.target.value)} className="border rounded som6-mini-input text-xs" placeholder="Como é conhecida?"/></div></div></div>
                                              <div className="som6-frame som6-frame-cut"><div className="som6-stat-box"><div className="font-serif font-black">U$</div><input type="number" step="0.5" value={data.dinheiro??150} onChange={e=>updateField('dinheiro',Number(e.target.value))} className="w-full border rounded som6-mini-input mt-1 text-right font-black"/></div></div>
                                          </div>
      
                                          <div className="som6-frame som6-frame-cut">
                                              <div className="som6-cream rounded-xl p-3">
                                                  <div className="flex justify-between items-center gap-2"><div><div className="font-serif font-black text-lg">equipamento</div><div className="text-[9px] text-stone-600">Armas mantêm dano, munição e recarga; outros itens ficam logo abaixo.</div></div><button onClick={()=>updateField('armas',[...(data.armas||[]),{nome:'',dano:'',municaoAtual:'',municaoMax:'',recarga:'',notas:''}])} className="bg-red-900 text-white rounded px-2 py-1 text-[10px] font-bold">＋ arma</button></div>
                                                  <div className="hidden md:grid grid-cols-[1.25fr_.65fr_.8fr_.7fr_1.2fr_26px] gap-1 text-[8px] font-black uppercase mt-2 px-1"><span>arma</span><span>dano</span><span>munição</span><span>recarga</span><span>notas</span><span></span></div>
                                                  <div className="space-y-1 mt-1">{(data.armas||[]).map((a,i)=><div key={i} className="som6-table-row rounded p-1.5 grid grid-cols-2 md:grid-cols-[1.25fr_.65fr_.8fr_.7fr_1.2fr_26px] gap-1"><input value={a.nome||''} onChange={e=>{const x=[...(data.armas||[])];x[i]={...x[i],nome:e.target.value};updateField('armas',x)}} className="border rounded som6-mini-input text-xs" placeholder="Arma"/><input value={a.dano||''} onChange={e=>{const x=[...(data.armas||[])];x[i]={...x[i],dano:e.target.value};updateField('armas',x)}} className="border rounded som6-mini-input text-xs" placeholder="Dano"/><input value={`${a.municaoAtual??''}${a.municaoAtual!==''&&a.municaoMax!==''?'/':''}${a.municaoMax??''}`} onChange={e=>{const [at='',mx='']=e.target.value.split('/');const x=[...(data.armas||[])];x[i]={...x[i],municaoAtual:at,municaoMax:mx};updateField('armas',x)}} className="border rounded som6-mini-input text-xs" placeholder="6/6"/><input value={a.recarga||''} onChange={e=>{const x=[...(data.armas||[])];x[i]={...x[i],recarga:e.target.value};updateField('armas',x)}} className="border rounded som6-mini-input text-xs" placeholder="2 ações"/><input value={a.notas||''} onChange={e=>{const x=[...(data.armas||[])];x[i]={...x[i],notas:e.target.value};updateField('armas',x)}} className="border rounded som6-mini-input text-xs col-span-2 md:col-span-1" placeholder="Modificações / notas"/><button onClick={()=>updateField('armas',(data.armas||[]).filter((_,j)=>j!==i))} className="text-red-800 font-black">×</button></div>)}</div>
                                                  <div className="mt-3 pt-3 border-t border-stone-400/50 flex justify-between items-center"><div className="font-serif font-black">outros itens</div><button onClick={()=>updateField('inventario',[...(data.inventario||[]),{nome:'',quantidade:1,notas:''}])} className="bg-stone-800 text-white rounded px-2 py-1 text-[10px] font-bold">＋ item</button></div>
                                                  <div className="space-y-1 mt-1">{(data.inventario||[]).map((it,i)=><div key={i} className="som6-table-row rounded p-1.5 grid grid-cols-[1fr_64px_1.2fr_26px] gap-1"><input value={it.nome||''} onChange={e=>{const x=[...(data.inventario||[])];x[i]={...x[i],nome:e.target.value};updateField('inventario',x)}} className="border rounded som6-mini-input text-xs" placeholder="Item"/><input type="number" min="0" value={it.quantidade??1} onChange={e=>{const x=[...(data.inventario||[])];x[i]={...x[i],quantidade:Number(e.target.value)};updateField('inventario',x)}} className="border rounded som6-mini-input text-xs"/><input value={it.notas||''} onChange={e=>{const x=[...(data.inventario||[])];x[i]={...x[i],notas:e.target.value};updateField('inventario',x)}} className="border rounded som6-mini-input text-xs" placeholder="Notas"/><button onClick={()=>updateField('inventario',(data.inventario||[]).filter((_,j)=>j!==i))} className="text-red-800 font-black">×</button></div>)}</div>
                                              </div>
                                          </div>
      
                                          <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-3">
                                              <div className="som6-section rounded-lg p-3"><div className="flex justify-between items-center"><h3 className="font-title font-bold som6-title text-sm">🂠 Cartas de Sina</h3><span className="text-[9px] text-stone-500">máx. 2 por sessão</span></div><div className="grid grid-cols-2 gap-2 mt-2">{(data.cartasSina||[]).map((c,i)=><div key={i} className="border rounded bg-white p-2"><input value={c.carta||''} onChange={e=>{const x=[...(data.cartasSina||[])];x[i]={...x[i],carta:e.target.value};updateField('cartasSina',x)}} className="w-full border rounded som6-mini-input text-xs" placeholder={`Carta ${i+1}`}/><label className="mt-1 flex items-center gap-1 text-[10px] font-bold"><input type="checkbox" checked={!!c.usada} onChange={e=>{const x=[...(data.cartasSina||[])];x[i]={...x[i],usada:e.target.checked};updateField('cartasSina',x)}}/> usada</label></div>)}</div><div className="text-[9px] mt-2 text-stone-600">Uma Carta de Sina pode refazer um teste ou reduzir em 1d6 um dano recebido.</div></div>
                                              <div className="som6-section rounded-lg p-3"><div className="flex justify-between items-center"><h3 className="font-title font-bold som6-title text-sm">Detalhes & anotações</h3><span className="text-[9px] text-stone-500">opcional</span></div><div className="grid sm:grid-cols-2 gap-2 mt-2"><input value={data.bio?.aparencia||''} onChange={e=>updateField('bio.aparencia',e.target.value)} className="border rounded som6-mini-input text-xs" placeholder="Aparência / traços visuais"/><input value={data.bio?.apelido||''} onChange={e=>updateField('bio.apelido',e.target.value)} className="border rounded som6-mini-input text-xs" placeholder="Apelido"/><textarea rows="2" value={data.bio?.passado||''} onChange={e=>updateField('bio.passado',e.target.value)} className="border rounded p-2 text-xs som6-compact-textarea" placeholder="Passado"/><textarea rows="2" value={data.anotacoes||''} onChange={e=>updateField('anotacoes',e.target.value)} className="border rounded p-2 text-xs som6-compact-textarea" placeholder="Anotações"/></div></div>
                                          </div>
      
                                          <details className="som6-section rounded-lg"><summary className="cursor-pointer p-3 text-xs font-bold som6-title">📈 Consulta de progressão</summary><div className="px-3 pb-3 grid sm:grid-cols-2 md:grid-cols-3 gap-1 text-[10px]">{SOM6_LEVELS.map(x=><div key={x.nivel} className="border rounded bg-white p-2"><strong>Nv.{x.nivel} — {x.xp} XP</strong><br/>{x.bonus}</div>)}</div></details>
                                          <div className="text-[9px] text-stone-500 text-center pt-1">O Som das Seis — regras por Ramon Mineiro • integração PJ Lite v0.7 Alpha • regras sob CC BY-SA 4.0 conforme o livro.</div>
                                      </div>}
      
                                      {som6Tab==='montaria' && <div className="som6-sheet max-w-6xl mx-auto space-y-3 animate-fade-in-up">
                                          <div className="flex items-end justify-between gap-3 px-1"><div className="som6-logo text-3xl sm:text-5xl">Seu Cavalo</div><label className="text-xs font-bold flex items-center gap-2"><input type="checkbox" checked={!!data.montaria?.ativa} onChange={e=>updateField('montaria.ativa',e.target.checked)}/> possui montaria</label></div>
                                          {!data.montaria?.ativa ? <div className="som6-section rounded-xl p-6 text-center"><div className="text-3xl mb-2">🐎</div><div className="font-title font-bold som6-title">Nenhuma montaria ativa</div><p className="text-xs text-stone-600 mt-1">Marque “possui montaria” para abrir a ficha do animal.</p></div> : <>
                                              <div className="som6-frame som6-frame-cut"><div className="grid grid-cols-1 sm:grid-cols-[1fr_150px_110px] gap-2"><div className="som6-stat-box"><div className="font-serif font-black">nome</div><input value={data.montaria?.nome||''} onChange={e=>updateField('montaria.nome',e.target.value)} className="w-full border rounded som6-mini-input mt-1 font-bold" placeholder="Nome da montaria"/></div><div className="som6-stat-box"><div className="font-serif font-black">tipo</div><input value={data.montaria?.tipo||'Cavalo'} onChange={e=>updateField('montaria.tipo',e.target.value)} className="w-full border rounded som6-mini-input mt-1 text-center font-bold" placeholder="Cavalo"/></div><div className="som6-stat-box"><div className="font-serif font-black">fidelidade</div><input type="number" min="0" max="4" value={data.montaria?.fidelidade??0} onChange={e=>updateField('montaria.fidelidade',Math.max(0,Math.min(4,Number(e.target.value))))} className="w-full border rounded som6-mini-input mt-1 text-center font-black"/></div></div></div>
                                              <div className="grid lg:grid-cols-[.9fr_.75fr_1fr] gap-3">
                                                  <div className="som6-frame som6-frame-cut"><div className="space-y-4 py-2"><div className="flex items-center justify-between gap-2"><div><span className="font-serif font-black text-amber-50 text-lg">potência</span><div className="text-[8px] text-amber-100/75">clique nos marcadores</div></div><Som6Pips value={data.montaria?.potencia||0} onChange={v=>updateField('montaria.potencia',v)} title="Potência"/></div><div className="flex items-center justify-between gap-2"><div><span className="font-serif font-black text-amber-50 text-lg">vigor</span><div className="text-[8px] text-amber-100/75">clique nos marcadores</div></div><Som6Pips value={data.montaria?.vigor||0} onChange={v=>updateField('montaria',{...(data.montaria||{}),vigor:v,resistencia:v})} title="Vigor"/></div></div></div>
                                                  <div className="som6-frame som6-frame-cut"><div className="som6-stat-box space-y-2"><div className="grid grid-cols-[58px_1fr] items-center gap-2"><span className="font-serif font-black">vida</span><div className="grid grid-cols-2 gap-1"><input type="number" value={data.montaria?.pvAtual??0} onChange={e=>updateField('montaria.pvAtual',Number(e.target.value))} className="border rounded som6-mini-input text-center"/><input type="number" value={data.montaria?.pvMax??0} onChange={e=>updateField('montaria.pvMax',Number(e.target.value))} className="border rounded som6-mini-input text-center"/></div></div><div className="text-[8px] text-right -mt-1">referência da ficha: 1d6 + Vigor</div><div className="grid grid-cols-[58px_1fr] items-center gap-2"><span className="font-serif font-black">defesa</span><input type="number" value={data.montaria?.defesa??5} onChange={e=>updateField('montaria.defesa',Number(e.target.value))} className="border rounded som6-mini-input text-center"/></div><div className="text-[8px] text-right -mt-1">referência: 5 + Vigor</div><div className="grid grid-cols-[58px_1fr] items-center gap-2"><span className="font-serif font-black">dano</span><input value={data.montaria?.dano||''} onChange={e=>updateField('montaria.dano',e.target.value)} className="border rounded som6-mini-input text-center" placeholder="6 + Potência"/></div></div></div>
                                                  <div className="som6-frame som6-frame-cut"><div className="som6-cream rounded-xl p-3"><div className="flex justify-between items-center"><div className="font-serif font-black">itens no cavalo</div><button onClick={()=>updateField('montaria.itens',[...(data.montaria?.itens||[]),{nome:''}])} className="bg-red-900 text-white rounded px-2 py-1 text-[10px] font-bold">＋</button></div><div className="space-y-1 mt-2">{(data.montaria?.itens||[]).map((it,i)=><div key={i} className="grid grid-cols-[1fr_22px] gap-1"><input value={it.nome||''} onChange={e=>{const x=[...(data.montaria?.itens||[])];x[i]={...x[i],nome:e.target.value};updateField('montaria.itens',x)}} className="border rounded som6-mini-input text-xs" placeholder="Item"/><button onClick={()=>updateField('montaria.itens',(data.montaria?.itens||[]).filter((_,j)=>j!==i))} className="text-red-800 font-black">×</button></div>)}</div></div></div>
                                              </div>
                                              <div className="som6-frame som6-frame-cut"><div className="som6-cream rounded-xl p-3 space-y-2">{[
                                                  [1,'Antes de mais nada, dê um nome a seu animal. Agora sabe quando você está falando com ele.'],
                                                  [2,'O cavalo corre mais rápido e pode saltar mais longe. Adicione +1 à Potência.'],
                                                  [3,'O cavalo vai até você com um assovio e não permite que outras pessoas o montem.'],
                                                  [4,'Seu cavalo está mais esbelto e forte. Adicione +2 à Potência.']
                                              ].map(([n,txt])=><button key={n} type="button" onClick={()=>updateField('montaria.fidelidade',n)} className={`w-full text-left flex items-start gap-3 rounded p-2 border ${Number(data.montaria?.fidelidade||0)>=n?'bg-red-50 border-red-800':'bg-white border-stone-300'}`}><span className={`som6-pip shrink-0 ${Number(data.montaria?.fidelidade||0)>=n?'active':''}`}>{Number(data.montaria?.fidelidade||0)>=n?'✓':''}</span><span className="text-xs">{txt}</span></button>)}<textarea rows="2" value={data.montaria?.notas||''} onChange={e=>updateField('montaria.notas',e.target.value)} className="w-full border rounded p-2 text-xs som6-compact-textarea mt-1" placeholder="Notas sobre a montaria..."/></div></div>
                                          </>}
                                          <div className="text-[9px] text-stone-500 text-center pt-1">Layout inspirado na ficha editável de O Som das Seis enviada como referência.</div>
                                      </div>}
                                  </div>
                              </div>
                          )}
    </>
  );
}
