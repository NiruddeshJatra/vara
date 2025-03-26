// components/listings/AvailabilityStep.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus, CalendarDays, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ListingFormData, AvailabilityPeriod } from '@/types/listings';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AvailabilityCalendar from '../AvailabilityCalendar';

type Props = {
  periods: ListingFormData['availabilityPeriods'];
  onChange: (periods: ListingFormData['availabilityPeriods']) => void;
  onSubmit: () => void;
};

const AvailabilityStep = ({ periods, onChange, onSubmit }: Props) => {
  const [newPeriod, setNewPeriod] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    available: true,
    notes: ''
  });
  const [availableAnytime, setAvailableAnytime] = useState(false);
  const [error, setError] = useState('');

  const addPeriod = () => {
    if (newPeriod.startDate > newPeriod.endDate) {
      setError('Start date cannot be after end date');
      return;
    }
    
    const formattedPeriod = {
      ...newPeriod,
      startDate: newPeriod.startDate.toISOString().split('T')[0],
      endDate: newPeriod.endDate.toISOString().split('T')[0]
    };
    
    onChange([...periods, formattedPeriod]);
    
    // Reset form and error
    setNewPeriod({
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      available: true,
      notes: ''
    });
    setError('');
  };

  const toggleAvailableAnytime = (checked: boolean) => {
    setAvailableAnytime(checked);
    
    if (checked) {
      // If available anytime, set a far future date (1 year from now)
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      onChange([{
        startDate: new Date().toISOString().split('T')[0],
        endDate: oneYearFromNow.toISOString().split('T')[0],
        available: true,
        notes: 'Available anytime'
      }]);
    } else {
      // Clear periods when toggling off
      onChange([]);
    }
  };

  const removePeriod = (index: number) => {
    const updatedPeriods = [...periods];
    updatedPeriods.splice(index, 1);
    onChange(updatedPeriods);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-green-800">Set Availability</h2>
      
      <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg mb-6 border border-green-100">
        <Checkbox 
          id="available-anytime"
          checked={availableAnytime}
          onCheckedChange={toggleAvailableAnytime}
          className="h-4 w-4 border-2 border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white rounded"
        />
        <label 
          htmlFor="available-anytime" 
          className="text-sm font-medium text-green-800 cursor-pointer select-none"
        >
          Available Anytime
        </label>
      </div>

      {!availableAnytime && (
        <>
          <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
            <h4 className="font-medium mb-3 text-green-700 flex items-center gap-2">
              <CalendarDays size={18} className="text-green-600 mr-1" />
              Add Availability Period
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Start Date <span className="text-green-600">*</span></label>
                <DatePicker
                  selected={newPeriod.startDate}
                  onChange={(date: Date) => 
                    setNewPeriod(prev => ({ 
                      ...prev, 
                      startDate: date 
                    }))
                  }
                  minDate={new Date()}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  selectsStart
                  startDate={newPeriod.startDate}
                  endDate={newPeriod.endDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">End Date <span className="text-green-600">*</span></label>
                <DatePicker
                  selected={newPeriod.endDate}
                  onChange={(date: Date) => 
                    setNewPeriod(prev => ({
                      ...prev,
                      endDate: date
                    }))
                  }
                  minDate={newPeriod.startDate}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  selectsEnd
                  startDate={newPeriod.startDate}
                  endDate={newPeriod.endDate}
                />
              </div>
            </div>
            
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Notes <span className="text-gray-500">(optional)</span></label>
              <input
                type="text"
                value={newPeriod.notes}
                onChange={(e) => setNewPeriod(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Add notes about this availability period"
              />
            </div>
            
            {error && (
              <div className="text-red-500 flex items-center mt-2">
                <AlertCircle size={16} className="mr-1" /> {error}
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <Button
                type="button"
                className="bg-green-50 hover:bg-green-100 mt-3 text-green-700 border border-green-400"
                onClick={addPeriod}
              >
                <Plus size={16} className="mr-1" /> Add Period
              </Button>
            </div>
          </div>

          {/* Display added periods */}
          {periods.length > 0 && (
            <div className="mt-6">
              <AvailabilityCalendar availabilityPeriods={periods} />
            </div>
          )}

          {/* List of periods */}
          {periods.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-white shadow-sm">
              <h4 className="font-medium mb-3 text-green-700">Added Availability Periods</h4>
              <div className="space-y-2">
                {periods.map((period, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium text-green-800">
                        {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                      </span>
                      {period.notes && <p className="text-sm text-green-600">{period.notes}</p>}
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removePeriod(index)}
                      className="bg-red-50 text-red-500 hover:bg-red-100 border border-red-200"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
        <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Info size={16} className="text-amber-600" />
          Availability Tips
        </h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>Use <strong>Available Anytime</strong> if your item is generally available for the next year</li>
          <li>Add <strong>specific periods</strong> if your item is only available during certain timeframes</li>
          <li>You can add <strong>multiple periods</strong> for different date ranges</li>
          <li>Add notes to clarify any special conditions or restrictions</li>
        </ul>
      </div>
    </div>
  );
};

export default AvailabilityStep;