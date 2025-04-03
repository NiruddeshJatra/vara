import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Calendar, Clock, MapPin, Shield, Banknote } from 'lucide-react';
import { Product } from '@/types/listings';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';

interface ItemModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: Product | null;
}

const ItemModal = ({ isOpen, onOpenChange, selectedItem }: ItemModalProps) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // If no item is selected, don't render the modal
  if (!selectedItem) {
    return null;
  }

  const handleRequestRental = () => {
    if (!user?.profileComplete) {
      setShowProfileModal(true);
      return;
    }
    navigate(`/request-rental/${selectedItem.id}`, { state: { product: selectedItem } });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <img
              src={selectedItem.images[0]}
              alt={selectedItem.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedItem.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedItem.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-green-600" />
                <span>Available for {selectedItem.minRentalPeriod} {selectedItem.durationUnit}s</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-green-600" />
                <span>Base price: ৳{selectedItem.basePrice} per {selectedItem.durationUnit}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-green-600" />
                <span>{selectedItem.location}</span>
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleRequestRental}
              >
                Request Rental
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-green-300"
                  asChild
                >
                  <Link to={`/items/${selectedItem.id}`}>
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

        {/* Profile Completion Modal */}
        <ProfileCompletionModal 
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          title="Complete Your Profile"
          description="You need to complete your profile before you can request rentals."
        />
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
