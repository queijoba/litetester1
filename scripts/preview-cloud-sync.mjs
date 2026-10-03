import { readFile, writeFile } from 'node:fs/promises';

const appPath='src/PJLiteApp.jsx';
const cssPath='src/pjlite.css';
const marker='PJ LITE CLOUD SYNC PREVIEW V1';
let app=await readFile(appPath,'utf8');
let css=await readFile(cssPath,'utf8');

if(app.includes(marker)){
  console.log('Cloud Sync preview: already applied.');
  process.exit(0);
}

const replaceOnce=(text,from,to,label)=>{
  if(!text.includes(from)) throw new Error(`Cloud preview: marcador não encontrado (${label}).`);
  return text.replace(from,to);
};

app=replaceOnce(
  app,
  "        const SCHEMA_VERSION = 6;",
  "        const SCHEMA_VERSION = 6;\n        // PJ LITE CLOUD SYNC PREVIEW V1\n        const CLOUD_PREVIEW_ACCOUNT_KEY = 'pjlite_cloud_preview_account_v1';\n        const CLOUD_PREVIEW_REMOTE_PREFIX = 'pjlite_cloud_preview_remote_v1:';",
  'constantes'
);

app=replaceOnce(
  app,
  "            const [saveStatus, setSaveStatus] = useState('');",
  "            const [saveStatus, setSaveStatus] = useState('');\n            const [cloudAccount, setCloudAccount] = useState(() => { try { return JSON.parse(localStorage.getItem(CLOUD_PREVIEW_ACCOUNT_KEY) || 'null'); } catch { return null; } });\n            const [cloudStatus, setCloudStatus] = useState('idle');\n            const [cloudLastSync, setCloudLastSync] = useState('');\n            const [showCloudModal, setShowCloudModal] = useState(false);\n            const [cloudDraft, setCloudDraft] = useState({ name: '', email: '' });\n            const cloudSyncTimerRef = useRef(null);",
  'estado cloud'
);

const toastAnchor=`            const showToast = (msg, options = {}) => {
                if (!options.keepUndo) setUndoState(null);
                setToastMsg(msg);
                if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
                toastTimerRef.current = setTimeout(() => setToastMsg(''), 3000);
            };`;

const cloudFunctions=`${toastAnchor}

            // ${marker}
            // A prévia usa um armazenamento separado no navegador para simular a nuvem.
            // A interface e o fluxo ficam prontos para receber Supabase/Google depois da homologação.
            const cloudPreviewKey = (account = cloudAccount) => {
                const email = String(account?.email || 'anon').trim().toLowerCase();
                return CLOUD_PREVIEW_REMOTE_PREFIX + encodeURIComponent(email);
            };
            const readPreviewCloud = (account = cloudAccount) => {
                if (!account?.email) return null;
                try { return JSON.parse(localStorage.getItem(cloudPreviewKey(account)) || 'null'); } catch { return null; }
            };
            const cloudStamp = item => {
                const value = Date.parse(item?.meta?.updatedAt || item?.meta?.createdAt || '');
                return Number.isFinite(value) ? value : 0;
            };
            const mergeCloudItems = (localItems = [], remoteItems = []) => {
                const map = new Map();
                for (const item of Array.isArray(localItems) ? localItems : []) if (item?.id) map.set(item.id, item);
                for (const item of Array.isArray(remoteItems) ? remoteItems : []) {
                    if (!item?.id) continue;
                    const current = map.get(item.id);
                    if (!current || cloudStamp(item) >= cloudStamp(current)) map.set(item.id, item);
                }
                return Array.from(map.values());
            };
            const syncCloudPreviewFor = (account, silent = false) => {
                if (!account?.email) return false;
                try {
                    setCloudStatus('syncing');
                    const now = new Date().toISOString();
                    const bundle = {
                        pjLiteCloudPreview: true,
                        provider: 'browser-demo',
                        version: 1,
                        updatedAt: now,
                        account: { name: account.name || 'Jogador', email: account.email },
                        characters: getSavedCharacters(),
                        threats: getSavedThreats()
                    };
                    localStorage.setItem(cloudPreviewKey(account), JSON.stringify(bundle));
                    setCloudLastSync(now);
                    setCloudStatus('synced');
                    if (!silent) showToast('☁️ Fichas sincronizadas na nuvem de demonstração.');
                    return true;
                } catch (error) {
                    console.error('Falha na nuvem de demonstração:', error);
                    setCloudStatus('error');
                    if (!silent) showToast('Não foi possível sincronizar a nuvem de demonstração.');
                    return false;
                }
            };
            const syncCloudPreviewNow = (silent = false) => {
                if (!cloudAccount) {
                    if (!silent) setShowCloudModal(true);
                    return false;
                }
                return syncCloudPreviewFor(cloudAccount, silent);
            };
            const queueCloudPreviewSync = () => {
                if (!cloudAccount) return;
                setCloudStatus('pending');
                if (cloudSyncTimerRef.current) clearTimeout(cloudSyncTimerRef.current);
                cloudSyncTimerRef.current = setTimeout(() => syncCloudPreviewFor(cloudAccount, true), 700);
            };
            const restorePreviewCloud = (account = cloudAccount, silent = false) => {
                if (!account?.email) return false;
                const remote = readPreviewCloud(account);
                if (!remote) {
                    if (!silent) showToast('Ainda não existe uma cópia na nuvem de demonstração.');
                    return false;
                }
                try {
                    const chars = mergeCloudItems(getSavedCharacters(), remote.characters || []);
                    const threats = mergeCloudItems(getSavedThreats(), remote.threats || []);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
                    localStorage.setItem(THREAT_STORAGE_KEY, JSON.stringify(threats));
                    setSavedChars(chars);
                    setSavedThreats(threats);
                    setCloudLastSync(remote.updatedAt || '');
                    setCloudStatus('synced');
                    if (!silent) showToast('☁️ Fichas da nuvem foram mescladas neste dispositivo.');
                    return true;
                } catch (error) {
                    console.error('Falha ao restaurar nuvem demo:', error);
                    setCloudStatus('error');
                    if (!silent) showToast('Não foi possível restaurar as fichas da nuvem demo.');
                    return false;
                }
            };
            const connectCloudPreview = () => {
                const email = String(cloudDraft.email || '').trim().toLowerCase();
                const name = String(cloudDraft.name || '').trim() || 'Jogador';
                if (!email || !email.includes('@')) {
                    showToast('Digite um e-mail para simular a conta Google.');
                    return;
                }
                const account = { id: `demo:${email}`, name, email, provider: 'google-demo' };
                try { localStorage.setItem(CLOUD_PREVIEW_ACCOUNT_KEY, JSON.stringify(account)); } catch {}
                const remote = readPreviewCloud(account);
                setCloudAccount(account);
                setShowCloudModal(false);
                setCloudDraft({ name: '', email: '' });
                if (remote) {
                    restorePreviewCloud(account, true);
                    showToast('☁️ Conta Lite conectada; fichas existentes foram mescladas.');
                } else {
                    syncCloudPreviewFor(account, true);
                    showToast('☁️ Conta Lite de demonstração conectada.');
                }
            };
            const disconnectCloudPreview = () => {
                try { localStorage.removeItem(CLOUD_PREVIEW_ACCOUNT_KEY); } catch {}
                if (cloudSyncTimerRef.current) clearTimeout(cloudSyncTimerRef.current);
                setCloudAccount(null);
                setCloudStatus('idle');
                setCloudLastSync('');
                showToast('Conta Lite desconectada. As fichas locais continuam no dispositivo.');
            };
            const clearPreviewCloud = () => {
                if (!cloudAccount) return;
                if (!window.confirm('Apagar somente a cópia da nuvem de demonstração? As fichas locais serão mantidas.')) return;
                try { localStorage.removeItem(cloudPreviewKey(cloudAccount)); } catch {}
                setCloudLastSync('');
                setCloudStatus('idle');
                showToast('Cópia da nuvem demo apagada; fichas locais preservadas.');
            };`;

app=replaceOnce(app,toastAnchor,cloudFunctions,'funções cloud');

app=replaceOnce(
  app,
  "                    setSaveStatus('saved');",
  "                    setSaveStatus('saved');\n                    queueCloudPreviewSync();",
  'autosync após save'
);

const dashboardBadge=`                            <div className="mb-4 flex justify-start select-none">
                                <span className="inline-flex items-center gap-1.5 bg-gray-900 text-white border border-gray-700 shadow px-3 py-1 rounded-full text-[10px] md:text-xs font-title font-bold tracking-wide">
                                    <span className="text-red-500">◆</span> PJ Lite
                                </span>
                            </div>`;

