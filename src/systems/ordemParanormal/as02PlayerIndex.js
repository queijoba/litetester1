// Hexatombe Parte 1: PDF v1.1 recebido, errata pp. 109–111 conferida.
// Índice editorial resumido, sem distribuição do PDF.
const fonte='Arquivos Secretos #02';
const b=(id,nome,tipo,pagina,desc,extra={})=>({id:'op-as02-'+id,nome,tipo,fonte,pagina:String(pagina),desc,custo:'',requisito:'',bibliotecaOrigem:'pj-op-official-index',...extra});
const h=(id,nome,pagina,classe,desc,requisito='',custo='')=>b(id,nome,'habilidade',pagina,desc,{classe,requisito,custo});
const p=(id,nome,pagina,elemento,desc,requisito='',custo='')=>b(id,nome,'poderParanormal',pagina,desc,{elemento,requisito,custo});
const i=(id,nome,pagina,desc)=>b(id,nome,'poderParanormal',pagina,desc,{elemento:'Intenção',custo:'0 PE',requisito:'Contato com a Coroa de Espinhos e gatilho específico',contextoEspecial:'Poder de Intenção: exige gatilho e aprovação do mestre'});
const r=(id,nome,pagina,elemento,desc,alcance,duracao,resistencia)=>b(id,nome,'ritual',pagina,desc,{elemento,circulo:2,execucao:'Padrão',alcance,duracao,resistencia,custo:'3 PE'});
export const AS02_PLAYER_ENTRIES=[
 h('revidar','Revidar Violento',41,'Geral','Segunda reação especial defensiva na rodada, apenas contra-ataque.','For 2 ou Agi 2'),
 h('predador-perfeito','Predador Perfeito',41,'Combatente','Ação padrão adicional por rodada para causar dano.','Veterano em Luta ou Pontaria e Sobrevivência','5 PE'),
 p('predador-sangue','Predador de Sangue',41,'Sangue','Memoriza um odor, com +1d20 para rastrear, perceber ou atacar a vítima; afinidade amplia alvos.','','3 PE'),
 h('corpo-fechado','Corpo Fechado',47,'Geral','Segunda reação especial de defesa na rodada, somente bloqueio.','Vig 2'),
 h('golpes-arena','Golpes de Arena',47,'Combatente','Após acertar golpe desarmado, permite golpe adicional ou manobra contra o mesmo alvo.','Treinado em Luta','2 PE'),
 p('pressao','Pressão Atmosférica',47,'Energia','Contra alvo agarrado, +1d10 Energia e possível atordoamento (Fortitude DT For); afinidade acrescenta condições.','','2 PE'),
 h('esquiva-tatica','Esquiva Tática',53,'Geral','Segunda reação especial defensiva na rodada, somente esquiva.','Agi 2'),
 h('assassinato-furtivo','Assassinato Furtivo',53,'Especialista','Ataque Furtivo ganha +1d6; mediante PE, usa d8 no lugar dos d6 furtivos.','Ataque Furtivo','2 PE'),
 p('zona','Zona dos Sussurros',53,'Conhecimento','Marca até três áreas; melhora ataques e preserva furtividade após ações chamativas. Consulte afinidade.','Conhecimento 1','3 PE'),
 h('palpite','Palpite Confiante',59,'Geral','Soma Intelecto ao teste baseado em Int ou Pre.','Int 2','1 PE'),
 h('especialista-matar','Especialista em Matar',59,'Especialista','Reduz ação de mirar/fintar; depois permite bônus de ataque ou dano, escalando em NEX 40% e 70%.','Treinado em Luta ou Pontaria; Perito','2–4 PE'),
 p('disparo','Disparo da Morte',59,'Morte','Aumenta margem de ameaça em 2 antes do ataque de disparo; afinidade ignora cobertura leve e 10 RD.','','2 PE'),
 h('puxar','Puxar pra Briga',71,'Geral','Ataque com corrente ou similar pode trazer o alvo para perto e dificultar ataques contra outros.','For 2 ou Agi 2; treinado em Luta; Especialista em Correntes','2 PE'),
 h('materiais','Prática com Materiais Ritualísticos',75,'Geral','Evita penalidade de dados por materiais específicos na primeira etapa da conjuração complexa.','Int 2; treinado em Ocultismo; conjurar rituais'),
 h('dominar','Dominar Habilidade Ritualística',75,'Ocultista','Adquire habilidade de outra trilha de ocultista conforme NEX, Versatilidade e número de aquisições.','Escolhido pelo Outro Lado'),
 h('terminal','Estágio Terminal',79,'Geral','Enquanto machucado, permite movimento extra uma vez por rodada.','Agi 2','2 PE'),
 h('kian','Kian Vai Nos Salvar',79,'Geral','Com aprovação do mestre, fé em Kian concede acesso temporário a ritual de Conhecimento; círculos ampliam em NEX 25% e 55%.','Pre 2; conjurar rituais; adorar Kian'),
 h('tratamento','Tratamento de Emergência',79,'Geral','Toque concede 2d10+10 PV temporários; perder todos deixa o alvo fraco. Uma aplicação por alvo na cena.','Int 2; treinado em Medicina','2 PE'),
 h('musica','Arte da Música Macabra',83,'Geral','Beneficia próximo dano, margem, ataque ou alcance de ser que ouça a música.','Pre 2; treinado em Artes e Ocultismo; conjurar rituais','2 PE'),
 h('sintonizacao-arma','Sintonização Mental com Arma',83,'Geral','No interlúdio, sintoniza arma para mudar atributo usado no ataque e dano até próximo interlúdio.','Int 2 ou Pre 2; treinado em Ocultismo; conjurar rituais','3 PE'),
 h('sintonizacao-protecao','Sintonização Mental com Proteção',83,'Geral','Sintoniza proteção para mudar atributo da Defesa e evitar condições ruins/terríveis de conjuração.','Int 2 ou Pre 2; treinado em Ocultismo; conjurar rituais','3 PE'),
 h('movimentacao','Movimentação Tática',87,'Geral','Duplica deslocamento na direção de cobertura ou inimigo.','For 2; treinado em Atletismo e Tática','1 PE'),
 h('instintos','Instintos Táticos',87,'Geral','Imune a desprevenido; ao causar dano, pode impedir furtividade do alvo contra você por uma rodada.','Pre 2; treinado em Percepção e Tática','2 PE'),
 h('marteladas','Marteladas',87,'Combatente','Ação completa de três ataques desarmados; danos acertados contam como uma instância para RD.','For 2; treinado em Luta; Artista Marcial','3 PE'),
 r('mapa','Mapa Sanguíneo',65,'Sangue','Localiza seres em raio de 1 km; aprimoramentos revelam saúde e, na forma verdadeira, sentimentos/intenções (errata p. 110).','Toque','Cena','Vontade evita'),
 r('capturar','Capturar Momento',66,'Morte','Símbolo registra imagens e sons em raio de 18 m; até três marcas. Aprimoramentos permitem explosão entrópica.','Médio','Permanente até dissipar','Fortitude nos aprimoramentos'),
 r('labirinto','Labirinto Mental',66,'Conhecimento','Impõe movimento aleatório à pessoa; nova resistência a cada turno.','Médio','1d4 rodadas','Vontade evita'),
 r('rajada','Rajada Caótica',67,'Energia','Raio de 8d6 Energia; formas avançadas aumentam dados, e a verdadeira permite repetir durante a cena.','Médio','Instantânea','Reflexos reduz à metade'),
 i('intencao-digno','Prove-se digno (Intenção)',94,'Obedecer à entidade permite reação para sucesso automático em teste, uma vez na mesma cena. Identificado pelo subtítulo da página.'),
 i('intencao-dor','Filho da Dor',95,'Após três ferimentos de pelo menos 5 de dano cada, reação concede RD 25 com perda de PV por turno.'),
 i('intencao-silencio','Sabor do Silêncio',95,'Gatilho ligado a sangue de ser machucado; melhora dano e margem e pode impor silêncio em crítico.'),
 i('intencao-caminho','Novo Caminho',95,'Testemunhar uma morte permite canalizar intenções para recuperar PV de ser próximo.'),
 i('intencao-primal','Pesadelo Primal',95,'Reação de ataque quando aliado protegido entra em morrendo, ou antes de perder a consciência nessa condição.')
];
const eq=[
 ['Água',20,'Recurso, categoria 0, 1 espaço.'],['Comida',20,'Recurso, categoria 0, 1 espaço.'],['Sucata',20,'Recurso, categoria 0, 1 espaço.'],
 ['Bandagem',21,'Categoria I, 0,5 espaço; cura 2d4+2 PV e remove sangrando.'],['Bússola',21,'Categoria I, 1 espaço; +5 em Sobrevivência para orientação.'],['Caixa de Ferramentas',21,'Categoria I, 2 espaços; +5 em Profissão quando aplicável.'],['Dose de Álcool',21,'Categoria I, 0,5 espaço; auxilia bandagem e higiene.'],['Incenso',21,'Categoria I, 0,5 espaço; recupera 1d4 PE em interlúdio, uma vez por dia.'],['Kit de Escalada',21,'Categoria I, 2 espaços; +5 em Atletismo para escalar.'],['Pedra de Amolar',21,'Categoria I, 0,5 espaço; prepara arma cortante ou perfurante para dano extra.'],
 ['Machado do Mutilador',41,'Amaldiçoado de Sangue; categoria IV, 1 espaço.'],['Elmo do Colosso',47,'Amaldiçoado de Energia; categoria III, 3 espaços; RD 10.'],['Manoplas do Colosso',47,'Amaldiçoado de Energia; categoria IV, 3 espaços; usadas em par.'],['Punhal X',53,'Amaldiçoado de Conhecimento; categoria IV, 1 espaço; crítico 19/x3.'],['Sniper Fantasma',59,'Amaldiçoado de Morte; categoria IV, 2 espaços; 2d10 balístico +3d4 Morte.'],['A Antena',67,'Amaldiçoado; categoria IV, 2 espaços; melhora DT e armazena ritual.'],['Encaixe',71,'Modificação para conectar armas compatíveis.'],['Acoplável',71,'Habilidade que permite unir e separar armas compatíveis.'],['Catalisador Sofisticado e Horrorizado',75,'Item paranormal; categoria III, 1 espaço; reserva de dados para dano, cura ou DT.']
];
const allies=[['Aguiar',41],['Dalmo Magno',47],['Jae-Yoon',53],['Kemi',59],['Labirinto',67],['Jasper',71],['Lena Viegas',75],['Maria',79],['Remi',83],['Tuco',87]];
const rules=[
 ['Regras do Hexatombe','5–11','Estrutura do ritual, estigmas, sacrifícios e desertores.'],['Ações dos participantes e melhorias de base','15–17','Fases do dia, descanso e construção.'],['Exploração e teste de jornada','18–19','Jornada coletiva de Sobrevivência, DT 20 ou maior conforme mestre.'],['Recursos e encontros','20–23','Sobrevivência, busca de recursos e encontros.'],['Intenções dos seis estigmas',24,'Recompensas de Desejo, Rancor, Obsessão, Culpa, Prazer e Orgulho.'],['Aliados em Perigo',24,'Regra opcional de risco para aliados em cenas perigosas, com 1d6.'],['O Dia Final',25,'Condições de encerramento do ritual e recompensa.'],['Poderes de Intenção','94–95','Contato com Coroa de Espinhos; gatilhos específicos e ausência de gasto de PE.'],['As Máscaras na Sua Mesa',97,'Forma suprema opcional com gasto de SAN e bônus temporários, mediante acordo com mestre.'],['Registro de atualizações v1.1','109–111','Errata de poderes, itens, rituais, fichas e regras especiais.']
];
export const AS02_REFERENCE_ENTRIES=[
 ...eq.map(([nome,pagina,desc],j)=>b('equip-'+j,nome,'equipamento',pagina,desc,{consultaApenas:true})),
 ...allies.map(([nome,pagina],j)=>b('aliado-'+j,nome+' como aliado','consulta',pagina,'Perfil de aliado, bônus e habilidade especial: confira efeitos completos na página.',{consultaApenas:true,categoria:'Aliado'})),
 ...rules.map(([nome,pagina,desc],j)=>b('regra-'+j,nome,'consulta',pagina,desc,{consultaApenas:true,categoria:'Regra de campanha'}))
];