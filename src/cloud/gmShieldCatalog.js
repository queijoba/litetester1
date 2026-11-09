import {GM_SHIELD_ADDITIONAL_GROUPS} from './gmShieldExtraRules.js';
// Resumos ORIGINAIS para consulta durante a sessão. Os PDFs de origem são
// abertos no Drive (não são copiados para o acervo público do PJLite).
// Só o Mestre deve visualizar este painel; a origem pode ter permissões próprias.
export const GM_SHIELDS={
 dragonbane:{
  label:'Dragonbane',source:'Escudo do Mestre • Dragonbane',
  url:'https://drive.google.com/file/d/1FbMUx0A5ufib7pI31lJG4t7yscoQ-W2h/view',
  groups:[
   {title:'Testes, dragão e demônio',items:[
    ['Teste básico','Role 1d20 buscando resultado igual ou menor que a perícia; vantagens/desvantagens usam benção ou perdição.'],
    ['Dragão / Demônio','O 1 natural é excelente; o 20 natural é uma complicação. A interpretação depende do tipo de teste.'],
    ['PNJs','Quando a perícia não é informada, o escudo sugere valor de referência 5.']
   ]},
   {title:'Combate e exploração',items:[
    ['Rodada','Uma rodada representa cerca de 10 segundos; o turno de exploração, aproximadamente 15 minutos.'],
    ['Monstros','Consulte ferocidade, ataques sorteados e ações extras diretamente na ficha do monstro.'],
    ['Descansos','Descanso de rodada, turno e quarto de dia têm durações e recuperações diferentes.']
   ]}
  ]},
 dnd5e:{
  label:'D&D 5.5e (2024)',source:'Escudo do Mestre • D&D 2024',
  url:'https://drive.google.com/file/d/1JEdjKJ-lSZDxYP1NuwoSLqOVKjE4R8UG/view',
  groups:[
   {title:'Testes e combate',items:[
    ['Teste de d20','Role d20 + modificadores contra a CD. Vantagem e desvantagem mudam qual dos dois d20 é usado.'],
    ['Rodada','Cada criatura joga seu turno segundo a iniciativa. Ações, ações bônus e reações são limitadas por suas próprias regras.'],
    ['Concentração','Quando recebe dano, um conjurador concentrado geralmente precisa testar Constituição para mantê-la.']
   ]},
   {title:'Condições e exploração',items:[
    ['Exaustão','Use os níveis acumulados; confira penalidades e recuperação no escudo atualizado.'],
    ['Agarrado e incapacitado','Afetam movimento ou ações; consulte o texto específico de cada condição.'],
    ['Descanso','Curto e longo recuperam recursos diferentes conforme a classe e as regras atuais.']
   ]}
  ]},
 tormenta20:{
  label:'Tormenta20',source:'Escudo do Mestre • Tormenta20',
  url:'https://drive.google.com/file/d/1FsQq8QvYfo_8GGXkftoGup49g9y2wodv/view',
  groups:[
   {title:'Teste e dificuldade',items:[
    ['Teste','Role d20 e some o modificador de perícia aplicável; compare com a CD.'],
    ['CDs de referência','O escudo apresenta uma escala de tarefas de triviais a quase impossíveis, útil para improvisação.'],
    ['Condições','Abalado, caído, desprevenido e outras condições modificam testes, defesa e ações de maneira específica.']
   ]},
   {title:'Descanso e combate',items:[
    ['Recuperação','A condição de descanso influencia a recuperação de PV e PM; consulte as faixas no escudo.'],
    ['Ações','Diferencie ações padrão, de movimento, livres e reações ao resolver cada rodada.']
   ]}
  ]},
 ordemParanormal:{
  label:'Ordem Paranormal',source:'Escudo do Mestre • Ordem Paranormal',
  url:'https://drive.google.com/file/d/18piUGnREMBSm6JrKCxVkaMY6TM0-Z06E/view',
  groups:[
   {title:'Investigação',items:[
    ['Busca de pistas','A descrição da ação deve ser coerente com a pista; o escudo oferece exemplos de DT crescentes.'],
    ['Facilitar a investigação','Ideias bem relacionadas ao cenário podem ajudar outros investigadores durante a cena.']
   ]},
   {title:'Conflitos e perigo',items:[
    ['Defesa e dano','Confira reações defensivas, tipos de dano e resistências na ficha ou no escudo do sistema.'],
    ['Condições','Ferimentos, medo, fadiga e estados mentais podem alterar o desempenho e as ações disponíveis.']
   ]}
  ]},
 fabula:{
  label:'Fábula Última',source:'Escudo do Mestre • Fábula Última',
  url:'https://drive.google.com/file/d/1ZS86CZ5k1eunbnsRz_KF5TxC4IHIbWk3/view',
  groups:[
   {title:'Testes e oportunidades',items:[
    ['Teste','Role os dois dados dos atributos indicados; some resultados e compare com ND.'],
    ['NDs comuns','7 é fácil, 10 é normal, 13 é difícil e 16 é muito difícil.'],
    ['Oportunidades','Em cenas de conflito, oportunidades podem revelar informações, favorecer aliados ou avançar relógios.']
   ]},
   {title:'Combate e viagens',items:[
    ['Crise','Personagens entram em crise quando seus PV chegam a metade do máximo ou menos.'],
    ['Ações','Ataque, Feitiço, Poder, Guarda e Objetivo são exemplos de opções em turnos de conflito.'],
    ['Jornadas','O dado de viagem varia conforme o grau de ameaça; consulte a tabela no escudo.']
   ]}
  ]},
 '3det':{
  label:'3D&T Victory',source:'Escudo do Mestre • 3D&T Victory',
  url:'https://drive.google.com/file/d/1sLyiPm-d6ZEe7vOuTQmFV5RJNEpLJ3nk/view',
  groups:[
   {title:'Teste e distância',items:[
    ['Testes','Use os dados previstos pelo atributo e a perícia; Ganhos e Perdas alteram a rolagem.'],
    ['Alcance','Perto, Longe e Muito Longe são distâncias narrativas que afetam o uso das ações.'],
    ['Metas estendidas','Desafios longos pedem sucessos progressivos; falhas acumuladas podem encerrar a tentativa.']
   ]},
   {title:'Combate e recuperação',items:[
    ['PV, PM e PA','Recursos têm usos e ritmos de recuperação distintos; o descanso curto não recupera PA.'],
    ['Queda e derrota','Em combate violento, receber dano após a derrota pode exigir teste de morte.']
   ]}
  ]},
 rotaZero:{
  label:'Rota Zero',source:'Mini Escudo do Mestre • Rota Zero v0.3',
  url:'https://drive.google.com/file/d/1dqiv1BZP7d2K7CR1psJYTJ8iQzHUMrij/view',
  groups:[
   {title:'Testes e recursos',items:[
    ['Teste básico','Use de 1 a 3 d6 + atributo; perícia e Ganho podem adicionar dados. Um 6 pode ampliar o efeito do atributo.'],
    ['Metas','6 rotina sob pressão, 9 obstáculo real, 12 risco grave e 15 desafio extremo.'],
    ['ADR, Foco e Vitalidade','Adrenalina permite refazer um dado; Foco absorve pressão e ativa recursos; Vitalidade acompanha danos.']
   ]},
   {title:'Sobrevivência e tensão',items:[
    ['Pressão e Pânico','Escolha gastar Foco ou marcar Pânico; acumular Pânico aproxima trauma e desespero.'],
    ['Calor e veículos','Frio altera testes e pressão. Veículos têm combustível, integridade e carga.'],
    ['Fuga primeiro','Esconder, distrair e escapar são alternativas esperadas antes de lutar.']
   ]}
  ]},
 skyfall:{
  label:'Skyfall RPG',source:'Resumo de apoio • sem PDF de escudo localizado',
  url:null,groups:[
   {title:'Preparação rápida',items:[
    ['Combates','Consulte PV, iniciativa, proteção, redução de dano, ataques e reações da ameaça.'],
    ['Exploração','Registre ameaças ambientais e pontos de interesse em Investigação e Anotações.'],
    ['Referência','Use o livro do sistema para CDs, consequências e mecânicas próprias; o PJLite não assume regras sem fonte.']
   ]}
  ]},
 somdas6:{
  label:'O Som das Seis',source:'Resumo de apoio • sem PDF de escudo localizado',
  url:null,groups:[
   {title:'Preparação rápida',items:[
    ['Confronto','Acompanhe PV, Defesa, ataque, iniciativa e armas dos PDJs vinculados.'],
    ['Narrativa','Use Investigação e Anotações para manter pistas, cenas e consequências.'],
    ['Referência','Consulte o livro do sistema para as regras e tabelas completas.']
   ]}
  ]}
};
// Completa os lembretes sem replicar os PDFs licenciados.
for(const [key,groups] of Object.entries(GM_SHIELD_ADDITIONAL_GROUPS)){
 if(GM_SHIELDS[key])GM_SHIELDS[key].groups=[...GM_SHIELDS[key].groups,...groups];
}
export const getGmShieldKey=(system)=>{
 const name=String(system||'').trim();
 const aliases={fabulaUltima:'fabula',t20:'tormenta20',tormenta:'tormenta20',
  '3detVictory':'3det',dnd:'dnd5e',dnd55:'dnd5e',
  ordem:'ordemParanormal',ordemparanormal:'ordemParanormal',
  som6:'somdas6',rota_zero:'rotaZero',rotazero:'rotaZero'};
 const key=aliases[name]||name;
 return Object.prototype.hasOwnProperty.call(GM_SHIELDS,key)?key:null;
};
export const getGmShield=system=>GM_SHIELDS[getGmShieldKey(system)]||null;
