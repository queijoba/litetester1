# Dragonbane — revisão da ficha do PJLite

Fonte principal consultada: `Dragonbane-Livro-de-Regras-v1.1.pdf`, Google Drive do projeto. Referências de paginação impressa: ancestralidades pp. 9–12, habilidades heroicas pp. 26/35–39 e magia pp. 57–69.

## Problema da ficha anterior
A coluna **Habilidades e Magias** guardava todos os recursos num único conjunto de cartões, com apenas `nome` e `fv_nvl`. Faltavam identificação de habilidades inatas da ancestralidade, heroicas da profissão, feitiços preparados, truques e escolas de magia.

## Revisão implementada
- Coluna reorganizada em **Inatas da Ancestralidade**, **Habilidades Heroicas**, **Feitiços**, **Truques Mágicos** e **Outros / Não Classificados**.
- Sugestões opcionais das 7 habilidades inatas distribuídas pelas 6 ancestralidades básicas (Marreco possui 2). Nada é acrescentado automaticamente, e a troca de ancestralidade não remove itens do jogador.
- Feitiços com **escola** (Geral/Animismo/Elementalismo/Mentalismo), **grau** (1–3), marcador **Preparado** e campo para PD/nível de poder.
- Truques em seção própria, identificados como **sempre preparados** e com custo padrão de **1 PD**.
- Campos de efeito, fonte, página e, para magia, tempo de conjuração, alcance e duração.
- Aba específica **Habilidades & Magia** no celular, preservando as demais abas (Perfil, Perícias, Combate/Equipamento).
- Mantido o armazenamento legado `habilidadesFeiticos`. O editor identifica apenas os nomes oficiais inequívocos já usados nos modelos como inata, heroica, feitiço ou truque; registros indefinidos seguem em **Outros** para classificação manual. O texto integral antigo não é descartado nem regravado até o jogador editar.
- A **Ficha Chat** passa a separar as quatro categorias; a **exportação PDF** usa os mesmos cartões do modelo original e inclui o tipo no título, além da escola e grau quando possível.
- O PDF editável possui **24 cartões**: o editor apresenta aviso quando o personagem exceder esse limite. Mais cartões exigem um modelo futuro com páginas adicionais; não foram prometidos.
- Testes automatizados cobrem classificação, seis ancestralidades, registro original imutável, magia, ficha chat, PDF e adaptação mobile.

## Recomendações futuras
- Catálogo opcional de feitiços e habilidades heroicas pesquisáveis, com filtros por escola, grau e profissão e resumos redigidos especificamente para o PJLite.
- Painel para contar o limite de feitiços preparados e validar acesso às escolas.
- Continuação automática do PDF se houver mais de 24 registros; hoje a interface avisa o limite.
- Teste visual com usuários em aparelho Android pequeno para ajustar densidade do novo grimório.

PJLite é projeto independente feito por fãs, sem endosso da Free League/Tria Editora. As regras originais permanecem nos livros e não são reproduzidas integralmente neste documento.
