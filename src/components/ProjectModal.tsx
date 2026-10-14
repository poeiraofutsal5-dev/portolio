import React, { useEffect, useState, useRef } from 'react';
import { Project, getProjectImages } from '../types';
import { ProjectArtCanvas } from './ProjectArtCanvas';
import {
  X,
  ArrowUpRight,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  MessageCircle,
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProjectForContact?: (projectName: string) => void;
  onShowToast: (message: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSelectProjectForContact,
  onShowToast,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Touch tracking for mobile swipe navigation between images of this project
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Compute all available images for this project
  const images = project ? getProjectImages(project) : [];
  const hasMultipleImages = images.length > 1;

  // Reset image index whenever a different project is opened
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project?.id]);

  // Image navigation handlers - ONLY cycle images of THIS project, never jump projects!
  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard navigation (Esc to close, Left/Right arrow to cycle images of this project)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        handlePrevImage();
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        handleNextImage();
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, images.length, onClose]);

  if (!project) return null;

  // Mobile swipe gestures - swipe through images of this project
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const activeImageUrl = images[currentImageIndex] || project.customImageUrl;

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    onShowToast(`Código HEX copiado: ${hex}`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleStartSimilar = () => {
    if (onSelectProjectForContact) {
      onSelectProjectForContact(project.title);
    }
    onClose();
    const contactElem = document.getElementById('contato');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-[#0A0A0C] border border-[#27272A] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#27272A] bg-[#0c0c0e]">
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#A1A1AA] flex-wrap">
            <span className="font-mono text-[#F4F4F5]">{project.year}</span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-200 font-semibold">{project.category}</span>
            <span aria-hidden="true">·</span>
            <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">
              {project.aspectRatio === '1350x1080'
                ? '1350×1080'
                : project.aspectRatio === '1920x1080'
                ? '1920×1080'
                : project.aspectRatio || '4:3'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[140px] sm:max-w-xs">{project.client}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* Main Visual Artwork Container with Side Navigation Buttons */}
          {activeImageUrl ? (
            <div className="space-y-3">
              <div
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-[#27272A] bg-[#0A0A0C] flex items-center justify-center p-2 sm:p-4 group shadow-2xl min-h-[220px] select-none"
              >
                {/* Ambient blurred glow from active image */}
                <div
                  key={activeImageUrl}
                  className="absolute inset-0 bg-cover bg-center filter blur-2xl scale-125 opacity-45 pointer-events-none transition-all duration-500"
                  style={{ backgroundImage: `url(${activeImageUrl})` }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true" />

                {/* Sharp foreground image */}
                <img
                  key={`img-${currentImageIndex}`}
                  src={activeImageUrl}
                  alt={`${project.title} - Imagem ${currentImageIndex + 1}`}
                  className="relative z-10 w-auto max-w-full h-auto max-h-[50vh] object-contain rounded-lg block mx-auto shadow-2xl transition-all duration-300 animate-fadeIn"
                />

                {/* BOTÕES LATERAIS PARA PASSAR IMAGENS DO PROJETO */}
                {hasMultipleImages && (
                  <>
                    {/* Botão Lateral Esquerdo (Voltar imagem deste projeto) */}
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/85 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer group/btn"
                      aria-label="Imagem anterior deste projeto"
                      title="Imagem anterior"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
                    </button>

                    {/* Botão Lateral Direito (Avançar imagem deste projeto) */}
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/85 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer group/btn"
                      aria-label="Próxima imagem deste projeto"
                      title="Próxima imagem"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </>
                )}

                {/* Badge de contagem de imagens deste projeto */}
                {hasMultipleImages && (
                  <div className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 z-20 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-mono text-zinc-200 flex items-center gap-1.5 shadow-xl">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      Imagem {currentImageIndex + 1} de {images.length}
                    </span>
                  </div>
                )}

                {/* Expand image button */}
                <a
                  href={activeImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-20 p-1.5 rounded-lg bg-black/75 hover:bg-black text-white/80 hover:text-white backdrop-blur-md border border-white/10 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Abrir imagem em tamanho original"
                >
                  <Maximize2 className="w-4 h-4" />
                </a>
              </div>

              {/* Miniaturas das imagens deste projeto (para clicar e ir direto) */}
              {hasMultipleImages && (
                <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer ${
                        idx === currentImageIndex
                          ? 'border-white scale-105 shadow-md shadow-white/30 ring-2 ring-white/60'
                          : 'border-white/15 opacity-40 hover:opacity-90 hover:border-white/40'
                      }`}
                      style={{ width: 48, height: 48 }}
                      title={`Ir para imagem ${idx + 1}`}
                      aria-label={`Ver imagem ${idx + 1}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[7px] font-mono text-center text-white/90 py-0.2">
                          Capa
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-2xl mx-auto aspect-[16/10] max-h-[360px] rounded-xl overflow-hidden border border-[#27272A] bg-black">
              <ProjectArtCanvas project={project} />
            </div>
          )}

          {/* Title & Tagline */}
          <div className="space-y-2 border-b border-[#27272A] pb-6">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
              {project.tagline}
            </p>
          </div>

          {/* Project Details Grid (Challenge & Solution) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#27272A] pb-6">
            <div className="space-y-2">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Desafio
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {project.challenge || project.description}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Solução Visual
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {project.solution || 'Desenvolvimento com alto rigor estético, contraste cinematográfico e precisão visual.'}
              </p>
            </div>
          </div>

          {/* Deliverables */}
          {project.deliverables && project.deliverables.length > 0 && (
            <div className="space-y-3 border-b border-[#27272A] pb-6">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Entregáveis Desenvolvidos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#141418] border border-[#27272A] text-xs text-zinc-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Palette & Typography */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-[#27272A] pb-6">
            {project.palette && project.palette.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Paleta HEX (Clique para copiar)
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {project.palette.map((hex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => copyColor(hex)}
                      className="group relative flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-[#141418] border border-[#27272A] hover:border-zinc-500 transition-colors"
                      title={`Copiar ${hex}`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-[11px] font-mono text-zinc-300">
                        {hex}
                      </span>
                      {copiedHex === hex && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-white text-black text-[9px] font-mono whitespace-nowrap shadow-md">
                          Copiado!
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {project.typography && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Tipografia
                </h3>
                <div className="p-2.5 rounded-lg bg-[#141418] border border-[#27272A] text-xs font-mono text-zinc-300">
                  {project.typography}
                </div>
              </div>
            )}
          </div>

          {/* CTA Footer inside modal - Direciona para o WhatsApp (77) 98167-7054 */}
          <div className="pt-3 border-t border-[#27272A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-[#A1A1AA]">
                Interessado em um projeto com esse nível de acabamento?
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  Atendimento direto no WhatsApp: (77) 98167-7054
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <a
                href={`https://wa.me/5577981677054?text=${encodeURIComponent(
                  `Olá JPX Studio! Gostei muito do projeto "${project.title}" (${project.category || 'Design'}) e gostaria de solicitar um orçamento para um projeto nesse padrão.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                title="Abrir WhatsApp (77) 98167-7054"
              >
                <MessageCircle className="w-4 h-4 fill-black text-black" />
                <span>Solicitar Orçamento no WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleStartSimilar}
                className="px-3.5 py-2 rounded-xl bg-[#141418] hover:bg-[#1E1E24] text-zinc-300 hover:text-white border border-[#27272A] text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Preencher briefing pelo formulário do site"
              >
                <span>Briefing no Site</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
