import { Project, ServiceSpecialty } from '../types';

export const JPX_PROJECTS: Project[] = [
  {
    id: 'aura-apothecary',
    title: 'AURA APOTHECARY',
    client: 'Aura Botanicals Ltd.',
    year: '2025',
    category: 'Identidade Visual',
    tagline: 'Sistema de identidade e packaging para cosmética botânica de luxo.',
    description: 'Criação da identidade visual completa para a marca de cuidados botânicos de alta gama Aura Botanicals. O projeto combinou um monograma tipográfico austero com embalagens em vidro âmbar fosco e etiquetas em papel algodão com relevo seco.',
    challenge: 'Traduzir a pureza dos ingredientes botânicos em um universo visual contemporâneo que se destacasse do visual rústico tradicional de produtos naturais.',
    solution: 'Desenvolvemos uma linguagem editorial minimalista ancorada em tipografia grotesca de alto contraste, grid suíço rigoroso e acabamentos táteis nobres.',
    deliverables: [
      'Logotipo & Monograma Primário',
      'Manual de Identidade Visual (Brand Guidelines)',
      'Design de Linha de Frascos & Embalagens Primárias',
      'Caixas Rígidas com Hot Stamping Preto Fosco',
      'Papelaria Corporativa em Papel Algodão 450g',
      'Diretrizes de Fotografia & Direção de Arte'
    ],
    palette: ['#0A0A0A', '#1C1917', '#D6D3D1', '#F5F5F4', '#A89F91'],
    typography: 'Syne Bold + Plus Jakarta Sans Light',
    aspectRatio: '4:3',
    featured: true,
    themeColor: '#A89F91'
  },
  {
    id: 'kinetic-archive',
    title: 'KINETIC ARCHIVE',
    client: 'Fundação de Arquitetura Moderna',
    year: '2025',
    category: 'Design Editorial',
    tagline: 'Monografia retrospectiva e catálogo de exposição de 320 páginas.',
    description: 'Projeto editorial e direção de arte da monografia retrospectiva do movimento brutalista na América Latina. Edição bilíngue com encadernação exposta suíça e capa dura em linho serigrafado.',
    challenge: 'Organizar um acervo de mais de 400 fotografias históricas e plantas técnicas em uma estrutura editorial coerente e dinâmica.',
    solution: 'Criação de um sistema de grid modular assimétrico de 12 colunas que permite respiração generosa para fotos de página inteira e microtipografia precisa.',
    deliverables: [
      'Projeto Gráfico & Grid Editorial Completo',
      'Design de Capa Dura com Serigrafia Manual',
      'Encadernação Suíça com Lombada Aparente',
      'Tratamento & Curadoria de 420 Imagens de Acervo',
      'Pôster Promocional de Lançamento em Dobradura Especial'
    ],
    palette: ['#050505', '#18181B', '#E4E4E7', '#FAFAFA', '#C2410C'],
    typography: 'Neue Haas / Syne + JetBrains Mono',
    aspectRatio: '4:3',
    featured: true,
    themeColor: '#C2410C'
  },
  {
    id: 'neo-tokyo-biennale',
    title: 'NEO TOKYO BIENNALE',
    client: 'Conselho de Artes Visuais de Tóquio',
    year: '2024',
    category: 'Direção de Arte',
    tagline: 'Identidade visual dinâmica e sistema de cartazes para festival internacional.',
    description: 'Sistema visual completo para a 8ª edição da Bienal Internacional de Arte Contemporânea de Tóquio, sob o tema "Fluidez & Estrutura". O projeto abrangeu intervenções urbanas, catálogo e sistema de sinalização ambiental.',
    challenge: 'Conectar tradição caligráfica oriental com o brutalismo digital contemporâneo em uma identidade flexível para espaços físicos e digitais.',
    solution: 'Um sistema tipográfico cinético gerado a partir de matrizes geométricas e contrastes tonais absolutos entre preto profundo e branco de alta pureza.',
    deliverables: [
      'Sistema de Identidade Dinâmica & Marca',
      'Série de 12 Cartazes Serigráficos Urbanos',
      'Sinalização e Wayfinding Espacial da Bienal',
      'Catálogo da Mostra (Formato Brochete)',
      'Campanha de Mídia Exterior (OOH & Painéis LED)'
    ],
    palette: ['#050505', '#121212', '#FFFFFF', '#71717A', '#38BDF8'],
    typography: 'Syne Extra Bold + Plus Jakarta Sans Regular',
    aspectRatio: '4:3',
    featured: true,
    themeColor: '#38BDF8'
  },
  {
    id: 'vortex-sound-lab',
    title: 'VORTEX SOUND LAB',
    client: 'Vortex Audio Engineering',
    year: '2024',
    category: 'Branding',
    tagline: 'Posicionamento e branding para estúdio de masterização e hardware analógico.',
    description: 'Construção da identidade de marca para a Vortex, uma fabricante artesanal de compressores valvulados e estúdio de masterização em fita analógica sediada em Berlim.',
    challenge: 'Comunicar precisão técnica de nível industrial sem perder o apelo de calor humano e sensibilidade acústica analógica.',
    solution: 'Identidade visual inspirada na estética de equipamentos de medição dos anos 70, com gravura a laser em chassis de alumínio preto anodizado e tipografia técnica milimétrica.',
    deliverables: [
      'Manual de Marca & Naming Guidelines',
      'Painéis Frontais de Hardware em Silk Alumínio',
      'Capas de Vinil de Lançamento Exclusivo (Gatefold)',
      'Manual de Instruções em Formato Zine Técnico',
      'Website Institucional & Interface de Plugins'
    ],
    palette: ['#080808', '#262626', '#E4E4E7', '#F59E0B', '#10B981'],
    typography: 'Syne 800 + IBM Plex / Mono',
    aspectRatio: '4:3',
    featured: true,
    themeColor: '#F59E0B'
  },
  {
    id: 'chronos-horology',
    title: 'CHRONOS HOROLOGY',
    client: 'Chronos Atelier Genève',
    year: '2024',
    category: 'Embalagens',
    tagline: 'Embalagens estruturais de luxo e livro de colecionador para alta relojoaria.',
    description: 'Desenvolvimento do packaging estrutural e editorial para a série limitada do modelo Opus No. 1, relógio mecânico de corda manual com produção de apenas 50 exemplares numerados.',
    challenge: 'Criar uma experiência sensorial de unboxing que elevasse o valor de um produto com ticket de alta relojoaria internacional.',
    solution: 'Estojo monobloco em alumínio escovado com encaixe magnético, revestimento interno em couro vegetal escuro e livreto de garantia encadernado à mão com costura em linha preta.',
    deliverables: [
      'Engenharia Estrutural de Embalagem de Luxo',
      'Certificado de Autenticidade em Papel Moeda com Relevo',
      'Livro de Colecionador com Registro das 50 Peças',
      'Luva Protetora em Cartão Especial de 600g',
      'Direção de Arte para Fotografia Macro de Detalhes'
    ],
    palette: ['#030303', '#1F1F23', '#D4D4D8', '#FFFFFF', '#D97706'],
    typography: 'Syne Bold + Plus Jakarta Sans Medium',
    aspectRatio: '4:3',
    featured: false,
    themeColor: '#D97706'
  },
  {
    id: 'equinox-distillery',
    title: 'EQUINOX DISTILLERY',
    client: 'Destilaria Equinócio',
    year: '2023',
    category: 'Identidade Visual',
    tagline: 'Rótulos premium com faca especial e hot stamping para gim botânico.',
    description: 'Identidade completa e design de rótulos para uma destilaria independente da serra da Mantiqueira. A garrafa utiliza vidro reciclado com relevo profundo do monograma da marca.',
    challenge: 'Garantir resistência à umidade e refrigeração enquanto se mantinha a nobreza de uma textura artesanal com acabamentos metalizados sutis.',
    solution: 'Rótulo envolvente com corte geométrico assimétrico, papel resistente com acabamento verniz UV localizado e estampagem a quente em bronze fosco.',
    deliverables: [
      'Logotipo, Monograma & Símbolo Heráldico Moderno',
      'Design de Rótulo Frontal e Traseiro com Faca Especial',
      'Desenvolvimento de Lacre de Cera Personalizado',
      'Caixa para Envio e Presente em Papelão Kraft Estruturado',
      'Guia de Aplicação da Linha em Diferentes Infusões'
    ],
    palette: ['#0A0A0A', '#27272A', '#D4D4D8', '#F4F4F5', '#84CC16'],
    typography: 'Syne Bold + Plus Jakarta Sans',
    aspectRatio: '4:3',
    featured: false,
    themeColor: '#84CC16'
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
