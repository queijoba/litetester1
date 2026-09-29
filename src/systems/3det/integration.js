import './3det-theme.css';

const THEME_PREF_KEY = 'dragonbane_theme_prefs';
const THEME_VALUE = '3det';
const THEME_CLASS = 'theme-3det';
const GUIDE_BUTTON_ATTR = 'data-pjlite-3det-guide';

const safeStorageGet = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};

const safeStorageSet = (key, value) => {
  try { localStorage.setItem(key, value); } catch {}
};

const isThemeSelect = (element) => (
  element instanceof HTMLSelectElement
  && element.querySelector('option[value="som6"]')
  && element.querySelector('option[value="custom"]')
);

const syncBodyTheme = () => {
  if (!document.body) return;
  const active = safeStorageGet(THEME_PREF_KEY) === THEME_VALUE;
  document.body.classList.toggle(THEME_CLASS, active);
  if (active) document.body.classList.remove('theme-default');
};

const ensureThemeOption = () => {
  document.querySelectorAll('select').forEach((select) => {
    if (!isThemeSelect(select)) return;
    let option = select.querySelector('option[value="3det"]');
    if (!option) {
      option = document.createElement('option');
      option.value = THEME_VALUE;
      option.textContent = 'Tema: 3DeT Victory';
      const dark = select.querySelector('option[value="dark"]');
      select.insertBefore(option, dark || select.lastElementChild);
    }
    if (safeStorageGet(THEME_PREF_KEY) === THEME_VALUE && select.value !== THEME_VALUE) {
      select.value = THEME_VALUE;
    }
  });
};

const ensure3DetSheetScope = () => {
  document.querySelectorAll('div').forEach((element) => {
    if (!element.classList.contains('bg-[#f5f5f2]')) return;
    const text = element.textContent || '';
    if (text.includes('3DeT') && text.includes('Victory')) element.classList.add('tresdet-sheet');
  });
};

const GUIDE_HTML = `
  <div class="space-y-5">
    <div class="rounded-lg border-2 border-amber-400 bg-zinc-950 p-5 text-white">
      <div class="mb-1 text-[10px] font-black uppercase tracking-widest text-amber-400">0.8.0v Alpha • 3DeT Victory</div>
      <h3 class="font-title text-xl font-black text-amber-300">🎮 3DeT Victory — guia da ficha</h3>
      <p class="mt-2 text-xs text-zinc-200">A ficha do PJ Lite prioriza criação rápida e consulta em mesa. Ela usa as perícias padrão do Livro Básico, mas também permite opções personalizadas para suplementos ou regras da mesa sem misturar essas opções com as oficiais.</p>
    </div>
    <div class="rounded border border-amber-300 bg-amber-50 p-4">
      <h3 class="mb-2 font-bold text-amber-950">🧭 Ordem recomendada</h3>
      <p class="text-xs"><strong>Retrato e conceito → Arquétipo/Kit → Pontos e XP → P/H/R → PA/PM/PV → Perícias → Especializações → Vantagens/Desvantagens → Técnicas → Inventário → Salvar.</strong></p>
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      <div class="rounded border bg-white p-4"><strong>1. Identidade</strong><p class="mt-1 text-xs">Preencha Nome, Jogador, Arquétipo, Conceito e Escala. <strong>Kit</strong> fica opcional para mesas e materiais que o utilizem. O retrato usa Escolher imagem/Remover como nas outras fichas.</p></div>
      <div class="rounded border bg-white p-4"><strong>2. Atributos e recursos</strong><p class="mt-1 text-xs">Registre Poder, Habilidade e Resistência. PA, PM e PV têm Atual/Máximo para uso durante a sessão. O PJ Lite não força cálculos que possam mudar por vantagens ou regras da mesa.</p></div>
      <div class="rounded border bg-white p-4"><strong>3. Perícias padrão</strong><p class="mt-1 text-xs">As 12 perícias padrão já aparecem prontas. Marque apenas as compradas pelo personagem; o contador da área acompanha as seleções.</p></div>
      <div class="rounded border bg-white p-4"><strong>4. Perícias personalizadas</strong><p class="mt-1 text-xs">Para suplemento ou regra da mesa, escreva o nome e confirme. A nova opção entra selecionada. Use <strong>Editar</strong> para remover apenas as personalizadas.</p></div>
      <div class="rounded border bg-white p-4"><strong>5. Especializações</strong><p class="mt-1 text-xs">Ficam em uma área separada. Informe nome, perícia-base opcional e uma nota curta para consulta; assim não são confundidas com perícias completas.</p></div>
      <div class="rounded border bg-white p-4"><strong>6. Vantagens, Desvantagens e Técnicas</strong><p class="mt-1 text-xs">Adicione apenas o que o personagem possui. Custo/valor e resumo servem como lembrete; para o texto completo da regra, consulte o material usado pela mesa.</p></div>
      <div class="rounded border bg-white p-4"><strong>7. Inventário</strong><p class="mt-1 text-xs">Cadastre item, quantidade, raridade e nota. Os contadores de Comum, Incomum e Raro funcionam como resumo rápido.</p></div>
      <div class="rounded border bg-white p-4"><strong>8. Ficha Chat e backup</strong><p class="mt-1 text-xs">A Ficha Chat inclui perícias oficiais, personalizadas e especializações. Salve após mudanças importantes e mantenha backup fora do navegador antes de sessões importantes.</p></div>
    </div>
    <div class="rounded border border-zinc-300 bg-zinc-100 p-4">
      <h3 class="mb-2 font-bold text-zinc-900">🎨 Tema 3DeT Victory</h3>
      <p class="text-xs">No seletor de temas do topo, escolha <strong>Tema: 3DeT Victory</strong>. O tema usa preto, amarelo e tons de papel, e a ficha também tem tratamento próprio no Modo Escuro e no celular.</p>
    </div>
    <div class="rounded border border-amber-300 bg-amber-50 p-4">
      <h3 class="mb-2 font-bold text-amber-950">ℹ️ Sobre regras</h3>
      <p class="text-xs">O PJ Lite organiza a ficha e automatiza tarefas de interface. Custos, requisitos, efeitos, limites e exceções continuam seguindo o material de 3DeT Victory adotado pela sua mesa.</p>
    </div>
  </div>
`;

