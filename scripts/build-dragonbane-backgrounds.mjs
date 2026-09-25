import { mkdir, writeFile } from 'node:fs/promises';
import page1Full from '../src/pdf/dragonbaneBg1.js';
import page1Small from '../src/pdf/dragonbaneBg1.small.js';
import page2Small from '../src/pdf/dragonbaneBg2.small.js';

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

function firstValid(candidates, pageNumber) {
  for (const [name, encoded] of candidates) {
    const jpeg = Buffer.from(cleanBase64(encoded), 'base64');
    console.log(`[PJ Lite] Página ${pageNumber} candidato ${name}: ${jpeg.length} bytes; jpeg=${looksLikeJpeg(jpeg)}`);
    if (looksLikeJpeg(jpeg)) return jpeg;
  }
  throw new Error(`Nenhum fundo JPEG válido encontrado para a página ${pageNumber}.`);
}

await mkdir('public/generated', { recursive: true });

const page1 = firstValid([
  ['dragonbaneBg1.js', page1Full],
  ['dragonbaneBg1.small.js', page1Small]
], 1);
const page2 = firstValid([
  ['dragonbaneBg2.small.js', page2Small]
], 2);

await writeFile('public/generated/dragonbane-page1.jpg', page1);
await writeFile('public/generated/dragonbane-page2.jpg', page2);
console.log(`[PJ Lite] Fundos Dragonbane gerados: p1=${page1.length}, p2=${page2.length}`);
