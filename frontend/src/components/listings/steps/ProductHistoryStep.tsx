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
    <div className="space-y-6">
      <div className="space-y-1 mt-5">
        <h4 className="text-md md:text-xl font-semibold text-green-800">Product History</h4>
        <p className="text-xs/5 md:text-sm/6 text-gray-600">
          Provide information about when you purchased this product and its ownership history.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="purchase_year" className="text-xs md:text-sm font-medium text-gray-700">
              Purchase Year <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.purchase_year} 
              onValueChange={(value) => handleChange('purchase_year', value)}
            >
              <SelectTrigger className={`h-9 sm:h-10 text-xs md:text-sm ${errors.purchase_year ? "border-red-500" : ""}`}>
                {formData.purchase_year || "Select Year"}
              </SelectTrigger>
              <SelectContent className="text-xs md:text-sm">
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.purchase_year && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">{errors.purchase_year[0]}</p>
            )}
            <p className="text-xs text-gray-500">
              The year when you purchased this product.
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="original_price" className="text-xs md:text-sm font-medium text-gray-700">
              Original Price <span className="text-red-500">*</span>
            </Label>
            <Input
              id="original_price"
              type="number"
              min="0"
              value={formData.original_price || ''}
              onChange={(e) => handleChange('original_price', e.target.value ? Number(e.target.value) : undefined)}
              className={`h-10 text-sm ${errors.original_price ? "border-red-500" : ""}`}
              placeholder="Enter original purchase price"
            />
            {errors.original_price && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">{errors.original_price[0]}</p>
            )}
            <p className="text-xs text-gray-500">
              The price you paid when purchasing this product.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs md:text-sm font-medium text-gray-700">
            Ownership History <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.ownership_history}
            onValueChange={(value) => handleChange('ownership_history', value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value={OwnershipHistory.FIRSTHAND} 
                id="ownership-firsthand" 
                className="text-green-600 h-4 w-4" 
              />
              <Label htmlFor="ownership-firsthand" className="text-xs md:text-sm">First Hand</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value={OwnershipHistory.SECONDHAND} 
                id="ownership-secondhand" 
                className="text-green-600 h-4 w-4" 
              />
              <Label htmlFor="ownership-secondhand" className="text-xs md:text-sm">Second Hand</Label>
            </div>
          </RadioGroup>
          {errors.ownership_history && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">{errors.ownership_history[0]}</p>
          )}
          <p className="text-xs text-gray-500">
            Indicate whether you are the first owner of this product or if it has been previously owned.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
        <h4 className="text-xs font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Info size={14} className="text-amber-600" />
          Why we ask for this information
        </h4>
        <ul className="text-xs/5 sm:text-sm/6 text-amber-700 space-y-1 list-disc pl-5">
          <li>Product history helps renters understand the item's background and value.</li>
          <li>This information can build trust and transparency in your listing.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductHistoryStep;
