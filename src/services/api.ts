import { AiringItem, CastMember, Episode, SearchResult, Show } from '../types';

const PRIMARY_API_URL = 'https://api.tvmaze.com';
const PROXY_API_URL = '/api/tvmaze';

async function fetchWithFallback<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
  const primaryUrl = `${PRIMARY_API_URL}${endpoint}`;
  
  try {
    const response = await fetch(primaryUrl, {
      signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    return await response.json() as T;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }

    try {
      const proxyUrl = `${PROXY_API_URL}${endpoint}`;
      const proxyRes = await fetch(proxyUrl, { signal });
      if (proxyRes.ok) {
        return await proxyRes.json() as T;
      }
    } catch {
      // Proxy fallback failed
    }

    throw err instanceof Error ? err : new Error('Failed to fetch data from API');
  }
}

export async function getTrendingShows(signal?: AbortSignal): Promise<Show[]> {
  const shows = await fetchWithFallback<Show[]>('/shows?page=0', signal);
  return shows
    .filter(s => s.image && s.summary && s.rating?.average)
    .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
    .slice(0, 30);
}

export async function searchShows(query: string, signal?: AbortSignal): Promise<Show[]> {
  if (!query.trim()) {
    return getTrendingShows(signal);
  }
  const results = await fetchWithFallback<SearchResult[]>(`/search/shows?q=${encodeURIComponent(query)}`, signal);
  return results.map(r => r.show);
}

export async function getShowDetails(id: number | string, signal?: AbortSignal): Promise<Show> {
  return fetchWithFallback<Show>(`/shows/${id}?embed[]=episodes&embed[]=cast`, signal);
}

export async function getShowEpisodes(id: number | string, signal?: AbortSignal): Promise<Episode[]> {
  return fetchWithFallback<Episode[]>(`/shows/${id}/episodes`, signal);
}

export async function getShowCast(id: number | string, signal?: AbortSignal): Promise<CastMember[]> {
  return fetchWithFallback<CastMember[]>(`/shows/${id}/cast`, signal);
}

export async function getScheduleByCountry(countryCode = 'US', dateStr?: string, signal?: AbortSignal): Promise<AiringItem[]> {
  const dateParam = dateStr ? `&date=${dateStr}` : '';
  return fetchWithFallback<AiringItem[]>(`/schedule?country=${countryCode}${dateParam}`, signal);
}

export const FALLBACK_SHOWS: Show[] = [
  {
    id: 1,
    url: 'https://www.tvmaze.com/shows/1/under-the-dome',
    name: 'Under the Dome',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama', 'Science-Fiction', 'Thriller'],
    status: 'Ended',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2013-06-24',
    ended: '2015-09-10',
    officialSite: 'http://www.cbs.com/shows/under-the-dome/',
    schedule: { time: '22:00', days: ['Thursday'] },
    rating: { average: 6.5 },
    weight: 97,
    network: {
      id: 2,
      name: 'CBS',
      country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
      officialSite: null
    },
    webChannel: null,
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/81/202627.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original_untouched/81/202627.jpg'
    },
    summary: '<p>Under the Dome tells the story of a small town that is suddenly and inexplicably sealed off from the rest of the world by an enormous transparent dome.</p>',
    updated: 1704794237
  },
  {
    id: 2,
    url: 'https://www.tvmaze.com/shows/2/person-of-interest',
    name: 'Person of Interest',
    type: 'Scripted',
    language: 'English',
    genres: ['Action', 'Crime', 'Drama'],
    status: 'Ended',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2011-09-22',
    ended: '2016-06-21',
    officialSite: 'http://www.cbs.com/shows/person_of_interest/',
    schedule: { time: '22:00', days: ['Tuesday'] },
    rating: { average: 8.8 },
    weight: 98,
    network: {
      id: 2,
      name: 'CBS',
      country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
      officialSite: null
    },
    webChannel: null,
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/163/407679.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original_untouched/163/407679.jpg'
    },
    summary: '<p>You are being watched. The government has a secret system, a machine that spies on you every hour of every day. An ex-CIA agent and a mysterious billionaire team up to prevent violent crimes in New York City.</p>',
    updated: 1704794237
  },
  {
    id: 169,
    url: 'https://www.tvmaze.com/shows/169/breaking-bad',
    name: 'Breaking Bad',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama', 'Crime', 'Thriller'],
    status: 'Ended',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2008-01-20',
    ended: '2013-09-29',
    officialSite: 'http://www.amc.com/shows/breaking-bad',
    schedule: { time: '22:00', days: ['Sunday'] },
    rating: { average: 9.2 },
    weight: 100,
    network: {
      id: 20,
      name: 'AMC',
      country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
      officialSite: null
    },
    webChannel: null,
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original_untouched/0/2400.jpg'
    },
    summary: '<p>Breaking Bad follows high school chemistry teacher Walter White who is diagnosed with inoperable lung cancer and turns to manufacturing methamphetamine to secure his family financial future.</p>',
    updated: 1704794237
  },
  {
    id: 82,
    url: 'https://www.tvmaze.com/shows/82/game-of-thrones',
    name: 'Game of Thrones',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama', 'Adventure', 'Fantasy'],
    status: 'Ended',
    runtime: 60,
    averageRuntime: 61,
    premiered: '2011-04-17',
    ended: '2019-05-19',
    officialSite: 'http://www.hbo.com/game-of-thrones',
    schedule: { time: '21:00', days: ['Sunday'] },
    rating: { average: 8.9 },
    weight: 99,
    network: {
      id: 8,
      name: 'HBO',
      country: { name: 'United States', code: 'US', timezone: 'America/New_York' },
      officialSite: null
    },
    webChannel: null,
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/190/476117.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original_untouched/190/476117.jpg'
    },
    summary: '<p>Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for a thousand years.</p>',
    updated: 1704794237
  }
];
