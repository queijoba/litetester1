from pathlib import Path
import json, re, shutil

ROOT = Path('.')
SOURCE_DIR = ROOT / 'vitejs-vite-gxqvvkwn (1)'
SOURCE = SOURCE_DIR / 'index.html'

if not SOURCE.exists():
    raise SystemExit(f'Arquivo fonte não encontrado: {SOURCE}')

text = SOURCE.read_text(encoding='utf-8')

style_match = re.search(r'<style>(.*?)</style>', text, flags=re.S)
script_match = re.search(r'<script\s+type=["\']text/babel["\']>(.*?)</script>', text, flags=re.S)
head_match = re.search(r'<head>(.*?)</head>', text, flags=re.S)
body_match = re.search(r'<body([^>]*)>', text, flags=re.S)

if not all([style_match, script_match, head_match, body_match]):
    raise SystemExit('Não foi possível localizar <style>, script Babel, <head> ou <body>.')

css = style_match.group(1).strip() + '\n'
legacy_jsx = script_match.group(1)

legacy_jsx = re.sub(
    r'\n\s*const root = ReactDOM\.createRoot\(document\.getElementById\(["\']root["\']\)\);\s*\n\s*root\.render\(<App\s*/>\);\s*$',
    '\n',
    legacy_jsx,
    flags=re.S,
)

app_jsx = """import * as React from 'react';
import * as ReactDOM from 'react-dom';
import JSZip from 'jszip';
import LZString from 'lz-string';

""" + legacy_jsx.strip() + "\n\nexport default App;\n"

head = head_match.group(1)
head = re.sub(r'\s*<style>.*?</style>\s*', '\n', head, flags=re.S)
for pattern in [
    r'\s*<!-- React & ReactDOM -->\s*<script[^>]*react@18[^>]*></script>\s*<script[^>]*react-dom@18[^>]*></script>\s*',
    r'\s*<!-- Babel for JSX -->\s*<script[^>]*@babel/standalone[^>]*></script>\s*',
    r'\s*<!-- JSZip for exporting ZIP files -->\s*<script[^>]*jszip[^>]*></script>\s*',
    r'\s*<!-- LZ-String for text code compression -->\s*<script[^>]*lz-string[^>]*></script>\s*',
]:
    head = re.sub(pattern, '\n', head, flags=re.S | re.I)

body_attrs = body_match.group(1).strip()
body_open = '<body' + ((' ' + body_attrs) if body_attrs else '') + '>'

index_html = f"""<!DOCTYPE html>
<html lang=\"pt-BR\">
<head>{head}</head>
{body_open}
    <div id=\"root\"></div>
    <script type=\"module\" src=\"/src/main.jsx\"></script>
</body>
</html>
"""

src = ROOT / 'src'
src.mkdir(exist_ok=True)
(ROOT / 'public').mkdir(exist_ok=True)

old_public = SOURCE_DIR / 'public'
if old_public.exists():
    for child in old_public.iterdir():
        dest = ROOT / 'public' / child.name
        if child.is_dir():
            if dest.exists(): shutil.rmtree(dest)
            shutil.copytree(child, dest)
        else:
            shutil.copy2(child, dest)

(ROOT / 'index.html').write_text(index_html, encoding='utf-8')
(src / 'pjlite.css').write_text(css, encoding='utf-8')
(src / 'PJLiteApp.jsx').write_text(app_jsx, encoding='utf-8')
(src / 'main.jsx').write_text("""import { createRoot } from 'react-dom/client';
import './pjlite.css';
import PJLiteApp from './PJLiteApp.jsx';

createRoot(document.getElementById('root')).render(<PJLiteApp />);
""", encoding='utf-8')

package = {
    'name': 'litetester1',
    'private': True,
    'version': '0.7.0-react-migration.1',
    'type': 'module',
    'scripts': {
        'dev': 'vite',
        'build': 'vite build',
        'preview': 'vite preview',
    },
    'dependencies': {
        'jszip': '^3.10.1',
        'lz-string': '^1.5.0',
        'react': '^19.2.8',
        'react-dom': '^19.2.8',
    },
    'devDependencies': {
        '@vitejs/plugin-react': '^6.1.0',
        'vite': '^8.2.2',
    },
}
(ROOT / 'package.json').write_text(json.dumps(package, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
(ROOT / 'vite.config.js').write_text("""import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
});
""", encoding='utf-8')
(ROOT / '.gitignore').write_text("node_modules/\ndist/\n.vercel/\n*.log\n", encoding='utf-8')
(ROOT / 'README.md').write_text("""# LiteTester1 — PJ Lite React Migration

Ambiente isolado para migrar o PJ Lite de um HTML monolítico com Babel no navegador para uma aplicação React empacotada por Vite.

## Estado desta etapa

- React/ReactDOM agora vêm do `package.json` e do bundle do Vite.
- Babel no navegador foi removido.
- JSZip e LZ-String agora são dependências NPM.
- O CSS legado foi movido para `src/pjlite.css`.
- O aplicativo legado foi preservado em `src/PJLiteApp.jsx` para priorizar compatibilidade nesta primeira etapa.
- Tailwind ainda usa CDN temporariamente; será migrado depois da validação de paridade.

## Comandos

```bash
npm install
npm run dev
npm run build
```

A modularização por sistema (Dragonbane, D&D 5e, Fabula Ultima e O Som das Seis) é a próxima etapa, depois que esta base estiver validada.
""", encoding='utf-8')

if SOURCE_DIR.exists():
    shutil.rmtree(SOURCE_DIR)
zip_path = ROOT / 'vitejs-vite-gxqvvkwn.zip'
if zip_path.exists():
    zip_path.unlink()

print('Migração etapa 1 gerada com sucesso.')
print('index.html:', (ROOT/'index.html').stat().st_size, 'bytes')
print('PJLiteApp.jsx:', (src/'PJLiteApp.jsx').stat().st_size, 'bytes')
print('pjlite.css:', (src/'pjlite.css').stat().st_size, 'bytes')
