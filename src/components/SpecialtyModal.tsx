import React, { useEffect } from 'react';
import { ServiceSpecialty } from '../types';
import { X, ArrowUpRight, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';

interface SpecialtyModalProps {
  specialty: ServiceSpecialty | null;
  onClose: () => void;
  onSelectSpecialtyForContact: (specialtyTitle: string) => void;
  onShowToast?: (message: string) => void;
}

export const SpecialtyModal: React.FC<SpecialtyModalProps> = ({
  specialty,
  onClose,
  onSelectSpecialtyForContact,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (specialty) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [specialty, onClose]);

  if (!specialty) return null;

  const handleStartProject = () => {
    onSelectSpecialtyForContact(specialty.title);
    onClose();
    const contactElem = document.getElementById('contato');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá JPX Studio! Tenho interesse no serviço de ${specialty.title}. Gostaria de solicitar um orçamento.`
    );
    window.open(`https://wa.me/5577991953930?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop dismissal */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] bg-[#0A0A0C] border border-[#27272A] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#27272A] bg-[#0c0c0e]">
          <div className="flex items-center gap-2.5 text-xs text-[#A1A1AA]">
            <span className="font-mono text-white font-bold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
              {specialty.number}
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-emerald-400 font-mono uppercase text-[11px] tracking-wider font-semibold">
              Especialidade
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-400">JPXSTUDIO</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Fechar detalhes da especialidade"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Hero Banner for the Specialty */}
          <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-[#131317] via-[#0A0A0C] to-[#0A0A0C] p-5 sm:p-6 shadow-inner">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider mb-2.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Capacidade & Expertise</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  {specialty.title}
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-zinc-300 font-mono">
                  {specialty.subtitle}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-base sm:text-lg text-white font-bold shrink-0">
                {specialty.number}
              </div>
            </div>
          </div>

          {/* Full Detailed Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
              Visão & Abordagem Estratégica
            </h3>
            <div className="p-4 sm:p-5 rounded-xl bg-[#121215] border border-[#27272A]">
              <p className="text-sm sm:text-base text-[#E4E4E7] leading-relaxed font-sans">
                {specialty.description}
              </p>
            </div>
          </div>

          {/* Full Deliverables List (Never cut off!) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA]">
                Entregáveis Típicos Incluídos
              </h3>
              <span className="text-[11px] font-mono text-zinc-400">
                {specialty.deliverables.length} itens inclusos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {specialty.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#121215]/80 border border-[#27272A] hover:border-zinc-700 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm text-zinc-200 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Standards / Guarantee */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-lg bg-[#0c0c0e] border border-zinc-900 text-center">
              <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                Resolução
              </span>
              <span className="text-xs font-bold text-white mt-0.5 block">
                Vetor & Alta Definição
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#0c0c0e] border border-zinc-900 text-center">
              <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                Exclusividade
              </span>
              <span className="text-xs font-bold text-white mt-0.5 block">
                100% Autoral
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#0c0c0e] border border-zinc-900 text-center">
              <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                Suporte
              </span>
              <span className="text-xs font-bold text-white mt-0.5 block">
                Atendimento Direto
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#27272A] flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleStartProject}
              className="w-full sm:flex-1 py-3 px-5 bg-white text-black font-semibold text-xs sm:text-sm rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Iniciar Projeto com este Serviço</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto py-3 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Orçamento WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
