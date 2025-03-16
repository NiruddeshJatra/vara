// components/listings/PricingStep.tsx
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { ListingFormData, FormErrors, DURATION_CHOICES } from '@/types/listings';

type Props = {
  formData: ListingFormData;
  errors: FormErrors;
  durationOptions: typeof DURATION_CHOICES;
  onChange: (data: Partial<ListingFormData>) => void;
};

const PricingStep = ({ formData, errors, durationOptions, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: name.includes('RentalPeriod') ? Number(value) : value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          Base Price (Taka) <span className="text-red-500">*</span>
        </label>
        <Input
          name="basePrice"
          type="number"
          min="0"
          value={formData.basePrice}
          onChange={handleChange}
          className={`text-sm md:text-base h-10 md:h-12 ${errors.basePrice ? 'border-red-500' : ''}`}
        />
        {errors.basePrice && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.basePrice}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Duration Unit <span className="text-red-500">*</span>
        </label>
        <select
          name="durationUnit"
          value={formData.durationUnit}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${errors.durationUnit ? 'border-red-500' : ''}`}
        >
          {durationOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Minimum Rental Period <span className="text-red-500">*</span>
          </label>
          <Input
            name="minRentalPeriod"
            type="number"
            min="1"
            value={formData.minRentalPeriod}
            onChange={handleChange}
            className={`text-sm md:text-base h-10 md:h-12 ${errors.minRentalPeriod ? 'border-red-500' : ''}`}
          />
          {errors.minRentalPeriod && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.minRentalPeriod}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Maximum Rental Period
          </label>
          <Input
            name="maxRentalPeriod"
            type="number"
            min={formData.minRentalPeriod + 1}
            value={formData.maxRentalPeriod || ''}
            onChange={handleChange}
            className={`text-sm md:text-base h-10 md:h-12 ${errors.maxRentalPeriod ? 'border-red-500' : ''}`}
          />
          {errors.maxRentalPeriod && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.maxRentalPeriod}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingStep;