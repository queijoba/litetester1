# Templates PDF do PJ Lite

Templates atualmente ativos:

- `dragonbane-template.pdf`
- `dnd5e-template.pdf`
- `fabula-ultima-template.pdf`
- `som-das-seis-template.pdf`

## Como adicionar um novo template

1. O PDF deve ser editável (AcroForm) sempre que possível.
2. Faça upload usando exatamente o nome esperado pelo sistema.
3. O PJ Lite inspeciona os campos do formulário e valida se o template corresponde ao sistema.
4. O mapeamento fica dentro de `src/systems/<sistema>/pdf/`.
5. Depois da validação, o botão `📄 Baixar PDF` é ativado na ficha.

## Observações

- Fabula Ultima usa o template de 11 páginas do PJ Lite e suporta retrato no próprio campo editável.
- O Som das Seis usa a ficha editável enviada como referência. Esse PDF não possui um campo próprio para retrato, portanto o exportador preenche os dados da ficha sem inserir a foto.
- Os PDFs continuam editáveis depois do download sempre que o leitor de PDF preservar AcroForm.
