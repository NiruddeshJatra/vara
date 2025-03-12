import { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
type HeroSectionProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  filtersOpen: boolean;
  setFiltersOpen: (value: boolean) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  categories: any[];
};
const HeroSection = ({
  searchTerm,
  setSearchTerm,
  location,
  setLocation,
  filtersOpen,
  setFiltersOpen,
  priceRange,
  setPriceRange,
  categories
}: HeroSectionProps) => {
  return <section className="relative min-h-[80vh] flex items-center justify-center pt-36 pb-16 overflow-hidden py-0">
      {/* Nature-inspired background with gradients and overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-800 to-green-600"></div>
      
      {/* Forest light effect overlay */}
      <div className="absolute inset-0 -z-10 opacity-20 bg-center bg-cover"></div>
      
      {/* Organic shapes inspired by the design images */}
      <div className="fluid-shape fluid-shape-1"></div>
      <div className="fluid-shape fluid-shape-2"></div>
      <div className="dots-pattern dots-pattern-1"></div>
      <div className="dots-pattern dots-pattern-2"></div>
      <div className="triangle-element triangle-element-1"></div>
      <div className="wavy-line wavy-line-1"></div>
      <div className="wavy-line wavy-line-2"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10">
          <span className="text-sm font-medium bg-white/10 text-white px-4 py-1.5 rounded-full mb-6 inline-block">Find What You Need</span>
          <h1 className="font-bold text-4xl sm:text-5xl mb-6 leading-tight text-white animate-fade-up md:text-5xl">
            Discover Items <span className="text-lime-300">Available Near You</span>
          </h1>
          <p style={{
          animationDelay: '0.1s'
        }} className="text-white/80 mb-8 max-w-lg mx-auto animate-fade-up text-base">
            Browse thousands of items available for rent in your community and start saving today
          </p>
          
          {/* Search UI */}
          <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border border-green-100 rounded-xl shadow-sm p-4 mb-8 mx-auto animate-fade-up" style={{
          animationDelay: '0.2s'
        }}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-green-600/60" />
                <Input type="text" placeholder="What are you looking for?" className="pl-9 h-12 border-green-100 focus:border-green-300 focus:ring-green-200" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-600/60" />
                <Input type="text" placeholder="Select your location" className="pl-9 h-12 border-green-100 focus:border-green-300 focus:ring-green-200" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
              <Button className="h-12 px-8 bg-green-700 hover:bg-green-800 font-medium">Find Items</Button>
            </div>
          </div>
          
          {/* Filters */}
          {filtersOpen && <div className="w-full max-w-2xl mx-auto mt-4 p-5 border-t border-green-100 animate-fade-in bg-white/80 backdrop-blur-sm rounded-b-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-800">Category</label>
                  <select className="w-full h-10 rounded-md border border-green-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                    <option value="">All Categories</option>
                    {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-800">Minimum Rating</label>
                  <select className="w-full h-10 rounded-md border border-green-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                    <option value="">Any Rating</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" className="border-gray-200 hover:bg-gray-50">Reset</Button>
                <Button className="bg-green-700 hover:bg-green-800 text-white">Apply Filters</Button>
              </div>
            </div>}
          
          <Button variant="outline" onClick={() => setFiltersOpen(!filtersOpen)} className="h-11 md:w-auto border-green-200 text-green-700 hover:bg-green-50 bg-white mt-2 mx-auto">
            <Filter className="h-4 w-4 mr-2" />
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          {/* Stats row */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center text-center mt-8 animate-fade-up" style={{
          animationDelay: '0.3s'
        }}>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-lime-300 mr-2"></div>
              <span className="text-sm font-medium text-white">10,000+ Listings</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-lime-300 mr-2"></div>
              <span className="text-sm font-medium text-white">25,000+ Users</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-lime-300 mr-2"></div>
              <span className="text-sm font-medium text-white">4.8/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;