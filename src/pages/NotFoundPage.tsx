import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-6">
      <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
        <AlertCircle className="w-12 h-12" />
      </div>

      <div className="max-w-md">
        <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block mb-1">
          404 Error
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          The route you navigated to does not exist or may have been moved.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg focus:ring-2 focus:ring-indigo-400 min-h-[44px]"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-colors focus:ring-2 focus:ring-slate-400 min-h-[44px]"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
};
