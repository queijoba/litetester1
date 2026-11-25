// Catálogo inicial: modelos autorais, não transcrição de livros comerciais.
export const SYSTEMS={dnd5e:'D&D 5.5e',dragonbane:'Dragonbane',ordemParanormal:'Ordem Paranormal',skyfall:'Skyfall',fabula:'Fábula Última','3det':'3D&T Victory',somdas6:'O Som das Seis',rotaZero:'Rota Zero'};
export const canonical=s=>s==='ordem'?'ordemParanormal':s;
const common=[
 ['Corda','Equipamentos','Para escalada, amarração e resgate.'],['Lanterna','Equipamentos','Fonte de luz; confira combustível ou duração.'],['Mochila','Equipamentos','Para transportar suprimentos.'],['Rações','Consumíveis','Suprimento de viagem.'],['Bandagens','Consumíveis','Material de primeiros socorros.'],['Ferramentas de reparo','Ferramentas','Para manutenção e improviso.'],['Garrafa de água','Consumíveis','Reserva de água.'],['Mapa','Equipamentos','Registre região e detalhes.']
];
const dnd=[
 ['Espada longa','Armas','Versátil (1d10).','1d8','Cortante','15 PO'],['Espada curta','Armas','Leve, acuidade.','1d6','Perfurante','10 PO'],['Adaga','Armas','Leve, acuidade, arremesso.','1d4','Perfurante','2 PO'],['Machado de mão','Armas','Leve, arremesso.','1d6','Cortante','5 PO'],['Arco curto','Armas','Munição, duas mãos.','1d6','Perfurante','25 PO'],['Arco longo','Armas','Munição, pesado, duas mãos.','1d8','Perfurante','50 PO'],['Cajado','Armas','Versátil (1d8).','1d6','Contundente','2 PP'],['Maça','Armas','Corpo a corpo.','1d6','Contundente','5 PO'],['Lança','Armas','Arremesso, versátil (1d8).','1d6','Perfurante','1 PO'],['Armadura de couro','Armaduras','CA 11 + modificador de DES.','','','10 PO'],['Cota de malha','Armaduras','CA 16; confira requisitos e furtividade.','','','75 PO'],['Escudo','Escudos','+2 CA quando equipado.','','','10 PO'],['Flechas','Munições','Registre quantidade.'],['Poção de cura','Consumíveis','Recupera 2d4 + 2 PV.','','','50 PO'],['Espada +1','Itens mágicos','+1 nas jogadas de ataque e dano; confirme a configuração.'],['Anel encantado','Itens mágicos','Modelo: defina efeito, raridade e sintonização.'],['Ferramentas de ladrão','Ferramentas','Conjunto para fechaduras e armadilhas.']
];
const variants={
 dragonbane:[['Espada larga','Armas','Modelo de espada; confira dano e requisito.'],['Espada curta','Armas','Modelo de arma de uma mão.'],['Faca','Armas','Arma pequena.'],['Arco longo','Armas','Arma à distância.'],['Besta','Armas','Arma à distância; confira recarga.'],['Machado','Armas','Arma corpo a corpo.'],['Cajado','Armas','Arma de duas mãos.'],['Couro fervido','Armaduras','Registre proteção e revés.'],['Cota de malha','Armaduras','Registre proteção e revés.'],['Elmo','Armaduras','Registre proteção e revés.'],['Escudo','Escudos','Registre proteção e propriedades.'],['Aljava','Munições','Recipiente de munição.'],['Grimório','Equipamentos','Registre os feitiços contidos.'],['Relíquia antiga','Itens mágicos','Modelo de tesouro ou relíquia; defina efeito.']],
 ordemParanormal:[['Faca','Armas','Modelo corpo a corpo.'],['Bastão','Armas','Modelo corpo a corpo.'],['Revólver','Armas','Preencha dano e alcance conforme a mesa.'],['Pistola','Armas','Preencha dano e alcance conforme a mesa.'],['Espingarda','Armas','Preencha dano e alcance conforme a mesa.'],['Munição curta','Munições','Registre categoria e espaços.'],['Munição longa','Munições','Registre categoria e espaços.'],['Proteção leve','Armaduras','Registre defesa e categoria.'],['Proteção pesada','Armaduras','Registre defesa, categoria e proficiência.'],['Kit de perícia','Ferramentas','Escolha a perícia.'],['Componentes ritualísticos','Equipamentos','Escolha elemento e categoria.'],['Objeto amaldiçoado','Itens paranormais','Modelo para maldição, elemento e custo.']],
 skyfall:[['Espada','Armas','Modelo de arma; defina dados e descritores.'],['Lança','Armas','Modelo de arma.'],['Arco','Armas','Modelo de arma à distância.'],['Adaga','Armas','Modelo de arma pequena.'],['Armadura leve','Armaduras','Defina defesa e descritores.'],['Armadura pesada','Armaduras','Defina defesa e restrições.'],['Escudo','Escudos','Defina propriedades.'],['Fragmento especial','Itens mágicos','Modelo de objeto com propriedade especial.'],['Kit de exploração','Ferramentas','Defina conteúdo e volume.']],
 fabula:[['Espada pesada','Armas','Modelo: precisão, dano e propriedades a definir.'],['Lança','Armas','Modelo: precisão e dano a definir.'],['Adaga','Armas','Modelo de arma leve.'],['Cajado arcano','Armas','Modelo para conjurador.'],['Pistola','Armas','Modelo de arma à distância.'],['Arco','Armas','Modelo de arma à distância.'],['Traje de viagem','Armaduras','Defina Defesa, Defesa Mágica e Iniciativa.'],['Armadura rúnica','Armaduras','Defina Defesa, Defesa Mágica e Iniciativa.'],['Escudo rúnico','Escudos','Defina propriedades defensivas.'],['Amuleto elemental','Acessórios','Escolha elemento e efeito especial.'],['Anel de foco','Acessórios','Defina propriedade e preço.'],['Arma rara','Itens mágicos','Modelo de equipamento raro; defina qualidade e preço.']],
 '3det':[['Espada de ferro','Armas','Item narrativo; sem bônus automático.'],['Pistola','Armas','Item narrativo; sem bônus automático.'],['Arco','Armas','Item narrativo; sem bônus automático.'],['Colete','Armaduras','Item narrativo; sem bônus automático.'],['Escudo','Escudos','Item narrativo; sem bônus automático.'],['Kit médico','Consumíveis','Modelo de utilidade.'],['Comunicador','Equipamentos','Modelo de utilidade.'],['Anel de proteção','Artefatos','Defina efeitos, custo em XP e requisitos.'],['Espada flamejante','Artefatos','Defina efeitos, custo em XP e requisitos.'],['Manto de ocultação','Artefatos','Defina efeitos, custo em XP e requisitos.'],['Cristal de energia','Artefatos','Defina efeitos, custo em XP e requisitos.']],
 somdas6:[['Revólver','Armas','Modelo: registre dano e munição.'],['Rifle','Armas','Modelo: registre alcance e dano.'],['Espingarda','Armas','Modelo: registre dano.'],['Faca','Armas','Modelo corpo a corpo.'],['Coldre','Equipamentos','Acessório de transporte.'],['Cartuchos','Munições','Registre quantidade.'],['Sela','Equipamentos','Equipamento de montaria.'],['Kit de ferraria','Ferramentas','Modelo de ferramenta.']],
 rotaZero:[['Lanterna de mão','Equipamentos','Iluminação portátil.'],['Rádio portátil','Equipamentos','Comunicação de curta distância.'],['Kit de reparo','Ferramentas','Manutenção de emergência.'],['Mapa físico','Equipamentos','Orientação quando o sinal falha.'],['Pé de cabra','Ferramentas','Ferramenta de emergência.'],['Bateria reserva','Consumíveis','Suprimento elétrico.'],['Kit de primeiros socorros','Consumíveis','Material de emergência.'],['Objeto anômalo','Itens paranormais','Modelo: defina efeito e risco com o mestre.']]
};
export function itemCatalog(system){
 const s=canonical(system);
 const entries=s==='dnd5e'?dnd:variants[s]||[];
 const shared=s==='fabula'?common.filter(x=>x[1]!=='Consumíveis'):common;
 return [...entries,...shared].map(([nome,categoria,desc,dano='',tipoDano='',preco=''],i)=>({id:s+'-item-'+i,nome,categoria,desc,dano,tipoDano,preco,quantidade:1,raridade:categoria==='Artefatos'?'Raro':'Comum',espacos:1,modificacoes:[],fonte:s==='dnd5e'&&i<15?'D&D SRD 5.2.1 — CC BY 4.0; resumo PJLite':'Modelo original PJLite • confira as regras'}));
}
export const itemNote=x=>[x.desc,x.dano&&('Dano: '+x.dano+' '+(x.tipoDano||'')),x.preco&&('Preço: '+x.preco),x.raridade&&('Raridade: '+x.raridade),...(x.modificacoes||[]).map(m=>m.tipo+': '+m.nome+(m.efeito?' — '+m.efeito:''))].filter(Boolean).join(' | ');
const append=(a,x)=>[...(Array.isArray(a)?a:[]),x];
const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now()+'-'+Math.random().toString(36).slice(2);
export function addItemToSheet(data,item){
 if(data?.type!=='pc'||!item?.nome?.trim())return {ok:false,message:'Selecione um personagem e dê um nome ao item.'};
 const s=canonical(data.system),qty=Math.max(1,Math.min(999,Math.floor(Number(item.quantidade)||1))),nome=item.nome.trim(),notas=itemNote(item),extra={bibliotecaItemId:item.id,modificacoes:(item.modificacoes||[]).map(x=>({...x}))};
 const row={nome,quantidade:qty,notas,...extra};
 let next={...data};
 if(s==='dnd5e'){
  const arma=item.categoria==='Armas',syncId=uid();
  next.itensSincronizados=append(data.itensSincronizados,{...row,syncId,tipo:arma?'Arma':'Equipamento',bonusAtaque:'',dano:item.dano||'',tipoDano:item.tipoDano||'',sincronizarAtaque:arma});
  if(arma)next.ataques=append(data.ataques,{nome,bonus:'',dano:item.dano||'',tipo:item.tipoDano||'',sourceItemId:syncId});
 }else if(s==='dragonbane'){
  if(item.categoria==='Armas')next.armas=append(data.armas,{nome,empunhadura:'',alcance:'',dano:item.dano||'',tracos:notas,...extra});
  else next.inventario=[String(data.inventario||''),...Array.from({length:qty},()=>nome+(notas?' — '+notas:''))].filter(Boolean).join('\n');
 }else if(s==='ordemParanormal')next.inventario=append(data.inventario,{...row,categoria:String(item.categoriaOrdem||'0'),espacos:Math.max(0,Number(item.espacos)||0),desc:notas});
 else if(s==='skyfall')next.equipamentos=append(data.equipamentos,{...row,volume:item.volume||'',fragmentos:item.preco||'',descritores:notas});
 else if(s==='fabula'||s==='somdas6')next.inventario=append(data.inventario,row);
 else if(s==='3det')next.inventario=append(data.inventario,{...row,raridade:item.raridade||'Comum'});
 else if(s==='rotaZero'){
  const slots=[...(Array.isArray(data.inventario)?data.inventario:[]),'','','',''].slice(0,4);
  const free=slots.map((v,i)=>!String(v||'').trim()?i:-1).filter(i=>i>=0);
  if(free.length<qty)return {ok:false,message:'Inventário Rota Zero sem espaços livres suficientes.'};
  free.slice(0,qty).forEach(i=>{slots[i]=nome+(notas?' — '+notas:'')});next.inventario=slots;
 }else return {ok:false,message:'Sistema não suportado.'};
 return {ok:true,data:next,message:'Item adicionado à ficha. Confira regras e equipamentos em uso.'};
}
