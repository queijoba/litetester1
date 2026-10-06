import { readFile, writeFile } from 'node:fs/promises';
const path='src/PJLiteApp.jsx';
let s=await readFile(path,'utf8');
if(s.includes('PJ LITE 0.9 FINAL POLISH')){console.log('Final systems polish: already applied.');process.exit(0);}
const rep=(from,to,label)=>{if(!s.includes(from))throw new Error(`Final polish marker not found: ${label}`);s=s.replace(from,to);};

// Ordem usa o ID canônico dos módulos; "ordem" permanece somente como ID do tema.
s=s.replaceAll("if (sys === 'ordem')", "if (sys === 'ordemParanormal')");
s=s.replaceAll('<option value="ordem">Ordem Paranormal</option>', '<option value="ordemParanormal">Ordem Paranormal</option>');
s=s.replaceAll("const isOrdem = data.system === 'ordem';", "const isOrdem = data.system === 'ordemParanormal';");
s=s.replaceAll("'skyfall','ordem'].includes", "'skyfall','ordemParanormal'].includes");

// Editor principal: largura, borda e título próprios.
s=s.replace("(!isDnd && !isFabula && !isSom6 && !is3Det && data.type === 'pc')", "(!isDnd && !isFabula && !isSom6 && !is3Det && !isSkyfall && !isOrdem && data.type === 'pc')");
s=s.replace("is3Det ? 'border-amber-500' : 'border-gray-500'", "is3Det ? 'border-amber-500' : isSkyfall ? 'border-violet-700' : isOrdem ? 'border-red-950' : 'border-gray-500'");
s=s.replace("(isDnd || isFabula || isSom6 || is3Det) ? {}", "(isDnd || isFabula || isSom6 || is3Det || isSkyfall || isOrdem) ? {}");
if (s.includes("is3Det ? '3DeT VICTORY • PERSONAGEM • PRÉVIA' : isRotaZero ? 'ROTA ZERO • FUNCIONÁRIO' : (data.type")) {
  s=s.replace("is3Det ? '3DeT VICTORY • PERSONAGEM • PRÉVIA' : isRotaZero ? 'ROTA ZERO • FUNCIONÁRIO' : (data.type", "is3Det ? (data.type === 'pc' ? '3DeT VICTORY • PERSONAGEM' : '3DeT VICTORY • AMEAÇA / NPC') : isSkyfall ? (data.type === 'pc' ? 'SKYFALL RPG • PERSONAGEM' : 'SKYFALL RPG • AMEAÇA') : isOrdem ? (data.type === 'pc' ? 'ORDEM PARANORMAL • AGENTE' : 'ORDEM PARANORMAL • AMEAÇA') : isRotaZero ? 'ROTA ZERO • FUNCIONÁRIO' : (data.type");
} else {
  s=s.replace("is3Det ? '3DeT VICTORY • PERSONAGEM • PRÉVIA' : (data.type", "is3Det ? (data.type === 'pc' ? '3DeT VICTORY • PERSONAGEM' : '3DeT VICTORY • AMEAÇA / NPC') : isSkyfall ? (data.type === 'pc' ? 'SKYFALL RPG • PERSONAGEM' : 'SKYFALL RPG • AMEAÇA') : isOrdem ? (data.type === 'pc' ? 'ORDEM PARANORMAL • AGENTE' : 'ORDEM PARANORMAL • AMEAÇA') : (data.type");
}

