export interface ShowRating {
  average: number | null;
}

export interface ShowImage {
  medium: string;
  original: string;
}

export interface ShowNetwork {
  id: number;
  name: string;
  country: {
    name: string;
    code: string;
    timezone: string;
  } | null;
  officialSite: string | null;
}

export interface ShowSchedule {
  time: string;
  days: string[];
}

export interface Show {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: 'Running' | 'Ended' | 'In Development' | 'To Be Determined' | string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  schedule: ShowSchedule;
  rating: ShowRating;
  weight: number;
  network: ShowNetwork | null;
  webChannel: ShowNetwork | null;
  image: ShowImage | null;
  summary: string | null;
  updated: number;
  _embedded?: {
    episodes?: Episode[];
    cast?: CastMember[];
  };
}

export interface SearchResult {
  score: number;
  show: Show;
}

export interface Episode {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number | null;
  type: string;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number | null;
  rating: ShowRating;
  image: ShowImage | null;
  summary: string | null;
  _links?: {
    self: { href: string };
    show: { href: string };
  };
}

export interface Person {
  id: number;
  name: string;
  image: ShowImage | null;
  url: string;
  birthday: string | null;
  deathday: string | null;
  gender: string | null;
}

export interface CastMember {
  person: Person;
  character: {
    id: number;
    name: string;
    image: ShowImage | null;
    url: string;
  };
  self: boolean;
  voice: boolean;
}

export interface AiringItem extends Episode {
  show: Show;
}

export type WatchStatus = 'Watching' | 'Completed' | 'Plan to Watch' | 'Dropped';

export interface ReviewItem {
  id: string;
  showId: number;
  showTitle: string;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  watchStatus: WatchStatus;
  reviewText: string;
  createdAt: string;
  isOptimistic?: boolean;
}

export interface ReviewFormData {
  showId: number | string;
  showTitle: string;
  userName: string;
  userEmail: string;
  rating: number;
  watchStatus: WatchStatus;
  reviewText: string;
}

export interface ReviewFormErrors {
  showTitle?: string;
  userName?: string;
  userEmail?: string;
  rating?: string;
  watchStatus?: string;
  reviewText?: string;
}

export type SortField = 'rating' | 'name' | 'premiered' | 'weight';
export type SortOrder = 'desc' | 'asc';
export type ViewMode = 'grid' | 'list';

export interface FilterOptions {
  query: string;
  genre: string;
  status: string;
  minRating: number;
  sortBy: SortField;
  sortOrder: SortOrder;
  viewMode: ViewMode;
}

export interface LighthouseCategory {
  name: string;
  score: number; // 0 to 100
  status: 'passed' | 'warning' | 'failed';
  items: string[];
}
