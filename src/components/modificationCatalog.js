// Modelos de consulta PJLite. Exemplos autorais são orientações, não regras oficiais.
import {canonical,SYSTEMS} from './equipmentCatalog.js';
const generic=[
 ['Melhoria','Reforço estrutural','Arma, armadura ou ferramenta','Defina se aumenta durabilidade, defesa ou resistência; registre o custo e os limites.'],
 ['Propriedade','Leve e portátil','Equipamento','Defina se reduz peso, volume ou espaços; respeite os limites de carga.'],
 ['Propriedade','Uso especializado','Ferramenta ou equipamento','Defina a tarefa específica, o requisito de uso e o eventual benefício.'],
 ['Melhoria','Qualidade superior','Equipamento','Defina o que foi aprimorado e quanto custa; não acumule bônus sem autorização.'],
 ['Maldição','Vínculo indesejado','Objeto especial','O objeto possui uma ligação difícil de romper. Defina gatilho, consequência e forma de remoção.']
];
const systems={
 dnd5e:[
 ['Encantamento','Arma +1','Arma','Concede +1 nas jogadas de ataque e dano com a arma.','Raridade incomum; consulte o item mágico no SRD.','D&D SRD 5.2.1 — CC BY 4.0'],
 ['Encantamento','Arma +2','Arma','Concede +2 nas jogadas de ataque e dano com a arma.','Raridade rara; consulte o item mágico no SRD.','D&D SRD 5.2.1 — CC BY 4.0'],
 ['Encantamento','Arma +3','Arma','Concede +3 nas jogadas de ataque e dano com a arma.','Raridade muito rara; consulte o item mágico no SRD.','D&D SRD 5.2.1 — CC BY 4.0'],
 ['Encantamento','Armadura +1','Armadura','Concede +1 à CA enquanto a armadura está equipada.','Raridade rara.','D&D SRD 5.2.1 — CC BY 4.0'],
 ['Encantamento','Escudo +1','Escudo','Concede +1 adicional à CA enquanto o escudo é empunhado, além da proteção normal.','Raridade incomum.','D&D SRD 5.2.1 — CC BY 4.0'],
 ['Propriedade','Sintonização','Item mágico','Registre se o item exige sintonização, quem pode fazê-la e suas limitações.','Consulte as regras de itens mágicos.','D&D SRD 5.2.1 — referência'],
 ['Maldição','Lâmina possessiva','Arma mágica','Modelo: a lâmina resiste à separação; defina a condição que ativa a maldição e o método de remoção.']
 ],
 dragonbane:[
 ['Melhoria','Fio bem cuidado','Arma cortante','Modelo: registre uma manutenção ou reforço da lâmina; decida se há efeito mecânico.','Confira Manufatura, equipamento e autorização do mestre.'],
 ['Melhoria','Empunhadura reforçada','Arma','Modelo: defina benefício de manejo e condição de uso.'],
 ['Propriedade','Proteção trabalhada','Armadura ou elmo','Registre proteção e reveses revisados; não altere os valores sem aprovação.'],
 ['Encantamento','Relíquia rúnica','Objeto mágico','Defina o feitiço vinculado, custo em PD, ativação e requisito.'],
 ['Maldição','Fardo ancestral','Relíquia','Escolha uma consequência narrativa ou condição, seu gatilho e a forma de desfazê-la.']
 ],
 ordemParanormal:[
 ['Melhoria','Mira ajustada','Arma de disparo','Modelo: confira quais modificações de mira são permitidas e registre efeito e alcance.','Confira categoria, limite de modificações e livro de equipamento.'],
 ['Melhoria','Empunhadura adaptada','Arma','Modelo de adaptação física; confira a modificação correspondente e o aumento de categoria.'],
 ['Melhoria','Proteção reforçada','Proteção','Modelo: registre a alteração defensiva e seu custo de categoria.'],
 ['Propriedade','Ferramenta especializada','Equipamento geral','Defina perícia, uso e categoria conforme o equipamento escolhido.'],
 ['Maldição','Vínculo de Sangue','Arma ou acessório','Modelo autoral: defina efeito, elemento Sangue, requisito e consequência. Não equivale a uma maldição oficial.'],
 ['Maldição','Eco de Conhecimento','Item paranormal','Modelo autoral: defina manifestação, efeito, elemento e preço da maldição.'],
 ['Maldição','Distorção de Energia','Item paranormal','Modelo autoral: defina gatilho imprevisível, efeito e custo.'],
 ['Maldição','Marca de Morte','Item paranormal','Modelo autoral: defina manifestação, restrição, custo e elemento.']
 ],
 skyfall:[
 ['Melhoria','Arma aprimorada','Arma','Modelo: revise dados, descritores e limites conforme as regras da arma.'],
 ['Propriedade','Descritor elemental','Arma ou objeto','Registre descritor e efeito autorizado pelo mestre; não mude o dano automaticamente.'],
 ['Melhoria','Proteção adaptada','Armadura','Registre defesa, volume e restrições conforme as regras.'],
 ['Encantamento','Fragmento vinculado','Equipamento','Modelo: defina propriedade do fragmento, ativação e custos.'],
 ['Maldição','Objeto de mau presságio','Item especial','Modelo de objeto amaldiçoado; não confunda com as maldições de personagem da biblioteca de habilidades.']
 ],
 fabula:[
 ['Melhoria','Precisão refinada','Arma','Modelo de equipamento raro: defina alteração de precisão e custo.'],
 ['Melhoria','Dano refinado','Arma','Modelo de equipamento raro: defina alteração de dano, preço e requisitos.'],
 ['Propriedade','Afinidade elemental','Arma ou acessório','Defina elemento, gatilho e propriedade especial; confira limites de construção.'],
 ['Propriedade','Proteção rara','Armadura ou escudo','Defina Defesa, Defesa Mágica, Iniciativa e qualidade especial.'],
 ['Encantamento','Qualidade especial','Equipamento raro','Defina uma qualidade aprovada, seu efeito e preço em zenit.','Confira as regras de equipamentos raros.'],
 ['Maldição','Preço oculto','Equipamento raro','Modelo narrativo: associe uma restrição ou consequência à qualidade; combine com o mestre.']
 ],
 '3det':[
 ['Melhoria','Item incomum','Equipamento','Modelo para registrar utilidade ou propriedade incomum; confira a regra correspondente.'],
 ['Propriedade','Item raro','Equipamento','Defina efeito, condições de uso e raridade segundo a mesa.'],
 ['Encantamento','Artefato com um efeito','Artefato','Escolha um efeito permitido e registre seu preço em XP e condições.','Consulte a vantagem Artefato e as regras de itens.'],
 ['Encantamento','Artefato com efeitos adicionais','Artefato','Adicione cada efeito separadamente e confira o custo total em XP; não presume um preço fixo.'],
 ['Propriedade','Ativação por recurso','Artefato','Registre o recurso exigido, frequência, duração e efeito.'],
 ['Maldição','Artefato instável','Artefato','Modelo: determine o inconveniente e o gatilho; não atribua desconto em XP automaticamente.']
 ],
 somdas6:[
 ['Melhoria','Manutenção de arma','Arma','Modelo para registrar reparo, confiabilidade e condição da arma; valide com o mestre.'],
 ['Melhoria','Mira regulada','Arma','Modelo de ajuste narrativo; defina eventual efeito conforme as regras.'],
 ['Propriedade','Equipamento de montaria','Equipamento','Defina adaptação da sela ou bolsa e seu uso.'],
 ['Propriedade','Ferramenta artesanal','Ferramenta','Registre especialidade, qualidade e condição.'],
 ['Maldição','Objeto de azar','Objeto especial','Modelo narrativo para um objeto de má sorte; não altera cartas ou tormentos por padrão.']
 ],
 rotaZero:[
 ['Melhoria','Bateria ampliada','Equipamento eletrônico','Registre duração adicional e consumo; combine a regra com o mestre.'],
 ['Melhoria','Reparo de emergência','Equipamento','Defina o reparo realizado, condição e duração.'],
 ['Propriedade','Isolamento térmico','Equipamento','Registre proteção contra frio ou calor; defina limites narrativos.'],
 ['Propriedade','Adaptação de veículo','Ferramenta ou veículo','Defina melhoria e registre no espaço de upgrades do veículo, quando aplicável.'],
 ['Maldição','Contaminação por Ruído','Objeto anômalo','Modelo: defina gatilho, interferência e consequência, sem aplicar Pânico ou Pressão automaticamente.'],
 ['Maldição','Sinal recorrente','Objeto anômalo','Modelo: defina uma manifestação repetitiva e condições de isolamento.']
 ]
};
export const MODIFICATION_TYPES=['Melhoria','Maldição','Encantamento','Propriedade'];
export function modificationCatalog(system){
 const s=canonical(system);if(!SYSTEMS[s])return [];
 return [...(systems[s]||[]),...generic].map(([categoria,nome,aplicavel,desc,requisito='',fonte='Modelo original PJLite • guia de criação'],i)=>({id:s+'-mod-'+i,system:s,categoria,nome,aplicavel,desc,requisito,fonte,custo:'A conferir nas regras / definir com o mestre'}));
}
export function modificationFromPreset(preset){
 if(!preset||!MODIFICATION_TYPES.includes(preset.categoria))return null;
 return {tipo:preset.categoria,nome:preset.nome,efeito:[preset.desc,preset.requisito&&('Requisito: '+preset.requisito),preset.custo&&('Custo: '+preset.custo),'Fonte: '+preset.fonte].filter(Boolean).join(' | '),bibliotecaModId:preset.id};
}
