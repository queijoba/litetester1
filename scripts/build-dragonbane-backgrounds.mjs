import { mkdir, writeFile } from 'node:fs/promises';
import p11 from '../src/pdf/bg/p1_1.js';
import p12 from '../src/pdf/bg/p1_2.js';
import p13 from '../src/pdf/bg/p1_3.js';
import p21 from '../src/pdf/bg/p2_1.js';
import p22 from '../src/pdf/bg/p2_2.js';
import p23 from '../src/pdf/bg/p2_3.js';
import p24 from '../src/pdf/bg/p2_4.js';

const pages = [
  [p11, p12, p13],
  [p21, p22, p23, p24]
];

function cleanBase64(value) {
  return String(value ?? '')
    .replace(/^data:[^,]+,/i, '')
    .replace(/\s+/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .replace(/[^A-Za-z0-9+/=]/g, '');
}

function looksLikeJpeg(buffer) {
  return buffer.length > 4 &&
    buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff &&
    buffer[buffer.length - 2] === 0xff && buffer[buffer.length - 1] === 0xd9;
}

function decodePage(parts, pageNumber) {
  const joined = Buffer.from(cleanBase64(parts.join('')), 'base64');
  if (looksLikeJpeg(joined)) return joined;

  const split = Buffer.concat(parts.map(part => Buffer.from(cleanBase64(part), 'base64')));
  if (looksLikeJpeg(split)) return split;

  throw new Error(`Não foi possível reconstruir o fundo JPEG da página ${pageNumber}. joined=${joined.length}, split=${split.length}`);
}

await mkdir('public/generated', { recursive: true });

for (let i = 0; i < pages.length; i++) {
  const jpeg = decodePage(pages[i], i + 1);
  await writeFile(`public/generated/dragonbane-page${i + 1}.jpg`, jpeg);
  console.log(`[PJ Lite] Dragonbane página ${i + 1}: ${jpeg.length} bytes`);
}
