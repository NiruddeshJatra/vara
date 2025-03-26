import React from 'react';
import { Clock, ShieldCheck, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DurationUnit } from '@/types/listings';

interface PricingCardProps {
  productId: string;
  basePrice: number;
  durationUnit: DurationUnit;
  minRentalPeriod: number;
  maxRentalPeriod?: number;
  securityDeposit?: number;
}

export default function PricingCard({
  productId,
  basePrice,
  durationUnit,
  minRentalPeriod,
  maxRentalPeriod,
  securityDeposit = 0
}: PricingCardProps) {
  return (
    <div className="space-y-6">
      {/* Pricing Card */}
      <div className="bg-gradient-to-b from-white to-leaf-50 rounded-lg border border-gray-200 shadow-md p-4 sm:p-6 sticky top-24">
        <h2 className="text-lg sm:text-xl font-semibold mb-6 pb-3 border-b">Pricing Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Base Price:</span>
            <div className="text-2xl font-bold text-green-600 flex items-center">
              <Banknote className="h-5 w-5 mr-1 inline" />
              {basePrice}
            </div>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Per {durationUnit}</span>
            <span>+ 5% Service Fee</span>
          </div>

          <div className="pt-4 space-y-2 border-t">
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                Minimum Rental:
              </span>
              <span className="font-medium">
                {minRentalPeriod} {durationUnit}s
              </span>
            </div>
            {maxRentalPeriod && (
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Maximum Rental:
                </span>
                <span className="font-medium">
                  {maxRentalPeriod} {durationUnit}s
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Security Deposit</h3>
              <div className="flex items-center text-gray-700">
                <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
                <Banknote className="h-4 w-4 mr-1 text-gray-600" />
                <span>{securityDeposit}</span>
                <span className="text-xs text-gray-500 ml-2">(Refundable)</span>
              </div>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
              asChild
            >
              <Link 
                to={`/request-rental/${productId}`} 
                state={{ 
                  product: {
                    id: productId,
                    basePrice,
                    durationUnit,
                    minRentalPeriod,
                    maxRentalPeriod,
                    securityDeposit
                  }
                }}
                className="w-full h-full flex items-center justify-center"
              >
                Request Rental Now
              </Link>
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              No upfront payment required. Vhara handles the logistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 