import React from 'react';
import { Project } from '../types';

interface ProjectArtCanvasProps {
  project: Project;
  className?: string;
  isHovered?: boolean;
  fitMode?: 'cover' | 'contain' | 'natural';
}

export const ProjectArtCanvas: React.FC<ProjectArtCanvasProps> = ({
  project,
  className = '',
  isHovered = false,
  fitMode = 'cover',
}) => {
  // If user uploaded or specified a custom image for the project
  if (project.customImageUrl) {
    if (fitMode === 'contain' || fitMode === 'natural') {
      return (
        <div className={`relative w-full h-full min-h-[220px] overflow-hidden flex items-center justify-center bg-[#0A0A0C] ${className}`}>
          {/* Ambient blurred backdrop from the custom image */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-45 pointer-events-none"
            style={{ backgroundImage: `url(${project.customImageUrl})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/35 pointer-events-none" aria-hidden="true" />
          <img
            src={project.customImageUrl}
            alt={project.title}
            className="relative z-10 w-auto max-w-full h-auto max-h-[75vh] object-contain block rounded-lg shadow-2xl"
          />
        </div>
      );
    }

    return (
      <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
        <img
          src={project.customImageUrl}
          alt={project.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Bespoke high-end graphic design visual compositions for each project
  const renderArtwork = () => {
    switch (project.id) {
      case 'aura-apothecary':
        return (
          <div className="relative w-full h-full bg-[#0a0a0c] overflow-hidden flex items-center justify-center p-8 select-none">
            {/* Subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(168,159,145,0.15),transparent_70%)]" />
            
            {/* Background geometric grid lines */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            {/* Luxury Mockup Layout */}
            <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
              {/* Perfume / Apothecary bottle silhouette */}
              <div className="relative w-28 h-44 rounded-t-lg rounded-b-xl border border-white/20 bg-gradient-to-b from-stone-900 to-stone-950 shadow-2xl p-3 flex flex-col justify-between items-center transition-transform duration-500 group-hover:scale-105">
                {/* Bottle Cap */}
                <div className="w-12 h-6 -mt-9 bg-stone-800 border border-white/30 rounded-t-sm shadow-md" />
                {/* Label */}
                <div className="w-full bg-[#f5f5f4] text-[#0a0a0a] p-2.5 rounded-sm shadow-inner flex flex-col items-center text-center mt-2">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-stone-500">NO. 07 · SERUM</span>
                  <span className="font-display font-bold text-xs tracking-tight mt-1">AURA</span>
                  <div className="w-6 h-[1px] bg-stone-900 my-1.5" />
                  <span className="font-sans text-[7px] tracking-wide text-stone-600">BOTANICALS BOTANICA</span>
                  <span className="font-mono text-[6px] text-stone-400 mt-1">50 ML · 1.7 FL OZ</span>
                </div>
                {/* Bottom glass reflection */}
                <div className="w-16 h-1 bg-white/20 rounded-full blur-[1px]" />
              </div>

              {/* Stationery Card behind / adjacent */}
              <div className="mt-4 w-56 bg-stone-900/90 border border-white/15 p-3 rounded shadow-xl flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-[11px] text-white tracking-wider">AURA APOTHECARY</div>
                  <div className="font-sans text-[8px] text-stone-400 tracking-wide mt-0.5">Identidade Visual & Packaging</div>
                </div>
                <div className="w-6 h-6 rounded-full border border-stone-600 flex items-center justify-center font-display font-bold text-[9px] text-[#A89F91]">
                  A
                </div>
              </div>
            </div>
            <div className="absolute bottom-3 left-4 text-[9px] font-mono text-stone-500 uppercase tracking-widest">
              JPXSTUDIO · PACKAGING SPECIMEN
            </div>
          </div>
        );

      case 'kinetic-archive':
        return (
          <div className="relative w-full h-full bg-[#050505] overflow-hidden flex items-center justify-center p-6 select-none">
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(194,65,12,0.18),transparent_65%)]" />
            
            {/* Editorial Book Spread Composition */}
            <div className="relative z-10 w-full max-w-md aspect-[16/10] bg-[#0c0c0e] border border-white/10 rounded-sm shadow-2xl flex overflow-hidden">
              {/* Left Page */}
              <div className="flex-1 p-5 border-r border-white/10 flex flex-col justify-between bg-[#121215]">
                <div>
                  <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 pb-2 border-b border-white/10">
                    <span>CAPÍTULO 04</span>
                    <span>P. 142</span>
                  </div>
                  <div className="mt-4 font-display font-extrabold text-xl leading-none text-white tracking-tight">
                    KINETIC<br />ARCHIVE
                  </div>
                  <div className="mt-2 w-8 h-[2px] bg-[#C2410C]" />
                  <p className="mt-3 text-[8px] text-zinc-400 leading-relaxed font-sans">
                    O brutalismo como manifestação de peso, permanência e rigor formal na arquitetura sul-americana do século XX.
                  </p>
                </div>
                {/* Micro Swiss typographic grid lines */}
                <div className="flex gap-1 mt-3">
                  <div className="h-6 w-full bg-zinc-800/80 rounded-sm border border-white/5 flex items-center px-1.5 font-mono text-[7px] text-zinc-400">
                    GRID 12-COL
                  </div>
                  <div className="h-6 w-12 bg-[#C2410C]/20 border border-[#C2410C]/40 rounded-sm flex items-center justify-center font-mono text-[7px] text-[#C2410C]">
                    FIG. A
                  </div>
                </div>
              </div>

              {/* Right Page (Graphic Art / Architectural composition) */}
              <div className="flex-1 p-5 bg-[#0e0e11] flex flex-col justify-between">
                <div className="relative w-full h-32 bg-zinc-950 border border-white/15 rounded-sm overflow-hidden flex items-center justify-center">
                  {/* Abstract brutalist concrete stairs & shadow */}
                  <svg className="w-full h-full opacity-80" viewBox="0 0 100 80">
                    <rect x="10" y="20" width="80" height="15" fill="#27272a" />
                    <rect x="25" y="35" width="65" height="15" fill="#3f3f46" />
                    <rect x="40" y="50" width="50" height="15" fill="#52525b" />
                    <line x1="10" y1="20" x2="90" y2="20" stroke="#ffffff" strokeWidth="0.5" />
                    <line x1="25" y1="35" x2="90" y2="35" stroke="#ffffff" strokeWidth="0.5" />
                    <line x1="40" y1="50" x2="90" y2="50" stroke="#ffffff" strokeWidth="0.5" />
                    <polygon points="10,20 25,35 10,35" fill="#18181b" />
                    <polygon points="25,35 40,50 25,50" fill="#18181b" />
                  </svg>
                  <div className="absolute top-2 right-2 font-mono text-[7px] text-zinc-400 bg-black/60 px-1 py-0.5 rounded">
                    PLACA 09
                  </div>
                </div>
                <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 pt-2 border-t border-white/10">
                  <span>MONOGRAFIA EDITORIAL</span>
                  <span>P. 143</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-3 left-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              JPXSTUDIO · EDITORIAL SWISS GRID
            </div>
          </div>
        );

      case 'neo-tokyo-biennale':
        return (
          <div className="relative w-full h-full bg-[#030303] overflow-hidden flex items-center justify-center p-6 select-none">
            {/* Glowing cyan accent */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(56,189,248,0.18),transparent_65%)]" />
            
            {/* Exhibition Poster Frame */}
            <div className="relative z-10 w-full max-w-xs aspect-[3/4] bg-[#09090b] border-2 border-white/20 p-5 shadow-2xl flex flex-col justify-between">
              {/* Header metadata */}
              <div className="flex justify-between items-start border-b border-white/15 pb-2">
                <div>
                  <div className="font-mono text-[8px] text-[#38BDF8] tracking-widest uppercase">BIENAL INTERNACIONAL 2024</div>
                  <div className="font-display font-extrabold text-sm text-white tracking-tight mt-0.5">TOKYO / 東京</div>
                </div>
                <div className="w-5 h-5 bg-white text-black flex items-center justify-center font-display font-bold text-[9px]">
                  08
                </div>
              </div>

              {/* Poster Center Visual - Architectural Typography */}
              <div className="my-auto py-2">
                <div className="font-display font-extrabold text-4xl text-white tracking-tighter leading-none">
                  NEO<br />TOKYO
                </div>
                <div className="mt-2 text-xs font-mono text-zinc-400 tracking-wider">
                  STRUCTURE & FLUIDITY
                </div>
                {/* Geometric decorative elements */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-[#38BDF8] to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                  <div className="w-6 h-6 border border-white/30 rounded-full flex items-center justify-center text-[7px] font-mono text-white">
                    JP
                  </div>
                </div>
              </div>

              {/* Bottom details */}
              <div className="border-t border-white/15 pt-2 flex justify-between items-end text-[7px] font-mono text-zinc-500">
                <div>
                  <div>CURADORIA: JPXSTUDIO</div>
                  <div>ROPPONGI ART TRIANGLE</div>
                </div>
                <div className="text-right text-[#38BDF8]">
                  OUTUBRO — DEZEMBRO
                </div>
              </div>
            </div>
            <div className="absolute bottom-3 left-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              JPXSTUDIO · POSTER ART DIRECTION
            </div>
          </div>
        );

      case 'vortex-sound-lab':
        return (
          <div className="relative w-full h-full bg-[#070708] overflow-hidden flex items-center justify-center p-6 select-none">
            {/* Amber accent glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.18),transparent_65%)]" />

            {/* Hardware front panel simulation */}
            <div className="relative z-10 w-full max-w-sm aspect-[16/9] bg-gradient-to-b from-[#18181b] to-[#0f0f11] border border-white/20 rounded shadow-2xl p-4 flex flex-col justify-between">
              {/* Rack Screws */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400" />
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400" />
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400" />

              {/* Panel Top Title */}
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                  <div className="font-display font-extrabold text-xs text-white tracking-widest">VORTEX</div>
                  <span className="text-[7px] font-mono text-zinc-400 bg-zinc-800 px-1 py-0.5 rounded">TUBE MASTER</span>
                </div>
                <div className="text-[8px] font-mono text-[#F59E0B]">MODEL VX-80</div>
              </div>

              {/* Hardware Knobs & VU Meter Simulation */}
              <div className="flex items-center justify-around my-2 px-2">
                {/* Knob 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center shadow-inner relative">
                    <div className="w-1 h-3 bg-[#F59E0B] rounded-full -mt-2" />
                  </div>
                  <span className="font-mono text-[6px] text-zinc-400 mt-1 uppercase">GAIN</span>
                </div>
                
                {/* Center VU Meter Display */}
                <div className="w-24 h-10 bg-amber-950/40 border border-amber-600/40 rounded p-1 flex flex-col justify-between">
                  <div className="flex justify-between text-[6px] font-mono text-[#F59E0B]">
                    <span>-20dB</span>
                    <span>0</span>
                    <span>+3dB</span>
                  </div>
                  {/* Meter needle line */}
                  <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden flex">
                    <div className="w-3/4 bg-amber-500" />
                    <div className="w-1/4 bg-red-500" />
                  </div>
                  <span className="text-[6px] font-mono text-zinc-400 text-center">ANALOG VU</span>
                </div>

                {/* Knob 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center shadow-inner relative">
                    <div className="w-1 h-3 bg-zinc-300 rounded-full -mt-2 rotate-45" />
                  </div>
                  <span className="font-mono text-[6px] text-zinc-400 mt-1 uppercase">OUTPUT</span>
                </div>
              </div>

              {/* Bottom spec bar */}
              <div className="flex justify-between items-center text-[7px] font-mono text-zinc-500 px-2 pt-1 border-t border-zinc-800">
                <span>BERLIN AUDIO LAB</span>
                <span className="text-[#F59E0B]">JPX BRANDING DESIGN</span>
              </div>
            </div>
            <div className="absolute bottom-3 left-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              JPXSTUDIO · HARDWARE & BRANDING
            </div>
          </div>
        );

      case 'chronos-horology':
        return (
          <div className="relative w-full h-full bg-[#050505] overflow-hidden flex items-center justify-center p-6 select-none">
            {/* Warm amber luxury spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(217,119,6,0.15),transparent_65%)]" />

            {/* Watch Box / Luxury Case Mockup */}
            <div className="relative z-10 w-full max-w-xs aspect-[4/3] bg-gradient-to-b from-[#141417] to-[#09090b] border border-amber-500/30 rounded-lg shadow-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[8px] text-amber-500 tracking-widest">GENÈVE · SWISS</span>
                <span className="font-mono text-[7px] text-zinc-500">LIMITED 50/50</span>
              </div>

              {/* Minimalist Watch Dial Visual */}
              <div className="relative my-auto flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border border-amber-400/40 bg-zinc-950 flex items-center justify-center relative shadow-2xl">
                  {/* Subtle hour markers */}
                  <div className="absolute top-1 w-0.5 h-1.5 bg-amber-400/80" />
                  <div className="absolute bottom-1 w-0.5 h-1.5 bg-amber-400/80" />
                  <div className="absolute left-1 w-1.5 h-0.5 bg-amber-400/80" />
                  <div className="absolute right-1 w-1.5 h-0.5 bg-amber-400/80" />
                  
                  {/* Watch hands */}
                  <div className="w-5 h-[1.5px] bg-white -rotate-45 origin-left ml-4" />
                  <div className="w-7 h-[1px] bg-amber-400 rotate-45 origin-left ml-2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute" />
                </div>
                <div className="mt-3 font-display font-bold text-xs text-white tracking-widest">
                  CHRONOS
                </div>
              </div>

              <div className="border-t border-white/10 pt-2 flex justify-between text-[7px] font-mono text-zinc-500">
                <span>ESTOJO EM ALUMÍNIO ESCOVADO</span>
                <span className="text-amber-400">OPUS NO. 1</span>
              </div>
            </div>
            <div className="absolute bottom-3 left-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              JPXSTUDIO · LUXURY PACKAGING
            </div>
          </div>
        );

      case 'equinox-distillery':
      default:
        return (
          <div className="relative w-full h-full bg-[#08080a] overflow-hidden flex items-center justify-center p-6 select-none">
            {/* Green botanical ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(132,204,22,0.14),transparent_65%)]" />

            {/* Asymmetric Bottle Label Mockup */}
            <div className="relative z-10 w-full max-w-xs bg-zinc-950 border border-white/20 p-5 rounded shadow-2xl flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <div className="font-mono text-[7px] text-lime-400 tracking-wider">DESTILARIA ARTESANAL</div>
                <div className="font-mono text-[7px] text-zinc-400">44% VOL · 750ML</div>
              </div>

              <div className="my-5 text-center">
                <div className="w-8 h-8 mx-auto rounded-full border border-lime-400/60 flex items-center justify-center text-lime-400 font-display font-bold text-xs mb-2">
                  EQ
                </div>
                <div className="font-display font-extrabold text-2xl text-white tracking-tight">
                  EQUINOX
                </div>
                <div className="font-sans text-[8px] tracking-widest text-zinc-400 uppercase mt-1">
                  BOTANICAL CRAFT GIN
                </div>
                <div className="mt-3 inline-block px-2 py-0.5 bg-zinc-900 border border-lime-500/30 text-[7px] font-mono text-lime-400">
                  EDIÇÃO LIMITADA · SAFRA 2023
                </div>
              </div>

              <div className="flex justify-between items-center text-[7px] font-mono text-zinc-500 border-t border-zinc-800 pt-2">
                <span>PAPEL ALGODÃO COM RELEVO</span>
                <span className="text-lime-400">HOT STAMPING PRATA</span>
              </div>
            </div>
            <div className="absolute bottom-3 left-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              JPXSTUDIO · LABEL & DIE-CUT
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden transition-all duration-300 ${
        isHovered ? 'scale-[1.01]' : ''
      } ${className}`}
    >
      {renderArtwork()}
    </div>
  );
};
