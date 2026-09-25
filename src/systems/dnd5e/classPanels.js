export const DND_2024_CLASSES = [
  {
    id: 'barbaro',
    label: 'Bárbaro',
    icon: '⚔️',
    summary: 'Controle rápido de Fúria e seus valores usados em combate.',
    fields: [
      { key: 'furia', label: 'Fúria', type: 'tracker' },
      { key: 'danoFuria', label: 'Dano da Fúria', type: 'text', placeholder: '+2' }
    ]
  },
  {
    id: 'bardo',
    label: 'Bardo',
    icon: '🎵',
    summary: 'Inspiração Bárdica e o dado usado pelo personagem.',
    fields: [
      { key: 'inspiracaoBardica', label: 'Inspiração Bárdica', type: 'tracker' },
      { key: 'dadoInspiracao', label: 'Dado de Inspiração', type: 'text', placeholder: 'd6' }
    ]
  },
  {
    id: 'clerigo',
    label: 'Clérigo',
    icon: '✦',
    summary: 'Usos de Canalizar Divindade e observações do domínio.',
    fields: [
      { key: 'canalizarDivindade', label: 'Canalizar Divindade', type: 'tracker' }
    ]
  },
  {
    id: 'druida',
    label: 'Druida',
    icon: '🌿',
    summary: 'Forma Selvagem e recursos naturais de uso frequente.',
    fields: [
      { key: 'formaSelvagem', label: 'Forma Selvagem', type: 'tracker' }
    ]
  },
  {
    id: 'guerreiro',
    label: 'Guerreiro',
    icon: '🛡️',
    summary: 'Recursos de combate do Guerreiro reunidos em um único painel.',
    fields: [
      { key: 'segundoFolego', label: 'Second Wind / Segundo Fôlego', type: 'tracker' },
      { key: 'surtoAcao', label: 'Action Surge / Surto de Ação', type: 'tracker' },
      { key: 'indomavel', label: 'Indomável', type: 'tracker' }
    ]
  },
  {
    id: 'monge',
    label: 'Monge',
    icon: '☯',
    summary: 'Pontos de Foco e dado de Artes Marciais.',
    fields: [
      { key: 'foco', label: 'Pontos de Foco', type: 'tracker' },
      { key: 'artesMarciais', label: 'Dado de Artes Marciais', type: 'text', placeholder: 'd6' }
    ]
  },
  {
    id: 'paladino',
    label: 'Paladino',
    icon: '☀️',
    summary: 'Reserva de cura e recursos divinos de uso limitado.',
    fields: [
      { key: 'imposicaoMaos', label: 'Lay on Hands / Imposição das Mãos', type: 'tracker' },
      { key: 'canalizarDivindade', label: 'Canalizar Divindade', type: 'tracker' }
    ]
  },
  {
    id: 'patrulheiro',
    label: 'Patrulheiro',
    icon: '🏹',
    summary: 'Usos gratuitos ligados à Marca do Caçador e recursos do Patrulheiro.',
    fields: [
      { key: 'marcaCacador', label: 'Marca do Caçador', type: 'tracker' }
    ]
  },
  {
    id: 'ladino',
    label: 'Ladino',
    icon: '🗡️',
    summary: 'Ataque Furtivo e recursos táticos do Ladino.',
    fields: [
      { key: 'ataqueFurtivo', label: 'Ataque Furtivo', type: 'text', placeholder: '3d6' }
    ]
  },
  {
    id: 'feiticeiro',
    label: 'Feiticeiro',
    icon: '✨',
    summary: 'Pontos de Feitiçaria em um contador separado do grimório.',
    fields: [
      { key: 'pontosFeiticaria', label: 'Pontos de Feitiçaria', type: 'tracker' }
    ]
  },
  {
    id: 'bruxo',
    label: 'Bruxo',
    icon: '🌙',
    summary: 'Espaços de Magia de Pacto e o nível em que são conjurados.',
    fields: [
      { key: 'magiaPacto', label: 'Espaços de Magia de Pacto', type: 'tracker' },
      { key: 'nivelPacto', label: 'Nível dos Espaços', type: 'text', placeholder: '2º círculo' }
    ]
  },
  {
    id: 'mago',
    label: 'Mago',
    icon: '📘',
    summary: 'Recuperação Arcana e anotações do grimório do Mago.',
    fields: [
      { key: 'recuperacaoArcanaUsada', label: 'Recuperação Arcana usada', type: 'toggle' },
      { key: 'recuperacaoArcana', label: 'Níveis recuperáveis', type: 'number', placeholder: '1' }
    ]
  }
];

export function getDndClassByLabel(label = '') {
  const normalized = String(label).trim().toLocaleLowerCase('pt-BR');
  return DND_2024_CLASSES.find(item => item.label.toLocaleLowerCase('pt-BR') === normalized) || null;
}
