import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageLoader from './PageLoader';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Show loader when location changes
    setIsLoading(true);
    
    // Simulate page loading time (minimum 600ms to ensure loader is visible)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <PageLoader variant="progress" />
        </div>
      )}
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;
