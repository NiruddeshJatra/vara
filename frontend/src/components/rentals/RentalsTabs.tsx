
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Package } from "lucide-react";

interface RentalsTabsProps {
  activeTab: 'myRentals' | 'myListingsRentals';
  onTabChange: (tab: 'myRentals' | 'myListingsRentals') => void;
}

const RentalsTabs = ({ activeTab, onTabChange }: RentalsTabsProps) => {
  return (
    <div className="mb-6">
      <Tabs 
        defaultValue={activeTab} 
        className="w-full" 
        onValueChange={(value) => onTabChange(value as 'myRentals' | 'myListingsRentals')}
      >
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger 
            value="myRentals"
            className="flex items-center gap-2 text-base"
          >
            <Home className="h-4 w-4" />
            <span>My Rentals</span>
          </TabsTrigger>
          <TabsTrigger 
            value="myListingsRentals"
            className="flex items-center gap-2 text-base"
          >
            <Package className="h-4 w-4" />
            <span>My Listings Rentals</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default RentalsTabs;