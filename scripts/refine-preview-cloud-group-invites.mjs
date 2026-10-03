import { readFile, writeFile } from 'node:fs/promises';

const appPath = 'src/PJLiteApp.jsx';
const cssPath = 'src/pjlite.css';
const marker = 'PJ LITE CLOUD GROUP INVITES V4';

let app = await readFile(appPath, 'utf8');
let css = await readFile(cssPath, 'utf8');

if (app.includes(marker)) {
  console.log('Cloud group invites: already applied.');
  process.exit(0);
}

const stateAnchor = "            const [cloudShareDraft, setCloudShareDraft] = useState({ sheetKey: '', email: '', groupId: '' });";
if (!app.includes(stateAnchor)) throw new Error('Cloud Invites V4: estado de compartilhamento não encontrado.');
app = app.replace(
  stateAnchor,
  `${stateAnchor}\n            const [cloudJoinCode, setCloudJoinCode] = useState('');\n            // ${marker}`
);

const writeGroupsAnchor = `            const writeCloudPreviewGroups = (groups, account = cloudAccount) => {
                if (!account?.email) return;
                localStorage.setItem(cloudPreviewSocialKey('pjlite_cloud_preview_groups_v1:', account), JSON.stringify(groups));
                setCloudSocialTick(v => v + 1);
            };`;
if (!app.includes(writeGroupsAnchor)) throw new Error('Cloud Invites V4: writeCloudPreviewGroups não encontrado.');

