import React, { useState, useMemo, useDeferredValue } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, LayoutGrid, List, RotateCcw } from 'lucide-react';
import { searchShows, getTrendingShows, FALLBACK_SHOWS } from '../services/api';
import { useApi } from '../hooks/useApi';
import { ShowCard } from '../components/ShowCard';
import { ShowCardSkeleton } from '../components/ui/Skeleton';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';
import { EmptyState } from '../components/ui/EmptyState';
import { useReviews } from '../hooks/useReviews';
import { Show } from '../types';

const ALL_GENRES = [
  'All',
  'Drama',
  'Action',
  'Comedy',
  'Science-Fiction',
  'Crime',
  'Thriller',
  'Adventure',
  'Fantasy',
  'Horror',
  'Romance',
  'Mystery',
];

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') || 'All';
  const initialSort = searchParams.get('sort') || 'rating';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [sortBy, setSortBy] = useState(initialSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const deferredQuery = useDeferredValue(searchQuery);

  const { data: rawShows, loading, errorMessage, isRetrying, retry } = useApi<Show[]>(
    signal => {
      if (deferredQuery.trim().length > 0) {
        return searchShows(deferredQuery, signal);
      }
      return getTrendingShows(signal);
    },
    [deferredQuery],
    FALLBACK_SHOWS
  );

  const { toggleBookmark, isBookmarked } = useReviews();

  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
    const params = new URLSearchParams(searchParams);
    if (val.trim()) {
      params.set('q', val);
    } else {
      params.delete('q');
    }
    setSearchParams(params, { replace: true });
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    const params = new URLSearchParams(searchParams);
    if (genre !== 'All') {
      params.set('genre', genre);
    } else {
      params.delete('genre');
    }
    setSearchParams(params, { replace: true });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    const params = new URLSearchParams(searchParams);
    if (sort !== 'rating') {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }
    setSearchParams(params, { replace: true });
  };

  const filteredShows = useMemo(() => {
    if (!rawShows) return [];

    let list = [...rawShows];

    if (selectedGenre !== 'All') {
      list = list.filter(show =>
        show.genres && show.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating?.average || 0) - (a.rating?.average || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'premiered') {
        return (b.premiered || '').localeCompare(a.premiered || '');
      }
      return 0;
    });

    return list;
  }, [rawShows, selectedGenre, sortBy]);

  const resetAllFilters = () => {
    handleQueryChange('');
    handleGenreChange('All');
    handleSortChange('rating');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Explore Catalog</h1>
        <p className="text-sm text-slate-400">
          Search titles, filter by genre, and discover shows with real-time API queries.
        </p>
      </header>

      <section aria-label="Search and Filter Controls" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col gap-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              Search by show title or keyword
            </label>
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={e => handleQueryChange(e.target.value)}
              placeholder="Search TV shows (e.g. Breaking Bad, Doctor Who, Stranger Things)..."
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none min-h-[44px]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={e => handleSortChange(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[44px] cursor-pointer"
              >
                <option value="rating">Highest Rating</option>
                <option value="name">Title (A-Z)</option>
                <option value="premiered">Release Date</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded-xl" role="group" aria-label="View Mode">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Grid layout view"
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="List layout view"
                aria-pressed={viewMode === 'list'}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Genre Filter:
            </span>

            {(selectedGenre !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 focus:outline-none focus:underline min-h-[44px] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1" role="radiogroup" aria-label="Filter by genre">
            {ALL_GENRES.map(genre => {
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleGenreChange(genre)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border min-h-[44px] cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="catalog-results-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="catalog-results-heading" className="text-lg font-bold text-white">
            {loading ? 'Searching Shows...' : `Found ${filteredShows.length} Result${filteredShows.length === 1 ? '' : 's'}`}
          </h2>
          {searchQuery && (
            <span className="text-xs text-slate-400">
              Query: <strong className="text-indigo-300">"{searchQuery}"</strong>
            </span>
          )}
        </div>

        {loading ? (
          <ShowCardSkeleton count={12} />
        ) : errorMessage && rawShows === FALLBACK_SHOWS ? (
          <div className="flex flex-col gap-6">
            <ErrorDisplay
              title="Failed to query live TVMaze search"
              message={errorMessage}
              onRetry={retry}
              isRetrying={isRetrying}
            />
            {filteredShows.length > 0 && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredShows.map(show => (
                  <ShowCard
                    key={show.id}
                    show={show}
                    layout={viewMode}
                    isBookmarked={isBookmarked(show.id)}
                    onToggleBookmark={(_, e) => {
                      e.preventDefault();
                      toggleBookmark(show.id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : filteredShows.length === 0 ? (
          <EmptyState
            title="No TV shows matched your criteria"
            message={`No titles found for query "${searchQuery}" in genre "${selectedGenre}". Try clearing your search filters.`}
            actionText="Clear All Filters"
            onAction={resetAllFilters}
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {filteredShows.map(show => (
              <ShowCard
                key={show.id}
                show={show}
                layout={viewMode}
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
