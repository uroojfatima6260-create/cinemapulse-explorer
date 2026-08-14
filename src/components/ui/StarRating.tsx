import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  max?: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1" role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${value} out of ${max} stars`}>
      {stars.map(starIndex => {
        const isFilled = starIndex <= Math.round(value);

        if (interactive) {
          return (
            <button
              key={starIndex}
              type="button"
              role="radio"
              aria-checked={isFilled}
              aria-label={`${starIndex} star${starIndex > 1 ? 's' : ''}`}
              onClick={() => onChange?.(starIndex)}
              className="p-1 text-slate-600 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <Star
                className={`${iconSizes[size]} ${
                  isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                }`}
              />
            </button>
          );
        }

        return (
          <Star
            key={starIndex}
            className={`${iconSizes[size]} ${
              isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
            }`}
          />
        );
      })}
    </div>
  );
};
