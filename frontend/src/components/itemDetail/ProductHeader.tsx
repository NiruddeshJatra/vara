import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_DISPLAY } from '@/constants/productTypes';

interface ProductHeaderProps {
  title: string;
  averageRating?: number | null;
  totalRentals?: number;
  location?: string;
  category?: string;
}

export const ProductHeader = ({
  title,
  averageRating,
  totalRentals = 0,
  location,
  category
}: ProductHeaderProps) => {
  // Helper to safely handle rating display
  const displayRating = () => {
    if (typeof averageRating === 'number') {
      return averageRating.toFixed(1);
    }
    return '4.0'; // Default rating when none exists
  };

  const displayCategory = category && CATEGORY_DISPLAY[category] 
    ? CATEGORY_DISPLAY[category] 
    : category;

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2 space-x-2">
        {category && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 px-2 py-0.5 text-xs" data-category={category}>
            {displayCategory}
          </Badge>
        )}
      </div>
      
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800">
        {title}
      </h2>
      
      <div className="flex flex-wrap items-center mt-2">
        <div className="flex items-center mr-4 mb-2">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="font-medium">{displayRating()}</span>
          <span className="text-gray-500 text-sm ml-1">
            ({totalRentals} {totalRentals === 1 ? 'review' : 'reviews'})
          </span>
        </div>
        
        {location && (
          <div className="flex items-center text-gray-500 mb-2" data-location>
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductHeader;