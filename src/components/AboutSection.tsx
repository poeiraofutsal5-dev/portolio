import React, { useState } from 'react';
import { JPX_SPECIALTIES, DESIGN_SYSTEM_SPEC } from '../data/portfolioData';
import { ServiceSpecialty } from '../types';
import { SpecialtyModal } from './SpecialtyModal';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  onSelectSpecialtyForContact: (specialtyTitle: string) => void;
  onShowToast?: (message: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onSelectSpecialtyForContact,
  onShowToast,
}) => {
  const { about } = DESIGN_SYSTEM_SPEC.copyLibrary;
  const [selectedSpecialty, setSelectedSpecialty] = useState<ServiceSpecialty | null>(null);

  const handleSpecialtyClick = (spec: ServiceSpecialty) => {
    setSelectedSpecialty(spec);
  };

  return (
    <section id="sobre" className="py-12 md:py-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 md:space-y-20">
      {/* Editorial Manifesto & About Philosophy - Lado a lado (2 colunas) no Mobile e PC */}
      <div className="grid grid-cols-12 gap-3 sm:gap-8 md:gap-12 items-start border-b border-[#27272A] pb-8 md:pb-20">
        {/* Left Column: Index, Title & Tags (5 colunas) */}
        <div className="col-span-5 space-y-2 sm:space-y-3 md:space-y-4">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[8.5px] sm:text-[10px] md:text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">
            <span>02</span>
            <span aria-hidden="true">·</span>
            <span>MANIFESTO</span>
          </div>
          <h2 className="font-display font-extrabold text-xs sm:text-2xl md:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            Design gráfico que une rigor conceitual e precisão estética.
          </h2>

          {/* Tags posicionadas no espaço vazio embaixo do título */}
          <div className="pt-2 sm:pt-3 md:pt-4 flex flex-wrap gap-1 sm:gap-2 md:gap-3 text-[7.5px] sm:text-[10px] md:text-xs font-mono text-[#D4D4D8]">
            <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 bg-[#121215] border border-[#27272A] rounded">
              DESIGN ESTRATÉGICO & IDENTIDADE
            </span>
            <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 bg-[#121215] border border-[#27272A] rounded">
              TIPOGRAFIA DE ALTO IMPACTO
            </span>
            <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 bg-[#121215] border border-[#27272A] rounded">
              MATERIAIS & PAPÉIS NOBRES
            </span>
          </div>
        </div>

        {/* Right Column: Persuasive Copy (7 colunas) */}
        <div className="col-span-7 space-y-2 sm:space-y-4 md:space-y-6 text-[#D4D4D8] font-sans">
          <p className="text-[11px] sm:text-base md:text-lg lg:text-xl text-white font-medium leading-snug sm:leading-relaxed">
            {about.lead}
          </p>
          <p className="text-[9.5px] sm:text-xs md:text-base lg:text-lg text-[#A1A1AA] leading-snug sm:leading-relaxed">
            {about.body}
          </p>
        </div>
      </div>

      {/* Especialidades (Specialties Section) - Uma do lado da outra no Mobile e PC */}
      <div id="especialidades" className="space-y-6 md:space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-1 md:mb-2">
              <span>03</span>
              <span aria-hidden="true">·</span>
              <span>CAPACIDADES & SERVIÇOS</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-white tracking-tight">
              ESPECIALIDADES
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[#A1A1AA] max-w-md font-sans">
            Soluções completas desenhadas para marcas que buscam se posicionar no topo de seus segmentos.
          </p>
        </div>

        {/* 3 Specialties Architectural Grid - Uma do lado da outra (grid-cols-3) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
          {JPX_SPECIALTIES.map((spec) => (
            <div
              key={spec.number}
              onClick={() => handleSpecialtyClick(spec)}
              className="group cursor-pointer p-2.5 sm:p-5 md:p-7 bg-[#0A0A0C] border border-[#27272A] rounded-xl hover:border-zinc-500 hover:bg-[#0f0f13] transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              {/* Layout Compacto e Elegante para Celular (Sem textos cortados) */}
              <div className="md:hidden flex flex-col justify-between h-full min-h-[135px]">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
                    <span className="font-mono text-[10px] text-white font-bold px-1.5 py-0.5 rounded bg-zinc-800/90 border border-zinc-700">
                      {spec.number}
                    </span>
                    <div className="w-5 h-5 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-white transition-all shrink-0">
                      <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  <h3 className="mt-2 font-display font-bold text-xs sm:text-sm text-white group-hover:text-[#F4F4F5] leading-tight">
                    {spec.title}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-[#27272A] flex items-center justify-between text-[9px] font-mono text-emerald-400 group-hover:text-emerald-300">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Ver detalhes</span>
                  </span>
                  <span className="text-zinc-500 text-[8px]">
                    +{spec.deliverables.length}
                  </span>
                </div>
              </div>

              {/* Layout Completo para Desktop (PC) */}
              <div className="hidden md:flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-[#27272A]">
                    <span className="font-mono text-sm text-[#71717A] group-hover:text-white transition-colors">
                      {spec.number}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-[#27272A] flex items-center justify-center text-[#A1A1AA] group-hover:text-white group-hover:border-white transition-all">
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  <h3 className="mt-6 font-display font-bold text-xl text-white group-hover:text-[#F4F4F5]">
                    {spec.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#A1A1AA] font-mono">
                    {spec.subtitle}
                  </p>
                  <p className="mt-4 text-sm text-[#D4D4D8] leading-relaxed font-sans">
                    {spec.description}
                  </p>
                </div>

                {/* Deliverables tags */}
                <div className="mt-6 pt-4 border-t border-[#27272A] space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-[#71717A] tracking-wider mb-2">
                    Entregáveis Típicos
                  </div>
                  {spec.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                      <span className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-white transition-colors" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                  <div className="pt-2 text-[11px] font-mono text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                    <span>Clique para ver detalhes completos</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialty Detail Modal (Retângulo Maior com Informações Completas) */}
      <SpecialtyModal
        specialty={selectedSpecialty}
        onClose={() => setSelectedSpecialty(null)}
        onSelectSpecialtyForContact={onSelectSpecialtyForContact}
        onShowToast={onShowToast}
      />
    </section>
  );
};

