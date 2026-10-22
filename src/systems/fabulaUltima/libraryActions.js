// Inserção não destrutiva de conteúdo Fabula Ultima na ficha atual.
const clone=x=>JSON.parse(JSON.stringify(x));
const norm=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function applyFabulaLibrarySelection(current,entry,kind){
 if(current?.system!=='fabula'||current?.type!=='pc'||!entry?.nome||entry.tipo!==kind)throw Error('Referência incompatível com a ficha.');
 const data=clone(current);
 data.classes=Array.isArray(data.classes)?data.classes:[];
 data.poderesHeroicos=Array.isArray(data.poderesHeroicos)?data.poderesHeroicos:[];
 data.suplementos={...(data.suplementos||{}),basico:true};
 const match=()=>data.classes.find(x=>norm(x?.nome)===norm(entry.classe));
 if(kind==='classe'){
  if(data.classes.some(x=>norm(x?.nome)===norm(entry.nome)))return {data:current,changed:false,message:'Classe já presente na ficha.'};
  let empty=data.classes.findIndex(x=>!String(x?.nome||'').trim()&&!(x?.poderes||[]).length&&!String(x?.beneficios||'').trim());
  const value={nome:entry.nome,nivel:1,beneficios:'Consulte '+entry.fonte+' • p. '+entry.pagina,poderes:[]};
  if(empty>=0)data.classes[empty]=value;else data.classes.push(value);
 }else if(kind==='poder'){
  const cl=match();
  if(!cl)return {data:current,changed:false,message:'Adicione primeiro a classe '+entry.classe+' para incluir este poder.'};
  cl.poderes=Array.isArray(cl.poderes)?cl.poderes:[];
  if(cl.poderes.some(x=>norm(x?.nome)===norm(entry.nome)))return {data:current,changed:false,message:'Poder já presente nessa classe.'};
  cl.poderes.push({nome:entry.nome,nivel:1,desc:entry.desc,fonte:entry.fonte,pagina:entry.pagina,referenciaId:entry.id});
 }else if(kind==='heroico'){
  if(data.poderesHeroicos.some(x=>norm(x?.nome)===norm(entry.nome)))return {data:current,changed:false,message:'Poder heroico já presente.'};
  data.poderesHeroicos.push({nome:entry.nome,desc:entry.desc,fonte:entry.fonte,pagina:entry.pagina,referenciaId:entry.id});
 }else if(kind==='feitico'){
  data.extras={...(data.extras||{})};
  data.extras.magia={disciplinas:[],feiticos:[],rituais:[],...(data.extras.magia||{})};
  const spells=data.extras.magia.feiticos=Array.isArray(data.extras.magia.feiticos)?data.extras.magia.feiticos:[];
  if(spells.some(x=>norm(x?.nome)===norm(entry.nome)&&norm(x?.disciplina)===norm(entry.disciplina)))return {data:current,changed:false,message:'Feitiço já registrado.'};
  spells.push({nome:entry.nome,disciplina:entry.disciplina||'',ofensiva:!!entry.ofensiva,teste:'',pm:entry.pm||'',alvos:'',duracao:'',desc:entry.desc,fonte:entry.fonte,pagina:entry.pagina,referenciaId:entry.id});
  data.extras.magia.disciplinas=Array.isArray(data.extras.magia.disciplinas)?data.extras.magia.disciplinas:[];
  if(entry.disciplina&&!data.extras.magia.disciplinas.some(x=>norm(x)===norm(entry.disciplina)))data.extras.magia.disciplinas.push(entry.disciplina);
  data.extrasAtivos=Array.isArray(data.extrasAtivos)?data.extrasAtivos:[];
  if(!data.extrasAtivos.includes('magia'))data.extrasAtivos.push('magia');
 }else throw Error('Categoria não disponível.');
 if(entry.source&&entry.source!=='basico')data.suplementos[entry.source]=true;
 return {data,changed:true,message:entry.nome+' adicionado(a). Revise requisitos e efeitos completos em '+entry.fonte+', p. '+entry.pagina+'.'};
}
