import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { JPXLogo } from './JPXLogo';

interface FooterProps {
  customLogoUrl?: string | null;
  logoHeight?: number;
}

export const Footer: React.FC<FooterProps> = ({
  customLogoUrl,
  logoHeight = 32,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Bahia / São Paulo Time (UTC-3)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Bahia',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setTimeStr(new Intl.DateTimeFormat('pt-BR', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#27272A] bg-[#050505] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#A1A1AA]">
        {/* Left: Brand Tag with Official Logo or Custom Logo */}
        <div className="flex items-center gap-4">
          {customLogoUrl ? (
            <img
              src={customLogoUrl}
              alt="JPXSTUDIO Logo"
              style={{ height: logoHeight }}
              className="w-auto object-contain hover:opacity-90 transition-opacity"
            />
          ) : (
            <JPXLogo height={logoHeight} className="text-white hover:opacity-90 transition-opacity" />
          )}
          <span aria-hidden="true" className="text-zinc-700">|</span>
          <span className="font-sans text-sm text-[#E4E4E7]">Designer Gráfico</span>
        </div>

        {/* Center: Live Time in Ituaçu-BA */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#D4D4D8]">
          <span className="text-zinc-500">ITUAÇU-BA (BRT):</span>
          <span className="tabular-nums font-semibold text-white">{timeStr || '12:00:00'}</span>
        </div>

        {/* Right: Copyright & Back to Top */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-[#71717A]">
            © {new Date().getFullYear()} JPXSTUDIO. Todos os direitos reservados.
          </span>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white border border-[#27272A] transition-colors"
            title="Voltar ao início"
            aria-label="Voltar ao início"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
