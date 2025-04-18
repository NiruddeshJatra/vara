import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Package } from "lucide-react";
import { Leaf } from 'lucide-react';

interface RentalsTabsProps {
  activeTab: 'myRentals' | 'myListingsRentals';
  onTabChange: (tab: 'myRentals' | 'myListingsRentals') => void;
}

const RentalsTabs = ({ activeTab, onTabChange }: RentalsTabsProps) => {
  return (
    <div className="mb-8 mt-8 relative">
      {/* Decorative background elements */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-100/20 rounded-full blur-lg" />
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-lime-100/20 rounded-full blur-lg" />
      
      <Tabs 
        defaultValue={activeTab} 
        className="w-full relative"
        onValueChange={(value) => onTabChange(value as 'myRentals' | 'myListingsRentals')}
      >
        <TabsList className="grid w-full grid-cols-2 h-14 bg-green-200/80 border border-green-100 rounded-xl p-1 sm:p-2 overflow-x-auto">
          <TabsTrigger 
            value="myRentals"
            className={`flex items-center gap-2 sm:gap-3 text-xs sm:text-base rounded-lg transition-all ${
              activeTab === 'myRentals' 
                ? 'bg-white text-green-800 shadow-sm'
                : 'text-green-700 hover:bg-green-50'
            }`}
          >
            <Home className="h-4 sm:h-5 w-4 sm:w-5" strokeWidth={1.5} />
            <span className="whitespace-nowrap">My Borrowed Rentals</span>
          </TabsTrigger>
          <TabsTrigger 
            value="myListingsRentals"
            className={`flex items-center gap-2 sm:gap-3 text-xs sm:text-base rounded-lg transition-all ${
              activeTab === 'myListingsRentals' 
                ? 'bg-white text-green-800 shadow-sm'
                : 'text-green-700 hover:bg-green-50'
            }`}
          >
            <Package className="h-4 sm:h-5 w-4 sm:w-5" strokeWidth={1.5} />
            <span className="whitespace-nowrap">My Listed Rentals</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default RentalsTabs;