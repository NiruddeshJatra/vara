import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
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
      
      <div className="container mx-auto px-4 text-center">
        {/* Text content */}
        <div className="flex flex-col items-center animate-fade-up max-w-3xl mx-auto">
          <span className="text-sm font-medium bg-white/10 text-white px-4 py-1.5 rounded-full mb-6">Welcome to Vara</span>
          <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl mb-6 leading-tight text-white">
            Rent Anything, <span className="text-lime-300">Anywhere</span>
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-lg">
            The trusted community marketplace for lending and borrowing everyday items. Save money, earn income, and live more sustainably.
          </p>
          
          {/* Search UI */}
          <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm border border-green-100 rounded-xl shadow-sm p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-green-600/60" />
                <Input
                  type="text"
                  placeholder="What do you need to borrow today?"
                  className="pl-9 h-12 border-green-100 focus:border-green-300 focus:ring-green-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-600/60" />
                <Input
                  type="text"
                  placeholder="Select your location"
                  className="pl-9 h-12 border-green-100 focus:border-green-300 focus:ring-green-200"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button className="h-12 px-8 bg-green-700 hover:bg-green-800 sm:text-xl font-medium font-['Helvetica_Neue_Light']">Find Items</Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-lime-300 mr-2"></div>
              <span className="text-sm font-medium text-white">10,000+ Users</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-lime-300 mr-2"></div>
              <span className="text-sm font-medium text-white">25,000+ Rentals</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-lime-300 mr-2"></div>
              <span className="text-sm font-medium text-white">4.8/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;