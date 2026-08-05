import React from 'react';
import { Loader2, RadioTower } from 'lucide-react';
import styled from 'styled-components';
import logo from '@/assets/images/logo, icon & loader/logo.png';

interface PageLoaderProps {
  variant?: 'default' | 'spinner' | 'dots' | 'ripple' | 'live' | 'newton' | 'progress';
}

const PageLoader: React.FC<PageLoaderProps> = ({ variant = 'default' }) => {
  return (
    <div className="loader-overlay flex items-center justify-center min-h-screen w-full fixed inset-0 z-50 bg-white/70">
      {variant === 'progress' && (
        <div className="flex flex-col items-center">
          <img src={logo} alt="Bhara Logo" className="h-8 w-auto mb-8 animate-fade-in" />
          <div className="progress-loader" />
        </div>
      )}

      {variant === 'newton' && (
        <div className="flex flex-col items-center">
          <img src={logo} alt="Bhara Logo" className="h-24 w-auto mb-8 animate-fade-in" />
          <div className="loader">
            <div className="circle">
              <div className="dot" />
              <div className="outline" />
            </div>
            <div className="circle">
              <div className="dot" />
              <div className="outline" />
            </div>
            <div className="circle">
              <div className="dot" />
              <div className="outline" />
            </div>
            <div className="circle">
              <div className="dot" />
              <div className="outline" />
            </div>
          </div>
        </div>
      )}

      {variant === 'default' && (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-green-200 animate-spin border-t-green-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-green-800 text-lg font-bold">B</span>
              <span className="text-green-600 text-sm font-medium">hara</span>
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
            <span className="text-green-800 text-lg font-bold">B</span>
            <span className="text-green-600 text-sm font-medium">hara</span>
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
          <span className="text-green-800 text-lg font-bold">B</span>
          <span className="text-green-600 text-sm font-medium">hara</span>
          <p className="text-green-700 mt-4 font-medium">Streaming Live...</p>
        </div>
      )}
    </div>
  );
};

// Add the circle animation styles
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }

  /* Progress Loader */
  .progress-loader {
    width: 120px;
    height: 22px;
    border-radius: 40px;
    color: #22c55e;
    border: 2px solid;
    position: relative;
    overflow: hidden;
  }

  .progress-loader::before {
    content: "";
    position: absolute;
    margin: 2px;
    width: 14px;
    top: 0;
    bottom: 0;
    left: -20px;
    border-radius: inherit;
    background: currentColor;
    box-shadow: -10px 0 12px 3px currentColor;
    clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 95%, -30px 50%);
    animation: progress-slide 1s infinite linear;
  }

  @keyframes progress-slide {
    100% {
      left: calc(100% + 20px);
    }
  }

  /* Circle Loader */
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    --color: #22c55e;
    --animation: 2s ease-in-out infinite;
  }

  .loader .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 20px;
    height: 20px;
    border: solid 2px var(--color);
    border-radius: 50%;
    margin: 0 10px;
    background-color: transparent;
    animation: circle-keys var(--animation);
  }

  .loader .circle .dot {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--color);
    animation: dot-keys var(--animation);
  }

  .loader .circle .outline {
    position: absolute;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    animation: outline-keys var(--animation);
  }

  .circle:nth-child(2) {
    animation-delay: 0.3s;
  }

  .circle:nth-child(3) {
    animation-delay: 0.6s;
  }

  .circle:nth-child(4) {
    animation-delay: 0.9s;
  }

  .circle:nth-child(2) .dot {
    animation-delay: 0.3s;
  }

  .circle:nth-child(3) .dot {
    animation-delay: 0.6s;
  }

  .circle:nth-child(4) .dot {
    animation-delay: 0.9s;
  }

  .circle:nth-child(1) .outline {
    animation-delay: 0.9s;
  }

  .circle:nth-child(2) .outline {
    animation-delay: 1.2s;
  }

  .circle:nth-child(3) .outline {
    animation-delay: 1.5s;
  }

  .circle:nth-child(4) .outline {
    animation-delay: 1.8s;
  }

  @keyframes circle-keys {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes dot-keys {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes outline-keys {
    0% {
      transform: scale(0);
      outline: solid 20px var(--color);
      outline-offset: 0;
      opacity: 1;
    }

    100% {
      transform: scale(1);
      outline: solid 0 transparent;
      outline-offset: 20px;
      opacity: 0;
    }
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default PageLoader;
