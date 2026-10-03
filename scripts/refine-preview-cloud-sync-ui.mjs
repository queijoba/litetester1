import { readFile, writeFile } from 'node:fs/promises';

const appPath = 'src/PJLiteApp.jsx';
const cssPath = 'src/pjlite.css';
const marker = 'PJ LITE CLOUD SYNC DISCREET UI V2';

let app = await readFile(appPath, 'utf8');
let css = await readFile(cssPath, 'utf8');

if (app.includes(marker)) {
  console.log('Cloud Sync discreet UI: already applied.');
  process.exit(0);
}

const stateAnchor = "            const [showCloudModal, setShowCloudModal] = useState(false);";
if (!app.includes(stateAnchor)) throw new Error('Cloud Sync V2: estado do modal não encontrado.');
app = app.replace(
  stateAnchor,
  `${stateAnchor}\n            const [showCloudSettings, setShowCloudSettings] = useState(false);\n            // ${marker}`
);

const sectionStartMarker = '                            <section className="pjlite-cloud-preview no-print">';
const modalStartMarker = '                            {showCloudModal &&';
const sectionStart = app.indexOf(sectionStartMarker);
const modalStart = app.indexOf(modalStartMarker, sectionStart);
if (sectionStart < 0 || modalStart < 0) throw new Error('Cloud Sync V2: painel original não encontrado.');

const discreetUi = `                            <div className="pjlite-cloud-compact no-print">
                                <button type="button" className="pjlite-cloud-compact__button" onClick={()=>setShowCloudSettings(true)} title="Conta e sincronização">
                                    <span className={'pjlite-cloud-compact__dot '+(cloudAccount?(cloudStatus==='error'?'is-error':cloudStatus==='syncing'||cloudStatus==='pending'?'is-working':'is-online'):'')}></span>
                                    <span className="pjlite-cloud-compact__icon">☁</span>
                                    <span className="pjlite-cloud-compact__label">Conta & Nuvem</span>
                                    <small>{cloudAccount?(cloudStatus==='syncing'?'Sincronizando…':cloudStatus==='pending'?'Pendente':cloudStatus==='error'?'Erro':'Ativa'):'Opcional'}</small>
                                </button>
                            </div>

                            {showCloudSettings && <div className="pjlite-cloud-settings-shell no-print" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCloudSettings(false)}}>
                                <section className="pjlite-cloud-settings" role="dialog" aria-modal="true" aria-label="Conta e Nuvem">
                                    <header className="pjlite-cloud-settings__header">
                                        <div><span className="pjlite-cloud-settings__eyebrow">CONFIGURAÇÕES</span><h2>Conta & Nuvem</h2></div>
                                        <button type="button" className="pjlite-cloud-settings__close" onClick={()=>setShowCloudSettings(false)} aria-label="Fechar">×</button>
                                    </header>
                                    <div className="pjlite-cloud-settings__tabs"><button type="button" className="active">☁ Sincronização</button></div>
                                    <div className="pjlite-cloud-settings__content">
                                        {!cloudAccount ? <>
                                            <div className="pjlite-cloud-settings__intro"><span className="pjlite-cloud-settings__mark">☁</span><div><strong>Sincronização opcional</strong><p>Suas fichas continuam locais normalmente. Conecte uma Conta Lite apenas se quiser testar a sincronização.</p></div></div>
                                            <button type="button" className="pjlite-cloud-google pjlite-cloud-google--wide" onClick={()=>setShowCloudModal(true)}><span>G</span> Simular login com Google</button>
                                            <div className="pjlite-cloud-settings__hint">Prévia: a nuvem ainda é simulada neste navegador. Nenhum dado é enviado ao Google ou a servidores externos.</div>
                                        </> : (()=>{const remote=readPreviewCloud(cloudAccount);const localCount=savedChars.length+savedThreats.length;const remoteCount=(remote?.characters?.length||0)+(remote?.threats?.length||0);const stamp=cloudLastSync||remote?.updatedAt||'';return <>
                                            <div className="pjlite-cloud-settings__account"><div className="pjlite-cloud-avatar">{String(cloudAccount.name||cloudAccount.email||'?').charAt(0).toUpperCase()}</div><div className="min-w-0"><strong>{cloudAccount.name||'Jogador'}</strong><small>{cloudAccount.email}</small></div><span className={'pjlite-cloud-state pjlite-cloud-state--'+cloudStatus}>{cloudStatus==='syncing'?'Sincronizando…':cloudStatus==='pending'?'Alterações pendentes':cloudStatus==='error'?'Erro':'☁ Sincronizado'}</span></div>
                                            <div className="pjlite-cloud-settings__stats"><div><span>Neste dispositivo</span><strong>{localCount}</strong><small>fichas</small></div><div><span>Nuvem demo</span><strong>{remoteCount}</strong><small>fichas</small></div><div><span>Última sincronização</span><strong>{stamp?new Date(stamp).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'—'}</strong><small>{stamp?new Date(stamp).toLocaleDateString('pt-BR'):'Ainda não'}</small></div></div>
                                            <div className="pjlite-cloud-settings__group"><h3>Sincronização</h3><p>O autosave continua local e, nesta prévia, atualiza também a cópia simulada.</p><div className="pjlite-cloud-actions"><button type="button" onClick={()=>syncCloudPreviewNow(false)}>☁ Sincronizar agora</button><button type="button" onClick={()=>restorePreviewCloud(cloudAccount,false)}>↧ Mesclar da nuvem</button></div></div>
                                            <div className="pjlite-cloud-settings__group pjlite-cloud-settings__group--quiet"><h3>Conta</h3><div className="pjlite-cloud-actions"><button type="button" className="secondary" onClick={disconnectCloudPreview}>Sair da Conta Lite</button><button type="button" className="danger-link" onClick={clearPreviewCloud}>Limpar nuvem demo</button></div></div>
                                        </>})()}
                                    </div>
                                </section>
                            </div>}

`;

