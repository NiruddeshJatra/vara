import React from 'react';
import { BarChart3, ShoppingBag, History, Banknote } from 'lucide-react';
import { OWNERSHIP_HISTORY_DISPLAY } from '@/constants/productAttributes';

import { useTranslation } from 'react-i18next';
interface ProductHistoryProps {
  purchase_year?: string;
  ownership_history?: string;
  original_price?: number;
  totalRentals?: number;
}

export default function ProductHistory({
  purchase_year,
  ownership_history,
  original_price = 0,
  totalRentals = 0
}: ProductHistoryProps) {
  const { t } = useTranslation();
  const getOwnershipDisplay = (historyKey: string | undefined) => {
    if (!historyKey) return t('rental.status.unknown');
    return t('ownership.' + historyKey, { defaultValue: OWNERSHIP_HISTORY_DISPLAY[historyKey] || historyKey });
  };

  // Format price with proper currency symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="mb-10 pb-10 border-b border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">{t('listing.history.title')}</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {purchase_year && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg sm:text-xl font-semibold text-green-900 mb-1 flex items-center">
              <ShoppingBag className="h-4 w-4 mr-3 text-green-600" />
              {t('listing.history.purchaseYear')}
            </h4>
            <p className="pl-6 text-green-700 font-medium text-sm sm:text-base">{purchase_year}</p>
          </div>
        )}
        
        {ownership_history && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg sm:text-xl font-semibold text-green-900 mb-1 flex items-center">
              <History className="h-4 w-4 mr-3 text-green-600" />
              {t('itemDetail.ownership')}
            </h4>
            <p className="pl-6 text-green-700 font-medium text-sm sm:text-base">{getOwnershipDisplay(ownership_history)}</p>
          </div>
        )}
        
        {original_price > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg sm:text-xl font-semibold text-green-900 mb-1 flex items-center">
              <Banknote className="h-4 w-4 mr-3 text-green-600" />
              {t('listing.history.originalPrice')}
            </h4>
            <p className="pl-6 text-green-700 font-medium text-sm sm:text-base">৳ {formatPrice(original_price)}</p>
          </div>
        )}
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-lg sm:text-xl font-semibold text-green-900 mb-1 flex items-center">
            <BarChart3 className="h-4 w-4 mr-3 text-green-600" />
            {t('itemDetail.totalRentals')}
          </h4>
          <p className="pl-6 text-green-700 font-medium text-sm sm:text-base">{totalRentals}</p>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-3 text-center">
        {t('itemDetail.historyFootnote')}
      </p>
    </div>
  );
} 