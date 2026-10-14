import { Project, ServiceSpecialty } from '../types';

export const JPX_PROJECTS: Project[] = [
  {
    id: 'brasil-japao-matchday',
    title: 'BRASIL X JAPÃO',
    client: 'CBF / Matchday Series',
    year: '2025',
    category: 'Matchday',
    tagline: 'Arte oficial de Matchday e cartaz esportivo para duelo internacional.',
    description: 'Design de cartaz promocional e material digital para o clássico internacional de futebol. Tratamento de imagem de alto contraste, tipografia brutalista esportiva e composição dinâmica para mídias sociais e telões.',
    challenge: 'Desenvolver uma identidade de dia de jogo de alto impacto que capture a energia da partida e valorize os atletas em proporção vertical 1350x1080.',
    solution: 'Composição com iluminação dramática, texturas metálicas, tipografia condensada e elementos de identidade do confronto.',
    deliverables: [
      'Arte de Matchday Oficial (Feed 1350x1080)',
      'Story de Escalação e Placar',
      'Banner Digital de Divulgação',
      'Vinheta para Telão do Estádio'
    ],
    palette: ['#0A0A0A', '#10B981', '#F59E0B', '#3B82F6', '#FFFFFF'],
    typography: 'Syne Extra Bold + JetBrains Mono',
    aspectRatio: '1350x1080',
    featured: true,
    themeColor: '#10B981'
  },
  {
    id: 'final-copa-regional',
    title: 'GRANDE FINAL REGIONAL',
    client: 'Federação Esportiva',
    year: '2025',
    category: 'Matchday',
    tagline: 'Cartaz e artes de decisão de campeonato em alta vibração visual.',
    description: 'Composição visual de matchday com foco em atletas em ação, tipografia robusta e efeitos de partículas esportivas para o confronto decisivo.',
    challenge: 'Criar uma peça imersiva e energética que mobilize torcidas nas redes sociais.',
    solution: 'Paleta contrastante, profundidade de campo cinematográfica e diagramação esportiva precisa.',
    deliverables: [
      'Arte Principal de Matchday 1350x1080',
      'Cards de Escalação Oficial',
      'Stories de Cobertura em Tempo Real'
    ],
    palette: ['#09090B', '#DC2626', '#F59E0B', '#FFFFFF'],
    typography: 'Syne Extra Bold + JetBrains Mono',
    aspectRatio: '1350x1080',
    featured: true,
    themeColor: '#DC2626'
  },
  {
    id: 'derby-clash-matchday',
    title: 'DÉRBI DA CAPITAL',
    client: 'Liga Nacional',
    year: '2025',
    category: 'Matchday',
    tagline: 'Identidade e arte de clássico histórico com atmosfera épica.',
    description: 'Composição de cartaz esportivo celebrando a rivalidade histórica do clássico.',
    challenge: 'Transmitir a grandeza e tensão do duelo em formato vertical otimizado.',
    solution: 'Dualidade de iluminação com atmosfera fumê e tipografia imponente.',
    deliverables: [
      'Cartaz de Dia de Jogo 1350x1080',
      'Material Promocional Digital'
    ],
    palette: ['#050505', '#2563EB', '#F97316', '#FFFFFF'],
    typography: 'Syne Bold + JetBrains Mono',
    aspectRatio: '1350x1080',
    featured: true,
    themeColor: '#2563EB'
  },
  {
    id: 'socio-torcedor-poeirao',
    title: 'SITE SÓCIO TORCEDOR POEIRÃO',
    client: 'Poeirão Futebol Clube',
    year: '2025',
    category: 'Site',
    tagline: 'Interface web widescreen e plataforma de adesão de sócios.',
    description: 'Design de interface e experiência de usuário para o portal oficial do programa de sócio torcedor. Layout responsivo com grid moderno de 12 colunas, tipografia limpa e fluxo de checkout intuitivo.',
    challenge: 'Criar uma presença digital moderna e profissional em formato widescreen 1920x1080 que converta visitantes em sócios torcedores ativos.',
    solution: 'Interface escura de alto padrão com microinterações refinadas, métricas em tempo real e visualização imersiva de planos.',
    deliverables: [
      'Design de UI/UX em Formato Widescreen 1920x1080',
      'Página Inicial & Seletor de Planos',
      'Área do Torcedor & Carteirinha Digital',
      'Design System Completo com Tokens e Componentes'
    ],
    palette: ['#0A0A0C', '#18181B', '#38BDF8', '#FFFFFF', '#6366F1'],
    typography: 'Plus Jakarta Sans + Syne',
    aspectRatio: '1920x1080',
    featured: true,
    themeColor: '#38BDF8'
  },
  {
    id: 'portal-jpx-estudio',
    title: 'PORTAL JPX DESIGN STUDIO',
    client: 'JPX Estúdio Autoral',
    year: '2025',
    category: 'Site',
    tagline: 'Plataforma institucional e galeria interativa para estúdio de design.',
    description: 'Website autoral desenvolvido com ênfase em tipografia condensada de alta precisão e showcase interativo de projetos.',
    challenge: 'Apresentar trabalhos autorais em um ambiente web sofisticado, fluido e minimalista.',
    solution: 'Arquitetura de informação limpa, microinterações refinadas e layout widescreen 1920x1080.',
    deliverables: [
      'Website Widescreen Completo 1920x1080',
      'Design System e Componentes UI',
      'Área de Briefing Interativo'
    ],
    palette: ['#050505', '#121216', '#FFFFFF', '#71717A'],
    typography: 'Syne Extra Bold + Plus Jakarta Sans',
    aspectRatio: '1920x1080',
    featured: true,
    themeColor: '#FFFFFF'
  },
  {
    id: 'landing-campeonato-arena',
    title: 'LANDING PAGE ARENA 2025',
    client: 'Arena Multisport',
    year: '2025',
    category: 'Site',
    tagline: 'Portal de venda de ingressos e experiência imersiva de estádio.',
    description: 'Interface web com visualização 3D de setores do estádio e cronograma de jogos da temporada.',
    challenge: 'Otimizar o fluxo de conversão e reserva de camarotes e ingressos.',
    solution: 'Grid widescreen 16:9 de alto impacto com navegação ágil.',
    deliverables: [
      'Interface Desktop 1920x1080',
      'Módulo de Seleção de Setores'
    ],
    palette: ['#0A0A0E', '#10B981', '#38BDF8', '#FFFFFF'],
    typography: 'Plus Jakarta Sans + Syne',
    aspectRatio: '1920x1080',
    featured: false,
    themeColor: '#10B981'
  },
  {
    id: 'ecommerce-oficial-clube',
    title: 'E-COMMERCE LOJA OFICIAL',
    client: 'Clube & Merchandising',
    year: '2025',
    category: 'Site',
    tagline: 'Loja virtual de mantos e uniformes oficiais com experiência premium.',
    description: 'Design de e-commerce esportivo com visualização imersiva de mantos, personalização de nomes e números em tempo real.',
    challenge: 'Oferecer uma experiência de compra rápida, limpa e valorizar os detalhes dos tecidos e estampas.',
    solution: 'Cards de produtos limpos, tipografia técnica e contraste nobre.',
    deliverables: [
      'Design de Vitrine Widescreen 1920x1080',
      'Página de Produto & Customização de Camisas'
    ],
    palette: ['#050507', '#27272A', '#F59E0B', '#FFFFFF'],
    typography: 'Syne + Plus Jakarta Sans',
    aspectRatio: '1920x1080',
    featured: false,
    themeColor: '#F59E0B'
  }
];

