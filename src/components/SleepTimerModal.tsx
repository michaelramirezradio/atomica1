import React from 'react';
import { X, Moon, Clock } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingSeconds: number | null;
  onSetTimer: (minutes: number | null) => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  remainingSeconds,
  onSetTimer,
}) => {
  if (!isOpen) return null;

  const timerOptions = [15, 30, 45, 60, 90];

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <h3 className="font-bold font-display text-white text-base">
              Temporizador de Apagado
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {remainingSeconds !== null && remainingSeconds > 0 ? (
            <div className="p-4 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 text-indigo-300 text-xs font-medium mb-1">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>La reproducción se detendrá en:</span>
              </div>
              <div className="text-3xl font-mono font-bold text-white tracking-widest tabular-nums">
                {formatCountdown(remainingSeconds)}
              </div>
              <button
                onClick={() => {
                  onSetTimer(null);
                }}
                className="mt-3 px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold hover:bg-rose-500/30 transition-colors"
              >
                Cancelar Temporizador
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center">
              Selecciona en cuántos minutos deseas que el reproductor detenga la música automáticamente.
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {timerOptions.map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  onSetTimer(mins);
                  onClose();
                }}
                className="py-2.5 px-3 bg-slate-800 hover:bg-cyan-950/60 hover:border-cyan-500/50 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all text-center"
              >
                {mins} minutos
              </button>
            ))}
            <button
              onClick={() => {
                onSetTimer(null);
                onClose();
              }}
              className="py-2.5 px-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all text-center"
            >
              Sin temporizador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
