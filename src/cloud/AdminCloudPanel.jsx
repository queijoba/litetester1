import * as React from 'react';
import { getAdminDashboard } from './supabaseCloud.js';
import './admin.css';

const ADMIN_EMAIL = 'nickreisgg55@gmail.com';

const dateTime = value => {
  if (!value) return 'Nunca';
  try {
    return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return '—';
  }
};

const dateOnly = value => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('pt-BR');
  } catch {
    return '—';
  }
};

const activityLabel = value => ({
  '24h': 'Últimas 24h',
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  inactive: 'Sem login recente',
}[value] || 'Sem login recente');

const tagsOf = user => Array.isArray(user?.achievementTags) ? user.achievementTags : [];

const AchievementTags = ({ user, compact = false }) => {
  const tags = tagsOf(user);
  if (!tags.length) return <span className="pjlite-admin__no-tags">Sem conquistas</span>;
  return <div className={'pjlite-admin__tags '+(compact?'is-compact':'')}>
    {tags.map(tag=><span key={tag.id||tag.label} className={'pjlite-admin__achievement pjlite-admin__achievement--'+String(tag.id||'').replace(/[^a-z0-9-]/gi,'').toLowerCase()} title={(tag.name||tag.label)+(tag.unlockedAt?' • '+dateTime(tag.unlockedAt):'')}>
      <b>{tag.label}</b>{!compact&&<small>{tag.name||'Conquista'}</small>}
    </span>)}
  </div>;
};

