import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ItemCard from '@/components/advertisements/ItemCard';
import { Product } from '@/types/listings';

interface SimilarItemsProps {
  items: Product[];
  onQuickView: (itemId: string) => void;
}

export default function SimilarItems({ items, onQuickView }: SimilarItemsProps) {
  if (!items.length) return null;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-900 mb-2">Similar Items You May Like</h2>
        <Link to="/advertisements" className="text-green-600 font-medium flex items-center hover:underline">
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            product={item}
            onQuickView={() => onQuickView(item.id)}
          />
        ))}
      </div>
    </div>
  );
} 