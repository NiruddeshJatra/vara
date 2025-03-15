
import React from 'react';
import { MapPin, Star, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type ItemCardProps = {
  id: number;
  name: string;
  image: string;
  images?: string[]; // Array of images for carousel
  category: string;
  price: number;
  duration: string;
  distance: number;
  rating: number;
  reviewCount: number;
  onQuickView: (id: number) => void;
  style?: React.CSSProperties;
  rentalCount?: number;
};

const ItemCard = ({ 
  id, 
  name, 
  image, 
  category, 
  price, 
  duration, 
  distance, 
  rating, 
  reviewCount, 
  onQuickView,
  style 
}: ItemCardProps) => {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up"
      style={style}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        <Badge variant="secondary" className="absolute top-2 left-2 bg-white/90 text-green-800">
          {category}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-gray-800">{name}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin size={14} className="mr-1" />
          <span>{distance} miles away</span>
        </div>
        
        <div className="flex items-center text-sm mb-3">
          <div className="flex items-center text-yellow-500 mr-2">
            <Star size={14} className="fill-current" />
            <span className="ml-1 font-medium">{rating}</span>
          </div>
          <span className="text-gray-500">({reviewCount} reviews)</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-green-700">${price}</span>
            <span className="text-sm text-gray-500">/{duration}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="text-green-700 border-green-200 hover:bg-green-50"
            onClick={() => onQuickView(id)}
          >
            <Eye size={14} className="mr-1" />
            Quick View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
