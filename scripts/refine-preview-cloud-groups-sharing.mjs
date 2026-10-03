import { readFile, writeFile } from 'node:fs/promises';

const appPath = 'src/PJLiteApp.jsx';
const cssPath = 'src/pjlite.css';
const marker = 'PJ LITE CLOUD GROUPS AND SHARING V3';

let app = await readFile(appPath, 'utf8');
let css = await readFile(cssPath, 'utf8');

if (app.includes(marker)) {
  console.log('Cloud groups/sharing: already applied.');
  process.exit(0);
}

const stateAnchor = "            const [showCloudSettings, setShowCloudSettings] = useState(false);";
if (!app.includes(stateAnchor)) throw new Error('Cloud Groups V3: estado de configurações não encontrado.');
app = app.replace(
  stateAnchor,
  `${stateAnchor}\n            const [cloudSettingsTab, setCloudSettingsTab] = useState('sync');\n            const [cloudSocialTick, setCloudSocialTick] = useState(0);\n            const [cloudGroupDraft, setCloudGroupDraft] = useState({ name: '', members: '' });\n            const [cloudShareDraft, setCloudShareDraft] = useState({ sheetKey: '', email: '', groupId: '' });\n            // ${marker}`
);

const clearStart = app.indexOf("            const clearPreviewCloud = () => {");
if (clearStart < 0) throw new Error('Cloud Groups V3: função clearPreviewCloud não encontrada.');
const clearEnd = app.indexOf("\n            };", clearStart);
if (clearEnd < 0) throw new Error('Cloud Groups V3: fim de clearPreviewCloud não encontrado.');
const insertAt = clearEnd + "\n            };".length;

