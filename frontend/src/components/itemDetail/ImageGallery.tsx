import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageIndex, setFullImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  
  if (!images?.length) {
    images = ['/images/placeholder-image.jpg'];
  }

  const handleImageClick = (index: number) => {
    setFullImageIndex(index);
    setShowFullImage(true);
  };

  const handleAllPhotosClick = () => {
    setShowAllPhotos(true);
  };

  const closeModal = () => {
    setShowFullImage(false);
    setShowAllPhotos(false);
  };

  // Handle keyboard navigation in full image view
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      setFullImageIndex((prev) => (prev + 1) % images.length);
    } else if (e.key === 'ArrowLeft') {
      setFullImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Full image modal
  if (showFullImage) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center"
        onClick={closeModal}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <button 
          className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
          onClick={closeModal}
        >
          <X size={24} />
        </button>
        <div className="text-white mb-4">
          {fullImageIndex + 1} / {images.length}
        </div>
        <div className="w-full max-w-6xl h-[80vh] px-4" onClick={(e) => e.stopPropagation()}>
          <img 
            src={images[fullImageIndex]} 
            alt={`${title} full view`}
            className="w-full h-full object-contain" 
            data-product-image
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-image.jpg';
            }}
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button 
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setFullImageIndex((prev) => (prev - 1 + images.length) % images.length);
            }}
          >
            Previous
          </button>
          <button 
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setFullImageIndex((prev) => (prev + 1) % images.length);
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // All photos gallery modal
  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">All photos for {title}</h2>
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={closeModal}
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="aspect-w-1 aspect-h-1 cursor-pointer rounded-lg overflow-hidden"
                onClick={() => handleImageClick(idx)}
              >
                <img 
                  src={img} 
                  alt={`${title} view ${idx + 1}`}
                  className="w-full h-full object-cover" 
                  data-product-image
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-image.jpg';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-5 gap-2">
        {/* Main Large Image (3/5 width) */}
        <div
          className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer col-span-3"
          onClick={() => handleImageClick(0)}
        >
          <img
            src={images[0]}
            alt={`${title} main`}
            className="w-full h-full object-cover"
            data-product-image
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-image.jpg';
            }}
          />
        </div>
        {/* Right Side Grid (2/5 width) */}
        <div className="col-span-2 grid grid-cols-2 gap-2">
          {images.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(idx + 1)}
            >
              <img
                src={img}
                alt={`${title} view ${idx + 2}`}
                className="w-full h-full object-cover"
                data-product-image
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-image.jpg';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex flex-col gap-3 relative">
        {/* Main Image */}
        <div
          className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
          onClick={() => handleImageClick(0)}
        >
          <img
            src={images[0]}
            alt={`${title} main`}
            className="w-full h-full object-cover"
            data-product-image
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-image.jpg';
            }}
          />
        </div>
        {/* 2x2 grid for 4 images */}
        <div className="grid grid-cols-2 gap-2">
          {images.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              className={
                `aspect-[4/3] rounded-lg overflow-hidden cursor-pointer relative` +
                (idx === 3 && images.length > 1 ? ' flex items-end justify-end' : '')
              }
              onClick={() => handleImageClick(idx + 1)}
            >
              <img
                src={img}
                alt={`${title} view ${idx + 2}`}
                className="w-full h-full object-cover"
                data-product-image
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-image.jpg';
                }}
              />
              {/* Show all photos button only on the last (bottom-right) image */}
              {idx === 3 && images.length > 1 && (
                <button
                  className="absolute bottom-2 right-2 z-30 bg-white/90 text-gray-900 rounded-full px-3 py-1.5 font-medium shadow-md hover:bg-white transition-colors flex items-center text-xs sm:text-sm md:hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAllPhotosClick();
                  }}
                >
                  <span className="mr-1">Show all photos</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Show all photos button for desktop/tablet */}
      {images.length > 1 && (
        <button
          className="hidden md:absolute md:bottom-4 md:right-4 md:left-auto md:translate-x-0 md:flex z-30 bg-white/90 text-gray-900 rounded-full px-4 py-2 font-medium shadow-md hover:bg-white transition-colors items-center text-xs sm:text-sm"
          onClick={handleAllPhotosClick}
        >
          <span className="mr-1">Show all photos</span>
        </button>
      )}
    </div>
  );
}