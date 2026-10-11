import React from 'react';
import { Sun, Moon, Laptop, Radio, Timer, MessageSquare } from 'lucide-react';
import { ThemeMode } from '../types/radio';
import logoBadgeUrl from '../assets/images/atomica_logo_badge_1791734290868.jpg';

interface NavbarProps {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  onOpenSleepTimer: () => void;
  onOpenMessageModal: () => void;
  sleepTimerActive: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  themeMode,
  onThemeChange,
  onOpenSleepTimer,
  onOpenMessageModal,
  sleepTimerActive,
  isPlaying,
  onTogglePlay,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1b1f3d] bg-[#070815]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <img
              src={logoBadgeUrl}
              alt="Atómica 1 Radio Logo"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black tracking-tight text-lg text-white leading-none">
              ATÓMICA <span className="text-cyan-400">1</span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase leading-none mt-0.5">
              RADIO DIGITAL
            </span>
          </div>
        </a>

        {/* Zone 2: Clean nav items */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a
            href="#player"
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            En Directo
          </a>
          <a
            href="#historial"
            className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
          >
            Historial de Canciones
          </a>
          <button
            onClick={onOpenMessageModal}
            className="hover:text-fuchsia-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-slate-300"
          >
            <MessageSquare className="w-3.5 h-3.5 text-fuchsia-400" />
            Enviar Mensaje
          </button>
          <button
            onClick={onOpenSleepTimer}
            className={`hover:text-indigo-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              sleepTimerActive ? 'text-indigo-300' : 'text-slate-300'
            }`}
          >
            <Timer className={`w-3.5 h-3.5 ${sleepTimerActive ? 'text-indigo-400 animate-pulse' : 'text-slate-400'}`} />
            Temporizador
          </button>
        </nav>

        {/* Zone 3: Actions + Theme Selector */}
        <div className="flex items-center gap-3 shrink-0">
          {/* OS Auto Dark Mode Selector */}
          <div className="flex items-center bg-[#0d0f21] border border-[#21264a] rounded-lg p-0.5 text-slate-400 text-xs">
            <button
              onClick={() => onThemeChange('auto')}
              title="Modo Automático del Sistema"
              className={`p-1.5 rounded-md transition-all ${
                themeMode === 'auto'
                  ? 'bg-[#1b1f40] text-cyan-300 shadow-sm'
                  : 'hover:text-slate-200'
              }`}
              aria-label="Tema automático según SO"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              title="Modo Oscuro Permanente"
              className={`p-1.5 rounded-md transition-all ${
                themeMode === 'dark'
                  ? 'bg-[#1b1f40] text-fuchsia-400 shadow-sm'
                  : 'hover:text-slate-200'
              }`}
              aria-label="Tema oscuro"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('light')}
              title="Modo Claro"
              className={`p-1.5 rounded-md transition-all ${
                themeMode === 'light'
                  ? 'bg-[#1b1f40] text-amber-400 shadow-sm'
                  : 'hover:text-slate-200'
              }`}
              aria-label="Tema claro"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Quick Toggle Play Button */}
          <button
            onClick={onTogglePlay}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-fuchsia-600 rounded-lg hover:from-cyan-400 hover:to-fuchsia-500 shadow-md shadow-fuchsia-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
          >
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-lime-300 animate-ping' : 'bg-white'}`} />
            {isPlaying ? 'PAUSAR' : 'ESCUCHAR EN VIVO'}
          </button>
        </div>
      </div>
    </header>
  );
};
