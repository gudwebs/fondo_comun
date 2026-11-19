import React from 'react';
import { ScreenState } from '../game/types';

interface TopBarProps {
  screen: ScreenState;
  soundEnabled: boolean;
  ledgerCount: number;
  onGoHome: () => void;
  onOpenRules: () => void;
  onOpenLedger: () => void;
  onToggleSound: () => void;
  onPrimaryAction: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  screen,
  soundEnabled,
  ledgerCount,
  onGoHome,
  onOpenRules,
  onOpenLedger,
  onToggleSound,
  onPrimaryAction,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#D9A441]/18 bg-[#081A14]/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-6 lg:px-10">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={onGoHome}
          className="font-display text-xl font-semibold tracking-tight text-[#F5F2EB] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9A441] whitespace-nowrap shrink-0 cursor-pointer"
        >
          Fondo Común
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#C5D3CC]">
          <button
            type="button"
            onClick={onGoHome}
            className={`transition-colors hover:text-[#F5F2EB] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9A441] ${
              screen === 'TITLE' ? 'text-[#F5F2EB] underline underline-offset-8 decoration-[#D9A441]' : ''
            }`}
          >
            Inicio
          </button>
          <button
            type="button"
            onClick={onOpenRules}
            className="transition-colors hover:text-[#F5F2EB] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9A441]"
          >
            Reglas
          </button>
          <button
            type="button"
            onClick={onOpenLedger}
            className="transition-colors hover:text-[#F5F2EB] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9A441]"
          >
            {ledgerCount > 0 ? `Registro (${ledgerCount})` : 'Registro'}
          </button>
          <button
            type="button"
            onClick={onToggleSound}
            className="transition-colors hover:text-[#F5F2EB] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9A441]"
          >
            {soundEnabled ? 'Sonido activo' : 'Sonido apagado'}
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenRules}
            className="md:hidden text-sm font-medium text-[#C5D3CC] hover:text-[#F5F2EB] px-2 py-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Reglas
          </button>
          <button
            type="button"
            onClick={onPrimaryAction}
            className="rounded-lg bg-[#D9A441] px-4 py-2 text-sm font-semibold text-[#111915] transition-transform duration-150 hover:bg-[#E4B458] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F2EB] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {screen === 'TITLE' ? 'Ver ejemplo oficial' : 'Nueva partida'}
          </button>
        </div>
      </div>
    </header>
  );
};
