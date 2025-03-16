
import React from 'react';
import { Star, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ItemCardProps } from './ItemCard';
import { Link } from 'react-router-dom';


export type ItemModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: ItemType | null;
};

export type ItemType = Omit<ItemCardProps, 'onQuickView'> & {
  rentalCount?: number;
  images?: string[];
};

const ItemModal = ({ isOpen, onOpenChange, selectedItem }: ItemModalProps) => {
  if (!selectedItem) return null;
  
  const displayImage = Array.isArray(selectedItem.images) ? selectedItem.images[0] : selectedItem.images;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-green-800">
            Item Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <div className="rounded-lg overflow-hidden">
              <img src={displayImage} alt={selectedItem.name} className="w-full h-auto object-cover" />
            </div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-xl font-bold text-green-800">{selectedItem.name}</h2>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm font-medium">{selectedItem.rating}</span>
              <span className="ml-1 text-sm text-gray-500">({selectedItem.reviewCount} reviews)</span>
            </div>
            <p className="text-sm text-gray-600">{selectedItem.category}</p>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-green-800">${selectedItem.price} <span className="text-sm font-normal">per {selectedItem.duration}</span></div>
              <p className="text-sm text-gray-600 mt-1">$100 security deposit required</p>
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum rental:</span>
                  <span className="font-medium">1 day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum rental:</span>
                  <span className="font-medium">14 days</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-gray-600">
                This is a sample description for the {selectedItem.name}. The actual description would contain details about the item's condition, specifications, and any special notes from the owner.
              </p>
            </div>
            
            <div className="space-y-2 pt-4">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Request Rental
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 border-green-200"
                  asChild
                >
                  <Link to={`/item/${selectedItem.id}`}>
                    View Full Details
                  </Link>
                </Button>
                <Button variant="outline" className="border-green-200">
                  <Heart className="h-4 w-4" />
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
