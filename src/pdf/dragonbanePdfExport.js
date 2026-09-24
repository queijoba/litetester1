import { fillDragonbanePdf } from './dragonbanePdfMap.js';

const STORAGE_KEY = 'dragonbane_saved_characters';
const PDFLIB_CDN = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
const BUTTON_ID = 'pjlite-dragonbane-pdf-export';
const CACHE_NAME = 'pjlite-pdf-templates-v1';
const TEMPLATE_URL = '/__pjlite_pdf_templates/dragonbane-pjlite-v1.pdf';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function visible(el) {
  if (!el) return false;
  const style = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
}

function toast(message, type = 'info') {
  let el = document.getElementById('pjlite-pdf-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'pjlite-pdf-toast';
    Object.assign(el.style, {
      position: 'fixed', right: '18px', bottom: '18px', zIndex: '99999',
      maxWidth: '360px', padding: '10px 14px', borderRadius: '10px',
      color: '#fff', font: '700 12px system-ui,sans-serif',
      boxShadow: '0 10px 28px rgba(0,0,0,.28)', transition: 'opacity .2s ease'
    });
    document.body.appendChild(el);
  }
  el.style.background = type === 'error' ? '#991b1b' : type === 'success' ? '#166534' : '#1f2937';
  el.textContent = message;
  el.style.opacity = '1';
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { el.style.opacity = '0'; }, 4200);
}

function loadPdfLib() {
  if (window.PDFLib?.PDFDocument) return Promise.resolve(window.PDFLib);
  if (loadPdfLib.promise) return loadPdfLib.promise;
  loadPdfLib.promise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-pjlite-pdflib="1"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.PDFLib), { once: true });
      existing.addEventListener('error', () => reject(new Error('Não foi possível carregar o gerador de PDF.')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = PDFLIB_CDN;
    script.async = true;
    script.dataset.pjlitePdflib = '1';
    script.onload = () => window.PDFLib?.PDFDocument ? resolve(window.PDFLib) : reject(new Error('pdf-lib não iniciou.'));
    script.onerror = () => reject(new Error('Não foi possível carregar o gerador de PDF.'));
    document.head.appendChild(script);
  });
  return loadPdfLib.promise;
}

async function cachedTemplate() {
  if (!('caches' in window)) return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(TEMPLATE_URL);
    return response ? await response.arrayBuffer() : null;
  } catch { return null; }
}

async function storeTemplate(bytes) {
  if (!('caches' in window)) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(TEMPLATE_URL, new Response(bytes, { headers: { 'Content-Type': 'application/pdf' } }));
  } catch {}
}

async function clearTemplate() {
  if (!('caches' in window)) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.delete(TEMPLATE_URL);
  } catch {}
}

function pickTemplate() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf,.pdf';
    input.style.display = 'none';
    input.onchange = async () => {
      const file = input.files?.[0];
      input.remove();
      if (!file) return reject(new Error('Seleção cancelada.'));
      try { resolve(await file.arrayBuffer()); }
      catch (error) { reject(error); }
    };
    document.body.appendChild(input);
    input.click();
  });
}

async function validateTemplate(bytes, PDFLib) {
  const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = doc.getForm();
  form.getTextField('nome');
  form.getTextField('pv_atual');
  form.getTextField('nome_pagina_2');
  form.getTextField('cartao_01_nome');
  if (doc.getPageCount() < 2) throw new Error('O PDF-base Dragonbane precisa ter 2 páginas.');
}

async function templateBytes(PDFLib, forcePick = false) {
  if (forcePick) await clearTemplate();
  const cached = forcePick ? null : await cachedTemplate();
  if (cached) {
    try {
      await validateTemplate(cached, PDFLib);
      return cached;
    } catch { await clearTemplate(); }
  }
  toast('Na primeira exportação, selecione o PDF editável Dragonbane do PJ Lite. Ele ficará salvo neste navegador.');
  const picked = await pickTemplate();
  try { await validateTemplate(picked, PDFLib); }
  catch { throw new Error('Este não parece ser o PDF editável Dragonbane do PJ Lite.'); }
  await storeTemplate(picked);
  return picked;
}

