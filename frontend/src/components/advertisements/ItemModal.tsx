import React from 'react';
import { Star, Heart, MapPin, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { Product } from '@/types/listings';

export type ItemModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: Product | null;
};

const ItemModal = ({ isOpen, onOpenChange, selectedItem }: ItemModalProps) => {
  if (!selectedItem) return null;
  
  const displayImage = selectedItem.images?.[0] || '';
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-white to-lime-50 p-8">
        <DialogHeader>
          <DialogTitle className="px-2 text-xl font-semibold text-green-800">
            Item Quick View
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={displayImage} 
                alt={selectedItem.title} 
                className="w-full h-auto object-cover" 
              />
            </div>
          </div>
          <div className="md:w-1/2 space-y-3">
            <h2 className="text-2xl font-bold text-green-800">{selectedItem.title}</h2>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm font-medium">{selectedItem.averageRating?.toFixed(1) || 'N/A'}</span>
              <span className="ml-1 text-xs text-gray-500">({selectedItem.totalRentals || 0} rentals)</span>
            </div>
            <p className="text-sm text-green-700">{selectedItem.category}</p>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-green-800 flex items-center">
                <Banknote size={18} className="text-green-700 mr-1" />
                {selectedItem.basePrice}
                <span className="text-sm font-normal ml-1"> per {selectedItem.durationUnit}</span>
              </div>
              <div className="mt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Minimum rental:</span>
                  <span className="font-medium">
                    {selectedItem.minRentalPeriod} {selectedItem.durationUnit}s
                  </span>
                </div>
                {selectedItem.maxRentalPeriod && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Maximum rental:</span>
                    <span className="font-medium">
                      {selectedItem.maxRentalPeriod} {selectedItem.durationUnit}s
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                asChild
              >
                <Link to={`/request-rental/${selectedItem.id}`}>
                  Request Rental
                </Link>
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
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
