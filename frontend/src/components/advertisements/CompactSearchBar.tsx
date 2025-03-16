import React from 'react';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

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
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality is handled in the parent component
  };
  return <div className={`sticky top-[64px] mt-[64px] py-4 z-10 backdrop-blur-sm ${inNav ? 'hidden' : 'block'
      }`}>
      <div className="container mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex items-center justify-between">
          <div className="w-full max-w-2xl p-4 mx-auto rounded-2xl bg-transparent py-[8px]">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-6 w-4 text-green-500" />
                <Input type="text" placeholder="What do you need to borrow today?" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="text-xs pl-9 h-12 border-black/20 focus:border-green-300" />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-6 w-4 text-green-500" />
                <Input type="text" placeholder="Select your location" value={location} onChange={e => setLocation(e.target.value)} className="text-xs pl-9 h-12 border-black/20 focus:border-green-300" />
              </div>
              <Button type="submit" className="h-12 px-8 bg-green-700 hover:bg-green-800 sm:text-md font-medium rounded-md">
                <Search className="h-4 w-4 mr-2" />
                Find Items
              </Button>
            </div>
          </div>
          
          <Button type="button" variant="outline" size="sm" className="border-gray-300 rounded-full px-4 ml-4 mr-10" onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </form>
      </div>
      
      {filtersOpen && <div className="container mx-auto mt-4 pb-2">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">Price Range</label>
                <div className="pt-6">
                  <Slider defaultValue={[0, 100]} max={100} step={1} value={priceRange} onValueChange={setPriceRange} />
                </div>
                <div className="flex justify-between text-sm text-green-700 mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50">
                  <option>5 miles</option>
                  <option>10 miles</option>
                  <option>25 miles</option>
                  <option>50 miles</option>
                  <option>100+ miles</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50">
                  <option>Any time</option>
                  <option>Available now</option>
                  <option>Available this weekend</option>
                  <option>Available next week</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
              <Button variant="outline" size="sm">Clear all</Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">Apply filters</Button>
            </div>
          </div>
        </div>}
    </div>;
};
export default CompactSearchBar;