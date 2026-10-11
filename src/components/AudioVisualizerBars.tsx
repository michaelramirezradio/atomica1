import React from 'react';

interface AudioVisualizerBarsProps {
  frequencyData: number[];
  isPlaying: boolean;
}

export const AudioVisualizerBars: React.FC<AudioVisualizerBarsProps> = ({
  frequencyData,
  isPlaying,
}) => {
  return (
    <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-16 sm:h-20 px-2 select-none">
      {frequencyData.map((val, idx) => {
        // Compute neon gradient color tone per bar
        const heightPercent = isPlaying ? Math.max(8, val) : 6;
        const isCenter = idx >= 10 && idx <= 22;

        return (
          <div
            key={idx}
            className="flex-1 max-w-[8px] rounded-t-full transition-all duration-75 ease-out relative group"
            style={{
              height: `${heightPercent}%`,
              background: isPlaying
                ? idx % 3 === 0
                  ? 'linear-gradient(180deg, #22d3ee 0%, #0284c7 100%)'
                  : idx % 3 === 1
                  ? 'linear-gradient(180deg, #f43f5e 0%, #d946ef 100%)'
                  : 'linear-gradient(180deg, #a3e635 0%, #16a34a 100%)'
                : 'rgba(148, 163, 184, 0.2)',
              boxShadow: isPlaying && isCenter && val > 50
                ? '0 0 12px rgba(217, 70, 239, 0.6)'
                : 'none',
            }}
          />
        );
      })}
    </div>
  );
};
