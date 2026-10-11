export interface CentovaTrack {
  artist: string;
  title: string;
  album: string | null;
  royaltytrackid?: number | null;
  started?: string | null;
  imageurl?: string;
  image?: string;
  time?: number;
  localtime?: string;
  url?: string;
}

export interface CentovaStreamInfo {
  title: string;
  song: string;
  track: CentovaTrack;
  bitrate: string;
  server: string;
  autodj: string;
  source: string;
  offline: boolean;
  listeners: number;
  maxlisteners: number;
  date: string;
  time: string;
  rawmeta: string;
  mountpoint: string;
  tuneinurl: string;
  tuneinurltls: string;
  proxytuneinurltls?: string;
  tuneinformat: string;
  servertype: string;
  listenertotal: number;
}

export interface TrackHistoryItem {
  id: string;
  artist: string;
  title: string;
  album: string | null;
  time: number;
  localtime: string;
  coverUrl: string | null;
}

export type ThemeMode = 'auto' | 'dark' | 'light';

export interface PlayerStats {
  listeners: number;
  maxListeners: number;
  bitrate: string;
  serverState: boolean;
  format: string;
  lastUpdated: Date;
}
