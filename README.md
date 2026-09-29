# LiteTester1 — PJ Lite React Preview

**Versão atual da prévia:** 0.8.0v Alpha

Ambiente isolado para evoluir e validar o PJ Lite antes de qualquer migração do `pjlite.vercel.app` definitivo.

## Estado atual

A prévia React/Vite está funcional e modularizada por sistema:

- React/ReactDOM são empacotados pelo Vite, sem Babel no navegador.
- JSZip e LZ-String são dependências NPM.
- O CSS legado continua em `src/pjlite.css`; `src/theme-polish.css` funciona como camada final de revisão de contraste e consistência entre os temas.
- Dragonbane, D&D 5.5e, Fabula Ultima, O Som das Seis e 3DeT Victory possuem módulos próprios em `src/systems/`.
- Skyfall, Tormenta20, Ordem Paranormal e Guerra dos Tronos continuam reservados no registro para implementação futura.
- Dragonbane exporta usando o template real em `public/pdfs/dragonbane-template.pdf`.
- D&D 5.5e possui ficha responsiva, abas de Ficha & Combate, Recursos, Magias e painel dinâmico da classe/subclasse.
- 3DeT Victory entra na 0.8.0 com ficha de personagem modular: retrato opcional, Arquétipo, Kit opcional, Conceito, Escala, Pontos/XP, P/H/R, PA/PM/PV, 12 Perícias padrão clicáveis, Perícias personalizadas, Especializações separadas, FA/FD, Vantagens, Desvantagens, Técnicas, Inventário por raridade e Anotações.
- A ficha 3DeT já participa de saves, autosave, histórico, backup, importação, filtros e Ficha Chat. Ela também possui tema próprio preto/amarelo, tratamento específico para modo escuro/mobile e guia dedicado dentro da mesma janela de Guias e Tutoriais. Exportação PDF será tratada em uma etapa própria.
- Os temas Padrão, Clássico DB, D&D, Fabula Ultima, O Som das Seis, 3DeT Victory, Modo Escuro e Personalizado passam por uma camada comum de revisão visual para evitar texto ilegível, fundos claros residuais e contraste inconsistente.
- O CI executa verificação estrutural, verificação funcional do 3DeT, auditoria dos temas e o build em cada push/PR para `main`.

## Estrutura principal

```text
src/
├─ PJLiteApp.jsx
├─ main.jsx
├─ pjlite.css
├─ theme-polish.css
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
   ├─ somDasSeis/
   │  └─ components/
   │     ├─ CharacterEditor.jsx
   │     └─ ThreatEditor.jsx
   └─ 3det/
      ├─ data.js
      ├─ chat.js
      ├─ 3det-theme.css
      ├─ integration.js
      └─ components/
         └─ CharacterEditor.jsx

scripts/
├─ verify-project.mjs
├─ verify-3det.mjs
└─ verify-themes.mjs

public/
└─ pdfs/
   ├─ dragonbane-template.pdf
   ├─ dnd5e-template.pdf
   ├─ FU_Ficha_de_personagemV2.pdf
   └─ som-das-seis-template.pdf
```

## Comandos

```bash
npm install
npm run dev
npm run verify
npm run build
npm run check
```

`npm run verify` executa a verificação estrutural geral, a verificação funcional do 3DeT Victory e a auditoria de integração dos temas. `npm run check` executa essas verificações e depois o build Vite.

## Validação antes da migração definitiva

A prévia já serve para desenvolvimento e testes, mas a promoção para o projeto definitivo deve acontecer somente depois de uma rodada final de compatibilidade. Pontos ainda recomendados:

1. adicionar testes E2E/smoke para criar, salvar, reabrir, importar e exportar fichas dos cinco sistemas;
2. remover trechos legados/duplicados que ainda permanecem em componentes-base durante a transição;
3. empacotar dependências ainda carregadas externamente, como Tailwind, fontes e `pdf-lib`, reduzindo dependência de CDN;
4. manter uma migração segura para as chaves antigas de armazenamento antes de qualquer renomeação;
5. validar backup/importação, Ficha Chat, temas, modo escuro, mobile e PDF em navegadores diferentes;
6. fazer um backup do projeto oficial antes da troca de domínio/deploy.

## Política da prévia

O `litetester1` continua sendo o laboratório. O projeto oficial não deve ser substituído automaticamente. A decisão de promover a prévia será tomada somente após a revisão funcional final e testes de regressão.

## Código aberto e contato

O PJ Lite continua sendo um projeto gratuito e de código aberto. Para acessar o código, estudar a implementação, adaptar algo ou colaborar, entre em contato com Nick Queijo pelo **Telegram @ralseibaiano** ou **Discord inabakaoru** para receber a orientação e o repositório corretos da versão atual.
