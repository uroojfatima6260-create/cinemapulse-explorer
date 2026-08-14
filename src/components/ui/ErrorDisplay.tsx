import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Failed to load content',
  message = 'We encountered an error fetching data from the API.',
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="w-full my-6 bg-slate-900/90 border border-red-500/30 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-4 shadow-xl"
    >
      <div className="p-4 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
        <WifiOff className="w-8 h-8" />
      </div>

      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-all shadow-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[44px] min-w-[44px] cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying Request...' : 'Retry Request'}
        </button>
      )}
    </div>
  );
};
