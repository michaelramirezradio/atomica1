import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useCentovaLive } from './hooks/useCentovaLive';
import { useAudioStream } from './hooks/useAudioStream';
import { Navbar } from './components/Navbar';
import { NowPlayingSection } from './components/NowPlayingSection';
import { RecentTracksSection } from './components/RecentTracksSection';
import { CabinaMessageModal } from './components/CabinaMessageModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { Footer } from './components/Footer';
import heroBgUrl from './assets/images/atomica_hero_bg_1791734308440.jpg';

export default function App() {
  const { mode: themeMode, setThemeMode, resolvedDark } = useTheme();
  const {
    streamInfo,
    currentCover,
    recentTracks,
    isRefreshing,
    refreshNow,
  } = useCentovaLive();

  const {
    isPlaying,
    isLoading,
    isMuted,
    volume,
    streamError,
    audioLevel,
    frequencyData,
    sleepTimerRemaining,
    togglePlay,
    setVolume,
    toggleMute,
    setSleepTimer,
  } = useAudioStream();

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);

  const currentSong = streamInfo?.track?.title || streamInfo?.song || 'La Descubre Bombazos';
  const currentArtist = streamInfo?.track?.artist || 'Atómica 1 Radio';

  // Keyboard shortcuts (Space = Play/Pause, M = Mute, Arrows = Volume)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(volume + 0.05);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(volume - 0.05);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, setVolume, volume]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        resolvedDark
          ? 'bg-[#060713] text-slate-100'
          : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Hero Atmosphere Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={heroBgUrl}
          alt="Studio Background"
          className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
            resolvedDark ? 'opacity-15' : 'opacity-5'
          }`}
        />
        {/* Neon Gradient Radial Scrims */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            resolvedDark
              ? 'bg-gradient-to-b from-[#060713]/90 via-[#060713]/98 to-[#060713]'
              : 'bg-gradient-to-b from-slate-100/95 via-slate-100/98 to-slate-100'
          }`}
        />
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Main Content Viewport */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Bar */}
        <Navbar
          themeMode={themeMode}
          onThemeChange={setThemeMode}
          onOpenSleepTimer={() => setIsSleepModalOpen(true)}
          onOpenMessageModal={() => setIsMessageModalOpen(true)}
          sleepTimerActive={sleepTimerRemaining !== null && sleepTimerRemaining > 0}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
        />

        {/* Main Hero & Player Section */}
        <main className="flex-1">
          <NowPlayingSection
            streamInfo={streamInfo}
            currentCover={currentCover}
            isPlaying={isPlaying}
            isLoading={isLoading}
            isMuted={isMuted}
            volume={volume}
            streamError={streamError}
            audioLevel={audioLevel}
            frequencyData={frequencyData}
            onTogglePlay={togglePlay}
            onSetVolume={setVolume}
            onToggleMute={toggleMute}
            onRefreshMetadata={refreshNow}
            isRefreshing={isRefreshing}
            onOpenMessageModal={() => setIsMessageModalOpen(true)}
          />

          {/* Recent Tracks History with dynamic covers and clear contrast */}
          <RecentTracksSection
            recentTracks={recentTracks}
            isRefreshing={isRefreshing}
          />
        </main>

        {/* Footer */}
        <Footer onOpenMessageModal={() => setIsMessageModalOpen(true)} />
      </div>

      {/* Real-time Message to Radio Cabina Modal */}
      <CabinaMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        currentSong={currentSong}
        currentArtist={currentArtist}
      />

      {/* Sleep Timer Modal */}
      <SleepTimerModal
        isOpen={isSleepModalOpen}
        onClose={() => setIsSleepModalOpen(false)}
        remainingSeconds={sleepTimerRemaining}
        onSetTimer={setSleepTimer}
      />
    </div>
  );
}
