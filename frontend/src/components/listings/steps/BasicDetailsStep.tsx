import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertCircle, ChevronRight, Lightbulb } from 'lucide-react';
import { ListingFormData, FormErrors } from '@/types/listings';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Category, ProductType, CATEGORY_PRODUCT_TYPES, CATEGORY_DISPLAY, PRODUCT_TYPE_DISPLAY } from '@/constants/productTypes';

type Props = {
  formData: ListingFormData;
  errors: FormErrors;
  onChange: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
};

const BasicDetailsStep = ({ formData, errors, onChange, onNext }: Props) => {
  const [availableProductTypes, setAvailableProductTypes] = useState<ProductType[]>([]);

  // Update available product types when category changes
  useEffect(() => {
    if (formData.category) {
      setAvailableProductTypes(CATEGORY_PRODUCT_TYPES[formData.category]);
      
      // Reset product type if it's not in the new category
      if (formData.productType && !CATEGORY_PRODUCT_TYPES[formData.category].includes(formData.productType)) {
        onChange({ productType: undefined });
      }
    } else {
      setAvailableProductTypes([]);
    }
  }, [formData.category, onChange]);

  return (
    <div className="space-y-4 md:space-y-6 px-2">
      <div className="grid gap-2">
        <label className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          name="title"
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={`text-sm md:text-base h-8 md:h-10 focus:ring-green-500 focus:border-green-500 placeholder:text-sm ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g., Canon EOS R6 Camera, Camping Tent 4-Person"
        />
        {errors.title ? (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.title}
          </p>
        ) : (
          <p className="text-xs text-gray-500">Enter a descriptive title for your product</p>
        )}
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => onChange({ category: value as Category })}
          >
            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
              {formData.category ? CATEGORY_DISPLAY[formData.category] : "Select Category"}
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_DISPLAY).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.category}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Type <span className="text-red-500">*</span>
          </label>
          <Select 
            value={formData.productType} 
            onValueChange={(value) => onChange({ productType: value as ProductType })}
            disabled={!formData.category}
          >
            <SelectTrigger className={errors.productType ? 'border-red-500' : ''}>
              {formData.productType ? PRODUCT_TYPE_DISPLAY[formData.productType] : "Select Product Type"}
            </SelectTrigger>
            <SelectContent>
              {availableProductTypes.map(type => (
                <SelectItem key={type} value={type}>{PRODUCT_TYPE_DISPLAY[type]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.productType && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.productType}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className={`w-full p-2 border rounded-md h-24 md:h-32 transition-colors placeholder:text-sm ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-1 focus:ring-green-500 focus:border-green-500`}
          placeholder="Describe your item's features, condition, and any special instructions..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.description}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <Input
          name="location"
          value={formData.location}
          onChange={(e) => onChange({ location: e.target.value })}
          className={`text-sm md:text-base h-8 md:h-10 focus:ring-green-500 focus:border-green-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter your location"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.location}
          </p>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={onNext}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default BasicDetailsStep;