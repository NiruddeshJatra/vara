import { useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import { Product } from '@/types/listings';
import EmptyState from './EmptyState';

interface ListingsGridProps {
  displayedListings: Product[];
  handleQuickView: (itemId: string) => void;
  searchTerm?: string;
  searchScores?: Map<string, number>;
}

const ListingsGrid = ({ 
  displayedListings, 
  handleQuickView,
  searchTerm = '',
  searchScores = new Map()
}: ListingsGridProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (displayedListings.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {displayedListings.map((item, index) => (
          <div 
            key={item.id}
            className={`${isLoaded ? 'animate-fade-up' : 'opacity-0'}`} 
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ItemCard 
              product={item}
              onQuickView={() => handleQuickView(item.id)}
              searchTerm={searchTerm}
              searchScore={searchScores.get(item.id) || 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsGrid;