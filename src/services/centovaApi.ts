import { CentovaStreamInfo, CentovaTrack, TrackHistoryItem } from '../types/radio';

const CENTOVA_BASE_URL = 'https://str1.mediatelekom.net:2199';
const ACCOUNT_USERNAME = 'talentounited';

// In-memory cache for artwork to avoid repeated network lookups
const coverCache = new Map<string, string | null>();

// Initialize from localStorage if available
try {
  const cached = localStorage.getItem('atomica_covers_cache');
  if (cached) {
    const parsed = JSON.parse(cached) as Record<string, string | null>;
    for (const [key, val] of Object.entries(parsed)) {
      coverCache.set(key, val);
    }
  }
} catch {
  // localStorage might be unavailable or disabled
}

function saveCoverCache() {
  try {
    const obj: Record<string, string | null> = {};
    let count = 0;
    // Keep at most 100 entries
    for (const [key, val] of coverCache.entries()) {
      if (count++ > 100) break;
      obj[key] = val;
    }
    localStorage.setItem('atomica_covers_cache', JSON.stringify(obj));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Searches iTunes API for album cover art.
 * This is 100% free, requires no API key, and returns high-resolution artwork.
 */
export async function fetchAlbumCover(artist: string, title: string): Promise<string | null> {
  const cleanArtist = artist.trim();
  const cleanTitle = title.trim();

  // Ignore dummy or generic placeholder names
  if (!cleanArtist || cleanArtist.toLowerCase() === 'unknown' || cleanTitle.toLowerCase() === 'desconocido') {
    return null;
  }

  const cacheKey = `${cleanArtist.toLowerCase()}:::${cleanTitle.toLowerCase()}`;
  if (coverCache.has(cacheKey)) {
    return coverCache.get(cacheKey) ?? null;
  }

  try {
    // Clean up query: remove "(Original Mix)", "feat.", etc. for better search accuracy
    const query = `${cleanArtist} ${cleanTitle}`
      .replace(/\s*[\(\[](?:feat|ft|radio edit|original mix|remix|extended)[\.\s\w-]*[\)\]]/gi, '')
      .trim();

    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`,
      { cache: 'force-cache' }
    );

    if (!response.ok) {
      coverCache.set(cacheKey, null);
      return null;
    }

    const data = await response.json();
    if (data.resultCount > 0 && data.results[0]?.artworkUrl100) {
      // Upgrade artwork from 100x100 to 600x600 high resolution
      const highResUrl = data.results[0].artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg');
      coverCache.set(cacheKey, highResUrl);
      saveCoverCache();
      return highResUrl;
    }

    // Try with artist only if full title had no match
    if (cleanArtist.length > 2) {
      const fallbackResponse = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(cleanArtist)}&entity=song&limit=1`,
        { cache: 'force-cache' }
      );
      if (fallbackResponse.ok) {
        const fbData = await fallbackResponse.json();
        if (fbData.resultCount > 0 && fbData.results[0]?.artworkUrl100) {
          const highResUrl = fbData.results[0].artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg');
          coverCache.set(cacheKey, highResUrl);
          saveCoverCache();
          return highResUrl;
        }
      }
    }

    coverCache.set(cacheKey, null);
    return null;
  } catch {
    coverCache.set(cacheKey, null);
    return null;
  }
}

/**
 * Fetches real-time stream metadata from Centova Cast RPC
 */
export async function getCentovaStreamInfo(): Promise<CentovaStreamInfo | null> {
  try {
    const url = `${CENTOVA_BASE_URL}/rpc/${ACCOUNT_USERNAME}/streaminfo.get?_t=${Date.now()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Centova Cast responded with status ${res.status}`);
    }

    const json = await res.json();
    if (json.type === 'result' && Array.isArray(json.data) && json.data.length > 0) {
      return json.data[0] as CentovaStreamInfo;
    }
    return null;
  } catch (err) {
    console.warn('Error fetching Centova Cast streaminfo:', err);
    return null;
  }
}

/**
 * Fetches recent tracks list from Centova Cast RPC
 */
export async function getCentovaRecentTracks(): Promise<CentovaTrack[]> {
  try {
    const url = `${CENTOVA_BASE_URL}/rpc/${ACCOUNT_USERNAME}/recenttracks.get?_t=${Date.now()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Centova Cast responded with status ${res.status}`);
    }

    const json = await res.json();
    if (json.type === 'result' && Array.isArray(json.data) && Array.isArray(json.data[0])) {
      return json.data[0] as CentovaTrack[];
    }
    return [];
  } catch (err) {
    console.warn('Error fetching Centova Cast recent tracks:', err);
    return [];
  }
}

/**
 * Enriches Centova tracks with dynamic covers from iTunes API
 */
export async function enrichTracksWithCovers(tracks: CentovaTrack[]): Promise<TrackHistoryItem[]> {
  const validTracks = tracks.filter(
    (t) => t.title && t.artist && t.artist.toLowerCase() !== 'unknown' && t.title.toLowerCase() !== 'desconocido'
  );

  const enriched = await Promise.all(
    validTracks.map(async (t, idx) => {
      const coverUrl = await fetchAlbumCover(t.artist, t.title);
      return {
        id: `${t.time || Date.now()}-${idx}-${t.artist}-${t.title}`,
        artist: t.artist,
        title: t.title,
        album: t.album ?? null,
        time: t.time || Date.now(),
        localtime: t.localtime || '',
        coverUrl: coverUrl,
      };
    })
  );

  return enriched;
}
