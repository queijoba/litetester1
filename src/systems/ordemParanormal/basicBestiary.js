// Índice de fichas do Livro Básico Ordem Paranormal RPG v1.3.
// Conferência na edição PDF do Drive: capítulo 7, páginas impressas 182–289.
// Dados resumidos para seleção; ações, enigmas e condições completas ficam no livro.
// Formato: nome, elemento(s), VD, página, PV, Defesa, AGI/FOR/INT/PRE/VIG, deslocamento.
// Elemento "Nenhum" indica ameaça da Realidade; não é elemento paranormal.
const cri=[
 ['Aberração de Carne','Sangue',40,182,70,19,'13013','9 m'],
 ['Aniquilação','Sangue',380,186,1200,58,'45345','15 m'],
 ['Carente','Sangue',300,188,700,40,'44234','12 m'],
 ['Dama de Sangue','Sangue',60,190,105,20,'23122','12 m'],
 ['Enpap-X','Sangue / Conhecimento',180,193,360,36,'24123','12 m'],
 ['Kerberos','Sangue',340,194,1150,46,'45035','18 m'],
 ['Minotauro','Sangue',280,197,750,44,'45135','12 m'],
 ['Mulher Afogada','Sangue',140,199,240,28,'43223','9 m'],
 ['Titã de Sangue','Sangue',220,201,550,35,'25114','12 m'],
 ['Zumbi de Sangue','Sangue',20,202,45,17,'22012','9 m'],
 ['Zumbi de Sangue Bestial','Sangue',100,203,200,23,'23023','12 m'],
 ['Diabo','Sangue / Conhecimento',400,206,1666,66,'66666','18 m'],
 ['Aracnasita','Morte',80,209,140,23,'32112','12 m'],
 ['Carniçal Preto da Morte','Morte',200,211,400,38,'44333','12 m'],
 ['Ceifador Espiral','Morte',380,213,999,58,'55555','15 m'],
 ['Enraizado','Morte',120,214,140,28,'33113','9 m'],
 ['Escutado','Morte',160,216,290,29,'43123','12 m'],
 ['Esqueleto de Lodo','Morte',20,217,40,14,'22011','6 m'],
 ['Marionete','Morte',280,219,700,40,'35152',''],
 ['Múmia Xipófaga','Morte',240,221,400,35,'54234','9 m'],
 ['Nidere','Morte',320,224,800,50,'55345','24 m'],
 ['Sempiternal','Morte',360,226,990,53,'55454','12 m'],
 ['Succ','Morte',40,227,65,20,'42011','12 m'],
 ['Deus da Morte','Morte / Conhecimento',400,230,2000,60,'66557','15 m'],
 ['Anjo','Conhecimento',380,234,1111,57,'45555',''],
 ['Bicho-Papão','Conhecimento',300,237,750,41,'54354','15 m'],
 ['Espreitador','Conhecimento',220,238,500,34,'42332','12 m'],
 ['Estrangeiro','Conhecimento',340,241,750,50,'35553',''],
 ['Existido','Conhecimento',20,242,36,13,'11422','9 m'],
 ['Lembrado','Conhecimento',100,243,180,22,'22422','9 m'],
 ['Ocioso','Conhecimento',260,244,390,37,'15153',''],
 ['Parasita de Culpa','Conhecimento',60,246,90,15,'20441','6 m'],
 ['Rastejador Sombrio','Conhecimento',180,248,330,41,'43333','12 m'],
 ['Silhueta','Conhecimento',360,250,500,55,'44554','12 m'],
 ['Vulto','Conhecimento',40,251,60,19,'42221','12 m'],
 ['Máscara do Desespero','Conhecimento',400,254,1200,55,'44665',''],
 ['Anárquico','Energia',20,257,30,21,'32001','9 m'],
 ['Anárquico Descontrolado','Energia',120,259,120,28,'43223','12 m'],
 ['Anomalia','Energia',380,261,1000,null,null,'0 m'],
 ['Anomiático','Energia',240,263,600,41,'53143','18 m'],
 ['Ciborgue','Energia / Sangue',80,265,160,25,'33223','9 m'],
 ['Infecticídio','Energia',280,267,600,25,'35115','9 m'],
 ['Perturbado de Energia','Energia',40,268,60,19,'41000','9 m'],
 ['Sukkalgir','Energia',160,269,220,34,'32332',''],
 ['Telopsia','Energia',340,271,560,48,'42352','12 m'],
 ['Tempestuoso','Energia',360,273,950,56,'54254','24 m'],
 ['Viajante','Energia',200,274,360,34,'42342','9 m'],
 ['Anfitrião','Energia / Conhecimento / Medo',413,278,1413,59,'75665','12 m'],
 ['Degolificada','Sangue / Morte / Conhecimento / Energia / Medo',320,282,850,45,'35344','6 m']
];
const rea=[
 ['Bandido',10,284,8,14,'22111','9 m','Pessoa'],
 ['Capanga',20,284,17,13,'22112','9 m','Pessoa'],
 ['Soldado de Aluguel',40,284,25,18,'22112','9 m','Pessoa'],
 ['Assassino',80,285,90,26,null,'9 m','Pessoa'],
 ['Comandante Mercenário',120,285,145,29,null,'9 m','Pessoa'],
 ['Iniciado',20,286,15,16,null,'9 m','Pessoa'],
 ['Líder de Culto',140,286,150,27,null,'9 m','Pessoa'],
 ['Investido',40,286,35,17,null,'9 m','Pessoa'],
 ['Policial',20,287,15,19,null,'9 m','Pessoa'],
 ['Policial de Elite',60,287,40,27,null,'9 m','Pessoa'],
 ['Chefe de Polícia',100,287,105,25,null,'9 m','Pessoa'],
 ['Cão de Guarda',10,288,12,14,null,'12 m','Animal'],
 ['Enxame de Ratos',10,288,15,13,null,'9 m','Animal'],
 ['Enxame de Abelhas',10,288,10,15,null,'6 m','Animal'],
 ['Jacaré',40,288,40,16,null,'9 m','Animal'],
 ['Javaporco',20,289,55,16,null,'12 m','Animal'],
 ['Sucuri',40,289,35,14,null,'9 m','Animal'],
 ['Onça-Pintada',40,289,68,16,null,'12 m','Animal']
];
const a=c=>c?Object.fromEntries(['agi','for','int','pre','vig'].map((key,i)=>[key,Number(c[i])||0])):undefined;
const make=(name,elemento,vd,pagina,pv,defesa,attrs,deslocamento,categoria)=>({
 nome:name,vd,elemento,categoria,fonte:'Livro Básico v1.3',pagina:String(pagina),
 ...(attrs?{atributos:a(attrs)}:{}),
 status:{pvAtual:pv,pvMax:pv,...(defesa==null?{defesa:''}:{defesa}),...(deslocamento?{deslocamento}:{})},
 descricao:'Referência de consulta do Livro Básico v1.3, p. '+pagina+'. Os ataques, efeitos especiais e enigmas completos devem ser consultados na fonte.',
 dadosParciais:true, tipo:'ameaca',type:'ameaca'
});
export const ORDEM_BASIC_BESTIARY=[
 ...cri.map(x=>make(...x,'Criatura')),
 ...rea.map(([nome,vd,pagina,pv,defesa,attrs,deslocamento,categoria])=>make(nome,'Nenhum',vd,pagina,pv,defesa,attrs,deslocamento,categoria))
];
