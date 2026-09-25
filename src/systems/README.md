# Sistemas do PJ Lite

Esta pasta é a fronteira modular do projeto. Cada sistema possui sua própria pasta e os editores visuais das fichas ativas já foram retirados do antigo bloco monolítico de `PJLiteApp.jsx`.

## Sistemas ativos

- `dragonbane/`
- `dnd5e/`
- `fabulaUltima/`
- `somDasSeis/`

## Estrutura atual

Os modelos visuais ficam dentro do próprio sistema:

```text
systems/
├─ dragonbane/
│  ├─ components/Editor.jsx
│  └─ pdf/
├─ dnd5e/
│  └─ components/
│     ├─ CharacterEditor.jsx
│     └─ ThreatEditor.jsx
├─ fabulaUltima/
│  └─ components/
│     ├─ CharacterEditor.jsx
│     └─ ThreatEditor.jsx
└─ somDasSeis/
   └─ components/
      ├─ CharacterEditor.jsx
      └─ ThreatEditor.jsx
```

Isso permite revisar o desenho de uma ficha sem procurar seu JSX no meio das fichas dos outros sistemas.

O núcleo compartilhado — dashboard, temas, importação/exportação, armazenamento, histórico, Ficha Chat e parte dos modelos/normalizações — continua em `PJLiteApp.jsx` durante a transição. Os editores recebem temporariamente um escopo de compatibilidade; esse acoplamento será reduzido à medida que dados e utilitários forem migrados para módulos compartilhados ou para o sistema correspondente.

## Sistemas planejados

- `skyfall/`
- `tormenta20/`
- `ordemParanormal/`
- `3det/`
- `guerraDosTronos/`

O arquivo `registry.js` concentra a lista de sistemas ativos e planejados. Sistemas planejados permanecem com `enabled: false` até existir uma implementação utilizável.

## Próximas etapas da migração

1. manter os editores visuais independentes;
2. mover modelos, normalizadores e regras específicas para `data/` e `logic/` de cada sistema;
3. mover infraestrutura realmente compartilhada para `src/shared/`;
4. separar estilos específicos por sistema quando os próximos redesigns forem feitos;
5. adicionar novos sistemas usando o mesmo padrão, sem voltar a aumentar o arquivo central.

O PDF do Dragonbane já é um exemplo de integração pertencente ao próprio sistema em `dragonbane/pdf/`.
