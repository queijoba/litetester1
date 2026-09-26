import { fillDndPdf } from './map.js';

const STORAGE_KEY = 'dragonbane_saved_characters';
const PDFLIB_CDN = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
const PAKO_CDN = 'https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js';
const TEMPLATE_PARTS = [
  '/pdfs/dnd55-template.part1.b64?v=20260926',
  '/pdfs/dnd55-template.part2.b64?v=20260926',
  '/pdfs/dnd55-template.part3.b64?v=20260926',
  '/pdfs/dnd55-template.part4.b64?v=20260926',
  '/pdfs/dnd55-template.part5.b64?v=20260926',
];
const BUTTON_ID = 'pjlite-dnd55-pdf-export';

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
      maxWidth: '380px', padding: '10px 14px', borderRadius: '10px',
      color: '#fff', font: '700 12px system-ui,sans-serif',
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

function loadScript(src, marker, check) {
  if (check()) return Promise.resolve();
  const existing = document.querySelector(`script[data-${marker}="1"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      if (check()) return resolve();
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', () => reject(new Error(`Não foi possível carregar ${marker}.`)), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset[marker] = '1';
    script.onload = () => check() ? resolve() : reject(new Error(`${marker} não iniciou.`));
    script.onerror = () => reject(new Error(`Não foi possível carregar ${marker}.`));
    document.head.appendChild(script);
  });
}

async function loadPdfLib() {
  if (window.PDFLib?.PDFDocument) return window.PDFLib;
  if (!loadPdfLib.promise) {
    loadPdfLib.promise = loadScript(PDFLIB_CDN, 'pjlitePdflib', () => !!window.PDFLib?.PDFDocument)
      .then(() => window.PDFLib);
  }
  return loadPdfLib.promise;
}

function readCharacters() {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function time(item) {
  const value = Date.parse(item?.meta?.updatedAt || item?.meta?.createdAt || '');
  return Number.isFinite(value) ? value : 0;
}

function currentDnd(requireVisibleMatch = false) {
  const chars = readCharacters().filter(
    item => item?.system === 'dnd5e' && (item?.type || 'pc') === 'pc'
  );
  if (!chars.length) return null;

  const values = new Set(
    Array.from(document.querySelectorAll('input,textarea,select'))
      .filter(visible)
      .map(el => String(el.value || '').trim())
      .filter(Boolean)
  );

  const matches = chars.filter(item => item?.bio?.nome && values.has(String(item.bio.nome).trim()));
  if (requireVisibleMatch && !matches.length) return null;
  return [...(matches.length ? matches : chars)].sort((a, b) => time(b) - time(a))[0] || null;
}

function filename(item) {
  const name = String(item?.bio?.nome || 'Personagem')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'Personagem';
  return `PJ_Lite_DnD_5_5e_${name}.pdf`;
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

function base64ToBytes(base64) {
  const clean = base64.replace(/\s+/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function gunzipWithStream(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gunzip(bytes) {
  if ('DecompressionStream' in window) return gunzipWithStream(bytes);
  await loadScript(PAKO_CDN, 'pjlitePako', () => !!window.pako?.ungzip);
  return window.pako.ungzip(bytes);
}

async function loadTemplate(PDFLib) {
  const responses = await Promise.all(TEMPLATE_PARTS.map(url => fetch(url, { cache: 'no-store' })));
  responses.forEach((response, index) => {
    if (!response.ok) throw new Error(`Não foi possível abrir a parte ${index + 1} do PDF modelo (${response.status}).`);
  });

  const joined = (await Promise.all(responses.map(response => response.text()))).join('');
  const compressed = base64ToBytes(joined);
  const bytes = await gunzip(compressed);

  if (bytes.length < 5 || String.fromCharCode(...bytes.slice(0, 5)) !== '%PDF-') {
    throw new Error('O modelo de D&D baixado não é um PDF válido.');
  }

  const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = doc.getForm();
  const names = new Set(form.getFields().map(field => field.getName()));
  for (const required of ['retrato', 'nome', 'caracteristicas_classe', 'conjuracao_atributo', 'magia_30_notas']) {
    if (!names.has(required)) throw new Error('O PDF modelo encontrado não é a ficha editável D&D 5.5e esperada do PJ Lite.');
  }

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
    const context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.92));
    return png ? new Uint8Array(await png.arrayBuffer()) : null;
  } catch {
    return null;
  }
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
    console.warn('[PJ Lite D&D PDF] Retrato indisponível; o PDF continuará editável sem a imagem.', error);
    return null;
  }
}

async function addPortrait(doc, form, item) {
  const loaded = await imageFromSource(item?.bio?.imagem);
  if (!loaded) return false;

  try {
    const image = loaded.kind === 'png'
      ? await doc.embedPng(loaded.bytes)
      : await doc.embedJpg(loaded.bytes);
    form.getButton('retrato').setImage(image);
    return true;
  } catch (error) {
    console.warn('[PJ Lite D&D PDF] Não foi possível inserir o retrato no botão editável.', error);
    return false;
  }
}

async function exportPdf() {
  document.activeElement?.blur?.();
  await sleep(900);

  const item = currentDnd(false);
  if (!item) throw new Error('Não encontrei a ficha D&D 5.5e atual. Salve a ficha e tente novamente.');

  const PDFLib = await loadPdfLib();
  const { doc, form, regular } = await loadTemplate(PDFLib);

  fillDndPdf(form, item);
  try {
    form.updateFieldAppearances(regular);
  } catch (error) {
    console.warn('[PJ Lite D&D PDF] Algumas aparências de campos serão geradas pelo leitor de PDF.', error);
  }

  await addPortrait(doc, form, item);

  const bytes = await doc.save({
    useObjectStreams: false,
    updateFieldAppearances: false
  });

  download(bytes, item);
  return { item };
}

function isDndEditorOpen() {
  const structural = [
    document.querySelector('.dnd-v6-wrapper'),
    document.querySelector('.dnd-paper'),
    document.querySelector('.dnd-v3-sheet')
  ].filter(Boolean);
  if (structural.some(visible)) return true;
  return !!currentDnd(true);
}

function findToolbar() {
  const copy = Array.from(document.querySelectorAll('button')).find(
    button => visible(button) && /copiar\s*ficha/i.test((button.textContent || '').replace(/\s+/g, ' ').trim())
  );
  if (!copy) return null;

  const toolbar = copy.parentElement;
  if (!toolbar) return null;
  const buttons = Array.from(toolbar.querySelectorAll('button'));
  const hasZip = buttons.some(button => /^ZIP$/i.test((button.textContent || '').trim()));
  const hasSave = buttons.some(button => /salvar/i.test(button.textContent || ''));
  return hasZip && hasSave ? { copy, toolbar } : null;
}

function ensureButton() {
  let button = document.getElementById(BUTTON_ID);

  if (!isDndEditorOpen()) {
    button?.remove();
    return;
  }

  const found = findToolbar();
  if (!found) return;
  const { copy, toolbar } = found;

  if (!button) {
    button = document.createElement('button');
    button.id = BUTTON_ID;
    button.dataset.pjlitePdf = 'dnd5e';
    button.type = 'button';
    button.className = copy.className;
    button.textContent = '📄 PDF D&D';
    button.title = 'Baixar esta ficha no PDF editável D&D 5.5e / 2024 do PJ Lite.';
    button.style.background = 'rgba(146,38,16,.96)';
    button.style.whiteSpace = 'nowrap';
    button.style.border = '1px solid rgba(255,255,255,.28)';

    button.onclick = async () => {
      if (button.dataset.busy === '1') return;
      const original = button.textContent;
      button.dataset.busy = '1';
      button.disabled = true;
      button.textContent = '⏳ Gerando PDF...';

      try {
        const { item } = await exportPdf();
        toast(`PDF editável de ${item?.bio?.nome || 'D&D 5.5e'} baixado.`, 'success');
      } catch (error) {
        console.error('[PJ Lite D&D PDF]', error);
        toast(String(error?.message || 'Não foi possível gerar o PDF de D&D.'), 'error');
      } finally {
        button.dataset.busy = '0';
        button.disabled = false;
        button.textContent = original;
      }
    };
  }

  if (button.parentElement !== toolbar || button.previousElementSibling !== copy) {
    toolbar.insertBefore(button, copy.nextSibling);
  }
}

export function installDndPdfExport() {
  if (window.__pjliteDndPdfExportInstalled) return;
  window.__pjliteDndPdfExportInstalled = true;

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
  setInterval(ensureButton, 750);
  setTimeout(ensureButton, 0);
  setTimeout(ensureButton, 250);
  setTimeout(ensureButton, 1000);
}
