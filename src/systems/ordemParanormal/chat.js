import { ORDEM_SKILLS } from './data.js';
const t=v=>String(v??'').trim(),v=(x,f='—')=>t(x)||f; const skillName=id=>ORDEM_SKILLS.find(([k])=>k===id)?.[1]||id;
export function generateOrdemChatText(d){
 const b=d.bio||{},a=d.atributos||{},s=d.status||{}; let o=`🔻 ORDEM PARANORMAL — ${v(b.nome,'Sem Nome')}\n${v(b.origem)} • ${v(b.classe)}${b.trilha?` • ${b.trilha}`:''} • NEX ${b.nex??0}% • ${v(b.patente)}\n`;
 o+=`\n📊 ATRIBUTOS\nAGI ${a.agi??1} | FOR ${a.for??1} | INT ${a.int??1} | PRE ${a.pre??1} | VIG ${a.vig??1}\n`;
 o+=`\n⚙ STATUS\n❤️ PV ${s.pvAtual??0}/${s.pvMax??0} | ⚡ PE ${s.peAtual??0}/${s.peMax??0} | 🧠 SAN ${s.sanAtual??0}/${s.sanMax??0} | Defesa ${s.defesa??10}\n`;
 const ps=Object.entries(d.pericias||{}).filter(([,x])=>Number(x?.grau||0)>0||Number(x?.outros||0)!==0); if(ps.length)o+=`\n🎯 PERÍCIAS\n${ps.map(([k,x])=>`• ${skillName(k)}: +${Number(x.grau||0)+Number(x.outros||0)}`).join('\n')}\n`;
 if(d.ataques?.length)o+=`\n⚔ ATAQUES\n${d.ataques.map(x=>`• ${v(x.nome)} | ${v(x.teste)} | ${v(x.dano)}`).join('\n')}\n`;
 if(d.habilidades?.length||d.rituais?.length)o+=`\n🔮 PODERES & RITUAIS\n${[...(d.habilidades||[]),...(d.rituais||[])].map(x=>`• ${v(x.nome)}${x.desc?` — ${t(x.desc)}`:''}`).join('\n')}\n`;
 if(d.inventario?.length)o+=`\n🎒 INVENTÁRIO\n${d.inventario.map(x=>`• ${x.quantidade||1}x ${v(x.nome)} (Cat. ${v(x.categoria,'0')})`).join('\n')}\n`; return o.trim();
}
export function generateOrdemThreatChatText(d){
 let o=`🔻 AMEAÇA ORDEM — ${v(d.nome,'Sem Nome')}\n${v(d.categoria)} • ${v(d.elemento,'Sem elemento')} • VD ${d.vd??0}\n❤️ PV ${d.status?.pvAtual??0}/${d.status?.pvMax??0} | Defesa ${d.status?.defesa??10} | Mov. ${v(d.status?.deslocamento)}\n`;
 if(d.ataques?.length)o+=`\n⚔ ATAQUES\n${d.ataques.map(x=>`• ${v(x.nome)} | ${v(x.teste)} | ${v(x.dano)}`).join('\n')}\n`; if(d.habilidades?.length)o+=`\n✨ HABILIDADES\n${d.habilidades.map(x=>`• ${v(x.nome)}${x.desc?` — ${t(x.desc)}`:''}`).join('\n')}\n`; if(t(d.enigmaMedo))o+=`\n👁 ENIGMA DE MEDO\n${t(d.enigmaMedo)}\n`; return o.trim();
}