const inviteHelpers = `${writeGroupsAnchor}
            const normalizeCloudPreviewInviteCode = code => String(code || '').trim().toUpperCase().replace(/\\s+/g,'');
            const cloudPreviewInviteKey = code => 'pjlite_cloud_preview_group_invite_v1:' + normalizeCloudPreviewInviteCode(code);
            const makeCloudPreviewInviteCode = () => {
                const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                let code = '';
                do {
                    let token = '';
                    for (let i = 0; i < 6; i += 1) token += alphabet[Math.floor(Math.random() * alphabet.length)];
                    code = 'LITE-' + token;
                } while (localStorage.getItem(cloudPreviewInviteKey(code)));
                return code;
            };
            const publishCloudPreviewInvite = (group, owner = cloudAccount) => {
                if (!group?.inviteCode || !owner?.email) return;
                const payload = {
                    version: 1,
                    code: normalizeCloudPreviewInviteCode(group.inviteCode),
                    groupId: group.id,
                    name: group.name,
                    ownerEmail: String(group.ownerEmail || owner.email || '').trim().toLowerCase(),
                    ownerName: group.ownerName || owner.name || 'Jogador',
                    members: Array.from(new Set(Array.isArray(group.members) ? group.members.map(v=>String(v).trim().toLowerCase()).filter(Boolean) : [])),
                    createdAt: group.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                localStorage.setItem(cloudPreviewInviteKey(payload.code), JSON.stringify(payload));
            };
            const ensureCloudPreviewInviteCode = groupId => {
                const groups = readCloudPreviewGroups();
                const index = groups.findIndex(group => group.id === groupId);
                if (index < 0) return;
                const current = groups[index];
                if (current.joined && current.ownerEmail && current.ownerEmail !== String(cloudAccount?.email || '').trim().toLowerCase()) return;
                const next = { ...current, inviteCode: current.inviteCode || makeCloudPreviewInviteCode(), ownerEmail: current.ownerEmail || String(cloudAccount?.email || '').trim().toLowerCase(), ownerName: current.ownerName || cloudAccount?.name || 'Jogador' };
                groups[index] = next;
                writeCloudPreviewGroups(groups);
                publishCloudPreviewInvite(next);
                showToast('Código de convite criado.');
            };
            const regenerateCloudPreviewInviteCode = groupId => {
                const groups = readCloudPreviewGroups();
                const index = groups.findIndex(group => group.id === groupId);
                if (index < 0) return;
                const current = groups[index];
                if (current.joined && current.ownerEmail !== String(cloudAccount?.email || '').trim().toLowerCase()) return showToast('Somente quem criou o grupo pode trocar o código.');
                if (current.inviteCode) localStorage.removeItem(cloudPreviewInviteKey(current.inviteCode));
                const next = { ...current, inviteCode: makeCloudPreviewInviteCode(), ownerEmail: current.ownerEmail || String(cloudAccount?.email || '').trim().toLowerCase(), ownerName: current.ownerName || cloudAccount?.name || 'Jogador' };
                groups[index] = next;
                writeCloudPreviewGroups(groups);
                publishCloudPreviewInvite(next);
                showToast('Novo código de convite criado.');
            };
            const copyCloudPreviewInviteCode = async code => {
                const value = normalizeCloudPreviewInviteCode(code);
                if (!value) return;
                try {
                    if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(value);
                    else window.prompt('Copie o código do grupo:', value);
                    showToast('Código copiado.');
                } catch {
                    window.prompt('Copie o código do grupo:', value);
                }
            };
            const joinCloudPreviewGroup = () => {
                if (!cloudAccount) return setShowCloudModal(true);
                const code = normalizeCloudPreviewInviteCode(cloudJoinCode);
                if (!code) return showToast('Digite o código do grupo.');
                let invite = null;
                try { invite = JSON.parse(localStorage.getItem(cloudPreviewInviteKey(code)) || 'null'); } catch {}
                if (!invite?.groupId || !invite?.ownerEmail) return showToast('Código de grupo inválido ou expirado.');
                const myEmail = String(cloudAccount.email || '').trim().toLowerCase();
                if (myEmail === String(invite.ownerEmail || '').trim().toLowerCase()) return showToast('Você já é o criador deste grupo.');

                const ownerAccount = { email: invite.ownerEmail };
                const ownerGroups = readCloudPreviewGroups(ownerAccount);
                const ownerIndex = ownerGroups.findIndex(group => group.id === invite.groupId);
                if (ownerIndex >= 0) {
                    const ownerGroup = ownerGroups[ownerIndex];
                    const members = Array.from(new Set([...(ownerGroup.members || []), myEmail]));
                    ownerGroups[ownerIndex] = { ...ownerGroup, members, inviteCode: code, ownerEmail: invite.ownerEmail, ownerName: invite.ownerName || ownerGroup.ownerName || 'Jogador' };
                    writeCloudPreviewGroups(ownerGroups, ownerAccount);
                    invite.members = members;
                } else {
                    invite.members = Array.from(new Set([...(invite.members || []), myEmail]));
                }
                invite.updatedAt = new Date().toISOString();
                localStorage.setItem(cloudPreviewInviteKey(code), JSON.stringify(invite));

                const mine = readCloudPreviewGroups();
                const joinedGroup = {
                    id: invite.groupId,
                    name: invite.name || 'Grupo',
                    members: Array.from(new Set([...(invite.members || [])])),
                    createdAt: invite.createdAt || new Date().toISOString(),
                    inviteCode: code,
                    ownerEmail: invite.ownerEmail,
                    ownerName: invite.ownerName || 'Jogador',
                    joined: true
                };
                const mineIndex = mine.findIndex(group => group.id === invite.groupId);
                if (mineIndex >= 0) mine[mineIndex] = { ...mine[mineIndex], ...joinedGroup };
                else mine.push(joinedGroup);
                writeCloudPreviewGroups(mine);
                setCloudJoinCode('');
                showToast('✓ Você entrou no grupo ' + joinedGroup.name + '.');
            };`;
app = app.replace(writeGroupsAnchor, inviteHelpers);

const createOld = `            const createCloudPreviewGroup = () => {
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
            };`;
const createNew = `            const createCloudPreviewGroup = () => {
                if (!cloudAccount) return setShowCloudModal(true);
                const name = String(cloudGroupDraft.name || '').trim();
                const members = Array.from(new Set(String(cloudGroupDraft.members || '').split(/[\\s,;]+/).map(v=>v.trim().toLowerCase()).filter(v=>v.includes('@'))));
                if (!name) return showToast('Dê um nome ao grupo.');
                const groups = readCloudPreviewGroups();
                const group = { id: 'group-' + Date.now() + '-' + Math.random().toString(36).slice(2,7), name, members, createdAt: new Date().toISOString(), inviteCode: makeCloudPreviewInviteCode(), ownerEmail: String(cloudAccount.email || '').trim().toLowerCase(), ownerName: cloudAccount.name || 'Jogador' };
                groups.push(group);
                writeCloudPreviewGroups(groups);
                publishCloudPreviewInvite(group);
                setCloudGroupDraft({ name: '', members: '' });
                showToast('Grupo criado. Compartilhe o código ' + group.inviteCode + '.');
            };`;
