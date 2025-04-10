// components/rentals/steps/AdditionalDetailsStep.tsx
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  useEffect(() => {
    console.log('AdditionalDetailsStep - Form data:', formData);
  }, [formData]);
  
  return (
    <div className="space-y-6 md:space-y-8 px-2">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">Additional Information</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose of Rental <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={formData.purpose || ''}
            onChange={(e) => onChange({ purpose: e.target.value })}
            className="min-h-[80px]"
            placeholder="Please describe how you plan to use this item..."
          />
          {errors.purpose ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.purpose}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Sharing your purpose helps owners understand your rental needs
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <Textarea
            value={formData.notes || ''}
            onChange={(e) => onChange({ notes: e.target.value })}
            className="min-h-[80px]"
            placeholder="Any special requests or questions for the owner..."
          />
          <p className="text-xs text-gray-500">
            Optional: Include any questions or special requirements
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Method
            </label>
            <RadioGroup
              value={formData.pickupMethod || 'self'}
              onValueChange={(value) => onChange({ pickupMethod: value as 'self' | 'delivery' })}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self" id="self" />
                <Label htmlFor="self" className="cursor-pointer">
                  I'll pick it up myself
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="cursor-pointer">
                  Request delivery (may be subject to additional fees)
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {formData.pickupMethod === 'delivery' && (
            <div className="space-y-4 bg-green-50/50 p-4 rounded-lg border border-green-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.deliveryAddress || ''}
                  onChange={(e) => onChange({ deliveryAddress: e.target.value })}
                  className="min-h-[60px]"
                  placeholder="Enter your full delivery address..."
                />
                {errors.deliveryAddress ? (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.deliveryAddress}
                  </p>
                ) : null}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Delivery Time
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.deliveryTime}
                    onChange={(date: Date | null) => onChange({ deliveryTime: date })}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full p-2 border rounded-md text-sm md:text-base h-8 md:h-10 focus:ring-green-500 focus:border-green-500"
                    placeholderText="Select preferred date and time"
                    minDate={formData.startDate || new Date()}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500">
                  Optional: Choose a preferred delivery time (subject to owner's availability)
                </p>
              </div>
            </div>
          )}
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