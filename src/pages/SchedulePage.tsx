import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Globe, Clock, Tv, Star, Film } from 'lucide-react';
import { getScheduleByCountry } from '../services/api';
import { useApi } from '../hooks/useApi';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { Badge } from '../components/ui/Badge';
import { AiringItem } from '../types';

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
];

export const SchedulePage: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const { data: scheduleItems, loading, errorMessage, isRetrying, retry } = useApi<AiringItem[]>(
    signal => getScheduleByCountry(selectedCountry, selectedDate, signal),
    [selectedCountry, selectedDate],
    []
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Broadcast Schedule</h1>
        <p className="text-sm text-slate-400">
          Live broadcast linear programming retrieved directly from TVMaze global TV schedules.
        </p>
      </header>

      <section aria-label="Schedule Filter Controls" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label htmlFor="country-select" className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
              <Globe className="w-3.5 h-3.5" />
              Country:
            </label>
            <select
              id="country-select"
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[44px] cursor-pointer"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="date-input" className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5" />
              Date:
            </label>
            <input
              id="date-input"
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[44px] cursor-pointer"
            />
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong>{scheduleItems?.length || 0}</strong> broadcast episodes
        </div>
      </section>

      <section aria-label="Scheduled Episode List">
        {loading ? (
          <div aria-busy="true" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4 animate-pulse">
                <div className="w-20 aspect-[2/3] bg-slate-800 rounded-xl" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                  <div className="h-8 bg-slate-800 rounded mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          <ErrorDisplay
            title="Failed to fetch broadcast schedule"
            message={errorMessage}
            onRetry={retry}
            isRetrying={isRetrying}
          />
        ) : !scheduleItems || scheduleItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <Film className="w-10 h-10 text-slate-600" />
            <h3 className="text-lg font-bold text-white">No episodes scheduled</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              No airing data reported for {COUNTRIES.find(c => c.code === selectedCountry)?.name} on {selectedDate}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduleItems.map((item: AiringItem) => {
              const show = item.show;
              return (
                <article
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex gap-4 transition-all hover:shadow-lg"
                >
                  <Link
                    to={`/shows/${show.id}`}
                    className="w-24 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl"
                  >
                    <ImageWithFallback
                      src={show.image?.medium || item.image?.medium}
                      alt={show.name}
                      aspectRatio="aspect-[2/3]"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-indigo-400 font-bold mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.airtime || 'TBD'}</span>
                        <span>•</span>
                        <span>{item.runtime || 30}m</span>
                      </div>

                      <Link
                        to={`/shows/${show.id}`}
                        className="font-bold text-white text-base hover:text-indigo-400 transition-colors line-clamp-1 block focus:outline-none focus:underline"
                      >
                        {show.name}
                      </Link>

                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {item.name ? `"${item.name}"` : `Season ${item.season} Ep ${item.number}`}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                        <Tv className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{show.network?.name || show.webChannel?.name || 'Local'}</span>
                      </div>

                      {show.rating?.average && (
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{show.rating.average}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
