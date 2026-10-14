import React, { useState, useMemo } from 'react';
import { Project, getProjectImages } from '../types';
import { JPX_PROJECTS } from '../data/portfolioData';
import { ProjectArtCanvas } from './ProjectArtCanvas';
import {
  ArrowUpRight,
  Globe,
  Layout,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';

interface ProjectsSectionProps {
  projects?: Project[];
  onOpenProject: (project: Project) => void;
}

/**
 * Categorization helpers:
 * 1. isSiteProject: identifies pure web & site projects (never mixed with graphic arts)
 * 2. is1350x1080Art: vertical / 1350x1080 matchdays & cartazes (3 per row)
 * 3. is1920x1080Art: horizontal widescreen 1920x1080 graphic arts (4 per row)
 */
export const isSiteProject = (project: Project): boolean => {
  const cat = (project.category || '').toLowerCase().trim();
  const title = (project.title || '').toLowerCase().trim();
  return (
    cat === 'site' ||
    cat.includes('site') ||
    cat.includes('web') ||
    title.startsWith('site ') ||
    title.includes('portal ') ||
    title.includes('landing page')
  );
};

export const is1350x1080Art = (project: Project): boolean => {
  if (isSiteProject(project)) return false;
  const ar = (project.aspectRatio || '').toLowerCase().trim();
  const cat = (project.category || '').toLowerCase().trim();

  if (
    ar === '1350x1080' ||
    ar === '1080x1350' ||
    ar.includes('1350') ||
    ar === '4:5' ||
    ar === '4/5' ||
    ar === '1080x1080' ||
    ar === '1:1'
  ) {
    return true;
  }
  if (cat === 'matchday') {
    return true;
  }
  return false;
};

export const is1920x1080Art = (project: Project): boolean => {
  if (isSiteProject(project)) return false;
  if (is1350x1080Art(project)) return false;
  return true;
};

/* =========================================================================
   PROJECT CARD - 1350x1080 (VERTICAL 4:5 · 4 POR FILA NO CELULAR E PC)
   ========================================================================= */
const Card1350: React.FC<{
  project: Project;
  onOpenProject: (project: Project) => void;
}> = ({ project, onOpenProject }) => {
  const isCover = project.fitMode === 'cover';
  const images = getProjectImages(project);
  const activeImageUrl = images[0] || project.customImageUrl;

  return (
    <div
      onClick={() => onOpenProject(project)}
      className="group cursor-pointer bg-[#0A0A0C] border border-[#27272A] rounded-lg sm:rounded-xl overflow-hidden hover:border-zinc-400 hover:shadow-2xl hover:shadow-black/70 transition-all duration-300 flex flex-col justify-between"
    >
      {/* 1350x1080 Visual Container (Aspect 1080 / 1350) - Forma Mantida */}
      <div
        style={{ aspectRatio: '1080 / 1350' }}
        className="w-full bg-[#0A0A0C] overflow-hidden relative flex items-center justify-center border-b border-zinc-900 select-none"
      >
        {activeImageUrl ? (
          <>
            {/* Ambient blurred glow from the custom image */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-35 pointer-events-none transition-transform duration-700 group-hover:scale-135"
              style={{ backgroundImage: `url(${activeImageUrl})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/25 pointer-events-none" aria-hidden="true" />
            <img
              src={activeImageUrl}
              alt={project.title}
              className={`relative z-10 w-full h-full ${
                isCover ? 'object-cover' : 'object-contain'
              } transition-transform duration-500 group-hover:scale-105 drop-shadow-xl`}
            />
          </>
        ) : (
          <ProjectArtCanvas project={project} isHovered={true} />
        )}

        {/* Badge 1350x1080 */}
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-20 px-1 py-0.2 sm:px-2 sm:py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/15 text-[7px] sm:text-[10px] font-mono text-zinc-300 flex items-center gap-1 shadow-md">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber-400 inline-block" />
          <span className="hidden sm:inline">1350×1080</span>
          <span className="sm:hidden">1350</span>
        </div>

        {/* Badge de múltiplas imagens */}
        {images.length > 1 && (
          <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-20 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-black/85 backdrop-blur-md border border-white/20 text-[7px] sm:text-[9px] font-mono text-zinc-200 flex items-center gap-1 shadow-md">
            <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />
            <span>
              1/{images.length}
            </span>
          </div>
        )}

        {/* Hover Action Circle */}
        <div className="hidden sm:flex absolute top-3 right-3 w-8 h-8 rounded-full bg-black/75 backdrop-blur-sm border border-white/20 items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Card Info */}
      <div className="p-1.5 sm:p-4 md:p-5">
        <div className="flex items-center gap-1 sm:gap-2 text-[7.5px] sm:text-xs text-[#A1A1AA] mb-0.5 sm:mb-2 truncate">
          <span className="font-mono text-white text-[7.5px] sm:text-[11px]">{project.year}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-zinc-800 text-[6.5px] sm:text-[10px] font-medium text-zinc-300 uppercase tracking-wider truncate">
            {project.category}
          </span>
        </div>
        <h3 className="font-display font-bold text-[9px] sm:text-base md:text-lg text-white group-hover:text-[#F4F4F5] transition-colors truncate leading-tight">
          {project.title}
        </h3>
        {project.tagline && (
          <p className="hidden sm:block mt-1 text-xs text-[#A1A1AA] line-clamp-2">
            {project.tagline}
          </p>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   PROJECT CARD - 1920x1080 (RETÂNGULO VERTICAL 1080×1920 · 4 POR FILA NO CELULAR E PC)
   ========================================================================= */
const Card1920: React.FC<{
  project: Project;
  onOpenProject: (project: Project) => void;
}> = ({ project, onOpenProject }) => {
  const isContain = project.fitMode === 'contain';
  const images = getProjectImages(project);
  const activeImageUrl = images[0] || project.customImageUrl;

  return (
    <div
      onClick={() => onOpenProject(project)}
      className="group cursor-pointer bg-[#0A0A0C] border border-[#27272A] rounded-lg sm:rounded-2xl overflow-hidden hover:border-emerald-400/60 hover:shadow-2xl hover:shadow-emerald-950/40 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Retângulo Vertical (Flyer / Stories 1080 / 1920 = 9:16) - Forma Mantida */}
      <div
        style={{ aspectRatio: '1080 / 1920' }}
        className="w-full bg-[#0A0A0C] overflow-hidden relative flex items-center justify-center border-b border-zinc-900 select-none"
      >
        {activeImageUrl ? (
          <>
            <img
              src={activeImageUrl}
              alt={project.title}
              className={`relative z-10 w-full h-full ${
                isContain ? 'object-contain' : 'object-cover'
              } transition-transform duration-500 group-hover:scale-105`}
            />
          </>
        ) : (
          <ProjectArtCanvas project={project} isHovered={true} />
        )}

        {/* Badge 1920x1080 evidente */}
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-20 px-1 py-0.2 sm:px-2 sm:py-0.5 rounded bg-black/85 backdrop-blur-md border border-emerald-500/40 text-[7px] sm:text-[10px] font-mono text-emerald-400 flex items-center gap-1 shadow-lg">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
          <span className="font-semibold tracking-wide hidden sm:inline">1920×1080</span>
          <span className="font-semibold tracking-wide sm:hidden">1920</span>
        </div>

        {/* Badge de múltiplas imagens */}
        {images.length > 1 && (
          <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-20 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-black/85 backdrop-blur-md border border-white/20 text-[7px] sm:text-[9px] font-mono text-zinc-200 flex items-center gap-1 shadow-md">
            <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />
            <span>
              1/{images.length}
            </span>
          </div>
        )}

        {/* Hover Action Circle */}
        <div className="hidden sm:flex absolute top-3 right-3 w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/20 items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110 z-20 shadow-xl">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Card Info */}
      <div className="p-1.5 sm:p-3.5 md:p-4 bg-[#0A0A0C]">
        <div className="flex items-center gap-1 sm:gap-2 text-[7.5px] sm:text-xs text-[#A1A1AA] mb-0.5 sm:mb-1.5 truncate">
          <span className="font-mono text-white text-[7.5px] sm:text-[10px]">{project.year}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.2 rounded bg-emerald-950/60 border border-emerald-900/50 text-[6.5px] sm:text-[9px] font-semibold text-emerald-300 uppercase tracking-wider truncate">
            {project.category || '1920×1080'}
          </span>
        </div>
        <h3 className="font-display font-bold text-[9px] sm:text-sm md:text-base text-white group-hover:text-emerald-400 transition-colors truncate leading-tight">
          {project.title}
        </h3>
        {project.tagline && (
          <p className="hidden sm:block mt-0.5 text-[11px] text-[#A1A1AA] line-clamp-2">
            {project.tagline}
          </p>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   PROJECT CARD - SITES & INTERFACES WEB (EMBAIXO DE 1920x1080 · 4 POR FILA NO CELULAR E PC)
   ========================================================================= */
const CardSite: React.FC<{
  project: Project;
  onOpenProject: (project: Project) => void;
}> = ({ project, onOpenProject }) => {
  const isCover = project.fitMode === 'cover';
  const images = getProjectImages(project);
  const activeImageUrl = images[0] || project.customImageUrl;

  return (
    <div
      onClick={() => onOpenProject(project)}
      className="group cursor-pointer bg-[#0A0A0C] border border-[#27272A] rounded-lg sm:rounded-xl overflow-hidden hover:border-zinc-400 hover:shadow-2xl hover:shadow-black/70 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Browser Bar Header */}
      <div className="px-1.5 py-1 sm:px-3 sm:py-2 bg-[#141418] border-b border-[#27272A] flex items-center justify-between gap-1 sm:gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/80 inline-block" />
        </div>
        <div className="flex items-center gap-1 px-1 py-0.2 sm:px-2.5 sm:py-0.5 rounded-md bg-black/60 border border-zinc-800 text-[6.5px] sm:text-[10px] font-mono text-zinc-400 truncate max-w-[90px] sm:max-w-[210px]">
          <Globe className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-zinc-500 shrink-0" />
          <span className="truncate">
            {project.client ? `${project.client.toLowerCase().replace(/\s+/g, '')}.com.br` : 'jpx.design/site'}
          </span>
        </div>
        <div className="w-2.5 sm:w-8 flex justify-end">
          <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-600" />
        </div>
      </div>

      {/* Visual Container (Widescreen 16:9 / 1920x1080 Web Mockup) - Forma Mantida */}
      <div
        style={{ aspectRatio: '1920 / 1080' }}
        className="w-full aspect-video bg-[#050507] overflow-hidden relative flex items-center justify-center border-b border-zinc-900 select-none"
      >
        {activeImageUrl ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-35 pointer-events-none transition-transform duration-700 group-hover:scale-135"
              style={{ backgroundImage: `url(${activeImageUrl})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" aria-hidden="true" />
            <img
              src={activeImageUrl}
              alt={project.title}
              className={`relative z-10 w-full h-full ${
                isCover ? 'object-cover' : 'object-contain'
              } transition-transform duration-500 group-hover:scale-105 drop-shadow-xl`}
            />
          </>
        ) : (
          <ProjectArtCanvas project={project} isHovered={true} />
        )}

        {/* Badge de múltiplas imagens */}
        {images.length > 1 && (
          <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-20 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-black/85 backdrop-blur-md border border-white/20 text-[7px] sm:text-[9px] font-mono text-zinc-200 flex items-center gap-1 shadow-md">
            <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />
            <span>
              1/{images.length}
            </span>
          </div>
        )}

        {/* Hover Action Circle */}
        <div className="hidden sm:flex absolute top-3 right-3 w-8 h-8 rounded-full bg-black/75 backdrop-blur-sm border border-white/20 items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Card Info */}
      <div className="p-1.5 sm:p-4 md:p-5">
        <div className="flex items-center gap-1 sm:gap-2 text-[7.5px] sm:text-xs text-[#A1A1AA] mb-0.5 sm:mb-2 truncate">
          <span className="font-mono text-white text-[7.5px] sm:text-[11px]">{project.year}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-blue-950/70 border border-blue-800/40 text-[6.5px] sm:text-[10px] font-medium text-blue-300 uppercase tracking-wider truncate">
            Site & Web
          </span>
        </div>
        <h3 className="font-display font-bold text-[9px] sm:text-base md:text-lg text-white group-hover:text-[#F4F4F5] transition-colors truncate leading-tight">
          {project.title}
        </h3>
        {project.tagline && (
          <p className="hidden sm:block mt-1 text-xs text-[#A1A1AA] line-clamp-2">
            {project.tagline}
          </p>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   PROJECTS SECTION MAIN COMPONENT
   ========================================================================= */
export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = JPX_PROJECTS,
  onOpenProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // FILA 1: Matchdays e artes verticais (1350x1080) -> 3 por fila
  const artes1350List = useMemo(() => {
    return projects.filter(is1350x1080Art);
  }, [projects]);

  // FILA 2: Artes no formato retangular 1920x1080 -> 4 por fila (NÃO inclui sites!)
  const artes1920List = useMemo(() => {
    return projects.filter(is1920x1080Art);
  }, [projects]);

  // FILA 3 (EMBAIXO DE 1920x1080): Sites exclusivos
  const sitesList = useMemo(() => {
    return projects.filter(isSiteProject);
  }, [projects]);

  // Available categories for filter buttons
  const availableCategories = useMemo(() => {
    const list = ['Todos', 'Matchday', 'Artes 1920x1080', 'Site'];
    const otherCats = new Set<string>();

    projects.forEach((p) => {
      const cat = p.category?.trim();
      if (
        cat &&
        cat !== 'Matchday' &&
        cat !== 'Site' &&
        cat !== 'Artes 1920x1080' &&
        cat !== 'Todos'
      ) {
        otherCats.add(cat);
      }
    });

    return [...list, ...Array.from(otherCats)];
  }, [projects]);

  // Filtered list when user picks a specific category
  const filteredList = useMemo(() => {
    if (selectedCategory === 'Todos') return projects;
    if (selectedCategory === 'Matchday') return artes1350List;
    if (selectedCategory === 'Artes 1920x1080') return artes1920List;
    if (selectedCategory === 'Site') return sitesList;

    return projects.filter(
      (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [projects, selectedCategory, artes1350List, artes1920List, sitesList]);

  return (
    <section id="projetos" className="py-12 md:py-24 px-2 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="pb-3 sm:pb-8 border-b border-[#27272A]">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[8.5px] sm:text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-0.5 sm:mb-2">
          <span>01</span>
          <span aria-hidden="true">·</span>
          <span>PROJETOS SELECIONADOS</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4">
          <h2 className="font-display font-extrabold text-lg sm:text-4xl md:text-5xl text-white tracking-tight">
            TRABALHOS
          </h2>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-3 sm:pt-8 pb-1 sm:pb-2 scrollbar-none">
          {availableCategories.map((cat) => {
            let count = 0;
            if (cat === 'Todos') count = projects.length;
            else if (cat === 'Matchday') count = artes1350List.length;
            else if (cat === 'Artes 1920x1080') count = artes1920List.length;
            else if (cat === 'Site') count = sitesList.length;
            else {
              count = projects.filter(
                (p) => p.category?.toLowerCase() === cat.toLowerCase()
              ).length;
            }

            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all duration-200 border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-black font-semibold border-white shadow-lg'
                    : 'bg-[#121216] text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[8.5px] sm:text-[10px] font-mono ${
                    isSelected ? 'bg-zinc-200 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pt-4 sm:pt-10 space-y-6 sm:space-y-20">
        {selectedCategory === 'Todos' ? (
          /* ==================================================================
             LAYOUT SEPARADO POR TAMANHO E TIPO EXATO:
             1. Primeira Fila: Artes 1350x1080 (4 por fila)
             2. Fila de 1920x1080: Artes Retangulares 1920x1080 (4 por fila)
             3. Embaixo de 1920x1080: Sites (separado de artes!)
             ================================================================== */
          <>
            {/* 1ª FILA: ARTES 1350x1080 (4 POR FILA) */}
            {artes1350List.length > 0 && (
              <div className="space-y-2.5 sm:space-y-5">
                <div className="flex items-center justify-between pb-1.5 sm:pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <h3 className="font-display font-bold text-xs sm:text-lg md:text-xl text-white tracking-tight">
                      MATCHDAYS & CARTAZES (1350×1080)
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 sm:gap-4 lg:gap-6">
                  {artes1350List.map((project) => (
                    <Card1350
                      key={project.id}
                      project={project}
                      onOpenProject={onOpenProject}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 2ª FILA: ARTES 1920x1080 (RETÂNGULOS VERTICAIS · 4 POR FILA) */}
            {artes1920List.length > 0 && (
              <div className="space-y-2.5 sm:space-y-6">
                <div className="flex items-center justify-between pb-1.5 sm:pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <h3 className="font-display font-bold text-xs sm:text-lg md:text-xl text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
                      <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      <span>ARTES 1920×1080</span>
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 sm:gap-4 lg:gap-6">
                  {artes1920List.map((project) => (
                    <Card1920
                      key={project.id}
                      project={project}
                      onOpenProject={onOpenProject}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 3ª FILA (EMBAIXO DE 1920x1080): SITES SEPARADOS (4 POR FILA) */}
            {sitesList.length > 0 && (
              <div className="space-y-2.5 sm:space-y-5">
                <div className="flex items-center justify-between pb-1.5 sm:pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <h3 className="font-display font-bold text-xs sm:text-lg md:text-xl text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
                      <Layout className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-400" />
                      <span>SITES & INTERFACES WEB</span>
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 sm:gap-4 lg:gap-6">
                  {sitesList.map((project) => (
                    <CardSite
                      key={project.id}
                      project={project}
                      onOpenProject={onOpenProject}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* ==================================================================
             CATEGORY FILTERED VIEW
             ================================================================== */
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1.5 sm:pb-3 border-b border-zinc-800/80">
              <h3 className="font-display font-bold text-xs sm:text-xl text-white tracking-tight flex items-center gap-2">
                <span>{selectedCategory}</span>
                <span className="text-[10px] sm:text-xs font-mono text-zinc-500 font-normal">
                  ({filteredList.length} {filteredList.length === 1 ? 'projeto' : 'projetos'})
                </span>
              </h3>
            </div>

            {filteredList.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-zinc-800 rounded-2xl bg-[#0A0A0C]">
                <p className="text-zinc-400 text-sm">
                  Nenhum projeto cadastrado na categoria <strong>{selectedCategory}</strong> ainda.
                </p>
                <p className="text-zinc-500 text-xs mt-1">
                  Abra o Painel Administrativo para cadastrar novos trabalhos nesta categoria.
                </p>
              </div>
            ) : selectedCategory === 'Site' ? (
              <div className="grid grid-cols-4 gap-1.5 sm:gap-4 lg:gap-6">
                {filteredList.map((project) => (
                  <CardSite
                    key={project.id}
                    project={project}
                    onOpenProject={onOpenProject}
                  />
                ))}
              </div>
            ) : selectedCategory === 'Artes 1920x1080' ? (
              <div className="grid grid-cols-4 gap-1.5 sm:gap-4 lg:gap-6">
                {filteredList.map((project) => (
                  <Card1920
                    key={project.id}
                    project={project}
                    onOpenProject={onOpenProject}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 sm:gap-4 lg:gap-6">
                {filteredList.map((project) => (
                  <Card1350
                    key={project.id}
                    project={project}
                    onOpenProject={onOpenProject}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
