import { readFile, writeFile } from 'node:fs/promises';

const exportPath = 'src/systems/dragonbane/pdf/export.js';
const appPath = 'src/PJLiteApp.jsx';
const threeDetPath = 'src/systems/3det/integration.js';

const replaceOnce = (text, from, to, label) => {
  if (!text.includes(from)) throw new Error(`0.9.1 portrait/credits: marcador não encontrado (${label}).`);
  return text.replace(from, to);
};

let db = await readFile(exportPath, 'utf8');
if (!db.includes('PJ LITE 0.9.1 DRAGONBANE PORTRAIT FIX')) {
  const robustBlob = `async function blobToPngBytes(blob) {
  const canvasBytes = async (source, width, height, cleanup = null) => {
    try {
      const max = 1400;
      const scale = Math.min(1, max / Math.max(width, height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
      const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      cleanup?.();
      return pngBlob ? new Uint8Array(await pngBlob.arrayBuffer()) : null;
    } catch {
      cleanup?.();
      return null;
    }
  };

  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob);
      const result = await canvasBytes(bitmap, bitmap.width, bitmap.height, () => bitmap.close?.());
      if (result) return result;
    } catch {}
  }

  try {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    const loaded = await new Promise((resolve, reject) => {
      img.onload = () => resolve(true);
      img.onerror = reject;
      img.src = url;
    });
    if (!loaded) { URL.revokeObjectURL(url); return null; }
    return await canvasBytes(img, img.naturalWidth || img.width, img.naturalHeight || img.height, () => URL.revokeObjectURL(url));
  } catch {
    return null;
  }
}`;

  db = db.replace(/async function blobToPngBytes\(blob\) \{[\s\S]*?\n\}\n\nasync function imageFromSource/, `${robustBlob}\n\nasync function imageFromSource`);

  const robustPortrait = `function currentPortraitSource(item) {
  const live = Array.from(document.querySelectorAll('.db-portrait img')).find(visible);
  return live?.currentSrc || live?.src || item?.bio?.imagem || '';
}

async function addPortrait(doc, form, item, PDFLib) {
  const loaded = await imageFromSource(currentPortraitSource(item));
  if (!loaded) return false;

  try {
    const image = loaded.kind === 'png'
      ? await doc.embedPng(loaded.bytes)
      : await doc.embedJpg(loaded.bytes);

    const portraitField = form.getButton('retrato_imagem');
    try { portraitField.setImage(image); } catch {}

    const widget = portraitField.acroField?.getWidgets?.()?.[0];
    const rect = widget?.getRectangle?.();
    const page = doc.getPages()[0];
    if (page && rect && rect.width > 0 && rect.height > 0) {
      const inset = 2.5;
      const boxW = Math.max(1, rect.width - inset * 2);
      const boxH = Math.max(1, rect.height - inset * 2);
      const dims = image.scale(1);
      const scale = Math.min(boxW / dims.width, boxH / dims.height);
      const width = dims.width * scale;
      const height = dims.height * scale;

      page.drawRectangle({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        color: PDFLib.rgb(0.96, 0.93, 0.84),
      });
      page.drawImage(image, {
        x: rect.x + (rect.width - width) / 2,
        y: rect.y + (rect.height - height) / 2,
        width,
        height,
      });

      try { form.removeField(portraitField); } catch {}
    }
    return true;
  } catch (error) {
    console.warn('[PJ Lite Dragonbane PDF] Não foi possível inserir o retrato no PDF; os demais campos serão mantidos.', error);
    return false;
  }
}`;

  db = db.replace(/async function addPortrait\(doc, form, item\) \{[\s\S]*?\n\}\n\nasync function exportPdf/, `${robustPortrait}\n\nasync function exportPdf`);
  db = replaceOnce(db, 'const portraitAdded = await addPortrait(doc, form, item);', 'const portraitAdded = await addPortrait(doc, form, item, PDFLib);', 'chamada addPortrait');
  db = `/* PJ LITE 0.9.1 DRAGONBANE PORTRAIT FIX */\n${db}`;
  await writeFile(exportPath, db, 'utf8');
}

