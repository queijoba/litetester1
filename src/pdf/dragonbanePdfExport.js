import { fillDragonbanePdf } from './dragonbanePdfMap.js';
import {
  DRAGONBANE_PDF_PAGE,
  DRAGONBANE_PDF_BACKGROUNDS,
  DRAGONBANE_PDF_FIELDS
} from './dragonbaneTemplateData.js';

const STORAGE_KEY = 'dragonbane_saved_characters';
const PDFLIB_CDN = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
const BUTTON_ID = 'pjlite-dragonbane-pdf-export';

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

function normalizeBase64(value) {
  let clean = String(value ?? '').trim();

  const comma = clean.indexOf(',');
  if (/^data:/i.test(clean) && comma >= 0) clean = clean.slice(comma + 1);

  if (/%[0-9A-F]{2}/i.test(clean)) {
    try { clean = decodeURIComponent(clean); } catch {}
  }

  clean = clean
    .replace(/\s+/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  // Os recursos internos podem estar divididos em arquivos no meio de um
  // bloco Base64. Por isso, padding só pode ser calculado DEPOIS de todas as
  // partes terem sido remontadas.
  clean = clean.replace(/=+$/g, '');

  const remainder = clean.length % 4;
  if (remainder === 1) throw new Error('Dados Base64 inválidos.');
  if (remainder) clean += '='.repeat(4 - remainder);

  return clean;
}

function base64Bytes(value) {
  const clean = normalizeBase64(value);
  if (!clean) return new Uint8Array(0);

  let binary;
  try {
    binary = atob(clean);
  } catch (error) {
    console.error('[PJ Lite PDF] Base64 inválido:', { length: clean.length, ending: clean.slice(-12) });
    throw new Error('Não foi possível decodificar um recurso do PDF. Atualize a página e tente novamente.');
  }

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function backgroundBytes(parts) {
  // Os arquivos p1_*.js e p2_*.js são pedaços consecutivos da MESMA string
  // Base64, não imagens Base64 independentes. Decodificar cada pedaço antes de
  // remontá-los quebra quando a divisão cai no meio de um grupo de 4 caracteres.
  const joined = (Array.isArray(parts) ? parts : [parts])
    .map(part => String(part ?? '').replace(/\s+/g, ''))
    .join('');
  return base64Bytes(joined);
}

async function buildEmbeddedTemplate(PDFLib) {
  const doc = await PDFLib.PDFDocument.create();
  const form = doc.getForm();
  const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
  const textColor = PDFLib.rgb(0.168627, 0.145098, 0.117647);
  const checkColor = PDFLib.rgb(0.121569, 0.364706, 0.321569);
  const pages = [];

  for (let i = 0; i < DRAGONBANE_PDF_BACKGROUNDS.length; i++) {
    const page = doc.addPage([DRAGONBANE_PDF_PAGE.width, DRAGONBANE_PDF_PAGE.height]);
    const imageBytes = backgroundBytes(DRAGONBANE_PDF_BACKGROUNDS[i]);
    const image = await doc.embedJpg(imageBytes);
    page.drawImage(image, { x: 0, y: 0, width: DRAGONBANE_PDF_PAGE.width, height: DRAGONBANE_PDF_PAGE.height });
    pages.push(page);
  }

  for (const def of DRAGONBANE_PDF_FIELDS) {
    const page = pages[def.page];
    if (!page) continue;

    if (def.type === 'checkbox') {
      const field = form.createCheckBox(def.name);
      field.addToPage(page, {
        x: def.x, y: def.y, width: def.width, height: def.height,
        borderWidth: 0,
        textColor: checkColor
      });
      continue;
    }

    const field = form.createTextField(def.name);
    if (def.multiline) field.enableMultiline();
    field.setFontSize(def.fontSize || 8);
    field.addToPage(page, {
      x: def.x, y: def.y, width: def.width, height: def.height,
      borderWidth: 0,
      textColor,
      font
    });
  }

  return doc;
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
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function decodeImageDataUrl(value) {
  const commaIndex = value.indexOf(',');
  if (commaIndex < 0) return null;
  const header = value.slice(0, commaIndex);
  const body = value.slice(commaIndex + 1);

  if (/;base64/i.test(header)) {
    return {
      bytes: base64Bytes(body),
      kind: /image\/png/i.test(header) ? 'png' : 'jpg'
    };
  }

  // Data URLs também podem usar percent-encoding em vez de Base64.
  try {
    const decoded = decodeURIComponent(body);
    const bytes = new TextEncoder().encode(decoded);
    return { bytes, kind: /image\/png/i.test(header) ? 'png' : 'jpg' };
  } catch {
    return null;
  }
}

async function imageFromSource(source) {
  if (!source || typeof source !== 'string') return null;
  const value = source.trim();

  if (/^data:image\/(png|jpeg|jpg)/i.test(value)) {
    try {
      return decodeImageDataUrl(value);
    } catch (error) {
      console.warn('[PJ Lite PDF] Retrato inválido; PDF será gerado sem a imagem.', error);
      return null;
    }
  }

  if (/^(https?:|blob:)/i.test(value)) {
    try {
      const response = await fetch(value, /^https?:/i.test(value) ? { mode: 'cors' } : undefined);
      if (!response.ok) return null;
      const type = response.headers.get('content-type') || '';
      if (!/image\/(png|jpeg|jpg)/i.test(type)) return null;
      return { bytes: new Uint8Array(await response.arrayBuffer()), kind: /png/i.test(type) ? 'png' : 'jpg' };
    } catch (error) {
      console.warn('[PJ Lite PDF] Não foi possível buscar o retrato; PDF será gerado sem a imagem.', error);
      return null;
    }
  }

  return null;
}

async function addPortrait(doc, item, PDFLib) {
  let loaded = null;
  try {
    loaded = await imageFromSource(item?.bio?.imagem);
  } catch (error) {
    console.warn('[PJ Lite PDF] Falha ao preparar o retrato; PDF continuará sem imagem.', error);
    return false;
  }

  if (!loaded) return false;

  try {
    const image = loaded.kind === 'png' ? await doc.embedPng(loaded.bytes) : await doc.embedJpg(loaded.bytes);
    const page = doc.getPages()[0];

    const box = { x: 36.5, y: 656.5, width: 76, height: 90 };
    page.drawRectangle({
      x: box.x, y: box.y, width: box.width, height: box.height,
      color: PDFLib.rgb(0.965, 0.945, 0.86)
    });

    const scale = Math.min(box.width / image.width, box.height / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    page.drawImage(image, {
      x: box.x + (box.width - width) / 2,
      y: box.y + (box.height - height) / 2,
      width,
      height
    });
    return true;
  } catch (error) {
    console.warn('[PJ Lite PDF] Não foi possível inserir o retrato; PDF continuará sem imagem.', error);
    return false;
  }
}

async function exportPdf() {
  document.activeElement?.blur?.();
  await sleep(1650);
  const item = currentDragonbane(false);
  if (!item) throw new Error('Não encontrei a ficha Dragonbane atual. Salve a ficha e tente novamente.');

  const PDFLib = await loadPdfLib();
  const doc = await buildEmbeddedTemplate(PDFLib);
  const form = doc.getForm();

  fillDragonbanePdf(form, item);
  const portraitAdded = await addPortrait(doc, item, PDFLib);

  try {
    const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
    form.updateFieldAppearances(font);
  } catch {}

  const bytes = await doc.save({ useObjectStreams: false, updateFieldAppearances: false });
  download(bytes, item);
  return { item, portraitAdded };
}

function isDragonbaneEditorOpen() {
  const structural = [
    document.querySelector('.db-sheet'),
    document.querySelector('.db-logo'),
    document.querySelector('.db-brand'),
    document.querySelector('.db-layout')
  ].filter(Boolean);
  if (structural.some(visible)) return true;
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
    button.title = 'Baixar esta ficha Dragonbane em PDF editável já preenchido.';
    button.style.background = 'rgba(4,120,87,.92)';
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
        toast(
          portraitAdded
            ? `PDF editável de ${item?.bio?.nome || 'Dragonbane'} baixado com retrato.`
            : `PDF editável de ${item?.bio?.nome || 'Dragonbane'} baixado.`,
          'success'
        );
      } catch (error) {
        console.error('[PJ Lite PDF]', error);
        toast(String(error?.message || 'Não foi possível gerar o PDF.'), 'error');
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
  setInterval(ensureButton, 750);
  setTimeout(ensureButton, 0);
  setTimeout(ensureButton, 250);
  setTimeout(ensureButton, 1000);
}
