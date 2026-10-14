import React from 'react';
import { JPX_SPECIALTIES, DESIGN_SYSTEM_SPEC } from '../data/portfolioData';
import { ArrowUpRight } from 'lucide-react';

interface AboutSectionProps {
  onSelectSpecialtyForContact: (specialtyTitle: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onSelectSpecialtyForContact }) => {
  const { about } = DESIGN_SYSTEM_SPEC.copyLibrary;

  const handleSpecialtyClick = (specialtyTitle: string) => {
    onSelectSpecialtyForContact(specialtyTitle);
    const contactElem = document.getElementById('contato');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="sobre" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Editorial Manifesto & About Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-b border-[#27272A] pb-20">
        {/* Left Column: Index & Title */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">
            <span>02</span>
            <span aria-hidden="true">·</span>
            <span>MANIFESTO DO ESTÚDIO</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Design gráfico que une rigor conceitual e precisão estética.
          </h2>
        </div>

        {/* Right Column: Persuasive Copy */}
        <div className="lg:col-span-7 space-y-6 text-[#D4D4D8] font-sans">
          <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
            {about.lead}
          </p>
          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
            {about.body}
          </p>
          <div className="pt-4 flex flex-wrap gap-4 text-xs font-mono text-[#D4D4D8]">
            <span className="px-3 py-1.5 bg-[#121215] border border-[#27272A] rounded">
              DESIGN ESTRATÉGICO & IDENTIDADE
            </span>
            <span className="px-3 py-1.5 bg-[#121215] border border-[#27272A] rounded">
              TIPOGRAFIA DE ALTO IMPACTO
            </span>
            <span className="px-3 py-1.5 bg-[#121215] border border-[#27272A] rounded">
              MATERIAIS & PAPÉIS NOBRES
            </span>
          </div>
        </div>
      </div>

      {/* Especialidades (Specialties Section) */}
      <div id="especialidades" className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">
              <span>03</span>
              <span aria-hidden="true">·</span>
              <span>CAPACIDADES & SERVIÇOS</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              ESPECIALIDADES
            </h2>
          </div>
          <p className="text-sm text-[#A1A1AA] max-w-md font-sans">
            Soluções completas desenhadas para marcas que buscam se posicionar no topo de seus segmentos.
          </p>
        </div>

        {/* 3 Specialties Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {JPX_SPECIALTIES.map((spec) => (
            <div
              key={spec.number}
              onClick={() => handleSpecialtyClick(spec.title)}
              className="group cursor-pointer p-7 bg-[#0A0A0C] border border-[#27272A] rounded-xl hover:border-zinc-500 transition-all duration-300 flex flex-col justify-between"
            >
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
                <p className="mt-4 text-xs sm:text-sm text-[#D4D4D8] leading-relaxed font-sans">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
