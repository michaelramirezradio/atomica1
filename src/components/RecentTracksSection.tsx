import React, { useState } from 'react';
import { History, Copy, Check, Music } from 'lucide-react';
import { TrackHistoryItem } from '../types/radio';
import logoBadgeUrl from '../assets/images/atomica_logo_badge_1791734290868.jpg';

interface RecentTracksSectionProps {
  recentTracks: TrackHistoryItem[];
  isRefreshing: boolean;
}

export const RecentTracksSection: React.FC<RecentTracksSectionProps> = ({
  recentTracks,
  isRefreshing,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copySong = (track: TrackHistoryItem) => {
    navigator.clipboard.writeText(`${track.artist} - ${track.title}`);
    setCopiedId(track.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="historial" className="py-12 border-t border-[#1a1e38] bg-[#070815]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Emisión Reciente</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              Historial de Canciones Emitidas
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Consulta los últimos temas que han sonado en Atómica 1 Radio con carátulas dinámicas en alta resolución.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {recentTracks.length} temas en registro
          </div>
        </div>

        {/* Tracks Grid */}
        {recentTracks.length === 0 ? (
          <div className="p-8 text-center bg-[#0d0f22] border border-[#1e2244] rounded-2xl">
            <Music className="w-8 h-8 text-slate-500 mx-auto mb-2 animate-bounce" />
            <p className="text-sm text-slate-300">
              Sincronizando el historial de emisión en directo...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTracks.map((track, idx) => {
              const isFirst = idx === 0;

              return (
                <div
                  key={track.id}
                  className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                    isFirst
                      ? 'bg-[#141731] border-cyan-400/50 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/20'
                      : 'bg-[#0f1124] hover:bg-[#151833] border-[#222649] hover:border-[#353c70]'
                  }`}
                >
                  {/* Dynamic Album Artwork */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#090a14] border border-[#2b305c] shadow-md">
                    <img
                      src={track.coverUrl || logoBadgeUrl}
                      alt={`${track.artist} - ${track.title}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = logoBadgeUrl;
                      }}
                    />
                    {isFirst && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[9px] font-bold bg-cyan-400 text-slate-950 rounded shadow">
                        RECIENTE
                      </span>
                    )}
                  </div>

                  {/* Track Typography with Maximum Contrast */}
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Timestamp & Show */}
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                      <span className="text-slate-300 font-semibold">{track.localtime || 'En antena'}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-cyan-400/80">Atómica 1</span>
                    </div>

                    {/* Song Title: Crisp bold pure white with no wash out */}
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {track.title}
                    </h3>

                    {/* Artist Name: High-contrast electric cyan */}
                    <p className="text-xs sm:text-sm font-semibold text-cyan-300/90 truncate">
                      {track.artist}
                    </p>
                  </div>

                  {/* Copy Button */}
                  <div className="shrink-0">
                    <button
                      onClick={() => copySong(track)}
                      title="Copiar título y artista"
                      className="p-2 text-slate-400 hover:text-cyan-300 rounded-xl hover:bg-[#1c2042] border border-transparent hover:border-[#2b3164] transition-all cursor-pointer"
                    >
                      {copiedId === track.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
