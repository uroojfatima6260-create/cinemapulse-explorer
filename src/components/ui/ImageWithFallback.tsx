import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[2/3]',
  priority = false,
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`w-full ${aspectRatio} bg-slate-800 border border-slate-700/50 rounded-xl flex flex-col items-center justify-center p-4 text-slate-500 gap-2 select-none ${className}`}
        aria-label={alt}
      >
        <Film className="w-8 h-8 text-slate-600" />
        <span className="text-xs text-slate-400 text-center font-medium line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectRatio} overflow-hidden bg-slate-800 rounded-xl ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" aria-hidden="true" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