const socialFunctions = `

            // ${marker}
            const cloudPreviewSocialKey = (prefix, accountOrEmail = cloudAccount) => {
                const email = String(typeof accountOrEmail === 'string' ? accountOrEmail : accountOrEmail?.email || '').trim().toLowerCase();
                return prefix + encodeURIComponent(email || 'anon');
            };
            const readCloudPreviewGroups = (account = cloudAccount) => {
                if (!account?.email) return [];
                try { const value = JSON.parse(localStorage.getItem(cloudPreviewSocialKey('pjlite_cloud_preview_groups_v1:', account)) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; }
            };
            const writeCloudPreviewGroups = (groups, account = cloudAccount) => {
                if (!account?.email) return;
                localStorage.setItem(cloudPreviewSocialKey('pjlite_cloud_preview_groups_v1:', account), JSON.stringify(groups));
                setCloudSocialTick(v => v + 1);
            };
            const readCloudPreviewInbox = (accountOrEmail = cloudAccount) => {
                const email = String(typeof accountOrEmail === 'string' ? accountOrEmail : accountOrEmail?.email || '').trim().toLowerCase();
                if (!email) return [];
                try { const value = JSON.parse(localStorage.getItem(cloudPreviewSocialKey('pjlite_cloud_preview_inbox_v1:', email)) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; }
            };
            const writeCloudPreviewInbox = (email, inbox) => {
                const cleanEmail = String(email || '').trim().toLowerCase();
                if (!cleanEmail) return;
                localStorage.setItem(cloudPreviewSocialKey('pjlite_cloud_preview_inbox_v1:', cleanEmail), JSON.stringify(inbox));
                if (cleanEmail === String(cloudAccount?.email || '').trim().toLowerCase()) setCloudSocialTick(v => v + 1);
            };
            const cloudPreviewSheetName = item => String(item?.bio?.nome || item?.nome || item?.name || 'Ficha sem nome').trim() || 'Ficha sem nome';
            const cloudPreviewSheetSystem = item => String(item?.system || 'RPG').replace('dnd5e','D&D 5.5e').replace('fabulaUltima','Fabula Ultima').replace('3det','3DeT Victory');
            const cloudPreviewAllSheets = () => [
                ...savedChars.map(item => ({ key: 'pc:' + item.id, kind: 'pc', item })),
                ...savedThreats.map(item => ({ key: 'threat:' + item.id, kind: 'threat', item }))
            ];
            const createCloudPreviewGroup = () => {
                if (!cloudAccount) return setShowCloudModal(true);
                const name = String(cloudGroupDraft.name || '').trim();
                const members = Array.from(new Set(String(cloudGroupDraft.members || '').split(/[\\s,;]+/).map(v=>v.trim().toLowerCase()).filter(v=>v.includes('@'))));
                if (!name) return showToast('Dê um nome ao grupo.');
                if (!members.length) return showToast('Adicione pelo menos um e-mail ao grupo.');
                const groups = readCloudPreviewGroups();
                groups.push({ id: 'group-' + Date.now() + '-' + Math.random().toString(36).slice(2,7), name, members, createdAt: new Date().toISOString() });
                writeCloudPreviewGroups(groups);
                setCloudGroupDraft({ name: '', members: '' });
                showToast('Grupo criado.');
            };
            const removeCloudPreviewGroup = id => {
                if (!window.confirm('Remover este grupo? As fichas já enviadas não serão apagadas.')) return;
                writeCloudPreviewGroups(readCloudPreviewGroups().filter(group => group.id !== id));
            };
            const sendCloudPreviewPacket = (email, sourceItem, groupName = '') => {
                const recipient = String(email || '').trim().toLowerCase();
                if (!recipient || !recipient.includes('@') || !sourceItem) return false;
                const inbox = readCloudPreviewInbox(recipient);
                const packet = {
                    id: 'share-' + Date.now() + '-' + Math.random().toString(36).slice(2,8),
                    sentAt: new Date().toISOString(),
                    imported: false,
                    sender: { name: cloudAccount?.name || 'Jogador', email: cloudAccount?.email || '' },
                    recipient,
                    groupName: groupName || '',
                    item: JSON.parse(JSON.stringify(sourceItem))
                };
                inbox.unshift(packet);
                writeCloudPreviewInbox(recipient, inbox);
                return true;
            };
            const shareCloudPreviewSheet = () => {
                if (!cloudAccount) return setShowCloudModal(true);
                const sheetEntry = cloudPreviewAllSheets().find(entry => entry.key === cloudShareDraft.sheetKey);
                if (!sheetEntry) return showToast('Escolha uma ficha para compartilhar.');
                const group = readCloudPreviewGroups().find(item => item.id === cloudShareDraft.groupId);
                let recipients = [];
                let groupName = '';
                if (group) {
                    recipients = group.members;
                    groupName = group.name;
                } else {
                    const email = String(cloudShareDraft.email || '').trim().toLowerCase();
                    if (email.includes('@')) recipients = [email];
                }
                recipients = Array.from(new Set(recipients.filter(Boolean)));
                if (!recipients.length) return showToast('Escolha um grupo ou informe o e-mail da pessoa.');
                const sent = recipients.filter(email => sendCloudPreviewPacket(email, sheetEntry.item, groupName)).length;
                if (!sent) return showToast('Não foi possível compartilhar a ficha.');
                setCloudShareDraft(v => ({ ...v, email: '' }));
                showToast('📨 Ficha compartilhada com ' + sent + (sent === 1 ? ' pessoa.' : ' pessoas.'));
            };
            const acceptCloudPreviewShare = packetId => {
                if (!cloudAccount) return;
                const inbox = readCloudPreviewInbox();
                const packet = inbox.find(entry => entry.id === packetId);
                if (!packet?.item) return;
                const source = JSON.parse(JSON.stringify(packet.item));
                const now = new Date().toISOString();
                source.id = 'shared-' + Date.now() + '-' + Math.random().toString(36).slice(2,8);
                source.meta = { ...(source.meta || {}), createdAt: now, updatedAt: now, sharedFrom: packet.sender?.email || '' };
                if (source.type === 'pc') {
                    const next = [...getSavedCharacters(), source];
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                    setSavedChars(next);
                } else {
                    const next = [...getSavedThreats(), source];
                    localStorage.setItem(THREAT_STORAGE_KEY, JSON.stringify(next));
                    setSavedThreats(next);
                }
                const nextInbox = inbox.map(entry => entry.id === packetId ? { ...entry, imported: true, importedAt: now } : entry);
                writeCloudPreviewInbox(cloudAccount.email, nextInbox);
                queueCloudPreviewSync();
                showToast('✓ Ficha incluída nas suas fichas.');
            };
            const dismissCloudPreviewShare = packetId => {
                if (!cloudAccount) return;
                writeCloudPreviewInbox(cloudAccount.email, readCloudPreviewInbox().filter(entry => entry.id !== packetId));
                showToast('Compartilhamento removido da caixa de entrada.');
            };`;

