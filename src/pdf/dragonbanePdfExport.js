import { fillDragonbanePdf } from './dragonbanePdfMap.js';
import {
  DRAGONBANE_PDF_PAGE,
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
  } catch {
    return [];
  }
}

function time(item) {
  const t = Date.parse(item?.meta?.updatedAt || item?.meta?.createdAt || '');
  return Number.isFinite(t) ? t : 0;
}

function currentDragonbane(requireVisibleMatch = false) {
  const chars = readCharacters().filter(x => (x?.system || 'dragonbane') === 'dragonbane' && (x?.type || 'pc') === 'pc');
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

function ascii(value) {
  return String(value ?? '')
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, '...')
    .replace(/•/g, '-')
    .replace(/[^\u0020-\u007E\u00A0-\u00FF]/g, '');
}

const SKILL_LABELS = {
  acrobatismo: 'Acrobatismo',
  blefe: 'Blefe',
  caca_e_pesca: 'Caça e Pesca',
  cura: 'Cura',
  encontrar: 'Encontrar',
  equitacao: 'Equitação',
  evasao: 'Evasão',
  furtividade: 'Furtividade',
  idiomas: 'Idiomas',
  manufatura: 'Manufatura',
  marinharia: 'Marinharia',
  mitos_e_lendas: 'Mitos e Lendas',
  natacao: 'Natação',
  percepcao: 'Percepção',
  performance: 'Performance',
  permuta: 'Permuta',
  persuasao: 'Persuasão',
  prestidigitacao: 'Prestidigitação',
  saber_de_feras: 'Saber de Feras',
  sobrevivencia: 'Sobrevivência',
  arcos: 'Arcos',
  bestas: 'Bestas',
  briga: 'Briga',
  cajados: 'Cajados',
  espadas: 'Espadas',
  estilingues: 'Estilingues',
  facas: 'Facas',
  lancas: 'Lanças',
  machados: 'Machados',
  martelos: 'Martelos'
};

