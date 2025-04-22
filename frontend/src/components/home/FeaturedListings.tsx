import { Button } from '../ui/button';
import ListingsGrid from '../advertisements/ListingsGrid';
import { useState } from 'react';
import { generateListings } from '@/utils/mockDataGenerator';
import ItemModal from '@/components/advertisements/ItemModal';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const FeaturedListings = () => {
  // Generate mock listings for display
  const mockListings = generateListings(4);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuickView = (itemId: string) => {
    setSelectedItem(itemId);
    setIsItemModalOpen(true);
  };

  const getSelectedItem = () => {
    return mockListings.find(item => item.id === selectedItem) || null;
  };

  return (
    <section className="py-12 md:py-24 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-block px-4 py-1.5 text-xs md:text-sm font-medium rounded-full bg-green-600/10 text-green-600 mb-4">
            Featured
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-green-800 mb-4">
            Popular Items Near You
          </h2>
          <p className="text-green-700/80 mb-3 text-center text-[0.85rem]">
            Discover items available for rent in your area
          </p>
        </div>

        <section className="md:py-6 animate-fade-up delay-200">
          <div className="container mx-auto px-4">
            <ListingsGrid
              displayedListings={mockListings}
              handleQuickView={handleQuickView}
            />
          </div>
          <ItemModal
            isOpen={isItemModalOpen}
            onOpenChange={setIsItemModalOpen}
            selectedItem={getSelectedItem()}
          />
        </section>

        <div className="text-center mt-6 animate-fade-up delay-300">
          <Button
            variant="outline"
            className="py-6 px-8 text-sm md:text-md rounded-full font-semibold shadow-lg cursor-pointer transition-transform duration-300 ease-in-out hover:translate-y-[-2px] hover:shadow-xl text-black/70 hover:text-white border border-green-600 text-green-700 bg-white hover:bg-lime-600 hover:border-none"
            style={{ animationDelay: '0.5s' }}
            onClick={() => {
              toast({
                title: "Validation Error",
                description: "Please login first",
                variant: "destructive"
              });
              navigate('/auth/login/');
            }}
          >
            See All Available Items
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;