# Templates PDF do PJ Lite

Templates atualmente ativos:

- `dragonbane-template.pdf`
- `dnd5e-template.pdf`

Templates preparados para a próxima integração:

- `fabula-ultima-template.pdf`
- `som-das-seis-template.pdf`

## Como adicionar um novo template

1. O PDF deve ser editável (AcroForm) sempre que possível.
2. Faça upload usando exatamente o nome esperado acima.
3. Depois do upload, o PJ Lite inspeciona os nomes dos campos do formulário.
4. O mapeamento do sistema é feito dentro de `src/systems/<sistema>/pdf/`.
5. Só depois da validação o botão `Baixar PDF` é ativado na ficha.

Fabula Ultima e O Som das Seis já possuem adaptadores de dados preparados. Os botões de exportação ainda não são ativados porque os templates definitivos ainda não foram enviados.
