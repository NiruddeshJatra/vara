import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertCircle, ChevronRight, Lightbulb } from 'lucide-react';
import { ListingFormData, FormErrors } from '@/types/listings';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Category, ProductType, CATEGORY_GROUPS, CATEGORY_CHOICES } from '@/constants/productTypes';

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
      setAvailableProductTypes(CATEGORY_GROUPS[formData.category]);
      
      // Reset product type if it's not in the new category
      if (formData.productType && !CATEGORY_GROUPS[formData.category].includes(formData.productType)) {
        onChange({ productType: '' as ProductType });
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
    <div className="space-y-4 md:space-y-6 px-2">
      <div className="grid gap-2">
        <label className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => onChange({ category: value as Category })}
          >
            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
              {formData.category || "Select Category"}
            </SelectTrigger>
            <SelectContent>
              {Object.keys(CATEGORY_GROUPS).map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
              {formData.productType ? CATEGORY_CHOICES[formData.productType] : "Select Product Type"}
            </SelectTrigger>
            <SelectContent>
              {availableProductTypes.map(type => (
                <SelectItem key={type} value={type}>{CATEGORY_CHOICES[type]}</SelectItem>
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
          onChange={handleChange}
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
          placeholder="City, Area"
          value={formData.location}
          onChange={handleChange}
          className={`text-sm md:text-base h-8 md:h-10 focus:ring-green-500 focus:border-green-500 placeholder:text-sm ${errors.location ? 'border-red-500' : ''}`}
        />
        {errors.location ? (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.location}
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