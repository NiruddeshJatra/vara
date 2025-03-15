
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Calendar as CalendarIcon, SlidersHorizontal } from "lucide-react";
import { RentalStatus } from "@/pages/Rentals";
import { format } from "date-fns";

interface RentalsStatusFilterProps {
  statusFilter: RentalStatus;
  onStatusFilterChange: (status: RentalStatus) => void;
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

  const statusOptions: { value: RentalStatus; label: string; color: string }[] = [
    { value: 'all', label: 'All', color: 'bg-gray-500' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { value: 'accepted', label: 'Accepted', color: 'bg-blue-500' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-green-500' },
    { value: 'completed', label: 'Completed', color: 'bg-purple-500' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-orange-500' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priceHighToLow', label: 'Price: High to Low' },
    { value: 'priceLowToHigh', label: 'Price: Low to High' }
  ];

  return (
    <div className="mb-8 space-y-4">
      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <Badge
            key={status.value}
            variant={statusFilter === status.value ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 text-sm ${
              statusFilter === status.value ? status.color : ''
            }`}
            onClick={() => onStatusFilterChange(status.value)}
          >
            {status.label}
          </Badge>
        ))}
      </div>
      
      {/* Search and filters row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-green-600/60" />
          <Input
            placeholder="Search by item title or rental ID"
            className="pl-9 h-10 border-green-200 focus:border-green-300 focus:ring-green-200"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
        
        {/* Date filter */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-10 border-green-200"
            >
              <CalendarIcon className="h-4 w-4 text-green-600" />
              {dateRange.from ? (
                dateRange.to ? (
                  <span>
                    {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                  </span>
                ) : (
                  format(dateRange.from, "MMM d, yyyy")
                )
              ) : (
                <span>Select date range</span>
              )}
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
            <div className="p-3 border-t border-border flex justify-between">
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
                onClick={() => setIsCalendarOpen(false)}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Sort dropdown */}
        <Select value={sortOption} onValueChange={onSortOptionChange}>
          <SelectTrigger className="w-[200px] h-10 border-green-200">
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