app = app.slice(0, insertAt) + socialFunctions + app.slice(insertAt);

const settingsStartMarker = '                            {showCloudSettings && <div className="pjlite-cloud-settings-shell no-print"';
const settingsStart = app.indexOf(settingsStartMarker);
const settingsEndMarker = '                            {showCloudModal &&';
const settingsEnd = app.indexOf(settingsEndMarker, settingsStart);
if (settingsStart < 0 || settingsEnd < 0) throw new Error('Cloud Groups V3: painel de configurações V2 não encontrado.');

const socialSettings = `                            {showCloudSettings && <div className="pjlite-cloud-settings-shell no-print" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCloudSettings(false)}}>
                                <section className="pjlite-cloud-settings" role="dialog" aria-modal="true" aria-label="Conta e Nuvem">
                                    <header className="pjlite-cloud-settings__header">
                                        <div><span className="pjlite-cloud-settings__eyebrow">CONFIGURAÇÕES</span><h2>Conta & Nuvem</h2></div>
                                        <button type="button" className="pjlite-cloud-settings__close" onClick={()=>setShowCloudSettings(false)} aria-label="Fechar">×</button>
                                    </header>
                                    {(()=>{const inboxCount=cloudAccount?readCloudPreviewInbox().filter(item=>!item.imported).length:0;return <div className="pjlite-cloud-settings__tabs">
                                        <button type="button" className={cloudSettingsTab==='sync'?'active':''} onClick={()=>setCloudSettingsTab('sync')}>☁ Sincronização</button>
                                        <button type="button" className={cloudSettingsTab==='groups'?'active':''} onClick={()=>setCloudSettingsTab('groups')}>♟ Grupos</button>
                                        <button type="button" className={cloudSettingsTab==='inbox'?'active':''} onClick={()=>setCloudSettingsTab('inbox')}>✉ Recebidos {inboxCount>0&&<span className="pjlite-cloud-tab-badge">{inboxCount}</span>}</button>
                                    </div>})()}
                                    <div className="pjlite-cloud-settings__content">
                                        {!cloudAccount ? <>
                                            <div className="pjlite-cloud-settings__intro"><span className="pjlite-cloud-settings__mark">☁</span><div><strong>Conta Lite opcional</strong><p>Suas fichas continuam locais. Conecte a conta de teste para experimentar sincronização, grupos e compartilhamento.</p></div></div>
                                            <button type="button" className="pjlite-cloud-google pjlite-cloud-google--wide" onClick={()=>setShowCloudModal(true)}><span>G</span> Simular login com Google</button>
                                            <div className="pjlite-cloud-settings__hint">Prévia: compartilhamentos e grupos ainda são simulados neste navegador. Para testar dois usuários, entre com um e-mail, envie a ficha, saia e entre com o e-mail do destinatário.</div>
                                        </> : cloudSettingsTab==='sync' ? (()=>{const remote=readPreviewCloud(cloudAccount);const localCount=savedChars.length+savedThreats.length;const remoteCount=(remote?.characters?.length||0)+(remote?.threats?.length||0);const stamp=cloudLastSync||remote?.updatedAt||'';return <>
                                            <div className="pjlite-cloud-settings__account"><div className="pjlite-cloud-avatar">{String(cloudAccount.name||cloudAccount.email||'?').charAt(0).toUpperCase()}</div><div className="min-w-0"><strong>{cloudAccount.name||'Jogador'}</strong><small>{cloudAccount.email}</small></div><span className={'pjlite-cloud-state pjlite-cloud-state--'+cloudStatus}>{cloudStatus==='syncing'?'Sincronizando…':cloudStatus==='pending'?'Alterações pendentes':cloudStatus==='error'?'Erro':'☁ Sincronizado'}</span></div>
                                            <div className="pjlite-cloud-settings__stats"><div><span>Neste dispositivo</span><strong>{localCount}</strong><small>fichas</small></div><div><span>Nuvem demo</span><strong>{remoteCount}</strong><small>fichas</small></div><div><span>Última sincronização</span><strong>{stamp?new Date(stamp).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'—'}</strong><small>{stamp?new Date(stamp).toLocaleDateString('pt-BR'):'Ainda não'}</small></div></div>
                                            <div className="pjlite-cloud-settings__group"><h3>Sincronização</h3><p>O autosave continua local e também atualiza a cópia simulada.</p><div className="pjlite-cloud-actions"><button type="button" onClick={()=>syncCloudPreviewNow(false)}>☁ Sincronizar agora</button><button type="button" onClick={()=>restorePreviewCloud(cloudAccount,false)}>↧ Mesclar da nuvem</button></div></div>
                                            <div className="pjlite-cloud-settings__group pjlite-cloud-settings__group--quiet"><h3>Conta</h3><div className="pjlite-cloud-actions"><button type="button" className="secondary" onClick={disconnectCloudPreview}>Sair da Conta Lite</button><button type="button" className="danger-link" onClick={clearPreviewCloud}>Limpar nuvem demo</button></div></div>
                                        </>})() : cloudSettingsTab==='groups' ? (()=>{const groups=readCloudPreviewGroups();const sheets=cloudPreviewAllSheets();return <>
                                            <div className="pjlite-cloud-settings__group"><h3>Compartilhar ficha</h3><p>Envie uma cópia da ficha para uma pessoa ou para todos os membros de um grupo.</p><div className="pjlite-cloud-form-stack">
                                                <label><span>Ficha</span><select value={cloudShareDraft.sheetKey} onChange={e=>setCloudShareDraft(v=>({...v,sheetKey:e.target.value}))}><option value="">Escolha uma ficha…</option>{sheets.map(entry=><option key={entry.key} value={entry.key}>{cloudPreviewSheetName(entry.item)} • {cloudPreviewSheetSystem(entry.item)}</option>)}</select></label>
                                                <div className="pjlite-cloud-form-split"><label><span>Grupo</span><select value={cloudShareDraft.groupId} onChange={e=>setCloudShareDraft(v=>({...v,groupId:e.target.value,email:e.target.value?'':v.email}))}><option value="">Nenhum grupo</option>{groups.map(group=><option key={group.id} value={group.id}>{group.name} ({group.members.length})</option>)}</select></label><label><span>Ou enviar para</span><input type="email" value={cloudShareDraft.email} disabled={!!cloudShareDraft.groupId} onChange={e=>setCloudShareDraft(v=>({...v,email:e.target.value,groupId:''}))} placeholder="jogador@gmail.com"/></label></div>
                                                <button type="button" className="pjlite-cloud-primary" onClick={shareCloudPreviewSheet}>Enviar cópia da ficha</button>
                                            </div></div>
                                            <div className="pjlite-cloud-settings__group"><h3>Meus grupos</h3><p>Crie grupos para compartilhar uma ficha com várias pessoas de uma vez.</p><div className="pjlite-cloud-form-stack"><label><span>Nome do grupo</span><input value={cloudGroupDraft.name} onChange={e=>setCloudGroupDraft(v=>({...v,name:e.target.value}))} placeholder="Ex.: Mesa de sexta"/></label><label><span>Membros</span><textarea value={cloudGroupDraft.members} onChange={e=>setCloudGroupDraft(v=>({...v,members:e.target.value}))} placeholder="ana@gmail.com, mestre@gmail.com" rows="2"/></label><button type="button" className="secondary" onClick={createCloudPreviewGroup}>+ Criar grupo</button></div>
                                                <div className="pjlite-cloud-groups-list">{groups.length===0?<div className="pjlite-cloud-empty">Nenhum grupo criado ainda.</div>:groups.map(group=><article key={group.id} className="pjlite-cloud-group-card"><div><strong>{group.name}</strong><small>{group.members.length} {group.members.length===1?'membro':'membros'}</small></div><div className="pjlite-cloud-group-members">{group.members.map(email=><span key={email}>{email}</span>)}</div><button type="button" className="pjlite-cloud-icon-action" onClick={()=>removeCloudPreviewGroup(group.id)} title="Remover grupo">×</button></article>)}</div>
                                            </div>
                                        </>})() : (()=>{const inbox=readCloudPreviewInbox();const pending=inbox.filter(item=>!item.imported);const imported=inbox.filter(item=>item.imported);return <>
                                            <div className="pjlite-cloud-settings__group"><h3>Fichas recebidas</h3><p>Quando alguém compartilhar uma ficha com você, ela aparece aqui antes de entrar na sua biblioteca.</p>
                                                <div className="pjlite-cloud-inbox">{pending.length===0?<div className="pjlite-cloud-empty"><strong>Nenhuma ficha nova.</strong><span>Os novos compartilhamentos aparecerão aqui.</span></div>:pending.map(packet=><article key={packet.id} className="pjlite-cloud-inbox-card is-new"><div className="pjlite-cloud-inbox-icon">✉</div><div className="pjlite-cloud-inbox-main"><strong>{cloudPreviewSheetName(packet.item)}</strong><span>{cloudPreviewSheetSystem(packet.item)}{packet.groupName?' • '+packet.groupName:''}</span><small>Enviado por {packet.sender?.name||packet.sender?.email||'Jogador'} • {new Date(packet.sentAt).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}</small><div className="pjlite-cloud-inbox-actions"><button type="button" className="pjlite-cloud-primary" onClick={()=>acceptCloudPreviewShare(packet.id)}>Incluir nas fichas</button><button type="button" className="secondary" onClick={()=>dismissCloudPreviewShare(packet.id)}>Descartar</button></div></div></article>)}</div>
                                            </div>
                                            {imported.length>0&&<div className="pjlite-cloud-settings__group pjlite-cloud-settings__group--quiet"><h3>Já incluídas</h3><div className="pjlite-cloud-inbox pjlite-cloud-inbox--history">{imported.slice(0,8).map(packet=><article key={packet.id} className="pjlite-cloud-inbox-card"><div className="pjlite-cloud-inbox-icon">✓</div><div className="pjlite-cloud-inbox-main"><strong>{cloudPreviewSheetName(packet.item)}</strong><span>Incluída nas suas fichas</span><small>De {packet.sender?.email||'outro jogador'}</small></div><button type="button" className="pjlite-cloud-icon-action" onClick={()=>dismissCloudPreviewShare(packet.id)}>×</button></article>)}</div></div>}
                                        </>})()}
                                    </div>
                                </section>
                            </div>}

`;

