# Templates PDF do PJ Lite

Templates atualmente ativos:

- `dragonbane-template.pdf`
- `dnd5e-template.pdf`
- `FU_Ficha_de_personagemV2.pdf`
- `som-das-seis-template.pdf`
- `3det-template.pdf`

## Como adicionar um novo template

1. O PDF deve ser editável (AcroForm) sempre que possível.
2. Faça upload usando exatamente o nome esperado pelo sistema.
3. O PJ Lite inspeciona os campos do formulário e valida se o template corresponde ao sistema.
4. O mapeamento fica dentro de `src/systems/<sistema>/pdf/`.
5. Depois da validação, o botão `📄 Baixar PDF` é ativado na ficha.

## Observações

- Fabula Ultima usa agora `FU_Ficha_de_personagemV2.pdf`, uma ficha editável de 3 páginas com 187 campos AcroForm e retrato editável na primeira página. O exportador preenche perfil, laços, atributos, condições, recursos, equipamentos, classes, poderes heroicos, anotações, feitiços e rituais conforme os espaços disponíveis no modelo.
- O Som das Seis usa a ficha editável enviada como referência. Esse PDF não possui um campo próprio para retrato, portanto o exportador preenche os dados da ficha sem inserir a foto.
- 3DeT Victory usa `3det-template.pdf`, modelo A4 horizontal de 1 página com 38 campos AcroForm. O exportador preenche identidade, P/H/R, PA/PM/PV, perícias e especializações, vantagens, desvantagens, técnicas, Kit, combate, inventário, anotações e retrato. Campos de nível/limites de consumíveis continuam editáveis manualmente porque a ficha digital atual ainda não rastreia esses valores de forma própria.
- Os PDFs continuam editáveis depois do download sempre que o leitor de PDF preservar AcroForm.
