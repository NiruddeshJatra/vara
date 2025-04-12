import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CalendarDays, Info } from 'lucide-react';
import { ListingFormData, FormError, UnavailableDate } from '@/types/listings';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import AvailabilityCalendar from '@/components/listings/UnavailabilityCalendar';
import { DateRange } from 'react-day-picker';

type Props = {
  formData: ListingFormData;
  errors: FormError;
  onChange: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const UnavailabilityStep = ({ formData, errors, onChange, onNext, onBack }: Props) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Convert UnavailableDate[] to Date[] for the calendar component
  const unavailableDatesAsDates = formData.unavailableDates
    .filter(date => date.date !== null)
    .map(date => new Date(date.date!));

  const handleSingleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    const newUnavailableDate: UnavailableDate = {
      id: '', // Will be set by the backend
      date: selectedDate.toISOString(),
      isRange: false,
      rangeStart: null,
      rangeEnd: null
    };
    
    onChange({
      unavailableDates: [...formData.unavailableDates, newUnavailableDate],
    });
    
    setDate(undefined);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range || !range.from || !range.to) return;
    
    const newDates: UnavailableDate[] = [];
    const currentDate = new Date(range.from);
    
    while (currentDate <= range.to) {
      newDates.push({
        id: '', // Will be set by the backend
        date: currentDate.toISOString(),
        isRange: true,
        rangeStart: range.from.toISOString(),
        rangeEnd: range.to.toISOString()
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (newDates.length > 0) {
      onChange({
        unavailableDates: [...formData.unavailableDates, ...newDates],
      });
    }
    
    setDateRange(undefined);
  };

  const handleRemoveRange = (startDate: Date, endDate: Date) => {
    const newUnavailableDates = formData.unavailableDates.filter(date => {
      if (!date.date) return true;
      const dateTime = new Date(date.date).getTime();
      return dateTime < startDate.getTime() || dateTime > endDate.getTime();
    });
    
    onChange({
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
                  onSelect={(range: DateRange | undefined) => {
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
                  onSelect={(newDate: Date | undefined) => {
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
        
        {/* Display validation errors from props */}
        {errors.unavailableDates && (
          <div className="text-red-500 flex items-center mt-2">
            <AlertCircle size={16} className="mr-1" /> {errors.unavailableDates[0]}
          </div>
        )}
      </div>

      {/* Display selected unavailable dates in a calendar view */}
      {unavailableDatesAsDates.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-white shadow-sm">
          <AvailabilityCalendar 
            unavailableDates={unavailableDatesAsDates} 
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