function humanize(value) {
  if (SKILL_LABELS[value]) return SKILL_LABELS[value];
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function drawText(page, font, text, x, y, size, color, options = {}) {
  const safe = ascii(text);
  if (!safe) return;
  page.drawText(safe, {
    x, y, size, font, color,
    maxWidth: options.maxWidth,
    lineHeight: options.lineHeight
  });
}

function drawBar(page, fontBold, text, x, y, width, colors) {
  page.drawRectangle({ x, y, width, height: 17, color: colors.dark });
  page.drawRectangle({ x, y, width: 4, height: 17, color: colors.red });
  drawText(page, fontBold, text, x + 10, y + 4.2, 8.6, colors.paper);
}

function drawOutline(page, x, y, width, height, colors, borderWidth = 0.8) {
  page.drawRectangle({
    x, y, width, height,
    color: colors.panel,
    borderColor: colors.line,
    borderWidth
  });
}

function drawPageFrame(page, colors) {
  const { width, height } = DRAGONBANE_PDF_PAGE;
  page.drawRectangle({ x: 0, y: 0, width, height, color: colors.paper });
  page.drawRectangle({
    x: 18, y: 18, width: width - 36, height: height - 36,
    borderColor: colors.dark, borderWidth: 1.5
  });
  page.drawRectangle({
    x: 22, y: 22, width: width - 44, height: height - 44,
    borderColor: colors.gold, borderWidth: 0.5
  });
}

function drawPageOne(page, fonts, colors) {
  const { regular, bold, title } = fonts;

  drawPageFrame(page, colors);
  page.drawRectangle({ x: 24, y: 770, width: 547, height: 46, color: colors.dark });
  drawText(page, title, 'DRAGONBANE', 35, 785, 22, colors.paper);
  drawText(page, regular, 'FICHA DE PERSONAGEM - PJ LITE', 36, 775, 6.7, colors.gold);

  // Retrato
  drawOutline(page, 36, 656.5, 76, 90, colors, 1.2);
  drawText(page, bold, 'RETRATO', 53, 697, 8, colors.muted);

  // Identidade
  const identityLabels = [
    ['NOME DO PERSONAGEM', 126, 740], ['JOGADOR', 395, 740],
    ['ANCESTRALIDADE', 126, 709], ['PROFISSÃO', 250, 709],
    ['IDADE', 372, 709], ['FRAQUEZA', 419, 709],
    ['APARÊNCIA', 126, 678]
  ];
  identityLabels.forEach(([label, x, y]) => drawText(page, bold, label, x, y, 6.7, colors.muted));

  drawBar(page, bold, 'ATRIBUTOS E RECURSOS', 28, 620, 539, colors);
  const attrs = [
    ['FOR', 55.61], ['CON', 146.82], ['AGL', 238.03],
    ['INT', 329.24], ['VON', 420.46], ['CAR', 511.67]
  ];
  attrs.forEach(([label, x]) => drawText(page, bold, label, x + 3, 613, 7.5, colors.dark));

  const resourceLabels = [
    ['DANO BÔNUS FOR', 38], ['DANO BÔNUS AGL', 176.82],
    ['MOVIMENTO', 315.64], ['LIMITE DE SOBRECARGA', 454.46]
  ];
  resourceLabels.forEach(([label, x]) => drawText(page, bold, label, x, 540, 6.2, colors.muted));

  drawBar(page, bold, 'PERÍCIAS', 28, 470, 168, colors);
  drawText(page, bold, 'AV', 30, 461.5, 5.5, colors.muted);
  drawText(page, bold, 'T', 43, 461.5, 5.5, colors.muted);
  drawText(page, bold, 'VALOR', 168, 461.5, 5.5, colors.muted);

  drawBar(page, bold, 'ARMAS - PERÍCIAS', 213, 470, 168, colors);
  drawText(page, bold, 'AV', 216, 461.5, 5.5, colors.muted);
  drawText(page, bold, 'T', 229, 461.5, 5.5, colors.muted);
  drawText(page, bold, 'VALOR', 354, 461.5, 5.5, colors.muted);

  drawBar(page, bold, 'STATUS', 398, 470, 169, colors);
  drawText(page, bold, 'PONTOS DE VIDA', 405, 437, 7.2, colors.red);
  drawText(page, regular, 'ATUAL', 428, 426, 5.5, colors.muted);
  drawText(page, regular, 'MÁX.', 500, 426, 5.5, colors.muted);
  drawText(page, bold, 'PONTOS DE DETERMINAÇÃO', 405, 380, 7.2, colors.teal);
  drawText(page, regular, 'ATUAL', 428, 369, 5.5, colors.muted);
  drawText(page, regular, 'MÁX.', 500, 369, 5.5, colors.muted);
  drawText(page, bold, 'TESTES DE MORTE', 405, 355, 6.8, colors.dark);
  drawText(page, regular, 'SUCESSOS', 438, 355, 5.4, colors.muted);
  drawText(page, regular, 'FALHAS', 438, 344, 5.4, colors.muted);
  drawText(page, regular, 'DESCANSO', 405, 329, 5.5, colors.muted);

  // Rótulos automáticos das perícias
  DRAGONBANE_PDF_FIELDS.forEach(def => {
    if (def.page !== 0 || def.type !== 'text') return;
    let match = def.name.match(/^pericia_(?!av_|treinada_)(.+)$/);
    if (match) {
      drawText(page, regular, humanize(match[1]), 55, def.y + 2.5, 6.5, colors.ink, { maxWidth: 108 });
      return;
    }
    match = def.name.match(/^arma_pericia_(?!av_|treinada_)(.+)$/);
    if (match) {
      drawText(page, regular, humanize(match[1]), 241, def.y + 2.5, 6.5, colors.ink, { maxWidth: 105 });
    }
  });

  drawBar(page, bold, 'PERÍCIAS SECUNDÁRIAS', 28, 178, 168, colors);
  drawText(page, bold, 'AV', 30, 169.5, 5.5, colors.muted);
  drawText(page, bold, 'NOME', 46, 169.5, 5.5, colors.muted);
  drawText(page, bold, 'ATR', 144, 169.5, 5.5, colors.muted);
  drawText(page, bold, 'VAL', 170, 169.5, 5.5, colors.muted);

  drawBar(page, bold, 'COMBATE E EQUIPAMENTOS', 213, 305, 168, colors);
  drawText(page, bold, 'ARMADURA', 222, 287, 6.5, colors.muted);
  drawText(page, bold, 'VAL', 345, 287, 5.5, colors.muted);
  drawText(page, regular, 'Revés', 222, 261, 5.4, colors.muted);
  drawText(page, bold, 'ELMO', 222, 239, 6.5, colors.muted);
  drawText(page, bold, 'VAL', 345, 239, 5.5, colors.muted);
  drawText(page, regular, 'Revés', 222, 213, 5.4, colors.muted);

  drawBar(page, bold, 'ARMAS / ESCUDOS', 213, 178, 168, colors);
  drawText(page, regular, 'NOME', 282, 171, 5.2, colors.muted);
  drawText(page, regular, 'EMP', 222, 151, 5, colors.muted);
  drawText(page, regular, 'ALC', 244, 151, 5, colors.muted);
  drawText(page, regular, 'DANO', 271, 151, 5, colors.muted);
  drawText(page, regular, 'DUR', 299, 151, 5, colors.muted);
  drawText(page, regular, 'TRAÇOS', 322, 151, 5, colors.muted);

  drawBar(page, bold, 'INVENTÁRIO', 398, 305, 169, colors);
  for (let i = 0; i < 10; i++) {
    const y = 284 - i * 10.5;
    drawText(page, regular, String(i + 1).padStart(2, '0'), 406, y, 5.2, colors.muted);
  }

  drawBar(page, bold, 'MEMENTO', 398, 171, 169, colors);
  drawBar(page, bold, 'ITENS MINÚSCULOS', 398, 136, 169, colors);
  drawText(page, bold, 'OURO', 407, 75, 5.8, colors.goldDark);
  drawText(page, bold, 'PRATA', 463, 75, 5.8, colors.muted);
  drawText(page, bold, 'COBRE', 519, 75, 5.8, colors.red);

  drawText(page, regular, 'PJ Lite - exportação editável', 29, 29, 5.5, colors.muted);
  drawText(page, regular, 'Dragonbane é propriedade de seus respectivos autores e editoras.', 355, 29, 5.0, colors.muted, { maxWidth: 210 });
}

function cardPosition(index) {
  const col = index % 3;
  const row = Math.floor(index / 3);
  return {
    x: 24 + col * 185.76,
    y: 631 - row * 84,
    width: 176,
    height: 78
  };
}

function drawPageTwo(page, fonts, colors) {
  const { regular, bold, title } = fonts;
  drawPageFrame(page, colors);

  page.drawRectangle({ x: 24, y: 770, width: 547, height: 46, color: colors.dark });
  drawText(page, title, 'DRAGONBANE', 35, 788, 18, colors.paper);
  drawText(page, bold, 'HABILIDADES E MAGIAS', 380, 789, 10, colors.gold);
  drawText(page, regular, 'PERSONAGEM', 31, 754, 6.2, colors.muted);

  for (let i = 0; i < 24; i++) {
    const n = String(i + 1).padStart(2, '0');
    const pos = cardPosition(i);
    drawOutline(page, pos.x, pos.y, pos.width, pos.height, colors, 0.7);
    page.drawRectangle({ x: pos.x, y: pos.y + pos.height - 15, width: pos.width, height: 15, color: colors.dark });
    drawText(page, bold, `CARTÃO ${n}`, pos.x + 7, pos.y + pos.height - 10.5, 5.8, colors.paper);
    drawText(page, regular, 'HAB', pos.x + 18, pos.y + pos.height - 22, 5, colors.muted);
    drawText(page, regular, 'MAG', pos.x + 101, pos.y + pos.height - 22, 5, colors.muted);
    drawText(page, regular, 'NOME', pos.x + 7, pos.y + pos.height - 36, 5, colors.muted);
    drawText(page, regular, 'FV/NV', pos.x + 138, pos.y + pos.height - 46, 4.8, colors.muted);
  }

  drawText(page, regular, 'PJ Lite - exportação editável', 29, 29, 5.5, colors.muted);
}

function addEditableFields(doc, pages, fonts, colors) {
  const form = doc.getForm();
  const { regular } = fonts;

  for (const def of DRAGONBANE_PDF_FIELDS) {
    const page = pages[def.page];
    if (!page) continue;

    if (def.type === 'checkbox') {
      const field = form.createCheckBox(def.name);
      field.addToPage(page, {
        x: def.x,
        y: def.y,
        width: def.width,
        height: def.height,
        borderColor: colors.teal,
        backgroundColor: colors.field,
        borderWidth: 0.7
      });
      continue;
    }

    const field = form.createTextField(def.name);
    if (def.multiline) field.enableMultiline();
    field.setFontSize(def.fontSize || 8);
    field.addToPage(page, {
      x: def.x,
      y: def.y,
      width: def.width,
      height: def.height,
      borderColor: colors.line,
      backgroundColor: colors.field,
      borderWidth: 0.45,
      textColor: colors.ink,
      font: regular
    });
  }

  return form;
}

async function buildEditableTemplate(PDFLib) {
  const doc = await PDFLib.PDFDocument.create();
  const fonts = {
    regular: await doc.embedFont(PDFLib.StandardFonts.Helvetica),
    bold: await doc.embedFont(PDFLib.StandardFonts.HelveticaBold),
    title: await doc.embedFont(PDFLib.StandardFonts.TimesRomanBold)
  };
  const colors = {
    paper: PDFLib.rgb(0.965, 0.941, 0.835),
    panel: PDFLib.rgb(0.985, 0.972, 0.91),
    field: PDFLib.rgb(1, 0.997, 0.965),
    dark: PDFLib.rgb(0.105, 0.155, 0.19),
    teal: PDFLib.rgb(0.12, 0.35, 0.32),
    red: PDFLib.rgb(0.70, 0.14, 0.16),
    gold: PDFLib.rgb(0.86, 0.70, 0.35),
    goldDark: PDFLib.rgb(0.55, 0.40, 0.15),
    ink: PDFLib.rgb(0.18, 0.15, 0.12),
    muted: PDFLib.rgb(0.38, 0.41, 0.43),
    line: PDFLib.rgb(0.58, 0.54, 0.45)
  };

  const page1 = doc.addPage([DRAGONBANE_PDF_PAGE.width, DRAGONBANE_PDF_PAGE.height]);
  const page2 = doc.addPage([DRAGONBANE_PDF_PAGE.width, DRAGONBANE_PDF_PAGE.height]);
  drawPageOne(page1, fonts, colors);
  drawPageTwo(page2, fonts, colors);
  const form = addEditableFields(doc, [page1, page2], fonts, colors);

  return { doc, form, fonts, colors };
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
      color: PDFLib.rgb(0.985, 0.972, 0.91)
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
  await sleep(1650);

  const item = currentDragonbane(false);
  if (!item) throw new Error('Não encontrei a ficha Dragonbane atual. Salve a ficha e tente novamente.');

  const PDFLib = await loadPdfLib();
  const { doc, form, fonts } = await buildEditableTemplate(PDFLib);

  fillDragonbanePdf(form, item);
  const portraitAdded = await addPortrait(doc, item, PDFLib);

  try {
    form.updateFieldAppearances(fonts.regular);
  } catch (error) {
    console.warn('[PJ Lite PDF] Não foi possível atualizar todas as aparências dos campos:', error);
  }

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