export const JPX_SPECIALTIES: ServiceSpecialty[] = [
  {
    number: '01',
    title: 'Identidade Visual & Logotipos',
    subtitle: 'Sistemas visuais autênticos e memoráveis',
    description: 'Construção de marcas desde o monograma ao ecossistema gráfico completo. Não criamos apenas logotipos isolados; estruturamos linguagens visuais duradouras que comunicam autoridade e sofisticação em todos os pontos de contato.',
    deliverables: ['Logotipo Primário & Reduções', 'Manual de Identidade Visual', 'Tipografia Corporativa & Cores', 'Papelaria & Materiais Institucionais']
  },
  {
    number: '02',
    title: 'Embalagens & Packaging',
    subtitle: 'Experiências táteis que valorizam o produto',
    description: 'Design de rótulos, frascos, cartuchos e caixas rígidas. Aliamos engenharia de embalagem com acabamentos táteis nobres (relevo seco, hot stamping, facas especiais) para transformar o ato do unboxing em um ritual de encantamento.',
    deliverables: ['Rótulos para Cosméticos & Bebidas', 'Caixas de Luxo & Unboxing Experience', 'Facas Especiais & Acabamentos Nobres', 'Mockups 3D & Prototipagem Visual']
  },
  {
    number: '03',
    title: 'Design Digital & Interfaces Web',
    subtitle: 'Presença digital com elegância editorial',
    description: 'Sites autorais, landing pages e portfólios no estilo dark mode minimalista. Criamos interfaces funcionais com micro-interações fluidas, transições de imagem e tipografia de impacto que convertem visitantes em clientes de alto valor.',
    deliverables: ['Design de Portfólios & Websites de Estúdio', 'Landing Pages de Alto Impacto', 'Design System em Figma/Framer', 'Direção de Interação & Micro-animações']
  }
];