function readCharacters() {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

function time(item) {
  const t = Date.parse(item?.meta?.updatedAt || item?.meta?.createdAt || '');
  return Number.isFinite(t) ? t : 0;
}

function currentDragonbane(requireVisibleMatch = false) {
  const chars = readCharacters().filter(x => (x?.system || 'dragonbane') === 'dragonbane' && (x?.type || 'pc') === 'pc');
  if (!chars.length) return null;
  const values = new Set(Array.from(document.querySelectorAll('input,textarea')).filter(visible).map(x => String(x.value || '').trim()).filter(Boolean));
  const matches = chars.filter(x => x?.bio?.nome && values.has(String(x.bio.nome).trim()));
  if (requireVisibleMatch && !matches.length) return null;
  return [...(matches.length ? matches : chars)].sort((a, b) => time(b) - time(a))[0] || null;
}

function filename(item) {
  const name = String(item?.bio?.nome || 'Personagem')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'Personagem';
  return `PJ_Lite_Dragonbane_${name}.pdf`;
}

function download(bytes, item) {
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename(item);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

async function exportPdf(forceTemplatePick = false) {
  document.activeElement?.blur?.();
  await sleep(1650);
  const item = currentDragonbane(false);
  if (!item) throw new Error('Não encontrei a ficha Dragonbane atual. Salve a ficha e tente novamente.');

  const PDFLib = await loadPdfLib();
  const base = await templateBytes(PDFLib, forceTemplatePick);
  const doc = await PDFLib.PDFDocument.load(base, { ignoreEncryption: true });
  const form = doc.getForm();
  fillDragonbanePdf(form, item);

  try {
    const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
    form.updateFieldAppearances(font);
  } catch {}

  const bytes = await doc.save({ useObjectStreams: false, updateFieldAppearances: false });
  download(bytes, item);
  return item;
}

function isDragonbaneEditorOpen() {
  // Marcadores reais do layout Dragonbane atual. O detector antigo dependia de textos
  // exatos e podia falhar depois de uma pequena mudança visual.
  const structural = [
    document.querySelector('.db-sheet'),
    document.querySelector('.db-logo'),
    document.querySelector('.db-brand'),
    document.querySelector('.db-layout')
  ].filter(Boolean);

  if (structural.some(visible)) return true;

  // Fallback: se o nome da ficha Dragonbane salva aparece nos campos visíveis, estamos
  // dentro dessa ficha mesmo que as classes CSS mudem no futuro.
  return !!currentDragonbane(true);
}

function findToolbar() {
  const copy = Array.from(document.querySelectorAll('button')).find(
    b => visible(b) && /copiar\s*ficha/i.test((b.textContent || '').replace(/\s+/g, ' ').trim())
  );
  if (!copy) return null;

  const toolbar = copy.parentElement;
  if (!toolbar) return null;
  const buttons = Array.from(toolbar.querySelectorAll('button'));
  const hasZip = buttons.some(b => /^ZIP$/i.test((b.textContent || '').trim()));
  const hasSave = buttons.some(b => /salvar/i.test(b.textContent || ''));
  return hasZip && hasSave ? { copy, toolbar } : null;
}

function ensureButton() {
  let button = document.getElementById(BUTTON_ID);

  if (!isDragonbaneEditorOpen()) {
    button?.remove();
    return;
  }

  const found = findToolbar();
  if (!found) return;
  const { copy, toolbar } = found;

  if (!button) {
    button = document.createElement('button');
    button.id = BUTTON_ID;
    button.dataset.pjlitePdf = 'dragonbane';
    button.type = 'button';
    button.className = copy.className;
    button.textContent = '📄 Baixar PDF';
    button.title = 'Baixar esta ficha Dragonbane em PDF editável. Shift+clique troca o PDF-base salvo.';
    button.style.background = 'rgba(4,120,87,.92)';
    button.style.whiteSpace = 'nowrap';
    button.style.border = '1px solid rgba(255,255,255,.28)';
    button.onclick = async event => {
      if (button.dataset.busy === '1') return;
      const original = button.textContent;
      button.dataset.busy = '1';
      button.disabled = true;
      button.textContent = '⏳ Gerando PDF...';
      try {
        const item = await exportPdf(!!event.shiftKey);
        toast(`PDF editável de ${item?.bio?.nome || 'Dragonbane'} baixado.`, 'success');
      } catch (error) {
        const msg = String(error?.message || 'Não foi possível gerar o PDF.');
        if (!/cancelada/i.test(msg)) console.error('[PJ Lite PDF]', error);
        toast(msg, /cancelada/i.test(msg) ? 'info' : 'error');
      } finally {
        button.dataset.busy = '0';
        button.disabled = false;
        button.textContent = original;
      }
    };
  }

  // Reinsere depois do botão Copiar Ficha. Isso também recupera o botão caso o React
  // reconstrua a barra durante um autosave/re-render.
  if (button.parentElement !== toolbar || button.previousElementSibling !== copy) {
    toolbar.insertBefore(button, copy.nextSibling);
  }
}

export function installDragonbanePdfExport() {
  if (window.__pjliteDragonbanePdfExportInstalled) return;
  window.__pjliteDragonbanePdfExportInstalled = true;

  let pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      ensureButton();
    });
  };

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('focus', schedule, { passive: true });

  // Fallback contra reconciliações do React e dispositivos móveis que não gerem uma
  // mutação observável na barra. O custo é mínimo: apenas uma busca curta a cada 750 ms.
  setInterval(ensureButton, 750);
  setTimeout(ensureButton, 0);
  setTimeout(ensureButton, 250);
  setTimeout(ensureButton, 1000);
}