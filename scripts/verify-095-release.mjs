import { readFile } from 'node:fs/promises';

const [app, html, pkgText, ci, schema] = await Promise.all([
  readFile('src/PJLiteApp.jsx', 'utf8'),
  readFile('index.html', 'utf8'),
  readFile('package.json', 'utf8'),
  readFile('.github/workflows/ci.yml', 'utf8'),
  readFile('supabase/schema.sql', 'utf8'),
]);

const pkg = JSON.parse(pkgText);
const checks = [
  [pkg.version === '0.9.5-alpha.0', 'package.json deve declarar 0.9.5-alpha.0'],
  [app.includes("versao: '0.9.5v Alpha'"), 'UPDATE_LOG deve conter 0.9.5v Alpha'],
  [app.includes('PJ LITE 0.9.5 RELEASE'), 'build deve conter marcador da release 0.9.5'],
  [html.includes('0.9.5v Alpha'), 'index.html deve anunciar 0.9.5v Alpha'],
  [ci.includes('PJ Lite 0.9.5v Alpha'), 'CI deve publicar snapshot 0.9.5v Alpha'],
  [schema.includes('on conflict on constraint group_members_pkey do nothing;'), 'schema base deve conter a correção de entrada em grupo'],
];

const failed = checks.filter(([ok]) => !ok).map(([, message]) => message);
if (failed.length) {
  throw new Error('Verificação 0.9.5 falhou:\n- ' + failed.join('\n- '));
}
console.log('✓ Release 0.9.5 e schema de grupos verificados.');
