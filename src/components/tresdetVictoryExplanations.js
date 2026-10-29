// Resumos editoriais originais, elaborados a partir do Manual 3DeT Victory (2024).
// Não substituem os detalhes, variações e requisitos do livro oficial.
const ITEMS={
  "Aceleração": "Mobilidade acima do normal: movimentos extras e vantagem em iniciativas e perseguições mediante gasto de PM.",
  "Acumulador": "Seu ataque fica mais forte à medida que consegue acertar oponentes consecutivamente; indicado para quem mantém pressão na luta.",
  "Ágil": "Destaca coordenação e reflexos; favorece testes de agilidade, equilíbrio e iniciativa.",
  "Ajudante": "Você conta com um aliado, animal, robô ou outro apoio especializado, útil dentro ou fora de combate.",
  "Anulação": "Permite tentar impedir temporariamente o uso de uma vantagem observada em um alvo, mediante teste e custo.",
  "Arena": "Escolha um ambiente onde você rende melhor; nele pode obter Ganho em testes gastando PM.",
  "Artefato": "Concede um equipamento excepcional com benefícios de regras, como arma, armadura ou dispositivo especial.",
  "Ataque Especial": "Personaliza ataques com efeitos como área, precisão ou dano especial, pagando PM para ativá-los.",
  "Base": "Oferece um refúgio ou quartel-general seguro, útil para descansar e se reorganizar longe de perigos.",
  "Brutal": "Recupera recursos quando causa dano em combate; escolha a modalidade permitida pela vantagem.",
  "Carismático": "Facilita interações sociais, influência e conquista da simpatia de outras pessoas.",
  "Clone": "Cria cópias temporárias para despistar e absorver ataques que atingiriam seu personagem.",
  "Confusão": "Um ataque pode embaralhar as decisões do inimigo, fazendo os alvos de certas ações serem escolhidos ao acaso.",
  "Cura": "Gaste PM para recuperar PV seus ou de alguém que possa tocar; também auxilia em certas recuperações.",
  "Defesa Especial": "Personaliza a resposta a ataques com bloqueios, esquivas, proteção e outros efeitos defensivos pagos em PM.",
  "Desgaste": "O alvo continua sofrendo consequência do ataque na rodada seguinte, representando veneno, fogo ou corrosão.",
  "Devoto": "Uma crença, missão ou promessa orienta seu personagem e pode fortalecê-lo quando age por essa causa.",
  "Elo Mental": "Vínculo entre dois personagens que permite comunicação mental e cooperação em certas situações.",
  "Estender": "Amplia para aliados próximos efeitos de vantagens que normalmente beneficiariam só você.",
  "Famoso": "Sua reputação ajuda na interação com pessoas que reconhecem você.",
  "Foco": "Você dedica tempo a se concentrar, sacrificando mobilidade ou segurança por desempenho melhor depois.",
  "Forte": "Favorece força física, impactos, carregar peso e outras tarefas que exijam potência muscular.",
  "Gênio": "Favorece raciocínio, conhecimento e a resolução de problemas intelectuais.",
  "Golpe Final": "Ataque especialmente poderoso contra um oponente que já está perto de cair.",
  "Grimório": "Você começa com técnicas aprendidas por meio de manual, ensinamentos, código, livro ou outra fonte.",
  "Ilusão": "Cria aparências tridimensionais sem substância física para enganar sentidos e confundir pessoas.",
  "Imitar": "Após observar um poder, você pode tentar reproduzir temporariamente a vantagem usada por outra pessoa.",
  "Imortal": "Seu personagem pode ser derrotado e afastado de cena, mas não permanece morto pelos meios usuais.",
  "Improviso": "Adaptação emergencial: usa temporariamente conhecimento ou perícia não adquiridos, gastando recursos.",
  "Imune": "Escolha uma imunidade específica, como certas necessidades biológicas, condições ou ameaças.",
  "Incorpóreo": "Torna-se intangível temporariamente, atravessando obstáculos e mudando quais ataques podem atingir você.",
  "Inofensivo": "Sua aparência pouco ameaçadora permite surpreender adversários no início de um confronto.",
  "Instrutor": "Ajuda um aliado a se sair melhor em uma tarefa compartilhando orientações ou treinamento.",
  "Irresistível": "Dificulta os testes que oponentes fazem para resistir a suas vantagens.",
  "Maestria": "Especialização numa perícia já comprada, aumentando suas chances de crítico com gasto de PM.",
  "Magia": "Manipula energia sobrenatural para modificar testes, defender, atacar ou criar efeitos místicos.",
  "Mana": "Aumenta a quantidade de Pontos de Mana disponíveis para usar vantagens e técnicas.",
  "Membros": "Braços extras, tentáculos ou apêndices capazes de realizar mais uma ação mediante gasto de PM.",
  "Mentor": "Os ensinamentos de um mestre favorecem periodicamente testes de uma perícia escolhida.",
  "Obstinado": "Converte esforço extremo e parte de seus atributos em capacidade extra para superar dificuldades.",
  "Patrono": "Apoio de organização ou benfeitor ajuda a obter recursos e suprimentos para missões.",
  "Resoluto": "Melhora resistência mental, coragem, determinação e defesa contra manipulação ou encantos.",
  "Telepata": "Lê pistas nos pensamentos alheios e pode facilitar interações e descobrir informações.",
  "Teleporte": "Substitui deslocamentos por saltos instantâneos para pontos visíveis, pagando PM pela distância.",
  "Torcida": "Se há público favorável, o entusiasmo dos espectadores pode dar Ganho em seus testes.",
  "+Vida": "Aumenta o total máximo de Pontos de Vida do personagem.",
  "Vigoroso": "Favorece saúde, resistência a doenças, venenos, fadiga e outros esforços corporais.",
  "Voo": "Permite voar e superar obstáculos terrestres; oponentes sem voo terão dificuldade em alcançar você.",
  "Ambiente": "Seu organismo está adaptado a um ambiente específico e se prejudica em outros.",
  "Amnésia": "Você desconhece o próprio passado e parte de suas capacidades; o mestre mantém informações da ficha em segredo.",
  "Antipático": "Dificuldade de comunicação e simpatia, causando Perda nas interações sociais relevantes.",
  "Atrapalhado": "Falta de coordenação: testes de agilidade ficam mais difíceis e sem críticos.",
  "Bateria": "Seu corpo depende de energia: com PM esgotados você desliga; com baixa reserva, perde desempenho.",
  "Dependência": "Necessidade periódica de substância ou condição problemática para continuar funcionando.",
  "Diferente": "Anatomia incomum torna difícil usar equipamentos e instalações feitos para humanoides comuns.",
  "Elo Vital": "Sua vida está ligada à de um aliado, e o dano sofrido por um repercute no outro.",
  "Fracote": "Falta força física para tarefas de Poder, com Perda e sem acertos críticos nessas situações.",
  "Frágil": "Pouca resistência corporal a doenças, venenos, ferimentos e testes de morte.",
  "Fúria": "Ferimentos ou provocações podem fazê-lo perder o controle e atacar impulsivamente.",
  "Inapto": "Escolha uma perícia na qual você é particularmente ruim; testes relacionados recebem penalidades.",
  "Indeciso": "Sua falta de firmeza prejudica testes de vontade e decisões sob pressão.",
  "Infame": "Má reputação: pessoas que reconhecem você tendem a dificultar interações sociais.",
  "Lento": "Movimenta-se devagar; sofre em iniciativas e precisa de mais movimento para deslocar-se.",
  "Monstruoso": "Aspecto assustador ou grotesco que deixa inimigos atentos, prejudicando a iniciativa.",
  "Munição": "Um ataque ou poder depende de recarga, projétil, energia ou pausa entre os usos.",
  "Pobreza": "A falta crônica de dinheiro torna testes para comprar itens mais difíceis.",
  "Ponto Fraco": "Uma vulnerabilidade reconhecível pode ser identificada e explorada pelos inimigos.",
  "Protegido": "Você tem alguém que precisa defender; esse vínculo pode ser colocado em risco na aventura.",
  "Sem Vida": "Seu personagem não é uma criatura viva, mudando as formas de recuperação e certas interações.",
  "Tapado": "Raciocínio e intelecto prejudicados: recebe Perda em testes de conhecimento e análise.",
  "Transtorno": "Uma condição de comportamento selecionada no livro pode criar obrigações e complicações recorrentes.",
  "Aberrante": "Ser de natureza alienígena ao universo, com capacidades estranhas e limitações peculiares.",
  "Abissal": "Descendente ou criatura ligada a planos infernais, com herança sobrenatural e exigências próprias.",
  "Alien": "Viajante de outro mundo, era ou dimensão; origem e habilidades podem variar bastante.",
  "Anão": "Humanoide baixo e robusto, associado à resistência e ao trabalho artesanal.",
  "Anfíbio": "Ser adaptado à água e à terra, indicado para aventuras aquáticas.",
  "Celestial": "Ser de origem luminosa ou plano superior, com traços e dons sobrenaturais.",
  "Centauro": "Personagem com torso humanoide e corpo animal de quatro ou mais patas.",
  "Ciborgue": "Organismo vivo aprimorado com partes mecânicas, reunindo biologia e tecnologia.",
  "Construto": "Criatura artificial criada ou montada, como androide, autômato ou golem.",
  "Dahllan": "Povo ligado a plantas e fadas, com características naturais e mágicas.",
  "Elfo": "Povo longevo de sentidos aguçados e afinidade com magia.",
  "Fada": "Criatura associada à natureza e a manifestações mágicas, de aparência e tamanho variados.",
  "Fantasma": "Espírito desencarnado com natureza incorpórea e poderes de morto-vivo.",
  "Goblin": "Pequeno humanoide adaptável e engenhoso, comum em ambientes urbanos e aventuras.",
  "Hynne": "Povo pequenino, também chamado halfling, que costuma aproveitar agilidade e discrição.",
  "Kallyanach": "Descendente de dragões ou afetado por energia dracônica, com poderes elementais.",
  "Kemono": "Animal antropomórfico ou humanoide de traços animais, com talentos e fragilidades relacionados à espécie.",
  "Medusa": "Humanoide com serpentes no cabelo e dons ligados a seu olhar e herança.",
  "Minotauro": "Humanoide robusto de cabeça bovina, indicado para força e investidas.",
  "Ogro": "Humanoide de grande porte e força elevada, com limitações sociais ou físicas.",
  "Osteon": "Esqueleto consciente animado por magia, que não vive biologicamente.",
  "Qareen": "Pessoa de ascendência arcana ou geniosa, com capacidades mágicas.",
  "Sauroide": "Humanoide reptiliano, com traços de lagarto, serpente ou dinossauro.",
  "Vampiro": "Criatura de natureza vampírica, resistente e sedutora, mas com fraquezas próprias.",
  "Ás Indomável": "Truque de pilotagem avançada para forçar veículos e executar manobras arriscadas.",
  "Barreira Mística": "Defesa mágica reativa que pode usar Mística no lugar de Luta, com efeitos adicionais.",
  "Cancioneiro Popular": "Canções que influenciam emoções, distraem ou ajudam personagens em situações sociais.",
  "Grimório Debilitante": "Magias que dificultam a vida dos adversários, incluindo mudanças de luz e condições do ambiente.",
  "Grimório Irritante": "Pequenos feitiços de provocação e distração, úteis para atrapalhar a concentração.",
  "Pequenos Desejos": "Efeitos mágicos simples e inofensivos, úteis para truques, distrações e interpretação.",
  "Praga": "Lança uma maldição breve que enfraquece os testes ou os poderes do alvo.",
  "Raio Místico": "Dispara energia arcana para atingir alvos a distância, usando Mística quando permitido.",
  "Absorver Mana": "Capta energia do ambiente para aumentar PM temporariamente, em vez de gastar apenas sua reserva.",
  "Área de Batalha": "Cria um campo especial de combate onde seus poderes e o ambiente oferecem vantagens.",
  "Bola de Fogo": "Ataque mágico de fogo à distância, com possibilidade de aumentar o poder mediante Magia.",
  "Combo": "Emenda golpes sucessivos contra o mesmo oponente após acertar ataques.",
  "Desprezo": "Desestabiliza um rival com provocações, tornando-o menos eficiente depois de resistir à pressão.",
  "Disparo de Energia": "Concentra energia e a lança contra inimigos distantes, podendo fortalecer o disparo.",
  "Consertar": "Recupera Pontos de Vida de construtos com habilidade técnica e gasto de PM.",
  "Gambiarra": "Improvisa soluções e substitui uma perícia por Saber quando há tempo e materiais adequados.",
  "Golpe Púrpura": "Golpe marcial de grande impacto, com crítico automático e potencial de empurrar o alvo.",
  "Inspirar": "Motiva um ou mais aliados, fortalecendo seus testes por uma cena.",
  "Invocar Elemental": "Conjura um ser elemental que auxilia em combate e tarefas, como um Ajudante.",
  "Megalon": "Aumenta o tamanho de um alvo, favorecendo força e vigor, mas prejudicando agilidade.",
  "Mikron": "Encolhe um alvo, favorecendo agilidade e discrição, mas reduzindo força e vigor.",
  "Poeira Glacial": "Ataque de frio capaz de ferir e prejudicar alvos à distância.",
  "Queimar o Cosmo": "Converte energia cósmica em aumento temporário dos atributos durante a cena.",
  "Raio da Fúria": "Infunde um alvo com fúria, aumentando agressividade e poder ofensivo, mas reduzindo autocontrole.",
  "Rajada de Golpes": "Realiza uma sequência intensa de ataques próximos, ampliando sua força com movimentos.",
  "Relâmpago": "Ataque elétrico de longa distância com efeitos adicionais de choque.",
  "Sabedoria dos Ermos": "Encontra itens úteis sem carregá-los, especialmente em ambientes da sua Arena.",
  "Setas Infalíveis de Petrovna": "Cria projéteis mágicos flutuantes que podem ser lançados contra alvos depois.",
  "Abrir Chakra": "Desperta energia interior para potencializar um atributo e seus testes por uma cena.",
  "Bomba Vital": "Reúne energia ambiental numa esfera ofensiva de enorme potência.",
  "Dim Mak": "Atinge pontos vitais com precisão capaz de incapacitar e ferir gravemente.",
  "Megalon Superior": "Transforma o tamanho do alvo em escala gigantesca, elevando sua categoria de poder."
};
export const TRESDET_EXPLANATIONS=Object.freeze(ITEMS);