const cloudDashboard=`${dashboardBadge}

                            <section className="pjlite-cloud-preview no-print">
                                <div className="pjlite-cloud-preview__icon">☁️</div>
                                <div className="pjlite-cloud-preview__body">
                                    <div className="pjlite-cloud-preview__top">
                                        <div>
                                            <div className="pjlite-cloud-preview__eyebrow">PREVIEW • CONTA LITE</div>
                                            <h2>Sincronização de fichas</h2>
                                        </div>
                                        <span className="pjlite-cloud-preview__demo">Nuvem simulada</span>
                                    </div>
                                    {!cloudAccount ? <>
                                        <p>Teste como seria entrar com Google e manter as fichas vinculadas à sua conta. Nesta prévia, a “nuvem” fica em um armazenamento separado do navegador, sem enviar dados para Google ou servidores externos.</p>
                                        <button type="button" className="pjlite-cloud-google" onClick={()=>setShowCloudModal(true)}><span>G</span> Simular login com Google</button>
                                    </> : (()=>{const remote=readPreviewCloud(cloudAccount);const localCount=savedChars.length+savedThreats.length;const remoteCount=(remote?.characters?.length||0)+(remote?.threats?.length||0);const stamp=cloudLastSync||remote?.updatedAt||'';return <>
                                        <div className="pjlite-cloud-account-row">
                                            <div className="pjlite-cloud-avatar">{String(cloudAccount.name||cloudAccount.email||'?').charAt(0).toUpperCase()}</div>
                                            <div className="min-w-0"><strong>{cloudAccount.name||'Jogador'}</strong><small>{cloudAccount.email}</small></div>
                                            <span className={`pjlite-cloud-state pjlite-cloud-state--${cloudStatus}`}>{cloudStatus==='syncing'?'Sincronizando…':cloudStatus==='pending'?'Alterações pendentes':cloudStatus==='error'?'Erro de sincronização':'☁ Sincronizado'}</span>
                                        </div>
                                        <div className="pjlite-cloud-stats">
                                            <div><span>Neste dispositivo</span><strong>{localCount}</strong><small>fichas</small></div>
                                            <div><span>Nuvem demo</span><strong>{remoteCount}</strong><small>fichas</small></div>
                                            <div><span>Última sincronização</span><strong className="pjlite-cloud-time">{stamp?new Date(stamp).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'—'}</strong><small>{stamp?new Date(stamp).toLocaleDateString('pt-BR'):'Ainda não'}</small></div>
                                        </div>
                                        <div className="pjlite-cloud-actions">
                                            <button type="button" onClick={()=>syncCloudPreviewNow(false)}>☁ Sincronizar agora</button>
                                            <button type="button" onClick={()=>restorePreviewCloud(cloudAccount,false)}>↧ Mesclar da nuvem</button>
                                            <button type="button" className="secondary" onClick={disconnectCloudPreview}>Sair</button>
                                            <button type="button" className="danger-link" onClick={clearPreviewCloud}>Limpar nuvem demo</button>
                                        </div>
                                    </>})()}
                                    <div className="pjlite-cloud-note"><strong>Como testar:</strong> conecte a conta demo, abra uma ficha e altere qualquer campo. O autosave local também atualizará a cópia de demonstração. Volte à Home para conferir o horário e a quantidade sincronizada.</div>
                                </div>
                            </section>

                            {showCloudModal && <div className="fixed inset-0 z-[420] bg-black/65 flex items-center justify-center p-4 no-print" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCloudModal(false)}}>
                                <div className="pjlite-cloud-modal">
                                    <button type="button" className="pjlite-cloud-modal__close" onClick={()=>setShowCloudModal(false)}>×</button>
                                    <div className="pjlite-cloud-modal__mark">☁️</div>
                                    <div className="pjlite-cloud-preview__eyebrow">CONTA LITE • PROTÓTIPO</div>
                                    <h2>Continuar com Google</h2>
                                    <p>Este é um login simulado para validar a experiência antes de conectarmos Google OAuth + Supabase. Nenhuma credencial é enviada para fora do navegador.</p>
                                    <label><span>Nome de exibição</span><input autoFocus value={cloudDraft.name} onChange={e=>setCloudDraft(v=>({...v,name:e.target.value}))} placeholder="Ex.: Jogador"/></label>
                                    <label><span>E-mail da conta de teste</span><input type="email" value={cloudDraft.email} onChange={e=>setCloudDraft(v=>({...v,email:e.target.value}))} placeholder="voce@gmail.com" onKeyDown={e=>{if(e.key==='Enter')connectCloudPreview()}}/></label>
                                    <button type="button" className="pjlite-cloud-google pjlite-cloud-google--wide" onClick={connectCloudPreview}><span>G</span> Entrar na prévia</button>
                                    <small>Depois da aprovação, este mesmo botão poderá abrir o seletor real de contas Google.</small>
                                </div>
                            </div>}`;

