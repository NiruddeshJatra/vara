import { useState, useEffect } from 'react';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import CompactSearchBar from '@/components/advertisements/CompactSearchBar';
import CategoryScroll from '@/components/advertisements/CategoryScroll';
import ItemModal from '@/components/advertisements/ItemModal';
import ListingsGrid from '@/components/advertisements/ListingsGrid';
import LoadMoreTrigger from '@/components/advertisements/LoadMoreTrigger';
import { categories, generateListings } from '@/utils/mockDataGenerator';
import '../styles/main.css';
import { Product } from '@/types/listings';


// Generate listings once - ensure the mock data matches the Product type
const allListings = generateListings(40) as unknown as Product[];

const Advertisements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('GEC, Chittagong');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState(16);

  // Filter listings based on selected category, search term, and price range
  const filteredListings = allListings.filter(item => {
    const categoryMatch = selectedCategory ?
      categories.find(c => c.id === selectedCategory)?.name : null;

    // Price range filter - use the first pricing tier's price
    const priceInRange = item.pricingTiers[0].price >= priceRange[0] && item.pricingTiers[0].price <= priceRange[1];

    return (
      (!categoryMatch || item.category === categoryMatch) &&
      (!searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      priceInRange
    );
  });

  const displayedListings = filteredListings.slice(0, visibleItems);

  const handleQuickView = (itemId: string) => {
    setSelectedItem(itemId);
    setIsItemModalOpen(true);
  };

  const getSelectedItem = () => {
    return allListings.find(item => item.id === selectedItem) || null;
  };

  const loadMoreItems = () => {
    setVisibleItems(prev => prev + 8);
  };

  // Intersection Observer for infinite scrolling effect
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleItems < filteredListings.length) {
        loadMoreItems();
      }
    }, {
      threshold: 0.1
    });
    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }
    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  }, [visibleItems, filteredListings.length]);

  const getPageTitle = () => {
    if (selectedCategory) {
      return `${categories.find(c => c.id === selectedCategory)?.name} Items`;
    }
    if (searchTerm) {
      return `Search Results for "${searchTerm}"`;
    }
    return 'All Available Items';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="bg-green-50/65">
        {/* Compact Search Bar */}
        <div className="animate-fade-in">
          <CompactSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            location={location}
            setLocation={setLocation}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            inNav={false}
          />
        </div>

        {/* Horizontal Category Scroll */}
        <div className="animate-fade-up delay-200">
          <CategoryScroll
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Listings Section */}
        <section className="py-4 sm:py-6 md:py-10 animate-fade-up delay-300">
          <div className="container mx-auto px-4">
            <h1 className="text-xl text- sm:text-2xl md:text-3xl font-bold text-green-800 mb-6 sm:mb-8">
              {getPageTitle()}
              <span className="text-sm sm:text-base md:text-lg font-normal text-gray-500 ml-2">
                ({filteredListings.length} items)
              </span>
            </h1>

            {filteredListings.length === 0 ? (
              <div className="p-6 sm:p-8 md:p-10 text-center animate-scale-up">
                <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">No Items Found</h2>
                <p className="text-gray-500 text-sm sm:text-base">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </div>
            ) : (
              <>
                <div className="animate-fade-up delay-400">
                  <ListingsGrid
                    displayedListings={displayedListings}
                    handleQuickView={handleQuickView}
                  />
                </div>

                <LoadMoreTrigger visible={visibleItems < filteredListings.length} />
              </>
            )}
          </div>
        </section>

        {/* Item Detail Modal */}
        <ItemModal
          isOpen={isItemModalOpen}
          onOpenChange={setIsItemModalOpen}
          selectedItem={getSelectedItem()}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Advertisements;