import m0 from './srd521-monsters-1.js';
import m1 from './srd521-monsters-2.js';
import m2 from './srd521-monsters-3.js';
import m3 from './srd521-monsters-4.js';
import m4 from './srd521-monsters-5.js';
import m5 from './srd521-monsters-6.js';
export const SRD521_MONSTERS=[m0,m1,m2,m3,m4,m5].flat();
export const SRD521_MONSTER_GROUPS=[...new Set(SRD521_MONSTERS.map(m=>m.tipo))].sort((a,b)=>a.localeCompare(b,'pt-BR')).map(title=>({title,items:SRD521_MONSTERS.filter(m=>m.tipo===title)}));
