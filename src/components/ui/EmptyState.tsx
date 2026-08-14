import React from 'react';
import { SearchX, FilterX, Film } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: 'search' | 'filter' | 'film';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No shows found',
  message = 'Try adjusting your search query or filter settings.',
  actionText = 'Reset Filters',
  onAction,
  icon = 'search',
}) => {
  const IconComponent = icon === 'filter' ? FilterX : icon === 'film' ? Film : SearchX;

  return (
    <div className="w-full my-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4">
      <div className="p-4 bg-slate-800 text-slate-400 rounded-full border border-slate-700">
        <IconComponent className="w-8 h-8" />
      </div>

      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
      </div>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-xl border border-slate-700 transition-all focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[44px] min-w-[44px] cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