let app = await readFile(appPath, 'utf8');
if (!app.includes('PJ LITE 0.9.1 OFFICIAL MATERIAL CREDITS')) {
  const skyTail = `<div className="bg-amber-50 border border-amber-300 rounded p-4 text-xs"><strong>Mestre:</strong> a área de ameaças/PNJs usa Hierarquia, Arquétipo, Tipo, Tamanho, ND/XP, Recarga, ataques e habilidades para consulta rápida. O PJ Lite não substitui o Livro Básico.</div>`;
  const skyCredits = `${skyTail}<div className="p-4 bg-violet-50 border border-violet-300 rounded text-xs"><h3 className="font-title font-bold text-violet-950 mb-2">📚 Material oficial de Skyfall RPG</h3><p className="mb-3">O PJ Lite é uma ferramenta independente e não substitui o livro. Apoie o material oficial para regras completas, exemplos e conteúdo original.</p><a href="https://loja.capycat.games/produtos/skyfall-rpg-livro-basico-digital/" target="_blank" rel="noopener noreferrer" className="inline-block bg-violet-900 hover:bg-violet-950 text-white px-4 py-2 rounded font-bold text-xs">Comprar Skyfall RPG — Livro Básico Digital ↗</a></div><div className="bg-stone-100 border rounded p-4 text-xs"><strong>Crédito editorial:</strong> Skyfall RPG e seu material oficial pertencem aos respectivos autores e à CapyCat Games. A ficha do PJ Lite é uma adaptação independente para organização em mesa.</div>`;
  app = replaceOnce(app, skyTail, skyCredits, 'créditos Skyfall');

  const ordemTail = `<div className="bg-red-50 border border-red-200 rounded p-4 text-xs"><strong>Regras opcionais:</strong> NEX &amp; Experiência e Evolução por Patentes são controles separados para você usar apenas quando a campanha adotar essas variantes.</div>`;
  const ordemCredits = `${ordemTail}<div className="p-4 bg-red-50 border border-red-300 rounded text-xs"><h3 className="font-title font-bold text-red-950 mb-2">📚 Material oficial de Ordem Paranormal RPG</h3><p className="mb-3">O PJ Lite é uma ferramenta independente. Consulte e apoie o material oficial para regras completas, suplementos e atualizações.</p><a href="https://jamboeditora.com.br/categoria/marcas/ordem-paranormal-2/" target="_blank" rel="noopener noreferrer" className="inline-block bg-red-950 hover:bg-black text-white px-4 py-2 rounded font-bold text-xs">Ver Ordem Paranormal na Jambô ↗</a></div><div className="bg-stone-100 border rounded p-4 text-xs"><strong>Crédito editorial:</strong> Ordem Paranormal RPG e seu material oficial pertencem aos respectivos criadores e são publicados pela Jambô Editora. Esta ficha é uma adaptação independente no PJ Lite.</div>`;
  app = replaceOnce(app, ordemTail, ordemCredits, 'créditos Ordem');

  app = `/* PJ LITE 0.9.1 OFFICIAL MATERIAL CREDITS */\n${app}`;
  await writeFile(appPath, app, 'utf8');
}

let threeDet = await readFile(threeDetPath, 'utf8');
if (!threeDet.includes('PJ LITE 0.9.1 3DET OFFICIAL MATERIAL')) {
  const rulesBlock = `    <div class="rounded border border-amber-300 bg-amber-50 p-4">\n      <h3 class="mb-2 font-bold text-amber-950">ℹ️ Sobre regras</h3>`;
  const officialBlock = `    <!-- PJ LITE 0.9.1 3DET OFFICIAL MATERIAL -->\n    <div class="rounded border border-amber-400 bg-amber-50 p-4">\n      <h3 class="mb-2 font-bold text-amber-950">📚 Material oficial de 3DeT Victory</h3>\n      <p class="mb-3 text-xs">O PJ Lite é uma ferramenta independente e não substitui o livro. Consulte o material oficial para regras completas, exemplos e opções de personagem.</p>\n      <a href="https://jamboeditora.com.br/produto/3det-victory/" target="_blank" rel="noopener noreferrer" class="inline-block rounded bg-zinc-950 px-4 py-2 text-xs font-bold text-amber-300">Comprar 3DeT Victory na Jambô ↗</a>\n      <p class="mt-3 text-xs text-zinc-700"><strong>Crédito editorial:</strong> 3DeT Victory e seu material oficial pertencem aos respectivos autores e são publicados pela Jambô Editora. Esta ficha é uma adaptação independente no PJ Lite.</p>\n    </div>\n${rulesBlock}`;
  threeDet = replaceOnce(threeDet, rulesBlock, officialBlock, 'créditos 3DeT');
  await writeFile(threeDetPath, threeDet, 'utf8');
}

console.log('✓ Dragonbane: retrato PDF reforçado; Skyfall, 3DeT Victory e Ordem Paranormal: links oficiais e créditos adicionados.');
