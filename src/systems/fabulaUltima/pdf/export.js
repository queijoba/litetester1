import { fillFabulaPdf } from './map.js';

const STORAGE_KEY = 'dragonbane_saved_characters';
const PDFLIB_CDN = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
const TEMPLATE_URL = '/pdfs/FU_Ficha_de_personagemV2.pdf?v=20260929-v2';
const BUTTON_ID = 'pjlite-fabula-pdf-export';

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
      position: 'fixed', right: '18px', bottom: '18px', zIndex: '99999', maxWidth: '390px',
      padding: '10px 14px', borderRadius: '10px', color: '#fff', font: '700 12px system-ui,sans-serif',
      boxShadow: '0 10px 28px rgba(0,0,0,.28)', transition: 'opacity .2s ease'
    });
    document.body.appendChild(el);
  }
  el.style.background = type === 'error' ? '#991b1b' : type === 'success' ? '#166534' : '#1f2937';
  el.textContent = message;
  el.style.opacity = '1';
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { el.style.opacity = '0'; }, 4800);
}

function loadPdfLib() {
  if (window.PDFLib?.PDFDocument) return Promise.resolve(window.PDFLib);
  if (loadPdfLib.promise) return loadPdfLib.promise;
  loadPdfLib.promise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-pjlite-pdflib="1"]');
    if (existing) {
      if (window.PDFLib?.PDFDocument) return resolve(window.PDFLib);
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

function readCharacters() {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}

function timestamp(item) {
  const value = Date.parse(item?.meta?.updatedAt || item?.meta?.createdAt || '');
  return Number.isFinite(value) ? value : 0;
}

function currentFabula(requireVisibleMatch = false) {
  const chars = readCharacters().filter(item => item?.system === 'fabula' && (item?.type || 'pc') === 'pc');
  if (!chars.length) return null;
  const values = new Set(Array.from(document.querySelectorAll('input,textarea,select')).filter(visible).map(el => String(el.value || '').trim()).filter(Boolean));
  const matches = chars.filter(item => item?.bio?.nome && values.has(String(item.bio.nome).trim()));
  if (requireVisibleMatch && !matches.length) return null;
  return [...(matches.length ? matches : chars)].sort((a, b) => timestamp(b) - timestamp(a))[0] || null;
}

function filename(item) {
  const name = String(item?.bio?.nome || 'Personagem').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'Personagem';
  return `PJ_Lite_Fabula_Ultima_${name}.pdf`;
}

function download(bytes, item) {
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename(item);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 8000);
}

