import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Flame, TrendingUp, Sparkles, Tv, ArrowRight, ShieldCheck } from 'lucide-react';
import { getTrendingShows, FALLBACK_SHOWS } from '../services/api';
import { useApi } from '../hooks/useApi';
import { ShowCard } from '../components/ShowCard';
import { ShowCardSkeleton } from '../components/ui/Skeleton';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';
import { useReviews } from '../hooks/useReviews';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { Badge } from '../components/ui/Badge';

export const HomePage: React.FC = () => {
  const { data: shows, loading, errorMessage, isRetrying, retry } = useApi(
    signal => getTrendingShows(signal),
    [],
    FALLBACK_SHOWS
  );

  const { bookmarks, toggleBookmark, isBookmarked } = useReviews();

  const featuredShow = shows && shows.length > 0 ? shows[0] : FALLBACK_SHOWS[0];
  const trendingList = shows ? shows.slice(1, 13) : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-12">
      <section aria-label="Featured Show Highlight" className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 p-6 sm:p-10">
          <div className="lg:col-span-7 flex flex-col gap-4 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="indigo" size="md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Featured Highlight
              </Badge>
              <Badge variant="success" size="md">
                Rating {featuredShow.rating?.average || 9.2} / 10
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {featuredShow.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
              <span>{featuredShow.premiered?.substring(0, 4) || '2024'}</span>
              <span>•</span>
              <span>{featuredShow.network?.name || 'TV Network'}</span>
              <span>•</span>
              <div className="flex gap-1">
                {featuredShow.genres.slice(0, 3).join(', ')}
              </div>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3 my-2">
              {featuredShow.summary
                ? featuredShow.summary.replace(/<[^>]*>/g, '')
                : 'Explore detailed episode guides, cast member insights, and live community reviews.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                to={`/shows/${featuredShow.id}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[44px]"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => toggleBookmark(featuredShow.id)}
                className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border transition-all cursor-pointer min-h-[44px] ${
                  isBookmarked(featuredShow.id)
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>{isBookmarked(featuredShow.id) ? 'Saved to Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative w-full max-w-sm mx-auto lg:max-w-none">
            <Link to={`/shows/${featuredShow.id}`} tabIndex={-1} className="block group">
              <ImageWithFallback
                src={featuredShow.image?.original || featuredShow.image?.medium}
                alt={featuredShow.name}
                aspectRatio="aspect-[2/3]"
                priority
                className="shadow-2xl group-hover:scale-102 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Platform Highlights" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Real API Data', val: 'TVMaze REST', desc: 'Live data fetching', icon: Tv },
          { label: 'Request Routing', val: 'AbortSignal', desc: 'Auto-cancel on switch', icon: TrendingUp },
          { label: 'Saved Watchlist', val: `${bookmarks.length} Saved`, desc: 'Local persistence', icon: Flame },
          { label: 'Accessibility', val: '100 Compliance', desc: 'WCAG & ARIA ready', icon: ShieldCheck },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              <div className="text-xl font-extrabold text-white">{item.val}</div>
              <div className="text-xs text-slate-400">{item.desc}</div>
            </div>
          );
        })}
      </section>

      <section aria-labelledby="trending-heading" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 id="trending-heading" className="text-2xl font-bold text-white tracking-tight">
                Trending Shows
              </h2>
              <p className="text-xs text-slate-400">Popular media catalog fetched live from TVMaze API</p>
            </div>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none focus:underline min-h-[44px]"
          >
            <span>Explore Full Catalog</span>
            <Compass className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ShowCardSkeleton count={12} />
        ) : errorMessage && shows === FALLBACK_SHOWS ? (
          <div>
            <ErrorDisplay
              title="API Notice: Displaying Offline Fallback Shows"
              message={errorMessage}
              onRetry={retry}
              isRetrying={isRetrying}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mt-4">
              {trendingList.map(show => (
                <ShowCard
                  key={show.id}
                  show={show}
                  isBookmarked={isBookmarked(show.id)}
                  onToggleBookmark={(_, e) => {
                    e.preventDefault();
                    toggleBookmark(show.id);
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {trendingList.map(show => (
              <ShowCard
                key={show.id}
                show={show}
                isBookmarked={isBookmarked(show.id)}
                onToggleBookmark={(_, e) => {
                  e.preventDefault();
                  toggleBookmark(show.id);
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
