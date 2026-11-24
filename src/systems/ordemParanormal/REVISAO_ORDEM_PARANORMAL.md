## Refinamento do diagrama de atributos e descrição — 24/11/2026

- A **Folha 1 · PDF** recebeu atributos em **arranjo radial de cinco círculos**, alinhados à estrutura do modelo editável do Drive: Agilidade no topo, Força à esquerda, Intelecto à direita, Presença embaixo à esquerda e Vigor embaixo à direita. O núcleo central é decorativo, com a identificação ATRIBUTOS.
- Cada valor é um input real que edita a propriedade de atributo compartilhada pela aba Agente, perícias, Defesa e exportação. Nenhuma imagem estática substitui os campos; teclado e leitores de tela continuam utilizáveis.
- Os anéis foram redesenhados em CSS (sem copiar as ilustrações oficiais) e adaptados para telas estreitas sem cortar os valores. A apresentação padrão do restante do PJLite não muda.
- A **Folha 2 · PDF** agora inclui o bloco **Descrição**, com Aparência, Personalidade, Histórico e Objetivo, todos editáveis. Campos novos são opcionais, guardados em `bio`, e não apagam `notas` nem alteram fichas existentes.
- Testes automatizados conferem disposição, responsividade, vínculos, persistência de descrições e compatibilidade com dados antigos.
- Publicar primeiro no LiteTester, após os testes; o definitivo só será atualizado com avaliação do usuário.

## Prévia visual da ficha — 24/11/2026 (LiteTester)

Referência visual principal conferida no Google Drive: **Ficha de Personagem Editável — Sobrevivendo ao Horror** (2 páginas; versão de Kyuu), preservando o papel da edição original. **Esta revisão altera a interface do PJLite, não substitui nem redesenha o PDF distribuído pelo proprietário.**

- Incluídas duas abas iniciais **Folha 1 · PDF** e **Folha 2 · PDF**, mantendo as abas detalhadas existentes: Agente, Perícias, Combate, Poderes & Rituais, Inventário e Evolução (opcional).
- **Folha 1**: identificação e retrato, atributos AGI/FOR/INT/PRE/VIG em círculos, PV/PE/SAN (ou PD, quando o modo opcional estiver ativo), cálculo da Defesa, Bloqueio, Esquiva, Deslocamento, Resistências, Proteção, Ataques e todas as 28 perícias. Treinamento, bônus, atributos, armas e recursos são editáveis diretamente nessa visualização.
- **Folha 2**: patente, NEX, prestígio, limite de itens e crédito, carga calculada, inventário, habilidades, poderes paranormais, DTs, rituais, anotações e acesso à progressão. Todos ligados aos mesmos dados da ficha e da biblioteca.
- Corrigido **Área** dos rituais: disponível na edição detalhada e na folha 2; persistido na normalização e incluído nos dados enviados ao exportador PDF. Arquivos legados sem esse campo continuam abrindo com valor vazio.
- Tela estreita: páginas empilhadas e tabelas com rolagem própria, evitando corte de colunas. Visual com papel claro, bordas e cabeçalhos da ficha, mantendo todos os temas da conta ao redor.
- Salvamento e nuvem: nenhuma tabela, endpoint ou chave de ficha alterada. Nenhuma atualização automática dos valores de PV/PE/SAN e habilidades, preservando regras opcionais e decisões do jogador.
- O botão antigo para exportar **PDF editável do modelo SaH** foi preservado. A nova visualização é uma referência de trabalho, não uma promessa de exportação pixel a pixel. O script `verify-ordem-pdf-pages.mjs` verifica estrutura, campos, compatibilidade, persistência e exportação.

**Status:** versão de teste no LiteTester; não liberar ao PJLite definitivo antes da avaliação do usuário.

# Ordem Paranormal — revisão de fontes e ficha PJLite

## Escopo confirmado (21/10/2026)
Atualização independente para uso com o **Ordem Paranormal RPG v1.3**, **Sobrevivendo ao Horror** e **Arquivos Secretos**.
**Nenhum conteúdo do playtest de Ordem Paranormal RPG 2 foi incluído.**

### Referências do Google Drive utilizadas
- Ordem Paranormal RPG — Livro Básico v1.3: cap. 1 e cap. 5, lista de rituais nas pp. 122–143.
- Sobrevivendo ao Horror: cap. 1, opções de personagem e novos rituais nas pp. 48–56; ficha de agente editável (referência de apresentação).
- Arquivos Secretos: os pacotes disponibilizados no Drive e com opções relevantes à ficha. As referências anteriores de #01, #03, #05, #06, #07 e #09 continuam; foram acrescentadas 19 opções jogáveis conferidas nas pp. 63–68 do #04. O #08 não foi catalogado porque seu PDF de regras não estava disponível na busca atual, e não houve extrapolação a partir do playtest.

