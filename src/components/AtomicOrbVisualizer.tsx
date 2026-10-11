import React from 'react';
import logoBadgeUrl from '../assets/images/atomica_logo_badge_1791734290868.jpg';

interface AtomicOrbVisualizerProps {
  coverUrl: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  audioLevel: number;
  songTitle: string;
  artistName: string;
}

export const AtomicOrbVisualizer: React.FC<AtomicOrbVisualizerProps> = ({
  coverUrl,
  isPlaying,
  isLoading,
  audioLevel,
  songTitle,
  artistName,
}) => {
  // Dynamic scale factor based on audio amplitude
  const pulseScale = isPlaying ? 1 + audioLevel * 0.12 : 1;
  const glowOpacity = isPlaying ? 0.7 + audioLevel * 0.3 : 0.25;

  return (
    <div className="relative flex items-center justify-center w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 mx-auto select-none">
      {/* Background Ambient Glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-all duration-300 pointer-events-none"
        style={{
          background: isPlaying
            ? `radial-gradient(circle, rgba(224,36,195,${glowOpacity}) 0%, rgba(6,182,212,${glowOpacity * 0.8}) 45%, rgba(132,204,22,${glowOpacity * 0.3}) 75%, transparent 100%)`
            : 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(6,182,212,0.1) 60%, transparent 100%)',
          transform: `scale(${pulseScale * 1.05})`,
        }}
      />

      {/* Orbit Ring 1 (Diagonal 45deg) */}
      <div
        className={`absolute w-full h-full rounded-full border border-cyan-400/30 dark:border-cyan-400/40 pointer-events-none transition-transform duration-700 ${
          isPlaying ? 'animate-orbit-cw' : ''
        }`}
        style={{
          boxShadow: isPlaying ? '0 0 18px rgba(6, 182, 212, 0.4)' : 'none',
          transform: `rotate3d(1, 1, 0, 65deg) scale(${pulseScale})`,
        }}
      >
        {/* Electron particle on Ring 1 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]" />
      </div>

      {/* Orbit Ring 2 (Counter-Diagonal -45deg) */}
      <div
        className={`absolute w-full h-full rounded-full border border-fuchsia-400/30 dark:border-fuchsia-400/40 pointer-events-none transition-transform duration-700 ${
          isPlaying ? 'animate-orbit-ccw' : ''
        }`}
        style={{
          boxShadow: isPlaying ? '0 0 18px rgba(224, 36, 195, 0.4)' : 'none',
          transform: `rotate3d(1, -1, 0, 65deg) scale(${pulseScale * 0.98})`,
        }}
      >
        {/* Electron particle on Ring 2 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-fuchsia-300 shadow-[0_0_12px_#f43f5e]" />
      </div>

      {/* Orbit Ring 3 (Vertical Axis) */}
      <div
        className={`absolute w-full h-full rounded-full border border-lime-400/25 dark:border-lime-400/35 pointer-events-none transition-transform duration-700 ${
          isPlaying ? 'animate-orbit-cw' : ''
        }`}
        style={{
          boxShadow: isPlaying ? '0 0 15px rgba(132, 204, 22, 0.3)' : 'none',
          transform: `rotate3d(0, 1, 0, 75deg) scale(${pulseScale * 0.95})`,
          animationDuration: '32s',
        }}
      >
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-lime-300 shadow-[0_0_10px_#84cc16]" />
      </div>

      {/* Outer Soundwave Pulsing Rim */}
      <div
        className="absolute inset-4 rounded-full border border-white/10 dark:border-white/15 pointer-events-none transition-all duration-300"
        style={{
          transform: `scale(${pulseScale * 0.96})`,
          boxShadow: isPlaying
            ? '0 0 25px rgba(224,36,195,0.25), inset 0 0 20px rgba(6,182,212,0.2)'
            : 'none',
        }}
      />

      {/* Center Vinyl / Artwork Container */}
      <div
        className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden p-1.5 transition-all duration-300 bg-gradient-to-tr from-cyan-500 via-fuchsia-500 to-amber-400 shadow-2xl"
        style={{
          transform: `scale(${pulseScale})`,
          boxShadow: isPlaying
            ? '0 0 35px rgba(224, 36, 195, 0.5), 0 0 65px rgba(6, 182, 212, 0.35)'
            : '0 10px 25px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Vinyl Grooves & Artwork Disc */}
        <div
          className={`relative w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center transition-transform ${
            isPlaying ? 'animate-orbit-cw' : ''
          }`}
          style={{ animationDuration: '18s' }}
        >
          {/* Cover Image or Station Logo Badge */}
          <img
            src={coverUrl || logoBadgeUrl}
            alt={`${songTitle || 'Atómica 1'} - ${artistName || 'Radio'}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center select-none"
            onError={(e) => {
              // Fallback to station logo if external cover fails
              (e.currentTarget as HTMLImageElement).src = logoBadgeUrl;
            }}
          />

          {/* Vinyl Ring Overlay Lines */}
          <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
          <div className="absolute inset-6 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute inset-12 rounded-full border border-white/10 pointer-events-none" />

          {/* Subtle Vinyl Center Spindle */}
          <div className="absolute w-8 h-8 rounded-full bg-slate-900 border-2 border-white/30 shadow-inner flex items-center justify-center pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>

          {/* Glass Specular Glare */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none rounded-full" />
        </div>
      </div>

      {/* Loading Radar Sweep */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-20 h-20 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
};
