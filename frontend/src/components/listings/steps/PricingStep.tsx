import { Input } from '@/components/ui/input';
import { AlertCircle, Shield, Info } from 'lucide-react';
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
    
    if (name === 'basePrice' || name === 'securityDeposit') {
      const numValue = value === '' ? 0 : Number(value);
      onChange({ [name]: numValue });
    } else {
      onChange({ [name]: value });
    }
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

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Maximum Rental Period
        </label>
        <Input
          name="maxRentalPeriod"
          type="number"
          min="1"
          value={formData.maxRentalPeriod || ''}
          onChange={handleChange}
          className={`text-sm md:text-base h-10 md:h-12 ${errors.maxRentalPeriod ? 'border-red-500' : ''}`}
          placeholder="Optional"
        />
        {errors.maxRentalPeriod && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.maxRentalPeriod}
          </p>
        )}
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