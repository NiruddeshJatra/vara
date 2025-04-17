import React from 'react';
import { BarChart3, ShoppingBag, History, Banknote } from 'lucide-react';
import { OWNERSHIP_HISTORY_DISPLAY } from '@/constants/productAttributes';

interface ProductHistoryProps {
  purchaseYear?: string;
  ownershipHistory?: string;
  originalPrice?: number;
  totalRentals?: number;
}

export default function ProductHistory({
  purchaseYear,
  ownershipHistory,
  originalPrice = 0,
  totalRentals = 0
}: ProductHistoryProps) {
  const getOwnershipDisplay = (historyKey: string | undefined) => {
    if (!historyKey) return 'Unknown';
    return OWNERSHIP_HISTORY_DISPLAY[historyKey] || historyKey;
  };

  // Format price with proper currency symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="mb-10 pb-10 border-b border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">Product History</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {purchaseYear && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg sm:text-xl font-semibold text-green-900 mb-1 flex items-center">
              <ShoppingBag className="h-4 w-4 mr-3 text-green-600" />
              Purchase Year
            </h4>
            <p className="pl-6 text-green-700 font-medium text-sm sm:text-base">{purchaseYear}</p>
          </div>
        )}
        
        {ownershipHistory && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg sm:text-xl font-semibold text-green-900 mb-1 flex items-center">
              <History className="h-4 w-4 mr-3 text-green-600" />
              Ownership
            </h4>
            <p className="pl-6 text-green-700 font-medium text-sm sm:text-base">{getOwnershipDisplay(ownershipHistory)}</p>
          </div>
        )}
        
        {originalPrice > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg sm:text-xl font-semibold text-green-900 mb-1 flex items-center">
              <Banknote className="h-4 w-4 mr-3 text-green-600" />
              Original Price
            </h4>
            <p className="pl-6 text-green-700 font-medium text-sm sm:text-base">{formatPrice(originalPrice)}</p>
          </div>
        )}
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-lg sm:text-xl font-semibold text-green-900 mb-1 flex items-center">
            <BarChart3 className="h-4 w-4 mr-3 text-green-600" />
            Total Rentals
          </h4>
          <p className="pl-6 text-green-700 font-medium text-sm sm:text-base">{totalRentals}</p>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-3 text-center">
        Product history provides insight into this item's origin and rental performance.
      </p>
    </div>
  );
} 