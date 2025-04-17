import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CalendarDays, Info } from "lucide-react";
import { ListingFormData, FormError, UnavailableDate } from "@/types/listings";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import AvailabilityCalendar from "@/components/listings/UnavailabilityCalendar";
import { DateRange } from "react-day-picker";
import "./calendar-popover.responsive.css";

type Props = {
  formData: ListingFormData;
  errors: FormError;
  onChange: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const UnavailabilityStep = ({
  formData,
  errors,
  onChange,
  onNext,
  onBack,
}: Props) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Convert UnavailableDate[] to Date[] for the calendar component
  const unavailableDatesAsDates = formData.unavailableDates
    .filter((date) => date.date !== null)
    .map((date) => new Date(date.date!));

  const handleSingleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const newUnavailableDate: UnavailableDate = {
      id: "", // Will be set by the backend
      date: selectedDate.toISOString(),
      isRange: false,
      rangeStart: null,
      rangeEnd: null,
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
        id: "", // Will be set by the backend
        date: currentDate.toISOString(),
        isRange: true,
        rangeStart: range.from.toISOString(),
        rangeEnd: range.to.toISOString(),
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
    const newUnavailableDates = formData.unavailableDates.filter((date) => {
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
      <h2 className="text-2xl font-semibold mb-4 text-green-800">
        Set Unavailable Dates
      </h2>

      <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
        <h4 className="font-medium mb-3 text-green-700 flex items-center gap-2">
          <CalendarDays size={18} className="text-green-600 mr-1" />
          Select Unavailable Dates
        </h4>

        <p className="text-xs/5 md:text-sm/6 text-gray-600 mb-4">
          Select dates when the item will not be available for rent (e.g., when
          you need it for personal use).
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
                  className="rounded-md border border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white absolute top-full left-0 mt-2 z-10"
                  classNames={{
                    day_selected:
                      "bg-red-600 text-white hover:bg-red-700 hover:text-white focus:bg-red-700 focus:text-white rounded-md",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    day_range_end: "bg-red-600 text-white",
                    day_range_middle: "bg-red-600 text-white",
                  }}
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
                  className="rounded-md border border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white absolute top-full left-0 mt-2 z-10"
                  classNames={{
                    day_selected:
                      "bg-red-600 text-white hover:bg-red-700 hover:text-white focus:bg-red-700 focus:text-white rounded-md",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    day_range_end: "bg-red-600 text-white",
                    day_range_middle: "bg-red-600 text-white",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Display validation errors from props */}
        {errors.unavailableDates && (
          <div className="text-red-500 flex items-center mt-2">
            <AlertCircle size={16} className="mr-1" />{" "}
            {errors.unavailableDates[0]}
          </div>
        )}
      </div>

      {/* Display selected unavailable dates in a calendar view */}
      {unavailableDatesAsDates.length > 0 && (
        <div className="p-0 mt-4">
          <AvailabilityCalendar
            unavailableDates={unavailableDatesAsDates}
            onRemoveRange={handleRemoveRange}
          />
        </div>
      )}

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 sm:p-4 rounded-lg border border-amber-200 mt-3 sm:mt-4">
        <h3 className="text-xs sm:text-sm font-medium text-amber-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
          <Info size={14} className="text-amber-600 sm:w-4 sm:h-4" />
          Availability Tips
        </h3>
        <ul className="text-xs/5 sm:text-sm/6 text-amber-700 space-y-0.5 sm:space-y-1 list-disc pl-4 sm:pl-5">
          <li>
            Consider blocking out dates when you need the item for personal use.
          </li>
          <li>Keep your calendar updated to avoid double bookings.</li>
          <li>
            Unavailable dates help renters plan better and reduce cancellations.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UnavailabilityStep;
