import { DND_2024_CLASSES } from '../systems/dnd5e/classPanels.js';
import srdSpells1 from '../systems/dnd5e/srd521-spells-1.js';
import srdSpells2 from '../systems/dnd5e/srd521-spells-2.js';
import srdSpells3 from '../systems/dnd5e/srd521-spells-3.js';
import srdSpells4 from '../systems/dnd5e/srd521-spells-4.js';
import srdClassFeatures from '../systems/dnd5e/srd521-features-classes.js';
import srdSubclassFeatures from '../systems/dnd5e/srd521-features-subclasses.js';

export const DND_SRD_SPELL_COUNT = srdSpells1.length+srdSpells2.length+srdSpells3.length+srdSpells4.length;
export const DND_SRD_FEATURE_COUNT = srdClassFeatures.length+srdSubclassFeatures.length;


const STORAGE_KEY = 'pjlite_ability_presets_v1';

// Examples authored for PJLite; not transcriptions of official game powers.
const STARTERS = {
  ordemParanormal: {
    habilidades: [
      { nome:'Observação Metódica', tipo:'Habilidade (modelo PJLite)', custo:'A definir', desc:'Depois de examinar uma cena com calma, descreva uma pista que você está procurando. Combine com o mestre se existe algum efeito mecânico.' },
      { nome:'Protocolo de Emergência', tipo:'Poder (modelo PJLite)', custo:'A definir', desc:'Você sabe organizar uma resposta rápida a um incidente. Descreva a ação de apoio; custo e benefício dependem das regras da mesa.' }
    ],
    rituais: [
      { nome:'Luz de Vigília', circulo:1, elemento:'A definir', execucao:'A definir', alcance:'Curto', duracao:'Cena', resistencia:'Nenhuma', desc:'Uma luminosidade fraca revela formas e detalhes próximos. Modelo narrativo original; ajuste custo, elemento e efeitos com o mestre.' }
    ],
    poderesParanormais: [
      { nome:'Eco do Silêncio', elemento:'A definir', requisito:'A definir', custo:'A definir', desc:'O personagem percebe um ruído que não existe para os outros. Exemplo narrativo original do PJLite; defina efeitos e custo com o mestre.' }
    ]
  },
  dnd5e: {
    // Descriptions are short Portuguese adaptations of the CC BY 4.0 SRD 5.2.1,
    // not copied from a non-SRD Player's Handbook translation.
    magias: [
      {
        nome:'Mãos Mágicas', nivel:0, escola:'Conjuração', tempo:'Ação', alcance:'9 m',
        duracao:'1 minuto', alvo:'Mão espectral a até 9 m',
        verbal:true, somatico:true, material:false, materialDetalhe:'',
        concentracao:false, ritual:false, preparada:false,
        salvaguarda:'', dano:'',
        desc:'Cria uma mão espectral que pode manipular objetos leves a distância, abrir portas destrancadas e transportar um objeto de até 4,5 kg. Não realiza ataques. Consulte o SRD 5.2.1 para limitações.',
        fonte:'D&D SRD 5.2.1 — CC BY 4.0 (adaptação PJLite)'
      },
      {
        nome:'Curar Ferimentos', nivel:1, escola:'Abjuração', tempo:'Ação', alcance:'Toque',
        duracao:'Instantânea', alvo:'Criatura tocada',
        verbal:true, somatico:true, material:false, materialDetalhe:'',
        concentracao:false, ritual:false, preparada:false,
        salvaguarda:'', dano:'Cura 2d8 + modificador de conjuração',
        desc:'A criatura tocada recupera 2d8 pontos de vida mais o modificador do atributo de conjuração. +2d8 de cura para cada nível de espaço acima do 1º.',
        fonte:'D&D SRD 5.2.1 — CC BY 4.0 (adaptação PJLite)'
      },
      {
        nome:'Bola de Fogo', nivel:3, escola:'Evocação', tempo:'Ação', alcance:'45 m',
        duracao:'Instantânea', alvo:'Esfera de 6 m de raio',
        verbal:true, somatico:true, material:true,
        materialDetalhe:'Guano de morcego e enxofre',
        concentracao:false, ritual:false, preparada:false,
        salvaguarda:'Destreza (metade do dano)', dano:'8d6 fogo',
        desc:'Uma explosão de chamas atinge as criaturas na esfera. Salvaguarda de Destreza para sofrer metade do dano. +1d6 por espaço acima do 3º nível.',
        fonte:'D&D SRD 5.2.1 — CC BY 4.0 (adaptação PJLite)'
      }
    ],
    caracteristicas: [
      {
        nome:'Juramento Pessoal', tipo:'classe', origem:'classe',
        desc:'Modelo original do PJLite: descreva uma promessa ou objetivo marcante do personagem. Preencha aqui o efeito mecânico aprovado pelo mestre.'
      },
      {
        nome:'Treinamento Especializado', tipo:'classe', origem:'classe',
        desc:'Modelo original do PJLite: registre a aptidão aprendida e suas condições de uso. Não é uma habilidade oficial e não concede bônus automaticamente.'
      }
    ]
  },
  skyfall: {
    habilidades: [
      { nome:'Promessa de Retorno', origem:'Habilidade (modelo PJLite)', desc:'Quando assumir um compromisso importante, registre-o na ficha. Combine com o mestre como ele influenciará sua história e os testes.' }
    ],
    magias: [
      { nome:'Fagulha Errante', camada:'Truque', custo:'A definir', execucao:'Ação', alcance:'Curto', duracao:'Instantânea', descritores:'Luz', desc:'Cria uma pequena fagulha luminosa, sem causar dano por padrão. Exemplo original do PJLite; confirme o uso com o mestre.' }
    ]
  }
};

