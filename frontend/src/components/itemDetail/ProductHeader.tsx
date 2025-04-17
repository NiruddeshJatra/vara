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
    <div className="mb-3 sm:mb-6">
      <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-green-800">
        {title}
      </h2>
      
      <div className="flex flex-wrap items-center mt-1 sm:mt-2">
        <div className="flex items-center mr-2 sm:mr-4 mb-1 sm:mb-2">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="font-medium text-xs sm:text-base">{displayRating()}</span>
          <span className="text-gray-500 text-xs sm:text-sm ml-1">
            ({totalRentals} {totalRentals === 1 ? 'review' : 'reviews'})
          </span>
        </div>
        
        {location && (
          <div className="flex items-center text-gray-500 mb-1 sm:mb-2" data-location>
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
            <span className="text-xs sm:text-base">{location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductHeader;