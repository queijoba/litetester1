export const RZ_SKILLS = [
  ['conducao','Condução','dirigir, manobrar, perseguir/fugir com veículo'],
  ['manutencao','Manutenção','reparos, eletrônica simples, improviso mecânico'],
  ['navegacao','Navegação','mapas, rotas, orientação, GPS'],
  ['observacao','Observação','sons, pegadas, detalhes e inconsistências'],
  ['sobrevivencia','Sobrevivência','clima, abrigo, frio, trilha'],
  ['influencia','Influência','negociar, acalmar, mentir, convencer'],
  ['infiltracao','Infiltração','furtividade, fechaduras simples, entrar/sair sem ser notado'],
  ['logistica','Logística','carga, prazos, organização, inventário'],
  ['pesquisa','Pesquisa','arquivos, terminais, padrões, documentos'],
  ['primeirosSocorros','Primeiros Socorros','estancar ferimentos, estabilizar alguém, avaliar trauma físico'],
];

export const RZ_ADVANTAGES = [
  { id:'cabecaFria', nome:'Cabeça Fria', custo:1, tipo:'Reação, 1/cena', efeito:'Quando receber Pressão, reduza-a em 1 antes de escolher perder FOC ou marcar Pânico.' , resumo:'Reduz 1 Pressão (1/cena).' },
  { id:'maosOficina', nome:'Mãos de Oficina', custo:1, tipo:'Passiva', efeito:'Reparos de emergência levam metade do tempo; em Meta Estendida de reparo, o primeiro sucesso vale 2.' , resumo:'Reparo mais rápido; 1º sucesso vale 2.' },
  { id:'memoriaRotas', nome:'Memória de Rotas', custo:1, tipo:'Passiva', efeito:'Ganho em Navegação para voltar por uma rota já percorrida.' , resumo:'Ganho ao retornar por rotas conhecidas.' },
  { id:'bolsoEscondido', nome:'Bolso Escondido', custo:1, tipo:'Passiva', efeito:'1 item pequeno não ocupa Espaço de Inventário e passa despercebido em inspeções casuais.' , resumo:'1 item pequeno não ocupa espaço.' },
  { id:'durao', nome:'Durão', custo:2, tipo:'Passiva', efeito:'+5 Vitalidade máxima.' , resumo:'+5 de Vitalidade máxima.' },
  { id:'reservaFoco', nome:'Reserva de Foco', custo:2, tipo:'Passiva', efeito:'+10 Foco máximo.' , resumo:'+10 de Foco máximo.' },
  { id:'autocontrole', nome:'Autocontrole', custo:1, tipo:'Reação, 1/turno', efeito:'Ignore 1 ponto de FOC de um custo de Vantagem ou Pressão; nunca reduz abaixo de 0.' , resumo:'Ignora 1 FOC de custo/Pressão (1/turno).' },
  { id:'reflexosEntrega', nome:'Reflexos de Entrega', custo:1, tipo:'Reação, 1/cena', efeito:'Ganho na primeira tentativa de fugir de uma ameaça.' , resumo:'Ganho na 1ª fuga de uma ameaça (1/cena).' },
  { id:'redeContatos', nome:'Rede de Contatos', custo:1, tipo:'Ação, 1/sessão', efeito:'Declare um NPC comum que conhece você; ele pode oferecer informação, abrigo curto ou um favor pequeno.' , resumo:'Contato oferece ajuda (1/sessão).' },
  { id:'leitorRuido', nome:'Leitor de Ruído', custo:2, tipo:'Passiva', efeito:'Você reconhece transmissão/placa contaminada por Ruído, mas ainda precisa investigar seu significado.' , resumo:'Reconhece sinais contaminados por Ruído.' },
];

export const RZ_DEFECTS = [
  { id:'esgotado', nome:'Esgotado', ganho:1, efeito:'Ao terminar uma cena com FOC abaixo de Técnica, sofre Perda no primeiro teste da cena seguinte.' },
  { id:'barulhento', nome:'Barulhento', ganho:1, efeito:'Perda em Infiltração sempre que silêncio for importante.' },
  { id:'fotossensivel', nome:'Fotossensível', ganho:1, efeito:'Luz intensa ou reflexos estranhos causam Pressão +1 uma vez por cena.' },
  { id:'lentoAcordar', nome:'Lento para Acordar', ganho:1, efeito:'No primeiro teste físico após longos minutos parado, Perda.' },
  { id:'codigoRigido', nome:'Código Rígido', ganho:1, efeito:'Defina uma regra de conduta. Quebrá-la marca 1 Pânico.' },
  { id:'memoriaFalha', nome:'Memória Falha', ganho:1, efeito:'Uma vez por sessão, o mestre pode negar uma lembrança recente; teste Firmeza 9 para recuperá-la.' },
  { id:'nervosFlor', nome:'Nervos à Flor', ganho:1, efeito:'Ao chegar a 3 Pânico, sua inquietação denuncia sua posição ou intenção.' },
  { id:'fobia', nome:'Fobia', ganho:1, efeito:'Escolha um gatilho. A primeira exposição por cena tem Pressão +1.' },
];

export const RZ_KITS = [
  { id:'motorista', nome:'Motorista de Rota', attrs:{pulso:1,tecnica:3,firmeza:2}, skills:['conducao','navegacao'], advantages:['reflexosEntrega'], item:'mapa físico marcado à mão' },
  { id:'mecanico', nome:'Mecânico de Plantão', attrs:{pulso:1,tecnica:2,firmeza:2}, skills:['manutencao','logistica','observacao'], advantages:['maosOficina'], item:'kit de reparo' },
  { id:'batedor', nome:'Batedor de Estrada', attrs:{pulso:1,tecnica:3,firmeza:1}, skills:['observacao','navegacao','infiltracao'], advantages:['memoriaRotas'], item:'binóculo ou lanterna forte' },
  { id:'despachante', nome:'Despachante de Campo', attrs:{pulso:2,tecnica:2,firmeza:1}, skills:['influencia','logistica','pesquisa'], advantages:['redeContatos'], item:'rádio portátil' },
  { id:'socorrista', nome:'Socorrista de Turno', attrs:{pulso:1,tecnica:2,firmeza:2}, skills:['primeirosSocorros','sobrevivencia','observacao'], advantages:['cabecaFria'], item:'kit de primeiros socorros' },
];

export const initialRotaZeroPcData = {
  id:'', system:'rotaZero', type:'pc',
  bio:{ nome:'', jogador:'', idade:'', conceito:'', kit:'', imagem:'' },
  atributos:{ pulso:1, tecnica:1, firmeza:1 },
  recursos:{ adrenalina:{atual:1,max:1}, foco:{atual:5,max:5}, vitalidade:{atual:5,max:5} },
  panico:[false,false,false,false],
  traumas:[false,false,false],
  interferencia:0,
  pericias:{},
  vantagens:[],
  defeitos:[],
  inventario:['','','',''],
  ancora:'',
  notas:'',
  contratacao:{ horaExtra:false, creditosExtras:0 },
  veiculoAtivo:false,
  veiculo:{
    nome:'', modelo:'', placaId:'', manejo:2, tracao:2, casco:2,
    combustivel:6, integridade:6, aquecimento:4,
    cargaCompartimentos:'', upgradesSlots:'', avariasReparos:'', entregas:0, tempoTurno:'', despesas:'', rotaAtual:'', destino:'', desvios:'', radioMensagens:'', pistasIncidentes:''
  },
  meta:{ rotaZero:true }
};

const clone=v=>JSON.parse(JSON.stringify(v));
export function normalizeRotaZeroPcData(item){
  const source=clone(item||{});
  if(source.system!=='rotaZero'||(source.type||'pc')!=='pc') return source;
  const base=clone(initialRotaZeroPcData);
  const out={...base,...source};
  out.bio={...base.bio,...(source.bio||{})};
  out.atributos={...base.atributos,...(source.atributos||{})};
  out.recursos={...base.recursos,...(source.recursos||{})};
  for(const k of ['adrenalina','foco','vitalidade']) out.recursos[k]={...base.recursos[k],...(source.recursos?.[k]||{})};
  out.pericias={...base.pericias,...(source.pericias||{})};
  out.vantagens=Array.isArray(source.vantagens)?source.vantagens:[];
  out.defeitos=Array.isArray(source.defeitos)?source.defeitos:[];
  out.inventario=Array.isArray(source.inventario)?[...source.inventario,'','','',''].slice(0,4):clone(base.inventario);
  out.panico=Array.isArray(source.panico)?[...source.panico,false,false,false,false].slice(0,4):clone(base.panico);
  out.traumas=Array.isArray(source.traumas)?[...source.traumas,false,false,false].slice(0,3):clone(base.traumas);
  out.interferencia=Math.max(0,Math.min(6,Number(source.interferencia||0)));
  out.contratacao={...base.contratacao,...(source.contratacao||{})};
  out.contratacao.horaExtra=!!out.contratacao.horaExtra;
  out.contratacao.creditosExtras=Math.max(0,Math.min(99,Number(out.contratacao.creditosExtras||0)));
  out.veiculo={...base.veiculo,...(source.veiculo||{})};
  out.meta={...(source.meta||{}),rotaZero:true};
  return out;
}

export function calcRotaZeroCosts(data){
  const attrs=data?.atributos||{};
  const attrCost=['pulso','tecnica','firmeza'].reduce((n,k)=>n+Math.max(0,Math.min(3,Number(attrs[k]||1))-1),0);
  const skillCost=RZ_SKILLS.reduce((n,[id])=>n+(data?.pericias?.[id]?1:0),0);
  const advantageCost=(data?.vantagens||[]).reduce((n,id)=>n+(RZ_ADVANTAGES.find(x=>x.id===id)?.custo||0),0);
  const defectGain=Math.min(2,(data?.defeitos||[]).length);
  const extraCredits=data?.contratacao?.horaExtra?Math.max(0,Math.min(99,Number(data?.contratacao?.creditosExtras||0))):0;
  const available=6+defectGain+extraCredits;
  return {base:6,attrCost,skillCost,advantageCost,defectGain,extraCredits,total:attrCost+skillCost+advantageCost,available,remaining:available-(attrCost+skillCost+advantageCost)};
}

export function syncRotaZeroResources(data){
  const out=normalizeRotaZeroPcData(data);
  const p=Math.max(1,Math.min(3,Number(out.atributos.pulso||1)));
  const t=Math.max(1,Math.min(3,Number(out.atributos.tecnica||1)));
  const f=Math.max(1,Math.min(3,Number(out.atributos.firmeza||1)));
  const extraVit=out.vantagens.includes('durao')?5:0;
  const extraFoc=out.vantagens.includes('reservaFoco')?10:0;
  out.recursos.adrenalina.max=p; out.recursos.adrenalina.atual=Math.min(Number(out.recursos.adrenalina.atual||p),p);
  out.recursos.foco.max=t*5+extraFoc; out.recursos.foco.atual=Math.min(Number(out.recursos.foco.atual||out.recursos.foco.max),out.recursos.foco.max);
  out.recursos.vitalidade.max=f*5+extraVit; out.recursos.vitalidade.atual=Math.min(Number(out.recursos.vitalidade.atual||out.recursos.vitalidade.max),out.recursos.vitalidade.max);
  return out;
}
