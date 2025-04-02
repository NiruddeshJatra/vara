import { Input } from '@/components/ui/input';
import { AlertCircle, Shield, Info, Plus, Trash2 } from 'lucide-react';
import { ListingFormData, FormErrors, DURATION_CHOICES, PricingTier } from '@/types/listings';
import '@/styles/input-fixes.css';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

type Props = {
  formData: ListingFormData;
  errors: FormErrors;
  durationOptions: typeof DURATION_CHOICES;
  onChange: (data: Partial<ListingFormData>) => void;
};

const PricingStep = ({ formData, errors, durationOptions, onChange }: Props) => {
  // Initialize pricingTiers if it doesn't exist
  if (!formData.pricingTiers || formData.pricingTiers.length === 0) {
    onChange({ pricingTiers: [{ durationUnit: 'day', price: 0 }] });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'securityDeposit') {
      const numValue = value === '' ? 0 : Number(value);
      onChange({ [name]: numValue });
    } else {
      onChange({ [name]: value });
    }
  };

  const handlePricingTierChange = (index: number, field: keyof PricingTier, value: any) => {
    const updatedTiers = [...(formData.pricingTiers || [])];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    onChange({ pricingTiers: updatedTiers });
  };

  const addPricingTier = () => {
    const updatedTiers = [...(formData.pricingTiers || [])];
    updatedTiers.push({ durationUnit: 'day', price: 0 });
    onChange({ pricingTiers: updatedTiers });
  };

  const removePricingTier = (index: number) => {
    const updatedTiers = [...(formData.pricingTiers || [])];
    updatedTiers.splice(index, 1);
    onChange({ pricingTiers: updatedTiers });
  };

  // Filter out the "hour" option from duration choices
  const filteredDurationOptions = durationOptions.filter(option => option.value !== 'hour');

  // Get placeholder text based on duration unit
  const getPricePlaceholder = (durationUnit: string) => {
    switch (durationUnit) {
      case 'day':
        return 'Enter price per day in Taka';
      case 'week':
        return 'Enter price per week in Taka';
      case 'month':
        return 'Enter price per month in Taka';
      default:
        return 'Enter price in Taka';
    }
  };

  const getMaxPeriodPlaceholder = (durationUnit: string) => {
    switch (durationUnit) {
      case 'day':
        return 'Maximum number of days (optional)';
      case 'week':
        return 'Maximum number of weeks (optional)';
      case 'month':
        return 'Maximum number of months (optional)';
      default:
        return 'Optional';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-green-900">Pricing Tiers</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addPricingTier}
            className="flex items-center gap-1 text-green-700 font-semibold border-gray-300"
          >
            <Plus size={16} /> Add Tier
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">
          Set different prices for different rental durations. You can add multiple tiers (e.g., daily, weekly, monthly rates).
        </p>

        {formData.pricingTiers?.map((tier, index) => (
          <div key={index} className="p-4 border rounded-lg bg-green-50 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-green-800">Tier {index + 1}</h4>
              {formData.pricingTiers && formData.pricingTiers.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removePricingTier(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Duration Unit <span className="text-red-500">*</span>
                </label>
                <Select 
                  value={tier.durationUnit} 
                  onValueChange={(value) => handlePricingTierChange(index, 'durationUnit', value as 'day' | 'week' | 'month')}
                >
                  <SelectTrigger className={errors[`pricingTiers.${index}.durationUnit`] ? 'border-red-500' : ''}>
                    {filteredDurationOptions.find(option => option.value === tier.durationUnit)?.label || "Select Duration Unit"}
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDurationOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`pricingTiers.${index}.durationUnit`] && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors[`pricingTiers.${index}.durationUnit`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Base Price (Taka) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  value={tier.price === 0 ? '' : tier.price}
                  onChange={(e) => handlePricingTierChange(index, 'price', e.target.value ? Number(e.target.value) : 0)}
                  className={`text-sm md:text-base h-10 md:h-12 placeholder:text-sm ${errors[`pricingTiers.${index}.price`] ? 'border-red-500' : ''}`}
                  placeholder={getPricePlaceholder(tier.durationUnit)}
                />
                {errors[`pricingTiers.${index}.price`] && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors[`pricingTiers.${index}.price`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Maximum Rental Period
                </label>
                <Input
                  type="number"
                  min="1"
                  value={tier.maxPeriod || ''}
                  onChange={(e) => handlePricingTierChange(index, 'maxPeriod', e.target.value ? Number(e.target.value) : undefined)}
                  className={`text-sm md:text-base h-10 md:h-12 placeholder:text-sm ${errors[`pricingTiers.${index}.maxPeriod`] ? 'border-red-500' : ''}`}
                  placeholder={getMaxPeriodPlaceholder(tier.durationUnit)}
                />
                {errors[`pricingTiers.${index}.maxPeriod`] && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors[`pricingTiers.${index}.maxPeriod`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="text-sm md:text-base h-10 md:h-12 placeholder:text-sm"
              placeholder="Recommended for valuable items"
            />
            <div className="h-10 md:h-12 flex items-center text-green-700">
              <Shield size={18} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            A refundable amount to protect against damage or loss
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
        <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Info size={16} className="text-amber-600" />
          Pricing Tips
        </h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>Set competitive prices by checking similar items in your area</li>
          <li>Consider offering discounts for longer rental periods</li>
          <li>For example: Higher daily rate, lower weekly rate, lowest monthly rate</li>
          <li><strong>Security Deposit:</strong> Add a deposit for valuable items to protect against damage</li>
        </ul>
      </div>
    </div>
  );
};

export default PricingStep;