if (!app.includes(createOld)) throw new Error('Cloud Invites V4: createCloudPreviewGroup não encontrado.');
app = app.replace(createOld, createNew);

const removeOld = `            const removeCloudPreviewGroup = id => {
                if (!window.confirm('Remover este grupo? As fichas já enviadas não serão apagadas.')) return;
                writeCloudPreviewGroups(readCloudPreviewGroups().filter(group => group.id !== id));
            };`;
const removeNew = `            const removeCloudPreviewGroup = id => {
                if (!window.confirm('Remover este grupo? As fichas já enviadas não serão apagadas.')) return;
                const groups = readCloudPreviewGroups();
                const group = groups.find(item => item.id === id);
                const isOwner = !group?.joined || String(group?.ownerEmail || '').trim().toLowerCase() === String(cloudAccount?.email || '').trim().toLowerCase();
                if (isOwner && group?.inviteCode) localStorage.removeItem(cloudPreviewInviteKey(group.inviteCode));
                writeCloudPreviewGroups(groups.filter(item => item.id !== id));
            };`;
if (!app.includes(removeOld)) throw new Error('Cloud Invites V4: removeCloudPreviewGroup não encontrado.');
app = app.replace(removeOld, removeNew);

const shareRecipientsOld = `                if (group) {
                    recipients = group.members;
                    groupName = group.name;
                } else {`;
const shareRecipientsNew = `                if (group) {
                    recipients = Array.from(new Set([...(group.members || []), ...(group.joined && group.ownerEmail ? [group.ownerEmail] : [])])).filter(email => email !== String(cloudAccount?.email || '').trim().toLowerCase());
                    groupName = group.name;
                } else {`;
if (!app.includes(shareRecipientsOld)) throw new Error('Cloud Invites V4: destinatários do grupo não encontrados.');
app = app.replace(shareRecipientsOld, shareRecipientsNew);

const groupsStart = `                                            <div className="pjlite-cloud-settings__group"><h3>Meus grupos</h3><p>Crie grupos para compartilhar uma ficha com várias pessoas de uma vez.</p><div className="pjlite-cloud-form-stack">`;
if (!app.includes(groupsStart)) throw new Error('Cloud Invites V4: seção Meus grupos não encontrada.');
const groupsStartNew = `                                            <div className="pjlite-cloud-settings__group pjlite-cloud-invite-join"><h3>Entrar em um grupo</h3><p>Use o código de convite que alguém compartilhou com você.</p><div className="pjlite-cloud-join-row"><input value={cloudJoinCode} onChange={e=>setCloudJoinCode(e.target.value.toUpperCase())} onKeyDown={e=>{if(e.key==='Enter')joinCloudPreviewGroup()}} placeholder="LITE-ABC123"/><button type="button" className="pjlite-cloud-primary" onClick={joinCloudPreviewGroup}>Entrar</button></div></div>
                                            <div className="pjlite-cloud-settings__group"><h3>Meus grupos</h3><p>Crie um grupo e compartilhe o código de convite. Você ainda pode adicionar e-mails diretamente, se quiser.</p><div className="pjlite-cloud-form-stack">`;
app = app.replace(groupsStart, groupsStartNew);

