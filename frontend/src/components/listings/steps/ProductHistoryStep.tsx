import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ListingFormData, FormError } from '@/types/listings';
import { Info } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { OwnershipHistory } from '@/constants/productAttributes';

type Props = {
  formData: ListingFormData;
  onChange: (data: Partial<ListingFormData>) => void;
  errors?: FormError;
  onNext: () => void;
  onBack: () => void;
};

const ProductHistoryStep = ({ formData, onChange, errors = {} }: Props) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - i);

  const handleChange = (field: keyof ListingFormData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Product History</h2>
        <p className="text-gray-600">
          Provide information about when you purchased this product and its ownership history.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="purchaseYear" className="text-base font-medium text-gray-700">
              Purchase Year <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.purchaseYear} 
              onValueChange={(value) => handleChange('purchaseYear', value)}
            >
              <SelectTrigger className={errors.purchaseYear ? "border-red-500" : ""}>
                {formData.purchaseYear || "Select Year"}
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.purchaseYear && (
              <p className="text-sm text-red-500">{errors.purchaseYear[0]}</p>
            )}
            <p className="text-sm text-gray-500">
              The year when you purchased this product.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="originalPrice" className="text-base font-medium text-gray-700">
              Original Price <span className="text-red-500">*</span>
            </Label>
            <Input
              id="originalPrice"
              type="number"
              min="0"
              value={formData.originalPrice || ''}
              onChange={(e) => handleChange('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
              className={errors.originalPrice ? "border-red-500" : ""}
              placeholder="Enter original purchase price"
            />
            {errors.originalPrice && (
              <p className="text-sm text-red-500">{errors.originalPrice[0]}</p>
            )}
            <p className="text-sm text-gray-500">
              The price you paid when purchasing this product.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Ownership History <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.ownershipHistory}
            onValueChange={(value) => handleChange('ownershipHistory', value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value={OwnershipHistory.FIRSTHAND} 
                id="ownership-firsthand" 
                className="text-green-600" 
              />
              <Label htmlFor="ownership-firsthand">First Hand</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value={OwnershipHistory.SECONDHAND} 
                id="ownership-secondhand" 
                className="text-green-600" 
              />
              <Label htmlFor="ownership-secondhand">Second Hand</Label>
            </div>
          </RadioGroup>
          {errors.ownershipHistory && (
            <p className="text-sm text-red-500">{errors.ownershipHistory[0]}</p>
          )}
          <p className="text-sm text-gray-500">
            Indicate whether you are the first owner of this product or if it has been previously owned.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
        <h4 className="text-lg font-semibold text-amber-800 mb-2 flex items-center gap-2">
          <Info size={16} className="text-amber-600" />
          Why we ask for this information
        </h4>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>Product history helps renters understand the item's background and value.</li>
          <li>This information can build trust and transparency in your listing.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductHistoryStep;