// Dashboard de personagens: reconhecer os dois sistemas.
rep("const is3Det = char.system === '3det';", "const is3Det = char.system === '3det';\n                                        const isSkyfall = char.system === 'skyfall';\n                                        const isOrdem = char.system === 'ordemParanormal';", 'dashboard flags');
s=s.replace("is3Det ? 'border-amber-500' : 'border-dragon-dark'", "is3Det ? 'border-amber-500' : isSkyfall ? 'border-violet-700' : isOrdem ? 'border-red-950' : 'border-dragon-dark'");
s=s.replace("is3Det ? 'bg-zinc-950' : 'bg-dragon-dark'", "is3Det ? 'bg-zinc-950' : isSkyfall ? 'bg-violet-950' : isOrdem ? 'bg-black' : 'bg-dragon-dark'");
s=s.replace("is3Det ? '3DeT Victory' : 'Dragonbane'", "is3Det ? '3DeT Victory' : isSkyfall ? 'Skyfall RPG' : isOrdem ? 'Ordem Paranormal' : 'Dragonbane'");
s=s.replace("is3Det ? 'text-amber-700' : 'text-red-900'", "is3Det ? 'text-amber-700' : isSkyfall ? 'text-violet-800' : isOrdem ? 'text-red-950' : 'text-red-900'");
s=s.replace("is3Det ? `${char.bio?.arquetipo || 'Sem arquétipo'}${char.bio?.kit ? ` • ${char.bio.kit}` : char.bio?.conceito ? ` • ${char.bio.conceito}` : ''}` : `${char.bio?.ancestralidade || '?'} • ${char.bio?.profissao || '?'}`", "is3Det ? `${char.bio?.arquetipo || 'Sem arquétipo'}${char.bio?.kit ? ` • ${char.bio.kit}` : char.bio?.conceito ? ` • ${char.bio.conceito}` : ''}` : isSkyfall ? `${char.bio?.legado || 'Sem legado'} • ${char.bio?.classe || 'Sem classe'}` : isOrdem ? `NEX ${char.bio?.nex ?? 5}% • ${char.bio?.classe || 'Sem classe'}` : `${char.bio?.ancestralidade || '?'} • ${char.bio?.profissao || '?'}`");
s=s.replace("is3Det ? `Pontos ${char.pontos ?? 0} • XP ${char.xp ?? 0}` : `Nível", "is3Det ? `Pontos ${char.pontos ?? 0} • XP ${char.xp ?? 0}` : isSkyfall ? `Nível ${char.bio?.nivel || 1} • Catarse ${char.recursos?.catarse?.atual ?? 0}/${char.recursos?.catarse?.max ?? 0}` : isOrdem ? `${char.bio?.origem || 'Sem origem'} • ${char.bio?.trilha || 'Sem trilha'}` : `Nível");

// Dashboard de ameaças: rótulos e cores reconhecíveis.
s=s.replaceAll("sys === '3det' ? 'border-amber-500' : 'border-gray-500'", "sys === '3det' ? 'border-amber-500' : sys === 'skyfall' ? 'border-violet-700' : sys === 'ordemParanormal' ? 'border-red-950' : 'border-gray-500'");
s=s.replaceAll("sys === '3det' ? 'bg-zinc-950' : threat.type", "sys === '3det' ? 'bg-zinc-950' : sys === 'skyfall' ? 'bg-violet-950' : sys === 'ordemParanormal' ? 'bg-black' : threat.type");
s=s.replace("sys === '3det' ? '3DeT Victory • Ameaça' : threat.type", "sys === '3det' ? '3DeT Victory • Ameaça' : sys === 'skyfall' ? 'Skyfall RPG • Ameaça' : sys === 'ordemParanormal' ? 'Ordem Paranormal • Ameaça' : threat.type");
s=s.replace("sys === '3det' ? 'text-amber-800' : 'text-gray-900'", "sys === '3det' ? 'text-amber-800' : sys === 'skyfall' ? 'text-violet-800' : sys === 'ordemParanormal' ? 'text-red-950' : 'text-gray-900'");
s=s.replace("sys === '3det' ? `${threat.categoria || 'Criatura'} • ${threat.papel || 'Comum'} • ${threat.pontos || 0} pts` : threat.type", "sys === '3det' ? `${threat.categoria || 'Criatura'} • ${threat.papel || 'Comum'} • ${threat.pontos || 0} pts` : sys === 'skyfall' ? `ND ${threat.nd ?? 0} • ${threat.tipo || 'Ameaça'}` : sys === 'ordemParanormal' ? `VD ${threat.vd ?? 0} • ${threat.tipo || threat.categoria || 'Ameaça'}` : threat.type");

// Guias: abas + conteúdo compacto, sem duplicar regras do livro.
const extraGuideButtons = `
                                        <button onClick={() => setGuideTab('skyfall')} className={\`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap \${guideTab === 'skyfall' ? 'border-violet-700 text-violet-950 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-300'}\`}>Skyfall RPG</button>
                                        <button onClick={() => setGuideTab('ordem')} className={\`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap \${guideTab === 'ordem' ? 'border-red-900 text-red-950 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-300'}\`}>Ordem Paranormal</button>`;

