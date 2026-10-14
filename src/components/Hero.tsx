import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Sparkles,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { Project, getProjectImages } from '../types';
import { JPX_PROJECTS } from '../data/portfolioData';
import { ProjectArtCanvas } from './ProjectArtCanvas';

interface HeroProps {
  projects?: Project[];
  customLogoUrl?: string | null;
  onScrollToProjects: () => void;
  onScrollToContact: () => void;
  onOpenProject: (project: Project) => void;
}

export const Hero: React.FC<HeroProps> = ({
  projects = JPX_PROJECTS,
  customLogoUrl,
  onScrollToProjects,
  onScrollToContact,
  onOpenProject,
}) => {
  // Artes para o fundo destacado no celular (2 colunas, como na Imagem 2)
  const mobileBgProjects = useMemo(() => {
    if (!projects || projects.length === 0) return JPX_PROJECTS;
    let list = [...projects];
    while (list.length < 6) {
      list = [...list, ...projects];
    }
    return list.slice(0, 6);
  }, [projects]);

  // Desktop PC: projetos de artes verticais (priorizando artes 1920x1080 para formato retangular alto igual aos trabalhos)
  const desktopArts = useMemo(() => {
    if (!projects || projects.length === 0) return JPX_PROJECTS;
    const artes1920 = projects.filter(
      (p) => p.aspectRatio === '1920x1080' || p.category === 'Artes 1920x1080'
    );
    const matchdays = projects.filter(
      (p) => !artes1920.some((a) => a.id === p.id) && p.category !== 'Site'
    );
    const sites = projects.filter((p) => p.category === 'Site');
    const ordered = [...artes1920, ...matchdays, ...sites];
    return ordered.length > 0 ? ordered : JPX_PROJECTS;
  }, [projects]);

  const [desktopArtIndex, setDesktopArtIndex] = useState(0);
  const currentDesktopProject = desktopArts[desktopArtIndex] || desktopArts[0] || JPX_PROJECTS[0];

  const handlePrevDesktopArt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDesktopArtIndex((prev) => (prev > 0 ? prev - 1 : desktopArts.length - 1));
  };

  const handleNextDesktopArt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDesktopArtIndex((prev) => (prev < desktopArts.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="relative pt-3 pb-8 md:pt-12 md:pb-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* ==============================================================
          MOBILE-ONLY HERO (COMO A IMAGEM 2: TRABALHOS NO FUNDO + JPX STUDIO)
          ============================================================== */}
      <div className="md:hidden relative w-full min-h-[82vh] flex flex-col justify-center items-center overflow-hidden rounded-2xl border border-[#27272A]/60 bg-[#0A0A0C] my-1 shadow-2xl">
        {/* Grade de 2 colunas com os trabalhos no fundo */}
        <div className="absolute inset-0 grid grid-cols-2 gap-2 p-2 pointer-events-auto opacity-70">
          {mobileBgProjects.map((p, idx) => (
            <div
              key={`mob-${p.id}-${idx}`}
              onClick={() => onOpenProject(p)}
              className="relative w-full aspect-[9/14] rounded-xl overflow-hidden bg-[#0A0A0C] border border-white/5 shadow-md group cursor-pointer"
            >
              {p.customImageUrl ? (
                <img
                  src={p.customImageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <ProjectArtCanvas project={p} />
              )}
            </div>
          ))}
        </div>

        {/* Camada de atmosfera escura (gradiente suave como a Imagem 2) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/85 via-black/45 to-[#050505] pointer-events-none" />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Nome do estúdio no centro */}
        <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          {customLogoUrl ? (
            <img
              src={customLogoUrl}
              alt="JPX Studio"
              className="h-16 w-auto object-contain max-w-[240px] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]"
            />
          ) : (
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              JPX Studio
            </h1>
          )}
        </div>

        {/* Botão sutil para rolar para a galeria */}
        <button
          onClick={onScrollToProjects}
          className="absolute bottom-5 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 hover:bg-black backdrop-blur-md border border-white/20 text-xs font-medium text-white shadow-xl transition-transform active:scale-95"
        >
          <span>Ver Trabalhos</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </div>

      {/* ==============================================================
          DESKTOP-ONLY HERO (RETÂNGULO VERTICAL 1080×1920 IGUAL AOS TRABALHOS)
          ============================================================== */}
      <div className="hidden md:flex flex-col justify-between min-h-[85vh]">
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

            {/* Action CTAs & Quick Micro-Navigation - Direto para WhatsApp (77) 98167-7054 */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onScrollToProjects}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-sans font-semibold text-xs rounded-lg hover:bg-[#E4E4E7] transition-all"
              >
                <span>Explorar Trabalhos</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/5577981677054?text=Ol%C3%A1%20JPX%20Studio!%20Gostaria%20de%20iniciar%20um%20projeto."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-bold text-xs rounded-lg transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                title="Falar direto no WhatsApp (77) 98167-7054"
              >
                <MessageCircle className="w-4 h-4 fill-black text-black" />
                <span>Iniciar no WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Featured Studio Visual Card - FORMATO VERTICAL 1080×1920 IGUAL AOS TRABALHOS (SEM FORMATO QUADRADO!) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            {(() => {
              const project = currentDesktopProject;
              const featImages = getProjectImages(project);
              const featActiveImage = featImages[0] || project.customImageUrl;
              const isContain = project.fitMode === 'contain';

              return (
                <div
                  onClick={() => onOpenProject(project)}
                  className="group relative cursor-pointer w-full max-w-[275px] xl:max-w-[305px] rounded-2xl overflow-hidden border border-[#27272A] bg-[#0A0A0C] hover:border-emerald-400/60 hover:shadow-2xl hover:shadow-emerald-950/40 transition-all duration-300 flex flex-col justify-between shadow-2xl select-none"
                >
                  {/* Retângulo Vertical no mesmo estilo 1080×1920 dos trabalhos (Formato de Cartaz / Flyer Alto) */}
                  <div
                    style={{ aspectRatio: '1080 / 1920' }}
                    className="w-full bg-[#0A0A0C] overflow-hidden relative flex items-center justify-center border-b border-zinc-900 select-none"
                  >
                    {featActiveImage ? (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-35 pointer-events-none transition-transform duration-700 group-hover:scale-135"
                          style={{ backgroundImage: `url(${featActiveImage})` }}
                          aria-hidden="true"
                        />
                        <div className="absolute inset-0 bg-black/25 pointer-events-none" aria-hidden="true" />
                        <img
                          src={featActiveImage}
                          alt={project.title}
                          className={`relative z-10 w-full h-full ${
                            isContain ? 'object-contain' : 'object-cover'
                          } transition-transform duration-500 group-hover:scale-105 drop-shadow-xl`}
                        />
                      </>
                    ) : (
                      <ProjectArtCanvas project={project} isHovered={true} />
                    )}

                    {/* Badge 1920x1080 evidente no Topo Esquerdo */}
                    <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-400 flex items-center gap-1 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      <span className="font-semibold tracking-wide">
                        {project.aspectRatio === '1920x1080'
                          ? '1920×1080'
                          : project.aspectRatio || '1920×1080'}
                      </span>
                    </div>

                    {/* Badge de Múltiplas Imagens deste projeto */}
                    {featImages.length > 1 && (
                      <div className="absolute top-3 right-3 z-20 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-md border border-white/20 text-[9px] font-mono text-zinc-200 flex items-center gap-1 shadow-md">
                        <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />
                        <span>1/{featImages.length}</span>
                      </div>
                    )}

                    {/* Botões para alternar trabalho na prévia do PC */}
                    {desktopArts.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevDesktopArt}
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl cursor-pointer"
                          title="Trabalho anterior"
                          aria-label="Trabalho anterior"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextDesktopArt}
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl cursor-pointer"
                          title="Próximo trabalho"
                          aria-label="Próximo trabalho"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Hover Action Circle */}
                    <div className="hidden sm:flex absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/20 items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110 z-20 shadow-xl">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Informações da Arte no Rodapé do Card (Idêntico ao Card1920 dos Trabalhos) */}
                  <div className="p-3.5 bg-[#0A0A0C]">
                    <div className="flex items-center gap-2 text-xs text-[#A1A1AA] mb-1 truncate">
                      <span className="font-mono text-white text-[10px]">{project.year}</span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-900/50 text-[9px] font-semibold text-emerald-300 uppercase tracking-wider truncate">
                        {project.category || '1920×1080'}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-white group-hover:text-emerald-400 transition-colors truncate leading-tight">
                      {project.title}
                    </h3>
                    {project.tagline && (
                      <p className="mt-1 text-[11px] text-[#A1A1AA] line-clamp-2">
                        {project.tagline}
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
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
      </div>
    </section>
  );
};
