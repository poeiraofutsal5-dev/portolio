import React, { useState } from 'react';
import { X, Copy, Check, Palette, Type, FileText, Code2, ExternalLink } from 'lucide-react';
import { DESIGN_SYSTEM_SPEC, JPX_SPECIALTIES } from '../data/portfolioData';

interface DesignSystemGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

type TabType = 'colors' | 'typography' | 'copywriting' | 'nocode-guide' | 'html-code';

export const DesignSystemGuideModal: React.FC<DesignSystemGuideModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('colors');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast(`${label} copiado para a área de transferência!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const { colors, fonts, copyLibrary } = DESIGN_SYSTEM_SPEC;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-[#0A0A0C] border border-[#27272A] rounded-xl overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#0c0c0e]">
          <div>
            <div className="text-[10px] font-mono text-[#A1A1AA] uppercase tracking-wider">
              JPXSTUDIO · RECURSOS & ESPECIFICAÇÃO
            </div>
            <h2 className="font-display font-extrabold text-xl text-white">
              Design System, Copywriting & Guia de Implementação
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-[#0f0f12] border-b border-[#27272A] overflow-x-auto">
          <button
            onClick={() => setActiveTab('colors')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'colors'
                ? 'bg-white text-black'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Paleta de Cores (HEX)</span>
          </button>

          <button
            onClick={() => setActiveTab('typography')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'typography'
                ? 'bg-white text-black'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Tipografia Google Fonts</span>
          </button>

          <button
            onClick={() => setActiveTab('copywriting')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'copywriting'
                ? 'bg-white text-black'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Textos Persuasivos (Copy)</span>
          </button>

          <button
            onClick={() => setActiveTab('nocode-guide')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'nocode-guide'
                ? 'bg-white text-black'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Guia Framer & Webflow</span>
          </button>

          <button
            onClick={() => setActiveTab('html-code')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'html-code'
                ? 'bg-white text-black'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Estrutura HTML/CSS/JS</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          {/* TAB 1: PALETA DE CORES */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div className="border-b border-[#27272A] pb-4">
                <h3 className="font-display font-bold text-lg text-white">
                  Paleta de Cores Exatas (Códigos HEX) — Disciplina 60-30-10
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
                  Desenvolvida para alto contraste no tema Dark Mode, evitando preto puro acinzentado e garantindo conformidade WCAG AA de legibilidade.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {colors.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#121215] border border-[#27272A] rounded-xl flex flex-col justify-between space-y-3"
                  >
                    <div
                      className="w-full h-16 rounded-lg border border-white/10 shadow-inner flex items-center justify-center"
                      style={{ backgroundColor: c.hex }}
                    >
                      <span
                        className="text-xs font-mono font-bold px-2 py-0.5 rounded shadow-sm"
                        style={{
                          color: c.hex === '#FFFFFF' || c.hex === '#E4E4E7' ? '#000000' : '#FFFFFF',
                          backgroundColor: c.hex === '#FFFFFF' || c.hex === '#E4E4E7' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.4)',
                        }}
                      >
                        {c.hex}
                      </span>
                    </div>

                    <div>
                      <div className="font-display font-bold text-sm text-white">
                        {c.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#A1A1AA] mt-0.5">
                        RGB: {c.rgb}
                      </div>
                      <p className="text-xs text-[#D4D4D8] mt-2 font-sans">
                        {c.role}
                      </p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(c.hex, `HEX ${c.hex}`, `hex-${idx}`)}
                      className="w-full py-1.5 px-3 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-mono rounded flex items-center justify-center gap-1.5 border border-[#27272A] transition-colors"
                    >
                      {copiedId === `hex-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar HEX</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* CSS Variables snippet */}
              <div className="pt-4 border-t border-[#27272A]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-[#A1A1AA] uppercase">
                    Variáveis CSS Prontas para Uso
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `:root {\n  --color-canvas: #050505;\n  --color-surface: #0F0F11;\n  --color-border: #27272A;\n  --color-text-white: #FFFFFF;\n  --color-text-body: #E4E4E7;\n  --color-text-muted: #A1A1AA;\n  --color-accent-amber: #F59E0B;\n  --color-accent-cobalt: #38BDF8;\n}`,
                        'Variáveis CSS',
                        'css-vars'
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs text-white hover:underline font-mono"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar Bloco CSS</span>
                  </button>
                </div>
                <pre className="p-4 bg-black border border-[#27272A] rounded-lg font-mono text-xs text-[#D4D4D8] overflow-x-auto">
{`:root {
  --color-canvas: #050505;        /* 60% Fundo Dark Imersivo */
  --color-surface: #0F0F11;       /* 30% Superfície dos Cards */
  --color-border: #27272A;        /* Linhas e divisores de 1px */
  --color-text-white: #FFFFFF;    /* 10% Títulos em Alto Contraste */
  --color-text-body: #E4E4E7;     /* Texto Corrido (WCAG AA) */
  --color-text-muted: #A1A1AA;    /* Metadados e legendas */
  --color-accent-amber: #F59E0B;  /* Destaque Interativo */
  --color-accent-cobalt: #38BDF8; /* Destaque Secundário */
}`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: TIPOGRAFIA GOOGLE FONTS */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div className="border-b border-[#27272A] pb-4">
                <h3 className="font-display font-bold text-lg text-white">
                  Duas Fontes Gratuitas do Google Fonts para o Estilo JPXSTUDIO
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
                  A combinação ideal entre impacto editorial brutalista e máxima legibilidade para interfaces digitais.
                </p>
              </div>

              <div className="space-y-6">
                {fonts.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-[#121215] border border-[#27272A] rounded-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272A] pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#F59E0B]">
                          {f.role}
                        </span>
                        <h4 className="font-display font-extrabold text-2xl text-white">
                          {f.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#A1A1AA] font-mono">{f.weights}</span>
                        <a
                          href={f.googleFontsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-white underline underline-offset-4"
                        >
                          <span>Abrir no Google Fonts</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Specimen Visual */}
                    <div className="p-4 bg-black border border-[#27272A] rounded-lg">
                      <div
                        className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                        style={{ fontFamily: f.name === 'Syne' ? 'Syne' : f.name === 'JetBrains Mono' ? 'JetBrains Mono' : 'Plus Jakarta Sans' }}
                      >
                        JPXSTUDIO — Design Gráfico de Alto Padrão
                      </div>
                      <div
                        className="mt-2 text-sm text-[#A1A1AA]"
                        style={{ fontFamily: f.name === 'Syne' ? 'Syne' : f.name === 'JetBrains Mono' ? 'JetBrains Mono' : 'Plus Jakarta Sans' }}
                      >
                        ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <div className="text-[#A1A1AA] mb-1">Onde Usar:</div>
                        <div className="text-white font-sans">{f.usage}</div>
                      </div>
                      <div>
                        <div className="text-[#A1A1AA] mb-1">Regra CSS:</div>
                        <div className="text-emerald-400 bg-black/60 p-2 rounded">{f.cssRule}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Import tags */}
              <div className="pt-4 border-t border-[#27272A]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-[#A1A1AA] uppercase">
                    Snippet de Importação HTML (&lt;link&gt;)
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">`,
                        'Link do Google Fonts',
                        'link-fonts'
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs text-white hover:underline font-mono"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar Links</span>
                  </button>
                </div>
                <pre className="p-4 bg-black border border-[#27272A] rounded-lg font-mono text-xs text-[#D4D4D8] overflow-x-auto">
{`<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: TEXTOS PERSUASIVOS (COPYWRITING) */}
          {activeTab === 'copywriting' && (
            <div className="space-y-6">
              <div className="border-b border-[#27272A] pb-4">
                <h3 className="font-display font-bold text-lg text-white">
                  Textos Persuasivos (Copywriting Completo)
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
                  Copy focado em posicionamento premium, valor percebido e exclusividade para o estúdio JPXSTUDIO.
                </p>
              </div>

              {/* HERO COPY */}
              <div className="p-5 bg-[#121215] border border-[#27272A] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#F59E0B] uppercase">01. Seção Hero (Início)</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `TÍTULO: ${copyLibrary.hero.headline}\nSUBTÍTULO: ${copyLibrary.hero.subheadline}\nTEXTO: ${copyLibrary.hero.body}\nCTA: ${copyLibrary.hero.cta}`,
                        'Copy da Hero',
                        'copy-hero'
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs text-white font-mono hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar Hero</span>
                  </button>
                </div>
                <div className="space-y-2 text-sm font-sans">
                  <div><strong className="text-white">Título de Impacto:</strong> {copyLibrary.hero.headline}</div>
                  <div><strong className="text-white">Subtítulo:</strong> {copyLibrary.hero.subheadline}</div>
                  <div className="text-[#D4D4D8]"><strong className="text-white">Texto de Apoio:</strong> {copyLibrary.hero.body}</div>
                  <div className="text-xs font-mono text-zinc-400"><strong>Botões de Ação:</strong> "Ver Projetos Selecionados" | "Iniciar Projeto"</div>
                </div>
              </div>

              {/* ABOUT COPY */}
              <div className="p-5 bg-[#121215] border border-[#27272A] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#F59E0B] uppercase">02. Seção Sobre (About & Manifesto)</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `TÍTULO: ${copyLibrary.about.title}\nLEAD: ${copyLibrary.about.lead}\nCORPO: ${copyLibrary.about.body}`,
                        'Copy do Sobre',
                        'copy-about'
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs text-white font-mono hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar Sobre</span>
                  </button>
                </div>
                <div className="space-y-2 text-sm font-sans">
                  <div><strong className="text-white">Título:</strong> {copyLibrary.about.title}</div>
                  <div className="text-[#D4D4D8]"><strong className="text-white">Frase de Abertura (Lead):</strong> {copyLibrary.about.lead}</div>
                  <div className="text-[#D4D4D8]"><strong className="text-white">Abordagem:</strong> {copyLibrary.about.body}</div>
                </div>
              </div>

              {/* CONTACT COPY */}
              <div className="p-5 bg-[#121215] border border-[#27272A] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#F59E0B] uppercase">03. Seção Contato (Contact)</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `TÍTULO: ${copyLibrary.contact.headline}\nSUBTÍTULO: ${copyLibrary.contact.subheadline}\nTEXTO: ${copyLibrary.contact.body}\nEMAIL: ${copyLibrary.contact.email}\nLOCAL: ${copyLibrary.contact.location}`,
                        'Copy do Contato',
                        'copy-contact'
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs text-white font-mono hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar Contato</span>
                  </button>
                </div>
                <div className="space-y-2 text-sm font-sans">
                  <div><strong className="text-white">Título Chamativo:</strong> {copyLibrary.contact.headline}</div>
                  <div><strong className="text-white">Subtítulo:</strong> {copyLibrary.contact.subheadline}</div>
                  <div className="text-[#D4D4D8]"><strong className="text-white">Texto de Fechamento:</strong> {copyLibrary.contact.body}</div>
                  <div className="text-xs font-mono text-zinc-400">
                    E-mail: {copyLibrary.contact.email} · Localização: {copyLibrary.contact.location}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GUIA PASSO A PASSO (FRAMER / WEBFLOW) */}
          {activeTab === 'nocode-guide' && (
            <div className="space-y-6">
              <div className="border-b border-[#27272A] pb-4">
                <h3 className="font-display font-bold text-lg text-white">
                  Guia Passo a Passo para Construtores (Framer & Webflow)
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
                  Como montar exatamente o efeito de hover com imagem flutuante e o tema Dark Mode sofisticado.
                </p>
              </div>

              {/* FRAMER GUIDE */}
              <div className="p-6 bg-[#121215] border border-[#27272A] rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white text-black font-mono text-xs font-bold rounded">
                    FRAMER
                  </span>
                  <h4 className="font-display font-bold text-base text-white">
                    Como criar a Lista com Imagem Flutuante no Framer
                  </h4>
                </div>
                <ol className="list-decimal list-inside space-y-2.5 text-xs text-[#D4D4D8] font-sans leading-relaxed">
                  <li>
                    <strong className="text-white">Defina o Canvas Dark:</strong> Crie a página principal com fundo <code className="text-white font-mono">#050505</code>.
                  </li>
                  <li>
                    <strong className="text-white">Componente do Projeto:</strong> Crie um componente para a linha do projeto com dois estados/variantes: <em>Default</em> e <em>Hover</em>.
                  </li>
                  <li>
                    <strong className="text-white">Efeito de Imagem que Segue o Mouse:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 text-[#A1A1AA]">
                      <li>Adicione um frame com a imagem de capa do projeto configurado como <strong>Position: Absolute</strong>.</li>
                      <li>Use o recurso nativo de <strong>Component Variant</strong> com transição suave (Spring 300, Damping 25).</li>
                      <li>Ou use o pacote de código do Framer <code>Follow Mouse Cursor</code> (ou transforme o cursor em um componente customizado que altera a imagem de acordo com o item sob o ponteiro).</li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-white">Tipografia:</strong> Adicione a fonte <strong>Syne</strong> para títulos e <strong>Plus Jakarta Sans</strong> para corpo através do painel de fontes do Google Fonts integrado ao Framer.
                  </li>
                </ol>
              </div>

              {/* WEBFLOW GUIDE */}
              <div className="p-6 bg-[#121215] border border-[#27272A] rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#38BDF8] text-black font-mono text-xs font-bold rounded">
                    WEBFLOW
                  </span>
                  <h4 className="font-display font-bold text-base text-white">
                    Como criar a Interação no Webflow (Interactions 2.0)
                  </h4>
                </div>
                <ol className="list-decimal list-inside space-y-2.5 text-xs text-[#D4D4D8] font-sans leading-relaxed">
                  <li>
                    <strong className="text-white">Estrutura HTML no Webflow:</strong>
                    <div className="font-mono text-[11px] text-zinc-400 mt-1 bg-black/60 p-2 rounded">
                      Section (.projects-section) [relative, overflow: hidden]<br />
                      &nbsp;&nbsp;└── Container (.container)<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Collection List Wrapper (.projects-list)<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Item (.project-row) [relative]<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Floating Image Div (.floating-preview) [position: fixed ou absolute, pointer-events: none, opacity: 0]
                    </div>
                  </li>
                  <li>
                    <strong className="text-white">Gatilho de Interação (Mouse hover):</strong>
                    Selecione <code>.project-row</code> e adicione uma animação de <strong>Mouse hover</strong>:
                    <ul className="list-disc list-inside ml-4 mt-1 text-[#A1A1AA]">
                      <li><em>On hover:</em> Animar <code>.floating-preview</code> de Opacity 0% para 100% e Scale 0.95 para 1.0.</li>
                      <li><em>On hover out:</em> Animar <code>.floating-preview</code> para Opacity 0%.</li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-white">Mouse Move in Viewport:</strong>
                    Adicione na seção o gatilho <strong>Mouse move over element</strong> para mover <code>.floating-preview</code> nos eixos X e Y sincronizado com a posição do mouse.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 5: ESTRUTURA HTML/CSS/JS LIMPA */}
          {activeTab === 'html-code' && (
            <div className="space-y-6">
              <div className="border-b border-[#27272A] pb-4">
                <h3 className="font-display font-bold text-lg text-white">
                  Estrutura HTML/CSS/JavaScript Limpa
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
                  Código puro (vanilla), pronto para rodar em qualquer hospedagem estática ou template.
                </p>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-[#A1A1AA] uppercase">
                  index.html + script de hover flutuante
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      VANILLA_HTML_SNIPPET,
                      'Código HTML/CSS/JS',
                      'vanilla-code'
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs text-white hover:underline font-mono"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar Código Completo</span>
                </button>
              </div>

              <pre className="p-4 bg-black border border-[#27272A] rounded-lg font-mono text-xs text-[#D4D4D8] overflow-x-auto max-h-[360px]">
{VANILLA_HTML_SNIPPET}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VANILLA_HTML_SNIPPET = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>JPXSTUDIO - Design Gráfico & Identidade Visual</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Google Fonts: Syne & Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #050505;
      color: #E4E4E7;
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 0 5%;
    }
    header {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #27272A;
    }
    .logo {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 24px;
      color: #FFFFFF;
      text-decoration: none;
    }
    nav a {
      color: #A1A1AA;
      text-decoration: none;
      margin-left: 24px;
      font-size: 14px;
      transition: color 0.2s;
    }
    nav a:hover { color: #FFFFFF; }
    .hero {
      padding: 100px 0 60px;
    }
    .hero h1 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(3rem, 8vw, 6rem);
      font-weight: 800;
      color: #FFFFFF;
      line-height: 0.95;
    }
    .hero p {
      margin-top: 20px;
      max-width: 600px;
      font-size: 18px;
      color: #A1A1AA;
      line-height: 1.6;
    }
    /* Projetos & Hover Image Effect */
    .projects-list {
      margin-top: 60px;
      border-top: 1px solid #27272A;
      position: relative;
    }
    .project-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 0;
      border-bottom: 1px solid #27272A;
      cursor: pointer;
      text-decoration: none;
    }
    .project-name {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.8rem, 4vw, 3rem);
      font-weight: 700;
      color: #A1A1AA;
      transition: color 0.3s, transform 0.3s;
    }
    .project-item:hover .project-name {
      color: #FFFFFF;
      transform: translateX(10px);
    }
    .project-meta {
      font-size: 14px;
      color: #71717A;
    }
    /* Imagem Flutuante */
    .floating-preview {
      position: fixed;
      width: 320px;
      height: 240px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.2);
      pointer-events: none;
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
      transition: opacity 0.25s ease, transform 0.25s ease;
      z-index: 100;
      background-size: cover;
      background-position: center;
    }
    .floating-preview.active {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  </style>
</head>
<body>
  <header>
    <a href="#" class="logo">JPXSTUDIO</a>
    <nav>
      <a href="#projetos">Projetos</a>
      <a href="#sobre">Sobre</a>
      <a href="#contato">Contato</a>
    </nav>
  </header>

  <section class="hero">
    <h1>JPXSTUDIO</h1>
    <p>Estúdio de design gráfico focado em soluções visuais criativas, identidade visual e projetos de alto padrão.</p>
  </section>

  <section id="projetos" class="projects-list">
    <div class="project-item" data-img="https://placehold.co/600x400/18181b/ffffff?text=AURA+APOTHECARY">
      <span class="project-name">AURA APOTHECARY</span>
      <span class="project-meta">Identidade Visual · 2025</span>
    </div>
    <div class="project-item" data-img="https://placehold.co/600x400/18181b/ffffff?text=KINETIC+ARCHIVE">
      <span class="project-name">KINETIC ARCHIVE</span>
      <span class="project-meta">Design Editorial · 2025</span>
    </div>
  </section>

  <!-- Container da imagem flutuante -->
  <div id="preview" class="floating-preview"></div>

  <script>
    const preview = document.getElementById('preview');
    const items = document.querySelectorAll('.project-item');

    window.addEventListener('mousemove', (e) => {
      preview.style.left = e.clientX + 'px';
      preview.style.top = e.clientY + 'px';
    });

    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const imgUrl = item.getAttribute('data-img');
        preview.style.backgroundImage = 'url(' + imgUrl + ')';
        preview.classList.add('active');
      });
      item.addEventListener('mouseleave', () => {
        preview.classList.remove('active');
      });
    });
  </script>
</body>
</html>`;
