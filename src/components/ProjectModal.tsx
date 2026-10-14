import React, { useEffect } from 'react';
import { Project } from '../types';
import { ProjectArtCanvas } from './ProjectArtCanvas';
import { X, ArrowUpRight, Copy, Check, Maximize2 } from 'lucide-react';

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
  const [copiedHex, setCopiedHex] = React.useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
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
  }, [project, onClose]);

  if (!project) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-[#0A0A0C] border border-[#27272A] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#0c0c0e]">
          <div className="flex items-center gap-3 text-xs text-[#A1A1AA] flex-wrap">
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
            <span>{project.client}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Main Visual Artwork Container with Ambient Blurred Background */}
          {project.customImageUrl ? (
            <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-[#27272A] bg-[#0A0A0C] flex items-center justify-center p-3 sm:p-4 group shadow-2xl min-h-[220px]">
              {/* Blurred background from the same image eliminating lateral black bars */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-2xl scale-125 opacity-45 pointer-events-none transition-transform duration-700"
                style={{ backgroundImage: `url(${project.customImageUrl})` }}
                aria-hidden="true"
              />
              {/* Soft dark overlay to ensure maximum contrast and visual focus */}
              <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true" />

              {/* Sharp, proportional foreground image */}
              <img
                src={project.customImageUrl}
                alt={project.title}
                className="relative z-10 w-auto max-w-full h-auto max-h-[50vh] object-contain rounded-lg block mx-auto shadow-2xl"
              />
              <a
                href={project.customImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-black/75 hover:bg-black text-white/80 hover:text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Abrir imagem em tamanho original"
              >
                <Maximize2 className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="w-full max-w-2xl mx-auto aspect-[16/10] max-h-[360px] rounded-xl overflow-hidden border border-[#27272A] bg-black">
              <ProjectArtCanvas project={project} />
            </div>
          )}

          {/* Title & Tagline */}
          <div>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight">
              {project.title}
            </h2>
            <p className="mt-2 text-base md:text-lg text-[#D4D4D8] font-sans">
              {project.tagline}
            </p>
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#27272A]">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-2">
                O Desafio
              </h3>
              <p className="text-sm text-[#D4D4D8] leading-relaxed font-sans">
                {project.challenge}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-2">
                A Abordagem & Solução
              </h3>
              <p className="text-sm text-[#D4D4D8] leading-relaxed font-sans">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Deliverables Checklist */}
          <div className="pt-4 border-t border-[#27272A]">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-3">
              Entregáveis do Projeto
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#E4E4E7]">
              {project.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E4E4E7]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography & Palette Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#27272A]">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-2">
                Tipografia Empregada
              </h3>
              <div className="p-3 bg-[#121215] border border-[#27272A] rounded-md font-mono text-xs text-white">
                {project.typography}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-2">
                Paleta Cromática do Projeto (Clique para copiar)
              </h3>
              <div className="flex items-center gap-2">
                {project.palette.map((hex, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyColor(hex)}
                    title={`Copiar ${hex}`}
                    className="group relative flex-1 h-10 rounded border border-white/10 transition-transform hover:scale-105 overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: hex }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 bg-black/80 px-1 py-0.5 rounded text-[9px] font-mono text-white transition-opacity">
                      {copiedHex === hex ? 'Copiado!' : hex}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#A1A1AA]">
              Pronto para elevar o padrão visual da sua marca?
            </span>
            <button
              onClick={handleStartSimilar}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black font-sans font-semibold text-xs rounded-lg hover:bg-zinc-200 transition-colors"
            >
              <span>Iniciar Projeto Semelhante</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
