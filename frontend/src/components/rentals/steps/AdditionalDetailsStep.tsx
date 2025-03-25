// components/rentals/steps/AdditionalDetailsStep.tsx
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import DatePicker from 'react-datepicker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Purpose *</label>
          <Select
            value={formData.purpose}
            onValueChange={(value) => onChange({ purpose: value })}
          >
            <SelectTrigger className={errors.purpose ? 'border-red-500' : ''}>
              {formData.purpose || 'Select purpose'}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal Use</SelectItem>
              <SelectItem value="professional">Professional Project</SelectItem>
              <SelectItem value="event">Event/Temporary Use</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Special Instructions</label>
          <Textarea
            value={formData.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Additional requirements..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Pickup Method *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.pickupMethod === 'self'}
                onChange={() => onChange({ pickupMethod: 'self' })}
              />
              Self Pickup
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.pickupMethod === 'delivery'}
                onChange={() => onChange({ pickupMethod: 'delivery' })}
              />
              Delivery
            </label>
          </div>
        </div>

        {formData.pickupMethod === 'delivery' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Address *</label>
              <Input
                value={formData.deliveryAddress}
                onChange={(e) => onChange({ deliveryAddress: e.target.value })}
                className={errors.deliveryAddress ? 'border-red-500' : ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Delivery Time</label>
              <DatePicker
                selected={formData.deliveryTime}
                onChange={(date: Date) => onChange({ deliveryTime: date })}
                showTimeSelect
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft size={16} /> Back
        </Button>
        <Button className="bg-green-600 hover:bg-green-700" onClick={onNext}>
          Submit Request <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default AdditionalDetailsStep;