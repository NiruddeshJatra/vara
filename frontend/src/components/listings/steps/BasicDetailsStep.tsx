import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertCircle, ChevronRight, Lightbulb } from 'lucide-react';
import { ListingFormData, FormError } from '@/types/listings';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
  Category,
  PRODUCT_TYPE_CATEGORY,
  CATEGORY_DISPLAY,
  PRODUCT_TYPE_DISPLAY
} from '@/constants/productTypes';
import { Label } from '@/components/ui/label';

type Props = {
  formData: ListingFormData;
  errors: FormError;
  onChange: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
};

const BasicDetailsStep = ({ formData, errors, onChange, onNext }: Props) => {
  const [availableProductTypes, setAvailableProductTypes] = useState<string[]>([]);

  // Update available product types when category changes
  useEffect(() => {
    if (formData.category) {
      // Get product types for the selected category using the mapping
      const productTypes = Object.entries(PRODUCT_TYPE_CATEGORY)
        .filter(([_, category]) => category === formData.category)
        .map(([type]) => type);
      setAvailableProductTypes(productTypes);

      // Reset product type if it's not in the new category
      if (formData.productType && !productTypes.includes(formData.productType)) {
        onChange({ productType: '' });
      }
    } else {
      setAvailableProductTypes([]);
    }
  }, [formData.category, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Label htmlFor="title" className="text-xs sm:text-sm font-medium">Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`h-9 sm:h-10 text-sm ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Enter a descriptive title for your product"
        />
        {errors.title && (
          <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={12} className="sm:w-4 sm:h-4" /> {errors.title[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label htmlFor="category" className="text-xs sm:text-sm font-medium">Category <span className="text-red-500">*</span></Label>
          <Select
            value={formData.category}
            onValueChange={(value) => onChange({ category: value })}
          >
            <SelectTrigger className={`h-9 sm:h-10 text-xs sm:text-sm ${errors.category ? 'border-red-500' : ''}`}>
              {formData.category ? CATEGORY_DISPLAY[formData.category] : "Select Category"}
            </SelectTrigger>
            <SelectContent className="text-xs sm:text-sm">
              {Object.values(Category).map(cat => (
                <SelectItem key={cat} value={cat} className="text-xs sm:text-sm">
                  {CATEGORY_DISPLAY[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={12} className="sm:w-4 sm:h-4" /> {errors.category[0]}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="productType" className="text-xs sm:text-sm font-medium">Product Type <span className="text-red-500">*</span></Label>
          <Select
            value={formData.productType}
            onValueChange={(value) => onChange({ productType: value })}
            disabled={!formData.category}
          >
            <SelectTrigger className={`h-9 sm:h-10 text-xs sm:text-sm ${errors.productType ? 'border-red-500' : ''}`}>
              {formData.productType ? PRODUCT_TYPE_DISPLAY[formData.productType] : "Select Product Type"}
            </SelectTrigger>
            <SelectContent className="text-xs sm:text-sm">
              {availableProductTypes.map(type => (
                <SelectItem key={type} value={type} className="text-xs sm:text-sm">
                  {PRODUCT_TYPE_DISPLAY[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.productType && (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={12} className="sm:w-4 sm:h-4" /> {errors.productType[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-xs sm:text-sm font-medium">Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`text-xs sm:text-sm min-h-[80px] sm:min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Describe your product in detail"
          rows={3}
        />
        {errors.description && (
          <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={12} className="sm:w-4 sm:h-4" /> {errors.description[0]}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <Input
          name="location"
          placeholder="City, Area"
          value={formData.location}
          onChange={handleChange}
          className={`h-9 sm:h-10 text-sm ${errors.location ? 'border-red-500' : ''}`}
        />
        {errors.location ? (
          <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={12} className="sm:w-4 sm:h-4" /> {errors.location[0]}
          </p>
        ) : (
          <p className="mt-1 text-xs text-gray-500">Where is the product located?</p>
        )}
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 sm:p-4 rounded-lg border border-amber-200 mt-3 sm:mt-4">
        <h3 className="text-xs sm:text-sm font-medium text-amber-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
          <Lightbulb size={14} className="text-amber-600 sm:w-4 sm:h-4" />
          Listing Tips
        </h3>
        <ul className="text-xs/5 sm:text-sm/6 text-amber-700 space-y-0.5 sm:space-y-1 list-disc pl-4 sm:pl-5">
          <li><strong>Title:</strong> Be specific and include brand names when relevant</li>
          <li><strong>Description:</strong> Mention condition, dimensions, features, and usage instructions</li>
          <li><strong>Category:</strong> Choose the most relevant category for better visibility</li>
          <li><strong>Location:</strong> Provide location details to help renters know the nearest location</li>
        </ul>
      </div>

    </div>
  );
};

export default BasicDetailsStep;