import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/PJLiteApp.jsx';
let source = await readFile(path, 'utf8');

const dataImport = "import { initial3DetPcData, normalize3DetPcData } from './systems/3det/data.js';";
const modelsImport = "import { MODELOS_3DET_PC } from './systems/3det/models.js';";

if (!source.includes(modelsImport)) {
  if (!source.includes(dataImport)) throw new Error('Import base do 3DeT não encontrado.');
  source = source.replace(dataImport, `${dataImport}\n${modelsImport}`);
}

const infoMarker = `                                        <div className="rounded border border-amber-300 bg-amber-50 p-3 text-[10px] leading-relaxed text-amber-950"><strong>Primeira prévia:</strong> retrato e Kit são opcionais. Os campos de FA/FD ficam livres para registrar a referência usada pela mesa, sem forçar automações de regra.</div>`;

const modelsBlock = `                                        <div>
                                            <div className="flex flex-wrap items-end justify-between gap-2 border-b-2 border-amber-200 pb-1 mb-3">
                                                <div><h3 className="font-title font-black text-zinc-900">Modelos Prontos • adaptações de fã</h3><p className="text-[10px] text-zinc-500 mt-1">Quatro exemplos jogáveis de 10 pontos para aprender a ficha. Você pode editar tudo depois.</p></div>
                                                <span className="text-[9px] font-black uppercase tracking-widest rounded-full bg-amber-100 text-amber-900 px-2 py-1">10 pts</span>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                {MODELOS_3DET_PC.map((modelo, idx) => (
                                                    <div key={idx} onClick={() => loadTemplate(modelo)} className="bg-white border-2 border-amber-200 hover:border-amber-500 rounded p-3 cursor-pointer hover:shadow-md transition-all">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0"><div className="font-black text-zinc-950 truncate">{modelo.bio.nome}</div><div className="text-[10px] text-zinc-500 mt-0.5">{modelo.bio.arquetipo} • {modelo.bio.escala}</div></div>
                                                            <span className="shrink-0 rounded bg-zinc-950 text-amber-300 text-[9px] font-black px-2 py-1">{modelo.pontos} pts</span>
                                                        </div>
                                                        <p className="text-[10px] text-zinc-600 mt-2 leading-relaxed line-clamp-3">{modelo.bio.conceito}</p>
                                                        <div className="mt-2 flex flex-wrap gap-1 text-[9px] font-bold text-zinc-600">
                                                            <span className="rounded bg-zinc-100 px-1.5 py-0.5">P{modelo.atributos.poder}</span>
                                                            <span className="rounded bg-zinc-100 px-1.5 py-0.5">H{modelo.atributos.habilidade}</span>
                                                            <span className="rounded bg-zinc-100 px-1.5 py-0.5">R{modelo.atributos.resistencia}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[9px] text-zinc-500 mt-2">Sans, Saitama, Jotaro Kujo e Maka Albarn são usados aqui apenas como referências de adaptação de fã. Retratos não são incluídos nos modelos.</p>
                                        </div>`;

if (!source.includes('Modelos Prontos • adaptações de fã')) {
  if (!source.includes(infoMarker)) throw new Error('Marcador do modal 3DeT não encontrado.');
  source = source.replace(infoMarker, `${modelsBlock}\n${infoMarker}`);
}

await writeFile(path, source, 'utf8');
console.log('PJLiteApp.jsx atualizado com os modelos prontos de 3DeT Victory.');
