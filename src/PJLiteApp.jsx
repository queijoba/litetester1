import DndCharacterEditor from './systems/dnd5e/components/CharacterEditor.jsx';
import DndThreatEditor from './systems/dnd5e/components/ThreatEditor.jsx';
import FabulaCharacterEditor from './systems/fabulaUltima/components/CharacterEditor.jsx';
import FabulaThreatEditor from './systems/fabulaUltima/components/ThreatEditor.jsx';
import Som6CharacterEditor from './systems/somDasSeis/components/CharacterEditor.jsx';
import Som6ThreatEditor from './systems/somDasSeis/components/ThreatEditor.jsx';
import DragonbaneEditor from './systems/dragonbane/components/Editor.jsx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import JSZip from 'jszip';
import LZString from 'lz-string';

const { useState, useEffect, useRef } = React;

        const STORAGE_KEY = 'dragonbane_saved_characters';
        const THREAT_STORAGE_KEY = 'dragonbane_saved_threats'; 
        const THEME_PREF_KEY = 'dragonbane_theme_prefs';
        const CUSTOM_BG_KEY = 'dragonbane_custom_bg';
        const CUSTOM_WIN_COLOR_KEY = 'dragonbane_custom_win_color';
        const CUSTOM_BAR_COLOR_KEY = 'dragonbane_custom_bar_color';
        const CUSTOM_OPACITY_KEY = 'dragonbane_custom_opacity';
        const CUSTOM_ACCENT_COLOR_KEY = 'pjlite_custom_accent_color';
        const CUSTOM_TEXT_COLOR_KEY = 'pjlite_custom_text_color';
        const CUSTOM_OVERLAY_KEY = 'pjlite_custom_overlay';
        const CUSTOM_BLUR_KEY = 'pjlite_custom_blur';
        const CUSTOM_BG_POSITION_KEY = 'pjlite_custom_bg_position';
        const CUSTOM_BG_SIZE_KEY = 'pjlite_custom_bg_size';
        const HISTORY_STORAGE_KEY = 'pjlite_item_history_v1';
        const NEWS_COLLAPSED_KEY = 'pjlite_news_collapsed_v1';
        const SCHEMA_VERSION = 6;

        const UPDATE_LOG = [
            { versao: '0.7.0v Alpha', descricao: 'Marco da linha 0.7: Guias e Tutoriais foram reescritos e ampliados para orientar melhor iniciantes e usuários recorrentes; Fabula Ultima ganhou seleção modular de suplementos e módulos extras por material, mantendo Arcanos, Magia & Rituais e Projetos no Livro Básico; O Som das Seis recebeu revisão visual e de experiência, habilidades mais compactas, reordenação e melhor leitura no desktop e celular; além de revisões gerais de tema, modo escuro, organização, compatibilidade e textos da interface.' },
            { versao: '0.6.9v Alpha', descricao: 'Grande rodada de refinamento visual e usabilidade: Dragonbane, D&D 5e, Fabula Ultima e O Som das Seis ganharam fichas mais próximas de suas identidades originais sem abandonar a proposta Lite. Dragonbane recebeu layout desktop reequilibrado; D&D ganhou visual de ficha clássica e Itens Sincronizados; Fabula Ultima recebeu dados visuais, habilidades e magias em duas colunas, reordenação, consultas rápidas de PI, conjuração, rituais e projetos, além de uma ficha de Ameaça/PNJ mais compacta e intuitiva. Guias e Tutoriais também foram reorganizados para iniciantes.' },
            { versao: '0.6.7v Alpha', descricao: 'O Som das Seis entra em teste avançado dentro da linha 0.6: ficha principal compacta inspirada no PDF oficial, aba separada de Montaria, retrato por upload ou URL, tema próprio do sistema, modo escuro refinado, Tema Personalizado redesenhado com prévia, estilos rápidos e controles de fundo, revisões de layout e guias ampliados com suporte para iniciantes e link para o material original.' },
            { versao: '0.6.5v Alpha', descricao: 'Revisão de estabilidade e fechamento da adaptação de Fabula Ultima: salvamento seguro ao voltar, histórico/autosave e importações revisados, Ficha Chat refinada, modelos Press Start reorganizados, nova Ficha Extra de Projetos, equipamentos e PI consolidados, além de melhorias de armazenamento, imagens, temas e carregamento por CDN.' },
            { versao: '0.6.4v Alpha', descricao: 'Revisão geral e polimento final da linha 0.6: barra de novidades minimizável, acesso rápido ao canal de anúncios no Telegram, Ficha Chat em quatro modos, interface enxuta, Equipamentos e consulta rápida de PI em Fabula Ultima, temas refinados, importação ZIP/JSON revisada e correções de estabilidade em autosave, histórico, desfazer e armazenamento local.' },
            { versao: '0.5.9v Alpha', descricao: 'Fabula Ultima integrado aos Guias e Tutoriais, novo Tema Fabula Ultima, retrato por URL na ficha de personagem e guias passo a passo mais intuitivos para criação de personagens em Dragonbane, D&D 5e e Fabula Ultima.' },
            { versao: '0.5.6v Alpha', descricao: 'Fichas mobile com abas, temas expandidos, Modo Escuro aprimorado, Ficha Chat revisada, modelos de Dragonbane e início da integração de Fabula Ultima.' },
            { versao: '0.5.4v Alpha', descricao: 'Correções do Mago de D&D, lista dinâmica de Características & Talentos, nova organização de magias, Guia ampliado e identidade PJ Lite.' },
            { versao: '0.5.1 Alpha', descricao: 'Ajustes no layout "Sobre o Projeto", restauração da caixa DMLite e reorganização completa das abas de Guias e Tutoriais.' },
            { versao: '0.5.0 Alpha', descricao: 'Primeira versão pública do PJ Lite, com foco inicial em Dragonbane.' }
    
        ];

        /* ==============================================================
         * CONSTANTES E MODELOS DE DRAGONBANE (INTACTOS)
         * ============================================================== */
        const MODELOS_AMEACAS_GENERICOS = [
            // --- PNJs ---
            { type: 'pnj', system: 'dragonbane', tipoPnj: 'lacaio', nome: 'Bandoleiro da Estrada', ancestralidade: 'Humano', profissao: 'Bandido', movimento: '10', danoBonus: '-', armaduraTipica: { nome: 'Couro Fervido', valor: '2' }, status: { pv: { atual: 10, max: 10 }, pd: { atual: 0, max: 0 } }, pericias: [{ nome: 'Briga', valor: '12' }, { nome: 'Furtividade', valor: '12' }, { nome: 'Sobrevivência', valor: '10' }], feiticos: [], armas: [{ nome: 'Espada Curta', pericia: '12', dano: '1D8' }, { nome: 'Arco Curto', pericia: '10', dano: '1D10' }], equipamento: '1D6 moedas de cobre, corda gasta.', atitude: 'Hostil e Agressivo', motivacao: 'Roubar moedas', tracoMarcante: 'Cheiro muito forte de bebida' },
            { type: 'pnj', system: 'dragonbane', tipoPnj: 'chefe', nome: 'Capitão da Guarda', ancestralidade: 'Humano', profissao: 'Guarda/Milícia', movimento: '10', danoBonus: '+D4', armaduraTipica: { nome: 'Cota de Malha', valor: '4' }, status: { pv: { atual: 14, max: 14 }, pd: { atual: 4, max: 4 } }, pericias: [{ nome: 'Percepção', valor: '14' }, { nome: 'Liderança', valor: '12' }], feiticos: [], armas: [{ nome: 'Espada Larga', pericia: '14', dano: '2D6+D4' }, { nome: 'Besta', pericia: '12', dano: '2D8' }], equipamento: 'Manto do destacamento, chaves da prisão, 2D6 moedas de prata.', atitude: 'Desconfiado/Na defensiva', motivacao: 'Cumprir ordens superiores', tracoMarcante: 'Cicatriz bem visível' },
            // --- AMEAÇAS / MONSTROS ---
            { type: 'ameaca', system: 'dragonbane', nome: 'Lobo Selvagem', ferocidade: 1, tamanho: 'Normal', movimento: '14', armadura: '1 (Pele grossa)', status: { pv: { atual: 12, max: 12 } }, habilidades: [{ nome: 'Faro de Caçador', desc: 'Vantagem em testes de Percepção envolvendo cheiro.' }], ataques: [ { id: 1, descricao: 'Investida Selvagem: O lobo avança e morde. Dano 1D8 de perfuração.' }, { id: 2, descricao: 'Investida Selvagem: O lobo avança e morde. Dano 1D8 de perfuração.' }, { id: 3, descricao: 'Puxão Pelo Calcanhar: Morde a perna do alvo (Dano 1D6) e tenta Derrubar.' }, { id: 4, descricao: 'Puxão Pelo Calcanhar: Morde a perna do alvo (Dano 1D6) e tenta Derrubar.' }, { id: 5, descricao: 'Mordida na Garganta: Ataque letal. Dano 2D6 de perfuração.' }, { id: 6, descricao: 'Uivo Assustador: Uiva de forma horripilante. Todos os alvos em 10m fazem teste de Força de Vontade ou ficam Assustados.' } ] }
        ];

        const initialData = {
            id: '', type: 'pc', system: 'dragonbane',
            bio: { jogador: '', nome: '', ancestralidade: '', profissao: '', idade: '', fraqueza: '', aparencia: '', memento: '', imagem: '' },
            atributos: { for: { valor: 10, condicao: false }, con: { valor: 10, condicao: false }, agl: { valor: 10, condicao: false }, int: { valor: 10, condicao: false }, von: { valor: 10, condicao: false }, car: { valor: 10, condicao: false } },
            derivados: { danoBonusFor: '', danoBonusAgl: '', movimento: '', limiteSobrecarga: '' },
            status: { pv: { atual: 10, max: 10 }, pd: { atual: 10, max: 10 }, testesMorte: { sucessos: [false, false, false], falhas: [false, false, false] }, manterDerivados: false, armasPrimeiro: false },
            periciasBase: [ { nome: 'Acrobatismo', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Blefe', attr: 'CAR', valor: '', avanco: false, treinada: false }, { nome: 'Caça e Pesca', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Cura', attr: 'INT', valor: '', avanco: false, treinada: false }, { nome: 'Encontrar', attr: 'INT', valor: '', avanco: false, treinada: false }, { nome: 'Equitação', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Evasão', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Furtividade', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Idiomas', attr: 'INT', valor: '', avanco: false, treinada: false }, { nome: 'Manufatura', attr: 'FOR', valor: '', avanco: false, treinada: false }, { nome: 'Marinharia', attr: 'INT', valor: '', avanco: false, treinada: false }, { nome: 'Mitos e Lendas', attr: 'INT', valor: '', avanco: false, treinada: false }, { nome: 'Natação', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Percepção', attr: 'INT', valor: '', avanco: false, treinada: false }, { nome: 'Performance', attr: 'CAR', valor: '', avanco: false, treinada: false }, { nome: 'Permuta', attr: 'CAR', valor: '', avanco: false, treinada: false }, { nome: 'Persuasão', attr: 'CAR', valor: '', avanco: false, treinada: false }, { nome: 'Prestidigitação', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Saber de Feras', attr: 'INT', valor: '', avanco: false, treinada: false }, { nome: 'Sobrevivência', attr: 'INT', valor: '', avanco: false, treinada: false } ],
            periciasArmas: [ { nome: 'Arcos', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Bestas', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Briga', attr: 'FOR', valor: '', avanco: false, treinada: false }, { nome: 'Cajados', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Espadas', attr: 'FOR', valor: '', avanco: false, treinada: false }, { nome: 'Estilingues', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Facas', attr: 'AGL', valor: '', avanco: false, treinada: false }, { nome: 'Lanças', attr: 'FOR', valor: '', avanco: false, treinada: false }, { nome: 'Machados', attr: 'FOR', valor: '', avanco: false, treinada: false }, { nome: 'Martelos', attr: 'FOR', valor: '', avanco: false, treinada: false } ],
            periciasSecundarias: [], habilidadesFeiticos: [], armas: [],
            defesa: { armadura: { nome: '', valor: '', reves: '' }, elmo: { nome: '', valor: '', reves: '' } },
            inventario: '', itensMiudos: '', moedas: { ouro: 0, prata: 0, cobre: 0 }
        };

        const MODELOS_DRAGONBANE_PC = [
            { ...initialData, bio: { ...initialData.bio, nome: 'Arquimestre Aodhan', ancestralidade: 'Humano', profissao: 'Mago – Elementalista', idade: 'Idoso', fraqueza: 'Covarde. Você sempre fica na parte de trás do grupo.', aparencia: 'Magro e delgado. Longa barba branca e sobrancelhas cheias. Olhos questionadores.', memento: 'Diário gasto, repleto de experiências e descobertas.' }, atributos: { for: { valor: 8, condicao: false }, con: { valor: 11, condicao: false }, agl: { valor: 9, condicao: false }, int: { valor: 16, condicao: false }, von: { valor: 18, condicao: false }, car: { valor: 14, condicao: false } }, derivados: { ...initialData.derivados, movimento: 8 }, status: { ...initialData.status, pv: { atual: 11, max: 11 }, pd: { atual: 18, max: 18 } }, habilidadesFeiticos: [{ nome: 'Adaptativo', fv_nvl: '3 PD' }, { nome: 'Bola de Fogo', fv_nvl: '' }, { nome: 'Pilar', fv_nvl: '' }, { nome: 'Lufada de Vento', fv_nvl: '' }, { nome: 'Calor/Frio', fv_nvl: '' }, { nome: 'Nuvem de Fumaça', fv_nvl: '' }, { nome: 'Ignição', fv_nvl: '' }], periciasSecundarias: [{ nome: 'Elementalismo', attr: 'INT', valor: 14, avanco: false }], armas: [{ nome: 'Cajado', empunhadura: '2M', alcance: '2', dano: 'D8', tracos: 'Contundente' }], inventario: 'Grimório\nTocha' },
            { ...initialData, bio: { ...initialData.bio, nome: 'Orla Lua-de-Prata', ancestralidade: 'Elfa', profissao: 'Caçadora', idade: 'Adulta', fraqueza: 'Intolerante. Notívagos como orcs e goblins são malignos e precisam ser combatidos.', aparencia: 'Andar suave e confiante. Olhos atentos que examinam todos com desconfiança.', memento: 'Presa do troll que matou sua irmã.' }, atributos: { for: { valor: 13, condicao: false }, con: { valor: 15, condicao: false }, agl: { valor: 17, condicao: false }, int: { valor: 13, condicao: false }, von: { valor: 10, condicao: false }, car: { valor: 9, condicao: false } }, derivados: { ...initialData.derivados, danoBonusFor: '+D4', danoBonusAgl: '+D6', movimento: 14 }, status: { ...initialData.status, pv: { atual: 15, max: 15 }, pd: { atual: 10, max: 10 } }, habilidadesFeiticos: [{ nome: 'Paz Interior', fv_nvl: '—' }, { nome: 'Tiro Duplo', fv_nvl: '3 PD' }], armas: [{ nome: 'Arco Longo', empunhadura: '2M', alcance: '100', dano: 'D12', tracos: 'Perfurante' }, { nome: 'Faca', empunhadura: '1M', alcance: '13', dano: 'D8', tracos: 'Perfurante, Sutil' }], inventario: 'Aljava\nTocha\nCorda' },
            { ...initialData, bio: { ...initialData.bio, nome: 'Bastonn Mandíbula-de-Sangue', ancestralidade: 'Lupino', profissao: 'Guerreiro', idade: 'Jovem', fraqueza: 'Glutão. Você aproveita todas as chances que tem para comer algo saboroso.', aparencia: 'Músculos marcados e salientes. Leal para amigos e ameaçador para adversários.', memento: 'Garrafa de perfume azul.' }, atributos: { for: { valor: 18, condicao: false }, con: { valor: 17, condicao: false }, agl: { valor: 14, condicao: false }, int: { valor: 11, condicao: false }, von: { valor: 13, condicao: false }, car: { valor: 7, condicao: false } }, derivados: { ...initialData.derivados, danoBonusFor: '+D6', danoBonusAgl: '+D4', movimento: 14 }, status: { ...initialData.status, pv: { atual: 17, max: 17 }, pd: { atual: 13, max: 13 } }, habilidadesFeiticos: [{ nome: 'Instintos de Caça', fv_nvl: '' }, { nome: 'Veterano', fv_nvl: '' }], armas: [{ nome: 'Lança Longa', empunhadura: '2M', alcance: '4', dano: '2D8', tracos: 'Longa, Perfurante' }, { nome: 'Lança Curta', empunhadura: '1M', alcance: '36', dano: 'D10', tracos: 'Perfurante' }], defesa: { ...initialData.defesa, armadura: { nome: 'Couro Batido', valor: '2', reves: '' } }, inventario: 'Tocha\nPederneira e Isqueiro' },
            { ...initialData, bio: { ...initialData.bio, nome: 'Krisanna, A Ousada', ancestralidade: 'Halfling', profissao: 'Ladra', idade: 'Jovem', fraqueza: 'Temerária. Você sempre assume grandes riscos sem pensar nas consequências.', aparencia: 'Semblante inocente, olhos perspicazes e passos leves e silenciosos.', memento: 'Um mapa do tesouro que você “encontrou”.' }, atributos: { for: { valor: 8, condicao: false }, con: { valor: 13, condicao: false }, agl: { valor: 18, condicao: false }, int: { valor: 14, condicao: false }, von: { valor: 15, condicao: false }, car: { valor: 10, condicao: false } }, derivados: { ...initialData.derivados, danoBonusAgl: '+D6', movimento: 12 }, status: { ...initialData.status, pv: { atual: 13, max: 13 }, pd: { atual: 15, max: 15 } }, habilidadesFeiticos: [{ nome: 'Difícil de Pegar', fv_nvl: '3 PD' }, { nome: 'Apunhalar pelas Costas', fv_nvl: '' }], armas: [{ nome: 'Adaga', empunhadura: '1M', alcance: '8', dano: 'D8', tracos: 'Cortante, Perfurante, Sutil' }, { nome: 'Faca', empunhadura: '1M', alcance: '8', dano: 'D8', tracos: 'Perfurante, Sutil' }], defesa: { ...initialData.defesa, armadura: { nome: 'Couro', valor: '1', reves: '' } }, inventario: 'Gazuas Simples\nTocha\nCorda\nPederneira e Isqueiro' },
            { ...initialData, bio: { ...initialData.bio, nome: 'Capitã Betrix Navegalém', ancestralidade: 'Humano', profissao: 'Marinheira', idade: 'Adulta', fraqueza: 'Autoritária. Você sempre diz aos outros o que fazer.', aparencia: 'Bronzeada, rosto severo e olhos atentos. Veste roupas práticas e resistentes.', memento: 'Desenho do navio perfeito em um estojo impermeável.' }, atributos: { for: { valor: 14, condicao: false }, con: { valor: 12, condicao: false }, agl: { valor: 15, condicao: false }, int: { valor: 12, condicao: false }, von: { valor: 16, condicao: false }, car: { valor: 11, condicao: false } }, derivados: { ...initialData.derivados, danoBonusFor: '+D4', danoBonusAgl: '+D4', movimento: 12 }, status: { ...initialData.status, pv: { atual: 12, max: 12 }, pd: { atual: 16, max: 16 } }, habilidadesFeiticos: [{ nome: 'Adaptativo', fv_nvl: '3 PD' }, { nome: 'Pernas do Mar', fv_nvl: '' }], armas: [{ nome: 'Cimitarra', empunhadura: '1M', alcance: '2', dano: '2D6', tracos: 'Cortante' }], inventario: 'Corda (cânhamo)\nArpéu\nLuneta' }
        ];

        const initialPnjData = { id: '', type: 'pnj', system: 'dragonbane', tipoPnj: 'lacaio', nome: '', ancestralidade: '', profissao: '', movimento: '10', danoBonus: '', armaduraTipica: { nome: '', valor: '' }, status: { pv: { atual: 10, max: 10 }, pd: { atual: 0, max: 0 } }, pericias: [], feiticos: [], armas: [], equipamento: '', atitude: '', motivacao: '', tracoMarcante: '' };
        const initialAmeacaData = { id: '', type: 'ameaca', system: 'dragonbane', nome: '', ferocidade: 1, tamanho: 'Normal', movimento: '10', armadura: '', status: { pv: { atual: 20, max: 20 } }, habilidades: [], ataques: [{ id: 1, descricao: '' }, { id: 2, descricao: '' }, { id: 3, descricao: '' }, { id: 4, descricao: '' }, { id: 5, descricao: '' }, { id: 6, descricao: '' }] };

        /* ==============================================================
         * CONSTANTES E MODELOS DE D&D 5E (2024)
         * ============================================================== */
        const DND_SKILLS_LIST = [
            { id: 'acrobacia', nome: 'Acrobacia', attr: 'des' }, { id: 'arcanismo', nome: 'Arcanismo', attr: 'int' },
            { id: 'atletismo', nome: 'Atletismo', attr: 'for' }, { id: 'atuacao', nome: 'Atuação', attr: 'car' },
            { id: 'enganacao', nome: 'Enganação', attr: 'car' }, { id: 'furtividade', nome: 'Furtividade', attr: 'des' },
            { id: 'historia', nome: 'História', attr: 'int' }, { id: 'intimidacao', nome: 'Intimidação', attr: 'car' },
            { id: 'intuicao', nome: 'Intuição', attr: 'sab' }, { id: 'investigacao', nome: 'Investigação', attr: 'int' },
            { id: 'lidaranimais', nome: 'Lidar com Animais', attr: 'sab' }, { id: 'medicina', nome: 'Medicina', attr: 'sab' },
            { id: 'natureza', nome: 'Natureza', attr: 'int' }, { id: 'percepcao', nome: 'Percepção', attr: 'sab' },
            { id: 'persuasao', nome: 'Persuasão', attr: 'car' }, { id: 'prestidigitacao', nome: 'Prestidigitação', attr: 'des' },
            { id: 'religiao', nome: 'Religião', attr: 'int' }, { id: 'sobrevivencia', nome: 'Sobrevivência', attr: 'sab' }
        ];

        const initialDndPcData = {
            id: '', system: 'dnd5e', type: 'pc',
            bio: { nome: '', classe: '', linhagem: '', antecedente: '', alinhamento: '', xp: 0, nivel: 1, jogador: '', imagem: '' },
            atributos: { for: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 },
            status: { pvAtual: 10, pvMax: 10, pvTemp: 0, dadosVida: '1d10', ca: 10, iniciativa: '', deslocamento: '9 m', inspiracao: false, percepcaoPassiva: '' },
            testesMorte: { sucessos: [false, false, false], falhas: [false, false, false] },
            proficienciasResistencia: { for: false, des: false, con: false, int: false, sab: false, car: false },
            pericias: DND_SKILLS_LIST.map(sk => ({ id: sk.id, prof: 0 })), // 0: Nenhuma, 1: Proficiência, 2: Expertise (Dobro)
            ataques: [{ nome: 'Arma Simples', bonus: '+2', dano: '1d6', tipo: 'Cortante' }],
            magias: { conjuracao: { habilidade: '', cd: '', ataque: '' }, slots: { 1: { atual: 0, max: 0 }, 2: { atual: 0, max: 0 }, 3: { atual: 0, max: 0 }, 4: { atual: 0, max: 0 }, 5: { atual: 0, max: 0 }, 6: { atual: 0, max: 0 }, 7: { atual: 0, max: 0 }, 8: { atual: 0, max: 0 }, 9: { atual: 0, max: 0 } }, lista: [] },
            caracteristicas: [],
            tracosPersonalidade: '', ideais: '', vinculos: '', defeitos: '',
            outrasProficiencias: '',
            inventario: '', itensSincronizados: [], moedas: { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 }
        };

        const initialDndMonsterData = {
            id: '', system: 'dnd5e', type: 'ameaca',
            nome: '', tamanho: 'Médio', tipo: 'humanoide', alinhamento: 'imparcial',
            ca: '10', pv: '11 (2d8 + 2)', deslocamento: '9 m',
            atributos: { for: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 },
            testesResistencia: '', pericias: '', vulnerabilidades: '',
            resistencias: '', imunidadesDano: '', imunidadesCondicao: '',
            sentidos: 'Percepção passiva 10', idiomas: '-', desafio: '1/8 (25 XP)', proficienciaBonus: '+2',
            tracos: [], acoes: [{ nome: 'Ataque', desc: 'Descrição do ataque...' }],
            acoesBonus: [], reacoes: [], acoesLendarias: []
        };

        const MODELOS_DND_PC = [
            { ...initialDndPcData, bio: { ...initialDndPcData.bio, nome: 'Guerreiro Humano', classe: 'Guerreiro', linhagem: 'Humano', antecedente: 'Soldado', alinhamento: 'Leal e Neutro', nivel: 1 }, atributos: { for: 16, des: 14, con: 14, int: 9, sab: 11, car: 13 }, status: { ...initialDndPcData.status, pvAtual: 12, pvMax: 12, dadosVida: '1d10', ca: 16, deslocamento: '9 m' }, proficienciasResistencia: { for: true, des: false, con: true, int: false, sab: false, car: false }, pericias: DND_SKILLS_LIST.map(sk => ({ id: sk.id, prof: ['atletismo', 'percepcao', 'sobrevivencia', 'intimidacao'].includes(sk.id) ? 1 : 0 })), ataques: [{ nome: 'Espada Longa', bonus: '+5', dano: '1d8+3', tipo: 'Cortante' }], caracteristicas: [{ nome: 'Estilo de Combate: Defesa', desc: 'Treinamento marcial focado em proteção.' }, { nome: 'Retomar o Fôlego', desc: 'Recurso de recuperação do guerreiro.' }], outrasProficiencias: 'Todas as armaduras, escudos. Armas simples e marciais. Veículos (terrestres).', inventario: 'Cota de malha, Espada longa, Escudo, Pacote de Aventureiro.' },
            { ...initialDndPcData, bio: { ...initialDndPcData.bio, nome: 'Mago Alto Elfo', classe: 'Mago', linhagem: 'Elfo (Alto)', antecedente: 'Sábio', alinhamento: 'Neutro e Bom', nivel: 1 }, atributos: { for: 8, des: 14, con: 12, int: 16, sab: 12, car: 10 }, status: { ...initialDndPcData.status, pvAtual: 7, pvMax: 7, dadosVida: '1d6', ca: 12, deslocamento: '9 m' }, proficienciasResistencia: { for: false, des: false, con: false, int: true, sab: true, car: false }, pericias: DND_SKILLS_LIST.map(sk => ({ id: sk.id, prof: ['arcanismo', 'historia', 'investigacao', 'percepcao'].includes(sk.id) ? 1 : 0 })), ataques: [{ nome: 'Raio de Fogo', bonus: '+5', dano: '1d10', tipo: 'Fogo' }], magias: { ...initialDndPcData.magias, slots: { ...initialDndPcData.magias.slots, 1: { atual: 2, max: 2 } }, lista: [{ nome: 'Raio de Fogo', nivel: 'Truque', desc: '' }, { nome: 'Luz', nivel: 'Truque', desc: '' }, { nome: 'Mãos Mágicas', nivel: 'Truque', desc: '' }, { nome: 'Armadura Mágica', nivel: '1', desc: '' }, { nome: 'Mísseis Mágicos', nivel: '1', desc: '' }, { nome: 'Escudo Arcano', nivel: '1', desc: '' }, { nome: 'Sono', nivel: '1', desc: '' }] }, caracteristicas: [{ nome: 'Recuperação Arcana', desc: 'Recurso de classe do mago.' }, { nome: 'Visão no Escuro', desc: '18 m.' }, { nome: 'Ancestralidade Feérica', desc: 'Traço de linhagem.' }], outrasProficiencias: 'Adagas, dardos, fundas, bastões, bestas leves. Idiomas: Comum, Élfico, Dracônico.', inventario: 'Grimório, Foco Arcano, Adaga, Pacote de Estudioso.' },
            { ...initialDndPcData, bio: { ...initialDndPcData.bio, nome: 'Ladino Halfling', classe: 'Ladino', linhagem: 'Halfling (Pés-Leves)', antecedente: 'Criminoso', alinhamento: 'Caótico e Neutro', nivel: 1 }, atributos: { for: 8, des: 16, con: 14, int: 12, sab: 10, car: 14 }, status: { ...initialDndPcData.status, pvAtual: 10, pvMax: 10, dadosVida: '1d8', ca: 14, deslocamento: '7.5 m' }, proficienciasResistencia: { for: false, des: true, con: false, int: true, sab: false, car: false }, pericias: DND_SKILLS_LIST.map(sk => ({ id: sk.id, prof: ['furtividade', 'prestidigitacao'].includes(sk.id) ? 2 : ['acrobacia', 'enganacao'].includes(sk.id) ? 1 : 0 })), ataques: [{ nome: 'Arco Curto', bonus: '+5', dano: '1d6+3', tipo: 'Perfurante' }, { nome: 'Adaga', bonus: '+5', dano: '1d4+3', tipo: 'Perfurante' }], caracteristicas: [{ nome: 'Ataque Furtivo', desc: 'Dano adicional quando as condições do recurso são atendidas.' }, { nome: 'Gíria de Ladrão', desc: '' }, { nome: 'Sortudo', desc: '' }, { nome: 'Bravura', desc: '' }], outrasProficiencias: 'Armaduras leves. Armas simples, bestas de mão, espadas longas, rapieiras, espadas curtas. Ferramentas de Ladrão.', inventario: 'Armadura de Couro, Arco Curto (20 flechas), 2 Adagas, Ferramentas de Ladrão.' }
        ];

        const MODELOS_DND_AMEACA = [
            { ...initialDndMonsterData, nome: 'Goblin (SRD)', tamanho: 'Pequeno', tipo: 'humanoide (goblinoide)', alinhamento: 'neutro e mau', ca: '15 (armadura de couro, escudo)', pv: '7 (2d6)', deslocamento: '9 m', atributos: { for: 8, des: 14, con: 10, int: 10, sab: 8, car: 8 }, pericias: 'Furtividade +6', sentidos: 'visão no escuro 18 m, Percepção passiva 9', idiomas: 'Comum, Goblin', desafio: '1/4 (50 XP)', proficienciaBonus: '+2', acoes: [{ nome: 'Cimitarra', desc: 'Ataque Corpo-a-Corpo com Arma: +4 para atingir, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano cortante.' }, { nome: 'Arco Curto', desc: 'Ataque à Distância com Arma: +4 para atingir, distância 24/96 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.' }], acoesBonus: [{ nome: 'Fuga Ágil', desc: 'O goblin pode realizar a ação Desengajar ou Esconder-se como uma Ação Bônus em cada um dos seus turnos.' }] },
            { ...initialDndMonsterData, nome: 'Esqueleto (SRD)', tamanho: 'Médio', tipo: 'morto-vivo', alinhamento: 'leal e mau', ca: '13 (restos de armadura)', pv: '13 (2d8 + 4)', deslocamento: '9 m', atributos: { for: 10, des: 14, con: 15, int: 6, sab: 8, car: 5 }, vulnerabilidades: 'concussão', imunidadesDano: 'veneno', imunidadesCondicao: 'exausto, envenenado', sentidos: 'visão no escuro 18 m, Percepção passiva 9', idiomas: 'compreende os idiomas que falava em vida, mas não pode falar', desafio: '1/4 (50 XP)', proficienciaBonus: '+2', acoes: [{ nome: 'Espada Curta', desc: 'Ataque Corpo-a-Corpo com Arma: +4 para atingir, alcance 1,5 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.' }, { nome: 'Arco Curto', desc: 'Ataque à Distância com Arma: +4 para atingir, distância 24/96 m, um alvo. Acerto: 5 (1d6 + 2) de dano perfurante.' }] },
            { ...initialDndMonsterData, nome: 'Ogro (SRD)', tamanho: 'Grande', tipo: 'gigante', alinhamento: 'caótico e mau', ca: '11 (peles)', pv: '59 (7d10 + 21)', deslocamento: '12 m', atributos: { for: 19, des: 8, con: 16, int: 5, sab: 7, car: 7 }, sentidos: 'visão no escuro 18 m, Percepção passiva 8', idiomas: 'Comum, Gigante', desafio: '2 (450 XP)', proficienciaBonus: '+2', acoes: [{ nome: 'Clava Grande', desc: 'Ataque Corpo-a-Corpo com Arma: +6 para atingir, alcance 1,5 m, um alvo. Acerto: 13 (2d8 + 4) de dano de concussão.' }, { nome: 'Azagaia', desc: 'Ataque à Distância com Arma: +6 para atingir, alcance 9/36 m, um alvo. Acerto: 11 (2d6 + 4) de dano perfurante.' }] }
        ];


        /* ==============================================================
         * FABULA ULTIMA — FICHA PRINCIPAL / COMPATIBILIDADE PJ LITE
         * Interface independente do PJ Lite, com módulos extras opcionais.
         * ============================================================== */
        const FABULA_SUPPLEMENT_OPTIONS = [
            { id:'basico', icon:'📘', nome:'Livro Básico', desc:'Estrutura principal da ficha. Sempre ativo.', locked:true },
            { id:'natural', icon:'🌿', nome:'Atlas: Natural Fantasy', desc:'Acampamento, Jardim, Receitas, Invocações, Comércio, materiais e fabricação.' },
            { id:'high', icon:'✨', nome:'Atlas: High Fantasy', desc:'Poderes Zero e opções avançadas de alta fantasia.' },
            { id:'techno', icon:'⚙️', nome:'Atlas: Techno Fantasy', desc:'Tecnosferas, Mnemosfera, veículos e recursos tecnológicos.' },
            { id:'codex', icon:'🩸', nome:'Codex Extra', desc:'Classes adicionais, peculiaridades e recursos especializados.' }
        ];
        const FABULA_DEFAULT_SUPPLEMENTS = { basico:true, natural:false, high:false, techno:false, codex:false };
        const FABULA_EXTRA_OPTIONS = [
            { id:'magia', icon:'🔮', nome:'Magia & Rituais', desc:'Feitiços, disciplinas e rituais.', source:'basico' },
            { id:'projetos', icon:'🛠️', nome:'Projetos', desc:'Invenções, custo, progresso, materiais especiais e defeitos.', source:'basico' },
            { id:'anotacoes', icon:'📝', nome:'Anotações Extras', desc:'Regras opcionais e lembretes livres.', source:'basico' },
            { id:'peculiaridade', icon:'💠', nome:'Peculiaridade', desc:'Nome, efeito, origem e observações da peculiaridade.', anyAtlas:true },
            { id:'armaPersonalizada', icon:'⚔️', nome:'Armas Personalizadas', desc:'Armas únicas com teste, dano, categoria e características.', sources:['natural','high','techno'] },
            { id:'recursosClasse', icon:'🎛️', nome:'Recursos de Classe', desc:'Contadores, cargas e recursos específicos das classes.', anyAtlas:true },
            { id:'receitas', icon:'🍳', nome:'Receitas', desc:'Ingredientes, sabores, combinações e efeitos do Gourmet.', source:'natural' },
            { id:'acampamento', icon:'🌙', nome:'Atividades de Acampamento', desc:'Duas atividades e benefícios que duram até o próximo descanso.', source:'natural' },
            { id:'jardim', icon:'🌱', nome:'Jardim & Magissementes', desc:'Magissemente ativa, relógio de germinação e sementes conhecidas.', source:'natural' },
            { id:'invocacoes', icon:'🌊', nome:'Invocações & Mananciais', desc:'Mananciais disponíveis e invocações conhecidas.', source:'natural' },
            { id:'comercio', icon:'💰', nome:'Comércio', desc:'Pontos de Comércio e prosperidade de assentamentos.', source:'natural' },
            { id:'materiais', icon:'🔨', nome:'Materiais & Fabricação', desc:'Materiais coletados, valor, quantidade e uso em fabricação.', source:'natural' },
            { id:'poderZero', icon:'💥', nome:'Poderes Zero', desc:'Registre gatilhos e efeitos extraordinários.', source:'high' },
            { id:'mnemosfera', icon:'🧠', nome:'Mnemosfera', desc:'Classe, nível, poderes e Poder Heroico.', source:'techno' },
            { id:'tecnosferas', icon:'💿', nome:'Tecnosferas', desc:'Tecnosferas instaladas, tipo, equipamento e efeitos.', source:'techno' },
            { id:'veiculo', icon:'🚀', nome:'Veículo', desc:'Veículo pessoal ou de grupo, módulos e observações.', source:'techno' },
            { id:'arcanos', icon:'🌟', nome:'Arcanos', desc:'Vínculos, domínios e efeitos de Arcanos do Livro Básico.', source:'basico' }
        ];
        const isFabulaExtraUnlocked = (opt, suplementos={}) => {
            const src = { ...FABULA_DEFAULT_SUPPLEMENTS, ...(suplementos || {}) };
            if (opt.source === 'basico') return true;
            if (Array.isArray(opt.sources)) return opt.sources.some(id => !!src[id]);
            if (opt.anyAtlas) return !!(src.natural || src.high || src.techno || src.codex);
            return !!src[opt.source];
        };


        const FABULA_MAGIC_DISCIPLINES = ['Arcanismo','Quimerismo','Elementalismo','Entropismo','Ritualismo','Espiritualismo'];
        const FABULA_SPELL_DISCIPLINES = ['Quimerismo','Elementalismo','Entropismo','Espiritualismo'];
        const FABULA_RITUAL_POTENCY = {
            Menor: { pm: 20, nd: 7, relogio: 4 },
            Média: { pm: 30, nd: 10, relogio: 6 },
            Maior: { pm: 40, nd: 13, relogio: 6 },
            Extrema: { pm: 50, nd: 16, relogio: 8 }
        };
        const FABULA_RITUAL_AREA = { Individual: 1, Pequena: 2, Grande: 3, Enorme: 4 };
        const getFabulaMagicTestHint = (disciplina='') => {
            const d = String(disciplina || '').trim().toLowerCase();
            if (d === 'arcanismo') return 'VON + VON';
            if (d === 'quimerismo') return 'AST + VON ou VIG + VON';
            if (['elementalismo','entropismo','ritualismo','espiritualismo'].includes(d)) return 'AST + VON';
            return '';
        };
        const getFabulaRitualRef = (potencia='Menor', area='Individual') => {
            const p = FABULA_RITUAL_POTENCY[potencia] || FABULA_RITUAL_POTENCY.Menor;
            const mult = FABULA_RITUAL_AREA[area] || 1;
            return { pm: p.pm * mult, nd: p.nd, relogio: p.relogio, multiplicador: mult };
        };

        const initialFabulaPcData = {
            id: '', system: 'fabula', type: 'pc',
            suplementos: { ...FABULA_DEFAULT_SUPPLEMENTS },
            bio: { nome: '', jogador: '', genero: '', identidade: '', tema: '', origem: '', tracos: '', imagem: '' },
            nivel: 5, experiencia: 0, zenites: 0,
            atributos: {
                des: { base: 'd8', atual: 'd8' }, ast: { base: 'd8', atual: 'd8' },
                vig: { base: 'd8', atual: 'd8' }, von: { base: 'd8', atual: 'd8' }
            },
            condicoes: { lento: false, enfurecido: false, atordoado: false, fraco: false, envenenado: false, abalado: false },
            status: { pvAtual: 40, pvMax: 40, pmAtual: 40, pmMax: 40, piAtual: 6, piMax: 6, fabula: 3, defesa: 8, defesaMagica: 8, iniciativa: 0 },
            lacos: [],
            classes: [
                { nome: '', nivel: 1, beneficios: '', poderes: [] },
                { nome: '', nivel: 1, beneficios: '', poderes: [] }
            ],
            poderesHeroicos: [],
            equipamentos: [
                { slot: 'Mão dominante', nome: '', descricao: '' },
                { slot: 'Mão secundária', nome: '', descricao: '' },
                { slot: 'Armadura', nome: '', descricao: '' },
                { slot: 'Acessório', nome: '', descricao: '' }
            ],
            equipavel: { armaduraMarcial: false, escudoMarcial: false, armaCorpoMarcial: false, armaDistanciaMarcial: false },
            inventario: [],
            mochila: '', caracteristicas: '',
            extrasAtivos: [],
            extras: {
                magia: { disciplinas: [], feiticos: [], rituais: [] },
                arcanos: { lista: [] },
                mnemosfera: { nome: '', classe: '', nivel: 1, poderes: [], poderHeroico: '' },
                receitas: { maxIngredientes: '', ingredientes: { amargo: '', salgado: '', azedo: '', doce: '', umami: '' }, combinacoes: '', notas: '' },
                projetos: { lista: [] },
                anotacoes: { regras: '', notas: '' },
                peculiaridade: { nome:'', origem:'', efeito:'', notas:'' },
                armaPersonalizada: { lista: [] },
                recursosClasse: { lista: [] },
                acampamento: { atividades:[{nome:'',alvo:'',efeito:''},{nome:'',alvo:'',efeito:''}], beneficios:[] },
                jardim: { magissementeAtual:'', germinacao:0, conhecidas:[] },
                invocacoes: { mananciais:{agua:false,ar:false,fogo:false,raio:false,terra:false}, lista:[] },
                comercio: { atual:0, max:0, assentamentos:[] },
                materiais: { lista:[] },
                poderZero: { lista:[] },
                tecnosferas: { lista:[] },
                veiculo: { nome:'', tipo:'', estrutura:'', passageiros:'', modulos:[], notas:'' }
            }
        };

        const normalizeFabulaPcData = (item) => {
            const clone = JSON.parse(JSON.stringify(item));
            if (clone.system !== 'fabula' || clone.type !== 'pc') return clone;
            clone.suplementos = { ...FABULA_DEFAULT_SUPPLEMENTS, ...(clone.suplementos || {}) };
            clone.suplementos.basico = true;
            clone.bio = { ...initialFabulaPcData.bio, ...(clone.bio || {}) };
            clone.atributos = { ...JSON.parse(JSON.stringify(initialFabulaPcData.atributos)), ...(clone.atributos || {}) };
            Object.keys(initialFabulaPcData.atributos).forEach(k => clone.atributos[k] = { ...initialFabulaPcData.atributos[k], ...(clone.atributos[k] || {}) });
            clone.condicoes = { ...initialFabulaPcData.condicoes, ...(clone.condicoes || {}) };
            clone.status = { ...initialFabulaPcData.status, ...(clone.status || {}) };
            clone.lacos = Array.isArray(clone.lacos) ? clone.lacos : [];
            clone.classes = Array.isArray(clone.classes) ? clone.classes : JSON.parse(JSON.stringify(initialFabulaPcData.classes));
            clone.classes = clone.classes.map(c => ({ nome: '', nivel: 1, beneficios: '', poderes: [], ...c, poderes: Array.isArray(c?.poderes) ? c.poderes : [] }));
            clone.poderesHeroicos = Array.isArray(clone.poderesHeroicos) ? clone.poderesHeroicos : [];
            clone.equipamentos = Array.isArray(clone.equipamentos) ? clone.equipamentos : JSON.parse(JSON.stringify(initialFabulaPcData.equipamentos));
            clone.equipamentos = clone.equipamentos.map(eq => ({ slot: 'Outro', nome: '', descricao: '', ...(eq || {}) }));
            clone.equipavel = { ...initialFabulaPcData.equipavel, ...(clone.equipavel || {}) };
            clone.inventario = Array.isArray(clone.inventario) ? clone.inventario : (clone.inventario ? String(clone.inventario).split('\n').filter(Boolean).map(nome => ({ nome, quantidade: 1, notas: '' })) : []);
            clone.inventario = clone.inventario.map(it => ({ nome: '', quantidade: 1, notas: '', ...(it || {}) }));
            clone.extrasAtivos = Array.isArray(clone.extrasAtivos) ? clone.extrasAtivos : [];
            clone.extras = { ...JSON.parse(JSON.stringify(initialFabulaPcData.extras)), ...(clone.extras || {}) };
            clone.extras.magia = { ...initialFabulaPcData.extras.magia, ...(clone.extras.magia || {}) };
            clone.extras.magia.disciplinas = Array.isArray(clone.extras.magia.disciplinas) ? clone.extras.magia.disciplinas : [];
            clone.extras.magia.feiticos = Array.isArray(clone.extras.magia.feiticos) ? clone.extras.magia.feiticos.map(f => ({ nome:'', disciplina:'', ofensiva:false, teste:'', pm:'', alvos:'', duracao:'', desc:'', ...(f || {}) })) : [];
            clone.extras.magia.rituais = Array.isArray(clone.extras.magia.rituais) ? clone.extras.magia.rituais.map(r => ({ nome:'', disciplina:'Ritualismo', potencia:'Menor', area:'Individual', teste:'', pm:'', nd:'', desc:'', falha:'', ...(r || {}) })) : [];
            clone.extras.arcanos = { ...initialFabulaPcData.extras.arcanos, ...(clone.extras.arcanos || {}) };
            clone.extras.arcanos.lista = Array.isArray(clone.extras.arcanos.lista) ? clone.extras.arcanos.lista : [];
            clone.extras.mnemosfera = { ...initialFabulaPcData.extras.mnemosfera, ...(clone.extras.mnemosfera || {}) };
            clone.extras.mnemosfera.poderes = Array.isArray(clone.extras.mnemosfera.poderes) ? clone.extras.mnemosfera.poderes : [];
            clone.extras.receitas = { ...initialFabulaPcData.extras.receitas, ...(clone.extras.receitas || {}) };
            clone.extras.receitas.ingredientes = { ...initialFabulaPcData.extras.receitas.ingredientes, ...(clone.extras.receitas.ingredientes || {}) };
            clone.extras.projetos = { ...initialFabulaPcData.extras.projetos, ...(clone.extras.projetos || {}) };
            clone.extras.projetos.lista = Array.isArray(clone.extras.projetos.lista) ? clone.extras.projetos.lista.map(p => ({ nome:'', descricao:'', custoMaterial:0, progressoAtual:0, progressoNecessario:1, materialEspecial:'', defeito:'', ...(p || {}) })) : [];
            clone.extras.anotacoes = { ...initialFabulaPcData.extras.anotacoes, ...(clone.extras.anotacoes || {}) };
            clone.extras.peculiaridade = { ...initialFabulaPcData.extras.peculiaridade, ...(clone.extras.peculiaridade || {}) };
            clone.extras.armaPersonalizada = { ...initialFabulaPcData.extras.armaPersonalizada, ...(clone.extras.armaPersonalizada || {}) };
            clone.extras.armaPersonalizada.lista = Array.isArray(clone.extras.armaPersonalizada.lista) ? clone.extras.armaPersonalizada.lista : [];
            clone.extras.recursosClasse = { ...initialFabulaPcData.extras.recursosClasse, ...(clone.extras.recursosClasse || {}) };
            clone.extras.recursosClasse.lista = Array.isArray(clone.extras.recursosClasse.lista) ? clone.extras.recursosClasse.lista : [];
            clone.extras.acampamento = { ...initialFabulaPcData.extras.acampamento, ...(clone.extras.acampamento || {}) };
            clone.extras.acampamento.atividades = Array.isArray(clone.extras.acampamento.atividades) ? clone.extras.acampamento.atividades : JSON.parse(JSON.stringify(initialFabulaPcData.extras.acampamento.atividades));
            clone.extras.acampamento.beneficios = Array.isArray(clone.extras.acampamento.beneficios) ? clone.extras.acampamento.beneficios : [];
            clone.extras.jardim = { ...initialFabulaPcData.extras.jardim, ...(clone.extras.jardim || {}) };
            clone.extras.jardim.conhecidas = Array.isArray(clone.extras.jardim.conhecidas) ? clone.extras.jardim.conhecidas : [];
            clone.extras.invocacoes = { ...initialFabulaPcData.extras.invocacoes, ...(clone.extras.invocacoes || {}) };
            clone.extras.invocacoes.mananciais = { ...initialFabulaPcData.extras.invocacoes.mananciais, ...(clone.extras.invocacoes.mananciais || {}) };
            clone.extras.invocacoes.lista = Array.isArray(clone.extras.invocacoes.lista) ? clone.extras.invocacoes.lista : [];
            clone.extras.comercio = { ...initialFabulaPcData.extras.comercio, ...(clone.extras.comercio || {}) };
            clone.extras.comercio.assentamentos = Array.isArray(clone.extras.comercio.assentamentos) ? clone.extras.comercio.assentamentos : [];
            clone.extras.materiais = { ...initialFabulaPcData.extras.materiais, ...(clone.extras.materiais || {}) };
            clone.extras.materiais.lista = Array.isArray(clone.extras.materiais.lista) ? clone.extras.materiais.lista : [];
            clone.extras.poderZero = { ...initialFabulaPcData.extras.poderZero, ...(clone.extras.poderZero || {}) };
            clone.extras.poderZero.lista = Array.isArray(clone.extras.poderZero.lista) ? clone.extras.poderZero.lista : [];
            clone.extras.tecnosferas = { ...initialFabulaPcData.extras.tecnosferas, ...(clone.extras.tecnosferas || {}) };
            clone.extras.tecnosferas.lista = Array.isArray(clone.extras.tecnosferas.lista) ? clone.extras.tecnosferas.lista : [];
            clone.extras.veiculo = { ...initialFabulaPcData.extras.veiculo, ...(clone.extras.veiculo || {}) };
            clone.extras.veiculo.modulos = Array.isArray(clone.extras.veiculo.modulos) ? clone.extras.veiculo.modulos : [];
            return clone;
        };


        const initialFabulaThreatData = {
            id: '', system: 'fabula', type: 'ameaca',
            nome: '', nivel: 5, patente: 'Soldado', especie: 'Humanoide', tipoNpc: 'Ameaça', pontosUltima: 0,
            descricao: '', tracos: '',
            atributos: { des: 'd8', ast: 'd8', vig: 'd8', von: 'd8' },
            status: { pvAtual: 50, pvMax: 50, pmAtual: 40, pmMax: 40, iniciativa: 8, defesa: 8, defesaMagica: 8 },
            afinidades: { fisico:'', ar:'', raio:'', trevas:'', terra:'', fogo:'', gelo:'', luz:'', veneno:'' },
            ataques: [], feiticos: [], poderes: [], outrasAcoes: [], regrasEspeciais: []
        };

        const normalizeFabulaThreatData = (item) => {
            const clone = JSON.parse(JSON.stringify(item));
            if (clone.system !== 'fabula' || clone.type === 'pc') return clone;
            clone.type = 'ameaca';
            clone.atributos = { ...initialFabulaThreatData.atributos, ...(clone.atributos || {}) };
            clone.status = { ...initialFabulaThreatData.status, ...(clone.status || {}) };
            clone.afinidades = { ...initialFabulaThreatData.afinidades, ...(clone.afinidades || {}) };
            clone.ataques = Array.isArray(clone.ataques) ? clone.ataques : [];
            clone.feiticos = Array.isArray(clone.feiticos) ? clone.feiticos.map(f => ({ nome:'', teste:'', pm:0, alvo:'', duracao:'', efeito:'', ofensiva:false, ...(f || {}) })) : [];
            clone.poderes = Array.isArray(clone.poderes) ? clone.poderes : [];
            clone.outrasAcoes = Array.isArray(clone.outrasAcoes) ? clone.outrasAcoes : [];
            clone.regrasEspeciais = Array.isArray(clone.regrasEspeciais) ? clone.regrasEspeciais : [];
            return { ...JSON.parse(JSON.stringify(initialFabulaThreatData)), ...clone, atributos: clone.atributos, status: clone.status, afinidades: clone.afinidades };
        };

        const MODELOS_FABULA_PC = [
            {
                ...JSON.parse(JSON.stringify(initialFabulaPcData)),
                bio: { ...initialFabulaPcData.bio, nome:'Blair Clarimonde', genero:'Elu/Delu', identidade:'Herdeire do Trono de Dunova', tema:'Dever', origem:'Dunova', tracos:'Há algo que eu devo fazer.', imagem:'' },
                nivel: 5, zenites: 120,
                atributos: { des:{base:'d6',atual:'d6'}, ast:{base:'d10',atual:'d10'}, vig:{base:'d8',atual:'d8'}, von:{base:'d8',atual:'d8'} },
                status: { ...initialFabulaPcData.status, pvAtual:45,pvMax:45,pmAtual:60,pmMax:60,piAtual:6,piMax:6,fabula:3,defesa:9,defesaMagica:12,iniciativa:-2 },
                equipamentos:[
                    {slot:'Mão dominante',nome:'Adaga de Aço',descricao:'Corpo a corpo • Precisão [DES + AST] +1 • dano [RA + 4] físico.'},
                    {slot:'Armadura',nome:'Manto do Sábio',descricao:'Defesa = Destreza +1; Defesa Mágica = Astúcia +2; -2 Iniciativa.'},
                    {slot:'Mão secundária',nome:'Escudo de Bronze',descricao:'+2 Defesa.'}
                ],
                caracteristicas:'EPIFANIA — Ao obter 13+ na ação Estudar, faça uma pergunta ao Mestre sobre o alvo; a resposta é honesta.',
                classes:[
                    {nome:'Erudito',nivel:1,beneficios:'+5 PM máximos; conhecimento e investigação.',poderes:[{nome:'Epifania',nivel:1,desc:'Ao obter 13+ em Estudar, pode fazer uma pergunta ao Mestre sobre o alvo.'}]},
                    {nome:'Espiritualista',nivel:2,beneficios:'+5 PM máximos e acesso à magia espiritual.',poderes:[{nome:'Magia Espiritual',nivel:2,desc:'Feitiços conhecidos: Curar e Lux.'}]},
                    {nome:'Orador',nivel:2,beneficios:'+5 PM máximos.',poderes:[{nome:'Encorajar',nivel:2,desc:'Em conflito, use uma ação e 5 PM para curar 10 PV de outra criatura e elevar temporariamente um de seus atributos em um passo.'}]}
                ],
                extrasAtivos:['magia'],
                extras:{...JSON.parse(JSON.stringify(initialFabulaPcData.extras)),magia:{disciplinas:['Espiritualismo'],feiticos:[{nome:'Curar',pm:'10/alvo',alvos:'Até três criaturas',duracao:'Instantânea',desc:'Cada alvo recupera 40 PV.'},{nome:'Lux',pm:'10/alvo',alvos:'Até três criaturas',duracao:'Instantânea',desc:'Feitiço ofensivo [AST + VON]; causa [RA + 15] de dano de luz.'}],rituais:[]}},
                inventario:[]
            },
            {
                ...JSON.parse(JSON.stringify(initialFabulaPcData)),
                bio:{...initialFabulaPcData.bio,nome:'Cassandra',genero:'Ela/Dela',identidade:'Ex-Capitã dos Skyrider',tema:'Dúvida',origem:'Stormkeep',tracos:'Há algo que eu preciso saber.',imagem:''},
                nivel:5, zenites:170,
                atributos:{des:{base:'d10',atual:'d10'},ast:{base:'d6',atual:'d6'},vig:{base:'d8',atual:'d8'},von:{base:'d8',atual:'d8'}},
                status:{...initialFabulaPcData.status,pvAtual:50,pvMax:50,pmAtual:50,pmMax:50,piAtual:6,piMax:6,fabula:3,defesa:11,defesaMagica:8,iniciativa:-2},
                equipamentos:[{slot:'Mão dominante',nome:'Lança',descricao:'Corpo a corpo • Precisão [DES + VIG] +1 • dano [RA + 12] físico.'},{slot:'Armadura',nome:'Manto do Sábio',descricao:'Defesa = Destreza +1; Defesa Mágica = Astúcia +2; -2 Iniciativa.'}],
                equipavel:{...initialFabulaPcData.equipavel,escudoMarcial:true,armaCorpoMarcial:true},
                classes:[
                    {nome:'Mestre de Armas',nivel:2,beneficios:'+5 PV máximos; armas corpo a corpo e escudos marciais.',poderes:[{nome:'Esmaga Ossos',nivel:2,desc:'Após atingir com a lança, pode abrir mão do dano para causar uma condição apropriada ou fazer o alvo perder 20 PM.'}]},
                    {nome:'Elementalista',nivel:3,beneficios:'+5 PM máximos; acesso à magia elemental.',poderes:[{nome:'Magia Elemental',nivel:2,desc:'Feitiços conhecidos na ficha Press Start: Ataque Crescente e Arma Elemental.'}]}
                ],
                extrasAtivos:['magia'],
                extras:{...JSON.parse(JSON.stringify(initialFabulaPcData.extras)),magia:{disciplinas:['Elementalismo'],feiticos:[{nome:'Ataque Crescente',pm:'10',alvos:'Pessoal',duracao:'Instantânea',desc:'Faça um ataque com a lança que pode atingir alvos voadores e causa +5 de dano.'},{nome:'Arma Elemental',pm:'10',alvos:'Uma arma',duracao:'Cena',desc:'A arma passa a causar dano de ar, fogo, gelo, raio ou terra.'}],rituais:[]}}
            },
            {
                ...JSON.parse(JSON.stringify(initialFabulaPcData)),
                bio:{...initialFabulaPcData.bio,nome:'Edgar',genero:'Ele/Dele',identidade:'Jovem Cientista que Sobreviveu',tema:'Esperança',origem:'Pemble',tracos:'Nós podemos tornar este mundo um lugar melhor.',imagem:''},
                nivel:5, zenites:70,
                atributos:{des:{base:'d10',atual:'d10'},ast:{base:'d8',atual:'d8'},vig:{base:'d6',atual:'d6'},von:{base:'d8',atual:'d8'}},
                status:{...initialFabulaPcData.status,pvAtual:40,pvMax:40,pmAtual:45,pmMax:45,piAtual:8,piMax:8,fabula:3,defesa:13,defesaMagica:11,iniciativa:-1},
                equipamentos:[{slot:'Mão dominante',nome:'Pistola',descricao:'À distância • Precisão [DES + AST] +1 • dano [RA + 8] físico.'},{slot:'Armadura',nome:'Traje de Viagem',descricao:'Defesa = Destreza +1; Defesa Mágica = Astúcia +1; -2 Iniciativa.'},{slot:'Mão secundária',nome:'Escudo Rúnico',descricao:'+2 Defesa e +2 Defesa Mágica.'}],
                equipavel:{...initialFabulaPcData.equipavel,escudoMarcial:true,armaDistanciaMarcial:true},
                classes:[
                    {nome:'Atirador',nivel:2,beneficios:'+5 PV máximos; armas à distância e escudos marciais.',poderes:[{nome:'Barragem',nivel:1,desc:'Ao atacar com a pistola, gaste 10 PM para atacar duas criaturas com um único teste de Precisão.'},{nome:'Tiro de Aviso',nivel:1,desc:'Após atingir com a pistola, pode abrir mão do dano para impor uma condição apropriada ou fazer os alvos perderem 20 PM.'}]},
                    {nome:'Inventor',nivel:3,beneficios:'+2 PI máximos e capacidade de iniciar Projetos.',poderes:[{nome:'Chuva de Poções',nivel:1,desc:'Ao usar Remédio ou Elixir com PI, pode afetar duas criaturas, recuperando metade do valor normal em cada uma.'}]}
                ]
            },
            {
                ...JSON.parse(JSON.stringify(initialFabulaPcData)),
                bio:{...initialFabulaPcData.bio,nome:'Lavigne Fallbright',genero:'Ela/Dela',identidade:'Princesa sem Reino',tema:'Culpa',origem:'Armorica',tracos:'Há algo por que não posso me perdoar...',imagem:''},
                nivel:5, zenites:120,
                atributos:{des:{base:'d8',atual:'d8'},ast:{base:'d6',atual:'d6'},vig:{base:'d10',atual:'d10'},von:{base:'d8',atual:'d8'}},
                status:{...initialFabulaPcData.status,pvAtual:70,pvMax:70,pmAtual:45,pmMax:45,piAtual:6,piMax:6,fabula:3,defesa:11,defesaMagica:7,iniciativa:-3},
                equipamentos:[{slot:'Mão dominante',nome:'Montante',descricao:'Corpo a corpo • Precisão [DES + VIG] +1 • dano [RA + 10] físico.'},{slot:'Armadura',nome:'Armadura Rúnica',descricao:'Defesa 11; Defesa Mágica = Astúcia +1; -3 Iniciativa.'}],
                equipavel:{armaduraMarcial:true,escudoMarcial:true,armaCorpoMarcial:true,armaDistanciaMarcial:false},
                classes:[
                    {nome:'Furioso',nivel:3,beneficios:'+5 PV máximos; armas corpo a corpo e armaduras marciais.',poderes:[{nome:'Adrenalina',nivel:3,desc:'Enquanto estiver com 35 PV ou menos, seus ataques causam +6 de dano.'}]},
                    {nome:'Guerreiro Sombrio',nivel:1,beneficios:'+5 PV máximos; armas corpo a corpo e armaduras marciais.',poderes:[{nome:'Golpe de Sombras',nivel:1,desc:'Em conflito, sacrifique PV para fazer um ataque com o montante, aumentar o dano e convertê-lo em trevas.'}]},
                    {nome:'Guardião',nivel:1,beneficios:'+5 PV máximos; armaduras e escudos marciais.',poderes:[{nome:'Proteger',nivel:1,desc:'Quando outra criatura for alvo de ataque, feitiço ou perigo, você pode tomar o lugar dela; em conflito, uma vez por rodada.'}]}
                ]
            }
        ];

        const MODELOS_FABULA_AMEACA = [
            { ...JSON.parse(JSON.stringify(initialFabulaThreatData)), nome:'Cactonto', nivel:15, patente:'Soldado', especie:'Planta', descricao:'Cacto monstruoso territorial, ótimo como exemplo de criatura básica.', tracos:'Assustador, enorme, sensível à água, territorial', atributos:{des:'d8',ast:'d6',vig:'d12',von:'d6'}, status:{pvAtual:90,pvMax:90,pmAtual:55,pmMax:55,iniciativa:7,defesa:8,defesaMagica:6}, afinidades:{...initialFabulaThreatData.afinidades}, ataques:[{nome:'Abraço Perfurador',tipo:'Corpo a corpo',teste:'VIG + VIG +1',dano:'RA + 10',tipoDano:'Físico',efeito:''},{nome:'Barragem de Espinhos',tipo:'À distância',teste:'DES + VIG +1',dano:'RA + 5',tipoDano:'Físico',efeito:''}], feiticos:[{nome:'Drenar Umidade',teste:'VIG + VON +1',pm:10,alvo:'Uma criatura',duracao:'Instantânea',efeito:'Causa [RA + 15] de dano de veneno e recupera PV igual à metade dos PV perdidos pelo alvo.'}], outrasAcoes:[{nome:'Seiva de Cactonto',desc:'Recupera-se das condições fraco e lento e usa Barragem de Espinhos como ataque livre.'}], regrasEspeciais:[{nome:'Planta',desc:'Imune às condições abalado, atordoado e enfurecido.'}] }
        ];


        /* ==============================================================
         * O SOM DAS SEIS — PRIMEIRA PRÉVIA PJ LITE
         * Regras do sistema por Ramon Mineiro — CC BY-SA 4.0 conforme livro.
         * ============================================================== */
        const SOM6_ANTECEDENTES = [
            ['combate','Combate'], ['negocios','Negócios'], ['montaria','Montaria'], ['tradicao','Tradição'],
            ['labuta','Labuta'], ['exploracao','Exploração'], ['roubo','Roubo'], ['medicina','Medicina']
        ];
        const SOM6_HABILIDADES = [
            'LIGHT MY FIRE','LET’S DANCE','FORTUNATE SON','DON’T STOP BELIEVING','IMMIGRANT SONG','GIMME SHELTER',
            'ANOTHER ONE BITES THE DUST','RIDERS ON THE STORM','BORN TO BE WILD','SMOKE ON THE WATER','UNDER PRESSURE',
            'HEARTBREAKER','BARRACUDA','SWEET EMOTION','CRAZY TRAIN','CARRY ON MY WAYWARD SON','WAR PIGS','ACE OF SPADES',
            'A HORSE WITH NO NAME','I WANT TO HOLD YOUR HAND','PARANOID','RAMBLE ON','AQUALUNG','MORE THAN A FEELING'
        ];
        const SOM6_LEVELS = [
            { nivel:1, xp:0, bonus:'Habilidades iniciais' },
            { nivel:2, xp:10, bonus:'+1d6 PV • +1 ponto de Antecedente' },
            { nivel:3, xp:20, bonus:'+1 Atributo • +1 Habilidade' },
            { nivel:4, xp:30, bonus:'+1 Atributo • +1 Habilidade • +1 ponto de Antecedente' },
            { nivel:5, xp:45, bonus:'+1d6 PV • +1 Atributo' },
            { nivel:6, xp:60, bonus:'+1d6 PV • +1 Atributo • +1 Habilidade • +1 ponto de Antecedente' }
        ];

        const Som6Pips = ({ value=0, onChange, max=5, title='' }) => {
            const current = Math.max(0, Math.min(max, Number(value) || 0));
            return <div className="flex flex-wrap gap-1" title={title}>{Array.from({length:max},(_,idx)=>{const n=idx+1;return <button key={n} type="button" aria-label={`${title || 'Valor'} ${n}`} onClick={()=>onChange(current===n ? 0 : n)} className={`som6-pip ${current>=n?'active':''}`}>{current>=n?'•':''}</button>})}</div>;
        };

        const initialSom6PcData = {
            id:'', system:'somdas6', type:'pc',
            bio:{ nome:'', jogador:'', apelido:'', passado:'', aparencia:'', imagem:'' },
            nivel:1, xp:0, dinheiro:150, recompensa:0,
            atributos:{ fisico:0, intelecto:0, coragem:0, agilidade:0 },
            status:{ pvAtual:6, pvMax:6, defesa:5, iniciativa:1, acoes:1 },
            antecedentes:{ combate:0, labuta:0, negocios:0, montaria:0, tradicao:0, exploracao:0, roubo:0, medicina:0 },
            habilidades:[{nome:'',desc:''},{nome:'',desc:''}],
            tormento:{ tipo:'', desc:'' },
            reputacao:{ valor:0, titulo:'', notas:'' },
            cartasSina:[{carta:'',usada:false},{carta:'',usada:false}],
            armas:[], inventario:[],
            montaria:{ ativa:false, nome:'', tipo:'Cavalo', potencia:0, vigor:0, resistencia:0, pvAtual:0, pvMax:0, defesa:5, dano:'', fidelidade:0, itens:[], notas:'' },
            anotacoes:''
        };

        const initialSom6PdjData = {
            id:'', system:'somdas6', type:'ameaca', nome:'', tipoPdj:'Comum', np:1, descricao:'',
            status:{ pvAtual:6, pvMax:6, defesa:5, acoes:1, iniciativaBonus:1, ataqueBonus:1 },
            armas:[], habilidades:[], notas:''
        };

        const normalizeSom6PcData = (item) => {
            const clone = JSON.parse(JSON.stringify(item || {}));
            if (clone.system !== 'somdas6' || clone.type !== 'pc') return clone;
            clone.bio = { ...initialSom6PcData.bio, ...(clone.bio || {}) };
            clone.atributos = { ...initialSom6PcData.atributos, ...(clone.atributos || {}) };
            clone.status = { ...initialSom6PcData.status, ...(clone.status || {}) };
            clone.antecedentes = { ...initialSom6PcData.antecedentes, ...(clone.antecedentes || {}) };
            clone.habilidades = Array.isArray(clone.habilidades) ? clone.habilidades.map(h=>({nome:'',desc:'',...(h||{})})) : [];
            clone.tormento = { ...initialSom6PcData.tormento, ...(clone.tormento || {}) };
            clone.reputacao = { ...initialSom6PcData.reputacao, ...(clone.reputacao || {}) };
            clone.cartasSina = Array.isArray(clone.cartasSina) ? clone.cartasSina.slice(0,2).map(c=>({carta:'',usada:false,...(c||{})})) : [];
            while (clone.cartasSina.length < 2) clone.cartasSina.push({carta:'',usada:false});
            clone.armas = Array.isArray(clone.armas) ? clone.armas.map(a=>({nome:'',dano:'',municaoAtual:'',municaoMax:'',recarga:'',notas:'',...(a||{})})) : [];
            clone.inventario = Array.isArray(clone.inventario) ? clone.inventario.map(i=>{const it={nome:'',quantidade:1,notas:'',...(i||{})}; if(it.qtd !== undefined && (i?.quantidade === undefined || i?.quantidade === null)) it.quantidade=Number(it.qtd||0); delete it.qtd; return it;}) : [];
            clone.montaria = { ...initialSom6PcData.montaria, ...(clone.montaria || {}) }; if ((clone.montaria.vigor === undefined || clone.montaria.vigor === null) && clone.montaria.resistencia !== undefined) clone.montaria.vigor = Number(clone.montaria.resistencia || 0); clone.montaria.vigor = Math.max(0, Math.min(5, Number(clone.montaria.vigor || 0))); clone.montaria.resistencia = clone.montaria.vigor; clone.montaria.potencia = Math.max(0, Math.min(5, Number(clone.montaria.potencia || 0))); clone.montaria.itens = Array.isArray(clone.montaria.itens) ? clone.montaria.itens.map(x=>({nome:'',...(typeof x==='string'?{nome:x}:(x||{}))})) : [];
            clone.nivel = Math.max(1, Math.min(6, Number(clone.nivel || 1)));
            clone.xp = Number(clone.xp || 0); clone.dinheiro = Number(clone.dinheiro ?? 150); clone.recompensa = Number(clone.recompensa || 0);
            return { ...JSON.parse(JSON.stringify(initialSom6PcData)), ...clone, bio:clone.bio, atributos:clone.atributos, status:clone.status, antecedentes:clone.antecedentes, tormento:clone.tormento, reputacao:clone.reputacao, montaria:clone.montaria, habilidades:clone.habilidades, cartasSina:clone.cartasSina, armas:clone.armas, inventario:clone.inventario };
        };

        const normalizeSom6PdjData = (item) => {
            const clone = JSON.parse(JSON.stringify(item || {}));
            if (clone.system !== 'somdas6' || clone.type === 'pc') return clone;
            clone.type = 'ameaca';
            clone.status = { ...initialSom6PdjData.status, ...(clone.status || {}) };
            clone.armas = Array.isArray(clone.armas) ? clone.armas.map(a=>({nome:'',dano:'',notas:'',...(a||{})})) : [];
            clone.habilidades = Array.isArray(clone.habilidades) ? clone.habilidades.map(h=>({nome:'',desc:'',...(h||{})})) : [];
            clone.np = Math.max(1, Math.min(6, Number(clone.np || 1)));
            return { ...JSON.parse(JSON.stringify(initialSom6PdjData)), ...clone, status:clone.status, armas:clone.armas, habilidades:clone.habilidades };
        };

        const MODELOS_SOM6_PC = [
            {
                ...JSON.parse(JSON.stringify(initialSom6PcData)),
                bio:{...initialSom6PcData.bio,nome:'Pistoleira Errante',apelido:'A Raposa',passado:'Vive de cidade em cidade, resolvendo problemas que a lei prefere ignorar.'},
                atributos:{fisico:1,intelecto:1,coragem:1,agilidade:1},
                status:{pvAtual:12,pvMax:12,defesa:5,iniciativa:2,acoes:2},
                antecedentes:{combate:2,labuta:0,negocios:1,montaria:1,tradicao:0,exploracao:0,roubo:0,medicina:0},
                habilidades:[{nome:'LIGHT MY FIRE',desc:'+1 em testes com revólver; o dano também pode se beneficiar da Agilidade conforme a habilidade.'},{nome:'PARANOID',desc:'+1 nos resultados de Iniciativa e a personagem não é pega desprevenida.'}],
                tormento:{tipo:'Vingança',desc:'Busca quem destruiu sua antiga gangue.'},
                reputacao:{valor:0,titulo:'Desconhecida',notas:'Ainda está construindo seu nome na Fronteira.'},
                armas:[{nome:'Revólver',dano:'1d6',municaoAtual:6,municaoMax:6,recarga:'2 ações',notas:''}],
                inventario:[{nome:'Coldre de munição',quantidade:1,notas:'Munição de reserva.'}],
                dinheiro:140
            }
        ];
        const MODELOS_SOM6_PDJ = [
            { ...JSON.parse(JSON.stringify(initialSom6PdjData)), nome:'Capanga Ralé', np:2, descricao:'Capanga comum, geralmente encontrado em bando.', status:{pvAtual:11,pvMax:11,defesa:5,acoes:2,iniciativaBonus:2,ataqueBonus:2}, armas:[{nome:'Revólver',dano:'1d6',notas:''}] },
            { ...JSON.parse(JSON.stringify(initialSom6PdjData)), nome:'Pistoleiro Veterano', np:4, descricao:'Pistoleiro perigoso e rápido no gatilho.', status:{pvAtual:23,pvMax:23,defesa:5,acoes:4,iniciativaBonus:4,ataqueBonus:4}, armas:[{nome:'Revólver',dano:'1d6',notas:'Pode martelar o cão com penalidade apropriada.'}] }
        ];

        /* Helpers D&D 5e */
        const getDndAbilityMod = (score) => Math.floor((score - 10) / 2);
        const formatDndMod = (mod) => mod >= 0 ? `+${mod}` : `${mod}`;
        const getProficiencyBonus = (level) => Math.ceil(level / 4) + 1;

        const normalizeDndPcData = (item) => {
            const clone = JSON.parse(JSON.stringify(item));
            if (clone.system !== 'dnd5e' || clone.type !== 'pc') return clone;
            clone.bio = { ...initialDndPcData.bio, ...(clone.bio || {}) };
            clone.status = { ...initialDndPcData.status, ...(clone.status || {}) };
            clone.status.inspiracao = !!clone.status.inspiracao;
            clone.status.percepcaoPassiva = clone.status.percepcaoPassiva ?? '';
            clone.atributos = { ...initialDndPcData.atributos, ...(clone.atributos || {}) };
            clone.proficienciasResistencia = { ...initialDndPcData.proficienciasResistencia, ...(clone.proficienciasResistencia || {}) };

            // Garante que fichas antigas sempre tenham as 18 perícias atuais,
            // preservando Proficiência/Expertise das entradas já existentes.
            const oldSkills = Array.isArray(clone.pericias) ? clone.pericias : [];
            const oldSkillMap = new Map(oldSkills.map(p => [p?.id, p]));
            clone.pericias = DND_SKILLS_LIST.map(sk => ({ id: sk.id, prof: Math.max(0, Math.min(2, Number(oldSkillMap.get(sk.id)?.prof || 0))) }));

            clone.testesMorte = { ...initialDndPcData.testesMorte, ...(clone.testesMorte || {}) };
            clone.testesMorte.sucessos = Array.from({length:3}, (_,i) => !!clone.testesMorte?.sucessos?.[i]);
            clone.testesMorte.falhas = Array.from({length:3}, (_,i) => !!clone.testesMorte?.falhas?.[i]);

            clone.ataques = Array.isArray(clone.ataques) ? clone.ataques : [];
            clone.caracteristicas = Array.isArray(clone.caracteristicas)
                ? clone.caracteristicas
                : (clone.caracteristicas ? String(clone.caracteristicas).split('\n').filter(Boolean).map(nome => ({ nome, desc: '' })) : []);

            const oldMagias = clone.magias || {};
            clone.magias = { conjuracao: { ...initialDndPcData.magias.conjuracao, ...(oldMagias.conjuracao || {}) }, slots: {}, lista: [] };
            for (let lvl = 1; lvl <= 9; lvl++) clone.magias.slots[lvl] = { ...initialDndPcData.magias.slots[lvl], ...(oldMagias.slots?.[lvl] || {}) };
            clone.magias.lista = Array.isArray(oldMagias.lista)
                ? oldMagias.lista
                : (oldMagias.lista ? String(oldMagias.lista).split('\n').filter(Boolean).map(nome => ({ nome, nivel: '', desc: '' })) : []);

            clone.moedas = { ...initialDndPcData.moedas, ...(clone.moedas || {}) };
            clone.itensSincronizados = Array.isArray(clone.itensSincronizados) ? clone.itensSincronizados.map((it, idx) => ({
                syncId: it?.syncId || `dnd-item-${clone.id || 'legacy'}-${idx}-${Math.random().toString(36).slice(2,7)}`,
                nome: it?.nome || '', quantidade: Number(it?.quantidade ?? 1), tipo: it?.tipo || 'Equipamento',
                bonusAtaque: it?.bonusAtaque || '', dano: it?.dano || '', tipoDano: it?.tipoDano || '', notas: it?.notas || '',
                sincronizarAtaque: !!it?.sincronizarAtaque
            })) : [];

            // Repara o vínculo item ↔ ataque. Itens marcados como arma sincronizada
            // sempre possuem exatamente um ataque ligado por sourceItemId.
            const activeSyncIds = new Set(clone.itensSincronizados.filter(it => it.sincronizarAtaque && it.tipo === 'Arma').map(it => it.syncId));
            clone.ataques = clone.ataques.filter(a => !a?.sourceItemId || activeSyncIds.has(a.sourceItemId));
            clone.itensSincronizados.forEach(it => {
                if (!it.sincronizarAtaque || it.tipo !== 'Arma') return;
                const linked = clone.ataques.find(a => a?.sourceItemId === it.syncId);
                const payload = { nome: it.nome, bonus: it.bonusAtaque, dano: it.dano, tipo: it.tipoDano, sourceItemId: it.syncId };
                if (linked) Object.assign(linked, payload);
                else clone.ataques.push(payload);
            });
            return clone;
        };

        const SVGIcons = {
            Save: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>,
            Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
            Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
            Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
            Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
            ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
            User: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
            Unlock: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>,
            Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
            MessageCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
            HelpCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
            Refresh: () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>,
            Palette: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.504 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>,
            Skull: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><path d="M8 20v2h8v-2"></path><path d="m12.5 17-.5-1-.5 1h1z"></path><path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"></path></svg>,
            Dice: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle><circle cx="8.5" cy="15.5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle></svg>,
            Copy: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
            Code: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
            Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        };

        const normalizeMetaItem = (item) => {
            const clone = JSON.parse(JSON.stringify(item || {}));
            clone.dataVersion = Number(clone.dataVersion || SCHEMA_VERSION);
            clone.meta = { favorite: false, campanha: '', createdAt: '', updatedAt: '', ...(clone.meta || {}) };
            clone.companheiros = Array.isArray(clone.companheiros) ? clone.companheiros : [];
            return clone;
        };
        const getSavedCharacters = () => {
            try {
                const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
                if (!Array.isArray(raw)) return [];
                return raw.filter(x => x && typeof x === 'object').map(item => normalizeMetaItem({ ...item, system: item.system || 'dragonbane', type: 'pc' }));
            } catch { return []; }
        };
        const getSavedThreats = () => {
            try {
                const raw = JSON.parse(localStorage.getItem(THREAT_STORAGE_KEY)) || [];
                if (!Array.isArray(raw)) return [];
                return raw.filter(x => x && typeof x === 'object').map(item => normalizeMetaItem({ ...item, system: item.system || 'dragonbane', type: item.type && item.type !== 'pc' ? item.type : 'ameaca' }));
            } catch { return []; }
        };

        const getChanceBase = (val) => { if (val >= 16) return 7; if (val >= 13) return 6; if (val >= 9) return 5; if (val >= 6) return 4; return 3; };
        const getDanoBonus = (val) => { if (val >= 17) return '+D6'; if (val >= 13) return '+D4'; return '-'; };
        const getMovimento = (ancestralidade, agl) => {
            let base = 10;
            const anc = (ancestralidade || '').toLowerCase();
            if (anc.includes('halfling') || anc.includes('anão') || anc.includes('anao') || anc.includes('marreco')) base = 8;
            else if (anc.includes('lupino')) base = 12;
            let mod = 0;
            if (agl <= 6) mod = -4; else if (agl <= 9) mod = -2; else if (agl >= 16) mod = 4; else if (agl >= 13) mod = 2;
            return base + mod;
        };

        const hexToRgb = (hex) => {
            let cleaned = hex.replace('#', '');
            if (cleaned.length === 3) cleaned = cleaned.split('').map(c => c + c).join('');
            const num = parseInt(cleaned, 16);
            return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
        };

        const readableTextColor = (hex) => {
            try {
                const [r,g,b] = hexToRgb(hex || '#000000');
                const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
                return luminance > 0.62 ? '#171717' : '#ffffff';
            } catch { return '#ffffff'; }
        };

        // Reduz imagens locais antes de armazená-las no localStorage.
        // Isso diminui bastante a chance de exceder a cota do navegador.
        const optimizeImageFile = (file, maxDimension = 900, quality = 0.82) => new Promise((resolve, reject) => {
            if (!file || !String(file.type || '').startsWith('image/')) return reject(new Error('Arquivo de imagem inválido'));
            if (file.size > 12 * 1024 * 1024) return reject(new Error('Imagem muito grande'));
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Não foi possível ler a imagem'));
            reader.onload = () => {
                const original = reader.result;
                if (file.type === 'image/svg+xml') return resolve(original);
                const img = new Image();
                img.onerror = () => resolve(original);
                img.onload = () => {
                    try {
                        const largest = Math.max(img.width || 1, img.height || 1);
                        if (largest <= maxDimension && file.size <= 450 * 1024) return resolve(original);
                        const scale = Math.min(1, maxDimension / largest);
                        const width = Math.max(1, Math.round(img.width * scale));
                        const height = Math.max(1, Math.round(img.height * scale));
                        const canvas = document.createElement('canvas');
                        canvas.width = width; canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return resolve(original);
                        ctx.drawImage(img, 0, 0, width, height);
                        const optimized = canvas.toDataURL('image/webp', quality);
                        resolve(optimized && optimized.length < String(original).length ? optimized : original);
                    } catch { resolve(original); }
                };
                img.src = original;
            };
            reader.readAsDataURL(file);
        });

        const generateChatText = (item) => {
            const sys = item.system || 'dragonbane';
            const safe = (value, fallback = '-') => value !== undefined && value !== null && value !== '' ? value : fallback;
            const hasText = (value) => value !== undefined && value !== null && String(value).trim() !== '';
            const addIf = (label, value) => hasText(value) ? `${label}: ${value}\n` : '';
            const compactText = (value) => String(value || '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
            const bulletsFromText = (value) => {
                const clean = compactText(value);
                if (!clean) return '';
                return clean.split('\n').map(v => v.trim()).filter(Boolean).map(v => `• ${v}`).join('\n');
            };
            let text = '';

            // ==========================================================
            // O SOM DAS SEIS — PERSONAGEM / PDJ
            // ==========================================================
            if (sys === 'somdas6' && item.type === 'pc') {
                const b=item.bio||{}, a=item.atributos||{}, s=item.status||{}, ant=item.antecedentes||{};
                text += `🤠 PERSONAGEM: ${safe(b.nome,'Sem Nome')}\n\n`;
                text += addIf('Jogador', b.jogador); text += addIf('Apelido', b.apelido);
                text += `Nível ${safe(item.nivel,1)} | XP ${safe(item.xp,0)} | $${safe(item.dinheiro,0)} | Recompensa: $${safe(item.recompensa,0)}\n`;
                if (hasText(b.passado)) text += `Passado: ${compactText(b.passado)}\n`;
                text += `\n📊 ATRIBUTOS & STATUS\n\nFísico ${safe(a.fisico,0)} | Intelecto ${safe(a.intelecto,0)} | Coragem ${safe(a.coragem,0)} | Agilidade ${safe(a.agilidade,0)}\n`;
                text += `PV ${safe(s.pvAtual,0)}/${safe(s.pvMax,0)} | Defesa ${safe(s.defesa,5)} | Iniciativa ${safe(s.iniciativa,1)} | Ações ${safe(s.acoes,1)}\n`;
                text += `\n📚 ANTECEDENTES\n\n`;
                SOM6_ANTECEDENTES.forEach(([id,nome])=>text += `${nome}: ${safe(ant[id],0)}${id==='medicina'?'':' | '}${['montaria','medicina'].includes(id)?'\n':''}`);
                const armas=(item.armas||[]).filter(x=>hasText(x?.nome)); const inv=(item.inventario||[]).filter(x=>hasText(x?.nome));
                if(armas.length||inv.length){ text += `\n⚔️ COMBATE & EQUIPAMENTO\n\n`; armas.forEach(x=>text += `• ${x.nome} — ${safe(x.dano,'dano ?')}${hasText(x.municaoMax)?` | Munição ${safe(x.municaoAtual,0)}/${x.municaoMax}`:''}${hasText(x.recarga)?` | Recarga ${x.recarga}`:''}${hasText(x.notas)?` — ${compactText(x.notas)}`:''}\n`); inv.forEach(x=>text += `• ${x.nome}${Number(x.quantidade||1)!==1?` x${x.quantidade}`:''}${hasText(x.notas)?` — ${compactText(x.notas)}`:''}\n`); }
                const hab=(item.habilidades||[]).filter(h=>hasText(h?.nome)||hasText(h?.desc));
                if(hab.length){ text += `\n✨ HABILIDADES\n\n`; hab.forEach(h=>text += `• ${safe(h.nome,'Habilidade')}${hasText(h.desc)?` — ${compactText(h.desc)}`:''}\n`); }
                text += `\n🎭 TORMENTO & REPUTAÇÃO\n\nTormento: ${safe(item.tormento?.tipo)}${hasText(item.tormento?.desc)?` — ${compactText(item.tormento.desc)}`:''}\nReputação: ${safe(item.reputacao?.titulo,'Neutra')} (${Number(item.reputacao?.valor||0)>0?'+':''}${safe(item.reputacao?.valor,0)})${hasText(item.reputacao?.notas)?` — ${compactText(item.reputacao.notas)}`:''}\n`;
                const cards=(item.cartasSina||[]).filter(c=>hasText(c?.carta)); if(cards.length){ text += `\n🃏 CARTAS DE SINA\n\n`; cards.forEach((c,i)=>text += `• Carta ${i+1}: ${c.usada?'Usada':'Disponível'}${hasText(c.carta)?` — ${c.carta}`:''}\n`); }
                if(item.montaria?.ativa){ const m=item.montaria; text += `\n🐎 MONTARIA\n\n${safe(m.nome,'Sem nome')} (${safe(m.tipo,'Montaria')}) | Potência ${safe(m.potencia,0)} | Vigor ${safe(m.vigor,m.resistencia||0)} | PV ${safe(m.pvAtual,0)}/${safe(m.pvMax,0)} | Fidelidade ${safe(m.fidelidade,0)}\n`; if(hasText(m.notas)) text += `${compactText(m.notas)}\n`; }
                if(hasText(item.anotacoes)) text += `\n📝 ANOTAÇÕES\n\n${compactText(item.anotacoes)}\n`;
                return text.trim();
            }
            if (sys === 'somdas6' && item.type !== 'pc') {
                const s=item.status||{};
                text += `🤠 PDJ: ${safe(item.nome,'Sem Nome')}\n\nNP: ${safe(item.np,1)} | Tipo: ${safe(item.tipoPdj,'Comum')}\nPV ${safe(s.pvAtual,0)}/${safe(s.pvMax,0)} | Defesa ${safe(s.defesa,5)} | Ações ${safe(s.acoes,1)} | Bônus Ataque ${safe(s.ataqueBonus,1)} | Bônus Iniciativa ${safe(s.iniciativaBonus,1)}\n`;
                if(hasText(item.descricao)) text += `Descrição: ${compactText(item.descricao)}\n`;
                const armas=(item.armas||[]).filter(a=>hasText(a?.nome)); if(armas.length){ text += `\n⚔️ ATAQUES & ARMAS\n`; armas.forEach(a=>text += `• ${a.nome} — ${safe(a.dano)}${hasText(a.notas)?` — ${compactText(a.notas)}`:''}\n`); }
                const hab=(item.habilidades||[]).filter(h=>hasText(h?.nome)||hasText(h?.desc)); if(hab.length){ text += `\n✨ HABILIDADES\n`; hab.forEach(h=>text += `• ${safe(h.nome,'Habilidade')}${hasText(h.desc)?` — ${compactText(h.desc)}`:''}\n`); }
                if(hasText(item.notas)) text += `\n📝 ANOTAÇÕES\n${compactText(item.notas)}\n`;
                return text.trim();
            }

            // ==========================================================
            // FABULA ULTIMA — PERSONAGEM (RESUMO DE CHAT)
            // ==========================================================
            if (sys === 'fabula' && item.type === 'pc') {
                const b = item.bio || {}, a = item.atributos || {}, st = item.status || {};
                text += `👤 PERSONAGEM: ${safe(b.nome,'Sem Nome')}\n\n`;
                text += addIf('Jogador', b.jogador);
                if (hasText(b.identidade) || hasText(b.genero)) text += `Identidade: ${safe(b.identidade)}${hasText(b.genero) ? ` | Gênero: ${b.genero}` : ''}\n`;
                if (hasText(b.tema) || hasText(b.origem)) text += `Tema: ${safe(b.tema)} | Origem: ${safe(b.origem)}\n`;
                if (hasText(b.tracos)) text += `Traços: ${compactText(b.tracos)}\n`;
                text += `\n📊 ATRIBUTOS\n\n`;
                text += `DES: ${safe(a.des?.atual,'d8')} | AST: ${safe(a.ast?.atual,'d8')} | VIG: ${safe(a.vig?.atual,'d8')} | VON: ${safe(a.von?.atual,'d8')}\n`;
                const conds = Object.entries(item.condicoes || {}).filter(([,v]) => v).map(([k]) => k.charAt(0).toUpperCase()+k.slice(1));
                if (conds.length) text += `Condições: ${conds.join(', ')}\n`;
                text += `\n⚙️ STATUS\n\n`;
                text += `❤️ PV: ${safe(st.pvAtual,0)}/${safe(st.pvMax,0)} | 🔷 PM: ${safe(st.pmAtual,0)}/${safe(st.pmMax,0)} | 🎒 PI: ${safe(st.piAtual,0)}/${safe(st.piMax,0)}\n`;
                text += `🛡️ Defesa: ${safe(st.defesa)} | ✨ Def. Mágica: ${safe(st.defesaMagica)} | ⚡ Iniciativa: ${safe(st.iniciativa,0)}\n`;
                text += `🌟 Pontos de Fabula: ${safe(st.fabula,0)} | Nível: ${safe(item.nivel,5)} | EXP: ${safe(item.experiencia,0)}\n`;
                const classes=(item.classes||[]).filter(c=>hasText(c.nome));
                if(classes.length){ text += `\n✨ CLASSES & PODERES\n\n`; classes.forEach(c=>{ text += `• ${c.nome} — Nível ${safe(c.nivel,1)}\n`; if(hasText(c.beneficios)) text += `  Benefícios: ${compactText(c.beneficios)}\n`; (c.poderes||[]).filter(p=>hasText(p.nome)||hasText(p.desc)).forEach(p=>text += `  ✦ ${safe(p.nome,'Poder')}${p.nivel?` (${p.nivel})`:''}${hasText(p.desc)?` — ${compactText(p.desc)}`:''}\n`); }); }
                const equips=(item.equipamentos||[]).filter(e=>hasText(e.nome));
                if(equips.length){ text += `\n⚔️ EQUIPAMENTO\n\n`; equips.forEach(e=>text += `• ${e.slot}: ${e.nome}${hasText(e.descricao)?` — ${compactText(e.descricao)}`:''}\n`); }
                if((item.lacos||[]).length){ text += `\n🤝 LAÇOS\n\n`; item.lacos.filter(l=>hasText(l.alvo)).forEach(l=>text += `• ${l.alvo} (${safe(l.forca,1)}): ${safe(l.emocoes)}\n`); }
                const invFabula=(item.inventario||[]).filter(it=>hasText(it?.nome));
                if(invFabula.length || hasText(item.mochila) || Number(item.zenites)>0){ text += `\n🎒 INVENTÁRIO / MOCHILA\n\n`; if(Number(item.zenites)>0) text += `Zênites: ${item.zenites}z\n`; invFabula.forEach(it=>text += `• ${it.nome}${Number(it.quantidade||1)!==1?` x${it.quantidade}`:''}${hasText(it.notas)?` — ${compactText(it.notas)}`:''}\n`); if(hasText(item.mochila)) text += `${invFabula.length?'\n':''}${bulletsFromText(item.mochila)}\n`; }
                const heroic=(item.poderesHeroicos||[]).filter(p=>hasText(p?.nome) || hasText(p?.desc));
                if(heroic.length){ text += `\n🌟 PODERES HEROICOS\n\n`; heroic.forEach(p=>text += `• ${safe(p.nome,'Poder Heroico')}${hasText(p.desc)?` — ${compactText(p.desc)}`:''}\n`); }
                if(hasText(item.caracteristicas)){ text += `\n✨ CARACTERÍSTICAS\n\n${compactText(item.caracteristicas)}\n`; }
                const profs=[]; const eqp=item.equipavel||{};
                if(eqp.armaduraMarcial) profs.push('Armaduras marciais'); if(eqp.escudoMarcial) profs.push('Escudos marciais'); if(eqp.armaCorpoMarcial) profs.push('Armas marciais corpo a corpo'); if(eqp.armaDistanciaMarcial) profs.push('Armas marciais à distância');
                if(profs.length) text += `\n🛡️ PROFICIÊNCIAS DE EQUIPAMENTO\n${profs.join(' | ')}\n`;

                const ex=item.extras||{}; const magia=ex.magia||{};
                const disciplinas=(magia.disciplinas||[]).filter(hasText); const feiticos=(magia.feiticos||[]).filter(f=>hasText(f?.nome)); const rituais=(magia.rituais||[]).filter(r=>hasText(r?.nome)||hasText(r?.desc));
                if(disciplinas.length || feiticos.length || rituais.length){
                    text += `\n🔮 MAGIAS & RITUAIS\n\n`;
                    if(disciplinas.length) text += `Disciplinas: ${disciplinas.join(', ')}\n`;
                    feiticos.forEach(f=>text += `• ${f.ofensiva?'⚡ ':''}${f.nome}${hasText(f.disciplina)?` [${f.disciplina}]`:''}${hasText(f.pm)?` — ${f.pm} PM`:''}${hasText(f.alvos)?` | Alvos: ${f.alvos}`:''}${hasText(f.duracao)?` | Duração: ${f.duracao}`:''}${f.ofensiva&&hasText(f.teste)?` | Teste: ${f.teste}`:''}${hasText(f.desc)?`\n  ${compactText(f.desc)}`:''}\n`);
                    rituais.forEach(r=>{ const ref=getFabulaRitualRef(r.potencia||'Menor',r.area||'Individual'); text += `• Ritual: ${safe(r.nome,'Sem nome')}${hasText(r.disciplina)?` [${r.disciplina}]`:''} | ${safe(r.potencia,'Menor')} / ${safe(r.area,'Individual')} | ${hasText(r.pm)?r.pm:ref.pm} PM, ND ${hasText(r.nd)?r.nd:ref.nd}${hasText(r.teste)?` | Teste: ${r.teste}`:''}${hasText(r.desc)?`\n  ${compactText(r.desc)}`:''}${hasText(r.falha)?`\n  Falha: ${compactText(r.falha)}`:''}\n`; });
                }
                const arcanos=(ex.arcanos?.lista||[]).filter(a=>hasText(a?.nome)||hasText(a?.dominios)||hasText(a?.fundir)||hasText(a?.dispensar));
                if(arcanos.length){ text += `\n🌟 ARCANOS\n\n`; arcanos.forEach(a=>{ text += `• ${safe(a.nome,'Arcano')}${hasText(a.dominios)?` — Domínios: ${a.dominios}`:''}\n`; if(hasText(a.fundir)) text += `  Fundir: ${compactText(a.fundir)}\n`; if(hasText(a.dispensar)) text += `  Dispensar: ${compactText(a.dispensar)}\n`; }); }
                const mn=ex.mnemosfera||{};
                if(hasText(mn.nome)||hasText(mn.classe)||(mn.poderes||[]).some(p=>hasText(p?.nome))||hasText(mn.poderHeroico)){ text += `\n🧠 MNEMOSFERA\n\n`; text += `${safe(mn.nome,'Mnemosfera')} | Classe: ${safe(mn.classe)} | Nível ${safe(mn.nivel,1)}\n`; (mn.poderes||[]).filter(p=>hasText(p?.nome)).forEach(p=>text += `• ${p.nome}${hasText(p.nivel)?` (${p.nivel})`:''}\n`); if(hasText(mn.poderHeroico)) text += `Poder Heroico: ${compactText(mn.poderHeroico)}\n`; }
                const rec=ex.receitas||{}; const ing=rec.ingredientes||{}; const ingLines=Object.entries(ing).filter(([,v])=>hasText(v));
                if(hasText(rec.maxIngredientes)||ingLines.length||hasText(rec.combinacoes)||hasText(rec.notas)){ text += `\n🍳 RECEITAS\n\n`; if(hasText(rec.maxIngredientes)) text += `Máx. ingredientes: ${rec.maxIngredientes}\n`; ingLines.forEach(([k,v])=>text += `• ${k.charAt(0).toUpperCase()+k.slice(1)}: ${compactText(v)}\n`); if(hasText(rec.combinacoes)) text += `Combinações & efeitos: ${compactText(rec.combinacoes)}\n`; if(hasText(rec.notas)) text += `Notas: ${compactText(rec.notas)}\n`; }
                const projetos=(ex.projetos?.lista||[]).filter(p=>hasText(p?.nome)||hasText(p?.descricao)||Number(p?.custoMaterial)>0||Number(p?.progressoAtual)>0||hasText(p?.materialEspecial)||hasText(p?.defeito));
                if(projetos.length){ text += `\n🛠️ PROJETOS\n\n`; projetos.forEach(p=>{ text += `• ${safe(p.nome,'Projeto')} — Progresso ${safe(p.progressoAtual,0)}/${safe(p.progressoNecessario,1)}`; if(Number(p.custoMaterial)>0) text += ` | ${p.custoMaterial}z`; text += `\n`; if(hasText(p.descricao)) text += `  ${compactText(p.descricao)}\n`; if(hasText(p.materialEspecial)) text += `  Material especial: ${compactText(p.materialEspecial)}\n`; if(hasText(p.defeito)) text += `  Defeito: ${compactText(p.defeito)}\n`; }); }
                const notes=ex.anotacoes||{};
                if(hasText(notes.regras)||hasText(notes.notas)){ text += `\n📝 ANOTAÇÕES EXTRAS\n\n`; if(hasText(notes.regras)) text += `Regras/Peculiaridades: ${compactText(notes.regras)}\n`; if(hasText(notes.notas)) text += `Anotações: ${compactText(notes.notas)}\n`; }
                if((item.extrasAtivos||[]).length) text += `\n📚 Fichas extras ativas: ${(item.extrasAtivos||[]).map(id => FABULA_EXTRA_OPTIONS.find(x=>x.id===id)?.nome || id).join(', ')}\n`;
                return text.trim();
            }

            // ==========================================================
            // FABULA ULTIMA — AMEAÇA / PNJ
            // ==========================================================
            if (sys === 'fabula' && item.type !== 'pc') {
                const a = item.atributos || {}, st = item.status || {}, af = item.afinidades || {};
                text += `👹 ${String(item.tipoNpc || 'AMEAÇA').toUpperCase()}: ${safe(item.nome,'Sem Nome')}\n\n`;
                text += `Nível: ${safe(item.nivel,5)} | Patente: ${safe(item.patente,'Soldado')} | Espécie: ${safe(item.especie)}\n`;
                if (hasText(item.descricao)) text += `${compactText(item.descricao)}\n`;
                if (hasText(item.tracos)) text += `Traços: ${compactText(item.tracos)}\n`;
                if (item.tipoNpc === 'Vilão' && Number(item.pontosUltima || 0) > 0) text += `Pontos de Ultima: ${item.pontosUltima}\n`;
                text += `\n📊 ATRIBUTOS & STATUS\n\nDES ${safe(a.des,'d8')} | AST ${safe(a.ast,'d8')} | VIG ${safe(a.vig,'d8')} | VON ${safe(a.von,'d8')}\n`;
                text += `❤️ PV ${safe(st.pvAtual,0)}/${safe(st.pvMax,0)} | 🔷 PM ${safe(st.pmAtual,0)}/${safe(st.pmMax,0)}\n`;
                text += `🛡️ DEF ${safe(st.defesa,0)} | DEF.M ${safe(st.defesaMagica,0)} | ⚡ Inic. ${safe(st.iniciativa,0)}\n`;
                const afin = Object.entries(af).filter(([,v]) => hasText(v)).map(([k,v]) => `${k.charAt(0).toUpperCase()+k.slice(1)} ${v}`);
                if (afin.length) text += `\n🧬 AFINIDADES\n${afin.join(' | ')}\n`;
                if ((item.ataques || []).length) { text += `\n⚔️ ATAQUES\n\n`; item.ataques.forEach(x => { text += `• ${safe(x.nome,'Ataque')} [${safe(x.tipo,'')}] — ${safe(x.teste,'')} | ${safe(x.dano,'')} ${safe(x.tipoDano,'')}`; if (hasText(x.efeito)) text += `\n  ${compactText(x.efeito)}`; text += `\n`; }); }
                if ((item.feiticos || []).length) { text += `\n🔮 FEITIÇOS\n\n`; item.feiticos.forEach(x => { text += `• ${safe(x.nome,'Feitiço')} — ${safe(x.pm,0)} PM | ${safe(x.alvo,'')} | ${safe(x.duracao,'')}\n`; if (hasText(x.efeito)) text += `  ${compactText(x.efeito)}\n`; }); }
                const extras = [...(item.poderes||[]), ...(item.outrasAcoes||[]), ...(item.regrasEspeciais||[])];
                if (extras.length) { text += `\n✨ PODERES, AÇÕES & REGRAS\n\n`; extras.forEach(x => text += `• ${safe(x.nome,'Regra')}${hasText(x.desc) ? ` — ${compactText(x.desc)}` : ''}\n`); }
                return text.trim();
            }

            // ==========================================================
            // D&D 5E — PERSONAGEM (FORMATO DE CHAT RESUMIDO)
            // ==========================================================
            if (sys === 'dnd5e' && item.type === 'pc') {
                const bio = item.bio || {};
                const atr = item.atributos || {};
                const st = item.status || {};
                const moedas = item.moedas || {};
                const profBonus = getProficiencyBonus(bio.nivel || 1);
                const mod = (key) => formatDndMod(getDndAbilityMod(atr[key] ?? 10));

                text += `👤 PERSONAGEM: ${safe(bio.nome, 'Sem Nome')}\n\n`;
                text += addIf('Jogador', bio.jogador);
                text += `Espécie: ${safe(bio.linhagem)} | Classe: ${safe(bio.classe)} ${safe(bio.nivel, 1)}\n`;
                if (hasText(bio.antecedente) || hasText(bio.alinhamento)) text += `Antecedente: ${safe(bio.antecedente)} | Alinhamento: ${safe(bio.alinhamento)}\n`;
                if ((bio.xp ?? 0) > 0) text += `XP: ${bio.xp}\n`;

                text += `\n📊 ATRIBUTOS\n\n`;
                text += `FOR: ${safe(atr.for,10)} (${mod('for')}) | DES: ${safe(atr.des,10)} (${mod('des')}) | CON: ${safe(atr.con,10)} (${mod('con')})\n`;
                text += `INT: ${safe(atr.int,10)} (${mod('int')}) | SAB: ${safe(atr.sab,10)} (${mod('sab')}) | CAR: ${safe(atr.car,10)} (${mod('car')})\n`;

                text += `\n⚙️ STATUS\n\n`;
                text += `❤️ PV: ${safe(st.pvAtual,0)}/${safe(st.pvMax,0)}${(st.pvTemp || 0) > 0 ? ` (+${st.pvTemp} temp.)` : ''} | 🛡️ CA: ${safe(st.ca,10)}\n`;
                text += `⚡ Iniciativa: ${safe(st.iniciativa, mod('des'))} | 🏃 Deslocamento: ${safe(st.deslocamento,'9 m')}\n`;
                text += `🎲 Bônus de Proficiência: +${profBonus}`;
                if (hasText(st.dadosVida)) text += ` | Dados de Vida: ${st.dadosVida}`;
                text += `\n`;

                const deathS = (item.testesMorte?.sucessos || []).filter(Boolean).length;
                const deathF = (item.testesMorte?.falhas || []).filter(Boolean).length;
                if (deathS || deathF) text += `☠️ Testes de Morte: ${deathS} sucessos | ${deathF} falhas\n`;

                const saves = [['FOR','for'],['DES','des'],['CON','con'],['INT','int'],['SAB','sab'],['CAR','car']]
                    .filter(([,k]) => item.proficienciasResistencia?.[k])
                    .map(([n,k]) => `${n} ${formatDndMod(getDndAbilityMod(atr[k] ?? 10) + profBonus)}`);
                if (saves.length) text += `Resistências: ${saves.join(' | ')}\n`;

                if ((item.ataques || []).length) {
                    text += `\n⚔️ ATAQUES\n\n`;
                    item.ataques.forEach(a => {
                        text += `• ${safe(a.nome,'Ataque')} — ${safe(a.bonus)} | ${safe(a.dano)}${hasText(a.tipo) ? ` ${a.tipo}` : ''}\n`;
                    });
                }

                const trainedSkills = DND_SKILLS_LIST.map(sk => {
                    const entry = (item.pericias || []).find(p => p.id === sk.id) || { prof: 0 };
                    if (!entry.prof) return null;
                    const bonus = getDndAbilityMod(atr[sk.attr] ?? 10) + entry.prof * profBonus;
                    return `${entry.prof === 2 ? '[E]' : '[T]'} ${sk.nome} ${formatDndMod(bonus)}`;
                }).filter(Boolean);
                if (trainedSkills.length) {
                    text += `\n🎯 PERÍCIAS PRINCIPAIS\n\n${trainedSkills.join(' | ')}\n`;
                }

                if (Array.isArray(item.caracteristicas) && item.caracteristicas.length) {
                    text += `\n✨ CARACTERÍSTICAS & TALENTOS\n\n`;
                    item.caracteristicas.forEach(c => {
                        text += `✦ ${safe(c.nome,'Característica').toUpperCase()}\n`;
                        if (hasText(c.desc)) text += `${compactText(c.desc)}\n`;
                        text += `\n`;
                    });
                } else if (hasText(item.caracteristicas)) {
                    text += `\n✨ CARACTERÍSTICAS & TALENTOS\n\n${compactText(item.caracteristicas)}\n`;
                }

                const slots = item.magias?.slots || {};
                const slotLines = [];
                for (let lvl=1; lvl<=9; lvl++) {
                    const sl = slots[lvl] || {};
                    if ((sl.max || 0) > 0 || (sl.atual || 0) > 0) slotLines.push(`${lvl}º: ${safe(sl.atual,0)}/${safe(sl.max,0)}`);
                }
                const spellList = Array.isArray(item.magias?.lista) ? item.magias.lista.filter(m => hasText(m?.nome)) : [];
                if (slotLines.length || spellList.length) {
                    text += `\n🔮 MAGIAS\n\n`;
                    if (slotLines.length) text += `Espaços: ${slotLines.join(' | ')}\n\n`;
                    if (spellList.length) {
                        const groups = {};
                        spellList.forEach(m => {
                            const lvl = safe(m.nivel, 'Truque');
                            if (!groups[lvl]) groups[lvl] = [];
                            groups[lvl].push(m);
                        });
                        Object.keys(groups).sort((a,b) => {
                            const na = parseInt(a), nb = parseInt(b);
                            if (Number.isNaN(na) && Number.isNaN(nb)) return String(a).localeCompare(String(b));
                            if (Number.isNaN(na)) return -1;
                            if (Number.isNaN(nb)) return 1;
                            return na-nb;
                        }).forEach(lvl => {
                            text += `${String(lvl).toLowerCase().includes('tru') || lvl === '0' ? 'Truques' : `${lvl}º Nível`}:\n`;
                            groups[lvl].forEach(m => {
                                text += `• ${m.nome}`;
                                if (hasText(m.desc)) text += ` — ${compactText(m.desc)}`;
                                text += `\n`;
                            });
                            text += `\n`;
                        });
                    }
                }

                const roleplay = [
                    ['Traços', item.tracosPersonalidade], ['Ideais', item.ideais],
                    ['Vínculos', item.vinculos], ['Defeitos', item.defeitos]
                ].filter(([,v]) => hasText(v));
                if (roleplay.length) {
                    text += `🎭 INTERPRETAÇÃO\n\n`;
                    roleplay.forEach(([l,v]) => text += `${l}: ${compactText(v)}\n`);
                }

                if (hasText(item.inventario) || hasText(item.outrasProficiencias) || Object.values(moedas).some(v => Number(v) > 0)) {
                    text += `\n🎒 INVENTÁRIO\n\n`;
                    if (Object.values(moedas).some(v => Number(v) > 0)) {
                        text += `Moedas: ${safe(moedas.po,0)} PO | ${safe(moedas.pp,0)} PP | ${safe(moedas.pe,0)} PE | ${safe(moedas.pc,0)} PC | ${safe(moedas.pl,0)} PL\n`;
                    }
                    if (hasText(item.inventario)) text += `\nEquipamento:\n${bulletsFromText(item.inventario)}\n`;
                    if (hasText(item.outrasProficiencias)) text += `\nProficiências/Idiomas: ${compactText(item.outrasProficiencias)}\n`;
                }

                return text.trim();
            }

            // ==========================================================
            // D&D 5E — AMEAÇA / BESTIÁRIO (COMPACTO)
            // ==========================================================
            if (sys === 'dnd5e') {
                const atr = item.atributos || {};
                text += `🐲 AMEAÇA: ${safe(item.nome,'Sem Nome')}\n`;
                text += `${safe(item.tamanho)} ${safe(item.tipo)}, ${safe(item.alinhamento)}\n\n`;
                text += `🛡️ CA: ${safe(item.ca,10)} | ❤️ PV: ${safe(item.pv,0)} | 🏃 ${safe(item.deslocamento,'9 m')}\n`;
                text += `🎲 Desafio: ${safe(item.desafio)} | Proficiência: ${safe(item.proficienciaBonus)}\n\n`;
                text += `📊 FOR ${safe(atr.for,10)} (${formatDndMod(getDndAbilityMod(atr.for ?? 10))}) | DES ${safe(atr.des,10)} (${formatDndMod(getDndAbilityMod(atr.des ?? 10))}) | CON ${safe(atr.con,10)} (${formatDndMod(getDndAbilityMod(atr.con ?? 10))})\n`;
                text += `INT ${safe(atr.int,10)} (${formatDndMod(getDndAbilityMod(atr.int ?? 10))}) | SAB ${safe(atr.sab,10)} (${formatDndMod(getDndAbilityMod(atr.sab ?? 10))}) | CAR ${safe(atr.car,10)} (${formatDndMod(getDndAbilityMod(atr.car ?? 10))})\n`;

                const info = [
                    ['Resistências', item.testesResistencia], ['Perícias', item.pericias],
                    ['Vulnerabilidades', item.vulnerabilidades], ['Resist. a Dano', item.resistencias],
                    ['Imunidades', item.imunidadesDano], ['Imunid. Condição', item.imunidadesCondicao],
                    ['Sentidos', item.sentidos], ['Idiomas', item.idiomas]
                ].filter(([,v]) => hasText(v));
                if (info.length) {
                    text += `\n📚 ESTATÍSTICAS\n\n`;
                    info.forEach(([l,v]) => text += `${l}: ${compactText(v)}\n`);
                }

                const sec = (icon, title, arr) => {
                    const list = (arr || []).filter(x => hasText(x?.nome) || hasText(x?.desc));
                    if (!list.length) return;
                    text += `\n${icon} ${title}\n\n`;
                    list.forEach(x => {
                        text += `• ${safe(x.nome,title)}`;
                        if (hasText(x.desc)) text += ` — ${compactText(x.desc)}`;
                        text += `\n`;
                    });
                };
                sec('✨','TRAÇOS', item.tracos);
                sec('⚔️','AÇÕES', item.acoes);
                sec('⚡','AÇÕES BÔNUS', item.acoesBonus);
                sec('🛡️','REAÇÕES', item.reacoes);
                sec('👑','AÇÕES LENDÁRIAS', item.acoesLendarias);
                return text.trim();
            }

            // ==========================================================
            // DRAGONBANE — PERSONAGEM (MODELO PEDIDO PELO USUÁRIO)
            // ==========================================================
            if (item.type === 'pc') {
                const bio = item.bio || {};
                const atr = item.atributos || {};
                const st = item.status || {};
                const moedas = item.moedas || {};
                const condicoes = [['Exausto','for'],['Adoecido','con'],['Aturdido','agl'],['Enraivecido','int'],['Assustado','von'],['Desanimado','car']]
                    .filter(([,k]) => atr[k]?.condicao).map(([n]) => n);

                const forVal = safe(atr.for?.valor,10), conVal = safe(atr.con?.valor,10), aglVal = safe(atr.agl?.valor,10);
                const intVal = safe(atr.int?.valor,10), vonVal = safe(atr.von?.valor,10), carVal = safe(atr.car?.valor,10);
                const cargaAtual = (() => {
                    const inv = compactText(item.inventario);
                    if (!inv) return null;
                    const matches = [...inv.matchAll(/(?:^|\n).*?[-–—xX]\s*(\d+(?:[.,]\d+)?)(?:\s|$)/g)];
                    if (!matches.length) return null;
                    return matches.reduce((s,m) => s + (parseFloat(String(m[1]).replace(',','.')) || 0), 0);
                })();

                text += `👤 PERSONAGEM: ${safe(bio.nome,'Sem Nome')}\n\n`;
                text += addIf('Jogador', bio.jogador);
                text += `Ancestralidade: ${safe(bio.ancestralidade)} | Profissão: ${safe(bio.profissao)}\n`;
                text += `Idade: ${safe(bio.idade)} | Fraqueza: ${safe(bio.fraqueza)}\n`;
                if (hasText(bio.aparencia)) text += `\nAparência: ${compactText(bio.aparencia)}\n`;
                if (hasText(bio.memento)) text += `\nMemento: ${compactText(bio.memento)}\n`;

                text += `\n📊 ATRIBUTOS E CONDIÇÕES\n\n`;
                text += `FOR: ${forVal} | CON: ${conVal} | AGL: ${aglVal}\n`;
                text += `INT: ${intVal} | VON: ${vonVal} | CAR: ${carVal}\n`;
                if (condicoes.length) text += `\nCondições: ${condicoes.join(', ')}\n`;

                text += `\n⚙️ DERIVADOS E STATUS\n\n`;
                text += `Movimento: ${safe(item.derivados?.movimento)} | Sobrecarga: ${cargaAtual !== null ? `${cargaAtual}/` : ''}${safe(item.derivados?.limiteSobrecarga)}\n`;
                text += `Dano Bônus: FOR (${safe(item.derivados?.danoBonusFor)}) / AGL (${safe(item.derivados?.danoBonusAgl)})\n`;
                text += `❤️ PV: ${safe(st.pv?.atual,0)}/${safe(st.pv?.max,0)} | 🛡️ PD: ${safe(st.pd?.atual,0)}/${safe(st.pd?.max,0)}\n`;

                text += `\n⚔️ COMBATE E DEFESA\n\n`;
                text += `Armadura: ${safe(item.defesa?.armadura?.nome,'Nenhuma')} (Val: ${safe(item.defesa?.armadura?.valor,0)})\n`;
                text += `Elmo: ${safe(item.defesa?.elmo?.nome,'Nenhum')} (Val: ${safe(item.defesa?.elmo?.valor,0)})\n`;

                if ((item.armas || []).length) {
                    text += `\n🗡️ ARMAS\n\n`;
                    item.armas.forEach(a => {
                        const details = [];
                        if (hasText(a.empunhadura)) details.push(`${a.empunhadura}`);
                        if (hasText(a.alcance)) details.push(`${a.alcance}`);
                        text += `- ${safe(a.nome,'Arma')}${details.length ? ` [${details.join(' | ')}]` : ''} | Dano: ${safe(a.dano)}`;
                        if (hasText(a.tracos)) text += ` | Traços: ${compactText(a.tracos)}`;
                        if (hasText(a.durabilidade)) text += ` | Durab. ${a.durabilidade}`;
                        text += `\n`;
                    });
                }

                if ((item.habilidadesFeiticos || []).length) {
                    text += `\n✨ HABILIDADES E MAGIAS\n\n`;
                    item.habilidadesFeiticos.forEach(h => {
                        text += `- ✦${safe(h.nome,'Habilidade').toUpperCase()}\n\n`;
                        const desc = hasText(h.descricao) ? h.descricao : h.desc;
                        if (hasText(desc)) text += `${compactText(desc)}`;
                        if (hasText(h.fv_nvl)) text += `${hasText(desc) ? ' ' : ''}(Custo/Nv: ${h.fv_nvl})`;
                        text += `\n\n`;
                    });
                }

                const trained = [];
                const pushTrained = (arr) => (arr || []).forEach(p => {
                    if (p.treinada || hasText(p.valor) && Number(p.valor) >= 12) trained.push(`[T] ${p.nome} ${safe(p.valor)}`);
                });
                pushTrained(item.periciasBase);
                pushTrained(item.periciasArmas);
                (item.periciasSecundarias || []).forEach(p => {
                    if (hasText(p.nome)) trained.push(`${p.treinada ? '[T] ' : ''}${p.nome} ${safe(p.valor)}`.trim());
                });
                if (trained.length) text += `🎯 PERÍCIAS (Valores Atuais)\n\n${trained.join(' | ')}\n`;

                text += `\n🎒 INVENTÁRIO\n\n`;
                text += `Moedas: ${safe(moedas.ouro,0)} PO, ${safe(moedas.prata,0)} PP, ${safe(moedas.cobre,0)} PC\n`;
                if (hasText(item.inventario)) text += `\nEquipamento:\n${bulletsFromText(item.inventario)}\n`;
                if (hasText(item.itensMiudos)) text += `\n-------------------------\n\nItens Miúdos:\n${bulletsFromText(item.itensMiudos)}\n`;
                return text.trim();
            }

            // ==========================================================
            // DRAGONBANE — PNJ (COMPACTO)
            // ==========================================================
            if (item.type === 'pnj') {
                text += `👥 PNJ: ${safe(item.nome,'Sem Nome')}\n`;
                text += `${safe(item.ancestralidade)} | ${safe(item.profissao)} | ${safe(item.tipoPnj)}\n\n`;
                text += `❤️ PV: ${safe(item.status?.pv?.atual,0)}/${safe(item.status?.pv?.max,0)} | 🛡️ PD: ${safe(item.status?.pd?.atual,0)}/${safe(item.status?.pd?.max,0)}\n`;
                text += `Movimento: ${safe(item.movimento)} | Dano Bônus: ${safe(item.danoBonus)}\n`;
                text += `Armadura: ${safe(item.armaduraTipica?.nome,'Nenhuma')} (Val: ${safe(item.armaduraTipica?.valor,0)})\n`;
                if ((item.pericias || []).length) text += `\n🎯 PERÍCIAS\n${item.pericias.map(p => `• ${safe(p.nome)} ${safe(p.valor)}`).join('\n')}\n`;
                if ((item.armas || []).length) text += `\n⚔️ ARMAS\n${item.armas.map(a => `• ${safe(a.nome)} | ${safe(a.pericia)} | Dano ${safe(a.dano)}`).join('\n')}\n`;
                if ((item.feiticos || []).length) text += `\n✨ HABILIDADES/FEITIÇOS\n${item.feiticos.map(f => `• ${safe(f.nome)}${hasText(f.desc) ? ` — ${compactText(f.desc)}` : ''}`).join('\n')}\n`;
                if (hasText(item.equipamento)) text += `\n🎒 EQUIPAMENTO\n${bulletsFromText(item.equipamento)}\n`;
                if (hasText(item.atitude) || hasText(item.motivacao) || hasText(item.tracoMarcante)) {
                    text += `\n🎭 INTERPRETAÇÃO\n`;
                    text += addIf('Atitude', item.atitude) + addIf('Motivação', item.motivacao) + addIf('Traço marcante', item.tracoMarcante);
                }
                return text.trim();
            }

            // ==========================================================
            // DRAGONBANE — AMEAÇA (COMPACTO)
            // ==========================================================
            text += `🐉 AMEAÇA: ${safe(item.nome,'Sem Nome')}\n\n`;
            text += `Ferocidade: ${safe(item.ferocidade,1)} | Tamanho: ${safe(item.tamanho,'Normal')} | Movimento: ${safe(item.movimento)}\n`;
            text += `Armadura: ${safe(item.armadura)} | ❤️ PV: ${safe(item.status?.pv?.atual,0)}/${safe(item.status?.pv?.max,0)}\n`;
            if ((item.habilidades || []).length) {
                text += `\n✨ HABILIDADES\n\n`;
                item.habilidades.forEach(h => text += `• ${safe(h.nome,'Habilidade')}${hasText(h.desc) ? ` — ${compactText(h.desc)}` : ''}\n`);
            }
            if ((item.ataques || []).length) {
                text += `\n⚔️ ATAQUES DO MONSTRO (Role 1D6)\n\n`;
                item.ataques.forEach(a => text += `[${safe(a.id,'?')}] ${compactText(a.descricao)}\n`);
            }
            return text.trim();
        };


        function FabulaMagicPanel({ data, updateField }) {
            const ex=data.extras?.magia||{disciplinas:[],feiticos:[],rituais:[]};
            const set=(k,v)=>updateField(`extras.magia.${k}`,v);
            const move=(group,index,direction)=>{const arr=JSON.parse(JSON.stringify(ex[group]||[]));const ni=index+direction;if(ni<0||ni>=arr.length)return;[arr[index],arr[ni]]=[arr[ni],arr[index]];set(group,arr);};
            const patchSpell=(i,k,v)=>{const arr=JSON.parse(JSON.stringify(ex.feiticos||[]));arr[i]={nome:'',disciplina:'',ofensiva:false,teste:'',pm:'',alvos:'',duracao:'',desc:'',...(arr[i]||{}),[k]:v};set('feiticos',arr);};
            const patchRitual=(i,k,v)=>{const arr=JSON.parse(JSON.stringify(ex.rituais||[]));arr[i]={nome:'',disciplina:'Ritualismo',potencia:'Menor',area:'Individual',teste:'',pm:'',nd:'',desc:'',falha:'',...(arr[i]||{}),[k]:v};set('rituais',arr);};
            return <div className="space-y-5 animate-fade-in-up fabula-subpanel">
                <div><div className="fabula-pill-title">🔮 Magia & Rituais</div><p className="text-xs text-gray-500 mt-2">Disciplinas dominadas, feitiços, testes de Magia e rituais.</p></div>
                <div className="fabula-list-card"><div className="fabula-list-card-head"><h3 className="font-title font-bold text-teal-900">Disciplinas Mágicas</h3><p className="text-[10px] text-gray-500">Escreva apenas as disciplinas que este personagem domina, como na versão anterior.</p></div><div className="fabula-list-card-body"><label className="block"><span className="fabula-input-label">Disciplinas (separe por vírgulas)</span><input value={(ex.disciplinas||[]).join(', ')} onChange={e=>set('disciplinas',e.target.value.split(',').map(x=>x.trim()).filter(Boolean))} className="w-full border rounded p-2" placeholder="Ex.: Espiritualismo, Ritualismo"/></label><p className="text-[10px] text-gray-500 mt-2">Referência: Arcanismo, Quimerismo, Elementalismo, Entropismo, Ritualismo e Espiritualismo. Arcanismo e Ritualismo não possuem feitiços próprios no Livro Básico.</p></div></div>
                <datalist id="fabula-disciplinas-sugestoes">{FABULA_MAGIC_DISCIPLINES.map(d=><option key={d} value={d}/>)}</datalist>
                <details className="fabula-quickref"><summary><span>🎲 Consulta rápida — teste de conjuração</span><span>abrir</span></summary><div className="fabula-quickref-body space-y-2"><div className="fabula-ref-grid"><div className="fabula-ref-cell"><strong>Feitiço ofensivo ⚡</strong><br/>Faça um teste de Magia. A Defesa Mágica do alvo funciona como ND; em múltiplos alvos, o teste atinge aqueles cuja Defesa Mágica seja alcançada.</div><div className="fabula-ref-cell"><strong>Feitiço não ofensivo</strong><br/>Tem sucesso automático, desde que os requisitos de conjuração sejam cumpridos e o custo de PM possa ser pago.</div><div className="fabula-ref-cell"><strong>Elementalismo / Entropismo / Espiritualismo</strong><br/>Teste padrão: <b>AST + VON</b>.</div><div className="fabula-ref-cell"><strong>Quimerismo</strong><br/>Use <b>AST + VON</b> ou <b>VIG + VON</b>, conforme a escolha da habilidade/poder do personagem.</div></div><p>O campo “Teste de Magia” continua editável para poderes e equipamentos que alterem a fórmula.</p></div></details>
                <div className="fabula-list-card"><div className="fabula-list-card-head flex justify-between items-center gap-2"><div><h3 className="font-title font-bold text-teal-900">Feitiços</h3><p className="text-[10px] text-gray-500">Dois cartões por linha em telas maiores, com ordem ajustável.</p></div><button type="button" onClick={()=>set('feiticos',[...(ex.feiticos||[]),{nome:'',disciplina:'',ofensiva:false,teste:'',pm:'',alvos:'',duracao:'',desc:''}])} className="fabula-action-btn">+ Feitiço</button></div><div className="fabula-list-card-body"><div className="fabula-two-col-grid">{(ex.feiticos||[]).length===0&&<div className="text-xs text-gray-400 italic">Nenhum feitiço registrado.</div>}{(ex.feiticos||[]).map((f,i)=><div key={i} className="fabula-spell-row grid grid-cols-[1fr_38px] gap-2 items-start"><div className="space-y-2"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2">{f.ofensiva&&<span className="fabula-offensive-mark" title="Feitiço ofensivo">⚡</span>}<input value={f.nome||''} onChange={e=>patchSpell(i,'nome',e.target.value)} className="border rounded p-2 text-xs font-bold min-w-[150px]" placeholder="Nome do feitiço"/></div><label className={`fabula-offensive-toggle ${f.ofensiva?'active':''}`}><input type="checkbox" checked={!!f.ofensiva} onChange={e=>{const checked=e.target.checked;const arr=JSON.parse(JSON.stringify(ex.feiticos));arr[i]={...arr[i],ofensiva:checked};if(checked&&!arr[i].teste)arr[i].teste=getFabulaMagicTestHint(arr[i].disciplina);set('feiticos',arr);}}/><span>⚡ Ofensivo</span></label></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><label><span className="fabula-input-label">Disciplina</span><input list="fabula-disciplinas-sugestoes" value={f.disciplina||''} onChange={e=>{const disc=e.target.value;const arr=JSON.parse(JSON.stringify(ex.feiticos));arr[i]={...arr[i],disciplina:disc};if(!arr[i].teste&&arr[i].ofensiva)arr[i].teste=getFabulaMagicTestHint(disc);set('feiticos',arr);}} className="border rounded p-2 text-xs" placeholder="Ex.: Espiritualismo"/></label><label><span className="fabula-input-label">PM</span><input value={f.pm||''} onChange={e=>patchSpell(i,'pm',e.target.value)} className="border rounded p-2 text-xs" placeholder="Ex.: 10 ou 10/alvo"/></label><label><span className="fabula-input-label">Alvos</span><input value={f.alvos||''} onChange={e=>patchSpell(i,'alvos',e.target.value)} className="border rounded p-2 text-xs" placeholder="Uma criatura / até três..."/></label><label><span className="fabula-input-label">Duração</span><input value={f.duracao||''} onChange={e=>patchSpell(i,'duracao',e.target.value)} className="border rounded p-2 text-xs" placeholder="Instantânea / Cena"/></label></div>{f.ofensiva&&<label><span className="fabula-input-label">Teste de Magia</span><input value={f.teste||''} onChange={e=>patchSpell(i,'teste',e.target.value)} className="w-full border rounded p-2 text-xs" placeholder={getFabulaMagicTestHint(f.disciplina)||'Fórmula do teste'}/></label>}<label><span className="fabula-input-label">Efeito / lembrete</span><textarea value={f.desc||''} onChange={e=>patchSpell(i,'desc',e.target.value)} className="w-full border rounded p-2 text-xs" rows="4" placeholder="Efeito, RA, oportunidades e observações..."/></label></div><div className="fabula-move-col"><button type="button" onClick={()=>move('feiticos',i,-1)} className="fabula-move-btn" title="Mover para cima">↑</button><button type="button" onClick={()=>move('feiticos',i,1)} className="fabula-move-btn" title="Mover para baixo">↓</button><button type="button" onClick={()=>set('feiticos',(ex.feiticos||[]).filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div></div>)}</div></div></div>
                <details className="fabula-quickref"><summary><span>🕯️ Consulta rápida — rituais</span><span>PM • ND • área</span></summary><div className="fabula-quickref-body space-y-3"><p>Rituais sempre exigem teste de Magia. A potência define o custo base e o ND; a área multiplica o custo de PM.</p><div className="overflow-x-auto"><table className="fabula-ref-table"><thead><tr><th>Potência</th><th>PM base</th><th>ND</th><th>Relógio em conflito</th></tr></thead><tbody><tr><td>Menor</td><td>20</td><td>7</td><td>4</td></tr><tr><td>Média</td><td>30</td><td>10</td><td>6</td></tr><tr><td>Maior</td><td>40</td><td>13</td><td>6</td></tr><tr><td>Extrema</td><td>50</td><td>16</td><td>8</td></tr></tbody></table></div><div className="fabula-ref-grid"><div className="fabula-ref-cell"><strong>Área</strong><br/>Individual ×1 • Pequena ×2 • Grande ×3 • Enorme ×4.</div><div className="fabula-ref-cell"><strong>Ingrediente raro</strong><br/>Com aprovação do Mestre, pode reduzir o custo de PM do ritual à metade.</div><div className="fabula-ref-cell"><strong>Teste em grupo</strong><br/>Outras pessoas podem apoiar; o conjurador é o líder do teste.</div><div className="fabula-ref-cell"><strong>Falha</strong><br/>O efeito é distorcido de maneira catastrófica, conforme descrito pelo Mestre.</div></div></div></details>
                <div className="fabula-list-card"><div className="fabula-list-card-head flex justify-between items-center gap-2"><div><h3 className="font-title font-bold text-teal-900">Rituais</h3><p className="text-[10px] text-gray-500">Registre potência, área, teste e a consequência prevista em caso de falha.</p></div><button type="button" onClick={()=>set('rituais',[...(ex.rituais||[]),{nome:'',disciplina:'Ritualismo',potencia:'Menor',area:'Individual',teste:'AST + VON',pm:'',nd:'',desc:'',falha:''}])} className="fabula-action-btn">+ Ritual</button></div><div className="fabula-list-card-body"><div className="fabula-two-col-grid">{(ex.rituais||[]).length===0&&<div className="text-xs text-gray-400 italic">Nenhum ritual registrado.</div>}{(ex.rituais||[]).map((r,i)=>{const ref=getFabulaRitualRef(r.potencia||'Menor',r.area||'Individual');return <div key={i} className="fabula-ritual-card grid grid-cols-[1fr_38px] gap-2 items-start"><div className="space-y-2"><input value={r.nome||''} onChange={e=>patchRitual(i,'nome',e.target.value)} className="w-full border rounded p-2 text-xs font-bold" placeholder="Nome / objetivo do ritual"/><div className="grid grid-cols-2 gap-2"><label><span className="fabula-input-label">Disciplina</span><input list="fabula-disciplinas-sugestoes" value={r.disciplina||''} onChange={e=>{const disc=e.target.value;const arr=JSON.parse(JSON.stringify(ex.rituais));arr[i]={...arr[i],disciplina:disc};if(!arr[i].teste)arr[i].teste=getFabulaMagicTestHint(disc);set('rituais',arr);}} className="border rounded p-2 text-xs" placeholder="Ex.: Ritualismo"/></label><label><span className="fabula-input-label">Teste de Magia</span><input value={r.teste||''} onChange={e=>patchRitual(i,'teste',e.target.value)} className="border rounded p-2 text-xs" placeholder={getFabulaMagicTestHint(r.disciplina)}/></label><label><span className="fabula-input-label">Potência</span><select value={r.potencia||'Menor'} onChange={e=>patchRitual(i,'potencia',e.target.value)} className="border rounded p-2 text-xs">{Object.keys(FABULA_RITUAL_POTENCY).map(x=><option key={x}>{x}</option>)}</select></label><label><span className="fabula-input-label">Área</span><select value={r.area||'Individual'} onChange={e=>patchRitual(i,'area',e.target.value)} className="border rounded p-2 text-xs">{Object.keys(FABULA_RITUAL_AREA).map(x=><option key={x}>{x}</option>)}</select></label></div><div className="grid grid-cols-3 gap-2"><div className="fabula-ref-cell text-center"><span className="fabula-input-label">PM ref.</span><b>{ref.pm}</b></div><div className="fabula-ref-cell text-center"><span className="fabula-input-label">ND ref.</span><b>{ref.nd}</b></div><div className="fabula-ref-cell text-center"><span className="fabula-input-label">Relógio</span><b>{ref.relogio}</b></div></div><div className="grid grid-cols-2 gap-2"><label><span className="fabula-input-label">PM final / ajustado</span><input value={r.pm||''} onChange={e=>patchRitual(i,'pm',e.target.value)} className="w-full border rounded p-2 text-xs" placeholder={String(ref.pm)}/></label><label><span className="fabula-input-label">ND final</span><input value={r.nd||''} onChange={e=>patchRitual(i,'nd',e.target.value)} className="w-full border rounded p-2 text-xs" placeholder={String(ref.nd)}/></label></div><label><span className="fabula-input-label">Efeito / objetivo</span><textarea value={r.desc||''} onChange={e=>patchRitual(i,'desc',e.target.value)} className="w-full border rounded p-2 text-xs" rows="3" placeholder="O que o ritual pretende realizar..."/></label><label><span className="fabula-input-label">Falha / distorção possível</span><textarea value={r.falha||''} onChange={e=>patchRitual(i,'falha',e.target.value)} className="w-full border rounded p-2 text-xs" rows="2" placeholder="Consequência catastrófica ou risco narrativo..."/></label></div><div className="fabula-move-col"><button type="button" onClick={()=>move('rituais',i,-1)} className="fabula-move-btn">↑</button><button type="button" onClick={()=>move('rituais',i,1)} className="fabula-move-btn">↓</button><button type="button" onClick={()=>set('rituais',(ex.rituais||[]).filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div></div>})}</div></div></div>
            </div>;
        }
        function FabulaArcanosPanel({ data, updateField }) { const lista=data.extras?.arcanos?.lista||[]; const set=v=>updateField('extras.arcanos.lista',v); return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div className="flex justify-between items-center gap-2"><div><div className="fabula-pill-title">🌟 Arcanos</div><p className="text-xs text-gray-500 mt-2">Registre o nome, domínios e as opções de fundir/dispensar.</p></div><button onClick={()=>set([...lista,{nome:'',dominios:'',fundir:'',dispensar:''}])} className="fabula-action-btn">+ Arcano</button></div>{lista.length===0&&<div className="text-xs text-gray-400 italic">Nenhum arcano registrado.</div>}{lista.map((a,i)=><div key={i} className="fabula-arcano-card space-y-2"><div className="flex gap-2 items-end"><div className="flex-1"><div className="fabula-input-label">Nome do Arcano</div><input value={a.nome||''} onChange={e=>{const x=JSON.parse(JSON.stringify(lista));x[i].nome=e.target.value;set(x)}} className="w-full border rounded p-2 font-bold" placeholder="Nome do Arcano"/></div><button onClick={()=>set(lista.filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div><div><div className="fabula-input-label">Domínios</div><input value={a.dominios||''} onChange={e=>{const x=JSON.parse(JSON.stringify(lista));x[i].dominios=e.target.value;set(x)}} className="w-full border rounded p-2 text-xs" placeholder="Domínios"/></div><div><div className="fabula-input-label">Efeito de fundir</div><textarea value={a.fundir||''} onChange={e=>{const x=JSON.parse(JSON.stringify(lista));x[i].fundir=e.target.value;set(x)}} className="w-full border rounded p-2 text-xs" placeholder="Efeito de fundir"/></div><div><div className="fabula-input-label">Efeito de dispensar</div><textarea value={a.dispensar||''} onChange={e=>{const x=JSON.parse(JSON.stringify(lista));x[i].dispensar=e.target.value;set(x)}} className="w-full border rounded p-2 text-xs" placeholder="Efeito de dispensar"/></div></div>)}</div>; }
        function FabulaMnemosferaPanel({ data, updateField }) { const m=data.extras?.mnemosfera||{}; const ps=m.poderes||[]; return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div className="fabula-pill-title">🧠 Mnemosfera</div><div className="fabula-list-card"><div className="fabula-list-card-head"><h3 className="font-title font-bold text-teal-900">Dados da Mnemosfera</h3></div><div className="fabula-list-card-body space-y-3"><div className="grid grid-cols-1 md:grid-cols-3 gap-2"><div><div className="fabula-input-label">Mnemosfera</div><input value={m.nome||''} onChange={e=>updateField('extras.mnemosfera.nome',e.target.value)} className="border rounded p-2" placeholder="Mnemosfera"/></div><div><div className="fabula-input-label">Classe</div><input value={m.classe||''} onChange={e=>updateField('extras.mnemosfera.classe',e.target.value)} className="border rounded p-2" placeholder="Classe"/></div><div><div className="fabula-input-label">Nível</div><input type="number" min="1" value={m.nivel||1} onChange={e=>updateField('extras.mnemosfera.nivel',Number(e.target.value))} className="border rounded p-2"/></div></div><div className="space-y-2">{ps.map((p,i)=><div key={i} className="fabula-power-row grid grid-cols-[1fr_100px_38px] gap-2 items-end"><div><div className="fabula-input-label">Poder</div><input value={p.nome||''} onChange={e=>{const x=JSON.parse(JSON.stringify(ps));x[i].nome=e.target.value;updateField('extras.mnemosfera.poderes',x)}} className="border rounded p-2 text-xs" placeholder="Poder"/></div><div><div className="fabula-input-label">Nível</div><input value={p.nivel||''} onChange={e=>{const x=JSON.parse(JSON.stringify(ps));x[i].nivel=e.target.value;updateField('extras.mnemosfera.poderes',x)}} className="border rounded p-2 text-xs" placeholder="Nível"/></div><button onClick={()=>updateField('extras.mnemosfera.poderes',ps.filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div>)}<button onClick={()=>updateField('extras.mnemosfera.poderes',[...ps,{nome:'',nivel:''}])} className="fabula-soft-btn">+ Poder</button></div><label className="block"><span className="fabula-input-label">Poder Heroico</span><textarea value={m.poderHeroico||''} onChange={e=>updateField('extras.mnemosfera.poderHeroico',e.target.value)} className="w-full border rounded p-2"/></label></div></div></div>; }
        function FabulaReceitasPanel({ data, updateField }) { const r=data.extras?.receitas||{}; const ing=r.ingredientes||{}; return <div className="space-y-5 animate-fade-in-up fabula-subpanel"><div className="flex flex-wrap items-center justify-between gap-2"><div><div className="fabula-pill-title">🍳 Receitas</div><p className="text-xs text-gray-500 mt-2">Ingredientes, combinações e observações para receitas especiais.</p></div><div className="fabula-mini-badge">Receitas</div></div><label className="block"><span className="fabula-input-label">Máximo de ingredientes</span><input value={r.maxIngredientes||''} onChange={e=>updateField('extras.receitas.maxIngredientes',e.target.value)} className="border rounded p-2 w-full md:max-w-[180px]"/></label><div className="fabula-grid-ingredients">{['amargo','salgado','azedo','doce','umami'].map(k=><label key={k} className="fabula-ingredient-box"><span className="fabula-input-label capitalize">{k}</span><textarea value={ing[k]||''} onChange={e=>updateField(`extras.receitas.ingredientes.${k}`,e.target.value)} rows="5" className="w-full border rounded p-2 text-xs"/></label>)}</div><div className="fabula-list-card"><div className="fabula-list-card-head"><h3 className="font-title font-bold text-teal-900">Combinações & efeitos</h3></div><div className="fabula-list-card-body"><textarea value={r.combinacoes||''} onChange={e=>updateField('extras.receitas.combinacoes',e.target.value)} rows="8" className="w-full border rounded p-2"/></div></div><div className="fabula-list-card"><div className="fabula-list-card-head"><h3 className="font-title font-bold text-teal-900">Notas úteis</h3></div><div className="fabula-list-card-body"><textarea value={r.notas||''} onChange={e=>updateField('extras.receitas.notas',e.target.value)} rows="4" className="w-full border rounded p-2"/></div></div></div>; }
        function FabulaProjetosPanel({ data, updateField }) {
            const lista=data.extras?.projetos?.lista||[];
            const set=v=>updateField('extras.projetos.lista',v);
            const patch=(i,k,v)=>{const x=JSON.parse(JSON.stringify(lista));x[i]={nome:'',descricao:'',custoMaterial:0,progressoAtual:0,progressoNecessario:1,materialEspecial:'',defeito:'',...(x[i]||{}),[k]:v};set(x);};
            return <div className="space-y-5 animate-fade-in-up fabula-subpanel"><div className="flex flex-wrap justify-between items-center gap-2"><div><div className="fabula-pill-title">🛠️ Projetos</div><p className="text-xs text-gray-500 mt-2">Área opcional para Inventores e outras invenções definidas com o Mestre.</p></div><button type="button" onClick={()=>set([...lista,{nome:'',descricao:'',custoMaterial:0,progressoAtual:0,progressoNecessario:1,materialEspecial:'',defeito:''}])} className="fabula-action-btn">+ Projeto</button></div><details className="fabula-quickref"><summary><span>🧰 Consulta rápida — projetos</span><span>custos & progresso</span></summary><div className="fabula-quickref-body space-y-3"><p>Defina primeiro o efeito da invenção. O Mestre escolhe potência, área e uso; esses fatores determinam o custo total em materiais.</p><div className="overflow-x-auto"><table className="fabula-ref-table"><thead><tr><th>Potência</th><th>Custo base</th></tr></thead><tbody><tr><td>Menor</td><td>100z</td></tr><tr><td>Média</td><td>200z</td></tr><tr><td>Maior</td><td>400z</td></tr><tr><td>Extrema</td><td>800z</td></tr></tbody></table></div><div className="fabula-ref-grid"><div className="fabula-ref-cell"><strong>Área</strong><br/>Individual ×1 • Pequena ×2 • Grande ×3 • Enorme ×4.</div><div className="fabula-ref-cell"><strong>Uso</strong><br/>Consumível ×1 • Permanente ×5.</div><div className="fabula-ref-cell"><strong>Progresso</strong><br/>Necessário = custo material ÷ 100, mínimo 1. Ao fim de cada dia, cada PJ que trabalhou concede +1; Inventores envolvidos podem gerar progresso extra.</div><div className="fabula-ref-cell"><strong>Defeito terrível</strong><br/>Se negociado com o Mestre, reduz em 25% o custo do projeto. Potência média ou maior pode exigir material especial.</div></div></div></details>{lista.length===0&&<div className="border border-dashed rounded-lg p-6 text-center text-xs text-gray-400">Nenhum projeto em andamento.</div>}{lista.map((p,i)=><div key={i} className="fabula-list-card"><div className="fabula-list-card-head flex gap-2 items-center"><input value={p.nome||''} onChange={e=>patch(i,'nome',e.target.value)} className="flex-1 border rounded p-2 text-sm font-bold" placeholder="Nome do projeto / invenção"/><button type="button" onClick={()=>set(lista.filter((_,x)=>x!==i))} className="fabula-remove-btn" aria-label={`Remover projeto ${p.nome||i+1}`}>×</button></div><div className="fabula-list-card-body space-y-3"><label className="block"><span className="fabula-input-label">Descrição</span><textarea value={p.descricao||''} onChange={e=>patch(i,'descricao',e.target.value)} rows="3" className="w-full border rounded p-2 text-xs" placeholder="Efeito, funcionamento e benefícios da invenção..."/></label><div className="grid grid-cols-1 sm:grid-cols-3 gap-2"><label><span className="fabula-input-label">Custo material (z)</span><input type="number" min="0" value={p.custoMaterial??0} onChange={e=>patch(i,'custoMaterial',Number(e.target.value))} className="w-full border rounded p-2 text-xs"/></label><label><span className="fabula-input-label">Progresso atual</span><input type="number" min="0" value={p.progressoAtual??0} onChange={e=>patch(i,'progressoAtual',Number(e.target.value))} className="w-full border rounded p-2 text-xs"/></label><label><span className="fabula-input-label">Progresso necessário</span><input type="number" min="1" value={p.progressoNecessario??1} onChange={e=>patch(i,'progressoNecessario',Math.max(1,Number(e.target.value)||1))} className="w-full border rounded p-2 text-xs"/></label></div><label className="block"><span className="fabula-input-label">Material especial</span><input value={p.materialEspecial||''} onChange={e=>patch(i,'materialEspecial',e.target.value)} className="w-full border rounded p-2 text-xs" placeholder="Ingrediente, peça rara ou objetivo necessário..."/></label><label className="block"><span className="fabula-input-label">Defeito / complicação</span><textarea value={p.defeito||''} onChange={e=>patch(i,'defeito',e.target.value)} rows="2" className="w-full border rounded p-2 text-xs" placeholder="Opcional: defeito terrível negociado com o Mestre..."/></label></div></div>)}</div>;
        }
        function FabulaNotasPanel({ data, updateField }) { const n=data.extras?.anotacoes||{}; return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div className="fabula-pill-title">📝 Anotações Extras</div><div className="fabula-list-card"><div className="fabula-list-card-head"><h3 className="font-title font-bold text-teal-900">Regras opcionais / peculiaridades</h3></div><div className="fabula-list-card-body"><textarea value={n.regras||''} onChange={e=>updateField('extras.anotacoes.regras',e.target.value)} rows="8" className="w-full border rounded p-2"/></div></div><div className="fabula-list-card"><div className="fabula-list-card-head"><h3 className="font-title font-bold text-teal-900">Anotações</h3></div><div className="fabula-list-card-body"><textarea value={n.notas||''} onChange={e=>updateField('extras.anotacoes.notas',e.target.value)} rows="10" className="w-full border rounded p-2"/></div></div></div>; }


        function FabulaPeculiaridadePanel({ data, updateField }) {
            const p=data.extras?.peculiaridade||{};
            return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div><div className="fabula-pill-title">💠 Peculiaridade</div><p className="text-xs text-gray-500 mt-2">Registre somente os dados necessários da opção usada pelo personagem.</p></div><div className="fabula-list-card"><div className="fabula-list-card-body grid grid-cols-1 md:grid-cols-2 gap-3"><label><span className="fabula-input-label">Nome</span><input value={p.nome||''} onChange={e=>updateField('extras.peculiaridade.nome',e.target.value)} className="w-full border rounded p-2"/></label><label><span className="fabula-input-label">Fonte / Livro</span><input value={p.origem||''} onChange={e=>updateField('extras.peculiaridade.origem',e.target.value)} className="w-full border rounded p-2" placeholder="Natural Fantasy, High Fantasy..."/></label><label className="md:col-span-2"><span className="fabula-input-label">Efeito / resumo</span><textarea value={p.efeito||''} onChange={e=>updateField('extras.peculiaridade.efeito',e.target.value)} rows="5" className="w-full border rounded p-2"/></label><label className="md:col-span-2"><span className="fabula-input-label">Observações</span><textarea value={p.notas||''} onChange={e=>updateField('extras.peculiaridade.notas',e.target.value)} rows="3" className="w-full border rounded p-2"/></label></div></div></div>;
        }
        function FabulaArmasPersonalizadasPanel({ data, updateField }) {
            const lista=data.extras?.armaPersonalizada?.lista||[]; const set=v=>updateField('extras.armaPersonalizada.lista',v);
            const patch=(i,k,v)=>{const a=JSON.parse(JSON.stringify(lista));a[i]={nome:'',categoria:'',alcance:'Corpo a corpo',teste:'',dano:'',tipoDano:'',caracteristicas:'',...(a[i]||{}),[k]:v};set(a);};
            return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div className="flex justify-between gap-3 items-center"><div><div className="fabula-pill-title">⚔️ Armas Personalizadas</div><p className="text-xs text-gray-500 mt-2">Estrutura livre para registrar as armas criadas com as regras do suplemento usado.</p></div><button className="fabula-action-btn" onClick={()=>set([...lista,{nome:'',categoria:'',alcance:'Corpo a corpo',teste:'',dano:'',tipoDano:'',caracteristicas:''}])}>+ Arma</button></div><div className="fabula-two-col-grid">{lista.map((a,i)=><div key={i} className="fabula-list-card"><div className="fabula-list-card-head flex gap-2"><input value={a.nome||''} onChange={e=>patch(i,'nome',e.target.value)} className="flex-1 border rounded p-2 font-bold" placeholder="Nome da arma"/><button onClick={()=>set(lista.filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div><div className="fabula-list-card-body grid grid-cols-2 gap-2"><label><span className="fabula-input-label">Categoria</span><input value={a.categoria||''} onChange={e=>patch(i,'categoria',e.target.value)} className="w-full border rounded p-2 text-xs"/></label><label><span className="fabula-input-label">Alcance</span><input value={a.alcance||''} onChange={e=>patch(i,'alcance',e.target.value)} className="w-full border rounded p-2 text-xs"/></label><label><span className="fabula-input-label">Precisão / Teste</span><input value={a.teste||''} onChange={e=>patch(i,'teste',e.target.value)} className="w-full border rounded p-2 text-xs" placeholder="DES + VIG +1"/></label><label><span className="fabula-input-label">Dano</span><input value={a.dano||''} onChange={e=>patch(i,'dano',e.target.value)} className="w-full border rounded p-2 text-xs" placeholder="RA + 10"/></label><label><span className="fabula-input-label">Tipo de dano</span><input value={a.tipoDano||''} onChange={e=>patch(i,'tipoDano',e.target.value)} className="w-full border rounded p-2 text-xs"/></label><label><span className="fabula-input-label">Características</span><input value={a.caracteristicas||''} onChange={e=>patch(i,'caracteristicas',e.target.value)} className="w-full border rounded p-2 text-xs"/></label></div></div>)}</div>{lista.length===0&&<div className="text-xs text-gray-400 italic text-center border border-dashed rounded p-5">Nenhuma arma personalizada registrada.</div>}</div>;
        }
        function FabulaRecursosClassePanel({ data, updateField }) {
            const lista=data.extras?.recursosClasse?.lista||[]; const set=v=>updateField('extras.recursosClasse.lista',v);
            const patch=(i,k,v)=>{const a=JSON.parse(JSON.stringify(lista));a[i]={nome:'',atual:0,max:0,notas:'',...(a[i]||{}),[k]:v};set(a);};
            return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div className="flex justify-between items-center gap-3"><div><div className="fabula-pill-title">🎛️ Recursos de Classe</div><p className="text-xs text-gray-500 mt-2">Use apenas para classes que realmente precisem acompanhar pontos, cargas, cartas ou outros recursos.</p></div><button className="fabula-action-btn" onClick={()=>set([...lista,{nome:'',atual:0,max:0,notas:''}])}>+ Recurso</button></div><div className="grid sm:grid-cols-2 gap-3">{lista.map((r,i)=><div key={i} className="fabula-list-card"><div className="fabula-list-card-head flex gap-2"><input value={r.nome||''} onChange={e=>patch(i,'nome',e.target.value)} className="flex-1 border rounded p-2 font-bold" placeholder="Nome do recurso"/><button onClick={()=>set(lista.filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div><div className="fabula-list-card-body"><div className="grid grid-cols-2 gap-2"><label><span className="fabula-input-label">Atual</span><input type="number" value={r.atual??0} onChange={e=>patch(i,'atual',Number(e.target.value))} className="w-full border rounded p-2"/></label><label><span className="fabula-input-label">Máximo</span><input type="number" value={r.max??0} onChange={e=>patch(i,'max',Number(e.target.value))} className="w-full border rounded p-2"/></label></div><textarea value={r.notas||''} onChange={e=>patch(i,'notas',e.target.value)} rows="2" className="mt-2 w-full border rounded p-2 text-xs" placeholder="Quando ganha, gasta ou reinicia..."/></div></div>)}</div></div>;
        }
        function FabulaAcampamentoPanel({ data, updateField }) {
            const ex=data.extras?.acampamento||{atividades:[],beneficios:[]}; const atos=ex.atividades||[]; const bens=ex.beneficios||[];
            const patchAt=(i,k,v)=>{const a=JSON.parse(JSON.stringify(atos));a[i]={nome:'',alvo:'',efeito:'',...(a[i]||{}),[k]:v};updateField('extras.acampamento.atividades',a);};
            const patchBen=(i,k,v)=>{const a=JSON.parse(JSON.stringify(bens));a[i]={nome:'',usado:false,...(a[i]||{}),[k]:v};updateField('extras.acampamento.beneficios',a);};
            return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div><div className="fabula-pill-title">🌙 Atividades de Acampamento</div><p className="text-xs text-gray-500 mt-2">Natural Fantasy: registre as duas atividades escolhidas e os benefícios que ainda estão disponíveis antes do próximo descanso.</p></div><div className="grid md:grid-cols-2 gap-3">{[0,1].map(i=><div key={i} className="fabula-list-card"><div className="fabula-list-card-head font-bold text-teal-900">Atividade {i+1}</div><div className="fabula-list-card-body space-y-2"><input value={atos[i]?.nome||''} onChange={e=>patchAt(i,'nome',e.target.value)} className="w-full border rounded p-2 font-bold" placeholder="Nome da atividade"/><input value={atos[i]?.alvo||''} onChange={e=>patchAt(i,'alvo',e.target.value)} className="w-full border rounded p-2 text-xs" placeholder="Alvo"/><textarea value={atos[i]?.efeito||''} onChange={e=>patchAt(i,'efeito',e.target.value)} rows="3" className="w-full border rounded p-2 text-xs" placeholder="Resumo do benefício"/></div></div>)}</div><div className="fabula-list-card"><div className="fabula-list-card-head flex justify-between"><div><h3 className="font-title font-bold text-teal-900">Benefícios ativos</h3><p className="text-[10px] text-gray-500">Marque quando o benefício de uso único tiver sido gasto.</p></div><button className="fabula-action-btn" onClick={()=>updateField('extras.acampamento.beneficios',[...bens,{nome:'',usado:false}])}>+ Benefício</button></div><div className="fabula-list-card-body space-y-2">{bens.map((b,i)=><div key={i} className="flex gap-2 items-center border rounded p-2"><input type="checkbox" checked={!!b.usado} onChange={e=>patchBen(i,'usado',e.target.checked)}/><input value={b.nome||''} onChange={e=>patchBen(i,'nome',e.target.value)} className={`flex-1 border rounded p-2 text-xs ${b.usado?'line-through opacity-60':''}`} placeholder="Benefício até o próximo descanso"/><button onClick={()=>updateField('extras.acampamento.beneficios',bens.filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div>)}</div></div></div>;
        }
        function FabulaJardimPanel({ data, updateField }) {
            const j=data.extras?.jardim||{}; const lista=j.conhecidas||[]; const g=Math.max(0,Math.min(4,Number(j.germinacao)||0));
            return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div><div className="fabula-pill-title">🌱 Jardim & Magissementes</div><p className="text-xs text-gray-500 mt-2">Painel compacto para Floralista: magissemente atual e relógio de germinação com quatro seções.</p></div><div className="fabula-list-card"><div className="fabula-list-card-body grid md:grid-cols-[1fr_220px] gap-4 items-center"><label><span className="fabula-input-label">Magissemente ativa</span><input value={j.magissementeAtual||''} onChange={e=>updateField('extras.jardim.magissementeAtual',e.target.value)} className="w-full border rounded p-2" placeholder="Nome da magissemente"/></label><div><div className="fabula-input-label">Relógio de germinação</div><div className="flex gap-2">{[1,2,3,4].map(n=><button type="button" key={n} onClick={()=>updateField('extras.jardim.germinacao',g===n?0:n)} className={`w-10 h-10 rounded-full border-2 font-bold ${g>=n?'bg-teal-700 text-white border-teal-800':'bg-white border-teal-300 text-teal-800'}`}>{g>=n?'●':'○'}</button>)}</div></div></div></div><div className="fabula-list-card"><div className="fabula-list-card-head flex justify-between"><h3 className="font-title font-bold text-teal-900">Magissementes conhecidas</h3><button className="fabula-action-btn" onClick={()=>updateField('extras.jardim.conhecidas',[...lista,{nome:'',efeito:''}])}>+ Magissemente</button></div><div className="fabula-list-card-body fabula-two-col-grid">{lista.map((m,i)=><div key={i} className="fabula-power-row"><div className="flex gap-2"><input value={m.nome||''} onChange={e=>{const a=JSON.parse(JSON.stringify(lista));a[i]={...a[i],nome:e.target.value};updateField('extras.jardim.conhecidas',a)}} className="flex-1 border rounded p-2 font-bold text-xs" placeholder="Nome"/><button onClick={()=>updateField('extras.jardim.conhecidas',lista.filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div><textarea value={m.efeito||''} onChange={e=>{const a=JSON.parse(JSON.stringify(lista));a[i]={...a[i],efeito:e.target.value};updateField('extras.jardim.conhecidas',a)}} rows="3" className="mt-2 w-full border rounded p-2 text-xs" placeholder="Resumo do efeito"/></div>)}</div></div></div>;
        }
        function FabulaInvocacoesPanel({ data, updateField }) {
            const ex=data.extras?.invocacoes||{}; const mans=ex.mananciais||{}; const lista=ex.lista||[];
            const patch=(i,k,v)=>{const a=JSON.parse(JSON.stringify(lista));a[i]={nome:'',manancial:'',tipo:'',efeito:'',...(a[i]||{}),[k]:v};updateField('extras.invocacoes.lista',a);};
            return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div><div className="fabula-pill-title">🌊 Invocações & Mananciais</div><p className="text-xs text-gray-500 mt-2">Natural Fantasy: acompanhe os mananciais disponíveis e registre suas invocações.</p></div><div className="fabula-list-card"><div className="fabula-list-card-head"><h3 className="font-title font-bold text-teal-900">Mananciais disponíveis</h3></div><div className="fabula-list-card-body grid grid-cols-2 sm:grid-cols-5 gap-2">{[['agua','💧 Água'],['ar','🌬️ Ar'],['fogo','🔥 Fogo'],['raio','⚡ Raio'],['terra','🪨 Terra']].map(([k,n])=><label key={k} className="fabula-check-card min-h-0"><input type="checkbox" checked={!!mans[k]} onChange={e=>updateField(`extras.invocacoes.mananciais.${k}`,e.target.checked)}/><div className="fabula-check-text">{n}</div></label>)}</div></div><div className="fabula-list-card"><div className="fabula-list-card-head flex justify-between"><h3 className="font-title font-bold text-teal-900">Invocações conhecidas</h3><button className="fabula-action-btn" onClick={()=>updateField('extras.invocacoes.lista',[...lista,{nome:'',manancial:'',tipo:'',efeito:''}])}>+ Invocação</button></div><div className="fabula-list-card-body fabula-two-col-grid">{lista.map((x,i)=><div key={i} className="fabula-power-row space-y-2"><div className="flex gap-2"><input value={x.nome||''} onChange={e=>patch(i,'nome',e.target.value)} className="flex-1 border rounded p-2 font-bold text-xs" placeholder="Nome"/><button onClick={()=>updateField('extras.invocacoes.lista',lista.filter((_,n)=>n!==i))} className="fabula-remove-btn">×</button></div><div className="grid grid-cols-2 gap-2"><input value={x.manancial||''} onChange={e=>patch(i,'manancial',e.target.value)} className="border rounded p-2 text-xs" placeholder="Manancial"/><input value={x.tipo||''} onChange={e=>patch(i,'tipo',e.target.value)} className="border rounded p-2 text-xs" placeholder="Tipo"/></div><textarea value={x.efeito||''} onChange={e=>patch(i,'efeito',e.target.value)} rows="3" className="w-full border rounded p-2 text-xs" placeholder="Efeito / lembrete"/></div>)}</div></div></div>;
        }
        function FabulaComercioPanel({ data, updateField }) {
            const c=data.extras?.comercio||{}; const lista=c.assentamentos||[];
            const patch=(i,k,v)=>{const a=JSON.parse(JSON.stringify(lista));a[i]={nome:'',prosperidade:0,notas:'',...(a[i]||{}),[k]:v};updateField('extras.comercio.assentamentos',a);};
            return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div><div className="fabula-pill-title">💰 Comércio</div><p className="text-xs text-gray-500 mt-2">Natural Fantasy: Pontos de Comércio e prosperidade de assentamentos importantes.</p></div><div className="fabula-track-grid"><div className="fabula-track-box"><div className="fabula-track-title">Pontos de Comércio</div><div className="grid grid-cols-2 gap-2 mt-2"><input type="number" value={c.atual??0} onChange={e=>updateField('extras.comercio.atual',Number(e.target.value))}/><input type="number" value={c.max??0} onChange={e=>updateField('extras.comercio.max',Number(e.target.value))}/></div><div className="grid grid-cols-2 text-[9px] text-gray-500"><span>Atual</span><span>Máx.</span></div></div></div><div className="fabula-list-card"><div className="fabula-list-card-head flex justify-between"><h3 className="font-title font-bold text-teal-900">Assentamentos</h3><button className="fabula-action-btn" onClick={()=>updateField('extras.comercio.assentamentos',[...lista,{nome:'',prosperidade:0,notas:''}])}>+ Assentamento</button></div><div className="fabula-list-card-body space-y-2">{lista.map((s,i)=><div key={i} className="grid md:grid-cols-[1fr_130px_2fr_38px] gap-2 items-end"><label><span className="fabula-input-label">Nome</span><input value={s.nome||''} onChange={e=>patch(i,'nome',e.target.value)} className="w-full border rounded p-2 text-xs"/></label><label><span className="fabula-input-label">Prosperidade</span><input type="number" value={s.prosperidade??0} onChange={e=>patch(i,'prosperidade',Number(e.target.value))} className="w-full border rounded p-2 text-xs"/></label><label><span className="fabula-input-label">Notas</span><input value={s.notas||''} onChange={e=>patch(i,'notas',e.target.value)} className="w-full border rounded p-2 text-xs"/></label><button onClick={()=>updateField('extras.comercio.assentamentos',lista.filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div>)}</div></div></div>;
        }
        function FabulaMateriaisPanel({ data, updateField }) {
            const lista=data.extras?.materiais?.lista||[]; const patch=(i,k,v)=>{const a=JSON.parse(JSON.stringify(lista));a[i]={nome:'',quantidade:1,valor:0,uso:'',...(a[i]||{}),[k]:v};updateField('extras.materiais.lista',a);};
            return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div className="flex justify-between items-center gap-3"><div><div className="fabula-pill-title">🔨 Materiais & Fabricação</div><p className="text-xs text-gray-500 mt-2">Natural Fantasy: materiais são itens de uso único com valor definido pelo Mestre e podem ser aplicados à fabricação.</p></div><button className="fabula-action-btn" onClick={()=>updateField('extras.materiais.lista',[...lista,{nome:'',quantidade:1,valor:0,uso:''}])}>+ Material</button></div><div className="fabula-list-card"><div className="fabula-list-card-body space-y-2">{lista.map((m,i)=><div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_90px_120px_1.5fr_38px] gap-2 items-end"><label><span className="fabula-input-label">Material</span><input value={m.nome||''} onChange={e=>patch(i,'nome',e.target.value)} className="w-full border rounded p-2 text-xs"/></label><label><span className="fabula-input-label">Qtd.</span><input type="number" min="0" value={m.quantidade??1} onChange={e=>patch(i,'quantidade',Number(e.target.value))} className="w-full border rounded p-2 text-xs"/></label><label><span className="fabula-input-label">Valor (z)</span><input type="number" min="0" value={m.valor??0} onChange={e=>patch(i,'valor',Number(e.target.value))} className="w-full border rounded p-2 text-xs"/></label><label><span className="fabula-input-label">Uso possível</span><input value={m.uso||''} onChange={e=>patch(i,'uso',e.target.value)} className="w-full border rounded p-2 text-xs"/></label><button onClick={()=>updateField('extras.materiais.lista',lista.filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div>)}</div></div></div>;
        }
        function FabulaPoderZeroPanel({ data, updateField }) {
            const lista=data.extras?.poderZero?.lista||[]; const patch=(i,k,v)=>{const a=JSON.parse(JSON.stringify(lista));a[i]={nome:'',gatilho:'',efeito:'',notas:'',...(a[i]||{}),[k]:v};updateField('extras.poderZero.lista',a);};
            return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div className="flex justify-between items-center"><div><div className="fabula-pill-title">💥 Poderes Zero</div><p className="text-xs text-gray-500 mt-2">High Fantasy: registre somente os poderes escolhidos, sem reproduzir o catálogo do livro.</p></div><button className="fabula-action-btn" onClick={()=>updateField('extras.poderZero.lista',[...lista,{nome:'',gatilho:'',efeito:'',notas:''}])}>+ Poder Zero</button></div><div className="fabula-two-col-grid">{lista.map((z,i)=><div key={i} className="fabula-list-card"><div className="fabula-list-card-head flex gap-2"><input value={z.nome||''} onChange={e=>patch(i,'nome',e.target.value)} className="flex-1 border rounded p-2 font-bold" placeholder="Nome"/><button onClick={()=>updateField('extras.poderZero.lista',lista.filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div><div className="fabula-list-card-body space-y-2"><input value={z.gatilho||''} onChange={e=>patch(i,'gatilho',e.target.value)} className="w-full border rounded p-2 text-xs" placeholder="Gatilho / condição"/><textarea value={z.efeito||''} onChange={e=>patch(i,'efeito',e.target.value)} rows="4" className="w-full border rounded p-2 text-xs" placeholder="Efeito"/><textarea value={z.notas||''} onChange={e=>patch(i,'notas',e.target.value)} rows="2" className="w-full border rounded p-2 text-xs" placeholder="Notas"/></div></div>)}</div></div>;
        }
        function FabulaTecnosferasPanel({ data, updateField }) {
            const lista=data.extras?.tecnosferas?.lista||[]; const patch=(i,k,v)=>{const a=JSON.parse(JSON.stringify(lista));a[i]={nome:'',tipo:'',equipamento:'',efeito:'',...(a[i]||{}),[k]:v};updateField('extras.tecnosferas.lista',a);};
            return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div className="flex justify-between items-center"><div><div className="fabula-pill-title">💿 Tecnosferas</div><p className="text-xs text-gray-500 mt-2">Techno Fantasy: registre as tecnosferas relevantes e onde estão instaladas.</p></div><button className="fabula-action-btn" onClick={()=>updateField('extras.tecnosferas.lista',[...lista,{nome:'',tipo:'',equipamento:'',efeito:''}])}>+ Tecnosfera</button></div><div className="fabula-two-col-grid">{lista.map((t,i)=><div key={i} className="fabula-list-card"><div className="fabula-list-card-head flex gap-2"><input value={t.nome||''} onChange={e=>patch(i,'nome',e.target.value)} className="flex-1 border rounded p-2 font-bold"/><button onClick={()=>updateField('extras.tecnosferas.lista',lista.filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div><div className="fabula-list-card-body space-y-2"><div className="grid grid-cols-2 gap-2"><input value={t.tipo||''} onChange={e=>patch(i,'tipo',e.target.value)} className="border rounded p-2 text-xs" placeholder="Tipo"/><input value={t.equipamento||''} onChange={e=>patch(i,'equipamento',e.target.value)} className="border rounded p-2 text-xs" placeholder="Equipamento"/></div><textarea value={t.efeito||''} onChange={e=>patch(i,'efeito',e.target.value)} rows="3" className="w-full border rounded p-2 text-xs" placeholder="Efeito / poderes"/></div></div>)}</div></div>;
        }
        function FabulaVeiculoPanel({ data, updateField }) {
            const v=data.extras?.veiculo||{}; const mods=v.modulos||[]; const patch=(i,k,val)=>{const a=JSON.parse(JSON.stringify(mods));a[i]={nome:'',efeito:'',...(a[i]||{}),[k]:val};updateField('extras.veiculo.modulos',a);};
            return <div className="space-y-4 animate-fade-in-up fabula-subpanel"><div className="fabula-pill-title">🚀 Veículo</div><div className="fabula-list-card"><div className="fabula-list-card-body grid md:grid-cols-2 gap-3"><label><span className="fabula-input-label">Nome</span><input value={v.nome||''} onChange={e=>updateField('extras.veiculo.nome',e.target.value)} className="w-full border rounded p-2"/></label><label><span className="fabula-input-label">Tipo</span><input value={v.tipo||''} onChange={e=>updateField('extras.veiculo.tipo',e.target.value)} className="w-full border rounded p-2"/></label><label><span className="fabula-input-label">Estrutura / recurso</span><input value={v.estrutura||''} onChange={e=>updateField('extras.veiculo.estrutura',e.target.value)} className="w-full border rounded p-2"/></label><label><span className="fabula-input-label">Passageiros</span><input value={v.passageiros||''} onChange={e=>updateField('extras.veiculo.passageiros',e.target.value)} className="w-full border rounded p-2"/></label><label className="md:col-span-2"><span className="fabula-input-label">Notas</span><textarea value={v.notas||''} onChange={e=>updateField('extras.veiculo.notas',e.target.value)} rows="3" className="w-full border rounded p-2"/></label></div></div><div className="fabula-list-card"><div className="fabula-list-card-head flex justify-between"><h3 className="font-title font-bold text-teal-900">Módulos</h3><button className="fabula-action-btn" onClick={()=>updateField('extras.veiculo.modulos',[...mods,{nome:'',efeito:''}])}>+ Módulo</button></div><div className="fabula-list-card-body fabula-two-col-grid">{mods.map((m,i)=><div key={i} className="fabula-power-row"><div className="flex gap-2"><input value={m.nome||''} onChange={e=>patch(i,'nome',e.target.value)} className="flex-1 border rounded p-2 font-bold text-xs"/><button onClick={()=>updateField('extras.veiculo.modulos',mods.filter((_,x)=>x!==i))} className="fabula-remove-btn">×</button></div><textarea value={m.efeito||''} onChange={e=>patch(i,'efeito',e.target.value)} rows="2" className="mt-2 w-full border rounded p-2 text-xs"/></div>)}</div></div></div>;
        }

        const FabulaThreatList = ({ title, path, items, add, remove, update, move, spell=false }) => (
            <details className="fabula-threat-details">
                <summary><span>{title}</span><span>{items.length} registro{items.length===1?'':'s'}</span></summary>
                <div className="fabula-threat-details-body space-y-2">
                    <div className="flex justify-end"><button type="button" onClick={add} className="fabula-action-btn">+ Adicionar</button></div>
                    {items.length===0&&<div className="text-xs text-gray-400 italic">Nenhum registro.</div>}
                    <div className="fabula-threat-entry-grid">
                        {items.map((x,i)=><div key={i} className="fabula-power-row fabula-threat-entry-card space-y-2">
                            <div className="fabula-threat-entry-order">
                                <span className="fabula-threat-entry-number">#{i+1}</span>
                                <div className="fabula-threat-order-actions">
                                    <button type="button" onClick={()=>move&&move(path,i,-1)} disabled={i===0} className="fabula-threat-order-btn" title="Mover para cima" aria-label={`Mover ${title} ${i+1} para cima`}>↑</button>
                                    <button type="button" onClick={()=>move&&move(path,i,1)} disabled={i===items.length-1} className="fabula-threat-order-btn" title="Mover para baixo" aria-label={`Mover ${title} ${i+1} para baixo`}>↓</button>
                                </div>
                            </div>
                            {spell?<>
                                <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2 flex-1">{x.ofensiva&&<span className="fabula-offensive-mark">⚡</span>}<input value={x.nome||''} onChange={e=>update(path,i,'nome',e.target.value)} className="flex-1 font-bold" placeholder="Feitiço"/></div><label className={`fabula-offensive-toggle ${x.ofensiva?'active':''}`}><input type="checkbox" checked={!!x.ofensiva} onChange={e=>update(path,i,'ofensiva',e.target.checked)}/><span>⚡</span></label><button onClick={()=>remove(path,i)} className="fabula-remove-btn">×</button></div>
                                <div className="grid grid-cols-2 gap-2">{x.ofensiva&&<input value={x.teste||''} onChange={e=>update(path,i,'teste',e.target.value)} placeholder="Teste de Magia"/>}<input type="number" value={x.pm||0} onChange={e=>update(path,i,'pm',Number(e.target.value))} placeholder="PM"/><input value={x.alvo||''} onChange={e=>update(path,i,'alvo',e.target.value)} placeholder="Alvo"/><input value={x.duracao||''} onChange={e=>update(path,i,'duracao',e.target.value)} placeholder="Duração"/></div><textarea value={x.efeito||''} onChange={e=>update(path,i,'efeito',e.target.value)} rows="2" placeholder="Efeito"/>
                            </>:<>
                                <div className="flex gap-2"><input value={x.nome||''} onChange={e=>update(path,i,'nome',e.target.value)} className="flex-1 font-bold" placeholder="Nome"/><button onClick={()=>remove(path,i)} className="fabula-remove-btn">×</button></div><textarea value={x.desc||''} onChange={e=>update(path,i,'desc',e.target.value)} rows="2" placeholder="Descrição"/>
                            </>}
                        </div>)}
                    </div>
                </div>
            </details>
        );

        function App() {
            const [view, setView] = useState('dashboard');
            const [savedChars, setSavedChars] = useState(getSavedCharacters());
            const [savedThreats, setSavedThreats] = useState(getSavedThreats());
            const [data, setData] = useState(initialData);
            
            const [theme, setTheme] = useState(() => { try { return localStorage.getItem(THEME_PREF_KEY) || 'default'; } catch { return 'default'; } });
            const [customBgUrl, setCustomBgUrl] = useState(() => { try { return localStorage.getItem(CUSTOM_BG_KEY) || ''; } catch { return ''; } });
            const [customBgLink, setCustomBgLink] = useState('');
            const [customWinColor, setCustomWinColor] = useState(() => { try { return localStorage.getItem(CUSTOM_WIN_COLOR_KEY) || '#ffffff'; } catch { return '#ffffff'; } });
            const [customBarColor, setCustomBarColor] = useState(() => { try { return localStorage.getItem(CUSTOM_BAR_COLOR_KEY) || '#1a1a1a'; } catch { return '#1a1a1a'; } });
            const [customOpacity, setCustomOpacity] = useState(() => { try { return localStorage.getItem(CUSTOM_OPACITY_KEY) || '0.93'; } catch { return '0.93'; } });
            const [customAccentColor, setCustomAccentColor] = useState(() => { try { return localStorage.getItem(CUSTOM_ACCENT_COLOR_KEY) || '#7f1d1d'; } catch { return '#7f1d1d'; } });
            const [customTextColor, setCustomTextColor] = useState(() => { try { return localStorage.getItem(CUSTOM_TEXT_COLOR_KEY) || '#1f2937'; } catch { return '#1f2937'; } });
            const [customOverlay, setCustomOverlay] = useState(() => { try { return localStorage.getItem(CUSTOM_OVERLAY_KEY) || '0.18'; } catch { return '0.18'; } });
            const [customBlur, setCustomBlur] = useState(() => { try { return localStorage.getItem(CUSTOM_BLUR_KEY) || '5'; } catch { return '5'; } });
            const [customBgPosition, setCustomBgPosition] = useState(() => { try { return localStorage.getItem(CUSTOM_BG_POSITION_KEY) || 'center'; } catch { return 'center'; } });
            const [customBgSize, setCustomBgSize] = useState(() => { try { return localStorage.getItem(CUSTOM_BG_SIZE_KEY) || 'cover'; } catch { return 'cover'; } });

            const [showCustomBgModal, setShowCustomBgModal] = useState(false);
            const [showUrlInput, setShowUrlInput] = useState(false);
            const [tempUrl, setTempUrl] = useState('');
            const [mobileTab, setMobileTab] = useState('status');
            const [deleteConfirmId, setDeleteConfirmId] = useState(null);
            const [toastMsg, setToastMsg] = useState('');
            
            const [showSystemModal, setShowSystemModal] = useState(false);
            const [createTarget, setCreateTarget] = useState(null); 
            
            const [showThreatModal, setShowThreatModal] = useState(false);
            const [showDndModelModal, setShowDndModelModal] = useState(false);
            const [showDbModelModal, setShowDbModelModal] = useState(false);
            const [showFabulaModelModal, setShowFabulaModelModal] = useState(false);
            const [showSom6ModelModal, setShowSom6ModelModal] = useState(false);
            const [dndPcTab, setDndPcTab] = useState('caracteristicas');
            const [fabulaTab, setFabulaTab] = useState('perfil');
            const [som6Tab, setSom6Tab] = useState('perfil');
            const [showFabulaExtras, setShowFabulaExtras] = useState(false);
            const [fabulaCreateSupplements, setFabulaCreateSupplements] = useState({ ...FABULA_DEFAULT_SUPPLEMENTS });
            const [showGuideModal, setShowGuideModal] = useState(false);
            const [guideTab, setGuideTab] = useState('inicio');

            // Organização e segurança — linha 0.6
            const [searchQuery, setSearchQuery] = useState('');
            const [systemFilter, setSystemFilter] = useState('all');
            const [sortMode, setSortMode] = useState('recent');
            const [onlyFavorites, setOnlyFavorites] = useState(false);
            const [showFilters, setShowFilters] = useState(false);
            const [saveStatus, setSaveStatus] = useState('');
            const [showHistoryModal, setShowHistoryModal] = useState(false);
            const [dashboardView, setDashboardView] = useState(() => { try { return localStorage.getItem('pj_lite_dashboard_view') || 'cards'; } catch { return 'cards'; } });
            const [undoState, setUndoState] = useState(null);
            const [chatModal, setChatModal] = useState({ isOpen: false, item: null, mode: 'simples' });
            const [newsCollapsed, setNewsCollapsed] = useState(() => { try { return localStorage.getItem(NEWS_COLLAPSED_KEY) === '1'; } catch { return false; } });

            const [codeModal, setCodeModal] = useState({ isOpen: false, mode: 'export', code: '' });

            const getFabulaDieClass = (die = 'd8') => {
                const value = String(die || 'd8').toLowerCase();
                if (value === 'd6') return 'fabula-die-d6';
                if (value === 'd10') return 'fabula-die-d10';
                if (value === 'd12') return 'fabula-die-d12';
                return 'fabula-die-d8';
            };
            const renderFabulaDieSelect = (value, onChange, ariaLabel='Dado', size='base') => (
                <div className={`fabula-die-shape ${getFabulaDieClass(value)} ${size === 'current' ? 'die-current' : 'die-base'}`}>
                    <select aria-label={ariaLabel} value={value || 'd8'} onChange={onChange} className="fabula-die-select">
                        {['d6','d8','d10','d12'].map(d => <option key={d}>{d}</option>)}
                    </select>
                </div>
            );

            const toastTimerRef = useRef(null);

            useEffect(() => {
                try { localStorage.setItem(THEME_PREF_KEY, theme); } catch {}
                document.body.className = `font-body text-gray-800 antialiased p-4 md:p-8 ${theme === 'classic' ? 'theme-classic' : theme === 'dnd' ? 'theme-dnd' : theme === 'fabula' ? 'theme-fabula' : theme === 'som6' ? 'theme-som6' : theme === 'dark' ? 'theme-dark' : theme === 'custom' ? 'theme-custom' : 'theme-default'}`;
            }, [theme]);

            useEffect(() => {
                if (theme === 'custom' && customBgUrl) {
                    const shade = Math.max(0, Math.min(0.85, Number(customOverlay) || 0));
                    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,${shade}), rgba(0,0,0,${shade})), url(${customBgUrl})`;
                    document.body.style.backgroundSize = customBgSize;
                    document.body.style.backgroundPosition = customBgPosition;
                    document.body.style.backgroundRepeat = customBgSize === 'auto' ? 'repeat' : 'no-repeat';
                    document.body.style.backgroundAttachment = 'fixed';
                } else {
                    document.body.style.backgroundImage = '';
                    document.body.style.backgroundRepeat = '';
                }
            }, [theme, customBgUrl, customOverlay, customBgPosition, customBgSize]);

            useEffect(() => {
                try { localStorage.setItem(CUSTOM_WIN_COLOR_KEY, customWinColor); } catch {}
            }, [customWinColor]);

            useEffect(() => {
                try { localStorage.setItem(CUSTOM_BAR_COLOR_KEY, customBarColor); } catch {}
            }, [customBarColor]);

            useEffect(() => {
                try { localStorage.setItem(CUSTOM_OPACITY_KEY, customOpacity); } catch {}
            }, [customOpacity]);

            useEffect(() => { try { localStorage.setItem(CUSTOM_ACCENT_COLOR_KEY, customAccentColor); } catch {} }, [customAccentColor]);
            useEffect(() => { try { localStorage.setItem(CUSTOM_TEXT_COLOR_KEY, customTextColor); } catch {} }, [customTextColor]);
            useEffect(() => { try { localStorage.setItem(CUSTOM_OVERLAY_KEY, customOverlay); } catch {} }, [customOverlay]);
            useEffect(() => { try { localStorage.setItem(CUSTOM_BLUR_KEY, customBlur); } catch {} }, [customBlur]);
            useEffect(() => { try { localStorage.setItem(CUSTOM_BG_POSITION_KEY, customBgPosition); } catch {} }, [customBgPosition]);
            useEffect(() => { try { localStorage.setItem(CUSTOM_BG_SIZE_KEY, customBgSize); } catch {} }, [customBgSize]);
            useEffect(() => { try { localStorage.setItem('pj_lite_dashboard_view', dashboardView); } catch {} }, [dashboardView]);
            useEffect(() => { try { localStorage.setItem(NEWS_COLLAPSED_KEY, newsCollapsed ? '1' : '0'); } catch {} }, [newsCollapsed]);

            useEffect(() => {
                if (theme !== 'custom') return;
                const [wr, wg, wb] = hexToRgb(customWinColor);
                document.body.style.setProperty('--custom-window-color', customWinColor);
                document.body.style.setProperty('--custom-window-rgba', `rgba(${wr}, ${wg}, ${wb}, ${customOpacity})`);
                document.body.style.setProperty('--custom-bar-color', customBarColor);
                document.body.style.setProperty('--custom-bar-text', readableTextColor(customBarColor));
                document.body.style.setProperty('--custom-accent-color', customAccentColor);
                document.body.style.setProperty('--custom-text-color', customTextColor);
                document.body.style.setProperty('--custom-opacity', customOpacity);
                document.body.style.setProperty('--custom-overlay', customOverlay);
                document.body.style.setProperty('--custom-blur', `${customBlur}px`);
            }, [theme, customWinColor, customBarColor, customAccentColor, customTextColor, customOpacity, customOverlay, customBlur]);

            // Autosave com debounce: evita perder alterações sem gravar a cada tecla imediatamente.
            useEffect(() => {
                if (view !== 'editor' || !data) return;
                setSaveStatus('pending');
                const timer = setTimeout(() => {
                    const ok = saveToLocal(data, true);
                    if (!ok) setSaveStatus('error');
                }, 1400);
                return () => clearTimeout(timer);
            }, [data, view]);

            const getWindowStyle = () => {
                if (theme !== 'custom') return {};
                const [r, g, b] = hexToRgb(customWinColor);
                return { backgroundColor: `rgba(${r}, ${g}, ${b}, ${customOpacity})`, color: customTextColor, backdropFilter: `blur(${customBlur}px)`, WebkitBackdropFilter: `blur(${customBlur}px)` };
            };

            const getBarStyle = () => {
                if (theme !== 'custom') return {};
                return { backgroundColor: customBarColor, color: readableTextColor(customBarColor), borderColor: customAccentColor };
            };

            const applyCustomPreset = (preset) => {
                const presets = {
                    claro: { win:'#ffffff', bar:'#263241', accent:'#7f1d1d', text:'#1f2937', opacity:'0.95', overlay:'0.18', blur:'5' },
                    escuro: { win:'#111827', bar:'#070b12', accent:'#b4534b', text:'#f3f4f6', opacity:'0.94', overlay:'0.32', blur:'7' },
                    pergaminho: { win:'#f3e7c5', bar:'#4a2d1f', accent:'#8a2f22', text:'#33251a', opacity:'0.94', overlay:'0.20', blur:'4' },
                    floresta: { win:'#e7eee8', bar:'#183a32', accent:'#3f6f5d', text:'#1f312b', opacity:'0.94', overlay:'0.24', blur:'5' },
                    vinho: { win:'#f5e9e5', bar:'#4f1718', accent:'#8b2e2e', text:'#352120', opacity:'0.94', overlay:'0.22', blur:'5' }
                };
                const p = presets[preset];
                if (!p) return;
                setCustomWinColor(p.win); setCustomBarColor(p.bar); setCustomAccentColor(p.accent); setCustomTextColor(p.text);
                setCustomOpacity(p.opacity); setCustomOverlay(p.overlay); setCustomBlur(p.blur);
            };

            const showToast = (msg, options = {}) => {
                if (!options.keepUndo) setUndoState(null);
                setToastMsg(msg);
                if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
                toastTimerRef.current = setTimeout(() => setToastMsg(''), 3000);
            };

            const getHistory = () => { try { return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) || {}; } catch { return {}; } };
            const stripHeavyHistoryMedia = (item) => {
                const clone = JSON.parse(JSON.stringify(item || {}));
                if (clone?.bio?.imagem && String(clone.bio.imagem).startsWith('data:')) clone.bio.imagem = '';
                if (clone?.imagem && String(clone.imagem).startsWith('data:')) clone.imagem = '';
                return clone;
            };
            const historySignature = (item) => {
                try {
                    const clone = stripHeavyHistoryMedia(item);
                    if (clone.meta) delete clone.meta.updatedAt;
                    return JSON.stringify(clone);
                } catch { return ''; }
            };
            const pushHistorySnapshot = (item, nextItem = null) => {
                if (!item?.id) return;
                try {
                    if (nextItem && historySignature(item) === historySignature(nextItem)) return;
                    const history = getHistory();
                    const list = Array.isArray(history[item.id]) ? history[item.id] : [];
                    if (list[0]?.data && historySignature(list[0].data) === historySignature(item)) return;
                    const snapshot = { at: new Date().toISOString(), data: stripHeavyHistoryMedia(item) };
                    history[item.id] = [snapshot, ...list].slice(0, 5);
                    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
                } catch {}
            };

            const saveToLocal = (itemData, silent = false) => {
                try {
                    let savingData = normalizeMetaItem(itemData);
                    savingData = normalizeDndPcData(savingData);
                    savingData = normalizeFabulaPcData(savingData);
                    savingData = normalizeFabulaThreatData(savingData);
                    savingData = normalizeSom6PcData(savingData);
                    savingData = normalizeSom6PdjData(savingData);
                    const now = new Date().toISOString();
                    savingData.dataVersion = SCHEMA_VERSION;
                    savingData.meta.createdAt = savingData.meta.createdAt || now;
                    savingData.meta.updatedAt = now;
                    setSaveStatus('saving');
                    if (!savingData.id) savingData.id = Date.now().toString();
                    if (!savingData.system) savingData.system = 'dragonbane';
                    const type = savingData.type || 'pc';

                    if (type === 'pc') {
                        let chars = getSavedCharacters();
                        const index = chars.findIndex(c => c.id === savingData.id);
                        const previous = index >= 0 ? chars[index] : null;
                        if (index >= 0) chars[index] = savingData; else chars.push(savingData);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
                        if (previous) pushHistorySnapshot(previous, savingData);
                        setSavedChars(chars);
                        if (!silent) showToast(savingData.system === 'fabula' ? 'Personagem Fabula salvo!' : savingData.system === 'somdas6' ? 'Personagem de O Som das Seis salvo!' : 'Personagem salvo!');
                    } else {
                        let threats = getSavedThreats();
                        const index = threats.findIndex(t => t.id === savingData.id);
                        const previous = index >= 0 ? threats[index] : null;
                        if (index >= 0) threats[index] = savingData; else threats.push(savingData);
                        localStorage.setItem(THREAT_STORAGE_KEY, JSON.stringify(threats));
                        if (previous) pushHistorySnapshot(previous, savingData);
                        setSavedThreats(threats);
                        if (!silent) showToast(savingData.system === 'dnd5e' ? 'Estatística Salva!' : savingData.system === 'fabula' ? 'Ameaça / PNJ Fabula salvo!' : type === 'pnj' ? 'PNJ salvo!' : 'Ameaça salva!');
                    }

                    if (!silent && (!data.id || data.id === savingData.id)) setData(savingData);
                    setSaveStatus('saved');
                    setTimeout(() => setSaveStatus(''), 1800);
                    return true;
                } catch (error) {
                    console.error('Falha ao salvar no armazenamento local:', error);
                    setSaveStatus('error');
                    if (!silent) showToast('Não foi possível salvar. O armazenamento do navegador pode estar cheio.');
                    else showToast('Autosave falhou: libere espaço ou exporte um backup.');
                    return false;
                }
            };

            const duplicateItem = (item, isThreat = false) => {
                const copy = normalizeMetaItem(item);
                copy.id = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
                copy.meta.createdAt = new Date().toISOString();
                copy.meta.updatedAt = copy.meta.createdAt;
                copy.meta.favorite = false;
                if (copy.bio?.nome) copy.bio.nome = `${copy.bio.nome} (Cópia)`;
                else if (copy.nome) copy.nome = `${copy.nome} (Cópia)`;
                const list = isThreat ? getSavedThreats() : getSavedCharacters();
                list.push(copy);
                localStorage.setItem(isThreat ? THREAT_STORAGE_KEY : STORAGE_KEY, JSON.stringify(list));
                if (isThreat) setSavedThreats(list); else setSavedChars(list);
                showToast('Ficha duplicada com sucesso.');
            };

            const toggleFavorite = (id, isThreat = false) => {
                const list = (isThreat ? getSavedThreats() : getSavedCharacters()).map(x => {
                    if (x.id !== id) return x;
                    return { ...x, meta: { ...(x.meta || {}), favorite: !x.meta?.favorite } };
                });
                localStorage.setItem(isThreat ? THREAT_STORAGE_KEY : STORAGE_KEY, JSON.stringify(list));
                if (isThreat) setSavedThreats(list); else setSavedChars(list);
            };

            const exportFullBackup = () => {
                const payload = { pjLiteBackup: true, version: '0.7.0v Alpha', schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), characters: getSavedCharacters(), threats: getSavedThreats(), history: getHistory() };
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `PJ_Lite_Backup_${new Date().toISOString().slice(0,10)}.json`;
                a.click(); URL.revokeObjectURL(a.href);
                showToast('Backup geral exportado.');
            };

            const restoreFullBackup = (event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (!file) return;
                const r = new FileReader();
                r.onload = () => {
                    try {
                        const payload = JSON.parse(r.result);
                        if (!payload?.pjLiteBackup || !Array.isArray(payload.characters) || !Array.isArray(payload.threats)) throw new Error('Backup inválido');
                        if (!window.confirm('Restaurar este backup substituirá as fichas salvas atualmente. Continuar?')) return;
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.characters.map(normalizeMetaItem)));
                        localStorage.setItem(THREAT_STORAGE_KEY, JSON.stringify(payload.threats.map(normalizeMetaItem)));
                        if (payload.history) localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(payload.history));
                        setSavedChars(getSavedCharacters()); setSavedThreats(getSavedThreats());
                        showToast('Backup restaurado com sucesso.');
                    } catch { showToast('Não foi possível restaurar: arquivo de backup inválido.'); }
                };
                r.readAsText(file);
            };


            const restoreHistorySnapshot = (snapshot) => {
                if (!snapshot?.data) return;
                let restored = normalizeMetaItem(snapshot.data);
                restored = normalizeDndPcData(restored);
                restored = normalizeFabulaPcData(restored);
                restored = normalizeFabulaThreatData(restored);
                restored = normalizeSom6PcData(restored);
                restored = normalizeSom6PdjData(restored);
                // Retratos enviados pelo dispositivo não são duplicados no histórico para economizar espaço.
                if (restored?.bio && !restored.bio.imagem && data?.bio?.imagem) restored.bio.imagem = data.bio.imagem;
                if (!restored?.imagem && data?.imagem) restored.imagem = data.imagem;
                if (!saveToLocal(restored, true)) return;
                setData(restored);
                setShowHistoryModal(false);
                showToast('Versão anterior restaurada e salva.');
            };

            const filterAndSortItems = (items) => {
                const q = searchQuery.trim().toLowerCase();
                return items.filter(item => {
                    const sys = item.system || 'dragonbane';
                    if (systemFilter !== 'all' && sys !== systemFilter) return false;
                    if (onlyFavorites && !item.meta?.favorite) return false;
                    if (!q) return true;
                    const hay = [item.bio?.nome, item.nome, item.bio?.classe, item.bio?.profissao, item.bio?.identidade, item.bio?.apelido, item.tormento?.tipo, item.reputacao?.titulo, item.meta?.campanha, sys].filter(Boolean).join(' ').toLowerCase();
                    return hay.includes(q);
                }).sort((a,b) => {
                    if (sortMode === 'name') return String(a.bio?.nome || a.nome || '').localeCompare(String(b.bio?.nome || b.nome || ''), 'pt-BR');
                    if (sortMode === 'system') return String(a.system||'dragonbane').localeCompare(String(b.system||'dragonbane'));
                    return String(b.meta?.updatedAt || b.meta?.createdAt || '').localeCompare(String(a.meta?.updatedAt || a.meta?.createdAt || ''));
                });
            };

            const getValidationWarnings = (item) => {
                if (!item) return [];
                const warnings = [];
                const name = item.bio?.nome || item.nome;
                if (!name || !String(name).trim()) warnings.push('Adicione um nome para identificar a ficha.');
                if (item.type === 'pc') {
                    if (item.system === 'dnd5e' && Number(item.status?.pvMax || 0) <= 0) warnings.push('Defina os PV máximos.');
                    if (item.system === 'fabula' && Number(item.status?.pvMax || 0) <= 0) warnings.push('Defina os PV máximos.');
                    if (item.system === 'somdas6' && Number(item.status?.pvMax || 0) <= 0) warnings.push('Defina os PV máximos.');
                    if ((item.system || 'dragonbane') === 'dragonbane' && Number(item.status?.pv?.max || 0) <= 0) warnings.push('Defina os PV máximos.');
                }
                return warnings;
            };

            const filterChatText = (raw, sections) => {
                if (!raw) return '';
                const mapHeading = (line) => {
                    const rawLine = String(line || '').trim();
                    if (!rawLine) return null;
                    const startsWithSectionIcon = /^[📊⚙⚔🗡✨🔮🎒🤝🎭🧬📚⚡🛡👑🌟🧠🍳🛠📝🎯]/u.test(rawLine);
                    const plainUpperHeading = /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9][A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 &/(),.\-]{2,}$/u.test(rawLine);
                    if (!startsWithSectionIcon && !plainUpperHeading) return null;
                    const u = rawLine.toUpperCase();
                    if (/STATUS|ATRIBUTOS|CONDIÇÕES|AFINIDADES|DERIVADOS|ESTATÍSTICAS|PERÍCIAS|ANTECEDENTES/.test(u)) return 'status';
                    if (/ATAQUES|ARMAS|AÇÕES|REAÇÕES|EQUIPAMENTO|COMBATE|DEFESA/.test(u)) return 'combate';
                    if (/PODERES|CARACTERÍSTICAS|MAGIAS|FEITIÇOS|CLASSES|HABILIDADES|ARCANOS|MNEMOSFERA|PROFICIÊNCIAS DE EQUIPAMENTO|CARTAS DE SINA/.test(u)) return 'poderes';
                    if (/INVENTÁRIO|MOCHILA|RECEITAS|PROJETOS|MONTARIA/.test(u)) return 'inventario';
                    if (/INTERPRETAÇÃO|LAÇOS|ANOTAÇÕES EXTRAS|TORMENTO|REPUTAÇÃO|ANOTAÇÕES/.test(u)) return 'interpretacao';
                    return null;
                };
                const lines = raw.split('\n');
                const out = [];
                let active = null;
                for (const line of lines) {
                    const section = mapHeading(line);
                    if (section) active = section;
                    if (!active || sections?.[active] !== false) out.push(line);
                }
                return out.join('\n').replace(/\n{3,}/g,'\n\n').trim();
            };

            const CHAT_MODES = {
                completa: {
                    nome: 'Completa',
                    desc: 'Copia todas as informações disponíveis da ficha.',
                    sections: { status:true, combate:true, poderes:true, inventario:true, interpretacao:true }
                },
                simples: {
                    nome: 'Simples',
                    desc: 'Informações principais, atributos/status e combate.',
                    sections: { status:true, combate:true, poderes:false, inventario:false, interpretacao:false }
                },
                resumida: {
                    nome: 'Resumida',
                    desc: 'Somente identificação e o essencial de atributos/status.',
                    sections: { status:true, combate:false, poderes:false, inventario:false, interpretacao:false }
                },
                habilidades: {
                    nome: 'Habilidades & Magias',
                    desc: 'Foca em poderes, características, classes, habilidades e magias.',
                    sections: { status:false, combate:false, poderes:true, inventario:false, interpretacao:false }
                }
            };

            const openChatOptions = (item) => setChatModal({ isOpen:true, item, mode:'simples' });
            const copyChatFromModal = () => {
                if (!chatModal.item) return;
                const selectedMode = CHAT_MODES[chatModal.mode] || CHAT_MODES.simples;
                const raw = generateChatText(chatModal.item);
                const text = chatModal.mode === 'completa' ? raw : filterChatText(raw, selectedMode.sections);
                navigator.clipboard.writeText(text).then(() => showToast(`Ficha ${selectedMode.nome.toLowerCase()} copiada!`)).catch(() => {
                    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); showToast('Ficha copiada!');
                });
                setChatModal({...chatModal, isOpen:false});
            };

            const undoLastRemoval = () => {
                if (!undoState || undoState.kind !== 'array-remove') return;
                const newData = JSON.parse(JSON.stringify(data));
                const list = Array.isArray(newData[undoState.arrayName]) ? newData[undoState.arrayName] : [];
                const pos = Math.max(0, Math.min(Number(undoState.index) || 0, list.length));
                list.splice(pos, 0, JSON.parse(JSON.stringify(undoState.item)));
                newData[undoState.arrayName] = list;
                if (newData.system === 'dnd5e' && undoState.arrayName === 'ataques' && undoState.item?.sourceItemId && Array.isArray(newData.itensSincronizados)) {
                    const linked = newData.itensSincronizados.find(it => it.syncId === undoState.item.sourceItemId);
                    if (linked) linked.sincronizarAtaque = true;
                }
                setData(newData);
                setUndoState(null);
                showToast('Remoção desfeita.');
            };

            const loadCharacter = (id) => {
                const char = savedChars.find(c => c.id === id);
                if (char) {
                    let normalized = normalizeMetaItem(char);
                    normalized = normalizeDndPcData(normalized);
                    normalized = normalizeFabulaPcData(normalized);
                    normalized = normalizeFabulaThreatData(normalized);
                    normalized = normalizeSom6PcData(normalized);
                    normalized = normalizeSom6PdjData(normalized);
                    setData(normalized);
                    setDndPcTab('caracteristicas');
                    setFabulaTab('perfil');
                    setSom6Tab('perfil');
                    setView('editor');
                }
            };
            
            const loadThreat = (id) => {
                const threat = savedThreats.find(t => t.id === id);
                if (threat) {
                    let normalized = normalizeMetaItem(threat);
                    normalized = normalizeFabulaThreatData(normalized);
                    normalized = normalizeSom6PdjData(normalized);
                    setData(normalized);
                    setSom6Tab('perfil');
                    setView('editor');
                }
            };
            
            const getSelectedFabulaSupplements = () => ({ ...FABULA_DEFAULT_SUPPLEMENTS, ...(fabulaCreateSupplements || {}), basico:true });
            const toggleFabulaCreateSupplement = (id) => {
                if (id === 'basico') return;
                setFabulaCreateSupplements(prev => ({ ...FABULA_DEFAULT_SUPPLEMENTS, ...(prev || {}), [id]: !prev?.[id], basico:true }));
            };
            const setFabulaSupplementEnabled = (id, enabled) => {
                if (id === 'basico') return;
                const nextSupplements = { ...FABULA_DEFAULT_SUPPLEMENTS, ...(data.suplementos || {}), [id]: !!enabled, basico:true };
                const unlockedIds = FABULA_EXTRA_OPTIONS.filter(opt => isFabulaExtraUnlocked(opt, nextSupplements)).map(opt => opt.id);
                const currentExtraId = fabulaTab.startsWith('extra-') ? fabulaTab.replace('extra-','') : null;
                if (currentExtraId && !unlockedIds.includes(currentExtraId)) setFabulaTab('perfil');
                setData(prev => {
                    const next = JSON.parse(JSON.stringify(prev));
                    next.suplementos = { ...FABULA_DEFAULT_SUPPLEMENTS, ...(next.suplementos || {}), [id]: !!enabled, basico:true };
                    const stillUnlocked = FABULA_EXTRA_OPTIONS.filter(opt => isFabulaExtraUnlocked(opt, next.suplementos)).map(opt => opt.id);
                    next.extrasAtivos = (next.extrasAtivos || []).filter(extraId => stillUnlocked.includes(extraId));
                    return next;
                });
            };
            const loadFabulaTemplateWithSupplements = (modelo) => {
                const clone = JSON.parse(JSON.stringify(modelo));
                clone.suplementos = getSelectedFabulaSupplements();
                loadTemplate(clone);
            };

            const loadTemplate = (modelo) => {
                let templateData = normalizeMetaItem(modelo);
                templateData = normalizeDndPcData(templateData);
                templateData = normalizeFabulaPcData(templateData);
                templateData = normalizeFabulaThreatData(templateData);
                templateData = normalizeSom6PcData(templateData);
                templateData = normalizeSom6PdjData(templateData);
                templateData.id = Date.now().toString();
                setData(templateData);
                setShowThreatModal(false);
                setShowDndModelModal(false);
                setShowDbModelModal(false);
                setShowFabulaModelModal(false);
                setShowSom6ModelModal(false);
                setCreateTarget(null);
                setDndPcTab('caracteristicas');
                setFabulaTab('perfil');
                setSom6Tab('perfil');
                setView('editor');
            };

            const deleteCharacter = (id) => {
                const chars = savedChars.filter(c => c.id !== id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
                setSavedChars(chars);
                setDeleteConfirmId(null);
                showToast("Personagem apagado.");
            };
            
            const deleteThreat = (id) => {
                const threats = savedThreats.filter(t => t.id !== id);
                localStorage.setItem(THREAT_STORAGE_KEY, JSON.stringify(threats));
                setSavedThreats(threats);
                setDeleteConfirmId(null);
                showToast("Ficha apagada.");
            };

            const updateField = (path, value) => {
                const newData = JSON.parse(JSON.stringify(data));
                let current = newData;
                const keys = path.split('.');
                const lastKey = keys.pop();
                keys.forEach(key => { if (!current[key]) current[key] = {}; current = current[key]; });
                current[lastKey] = value;
                setData(newData);
            };

            const updateArrayField = (arrayName, index, field, value) => {
                const newData = JSON.parse(JSON.stringify(data));
                if (!Array.isArray(newData[arrayName]) || !newData[arrayName][index]) return;
                newData[arrayName][index][field] = value;
                if (newData.system === 'dnd5e' && arrayName === 'ataques') {
                    const atk = newData.ataques[index];
                    if (atk?.sourceItemId && Array.isArray(newData.itensSincronizados)) {
                        const linked = newData.itensSincronizados.find(it => it.syncId === atk.sourceItemId);
                        if (linked) {
                            const map = { nome: 'nome', bonus: 'bonusAtaque', dano: 'dano', tipo: 'tipoDano' };
                            if (map[field]) linked[map[field]] = value;
                        }
                    }
                }
                setData(newData);
            };

            const addToArray = (arrayName, emptyObj) => {
                const newData = JSON.parse(JSON.stringify(data));
                if (!newData[arrayName]) newData[arrayName] = [];
                newData[arrayName].push(emptyObj);
                setData(newData);
            };

            const moveArrayItem = (arrayName, index, direction) => {
                const newData = JSON.parse(JSON.stringify(data));
                const arr = Array.isArray(newData[arrayName]) ? newData[arrayName] : null;
                if (!arr || !arr[index]) return;
                const newIndex = index + direction;
                if (newIndex < 0 || newIndex >= arr.length) return;
                [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
                setData(newData);
            };

            const moveNestedArrayItem = (arrayName, parentIndex, nestedName, index, direction) => {
                const newData = JSON.parse(JSON.stringify(data));
                const parentArr = Array.isArray(newData[arrayName]) ? newData[arrayName] : null;
                const nestedArr = parentArr?.[parentIndex]?.[nestedName];
                if (!Array.isArray(nestedArr) || !nestedArr[index]) return;
                const newIndex = index + direction;
                if (newIndex < 0 || newIndex >= nestedArr.length) return;
                [nestedArr[index], nestedArr[newIndex]] = [nestedArr[newIndex], nestedArr[index]];
                setData(newData);
            };

            const addDndSyncedItem = () => {
                const newData = JSON.parse(JSON.stringify(data));
                if (!Array.isArray(newData.itensSincronizados)) newData.itensSincronizados = [];
                newData.itensSincronizados.push({ syncId: `dnd-item-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, nome:'', quantidade:1, tipo:'Equipamento', bonusAtaque:'', dano:'', tipoDano:'', notas:'', sincronizarAtaque:false });
                setData(newData);
            };

            const updateDndSyncedItem = (index, patch) => {
                const newData = JSON.parse(JSON.stringify(data));
                if (!Array.isArray(newData.itensSincronizados) || !newData.itensSincronizados[index]) return;
                const item = { ...newData.itensSincronizados[index], ...patch };
                if (!item.syncId) item.syncId = `dnd-item-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
                if (item.tipo !== 'Arma') item.sincronizarAtaque = false;
                newData.itensSincronizados[index] = item;
                if (!Array.isArray(newData.ataques)) newData.ataques = [];
                const linkedIndex = newData.ataques.findIndex(a => a?.sourceItemId === item.syncId);
                if (item.sincronizarAtaque) {
                    const payload = { nome:item.nome, bonus:item.bonusAtaque, dano:item.dano, tipo:item.tipoDano, sourceItemId:item.syncId };
                    if (linkedIndex >= 0) newData.ataques[linkedIndex] = { ...newData.ataques[linkedIndex], ...payload };
                    else newData.ataques.push(payload);
                } else if (linkedIndex >= 0) {
                    newData.ataques.splice(linkedIndex, 1);
                }
                setData(newData);
            };

            const removeDndSyncedItem = (index) => {
                const newData = JSON.parse(JSON.stringify(data));
                const items = Array.isArray(newData.itensSincronizados) ? newData.itensSincronizados : [];
                const removed = items[index];
                if (!removed) return;
                newData.itensSincronizados = items.filter((_,i) => i !== index);
                if (removed.syncId && Array.isArray(newData.ataques)) newData.ataques = newData.ataques.filter(a => a?.sourceItemId !== removed.syncId);
                setData(newData);
                showToast('Item removido. Ataque sincronizado também foi atualizado.');
            };
            
            const removeFromArray = (arrayName, index) => {
                const newData = JSON.parse(JSON.stringify(data));
                const current = Array.isArray(newData[arrayName]) ? newData[arrayName] : [];
                const removed = current[index];
                if (removed === undefined) return;
                newData[arrayName] = current.filter((_, i) => i !== index);
                if (newData.system === 'dnd5e' && arrayName === 'ataques' && removed?.sourceItemId && Array.isArray(newData.itensSincronizados)) {
                    const linked = newData.itensSincronizados.find(it => it.syncId === removed.sourceItemId);
                    if (linked) linked.sincronizarAtaque = false;
                }
                setUndoState({ kind: 'array-remove', arrayName, index, item: JSON.parse(JSON.stringify(removed)), label: 'item removido' });
                setData(newData);
                showToast('Item removido.', { keepUndo: true });
            };

            const restoreFabulaEquipmentSlots = () => {
                const current = Array.isArray(data.equipamentos) ? JSON.parse(JSON.stringify(data.equipamentos)) : [];
                const basic = JSON.parse(JSON.stringify(initialFabulaPcData.equipamentos));
                const existing = new Set(current.map(e => String(e?.slot || '').trim().toLowerCase()));
                const missing = basic.filter(e => !existing.has(String(e.slot).trim().toLowerCase()));
                if (!missing.length) { showToast('Os quatro slots básicos já estão presentes.'); return; }
                updateField('equipamentos', [...current, ...missing]);
                showToast(`${missing.length} slot${missing.length > 1 ? 's' : ''} básico${missing.length > 1 ? 's' : ''} restaurado${missing.length > 1 ? 's' : ''} sem apagar equipamentos.`);
            };

            const returnToDashboard = () => {
                if (view === 'editor' && data) {
                    const ok = saveToLocal(data, true);
                    if (!ok) { showToast('Não foi possível sair: salve um backup ou libere espaço no navegador.'); return; }
                }
                setView('dashboard');
            };

            /* Dragonbane Específicos */
            const toggleTreinada = (arrayName, index) => {
                const newData = JSON.parse(JSON.stringify(data));
                const skill = newData[arrayName][index];
                skill.treinada = !skill.treinada;
                const attrKey = skill.attr.toLowerCase();
                const attrValue = newData.atributos[attrKey]?.valor || 10;
                const base = getChanceBase(attrValue);
                skill.valor = skill.treinada ? base * 2 : base;
                setData(newData);
            };

            const handleAttributeChange = (attr, value) => {
                const newData = JSON.parse(JSON.stringify(data));
                newData.atributos[attr].valor = value;
                if (!newData.status?.manterDerivados) {
                    if (attr === 'for') { newData.derivados.danoBonusFor = getDanoBonus(value); newData.derivados.limiteSobrecarga = Math.ceil(value / 2); }
                    if (attr === 'agl') { newData.derivados.danoBonusAgl = getDanoBonus(value); newData.derivados.movimento = getMovimento(newData.bio.ancestralidade, value); }
                    if (attr === 'con') { newData.status.pv.max = value; }
                    if (attr === 'von') { newData.status.pd.max = value; }
                }
                setData(newData);
            };

            const handleAncestryChange = (value) => {
                const newData = JSON.parse(JSON.stringify(data));
                newData.bio.ancestralidade = value;
                if (!newData.status?.manterDerivados) newData.derivados.movimento = getMovimento(value, newData.atributos.agl.valor);
                setData(newData);
            };
            
            const generatePnjAspect = (field) => {
                const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
                const lists = {
                    atitude: ['Hostil e Agressivo', 'Desconfiado/Na defensiva', 'Indiferente e Distante', 'Curioso', 'Amistoso e Solícito', 'Amedrontado/Acovardado', 'Arrogante e Superior', 'Servil e Puxa-saco'],
                    motivacao: ['Proteger seu território ou bens', 'Ficar rico/Ganhar moedas', 'Cumprir ordens superiores', 'Apenas sobreviver mais um dia', 'Vingança contra alguém', 'Alcançar glória e fama', 'Busca cega por conhecimento', 'Esconder um terrível segredo'],
                    tracoMarcante: ['Cicatriz bem visível', 'Voz extremamente rouca', 'Roupas gastas e extravagantes', 'Cheiro muito forte (suor/perfume)', 'Falta de um ou mais dentes', 'Sempre sorrindo, mesmo em perigo', 'Tosse constante e seca', 'Olhar fixo e perturbador', 'Muitas tatuagens tribais', 'Mancando de uma perna'],
                    profissao: ['Guarda/Milícia', 'Mercador/Caixeiro', 'Bandido/Mercenário', 'Fazendeiro/Aldeão', 'Cultista/Fanático', 'Nobre/Aristocrata', 'Caçador/Guia', 'Artesão/Ferreiro', 'Estalajadeiro', 'Ladrão de rua'],
                    nome: ['Thorek', 'Elara', 'Bram', 'Kaelen', 'Mira', 'Rurik', 'Sila', 'Varn', 'Ylva', 'Gorbag', 'Alden', 'Lyra', 'Fendrel', 'Nyx', 'Orik']
                };
                if(lists[field]) updateField(field, getRandom(lists[field]));
            };

            const handleExport = async (charDataOrEvent) => {
                const charToExport = (charDataOrEvent && charDataOrEvent.id) ? charDataOrEvent : data;
                try {
                    const zip = new JSZip();
                    const jsonData = JSON.stringify(charToExport, null, 2);
                    let fileName = `Ficha_${charToExport.bio?.nome || charToExport.nome || 'Novo_Personagem'}.json`;
                    if (charToExport.type === 'pnj') fileName = `PNJ_${charToExport.nome || 'Lacaio'}.json`;
                    if (charToExport.type === 'ameaca') fileName = `Ameaca_${charToExport.nome || 'Monstro'}.json`;

                    zip.file(fileName, jsonData);
                    const content = await zip.generateAsync({ type: "blob" });
                    const url = URL.createObjectURL(content);
                    
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.href = url;
                    let zipName = `RPG_Ficha.zip`;
                    downloadAnchorNode.download = zipName;
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                    URL.revokeObjectURL(url);
                    
                    showToast("Ficha exportada em .ZIP!");
                } catch (error) { showToast("Erro ao exportar o arquivo ZIP."); console.error(error); }
            };

            const normalizeImportedSheet = (importedData) => {
                if (!importedData || typeof importedData !== 'object' || Array.isArray(importedData)) throw new Error('Formato de ficha inválido');
                if (importedData.pjLiteBackup) throw new Error('Este arquivo é um backup geral; use Backup & Restauração.');
                const clone = JSON.parse(JSON.stringify(importedData));
                if (!clone.system) clone.system = 'dragonbane';
                if (!clone.type) clone.type = 'pc';
                const allIds = new Set([...getSavedCharacters(), ...getSavedThreats()].map(x => x.id));
                if (!clone.id || allIds.has(clone.id)) clone.id = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
                let normalizedData = normalizeMetaItem(clone);
                normalizedData = normalizeDndPcData(normalizedData);
                normalizedData = normalizeFabulaPcData(normalizedData);
                normalizedData = normalizeFabulaThreatData(normalizedData);
                normalizedData = normalizeSom6PcData(normalizedData);
                normalizedData = normalizeSom6PdjData(normalizedData);
                return normalizedData;
            };

            const handleImport = async (event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (!file) return;
                try {
                    let text = '';
                    const isZip = /\.zip$/i.test(file.name || '') || /zip/i.test(file.type || '');
                    if (isZip) {
                        const zip = await JSZip.loadAsync(file);
                        const entries = Object.values(zip.files).filter(entry => !entry.dir && /\.json$/i.test(entry.name));
                        if (!entries.length) throw new Error('O ZIP não contém uma ficha JSON.');
                        text = await entries[0].async('string');
                    } else {
                        text = await file.text();
                    }
                    const importedData = JSON.parse(text);
                    const normalizedData = normalizeImportedSheet(importedData);
                    if (!saveToLocal(normalizedData)) throw new Error('Não foi possível salvar a ficha importada.');
                    setData(normalizedData);
                    setView('editor');
                    showToast(isZip ? 'Ficha importada diretamente do ZIP!' : 'Ficha JSON importada com sucesso!');
                } catch (error) {
                    console.error(error);
                    showToast(error?.message || 'Erro: arquivo de ficha inválido.');
                }
            };

            const openCodeExport = (itemToExport) => {
                const clone = JSON.parse(JSON.stringify(itemToExport));
                if (clone.bio && clone.bio.imagem) clone.bio.imagem = ''; 
                if (clone.imagem) clone.imagem = '';
                const compressed = LZString.compressToBase64(JSON.stringify(clone));
                setCodeModal({ isOpen: true, mode: 'export', code: compressed });
            };

            const openCodeImport = () => setCodeModal({ isOpen: true, mode: 'import', code: '' });

            const handleCodeImport = () => {
                try {
                    const decompressed = LZString.decompressFromBase64(codeModal.code.trim());
                    if (!decompressed) throw new Error('Código inválido');
                    const importedData = JSON.parse(decompressed);
                    const normalizedData = normalizeImportedSheet(importedData);
                    if (!saveToLocal(normalizedData)) throw new Error('Não foi possível salvar a ficha importada.');
                    setData(normalizedData);
                    setView('editor');
                    setCodeModal({ isOpen: false, mode: 'import', code: '' });
                    showToast('Ficha importada com sucesso via código!');
                } catch (err) {
                    console.error(err);
                    showToast(err?.message || 'Erro: Código de ficha inválido ou corrompido.');
                }
            };

            const copyToClipboard = () => {
                navigator.clipboard.writeText(codeModal.code).then(() => { showToast("Código copiado para a área de transferência!"); })
                .catch(() => { const textArea = document.createElement("textarea"); textArea.value = codeModal.code; document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); textArea.remove(); showToast("Código copiado!"); });
            };

            const copySheetToChat = (item) => {
                const text = generateChatText(item);
                navigator.clipboard.writeText(text).then(() => { showToast("Ficha copiada para o chat!"); })
                .catch(() => { const textArea = document.createElement("textarea"); textArea.value = text; document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); textArea.remove(); showToast("Ficha copiada!"); });
            };

            const renderHistoryModal = () => {
                if (!showHistoryModal) return null;
                const list = data?.id ? (getHistory()[data.id] || []) : [];
                return <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4 no-print"><div className="bg-white text-gray-900 rounded-lg shadow-2xl border-2 border-gray-700 w-full max-w-lg p-5"><div className="flex justify-between items-center mb-4"><div><h3 className="font-title font-bold text-xl">🕘 Histórico local</h3><p className="text-xs text-gray-500">Até 5 versões anteriores do conteúdo. Retratos enviados não são duplicados no histórico para economizar espaço.</p></div><button onClick={()=>setShowHistoryModal(false)} className="text-xl font-bold">×</button></div>{list.length===0?<p className="text-sm text-gray-500 italic">Ainda não há versões anteriores desta ficha.</p>:<div className="space-y-3">{list.map((snap,i)=><button key={i} onClick={()=>restoreHistorySnapshot(snap)} className="w-full text-left border rounded p-3 hover:bg-gray-50"><strong>Versão {i+1}</strong><br/><span className="text-xs text-gray-500">{new Date(snap.at).toLocaleString('pt-BR')}</span></button>)}</div>}</div></div>;
            };

            if (view === 'dashboard') {
                return (
                    <React.Fragment>
                        <div className="max-w-5xl mx-auto mt-4 md:mt-10 p-4 animate-fade-in-up relative">
                            <div className="mb-4 flex justify-start select-none">
                                <span className="inline-flex items-center gap-1.5 bg-gray-900 text-white border border-gray-700 shadow px-3 py-1 rounded-full text-[10px] md:text-xs font-title font-bold tracking-wide">
                                    <span className="text-red-500">◆</span> PJ Lite
                                </span>
                            </div>
                            <div className="mb-4 flex flex-wrap items-center gap-2 no-print">
                                <div className="flex items-center gap-1 bg-gray-200 border border-gray-300 rounded px-2 py-1.5 shadow-sm">
                                    <SVGIcons.Palette />
                                    <select value={theme} onChange={(e) => { if (e.target.value === 'custom') setShowCustomBgModal(true); else setTheme(e.target.value); }} className="bg-transparent text-gray-700 font-bold text-xs outline-none cursor-pointer">
                                        <option value="default">Tema: Padrão</option>
                                        <option value="classic">Tema: Clássico DB</option>
                                        <option value="dnd">Tema: Dungeons & Dragons</option>
                                        <option value="fabula">Tema: Fabula Ultima</option>
                                        <option value="som6">Tema: O Som das Seis</option>
                                        <option value="dark">Tema: Modo Escuro</option>
                                        <option value="custom">Tema: Personalizado...</option>
                                    </select>
                                    {theme === 'custom' && <button type="button" onClick={() => setShowCustomBgModal(true)} className="ml-1 px-1.5 py-0.5 rounded border border-gray-400 text-[10px] font-bold hover:bg-white" title="Editar tema personalizado" aria-label="Editar tema personalizado">⚙</button>}
                                </div>
                                <button onClick={() => { setGuideTab('inicio'); setShowGuideModal(true); }} className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded shadow transition-colors font-bold text-sm">
                                    <SVGIcons.HelpCircle /> Guias e Tutoriais
                                </button>
                            </div>
                            <div className="mb-6 rounded border-2 border-[#922610] bg-[#fdf1dc] shadow-sm overflow-hidden">
                                <div className={`px-4 ${newsCollapsed ? 'py-2' : 'py-3'} flex items-center justify-between gap-3`}>
                                    <div className="min-w-0">
                                        <div className="font-title font-bold text-[#922610] flex items-center gap-2">
                                            <span>✨ v0.7.0 Alpha — uma nova fase para o PJ Lite</span>
                                            {newsCollapsed && <span className="hidden sm:inline text-[10px] font-body font-bold uppercase tracking-widest text-[#922610]/70">minimizado</span>}
                                        </div>
                                        {!newsCollapsed && (
                                            <div className="mt-1 space-y-2">
                                                <div className="text-xs text-gray-700 space-y-1.5"><p>A <strong>v0.7.0 Alpha</strong> marca a consolidação das grandes melhorias visuais e de experiência do PJ Lite, mantendo a proposta leve.</p><p><strong>Guias:</strong> conteúdo ampliado e reorganizado para iniciantes. <strong>Fabula Ultima:</strong> materiais modulares por suplemento, extras liberados apenas quando necessários e revisão geral dos recursos. <strong>O Som das Seis:</strong> ficha revisada, habilidades mais compactas e organizáveis, melhor leitura e integração consolidada. <strong>Dragonbane e D&amp;D 5e:</strong> preservam os layouts refinados e os recursos adicionados na linha 0.6.</p></div>
                                                <a href="https://t.me/boost/Baianoviado" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-full px-3 py-1.5 shadow-sm transition-colors">
                                                    <span>✈</span> Acompanhe anúncios e próximas novidades no Telegram ↗
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {!newsCollapsed && <span className="hidden md:inline bg-[#922610] text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">v0.7.0 • alpha</span>}
                                        <button onClick={() => setNewsCollapsed(v => !v)} className="bg-white/80 hover:bg-white text-[#922610] border border-[#c46b58] rounded px-2.5 py-1 text-xs font-bold shadow-sm" title={newsCollapsed ? 'Expandir novidades' : 'Minimizar novidades'} aria-label={newsCollapsed ? 'Expandir novidades' : 'Minimizar novidades'}>
                                            {newsCollapsed ? '＋' : '−'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Personagens */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                                <h1 className="text-3xl font-title font-bold text-dragon-dark border-b-4 border-red-800 pb-2">Meus Personagens</h1>
                                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center items-center">
                                    <button onClick={openCodeImport} className="flex justify-center items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded shadow transition-colors font-bold text-sm" title="Colar código texto">
                                        <SVGIcons.Code /> Colar Código
                                    </button>
                                    <label className="cursor-pointer flex justify-center items-center gap-1 bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded shadow transition-colors font-bold text-sm">
                                        <SVGIcons.Upload /> ZIP/JSON
                                        <input type="file" accept=".json,.zip,application/json,application/zip,application/x-zip-compressed" className="hidden" onChange={handleImport} />
                                    </label>
                                    <button onClick={() => { setCreateTarget('pc'); setShowSystemModal(true); }} className="flex justify-center items-center gap-1 bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition-colors font-bold text-sm">
                                        <SVGIcons.Plus /> Novo Personagem
                                    </button>
                                </div>
                            </div>



                            <div className="mb-5 no-print">
                                <div className="flex items-center gap-2 max-w-2xl">
                                    <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="flex-1 min-w-0 border border-gray-300 rounded px-3 py-2 text-sm bg-white shadow-sm" placeholder="🔎 Buscar fichas..." />
                                    <button onClick={()=>setShowFilters(v=>!v)} className={`shrink-0 border rounded px-3 py-2 text-xs font-bold shadow-sm ${showFilters || systemFilter!=='all' || sortMode!=='recent' || onlyFavorites ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>⚙ Filtros</button>
                                    <div className="hidden sm:flex border rounded overflow-hidden shadow-sm" title="Visualização do painel">
                                        <button onClick={()=>setDashboardView('cards')} className={`px-2.5 py-2 text-xs ${dashboardView==='cards'?'bg-gray-800 text-white':'bg-white text-gray-500'}`}>▦</button>
                                        <button onClick={()=>setDashboardView('list')} className={`px-2.5 py-2 text-xs ${dashboardView==='list'?'bg-gray-800 text-white':'bg-white text-gray-500'}`}>☰</button>
                                    </div>
                                </div>
                                {showFilters && (
                                    <div style={getWindowStyle()} className="mt-2 max-w-2xl bg-white border border-gray-200 rounded-lg shadow-sm p-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <select value={systemFilter} onChange={e=>setSystemFilter(e.target.value)} className="border rounded px-2 py-2 text-xs bg-white">
                                            <option value="all">Todos os sistemas</option><option value="dragonbane">Dragonbane</option><option value="dnd5e">D&D 5e</option><option value="fabula">Fabula Ultima</option><option value="somdas6">O Som das Seis</option>
                                        </select>
                                        <select value={sortMode} onChange={e=>setSortMode(e.target.value)} className="border rounded px-2 py-2 text-xs bg-white">
                                            <option value="recent">Mais recentes</option><option value="name">Nome A–Z</option><option value="system">Por sistema</option>
                                        </select>
                                        <button onClick={()=>setOnlyFavorites(v=>!v)} className={`rounded px-3 py-2 text-xs font-bold border ${onlyFavorites?'bg-yellow-100 border-yellow-400 text-yellow-800':'bg-gray-50 border-gray-300 text-gray-700'}`}>★ {onlyFavorites?'Só favoritos':'Favoritos'}</button>
                                    </div>
                                )}
                            </div>

                            {filterAndSortItems(savedChars).length === 0 ? (
                                <div style={getWindowStyle()} className="text-center py-20 bg-white rounded-lg shadow border-2 border-dashed border-gray-300">
                                    <div className="flex justify-center text-gray-400"><SVGIcons.User /></div>
                                    <p className="text-gray-500 mt-4 text-lg">{(searchQuery.trim() || systemFilter !== 'all' || onlyFavorites) ? 'Nenhum personagem corresponde à busca ou aos filtros atuais.' : 'Nenhum personagem encontrado na sua pasta.'}</p>{(searchQuery.trim() || systemFilter !== 'all' || onlyFavorites) && <button onClick={()=>{setSearchQuery('');setSystemFilter('all');setOnlyFavorites(false);}} className="mt-3 bg-gray-800 hover:bg-black text-white px-4 py-2 rounded text-xs font-bold">Limpar busca e filtros</button>}
                                </div>
                            ) : (
                                <div className={dashboardView==='list' ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                                    {filterAndSortItems(savedChars).map(char => {
                                        const isDnd = char.system === 'dnd5e';
                                        const isFabula = char.system === 'fabula';
                                        const isSom6 = char.system === 'somdas6';
                                        return (
                                        <div key={char.id} style={getWindowStyle()} className={`pj-card-compact bg-white rounded-md shadow-lg border-2 ${isDnd ? 'border-[#922610]' : isFabula ? 'border-teal-700' : isSom6 ? 'border-red-900' : 'border-dragon-dark'} overflow-hidden flex ${dashboardView==='list'?'flex-row items-stretch':'flex-col'} relative`}>
                                            <div className={`absolute top-0 right-0 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-bl shadow-sm z-10 ${isDnd ? 'bg-[#922610]' : isFabula ? 'bg-teal-700' : isSom6 ? 'bg-red-900' : 'bg-dragon-dark'}`}>
                                                {isDnd ? 'D&D 5e' : isFabula ? 'Fabula Ultima' : isSom6 ? 'O Som das Seis' : 'Dragonbane'}
                                            </div>
                                            <div className={`${dashboardView==='list'?'flex flex-1 min-w-0 h-24 border-r':'flex h-28 border-b'} border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors`} onClick={() => loadCharacter(char.id)}>
                                                <div className="w-28 shrink-0 bg-gray-200 border-r border-gray-300">
                                                    {char.bio?.imagem ? (
                                                        <img src={char.bio.imagem} alt={char.bio.nome} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100"><SVGIcons.User /></div>
                                                    )}
                                                </div>
                                                <div className="p-3 flex-1 overflow-hidden flex flex-col justify-center">
                                                    <h3 className={`font-title font-bold text-lg truncate ${isDnd ? 'text-[#922610]' : isFabula ? 'text-teal-800' : isSom6 ? 'text-red-900' : 'text-red-900'}`}>{char.bio?.nome || 'Sem Nome'}</h3>
                                                    <p className="text-xs text-gray-600 font-bold uppercase mt-1 truncate">
                                                        {isDnd ? `${char.bio?.linhagem || '?'} • ${char.bio?.classe || '?'}` : isFabula ? `${char.bio?.identidade || 'Sem identidade'} • ${char.bio?.tema || 'Sem tema'}` : isSom6 ? `${char.bio?.apelido || 'Sem apelido'} • ${char.tormento?.tipo || 'Sem tormento'}` : `${char.bio?.ancestralidade || '?'} • ${char.bio?.profissao || '?'}`}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 mt-2 truncate italic">Nível {isFabula ? (char.nivel || 5) : isSom6 ? (char.nivel || 1) : (char.bio?.nivel || 1)}</p>
                                                    {char.meta?.campanha && <p className="text-[10px] text-indigo-600 mt-1 truncate font-bold">📁 {char.meta.campanha}</p>}
                                                    {char.meta?.updatedAt && <p className="text-[9px] text-gray-400 mt-1">Editado: {new Date(char.meta.updatedAt).toLocaleString('pt-BR')}</p>}
                                                </div>
                                            </div>
                                            <div className={`${dashboardView==='list'?'bg-gray-100 p-2 flex items-center':'bg-gray-100 p-2 flex justify-between items-center'} text-xs`}>
                                                <div className="flex gap-1 flex-wrap">
                                                    <button onClick={() => handleExport(char)} className="text-gray-700 hover:text-black font-bold px-2 py-1 bg-gray-200 rounded border border-gray-300 shadow-sm"><SVGIcons.Save/></button>
                                                    <button onClick={() => openCodeExport(char)} className="text-gray-700 hover:text-black font-bold px-2 py-1 bg-gray-200 rounded border border-gray-300 shadow-sm"><SVGIcons.Code/></button>
                                                    <button onClick={() => openChatOptions(char)} className="text-gray-700 hover:text-black font-bold px-2 py-1 bg-gray-200 rounded border border-gray-300 shadow-sm"><SVGIcons.MessageCircle/></button>
                                                    <button onClick={() => duplicateItem(char, false)} title="Duplicar ficha" className="text-gray-700 hover:text-black font-bold px-2 py-1 bg-gray-200 rounded border border-gray-300 shadow-sm">⧉</button>
                                                    <button onClick={() => toggleFavorite(char.id, false)} title="Favorito" className={`font-bold px-2 py-1 rounded border shadow-sm ${char.meta?.favorite?'bg-yellow-100 border-yellow-400 text-yellow-700':'bg-gray-200 border-gray-300 text-gray-500'}`}>★</button>
                                                </div>
                                                {deleteConfirmId === char.id ? (
                                                    <button onClick={() => deleteCharacter(char.id)} className="bg-red-600 text-white font-bold px-3 py-1 rounded shadow animate-pulse">Confirmar</button>
                                                ) : <button onClick={() => setDeleteConfirmId(char.id)} className="text-red-500 hover:text-red-700 px-2 py-1"><SVGIcons.Trash/></button>}
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            )}
                            
                            {/* Ameaças e PNJs */}
                            <div className="flex flex-col md:flex-row justify-between items-center mt-12 mb-8 gap-4">
                                <h1 className="text-3xl font-title font-bold text-dragon-dark border-b-4 border-gray-700 pb-2">Ameaças e Bestiário</h1>
                                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center items-center">
                                    <button onClick={openCodeImport} className="flex justify-center items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded shadow transition-colors font-bold text-sm">
                                        <SVGIcons.Code /> Colar Código
                                    </button>
                                    <label className="cursor-pointer flex justify-center items-center gap-1 bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded shadow transition-colors font-bold text-sm">
                                        <SVGIcons.Upload /> ZIP/JSON
                                        <input type="file" accept=".json,.zip,application/json,application/zip,application/x-zip-compressed" className="hidden" onChange={handleImport} />
                                    </label>
                                    <button onClick={() => { setCreateTarget('threat'); setShowSystemModal(true); }} className="flex justify-center items-center gap-1 bg-gray-800 hover:bg-black text-white px-4 py-2 rounded shadow transition-colors font-bold text-sm">
                                        <SVGIcons.Plus /> Criar Ameaça/PNJ
                                    </button>
                                </div>
                            </div>

                            {filterAndSortItems(savedThreats).length === 0 ? (
                                <div style={getWindowStyle()} className="text-center py-16 bg-white rounded-lg shadow border-2 border-dashed border-gray-300">
                                    <div className="flex justify-center text-gray-400 mb-4"><SVGIcons.Skull /></div>
                                    <p className="text-gray-500 text-lg">{(searchQuery.trim() || systemFilter !== 'all' || onlyFavorites) ? 'Nenhuma ameaça ou PNJ corresponde à busca ou aos filtros atuais.' : 'Nenhuma ameaça ou PNJ encontrado.'}</p>{(searchQuery.trim() || systemFilter !== 'all' || onlyFavorites) && <button onClick={()=>{setSearchQuery('');setSystemFilter('all');setOnlyFavorites(false);}} className="mt-3 bg-gray-800 hover:bg-black text-white px-4 py-2 rounded text-xs font-bold">Limpar busca e filtros</button>}
                                </div>
                            ) : (
                                <div className={dashboardView==='list' ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                                    {filterAndSortItems(savedThreats).map(threat => {
                                        const sys = threat.system || 'dragonbane';
                                        return (
                                        <div key={threat.id} style={getWindowStyle()} className={`pj-card-compact bg-white rounded-md shadow-lg border-2 ${sys === 'dnd5e' ? 'border-[#922610]' : sys === 'fabula' ? 'border-teal-700' : sys === 'somdas6' ? 'border-red-900' : 'border-gray-500'} overflow-hidden flex ${dashboardView==='list'?'flex-row items-stretch':'flex-col'} relative`}>
                                            <div className={`absolute top-0 right-0 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-bl shadow-sm z-10 ${sys === 'dnd5e' ? 'bg-[#922610]' : sys === 'fabula' ? 'bg-teal-700' : sys === 'somdas6' ? 'bg-red-900' : threat.type === 'pnj' ? 'bg-blue-800' : 'bg-red-900'}`}>
                                                {sys === 'dnd5e' ? 'D&D 5e (Stat Block)' : sys === 'fabula' ? 'Fabula Ultima' : sys === 'somdas6' ? 'O Som das Seis • PDJ' : threat.type === 'pnj' ? 'PNJ (DB)' : 'Monstro (DB)'}
                                            </div>
                                            <div className={`${dashboardView==='list'?'flex flex-1 min-w-0 h-24 border-r':'flex h-24 border-b'} border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors`} onClick={() => loadThreat(threat.id)}>
                                                <div className="p-3 flex-1 overflow-hidden flex flex-col justify-center">
                                                    <h3 className={`font-title font-bold text-lg truncate ${sys === 'dnd5e' ? 'text-[#7a200d]' : sys === 'fabula' ? 'text-teal-800' : sys === 'somdas6' ? 'text-red-900' : 'text-gray-900'}`}>{threat.nome || 'Sem Nome'}</h3>
                                                    <p className="text-xs text-gray-600 font-bold uppercase mt-1 truncate">
                                                        {sys === 'dnd5e' ? `${threat.tamanho} ${threat.tipo}` : sys === 'fabula' ? `Nível ${threat.nivel || 5} • ${threat.patente || 'Soldado'} • ${threat.especie || '?'}` : sys === 'somdas6' ? `NP ${threat.np || 1} • ${threat.tipoPdj || 'Comum'} • ${threat.status?.acoes || 1} ação(ões)` : threat.type === 'pnj' ? `${threat.ancestralidade || '?'} • ${threat.profissao || '?'}` : `Ferocidade ${threat.ferocidade} • ${threat.tamanho}`}
                                                    </p>
                                                    {threat.meta?.campanha && <p className="text-[10px] text-indigo-600 mt-1 truncate font-bold">📁 {threat.meta.campanha}</p>}
                                                    {threat.meta?.updatedAt && <p className="text-[9px] text-gray-400 mt-1">Editado: {new Date(threat.meta.updatedAt).toLocaleString('pt-BR')}</p>}
                                                </div>
                                            </div>
                                            <div className={`${dashboardView==='list'?'bg-gray-100 p-2 flex items-center':'bg-gray-100 p-2 flex justify-between items-center'} text-xs`}>
                                                <div className="flex gap-1 flex-wrap">
                                                    <button onClick={() => handleExport(threat)} className="text-gray-700 hover:text-black font-bold px-2 py-1 bg-gray-200 rounded border border-gray-300 shadow-sm"><SVGIcons.Save/></button>
                                                    <button onClick={() => openCodeExport(threat)} className="text-gray-700 hover:text-black font-bold px-2 py-1 bg-gray-200 rounded border border-gray-300 shadow-sm"><SVGIcons.Code/></button>
                                                    <button onClick={() => openChatOptions(threat)} className="text-gray-700 hover:text-black font-bold px-2 py-1 bg-gray-200 rounded border border-gray-300 shadow-sm"><SVGIcons.MessageCircle/></button>
                                                    <button onClick={() => duplicateItem(threat, true)} title="Duplicar ficha" className="text-gray-700 hover:text-black font-bold px-2 py-1 bg-gray-200 rounded border border-gray-300 shadow-sm">⧉</button>
                                                    <button onClick={() => toggleFavorite(threat.id, true)} title="Favorito" className={`font-bold px-2 py-1 rounded border shadow-sm ${threat.meta?.favorite?'bg-yellow-100 border-yellow-400 text-yellow-700':'bg-gray-200 border-gray-300 text-gray-500'}`}>★</button>
                                                </div>
                                                {deleteConfirmId === threat.id ? (
                                                    <button onClick={() => deleteThreat(threat.id)} className="bg-red-600 text-white font-bold px-3 py-1 rounded shadow animate-pulse">Confirmar</button>
                                                ) : <button onClick={() => setDeleteConfirmId(threat.id)} className="text-red-500 hover:text-red-700 px-2 py-1"><SVGIcons.Trash/></button>}
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            )}
                            
                            {/* Sobre o Projeto */}
                            <div style={getWindowStyle()} className="mt-12 bg-white rounded-lg shadow-lg border-2 border-gray-300 overflow-hidden">
                                <div style={getBarStyle()} className="bg-dragon-dark text-white p-3 flex justify-between items-center">
                                    <h2 className="font-title font-bold text-lg flex items-center gap-2">Sobre o Projeto & Atualizações</h2>
                                    <span className="bg-red-800 px-3 py-1 rounded-sm text-xs font-bold tracking-widest uppercase shadow">{UPDATE_LOG[0].versao}</span>
                                </div>
                                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-title font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4 text-lg">Log de Atualizações</h3>
                                        <div className="text-sm text-gray-700 space-y-3 h-48 overflow-y-auto pr-2 scrollbar-thin">
                                            {UPDATE_LOG.slice(0, 6).map((log, idx) => (
                                                <p key={idx}><strong className="text-black bg-gray-200 px-1 rounded">{log.versao}:</strong> {log.descricao}</p>
                                            ))}
                                        </div>
                                        <div className="mt-4 border-t border-gray-200 pt-3 text-xs text-gray-600">
                                            <div className="font-title font-bold text-gray-800 mb-1">Créditos de Desenvolvimento</div>
                                            <p><strong>Desenvolvido por Nick Queijo</strong></p>
                                            <p className="mt-1">Telegram: <strong>@ralseibaiano</strong> &nbsp;•&nbsp; Discord: <strong>inabakaoru</strong></p>
                                            <a href="https://t.me/boost/Baianoviado" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-900 font-bold underline underline-offset-2">✈ Canal de anúncios e novidades no Telegram ↗</a>
                                            <p className="mt-1 text-[10px] text-gray-500">Projeto comunitário e gratuito, desenvolvido para facilitar a criação e organização de fichas de RPG.</p>
                                        </div>
                                        <details className="mt-4 border border-gray-200 rounded-lg bg-gray-50 no-print">
                                            <summary className="cursor-pointer select-none px-4 py-3 font-title font-bold text-sm text-gray-800 hover:bg-gray-100 rounded-lg">💾 Backup & Restauração</summary>
                                            <div className="border-t border-gray-200 p-4">
                                                <p className="text-xs text-gray-600 mb-3">Exporte todas as fichas de uma vez ou restaure um backup completo. A restauração substitui os dados salvos atualmente no navegador.</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <button onClick={exportFullBackup} className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded text-xs font-bold">💾 Exportar backup geral</button>
                                                    <label className="cursor-pointer bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded text-xs font-bold">↩ Restaurar backup<input type="file" accept=".json" className="hidden" onChange={restoreFullBackup}/></label>
                                                </div>
                                            </div>
                                        </details>
                                    </div>
                                    <div className="space-y-4 fabula-profile-panel"><div className="flex items-end justify-between gap-3 border-b border-teal-200 pb-3"><div><div className="fabula-top-sub">Fabula Ultima</div><div className="fabula-top-title">Ficha de Personagem</div></div><div className="text-right text-[10px] text-gray-500">visual inspirado na ficha em PDF</div></div>
                                        <div className="bg-gray-50 border border-gray-200 rounded p-4">
                                            <h3 className="font-title font-bold text-gray-800 mb-2">Projeto de Código Aberto 🔓</h3>
                                            <p className="text-sm text-gray-700 leading-relaxed mb-2">
                                                Esta ferramenta é 100% gratuita, sem coleta de dados e sem fins lucrativos. Todo o armazenamento é feito localmente no seu navegador.
                                            </p>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                Para ver como funciona ou salvar no seu PC, basta clicar com o botão direito na página e selecionar <strong>"Exibir código-fonte da página"</strong> (ou Ctrl+U), copiar tudo e salvar como um arquivo <code>.html</code>.
                                            </p>
                                        </div>
                                        <a href="https://dmliterpg.vercel.app/" target="_blank" rel="noopener noreferrer" className="block bg-dragon-dark hover:bg-black text-white rounded p-4 text-center transition-colors shadow-md border-2 border-red-800 group">
                                            <h3 className="font-title font-bold text-lg text-red-500 group-hover:text-red-400 transition-colors">Visite a Plataforma DMLite 🐉</h3>
                                            <p className="text-xs text-gray-300 mt-1">Mais ferramentas e recursos para Mestres de RPG.</p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {}
                        {showSystemModal && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 transition-opacity">
                                <div className="bg-white rounded-sm shadow-2xl w-full max-w-md border-2 border-dragon-dark overflow-hidden animate-fade-in-up">
                                    <div style={getBarStyle()} className="bg-dragon-dark text-white p-3 flex justify-between items-center">
                                        <h2 className="font-title font-bold text-lg uppercase tracking-wide">Selecionar Sistema</h2>
                                        <button onClick={() => { setShowSystemModal(false); setCreateTarget(null); }} className="text-gray-400 hover:text-white text-2xl font-bold px-2 leading-none">&times;</button>
                                    </div>
                                    <div className="p-6 bg-gray-100 flex flex-col gap-4">
                                        <div onClick={() => { 
                                            setShowSystemModal(false); 
                                            if (createTarget === 'pc') { setShowDbModelModal(true); }
                                            else { setShowThreatModal(true); }
                                        }} className="bg-white border-2 border-gray-300 hover:border-red-800 rounded p-4 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group">
                                            <div style={getBarStyle()} className="w-14 h-14 bg-dragon-dark group-hover:bg-red-800 text-white rounded flex items-center justify-center font-bold font-title text-2xl shadow-inner transition-colors">DB</div>
                                            <div className="flex-1">
                                                <h3 className="font-title font-bold text-gray-900 group-hover:text-red-900 text-lg transition-colors">Dragonbane</h3>
                                                <p className="text-xs text-gray-500">Mitos, Magia e Aventuras Clássicas</p>
                                            </div>
                                        </div>

                                        <div onClick={() => { 
                                            setShowSystemModal(false); 
                                            setShowDndModelModal(true);
                                        }} className="bg-white border-2 border-gray-300 hover:border-[#922610] rounded p-4 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group">
                                            <div className="w-14 h-14 bg-orange-600 group-hover:bg-[#922610] text-white rounded flex items-center justify-center font-bold font-title text-2xl shadow-inner transition-colors">D&D</div>
                                            <div className="flex-1">
                                                <h3 className="font-title font-bold text-gray-900 group-hover:text-[#922610] text-lg transition-colors">D&D 5e (2024)</h3>
                                                <p className="text-xs text-gray-500">Regras do SRD 5.2 • novo sistema em adaptação</p>
                                            </div>
                                        </div>

                                        <div onClick={() => { setShowSystemModal(false); setFabulaCreateSupplements({ ...FABULA_DEFAULT_SUPPLEMENTS }); setShowFabulaModelModal(true); }} className="bg-white border-2 border-gray-300 hover:border-teal-700 rounded p-4 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group">
                                            <div className="w-14 h-14 bg-teal-700 group-hover:bg-teal-800 text-white rounded flex items-center justify-center font-bold font-title text-xl shadow-inner transition-colors">FU</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2"><h3 className="font-title font-bold text-gray-900 group-hover:text-teal-800 text-lg transition-colors">Fabula Ultima</h3><span className="bg-teal-100 text-teal-800 text-[9px] font-bold uppercase px-2 py-0.5 rounded">Integrado</span></div>
                                                <p className="text-xs text-gray-500">{createTarget === 'pc' ? 'Personagem + modelos prontos' : 'Ameaça / PNJ + bestiário'}</p>
                                            </div>
                                        </div>

                                        <div onClick={() => { setShowSystemModal(false); setShowSom6ModelModal(true); }} className="bg-white border-2 border-gray-300 hover:border-red-900 rounded p-4 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group">
                                            <div className="w-14 h-14 bg-red-900 group-hover:bg-red-950 text-amber-50 rounded flex items-center justify-center font-bold font-title text-xl shadow-inner transition-colors">S6</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2"><h3 className="font-title font-bold text-gray-900 group-hover:text-red-900 text-lg transition-colors">O Som das Seis</h3><span className="bg-amber-100 text-red-900 text-[9px] font-bold uppercase px-2 py-0.5 rounded">Integrado 0.7.0</span></div>
                                                <p className="text-xs text-gray-500">{createTarget === 'pc' ? 'Faroeste • personagem, Sina e montaria' : 'PDJs simplificados por Nível de Poder'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>, document.body
                        )}


                        {showSom6ModelModal && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 transition-opacity">
                                <div className="bg-[#f8edd7] rounded-sm shadow-2xl w-full max-w-3xl border-2 border-red-900 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
                                    <div className="bg-red-950 text-amber-50 p-3 flex justify-between items-center shrink-0">
                                        <div><h2 className="font-title font-bold text-lg">Criar em O Som das Seis</h2><p className="text-[10px] text-amber-100">Integração consolidada na linha 0.7 Alpha</p></div>
                                        <button onClick={() => { setShowSom6ModelModal(false); setCreateTarget(null); }} className="text-amber-100 hover:text-white text-2xl font-bold px-2 leading-none">&times;</button>
                                    </div>
                                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                                        {createTarget === 'pc' ? <>
                                            <div><h3 className="font-title font-bold text-red-950 border-b-2 border-red-200 pb-1 mb-3">Personagem</h3>
                                                <div onClick={() => loadTemplate(initialSom6PcData)} className="bg-white border-2 border-stone-300 hover:border-red-900 rounded p-4 cursor-pointer flex items-center gap-4"><div className="w-12 h-12 bg-red-900 text-amber-50 rounded flex items-center justify-center text-xl">🤠</div><div><h3 className="font-bold text-sm">Novo Personagem</h3><p className="text-xs text-gray-500">Comece uma ficha em branco.</p></div></div>
                                            </div>
                                            <div><h3 className="font-title font-bold text-red-950 border-b-2 border-red-200 pb-1 mb-3">Exemplo preenchido</h3>{MODELOS_SOM6_PC.map((m,i)=><div key={i} onClick={()=>loadTemplate(m)} className="bg-white border-2 border-amber-200 hover:border-red-900 rounded p-3 cursor-pointer"><div className="font-bold text-red-950">{m.bio.nome}</div><div className="text-xs text-gray-500">{m.bio.apelido} • {m.tormento.tipo}</div></div>)}</div>
                                        </> : <>
                                            <div><h3 className="font-title font-bold text-red-950 border-b-2 border-red-200 pb-1 mb-3">PDJ em Branco</h3><div onClick={()=>loadTemplate(initialSom6PdjData)} className="bg-white border-2 border-stone-300 hover:border-red-900 rounded p-4 cursor-pointer flex items-center gap-4"><div className="w-12 h-12 bg-red-950 text-amber-50 rounded flex items-center justify-center text-xl">☠</div><div><h3 className="font-bold text-sm">Novo PDJ</h3><p className="text-xs text-gray-500">Use NP 1–6 e registre só o que importa.</p></div></div></div>
                                            <div><h3 className="font-title font-bold text-red-950 border-b-2 border-red-200 pb-1 mb-3">Modelos rápidos</h3><div className="grid sm:grid-cols-2 gap-3">{MODELOS_SOM6_PDJ.map((m,i)=><div key={i} onClick={()=>loadTemplate(m)} className="bg-white border-2 border-amber-200 hover:border-red-900 rounded p-3 cursor-pointer"><div className="font-bold text-red-950">{m.nome}</div><div className="text-xs text-gray-500">NP {m.np} • PV {m.status.pvMax} • {m.status.acoes} ações</div></div>)}</div></div>
                                        </>}
                                        <div className="text-[10px] text-stone-600 border-t border-stone-300 pt-3">Regras de <strong>O Som das Seis</strong> por Ramon Mineiro. A adaptação de regras desta ficha segue a licença CC BY-SA 4.0 indicada no livro. <a href="https://www.rpgplanet.com.br/o-som-das-seis" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Material original ↗</a>.</div>
                                    </div>
                                </div>
                            </div>, document.body
                        )}

                        {showFabulaModelModal && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 transition-opacity">
                                <div className="bg-white rounded-sm shadow-2xl w-full max-w-3xl border-2 border-teal-700 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
                                    <div className="bg-teal-800 text-white p-3 flex justify-between items-center shrink-0">
                                        <div><h2 className="font-title font-bold text-lg">Criar em Fabula Ultima</h2><p className="text-[10px] text-teal-100">Compatibilidade consolidada no PJ Lite</p></div>
                                        <button onClick={() => { setShowFabulaModelModal(false); setCreateTarget(null); }} className="text-teal-100 hover:text-white text-2xl font-bold px-2 leading-none">&times;</button>
                                    </div>
                                    <div className="p-6 bg-gray-100 flex-1 overflow-y-auto space-y-6">
                                        {createTarget === 'pc' ? <>
                                            <div>
                                                <div className="flex items-end justify-between gap-3 border-b-2 border-gray-300 pb-2 mb-3"><div><h3 className="font-title font-bold text-gray-700">1. Materiais usados pela ficha</h3><p className="text-[10px] text-gray-500 mt-1">O Livro Básico fica sempre ativo. Marque apenas os suplementos que este personagem realmente usará.</p></div><span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-1 rounded-full">modo Lite</span></div>
                                                <div className="grid sm:grid-cols-2 gap-2">{FABULA_SUPPLEMENT_OPTIONS.map(src=>{const checked=src.locked || !!fabulaCreateSupplements?.[src.id]; return <button type="button" key={src.id} disabled={!!src.locked} aria-pressed={checked} onClick={()=>!src.locked&&toggleFabulaCreateSupplement(src.id)} className={`fabula-supplement-card ${checked?'active':''} ${src.locked?'locked':''}`}><span className="fabula-supplement-icon">{src.icon}</span><span className="min-w-0 text-left"><span className="flex items-center gap-2"><strong className="text-sm">{src.nome}</strong>{src.locked&&<span className="fabula-supplement-status">sempre</span>}</span><span className="block text-[10px] opacity-70 mt-1">{src.desc}</span></span><span className="fabula-supplement-check" aria-hidden="true">{checked?'✓':'＋'}</span></button>})}</div>
                                            </div>
                                            <div><h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">2. Criar ficha</h3>
                                                <div onClick={() => loadFabulaTemplateWithSupplements(initialFabulaPcData)} className="bg-white border-2 border-gray-300 hover:border-teal-700 rounded p-4 cursor-pointer flex items-center gap-4"><div className="w-12 h-12 bg-teal-700 text-white rounded flex items-center justify-center text-xl">👤</div><div className="flex-1"><h3 className="font-bold text-sm">Novo Personagem</h3><p className="text-xs text-gray-500">Cria uma ficha em branco liberando somente os módulos dos livros selecionados.</p><div className="flex flex-wrap gap-1.5 mt-2">{FABULA_SUPPLEMENT_OPTIONS.filter(src=>src.locked||fabulaCreateSupplements?.[src.id]).map(src=><span key={src.id} className="fabula-material-icon" title={src.nome}>{src.icon}</span>)}</div></div></div>
                                            </div>
                                            <div><h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Personagens Prontos • Press Start</h3><p className="text-[10px] text-gray-500 mb-2">Os modelos continuam usando seus dados originais, mas também recebem os suplementos marcados acima.</p>
                                                <div className="grid sm:grid-cols-2 gap-3">{MODELOS_FABULA_PC.map((m,i)=><div key={i} onClick={()=>loadFabulaTemplateWithSupplements(m)} className="bg-white border-2 border-teal-200 hover:border-teal-700 rounded p-3 cursor-pointer hover:shadow-md"><div className="font-bold text-teal-900">{m.bio.nome}</div><div className="text-[10px] text-gray-500">{m.bio.identidade}</div><div className="text-[10px] mt-1">{m.bio.origem} • Tema: {m.bio.tema}</div></div>)}</div>
                                            </div>
                                        </> : <>
                                            <div><h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Ameaça / PNJ em Branco</h3>
                                                <div onClick={() => loadTemplate(initialFabulaThreatData)} className="bg-white border-2 border-gray-300 hover:border-teal-700 rounded p-4 cursor-pointer flex items-center gap-4"><div className="w-12 h-12 bg-teal-800 text-white rounded flex items-center justify-center text-xl">👹</div><div><h3 className="font-bold text-sm">Novo NPC / Ameaça</h3><p className="text-xs text-gray-500">Crie soldados, elites, campeões ou vilões.</p></div></div>
                                            </div>
                                            <div><h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Modelo de Bestiário</h3>{MODELOS_FABULA_AMEACA.map((m,i)=><div key={i} onClick={()=>loadTemplate(m)} className="bg-white border-2 border-teal-200 hover:border-teal-700 rounded p-3 cursor-pointer"><div className="font-bold text-teal-900">{m.nome}</div><div className="text-xs text-gray-500">Nível {m.nivel} • {m.patente} • {m.especie}</div></div>)}</div>
                                        </>}
                                    </div>
                                </div>
                            </div>, document.body
                        )}

                        {showDbModelModal && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 transition-opacity">
                                <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl border-2 border-dragon-dark overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
                                    <div style={getBarStyle()} className="bg-dragon-dark text-white p-3 flex justify-between items-center shrink-0">
                                        <h2 className="font-title font-bold text-lg">Criar em Dragonbane</h2>
                                        <button onClick={() => { setShowDbModelModal(false); setCreateTarget(null); }} className="text-gray-400 hover:text-white text-2xl font-bold px-2 leading-none">&times;</button>
                                    </div>
                                    <div className="p-6 bg-gray-100 flex-1 overflow-y-auto space-y-6">
                                        <div>
                                            <h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Ficha de Personagem (Em Branco)</h3>
                                            <div onClick={() => loadTemplate(initialData)} className="bg-white border-2 border-gray-300 hover:border-red-800 rounded p-4 cursor-pointer flex items-center gap-4">
                                                <div className="w-12 h-12 bg-dragon-dark text-white rounded flex items-center justify-center shrink-0"><SVGIcons.User /></div>
                                                <div><h3 className="font-bold text-sm">PC Dragonbane</h3><p className="text-xs text-gray-500">Comece uma ficha do zero</p></div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Modelos Prontos (Personagens Oficiais de Referência)</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {MODELOS_DRAGONBANE_PC.map((modelo, idx) => (
                                                    <div key={idx} onClick={() => loadTemplate(modelo)} className="border rounded p-3 cursor-pointer hover:shadow-md flex justify-between items-center bg-white border-emerald-200 hover:border-emerald-700">
                                                        <div className="flex flex-col"><span className="text-[10px] font-bold uppercase text-emerald-800">{modelo.bio.ancestralidade} • {modelo.bio.profissao}</span><span className="font-bold text-sm">{modelo.bio.nome}</span></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-3">Modelos adaptados como ponto de partida para uso nesta ferramenta. Consulte o material oficial para regras e descrições completas.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>, document.body
                        )}

                        {showThreatModal && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 transition-opacity">
                                <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl border-2 border-gray-600 overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
                                    <div style={getBarStyle()} className="bg-gray-800 text-white p-3 flex justify-between items-center shrink-0">
                                        <h2 className="font-title font-bold text-lg">Nova Ameaça (Dragonbane)</h2>
                                        <button onClick={() => setShowThreatModal(false)} className="text-gray-400 hover:text-white text-2xl font-bold px-2 leading-none">&times;</button>
                                    </div>
                                    <div className="p-6 bg-gray-100 flex-1 overflow-y-auto space-y-6">
                                        <div>
                                            <h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Fichas em Branco</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div onClick={() => loadTemplate(initialPnjData)} className="bg-white border-2 border-gray-300 hover:border-blue-800 rounded p-4 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group">
                                                    <div className="w-12 h-12 bg-blue-900 text-white rounded flex items-center justify-center font-bold shadow-inner shrink-0"><SVGIcons.User /></div>
                                                    <div>
                                                        <h3 className="font-title font-bold text-gray-900 text-sm">Ficha de PNJ</h3>
                                                        <p className="text-[10px] text-gray-500">Humanoides com Perícias.</p>
                                                    </div>
                                                </div>
                                                <div onClick={() => loadTemplate(initialAmeacaData)} className="bg-white border-2 border-gray-300 hover:border-red-800 rounded p-4 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group">
                                                    <div className="w-12 h-12 bg-red-900 text-white rounded flex items-center justify-center font-bold shadow-inner shrink-0"><SVGIcons.Skull /></div>
                                                    <div>
                                                        <h3 className="font-title font-bold text-gray-900 text-sm">Ficha de Monstro</h3>
                                                        <p className="text-[10px] text-gray-500">Tabela D6 de Ataque.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Modelos Rápidos (Dragonbane)</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {MODELOS_AMEACAS_GENERICOS.map((modelo, idx) => (
                                                    <div key={idx} onClick={() => loadTemplate(modelo)} className={`border rounded p-3 cursor-pointer hover:shadow-md transition-all flex justify-between items-center bg-white ${modelo.type === 'pnj' ? 'border-blue-200' : 'border-red-200'}`}>
                                                        <div className="flex flex-col">
                                                            <span className={`text-[10px] font-bold uppercase ${modelo.type === 'pnj' ? 'text-blue-800' : 'text-red-800'}`}>{modelo.type === 'pnj' ? 'PNJ' : 'Monstro'}</span>
                                                            <span className="font-bold text-sm text-gray-900">{modelo.nome}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>, document.body
                        )}

                        {showDndModelModal && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 transition-opacity">
                                <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl border-2 border-[#922610] overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
                                    <div className="bg-[#922610] text-white p-3 flex justify-between items-center shrink-0">
                                        <div><h2 className="font-title font-bold text-lg">Criar em D&D 5e (2024)</h2><span className="text-[9px] uppercase font-bold tracking-widest text-orange-100">Novo sistema • em adaptação</span></div>
                                        <button onClick={() => setShowDndModelModal(false)} className="text-gray-400 hover:text-white text-2xl font-bold px-2 leading-none">&times;</button>
                                    </div>
                                    <div className="p-6 bg-gray-100 flex-1 overflow-y-auto space-y-6">
                                        {createTarget === 'pc' ? (
                                            <>
                                                <div>
                                                    <h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Ficha de Personagem (Em Branco)</h3>
                                                    <div onClick={() => loadTemplate(initialDndPcData)} className="bg-white border-2 border-gray-300 hover:border-orange-500 rounded p-4 cursor-pointer flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-orange-600 text-white rounded flex items-center justify-center shrink-0"><SVGIcons.User /></div>
                                                        <div><h3 className="font-bold text-sm">PC D&D 5e</h3><p className="text-xs text-gray-500">Ficha completa SRD</p></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Modelos Prontos (SRD 5.2)</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {MODELOS_DND_PC.map((modelo, idx) => (
                                                            <div key={idx} onClick={() => loadTemplate(modelo)} className="border rounded p-3 cursor-pointer hover:shadow-md flex justify-between items-center bg-white border-orange-200">
                                                                <div className="flex flex-col"><span className="text-[10px] font-bold uppercase text-orange-800">{modelo.bio.linhagem} {modelo.bio.classe}</span><span className="font-bold text-sm">{modelo.bio.nome}</span></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Stat Block D&D 5e (Em Branco)</h3>
                                                    <div onClick={() => loadTemplate(initialDndMonsterData)} className="bg-white border-2 border-gray-300 hover:border-[#922610] rounded p-4 cursor-pointer flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-[#922610] text-white rounded flex items-center justify-center shrink-0"><SVGIcons.Skull /></div>
                                                        <div><h3 className="font-bold text-sm">Bestiário D&D</h3><p className="text-xs text-gray-500">Crie seu monstro do zero</p></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-title font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">Modelos Prontos (SRD 5.2)</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {MODELOS_DND_AMEACA.map((modelo, idx) => (
                                                            <div key={idx} onClick={() => loadTemplate(modelo)} className="border rounded p-3 cursor-pointer hover:shadow-md flex justify-between items-center bg-white border-red-200">
                                                                <div className="flex flex-col"><span className="text-[10px] font-bold uppercase text-red-800">CR {modelo.desafio}</span><span className="font-bold text-sm">{modelo.nome}</span></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>, document.body
                        )}

                        {showCustomBgModal && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-3 sm:p-4 transition-opacity">
                                <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl border-2 border-dragon-dark overflow-hidden max-h-[92vh] flex flex-col">
                                    <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center shrink-0">
                                        <div>
                                            <h3 className="font-title font-bold text-lg">Tema Personalizado</h3>
                                            <p className="text-[10px] text-gray-300 mt-0.5">Monte um tema próprio e veja o resultado antes de aplicar.</p>
                                        </div>
                                        <button onClick={() => setShowCustomBgModal(false)} className="text-gray-300 hover:text-white text-2xl font-bold px-2" aria-label="Fechar tema personalizado">&times;</button>
                                    </div>

                                    <div className="overflow-y-auto p-4 sm:p-5 bg-gray-50">
                                        <div className="grid lg:grid-cols-[0.9fr_1.35fr] gap-4 items-start">
                                            <div className="space-y-4 lg:sticky lg:top-0">
                                                <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Prévia ao vivo</div>
                                                    <div
                                                        className="rounded-lg border-2 overflow-hidden shadow-md min-h-[180px] flex items-end p-3"
                                                        style={{
                                                            borderColor: customAccentColor,
                                                            backgroundColor: '#2b2b2b',
                                                            backgroundImage: customBgUrl ? `linear-gradient(rgba(0,0,0,${Math.max(0,Math.min(.85,Number(customOverlay)||0))}), rgba(0,0,0,${Math.max(0,Math.min(.85,Number(customOverlay)||0))})), url(${customBgUrl})` : 'linear-gradient(135deg,#4b5563,#111827)',
                                                            backgroundSize: customBgSize,
                                                            backgroundPosition: customBgPosition,
                                                            backgroundRepeat: customBgSize === 'auto' ? 'repeat' : 'no-repeat'
                                                        }}
                                                    >
                                                        <div className="w-full rounded-lg border shadow-lg overflow-hidden" style={{backgroundColor:customWinColor,color:customTextColor,borderColor:customAccentColor,opacity:Number(customOpacity),backdropFilter:`blur(${customBlur}px)`,WebkitBackdropFilter:`blur(${customBlur}px)`}}>
                                                            <div className="px-3 py-2 font-bold text-xs" style={{backgroundColor:customBarColor,color:readableTextColor(customBarColor)}}>PJ Lite • Exemplo</div>
                                                            <div className="p-3 space-y-2">
                                                                <div className="font-title font-bold text-sm" style={{color:customAccentColor}}>Nome do Personagem</div>
                                                                <div className="h-8 rounded border px-2 flex items-center text-[10px]" style={{borderColor:customAccentColor}}>Campo da ficha</div>
                                                                <div className="flex gap-2"><span className="px-2 py-1 rounded text-[9px] font-bold" style={{backgroundColor:customAccentColor,color:readableTextColor(customAccentColor)}}>Destaque</span><span className="text-[9px] self-center">Texto principal</span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[9px] text-gray-500 mt-2">A prévia é aproximada. Fichas de sistemas podem manter alguns elementos visuais próprios.</p>
                                                </div>

                                                <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
                                                    <div className="text-xs font-bold text-gray-800 mb-2">Estilos rápidos</div>
                                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                                                        <button type="button" onClick={()=>applyCustomPreset('claro')} className="border rounded py-2 hover:bg-gray-50">☀️ Claro</button>
                                                        <button type="button" onClick={()=>applyCustomPreset('escuro')} className="border rounded py-2 hover:bg-gray-50">🌙 Escuro</button>
                                                        <button type="button" onClick={()=>applyCustomPreset('pergaminho')} className="border rounded py-2 hover:bg-gray-50">📜 Pergaminho</button>
                                                        <button type="button" onClick={()=>applyCustomPreset('floresta')} className="border rounded py-2 hover:bg-gray-50">🌲 Floresta</button>
                                                        <button type="button" onClick={()=>applyCustomPreset('vinho')} className="border rounded py-2 hover:bg-gray-50 col-span-2">🍷 Vinho</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="rounded-lg border border-gray-300 bg-white p-4 space-y-3 shadow-sm">
                                                    <div><div className="text-xs font-bold text-gray-800">🖼️ Imagem de fundo</div><p className="text-[10px] text-gray-500 mt-0.5">Use uma imagem do dispositivo ou uma URL direta. Imagens enviadas são reduzidas antes de serem salvas.</p></div>
                                                    <label style={{backgroundColor:customBarColor,color:readableTextColor(customBarColor)}} className="cursor-pointer py-2 px-3 rounded block text-center font-bold text-xs shadow-sm">
                                                        <span className="inline-flex items-center justify-center gap-1"><SVGIcons.Upload/> Carregar imagem</span>
                                                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f=e.target.files[0]; e.target.value=''; if(!f)return; try { const img=await optimizeImageFile(f,1920,0.78); localStorage.setItem(CUSTOM_BG_KEY,img); setCustomBgUrl(img); setTheme('custom'); setCustomBgLink(''); showToast('Fundo otimizado e aplicado.'); } catch(err){ console.error(err); showToast('Não foi possível usar esta imagem. Tente uma imagem menor.'); } }} />
                                                    </label>
                                                    <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-gray-400"><span className="h-px bg-gray-300 flex-1"></span>ou URL<span className="h-px bg-gray-300 flex-1"></span></div>
                                                    <div className="flex gap-2">
                                                        <input type="url" value={customBgLink} onChange={e=>setCustomBgLink(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&customBgLink.trim()){const url=customBgLink.trim();try{localStorage.setItem(CUSTOM_BG_KEY,url);setCustomBgUrl(url);setTheme('custom');showToast('Imagem de fundo aplicada por URL!');}catch(err){console.error(err);showToast('Não foi possível salvar o fundo personalizado.');}}}} placeholder="https://site.com/imagem.jpg" className="flex-1 min-w-0 border rounded px-2 py-2 text-xs outline-none focus:border-gray-500" />
                                                        <button type="button" onClick={()=>{const url=customBgLink.trim();if(!url)return;try{localStorage.setItem(CUSTOM_BG_KEY,url);setCustomBgUrl(url);setTheme('custom');showToast('Imagem de fundo aplicada por URL!');}catch(err){console.error(err);showToast('Não foi possível salvar o fundo personalizado.');}}} className="bg-gray-800 hover:bg-black text-white px-3 rounded text-xs font-bold">Aplicar</button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <label className="text-[10px] font-bold text-gray-600">Encaixe<select value={customBgSize} onChange={e=>setCustomBgSize(e.target.value)} className="w-full mt-1 border rounded px-2 py-1.5 text-xs"><option value="cover">Preencher tela</option><option value="contain">Mostrar inteira</option><option value="auto">Tamanho original / repetir</option></select></label>
                                                        <label className="text-[10px] font-bold text-gray-600">Posição<select value={customBgPosition} onChange={e=>setCustomBgPosition(e.target.value)} className="w-full mt-1 border rounded px-2 py-1.5 text-xs"><option value="center">Centro</option><option value="top">Topo</option><option value="bottom">Base</option><option value="left">Esquerda</option><option value="right">Direita</option></select></label>
                                                    </div>
                                                    {customBgUrl && <button type="button" onClick={()=>{setCustomBgUrl('');setCustomBgLink('');try{localStorage.removeItem(CUSTOM_BG_KEY);}catch{}}} className="w-full border border-red-300 text-red-700 hover:bg-red-50 py-1.5 rounded text-[10px] font-bold">Remover imagem de fundo</button>}
                                                </div>

                                                <div className="rounded-lg border border-gray-300 bg-white p-4 space-y-3 shadow-sm">
                                                    <div><div className="text-xs font-bold text-gray-800">🎨 Cores</div><p className="text-[10px] text-gray-500 mt-0.5">Clique na amostra ou digite um código hexadecimal como <strong>#7f1d1d</strong>.</p></div>
                                                    <div className="grid sm:grid-cols-2 gap-3">
                                                        {[
                                                            ['Janelas',customWinColor,setCustomWinColor],
                                                            ['Barras',customBarColor,setCustomBarColor],
                                                            ['Destaque',customAccentColor,setCustomAccentColor],
                                                            ['Texto',customTextColor,setCustomTextColor]
                                                        ].map(([label,value,setter])=><div key={label} className="border rounded-lg p-2"><div className="text-[10px] font-bold text-gray-700 mb-1">{label}</div><div className="flex gap-2 items-center"><input type="color" value={value} onChange={e=>setter(e.target.value)} className="w-10 h-9 rounded cursor-pointer shrink-0"/><input key={value} defaultValue={value} onBlur={e=>{const v=e.target.value.trim();if(/^#[0-9a-fA-F]{6}$/.test(v))setter(v.toLowerCase());else e.target.value=value;}} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();}} className="min-w-0 w-full border rounded px-2 py-1.5 text-xs font-mono uppercase" aria-label={`Cor ${label}`}/></div></div>)}
                                                    </div>
                                                </div>

                                                <div className="rounded-lg border border-gray-300 bg-white p-4 space-y-4 shadow-sm">
                                                    <div className="text-xs font-bold text-gray-800">✨ Transparência e efeitos</div>
                                                    <div><div className="flex items-center justify-between mb-1"><label className="text-[10px] font-bold text-gray-700">Opacidade das janelas</label><span className="text-[10px] text-gray-500">{Math.round(Number(customOpacity)*100)}%</span></div><input type="range" min="0.45" max="1" step="0.05" value={customOpacity} onChange={e=>setCustomOpacity(e.target.value)} className="w-full"/></div>
                                                    <div><div className="flex items-center justify-between mb-1"><label className="text-[10px] font-bold text-gray-700">Escurecer fundo</label><span className="text-[10px] text-gray-500">{Math.round(Number(customOverlay)*100)}%</span></div><input type="range" min="0" max="0.65" step="0.05" value={customOverlay} onChange={e=>setCustomOverlay(e.target.value)} className="w-full"/></div>
                                                    <div><div className="flex items-center justify-between mb-1"><label className="text-[10px] font-bold text-gray-700">Desfoque das janelas</label><span className="text-[10px] text-gray-500">{customBlur}px</span></div><input type="range" min="0" max="18" step="1" value={customBlur} onChange={e=>setCustomBlur(e.target.value)} className="w-full"/></div>
                                                </div>

                                                <div className="grid sm:grid-cols-[1fr_1.3fr] gap-2">
                                                    <button type="button" onClick={()=>{applyCustomPreset('claro');setCustomBgPosition('center');setCustomBgSize('cover');}} className="border border-gray-300 hover:bg-white py-2.5 rounded font-bold text-xs">Restaurar aparência</button>
                                                    <button style={{backgroundColor:customBarColor,color:readableTextColor(customBarColor),borderColor:customAccentColor}} onClick={()=>{setTheme('custom');setShowCustomBgModal(false);}} className="w-full border py-2.5 rounded font-bold text-sm shadow">✓ Aplicar tema personalizado</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>, document.body
                        )}

                        {showGuideModal && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 transition-opacity">
                                <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl border-2 border-gray-800 overflow-hidden animate-fade-in-up flex flex-col">
                                    <div className="bg-gray-800 text-white p-3 flex justify-between items-center shrink-0">
                                        <div><h2 className="font-title font-bold text-lg uppercase">Guias e Tutoriais</h2><div className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">PJ Lite v0.7.0 Alpha</div></div>
                                        <button onClick={() => setShowGuideModal(false)} className="text-gray-400 hover:text-white text-2xl font-bold px-2">&times;</button>
                                    </div>
                                    <div className="flex bg-gray-200 border-b border-gray-300 shrink-0 overflow-x-auto">
                                        <button onClick={() => setGuideTab('inicio')} className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap ${guideTab === 'inicio' ? 'border-gray-800 text-gray-900 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-300'}`}>Começando</button>
                                        <button onClick={() => setGuideTab('import')} className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap ${guideTab === 'import' ? 'border-gray-800 text-gray-900 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-300'}`}>Salvar & Compartilhar</button>
                                        <button onClick={() => setGuideTab('fichas_db')} className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap ${guideTab === 'fichas_db' ? 'border-gray-800 text-gray-900 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-300'}`}>Fichas DB</button>
                                        <button onClick={() => setGuideTab('ameacas_db')} className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap ${guideTab === 'ameacas_db' ? 'border-gray-800 text-gray-900 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-300'}`}>Ameaças e PNJs</button>
                                        <button onClick={() => setGuideTab('dnd5e')} className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap ${guideTab === 'dnd5e' ? 'border-orange-600 text-orange-900 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-300'}`}>D&D 5e</button>
                                        <button onClick={() => setGuideTab('fabula')} className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap ${guideTab === 'fabula' ? 'border-teal-600 text-teal-900 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-300'}`}>Fabula Ultima</button>
                                        <button onClick={() => setGuideTab('som6')} className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase text-center border-b-4 transition-colors whitespace-nowrap ${guideTab === 'som6' ? 'border-red-900 text-red-950 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-300'}`}>Som das Seis</button>
                                    </div>
                                    <div className="p-6 bg-gray-50 text-sm text-gray-700 overflow-y-auto max-h-[70vh] scrollbar-thin">
                                        {guideTab === 'inicio' && (
                                            <div className="space-y-5">
                                                <div className="bg-slate-900 text-white rounded-lg p-5">
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1">Primeiros passos</div>
                                                    <h3 className="font-title font-bold text-xl mb-2">👋 Bem-vindo ao PJ Lite</h3>
                                                    <p className="text-sm text-slate-200">O PJ Lite é uma ficha digital para organizar personagens sem transformar a mesa em um programa complicado. Você pode preencher aos poucos, salvar no navegador e usar os guias abaixo sempre que tiver dúvida.</p>
                                                </div>
                                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4"><h3 className="font-bold text-emerald-900 mb-2">🧭 Caminho mais simples</h3><p className="text-xs"><strong>Novo Personagem → escolha o sistema → identidade → números principais → habilidades/equipamentos → Salvar.</strong> O restante pode ser preenchido quando realmente aparecer em jogo.</p></div>
                                                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4"><h3 className="font-bold text-sky-900 mb-2">🗺️ Como se orientar na interface</h3><div className="grid sm:grid-cols-3 gap-2 text-xs"><div><strong>Topo</strong><br/>Tema, guias, código e backup.</div><div><strong>Lista de fichas</strong><br/>Buscar, filtrar, favoritar, duplicar e abrir.</div><div><strong>Dentro da ficha</strong><br/>Abas, campos principais e recursos específicos do sistema.</div></div></div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="bg-white border rounded-lg p-4"><strong>1. Crie ou use um modelo</strong><p className="text-xs mt-1">Clique em <strong>Novo Personagem</strong> e escolha o sistema. Se houver um modelo pronto, use-o como exemplo para entender onde cada informação costuma ficar; depois altere o que precisar.</p></div>
                                                    <div className="bg-white border rounded-lg p-4"><strong>2. Preencha só o necessário primeiro</strong><p className="text-xs mt-1">Nome/conceito, atributos e recursos principais vêm antes de detalhes. Habilidades, magias, inventário e anotações podem ser completados aos poucos sem atrapalhar o uso da ficha.</p></div>
                                                    <div className="bg-white border rounded-lg p-4"><strong>3. Entenda onde seus dados ficam</strong><p className="text-xs mt-1">No computador, as fichas priorizam consulta lado a lado; no celular, algumas áreas viram abas. Procure sempre o título da seção antes de editar para evitar colocar a informação no campo errado.</p></div>
                                                    <div className="bg-white border rounded-lg p-4"><strong>4. Salve e faça backup</strong><p className="text-xs mt-1">O autosave ajuda, mas <strong>Salvar</strong> cria um ponto de histórico. Antes de trocar de computador, limpar o navegador ou fazer grandes mudanças, exporte também um ZIP/JSON.</p></div>
                                                    <div className="bg-white border rounded-lg p-4"><strong>5. Compartilhe sem complicação</strong><p className="text-xs mt-1"><strong>Ficha Chat</strong> gera um resumo legível; <strong>Código</strong> serve para importar a ficha em outro navegador; ZIP/JSON é a opção indicada para backup completo.</p></div>
                                                    <div className="bg-white border rounded-lg p-4"><strong>6. Use o guia do seu sistema</strong><p className="text-xs mt-1">As abas Dragonbane, D&D 5e, Fabula Ultima e Som das Seis explicam uma ordem de preenchimento própria e destacam os recursos especiais de cada ficha.</p></div>
                                                </div>
                                                <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 space-y-2">
                                                    <h3 className="font-bold text-amber-900">🧭 Se você nunca jogou RPG</h3>
                                                    <p className="text-xs">Uma ficha é o resumo do seu personagem. <strong>Atributos</strong> representam capacidades gerais; <strong>perícias</strong> mostram coisas que ele sabe fazer; <strong>PV</strong> normalmente acompanham sua resistência; habilidades, poderes e magias descrevem recursos especiais. Cada sistema usa esses conceitos de uma forma diferente, então consulte a aba específica do jogo que estiver usando.</p>
                                                    <p className="text-xs">O PJ Lite ajuda a <strong>registrar e consultar</strong> essas informações. Ele não substitui o livro de regras nem decide automaticamente tudo que acontece em jogo.</p>
                                                </div>
                                                <div className="bg-white border rounded-lg p-4">
                                                    <h3 className="font-bold text-gray-900 mb-2">🖱️ O que cada botão principal faz?</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                        <div><strong>Novo Personagem:</strong> cria uma nova ficha.</div><div><strong>Temas:</strong> muda somente a aparência do PJ Lite.</div>
                                                        <div><strong>Colar Código:</strong> importa uma ficha compartilhada como texto.</div><div><strong>ZIP/JSON:</strong> importa backups em arquivo.</div>
                                                        <div><strong>★ Favorito:</strong> facilita encontrar fichas importantes.</div><div><strong>⚙ Filtros:</strong> filtra por sistema e muda a ordenação.</div>
                                                        <div><strong>💬 Ficha Chat:</strong> copia a ficha em um formato legível.</div><div><strong>🕘 Histórico:</strong> recupera versões salvas anteriormente.</div>
                                                    </div>
                                                </div>
                                                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4"><strong className="text-sky-900">Dica para iniciantes:</strong><p className="text-xs mt-1">Se surgir um aviso de <strong>Revisão rápida</strong>, ele é apenas um lembrete de campos importantes que talvez tenham ficado vazios. Você ainda pode continuar usando a ficha normalmente.</p></div>
                                            </div>
                                        )}

                                        {guideTab === 'import' && (
                                            <div className="space-y-5">
                                                <div className="bg-blue-50 border border-blue-200 rounded p-4"><h3 className="font-title font-bold text-blue-900 mb-2">💾 Salvar, fazer backup e compartilhar</h3><p className="text-xs">Existem formas diferentes de guardar a mesma ficha. Para quem está começando, a regra mais simples é: <strong>Salvar</strong> para o uso diário, <strong>ZIP/JSON</strong> para backup e <strong>Código</strong> para mandar rapidamente uma ficha para outra pessoa.</p></div>
                                                <div className="bg-white border rounded p-4 space-y-2"><h3 className="font-bold text-gray-900">1. Salvar no navegador</h3><p>O botão <strong>Salvar</strong> guarda a ficha no armazenamento local do navegador. O autosave também tenta registrar alterações enquanto você edita.</p><p className="text-xs text-gray-500"><strong>Importante:</strong> dados locais não são uma nuvem. Limpar os dados do navegador, usar modo anônimo ou trocar de computador pode fazer a ficha deixar de aparecer naquele dispositivo.</p></div>
                                                <div className="bg-white border rounded p-4 space-y-2"><h3 className="font-bold text-gray-900">2. ZIP/JSON: sua cópia de segurança</h3><p>Use o backup em arquivo antes de formatar o computador, limpar o navegador ou fazer mudanças importantes. Guarde uma cópia em um local que você reconheça.</p><p className="text-xs"><strong>Para importar:</strong> use o botão ZIP/JSON e escolha o arquivo JSON compatível. Depois confira se nome, sistema e dados principais apareceram corretamente.</p></div>
                                                <div className="bg-white border rounded p-4 space-y-2"><h3 className="font-bold text-gray-900">3. Código: compartilhamento rápido</h3><p>O Código transforma a ficha em uma sequência de texto. É útil para enviar pelo chat e importar em outro navegador.</p><p className="text-xs text-gray-500">Retratos não entram no código compacto, para evitar textos gigantes. Se a imagem for importante, prefira backup em arquivo.</p></div>
                                                <div className="bg-white border rounded p-4 space-y-2"><h3 className="font-bold text-gray-900">4. Ficha Chat: mostrar, não importar</h3><p>A Ficha Chat cria uma versão legível para Discord, Telegram, WhatsApp ou anotações. Ela serve para <strong>consulta</strong>, não para restaurar uma ficha.</p><p className="text-xs">Você pode escolher <strong>Completa</strong>, <strong>Simples</strong>, <strong>Resumida</strong> ou <strong>Habilidades & Magias</strong>, dependendo do que o grupo precisa ver.</p></div>
                                                <div className="bg-amber-50 border border-amber-300 rounded p-4"><h3 className="font-bold text-amber-900 mb-2">✅ Rotina segura recomendada</h3><p className="text-xs">Durante a sessão: salve normalmente. Depois de mudanças importantes: salve novamente. De tempos em tempos: faça um backup em arquivo e guarde fora do navegador.</p></div>
                                            </div>
                                        )}

                                        {guideTab === 'fichas_db' && (
                                            <div className="space-y-5">
                                                <div className="bg-emerald-50 border border-emerald-200 rounded p-4"><h3 className="font-title font-bold text-emerald-900 mb-2">🐉 Dragonbane — personagem passo a passo</h3><p>Se for sua primeira ficha, siga a ordem abaixo. Você não precisa preencher tudo de uma vez: comece pelo conceito, depois números e por último equipamento.</p></div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="bg-white border rounded p-4"><strong>1. Conceito</strong><p className="text-xs mt-1">Preencha Nome, Jogador, Ancestralidade, Profissão, Idade e Fraqueza. Escreva uma Aparência curta e escolha um Memento que ajude a lembrar quem esse personagem é.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>2. Atributos</strong><p className="text-xs mt-1">Defina FOR, CON, AGL, INT, VON e CAR. Depois confira Movimento, Sobrecarga, PV, PD e os Dados de Bônus. Se fizer ajustes manuais, use “manter derivados”.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>3. Perícias</strong><p className="text-xs mt-1">Marque as perícias treinadas e confira os valores atuais. Faça o mesmo para perícias de armas e secundárias quando existirem.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>4. Combate</strong><p className="text-xs mt-1">Cadastre armas, dano, traços, armadura e elmo. Isso deixa a parte que você mais consulta durante a sessão pronta para usar.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>5. Habilidades e Magias</strong><p className="text-xs mt-1">Adicione uma entrada para cada habilidade ou magia. Coloque nome, descrição e custo em PD/Nível quando aplicável.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>6. Inventário</strong><p className="text-xs mt-1">Finalize com moedas, equipamentos, consumíveis e itens miúdos. Salve a ficha e gere a Ficha Chat se quiser consultar pelo celular.</p></div>
                                                </div>
                                                <div className="bg-white border rounded p-4 space-y-2"><h3 className="font-bold text-gray-900">📘 Como ler a ficha durante o jogo</h3><p className="text-xs">No PC, pense na ficha em três zonas: <strong>esquerda</strong> para PV/PD, morte, combate e inventário; <strong>centro</strong> para Perícias e Perícias de Armas lado a lado; <strong>direita</strong> para Habilidades & Magias. Isso reduz o vai-e-volta durante a sessão.</p><p className="text-xs">Quando o Mestre pedir um teste, procure primeiro a perícia e o atributo associado. Em combate, mantenha à vista PV, PD, armadura, movimento e a arma usada. O botão <strong>Alternar Ordem</strong> troca Perícias e Armas se você preferir outra leitura.</p><p className="text-xs text-gray-500">No celular, as abas mantêm essas mesmas informações em grupos menores.</p></div>
                                                <div className="bg-emerald-50 border border-emerald-200 rounded p-4"><h3 className="font-bold text-emerald-900 mb-2">🌱 Primeiro personagem?</h3><p className="text-xs">Se estiver inseguro, use um modelo pronto e compare campo por campo com o livro. Depois duplique a ficha e altere nome, profissão, atributos, perícias e equipamento. Isso ajuda a aprender a estrutura sem começar de uma tela totalmente vazia.</p></div>
                                                <div className="p-4 bg-gray-100 border rounded"><h3 className="font-title font-bold mb-2">Material oficial de Dragonbane</h3><p className="text-xs mb-3">O PJ Lite é uma ferramenta independente e não substitui o livro de regras.</p><a href="https://triaeditora.com.br/loja/d20/dragonbane-livro-de-regras-pdf/" target="_blank" rel="noopener noreferrer" className="inline-block bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2 rounded font-bold text-xs">Obter o PDF oficial na Tria Editora ↗</a></div>
                                            </div>
                                        )}

                                        {guideTab === 'ameacas_db' && (
                                            <div className="space-y-5">
                                                <div className="bg-gray-900 text-white rounded p-4">
                                                    <h3 className="font-title font-bold text-base mb-1">Guia de Ameaças, PNJs e Bestiário</h3>
                                                    <p className="text-xs text-gray-200">Esta aba reúne as ameaças e personagens do Mestre dos sistemas disponíveis. Dragonbane usa PNJs e monstros; D&D 5e usa blocos de estatísticas; Fabula Ultima usa Ameaças/PNJs; O Som das Seis usa PDJs. Escolha primeiro o sistema e depois preencha apenas o que realmente será consultado em mesa.</p>
                                                </div>

                                                <div className="bg-emerald-50 border border-emerald-200 rounded p-4 space-y-3">
                                                    <h3 className="font-title font-bold text-emerald-900">🐉 Dragonbane — PNJs</h3>
                                                    <p>Use <strong>PNJ</strong> para aliados, rivais, guardas, comerciantes e outros personagens controlados pelo Mestre. A ficha permite registrar nome, ancestralidade, profissão, PV, PD, movimento, dano bônus, armadura, perícias, feitiços, armas, equipamento, atitude, motivação e um traço marcante.</p>
                                                    <p className="text-xs"><strong>Dica:</strong> os modelos rápidos servem como ponto de partida. Depois de criar o PNJ, personalize apenas o que realmente será importante em jogo; não é necessário preencher cada campo para um personagem secundário simples.</p>
                                                </div>

                                                <div className="bg-emerald-50 border border-emerald-200 rounded p-4 space-y-3">
                                                    <h3 className="font-title font-bold text-emerald-900">🐲 Dragonbane — Monstros</h3>
                                                    <p>Use <strong>Ameaça/Monstro</strong> para criaturas que seguem as regras de monstros de Dragonbane. Os campos principais são <strong>Ferocidade, Tamanho, Movimento, Armadura e PV</strong>, além de habilidades especiais e da tabela de ataques.</p>
                                                    <p><strong>Ferocidade</strong> indica quantas vezes o monstro pode agir na rodada: para cada ponto de Ferocidade, ele recebe uma iniciativa e, portanto, um turno com ação e movimento. Aumentar ou diminuir Ferocidade e PV é uma forma direta de ajustar o perigo da criatura.</p>
                                                    <p>A seção <strong>Ataques do Monstro</strong> possui seis resultados. Durante o combate, role <strong>1D6</strong> para selecionar um ataque da tabela. Registre no texto o alvo, alcance, dano, condição e se o ataque pode ser esquivado ou aparado quando isso for relevante.</p>
                                                </div>

                                                <div className="bg-orange-50 border border-orange-200 rounded p-4 space-y-3">
                                                    <h3 className="font-title font-bold text-[#922610]">🐉 D&D 5e — Bloco de Estatísticas</h3>
                                                    <p>Em D&D, crie a criatura pela opção <strong>Bestiário/Ameaça</strong>. Comece com <strong>Nome, Tamanho, Tipo, Alinhamento, CA, PV e Deslocamento</strong>. Depois defina os seis atributos: FOR, DES, CON, INT, SAB e CAR.</p>
                                                    <p>Preencha somente quando necessário <strong>Testes de Resistência, Perícias, Vulnerabilidades, Resistências, Imunidades, Sentidos e Idiomas</strong>. Esses campos representam exceções e capacidades especiais do monstro e podem ficar vazios quando não se aplicarem.</p>
                                                    <p><strong>Desafio (CR)</strong> representa aproximadamente o nível de ameaça da criatura e também está relacionado ao bônus de proficiência. Use o campo de XP junto do CR conforme a referência da criatura que estiver adaptando.</p>
                                                    <p>Em seguida, use as listas de <strong>Traços, Ações, Ações Bônus, Reações e Ações Lendárias</strong>. Cada entrada deve ter um nome curto e uma descrição suficiente para ser usada diretamente durante o combate.</p>
                                                </div>

                                                <div className="bg-teal-50 border border-teal-300 rounded p-4 space-y-3">
                                                    <h3 className="font-title font-bold text-teal-900">✨ Fabula Ultima — Ameaças e PNJs</h3>
                                                    <p>Comece por <strong>Nome, Nível, Patente e Espécie</strong>. Depois defina Traços, DES/AST/VIG/VON, PV, PM, Iniciativa, Defesa e Defesa Mágica.</p>
                                                    <p>Em <strong>Afinidades</strong>, registre Vulnerabilidade, Resistência, Imunidade ou Absorção quando existirem. Em seguida adicione Ataques Básicos, Feitiços, Poderes, Outras Ações e Regras Especiais.</p>
                                                    <p className="text-xs"><strong>Vilões:</strong> use o campo de Pontos de Ultima quando o antagonista funcionar como vilão. Para criar rápido, comece com um modelo e ajuste o nível, atributos e poderes conforme a função do inimigo.</p>
                                                </div>

                                                <div className="bg-amber-50 border border-amber-300 rounded p-4 space-y-2"><h3 className="font-bold text-amber-900">🌱 Se é sua primeira vez como Mestre</h3><p className="text-xs">Você não precisa criar cada inimigo do zero. Use um modelo, altere apenas os números e habilidades que realmente aparecerão na cena e teste a criatura em um encontro simples. Para personagens secundários, uma ficha curta costuma ser mais fácil de administrar do que uma ficha cheia.</p><p className="text-xs">Nomeie habilidades de forma clara e escreva efeitos de modo que você consiga entendê-los rapidamente no meio do combate.</p></div>
                                                <div className="bg-white border rounded p-4">
                                                    <h3 className="font-bold text-gray-900 mb-2">✅ Fluxo rápido recomendado</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                                        <div className="border rounded p-3"><strong>Dragonbane</strong><br/>1. Escolha PNJ ou Monstro.<br/>2. Defina os valores básicos.<br/>3. Adicione perícias/habilidades.<br/>4. Registre armas ou a tabela D6.<br/>5. Salve e teste em combate.</div>
                                                        <div className="border rounded p-3"><strong>D&D 5e</strong><br/>1. Defina identidade, CA, PV e movimento.<br/>2. Preencha atributos e CR.<br/>3. Adicione resistências e sentidos úteis.<br/>4. Cadastre traços e ações.<br/>5. Confira o bloco final antes de salvar.</div>
                                                        <div className="border rounded p-3"><strong>Fabula Ultima</strong><br/>1. Nome, nível, patente e espécie.<br/>2. Atributos e recursos/defesas.<br/>3. Abra “Descrição, Traços & Afinidades” e marque só o necessário.<br/>4. Cadastre ataques visíveis; reordene com ↑/↓.<br/>5. Feitiços, Poderes, Outras Ações e Regras Especiais ficam recolhíveis e também podem ser ordenados.</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {guideTab === 'dnd5e' && (
                                            <div className="space-y-5">
                                                <div className="bg-orange-50 border border-orange-300 rounded p-4"><div className="text-[10px] font-bold uppercase text-orange-700 mb-1">D&D 5e (2024) • em adaptação</div><h3 className="font-title font-bold text-[#922610] mb-2">🐲 Personagem passo a passo</h3><p>Siga esta ordem para não se perder entre os muitos campos da ficha.</p></div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="bg-white border rounded p-4"><strong>1. Identidade</strong><p className="text-xs mt-1">Nome, Jogador, Classe, Nível, Espécie/Linhagem e Antecedente. Você também pode adicionar o retrato por Upload ou URL.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>2. Atributos</strong><p className="text-xs mt-1">Preencha FOR, DES, CON, INT, SAB e CAR. A ficha calcula os modificadores. Depois marque resistências e níveis de proficiência nas perícias.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>3. Combate</strong><p className="text-xs mt-1">Informe CA, Iniciativa, Deslocamento, PV, PV temporários, Dados de Vida e Testes de Morte. A ficha também guarda Inspiração e Percepção Passiva. Adicione ataques manualmente ou sincronize uma arma do inventário.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>4. Características</strong><p className="text-xs mt-1">Cadastre talentos, habilidades de classe e traços de espécie separadamente para ficar fácil consultar durante o jogo.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>5. Magias</strong><p className="text-xs mt-1">Se o personagem conjura, registre Habilidade Chave, CD do TR e Bônus de Ataque de Magia. Depois configure os espaços de 1º a 9º nível e adicione as magias com nome, nível e descrição.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>6. Equipamento & Itens Sincronizados</strong><p className="text-xs mt-1">Use Itens Sincronizados para nome, quantidade e tipo. Se o item for uma Arma, marque <strong>↔ Ataques</strong>: nome, bônus e dano ficam ligados à lista de Ataques em dois sentidos. O inventário livre continua disponível para anotações e itens que você prefere registrar como texto.</p></div>
                                                </div>
                                                <div className="bg-white border rounded p-4"><h3 className="font-bold text-gray-900 mb-2">🧭 Ordem prática para jogar rápido</h3><p className="text-xs"><strong>Identidade → Atributos → Perícias/Salvaguardas → CA/PV → Ataques → Recursos de classe → Magias (se houver) → Equipamento.</strong> Você não precisa preencher uma área de magia para um personagem que não conjura.</p></div>
                                                <div className="bg-red-50 border border-red-200 rounded p-4"><h3 className="font-bold text-red-900 mb-2">↔ Como funciona a sincronização de armas</h3><p className="text-xs">Crie um item, escolha o tipo <strong>Arma</strong> e ative <strong>↔ Ataques</strong>. O PJ Lite cria um ataque ligado a esse item. Se você mudar nome, bônus, dano ou tipo de dano no inventário, o ataque acompanha; se editar o ataque, o item também acompanha. Desativar a opção ou apagar um dos vínculos não apaga o restante do inventário.</p></div>
                                                <div className="bg-white border rounded p-4 space-y-2"><h3 className="font-bold text-gray-900">📘 Para não se perder em D&D</h3><p className="text-xs">A ficha tem muitos números, mas durante a maior parte do jogo você consulta poucas áreas: modificadores de atributos, perícias, CA, PV, ataques e recursos da classe. Magias e características ficam como referência quando forem usadas.</p><p className="text-xs"><strong>Proficiência:</strong> quando um campo indicar que o personagem é proficiente, registre isso na ficha em vez de tentar memorizar. <strong>PV temporários</strong> ficam separados dos PV normais e <strong>Dados de Vida</strong> também possuem campo próprio.</p></div>
                                                <div className="bg-orange-50 border border-orange-200 rounded p-4"><h3 className="font-bold text-[#922610] mb-2">🌱 Dica para a primeira ficha</h3><p className="text-xs">Preencha primeiro o que sua classe realmente usa. Um personagem sem magia pode deixar a área de magias de lado; um conjurador pode preencher primeiro as magias mais usadas e completar o restante depois.</p></div>
                                                <div className="p-4 bg-orange-50 border border-orange-300 rounded"><h3 className="font-title font-bold text-[#922610] mb-2">D&D 5e / SRD 5.2</h3><p className="text-xs">A implementação está em adaptação contínua. O PJ Lite não é um produto oficial da Wizards of the Coast.</p></div>
                                            </div>
                                        )}

                                        {guideTab === 'fabula' && (
                                            <div className="space-y-5">
                                                <div className="bg-teal-50 border border-teal-300 rounded p-4"><div className="text-[10px] font-bold uppercase text-teal-700 mb-1">v0.7.0 Alpha • recursos modulares</div><h3 className="font-title font-bold text-teal-900 mb-2">✨ Fabula Ultima — personagem passo a passo</h3><p>A ficha foi organizada para funcionar como um menu de JRPG. Ao criar o personagem, escolha primeiro quais livros ele usará; o PJ Lite libera somente os módulos compatíveis, mantendo o restante escondido.</p></div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="bg-white border rounded p-4"><strong>1. Escolha os materiais</strong><p className="text-xs mt-1">Na criação da ficha, o <strong>Livro Básico</strong> fica sempre ativo. Marque Natural Fantasy, High Fantasy, Techno Fantasy e/ou Codex Extra apenas se este personagem usar opções desses livros. Você pode mudar isso depois em <strong>＋ Fichas Extras</strong>; os ícones ao lado das abas mostram rapidamente quais materiais estão ativos. <strong>Arcanos pertencem ao Livro Básico</strong>, então essa ficha extra continua disponível mesmo sem selecionar suplementos.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>2. Atributos & condições</strong><p className="text-xs mt-1">Escolha os dados de DES, AST, VIG e VON. O formato visual acompanha d6/d8/d10/d12; <strong>Base</strong> representa o dado normal e <strong>Atual</strong> o valor temporário. Marque condições somente quando estiverem ativas.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>3. Recursos & defesas</strong><p className="text-xs mt-1">Preencha PV, PM, PI, Pontos de Fabula, Defesa, Defesa Mágica, Iniciativa, Nível, EXP e Zênites. Esses são os campos que você mais consulta durante a sessão.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>4. Equipamentos & PI</strong><p className="text-xs mt-1">Registre itens equipados e use a Mochila para o restante. A <strong>Consulta rápida de PI</strong> lembra os consumíveis comuns sem misturar PI com o inventário físico.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>5. Classes, poderes e ordem</strong><p className="text-xs mt-1">Adicione cada Classe, nível e benefícios. Poderes e Poderes Heroicos podem ser <strong>reordenados com ↑/↓</strong> e, em telas largas, aparecem em duas colunas para reduzir o tamanho da ficha.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>6. Extras só quando precisar</strong><p className="text-xs mt-1">Em <strong>＋ Fichas Extras</strong>, aparecem apenas os módulos liberados pelos materiais escolhidos. Natural Fantasy pode liberar Jardim, Receitas, Invocações, Comércio, Acampamento e Materiais; outros Atlas liberam seus próprios módulos. Ocultar um extra não apaga seus dados.</p></div>
                                                </div>
                                                <div className="bg-white border rounded p-4 space-y-2"><h3 className="font-bold text-gray-900">🧭 Ordem rápida para uma ficha nova</h3><p className="text-xs">Materiais → Conceito → Atributos → PV/PM/PI → Classes → Equipamento → Extras necessários → Laços → Revisão → Salvar.</p><p className="text-xs text-gray-500">Se estiver aprendendo o sistema, os modelos prontos são uma boa referência de como os campos se conectam.</p></div>
                                                <div className="bg-white border rounded p-4 space-y-2"><h3 className="font-bold text-gray-900">📘 Entendendo os recursos principais</h3><p className="text-xs"><strong>PV</strong> acompanham a condição física do personagem, <strong>PM</strong> alimentam várias capacidades e <strong>PI</strong> representam uma reserva abstrata de consumíveis e utilidades. A ficha mantém esses valores separados para que você possa atualizar apenas o recurso usado.</p><p className="text-xs"><strong>Pontos de Fabula</strong>, nível, EXP e Zênites têm funções diferentes; evite colocar tudo no mesmo campo ou usar PI como inventário comum.</p></div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><div className="bg-violet-50 border border-violet-200 rounded p-4"><h3 className="font-bold text-violet-900 mb-2">🔮 Magia & Rituais</h3><p className="text-xs">Escreva as <strong>Disciplinas</strong> livremente no campo superior. Nos feitiços, registre PM, Alvos, Duração e efeito; marque <strong>⚡ Ofensivo</strong> quando houver Teste de Magia. A ficha mantém consultas rápidas de conjuração e rituais e permite reordenar feitiços/rituais com ↑/↓.</p></div><div className="bg-cyan-50 border border-cyan-200 rounded p-4"><h3 className="font-bold text-cyan-900 mb-2">👾 Ameaças / PNJs</h3><p className="text-xs">A ficha de ameaça usa blocos separados para identidade, atributos, recursos/defesas, afinidades e ataques. Feitiços, Poderes, Outras Ações e Regras Especiais ficam recolhíveis e podem ser reordenados, mantendo a leitura próxima de um stat block sem esconder campos importantes.</p></div></div>
                                                <div className="bg-teal-50 border border-teal-200 rounded p-4"><h3 className="font-bold text-teal-900 mb-2">📚 Materiais e módulos</h3><p className="text-xs mb-2">O <strong>Livro Básico</strong> fica sempre ativo e mantém Arcanos, Magia & Rituais, Projetos e os recursos centrais. Suplementos apenas liberam módulos adicionais; desmarcar um livro esconde os módulos exclusivos sem apagar o que você já preencheu.</p><div className="grid sm:grid-cols-2 gap-2 text-[11px]"><div className="border rounded p-2 bg-white"><strong>🌿 Natural Fantasy</strong><br/>Acampamento, Jardim, Receitas, Invocações, Comércio e Materiais/Fabricação.</div><div className="border rounded p-2 bg-white"><strong>✨ High Fantasy</strong><br/>Poderes Zero e opções avançadas ligadas às classes e peculiaridades.</div><div className="border rounded p-2 bg-white"><strong>⚙️ Techno Fantasy</strong><br/>Tecnosferas, Mnemosfera e módulos tecnológicos/veiculares.</div><div className="border rounded p-2 bg-white"><strong>🩸 Codex Extra</strong><br/>Recursos especializados para classes e opções adicionais.</div></div></div><div className="bg-amber-50 border border-amber-200 rounded p-4"><h3 className="font-bold text-amber-900 mb-2">🛠️ Projetos de Inventor</h3><p className="text-xs">Projetos pertencem ao conjunto base da ficha. O módulo registra invenção, custo material, progresso, material especial e defeito. A consulta rápida serve de apoio, mas as decisões finais continuam pertencendo ao Mestre.</p></div>
                                                <div className="p-4 bg-teal-50 border border-teal-300 rounded"><h3 className="font-title font-bold text-teal-900 mb-2">Material oficial de Fabula Ultima</h3><p className="text-xs mb-3">O PJ Lite é uma ferramenta independente e não substitui o Livro Básico. Consulte as regras completas e apoie a publicação oficial brasileira:</p><a href="https://jamboeditora.com.br/produto/fabula-ultima-livro-basico/" target="_blank" rel="noopener noreferrer" className="inline-block bg-teal-800 hover:bg-teal-700 text-white px-4 py-2 rounded font-bold text-xs">Obter Fabula Ultima — Livro Básico na Jambô ↗</a></div>
                                            </div>
                                        )}

                                        {guideTab === 'som6' && (
                                            <div className="space-y-5">
                                                <div className="bg-[#f8edd7] border border-red-900 rounded p-4"><div className="text-[10px] font-bold uppercase text-red-800 mb-1">v0.7.0 Alpha • integração consolidada</div><h3 className="font-title font-bold text-red-950 mb-2">🤠 O Som das Seis — guia rápido e completo</h3><p className="text-xs">A ficha foi pensada para manter a consulta rápida do sistema: quase tudo fica em uma única tela, enquanto a Montaria permanece em aba própria. Comece pelo essencial e complete detalhes conforme eles realmente entrarem em jogo.</p></div>
                                                <div className="bg-amber-50 border border-amber-300 rounded p-4"><h3 className="font-bold text-amber-950 mb-2">🧭 Ordem recomendada</h3><p className="text-xs"><strong>Conceito → Atributos → Antecedentes → Vida/Defesa/Iniciativa → Tormento → Habilidades → Equipamento → Reputação/Cartas de Sina → Montaria (se houver) → Salvar.</strong></p></div>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    <div className="bg-white border rounded p-4"><strong>1. Conceito & retrato</strong><p className="text-xs mt-1">Preencha nome, jogador, apelido, aparência e passado. O retrato aceita Upload ou URL. Não precisa escrever uma biografia longa: uma ou duas ideias fortes já ajudam a interpretar o personagem.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>2. Atributos</strong><p className="text-xs mt-1">Físico, Agilidade, Intelecto e Coragem ficam em marcadores visuais. Clique nos pontos para ajustar rapidamente e use os valores definidos pela criação do personagem.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>3. Antecedentes</strong><p className="text-xs mt-1">Combate, Labuta, Negócios, Montaria, Tradição, Exploração, Roubo e Medicina registram experiências anteriores. No 1º nível, distribua <strong>4 pontos</strong>, com máximo de 2 em um mesmo Antecedente.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>4. Recursos principais</strong><p className="text-xs mt-1">Vida, Defesa, Iniciativa, Ações, Dinheiro, Recompensa, Nível e XP ficam editáveis. O PJ Lite evita automações rígidas para não impedir ajustes da Juíza ou regras da mesa.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>5. Tormento</strong><p className="text-xs mt-1">Escolha o tipo e descreva de forma curta como ele afeta a personagem. Pense no Tormento como algo que pode entrar em cena e complicar decisões, não apenas como texto de fundo.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>6. Habilidades</strong><p className="text-xs mt-1">No 1º nível, registre as duas Habilidades iniciais. Na v0.7 elas aparecem em <strong>duas colunas no desktop</strong> quando houver espaço e podem ser reorganizadas com <strong>↑/↓</strong>. Escreva o gatilho e o efeito em poucas linhas.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>7. Equipamento</strong><p className="text-xs mt-1">Nas armas, registre dano, munição, recarga e modificações importantes. Outros itens ficam logo abaixo. Priorize o que precisa ser consultado durante a sessão.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>8. Reputação & Cartas de Sina</strong><p className="text-xs mt-1">Reputação guarda valor e título. As Cartas de Sina possuem dois espaços por sessão e podem ser marcadas como usadas, evitando perder o controle no meio da cena.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>9. Montaria</strong><p className="text-xs mt-1">Ative somente se o personagem realmente tiver uma montaria. Potência e Vigor são marcados pelos quadrados clicáveis da ficha; Vida, Defesa, Dano e Fidelidade podem ser anotados normalmente. A aba também registra tipo, itens carregados e observações.</p></div>
                                                    <div className="bg-white border rounded p-4"><strong>10. Salvar e compartilhar</strong><p className="text-xs mt-1">Use <strong>Salvar</strong> para criar histórico, <strong>Ficha Chat</strong> para mandar um resumo ao grupo e ZIP/JSON para backup completo.</p></div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-3"><div className="bg-white border rounded p-4 space-y-2"><h3 className="font-bold text-gray-900">📈 Progressão</h3><p className="text-xs">A consulta rápida mantém os marcos de XP e bônus em um bloco recolhível, deixando a ficha limpa quando você não precisa consultá-los.</p></div><div className="bg-red-50 border border-red-200 rounded p-4"><h3 className="font-bold text-red-950 mb-2">☠ PDJs</h3><p className="text-xs">Escolha NP 1–6 e registre apenas PV, Defesa, Ações, bônus, armas, habilidades e notas necessárias. A proposta é funcionar como bloco rápido da Juíza, não como uma segunda ficha de personagem completa.</p></div></div>
                                                <div className="p-4 bg-[#f8edd7] border border-red-900 rounded"><h3 className="font-title font-bold text-red-950 mb-2">Material original de O Som das Seis</h3><p className="text-xs mb-3">O PJ Lite é uma ferramenta independente e não substitui o livro. Consulte o material original para regras completas e exemplos:</p><a href="https://www.rpgplanet.com.br/o-som-das-seis" target="_blank" rel="noopener noreferrer" className="inline-block bg-red-900 hover:bg-red-950 text-amber-50 px-4 py-2 rounded font-bold text-xs">Abrir página oficial de O Som das Seis ↗</a></div>
                                                <div className="bg-stone-100 border rounded p-4 text-xs"><strong>Crédito das regras:</strong> O Som das Seis, por Ramon Mineiro. O livro informa que as regras estão sob Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional. Esta ficha é uma adaptação independente no PJ Lite.</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>, document.body
                        )}

                        {codeModal.isOpen && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 transition-opacity">
                                <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg border-2 border-dragon-dark overflow-hidden animate-fade-in-up">
                                    <div style={getBarStyle()} className="bg-dragon-dark text-white p-3 flex justify-between items-center border-b border-gray-700">
                                        <h2 className="font-title font-bold text-lg uppercase tracking-wide">
                                            {codeModal.mode === 'export' ? 'Código da Ficha (Exportar)' : 'Importar Ficha via Código'}
                                        </h2>
                                        <button onClick={() => setCodeModal({ isOpen: false, mode: 'export', code: '' })} className="text-gray-400 hover:text-white text-2xl font-bold px-2 leading-none">&times;</button>
                                    </div>
                                    <div className="p-6 bg-gray-100 flex flex-col gap-4">
                                        {codeModal.mode === 'export' ? (
                                            <>
                                                <p className="text-xs text-gray-600 font-bold">Copie o código abaixo e envie para seu grupo ou mestre.</p>
                                                <textarea readOnly value={codeModal.code} className="w-full h-32 border-2 border-gray-300 rounded p-2 text-xs font-mono bg-white outline-none resize-none break-all" onFocus={(e) => e.target.select()}></textarea>
                                                <div className="flex justify-end gap-2"><button onClick={copyToClipboard} className="bg-dragon-dark hover:bg-black text-white px-4 py-2 rounded font-bold shadow flex items-center gap-1"><SVGIcons.Copy /> Copiar</button></div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-xs text-gray-600 font-bold">Cole abaixo o código de texto compactado da ficha.</p>
                                                <textarea value={codeModal.code} onChange={e => setCodeModal({...codeModal, code: e.target.value})} placeholder="Cole a string longa aqui..." className="w-full h-32 border-2 border-gray-300 rounded p-2 text-xs font-mono bg-white outline-none resize-none break-all"></textarea>
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setCodeModal({ isOpen: false, mode: 'export', code: '' })} className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-bold shadow">Cancelar</button>
                                                    <button onClick={handleCodeImport} className="bg-dragon-dark text-white px-4 py-2 rounded font-bold shadow flex items-center gap-1"><SVGIcons.Download /> Importar</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>, document.body
                        )}
                        {chatModal.isOpen && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 z-[320] flex items-center justify-center p-4 no-print">
                                <div className="bg-white text-gray-900 rounded-lg shadow-2xl border-2 border-gray-700 w-full max-w-md overflow-hidden">
                                    <div className="bg-gray-900 text-white p-3 flex justify-between items-center"><div><h3 className="font-title font-bold">💬 Ficha Chat</h3><p className="text-[10px] text-gray-300">Escolha um formato pronto para copiar.</p></div><button onClick={()=>setChatModal({...chatModal,isOpen:false})} className="text-2xl">×</button></div>
                                    <div className="p-4 space-y-2">
                                        {Object.entries(CHAT_MODES).map(([id,opt])=><button type="button" key={id} onClick={()=>setChatModal({...chatModal,mode:id})} className={`w-full text-left border rounded-lg p-3 transition ${chatModal.mode===id?'border-gray-900 bg-gray-100 ring-1 ring-gray-900':'border-gray-200 hover:bg-gray-50'}`}><div className="flex items-center justify-between gap-3"><span className="text-sm font-bold">{opt.nome}</span><span className={`w-4 h-4 rounded-full border-2 shrink-0 ${chatModal.mode===id?'border-gray-900 bg-gray-900':'border-gray-300'}`}></span></div><p className="text-[10px] text-gray-500 mt-1">{opt.desc}</p></button>)}
                                        <div className="flex justify-end gap-2 pt-3"><button onClick={()=>setChatModal({...chatModal,isOpen:false})} className="px-4 py-2 rounded bg-gray-200 font-bold text-xs">Cancelar</button><button onClick={copyChatFromModal} className="px-4 py-2 rounded bg-gray-900 text-white font-bold text-xs">Copiar {CHAT_MODES[chatModal.mode]?.nome || 'ficha'}</button></div>
                                    </div>
                                </div>
                            </div>, document.body
                        )}


                        {toastMsg && (
                            <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 z-[200] animate-fade-in-up">
                                <span>{toastMsg}</span>{undoState && <button onClick={undoLastRemoval} className="ml-3 underline font-bold text-amber-300">Desfazer</button>}
                            </div>
                        )}
                    </React.Fragment>
                );
            }

            const isDnd = data.system === 'dnd5e';
            const isFabula = data.system === 'fabula';
            const isSom6 = data.system === 'somdas6';
            const topBarColor = isDnd ? 'bg-[#922610]' : isFabula ? 'bg-teal-800' : isSom6 ? 'bg-red-950' : (data.type === 'pnj' ? 'bg-blue-900' : data.type === 'ameaca' ? 'bg-red-900' : 'bg-dragon-dark');
            // Escopo de compatibilidade dos editores modularizados.
            // Será reduzido conforme modelos e lógica forem migrados para cada sistema.
            const systemEditorScope = {
                addDndSyncedItem,
                addToArray,
                App,
                applyCustomPreset,
                CHAT_MODES,
                chatModal,
                codeModal,
                copyChatFromModal,
                copySheetToChat,
                copyToClipboard,
                createTarget,
                CUSTOM_ACCENT_COLOR_KEY,
                CUSTOM_BAR_COLOR_KEY,
                CUSTOM_BG_KEY,
                CUSTOM_BG_POSITION_KEY,
                CUSTOM_BG_SIZE_KEY,
                CUSTOM_BLUR_KEY,
                CUSTOM_OPACITY_KEY,
                CUSTOM_OVERLAY_KEY,
                CUSTOM_TEXT_COLOR_KEY,
                CUSTOM_WIN_COLOR_KEY,
                customAccentColor,
                customBarColor,
                customBgLink,
                customBgPosition,
                customBgSize,
                customBgUrl,
                customBlur,
                customOpacity,
                customOverlay,
                customTextColor,
                customWinColor,
                dashboardView,
                data,
                deleteCharacter,
                deleteConfirmId,
                deleteThreat,
                DND_SKILLS_LIST,
                dndPcTab,
                duplicateItem,
                exportFullBackup,
                FABULA_DEFAULT_SUPPLEMENTS,
                FABULA_EXTRA_OPTIONS,
                FABULA_MAGIC_DISCIPLINES,
                FABULA_RITUAL_AREA,
                FABULA_RITUAL_POTENCY,
                FABULA_SPELL_DISCIPLINES,
                FABULA_SUPPLEMENT_OPTIONS,
                FabulaAcampamentoPanel,
                FabulaArcanosPanel,
                FabulaArmasPersonalizadasPanel,
                FabulaComercioPanel,
                fabulaCreateSupplements,
                FabulaInvocacoesPanel,
                FabulaJardimPanel,
                FabulaMagicPanel,
                FabulaMateriaisPanel,
                FabulaMnemosferaPanel,
                FabulaNotasPanel,
                FabulaPeculiaridadePanel,
                FabulaPoderZeroPanel,
                FabulaProjetosPanel,
                FabulaReceitasPanel,
                FabulaRecursosClassePanel,
                fabulaTab,
                FabulaTecnosferasPanel,
                FabulaThreatList,
                FabulaVeiculoPanel,
                filterAndSortItems,
                filterChatText,
                formatDndMod,
                generateChatText,
                generatePnjAspect,
                getBarStyle,
                getChanceBase,
                getDanoBonus,
                getDndAbilityMod,
                getFabulaDieClass,
                getFabulaMagicTestHint,
                getFabulaRitualRef,
                getHistory,
                getMovimento,
                getProficiencyBonus,
                getSavedCharacters,
                getSavedThreats,
                getSelectedFabulaSupplements,
                getValidationWarnings,
                getWindowStyle,
                guideTab,
                handleAncestryChange,
                handleAttributeChange,
                handleCodeImport,
                handleExport,
                handleImport,
                hexToRgb,
                HISTORY_STORAGE_KEY,
                historySignature,
                initialAmeacaData,
                initialData,
                initialDndMonsterData,
                initialDndPcData,
                initialFabulaPcData,
                initialFabulaThreatData,
                initialPnjData,
                initialSom6PcData,
                initialSom6PdjData,
                isDnd,
                isFabula,
                isFabulaExtraUnlocked,
                isSom6,
                JSZip,
                loadCharacter,
                loadFabulaTemplateWithSupplements,
                loadTemplate,
                loadThreat,
                LZString,
                mobileTab,
                MODELOS_AMEACAS_GENERICOS,
                MODELOS_DND_AMEACA,
                MODELOS_DND_PC,
                MODELOS_DRAGONBANE_PC,
                MODELOS_FABULA_AMEACA,
                MODELOS_FABULA_PC,
                MODELOS_SOM6_PC,
                MODELOS_SOM6_PDJ,
                moveArrayItem,
                moveNestedArrayItem,
                NEWS_COLLAPSED_KEY,
                newsCollapsed,
                normalizeDndPcData,
                normalizeFabulaPcData,
                normalizeFabulaThreatData,
                normalizeImportedSheet,
                normalizeMetaItem,
                normalizeSom6PcData,
                normalizeSom6PdjData,
                onlyFavorites,
                openChatOptions,
                openCodeExport,
                openCodeImport,
                optimizeImageFile,
                pushHistorySnapshot,
                React,
                ReactDOM,
                readableTextColor,
                removeDndSyncedItem,
                removeFromArray,
                renderFabulaDieSelect,
                renderHistoryModal,
                restoreFabulaEquipmentSlots,
                restoreFullBackup,
                restoreHistorySnapshot,
                returnToDashboard,
                savedChars,
                savedThreats,
                saveStatus,
                saveToLocal,
                SCHEMA_VERSION,
                searchQuery,
                setChatModal,
                setCodeModal,
                setCreateTarget,
                setCustomAccentColor,
                setCustomBarColor,
                setCustomBgLink,
                setCustomBgPosition,
                setCustomBgSize,
                setCustomBgUrl,
                setCustomBlur,
                setCustomOpacity,
                setCustomOverlay,
                setCustomTextColor,
                setCustomWinColor,
                setDashboardView,
                setData,
                setDeleteConfirmId,
                setDndPcTab,
                setFabulaCreateSupplements,
                setFabulaSupplementEnabled,
                setFabulaTab,
                setGuideTab,
                setMobileTab,
                setNewsCollapsed,
                setOnlyFavorites,
                setSavedChars,
                setSavedThreats,
                setSaveStatus,
                setSearchQuery,
                setShowCustomBgModal,
                setShowDbModelModal,
                setShowDndModelModal,
                setShowFabulaExtras,
                setShowFabulaModelModal,
                setShowFilters,
                setShowGuideModal,
                setShowHistoryModal,
                setShowSom6ModelModal,
                setShowSystemModal,
                setShowThreatModal,
                setShowUrlInput,
                setSom6Tab,
                setSortMode,
                setSystemFilter,
                setTempUrl,
                setTheme,
                setToastMsg,
                setUndoState,
                setView,
                showCustomBgModal,
                showDbModelModal,
                showDndModelModal,
                showFabulaExtras,
                showFabulaModelModal,
                showFilters,
                showGuideModal,
                showHistoryModal,
                showSom6ModelModal,
                showSystemModal,
                showThreatModal,
                showToast,
                showUrlInput,
                SOM6_ANTECEDENTES,
                SOM6_HABILIDADES,
                SOM6_LEVELS,
                Som6Pips,
                som6Tab,
                sortMode,
                STORAGE_KEY,
                stripHeavyHistoryMedia,
                SVGIcons,
                systemFilter,
                tempUrl,
                theme,
                THEME_PREF_KEY,
                THREAT_STORAGE_KEY,
                toastMsg,
                toastTimerRef,
                toggleFabulaCreateSupplement,
                toggleFavorite,
                toggleTreinada,
                topBarColor,
                undoLastRemoval,
                undoState,
                UPDATE_LOG,
                updateArrayField,
                updateDndSyncedItem,
                updateField,
                useEffect,
                useRef,
                useState,
                view
            };

            return (
                <div style={getWindowStyle()} className={`${(!isDnd && !isFabula && !isSom6 && data.type === 'pc') ? 'max-w-[90rem]' : 'max-w-6xl'} mx-auto bg-white rounded-sm shadow-xl border-2 ${isDnd ? 'border-[#922610]' : isFabula ? 'border-teal-700' : isSom6 ? 'border-red-900' : 'border-gray-500'} transition-all duration-300`}>
                    <div style={(isDnd || isFabula || isSom6) ? {} : getBarStyle()} className={`no-print p-3 flex flex-wrap justify-between items-center rounded-t-sm gap-2 text-white ${topBarColor}`}>
                        <div className="flex items-center gap-4">
                            <button onClick={returnToDashboard} className="flex items-center gap-1 transition-colors text-sm font-bold text-gray-300 hover:text-white">
                                <SVGIcons.ArrowLeft /> <span className="hidden sm:inline">Voltar</span>
                            </button>
                            <span className="font-title font-bold text-lg md:text-xl tracking-wider uppercase">
                                {isDnd ? (data.type === 'pc' ? 'D&D 5e - Personagem • EM ADAPTAÇÃO' : 'D&D 5e - Bestiário • EM ADAPTAÇÃO') : isFabula ? (data.type === 'pc' ? 'FABULA ULTIMA • PERSONAGEM • INTEGRADO' : 'FABULA ULTIMA • AMEAÇA / PNJ • INTEGRADO') : isSom6 ? (data.type === 'pc' ? 'O SOM DAS SEIS • PERSONAGEM • INTEGRADO' : 'O SOM DAS SEIS • PDJ • INTEGRADO') : (data.type === 'pc' ? 'DRAGONBANE' : data.type === 'pnj' ? 'PNJ (DB)' : 'AMEAÇA (DB)')}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end items-center">
                            <input value={data.meta?.campanha || ''} onChange={e=>updateField('meta.campanha', e.target.value)} placeholder="Campanha" className="w-28 md:w-36 px-2 py-1 rounded text-xs text-gray-900 bg-white/90 border border-white/30" title="Campanha / pasta desta ficha" />
                            {saveStatus && <span className={`text-[10px] font-bold px-2 py-1 rounded ${saveStatus==='error'?'bg-red-900':saveStatus==='saving'?'bg-amber-700':'bg-black/30'}`}>{saveStatus==='pending'?'Alterado…':saveStatus==='saving'?'Salvando…':saveStatus==='saved'?'✓ Salvo':'Erro ao salvar'}</span>}
                            <button onClick={()=>setShowHistoryModal(true)} className="px-3 py-1 rounded text-xs md:text-sm font-bold bg-black/30 hover:bg-black/50 text-white" title="Histórico local">🕘</button>
                            <button onClick={() => openChatOptions(data)} className="flex items-center gap-1 px-3 py-1 rounded text-xs md:text-sm font-bold transition-colors shadow bg-black/30 hover:bg-black/50 text-white" title="Copiar como texto">
                                <SVGIcons.MessageCircle /> Copiar Ficha
                            </button>
                            <button onClick={() => handleExport(data)} className="px-3 py-1 rounded text-xs md:text-sm font-bold transition-colors shadow bg-black/30 hover:bg-black/50 text-white" title="Baixar ZIP">ZIP</button>
                            <button onClick={() => saveToLocal(data)} className="flex items-center gap-1 px-3 py-1 rounded text-xs md:text-sm font-bold transition-colors shadow bg-green-700 hover:bg-green-600 text-white">
                                <SVGIcons.Save /> Salvar
                            </button>
                        </div>
                    </div>

                    {data?.type === 'pc' && (()=>{
                        const warnings=getValidationWarnings(data);
                        if (!warnings.length) return null;
                        return <div className="no-print px-4 md:px-7 pt-4">
                            <details className="border border-amber-300 bg-amber-50 rounded-lg"><summary className="px-3 py-2 text-xs font-bold text-amber-900 cursor-pointer">⚠ Revisão rápida: {warnings.length} ponto{warnings.length>1?'s':''} para conferir</summary><div className="px-3 pb-3 text-xs text-amber-900">{warnings.map((w,i)=><div key={i}>• {w}</div>)}</div></details>
                        </div>;
                    })()}

                    {toastMsg && (
                        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 z-[200] animate-fade-in-up">
                            {toastMsg}
                        </div>
                    )}
                    {renderHistoryModal()}
                        {chatModal.isOpen && ReactDOM.createPortal(
                            <div className="fixed inset-0 bg-black/60 z-[320] flex items-center justify-center p-4 no-print">
                                <div className="bg-white text-gray-900 rounded-lg shadow-2xl border-2 border-gray-700 w-full max-w-md overflow-hidden">
                                    <div className="bg-gray-900 text-white p-3 flex justify-between items-center"><div><h3 className="font-title font-bold">💬 Ficha Chat</h3><p className="text-[10px] text-gray-300">Escolha um formato pronto para copiar.</p></div><button onClick={()=>setChatModal({...chatModal,isOpen:false})} className="text-2xl">×</button></div>
                                    <div className="p-4 space-y-2">
                                        {Object.entries(CHAT_MODES).map(([id,opt])=><button type="button" key={id} onClick={()=>setChatModal({...chatModal,mode:id})} className={`w-full text-left border rounded-lg p-3 transition ${chatModal.mode===id?'border-gray-900 bg-gray-100 ring-1 ring-gray-900':'border-gray-200 hover:bg-gray-50'}`}><div className="flex items-center justify-between gap-3"><span className="text-sm font-bold">{opt.nome}</span><span className={`w-4 h-4 rounded-full border-2 shrink-0 ${chatModal.mode===id?'border-gray-900 bg-gray-900':'border-gray-300'}`}></span></div><p className="text-[10px] text-gray-500 mt-1">{opt.desc}</p></button>)}
                                        <div className="flex justify-end gap-2 pt-3"><button onClick={()=>setChatModal({...chatModal,isOpen:false})} className="px-4 py-2 rounded bg-gray-200 font-bold text-xs">Cancelar</button><button onClick={copyChatFromModal} className="px-4 py-2 rounded bg-gray-900 text-white font-bold text-xs">Copiar {CHAT_MODES[chatModal.mode]?.nome || 'ficha'}</button></div>
                                    </div>
                                </div>
                            </div>, document.body
                        )}


                    {/* Editor Fabula Ultima — compatibilidade consolidada */}
                    <FabulaCharacterEditor scope={systemEditorScope} />

                    {/* O Som das Seis — Personagem (integração linha 0.7) */}
                    <Som6CharacterEditor scope={systemEditorScope} />

                    <Som6ThreatEditor scope={systemEditorScope} />

                    <FabulaThreatEditor scope={systemEditorScope} />

                    {/* Editor D&D 5E */}
                    <DndCharacterEditor scope={systemEditorScope} />

                    {/* Editor D&D 5E Bestiário */}

                    <DndThreatEditor scope={systemEditorScope} />

                    {/* Editor Dragonbane (Intacto) */}
                    {!['dragonbane','dnd5e','fabula','somdas6'].includes(data.system || 'dragonbane') && (
                        <div className="p-6 md:p-10 bg-amber-50 border-y border-amber-300 text-amber-950">
                            <h2 className="font-title font-bold text-lg">⚠ Formato de ficha não reconhecido</h2>
                            <p className="text-sm mt-2">Esta ficha parece ter vindo de uma versão ou sistema que o PJ Lite atual não reconhece. Os dados não foram apagados. Exporte um backup antes de editar e confira o campo de sistema na origem da ficha.</p>
                        </div>
                    )}

                    <DragonbaneEditor scope={systemEditorScope} />
                </div>
            );
        }

export default App;
