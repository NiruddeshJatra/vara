import React from 'react';
import { Banknote } from 'lucide-react';

interface ItemDetailsProps {
  condition: string;
  category: string;
  itemAge?: number;
  securityDeposit?: number;
}

export default function ItemDetails({
  condition = 'Excellent',
  category,
  itemAge,
  securityDeposit = 0
}: ItemDetailsProps) {
  return (
    <div className="mb-10 pb-10 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Item details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-1">Condition</h4>
          <p className="text-green-700 capitalize font-medium">{condition}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-1">Category</h4>
          <p className="text-green-700 font-medium">{category}</p>
        </div>
        
        {itemAge && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-1">Item Age</h4>
            <p className="text-green-700 font-medium">{itemAge} years</p>
          </div>
        )}
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-1">Security Deposit</h4>
          <p className="text-green-700 font-medium flex items-center">
            <Banknote className="h-4 w-4 mr-1 text-green-600" />
            ${securityDeposit} <span className="text-xs text-green-600 ml-1">(Refundable)</span>
          </p>
        </div>
      </div>
    </div>
  );
} 