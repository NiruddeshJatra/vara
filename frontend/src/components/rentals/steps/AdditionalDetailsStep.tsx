// components/rentals/steps/AdditionalDetailsStep.tsx
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DatePicker from 'react-datepicker';
import { ChevronLeft, ChevronRight, AlertCircle, Info, MapPin, Clock } from 'lucide-react';
import { RentalRequestFormData, FormErrors } from '@/types/listings';

interface Props {
  formData: RentalRequestFormData;
  errors: FormErrors;
  onChange: (data: Partial<RentalRequestFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AdditionalDetailsStep = ({ formData, errors, onChange, onNext, onPrev }: Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-800">Additional Details</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.purpose}
            onValueChange={(value) => onChange({ purpose: value })}
          >
            <SelectTrigger className={`h-10 ${errors.purpose ? 'border-red-500' : ''}`}>
              {formData.purpose || 'Select purpose'}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal Use</SelectItem>
              <SelectItem value="professional">Professional Project</SelectItem>
              <SelectItem value="event">Event/Temporary Use</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.purpose && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.purpose}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Instructions <span className="text-gray-500">(optional)</span>
          </label>
          <Textarea
            value={formData.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Any special requirements or notes for the owner..."
            className="h-24 resize-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Pickup Method <span className="text-red-500">*</span>
          </label>
          <RadioGroup 
            value={formData.pickupMethod} 
            onValueChange={(value) => onChange({ pickupMethod: value as 'self' | 'delivery' })}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="self" id="self" />
              <label htmlFor="self" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Self Pickup
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delivery" id="delivery" />
              <label htmlFor="delivery" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Delivery
              </label>
            </div>
          </RadioGroup>
        </div>

        {formData.pickupMethod === 'delivery' && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  value={formData.deliveryAddress}
                  onChange={(e) => onChange({ deliveryAddress: e.target.value })}
                  className={`pl-9 ${errors.deliveryAddress ? 'border-red-500' : ''}`}
                  placeholder="Enter your delivery address"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.deliveryAddress && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.deliveryAddress}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Delivery Time <span className="text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={formData.deliveryTime}
                  onChange={(date: Date) => onChange({ deliveryTime: date })}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full p-2 pl-9 border rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholderText="Select date and time"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
        <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Info size={16} className="text-amber-600" />
          Additional Information Tips
        </h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>Be clear about your intended use to help the owner prepare the item</li>
          <li>Include any special requirements or questions in the notes</li>
          <li>For delivery, provide accurate address and preferred timing</li>
          <li>Self-pickup may be faster and more flexible</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onPrev}
          className="border-green-200 text-green-700 hover:bg-green-50"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Price Review
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onNext}
        >
          Submit Request <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default AdditionalDetailsStep;