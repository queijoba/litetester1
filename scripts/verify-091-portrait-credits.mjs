import { readFile } from 'node:fs/promises';

const must = (text, tokens, label) => {
  for (const token of tokens) {
    if (!text.includes(token)) throw new Error(`${label}: ausente ${token}`);
  }
};

const [db, app, threeDet] = await Promise.all([
  readFile('src/systems/dragonbane/pdf/export.js', 'utf8'),
  readFile('src/PJLiteApp.jsx', 'utf8'),
  readFile('src/systems/3det/integration.js', 'utf8'),
]);

must(db, [
  'PJ LITE 0.9.1 DRAGONBANE PORTRAIT FIX',
  "document.querySelectorAll('.db-portrait img')",
  'URL.createObjectURL(blob)',
  'page.drawImage(image',
  'form.removeField(portraitField)',
  'addPortrait(doc, form, item, PDFLib)',
], 'Dragonbane PDF');

must(app, [
  'PJ LITE 0.9.1 OFFICIAL MATERIAL CREDITS',
  'https://loja.capycat.games/produtos/skyfall-rpg-livro-basico-digital/',
  'https://jamboeditora.com.br/categoria/marcas/ordem-paranormal-2/',
  'Crédito editorial:',
], 'Guias Skyfall/Ordem');

must(threeDet, [
  'PJ LITE 0.9.1 3DET OFFICIAL MATERIAL',
  'https://jamboeditora.com.br/produto/3det-victory/',
  'Crédito editorial:',
], 'Guia 3DeT');

console.log('✓ Retrato do PDF Dragonbane e créditos/links oficiais verificados.');
