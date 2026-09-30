const SYSTEM_ICONS = {
  Dragonbane: { src: '/system-icons/dragonbane.webp', label: 'DB', position: 'center 40%' },
  'D&D 5.5e (2024)': { src: '/system-icons/dnd5e.webp', label: 'D&D', position: 'center' },
  'Fabula Ultima': { src: '/system-icons/fabula.webp', label: 'FU', position: 'center' },
  '3DeT Victory': { src: '/system-icons/3det.webp', label: '3D&T', position: 'center 32%' },
  'O Som das Seis': { src: '/system-icons/som6.webp', label: '6', position: 'center' },
};

function normalize(value = '') {
  return String(value).replace(/\s+/g, ' ').trim().toLowerCase();
}

function findConfig(title) {
  const normalized = normalize(title);
  return Object.entries(SYSTEM_ICONS).find(([name]) => normalize(name) === normalized)?.[1] || null;
}

function decorateCard(card) {
  if (!(card instanceof HTMLElement) || card.dataset.systemIconReady === '1') return;
  const title = card.querySelector('h3');
  if (!title) return;
  const config = findConfig(title.textContent);
  if (!config) return;

  const icon = Array.from(card.children).find((child) =>
    child instanceof HTMLElement && /\bw-12\b/.test(child.className || '') && /\bh-12\b/.test(child.className || '')
  );
  if (!icon) return;

  icon.textContent = config.label;
  icon.style.backgroundColor = '#111827';
  icon.style.backgroundImage = `linear-gradient(rgba(0,0,0,.24), rgba(0,0,0,.58)), url("${config.src}")`;
  icon.style.backgroundSize = 'cover';
  icon.style.backgroundPosition = config.position || 'center';
  icon.style.backgroundRepeat = 'no-repeat';
  icon.style.color = '#fff';
  icon.style.textShadow = '0 1px 3px rgba(0,0,0,.95), 0 0 6px rgba(0,0,0,.75)';
  icon.style.border = '1px solid rgba(255,255,255,.16)';
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