async function loadTemplate(PDFLib) {
  const response = await fetch(TEMPLATE_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Não foi possível abrir o PDF modelo de Fabula Ultima (${response.status}).`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 5 || String.fromCharCode(...bytes.slice(0, 5)) !== '%PDF-') throw new Error('O modelo de Fabula Ultima não é um PDF válido.');
  const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = doc.getForm();
  const fields = form.getFields();
  const names = new Set(fields.map(field => field.getName()));
  const required = ['retrato_personagem', 'Nome', 'Campo testo 10207', 'Campo testo 252', 'Campo testo 236', 'Campo testo 10210'];
  const missing = required.filter(name => !names.has(name));
  if (missing.length) throw new Error(`O PDF não corresponde ao modelo editável esperado de Fabula Ultima (${missing.join(', ')}).`);
  const regular = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
  return { doc, form, regular };
}

async function blobToPngBytes(blob) {
  try {
    const bitmap = await createImageBitmap(blob);
    const max = 1400;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.92));
    return png ? new Uint8Array(await png.arrayBuffer()) : null;
  } catch { return null; }
}

async function imageFromSource(source) {
  if (!source || typeof source !== 'string') return null;
  const value = source.trim();
  if (!/^(data:image\/|https?:|blob:)/i.test(value)) return null;
  try {
    const response = await fetch(value, /^https?:/i.test(value) ? { mode: 'cors' } : undefined);
    if (!response.ok) return null;
    const blob = await response.blob();
    const type = (blob.type || response.headers.get('content-type') || '').toLowerCase();
    const bytes = new Uint8Array(await blob.arrayBuffer());
    if (type.includes('png')) return { bytes, kind: 'png' };
    if (type.includes('jpeg') || type.includes('jpg')) return { bytes, kind: 'jpg' };
    const converted = await blobToPngBytes(blob);
    return converted ? { bytes: converted, kind: 'png' } : null;
  } catch (error) {
    console.warn('[PJ Lite Fabula PDF] Retrato indisponível; o PDF continuará sem imagem.', error);
    return null;
  }
}

async function addPortrait(doc, form, item) {
  const loaded = await imageFromSource(item?.bio?.imagem);
  if (!loaded) return false;
  try {
    const image = loaded.kind === 'png' ? await doc.embedPng(loaded.bytes) : await doc.embedJpg(loaded.bytes);
    form.getButton('retrato_personagem').setImage(image);
    return true;
  } catch (error) {
    console.warn('[PJ Lite Fabula PDF] Não foi possível inserir o retrato no campo editável.', error);
    return false;
  }
}

async function exportPdf() {
  document.activeElement?.blur?.();
  await sleep(900);
  const item = currentFabula(false);
  if (!item) throw new Error('Não encontrei a ficha Fabula Ultima atual. Salve a ficha e tente novamente.');
  const PDFLib = await loadPdfLib();
  const { doc, form, regular } = await loadTemplate(PDFLib);
  fillFabulaPdf(form, item);
  try { form.updateFieldAppearances(regular); } catch (error) { console.warn('[PJ Lite Fabula PDF] Algumas aparências serão geradas pelo leitor de PDF.', error); }
  const portraitAdded = await addPortrait(doc, form, item);
  const bytes = await doc.save({ useObjectStreams: false, updateFieldAppearances: false });
  download(bytes, item);
  return { item, portraitAdded };
}

function isFabulaEditorOpen() {
  const structural = [document.querySelector('.fabula-pdf-editor'), document.querySelector('.fabula-sheet-shell')].filter(Boolean);
  if (structural.some(visible)) return true;
  return !!currentFabula(true);
}

function findToolbar() {
  const copy = Array.from(document.querySelectorAll('button')).find(button => visible(button) && /copiar\s*ficha/i.test((button.textContent || '').replace(/\s+/g, ' ').trim()));
  if (!copy) return null;
  const toolbar = copy.parentElement;
  if (!toolbar) return null;
  const buttons = Array.from(toolbar.querySelectorAll('button'));
  return buttons.some(button => /^ZIP$/i.test((button.textContent || '').trim())) && buttons.some(button => /salvar/i.test(button.textContent || '')) ? { copy, toolbar } : null;
}

function ensureButton() {
  let button = document.getElementById(BUTTON_ID);
  if (!isFabulaEditorOpen()) { button?.remove(); return; }
  const found = findToolbar();
  if (!found) return;
  const { copy, toolbar } = found;
  if (!button) {
    button = document.createElement('button');
    button.id = BUTTON_ID;
    button.dataset.pjlitePdf = 'fabula';
    button.type = 'button';
    button.className = copy.className;
    button.textContent = '📄 Baixar PDF';
    button.title = 'Baixar esta ficha usando a ficha editável de 3 páginas de Fabula Ultima.';
    button.style.background = 'rgba(13,116,104,.96)';
    button.style.whiteSpace = 'nowrap';
    button.style.border = '1px solid rgba(255,255,255,.28)';
    button.onclick = async () => {
      if (button.dataset.busy === '1') return;
      const original = button.textContent;
      button.dataset.busy = '1';
      button.disabled = true;
      button.textContent = '⏳ Gerando PDF...';
      try {
        const { item, portraitAdded } = await exportPdf();
        const name = item?.bio?.nome || 'Fabula Ultima';
        const hasPortrait = !!item?.bio?.imagem;
        if (hasPortrait && !portraitAdded) {
          toast(`PDF editável de ${name} baixado, mas não foi possível incorporar o retrato.`, 'info');
        } else {
          toast(`PDF editável de ${name} baixado${portraitAdded ? ' com retrato' : ''}.`, 'success');
        }
      } catch (error) {
        console.error('[PJ Lite Fabula PDF]', error);
        toast(String(error?.message || 'Não foi possível gerar o PDF de Fabula Ultima.'), 'error');
      } finally {
        button.dataset.busy = '0';
        button.disabled = false;
        button.textContent = original;
      }
    };
  }
  if (button.parentElement !== toolbar || button.previousElementSibling !== copy) toolbar.insertBefore(button, copy.nextSibling);
}

export function installFabulaPdfExport() {
  if (window.__pjliteFabulaPdfExportInstalled) return;
  window.__pjliteFabulaPdfExportInstalled = true;
  let pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; ensureButton(); });
  };
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('focus', schedule, { passive: true });
  setInterval(ensureButton, 750);
  setTimeout(ensureButton, 0);
  setTimeout(ensureButton, 250);
  setTimeout(ensureButton, 1000);
}
