import {initialRotaZeroThreatData} from './threatData.js';

// Referência autorizada: Rota Zero v0.5 (material original do projeto).
// Resumos editoriais próprios; os números são apenas os fornecidos pelo manual.
// Quando o manual não define P/T/F ou PV, não inventamos estatísticas.
const clone=value=>JSON.parse(JSON.stringify(value));
const pair=value=>({atual:value||0,max:value||0});
const row=(nome,categoria,papel,pressao,defesa,pv,dano,sinal,efeito,saida,pagina)=>{
 const base=clone(initialRotaZeroThreatData);
 return {
  ...base,nome,categoria,papel,
  codigo:'RZ v0.5 · p. '+pagina,fonte:'Rota Zero v0.5',pagina,
  descricao:sinal,atributos:{pulso:0,tecnica:0,firmeza:0},
  defesa:defesa??0,pressao,
  recursos:{vitalidade:pair(pv),foco:pair(0),adrenalina:pair(0)},
  ataques:dano?[{nome:'Confronto',dano,desc:'Dano de referência do manual; combate é um último recurso.'}]:[],
  habilidades:[{nome:defesa===null?'Anomalia sem PV':'Sinal de aproximação',desc:sinal},
   {nome:'Consequência',desc:efeito}],
  fraquezas:[{nome:'Forma de evitar ou escapar',desc:saida}],
  acoes:[{nome:'Pressão da ameaça',desc:'Aplicar Pressão '+pressao+' quando o gatilho narrativo ocorrer.'}],
  notas:'Referência: Rota Zero v0.5, página '+pagina+'.\nConsequência: '+efeito+'\nSaída: '+saida
 };
};
export const MODELOS_ROTA_ZERO_BESTIARIO=[
 row('O Retrovisor','Anomalia','Sentinela',2,null,0,null,'Um rosto estranho só pode ser visto no espelho do veículo.','Distrai quem dirige; um erro pode provocar pânico ou colisão.','Ocultar o espelho e prosseguir até um marco reconhecível.',38),
 row('Passageiro Vazio','Criatura','Predador',2,12,18,'2D6','O banco traseiro mostra sinais de alguém que não entrou.','Drena aquecimento e torna qualquer conversa inquietante.','Parar sob luz forte, abrir as portas e afastar-se do carro.',38),
 row('Marco Zero','Anomalia','Sentinela',1,null,0,null,'O mesmo marco quilométrico reaparece durante a viagem.','Prende o grupo numa repetição que consome tempo.','Alterar conscientemente um hábito da rota para quebrar o ciclo.',38),
 row('Olhos na Neve','Animal','Predador',1,9,14,'1D6+2','Pontos luminosos vigiam além do alcance dos faróis.','Ataca na parada e pode deixar o grupo sem iluminação.','Manter-se em movimento e usar sinalizadores para abrir distância.',38),
 row('Caminhão Sem Cabine','Anomalia','Perseguidor',2,null,0,null,'Um veículo pesado se aproxima sem ter onde deveria estar o motorista.','Força desvios perigosos; colisão compromete o veículo.','Apagar os faróis na curva ou sair da pista antes do terceiro sinal.',39),
 row('A Entrega 47','Anomalia','Sentinela',2,null,0,null,'Um pacote responde aos sons captados pelo rádio.','O prazo vencido intensifica a pressão psicológica.','Desviar conscientemente a encomenda do destino indicado.',39),
 row('Cliente Sem Sombra','NPC','Comum',1,6,0,null,'Um cliente comum projeta uma sombra incompatível com a luz.','Saber o nome verdadeiro do funcionário torna os próximos encontros mais perigosos.','Usar um apelido, identificação funcional ou entregar sem conversar.',39),
 row('Sinal 00.0','Anomalia','Sentinela',2,null,0,null,'Uma estação impossível ocupa o rádio e insiste em permanecer sintonizada.','Absorve foco ou provoca pânico enquanto oferece informações.','Cortar a alimentação elétrica do rádio, não apenas desligá-lo.',40),
 row('Casa de Uma Porta','Anomalia','Sentinela',2,null,0,null,'A geometria interior da residência não corresponde à fachada.','Separar a equipe altera as rotas e amplia o perigo.','Todos atravessarem a mesma passagem ao mesmo tempo.',40),
 row('Servo da Ponte','Criatura','Chefe',2,12,24,'2D6','Uma figura baixa bloqueia o acesso à travessia.','Imobiliza o veículo e ataca com grande força.','Evitar parar cedo, sinalizar três vezes e mudar a trajetória.',40),
 row('Neblina de Retorno','Anomalia','Perseguidor',1,null,0,null,'O GPS informa que o depósito está sempre logo adiante.','Troca lembranças de pistas por versões enganosas.','Guiar-se por mapa físico e recusar atalhos improváveis.',41),
 row('A Fome do Asfalto','Anomalia','Chefe',3,null,0,null,'As rachaduras da pista parecem se contrair como mandíbulas.','Desgasta o veículo enquanto ele permanece preso.','Aliviar a carga ou alcançar uma superfície rochosa.',41),
 row('Boca da Serra','Anomalia','Chefe',3,null,0,null,'Luzes na montanha compõem uma figura impossível.','Cada entrega concluída no padrão alimenta a anomalia.','Romper deliberadamente a sequência de entregas ou a rota.',41),
];

const npc=(nome,funcao,especialidade,conf,segredo,pagina)=>{
 const m=clone(initialRotaZeroThreatData);
 return {...m,nome,categoria:'NPC',papel:'Aliado',codigo:'RZ v0.5 · p. '+pagina,
  fonte:'Rota Zero v0.5',pagina,descricao:funcao,
  atributos:{pulso:0,tecnica:0,firmeza:0},recursos:{vitalidade:pair(0),foco:pair(0),adrenalina:pair(0)},
  habilidades:[{nome:'Especialidade',desc:especialidade},{nome:'Confiança',desc:conf+'/3; pode variar com as ações do grupo.'}],
  notas:'NPC do manual Rota Zero v0.5, p. '+pagina+'.\nSEGREDO DO MESTRE: '+segredo+'\nSem atributos e PV especificados no livro.'};
};
export const MODELOS_ROTA_ZERO_NPCS=[
 npc('Pico-6','Atendente e reparador do posto de estrada.','Abastecimento e reparos básicos.',1,'Evita trafegar tarde depois de reconhecer um mesmo caminhão duas vezes.',35),
 npc('Sena','Responsável pela máquina-loja à beira da estrada.','Gravações e informações locais.',0,'Possui registros visuais que antecedem a passagem dos personagens.',35),
 npc('Oro-3','Despachante do depósito.','Manifestos e cronogramas.',1,'Conhece remessas inexplicáveis que surgem prontas.',35),
 npc('Mara-12','Mecânica de oficina.','Consertos e melhorias veiculares.',0,'Já examinou componentes automotivos de procedência impossível.',36),
 npc('Brum','Técnico da torre meteorológica.','Clima e transmissão de sinais.',0,'Registra um mesmo fenômeno atmosférico há tempo demais.',36),
];
