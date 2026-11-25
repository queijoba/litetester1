// Dados fornecidos pelo usuário, mantidos no navegador. Não há envio de PDF ou pacote.
export const IMPORT_SYSTEMS=['dnd5e','fabula','skyfall'];
const key=system=>'pjlite.private.bestiary.v1.'+system;
const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
const list=x=>Array.isArray(x)?x:[];
const str=x=>typeof x==='string'?x:'';
const num=x=>Number.isFinite(Number(x))?Number(x):0;
const clean=x=>JSON.parse(JSON.stringify(x,(k,v)=>['__proto__','constructor','prototype'].includes(k)?undefined:v));
const named=x=>list(x).filter(obj).map(x=>({...x,nome:str(x.nome),desc:str(x.desc)}));
export function normalizePrivateThreat(x,system){
 if(!IMPORT_SYSTEMS.includes(system)||!obj(x)||x.system!==system||x.type==='pc'||!str(x.nome).trim())throw Error('Ficha inválida ou sistema diferente.');
 const s=clean(x);s.id='';s.type='ameaca';s.fonte=str(s.fonte)||'Importação pessoal';
 if(system==='dnd5e'){
  if(!obj(s.atributos)||!['for','des','con','int','sab','car'].every(k=>Number.isFinite(Number(s.atributos[k])))||!str(s.ca)||!str(s.pv)||!str(s.desafio))throw Error('D&D: faltam atributos, CA, PV ou ND em '+s.nome);
  for(const k of ['tracos','acoes','acoesBonus','reacoes','acoesLendarias'])s[k]=named(s[k]);
  for(const k of ['tamanho','tipo','alinhamento','deslocamento','testesResistencia','pericias','vulnerabilidades','resistencias','imunidadesDano','imunidadesCondicao','sentidos','idiomas','proficienciaBonus'])s[k]=str(s[k]);
 }else if(system==='fabula'){
  if(!obj(s.atributos)||!['des','ast','vig','von'].every(k=>/^d(6|8|10|12)$/.test(s.atributos[k]))||!obj(s.status)||!Number.isFinite(Number(s.status.pvMax)))throw Error('Fábula: faltam dados essenciais em '+s.nome);
  s.nivel=num(s.nivel);s.patente=str(s.patente)||'Soldado';s.especie=str(s.especie)||'Humanoide';s.tipoNpc='Ameaça';
  s.status={...s.status,pvAtual:num(s.status.pvMax),pmAtual:num(s.status.pmMax)};
  s.afinidades=obj(s.afinidades)?s.afinidades:{};
  for(const k of ['ataques','feiticos','poderes','outrasAcoes','regrasEspeciais'])s[k]=named(s[k]);
 }else{
  if(!obj(s.atributos)||!['for','des','con','int','sab','car'].every(k=>Number.isFinite(Number(s.atributos[k])))||!obj(s.status)||!Number.isFinite(Number(s.status.pvMax)))throw Error('Skyfall: faltam dados essenciais em '+s.nome);
  s.nivelDesafio=num(s.nivelDesafio);s.status={...s.status,pvAtual:num(s.status.pvMax)};
  for(const k of ['pericias','ataques','habilidades','reacoes'])s[k]=named(s[k]);
 }
 return s;
}
export function parsePrivatePack(text,system){
 const root=JSON.parse(String(text).replace(/^\uFEFF/,'').trim());const rows=Array.isArray(root)?root:root.items;
 if(!Array.isArray(rows)||!rows.length||rows.length>1500)throw Error('Selecione um pacote JSON com 1 a 1500 fichas.');
 const accepted=[],errors=[];
 for(const row of rows){try{accepted.push(normalizePrivateThreat(row,system));}catch(e){errors.push(e.message);}}
 if(!accepted.length)throw Error(errors[0]||'Nenhuma ficha válida.');
 return {items:accepted,errors};
}
export function mergePrivateThreats(current,incoming){
 const out=new Map();for(const x of [...current,...incoming])out.set([x.system,x.nome.toLowerCase().trim(),x.fonte].join('|'),x);return [...out.values()];
}
export function readPrivateThreats(system){try{return parsePrivatePack(localStorage.getItem(key(system))||'[]',system).items;}catch{return [];}}
export function writePrivateThreats(system,items){localStorage.setItem(key(system),JSON.stringify(items));}
export function clearPrivateThreats(system){localStorage.removeItem(key(system));}
