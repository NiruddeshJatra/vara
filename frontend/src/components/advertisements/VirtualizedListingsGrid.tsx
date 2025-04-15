import { useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { Product } from '@/types/listings';

interface VirtualizedListingsGridProps {
  displayedListings: Product[];
  handleQuickView: (itemId: string) => void;
  searchTerm?: string;
  searchScores?: Map<string, number>;
}

const VirtualizedListingsGrid = ({ 
  displayedListings, 
  handleQuickView,
  searchTerm = '',
  searchScores = new Map(),
  loading = false,
  skeletonCount = 8
}: VirtualizedListingsGridProps & { loading?: boolean; skeletonCount?: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (loading || displayedListings.length === 0) {
    // Show skeletons while loading
    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

export default VirtualizedListingsGrid;
