import React, { useState } from 'react';
import { Menu, X, Lock } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenDesignSystem?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/90 backdrop-blur-md border-b border-[#27272A] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tighter whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
        >
          JPXSTUDIO
        </a>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A1A1AA]">
          <button
            onClick={() => scrollTo('projetos')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Projetos
          </button>
          <button
            onClick={() => scrollTo('sobre')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Sobre
          </button>
          <button
            onClick={() => scrollTo('especialidades')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Especialidades
          </button>
          <button
            onClick={() => scrollTo('contato')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Contato
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Iniciar Projeto) + Cadeado Cinza */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => scrollTo('contato')}
            className="px-4 py-2 text-xs font-semibold text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0"
          >
            Iniciar Projeto
          </button>
          <button
            onClick={onOpenAdmin}
            className="p-2 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 transition-colors group shrink-0"
            title="Acesso Administrativo (Editar Projetos & Logo)"
            aria-label="Acesso Administrativo aos Projetos e Logo"
          >
            <Lock className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Mobile Action + Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 bg-zinc-900/80"
            title="Acesso Administrativo"
            aria-label="Acesso Administrativo"
          >
            <Lock className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#A1A1AA] hover:text-white rounded-lg"
            aria-label="Alternar Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#27272A] bg-[#0A0A0C] px-6 py-6 space-y-4 animate-fadeIn">
          <button
            onClick={() => scrollTo('projetos')}
            className="block w-full text-left font-display font-bold text-lg text-white"
          >
            Projetos
          </button>
          <button
            onClick={() => scrollTo('sobre')}
            className="block w-full text-left font-display font-bold text-lg text-white"
          >
            Sobre
          </button>
          <button
            onClick={() => scrollTo('especialidades')}
            className="block w-full text-left font-display font-bold text-lg text-white"
          >
            Especialidades
          </button>
          <button
            onClick={() => scrollTo('contato')}
            className="block w-full text-left font-display font-bold text-lg text-white"
          >
            Contato
          </button>
          <div className="pt-4 border-t border-[#27272A] flex items-center gap-2">
            <button
              onClick={() => scrollTo('contato')}
              className="flex-1 py-2.5 text-xs font-semibold text-center text-black bg-white rounded-lg"
            >
              Iniciar Projeto
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="p-2.5 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center shrink-0"
              title="Acesso Administrativo"
              aria-label="Acesso Administrativo"
            >
              <Lock className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
