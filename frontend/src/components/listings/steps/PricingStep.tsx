import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { ListingFormData, FormErrors, PricingTier } from '@/types/listings';
import { DurationUnit, DURATION_UNIT_DISPLAY } from '@/constants/rental';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

type Props = {
  formData: ListingFormData;
  errors: FormErrors;
  onChange: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const PricingStep = ({ formData, errors, onChange, onNext, onBack }: Props) => {
  const handlePricingTierChange = (index: number, field: keyof PricingTier, value: any) => {
    const newTiers = [...formData.pricingTiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    onChange({ pricingTiers: newTiers });
  };

  const addPricingTier = () => {
    const newTiers = [...formData.pricingTiers];
    newTiers.push({ durationUnit: DurationUnit.DAY, price: 0, maxPeriod: 1 });
    onChange({ pricingTiers: newTiers });
  };

  const removePricingTier = (index: number) => {
    const newTiers = formData.pricingTiers.filter((_, i) => i !== index);
    onChange({ pricingTiers: newTiers });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Pricing Details</h2>
        <p className="text-gray-600">
          Set up your rental pricing tiers. You can add multiple tiers for different durations.
        </p>
      </div>

      <div className="space-y-6">
        {formData.pricingTiers.map((tier, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">Pricing Tier {index + 1}</h3>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePricingTier(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Duration Unit
                </Label>
                <Select
                  value={tier.durationUnit}
                  onValueChange={(value) => handlePricingTierChange(index, 'durationUnit', value as DurationUnit)}
                >
                  <SelectTrigger className={errors[`pricingTiers.${index}.durationUnit`] ? "border-red-500" : ""}>
                    {DURATION_UNIT_DISPLAY[tier.durationUnit]}
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DURATION_UNIT_DISPLAY).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`pricingTiers.${index}.durationUnit`] && (
                  <p className="text-sm text-red-500">{errors[`pricingTiers.${index}.durationUnit`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Price per {tier.durationUnit}
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={tier.price}
                  onChange={(e) => handlePricingTierChange(index, 'price', parseFloat(e.target.value) || 0)}
                  className={errors[`pricingTiers.${index}.price`] ? "border-red-500" : ""}
                />
                {errors[`pricingTiers.${index}.price`] && (
                  <p className="text-sm text-red-500">{errors[`pricingTiers.${index}.price`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Maximum Period
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={tier.maxPeriod}
                  onChange={(e) => handlePricingTierChange(index, 'maxPeriod', parseInt(e.target.value) || 1)}
                  className={errors[`pricingTiers.${index}.maxPeriod`] ? "border-red-500" : ""}
                />
                {errors[`pricingTiers.${index}.maxPeriod`] && (
                  <p className="text-sm text-red-500">{errors[`pricingTiers.${index}.maxPeriod`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {formData.pricingTiers.length < 3 && (
          <Button
            variant="outline"
            onClick={addPricingTier}
            className="w-full py-4 border-dashed border-2 text-gray-500 hover:text-gray-700"
          >
            <Plus size={16} className="mr-2" />
            Add Another Pricing Tier
          </Button>
        )}

        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Security Deposit
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.securityDeposit}
            onChange={(e) => onChange({ securityDeposit: parseFloat(e.target.value) || 0 })}
            className={errors.securityDeposit ? "border-red-500" : ""}
            placeholder="Enter security deposit amount"
          />
          {errors.securityDeposit && (
            <p className="text-sm text-red-500">{errors.securityDeposit}</p>
          )}
          <p className="text-sm text-gray-500">
            This amount will be held as a security deposit and returned after the rental period.
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} /> Back
        </Button>
        <Button
          onClick={onNext}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default PricingStep;