const rzGuideClose = ">Rota Zero</button>}\n                                    </div>";
if (s.includes(rzGuideClose)) {
  s=s.replace(rzGuideClose, `>Rota Zero</button>}${extraGuideButtons}
                                    </div>`);
} else {
  rep(">Som das Seis</button>\n                                    </div>", `>Som das Seis</button>${extraGuideButtons}
                                    </div>`, 'guide buttons');
}

rep("                                        {guideTab === 'som6' && (", `                                        {guideTab === 'skyfall' && (
                                            <div className="space-y-5"><div className="bg-violet-950 text-white rounded p-4"><div className="text-[10px] font-bold uppercase text-violet-200">Livro Básico 1.25</div><h3 className="font-title font-bold text-lg">☄️ Skyfall RPG — Guia da ficha</h3><p className="text-xs mt-1">O PJ Lite organiza a ficha; custos, escolhas e efeitos completos continuam seguindo o livro.</p></div><div className="grid sm:grid-cols-2 gap-3 text-xs"><div className="bg-white border rounded p-3"><strong>1. Identidade</strong><p>Preencha Legado, Herança, Antecedente, Maldição, Melancolia, Classe e Trilha.</p></div><div className="bg-white border rounded p-3"><strong>2. Recursos</strong><p>Confira PV, Catarse, Ênfase, Sombra, Fragmentos Arcanos e Volume.</p></div><div className="bg-white border rounded p-3"><strong>3. Perícias</strong><p>Marque proficiência e Ênfase e registre ajustes somente quando necessários.</p></div><div className="bg-white border rounded p-3"><strong>4. Combate</strong><p>Registre Proteção, redução de dano, iniciativa, movimento e ataques usados em mesa.</p></div><div className="bg-white border rounded p-3"><strong>5. Habilidades & Magias</strong><p>Guarde nomes e lembretes curtos das opções escolhidas no livro.</p></div><div className="bg-white border rounded p-3"><strong>6. Inventário</strong><p>Acompanhe equipamentos, Volume, Fragmentos, Peças e Trocados.</p></div></div></div>
                                        )}

                                        {guideTab === 'ordem' && (
                                            <div className="space-y-5"><div className="bg-black text-white rounded p-4 border border-red-900"><div className="text-[10px] font-bold uppercase text-red-300">Livro de Regras v1.3 • dez/2024</div><h3 className="font-title font-bold text-lg">△ Ordem Paranormal RPG — Guia da ficha</h3><p className="text-xs mt-1">Esta integração usa a edição clássica v1.3, não o playtest de Ordem Paranormal RPG 2.</p></div><div className="grid sm:grid-cols-2 gap-3 text-xs"><div className="bg-white border rounded p-3"><strong>1. Agente</strong><p>Preencha Nome, Origem, Patente, Classe, Trilha e NEX.</p></div><div className="bg-white border rounded p-3"><strong>2. Atributos e recursos</strong><p>Acompanhe AGI, FOR, INT, PRE, VIG e PV/PE/SAN.</p></div><div className="bg-white border rounded p-3"><strong>3. Perícias</strong><p>Escolha o grau de treinamento e use Outros para modificadores adicionais.</p></div><div className="bg-white border rounded p-3"><strong>4. Combate</strong><p>Cadastre ataques, dano, crítico, alcance, munição, Defesa e resistências.</p></div><div className="bg-white border rounded p-3"><strong>5. Poderes & Rituais</strong><p>Registre apenas as opções conhecidas pelo agente, com lembretes curtos.</p></div><div className="bg-white border rounded p-3"><strong>6. Inventário</strong><p>Organize categoria, espaços, quantidade e observações dos itens.</p></div></div></div>
                                        )}

                                        {guideTab === 'som6' && (`, 'guide content');

s = `/* PJ LITE 0.9 FINAL POLISH */\n${s}`;
await writeFile(path,s,'utf8');
console.log('✓ Final systems polish applied.');
