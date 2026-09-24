# LiteTester1 — PJ Lite React Migration

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