export const TRESDET_SKILL_ENTRIES=[
  {
    "id": "3det-pericia-animais",
    "tipo": "pericia",
    "key": "animais",
    "nome": "Animais",
    "desc": "Lidar com, treinar, acalmar e reconhecer o comportamento de criaturas e animais.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  },
  {
    "id": "3det-pericia-arte",
    "tipo": "pericia",
    "key": "arte",
    "nome": "Arte",
    "desc": "Criar, interpretar e avaliar obras e apresentações artísticas, música, dança ou atuação.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  },
  {
    "id": "3det-pericia-esporte",
    "tipo": "pericia",
    "key": "esporte",
    "nome": "Esporte",
    "desc": "Praticar atividades atléticas e manobras ligadas à preparação esportiva.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  },
  {
    "id": "3det-pericia-influencia",
    "tipo": "pericia",
    "key": "influencia",
    "nome": "Influência",
    "desc": "Persuadir, negociar, liderar ou lidar com relações sociais e reputação.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  },
  {
    "id": "3det-pericia-luta",
    "tipo": "pericia",
    "key": "luta",
    "nome": "Luta",
    "desc": "Combater corporalmente, atacar, defender e empregar treinamento marcial.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  },
  {
    "id": "3det-pericia-manha",
    "tipo": "pericia",
    "key": "manha",
    "nome": "Manha",
    "desc": "Agir furtivamente, enganar, obter informações e lidar com subterfúgios.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  },
  {
    "id": "3det-pericia-maquinas",
    "tipo": "pericia",
    "key": "maquinas",
    "nome": "Máquinas",
    "desc": "Operar, consertar e compreender equipamentos, veículos e dispositivos.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  },
  {
    "id": "3det-pericia-medicina",
    "tipo": "pericia",
    "key": "medicina",
    "nome": "Medicina",
    "desc": "Prestar socorro, diagnosticar problemas físicos e lidar com tratamentos.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  },
  {
    "id": "3det-pericia-mistica",
    "tipo": "pericia",
    "key": "mistica",
    "nome": "Mística",
    "desc": "Conhecer e aplicar saberes sobre magia, rituais e fenômenos sobrenaturais.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  },
  {
    "id": "3det-pericia-percepcao",
    "tipo": "pericia",
    "key": "percepcao",
    "nome": "Percepção",
    "desc": "Notar detalhes, rastros, perigos e mudanças sutis no ambiente.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  },
  {
    "id": "3det-pericia-saber",
    "tipo": "pericia",
    "key": "saber",
    "nome": "Saber",
    "desc": "Reunir e aplicar conhecimentos gerais, pesquisa e estudo.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  },
  {
    "id": "3det-pericia-sobrevivencia",
    "tipo": "pericia",
    "key": "sobrevivencia",
    "nome": "Sobrevivência",
    "desc": "Orientar-se, rastrear, encontrar recursos e enfrentar ambientes hostis.",
    "pagina": "40–41",
    "fonte": "3DeT Victory — Livro Básico",
    "custo": "1 pt"
  }
];

export const TRESDET_TECH_USAGE={
  "Ás Indomável": {
    "requisitos": "Esporte ou Máquinas",
    "alcance": "Pessoal",
    "uso": "0 a 2PM"
  },
  "Barreira Mística": {
    "requisitos": "Magia, Mística",
    "alcance": "Pessoal",
    "uso": "1 a 2PM por uso"
  },
  "Cancioneiro Popular": {
    "requisitos": "Arte",
    "alcance": "Perto",
    "uso": "2PM"
  },
  "Grimório Debilitante": {
    "requisitos": "Magia",
    "alcance": "Perto",
    "uso": "3PM por uso"
  },
  "Grimório Irritante": {
    "requisitos": "Magia",
    "alcance": "Perto",
    "uso": "0 a 1PM ou mais"
  },
  "Pequenos Desejos": {
    "requisitos": "Mística",
    "alcance": "Perto",
    "uso": "0 a 1PM por uso"
  },
  "Praga": {
    "requisitos": "Mística",
    "alcance": "Perto",
    "uso": "2PM"
  },
  "Raio Místico": {
    "requisitos": "Magia, Mística",
    "alcance": "Perto ou Longe",
    "uso": "1 a 2PM por uso"
  },
  "Absorver Mana": {
    "requisitos": "Mística",
    "alcance": "Pessoal",
    "uso": "0PM"
  },
  "Área de Batalha": {
    "requisitos": "Poder ou Habilidade 2, Mística",
    "alcance": "Perto",
    "uso": "2PM para ativar; 1PM/rodada para manter"
  },
  "Bola de Fogo": {
    "requisitos": "Habilidade 2, Magia",
    "alcance": "Longe",
    "uso": "3PM + bônus de Magia"
  },
  "Combo": {
    "requisitos": "Habilidade 1, Golpe",
    "alcance": "Variável",
    "uso": "0PM"
  },
  "Desprezo": {
    "requisitos": "Poder 2 e Arte ou Influência",
    "alcance": "Perto",
    "uso": "2PM; depois 1PM por uso"
  },
  "Disparo de Energia": {
    "requisitos": "Luta ou Magia",
    "alcance": "Longe",
    "uso": "3PM"
  },
  "Consertar": {
    "requisitos": "Máquinas",
    "alcance": "Perto",
    "uso": "2 a 10PM"
  },
  "Gambiarra": {
    "requisitos": "Saber, Maestria (Saber)",
    "alcance": "Pessoal",
    "uso": "2PM"
  },
  "Golpe Púrpura": {
    "requisitos": "Poder 3, Luta",
    "alcance": "Perto",
    "uso": "3PM"
  },
  "Inspirar": {
    "requisitos": "Poder 2 e Arte, Influência ou Devoto",
    "alcance": "Perto",
    "uso": "3 ou 6PM"
  },
  "Invocar Elemental": {
    "requisitos": "Habilidade 2, Magia",
    "alcance": "Perto",
    "uso": "3PM"
  },
  "Megalon": {
    "requisitos": "Habilidade 3, Magia",
    "alcance": "Perto",
    "uso": "10PM"
  },
  "Mikron": {
    "requisitos": "Habilidade 3, Magia",
    "alcance": "Perto",
    "uso": "10PM"
  },
  "Poeira Glacial": {
    "requisitos": "Habilidade 2, Magia",
    "alcance": "Longe",
    "uso": "3PM + bônus de Magia"
  },
  "Queimar o Cosmo": {
    "requisitos": "Resistência 2, Luta",
    "alcance": "Pessoal",
    "uso": "5 a 25PM"
  },
  "Raio da Fúria": {
    "requisitos": "Habilidade 3, Magia",
    "alcance": "Longe",
    "uso": "10PM"
  },
  "Rajada de Golpes": {
    "requisitos": "Habilidade 2, Luta",
    "alcance": "Perto",
    "uso": "3PM"
  },
  "Relâmpago": {
    "requisitos": "Habilidade 2, Magia",
    "alcance": "Longe",
    "uso": "3PM + bônus de Magia"
  },
  "Sabedoria dos Ermos": {
    "requisitos": "Arena, Sobrevivência",
    "alcance": "Pessoal",
    "uso": "1 ou 3PM"
  },
  "Setas Infalíveis de Petrovna": {
    "requisitos": "Habilidade 1, Magia",
    "alcance": "Longe",
    "uso": "1PM por seta"
  },
  "Abrir Chakra": {
    "requisitos": "Atributo 4, Luta",
    "alcance": "Pessoal",
    "uso": "15PM"
  },
  "Bomba Vital": {
    "requisitos": "Resistência 4, Luta",
    "alcance": "Longe",
    "uso": "Variável conforme energia acumulada"
  },
  "Dim Mak": {
    "requisitos": "Habilidade 5, Luta",
    "alcance": "Perto",
    "uso": "5PM"
  },
  "Megalon Superior": {
    "requisitos": "Habilidade 6, Megalon",
    "alcance": "Perto",
    "uso": "25 ou 50PM"
  }
};