const setGuideButtonActive = (tabBar, activeButton) => {
  tabBar.querySelectorAll(':scope > button').forEach((button) => {
    button.classList.remove(
      'border-gray-800', 'text-gray-900', 'bg-white',
      'border-orange-600', 'text-orange-900',
      'border-teal-600', 'text-teal-900',
      'border-red-900', 'text-red-950',
      'border-amber-500', 'text-amber-900',
    );
    button.classList.add('border-transparent', 'text-gray-500');
  });
  activeButton.classList.remove('border-transparent', 'text-gray-500');
  activeButton.classList.add('border-amber-500', 'text-amber-900', 'bg-white');
};

const ensureGuideTab = () => {
  const heading = [...document.querySelectorAll('h2')]
    .find((node) => node.textContent?.trim() === 'Guias e Tutoriais');
  if (!heading) return;

  const modal = heading.closest('.fixed');
  if (!modal) return;

  const version = heading.parentElement?.querySelector('.text-\\[9px\\]');
  if (version && version.textContent?.includes('PJ Lite')) version.textContent = 'PJ Lite 0.8.0v Alpha';

  const tabBar = [...modal.querySelectorAll('div')].find((element) => {
    const labels = [...element.children]
      .filter((child) => child.tagName === 'BUTTON')
      .map((child) => child.textContent?.trim());
    return labels.includes('Começando') && labels.includes('Fabula Ultima') && labels.includes('Som das Seis');
  });
  if (!tabBar || tabBar.querySelector(`[${GUIDE_BUTTON_ATTR}]`)) return;

  const button = document.createElement('button');
  button.setAttribute(GUIDE_BUTTON_ATTR, 'true');
  button.type = 'button';
  button.textContent = '3DeT Victory';
  button.className = 'flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap border-transparent text-gray-500 hover:bg-gray-300';
  button.addEventListener('click', () => {
    const content = [...modal.querySelectorAll('div')].find((element) => (
      element.classList.contains('p-6')
      && element.classList.contains('overflow-y-auto')
    ));
    if (!content) return;
    setGuideButtonActive(tabBar, button);
    content.innerHTML = GUIDE_HTML;
    content.scrollTop = 0;
  });

  const som6 = [...tabBar.children].find((child) => child.textContent?.trim() === 'Som das Seis');
  tabBar.insertBefore(button, som6 || null);
};

const refreshReleaseLabels = () => {
  document.querySelectorAll('span').forEach((span) => {
    if (span.textContent?.includes('✨ 0.7.4v Alpha — prévia pronta para homologação')) {
      span.textContent = '✨ 0.8.0v Alpha — 3DeT Victory integrado';
    }
  });
};

let scheduled = false;
const scheduleSync = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    syncBodyTheme();
    ensureThemeOption();
    ensure3DetSheetScope();
    ensureGuideTab();
    refreshReleaseLabels();
  });
};

const start = () => {
  scheduleSync();

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!isThemeSelect(target)) return;
    if (target.value === THEME_VALUE) safeStorageSet(THEME_PREF_KEY, THEME_VALUE);
    setTimeout(scheduleSync, 0);
  }, true);

  const observer = new MutationObserver(scheduleSync);
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class'],
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
