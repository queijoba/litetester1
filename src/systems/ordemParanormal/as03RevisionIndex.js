// Revisão de Arquivos Secretos #03 v1.1 (Hexatombe Parte 2), com o PDF
// diretamente consultado no Drive do projeto. Resumos editoriais, sem transcrever
// a mecânica integral ou incluir opções narrativas exclusivas como poderes gerais.
const origin='pj-op-official-index';
const source='Arquivos Secretos #03';
const base=(id,nome,tipo,pagina,desc,requisito='',extra={})=>({
 id:'op-as03-revisao-'+id,nome,tipo,fonte:source,pagina,desc,
 requisito,custo:'',bibliotecaOrigem:origin,...extra
});
export const AS03_NEW_LIBRARY_ENTRIES=[
 base('papinho-sedutor','Papinho Sedutor','habilidade','108',
  'Poder geral ligado a testes sociais para seduzir alguém. Gastar 1 PE dá +5 ao teste; as consequências da paixão ficam a cargo do mestre.',
  'Presença 2',{classe:'Geral'}),
 // Exclusivos de quem é um dos sacrifícios do ritual Hexatombe: nunca
 // sugerir como talentos comuns de personagens da Ordo Realitas.
 base('culpa','Causar Culpa','habilidade','109',
  'Poder excepcional do sacrifício da Culpa. Uma ação padrão e 3 PE podem impor culpa intensa com teste de Vontade para resistir. Restrito ao ritual Hexatombe.',
  'Ser o sacrifício da Culpa — regra especial de campanha',{classe:'Geral',contextoEspecial:'Sacrifício de Hexatombe'}),
 base('obsessao','Despertar Obsessão','habilidade','109',
  'Poder excepcional do sacrifício da Obsessão; usa interação visual para desorientar um alvo. Consulte alternativas do alvo e duração no livro.',
  'Ser o sacrifício da Obsessão — regra especial de campanha',{classe:'Geral',contextoEspecial:'Sacrifício de Hexatombe'}),
 base('orgulho','Arrogância Diabólica','habilidade','109',
  'Poder excepcional do sacrifício do Orgulho que induz imprudência por influência paranormal. Consulte o teste e as consequências da resistência.',
  'Ser o sacrifício do Orgulho — regra especial de campanha',{classe:'Geral',contextoEspecial:'Sacrifício de Hexatombe'}),
 base('prazer','Estimular Hedonismo','habilidade','110',
  'Poder excepcional do sacrifício do Prazer que altera sensações e instintos de autopreservação de um alvo. Restrito ao ritual Hexatombe.',
  'Ser o sacrifício do Prazer — regra especial de campanha',{classe:'Geral',contextoEspecial:'Sacrifício de Hexatombe'}),
 base('desejo','Fruto da Ambição','habilidade','110',
  'Poder excepcional do sacrifício do Desejo ligado a uma habilidade ou ritual escolhido. O texto remete a As Máscaras do pacote #02, que não está integralmente disponível nos arquivos de regras deste Drive.',
  'Ser o sacrifício do Desejo — regra especial de campanha',{classe:'Geral',contextoEspecial:'Sacrifício de Hexatombe'}),
 base('rancor','Ódio Suprimido','habilidade','110',
  'Poder excepcional do sacrifício do Rancor que libera um ataque de fúria em área, com consequências de exaustão. Consulte os testes no livro.',
  'Ser o sacrifício do Rancor — regra especial de campanha',{classe:'Geral',contextoEspecial:'Sacrifício de Hexatombe'})
];
const overrides={
 'Guardião da Tropa':{pagina:'106–107',requisito:'Ataque Especial e Casca Grossa',desc:'Poder de combatente que permite proteger um aliado, assumindo um ataque ou habilidade dirigida a ele mediante reação e custo de PE. Consulte a condição de recuperação de SAN na fonte.'},
 'Flagelo Bem Aproveitado':{pagina:'107',requisito:'Escolhido pelo Outro Lado e Recuperação Flagelante',desc:'Aprimora a conversão entre PV e PE usada com Poder do Flagelo. Conferir as regras completas da habilidade e requisitos.'},
 'Recuperação Flagelante':{pagina:'107',requisito:'Escolhido pelo Outro Lado e Poder do Flagelo',desc:'Permite recuperar PV antes gastos pelo Poder do Flagelo, em quantidade limitada entre interlúdios, inclusive por outros métodos além de descanso.'},
 'Ambidestria':{pagina:'107',requisito:'Força 2 ou Agilidade 2 e treino em Luta',desc:'Combate com duas armas com penalidade nos testes; pode interagir com Combater com Duas Armas. Consulte limites de empunhadura na fonte.'},
 'Vitalidade Sofrida':{pagina:'107',requisito:'Ataque Especial',desc:'Altera progressão de PV e SAN de um combatente, inclusive níveis já adquiridos. Confira os valores e recálculo no livro.'},
 'Entrada Triunfal':{pagina:'108',requisito:'Presença 2',desc:'Uma vez por sessão, ao anunciar chegada a um ambiente, concede bônus ao primeiro teste no local; pode transferi-lo a um aliado conforme as condições oficiais.'},
 'Instrumento Elétrico de Combate':{pagina:'108',desc:'Poder de Energia que transforma um instrumento musical tocado pelo personagem em arma especial; permite usar Artes para ataques e Presença no dano, sujeito a condições.'},
 'Conhecimento de Direção Precognitiva':{pagina:'108',desc:'Poder de Conhecimento que concede bônus para se localizar ou orientar; a afinidade amplia o bônus.'},
 'Combatente Performático':{pagina:'118–119',classe:'Geral',requisito:'Trilha geral opcional: Combatente, Especialista ou Ocultista',desc:'Trilha geral experimental de sinergia entre participantes do combate, presente em Hexatombe Parte 2. O nome pode variar conforme a classe, como explica o suplemento.',
 progressao:[
  {nex:10,nome:'Ensaio'},
  {nex:40,nome:'Frase de Efeito'},
  {nex:65,nome:'Mosh Pit'},
  {nex:99,nome:'Ritmo Contagiante'}
 ]}
};
export function reviewAS03Entry(entry){
 if(entry.fonte!==source)return entry;
 const o=overrides[entry.nome];
 return o?{...entry,...o}:entry;
}
