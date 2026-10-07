import { readFile } from 'node:fs/promises';
import { initialRotaZeroPcData } from '../src/systems/rotaZero/data.js';
import { generateRotaZeroChatText } from '../src/systems/rotaZero/chat.js';
import { initialSkyfallPcData } from '../src/systems/skyfall/data.js';
import { initialSkyfallThreatData } from '../src/systems/skyfall/threatData.js';
import { generateSkyfallChatText, generateSkyfallThreatChatText } from '../src/systems/skyfall/chat.js';
import { initialOrdemPcData } from '../src/systems/ordemParanormal/data.js';
import { initialOrdemThreatData } from '../src/systems/ordemParanormal/threatData.js';
import { generateOrdemChatText, generateOrdemThreatChatText } from '../src/systems/ordemParanormal/chat.js';
import { initial3DetPcData } from '../src/systems/3det/data.js';
import { generate3DetChatText } from '../src/systems/3det/chat.js';

const clone = (value) => JSON.parse(JSON.stringify(value));
const need = (value, tokens, label) => {
  for (const token of tokens) if (!String(value).includes(token)) throw new Error(`Ficha Chat ${label}: faltando "${token}"`);
};

// Rota Zero — cobre contratação, recursos e veículo.
{
  const d = clone(initialRotaZeroPcData);
  d.bio = { ...d.bio, nome:'Nix', jogador:'conta', kit:'Motorista de Rota', conceito:'Teste' };
  d.atributos = { pulso:2, tecnica:3, firmeza:2 };
  d.recursos = { adrenalina:{atual:2,max:2}, foco:{atual:15,max:15}, vitalidade:{atual:10,max:10} };
  d.pericias = { conducao:true, navegacao:true };
  d.vantagens = ['reflexosEntrega'];
  d.defeitos = ['barulhento'];
  d.ancora = 'Voltar para casa';
  d.inventario = ['Lanterna','','',''];
  d.veiculoAtivo = true;
  d.veiculo = { ...d.veiculo, nome:'Furgão 88', rotaAtual:'KM 88', destino:'Depósito 04' };
  const out = generateRotaZeroChatText(d);
  need(out, ['ROTA ZERO','ATRIBUTOS & RECURSOS','PERÍCIAS','VANTAGENS & DEFEITOS','ÂNCORA & ANOTAÇÕES','VEÍCULO / TURNO','Furgão 88'], 'Rota Zero');
}

// Skyfall — personagem e ameaça com campos atuais.
{
  const d = clone(initialSkyfallPcData);
  d.bio = { ...d.bio, nome:'Astra', jogador:'Nick', legado:'Humano', classe:'Combatente', trilha:'Teste', heranca:'Herança', maldicao:'Maldição', melancolia:'Melancolia' };
  d.combate = { ...d.combate, protecao:'14', reducaoDano:'2', iniciativa:'+3' };
  d.pericias = { ...d.pericias, atletismo:{proficiente:true,enfase:true,bonus:'+5'} };
  d.ataques = [{nome:'Lâmina',bonus:'+5',dano:'1d8',tipo:'corte',alcance:'corpo a corpo',descricao:'Teste de descrição'}];
  d.habilidades = [{nome:'Ímpeto',origem:'Classe',desc:'Teste de habilidade'}];
  d.magias = [{nome:'Luz',camada:'Superficial',custo:'1',execucao:'Ação',alcance:'Curto',duracao:'Cena',descritores:'Luz',desc:'Teste de magia'}];
  d.equipamentos = [{nome:'Kit',quantidade:1,volume:'1',fragmentos:'0',descritores:'Útil'}];
  const out = generateSkyfallChatText(d);
  need(out, ['ATRIBUTOS & RECURSOS','COMBATE','ATAQUES','HABILIDADES','MAGIAS & CONJURAÇÃO','INVENTÁRIO','Teste de descrição','Superficial'], 'Skyfall personagem');

  const n = clone(initialSkyfallThreatData);
  n.nome='Eco'; n.atributos.for=14; n.pericias=[{nome:'Percepção',bonus:'+4'}]; n.reacoes=[{nome:'Recuar',desc:'Teste'}]; n.resistencias='frio';
  const threat = generateSkyfallThreatChatText(n);
  need(threat, ['ATRIBUTOS & STATUS','PERÍCIAS','REAÇÕES','ESTATÍSTICAS'], 'Skyfall ameaça');
}

