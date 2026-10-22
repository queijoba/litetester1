// Adaptadores de visualização para fichas de ameaça; não modificam os dados do jogo.
const val=(x,f='—')=>x===undefined||x===null||String(x).trim()===''?f:String(x);
const list=v=>Array.isArray(v)?v:[];
const normalizeItems=(arr,descriptionKeys=['desc','descricao','efeito','notas'])=>list(arr).map(x=>{
 if(typeof x==='string')return {nome:x,desc:''};
 const name=val(x?.nome??x?.titulo??x?.id,'').trim();
 const parts=descriptionKeys.map(k=>x?.[k]).filter(x=>x!==undefined&&x!==null&&String(x).trim());
 const other=[x?.dano&&'Dano '+x.dano,x?.bonus&&'Bônus '+x.bonus,x?.pm&&x.pm+' PM',x?.custo&&'Custo '+x.custo];
 return {nome:name,desc:[...other,...parts].filter(Boolean).join(' • ')};
}).filter(x=>x.nome||x.desc);
const stat=(title,value)=>({title,value:val(value)});
export function buildThreatCardData(data){
 const s=data?.status||{}, a=data?.atributos||{},sys=data?.system||'';
 const common={name:val(data?.nome,'Ameaça sem nome'),image:data?.imagem||data?.bio?.imagem||'',system:sys,subtitle:'',badge:'',stats:[],attributes:[],sections:[],details:[],summary:data?.descricao||data?.conceito||data?.tracos||'',extra:''};
 if(sys==='dnd5e'){
  common.subtitle=[data?.tamanho,data?.tipo,data?.alinhamento].filter(Boolean).join(' • ');
  common.badge='ND '+val(data?.desafio);
  common.stats=[stat('CA',data?.ca),stat('PV',data?.pv),stat('Mov.',data?.deslocamento)];
  common.attributes=['for','des','con','int','sab','car'].map(k=>stat(k.toUpperCase(),a[k]));
  common.details=[['Resistências',data?.resistencias],['Imunidades',data?.imunidadesDano],['Vulnerabilidades',data?.vulnerabilidades],['Condições imunes',data?.imunidadesCondicao],['Perícias',data?.pericias],['Sentidos',data?.sentidos],['Idiomas',data?.idiomas]].filter(v=>v[1]);
  common.sections=[['Traços',data?.tracos],['Ações',data?.acoes],['Ações Bônus',data?.acoesBonus],['Reações',data?.reacoes],['Ações Lendárias',data?.acoesLendarias]];
  common.summary='';
 }else if(sys==='fabula'){
  common.subtitle=[data?.especie,data?.tipoNpc].filter(Boolean).join(' • ');
  common.badge='Nível '+val(data?.nivel)+' • '+val(data?.patente);
  common.stats=[stat('PV',val(s.pvAtual)+' / '+val(s.pvMax)),stat('PM',val(s.pmAtual)+' / '+val(s.pmMax)),stat('Def.',s.defesa),stat('Def. M',s.defesaMagica),stat('Inic.',s.iniciativa),stat('Crise',Math.ceil(Number(s.pvMax||0)/2))];
  common.attributes=['des','ast','vig','von'].map(k=>stat(k.toUpperCase(),a[k]));
  common.details=[['Pontos de Ultima',data?.tipoNpc==='Vilão'?data?.pontosUltima:null],['Afinidades',Object.entries(data?.afinidades||{}).filter(([,v])=>v&&String(v).trim()).map(([k,v])=>k+': '+v).join(' • ')]].filter(v=>v[1]!==undefined&&v[1]!==null&&v[1]!=='');
  common.sections=[['Ataques',data?.ataques],['Feitiços',data?.feiticos],['Poderes',data?.poderes],['Outras ações',data?.outrasAcoes],['Regras especiais',data?.regrasEspeciais]];
 }else if(sys==='ordemParanormal'){
  common.subtitle=[data?.tipo,data?.categoria].filter(Boolean).join(' • ');
  common.badge='VD '+val(data?.vd??data?.valorDesafio??data?.nivel);
  common.stats=[stat('PV',data?.pv??s.pvAtual??s.pv),stat('Def.',data?.defesa??s.defesa),stat('Desloc.',data?.deslocamento??s.deslocamento)];
  common.attributes=['agi','for','int','pre','vig'].map(k=>stat(k.toUpperCase(),a[k])).filter(x=>x.value!=='—');
  common.sections=[['Ataques',data?.ataques],['Habilidades',data?.habilidades],['Poderes',data?.poderes],['Ações',data?.acoes],['Rituais',data?.rituais]];
 }else if(sys==='skyfall'){
  common.subtitle=[data?.tipo,data?.hierarquia,data?.arquetipo].filter(Boolean).join(' • ');
  common.badge='ND '+val(data?.nivelDesafio);
  common.stats=[stat('PV',val(s.pvAtual)+' / '+val(s.pvMax)),stat('Proteção',s.protecao),stat('RD',s.reducaoDano),stat('Inic.',s.iniciativa),stat('Mov.',s.deslocamento)];
  common.attributes=['for','con','des','sab','int','car'].map(k=>stat(k.toUpperCase(),a[k]));
  common.details=[['Resistências',data?.resistencias],['Vulnerabilidades',data?.vulnerabilidades]].filter(x=>x[1]);
  common.sections=[['Ataques',data?.ataques],['Habilidades',data?.habilidades],['Reações',data?.reacoes]];
 }else if(sys==='3det'){
  common.subtitle=[data?.categoria,data?.papel,data?.conceito].filter(Boolean).join(' • ');
  common.badge=val(data?.escala)+' • '+val(data?.pontos)+' pts';
  common.stats=[stat('PV',val(s.pv?.atual)+' / '+val(s.pv?.max)),stat('PM',val(s.pm?.atual)+' / '+val(s.pm?.max)),stat('PA',val(s.pa?.atual)+' / '+val(s.pa?.max))];
  common.attributes=[stat('P',a.poder),stat('H',a.habilidade),stat('R',a.resistencia)];
  common.sections=[['Ações',data?.acoes],['Vantagens',data?.vantagens],['Desvantagens',data?.desvantagens],['Técnicas',data?.tecnicas]];
  common.summary=data?.notas||common.summary;
 }else if(sys==='somdas6'){
  common.subtitle=val(data?.tipoPdj,'Personagem da Juíza');
  common.badge='NP '+val(data?.np);
  common.stats=[stat('PV',val(s.pvAtual)+' / '+val(s.pvMax)),stat('Def.',s.defesa),stat('Ações',s.acoes),stat('Ataque',s.ataqueBonus),stat('Inic.',s.iniciativaBonus)];
  common.sections=[['Armas',data?.armas],['Habilidades',data?.habilidades]];
  common.extra=data?.notas||'';
 }else{
  common.subtitle=val(data?.tipo||data?.categoria||data?.descricao,'Ameaça');
  common.badge=data?.nivel?'Nível '+data.nivel:'';
  common.stats=[stat('PV',s.pv?.atual??s.pvAtual??data?.pv),stat('Def.',data?.defesa??s.defesa)];
  common.sections=[['Ataques',data?.ataques],['Habilidades',data?.habilidades],['Ações',data?.acoes]];
 }
 common.sections=common.sections.map(([label,items])=>({label,items:normalizeItems(items)})).filter(x=>x.items.length);
 return common;
}
