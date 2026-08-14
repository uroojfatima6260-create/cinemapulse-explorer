import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Calendar,
  Clock,
  Globe,
  Tv,
  Bookmark,
  ChevronLeft,
  Users,
  Film,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { getShowDetails, FALLBACK_SHOWS } from '../services/api';
import { useApi } from '../hooks/useApi';
import { ShowDetailsSkeleton } from '../components/ui/Skeleton';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { Badge } from '../components/ui/Badge';
import { useReviews } from '../hooks/useReviews';
import { ReviewForm } from '../components/ReviewForm';
import { Show } from '../types';

export const ShowDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const showId = id || '1';

  const { data: show, loading, errorMessage, isRetrying, retry } = useApi<Show>(
    signal => getShowDetails(showId, signal),
    [showId],
    FALLBACK_SHOWS.find(s => s.id.toString() === showId) || FALLBACK_SHOWS[0]
  );

  const { toggleBookmark, isBookmarked, reviews } = useReviews();
  const [activeTab, setActiveTab] = useState<'overview' | 'episodes' | 'cast' | 'review'>('overview');

  const showReviews = reviews.filter(r => r.showId === Number(showId));
  const bookmarked = isBookmarked(Number(showId));

  if (loading) {
    return <ShowDetailsSkeleton />;
  }

  if (errorMessage && !show) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ErrorDisplay
          title="Could not load show details"
          message={errorMessage}
          onRetry={retry}
          isRetrying={isRetrying}
        />
        <div className="text-center mt-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-indigo-400"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!show) return null;

  const episodes = show._embedded?.episodes || [];
  const cast = show._embedded?.cast || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors focus:outline-none focus:underline min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <header className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 lg:col-span-3 w-full max-w-xs mx-auto md:max-w-none">
            <ImageWithFallback
              src={show.image?.original || show.image?.medium}
              alt={show.name}
              aspectRatio="aspect-[2/3]"
              priority
              className="shadow-2xl ring-1 ring-white/10"
            />
          </div>

          <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="indigo" size="md">
                  {show.type || 'Scripted'}
                </Badge>
                <Badge variant={show.status === 'Running' ? 'success' : 'default'} size="md">
                  {show.status}
                </Badge>
                {show.language && (
                  <Badge variant="outline" size="md">
                    {show.language}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleBookmark(show.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer min-h-[44px] min-w-[44px] ${
                    bookmarked
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  }`}
                  aria-label={bookmarked ? 'Remove show from Watchlist' : 'Add show to Watchlist'}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
                  <span>{bookmarked ? 'In Watchlist' : 'Bookmark Show'}</span>
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {show.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-medium bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{show.rating?.average ? `${show.rating.average} / 10` : 'Not Rated'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{show.premiered || 'TBA'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{show.averageRuntime || show.runtime || 60} min / ep</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-slate-400" />
                <span>{show.network?.name || show.webChannel?.name || 'Broadcast'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {show.genres.map(genre => (
                <span key={genre} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold">
                  {genre}
                </span>
              ))}
            </div>

            {show.officialSite && (
              <div>
                <a
                  href={show.officialSite}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline focus:ring-2 focus:ring-indigo-400 rounded min-h-[44px]"
                >
                  <Globe className="w-4 h-4" />
                  <span>Official Network Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto" role="tablist" aria-label="Show Details Tabs">
        {[
          { id: 'overview', label: 'Overview & Synopsis', icon: Film },
          { id: 'episodes', label: `Episodes (${episodes.length})`, icon: Tv },
          { id: 'cast', label: `Cast & Crew (${cast.length})`, icon: Users },
          { id: 'review', label: `Reviews (${showReviews.length})`, icon: PlusCircle },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all min-h-[44px] cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div
            id="panel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white">Storyline & Synopsis</h2>
              <div
                className="text-slate-300 leading-relaxed text-sm sm:text-base space-y-3 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: show.summary || '<p>No written synopsis provided by TVMaze data records.</p>',
                }}
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white">Broadcast Details</h2>

              <dl className="divide-y divide-slate-800 text-xs">
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-400">Schedule</dt>
                  <dd className="font-semibold text-white">
                    {show.schedule?.days.join(', ') || 'Various'} at {show.schedule?.time || 'TBD'}
                  </dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-400">Premiered</dt>
                  <dd className="font-semibold text-white">{show.premiered || 'N/A'}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-400">Ended</dt>
                  <dd className="font-semibold text-white">{show.ended || 'Still Airing'}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-400">Network Country</dt>
                  <dd className="font-semibold text-white">{show.network?.country?.name || 'International'}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-slate-400">TVMaze Show ID</dt>
                  <dd className="font-mono text-slate-400">#{show.id}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'episodes' && (
          <div id="panel-episodes" role="tabpanel" aria-labelledby="tab-episodes" className="flex flex-col gap-4">
            {episodes.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
                No individual episode breakdown indexed for this title.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {episodes.map(ep => (
                  <div key={ep.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4">
                    <div className="w-24 sm:w-28 flex-shrink-0">
                      <ImageWithFallback
                        src={ep.image?.medium}
                        alt={ep.name}
                        aspectRatio="aspect-video"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold">
                        <span>S{ep.season} E{ep.number}</span>
                        {ep.rating?.average && (
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {ep.rating.average}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-sm line-clamp-1 mt-0.5">{ep.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {ep.summary ? ep.summary.replace(/<[^>]*>/g, '') : 'No episode description recorded.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cast' && (
          <div id="panel-cast" role="tabpanel" aria-labelledby="tab-cast" className="flex flex-col gap-4">
            {cast.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
                No cast credits registered for this title.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cast.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 text-center">
                    <ImageWithFallback
                      src={item.person.image?.medium}
                      alt={item.person.name}
                      aspectRatio="aspect-[2/3]"
                    />
                    <div className="mt-1">
                      <div className="font-bold text-white text-xs line-clamp-1">{item.person.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{item.character.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'review' && (
          <div id="panel-review" role="tabpanel" aria-labelledby="tab-review" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <ReviewForm
                preselectedShow={{
                  id: show.id,
                  name: show.name,
                }}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white">Community Reviews for {show.name}</h3>

              {showReviews.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
                  No community reviews written yet for this title. Be the first to share your rating above!
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {showReviews.map(review => (
                    <div key={review.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{review.userName}</span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{review.rating} / 5</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{review.reviewText}</p>
                      <span className="text-[10px] text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
