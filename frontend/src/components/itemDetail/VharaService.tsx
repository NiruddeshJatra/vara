import React from 'react';
import { RefreshCw, Check } from 'lucide-react';

export default function VharaService() {
  return (
    <div className="mb-10 pb-10 border-b border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Bhara Service</h3>
      <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-5 bg-green-50 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-green-800">We handle the entire rental process</h2>
              <p className="text-sm sm:text-base text-green-700">Secure, verified, and hassle-free experience</p>
            </div>
          </div>
        </div>
        <div className="py-4 sm:py-6 px-6 bg-green-50/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-green-900">Item Collection</h4>
                <p className="text-sm sm:text-base text-gray-600">We collect the item from the owner</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-green-900">Quality Verification</h4>
                <p className="text-sm sm:text-base text-gray-600">We inspect every item before delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-green-900">Delivery & Setup</h4>
                <p className="text-sm sm:text-base text-gray-600">We deliver to your location</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-green-900">Return Logistics</h4>
                <p className="text-sm sm:text-base text-gray-600">We collect and return to the owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 