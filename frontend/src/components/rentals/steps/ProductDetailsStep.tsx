// components/rentals/steps/ProductDetailsStep.tsx
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { RentalRequestFormData, Product, FormErrors } from '@/types/listings';

interface Props {
  product: Product;
  formData: RentalRequestFormData;
  errors: FormErrors;
  onChange: (data: Partial<RentalRequestFormData>) => void;
  onNext: () => void;
}

const ProductDetailsStep = ({ product, formData, errors, onChange, onNext }: Props) => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">{product.title}</h2>
        <div className="mt-4 space-y-2 text-gray-600">
          <p><span className="font-medium">Owner:</span> {product.owner}</p>
          <p><span className="font-medium">Category:</span> {product.category}</p>
          <p><span className="font-medium">Pricing:</span> {product.basePrice} Taka per {product.durationUnit}</p>
          <p><span className="font-medium">Location:</span> {product.location}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rental Start Date *</label>
          <DatePicker
            selected={formData.startDate}
            onChange={(date: Date | null) => onChange({ startDate: date as Date })}
            minDate={new Date()}
            className="w-full p-2 border rounded-md"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.startDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Rental Duration ({product.durationUnit}s) *
          </label>
          <Input
            type="number"
            min={product.minRentalPeriod}
            max={product.maxRentalPeriod}
            value={formData.duration}
            onChange={(e) => onChange({ duration: Number(e.target.value) })}
            className={errors.duration ? 'border-red-500' : ''}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.duration}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button className="bg-green-600 hover:bg-green-700" onClick={onNext}>
            Continue <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsStep;