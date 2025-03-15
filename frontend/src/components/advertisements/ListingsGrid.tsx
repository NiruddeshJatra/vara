
import React from 'react';
import ItemCard from './ItemCard';
import EmptyState from './EmptyState';
import { ItemCardProps } from './ItemCard';

type ListingsGridProps = {
  displayedListings: Omit<ItemCardProps, 'onQuickView'>[];
  handleQuickView: (itemId: number) => void;
};

const ListingsGrid = ({ displayedListings, handleQuickView }: ListingsGridProps) => {
  if (displayedListings.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayedListings.map((item, index) => (
        <ItemCard
          key={item.id}
          {...item}
          onQuickView={handleQuickView}
          style={{ animationDelay: `${index * 0.05}s` }}
        />
      ))}
    </div>
  );
};

export default ListingsGrid;
