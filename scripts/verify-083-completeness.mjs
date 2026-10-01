import { readFile } from 'node:fs/promises';
const need=(text,tokens,label)=>{for(const t of tokens)if(!text.includes(t))throw new Error(`${label}: ausente ${t}`);};

const sky=await readFile('src/systems/skyfall/components/CharacterEditor.jsx','utf8');
const skyData=await readFile('src/systems/skyfall/data.js','utf8');
const skyCss=await readFile('src/systems/skyfall/skyfall-theme.css','utf8');
const ordem=await readFile('src/systems/ordemParanormal/components/CharacterEditor.jsx','utf8');
const ordemData=await readFile('src/systems/ordemParanormal/data.js','utf8');
const ordemCss=await readFile('src/systems/ordemParanormal/ordem-theme.css','utf8');
const ordemChat=await readFile('src/systems/ordemParanormal/chat.js','utf8');

need(sky,['PJ LITE 0.8.3 SKYFALL COMPLETE UI','protectionTotal','skyfall-protection-line','skillTotal','Ênfase — Outro','Custo de Ênfase','Descritores'],'Skyfall completo');
need(skyData,['PJ LITE 0.8.3 SKYFALL COMPLETE','protecoes:{','enfase:{atual:0,max:0,outro:0}','custoEnfase','descritores'],'Dados Skyfall');
need(skyCss,['PJ LITE 0.8.3 SKYFALL THEME STABLE','.skyfall-protection-line','.skyfall-skill-total'],'Tema Skyfall estável');
need(ordem,['PJ LITE 0.8.3 ORDEM SAH COMPLETE UI','Determinação (PD)','recursoMental','DT DE RITUAIS','Limite de Itens','Limite de Crédito','Carga Máx.','Prestígio','EVOLUÇÃO DO PERSONAGEM','Dados'],'Ordem SaH completa');
need(ordemData,['PJ LITE 0.8.3 ORDEM SAH COMPLETE','pdAtual','pdMax','recursoMental','limiteItens','limiteCredito','cargaMax','prestigio','dtRituais','evolucao','protecao'],'Dados Ordem SaH');
need(ordemCss,['PJ LITE 0.8.3 ORDEM THEME STABLE','.ordem-meter--determinacao','.ordem-mental-switch','.ordem-dt-grid','.ordem-evolution-grid'],'Tema Ordem estável');
need(ordemChat,['RECURSO MENTAL SAH','PD ${s.pdAtual'],'Ficha Chat SAN/PD');

const skyModule=await import('../src/systems/skyfall/data.js');
const oldSky=skyModule.normalizeSkyfallPcData({system:'skyfall',type:'pc',atributos:{for:12}});
if(!oldSky.protecoes?.for||oldSky.recursos?.enfase?.outro===undefined)throw new Error('Migração Skyfall incompleta.');

const ordemModule=await import('../src/systems/ordemParanormal/data.js');
const oldOrdem=ordemModule.normalizeOrdemPcData({system:'ordemParanormal',type:'pc',status:{sanAtual:7},inventario:[]});
if(oldOrdem.status.recursoMental!=='sanidade'||oldOrdem.status.pdAtual===undefined||!oldOrdem.gestao||!oldOrdem.dtRituais||!Array.isArray(oldOrdem.evolucao))throw new Error('Migração Ordem SaH incompleta.');
const pd=ordemModule.normalizeOrdemPcData({system:'ordemParanormal',type:'pc',status:{recursoMental:'pd',pdAtual:4,pdMax:8}});
if(pd.status.recursoMental!=='pd'||pd.status.pdAtual!==4||pd.status.pdMax!==8)throw new Error('Modo PD não foi preservado.');

console.log('✓ Completude 0.8.3: Skyfall e Ordem/Sobrevivendo ao Horror verificados.');
