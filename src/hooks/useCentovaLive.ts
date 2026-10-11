import { useEffect, useRef, useState, useCallback } from 'react';
import { CentovaStreamInfo, TrackHistoryItem } from '../types/radio';
import {
  getCentovaStreamInfo,
  getCentovaRecentTracks,
  fetchAlbumCover,
  enrichTracksWithCovers,
} from '../services/centovaApi';

export function useCentovaLive() {
  const [streamInfo, setStreamInfo] = useState<CentovaStreamInfo | null>(null);
  const [currentCover, setCurrentCover] = useState<string | null>(null);
  const [recentTracks, setRecentTracks] = useState<TrackHistoryItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const currentSongRef = useRef<string>('');

  const fetchMetadata = useCallback(async () => {
    try {
      const info = await getCentovaStreamInfo();
      if (info) {
        setStreamInfo(info);
        setLastUpdated(new Date());

        const rawSong = info.song || `${info.track?.artist || ''} - ${info.track?.title || ''}`;

        // When the song changes or no cover yet
        if (rawSong && rawSong !== currentSongRef.current) {
          currentSongRef.current = rawSong;
          const artist = info.track?.artist || '';
          const title = info.track?.title || '';
          
          if (artist && title) {
            const cover = await fetchAlbumCover(artist, title);
            setCurrentCover(cover);

            // Update MediaSession API for OS integration
            if ('mediaSession' in navigator) {
              try {
                navigator.mediaSession.metadata = new MediaMetadata({
                  title: title,
                  artist: artist,
                  album: 'Atómica 1 Radio',
                  artwork: cover
                    ? [
                        { src: cover, sizes: '512x512', type: 'image/jpeg' },
                        { src: cover, sizes: '256x256', type: 'image/jpeg' },
                      ]
                    : [],
                });
              } catch {
                // Ignore mediaSession metadata errors
              }
            }
          }
        }
      }

      // Fetch recent tracks
      const rawRecent = await getCentovaRecentTracks();
      if (rawRecent && rawRecent.length > 0) {
        const enriched = await enrichTracksWithCovers(rawRecent);
        setRecentTracks(enriched);
      }
    } catch (err) {
      console.warn('Metadata poll error:', err);
    }
  }, []);

  const refreshNow = useCallback(async () => {
    setIsRefreshing(true);
    await fetchMetadata();
    setIsRefreshing(false);
  }, [fetchMetadata]);

  useEffect(() => {
    fetchMetadata();
    // Centova Cast server updates every ~10s
    const interval = setInterval(fetchMetadata, 8000);
    return () => clearInterval(interval);
  }, [fetchMetadata]);

  return {
    streamInfo,
    currentCover,
    recentTracks,
    isRefreshing,
    lastUpdated,
    refreshNow,
  };
}
