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
- Navegação principal em **três abas**, como em D&D e Skyfall: **Ficha**, **Habilidades** e **Magias**. Em Ficha, o celular mantém Perfil, Perícias e Combate/Equipamento como subtelas.
- Mantido o armazenamento legado `habilidadesFeiticos`. O editor identifica apenas os nomes oficiais inequívocos já usados nos modelos como inata, heroica, feitiço ou truque; registros indefinidos seguem em **Outros** para classificação manual. O texto integral antigo não é descartado nem regravado até o jogador editar.
- A **Ficha Chat** passa a separar as quatro categorias; a **exportação PDF** usa os mesmos cartões do modelo original e inclui o tipo no título, além da escola e grau quando possível.
- O PDF editável possui **24 cartões**: o editor apresenta aviso quando o personagem exceder esse limite. Mais cartões exigem um modelo futuro com páginas adicionais; não foram prometidos.
- Testes automatizados cobrem classificação, seis ancestralidades, registro original imutável, magia, ficha chat, PDF e adaptação mobile.

## Segunda rodada no LiteTester — preservação da identidade visual

O jogador aprovou a aparência anterior da ficha. Esta rodada **não muda** o logotipo Dragonbane, o retrato, os medallhões de atributos, as colunas principais, a fonte e a textura de pergaminho do PJLite.

Os novos painéis usam os mesmos elementos gráficos da ficha clássica:
- títulos **verde-esmeralda** com filetes e marcadores em losango;
- cartões em **pergaminho creme com moldura esmeralda** e recortes assimétricos;
- botões **vermelho-escuros**, respeitando as classes originais de adição;
- categorias recolhíveis para preservar espaço nas colunas;
- barra de navegação mobile com tons de pergaminho e destaque vermelho;
- compatibilidade explícita com os temas escuro e personalizado existentes.

Foi implementada uma função de renomeação atômica que fixa a categoria reconhecida de registros antigos quando seu nome começa a ser editado. Ao mover uma habilidade para outra categoria, essa seção abre automaticamente. Os controles de origem, custo, escola, preparação, Ficha Chat e PDF permanecem funcionais.

Validação: pipeline GitHub Actions aprovado no ramo de testes; a publicação do LiteTester depende de disponibilidade de cota da Vercel e **não implica alteração do site PJLite oficial**.

## Terceira rodada — interface em três abas

A navegação usa **Ficha**, **Habilidades** e **Magias** em computadores e dispositivos móveis, inspirada na organização de D&D e Skyfall, mantendo a marca, as cores e o pergaminho originais de Dragonbane. Habilidades reúne recursos inatos, heroicos e anotações não classificadas; Magias reúne feitiços e truques. O texto explicativo introdutório e o aviso genérico de compatibilidade foram retirados da ficha; permanece somente um aviso quando se ultrapassa o limite de 24 cartões do modelo PDF.

A página Ficha mantém identificação, atributos, perícias, combate e inventário. Os painéis de recursos são reutilizados por ambas as novas abas e preservam o mesmo array persistente. Mover uma habilidade entre categorias navega para a aba correspondente, sem apagar campos. O LiteTester foi validado no GitHub Actions; a publicação na Vercel depende da liberação do limite diário, e não foram feitos commits no projeto oficial.

## Recomendações futuras
- Catálogo opcional de feitiços e habilidades heroicas pesquisáveis, com filtros por escola, grau e profissão e resumos redigidos especificamente para o PJLite.
- Painel para contar o limite de feitiços preparados e validar acesso às escolas.
- Continuação automática do PDF se houver mais de 24 registros; hoje a interface avisa o limite.
- Teste visual com usuários em aparelho Android pequeno para ajustar densidade do novo grimório.

PJLite é projeto independente feito por fãs, sem endosso da Free League/Tria Editora. As regras originais permanecem nos livros e não são reproduzidas integralmente neste documento.
