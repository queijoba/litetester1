const SYSTEM_ICONS = {
  Dragonbane: {
    mode: 'text',
    text: 'DB',
    color: '#b91c1c',
    background: '#f3ead8',
    fontSize: '20px',
    fontFamily: 'Georgia, serif',
  },
  'D&D 5.5e (2024)': {
    mode: 'image',
    src: '/system-icons/dnd5e.webp?v=20260930h',
    fallback: 'D&D',
    position: 'center',
    fit: 'cover',
    background: '#090909',
  },
  'Fabula Ultima': {
    mode: 'image',
    src: '/system-icons/fabula.webp?v=20260930h',
    fallback: 'FU',
    overlay: 'FU',
    position: 'center',
    fit: 'cover',
    background: '#e9f4f1',
  },
  '3DeT Victory': {
    mode: 'text',
    text: '3D&T',
    color: '#f5b000',
    background: '#090909',
    fontSize: '14px',
    fontFamily: 'Arial Black, Arial, sans-serif',
    letterSpacing: '-0.8px',
  },
  'O Som das Seis': {
    mode: 'text',
    text: '🌵',
    color: '#5b3a16',
    background: '#f4e6c7',
    fontSize: '25px',
    fontFamily: 'system-ui, sans-serif',
  },
};

function normalize(value = '') {
  return String(value).replace(/\s+/g, ' ').trim().toLowerCase();
}

function findConfig(title) {
  const normalized = normalize(title);
  return Object.entries(SYSTEM_ICONS).find(([name]) => normalize(name) === normalized)?.[1] || null;
}

function polishCard(card, title) {
  if (!(card instanceof HTMLElement) || !(title instanceof HTMLElement)) return;

  card.style.minHeight = '82px';
  card.style.alignItems = 'center';

  const icon = Array.from(card.children).find((child) =>
    child instanceof HTMLElement && /\bw-12\b/.test(child.className || '') && /\bh-12\b/.test(child.className || '')
  );
  if (icon instanceof HTMLElement) {
    icon.style.flex = '0 0 48px';
    icon.style.width = '48px';
    icon.style.height = '48px';
    icon.style.minWidth = '48px';
    icon.style.maxWidth = '48px';
    icon.style.boxSizing = 'border-box';
  }

  const content = title.closest('.flex-1');
  if (content instanceof HTMLElement) content.style.minWidth = '0';

  const row = title.parentElement;
  if (row instanceof HTMLElement) {
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.flexWrap = 'wrap';
    row.style.columnGap = '7px';
    row.style.rowGap = '4px';
  }

  title.style.lineHeight = '1.08';
  title.style.margin = '0';

  const badge = title.nextElementSibling;
  if (badge instanceof HTMLElement && badge.tagName === 'SPAN') {
    badge.style.flexShrink = '0';
    badge.style.whiteSpace = 'nowrap';
    badge.style.lineHeight = '1.1';
  }

  const description = content?.querySelector('p');
  if (description instanceof HTMLElement) {
    description.style.marginTop = '4px';
    description.style.lineHeight = '1.25';
  }

  if (normalize(title.textContent) === 'o som das seis') {
    title.style.whiteSpace = 'nowrap';
    title.style.fontSize = '17px';
  }
}

function prepareIconBox(icon, config) {
  icon.textContent = '';
  icon.style.position = 'relative';
  icon.style.background = config.background || '#111827';
  icon.style.border = '1px solid rgba(17,24,39,.20)';
  icon.style.overflow = 'hidden';
  icon.style.display = 'flex';
  icon.style.alignItems = 'center';
  icon.style.justifyContent = 'center';
  icon.style.padding = '0';
  icon.style.lineHeight = '1';
  icon.style.boxSizing = 'border-box';
}

function renderTextIcon(icon, config) {
  prepareIconBox(icon, config);
  const label = document.createElement('span');
  label.textContent = config.text || config.fallback || '';
  Object.assign(label.style, {
    display: 'block',
    maxWidth: '42px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    color: config.color || '#fff',
    fontWeight: '900',
    fontFamily: config.fontFamily || 'Georgia, serif',
    fontSize: config.fontSize || '18px',
    letterSpacing: config.letterSpacing || '0',
    lineHeight: '1',
    pointerEvents: 'none',
  });
  icon.appendChild(label);
}

function renderImageIcon(icon, config) {
  prepareIconBox(icon, config);

  const img = document.createElement('img');
  img.src = config.src;
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  Object.assign(img.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    objectFit: config.fit || 'cover',
    objectPosition: config.position || 'center',
    display: 'block',
  });

  const label = document.createElement('span');
  label.textContent = config.overlay || '';
  Object.assign(label.style, {
    position: 'relative',
    zIndex: '2',
    color: '#fff',
    fontWeight: '800',
    fontFamily: 'Georgia, serif',
    fontSize: config.overlay ? '20px' : '14px',
    textShadow: config.overlay ? '0 1px 3px rgba(0,0,0,.95), 0 0 5px rgba(0,0,0,.75)' : 'none',
    pointerEvents: 'none',
  });

  img.addEventListener('error', () => {
    img.remove();
    label.textContent = config.fallback || '';
  }, { once: true });

  icon.appendChild(img);
  icon.appendChild(label);
}

function decorateCard(card) {
  if (!(card instanceof HTMLElement)) return;
  const title = card.querySelector('h3');
  if (!title) return;

  polishCard(card, title);

  const config = findConfig(title.textContent);
  if (!config || card.dataset.systemIconReady === '3') return;

  const icon = Array.from(card.children).find((child) =>
    child instanceof HTMLElement && /\bw-12\b/.test(child.className || '') && /\bh-12\b/.test(child.className || '')
  );
  if (!icon) return;

  if (config.mode === 'image') renderImageIcon(icon, config);
  else renderTextIcon(icon, config);

  card.dataset.systemIconReady = '3';
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

// Deploy retry: no functional change; used to republish the validated selector revision.
