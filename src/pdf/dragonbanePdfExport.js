import { fillDragonbanePdf } from './dragonbanePdfMap.js';

const STORAGE_KEY = 'dragonbane_saved_characters';
const PDFLIB_CDN = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
const BUTTON_ID = 'pjlite-dragonbane-pdf-export';
const CACHE_NAME = 'pjlite-pdf-templates-v1';
const TEMPLATE_URL = '/__pjlite_pdf_templates/dragonbane-khat-v1.pdf';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function visible(el) {
  if (!el) return false;
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
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
  toast('Na primeira exportação, selecione Dragonbane_PJlite_Previa_Editavel. Ele ficará salvo neste navegador.');
  const picked = await pickTemplate();
  try { await validateTemplate(picked, PDFLib); }
  catch {
    throw new Error('Este não parece ser o PDF editável Dragonbane do PJ Lite.');
  }
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

function currentDragonbane() {
  const chars = readCharacters().filter(x => (x?.system || 'dragonbane') === 'dragonbane' && (x?.type || 'pc') === 'pc');
  if (!chars.length) return null;
  const values = new Set(Array.from(document.querySelectorAll('input,textarea')).filter(visible).map(x => String(x.value || '').trim()).filter(Boolean));
  const matches = chars.filter(x => x?.bio?.nome && values.has(String(x.bio.nome).trim()));
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
  // O PJ Lite usa autosave com debounce de 1,4 s.
  await sleep(1650);
  const item = currentDragonbane();
  if (!item) throw new Error('Não encontrei a ficha Dragonbane atual. Salve e tente novamente.');

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

function dragonbaneToolbar() {
  // O detector anterior dependia de três textos exatos do layout. Como o visual do
  // Dragonbane mudou, um desses textos deixou de existir e o botão nunca era criado.
  // A ficha já possui um marcador estrutural próprio e estável: .db-sheet.
  const dragonbaneSheet = Array.from(document.querySelectorAll('.db-sheet')).find(visible);
  if (!dragonbaneSheet) return null;

  const copy = Array.from(document.querySelectorAll('button')).find(
    b => visible(b) && /copiar\s*ficha/i.test((b.textContent || '').replace(/\s+/g, ' ').trim()),
  );
  if (!copy) return null;

  const toolbar = copy.parentElement;
  if (!toolbar) return null;

  // Confirma que encontramos a barra principal da ficha, e não algum texto dos guias.
  const buttons = Array.from(toolbar.querySelectorAll('button'));
  const hasZip = buttons.some(b => /^ZIP$/i.test((b.textContent || '').trim()));
  const hasSave = buttons.some(b => /salvar/i.test(b.textContent || ''));
  return hasZip && hasSave ? { copy, toolbar } : null;
}

function ensureButton() {
  const found = dragonbaneToolbar();
  let button = document.getElementById(BUTTON_ID);
  if (!found) {
    button?.remove();
    return;
  }

  const { copy, toolbar } = found;

  if (!button) {
    button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.className = copy.className;
    button.textContent = '📄 Baixar PDF';
    button.title = 'Baixar esta ficha de Dragonbane em PDF editável. Shift+clique para trocar o PDF-base salvo.';
    button.style.background = 'rgba(4,120,87,.84)';
    button.style.whiteSpace = 'nowrap';
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

  if (button.parentElement !== toolbar) {
    const zip = Array.from(toolbar.querySelectorAll('button')).find(b => /^ZIP$/i.test((b.textContent || '').trim()));
    toolbar.insertBefore(button, zip || copy.nextSibling);
  }
}

export function installDragonbanePdfExport() {
  if (window.__pjliteDragonbanePdfExportInstalled) return;
  window.__pjliteDragonbanePdfExportInstalled = true;
  let pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; ensureButton(); });
  };
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('resize', schedule, { passive: true });
  schedule();
}