## Funcionalidades desta revisão
- Ficha digital em estilo **registro confidencial**, em papel claro inspirado na ficha editável de Sobrevivendo ao Horror, com modo escuro alternável. As seções da ficha permanecem editáveis e responsivas.
- Biblioteca 📚 na barra superior, com pesquisa por nome, classe, trilha, origem, fonte e descrição.
- Filtros por fonte (cada livro/pacote), classe, NEX, elemento paranormal e círculo de ritual. Ações com requisitos incompatíveis exibem aviso e dependem de confirmação.
- Seleção de origem registra poder de origem e treina apenas perícias reconhecidas, sem reduzir pontuações já obtidas. Ao trocar origem, reverte apenas os valores automáticos que não tenham sido alterados pelo jogador.
- Seleção de trilha, habilidade, poder paranormal e ritual adiciona itens à seção adequada, evitando duplicatas, sem apagar modelos pessoais.
- Rituais de elemento variável precisam da escolha do elemento na biblioteca antes da inserção.
- Biblioteca de rituais de referência: **82 do Livro Básico**, **16 de Sobrevivendo ao Horror**, um de Arquivos Secretos #07 (Vampirismo), um de Arquivos Secretos #04 (Backup) — **100 referências de rituais**. Os capítulos originais continuam necessários para consultar custos, formas aprimoradas e regras completas.
- **19 novas referências de personagem do Arquivos Secretos #04**: 2 origens, 1 trilha, 12 habilidades, 3 poderes paranormais e 1 ritual.
- Mantido o preenchimento do formulário PDF existente `ordem-sah-template.pdf`, incluindo os campos de habilidades, rituais e número da página.

## Limitações deliberadas e pendências
- Resumos curtos e referências não substituem as descrições integrais dos livros da Jambô. Não há cópia extensiva nem transcrição de ilustrações oficiais.
- Poderes de algumas edições de Arquivos Secretos estão indexados parcialmente; novas páginas devem ser conferidas antes de serem acrescentadas.
- Os efeitos mecânicos complexos não alteram automaticamente PV, PE, SAN ou os dados de ataque. Ajustes específicos de rituais em versões Discente/Verdadeiro continuam manuais.
- O PDF exportado usa a ficha editável existente, e não uma captura literal das novas telas CSS.
- Testes automáticos asseguram que os catálogos não misturam playtest, que as 100 referências de rituais são válidas, que os efeitos não duplicam e que fichas salvas continuam compatíveis.

## Créditos
**PJLite é um projeto independente, feito por fãs, sem vínculo ou endosso dos titulares de Ordem Paranormal.** Os direitos sobre o universo, as regras e as obras originais pertencem a seus respectivos titulares, incluindo Rafael Lange e Jambô Editora. Cada resultado na biblioteca indica a fonte e a página ou o capítulo de consulta.

## Complemento no LiteTester — 22/10/2026

- Conferidos os PDFs dos pacotes **#01 v1.2, #03 v1.1, #04 v1.1, #05 v1.1, #06 v1.1, #07 v1.0 e #09 v1.0** no Drive do projeto.
- Acrescentadas **41 referências complementares** verificadas dos pacotes #01, #03, #05, #06 e #09, com resumos próprios, fonte, página e categoria, sem reproduzir o texto completo.
- Cobertura de origem/poder/trilha/ritual ampliada para **253 entradas**, das quais **103 rituais**, **41 origens** e **25 trilhas**.
- Trilhas recém-catalogadas: **Maledictólogo**, **Combatente Performático**, **Criptologista do Oculto**, **Monstruoso**, **Incursor** e **Piloto de Drone**. Habilidades por NEX são oferecidas individualmente apenas quando foi possível verificar seus nomes e patamares.
- Inserções a partir da biblioteca não concedem automaticamente todos os poderes de uma trilha. O jogador pode registrar os poderes compatíveis com seu NEX; o site informa fonte e página para consulta e edição.
- O filtro de elemento agora interpreta rituais híbridos, como Sangue/Conhecimento.
- **Pendências**: ampliar outros poderes e itens dos pacotes sem inventar entradas; revisar em tela a responsividade do novo catálogo. O pacote #08 não foi localizado nesta revisão e o #02 encontrado era uma HQ, portanto não se alegou cobertura completa.
- O escopo desta etapa é apenas o LiteTester. O PJLite oficial continua inalterado.
