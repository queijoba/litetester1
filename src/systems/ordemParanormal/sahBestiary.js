// Sobrevivendo ao Horror (2024): consulta de ameaças a partir do PDF do Drive.
// Seções de novas criaturas, ameaças da Realidade e encontro da missão O Terminal do Fim.
// Não inclui longas transcrições de poderes; ações e exceções permanecem nas páginas citadas.
// Formato: nome, elementos, VD, página impressa, PV, Defesa, AGI/FOR/INT/PRE/VIG, categoria.
const rows=[
 ['Sepultado','Morte',20,127,50,16,'13013','Criatura'],
 ['Mescla','Sangue',60,129,100,21,'33112','Criatura'],
 ['Espectro Inesquecido','Energia / Conhecimento / Morte',220,133,340,27,'21332','Criatura'],
 ['Derretido','Sangue',80,135,140,23,'14014','Criatura'],
 ['O Uivar','Energia',100,137,100,20,'3-331','Criatura'],
 ['Melancolia','Conhecimento / Sangue / Morte',140,140,200,29,'4-431','Criatura'],
 ['Quibungo','Sangue',160,143,320,34,'44134','Criatura'],
 ['Profundo','Energia / Sangue',200,146,380,34,'44222','Criatura'],
 ['O Memento Mori','Morte',260,149,650,44,'11333','Criatura'],
 ['Rascunho','Conhecimento / Energia',300,151,750,48,'22552','Criatura'],
 ['Medusa','Conhecimento / Morte',320,153,380,50,'55453','Criatura'],
 ['Amigo Imaginário','Morte / Sangue',360,156,1000,56,'55354','Criatura'],
 ['Bêbado Local','Nenhum',10,158,6,12,'11001','Pessoa'],
 ['Burocrata','Nenhum',10,159,6,11,'11221','Pessoa'],
 ['Fazendeiro Isolado','Nenhum',20,159,16,16,'12122','Pessoa'],
 ['Investigador','Nenhum',40,160,68,18,'21212','Pessoa'],
 ['Médico','Nenhum',20,160,14,13,'11221','Pessoa'],
 ['Religioso','Nenhum',40,161,32,15,'11231','Pessoa'],
 ['Predador Sofisticado','Nenhum',60,162,60,21,'33231','Pessoa'],
 ['Caçador de Gente','Nenhum',80,162,80,23,'23113','Pessoa'],
 ['Artista da Morte','Nenhum',140,163,150,27,'31331','Pessoa'],
 ['Ariranha','Nenhum',20,163,32,16,'21012','Animal'],
 ['Cavalo','Nenhum',10,164,12,13,'13012','Animal'],
 ['Enxame de Tocandiras','Nenhum',20,164,22,16,'10010','Animal'],
 ['Gorila','Nenhum',40,165,70,19,'23013','Animal'],
 ['Leão','Nenhum',60,165,80,18,'33022','Animal'],
 ['Lobo','Nenhum',20,166,18,15,'33012','Animal'],
 ['Touro','Nenhum',20,166,38,15,'13012','Animal'],
 ['Urso Pardo','Nenhum',60,167,90,19,'13023','Animal'],
 ['O Terminal','Morte',260,217,700,28,'05245','Criatura']
];
export const ORDEM_SAH_BESTIARY=rows.map(([nome,elemento,vd,pagina,pv,defesa,attr,categoria])=>({
 nome,elemento,vd,fonte:'Sobrevivendo ao Horror',pagina:String(pagina),categoria,
 atributos:Object.fromEntries(['agi','for','int','pre','vig'].map((key,i)=>[key,attr[i]==='-'?0:Number(attr[i])])),
 status:{pvAtual:pv,pvMax:pv,defesa},
 descricao:'Referência resumida de Sobrevivendo ao Horror, p. '+pagina+'. Consulte o livro para ações, rituais, enigmas, condições e alterações especiais.',
 dadosParciais:true,type:'ameaca'
}));