// Ordem Paranormal — personagem e ameaça com campos atuais.
{
  const d = clone(initialOrdemPcData);
  d.bio = { ...d.bio, nome:'Agente', jogador:'Nick', origem:'Acadêmico', classe:'Especialista', trilha:'Infiltrador', nex:25 };
  d.status = { ...d.status, bloqueio:5, esquiva:18, peRodada:3 };
  d.ataques = [{nome:'Pistola',teste:'Pontaria',dano:'1d12',critico:'18/x3',alcance:'Curto',tipo:'Balístico',municao:'6',desc:'Teste'}];
  d.habilidades = [{nome:'Poder',tipo:'Classe',custo:'2 PE',desc:'Teste'}];
  d.poderesParanormais = [{nome:'Visão do Oculto',elemento:'Conhecimento',requisito:'NEX 15%',custo:'2 PE',desc:'Teste'}];
  d.rituais = [{nome:'Ritual',circulo:1,elemento:'Conhecimento',execucao:'Padrão',alcance:'Curto',duracao:'Cena',resistencia:'Vontade',desc:'Teste'}];
  d.inventario = [{nome:'Item',categoria:'I',espacos:1,quantidade:1,desc:'Teste'}];
  d.resistencias='Mental'; d.proficiencias='Armas simples';
  const out = generateOrdemChatText(d);
  need(out, ['ATRIBUTOS & STATUS','Bloqueio 5','Esquiva 18','ATAQUES','PODERES & HABILIDADES','PODERES PARANORMAIS','RITUAIS','INVENTÁRIO','ESTATÍSTICAS'], 'Ordem personagem');

  const n = clone(initialOrdemThreatData);
  n.nome='Criatura'; n.presencaPerturbadora='DT 20'; n.sentidos='Percepção às cegas'; n.enigmaMedo='Segredo';
  const threat = generateOrdemThreatChatText(n);
  need(threat, ['ATRIBUTOS & STATUS','ESTATÍSTICAS','ENIGMA DE MEDO'], 'Ordem ameaça');
}

// 3DeT — garante que as seções que dependem do filtro existam.
{
  const d = clone(initial3DetPcData);
  d.bio.nome='Herói'; d.vantagens=[{nome:'Vantagem',custo:'1',desc:'Teste'}]; d.desvantagens=[{nome:'Desvantagem',valor:'-1',desc:'Teste'}]; d.tecnicas=[{nome:'Técnica',custo:'1 PM',desc:'Teste'}];
  const out = generate3DetChatText(d);
  need(out, ['VANTAGENS','DESVANTAGENS','TÉCNICAS'], '3DeT');
}

// Geradores embutidos e filtro de modos.
{
  const app = await readFile('src/PJLiteApp.jsx','utf8');
  const required = [
    "if (sys === 'rotaZero') return generateRotaZeroChatText(item);",
    "if (sys === 'somdas6' && item.type === 'pc')",
    "if (sys === 'fabula' && item.type === 'pc')",
    "if (sys === 'dnd5e' && item.type === 'pc')",
    "VANTAGENS|DESVANTAGENS|TÉCNICAS",
    "VEÍCULO|VEICULO|TURNO|CARGA|UPGRADES",
    "ÂNCORA|ANCORA|NOTAS",
  ];
  for (const token of required) if (!app.includes(token)) throw new Error(`Compatibilidade geral da Ficha Chat ausente: ${token}`);
}

console.log('✓ Ficha Chat: Rota Zero, Skyfall, Ordem, 3DeT e roteamento geral verificados.');
