const SYSTEM_ICONS = {
  Dragonbane: {
    src: '/system-icons/dragonbane.webp?v=20260930f',
    label: '',
    position: 'center',
    size: 'cover',
    background: '#eef0df',
  },
  'D&D 5.5e (2024)': {
    src: '/system-icons/dnd5e.webp?v=20260930f',
    label: '',
    position: 'center',
    size: 'cover',
    background: '#090909',
  },
  'Fabula Ultima': {
    src: '/system-icons/fabula.webp?v=20260930f',
    label: 'FU',
    position: 'center',
    size: 'cover',
    background: '#e9f4f1',
  },
  // 3DeT fica fora daqui de propósito: usa novamente o ícone clássico preto + 3D&T do próprio PJ Lite.
  'O Som das Seis': {
    src: '/system-icons/som6.webp?v=20260930f',
    label: '',
    position: 'center',
    size: 'contain',
    background: '#250707',
  },
};

function normalize(value = '') {
  return String(value).replace(/\s+/g, ' ').trim().toLowerCase();
}

function findConfig(title) {
  const normalized = normalize(title);
  return Object.entries(SYSTEM_ICONS).find(([name]) => normalize(name) === normalized)?.[1] || null;
}

function polishSom6Card(card, title) {
  if (normalize(title?.textContent) !== 'o som das seis') return;
  const row = title.parentElement;
  if (row instanceof HTMLElement) {
    row.style.flexWrap = 'wrap';
    row.style.rowGap = '3px';
  }
  title.style.whiteSpace = 'nowrap';
  title.style.fontSize = '17px';
  title.style.lineHeight = '1.05';
  const badge = title.nextElementSibling;
  if (badge instanceof HTMLElement) {
    badge.style.flexShrink = '0';
    badge.style.whiteSpace = 'nowrap';
  }
}

function decorateCard(card) {
  if (!(card instanceof HTMLElement) || card.dataset.systemIconReady === '1') return;
  const title = card.querySelector('h3');
  if (!title) return;

  polishSom6Card(card, title);

  const config = findConfig(title.textContent);
  if (!config) return;

  const icon = Array.from(card.children).find((child) =>
    child instanceof HTMLElement && /\bw-12\b/.test(child.className || '') && /\bh-12\b/.test(child.className || '')
  );
  if (!icon) return;

  const hasLabel = Boolean(config.label);
  icon.textContent = config.label || '';
  icon.style.backgroundColor = config.background || '#111827';
  icon.style.backgroundImage = hasLabel
    ? `linear-gradient(rgba(0,0,0,.10), rgba(0,0,0,.38)), url("${config.src}")`
    : `url("${config.src}")`;
  icon.style.backgroundSize = config.size || 'cover';
  icon.style.backgroundPosition = config.position || 'center';
  icon.style.backgroundRepeat = 'no-repeat';
  icon.style.color = '#fff';
  icon.style.textShadow = hasLabel ? '0 1px 3px rgba(0,0,0,.95), 0 0 5px rgba(0,0,0,.75)' : 'none';
  icon.style.border = '1px solid rgba(17,24,39,.22)';
  icon.style.overflow = 'hidden';
  card.dataset.systemIconReady = '1';
}

function decorateSystemSelector() {
  for (const heading of document.querySelectorAll('h2')) {
    if (normalize(heading.textContent) !== 'selecionar sistema') continue;
    const modal = heading.closest('.fixed');
    if (!modal) continue;
    for (const card of modal.querySelectorAll('.group')) decorateCard(card);
  }
}

let scheduled = false;
function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    decorateSystemSelector();
  });
}

new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
addEventListener('resize', schedule, { passive: true });
setTimeout(schedule, 0);
