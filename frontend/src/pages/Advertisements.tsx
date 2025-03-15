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

// Generate listings once
const allListings = generateListings(40);
const Advertisements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState(16);

  // Filter listings based on selected category and search term
  const filteredListings = allListings.filter(item => {
    // Category filter
    const categoryMatch = selectedCategory ? categories.find(c => c.id === selectedCategory)?.name.toLowerCase() : null;
    const matchesCategory = !categoryMatch || item.category.toLowerCase().includes(categoryMatch);

    // Search filter
    const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const displayedListings = filteredListings.slice(0, visibleItems);
  const handleQuickView = (itemId: number) => {
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
  return <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="bg-green-50/65">
        {/* Compact Search Bar */}
        <CompactSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} location={location} setLocation={setLocation} filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen} priceRange={priceRange} setPriceRange={setPriceRange} />

        {/* Horizontal Category Scroll */}
        <CategoryScroll categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        {/* Listings Section */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {getPageTitle()}
            </h2>

            <ListingsGrid displayedListings={displayedListings} handleQuickView={handleQuickView} />

            <LoadMoreTrigger visible={visibleItems < filteredListings.length} />
          </div>
        </section>

        {/* Item Detail Modal */}
        <ItemModal isOpen={isItemModalOpen} onOpenChange={setIsItemModalOpen} selectedItem={getSelectedItem()} />
      </main>

      <Footer />
    </div>;
};
export default Advertisements;