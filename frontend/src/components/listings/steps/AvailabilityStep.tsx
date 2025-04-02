// components/listings/AvailabilityStep.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus, CalendarDays, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ListingFormData } from '@/types/listings';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';
import AvailabilityCalendar from '@/components/listings/AvailabilityCalendar';

type Props = {
  unavailableDates: Date[];
  onChange: (dates: Date[]) => void;
  onSubmit: () => void;
};

const AvailabilityStep = ({ unavailableDates, onChange, onSubmit }: Props) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [error, setError] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const addUnavailableDate = (selectedDate: Date) => {
    // Check if date already exists
    const dateExists = unavailableDates.some(
      date => date.getTime() === selectedDate.getTime()
    );
    
    if (!dateExists) {
      onChange([...unavailableDates, selectedDate]);
    }
    setDate(undefined);
  };

  const addUnavailableDateRange = (range: DateRange | undefined) => {
    if (!range || !range.from) return;
    
    const newDates: Date[] = [];
    let currentDate = new Date(range.from);
    
    // If there's an end date, add all dates in the range
    if (range.to) {
      while (currentDate <= range.to) {
        // Check if date already exists
        const dateExists = unavailableDates.some(
          date => date.getTime() === currentDate.getTime()
        );
        
        if (!dateExists) {
          newDates.push(new Date(currentDate));
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // If no end date, just add the start date
      const dateExists = unavailableDates.some(
        date => date.getTime() === currentDate.getTime()
      );
      
      if (!dateExists) {
        newDates.push(new Date(currentDate));
      }
    }
    
    if (newDates.length > 0) {
      onChange([...unavailableDates, ...newDates]);
    }
    
    setDateRange(undefined);
  };

  const removeUnavailableDate = (dateToRemove: Date) => {
    const updatedDates = unavailableDates.filter(
      date => date.getTime() !== dateToRemove.getTime()
    );
    onChange(updatedDates);
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(currentYear, currentMonth, i - 21);
    return date.getDate();
  });

  const isDateUnavailable = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return unavailableDates.some(d => d.getTime() === date.getTime());
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
                      addUnavailableDateRange(range);
                    }
                  }}
                  numberOfMonths={2}
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
                      addUnavailableDate(newDate);
                    }
                  }}
                  initialFocus
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
      {unavailableDates.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-white shadow-sm">
          <AvailabilityCalendar unavailableDates={unavailableDates} />
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

export default AvailabilityStep;