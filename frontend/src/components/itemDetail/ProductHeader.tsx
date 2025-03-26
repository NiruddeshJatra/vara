import React from 'react';
import { Star, MapPin } from 'lucide-react';

interface ProductHeaderProps {
  title: string;
  averageRating?: number;
  totalRentals?: number;
  location: string;
  category: string;
}

export default function ProductHeader({ 
  title, 
  averageRating = 4.9, 
  totalRentals = 12, 
  location, 
  category 
}: ProductHeaderProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 mb-1">{title}</h1>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 mt-2 mb-4 text-sm">
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="font-medium mr-1">{averageRating?.toFixed(1)}</span>
          <span className="text-gray-600">({totalRentals} reviews)</span>
          <span className="mx-2 text-gray-400">•</span>
          <MapPin className="h-4 w-4 text-green-600 mr-1" />
          <span className="text-gray-600">{location}</span>
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          {category}
        </span>
      </div>
    </div>
  );
} 