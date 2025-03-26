// components/listings/PricingStep.tsx
import { Input } from '@/components/ui/input';
import { AlertCircle, Minus, Plus, Shield, Info } from 'lucide-react';
import { ListingFormData, FormErrors, DURATION_CHOICES } from '@/types/listings';
import '@/styles/input-fixes.css';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

type Props = {
  formData: ListingFormData;
  errors: FormErrors;
  durationOptions: typeof DURATION_CHOICES;
  onChange: (data: Partial<ListingFormData>) => void;
};

const PricingStep = ({ formData, errors, durationOptions, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('RentalPeriod') || name === 'basePrice' || name === 'securityDeposit') {
      const numValue = value === '' ? 0 : Number(value);
      onChange({ [name]: numValue });
    } else {
      onChange({ [name]: value });
    }
  };

  const increaseValue = (field: string, min: number = 0, step: number = 1) => {
    const currentValue = formData[field as keyof ListingFormData] as number;
    const newValue = Math.max(min, (currentValue || 0) + step);
    onChange({ [field]: newValue });
  };

  const decreaseValue = (field: string, min: number = 0, step: number = 1) => {
    const currentValue = formData[field as keyof ListingFormData] as number;
    const newValue = Math.max(min, (currentValue || 0) - step);
    onChange({ [field]: newValue });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Base Price (Taka) <span className="text-red-500">*</span>
        </label>
        <Input
          name="basePrice"
          type="number"
          min="0"
          value={formData.basePrice}
          onChange={handleChange}
          className={`text-sm md:text-base h-10 md:h-12 ${errors.basePrice ? 'border-red-500' : ''}`}
          placeholder="Enter price in Taka"
        />
        {errors.basePrice && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.basePrice}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Security Deposit (Taka)
        </label>
        <div className="flex items-center gap-2">
          <Input
            name="securityDeposit"
            type="number"
            min="0"
            value={formData.securityDeposit || ''}
            onChange={handleChange}
            className="text-sm md:text-base h-10 md:h-12"
            placeholder="Optional - Recommended for valuable items"
          />
          <div className="h-10 md:h-12 flex items-center text-green-700">
            <Shield size={18} />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          A refundable amount to protect against damage or loss
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Duration Unit <span className="text-red-500">*</span>
        </label>
        <Select 
          value={formData.durationUnit} 
          onValueChange={(value) => onChange({ durationUnit: value as 'hour' | 'day' | 'week' | 'month' })}
        >
          <SelectTrigger className={errors.durationUnit ? 'border-red-500' : ''}>
            {durationOptions.find(option => option.value === formData.durationUnit)?.label || "Select Duration Unit"}
          </SelectTrigger>
          <SelectContent>
            {durationOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.durationUnit && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.durationUnit}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Minimum Rental Period <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              name="minRentalPeriod"
              type="number"
              min="1"
              value={formData.minRentalPeriod}
              onChange={handleChange}
              className={`text-sm md:text-base h-10 md:h-12 pr-12 ${errors.minRentalPeriod ? 'border-red-500' : ''}`}
            />
            <div className="absolute right-0 top-0 h-full flex flex-col border-l">
              <button 
                type="button"
                className="flex-1 px-2 hover:bg-gray-100 flex items-center justify-center"
                onClick={() => increaseValue('minRentalPeriod', 1)}
              >
                <Plus size={14} />
              </button>
              <button 
                type="button"
                className="flex-1 px-2 hover:bg-gray-100 border-t flex items-center justify-center"
                onClick={() => decreaseValue('minRentalPeriod', 1)}
                disabled={formData.minRentalPeriod <= 1}
              >
                <Minus size={14} />
              </button>
            </div>
          </div>
          {errors.minRentalPeriod && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.minRentalPeriod}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Maximum Rental Period
          </label>
          <div className="relative">
            <Input
              name="maxRentalPeriod"
              type="number"
              min={formData.minRentalPeriod + 1}
              value={formData.maxRentalPeriod || ''}
              onChange={handleChange}
              className={`text-sm md:text-base h-10 md:h-12 pr-12 ${errors.maxRentalPeriod ? 'border-red-500' : ''}`}
              placeholder="Optional"
            />
            <div className="absolute right-0 top-0 h-full flex flex-col border-l">
              <button 
                type="button"
                className="flex-1 px-2 hover:bg-gray-100 flex items-center justify-center"
                onClick={() => increaseValue('maxRentalPeriod', formData.minRentalPeriod + 1)}
              >
                <Plus size={14} />
              </button>
              <button 
                type="button"
                className="flex-1 px-2 hover:bg-gray-100 border-t flex items-center justify-center"
                onClick={() => decreaseValue('maxRentalPeriod', formData.minRentalPeriod + 1)}
                disabled={!formData.maxRentalPeriod || formData.maxRentalPeriod <= formData.minRentalPeriod + 1}
              >
                <Minus size={14} />
              </button>
            </div>
          </div>
          {errors.maxRentalPeriod && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.maxRentalPeriod}
            </p>
          )}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
        <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Info size={16} className="text-amber-600" />
          Pricing Tips
        </h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>Set a competitive base price by checking similar items in your area</li>
          <li>Consider your item's condition and market value</li>
          <li>Longer rental periods may warrant discounted rates</li>
          <li><strong>Security Deposit:</strong> Add a deposit for valuable items to protect against damage</li>
        </ul>
      </div>
    </div>
  );
};

export default PricingStep;