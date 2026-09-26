export const SYSTEMS = [
  { id: 'dragonbane', name: 'Dragonbane', status: 'active', enabled: true },
  { id: 'dnd5e', name: 'D&D 5.5e', status: 'active', enabled: true },
  { id: 'fabulaUltima', name: 'Fabula Ultima', status: 'active', enabled: true },
  { id: 'somDasSeis', name: 'O Som das Seis', status: 'active', enabled: true },
  { id: 'skyfall', name: 'Skyfall RPG', status: 'planned', enabled: false },
  { id: 'tormenta20', name: 'Tormenta20', status: 'planned', enabled: false },
  { id: 'ordemParanormal', name: 'Ordem Paranormal RPG', status: 'planned', enabled: false },
  { id: '3det', name: '3D&T', status: 'planned', enabled: false },
  { id: 'guerraDosTronos', name: 'Guerra dos Tronos RPG', status: 'planned', enabled: false },
];

export const ACTIVE_SYSTEMS = SYSTEMS.filter(system => system.enabled);
export const PLANNED_SYSTEMS = SYSTEMS.filter(system => !system.enabled);

export function getSystem(id) {
  return SYSTEMS.find(system => system.id === id) || null;
}
