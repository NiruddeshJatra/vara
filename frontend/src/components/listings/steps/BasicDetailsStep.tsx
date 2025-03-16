import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { ListingFormData, FormErrors } from '@/types/listings';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

type Props = {
  formData: ListingFormData;
  errors: FormErrors;
  categories: readonly string[];
  onChange: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
};

const BasicDetailsStep = ({ formData, errors, categories, onChange, onNext }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : undefined;
    onChange({ 
      [name]: type === 'checkbox' ? checked : value 
    });
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
          className={`text-sm md:text-base h-8 md:h-10 focus:ring-green-500 focus:border-green-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.title ? (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.title}
          </p>
        ) : (
          <p className="text-xs text-gray-500">Enter a descriptive title for your listing</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => onChange({ category: value })}
        >
          <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
            {formData.category || "Select Category"}
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
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
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md h-24 md:h-32 transition-colors ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-1 focus:ring-green-500 focus:border-green-500`}
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
          className={`text-sm md:text-base h-8 md:h-10 focus:ring-green-500 focus:border-green-500 ${errors.location ? 'border-red-500' : ''}`}
        />
        {errors.location ? (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.location}
          </p>
        ) : (
          <p className="mt-1 text-xs text-gray-500">Where is the item located?</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="available"
          checked={formData.available}
          onCheckedChange={(checked) => 
            onChange({ available: !!checked })
          }
          className="peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus:ring-green-500 focus:border-green-500 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
        />
        <label
          htmlFor="available"
          className="text-sm font-medium text-gray-700"
        >
          Available for rent
        </label>
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