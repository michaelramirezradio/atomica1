import React, { useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCw,
  Share2,
  Copy,
  Check,
  Radio,
  Headphones,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Disc,
} from 'lucide-react';
import { CentovaStreamInfo } from '../types/radio';
import { AtomicOrbVisualizer } from './AtomicOrbVisualizer';
import { AudioVisualizerBars } from './AudioVisualizerBars';

interface NowPlayingSectionProps {
  streamInfo: CentovaStreamInfo | null;
  currentCover: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  volume: number;
  streamError: string | null;
  audioLevel: number;
  frequencyData: number[];
  onTogglePlay: () => void;
  onSetVolume: (vol: number) => void;
  onToggleMute: () => void;
  onRefreshMetadata: () => void;
  isRefreshing: boolean;
  onOpenMessageModal: () => void;
}

export const NowPlayingSection: React.FC<NowPlayingSectionProps> = ({
  streamInfo,
  currentCover,
  isPlaying,
  isLoading,
  isMuted,
  volume,
  streamError,
  audioLevel,
  frequencyData,
  onTogglePlay,
  onSetVolume,
  onToggleMute,
  onRefreshMetadata,
  isRefreshing,
  onOpenMessageModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Extract clean metadata from the live stream
  const artist = streamInfo?.track?.artist || 'Atómica 1 Radio';
  const songTitle = streamInfo?.track?.title || streamInfo?.song || 'La Descubre Bombazos';

  const copyTrack = () => {
    navigator.clipboard.writeText(`${artist} - ${songTitle}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareStation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Atómica 1 Radio',
          text: `Escuchando "${songTitle}" de ${artist} en Atómica 1 Radio`,
          url: window.location.href,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch {
        // Share cancelled
      }
    } else {
      copyTrack();
    }
  };

  return (
    <section id="player" className="relative pt-6 pb-12 sm:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual Atom Orb & Vinyl Cover */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <AtomicOrbVisualizer
              coverUrl={currentCover}
              isPlaying={isPlaying}
              isLoading={isLoading}
              audioLevel={audioLevel}
              songTitle={songTitle}
              artistName={artist}
            />

            {/* Equalizer Spectrum Bars under the Atom */}
            <div className="w-full max-w-sm mt-6">
              <AudioVisualizerBars
                frequencyData={frequencyData}
                isPlaying={isPlaying}
              />
            </div>
          </div>

          {/* Right Column: Player Controls & Live Track Metadata */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Live Station Status Strip (Readable, clean unboxed text) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold rounded-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                EN DIRECTO
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-cyan-300 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                La Descubre Bombazos
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 font-mono tabular-nums text-slate-300">
                <Headphones className="w-3.5 h-3.5 text-fuchsia-400" />
                {streamInfo?.listeners ?? 1} en sintonía
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <button
                onClick={onRefreshMetadata}
                title="Actualizar información en antena"
                className="hover:text-white transition-colors p-1 rounded hover:bg-slate-800 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Current Song Title & Artist: Deep obsidian background with crisp contrast */}
            <div className="p-6 bg-[#0c0d1d] border border-[#202447] rounded-2xl shadow-xl space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-[#1b1f3d] pb-2.5">
                <div className="text-xs font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-2">
                  <Disc className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Sonando Ahora Mismo</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {streamInfo?.time || 'En Antena'}
                </span>
              </div>

              {/* Title with stark legibility: Pure white on dark carbon background */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white leading-tight break-words">
                {songTitle}
              </h1>

              {/* Artist Name with high-visibility vibrant electric cyan */}
              <p className="text-lg sm:text-xl font-bold text-cyan-300 flex items-center gap-2">
                <span>{artist}</span>
              </p>

              {/* Station Slogan / Show details */}
              <div className="text-xs text-slate-400 flex items-center gap-2 pt-1 border-t border-[#1b1f3d]">
                <Radio className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                <span>Emisión oficial 24h · Atómica 1 Radio</span>
              </div>
            </div>

            {/* Error Message Notice if any */}
            {streamError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center justify-between">
                <span>{streamError}</span>
                <button
                  onClick={onTogglePlay}
                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg font-semibold text-rose-200 cursor-pointer"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Primary Action Controls Card */}
            <div className="p-5 sm:p-6 bg-[#0e1022] border border-[#212547] rounded-2xl shadow-xl space-y-6">
              
              {/* Main Play / Pause & Live Status Row */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                
                {/* Big Tactile Play / Pause Button */}
                <button
                  onClick={onTogglePlay}
                  disabled={isLoading}
                  className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-gradient-to-tr from-cyan-500 via-fuchsia-500 to-pink-500 text-white shadow-xl shadow-fuchsia-500/30 hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400 cursor-pointer shrink-0"
                  aria-label={isPlaying ? 'Pausar transmisión' : 'Reproducir transmisión'}
                >
                  {isPlaying && (
                    <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
                  )}
                  {isLoading ? (
                    <div className="w-8 h-8 rounded-full border-3 border-white border-t-transparent animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-7 h-7 sm:w-9 sm:h-9 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                  )}
                </button>

                {/* Status and Now Playing Reflection */}
                <div className="flex-1 min-w-[140px]">
                  <span className="text-xs font-semibold text-slate-400 block">
                    {isPlaying ? 'Transmitiendo en Vivo' : 'Transmisión en Pausa'}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white font-display">
                    {isPlaying ? songTitle : 'Pulsa el botón para escuchar'}
                  </span>
                  <span className="text-xs text-cyan-300 block font-medium mt-0.5 truncate">
                    {artist}
                  </span>
                </div>

                {/* Send Message to Radio Direct Action Button */}
                <button
                  onClick={onOpenMessageModal}
                  className="px-4 py-2.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-fuchsia-600/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Mensaje a Cabina</span>
                </button>
              </div>

              {/* Volume Slider & Controls */}
              <div className="pt-2 border-t border-[#1b1f3d] flex items-center gap-3">
                <button
                  onClick={onToggleMute}
                  className="p-2 text-slate-400 hover:text-cyan-300 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-cyan-400" />
                  )}
                </button>

                <div className="flex-1 relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => onSetVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                    aria-label="Volumen"
                  />
                </div>

                <span className="text-xs font-mono text-slate-300 w-10 text-right tabular-nums">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>

            {/* Quick Action Buttons (Copiar Tema, Compartir, Enviar Mensaje) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={copyTrack}
                className="px-4 py-2.5 bg-[#12142a] hover:bg-[#1a1d3d] border border-[#23274e] hover:border-[#343b70] text-xs font-semibold text-slate-200 rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Título Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copiar Canción</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenMessageModal}
                className="px-4 py-2.5 bg-[#12142a] hover:bg-[#1a1d3d] border border-[#23274e] hover:border-cyan-500/50 text-xs font-semibold text-cyan-300 rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Enviar Saludo o Petición</span>
              </button>

              <button
                onClick={shareStation}
                className="px-4 py-2.5 bg-[#12142a] hover:bg-[#1a1d3d] border border-[#23274e] hover:border-fuchsia-500/50 text-xs font-semibold text-slate-200 rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                {shareSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Compartido!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Compartir Emisora</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
