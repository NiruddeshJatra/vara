import React from 'react';
import { Loader2, RadioTower } from 'lucide-react';

interface PageLoaderProps {
  variant?: 'default' | 'spinner' | 'dots' | 'ripple' | 'live';
}

const PageLoader: React.FC<PageLoaderProps> = ({ variant = 'default' }) => {
  return (
    <div className="loader-overlay flex items-center justify-center min-h-screen w-full fixed inset-0 z-50 bg-white/70">
      {variant === 'default' && (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-green-200 animate-spin border-t-green-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-green-800 text-lg font-bold">V</span>
              <span className="text-green-600 text-sm font-medium">ara</span>
            </div>
          </div>
          <p className="text-green-700 mt-4 font-medium">Loading...</p>
        </div>
      )}

      {variant === 'spinner' && (
        <Loader2 size={48} className="text-green-600 animate-spin" />
      )}

      {variant === 'dots' && (
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-green-600 animate-double-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      )}

      {variant === 'ripple' && (
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-green-600 flex items-center justify-center">
            <span className="text-green-800 text-lg font-bold">V</span>
            <span className="text-green-600 text-sm font-medium">ara</span>
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-pulse-ripple"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-green-200 animate-pulse-ripple"
            style={{ animationDelay: '0.5s' }}
          />
        </div>
      )}

      {/* New 'live' variant with animated icon */}
      {variant === 'live' && (
        <div className="flex flex-col items-center">
          {/* You can swap out animate-bounce for animate-ping or animate-pulse */}
          <RadioTower className="w-16 h-16 text-green-600 animate-bounce" />
          <span className="text-green-800 text-lg font-bold">V</span>
          <span className="text-green-600 text-sm font-medium">ara</span>
          <p className="text-green-700 mt-4 font-medium">Streaming Live...</p>
        </div>
      )}
    </div>
  );
};

export default PageLoader;
