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
  itemAge,
  securityDeposit = '0'
}: ItemDetailsProps) {
  return (
    <div className="mb-10 pb-10 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Item details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-1 flex items-center">
            <Tag className="h-4 w-4 mr-3 text-green-600" />
            Category
          </h4>
          <p className="text-green-700 font-medium">{CATEGORY_DISPLAY[category] || category}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-1 flex items-center">
            <BoxSelect className="h-4 w-4 mr-3 text-green-600" />
            Product Type
          </h4>
          <p className="text-green-700 font-medium">{PRODUCT_TYPE_DISPLAY[productType] || productType}</p>
        </div>
        
        {itemAge && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-1 flex items-center">
              <Clock className="h-4 w-4 mr-3 text-green-600" />
              Item Age
            </h4>
            <p className="text-green-700 font-medium">{itemAge} years</p>
          </div>
        )}
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-1 flex items-center">
            <Banknote className="h-4 w-4 mr-3 text-green-600" />
            Security Deposit
          </h4>
          <p className="text-green-700 font-medium flex items-center">
            ${securityDeposit} <span className="text-xs text-green-600 ml-1">(Refundable)</span>
          </p>
        </div>
      </div>
    </div>
  );
} 