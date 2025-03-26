import { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, X, Banknote, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CompactSearchBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  location: string;
  setLocation: (location: string) => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inNav: boolean;
};

const CompactSearchBar = ({
  searchTerm,
  setSearchTerm,
  location,
  setLocation,
  filtersOpen,
  setFiltersOpen,
  priceRange,
  setPriceRange,
  inNav
}: CompactSearchBarProps) => {
  const [availability, setAvailability] = useState('any');
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(priceRange);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality is handled in the parent component
  };

  const applyFilters = () => {
    setPriceRange(tempPriceRange);
    // Here you would apply other filters
  };

  const clearFilters = () => {
    setTempPriceRange([0, 5000]);
    setAvailability('any');
    setPriceRange([0, 5000]);
  };

  return (
    <div className={`${inNav ? 'w-full flex justify-center' : 'top-[64px] mt-[64px] pt-3 sm:pt-6 pb-2 zoom-out-0 backdrop-blur-sm'}`}>
      <div className={`${inNav ? 'w-full max-w-md' : 'container mx-auto px-4'}`}>
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center justify-between">
          <div className={`w-full ${inNav ? '' : 'max-w-2xl mx-auto rounded-2xl bg-transparent py-[8px]'}`}>
            <div className={`flex ${inNav ? 'gap-2' : 'flex-col sm:flex-row gap-2 sm:gap-3'}`}>
              <div className="relative flex-1">
                <Search className={`absolute left-3 ${inNav ? 'top-2.5 h-5 w-4' : 'top-3 h-5 w-4 sm:h-6 sm:w-4'} text-green-500`} />
                <Input 
                  type="text" 
                  placeholder="What do you need to borrow today?" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className={`text-xs pl-9 ${inNav ? 'h-10' : 'h-11 sm:h-12'} border-green-400 focus:border-green-500`} 
                />
              </div>
              <div className="relative flex-1">
                <MapPin className={`absolute left-3 ${inNav ? 'top-2.5 h-5 w-4' : 'top-3 h-5 w-4 sm:h-6 sm:w-4'} text-green-500`} />
                <Input 
                  type="text" 
                  placeholder="Select your location" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  className={`text-xs pl-9 ${inNav ? 'h-10' : 'h-11 sm:h-12'} border-green-400 focus:border-green-500`} 
                />
              </div>
              <Button 
                type="submit" 
                className={` bg-green-700 hover:bg-green-800 text-xs sm:text-sm font-medium ${inNav ? 'h-10 w-10 rounded-full p-0' : 'px-4 sm:px-8 h-11 sm:h-12 rounded-md'} flex items-center justify-center`}
              >
                <Search className={`${inNav ? 'h-5 w-5' : 'h-4 w-4 mr-2'} `} />
                {inNav ? '' : 'Find Items'}
              </Button>
            </div>
          </div>

          {!inNav && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-green-400 hover:bg-green-50 text-green-800 rounded-full px-3 sm:px-4 mt-3 sm:mt-0 sm:ml-4 sm:mr-10 text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              {filtersOpen ? <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
              <span>{filtersOpen ? 'Hide Filters' : 'Filters'}</span>
            </Button>
          )}
        </form>
      </div>

      {filtersOpen && (
        <div className="container mx-auto mt-4 pb-2 px-4">
          <div className="bg-gradient-to-b from-white to-green-50/30 p-5 rounded-lg border-2 border-green-300 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 px-10">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-green-800 flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-green-600" />
                  Price Range (৳)
                </label>
                <div className="pt-4">
                  <Slider 
                    defaultValue={[0, 5000]} 
                    max={5000} 
                    step={100} 
                    value={tempPriceRange} 
                    onValueChange={(value) => setTempPriceRange(value as [number, number])}
                  />
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-green-700 mt-2">
                  <div className="bg-white px-3 py-1.5 rounded-md border border-green-300 shadow-sm font-semibold">
                    <span className="mr-1 text-green-800">৳</span>{tempPriceRange[0]}
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-md border border-green-300 shadow-sm font-semibold">
                    <span className="mr-1 text-green-800">৳</span>{tempPriceRange[1]}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-medium text-green-800 mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  Availability
                </label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger className="w-full border-green-400">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="now">Available now</SelectItem>
                    <SelectItem value="weekend">Available this weekend</SelectItem>
                    <SelectItem value="week">Available next week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between mt-6 pt-4 border-t border-green-300 gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs sm:text-sm border-green-400 text-green-700 hover:bg-green-50"
                onClick={clearFilters}
              >
                Clear all
              </Button>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                onClick={applyFilters}
              >
                Apply filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactSearchBar;