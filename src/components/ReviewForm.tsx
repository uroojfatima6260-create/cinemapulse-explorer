import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { ReviewFormData, WatchStatus } from '../types';
import { useReviews } from '../hooks/useReviews';
import { StarRating } from './ui/StarRating';

interface ReviewFormProps {
  preselectedShow?: { id: number; name: string };
  onSuccess?: () => void;
}

interface FormErrors {
  userName?: string;
  userEmail?: string;
  reviewText?: string;
  rating?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ preselectedShow, onSuccess }) => {
  const { submitReview, isSubmitting } = useReviews();

  const [formData, setFormData] = useState<ReviewFormData>({
    showId: preselectedShow?.id || 169,
    showTitle: preselectedShow?.name || 'Breaking Bad',
    userName: '',
    userEmail: '',
    rating: 5,
    watchStatus: 'Completed',
    reviewText: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validate = (data: ReviewFormData): FormErrors => {
    const errs: FormErrors = {};

    if (!data.userName.trim()) {
      errs.userName = 'Your name is required.';
    } else if (data.userName.trim().length < 2) {
      errs.userName = 'Name must be at least 2 characters.';
    }

    if (!data.userEmail.trim()) {
      errs.userEmail = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errs.userEmail = 'Please provide a valid email format (e.g. user@example.com).';
    }

    if (!data.reviewText.trim()) {
      errs.reviewText = 'Review commentary is required.';
    } else if (data.reviewText.trim().length < 15) {
      errs.reviewText = `Review is too brief (${data.reviewText.trim().length}/15 characters minimum).`;
    }

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errs.rating = 'Please pick a rating between 1 and 5 stars.';
    }

    return errs;
  };

  const handleBlur = (field: keyof ReviewFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const currentErrors = validate(formData);
    setErrors(currentErrors);
  };

  const handleChange = (field: keyof ReviewFormData, value: unknown) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);

    if (touched[field]) {
      const currentErrors = validate(nextData);
      setErrors(currentErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      userName: true,
      userEmail: true,
      reviewText: true,
      rating: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.focus();
      return;
    }

    setStatusMessage(null);
    const result = await submitReview(formData);

    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      setFormData({
        showId: preselectedShow?.id || 169,
        showTitle: preselectedShow?.name || 'Breaking Bad',
        userName: '',
        userEmail: '',
        rating: 5,
        watchStatus: 'Completed',
        reviewText: '',
      });
      setTouched({});
      setErrors({});
      onSuccess?.();
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="review-form-title"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="review-form-title" className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>Write a Community Review</span>
        </h2>
        <p className="text-xs text-slate-400">
          Share your review for <strong className="text-white">{formData.showTitle}</strong>.
        </p>
      </div>

      {statusMessage && (
        <div
          role="alert"
          aria-live="polite"
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-red-500/10 text-red-300 border-red-500/30'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-userName" className="text-xs font-semibold text-slate-300">
            Your Name <span className="text-red-400">*</span>
          </label>
          <input
            id="field-userName"
            type="text"
            required
            value={formData.userName}
            onChange={e => handleChange('userName', e.target.value)}
            onBlur={() => handleBlur('userName')}
            aria-invalid={!!errors.userName}
            aria-describedby={errors.userName ? 'error-userName' : undefined}
            placeholder="e.g. Alex Morgan"
            className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.userName && touched.userName
                ? 'border-red-500/80 focus:ring-red-400'
                : 'border-slate-700 focus:ring-indigo-400'
            }`}
          />
          {errors.userName && touched.userName && (
            <span id="error-userName" className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.userName}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-userEmail" className="text-xs font-semibold text-slate-300">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            id="field-userEmail"
            type="email"
            required
            value={formData.userEmail}
            onChange={e => handleChange('userEmail', e.target.value)}
            onBlur={() => handleBlur('userEmail')}
            aria-invalid={!!errors.userEmail}
            aria-describedby={errors.userEmail ? 'error-userEmail' : undefined}
            placeholder="e.g. alex@example.com"
            className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.userEmail && touched.userEmail
                ? 'border-red-500/80 focus:ring-red-400'
                : 'border-slate-700 focus:ring-indigo-400'
            }`}
          />
          {errors.userEmail && touched.userEmail && (
            <span id="error-userEmail" className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.userEmail}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-1.5">
          <label id="rating-label" className="text-xs font-semibold text-slate-300">
            Rating Score <span className="text-red-400">*</span>
          </label>
          <div className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between min-h-[44px]">
            <StarRating
              value={formData.rating}
              interactive
              onChange={val => handleChange('rating', val)}
              size="md"
            />
            <span className="text-xs font-bold text-amber-400 px-2">
              {formData.rating} / 5 Stars
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-watchStatus" className="text-xs font-semibold text-slate-300">
            Viewing Status
          </label>
          <select
            id="field-watchStatus"
            value={formData.watchStatus}
            onChange={e => handleChange('watchStatus', e.target.value as WatchStatus)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px] cursor-pointer"
          >
            <option value="Completed">Completed</option>
            <option value="Watching">Currently Watching</option>
            <option value="Plan to Watch">Plan to Watch</option>
            <option value="On Hold">On Hold</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="field-reviewText" className="text-xs font-semibold text-slate-300">
            Review Commentary <span className="text-red-400">*</span>
          </label>
          <span className="text-[11px] text-slate-400">
            {formData.reviewText.length} / 15 chars min
          </span>
        </div>
        <textarea
          id="field-reviewText"
          rows={4}
          required
          value={formData.reviewText}
          onChange={e => handleChange('reviewText', e.target.value)}
          onBlur={() => handleBlur('reviewText')}
          aria-invalid={!!errors.reviewText}
          aria-describedby={errors.reviewText ? 'error-reviewText' : undefined}
          placeholder="Share your thoughts on pacing, acting performances, plot twists, cinematography..."
          className={`w-full bg-slate-950 border rounded-xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 ${
            errors.reviewText && touched.reviewText
              ? 'border-red-500/80 focus:ring-red-400'
              : 'border-slate-700 focus:ring-indigo-400'
          }`}
        />
        {errors.reviewText && touched.reviewText && (
          <span id="error-reviewText" className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.reviewText}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto self-start inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[44px] cursor-pointer"
      >
        <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
        <span>{isSubmitting ? 'Publishing Review...' : 'Submit Review'}</span>
      </button>
    </form>
  );
};
