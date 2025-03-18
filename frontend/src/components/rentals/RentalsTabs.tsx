import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Package } from "lucide-react";
import { Leaf } from 'lucide-react';

interface RentalsTabsProps {
  activeTab: 'myRentals' | 'myListingsRentals';
  onTabChange: (tab: 'myRentals' | 'myListingsRentals') => void;
}

const RentalsTabs = ({ activeTab, onTabChange }: RentalsTabsProps) => {
  return (
    <div className="mb-8 relative">
      {/* Decorative background elements */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-100/20 rounded-full blur-lg" />
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-lime-100/20 rounded-full blur-lg" />
      
      <Tabs 
        defaultValue={activeTab} 
        className="w-full relative"
        onValueChange={(value) => onTabChange(value as 'myRentals' | 'myListingsRentals')}
      >
        <TabsList className="grid w-full grid-cols-2 h-14 bg-green-300/60 backdrop-blur-sm border-2 border-green-100 rounded-xl p-1">
          <TabsTrigger 
            value="myRentals"
            className={`flex items-center gap-3 text-base rounded-lg transition-all ${
              activeTab === 'myRentals' 
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-green-800 hover:bg-green-50'
            }`}
          >
            <Home className="h-5 w-5" strokeWidth={1.5} />
            <span>My Borrowed Rentals</span>
          </TabsTrigger>
          <TabsTrigger 
            value="myListingsRentals"
            className={`flex items-center gap-3 text-base rounded-lg transition-all ${
              activeTab === 'myListingsRentals' 
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-green-800 hover:bg-green-50'
            }`}
          >
            <Package className="h-5 w-5" strokeWidth={1.5} />
            <span>My Listed Rentals</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default RentalsTabs;