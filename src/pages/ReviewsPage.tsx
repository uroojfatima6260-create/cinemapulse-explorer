import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkCheck, MessageSquarePlus, Trash2, Star, Clock, CheckCircle2, Bookmark } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { ReviewForm } from '../components/ReviewForm';
import { FALLBACK_SHOWS } from '../services/api';
import { Badge } from '../components/ui/Badge';
import { ShowCard } from '../components/ShowCard';

export const ReviewsPage: React.FC = () => {
  const { reviews, bookmarks, deleteReview, toggleBookmark, isBookmarked } = useReviews();
  const [activeTab, setActiveTab] = useState<'watchlist' | 'reviews' | 'write'>('watchlist');

  const bookmarkedShows = FALLBACK_SHOWS.filter(s => bookmarks.includes(s.id));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Watchlist & Community Reviews</h1>
        <p className="text-sm text-slate-400">
          Manage your saved show collection and publish community critiques with client-side form validation.
        </p>
      </header>

      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto" role="tablist" aria-label="Review page sections">
        {[
          { id: 'watchlist', label: `My Watchlist (${bookmarks.length})`, icon: Bookmark },
          { id: 'reviews', label: `Published Reviews (${reviews.length})`, icon: BookmarkCheck },
          { id: 'write', label: 'Write New Review', icon: MessageSquarePlus },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`section-${tab.id}`}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all min-h-[44px] cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'watchlist' && (
          <section id="section-watchlist" role="tabpanel" aria-labelledby="tab-btn-watchlist" className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Bookmarked Shows</h2>
              <Link
                to="/explore"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline focus:ring-2 focus:ring-indigo-400 rounded min-h-[44px] flex items-center"
              >
                + Browse More Catalog Shows
              </Link>
            </div>

            {bookmarks.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-slate-800 text-slate-500 rounded-full">
                  <Bookmark className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Your Watchlist is empty</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Click the bookmark icon on any TV show card to store titles for future viewing.
                  </p>
                </div>
                <Link
                  to="/explore"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all min-h-[44px] flex items-center"
                >
                  Explore Shows Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                {bookmarkedShows.map(show => (
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
        )}

        {activeTab === 'reviews' && (
          <section id="section-reviews" role="tabpanel" aria-labelledby="tab-btn-reviews" className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Community Reviews</h2>
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors min-h-[44px] cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Add Review</span>
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
                No reviews recorded in client state yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map(rev => (
                  <article
                    key={rev.id}
                    className={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between transition-all ${
                      rev.isOptimistic
                        ? 'border-indigo-500/80 bg-indigo-950/20 animate-pulse'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <Link
                            to={`/shows/${rev.showId}`}
                            className="font-black text-white text-base hover:text-indigo-400 transition-colors line-clamp-1 block focus:outline-none focus:underline"
                          >
                            {rev.showTitle}
                          </Link>
                          <div className="text-xs text-slate-400 font-medium">{rev.userName}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteReview(rev.id)}
                          aria-label={`Delete review by ${rev.userName}`}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{rev.rating} / 5</span>
                        </div>
                        <Badge variant="indigo" size="sm">
                          {rev.watchStatus}
                        </Badge>
                      </div>

                      <p className="text-slate-300 text-sm leading-relaxed mb-4">{rev.reviewText}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>

                      {rev.isOptimistic && (
                        <div className="flex items-center gap-1 text-indigo-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Syncing...</span>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'write' && (
          <section id="section-write" role="tabpanel" aria-labelledby="tab-btn-write" className="max-w-2xl mx-auto">
            <ReviewForm onSuccess={() => setActiveTab('reviews')} />
          </section>
        )}
      </div>
    </div>
  );
};
