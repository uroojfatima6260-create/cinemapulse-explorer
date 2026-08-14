import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`animate-pulse bg-slate-800/80 rounded-xl ${className}`}
        />
      ))}
    </>
  );
};

export const ShowCardSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading show content..."
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-3 flex flex-col gap-3"
        >
          <div className="w-full aspect-[2/3] bg-slate-800 rounded-xl animate-pulse" />
          
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-slate-800 rounded-md w-3/4 animate-pulse" />
            <div className="flex items-center justify-between">
              <div className="h-3 bg-slate-800 rounded-md w-1/3 animate-pulse" />
              <div className="h-3 bg-slate-800 rounded-md w-1/4 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ShowDetailsSkeleton: React.FC = () => {
  return (
    <div aria-busy="true" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="w-full aspect-[2/3] max-w-sm mx-auto md:max-w-none bg-slate-800 rounded-2xl animate-pulse" />
        <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
          <div className="h-8 bg-slate-800 rounded-lg w-2/3 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-800 rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-slate-800 rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-slate-800 rounded-full animate-pulse" />
          </div>
          <div className="h-24 bg-slate-800 rounded-xl w-full animate-pulse mt-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            <div className="h-16 bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-16 bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-16 bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
