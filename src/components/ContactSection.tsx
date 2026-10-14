import React, { useState, useEffect } from 'react';
import { Copy, Check, Send, MapPin, Mail, Instagram, ExternalLink, MessageSquare, MessageCircle } from 'lucide-react';
import { DESIGN_SYSTEM_SPEC } from '../data/portfolioData';

interface ContactSectionProps {
  selectedProjectOrService?: string;
  onShowToast: (message: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  selectedProjectOrService = '',
  onShowToast,
}) => {
  const { contact } = DESIGN_SYSTEM_SPEC.copyLibrary;
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Identidade Visual');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Synchronize prefilled service if user clicked from modal or specialties
  useEffect(() => {
    if (selectedProjectOrService) {
      setMessage((prev) =>
        prev
          ? `${prev}\n\nInteresse específico em: ${selectedProjectOrService}`
          : `Olá JPXSTUDIO! Gostaria de conversar sobre um projeto relacionado a: ${selectedProjectOrService}`
      );
    }
  }, [selectedProjectOrService]);

  const copyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopiedEmail(true);
    onShowToast(`E-mail ${contact.email} copiado para a área de transferência!`);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      onShowToast('Por favor, preencha seu nome e e-mail.');
      return;
    }
    setIsSubmitting(true);

    // Format briefing for WhatsApp
    const waText = `Olá JPXSTUDIO! Gostaria de conversar sobre um projeto:\n\n*Nome:* ${name}\n*E-mail:* ${email}\n*Tipo de Projeto:* ${projectType}\n*Investimento Estimado:* ${budget || 'A combinar'}${message ? `\n\n*Detalhes do Projeto:*\n${message}` : ''}`;
    const waUrl = `https://wa.me/5577981677054?text=${encodeURIComponent(waText)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onShowToast('Abrindo WhatsApp com seu projeto...');
      window.open(waUrl, '_blank');
    }, 400);
  };

  return (
    <section id="contato" className="py-12 md:py-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#27272A]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
        {/* Left Column: Direct Contact & Big Typography Headline */}
        <div className="lg:col-span-6 space-y-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-3">
              <span>04</span>
              <span aria-hidden="true">·</span>
              <span>CONTATO & NOVOS PROJETOS</span>
            </div>

            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-[0.95]">
              {contact.headline}
            </h2>

            <p className="mt-4 font-mono text-xs text-[#A1A1AA] tracking-widest uppercase">
              {contact.subheadline}
            </p>

            <p className="mt-6 text-base text-[#D4D4D8] font-sans leading-relaxed max-w-lg">
              {contact.body}
            </p>
          </div>

          {/* Direct Contact Cards & Socials - SOMENTE NO PC (Oculto no celular conforme solicitado) */}
          <div className="hidden lg:block space-y-4 pt-4">
            {/* 1-Click Copy Email Card */}
            <div className="p-5 bg-[#0A0A0C] border border-[#27272A] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#18181B] border border-[#27272A] flex items-center justify-center text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#71717A]">
                    E-mail Direto
                  </div>
                  <div className="font-mono text-sm sm:text-base text-white font-medium select-all">
                    {contact.email}
                  </div>
                </div>
              </div>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#18181B] hover:bg-[#27272A] text-white rounded-lg transition-colors border border-[#27272A]"
                title="Copiar e-mail"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Location & Status Card */}
            <div className="p-5 bg-[#0A0A0C] border border-[#27272A] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#18181B] border border-[#27272A] flex items-center justify-center text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#71717A]">
                    Base & Disponibilidade
                  </div>
                  <div className="text-sm text-white font-sans">
                    {contact.location}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-[#D4D4D8] px-2.5 py-1 bg-[#121215] border border-[#27272A] rounded">
                Agenda Aberta
              </span>
            </div>

            {/* Social Network Channels */}
            <div className="pt-2">
              <div className="text-xs font-mono uppercase text-[#71717A] mb-3">
                Redes & Presença Digital
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/jpxstudio9/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A0A0C] border border-[#27272A] rounded-lg text-xs font-medium text-white hover:border-zinc-500 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram @jpxstudio9</span>
                  <ExternalLink className="w-3 h-3 text-[#71717A]" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/5577981677054"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A0A0C] border border-[#27272A] rounded-lg text-xs font-medium text-white hover:border-emerald-500 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp (77) 98167-7054</span>
                  <ExternalLink className="w-3 h-3 text-[#71717A]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Briefing / Inquiry Form & Mobile Socials */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-[#0A0A0C] border border-[#27272A] rounded-xl p-5 sm:p-8">
          <div className="flex items-center justify-between pb-6 border-b border-[#27272A]">
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Briefing Inicial
              </h3>
              <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
                Conte-nos sobre o que você deseja construir.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#18181B] flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>

          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-2xl text-white">
                Briefing Preparado!
              </h4>
              <p className="text-sm text-[#A1A1AA] max-w-md mx-auto font-sans leading-relaxed">
                As informações do seu projeto foram estruturadas e encaminhadas para o nosso WhatsApp. Caso a conversa não tenha aberto automaticamente, clique no botão abaixo:
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/5577981677054?text=${encodeURIComponent(
                    `Olá JPXSTUDIO! Gostaria de conversar sobre um projeto:\n\n*Nome:* ${name}\n*E-mail:* ${email}\n*Tipo de Projeto:* ${projectType}\n*Investimento Estimado:* ${budget || 'A combinar'}${message ? `\n\n*Detalhes do Projeto:*\n${message}` : ''}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir WhatsApp Novamente</span>
                </a>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2.5 text-xs font-medium bg-[#18181B] text-white border border-[#27272A] rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Editar Informações
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#A1A1AA] uppercase mb-1.5">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Clara Ribeiro"
                    className="w-full px-3.5 py-2.5 bg-[#121215] border border-[#27272A] rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#A1A1AA] uppercase mb-1.5">
                    Seu E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@empresa.com"
                    className="w-full px-3.5 py-2.5 bg-[#121215] border border-[#27272A] rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Project Type Selector (Filtered to active specialties) */}
              <div>
                <label className="block text-xs font-mono text-[#A1A1AA] uppercase mb-1.5">
                  Tipo de Projeto
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#121215] border border-[#27272A] rounded-lg text-sm text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="Identidade Visual & Logotipo">Identidade Visual & Logotipo</option>
                  <option value="Embalagens & Rótulos de Luxo">Embalagens & Rótulos de Luxo</option>
                  <option value="Website / Portfólio Digital">Website / Portfólio Digital</option>
                </select>
              </div>

              {/* Editable Budget Input */}
              <div>
                <label className="block text-xs font-mono text-[#A1A1AA] uppercase mb-1.5">
                  Faixa de Investimento Estimada
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Coloque aqui o total investido"
                  className="w-full px-3.5 py-2.5 bg-[#121215] border border-[#27272A] rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-mono text-[#A1A1AA] uppercase mb-1.5">
                  Sobre o Projeto / Desafio
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Compartilhe um pouco sobre a sua marca, o momento atual e os prazos desejados..."
                  className="w-full px-3.5 py-2.5 bg-[#121215] border border-[#27272A] rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              {/* Submit Button to WhatsApp */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-sans font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Encaminhando para o WhatsApp...</span>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Enviar para WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Redes Sociais no Celular (Embaixo do Formulário) */}
        <div className="lg:hidden p-4 sm:p-5 bg-[#0A0A0C] border border-[#27272A] rounded-xl space-y-3">
          <div className="text-[11px] font-mono uppercase text-[#71717A]">
            Redes & Presença Digital
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <a
              href="https://www.instagram.com/jpxstudio9/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-4 py-2.5 bg-[#121215] border border-[#27272A] rounded-lg text-xs font-medium text-white hover:border-zinc-500 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram @jpxstudio9</span>
              </div>
              <ExternalLink className="w-3 h-3 text-[#71717A]" />
            </a>

            <a
              href="https://wa.me/5577981677054"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-4 py-2.5 bg-[#121215] border border-[#27272A] rounded-lg text-xs font-medium text-white hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp (77) 98167-7054</span>
              </div>
              <ExternalLink className="w-3 h-3 text-[#71717A]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};
