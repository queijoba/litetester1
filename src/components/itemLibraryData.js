// Catálogo inicial. Os modelos autorais devem ser conferidos com o livro da mesa.
export const SYSTEM_NAMES={dnd5e:'D&D 5.5e',dragonbane:'Dragonbane',ordemParanormal:'Ordem Paranormal',skyfall:'Skyfall',fabula:'Fábula Última','3det':'3D&T Victory',somdas6:'O Som das Seis',rotaZero:'Rota Zero'};
export const CATEGORIES=['Arma','Armadura','Escudo','Acessório','Consumível','Munição','Ferramenta','Equipamento','Artefato'];
export const RARITIES=['Comum','Incomum','Raro','Muito raro','Lendário','Personalizado'];
export const fold=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const newItem=system=>({system,nome:'',categoria:'Equipamento',raridade:'Comum',origem:'Pessoal',fonte:'Modelo pessoal',desc:'',peso:'',preco:'',dano:'',tipoDano:'',quantidade:1,modificacoes:[]});
const srd=[
 ['Adaga','Arma','1d4','Perfurante','2 PO','Acuidade, leve, arremesso'],
 ['Espada curta','Arma','1d6','Perfurante','10 PO','Acuidade, leve'],
 ['Espada longa','Arma','1d8','Cortante','15 PO','Versátil (1d10)'],
 ['Espadão','Arma','2d6','Cortante','50 PO','Pesada, duas mãos'],
 ['Machadinha','Arma','1d6','Cortante','5 PO','Leve, arremesso'],
 ['Machado de batalha','Arma','1d8','Cortante','10 PO','Versátil (1d10)'],
 ['Maça','Arma','1d6','Contundente','5 PO','Arma simples'],
 ['Clava','Arma','1d4','Contundente','1 PP','Leve'],
 ['Lança','Arma','1d6','Perfurante','1 PO','Arremesso, versátil (1d8)'],
 ['Cajado','Arma','1d6','Contundente','2 PP','Versátil (1d8)'],
 ['Arco curto','Arma','1d6','Perfurante','25 PO','Munição, duas mãos'],
 ['Arco longo','Arma','1d8','Perfurante','50 PO','Munição, pesada, duas mãos'],
 ['Besta leve','Arma','1d8','Perfurante','25 PO','Munição, recarga, duas mãos'],
 ['Armadura acolchoada','Armadura','','','5 PO','CA 11 + DES; desvantagem em Furtividade'],
 ['Armadura de couro','Armadura','','','10 PO','CA 11 + DES'],
 ['Couro batido','Armadura','','','45 PO','CA 12 + DES'],
 ['Camisão de malha','Armadura','','','50 PO','CA 13 + DES (máx. 2)'],
 ['Cota de malha','Armadura','','','75 PO','CA 16; FOR 13; desvantagem em Furtividade'],
 ['Armadura de placas','Armadura','','','1500 PO','CA 18; FOR 15; desvantagem em Furtividade'],
 ['Escudo','Escudo','','','10 PO','+2 CA enquanto equipado'],
 ['Poção de cura','Consumível','','','50 PO','Recupera 2d4 + 2 PV'],
 ['Flechas (20)','Munição','','','1 PO','Pacote de 20 flechas'],
 ['Virotes (20)','Munição','','','1 PO','Pacote de 20 virotes'],
 ['Corda','Equipamento','','','1 PO','Corda de 50 pés'],
 ['Mochila','Equipamento','','','2 PO','Recipiente para transportar objetos'],
 ['Tocha','Equipamento','','','1 PC','Fonte de luz'],
 ['Rações (1 dia)','Consumível','','','5 PP','Alimento para um dia'],
 ['Gazuas','Ferramenta','','','25 PO','Ferramentas de ladrão'],
 ['Kit de curandeiro','Ferramenta','','','5 PO','Dez usos; consulte a regra de estabilização'],
 ['Foco arcano','Equipamento','','','','Escolha o foco e preço correspondente'],
 ['Arma +1','Artefato','','','','+1 às jogadas de ataque e dano'],
 ['Escudo +1','Artefato','','','','+1 adicional na CA']
].map(([nome,categoria,dano,tipoDano,preco,desc],i)=>({...newItem('dnd5e'),id:'srd-item-'+i,nome,categoria,dano,tipoDano,preco,desc,raridade:categoria==='Artefato'?'Incomum':'Comum',origem:'SRD',fonte:'SRD 5.2.1 • CC BY 4.0 • Wizards of the Coast'}));
const models={
 dragonbane:[
 ['Espada','Arma','Escolha perícia, dano e empunhadura.'],['Adaga','Arma','Confirme alcance e traços.'],['Arco longo','Arma','Registre alcance, dano e flechas.'],['Lança','Arma','Escolha a variante e os traços.'],['Cajado','Arma','Registre dano e empunhadura.'],['Armadura de couro','Armadura','Defina proteção e reveses.'],['Elmo','Armadura','Registre proteção.'],['Escudo','Escudo','Defina variante e propriedades de aparar.'],['Tocha','Equipamento','Fonte de luz.'],['Corda','Equipamento','Defina comprimento.'],['Gazuas','Ferramenta','Ferramentas para fechaduras.'],['Pederneira','Ferramenta','Acender uma fogueira.'],['Aljava','Equipamento','Recipiente para flechas.'],['Flechas','Munição','Registre quantidade.'],['Ração','Consumível','Provisões de exploração.'],['Relíquia antiga','Artefato','Personalize efeito e condição de uso.','Raro']],
 ordemParanormal:[
 ['Pistola','Arma','Registre dano, crítico, alcance, categoria e munição.'],['Revólver','Arma','Confira estatísticas no livro.'],['Faca','Arma','Modelo de arma branca.'],['Bastão','Arma','Registre dano e crítico.'],['Espingarda','Arma','Registre categoria e munição.'],['Munição curta','Munição','Defina usos e espaços.'],['Proteção leve','Armadura','Registre defesa, categoria e espaços.'],['Proteção pesada','Armadura','Confira proficiência e penalidades.'],['Lanterna','Equipamento','Iluminação.'],['Kit de perícia','Ferramenta','Escolha perícia associada.'],['Instrumentos médicos','Ferramenta','Defina usos e categoria.'],['Componente ritualístico','Consumível','Escolha elemento.'],['Amuleto paranormal','Artefato','Registre elemento e maldição.'],['Arma modificada','Arma','Adicione modificações e revise categoria.'],['Proteção amaldiçoada','Armadura','Registre maldição e requisitos.']],
 skyfall:[
 ['Espada','Arma','Defina dano e descritores.'],['Adaga','Arma','Modelo de lâmina curta.'],['Machado','Arma','Modelo de arma pesada.'],['Arco','Arma','Modelo de arma à distância.'],['Cajado','Arma','Modelo de arma ou foco.'],['Armadura leve','Armadura','Defina proteção, volume e descritores.'],['Armadura pesada','Armadura','Defina proteção e requisitos.'],['Escudo','Escudo','Registre proteção e volume.'],['Corda','Equipamento','Equipamento de exploração.'],['Tocha','Equipamento','Iluminação.'],['Kit de ferramentas','Ferramenta','Escolha especialidade.'],['Ração','Consumível','Provisões.'],['Flechas','Munição','Controle quantidade.'],['Fragmento encantado','Artefato','Defina efeito e valor.'],['Pingente de Opath','Acessório','Acessório personalizável.']],
 fabula:[
 ['Espada de aventureiro','Arma','Defina precisão, dano e propriedade.'],['Espada pesada','Arma','Modelo de arma de duas mãos.'],['Cajado arcano','Arma','Defina atributos de precisão e dano.'],['Adaga ágil','Arma','Modelo de arma rápida.'],['Arco de caça','Arma','Defina precisão e alcance.'],['Lança de guarda','Arma','Defina precisão e dano.'],['Armadura de viagem','Armadura','Defina Defesa, Defesa Mágica e Iniciativa.'],['Armadura marcial','Armadura','Confira proficiência marcial.'],['Escudo leve','Escudo','Defina defesas.'],['Anel arcano','Acessório','Escolha uma propriedade especial.'],['Amuleto elemental','Acessório','Escolha propriedade e tipo de dano.'],['Botas do viajante','Acessório','Acessório personalizável.'],['Relíquia de cristal','Artefato','Crie propriedades e preço em zenites.','Raro'],['Bolsa de viagem','Equipamento','Objeto permanente; não é consumível gerado com PI.']],
 '3det':[
 ['Espada de ferro','Arma','Equipamento narrativo; bônus especiais exigem efeito definido.'],['Arco','Arma','Ataques à distância.'],['Escudo','Escudo','Descreva a proteção.'],['Armadura leve','Armadura','Sem bônus automático.'],['Kit médico','Ferramenta','Material para Medicina.'],['Corda e gancho','Equipamento','Exploração.'],['Lanterna','Equipamento','Iluminação.'],['Provisões','Consumível','Suprimentos.'],['Ferramentas de reparo','Ferramenta','Utilidade para Máquinas.'],['Anel de proteção','Artefato','Defina efeito e custo.','Incomum'],['Espada flamejante','Artefato','Escolha efeito, restrições e custo em XP.','Raro'],['Capa de camuflagem','Artefato','Escolha efeito de furtividade.','Incomum'],['Cristal de energia','Artefato','Personalize recuperação de recursos.','Raro'],['Botas velozes','Artefato','Personalize movimento ou efeito.','Incomum']],
 somdas6:[
 ['Revólver','Arma','Preencha dano, munição e recarga.'],['Rifle','Arma','Modelo de arma longa.'],['Espingarda','Arma','Modelo de arma de fogo.'],['Faca','Arma','Modelo de arma branca.'],['Munição de revólver','Munição','Controle quantidade.'],['Munição de rifle','Munição','Controle quantidade.'],['Cinto de munições','Equipamento','Transporte.'],['Corda','Equipamento','Utilidade de viagem.'],['Lampião','Equipamento','Iluminação.'],['Kit de medicina','Ferramenta','Defina usos e custos.'],['Ferramentas de ferraria','Ferramenta','Equipamento de trabalho.'],['Rações','Consumível','Provisões.'],['Sela','Equipamento','Equipamento de montaria.'],['Arma de estimação','Arma','Registre modificações.']],
 rotaZero:[
 ['Lanterna','Equipamento','Iluminação.'],['Rádio portátil','Equipamento','Comunicação.'],['Mapa rodoviário','Equipamento','Consulta de rotas.'],['Kit de primeiros socorros','Ferramenta','Material médico.'],['Chave inglesa','Ferramenta','Manutenção de veículo.'],['Fita isolante','Ferramenta','Reparos improvisados.'],['Pé de cabra','Ferramenta','Alavanca.'],['Garrafa de água','Consumível','Hidratação.'],['Ração de emergência','Consumível','Suprimento.'],['Pilhas','Consumível','Energia.'],['Faca utilitária','Ferramenta','Corte.'],['Gravador de fita','Equipamento','Registre ocorrências.'],['Fragmento do Ponto Zero','Artefato','Defina risco e efeito anômalo.','Raro']]
};
export const ITEM_LIBRARY=[...srd,...Object.entries(models).flatMap(([system,rows])=>rows.map(([nome,categoria,desc,raridade],i)=>({...newItem(system),id:system+'-modelo-'+i,nome,categoria,desc,raridade:raridade||'Comum',origem:'Modelo PJLite',fonte:'Modelo original editável • confira o livro da mesa'})))];
const arr=x=>Array.isArray(x)?x:[];
export const itemNotes=item=>[item.desc,item.dano?'Dano: '+item.dano+' '+(item.tipoDano||''):'',item.preco?'Preço: '+item.preco:'',item.defesa?'Defesa: '+item.defesa:'',item.custo?'Custo: '+item.custo:'',item.requisitos?'Requisitos: '+item.requisitos:'',...arr(item.modificacoes).filter(x=>x.nome||x.efeito).map(x=>[x.tipo,x.nome,x.efeito,x.custo?'Custo: '+x.custo:''].filter(Boolean).join(' — ')),item.fonte].filter(Boolean).join('\n');
const num=(x,f)=>x!==''&&x!=null&&Number.isFinite(Number(x))?Math.max(0,Number(x)):f;
export const inventoryKey=s=>({dnd5e:'itensSincronizados',dragonbane:'dragonbaneInventory',skyfall:'equipamentos'})[s]||'inventario';
export function insertLibraryItem(data,item,id){
 if(!data||data.type!=='pc'||data.system!==item.system||!String(item.nome||'').trim())throw Error('Selecione uma ficha do mesmo sistema e informe o nome.');
 const n=Math.max(1,Math.min(999,Math.floor(Number(item.quantidade)||1))),nome=item.nome.trim(),notas=itemNotes(item),meta={bibliotecaItem:{...item,nome,quantidade:n},bibliotecaItemId:id};
 const add=(key,row)=>({...data,[key]:[...arr(data[key]),row]});
 switch(data.system){
 case 'dnd5e':return add('itensSincronizados',{...meta,syncId:id,nome,quantidade:n,tipo:['Arma','Armadura','Escudo','Consumível','Ferramenta'].includes(item.categoria)?item.categoria:'Equipamento',bonusAtaque:'',dano:item.dano||'',tipoDano:item.tipoDano||'',notas,sincronizarAtaque:false});
 case 'dragonbane':return add('dragonbaneInventory',{...meta,nome,quantidade:n,peso:num(item.peso,1),notas});
 case 'ordemParanormal':return add('inventario',{...meta,nome,categoria:String(item.categoriaOrdem||'0'),espacos:num(item.peso,1),quantidade:n,desc:notas});
 case 'skyfall':return add('equipamentos',{...meta,nome,quantidade:n,volume:String(item.peso??''),fragmentos:String(item.preco??''),descritores:notas});
 case 'fabula':case 'somdas6':return add('inventario',{...meta,nome,quantidade:n,notas});
 case '3det':return add('inventario',{...meta,nome,quantidade:n,raridade:['Comum','Incomum','Raro'].includes(item.raridade)?item.raridade:'Raro',notas});
 case 'rotaZero':{
  const slots=arr(data.inventario).slice(0,4);while(slots.length<4)slots.push('');
  const i=slots.findIndex(x=>!String(x||'').trim());if(i<0)throw Error('Os quatro espaços do inventário estão ocupados.');
  slots[i]=nome+(n>1?' ×'+n:'')+(notas?' — '+notas.replace(/\n/g,'; '):'');
  return {...data,inventario:slots};
 }
 default:throw Error('Sistema não suportado.');
 }
}
export function sheetItems(data){
 return arr(data?.[inventoryKey(data.system)]).flatMap((x,index)=>{
  if(typeof x==='string')return x.trim()?[{...newItem(data.system),nome:x,origem:'Ficha',index}]:[];
  if(!x?.nome?.trim())return [];
  return [{...newItem(data.system),...(x.bibliotecaItem||{}),nome:x.nome,quantidade:x.quantidade??1,raridade:x.raridade||x.bibliotecaItem?.raridade||'Comum',peso:x.peso??x.espacos??x.volume??x.bibliotecaItem?.peso??'',preco:x.fragmentos??x.bibliotecaItem?.preco??'',desc:x.bibliotecaItem?.desc??x.notas??x.desc??x.descritores??'',dano:x.dano??x.bibliotecaItem?.dano??'',tipoDano:x.tipoDano??x.bibliotecaItem?.tipoDano??'',categoriaOrdem:x.categoria??x.bibliotecaItem?.categoriaOrdem,categoria:x.bibliotecaItem?.categoria||x.tipo||'Equipamento',origem:'Ficha',index}];
 });
}
export function updateLibraryItem(data,item,id){
 const key=inventoryKey(data.system),rows=arr(data[key]),old=rows[item.index];
 if(old===undefined)throw Error('Item não encontrado.');
 const single=insertLibraryItem({...data,[key]:data.system==='rotaZero'?['','','','']:[]},item,old?.bibliotecaItemId||old?.syncId||id)[key][0];
 const replacement=typeof old==='string'?single:{...old,...single};
 if(data.system==='dnd5e'&&old.sincronizarAtaque){replacement.sincronizarAtaque=replacement.tipo==='Arma';replacement.bonusAtaque=old.bonusAtaque;const ataques=arr(data.ataques).filter(a=>a.sourceItemId!==old.syncId);if(replacement.sincronizarAtaque)ataques.push({nome:replacement.nome,bonus:replacement.bonusAtaque,dano:replacement.dano,tipo:replacement.tipoDano,sourceItemId:replacement.syncId});return {...data,[key]:rows.map((x,i)=>i===item.index?replacement:x),ataques};}
 return {...data,[key]:rows.map((x,i)=>i===item.index?replacement:x)};
}
