import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertCircle, ChevronRight, Lightbulb } from 'lucide-react';
import { ListingFormData, FormError } from '@/types/listings';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Category, ProductType, CATEGORY_PRODUCT_TYPES, PRODUCT_TYPE_DISPLAY } from '@/constants/productTypes';
import { Label } from '@/components/ui/label';

type Props = {
  formData: ListingFormData;
  errors: FormError;
  onChange: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
};

const BasicDetailsStep = ({ formData, errors, onChange, onNext }: Props) => {
  const [availableProductTypes, setAvailableProductTypes] = useState<ProductType[]>([]);

  // Update available product types when category changes
  useEffect(() => {
    if (formData.category) {
      // Get product types for the selected category using the mapping
      const productTypes = CATEGORY_PRODUCT_TYPES[formData.category as Category] || [];
      setAvailableProductTypes(productTypes);

      // Reset product type if it's not in the new category
      if (formData.productType && !productTypes.includes(formData.productType as ProductType)) {
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
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'border-red-500' : ''}
          placeholder="Enter a descriptive title for your product"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.title[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
          <Select
            value={formData.category}
            onValueChange={(value) => onChange({ category: value as Category })}
          >
            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
              {formData.category || "Select Category"}
            </SelectTrigger>
            <SelectContent>
              {Object.values(Category).map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.category[0]}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="productType">Product Type <span className="text-red-500">*</span></Label>
          <Select
            value={formData.productType}
            onValueChange={(value) => onChange({ productType: value as ProductType })}
            disabled={!formData.category}
          >
            <SelectTrigger className={errors.productType ? 'border-red-500' : ''}>
              {formData.productType ? PRODUCT_TYPE_DISPLAY[formData.productType as ProductType] : "Select Product Type"}
            </SelectTrigger>
            <SelectContent>
              {availableProductTypes.map(type => (
                <SelectItem key={type} value={type}>{PRODUCT_TYPE_DISPLAY[type]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.productType && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.productType[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? 'border-red-500' : ''}
          placeholder="Describe your product in detail"
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.description[0]}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <Input
          name="location"
          placeholder="City, Area"
          value={formData.location}
          onChange={handleChange}
          className={`text-sm md:text-base h-8 md:h-10 focus:ring-green-500 focus:border-green-500 placeholder:text-sm ${errors.location ? 'border-red-500' : ''}`}
        />
        {errors.location ? (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.location[0]}
          </p>
        ) : (
          <p className="mt-1 text-xs text-gray-500">Where is the product located?</p>
        )}
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
        <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-600" />
          Listing Tips
        </h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li><strong>Title:</strong> Be specific and include brand names when relevant</li>
          <li><strong>Description:</strong> Mention condition, dimensions, features, and usage instructions</li>
          <li><strong>Category:</strong> Choose the most relevant category for better visibility</li>
          <li><strong>Location:</strong> Provide neighborhood details to help renters plan pickup</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onNext}
        >
          Continue to Images <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default BasicDetailsStep;