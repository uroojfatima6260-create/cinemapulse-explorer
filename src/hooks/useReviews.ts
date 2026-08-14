import { useCallback, useEffect, useState } from 'react';
import { ReviewFormData, ReviewItem, WatchStatus } from '../types';

const REVIEWS_STORAGE_KEY = 'cinemapulse_reviews_v1';
const BOOKMARKS_STORAGE_KEY = 'cinemapulse_bookmarks_v1';

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    showId: 169,
    showTitle: 'Breaking Bad',
    userName: 'Elena Rostova',
    userEmail: 'elena@devpulse.io',
    rating: 5,
    watchStatus: 'Completed',
    reviewText: 'Masterpiece of modern television. The character development of Walter White is unparalleled in writing consistency and tension building.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'rev-2',
    showId: 2,
    showTitle: 'Person of Interest',
    userName: 'Marcus Vance',
    userEmail: 'marcus@techreview.com',
    rating: 5,
    watchStatus: 'Completed',
    reviewText: 'Prescient narrative on modern surveillance and artificial intelligence. Fast-paced procedural that turns into a profound serial sci-fi.',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'rev-3',
    showId: 82,
    showTitle: 'Game of Thrones',
    userName: 'Sophia Chen',
    userEmail: 'sophia.c@cinema.net',
    rating: 4,
    watchStatus: 'Completed',
    reviewText: 'Incredible cinematic scale, world-building, and cast ensemble. Earlier seasons set a high benchmark for fantasy screen adaptations.',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  }
];

const INITIAL_BOOKMARKS: number[] = [169, 2, 82];

export function useReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BOOKMARKS;
    } catch {
      return INITIAL_BOOKMARKS;
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save reviews to localStorage', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarks]);

  const submitReview = useCallback(async (formData: ReviewFormData): Promise<{ success: boolean; message: string }> => {
    setIsSubmitting(true);
    setSubmitSuccess(null);

    const newId = `rev-${Date.now()}`;
    const optimisticReview: ReviewItem = {
      id: newId,
      showId: Number(formData.showId),
      showTitle: formData.showTitle || 'Custom Entry',
      userName: formData.userName,
      userEmail: formData.userEmail,
      rating: formData.rating,
      watchStatus: formData.watchStatus as WatchStatus,
      reviewText: formData.reviewText,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setReviews(prev => [optimisticReview, ...prev]);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      setReviews(prev =>
        prev.map(item => (item.id === newId ? { ...item, isOptimistic: false } : item))
      );

      setSubmitSuccess('Review published successfully!');
      return { success: true, message: 'Review published successfully!' };
    } catch {
      setReviews(prev => prev.filter(item => item.id !== newId));
      return { success: false, message: 'Failed to submit review. Please try again.' };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteReview = useCallback((id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  }, []);

  const toggleBookmark = useCallback((showId: number) => {
    setBookmarks(prev => {
      const exists = prev.includes(showId);
      if (exists) {
        return prev.filter(id => id !== showId);
      } else {
        return [...prev, showId];
      }
    });
  }, []);

  return {
    reviews,
    bookmarks,
    isSubmitting,
    submitSuccess,
    submitReview,
    deleteReview,
    toggleBookmark,
    isBookmarked: (showId: number) => bookmarks.includes(showId),
  };
}
