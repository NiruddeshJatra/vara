
import React from 'react';
import { Button } from '@/components/ui/button';
import ItemCard, { ItemCardProps } from './ItemCard';

type ItemType = Omit<ItemCardProps, 'onQuickView'> & {
  rentalCount: number;
};

type PopularListingsProps = {
  items: ItemType[];
  onQuickView: (id: number) => void;
};

const PopularListings = ({ items, onQuickView }: PopularListingsProps) => {
  return (
    <section className="py-24 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-1">Popular Near You</h2>
          <p className="text-green-700">Most viewed and rented items</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <ItemCard 
              key={item.id} 
              {...item} 
              onQuickView={onQuickView}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button className="bg-green-600 hover:bg-green-700 text-white mx-auto">
            See All Popular Items
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularListings;