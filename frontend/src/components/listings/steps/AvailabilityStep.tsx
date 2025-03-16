// components/listings/AvailabilityStep.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus, ChevronLeft } from 'lucide-react';
import { ListingFormData } from '@/types/listings';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  periods: ListingFormData['availabilityPeriods'];
  onChange: (periods: ListingFormData['availabilityPeriods']) => void;
  onSubmit: () => void;
};

const AvailabilityStep = ({ periods, onChange, onSubmit }: Props) => {
  const [newPeriod, setNewPeriod] = useState({
    startDate: new Date(),
    endDate: new Date(),
    available: true,
    notes: ''
  });

  const addPeriod = () => {
    if (newPeriod.startDate > newPeriod.endDate) return;
    
    onChange([...periods, {
      ...newPeriod,
      startDate: newPeriod.startDate.toISOString().split('T')[0],
      endDate: newPeriod.endDate.toISOString().split('T')[0]
    }]);
    setNewPeriod({
      startDate: new Date(),
      endDate: new Date(),
      available: true,
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="border p-4 rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date *</label>
            <DatePicker
              selected={newPeriod.startDate}
              onChange={(date: Date) => 
                setNewPeriod(prev => ({ 
                  ...prev, 
                  startDate: date 
                }))
              }
              minDate={new Date()}
              className="w-full p-2 border rounded-md"
              selectsStart
              startDate={newPeriod.startDate}
              endDate={newPeriod.endDate}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date *</label>
            <DatePicker
              selected={newPeriod.endDate}
              onChange={(date: Date) => 
                setNewPeriod(prev => ({
                  ...prev,
                  endDate: date
                }))
              }
              minDate={newPeriod.startDate}
              className="w-full p-2 border rounded-md"
              selectsEnd
              startDate={newPeriod.startDate}
              endDate={newPeriod.endDate}
              disabled={!newPeriod.startDate}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            className="bg-gray-500 hover:bg-lime-600 mt-3"
            onClick={addPeriod}
          >
            <Plus size={16} className="mr-1" /> Add Period
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Button variant="outline" className="w-full md:w-auto" onClick={() => onSubmit()}>
          <ChevronLeft size={16} className="mr-1" /> Previous
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 w-full md:w-auto" onClick={onSubmit}>
          Submit Listing
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityStep;