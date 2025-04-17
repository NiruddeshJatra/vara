import React from 'react';
import { Banknote, Tag, BoxSelect, Clock } from 'lucide-react';
import { CATEGORY_DISPLAY, PRODUCT_TYPE_DISPLAY } from '@/constants/productTypes';

interface ItemDetailsProps {
  category: string;
  productType: string;
  itemAge?: number;
  securityDeposit?: string;
}

export default function ItemDetails({
  category,
  productType,
  securityDeposit = '0'
}: ItemDetailsProps) {
  return (
    <div className="mb-6 sm:mb-10 pb-6 sm:pb-10 border-b border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">Item details</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-1 flex items-center text-lg sm:text-xl">
            <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-green-600" />
            Category
          </h4>
          <p className="pl-6 text-green-700 font-medium text-sm sm:text-base" data-category={category}>{CATEGORY_DISPLAY[category] || category}</p>
        </div>
        
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-1 flex items-center text-lg sm:text-xl">
            <BoxSelect className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-green-600" />
            Product Type
          </h4>
          <p className="pl-6 text-green-700 font-medium text-sm sm:text-base" data-product-type={productType}>{PRODUCT_TYPE_DISPLAY[productType] || productType}</p>
        </div>
        
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg col-span-2">
          <h4 className="font-semibold text-green-900 mb-1 flex items-center text-lg sm:text-xl">
            <Banknote className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3 text-green-600" />
            Security Deposit
          </h4>
          <p className="pl-3 text-green-700 font-medium flex items-center text-sm sm:text-base">
            ${securityDeposit} <span className="text-xs text-green-600 ml-1">(Refundable)</span>
          </p>
        </div>
      </div>
    </div>
  );
}