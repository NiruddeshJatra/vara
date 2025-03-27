
import { Button } from '../ui/button';
import ListingsGrid from '../advertisements/ListingsGrid';
import { useState, useEffect } from 'react';
import { categories, generateListings } from '@/utils/mockDataGenerator';
import ItemModal from '@/components/advertisements/ItemModal';


const FeaturedListings = () => {
  const allListings = generateListings(4);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const handleQuickView = (itemId: string) => {
    setSelectedItem(itemId);
    setIsItemModalOpen(true);
  };

  const getSelectedItem = () => {
    return allListings.find(item => item.id === selectedItem) || null;
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-green-100 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-medium rounded-full bg-vhara-600/10 text-vhara-600 mb-4">
            Featured
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-vhara-800 mb-4">
            Popular Items Near You
          </h2>
          <p className="text-md text-vhara-700/80 max-w-2xl mx-auto">
            Discover top-rated items available for rent in your area
          </p>
        </div>

        <section className="py-4">
          <div className="container mx-auto px-4">
            <ListingsGrid
              displayedListings={allListings}
              handleQuickView={handleQuickView}
            />
          </div>
          <ItemModal
            isOpen={isItemModalOpen}
            onOpenChange={setIsItemModalOpen}
            selectedItem={getSelectedItem()}
          />
        </section>

        <div className="text-center mt-6">
          <Button
            variant="outline"
            className="py-6 px-8 text-md rounded-full font-semibold shadow-lg cursor-pointer transition-transform duration-300 ease-in-out animate-fade-up hover:translate-y-[-2px] hover:shadow-xltext-sm text-black/70 hover:text-white border border-green-600 text-green-700 bg-white hover:bg-lime-600 hover:border-none"
            style={{ animationDelay: '0.5s' }}
          >
            See All Available Items
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;