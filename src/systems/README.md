# Sistemas do PJ Lite

Esta pasta é a nova fronteira modular do projeto. Cada sistema terá sua própria pasta e, conforme a migração avançar, seus componentes, modelos de dados, armazenamento específico, tema e integrações (como PDF) serão movidos para dentro dela.

## Sistemas ativos

- `dragonbane/`
- `dnd5e/`
- `fabulaUltima/`
- `somDasSeis/`

## Sistemas planejados

- `skyfall/`
- `tormenta20/`
- `ordemParanormal/`
- `3det/`
- `guerraDosTronos/`

O arquivo `registry.js` concentra a lista de sistemas ativos e planejados. Sistemas planejados ficam com `enabled: false` até existir uma implementação utilizável.

## Migração

O `PJLiteApp.jsx` ainda contém boa parte da implementação legada. A migração deve ser gradual para evitar regressões:

1. mover código compartilhado para `src/shared/`;
2. extrair Dragonbane primeiro;
3. repetir o padrão em D&D 5e, Fabula Ultima e O Som das Seis;
4. só então adicionar os novos sistemas usando a arquitetura modular.

O PDF do Dragonbane já serve como primeiro exemplo de recurso pertencente ao próprio sistema em `dragonbane/pdf/`.
