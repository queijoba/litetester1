import { SKYFALL_SKILLS } from './data.js';
const t=v=>String(v??'').trim(); const val=(v,f='—')=>t(v)||f;
const skillName=id=>SKYFALL_SKILLS.find(([k])=>k===id)?.[1]||id;
export function generateSkyfallChatText(d){
  const b=d.bio||{},a=d.atributos||{},r=d.recursos||{}; let s=`☄️ SKYFALL RPG — ${val(b.nome,'Sem Nome')}\n`;
  s+=`${val(b.legado)} • ${val(b.classe)} ${b.trilha?`• ${b.trilha}`:''} • Nível ${b.nivel||1}\nMelancolia: ${val(b.melancolia)}\n\n📊 ATRIBUTOS\nFOR ${val(a.for)} | CON ${val(a.con)} | DES ${val(a.des)} | SAB ${val(a.sab)} | INT ${val(a.int)} | CAR ${val(a.car)}\n`;
  s+=`\n⚙ STATUS\nPV ${r.pv?.atual??0}/${r.pv?.max??0} | Catarse ${r.catarse?.atual??0}/${r.catarse?.max??0} | Ênfase ${r.enfase?.atual??0}/${r.enfase?.max??0} | Sombra ${r.sombra??0}\n`;
  const skills=Object.entries(d.pericias||{}).filter(([,x])=>x?.proficiente||x?.enfase); if(skills.length)s+=`\n🎯 PERÍCIAS\n${skills.map(([k,x])=>`• ${skillName(k)}${x.enfase?' [Ênfase]':''}${x.bonus?` ${x.bonus}`:''}`).join('\n')}\n`;
  if(d.ataques?.length)s+=`\n⚔ ATAQUES\n${d.ataques.map(x=>`• ${val(x.nome)} | ${val(x.bonus)} | ${val(x.dano)} ${val(x.tipo,'')}`).join('\n')}\n`;
  if(d.habilidades?.length||d.magias?.length)s+=`\n✨ HABILIDADES & MAGIAS\n${[...(d.habilidades||[]),...(d.magias||[])].map(x=>`• ${val(x.nome)}${x.desc?` — ${t(x.desc)}`:''}`).join('\n')}\n`;
  if(d.equipamentos?.length)s+=`\n🎒 INVENTÁRIO\n${d.equipamentos.map(x=>`• ${x.quantidade||1}x ${val(x.nome)}`).join('\n')}\n`; return s.trim();
}
export function generateSkyfallThreatChatText(d){
  let s=`☄️ AMEAÇA SKYFALL — ${val(d.nome,'Sem Nome')}\n${val(d.hierarquia)} • ${val(d.tipo)} • ND ${d.nivelDesafio??0}\n`;
  s+=`❤️ PV ${d.status?.pvAtual??0}/${d.status?.pvMax??0} | Proteção ${val(d.status?.protecao)} | Mov. ${val(d.status?.deslocamento)}\n`;
  if(d.ataques?.length)s+=`\n⚔ ATAQUES\n${d.ataques.map(x=>`• ${val(x.nome)} | ${val(x.bonus)} | ${val(x.dano)}`).join('\n')}\n`;
  if(d.habilidades?.length)s+=`\n✨ HABILIDADES\n${d.habilidades.map(x=>`• ${val(x.nome)}${x.desc?` — ${t(x.desc)}`:''}`).join('\n')}\n`; return s.trim();
}
