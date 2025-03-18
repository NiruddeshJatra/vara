
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type DateRangePickerProps = {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: (value: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
};

const DateRangePicker = ({ dateRange, setDateRange }: DateRangePickerProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-from"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? format(dateRange.from, "PPP") : "Start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateRange.from}
            onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-to"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange.to && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.to ? format(dateRange.to, "PPP") : "End date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateRange.to}
            onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
            disabled={(date) => date < (dateRange.from || new Date())}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
