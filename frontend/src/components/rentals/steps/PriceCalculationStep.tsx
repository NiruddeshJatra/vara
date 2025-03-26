// components/rentals/steps/PriceCalculationStep.tsx
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Info, Calculator, Shield } from 'lucide-react';
import { RentalRequestFormData, Product } from '@/types/listings';

interface Props {
  product: Product;
  formData: RentalRequestFormData;
  onNext: () => void;
  onPrev: () => void;
}

const PriceCalculationStep = ({ product, formData, onNext, onPrev }: Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-800">Price Calculation</h2>

      <div className="bg-green-50/50 rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <Calculator className="h-5 w-5" />
          <h3 className="text-lg font-medium">Price Breakdown</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p className="font-medium">Base Price</p>
              <p className="text-sm text-gray-500">
                {product.basePrice} × {formData.duration} {product.durationUnit}s
              </p>
            </div>
            <span className="font-medium">{product.basePrice * formData.duration} Taka</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p className="font-medium">Service Fee</p>
              <p className="text-sm text-gray-500">Platform fee (5%)</p>
            </div>
            <span className="font-medium">{formData.serviceFee} Taka</span>
          </div>

          {formData.securityDeposit > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Security Deposit</p>
                  <p className="text-sm text-gray-500">Refundable</p>
                </div>
              </div>
              <span className="font-medium">{formData.securityDeposit} Taka</span>
            </div>
          )}

          <div className="flex justify-between items-center py-3 border-t-2 border-green-100">
            <p className="text-lg font-semibold">Total Cost</p>
            <span className="text-lg font-semibold text-green-700">{formData.totalCost} Taka</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
        <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Info size={16} className="text-amber-600" />
          Payment Information
        </h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>No upfront payment is required to submit your request</li>
          <li>Payment will be processed only after the owner accepts your request</li>
          <li>Security deposit (if any) is fully refundable after successful return</li>
          <li>Service fee helps us maintain the platform and provide support</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onPrev}
          className="border-green-200 text-green-700 hover:bg-green-50"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Details
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onNext}
        >
          Continue to Additional Info <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PriceCalculationStep;