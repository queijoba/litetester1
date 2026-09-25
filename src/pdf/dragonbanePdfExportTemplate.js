import { fillDragonbanePdf } from './dragonbanePdfMap.js';

const STORAGE_KEY = 'dragonbane_saved_characters';
const PDFLIB_CDN = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
const TEMPLATE_URL = '/pdfs/dragonbane-template.pdf?v=20260925';
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
  toast.timer = setTimeout(() => { el.style.opacity = '0'; }, 4600);
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
    script.onload = () => window.PDFLib?.PDFDocument
      ? resolve(window.PDFLib)
      : reject(new Error('pdf-lib não iniciou.'));
    script.onerror = () => reject(new Error('Não foi possível carregar o gerador de PDF.'));
    document.head.appendChild(script);
  });

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
  const t = Date.parse(item?.meta?.updatedAt || item?.meta?.createdAt || '');
  return Number.isFinite(t) ? t : 0;
}

function currentDragonbane(requireVisibleMatch = false) {
  const chars = readCharacters().filter(
    x => (x?.system || 'dragonbane') === 'dragonbane' && (x?.type || 'pc') === 'pc'
  );
  if (!chars.length) return null;

  const values = new Set(
    Array.from(document.querySelectorAll('input,textarea'))
      .filter(visible)
      .map(x => String(x.value || '').trim())
      .filter(Boolean)
  );

  const matches = chars.filter(x => x?.bio?.nome && values.has(String(x.bio.nome).trim()));
  if (requireVisibleMatch && !matches.length) return null;
  return [...(matches.length ? matches : chars)].sort((a, b) => time(b) - time(a))[0] || null;
}

function filename(item) {
  const name = String(item?.bio?.nome || 'Personagem')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'Personagem';
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
  setTimeout(() => URL.revokeObjectURL(url), 8000);
}

async function loadRealTemplate(PDFLib) {
  const response = await fetch(TEMPLATE_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Não foi possível abrir o PDF modelo (${response.status}).`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 5 || String.fromCharCode(...bytes.slice(0, 5)) !== '%PDF-') {
    throw new Error('O arquivo de modelo não é um PDF válido.');
  }

  const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = doc.getForm();
  const fieldNames = form.getFields().map(field => field.getName());

  if (!fieldNames.includes('nome') || !fieldNames.includes('nome_pagina_2')) {
    throw new Error('O PDF modelo encontrado não é a ficha editável esperada do PJ Lite.');
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
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.92));
    if (!pngBlob) return null;
    return new Uint8Array(await pngBlob.arrayBuffer());
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
    console.warn('[PJ Lite PDF] Retrato indisponível; o PDF continuará sem a imagem.', error);
    return null;
  }
}

async function addPortrait(doc, item, PDFLib) {
  const loaded = await imageFromSource(item?.bio?.imagem);
  if (!loaded) return false;

  try {
    const image = loaded.kind === 'png'
      ? await doc.embedPng(loaded.bytes)
      : await doc.embedJpg(loaded.bytes);

    const page = doc.getPages()[0];
    const box = { x: 38, y: 658, width: 73, height: 87 };

    page.drawRectangle({
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      color: PDFLib.rgb(0.965, 0.941, 0.835)
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
    console.warn('[PJ Lite PDF] Não foi possível inserir o retrato; o PDF continuará sem imagem.', error);
    return false;
  }
}

async function exportPdf() {
  document.activeElement?.blur?.();
  await sleep(900);

  const item = currentDragonbane(false);
  if (!item) {
    throw new Error('Não encontrei a ficha Dragonbane atual. Salve a ficha e tente novamente.');
  }

  const PDFLib = await loadPdfLib();
  const { doc, form, regular } = await loadRealTemplate(PDFLib);

  fillDragonbanePdf(form, item);
  const portraitAdded = await addPortrait(doc, item, PDFLib);

  try {
    form.updateFieldAppearances(regular);
  } catch (error) {
    console.warn('[PJ Lite PDF] Não foi possível atualizar todas as aparências dos campos:', error);
  }

  const bytes = await doc.save({
    useObjectStreams: false,
    updateFieldAppearances: false
  });

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
    button.title = 'Baixar a ficha usando exatamente o PDF editável do PJ Lite como modelo.';
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
            ? `PDF de ${item?.bio?.nome || 'Dragonbane'} baixado no modelo correto, com retrato.`
            : `PDF de ${item?.bio?.nome || 'Dragonbane'} baixado no modelo correto.`,
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

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  addEventListener('resize', schedule, { passive: true });
  addEventListener('focus', schedule, { passive: true });
  setInterval(ensureButton, 750);
  setTimeout(ensureButton, 0);
  setTimeout(ensureButton, 250);
  setTimeout(ensureButton, 1000);
}