app=replaceOnce(app,dashboardBadge,cloudDashboard,'card da dashboard');

css+=`\n/* ${marker} */\n.pjlite-cloud-preview{display:flex;gap:14px;margin:0 0 22px;padding:17px 18px;background:linear-gradient(135deg,#f8fbff 0%,#eef4fb 100%);border:1px solid #aebed0;border-left:5px solid #405a78;border-radius:12px;box-shadow:0 8px 24px rgba(30,50,76,.11);color:#233449}.pjlite-cloud-preview__icon{display:flex;align-items:center;justify-content:center;flex:0 0 48px;width:48px;height:48px;border-radius:12px;background:#405a78;color:#fff;font-size:24px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}.pjlite-cloud-preview__body{min-width:0;flex:1}.pjlite-cloud-preview__top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.pjlite-cloud-preview__eyebrow{font-size:9px;font-weight:900;letter-spacing:.12em;color:#60748c;margin-bottom:2px}.pjlite-cloud-preview h2{font-family:Cinzel,serif;font-weight:800;font-size:17px;line-height:1.15;color:#263c58}.pjlite-cloud-preview p{margin-top:7px;font-size:12px;line-height:1.5;color:#5a6a7d}.pjlite-cloud-preview__demo{white-space:nowrap;border:1px solid #b6c5d4;background:#fff;color:#60748c;border-radius:999px;padding:4px 8px;font-size:9px;font-weight:800}.pjlite-cloud-google{display:inline-flex;align-items:center;justify-content:center;gap:9px;margin-top:11px;padding:9px 13px;background:#fff;border:1px solid #9eabb9;border-radius:8px;color:#24364b;font-size:11px;font-weight:800;box-shadow:0 2px 5px rgba(20,35,55,.08);transition:.15s}.pjlite-cloud-google:hover{background:#f5f8fb;border-color:#71849a}.pjlite-cloud-google>span{display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;font-family:Arial,sans-serif;font-size:14px;font-weight:900;color:#3567bb;background:#fff}.pjlite-cloud-account-row{display:grid;grid-template-columns:38px minmax(0,1fr) auto;align-items:center;gap:9px;margin-top:11px;padding:10px;background:rgba(255,255,255,.78);border:1px solid #c4d0dc;border-radius:8px}.pjlite-cloud-avatar{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#405a78;color:#fff;font-weight:900}.pjlite-cloud-account-row strong{display:block;font-size:12px;color:#273b54}.pjlite-cloud-account-row small{display:block;overflow:hidden;text-overflow:ellipsis;font-size:9px;color:#6f7e8f}.pjlite-cloud-state{font-size:9px;font-weight:900;padding:5px 8px;border-radius:999px;background:#e2ece7;color:#32604a;border:1px solid #b8d0c3}.pjlite-cloud-state--pending{background:#fff2cf;color:#785c15;border-color:#e6cc84}.pjlite-cloud-state--syncing{background:#e7effa;color:#385f8c;border-color:#b8cae0}.pjlite-cloud-state--error{background:#f9e2e2;color:#8d3737;border-color:#deb2b2}.pjlite-cloud-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:9px}.pjlite-cloud-stats>div{padding:8px 9px;background:#fff;border:1px solid #ccd6e0;border-radius:7px}.pjlite-cloud-stats span,.pjlite-cloud-stats small{display:block;font-size:8px;color:#728296}.pjlite-cloud-stats strong{display:block;margin:2px 0;font-size:16px;color:#2f465f}.pjlite-cloud-stats .pjlite-cloud-time{font-size:13px}.pjlite-cloud-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.pjlite-cloud-actions button{padding:7px 9px;border:1px solid #597089;border-radius:7px;background:#405a78;color:#fff;font-size:9px;font-weight:800}.pjlite-cloud-actions button:hover{background:#334a64}.pjlite-cloud-actions .secondary{background:#fff;color:#40536a;border-color:#aebdcb}.pjlite-cloud-actions .danger-link{background:transparent;color:#8a4a4a;border-color:transparent;margin-left:auto}.pjlite-cloud-note{margin-top:10px;padding-top:9px;border-top:1px dashed #b9c7d4;font-size:9px;line-height:1.45;color:#6b7c90}.pjlite-cloud-modal{position:relative;width:min(100%,430px);padding:24px;background:#f7f9fb;color:#26384e;border:1px solid #9babbc;border-radius:14px;box-shadow:0 25px 70px rgba(0,0,0,.35)}.pjlite-cloud-modal__close{position:absolute;right:12px;top:9px;font-size:24px;font-weight:900;color:#718095}.pjlite-cloud-modal__mark{display:flex;align-items:center;justify-content:center;width:52px;height:52px;margin-bottom:12px;background:#405a78;border-radius:14px;font-size:25px}.pjlite-cloud-modal h2{font-family:Cinzel,serif;font-weight:900;font-size:21px;color:#2a405b}.pjlite-cloud-modal p{margin:6px 0 14px;color:#68778a;font-size:11px;line-height:1.5}.pjlite-cloud-modal label{display:block;margin-top:9px}.pjlite-cloud-modal label>span{display:block;margin-bottom:4px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;color:#607289}.pjlite-cloud-modal input{width:100%;padding:10px 11px;border:1px solid #aebbc8;border-radius:7px;background:#fff;color:#24354a;font-size:12px;outline:none}.pjlite-cloud-modal input:focus{border-color:#536f8f;box-shadow:0 0 0 2px rgba(83,111,143,.14)}.pjlite-cloud-google--wide{width:100%;margin-top:14px}.pjlite-cloud-modal>small{display:block;margin-top:9px;text-align:center;color:#7b8998;font-size:8px}.theme-dark .pjlite-cloud-preview{background:linear-gradient(135deg,#202c3a,#263646);border-color:#61758b;color:#eef3f7}.theme-dark .pjlite-cloud-preview h2,.theme-dark .pjlite-cloud-account-row strong,.theme-dark .pjlite-cloud-stats strong{color:#edf3f8}.theme-dark .pjlite-cloud-preview p,.theme-dark .pjlite-cloud-note,.theme-dark .pjlite-cloud-preview__eyebrow{color:#b8c5d2}.theme-dark .pjlite-cloud-preview__demo,.theme-dark .pjlite-cloud-account-row,.theme-dark .pjlite-cloud-stats>div{background:#17222e;color:#dce5ed;border-color:#52667b}.theme-dark .pjlite-cloud-google{background:#17222e;color:#f0f4f8;border-color:#61758b}.theme-dark .pjlite-cloud-modal{background:#202c39;color:#edf2f7;border-color:#687b90}.theme-dark .pjlite-cloud-modal h2{color:#edf3f8}.theme-dark .pjlite-cloud-modal p,.theme-dark .pjlite-cloud-modal label>span,.theme-dark .pjlite-cloud-modal>small{color:#b8c5d2}.theme-dark .pjlite-cloud-modal input{background:#111a24;color:#f0f4f8;border-color:#62758a}@media(max-width:640px){.pjlite-cloud-preview{padding:13px;gap:9px}.pjlite-cloud-preview__icon{width:38px;height:38px;flex-basis:38px;font-size:19px}.pjlite-cloud-preview__top{display:block}.pjlite-cloud-preview__demo{display:inline-block;margin-top:5px}.pjlite-cloud-account-row{grid-template-columns:34px minmax(0,1fr)}.pjlite-cloud-state{grid-column:1/-1;justify-self:start}.pjlite-cloud-avatar{width:34px;height:34px}.pjlite-cloud-stats{grid-template-columns:1fr}.pjlite-cloud-actions button{flex:1 1 calc(50% - 4px)}.pjlite-cloud-actions .danger-link{margin-left:0}.pjlite-cloud-modal{padding:20px 16px}}\n`;

await writeFile(appPath,app,'utf8');
await writeFile(cssPath,css,'utf8');
console.log('✓ Conta Lite / Cloud Sync preview aplicada (Google simulado + nuvem local separada).');
