import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Calendar, Clock, MapPin, Star, Banknote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/listings';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';
import { CATEGORY_DISPLAY, PRODUCT_TYPE_DISPLAY } from '@/constants/productTypes';

interface ItemModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: Product | null;
}

const ItemModal = ({ isOpen, onOpenChange, selectedItem }: ItemModalProps) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSecondImage, setShowSecondImage] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && rightPanelRef.current && leftPanelRef.current) {
      const rightPanelHeight = rightPanelRef.current.offsetHeight;
      const leftPanelHeight = leftPanelRef.current.offsetHeight;
      
      // Show second image if right panel is taller than left panel
      setShowSecondImage(rightPanelHeight > leftPanelHeight && selectedItem?.images?.length > 1);
    }
  }, [isOpen, selectedItem]);

  // If no item is selected, don't render the modal
  if (!selectedItem) {
    return null;
  }
  
  // Helper to safely handle rating display
  const displayRating = () => {
    if (typeof selectedItem.averageRating === 'number') {
      return selectedItem.averageRating.toFixed(1);
    }
    return '4.0'; // Default rating when none exists
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgSrc = (e.target as HTMLImageElement).src;
    console.error('Modal image failed to load:', imgSrc);
    
    // Log more details about the failing image
    console.debug('Modal image load error details:', { 
      originalSrc: imgSrc,
      productId: selectedItem.id,
      firstImageUrl: selectedItem.images?.[0]?.image || 'no image available'
    });
    
    setImageError(true);
    const target = e.target as HTMLImageElement;
    target.src = 'https://placehold.co/600x400?text=Error+Loading+Image';
  };

  const nextImage = () => {
    if (selectedItem.images && currentImageIndex < selectedItem.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleRequestRental = () => {
    if (!user?.profileComplete) {
      setShowProfileModal(true);
      return;
    }
    navigate(`/request-rental/${selectedItem.id}`, { state: { product: selectedItem } });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-3xl bg-gradient-to-b from-white to-lime-50 p-8"
        aria-describedby="item-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="px-2 text-xl font-semibold text-green-800">
            Item Quick View
          </DialogTitle>
        </DialogHeader>
        
        <div id="item-modal-description" className="sr-only">
          Quick view modal for {selectedItem.title || 'product'} showing details and rental options
        </div>
        
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2" ref={leftPanelRef}>
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={selectedItem.images?.[currentImageIndex]?.image || 'https://placehold.co/600x400?text=No+Image'} 
                alt={selectedItem.title || 'Product image'} 
                className="w-full h-auto object-cover" 
                onError={handleImageError}
              />
              
              {/* Image navigation controls */}
              {selectedItem.images && selectedItem.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center z-10 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === selectedItem.images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center z-10 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              
              {/* Image pagination dots */}
              {selectedItem.images && selectedItem.images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                  {selectedItem.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Second image - only shown if there's space */}
            {showSecondImage && selectedItem.images?.[1] && (
              <div className="mt-2 relative rounded-lg overflow-hidden">
                <img
                  src={selectedItem.images[1].image}
                  alt="Additional view"
                  className="w-full h-auto object-cover"
                  onError={handleImageError}
                />
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 space-y-3" ref={rightPanelRef}>
            <h2 className="text-2xl font-bold text-green-800">{selectedItem.title || 'Untitled Product'}</h2>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm font-medium">
                {displayRating()}
              </span>
              <span className="ml-1 text-xs text-gray-500">({selectedItem.rentalCount || 0} rentals)</span>
            </div>
            <p className="text-sm text-green-700">{CATEGORY_DISPLAY[selectedItem.category] || selectedItem.category}</p>
            
            {/* Pricing Tiers Section */}
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <h3 className="text-lg font-semibold text-green-800">Rental Options</h3>
              {selectedItem.pricingTiers && selectedItem.pricingTiers.length > 0 ? (
                selectedItem.pricingTiers.map((tier, index) => (
                  <div key={tier.id || index} className="flex justify-between items-center p-2 rounded">
                    <div className="flex items-center">
                      <Banknote size={18} className="text-green-700 mr-2" />
                      <div>
                        <span className="text-lg font-bold text-green-800">{tier.price}</span>
                        <span className="text-sm text-gray-600 ml-1">per {tier.durationUnit}</span>
                      </div>
                    </div>
                    {tier.maxPeriod && (
                      <span className="text-sm text-gray-600">
                        Max: {tier.maxPeriod} {tier.durationUnit}s
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No pricing information available</p>
              )}
            </div>
            
            <div className="space-y-2 pt-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                asChild
              >
                <Link 
                  to={`/request-rental/${selectedItem.id}`}
                  state={{ product: selectedItem }}
                >
                  Request Rental
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-green-300"
                  asChild
                >
                  <Link 
                    to={`/items/${selectedItem.id}`}
                    state={{ product: selectedItem }}
                  >
                    View Full Details
                  </Link>
                </Button>
                <Button variant="outline" className="border-green-300">
                  <Heart className="h-4 w-4 text-green-800" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;