// Templates tied to the player's class/subclass. Mechanical text from non-SRD
// supplements is never reproduced; each is explicitly an editable worksheet.
const officialSrdSubclassNames=new Set(srdSubclassFeatures.map(item=>item.classId+'::'+item.subclasse));
const dndSubclassOutline=DND_2024_CLASSES.flatMap(cls=>(cls.subclasses||[])
 .filter(name=>!officialSrdSubclassNames.has(cls.id+'::'+name))
 .map(name=>({
  nome:'Ficha de '+name,
  nomeOriginal:'Template for '+name,
  tipo:'classe',origem:'subclasse',classId:cls.id,classe:cls.label,subclasse:name,
  desc:'MODELO DE ANOTAÇÃO (NÃO OFICIAL). Esta subclasse não possui a descrição completa no SRD 5.2.1. Consulte seu Livro do Jogador ou suplemento autorizado e anote os benefícios e níveis aqui. O PJLite não atribui efeitos automaticamente.',
  fonte:'Modelo de anotação PJLite · conteúdo não presente no SRD 5.2.1',
  idiomaDescricao:'pt',
  nivelMinimo:3,
  _srdId:'outline:'+cls.id+':'+name
 })));
const dndCatalog={
 magias:[...srdSpells1,...srdSpells2,...srdSpells3,...srdSpells4].map(entry=>{
  const translated=(STARTERS.dnd5e.magias||[]).find(item=>item.nomeOriginal===entry.nomeOriginal||item.nome===entry.nome);
  if(!translated)return entry;
  return {
   ...entry,
   desc:translated.desc+'\n\nTEXTO DO SRD (inglês):\n'+entry.desc,
   resumoPt:translated.desc,
   dano:translated.dano||entry.dano,
   alvo:translated.alvo||entry.alvo||'',
   salvaguarda:translated.salvaguarda||entry.salvaguarda||''
  };
 }),
 caracteristicas:[...srdClassFeatures,...srdSubclassFeatures,...dndSubclassOutline]
};

const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
const clone = entry => JSON.parse(JSON.stringify(entry));
const load = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.filter(v=>v && typeof v === 'object' && v.entry && v.name && v.system && v.kind) : [];
  } catch { return []; }
};
const persist = rows => {
  if (typeof localStorage === 'undefined') return false;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); return true; } catch { return false; }
};

export const findAbilityPresets = (system, kind) => {
  const local = load().filter(p=>p.system===system && p.kind===kind).map(p=>({...p, entry:clone(p.entry), source:'personal'}));
  const defaultEntries = [
    ...(system==='dnd5e'&&kind==='magias' ? [] : STARTERS[system]?.[kind] || []),
    ...(system==='dnd5e' ? dndCatalog[kind] || [] : []),
  ];
  const builtins = defaultEntries.map((entry,index)=>({
    id: 'example-'+system+'-'+kind+'-'+index,
    system, kind, name:entry.nome, entry:clone(entry), source:'example'
  }));
  return [...local, ...builtins].sort((a,b)=>a.source===b.source?a.name.localeCompare(b.name,'pt-BR'):a.source==='personal'?-1:1);
};

export const storeAbilityPreset = (system, kind, entry) => {
  const name = String(entry?.nome || '').trim();
  if (!name || !system || !kind) return {ok:false,reason:'name'};
  const saved=load();
  const idx=saved.findIndex(row=>row.system===system && row.kind===kind && normalize(row.name)===normalize(name));
  const now=new Date().toISOString();
  const item={
    id:idx>=0?saved[idx].id:'personal-'+now+'-'+Math.random().toString(36).slice(2,8),
    system,kind,name,entry:clone(entry),source:'personal',updatedAt:now
  };
  if(idx>=0)saved[idx]=item;else saved.push(item);
  return persist(saved) ? {ok:true,updated:idx>=0} : {ok:false,reason:'storage'};
};

export const removeAbilityPreset = (id) => {
  const saved=load();
  return persist(saved.filter(item=>item.id!==id));
};

export const abilityPresetKindName = kind => ({
  habilidades:'Habilidades e poderes',
  caracteristicas:'Habilidades da classe',
  poderesParanormais:'Poderes paranormais',
  rituais:'Rituais',
  magias:'Magias'
}[kind] || 'Modelos');
