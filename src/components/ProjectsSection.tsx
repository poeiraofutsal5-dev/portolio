import React from 'react';
import { Project } from '../types';
import { JPX_PROJECTS } from '../data/portfolioData';
import { ProjectArtCanvas } from './ProjectArtCanvas';
import { ArrowUpRight } from 'lucide-react';

interface ProjectsSectionProps {
  projects?: Project[];
  onOpenProject: (project: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = JPX_PROJECTS,
  onOpenProject,
}) => {
  return (
    <section id="projetos" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="pb-8 border-b border-[#27272A]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">
          <span>01</span>
          <span aria-hidden="true">·</span>
          <span>PROJETOS SELECIONADOS</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          TRABALHOS
        </h2>
      </div>

      {/* Editorial Cards Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onOpenProject(project)}
            className="group cursor-pointer bg-[#0A0A0C] border border-[#27272A] rounded-xl overflow-hidden hover:border-zinc-500 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Visual Container */}
            <div className="w-full aspect-[4/3] bg-[#0A0A0C] overflow-hidden relative flex items-center justify-center">
              {project.customImageUrl ? (
                <>
                  {/* Ambient blurred background of the custom image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-45 pointer-events-none transition-transform duration-700 group-hover:scale-130"
                    style={{ backgroundImage: `url(${project.customImageUrl})` }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-black/35 pointer-events-none" aria-hidden="true" />
                  {/* Proportional sharp image */}
                  <img
                    src={project.customImageUrl}
                    alt={project.title}
                    className="relative z-10 w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                </>
              ) : (
                <ProjectArtCanvas project={project} isHovered={true} />
              )}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card Footer Info */}
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-[#A1A1AA] mb-2">
                <span className="font-mono text-white">{project.year}</span>
                <span aria-hidden="true">·</span>
                <span>{project.category}</span>
              </div>
              <h3 className="font-display font-bold text-xl text-white group-hover:text-[#F4F4F5]">
                {project.title}
              </h3>
              <p className="mt-1 text-xs text-[#A1A1AA] line-clamp-2">
                {project.tagline}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