export const DESIGN_SYSTEM_SPEC = {
  colors: [
    { name: 'Canvas Black (Fundo Principal)', hex: '#050505', rgb: '5, 5, 5', role: '60% - Canvas imersivo em Dark Mode puro' },
    { name: 'Surface Noir (Superfícies de Cards)', hex: '#0F0F11', rgb: '15, 15, 17', role: '30% - Superfícies elevadas e molduras sutis' },
    { name: 'Border Graphite (Linhas & Divisores)', hex: '#27272A', rgb: '39, 39, 42', role: '30% - Linhas divisórias ultrafinas de 1px' },
    { name: 'Pure White (Títulos & Contraste Máximo)', hex: '#FFFFFF', rgb: '255, 255, 255', role: '10% - Títulos bold em alto impacto' },
    { name: 'Text Zinc Light (Corpo de Texto Legível)', hex: '#E4E4E7', rgb: '228, 228, 231', role: 'Texto corrido com contraste WCAG AA' },
    { name: 'Muted Zinc (Metadados & Legendas)', hex: '#A1A1AA', rgb: '161, 161, 170', role: 'Metadados, anos e categorias discretas' },
    { name: 'Accent Amber (Ponto Focal Dinâmico)', hex: '#F59E0B', rgb: '245, 158, 11', role: '10% - Pontos de ação e destaques interativos' },
    { name: 'Accent Cobalt (Destaque Alternativo)', hex: '#38BDF8', rgb: '56, 189, 248', role: 'Destaque secundário para links e seleções' }
  ],
  fonts: [
    {
      role: 'Títulos & Display (Ousada, Geométrica, Moderna)',
      name: 'Syne',
      foundry: 'Google Fonts (Gratuita)',
      weights: '700 (Bold), 800 (Extra Bold)',
      usage: 'Logotipo JPXSTUDIO, títulos das seções, nomes dos projetos na lista de hover e grandes frases de impacto.',
      googleFontsUrl: 'https://fonts.google.com/specimen/Syne',
      cssRule: "font-family: 'Syne', -apple-system, sans-serif;"
    },
    {
      role: 'Corpo & Interface (Legível, Neutra, Elegante)',
      name: 'Plus Jakarta Sans',
      foundry: 'Google Fonts (Gratuita)',
      weights: '400 (Regular), 500 (Medium), 600 (SemiBold)',
      usage: 'Descrições de projetos, manifesto do Sobre, menus de navegação, formulário de contato e botões.',
      googleFontsUrl: 'https://fonts.google.com/specimen/Plus+Jakarta+Sans',
      cssRule: "font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;"
    },
    {
      role: 'Metadados & Números (Técnica & Tabular)',
      name: 'JetBrains Mono',
      foundry: 'Google Fonts (Gratuita)',
      weights: '400 (Regular), 500 (Medium)',
      usage: 'Numeração de seções (01, 02), anos dos projetos, fuso horário ao vivo e códigos de cores.',
      googleFontsUrl: 'https://fonts.google.com/specimen/JetBrains+Mono',
      cssRule: "font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums;"
    }
  ],
  copyLibrary: {
    hero: {
      headline: 'JPXSTUDIO',
      subheadline: 'DESIGN GRÁFICO & IDENTIDADE VISUAL',
      body: 'Transformamos ideias complexas em identidades visuais memoráveis, projetos editoriais impecáveis e embalagens de alto padrão. Design sofisticado e funcional para marcas que recusam o comum.',
      cta: 'Ver Projetos Selecionados'
    },
    about: {
      title: 'Design que une rigor conceitual e precisão estética.',
      lead: 'A JPXSTUDIO nasceu da convicção de que o design gráfico não é mero ornamento cosmético: é uma ferramenta estratégica de posicionamento que eleva o valor percebido de marcas e produtos excepcionais.',
      body: 'Operamos na interseção entre o minimalismo contemporâneo e a sensibilidade tátil dos materiais nobres. Cada linha, escolha tipográfica e espaço negativo é meticulosamente calibrado para comunicar sofisticação sem ruído desnecessário.',
      metrics: [
        { value: '+4', label: 'Anos de Experiência em Design Gráfico' },
        { value: '+60', label: 'Projetos Entregues' },
        { value: 'Ituaçu-BA', label: 'Base Criativa & Atendimento' }
      ]
    },
    contact: {
      headline: 'Vamos trabalhar juntos?',
      subheadline: 'LET’S CREATE SOMETHING TIMELESS',
      body: 'Tem um novo projeto, lançamento de marca ou desafio editorial? Conte-nos sobre sua visão. Respondemos em até 24 horas úteis.',
      email: 'js487865@gmail.com',
      location: 'Ituaçu-BA',
      availability: 'Disponível para novos projetos'
    }
  }
};
