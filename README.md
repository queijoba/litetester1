# LiteTester1 — PJ Lite React Migration

Ambiente isolado para evoluir o PJ Lite antes da migração definitiva do `pjlite.vercel.app`.

## Estado atual

A primeira prova de conceito da migração foi concluída com sucesso:

- React/ReactDOM são carregados pelo projeto Vite, sem Babel no navegador.
- JSZip e LZ-String são dependências NPM.
- O CSS legado foi separado em `src/pjlite.css`.
- O aplicativo legado permanece em `src/PJLiteApp.jsx` para preservar compatibilidade enquanto a modularização é feita aos poucos.
- Dragonbane, D&D 5e, Fabula Ultima e O Som das Seis continuam disponíveis.
- A exportação PDF de Dragonbane usa o template editável real em `public/pdfs/dragonbane-template.pdf`.
- O exportador de PDF do Dragonbane já foi isolado em `src/features/pdf/dragonbane/`, criando um padrão para futuros sistemas.
- O repositório possui CI para verificar a estrutura essencial e validar o build em cada push/PR.

## Estrutura desta fase

```text
src/
├─ PJLiteApp.jsx              # aplicação monolítica preservada durante a transição
├─ main.jsx                   # bootstrap React
├─ pjlite.css                 # estilos atuais
└─ features/
   └─ pdf/
      └─ dragonbane/
         ├─ export.js
         └─ map.js

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

## Próximas etapas

A prioridade agora é modularizar o núcleo sem quebrar compatibilidade:

1. separar infraestrutura compartilhada (armazenamento, temas, backup/importação e Ficha Chat);
2. extrair Dragonbane para `src/systems/dragonbane/` e usá-lo como padrão;
3. migrar D&D 5e, Fabula Ultima e O Som das Seis gradualmente;
4. substituir dependências temporárias via CDN (Tailwind e pdf-lib) por dependências empacotadas;
5. adicionar testes de interface automatizados quando a estrutura dos sistemas estiver estabilizada;
6. somente depois promover a arquitetura React para o projeto definitivo.

O `litetester1` continua sendo o laboratório. O projeto oficial não deve ser substituído até a conclusão dos testes de compatibilidade.
