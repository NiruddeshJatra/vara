import { useState, useEffect } from 'react';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import CompactSearchBar from '@/components/advertisements/CompactSearchBar';
import CategoryScroll from '@/components/advertisements/CategoryScroll';
import ItemModal from '@/components/advertisements/ItemModal';
import VirtualizedListingsGrid from '@/components/advertisements/VirtualizedListingsGrid';
import LoadMoreTrigger from '@/components/advertisements/LoadMoreTrigger';
import { CATEGORY_DISPLAY, CATEGORY_VALUES } from '@/constants/productTypes';
import '../styles/main.css';
import { Product } from '@/types/listings';
import { addDays, addMonths, parseISO, endOfWeek, endOfMonth } from 'date-fns';
import productService from '@/services/product.service';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { queryClient } from '@/lib/react-query';
import { invalidateProducts } from '@/lib/query-invalidation';

import { useTranslation } from 'react-i18next';
type AppCategory = {
  id: string;
  name: string;
  icon: string;
  image: string;
  count: number;
};

const Advertisements = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 10000]);
  const [allListings, setAllListings] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [visibleItems, setVisibleItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [availability, setAvailability] = useState('any');
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<AppCategory[]>([]);
  const PAGE_SIZE = 40;

  // Debounce search input
  const debouncedSetSearchTerm = debounce((value: string) => {
    setDebouncedSearchTerm(value);
  }, 350);

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [searchTerm]);

  // TanStack Query for fetching products
  const {
    data: productData,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
    isFetching: productsFetching
  } = useQuery({
    queryKey: ['products', page, selectedCategory, debouncedSearchTerm, priceRange, availability],
    queryFn: async () => {
      return await productService.getActiveProducts(page, PAGE_SIZE);
    },
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
  });

  // Reset listings when any data changes
  useEffect(() => {
    if (productData) {
      // If it's the first page, replace all listings
      // Otherwise append the new products to existing ones
      if (page === 1) {
        setAllListings(productData.products);
      } else {
        // Make sure we're not adding duplicates when appending
        const existingIds = new Set(allListings.map(item => item.id));
        const newProducts = productData.products.filter(product => !existingIds.has(product.id));
        setAllListings(prev => [...prev, ...newProducts]);
      }
      
      setTotalCount(productData.count);
      setHasMore(page * PAGE_SIZE < productData.count);
      setVisibleItems(Math.min(page * PAGE_SIZE, productData.count));
    }
  }, [productData, page]);

  // Listen for query cache updates - this ensures deleted products are removed
  useEffect(() => {
    // Function to update allListings if a product is deleted
    const removeDeletedProducts = () => {
      const cachedData = queryClient.getQueryData(['products']);
      if (cachedData && allListings.length > 0) {
        // Get the latest products list
        refetchProducts();
      }
    };
    
    // Subscribe to query cache changes
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      removeDeletedProducts();
    });
    
    return () => {
      unsubscribe();
    };
  }, [allListings.length, refetchProducts]);

  useEffect(() => {
    if (productsError) {
      toast({
        title: t('common.toastError'),
        description: t('ads.loadFailed'),
        variant: 'destructive',
      });
    }
  }, [productsError]);

  // Generate categories from constants
  useEffect(() => {
    const initialCategories: AppCategory[] = CATEGORY_VALUES.map((categoryId) => ({
      id: categoryId,
      name: t('categories.' + categoryId, { defaultValue: CATEGORY_DISPLAY[categoryId] }),
      icon: categoryId, // FIX: Use categoryId so CategoryScroll gets correct key
      image: '',
      count: 0 // This will be updated when we get the actual data
    }));
    setCategoriesWithCounts(initialCategories);
  }, []);

  function getCategoryIcon(categoryId: string): string {
    // Map category IDs to appropriate icons
    const iconMap: Record<string, string> = {
      'photography_videography': 'camera',
      'sports_fitness': 'dumbbell',
      'tools_equipment': 'wrench',
      'electronics': 'smartphone',
      'musical_instruments': 'music',
      'party_events': 'party-popper',
      'fashion_accessories': 'shirt',
      'home_garden': 'home',
      'books_media': 'book',
      'toys_games': 'gamepad-2',
      'automotive': 'car',
      'other': 'more-horizontal'
    };
    return iconMap[categoryId] || 'tag';
  }

  // Helper function to check if a product is available during a specific date range
  const isProductAvailableDuring = (product: Product, start_date: Date, end_date: Date): boolean => {
    if (!product.unavailable_periods || product.unavailable_periods.length === 0) {
      // If there are no unavailable dates, the product is always available
      return true;
    }

    // Check if any unavailable date falls within our target range
    return !product.unavailable_periods.some(unavailable => {
      if (unavailable.is_range && unavailable.range_start && unavailable.range_end) {
        // Handle date range
        const range_start = parseISO(unavailable.range_start);
        const range_end = parseISO(unavailable.range_end);
        // Check if there's an overlap between the two ranges
        return (
          (range_start <= end_date && range_end >= start_date)
        );
      } else if (unavailable.date) {
        // Handle single date
        const unavailable_period = parseISO(unavailable.date);
        return (
          unavailable_period >= start_date && unavailable_period <= end_date
        );
      }
      return false;
    });
  };

  // Calculate availability filter date range based on selected option
  const getAvailabilityDateRange = (): { start: Date, end: Date } | null => {
    const today = new Date();
    switch (availability) {
      case 'next3days':
        return {
          start: today,
          end: addDays(today, 3)
        };
      case 'thisWeek':
        return {
          start: today,
          end: endOfWeek(today)
        };
      case 'nextWeek':
        return {
          start: addDays(endOfWeek(today), 1),
          end: addDays(endOfWeek(today), 7)
        };
      case 'thisMonth':
        return {
          start: today,
          end: endOfMonth(today)
        };
      case 'nextMonth':
        return {
          start: addDays(endOfMonth(today), 1),
          end: endOfMonth(addMonths(today, 1))
        };
      case 'any':
      default:
        return null; // Any time means no date filtering
    }
  };

  const filteredListings = allListings.filter(item => {
    // Check if there's a selected category
    const categoryMatch = selectedCategory ? item.category === selectedCategory : true;

    // Ensure the item has pricing tiers before checking price range
    const priceInRange = item.pricing_tiers?.length > 0 ? 
      (item.pricing_tiers[0]?.price || 0) >= priceRange[0] && 
      (item.pricing_tiers[0]?.price || 0) <= priceRange[1] : true;
    
    // Location filtering
    const locationMatch = !location || (item.location?.toLowerCase() || '').includes(location.toLowerCase());

    // Availability filtering
    const availabilityDateRange = getAvailabilityDateRange();
    const availabilityMatch = !availabilityDateRange || 
      isProductAvailableDuring(item, availabilityDateRange.start, availabilityDateRange.end);

    // If no search term, only filter by category, price, location and availability
    if (!searchTerm) {
      return categoryMatch && priceInRange && locationMatch && availabilityMatch;
    }

    // Calculate search score based on where matches are found
    const searchTermLower = searchTerm.toLowerCase();
    let searchScore = 0;

    // Exact matches in title are most valuable
    if (item.title?.toLowerCase() === searchTermLower) {
      searchScore += 100;
    }
    // Partial matches in title are very valuable
    else if (item.title?.toLowerCase()?.includes(searchTermLower)) {
      searchScore += 50;
    }

    // Exact matches in product type are valuable
    if (item.product_type?.toLowerCase() === searchTermLower) {
      searchScore += 40;
    }
    // Partial matches in product type are somewhat valuable
    else if (item.product_type?.toLowerCase()?.includes(searchTermLower)) {
      searchScore += 30;
    }

    // Matches in description are less valuable but still count
    if (item.description?.toLowerCase()?.includes(searchTermLower)) {
      searchScore += 20;
    }

    return searchScore > 0 && categoryMatch && priceInRange && locationMatch && availabilityMatch;
  });

  // Sort results by search score (if search term exists)
  const sortedListings = searchTerm
    ? [...filteredListings].sort((a, b) => {
      const scoreA = getSearchScore(a, searchTerm.toLowerCase());
      const scoreB = getSearchScore(b, searchTerm.toLowerCase());
      return scoreB - scoreA; // Higher scores first
    })
    : filteredListings;

  const displayedListings = sortedListings.slice(0, visibleItems);

  // Helper function to calculate search score (duplicated for sorting)
  function getSearchScore(item: Product, searchTermLower: string): number {
    let score = 0;

    // Title matches
    if (item.title?.toLowerCase() === searchTermLower) {
      score += 100;
    } else if (item.title?.toLowerCase()?.includes(searchTermLower)) {
      score += 50;
    }

    // Product type matches
    if (item.product_type?.toLowerCase() === searchTermLower) {
      score += 40;
    } else if (item.product_type?.toLowerCase()?.includes(searchTermLower)) {
      score += 30;
    }

    // Description matches
    if (item.description?.toLowerCase()?.includes(searchTermLower)) {
      score += 20;
    }

    return score;
  }

  // Function to highlight search terms in text
  const highlightSearchTerm = (text: string, term: string): JSX.Element | string => {
    if (!term) return text;

    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase()
            ? <span key={i} className="bg-yellow-200">{part}</span>
            : part
        )}
      </>
    );
  };

  const handleQuickView = (itemId: string) => {
    setSelectedItem(itemId);
    setIsItemModalOpen(true);
  };

  const getSelectedItem = () => {
    return allListings.find(item => item.id === selectedItem) || null;
  };

  const loadMoreItems = () => {
    setVisibleItems(allListings.length);
  };

  const getPageTitle = () => {
    if (selectedCategory) {
      return t('ads.categoryItems', { category: t('categories.' + selectedCategory, { defaultValue: CATEGORY_DISPLAY[selectedCategory] }) });
    }
    if (searchTerm) {
      return t('ads.searchResults', { term: searchTerm });
    }
    return t('ads.allItems');
  };

  useEffect(() => {
    if (!isItemModalOpen) {
      invalidateProducts();
    }
  }, [isItemModalOpen]);

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
            availability={availability}
            setAvailability={setAvailability}
            inNav={false}
          />
        </div>

        {/* Horizontal Category Scroll */}
        <div className="animate-fade-up delay-200">
          <CategoryScroll
            categories={categoriesWithCounts}
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
                {t('ads.itemCount', { count: sortedListings.length })}
              </span>
            </h1>

            {productsLoading || productsError ? (
              <div className="p-6 sm:p-8 md:p-10 text-center animate-scale-up">
                {productsError ? (
                  <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">{t('ads.failedTitle')}</h2>
                ) : (
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
                )}
                <p className="text-gray-500 text-sm sm:text-base">
                  {productsError ? t('ads.tryLater') : t('ads.loadingProducts')}
                </p>
              </div>
            ) : sortedListings.length === 0 ? (
              <div className="p-6 sm:p-8 md:p-10 text-center animate-scale-up">
                <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">{t('ads.noItemsTitle')}</h2>
                <p className="text-gray-500 text-sm sm:text-base">
                  {t('ads.noItemsHint')}
                </p>
              </div>
            ) : (
              <>
                <div className="animate-fade-up delay-400">
                  <VirtualizedListingsGrid
                    displayedListings={displayedListings}
                    handleQuickView={handleQuickView}
                    searchTerm={searchTerm}
                    loading={productsLoading || productsFetching}
                  />
                </div>

                <LoadMoreTrigger visible={visibleItems < sortedListings.length} />
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