export default function AdminCloudPanel({ account, showToast }) {
  const [view, setView] = React.useState('overview');
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [selectedUserId, setSelectedUserId] = React.useState('');

  const isAdmin = String(account?.email || '').trim().toLowerCase() === ADMIN_EMAIL;

  const load = React.useCallback(async (silent = false) => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');
    try {
      const next = await getAdminDashboard();
      setData(next);
      if (!silent) showToast?.('✓ Estatísticas administrativas atualizadas.');
    } catch (err) {
      console.error('Conta Lite: painel administrativo', err);
      const message = String(err?.message || '');
      setError(message.includes('forbidden') ? 'Esta conta não possui acesso administrativo.' : 'Não foi possível carregar os dados administrativos.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, showToast]);

  React.useEffect(() => {
    load(true);
  }, [load]);

  if (!isAdmin) return null;

  const overview = data?.overview || {};
  const users = Array.isArray(data?.users) ? data.users : [];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredUsers = users.filter(user => {
    if (!normalizedQuery) return true;
    return String(user.email || '').toLowerCase().includes(normalizedQuery)
      || String(user.name || '').toLowerCase().includes(normalizedQuery)
      || String(user.provider || '').toLowerCase().includes(normalizedQuery)
      || tagsOf(user).some(tag => String(tag.label||'').toLowerCase().includes(normalizedQuery) || String(tag.name||'').toLowerCase().includes(normalizedQuery));
  });
  const selectedUser = users.find(user => user.id === selectedUserId) || null;

  return <div className="pjlite-admin">
    <div className="pjlite-admin__head">
      <div>
        <span className="pjlite-admin__eyebrow">ACESSO EXCLUSIVO</span>
        <h3>Painel administrativo</h3>
        <p>Visível apenas para <strong>{ADMIN_EMAIL}</strong>. Os dados também são protegidos no servidor.</p>
      </div>
      <button type="button" className="secondary" onClick={()=>load(false)} disabled={loading}>
        {loading ? 'Atualizando…' : '↻ Atualizar'}
      </button>
    </div>

    <div className="pjlite-admin__tabs" role="tablist" aria-label="Áreas administrativas">
      <button type="button" className={view==='overview'?'active':''} onClick={()=>setView('overview')}>▦ Resumo</button>
      <button type="button" className={view==='accounts'?'active':''} onClick={()=>setView('accounts')}>♙ Contas</button>
      <button type="button" className={view==='users'?'active':''} onClick={()=>setView('users')}>◉ Usuários</button>
    </div>

    {error && <div className="pjlite-admin__error">{error}</div>}
    {!data && loading && <div className="pjlite-admin__empty">Carregando estatísticas…</div>}

    {data && view==='overview' && <>
      <div className="pjlite-admin__cards">
        <article><span>Contas cadastradas</span><strong>{overview.totalAccounts ?? 0}</strong><small>Supabase Auth</small></article>
        <article><span>Login nas últimas 24h</span><strong>{overview.signedIn24h ?? 0}</strong><small>não significa online agora</small></article>
        <article><span>Login nos últimos 7 dias</span><strong>{overview.signedIn7d ?? 0}</strong><small>contas recentes</small></article>
        <article><span>Login nos últimos 30 dias</span><strong>{overview.signedIn30d ?? 0}</strong><small>contas recentes</small></article>
        <article><span>Fichas na nuvem</span><strong>{overview.totalSheets ?? 0}</strong><small>PJ Lite Cloud</small></article>
        <article><span>Grupos</span><strong>{overview.totalGroups ?? 0}</strong><small>mesas/grupos criados</small></article>
        <article><span>Compartilhamentos</span><strong>{overview.totalShares ?? 0}</strong><small>envios registrados</small></article>
        <article className="pjlite-admin__card-achievements"><span>Contas com conquistas</span><strong>{overview.taggedAccounts ?? 0}</strong><small>{overview.totalAchievementTags ?? 0} tags liberadas</small></article>
      </div>
      <div className="pjlite-admin__note">
        <strong>Sobre “online agora”</strong>
        <span>Por enquanto o painel mostra login recente. Quando adicionarmos Presence/Realtime ao PJLite, este card poderá mostrar usuários realmente conectados naquele instante.</span>
      </div>
      <div className="pjlite-admin__note">
        <strong>Visitas do site</strong>
        <span>O painel já está preparado para receber essa métrica, mas o Web Analytics da Vercel ainda precisa ser ativado no projeto para começar a registrar visitas.</span>
      </div>
      <small className="pjlite-admin__updated">Atualizado em {dateTime(data.generatedAt)}</small>
    </>}

    {data && view==='accounts' && <>
      <div className="pjlite-admin__toolbar">
        <label>
          <span>Pesquisar conta</span>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nome, e-mail, provedor ou conquista…" />
        </label>
        <strong>{filteredUsers.length} {filteredUsers.length===1?'conta':'contas'}</strong>
      </div>
      <div className="pjlite-admin__table-wrap">
        <table className="pjlite-admin__table">
          <thead><tr><th>Conta</th><th>Conquistas</th><th>Provedor</th><th>Criada em</th><th>Confirmada</th></tr></thead>
          <tbody>
            {filteredUsers.map(user=><tr key={user.id} onClick={()=>setSelectedUserId(user.id)} className={selectedUserId===user.id?'is-selected':''}>
              <td><div className="pjlite-admin__person">{user.avatar?<img src={user.avatar} alt="" />:<span>{String(user.name||user.email||'?').charAt(0).toUpperCase()}</span>}<div><strong>{user.name}</strong><small>{user.email}</small></div></div></td>
              <td><AchievementTags user={user} compact /></td>
              <td><code>{user.provider || 'email'}</code></td>
              <td>{dateOnly(user.createdAt)}</td>
              <td>{user.emailConfirmedAt ? '✓ Sim' : '—'}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {selectedUser && <>
      <div className="pjlite-admin__detail">
        <div><span>Conta selecionada</span><strong>{selectedUser.name}</strong><small>{selectedUser.email}</small></div>
        <div><span>Último login</span><strong>{dateTime(selectedUser.lastSignInAt)}</strong><small>{activityLabel(selectedUser.activity)}</small></div>
        <div><span>Fichas</span><strong>{selectedUser.sheetCount}</strong><small>na nuvem</small></div>
        <div><span>Grupos</span><strong>{selectedUser.groupCount}</strong><small>participações</small></div>
      </div>
      <div className="pjlite-admin__achievement-panel">
        <div><span className="pjlite-admin__eyebrow">CONQUISTAS DA CONTA</span><strong>Tags liberadas</strong><small>As conquistas são vinculadas à Conta Lite e aparecem automaticamente aqui.</small></div>
        <AchievementTags user={selectedUser} />
      </div>
      </>}
    </>}

    {data && view==='users' && <>
      <div className="pjlite-admin__toolbar">
        <label>
          <span>Pesquisar usuário</span>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nome, e-mail ou conquista…" />
        </label>
        <strong>{filteredUsers.length} {filteredUsers.length===1?'usuário':'usuários'}</strong>
      </div>
      <div className="pjlite-admin__users">
        {filteredUsers.map(user=><article key={user.id}>
          <div className="pjlite-admin__person">
            {user.avatar?<img src={user.avatar} alt="" />:<span>{String(user.name||user.email||'?').charAt(0).toUpperCase()}</span>}
            <div><strong>{user.name}</strong><small>{user.email}</small><AchievementTags user={user} compact /></div>
          </div>
          <span className={'pjlite-admin__activity is-'+user.activity}>{activityLabel(user.activity)}</span>
          <div className="pjlite-admin__user-stats">
            <div><span>Último login</span><strong>{dateTime(user.lastSignInAt)}</strong></div>
            <div><span>Fichas</span><strong>{user.sheetCount}</strong></div>
            <div><span>Grupos</span><strong>{user.groupCount}</strong></div>
          </div>
        </article>)}
      </div>
    </>}
  </div>;
}
