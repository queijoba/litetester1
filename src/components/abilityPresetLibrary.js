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
  const builtins = (STARTERS[system]?.[kind] || []).map((entry,index)=>({
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
  rituais:'Rituais',
  magias:'Magias'
}[kind] || 'Modelos');
