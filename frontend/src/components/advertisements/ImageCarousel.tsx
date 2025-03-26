// components/advertisements/ImageCarousel.tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  className?: string;
}

export default function ImageCarousel({ images, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullScreenView, setFullScreenView] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Ensure we have at least one image to display
  const imageList = images && images.length > 0 
    ? images 
    : ['/images/placeholder-image.jpg'];

  // Update current index when navigating
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % imageList.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + imageList.length) % imageList.length);
  };

  // Select image from thumbnail
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Toggle fullscreen view
  const toggleFullScreen = () => {
    setFullScreenView(!fullScreenView);
  };

  return (
    <div className={cn("w-full h-full", className)}>
      {/* Main Carousel */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white">
        <div className="w-full h-full">
          <img 
            src={imageList[currentIndex]} 
            alt={`Product view ${currentIndex + 1}`}
            className="w-full h-full object-contain transition-opacity duration-300 ease-in-out"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-image.jpg';
            }}
          />
        </div>

        {/* Navigation Arrows */}
        {imageList.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-white/90 shadow-md hover:bg-white transition-all"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-white/90 shadow-md hover:bg-white transition-all"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </Button>
          </div>
        )}

        {/* Fullscreen button */}
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 shadow-md hover:bg-white transition-all"
          onClick={toggleFullScreen}
        >
          <Maximize className="h-5 w-5 text-gray-800" />
        </Button>

        {/* Image counter */}
        <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
          {currentIndex + 1} / {imageList.length}
        </div>
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2 overflow-x-auto">
          {imageList.map((img, index) => (
            <div 
              key={index} 
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all transform ${
                currentIndex === index 
                  ? 'ring-2 ring-green-600 scale-[0.98]' 
                  : 'opacity-70 hover:opacity-100 hover:scale-[0.98]'
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <div className="pb-[75%] relative"> {/* Creates aspect ratio */}
                <img 
                  src={img} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-image.jpg';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen modal */}
      <Dialog open={fullScreenView} onOpenChange={setFullScreenView}>
        <DialogContent className="max-w-6xl bg-black/95 border-none p-0 max-h-[95vh] overflow-hidden">
          <div className="relative h-full flex flex-col justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              onClick={() => setFullScreenView(false)}
            >
              <Maximize className="h-5 w-5" />
            </Button>
            
            <div className="w-full h-full flex items-center justify-center p-6">
              <img 
                src={imageList[currentIndex]}
                alt={`Fullscreen view ${currentIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>

            {imageList.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 backdrop-blur-sm">
                <div className="flex gap-2 justify-center overflow-x-auto py-2">
                  {imageList.map((img, index) => (
                    <div 
                      key={index} 
                      className={`relative cursor-pointer w-20 h-20 rounded-md overflow-hidden transition-all ${
                        currentIndex === index ? 'ring-2 ring-white scale-105' : 'opacity-60 hover:opacity-100'
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
            <img 
              src={img} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {imageList.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-6">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/30 transition-colors"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/30 transition-colors"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}