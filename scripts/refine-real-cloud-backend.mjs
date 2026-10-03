import { readFile, writeFile } from 'node:fs/promises';

const appPath = 'src/PJLiteApp.jsx';
const marker = 'PJ LITE REAL CLOUD BACKEND V1';
let app = await readFile(appPath, 'utf8');

if (app.includes(marker)) {
  console.log('Real Cloud: already applied.');
  process.exit(0);
}

const importAnchor = "import LZString from 'lz-string';";
if (!app.includes(importAnchor)) throw new Error('Real Cloud: import anchor not found.');
app = app.replace(importAnchor, `${importAnchor}\nimport RealCloudPanel from './cloud/RealCloudPanel.jsx';\n// ${marker}`);

const startMarker = '                            <div className="pjlite-cloud-compact no-print">';
const endMarker = '                            {showCloudModal &&';
const start = app.indexOf(startMarker);
const end = app.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error('Real Cloud: painel Conta & Nuvem não encontrado.');

const realPanel = `                            <RealCloudPanel\n                                savedChars={savedChars}\n                                savedThreats={savedThreats}\n                                setSavedChars={setSavedChars}\n                                setSavedThreats={setSavedThreats}\n                                showToast={showToast}\n                            />\n\n`;

app = app.slice(0, start) + realPanel + app.slice(end);

// A interface antiga de demonstração continua no bundle apenas como fallback interno,
// mas fica desconectada do autosync para não gravar cópias locais paralelas.
app = app.replace(
  "                    setSaveStatus('saved');\n                    queueCloudPreviewSync();",
  "                    setSaveStatus('saved');"
);

await writeFile(appPath, app, 'utf8');
console.log('✓ Conta Lite real conectada ao painel aprovado.');
