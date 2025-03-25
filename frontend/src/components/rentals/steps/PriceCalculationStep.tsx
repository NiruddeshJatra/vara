// components/rentals/steps/PriceCalculationStep.tsx
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
      <div className="border p-4 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Price:</span>
            <span>{product.basePrice} × {formData.duration} = {product.basePrice * formData.duration} Taka</span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee (5%):</span>
            <span>{formData.serviceFee} Taka</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formData.totalCost} Taka</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft size={16} /> Back
        </Button>
        <Button className="bg-green-600 hover:bg-green-700" onClick={onNext}>
          Continue <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PriceCalculationStep;