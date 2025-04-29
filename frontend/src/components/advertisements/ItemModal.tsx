import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, Banknote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/listings';
import { useAuth } from '@/contexts/AuthContext';
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
    if (!user?.profileCompleted) {
      setShowProfileModal(true);
      return;
    }
    
    // Navigate to rental request page with complete product data
    navigate(`/request-rental/${selectedItem.id}`, { 
      state: { product: selectedItem }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="item-modal-content max-w-[85vw] md:max-w-3xl bg-gradient-to-b from-white to-lime-50 p-4 sm:p-6 md:p-8 rounded-lg"
        aria-describedby="item-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="item-modal-title px-1 text-base sm:text-xl font-semibold text-green-800">
            Item Quick View
          </DialogTitle>
        </DialogHeader>
        
        <div id="item-modal-description" className="sr-only">
          Quick view modal for {selectedItem.title || 'product'} showing details and rental options
        </div>
        
        <div className="item-modal-flex flex flex-col md:flex-row gap-4 sm:gap-8 md:gap-10">
          <div className="item-modal-image md:w-1/2" ref={leftPanelRef}>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={selectedItem.images?.[currentImageIndex]?.image}
                alt={selectedItem.title || 'Product image'}
                className="w-full h-72 md:h-96 object-contain bg-gray-100"
                onError={handleImageError}
                loading="lazy"
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
          </div>
          
          <div className="item-modal-details md:w-1/2 space-y-2 sm:space-y-3 mb-2" ref={rightPanelRef}>
            <h2 className="item-modal-title text-lg sm:text-2xl font-bold text-green-800">{selectedItem.title || 'Untitled Product'}</h2>
            <div className="flex items-center gap-1 sm:gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs sm:text-sm font-medium">
                {displayRating()}
              </span>
              <span className="text-xs text-gray-500">({selectedItem.rentalCount || 0} rentals)</span>
              <Badge
                variant="outline"
                className="bg-green-50 text-xs font-medium text-green-700 hover:bg-green-100"
              >
                {CATEGORY_DISPLAY[selectedItem.category] || selectedItem.category}
              </Badge>
            </div>

            {/* Pricing Tiers Section */}
            <div className="item-modal-pricing bg-green-50 px-3 sm:px-4 py-2 sm:py-4 rounded-lg space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-green-800">Rental Options</h3>
              {selectedItem.pricingTiers && selectedItem.pricingTiers.length > 0 ? (
                selectedItem.pricingTiers.map((tier, index) => (
                  <div key={tier.id || index} className="flex justify-between items-center rounded">
                    <div className="flex items-center gap-1">
                      <span className="text-green-700 font-bold">৳</span>
                      <div>
                        <span className="text-sm sm:text-lg font-bold text-green-800">{tier.price}</span>
                        <span className="text-xs sm:text-sm text-gray-600 ml-1">per {tier.durationUnit}</span>
                      </div>
                    </div>
                    {tier.maxPeriod && (
                      <span className="text-xs sm:text-sm text-gray-600">
                        Max: {tier.maxPeriod} {tier.durationUnit}s
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-600">No pricing information available</p>
              )}
            </div>
            
            <div className="space-y-1 sm:space-y-2 pt-2 sm:pt-4">
              <Button 
                className="item-modal-btn w-full bg-green-600 hover:bg-green-700 text-white py-2 text-xs sm:text-sm"
                onClick={handleRequestRental}
              >
                Request Rental
              </Button>
              <div className="flex gap-1 sm:gap-2">
                <Button 
                  variant="outline" 
                  className="item-modal-btn flex-1 border-green-300 py-2 text-xs sm:text-sm"
                  asChild
                >
                  <Link 
                    to={`/items/${selectedItem.id}`}
                    state={{ product: selectedItem }}
                  >
                    View Full Details
                  </Link>
                </Button>
                <Button variant="outline" className="item-modal-btn border-green-300 py-2">
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