const groupCardOld = `<div className="pjlite-cloud-groups-list">{groups.length===0?<div className="pjlite-cloud-empty">Nenhum grupo criado ainda.</div>:groups.map(group=><article key={group.id} className="pjlite-cloud-group-card"><div><strong>{group.name}</strong><small>{group.members.length} {group.members.length===1?'membro':'membros'}</small></div><div className="pjlite-cloud-group-members">{group.members.map(email=><span key={email}>{email}</span>)}</div><button type="button" className="pjlite-cloud-icon-action" onClick={()=>removeCloudPreviewGroup(group.id)} title="Remover grupo">×</button></article>)}</div>`;
const groupCardNew = `<div className="pjlite-cloud-groups-list">{groups.length===0?<div className="pjlite-cloud-empty">Nenhum grupo criado ainda.</div>:groups.map(group=><article key={group.id} className="pjlite-cloud-group-card"><div><strong>{group.name}</strong><small>{group.members.length} {group.members.length===1?'membro':'membros'}{group.joined?' • convidado':''}</small></div>{group.joined&&group.ownerEmail&&<div className="pjlite-cloud-group-owner">Criado por {group.ownerName||group.ownerEmail}</div>}<div className="pjlite-cloud-invite-code-row">{group.inviteCode?<><code>{group.inviteCode}</code><button type="button" onClick={()=>copyCloudPreviewInviteCode(group.inviteCode)}>Copiar</button>{(!group.joined||String(group.ownerEmail||'').toLowerCase()===String(cloudAccount?.email||'').toLowerCase())&&<button type="button" className="secondary" onClick={()=>regenerateCloudPreviewInviteCode(group.id)} title="Criar novo código">↻</button>}</>:<button type="button" className="secondary" onClick={()=>ensureCloudPreviewInviteCode(group.id)}>Gerar código de convite</button>}</div><div className="pjlite-cloud-group-members">{group.members.length?group.members.map(email=><span key={email}>{email}</span>):<span className="is-empty">Compartilhe o código para convidar jogadores.</span>}</div><button type="button" className="pjlite-cloud-icon-action" onClick={()=>removeCloudPreviewGroup(group.id)} title={group.joined?'Sair da lista de grupos':'Remover grupo'}>×</button></article>)}</div>`;
if (!app.includes(groupCardOld)) throw new Error('Cloud Invites V4: cards de grupo não encontrados.');
app = app.replace(groupCardOld, groupCardNew);

css += `
/* ${marker} */
.pjlite-cloud-invite-join{background:linear-gradient(135deg,#f8fbff,#f3f6fa)}.pjlite-cloud-join-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;margin-top:10px}.pjlite-cloud-join-row input{min-width:0;padding:9px 10px;border:1px solid #bcc8d5;border-radius:7px;background:#fff;color:#2e435b;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}.pjlite-cloud-invite-code-row{display:flex;align-items:center;gap:5px;margin-top:8px}.pjlite-cloud-invite-code-row code{display:inline-flex;align-items:center;min-height:27px;padding:5px 8px;border:1px dashed #a9b7c6;border-radius:6px;background:#fff;color:#304962;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;font-weight:900;letter-spacing:.08em}.pjlite-cloud-invite-code-row button{min-height:27px;padding:4px 7px;border:1px solid #c6d0da;border-radius:6px;background:#eef3f7;color:#51657a;font-size:8px;font-weight:900}.pjlite-cloud-invite-code-row button:hover{background:#e4ebf2}.pjlite-cloud-group-owner{margin-top:4px;color:#7a8796;font-size:8px}.pjlite-cloud-group-members span.is-empty{background:transparent;border:1px dashed #cbd4dd;color:#8a96a3;font-style:italic}.theme-dark .pjlite-cloud-invite-join{background:#151f2c}.theme-dark .pjlite-cloud-join-row input,.theme-dark .pjlite-cloud-invite-code-row code{background:#0f172a;border-color:#52647a;color:#e5edf5}.theme-dark .pjlite-cloud-invite-code-row button{background:#223044;border-color:#4a5d73;color:#d7e1ec}.theme-dark .pjlite-cloud-group-owner{color:#aab6c4}.theme-dark .pjlite-cloud-group-members span.is-empty{background:transparent;color:#95a3b3}
@media(max-width:720px){.pjlite-cloud-join-row{grid-template-columns:1fr}.pjlite-cloud-join-row button{width:100%}.pjlite-cloud-invite-code-row{flex-wrap:wrap}}
`;

await writeFile(appPath, app, 'utf8');
await writeFile(cssPath, css, 'utf8');
console.log('✓ Cloud Sync preview: grupos agora têm código de convite, entrada por código e regeneração.');
