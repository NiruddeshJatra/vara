import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { RentalStatus } from "@/constants/rental";
import { format } from "date-fns";

interface RentalsStatusFilterProps {
  statusFilter: RentalStatus | "all";
  onStatusFilterChange: (status: RentalStatus | "all") => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  sortOption: string;
  onSortOptionChange: (option: string) => void;
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
}

const RentalsStatusFilter = ({
  statusFilter,
  onStatusFilterChange,
  searchTerm,
  onSearchTermChange,
  sortOption,
  onSortOptionChange,
  dateRange,
  onDateRangeChange
}: RentalsStatusFilterProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const statusOptions: { value: RentalStatus | "all"; label: string; color: string; borderColor: string }[] = [
    { value: 'all', label: 'All', color: 'bg-gray-600', borderColor: 'border-gray-300' },
    { value: RentalStatus.PENDING, label: 'Pending', color: 'bg-yellow-600', borderColor: 'border-gray-300' },
    { value: RentalStatus.APPROVED, label: 'Approved', color: 'bg-green-600', borderColor: 'border-gray-300' },
    { value: RentalStatus.REJECTED, label: 'Rejected', color: 'bg-red-600/90', borderColor: 'border-gray-300' },
    { value: RentalStatus.CANCELLED, label: 'Cancelled', color: 'bg-orange-600', borderColor: 'border-gray-300' },
    { value: RentalStatus.COMPLETED, label: 'Completed', color: 'bg-lime-600', borderColor: 'border-gray-300' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priceHighToLow', label: 'Price: High to Low' },
    { value: 'priceLowToHigh', label: 'Price: Low to High' }
  ];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-5 sm:mb-8 px-1 sm:px-0">
      {/* Status pills */}
      <div className="flex flex-wrap items-center gap-2 mr-4 w-full sm:w-auto">
        {statusOptions.map((status) => (
          <Badge
            key={status.value}
            variant={statusFilter === status.value ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 text-xs sm:text-sm border ${
              statusFilter === status.value 
                ? status.color
                : status.borderColor
            }`}
            onClick={() => onStatusFilterChange(status.value)}
          >
            {statusFilter === status.value && (
              <span className="w-2 h-2 rounded-full bg-white/30 mr-2"></span>
            )}
            {status.label}
          </Badge>
        ))}
      </div>
      
      {/* Search and filters row */}
      <div className="flex items-center flex-1 gap-3 w-full sm:w-auto">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[120px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-green-600/60" />
          <Input
            placeholder="Search by item title or rental ID"
            className="pl-9 h-10 text-xs sm:text-sm border-green-400 focus:border-green-500 focus:ring-green-300"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
        
        {/* Date filter */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-10 text-xs sm:text-sm border-green-400"
            >
              <CalendarIcon className="h-4 w-4 text-green-600" />
              {dateRange.from ? (
                dateRange.to ? (
                  <span className="hidden sm:inline">
                    {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                  </span>
                ) : (
                  <span className="hidden sm:inline">{format(dateRange.from, "MMM d")}</span>
                )
              ) : (
                <span className="hidden sm:inline">Date range</span>
              )}
              <span className="sm:hidden">Date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                onDateRangeChange(range || {});
                if (range?.to) {
                  setIsCalendarOpen(false);
                }
              }}
              initialFocus
            />
            <div className="p-3 border-t border-green-200 flex justify-between">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  onDateRangeChange({});
                  setIsCalendarOpen(false);
                }}
              >
                Clear
              </Button>
              <Button 
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsCalendarOpen(false)}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Sort dropdown */}
        <Select value={sortOption} onValueChange={onSortOptionChange}>
          <SelectTrigger className="w-[180px] sm:w-36 text-xs sm:text-sm border-green-400">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RentalsStatusFilter;
