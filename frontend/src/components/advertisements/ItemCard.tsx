import React, { useState } from 'react';
import { Star, Eye, ChevronLeft, ChevronRight, Banknote, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product, ProductImage } from '@/types/listings';
import { CATEGORY_DISPLAY, PRODUCT_TYPE_DISPLAY } from '@/constants/productTypes';

interface ItemCardProps {
  product: Product;
  onQuickView?: () => void;
  style?: React.CSSProperties;
  searchTerm?: string;
  searchScore?: number;
}

const ItemCard = ({
  product,
  onQuickView,
  style,
  searchTerm = '',
  searchScore = 0
}: ItemCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Use a default image if product.images is empty
  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: 'default', image: 'https://placehold.co/600x400?text=No+Image', createdAt: new Date().toISOString() }];

  const [imageError, setImageError] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgSrc = (e.target as HTMLImageElement).src;
    console.error('Image failed to load:', imgSrc);
    
    setImageError(true);
    const target = e.target as HTMLImageElement;
    target.src = 'https://placehold.co/600x400?text=Error+Loading+Image';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageError(false); // Reset error state when changing images
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageError(false); // Reset error state when changing images
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(images.length - 1);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView();
    }
  };

  // Text highlighting function for search results
  const highlightText = (text: string): JSX.Element | string => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === searchTerm.toLowerCase() 
            ? <span key={i} className="bg-yellow-200">{part}</span> 
            : part
        )}
      </>
    );
  };

  // Helper to safely handle rating display
  const displayRating = () => {
    if (typeof product.averageRating === 'number') {
      return product.averageRating.toFixed(1);
    }
    return '4.0'; // Default rating when none exists
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up mb-4 sm:mb-6 md:mb-10 mx-1 sm:mx-2"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-40 sm:h-48 md:h-60 overflow-hidden z-0">
        <img
          src={images[currentImageIndex]?.image || 'https://placehold.co/600x400?text=No+Image'}
          alt={product.title || 'Product image'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={handleImageError}
        />
        {/* Image navigation controls - only shown on hover for non-touch devices */}
        {isHovered && images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/80 flex items-center justify-center z-10"
            >
              <ChevronLeft size={16} className="sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/80 flex items-center justify-center z-10"
            >
              <ChevronRight size={16} className="sm:h-5 sm:w-5" />
            </button>
          </>
        )}

        {/* Image pagination dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}

        <Badge variant="secondary" className="absolute top-2 left-2 bg-white/90 text-green-800 z-10 text-[10px] sm:text-xs py-0.5 px-1.5 sm:px-2">
          {CATEGORY_DISPLAY[product.category] || product.category}
        </Badge>
        
        {/* Show search match badge when it's a search result */}
        {searchTerm && searchScore > 0 && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-green-600 text-white z-10 text-[10px] sm:text-xs py-0.5 px-1.5 sm:px-2 flex items-center">
            <Search size={12} className="mr-1" />
            Match
          </Badge>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 text-gray-800 line-clamp-1">
          {searchTerm ? highlightText(product.title) : product.title}
        </h3>

        <div className="flex items-center text-xs sm:text-sm mb-2 sm:mb-3">
          <div className="flex items-center text-yellow-500 mr-2">
            <Star size={12} className="fill-current sm:h-4 sm:w-4" />
            <span className="ml-1 font-medium">
              {displayRating()}
            </span>
          </div>
          <span className="text-gray-500">({product.rentalCount || 0} reviews)</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Banknote size={14} className="text-green-700 mr-1 sm:h-4 sm:w-4" />
            <span className="text-sm sm:text-base md:text-lg font-bold text-green-700">
              {product.pricingTiers?.[0]?.price || 0}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-green-700">
              /{product.pricingTiers?.[0]?.durationUnit || 'day'}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="text-green-700 border-green-300 hover:bg-green-50 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
            onClick={handleQuickView}
          >
            <Eye size={14} className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Quick View</span>
            <span className="xs:hidden">Quick View</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
