export const DND_2024_CLASSES = [
  {
    id: 'barbaro',
    label: 'Bárbaro',
    icon: '⚔️',
    summary: 'Controle rápido de Fúria e seus valores usados em combate.',
    subclassLabel: 'Caminho',
    subclasses: ['Berserker', 'Coração Selvagem', 'Árvore do Mundo', 'Zelote'],
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
    subclassLabel: 'Colégio',
    subclasses: ['Colégio da Dança', 'Colégio do Glamour', 'Colégio do Conhecimento', 'Colégio da Bravura'],
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
    subclassLabel: 'Domínio Divino',
    subclasses: ['Domínio da Vida', 'Domínio da Luz', 'Domínio da Trapaça', 'Domínio da Guerra'],
    fields: [
      { key: 'canalizarDivindade', label: 'Canalizar Divindade', type: 'tracker' }
    ]
  },
  {
    id: 'druida',
    label: 'Druida',
    icon: '🌿',
    summary: 'Forma Selvagem e recursos naturais de uso frequente.',
    subclassLabel: 'Círculo Druídico',
    subclasses: ['Círculo da Terra', 'Círculo da Lua', 'Círculo do Mar', 'Círculo das Estrelas'],
    fields: [
      { key: 'formaSelvagem', label: 'Forma Selvagem', type: 'tracker' }
    ]
  },
  {
    id: 'guerreiro',
    label: 'Guerreiro',
    icon: '🛡️',
    summary: 'Recursos de combate do Guerreiro reunidos em um único painel.',
    subclassLabel: 'Subclasse',
    subclasses: ['Mestre de Batalha', 'Campeão', 'Cavaleiro Arcano', 'Guerreiro Psiônico'],
    fields: [
      { key: 'segundoFolego', label: 'Segundo Fôlego', type: 'tracker' },
      { key: 'surtoAcao', label: 'Surto de Ação', type: 'tracker' },
      { key: 'indomavel', label: 'Indomável', type: 'tracker' }
    ]
  },
  {
    id: 'monge',
    label: 'Monge',
    icon: '☯',
    summary: 'Pontos de Foco e dado de Artes Marciais.',
    subclassLabel: 'Tradição',
    subclasses: ['Guerreiro da Misericórdia', 'Guerreiro da Sombra', 'Guerreiro dos Elementos', 'Guerreiro da Mão Aberta'],
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
    subclassLabel: 'Juramento',
    subclasses: ['Juramento da Devoção', 'Juramento da Glória', 'Juramento dos Anciões', 'Juramento da Vingança'],
    fields: [
      { key: 'imposicaoMaos', label: 'Imposição das Mãos', type: 'tracker' },
      { key: 'canalizarDivindade', label: 'Canalizar Divindade', type: 'tracker' }
    ]
  },
  {
    id: 'patrulheiro',
    label: 'Patrulheiro',
    icon: '🏹',
    summary: 'Usos ligados à Marca do Caçador e recursos do Patrulheiro.',
    subclassLabel: 'Subclasse',
    subclasses: ['Mestre das Feras', 'Andarilho Feérico', 'Perseguidor Sombrio', 'Caçador'],
    fields: [
      { key: 'marcaCacador', label: 'Marca do Caçador', type: 'tracker' }
    ]
  },
  {
    id: 'ladino',
    label: 'Ladino',
    icon: '🗡️',
    summary: 'Ataque Furtivo e recursos táticos do Ladino.',
    subclassLabel: 'Subclasse',
    subclasses: ['Trapaceiro Arcano', 'Assassino', 'Lâmina da Alma', 'Ladrão'],
    fields: [
      { key: 'ataqueFurtivo', label: 'Ataque Furtivo', type: 'text', placeholder: '3d6' }
    ]
  },
  {
    id: 'feiticeiro',
    label: 'Feiticeiro',
    icon: '✨',
    summary: 'Pontos de Feitiçaria em um contador separado do grimório.',
    subclassLabel: 'Origem de Feitiçaria',
    subclasses: ['Feitiçaria Aberrante', 'Feitiçaria Mecânica', 'Feitiçaria Dracônica', 'Magia Selvagem'],
    fields: [
      { key: 'pontosFeiticaria', label: 'Pontos de Feitiçaria', type: 'tracker' }
    ]
  },
  {
    id: 'bruxo',
    label: 'Bruxo',
    icon: '🌙',
    summary: 'Espaços de Magia de Pacto e o nível em que são conjurados.',
    subclassLabel: 'Patrono',
    subclasses: ['Arquifada', 'Celestial', 'Corruptor', 'Grande Antigo'],
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
    subclassLabel: 'Tradição Arcana',
    subclasses: ['Abjurador', 'Adivinhador', 'Evocador', 'Ilusionista'],
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
