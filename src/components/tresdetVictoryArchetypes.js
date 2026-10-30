// Pacotes resumidos dos 24 Arquétipos, conforme 3DeT Victory, Livro Básico,
// pp. 78–101 (capítulo de Arquétipos, pp. 75–102).
// Textos editoriais próprios. Benefícios exclusivos não são compras extras;
// efeitos condicionais/escolhas devem ser completados pelo jogador.
const PACKAGES={
 'Aberrante':{pagina:'78',v:[
  ['Deformidade','Escolha uma perícia: seus testes usam o atributo correspondente com +1, mesmo sem treinamento.'],
  ['Teratismo','Escolha uma Técnica Comum para receber; ainda precisa atender aos requisitos.']
 ],d:[['Monstruoso','Sua forma anômala causa dificuldades sociais, conforme a desvantagem Monstruoso.']]},
 'Abissal':{pagina:'79',v:[
  ['Ágil','Recebe a vantagem Ágil.'],
  ['Desfavor','Com ação e 3PM, desafia a Resistência de alguém Perto contra seu Poder; falha causa Perda nos testes até o próximo turno.']
 ],d:[['Infame','Carrega a reputação de um ser demoníaco.']]},
 'Alien':{pagina:'80',v:[
  ['Talento — escolha pendente','Escolha uma vantagem: Ágil, Carismático, Forte, Gênio, Resoluto ou Vigoroso.'],
  ['Xenobiologia — escolha pendente','Escolha uma vantagem sua para utilizar por metade de seu custo em PM.']
 ],d:[['Inculto','Não compreende bem costumes e cultura terrestres.']]},
 'Anão':{pagina:'81',v:[
  ['Abascanto','Recebe Ganho em testes de Resistência contra efeitos nocivos que não sejam dano.'],
  ['A Ferro e Fogo','Máquinas recebe +1 no atributo correspondente nos testes, mesmo sem perícia; ganha Sentido (Infravisão).']
 ],d:[['Lento','A velocidade reduzida acompanha o tamanho de suas pernas.']]},
 'Anfíbio':{pagina:'82',v:[
  ['Imune (Anfíbio)','Move-se e respira normalmente debaixo d’água; enxerga formas no escuro subaquático, mas não cores.'],
  ['Vigoroso','Recebe a vantagem Vigoroso.']
 ],d:[['Ambiente','Sofre com ambientes inadequados à sua natureza aquática.']]},
 'Celestial':{pagina:'83',v:[
  ['Carismático','Recebe a vantagem Carismático.'],
  ['Arrebatar','Com movimento e 3PM, concede Ganho a um teste de perícia de aliado Perto ou Longe até o próximo turno.']
 ],d:[['Código — escolha pendente','Defina ao menos um código de conduta celestial.']]},
 'Centauro':{pagina:'84',v:[
  ['Corpo Táurico','Gasta 1PM para conseguir crítico com 5 ou 6 em testes físicos, iniciativa ou corrida, exceto ataques.'],
  ['Vigoroso','Recebe a vantagem Vigoroso.']
 ],d:[['Diferente','Equipamentos, roupas e veículos feitos para humanos normalmente não servem.']]},
 'Ciborgue':{pagina:'85',v:[
  ['Construto Vivo','Pode recuperar PV por meios orgânicos ou ser consertado.'],
  ['Imune','Recebe Imune (Abiótico, Doenças, Resiliente).']
 ],d:[['Diretriz — escolha pendente','Escolha Código ou Transtorno como limitação de programação.']]},
 'Construto':{pagina:'86',v:[
  ['Imune','Recebe Imune (Abiótico, Doenças, Resiliente e Sem Mente).']
 ],d:[
  ['Bateria','Não precisa comer, beber ou dormir; deve recarregar uma fonte de energia.'],
  ['Sem Vida','PV não são curados normalmente; precisam de conserto.']
 ]},
 'Dahllan':{pagina:'87',v:[
  ['Bênção da Natureza','Gasta movimento e 2PM para endurecer a pele e obter Ganho em defesas até seu próximo turno.'],
  ['Empatia Selvagem','Testes de Animais têm +1 no atributo correspondente, mesmo sem a perícia.']
 ],d:[['Código Dahllan','Não consome animais, não os agride e procura ajudá-los quando estão em perigo.']]},
 'Elfo':{pagina:'88',v:[
  ['Impecável — escolha pendente','Escolha uma vantagem: Ágil, Carismático ou Gênio.'],
  ['Natureza Mística','Testes de Mística usam +1 no atributo correspondente, mesmo sem perícia.']
 ],d:[['Frágil','Sofre com a constituição física delicada.']]},
 'Fada':{pagina:'89',v:[
  ['Magia das Fadas — escolha pendente','Escolha Magia ou Ilusão; a escolhida custa –1PM por uso (mínimo 1PM).']
 ],d:[
  ['Infame','Fadas nem sempre são levadas a sério.'],
  ['Delicada — escolha pendente','Escolha Diferente (pequena) ou Frágil (tamanho normal).']
 ]},
 'Fantasma':{pagina:'90',v:[
  ['Espírito','Normalmente imaterial; pode gastar PM para se materializar numa cena. Também possui imunidades e Sem Vida (condições específicas).'],
  ['Paralisia','Sua aura de medo pode paralisar vítimas.']
 ],d:[['Devoto','Uma missão, promessa ou sentimento o mantém preso ao mundo.']]},
 'Goblin':{pagina:'91',v:[
  ['Espertalhão','Testes de Manha têm +1 no atributo correspondente, mesmo sem perícia.'],
  ['Subterrâneo','Recebe Sentido (Infravisão) e Ganho em Resistência contra venenos e doenças.']
 ],d:[['Diferente','O corpo pequeno e incomum dificulta o uso de itens feitos para outros povos.']]},
 'Hynne':{pagina:'92',v:[
  ['Atirador','Gasta 2PM para obter Ganho ao atacar alvos Longe.'],
  ['Encantador','Testes de Influência têm +1 no atributo correspondente, mesmo sem perícia.']
 ],d:[['Diferente','Seu tamanho é bastante diferente do humano comum.']]},
 'Kallyanach':{pagina:'93',v:[
  ['Baforada — escolha pendente','Recebe um Ataque Especial: escolha Área, Distante ou Potente; o uso custa –1PM (mínimo 1PM).'],
  ['Poder Dracônico — escolha pendente','Escolha Forte ou Carismático.']
 ],d:[['Código dos Dragões','Deve cumprir promessas feitas e não esquecer compromissos.']]},
 'Kemono':{pagina:'94',v:[
  ['Percepção Apurada','Testes de Percepção recebem +1 no atributo correspondente, mesmo sem a perícia.'],
  ['Talento — escolha pendente','Escolha Ágil, Carismático, Forte, Gênio, Resoluto ou Vigoroso.']
 ],d:[['Cacoete — escolha pendente','Escolha Antipático, Atrapalhado, Fracote, Frágil, Indeciso ou Tapado.']]},
 'Medusa':{pagina:'95',v:[
  ['Carismático','Recebe a vantagem Carismático.'],
  ['Olhar Atordoante','Com movimento e 3PM, um alvo Perto resiste com Resistência contra Poder; se falhar, perde ações e defesa na rodada.']
 ],d:[['Fracote','Sofre os efeitos da desvantagem Fracote.']]},
 'Minotauro':{pagina:'96',v:[
  ['Atlético','Testes de Esporte têm +1 no atributo correspondente, mesmo sem perícia.'],
  ['Sentido Labiríntico','Recorda caminhos já percorridos e tem Ganho para farejar usando Percepção.']
 ],d:[['Transtorno (Fobia de Altura)','Locais perto de quedas de 3 metros ou mais provocam sua fobia.']]},
 'Ogro':{pagina:'97',v:[
  ['Destruidor','Ao conseguir crítico em ataque Perto, pode pagar 2PM para adicionar Poder novamente ao dano, uma vez por ataque.'],
  ['Intimidador','Tem Ganho em testes de Influência para assustar, intimidar ou amedrontar.']
 ],d:[['Diferente','Seu tamanho grande dificulta o uso de estruturas e itens comuns.']]},
 'Osteon':{pagina:'98',v:[
  ['Imune','Recebe Imune (Abiótico, Doenças, Resiliente).'],
  ['Memória Póstuma — escolha pendente','Escolha uma perícia: recebe +1 no atributo correspondente ao testá-la, mesmo sem perícia.']
 ],d:[['Sem Vida','PV só podem ser recuperados por métodos permitidos a mortos-vivos.']]},
 'Qareen':{pagina:'99',v:[
  ['Desejos','Recebe Magia; magias pedidas por outra pessoa desde seu último turno custam –2PM (mínimo 1PM).'],
  ['Carismático','Recebe a vantagem Carismático.']
 ],d:[['Código da Gratidão','Permanece devendo gratidão e serviço a quem lhe prestou grande favor.']]},
 'Sauroide':{pagina:'100',v:[
  ['Cascudo','Recebe as vantagens Resoluto e Vigoroso.'],
  ['Camuflagem','Tem Ganho em testes para se esconder.']
 ],d:[['Fraqueza (Frio)','Sofre com baixas temperaturas, conforme Fraqueza.']]},
 'Vampiro':{pagina:'101',v:[
  ['Talento — escolha pendente','Escolha Ágil, Carismático, Forte, Gênio, Resoluto ou Vigoroso.'],
  ['Imortal','Mesmo destruído, pode retornar conforme as regras da vantagem.']
 ],d:[['Fraqueza (Luz do dia)','É prejudicado pela luz solar.']],observacao:'Dependência aparece como sugestão para vampiros vilões NPCs, mas NÃO faz parte do arquétipo de jogador.'}
};
export const TRESDET_ARCHETYPE_PACKAGES=Object.freeze(
 Object.fromEntries(Object.entries(PACKAGES).map(([name,value])=>[name,Object.freeze({
  pagina:value.pagina,
  vantagens:value.v.map(([nome,desc])=>({nome,desc})),
  desvantagens:value.d.map(([nome,desc])=>({nome,desc})),
  observacao:value.observacao||''
 })]))
);