app = app.slice(0, settingsStart) + socialSettings + app.slice(settingsEnd);

const compactButtonAnchor = `<span className="pjlite-cloud-compact__label">Conta & Nuvem</span>`;
if (!app.includes(compactButtonAnchor)) throw new Error('Cloud Groups V3: botão compacto não encontrado.');
app = app.replace(
  compactButtonAnchor,
  `${compactButtonAnchor}{cloudAccount&&readCloudPreviewInbox().filter(item=>!item.imported).length>0&&<span className="pjlite-cloud-notification">{readCloudPreviewInbox().filter(item=>!item.imported).length}</span>}`
);

css += `
/* ${marker} */
.pjlite-cloud-notification{display:inline-flex;align-items:center;justify-content:center;min-width:17px;height:17px;padding:0 4px;margin-left:-2px;border-radius:999px;background:#b74242;color:#fff;font-size:8px;font-weight:950;box-shadow:0 0 0 2px rgba(255,255,255,.9)}
.pjlite-cloud-settings__tabs{gap:14px;overflow-x:auto}.pjlite-cloud-settings__tabs button{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}.pjlite-cloud-tab-badge{display:inline-flex;align-items:center;justify-content:center;min-width:16px;height:16px;padding:0 4px;border-radius:999px;background:#b74242;color:#fff;font-size:8px;font-weight:950}.pjlite-cloud-form-stack{display:grid;gap:9px;margin-top:10px}.pjlite-cloud-form-stack label{display:grid;gap:4px}.pjlite-cloud-form-stack label>span{font-size:8px;font-weight:900;letter-spacing:.04em;color:#718094;text-transform:uppercase}.pjlite-cloud-form-stack input,.pjlite-cloud-form-stack select,.pjlite-cloud-form-stack textarea{width:100%;padding:8px 9px;border:1px solid #c7d0da;border-radius:7px;background:#fff;color:#29384b;font-size:10px}.pjlite-cloud-form-stack textarea{resize:vertical}.pjlite-cloud-form-split{display:grid;grid-template-columns:1fr 1fr;gap:8px}.pjlite-cloud-primary{display:inline-flex;align-items:center;justify-content:center;padding:8px 11px;border:1px solid #3f5875;border-radius:7px;background:#405a78;color:#fff;font-size:9px;font-weight:900}.pjlite-cloud-primary:hover{background:#344d6a}.pjlite-cloud-groups-list,.pjlite-cloud-inbox{display:grid;gap:8px;margin-top:11px}.pjlite-cloud-group-card{position:relative;padding:10px 34px 10px 10px;border:1px solid #d8dee6;border-radius:8px;background:#f8fafc}.pjlite-cloud-group-card>div:first-child{display:flex;align-items:baseline;justify-content:space-between;gap:8px}.pjlite-cloud-group-card strong{font-size:10px;color:#32475e}.pjlite-cloud-group-card small{font-size:8px;color:#7d8997}.pjlite-cloud-group-members{display:flex;flex-wrap:wrap;gap:4px;margin-top:7px}.pjlite-cloud-group-members span{padding:3px 6px;border-radius:999px;background:#e9eef4;color:#5d6c7e;font-size:8px}.pjlite-cloud-icon-action{position:absolute;right:7px;top:7px;width:23px;height:23px;border:1px solid #d2d9e1;border-radius:6px;background:#fff;color:#7b8794;font-size:14px;line-height:1}.pjlite-cloud-empty{display:grid;gap:3px;padding:14px;border:1px dashed #c8d1db;border-radius:8px;color:#788594;text-align:center;font-size:9px}.pjlite-cloud-empty strong{font-size:10px;color:#526277}.pjlite-cloud-inbox-card{position:relative;display:grid;grid-template-columns:34px minmax(0,1fr);gap:9px;padding:10px;border:1px solid #d7dee6;border-radius:9px;background:#fff}.pjlite-cloud-inbox-card.is-new{border-color:#aebdcd;background:#fbfdff;box-shadow:0 3px 10px rgba(37,57,80,.06)}.pjlite-cloud-inbox-icon{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;background:#eaf0f6;color:#47617d;font-size:14px}.pjlite-cloud-inbox-main{min-width:0}.pjlite-cloud-inbox-main strong,.pjlite-cloud-inbox-main span,.pjlite-cloud-inbox-main small{display:block}.pjlite-cloud-inbox-main strong{font-size:10px;color:#2e435b}.pjlite-cloud-inbox-main span{margin-top:2px;font-size:8px;color:#607086}.pjlite-cloud-inbox-main small{margin-top:5px;font-size:8px;color:#8793a0}.pjlite-cloud-inbox-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.pjlite-cloud-inbox--history .pjlite-cloud-inbox-card{grid-template-columns:28px minmax(0,1fr);padding-right:38px;opacity:.84}.pjlite-cloud-inbox--history .pjlite-cloud-inbox-icon{width:28px;height:28px;font-size:11px}.pjlite-cloud-inbox-card>.pjlite-cloud-icon-action{position:absolute}.theme-dark .pjlite-cloud-notification{box-shadow:0 0 0 2px #0f172a}.theme-dark .pjlite-cloud-form-stack input,.theme-dark .pjlite-cloud-form-stack select,.theme-dark .pjlite-cloud-form-stack textarea,.theme-dark .pjlite-cloud-group-card,.theme-dark .pjlite-cloud-inbox-card,.theme-dark .pjlite-cloud-icon-action{background:#111827!important;border-color:#46566b!important;color:#e5edf5!important}.theme-dark .pjlite-cloud-group-card strong,.theme-dark .pjlite-cloud-inbox-main strong,.theme-dark .pjlite-cloud-empty strong{color:#eef4fb}.theme-dark .pjlite-cloud-group-members span,.theme-dark .pjlite-cloud-inbox-icon{background:#223044;color:#c7d6e6}.theme-dark .pjlite-cloud-empty{border-color:#46566b;color:#aab6c4}.theme-dark .pjlite-cloud-form-stack label>span,.theme-dark .pjlite-cloud-inbox-main span,.theme-dark .pjlite-cloud-inbox-main small,.theme-dark .pjlite-cloud-group-card small{color:#aab6c4}.theme-dark .pjlite-cloud-inbox-card.is-new{background:#162234!important;border-color:#60748b!important}
@media(max-width:720px){.pjlite-cloud-settings__tabs{gap:10px;padding-left:12px;padding-right:12px}.pjlite-cloud-form-split{grid-template-columns:1fr}.pjlite-cloud-notification{min-width:16px;height:16px}.pjlite-cloud-inbox-actions{display:grid;grid-template-columns:1fr 1fr}.pjlite-cloud-inbox-actions button{width:100%}}
`;

await writeFile(appPath, app, 'utf8');
await writeFile(cssPath, css, 'utf8');
console.log('✓ Cloud Sync preview: grupos, compartilhamento, caixa de entrada e notificações adicionados.');
