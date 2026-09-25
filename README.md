# LiteTester1 — PJ Lite React Preview

Ambiente isolado para evoluir e validar o PJ Lite antes de qualquer migração do `pjlite.vercel.app` definitivo.

## Estado atual

A prévia React/Vite está funcional e modularizada por sistema:

- React/ReactDOM são empacotados pelo Vite, sem Babel no navegador.
- JSZip e LZ-String são dependências NPM.
- O CSS legado continua em `src/pjlite.css`, enquanto sistemas novos podem ter estilos próprios.
- Dragonbane, D&D 5.5e, Fabula Ultima e O Som das Seis possuem módulos próprios em `src/systems/`.
- Skyfall, Tormenta20, Ordem Paranormal, 3D&T e Guerra dos Tronos estão reservados no registro para implementação futura.
- Dragonbane exporta usando o template real em `public/pdfs/dragonbane-template.pdf`.
- D&D 5.5e possui ficha responsiva, abas de Ficha & Combate, Recursos, Magias e painel dinâmico da classe/subclasse.
- A folha `src/systems/dnd5e/dnd-sheet-v7.css` contém o polimento mobile atual do D&D.
- O CI executa verificação estrutural e build em cada push/PR para `main`.

## Estrutura principal

```text
src/
├─ PJLiteApp.jsx
├─ main.jsx
├─ pjlite.css
└─ systems/
   ├─ registry.js
   ├─ dragonbane/
   │  ├─ components/
   │  │  └─ Editor.jsx
   │  └─ pdf/
   │     ├─ export.js
   │     └─ map.js
   ├─ dnd5e/
   │  ├─ classPanels.js
   │  ├─ dnd-sheet-v7.css
   │  └─ components/
   │     ├─ CharacterEditor.jsx
   │     ├─ CharacterEditorBase.jsx
   │     └─ ThreatEditor.jsx
   ├─ fabulaUltima/
   │  └─ components/
   │     ├─ CharacterEditor.jsx
   │     └─ ThreatEditor.jsx
   └─ somDasSeis/
      └─ components/
         ├─ CharacterEditor.jsx
         └─ ThreatEditor.jsx

public/
└─ pdfs/
   └─ dragonbane-template.pdf
```

## Comandos

```bash
npm install
npm run dev
npm run verify
npm run build
npm run check
```

`npm run check` executa a verificação estrutural e o build Vite.

## Validação antes da migração definitiva

A prévia já serve para desenvolvimento e testes, mas a promoção para o projeto definitivo deve acontecer somente depois de uma rodada final de compatibilidade. Pontos ainda recomendados:

1. adicionar testes E2E/smoke para criar, salvar, reabrir, importar e exportar fichas dos quatro sistemas;
2. remover trechos legados/duplicados que ainda permanecem em componentes-base durante a transição;
3. empacotar dependências ainda carregadas externamente, como Tailwind, fontes e `pdf-lib`, reduzindo dependência de CDN;
4. manter uma migração segura para as chaves antigas de armazenamento antes de qualquer renomeação;
5. validar backup/importação, Ficha Chat, temas, modo escuro, mobile e PDF em navegadores diferentes;
6. fazer um backup do projeto oficial antes da troca de domínio/deploy.

## Política da prévia

O `litetester1` continua sendo o laboratório. O projeto oficial não deve ser substituído automaticamente. A decisão de promover a prévia será tomada somente após a revisão funcional final e testes de regressão.
