import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CalendarDays, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import AvailabilityCalendar from '@/components/listings/UnavailabilityCalendar';
import { DateRange } from 'react-day-picker';

interface ListingFormData {
  unavailableDates: Date[];
  [key: string]: any;
}

interface StepProps {
  formData: ListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<ListingFormData>>;
  onNext: () => void;
  onBack: () => void;
}

const UnavailabilityStep = ({ formData, setFormData, onNext, onBack }: StepProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSingleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    if (selectedDate < new Date()) {
      setError("You can't select a date in the past.");
      return;
    }
    
    // Check if date already exists
    const dateExists = formData.unavailableDates.some(
      date => date.getTime() === selectedDate.getTime()
    );
    
    if (!dateExists) {
      setFormData({
        ...formData,
        unavailableDates: [...formData.unavailableDates, selectedDate],
      });
    }
    
    setDate(undefined);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range || !range.from) return;
    
    const newDates: Date[] = [];
    const currentDate = new Date(range.from);
    
    if (range.to) {
      while (currentDate <= range.to) {
        if (currentDate < new Date()) {
          setError("You can't select a date in the past.");
          return;
        }
        
        // Check if date already exists
        const dateExists = formData.unavailableDates.some(
          date => date.getTime() === currentDate.getTime()
        );
        
        if (!dateExists) {
          newDates.push(new Date(currentDate));
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      if (range.from < new Date()) {
        setError("You can't select a date in the past.");
        return;
      }
      
      // Check if date already exists
      const dateExists = formData.unavailableDates.some(
        date => date.getTime() === range.from.getTime()
      );
      
      if (!dateExists) {
        newDates.push(new Date(range.from));
      }
    }
    
    if (newDates.length > 0) {
      setFormData({
        ...formData,
        unavailableDates: [...formData.unavailableDates, ...newDates],
      });
    }
    
    setDateRange(undefined);
  };

  const handleRemoveRange = (startDate: Date, endDate: Date) => {
    // Create a new array without the dates in the range
    const newUnavailableDates = formData.unavailableDates.filter(date => {
      const dateTime = date.getTime();
      return dateTime < startDate.getTime() || dateTime > endDate.getTime();
    });
    
    setFormData({
      ...formData,
      unavailableDates: newUnavailableDates,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-green-800">Set Unavailable Dates</h2>
      
      <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
        <h4 className="font-medium mb-3 text-green-700 flex items-center gap-2">
          <CalendarDays size={18} className="text-green-600 mr-1" />
          Select Unavailable Dates
        </h4>
        
        <p className="text-sm text-gray-500 mb-4">
          Select dates when the item will not be available for rent (e.g., when you need it for personal use).
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    if (range?.from && range?.to) {
                      handleDateRangeSelect(range);
                    }
                  }}
                  numberOfMonths={2}
                  className="[&_.rdp-day_selected]:bg-red-500 [&_.rdp-day_selected]:text-white [&_.rdp-day_in_range]:bg-red-100 [&_.rdp-day_range_start]:bg-red-500 [&_.rdp-day_range_end]:bg-red-500 [&_.rdp-day_range_middle]:bg-red-100"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a single date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    if (newDate) {
                      handleSingleDateSelect(newDate);
                    }
                  }}
                  initialFocus
                  className="[&_.rdp-day_selected]:bg-red-500 [&_.rdp-day_selected]:text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 flex items-center mt-2">
            <AlertCircle size={16} className="mr-1" /> {error}
          </div>
        )}
      </div>

      {/* Display selected unavailable dates in a calendar view */}
      {formData.unavailableDates.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-white shadow-sm">
          <AvailabilityCalendar 
            unavailableDates={formData.unavailableDates} 
            onRemoveRange={handleRemoveRange}
          />
        </div>
      )}

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
        <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Info size={16} className="text-amber-600" />
          Availability Tips
        </h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>Select dates when you need the item for personal use</li>
          <li>You can select <strong>individual dates</strong> or <strong>date ranges</strong> by dragging</li>
          <li>All other dates will be available for rent</li>
          <li>You can update unavailable dates anytime from your dashboard</li>
        </ul>
      </div>
    </div>
  );
};

export default UnavailabilityStep; 