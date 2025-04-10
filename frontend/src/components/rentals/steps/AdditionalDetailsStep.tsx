// components/rentals/steps/AdditionalDetailsStep.tsx
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, AlertCircle, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { FormErrors, RentalRequestFormData } from '@/types/listings';
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';

interface Props {
  formData: RentalRequestFormData;
  errors: FormErrors;
  onChange: (data: Partial<RentalRequestFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AdditionalDetailsStep = ({ formData, errors, onChange, onNext, onPrev }: Props) => {
  const PURPOSE_OPTIONS = [
    { value: 'event', label: 'Event/Party' },
    { value: 'personal', label: 'Personal Use' },
    { value: 'professional', label: 'Professional Use' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    console.log('AdditionalDetailsStep - Form data:', formData);
  }, [formData]);

  // Add a handler to clear errors when input changes
  const handleInputChange = (data: Partial<RentalRequestFormData>) => {
    onChange(data);
  };

  return (
    <div className="space-y-6 md:space-y-8 px-2">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">Additional Information</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose of Rental <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.purpose || ''}
            onValueChange={(value) => handleInputChange({ purpose: value })}
          >
            <SelectTrigger className={errors.purpose ? 'border-red-500' : ''}>
              {formData.purpose ? PURPOSE_OPTIONS.find(option => option.value === formData.purpose)?.label : "Select purpose"}
            </SelectTrigger>
            <SelectContent>
              {PURPOSE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.purpose ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.purpose}
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              Select the primary purpose of your rental
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <Textarea
            value={formData.notes || ''}
            onChange={(e) => handleInputChange({ notes: e.target.value })}
            className="min-h-[80px]"
            placeholder="Any special requirements or preferences for the rental..."
          />
          <p className="text-xs text-gray-500">
            Optional: Include any specific requirements or preferences for your rental
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
          <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <Info size={16} className="text-amber-600" />
            Logistics Information
          </h3>
          <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
            <li>Vara will collect the item from the owner</li>
            <li>Vara will deliver the item to you</li>
            <li>Vara will collect the item at the end of the rental period</li>
            <li>You do not need to coordinate directly with the owner</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          className="border-green-300 hover:bg-green-50"
          onClick={onPrev}
        >
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>
        
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onNext}
        >
          Review & Confirm <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default AdditionalDetailsStep;