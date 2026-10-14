import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#18181B] text-white border border-[#27272A] rounded-xl shadow-2xl animate-bounce-subtle pointer-events-none">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="text-xs font-mono font-medium">{message}</span>
    </div>
  );
};
