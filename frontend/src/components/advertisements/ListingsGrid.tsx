
import React from 'react';
import ItemCard from './ItemCard';
import { Product } from '@/types/listings';
import EmptyState from './EmptyState';

interface ListingsGridProps {
  displayedListings: Product[];
  handleQuickView: (itemId: number) => void;
}

const ListingsGrid = ({ displayedListings, handleQuickView }: ListingsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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