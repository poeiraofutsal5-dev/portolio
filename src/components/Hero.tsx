import React from 'react';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { Project } from '../types';
import { JPX_PROJECTS } from '../data/portfolioData';
import { ProjectArtCanvas } from './ProjectArtCanvas';

interface HeroProps {
  projects?: Project[];
  onScrollToProjects: () => void;
  onScrollToContact: () => void;
  onOpenProject: (project: Project) => void;
}

export const Hero: React.FC<HeroProps> = ({
  projects = JPX_PROJECTS,
  onScrollToProjects,
  onScrollToContact,
  onOpenProject,
}) => {
  const featuredProject = projects[0] || JPX_PROJECTS[0];

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Subtle Architectural Grid & Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-stone-900/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Main Hero Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-4 md:pt-8">
        {/* Left Column: Typographic Hierarchy */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            {/* Editorial Kicker */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] tracking-wider uppercase mb-3">
              <span>ITUAÇU-BA</span>
              <span aria-hidden="true">·</span>
              <span className="text-white">DESIGNER GRÁFICO</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05] text-balance">
              Soluções Visuais de Alto Padrão
            </h1>

            {/* Persuasive Lead Copy */}
            <p className="mt-4 text-base sm:text-lg text-[#A1A1AA] max-w-xl font-sans leading-relaxed">
              Criamos sistemas de design que transformam marcas em referências de sofisticação e autoridade, com tipografia de alto impacto e acabamentos táteis impecáveis.
            </p>
          </div>

          {/* Action CTAs & Quick Micro-Navigation */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onScrollToProjects}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-sans font-semibold text-xs rounded-lg hover:bg-[#E4E4E7] transition-all"
            >
              <span>Explorar Trabalhos</span>
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={onScrollToContact}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#121215] text-white border border-[#27272A] font-sans font-medium text-xs rounded-lg hover:border-zinc-500 transition-colors"
            >
              <span>Iniciar Projeto</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Featured Studio Visual Card (Compact & Balanced) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div
            onClick={() => onOpenProject(featuredProject)}
            className="group relative cursor-pointer w-full max-w-md mx-auto lg:max-w-none rounded-xl overflow-hidden border border-[#27272A] bg-[#0A0A0C] hover:border-zinc-500 transition-all duration-300 shadow-xl flex flex-col"
          >
            {/* Visual Canvas Artwork */}
            <div className="relative w-full aspect-[16/10] bg-[#0A0A0C] overflow-hidden flex items-center justify-center">
              {featuredProject.customImageUrl ? (
                <>
                  {/* Ambient blurred background of the custom image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-45 pointer-events-none transition-transform duration-700 group-hover:scale-130"
                    style={{ backgroundImage: `url(${featuredProject.customImageUrl})` }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-black/35 pointer-events-none" aria-hidden="true" />
                  {/* Proportional sharp image */}
                  <img
                    src={featuredProject.customImageUrl}
                    alt={featuredProject.title}
                    className="relative z-10 w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                </>
              ) : (
                <ProjectArtCanvas project={featuredProject} isHovered={true} />
              )}
              {/* Overlay Tag */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[9px] font-mono text-[#D4D4D8] bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 pointer-events-none">
                <span>PROJETO EM DESTAQUE</span>
                <span aria-hidden="true">·</span>
                <span>{featuredProject.year}</span>
              </div>
            </div>

            {/* Bottom Card Bar */}
            <div className="p-4 border-t border-[#27272A] bg-[#0c0c0e] flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <h3 className="font-display font-bold text-base text-white group-hover:text-[#F4F4F5] truncate">
                  {featuredProject.title}
                </h3>
                <p className="text-xs text-[#A1A1AA] truncate">
                  {featuredProject.category} · {featuredProject.client}
                </p>
              </div>
              <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Quantitative Rigor Row (3 Columns: +4 Anos, +60 Projetos, Ituaçu-BA) */}
      <div className="mt-16 pt-8 border-t border-[#27272A] grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
            +4 ANOS
          </div>
          <div className="mt-1 text-xs text-[#A1A1AA] font-sans">
            Experiência em Design Gráfico
          </div>
        </div>

        <div>
          <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
            +60
          </div>
          <div className="mt-1 text-xs text-[#A1A1AA] font-sans">
            Projetos Entregues
          </div>
        </div>

        <div>
          <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            ITUAÇU-BA
          </div>
          <div className="mt-1 text-xs text-[#A1A1AA] font-sans">
            Base Criativa & Atendimento
          </div>
        </div>
      </div>
    </section>
  );
};
