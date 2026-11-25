import {findAbilityPresets} from './abilityPresetLibrary.js';
import {DRAGONBANE_LIBRARY} from '../systems/dragonbane/abilities.js';
import {FABULA_LIBRARY_CATALOG} from '../systems/fabulaUltima/libraryCatalog.js';
import {ORDEM_LIBRARY_CATALOG} from '../systems/ordemParanormal/libraryCatalog.js';
import {SKYFALL_LIBRARY_CATALOG} from '../systems/skyfall/libraryCatalog.js';
import {SYSTEM_LIBRARIES} from './otherSystemLibraryCatalog.js';
import {RZ_ADVANTAGES,RZ_DEFECTS,RZ_SKILLS} from '../systems/rotaZero/data.js';
import {SRD521_MONSTERS} from '../systems/dnd5e/srd521-monsters.js';
import {BOOK_THREAT_MODELS} from './bookThreatModels.js';
import {MODELOS_DRAGONBANE_BESTIARIO,MODELOS_DRAGONBANE_VARIANTES,MODELOS_DRAGONBANE_SOLO} from '../systems/dragonbane/bestiaryCatalog.js';
import {MODELOS_ORDEM_AMEACAS} from '../systems/ordemParanormal/threatModels.js';
import {MODELOS_SKYFALL_AMEACAS} from '../systems/skyfall/threatModels.js';
import {FABULA_LITE_EXAMPLES} from '../systems/fabulaUltima/liteThreatExamples.js';
import {MODELOS_3DET_LIVRO} from '../systems/3det/bookThreatCatalog.js';
import {MODELOS_3DET_AMEACAS} from '../systems/3det/threatModels.js';
import {MODELOS_SOM6_LIVRO_PDJ,MODELOS_SOM6_LIVRO_ANIMAIS} from '../systems/somDasSeis/bestiaryCatalog.js';
import {MODELOS_ROTA_ZERO_BESTIARIO,MODELOS_ROTA_ZERO_NPCS} from '../systems/rotaZero/bestiaryCatalog.js';
const title={magias:'Magia',caracteristicas:'Característica',especies:'Espécie',talentos:'Talento',antecedentes:'Antecedente',heroica:'Habilidade heroica',inata:'Inata',truque:'Truque',magia:'Magia',classe:'Classe',poder:'Poder',heroico:'Poder heroico',feitico:'Feitiço',origem:'Origem',trilha:'Trilha',habilidade:'Habilidade',poderParanormal:'Poder paranormal',ritual:'Ritual',legado:'Legado',vantagem:'Vantagem',desvantagem:'Desvantagem',pericia:'Perícia',arquetipo:'Arquétipo',tecnica:'Técnica',antecedente:'Antecedente',tormento:'Tormento',defeito:'Defeito'};
const val=x=>typeof x==='string'||typeof x==='number'?String(x):Array.isArray(x)?x.map(v=>typeof v==='string'?v:[v?.nome,v?.desc||v?.resumoPt].filter(Boolean).join(': ')).filter(Boolean).join('\n'):'';
const ability=(entry,system,kind,index)=>({...entry,system,id:system+'-ability-'+kind+'-'+index,nome:entry.nome||entry.name||'Sem nome',categoria:title[kind]||kind,desc:val(entry.resumoPt||entry.desc||entry.descricao||entry.efeito||entry.resumo)||'Consulte a fonte indicada.',custo:val(entry.custo??entry.fv_nvl??entry.valor??entry.nivel),requisitos:val(entry.requisito||entry.requisitos),fonte:val(entry.fonte)||'Biblioteca PJLite',pagina:val(entry.pagina||entry.paginaLivro),kind});
export function wikiAbilities(system){
 if(system==='dnd5e')return ['magias','caracteristicas','especies','talentos','antecedentes'].flatMap(kind=>findAbilityPresets(system,kind).map((x,i)=>ability(x.entry,system,kind,i)));
 const rows=({dragonbane:DRAGONBANE_LIBRARY,fabula:FABULA_LIBRARY_CATALOG,ordemParanormal:ORDEM_LIBRARY_CATALOG,skyfall:SKYFALL_LIBRARY_CATALOG,rotaZero:[...RZ_ADVANTAGES.map(x=>({...x,tipo:'vantagem'})),...RZ_DEFECTS.map(x=>({...x,tipo:'defeito'})),...RZ_SKILLS.map(([id,nome,desc])=>({id,nome,desc,tipo:'pericia'}))]})[system]||SYSTEM_LIBRARIES[system]?.entries||[];
 return rows.map((x,i)=>ability(x,system,x.tipo||'Habilidade',i));
}
export function sheetAbilities(data){
 const fields=['habilidadesFeiticos','caracteristicas','habilidades','poderesParanormais','rituais','vantagens','desvantagens','tecnicas','poderesHeroicos'];
 let rows=fields.flatMap(k=>Array.isArray(data[k])?data[k].map(x=>[x,k]):[]);
 const spells=Array.isArray(data.magias)?data.magias:Array.isArray(data.magias?.lista)?data.magias.lista:[];
 rows.push(...spells.map(x=>[x,'magias']));
 for(const c of Array.isArray(data.classes)?data.classes:[])for(const p of Array.isArray(c.poderes)?c.poderes:[])rows.push([p,'poder']);
 if(data.system==='rotaZero')rows=wikiAbilities(data.system).filter(x=>[...(data.vantagens||[]),...(data.defeitos||[])].some(id=>RZ_ADVANTAGES.concat(RZ_DEFECTS).some(z=>z.id===id&&z.nome===x.nome))).map(x=>[x,x.kind]);
 return rows.filter(([x])=>x&&typeof x==='object'&&x.nome).map(([x,k],i)=>ability(x,data.system,x.tipo||k,i));
}
export function wikiThreats(system){
 const rows=({dnd5e:SRD521_MONSTERS,dragonbane:[...MODELOS_DRAGONBANE_BESTIARIO,...MODELOS_DRAGONBANE_VARIANTES,...MODELOS_DRAGONBANE_SOLO],ordemParanormal:MODELOS_ORDEM_AMEACAS,skyfall:MODELOS_SKYFALL_AMEACAS,fabula:FABULA_LITE_EXAMPLES,'3det':[...MODELOS_3DET_LIVRO,...MODELOS_3DET_AMEACAS],somdas6:[...MODELOS_SOM6_LIVRO_PDJ,...MODELOS_SOM6_LIVRO_ANIMAIS],rotaZero:[...MODELOS_ROTA_ZERO_BESTIARIO,...MODELOS_ROTA_ZERO_NPCS]})[system]||[];
 return [...rows,...(BOOK_THREAT_MODELS[system]||[])].map((x,i)=>({...x,id:'wiki-threat-'+i,categoria:String(x.elemento||x.categoria||x.tipo||'Ameaça'),fonte:x.fonte||'Catálogo PJLite'}));
}
