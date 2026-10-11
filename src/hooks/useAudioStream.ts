import { useEffect, useRef, useState, useCallback } from 'react';

const PRIMARY_STREAM_URL = 'https://str1.mediatelekom.net:8049/stream';
const FALLBACK_STREAM_URL = 'http://195.154.40.57:8048/stream';

export function useAudioStream() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.85);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0); // For reactive glowing rings
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(32).fill(0));
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null); // seconds
  const [activeQuality, setActiveQuality] = useState<'hq' | 'standard'>('hq');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const sleepIntervalRef = useRef<number | null>(null);
  const prevVolumeRef = useRef(0.85);

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setStreamError(null);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setStreamError('Error al conectar con la transmisión en directo.');
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Register MediaSession handlers
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        audio.play().catch(() => {});
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audio.pause();
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        audio.pause();
      });
    }

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Sleep timer ticker
  useEffect(() => {
    if (sleepTimerRemaining !== null && sleepTimerRemaining > 0) {
      sleepIntervalRef.current = window.setInterval(() => {
        setSleepTimerRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Stop playback when timer completes
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (sleepIntervalRef.current) {
        clearInterval(sleepIntervalRef.current);
      }
    }

    return () => {
      if (sleepIntervalRef.current) {
        clearInterval(sleepIntervalRef.current);
      }
    };
  }, [sleepTimerRemaining]);

  // Set Sleep Timer
  const setSleepTimer = (minutes: number | null) => {
    if (minutes === null || minutes <= 0) {
      setSleepTimerRemaining(null);
    } else {
      setSleepTimerRemaining(minutes * 60);
    }
  };

  // Playback control
  const play = useCallback(() => {
    if (!audioRef.current) return;
    setIsLoading(true);
    setStreamError(null);

    const streamUrl = activeQuality === 'hq' ? PRIMARY_STREAM_URL : FALLBACK_STREAM_URL;
    // Add cache buster timestamp to ensure live stream edge connection
    audioRef.current.src = `${streamUrl}?_nocache=${Date.now()}`;
    audioRef.current.volume = isMuted ? 0 : volume;

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          setupAudioAnalyser();
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsLoading(false);
          setIsPlaying(false);
          setStreamError('Haz clic de nuevo para iniciar la reproducción.');
        });
    }
  }, [activeQuality, isMuted, volume]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    // Reset src so continuous live stream doesn't keep buffering in background
    audioRef.current.src = '';
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Audio Analyser setup (with simulated fallbacks if CORS blocks analyser data)
  const setupAudioAnalyser = () => {
    try {
      if (!audioContextRef.current && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.8;
          analyserRef.current = analyser;

          if (audioRef.current && !sourceNodeRef.current) {
            try {
              const source = ctx.createMediaElementSource(audioRef.current);
              sourceNodeRef.current = source;
              source.connect(analyser);
              analyser.connect(ctx.destination);
            } catch {
              // crossOrigin might restrict media element connection on some browsers
            }
          }
        }
      }

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
    } catch {
      // AudioContext creation failure fallback
    }
  };

  // Frequency animation loop
  useEffect(() => {
    let t = 0;
    const updateSpectrum = () => {
      if (isPlaying) {
        let hasRealData = false;
        if (analyserRef.current) {
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }

          if (sum > 0) {
            hasRealData = true;
            const avg = sum / bufferLength / 255;
            setAudioLevel(avg);
            // Downsample to 32 bars
            const bars: number[] = [];
            const step = Math.max(1, Math.floor(bufferLength / 32));
            for (let i = 0; i < 32; i++) {
              bars.push(Math.min(100, Math.round(((dataArray[i * step] || 0) / 255) * 100)));
            }
            setFrequencyData(bars);
          }
        }

        // If CORS restricts AnalyserNode, use realistic generative music rhythm bars
        if (!hasRealData) {
          t += 0.08;
          const bars: number[] = [];
          let sum = 0;
          for (let i = 0; i < 32; i++) {
            const freqFactor = Math.sin(t * 2 + i * 0.3) * 0.35 + Math.cos(t * 3 - i * 0.2) * 0.25 + 0.4;
            const bassBoost = i < 8 ? 0.3 : 0.05;
            const val = Math.max(10, Math.min(95, Math.round((freqFactor + bassBoost) * 100)));
            bars.push(val);
            sum += val;
          }
          setFrequencyData(bars);
          setAudioLevel(sum / (32 * 100));
        }
      } else {
        setAudioLevel(0);
        setFrequencyData(new Array(32).fill(6));
      }

      animFrameRef.current = requestAnimationFrame(updateSpectrum);
    };

    animFrameRef.current = requestAnimationFrame(updateSpectrum);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Volume control
  const setVolume = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      const restore = prevVolumeRef.current > 0 ? prevVolumeRef.current : 0.85;
      setVolumeState(restore);
      if (audioRef.current) audioRef.current.volume = restore;
    } else {
      prevVolumeRef.current = volume;
      setIsMuted(true);
      setVolumeState(0);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const switchQuality = (q: 'hq' | 'standard') => {
    if (q === activeQuality) return;
    setActiveQuality(q);
    if (isPlaying) {
      pause();
      setTimeout(() => play(), 100);
    }
  };

  return {
    isPlaying,
    isLoading,
    isMuted,
    volume,
    streamError,
    audioLevel,
    frequencyData,
    sleepTimerRemaining,
    activeQuality,
    play,
    pause,
    togglePlay,
    setVolume,
    toggleMute,
    setSleepTimer,
    switchQuality,
  };
}
