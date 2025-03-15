
import React from 'react';
import { SearchX } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <SearchX className="h-16 w-16 text-vhara-300" />
      </div>
      <h3 className="text-xl font-medium mb-2">No items found</h3>
      <p className="text-gray-500">
        Try adjusting your search or filter to find what you're looking for.
      </p>
    </div>
  );
};

export default EmptyState;
