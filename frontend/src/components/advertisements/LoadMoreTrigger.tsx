
import React from 'react';

type LoadMoreTriggerProps = {
  visible: boolean;
};

const LoadMoreTrigger = ({ visible }: LoadMoreTriggerProps) => {
  if (!visible) return null;

  return (
    <div 
      id="load-more-trigger"
      className="text-center mt-10 py-4"
    >
      <div className="animate-pulse text-gray-400">Loading more items...</div>
    </div>
  );
};

export default LoadMoreTrigger;
