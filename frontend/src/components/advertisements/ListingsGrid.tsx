import React from 'react';
import ItemCard from './ItemCard';
import { Product } from '@/types/listings';
import EmptyState from './EmptyState';

interface ListingsGridProps {
  displayedListings: Product[];
  handleQuickView: (itemId: string) => void;
}

const ListingsGrid = ({ displayedListings, handleQuickView }: ListingsGridProps) => {
  if (displayedListings.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {displayedListings.map((product) => (
        <ItemCard
          key={product.id}
          product={product}
          onQuickView={() => handleQuickView(product.id)}
        />
      ))}
    </div>
  );
};

export default ListingsGrid;