import React, { useState } from 'react';
import { Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type ItemCardProps = {
  id: number;
  name: string;
  images: string[];
  category: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  onQuickView: (id: number) => void;
  style?: React.CSSProperties;
  rentalCount?: number;
};

const ItemCard = ({ 
  id, 
  name, 
  images, 
  category, 
  price, 
  duration,
  rating, 
  reviewCount, 
  onQuickView,
  style 
}: ItemCardProps) => {
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
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up mb-4 mx-2"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-60 overflow-hidden z-0">
        <img src={images[currentImageIndex]} alt={name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
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
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
          {images.map((_, index) => (
            <div 
              key={index} 
              className={`w-1.5 h-1.5 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>

        <Badge variant="secondary" className="absolute top-2 left-2 bg-white/90 text-green-800 z-10">
          {category}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-gray-800">{name}</h3>
        
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
