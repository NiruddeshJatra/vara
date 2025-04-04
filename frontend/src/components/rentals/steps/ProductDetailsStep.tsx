// components/rentals/steps/ProductDetailsStep.tsx
import { Input } from '@/components/ui/input';
import { AlertCircle, ChevronRight, Info, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-4 md:space-y-6 px-2">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">Item Details</h2>
      
      <div className="bg-green-50/50 rounded-lg border border-gray-200 p-4 space-y-2">
        <h3 className="text-lg font-medium text-gray-800">{product.title}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Owner</p>
            <p className="font-medium text-green-900">{product.owner}</p>
          </div>
          <div>
            <p className="text-gray-600">Category</p>
            <p className="font-medium text-green-900">{product.category}</p>
          </div>
          <div>
            <p className="text-gray-600">Price</p>
            <p className="font-medium text-green-900">{product.pricingTiers[0].price} Taka per {product.pricingTiers[0].durationUnit}</p>
          </div>
          <div>
            <p className="text-gray-600">Location</p>
            <p className="font-medium text-green-900">{product.location}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rental Start Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DatePicker
              selected={formData.startDate}
              onChange={(date: Date | null) => onChange({ startDate: date as Date })}
              minDate={new Date()}
              className="w-full p-2 border rounded-md text-sm md:text-base h-8 md:h-10 focus:ring-green-500 focus:border-green-500"
              placeholderText="Select start date"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.startDate ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.startDate}
            </p>
          ) : (
            <p className="text-xs text-gray-500">Choose when you want to start renting</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rental Duration ({product.pricingTiers[0].durationUnit}s) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            max={product.pricingTiers[0].maxPeriod}
            value={formData.duration}
            onChange={(e) => onChange({ duration: Number(e.target.value) })}
            className={`text-sm md:text-base h-8 md:h-10 focus:ring-green-500 focus:border-green-500 ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.duration ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.duration}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              {product.pricingTiers[0].maxPeriod ? `, maximum ${product.pricingTiers[0].maxPeriod} ${product.pricingTiers[0].durationUnit}s` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
        <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Info size={16} className="text-amber-600" />
          Rental Tips
        </h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>Choose dates when you'll be available to pick up and return the item</li>
          <li>Consider any setup or learning time you might need</li>
          <li>Check the item's availability calendar for open slots</li>
          <li>Book for the full duration you need to avoid extensions</li>
        </ul>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onNext}
        >
          Continue to Price Review <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailsStep;