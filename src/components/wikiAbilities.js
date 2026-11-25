import {findAbilityPresets} from './abilityPresetLibrary.js';
import {DRAGONBANE_HEROIC_LIBRARY,DRAGONBANE_TRICK_LIBRARY,DRAGONBANE_SPELL_LIBRARY} from '../systems/dragonbane/libraryCatalog.js';
import {FABULA_LIBRARY_CATALOG} from '../systems/fabulaUltima/libraryCatalog.js';
import {SKYFALL_LIBRARY_CATALOG} from '../systems/skyfall/libraryCatalog.js';
import {ORDEM_LIBRARY_CATALOG} from '../systems/ordemParanormal/libraryCatalog.js';
import {SOM6_LIBRARY,TRESDET_LIBRARY} from './otherSystemLibraryCatalog.js';
import {RZ_ADVANTAGES,RZ_DEFECTS} from '../systems/rotaZero/data.js';
export function wikiAbilities(system){
 const list=system==='dnd5e'?['especies','antecedentes','talentos','caracteristicas','magias'].flatMap(k=>findAbilityPresets(system,k).map(x=>({...x.entry,id:x.id,tipo:k})))
 :system==='dragonbane'?[...DRAGONBANE_HEROIC_LIBRARY,...DRAGONBANE_TRICK_LIBRARY,...DRAGONBANE_SPELL_LIBRARY]
 :system==='fabula'?FABULA_LIBRARY_CATALOG:system==='skyfall'?SKYFALL_LIBRARY_CATALOG:system==='ordemParanormal'?ORDEM_LIBRARY_CATALOG:system==='somdas6'?SOM6_LIBRARY:system==='3det'?TRESDET_LIBRARY:system==='rotaZero'?[...RZ_ADVANTAGES,...RZ_DEFECTS.map(x=>({...x,tipo:'Defeito'}))]:[];
 return list.filter(x=>x&&x.nome).map((x,i)=>({...x,id:x.id||system+'-ability-'+i,categoria:String(x.tipo||'Habilidade'),desc:String(x.desc||x.descricao||x.efeito||x.resumo||'Consulte a fonte indicada.'),fonte:x.fonte||'Biblioteca PJLite',pagina:x.pagina||x.paginaLivro||''}));
}
