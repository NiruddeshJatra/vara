
import React, { useState } from 'react';
import { MapPin, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type EnhancedItemCardProps = {
  id: number;
  name: string;
  images: string[];
  category: string;
  price: number;
  duration: string;
  distance: number;
  rating: number;
  reviewCount: number;
  onQuickView: (id: number) => void;
  style?: React.CSSProperties;
};

const EnhancedItemCard = ({ 
  id, 
  name, 
  images, 
  category, 
  price, 
  duration, 
  distance, 
  rating, 
  reviewCount, 
  onQuickView,
  style 
}: EnhancedItemCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(images.length - 1);
    }
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(id)}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={images[currentImageIndex]} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300"
        />
        
        {/* Image navigation controls - only shown on hover */}
        {isHovered && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center z-10"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center z-10"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
        
        {/* Image pagination dots */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, index) => (
            <div 
              key={index} 
              className={`w-1.5 h-1.5 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
        
        {/* Category badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-white/90 text-gray-800"
        >
          {category}
        </Badge>
        
        {/* Favorite button */}
        <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
          <Heart size={16} className="text-gray-500" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <div className="flex items-center text-sm">
            <Star size={14} className="fill-current text-yellow-500 mr-1" />
            <span>{rating}</span>
            <span className="text-gray-500 ml-1">({reviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin size={14} className="mr-1" />
          <span>{distance} miles away</span>
        </div>
        
        <div className="mt-2">
          <span className="text-lg font-medium text-gray-900">${price}</span>
          <span className="text-gray-500">/{duration}</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedItemCard;
