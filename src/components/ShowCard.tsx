import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star } from 'lucide-react';
import { Show } from '../types';
import { ImageWithFallback } from './ui/ImageWithFallback';
import { Badge } from './ui/Badge';

interface ShowCardProps {
  show: Show;
  isBookmarked?: boolean;
  onToggleBookmark?: (showId: number, e: React.MouseEvent) => void;
  layout?: 'grid' | 'list';
}

export const ShowCard: React.FC<ShowCardProps> = ({
  show,
  isBookmarked = false,
  onToggleBookmark,
  layout = 'grid',
}) => {
  const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'N/A';
  const year = show.premiered ? show.premiered.substring(0, 4) : 'TBA';
  const cleanSummary = show.summary
    ? show.summary.replace(/<[^>]*>/g, '').trim()
    : 'No summary available.';

  if (layout === 'list') {
    return (
      <article className="group relative bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5">
        <Link
          to={`/shows/${show.id}`}
          className="w-full sm:w-36 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-xl"
          aria-label={`View details for ${show.name}`}
        >
          <ImageWithFallback
            src={show.image?.medium}
            alt={show.name}
            aspectRatio="aspect-[2/3]"
          />
        </Link>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  to={`/shows/${show.id}`}
                  className="group-hover:text-indigo-400 text-white font-bold text-lg sm:text-xl transition-colors line-clamp-1 focus:outline-none focus:underline"
                >
                  {show.name}
                </Link>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">{year}</span>
                  <span>•</span>
                  <span>{show.network?.name || show.webChannel?.name || 'TV'}</span>
                  <span>•</span>
                  <span>{show.type}</span>
                </div>
              </div>

              {onToggleBookmark && (
                <button
                  type="button"
                  onClick={(e) => onToggleBookmark(show.id, e)}
                  aria-label={isBookmarked ? `Remove ${show.name} from watchlist` : `Add ${show.name} to watchlist`}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isBookmarked
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                </button>
              )}
            </div>

            <p className="text-slate-300 text-sm mt-3 line-clamp-2 leading-relaxed">
              {cleanSummary}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800">
            <div className="flex flex-wrap gap-1.5">
              {show.genres.slice(0, 3).map(genre => (
                <Badge key={genre} variant="indigo" size="sm">
                  {genre}
                </Badge>
              ))}
              <Badge variant={show.status === 'Running' ? 'success' : 'default'} size="sm">
                {show.status}
              </Badge>
            </div>

            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/20 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
      <div>
        <div className="relative mb-3">
          <Link
            to={`/shows/${show.id}`}
            tabIndex={-1}
            aria-hidden="true"
            className="block"
          >
            <ImageWithFallback
              src={show.image?.medium}
              alt={show.name}
              aspectRatio="aspect-[2/3]"
            />
          </Link>

          <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md text-amber-300 border border-amber-500/30 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
          </div>

          {onToggleBookmark && (
            <button
              type="button"
              onClick={(e) => onToggleBookmark(show.id, e)}
              aria-label={isBookmarked ? `Remove ${show.name} from watchlist` : `Add ${show.name} to watchlist`}
              className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md border transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-950/70 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          )}
        </div>

        <Link
          to={`/shows/${show.id}`}
          className="group-hover:text-indigo-400 text-white font-bold text-base transition-colors line-clamp-1 block focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-md p-0.5"
        >
          {show.name}
        </Link>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
          <span>{year}</span>
          <span className="truncate max-w-[120px]">{show.network?.name || show.webChannel?.name || 'TV'}</span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex gap-1 overflow-hidden">
          {show.genres[0] && (
            <Badge variant="indigo" size="sm">
              {show.genres[0]}
            </Badge>
          )}
        </div>

        <Badge variant={show.status === 'Running' ? 'success' : 'default'} size="sm">
          {show.status}
        </Badge>
      </div>
    </article>
  );
};
