import { readFile, writeFile } from 'node:fs/promises';

const appPath = 'src/PJLiteApp.jsx';
const cssPath = 'src/pjlite.css';
const marker = 'PJ LITE HOME DESKTOP WIDE V1';

let app = await readFile(appPath, 'utf8');
let css = await readFile(cssPath, 'utf8');

if (app.includes(marker)) {
  console.log('Home desktop wide: already applied.');
  process.exit(0);
}

const oldShell = `                        <div className="max-w-5xl mx-auto mt-4 md:mt-10 p-4 animate-fade-in-up relative">`;
if (!app.includes(oldShell)) throw new Error('Home desktop wide: shell da Home não encontrado.');

const newShell = `                        {/* ${marker} */}\n                        <div style={getWindowStyle()} className="pjlite-home-shell max-w-[90rem] mx-auto mt-4 md:mt-8 p-4 md:p-5 xl:p-6 animate-fade-in-up relative">`;
app = app.replace(oldShell, newShell);

css += `\n/* ${marker} */\n.pjlite-home-shell{background:rgba(255,255,255,.96);border:1px solid rgba(148,163,184,.26);border-radius:22px;box-shadow:0 18px 52px rgba(15,23,42,.11);transition:background-color .2s ease,border-color .2s ease,box-shadow .2s ease}\n.theme-dark .pjlite-home-shell,body.theme-dark .pjlite-home-shell{background:rgba(17,24,39,.96);border-color:rgba(71,85,105,.72);box-shadow:0 18px 52px rgba(0,0,0,.28)}\n@media(max-width:720px){.pjlite-home-shell{border-radius:14px;padding:12px}}\n`;

await writeFile(appPath, app, 'utf8');
await writeFile(cssPath, css, 'utf8');
console.log('✓ Home ampliada para o mesmo porte das fichas e com bordas arredondadas.');
