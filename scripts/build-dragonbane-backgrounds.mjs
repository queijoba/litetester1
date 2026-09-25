import { mkdir, writeFile } from 'node:fs/promises';
import page1Base64 from '../src/pdf/dragonbaneBg1.small.js';
import page2Base64 from '../src/pdf/dragonbaneBg2.small.js';

const pages = [page1Base64, page2Base64];

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

await mkdir('public/generated', { recursive: true });

for (let i = 0; i < pages.length; i++) {
  const jpeg = Buffer.from(cleanBase64(pages[i]), 'base64');
  if (!looksLikeJpeg(jpeg)) {
    throw new Error(`O fundo JPEG compacto da página ${i + 1} está inválido (${jpeg.length} bytes).`);
  }
  await writeFile(`public/generated/dragonbane-page${i + 1}.jpg`, jpeg);
  console.log(`[PJ Lite] Dragonbane página ${i + 1}: ${jpeg.length} bytes`);
}