app = app.slice(0, sectionStart) + discreetUi + app.slice(modalStart);

css += `\n/* ${marker} */
.pjlite-cloud-compact{display:flex;justify-content:flex-end;margin:-42px 0 16px;position:relative;z-index:4;pointer-events:none}.pjlite-cloud-compact__button{pointer-events:auto;display:inline-flex;align-items:center;gap:7px;min-height:30px;padding:5px 9px;border:1px solid #c9d0d8;border-radius:999px;background:rgba(255,255,255,.82);color:#4b5563;box-shadow:0 2px 8px rgba(15,23,42,.06);backdrop-filter:blur(8px);font-size:10px;font-weight:800;transition:.16s ease}.pjlite-cloud-compact__button:hover{background:#fff;border-color:#9ca8b5;color:#26384d;transform:translateY(-1px)}.pjlite-cloud-compact__icon{font-size:13px;line-height:1;color:#60748c}.pjlite-cloud-compact__label{letter-spacing:.01em}.pjlite-cloud-compact__button small{font-size:8px;font-weight:800;color:#8a96a5}.pjlite-cloud-compact__dot{width:6px;height:6px;border-radius:50%;background:#c2c8cf;box-shadow:0 0 0 2px rgba(194,200,207,.18)}.pjlite-cloud-compact__dot.is-online{background:#4f8d6c;box-shadow:0 0 0 2px rgba(79,141,108,.16)}.pjlite-cloud-compact__dot.is-working{background:#b8862f;box-shadow:0 0 0 2px rgba(184,134,47,.16)}.pjlite-cloud-compact__dot.is-error{background:#b74b4b;box-shadow:0 0 0 2px rgba(183,75,75,.16)}
.pjlite-cloud-settings-shell{position:fixed;inset:0;z-index:410;background:rgba(15,23,42,.38);display:flex;justify-content:flex-end;backdrop-filter:blur(2px)}.pjlite-cloud-settings{width:min(460px,100%);height:100%;overflow:auto;background:#f7f8fa;border-left:1px solid #cbd3dc;box-shadow:-18px 0 45px rgba(15,23,42,.22);color:#29384b}.pjlite-cloud-settings__header{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 18px 14px;background:rgba(247,248,250,.94);border-bottom:1px solid #d8dee6;backdrop-filter:blur(12px)}.pjlite-cloud-settings__eyebrow{display:block;font-size:8px;font-weight:900;letter-spacing:.16em;color:#7b8795}.pjlite-cloud-settings__header h2{font-family:Cinzel,serif;font-size:18px;font-weight:850;color:#26384d}.pjlite-cloud-settings__close{width:32px;height:32px;border:1px solid #cbd3dc;border-radius:8px;background:#fff;color:#556579;font-size:20px;line-height:1}.pjlite-cloud-settings__tabs{display:flex;padding:10px 18px 0;border-bottom:1px solid #d8dee6;background:#fff}.pjlite-cloud-settings__tabs button{padding:9px 4px 10px;border:0;border-bottom:2px solid transparent;background:transparent;color:#667487;font-size:10px;font-weight:900}.pjlite-cloud-settings__tabs button.active{border-bottom-color:#405a78;color:#2f455f}.pjlite-cloud-settings__content{padding:18px}.pjlite-cloud-settings__intro{display:flex;gap:12px;align-items:flex-start;padding:14px;border:1px solid #d8dee6;border-radius:10px;background:#fff}.pjlite-cloud-settings__intro strong{display:block;font-size:12px;color:#2d4057}.pjlite-cloud-settings__intro p{margin-top:4px;font-size:10px;line-height:1.5;color:#6c7888}.pjlite-cloud-settings__mark{display:flex;align-items:center;justify-content:center;flex:0 0 36px;width:36px;height:36px;border-radius:9px;background:#eef2f6;color:#556b83;font-size:18px}.pjlite-cloud-settings__hint{margin-top:12px;padding:10px 11px;border-left:3px solid #aab5c1;background:#eef1f4;color:#687585;font-size:9px;line-height:1.45}.pjlite-cloud-settings__account{display:grid;grid-template-columns:40px minmax(0,1fr) auto;align-items:center;gap:10px;padding:12px;border:1px solid #d8dee6;border-radius:10px;background:#fff}.pjlite-cloud-settings__account strong,.pjlite-cloud-settings__account small{display:block}.pjlite-cloud-settings__account strong{font-size:12px;color:#2d4057}.pjlite-cloud-settings__account small{margin-top:2px;font-size:9px;color:#7b8795}.pjlite-cloud-settings__stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.pjlite-cloud-settings__stats>div{padding:10px;border:1px solid #d8dee6;border-radius:9px;background:#fff}.pjlite-cloud-settings__stats span,.pjlite-cloud-settings__stats small{display:block;color:#7b8795;font-size:8px}.pjlite-cloud-settings__stats strong{display:block;margin:3px 0 1px;color:#2f455f;font-size:15px}.pjlite-cloud-settings__group{margin-top:12px;padding:13px;border:1px solid #d8dee6;border-radius:10px;background:#fff}.pjlite-cloud-settings__group h3{font-size:11px;font-weight:900;color:#31465e}.pjlite-cloud-settings__group p{margin-top:4px;color:#74808f;font-size:9px;line-height:1.45}.pjlite-cloud-settings__group--quiet{background:#f1f3f5}.pjlite-cloud-settings .pjlite-cloud-actions{margin-top:10px}.pjlite-cloud-settings .pjlite-cloud-google--wide{width:100%;margin-top:12px}
body.theme-dark .pjlite-cloud-compact__button{background:rgba(15,23,42,.82);border-color:#475569;color:#dbe4ee}.theme-dark .pjlite-cloud-compact__button small{color:#93a0af}.theme-dark .pjlite-cloud-settings{background:#111827;border-color:#334155;color:#dbe4ee}.theme-dark .pjlite-cloud-settings__header{background:rgba(17,24,39,.94);border-color:#334155}.theme-dark .pjlite-cloud-settings__header h2,.theme-dark .pjlite-cloud-settings__account strong,.theme-dark .pjlite-cloud-settings__intro strong,.theme-dark .pjlite-cloud-settings__group h3,.theme-dark .pjlite-cloud-settings__stats strong{color:#eef4fb}.theme-dark .pjlite-cloud-settings__close,.theme-dark .pjlite-cloud-settings__intro,.theme-dark .pjlite-cloud-settings__account,.theme-dark .pjlite-cloud-settings__stats>div,.theme-dark .pjlite-cloud-settings__group{background:#18212f;border-color:#3c4a5d;color:#e5e7eb}.theme-dark .pjlite-cloud-settings__tabs{background:#151d2a;border-color:#334155}.theme-dark .pjlite-cloud-settings__tabs button.active{color:#e7eef7;border-bottom-color:#93a8c1}.theme-dark .pjlite-cloud-settings__intro p,.theme-dark .pjlite-cloud-settings__account small,.theme-dark .pjlite-cloud-settings__stats span,.theme-dark .pjlite-cloud-settings__stats small,.theme-dark .pjlite-cloud-settings__group p{color:#aeb9c8}.theme-dark .pjlite-cloud-settings__hint{background:#1b2635;border-color:#64748b;color:#b9c4d0}.theme-dark .pjlite-cloud-settings__group--quiet{background:#151d2a}
@media(max-width:720px){.pjlite-cloud-compact{margin:-39px 0 14px}.pjlite-cloud-compact__button{padding:5px 8px}.pjlite-cloud-compact__button small{display:none}.pjlite-cloud-settings{width:100%}.pjlite-cloud-settings__stats{grid-template-columns:1fr}.pjlite-cloud-settings__header{padding-top:max(16px,env(safe-area-inset-top))}}
`;

await writeFile(appPath, app, 'utf8');
await writeFile(cssPath, css, 'utf8');
console.log('✓ Cloud Sync preview refinada: acesso discreto + painel separado de configurações.');
