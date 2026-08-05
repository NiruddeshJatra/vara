import { useState, useEffect, useCallback } from 'react';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import RentalsTabs from '@/components/rentals/RentalsTabs';
import RentalsStatusFilter from '@/components/rentals/RentalsStatusFilter';
import MyRentalsTab from '@/components/rentals/MyRentalsTab';
import MyListingsRentalsTab from '@/components/rentals/MyListingsRentalsTab';
import RentalDetailModal from '@/components/rentals/RentalDetailModal';
import { useToast } from '@/hooks/use-toast';
import rentalService from '@/services/rental.service';
import productService from '@/services/product.service';
import { RentalStatus } from '@/constants/rental';
import { Product } from '@/types/listings';
import { Rental } from '@/types/rentals';
import { useTranslation } from 'react-i18next';
import '../styles/main.css';

const Rentals = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'myRentals' | 'myListingsRentals'>('myRentals');
  const [statusFilter, setStatusFilter] = useState<RentalStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [myRentals, setMyRentals] = useState<Rental[]>([]);
  const [myListingsRentals, setMyListingsRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // The API returns product as a UUID; attach the full product object so
  // cards/modal can show images and category (plumbing only, same UI)
  const attachProducts = async (rentals: Rental[]): Promise<Rental[]> => {
    const ids = [...new Set(
      rentals
        .map((r) => (typeof r.product === 'string' ? r.product : null))
        .filter((id): id is string => !!id)
    )];

    const products = new Map<string, Product>();
    await Promise.all(ids.map(async (id) => {
      try {
        products.set(id, await productService.getProduct(id));
      } catch {
        // Product may be suspended/deleted — card falls back to product_title
      }
    }));

    return rentals.map((rental) => {
      const productId = typeof rental.product === 'string' ? rental.product : null;
      const product = productId ? products.get(productId) : null;
      return product ? { ...rental, product } : rental;
    });
  };

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'myRentals') {
        const rentals = await rentalService.getUserRentals();
        setMyRentals(await attachProducts(rentals));
      } else {
        const rentals = await rentalService.getUserListingsRentals();
        setMyListingsRentals(await attachProducts(rentals));
      }
    } catch (err: any) {
      setError(err.message || t('rental.page.fetchFailed'));
      toast({
        title: t('common.toastError'),
        description: err.message || t('rental.page.fetchFailed'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  // Filter and sort rentals based on UI state
  const getFilteredSortedRentals = (rentals: Rental[]) => {
    let filtered = rentals.filter(rental => {
      if (statusFilter !== 'all' && rental.status !== statusFilter) return false;
      const title = typeof rental.product === 'object'
        ? rental.product.title
        : rental.product_title || '';
      if (searchTerm && !title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (dateRange.from && new Date(rental.start_date) < dateRange.from) return false;
      if (dateRange.to && new Date(rental.end_date) > dateRange.to) return false;
      return true;
    });
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'priceHighToLow':
          return Number(b.base_cost) - Number(a.base_cost);
        case 'priceLowToHigh':
          return Number(a.base_cost) - Number(b.base_cost);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return filtered;
  };

  const handleViewRentalDetails = async (rental: Rental) => {
    // Open immediately with list data, then enrich with detail-only fields
    // (status_history, settlement, pricing snapshot)
    setSelectedRental(rental);
    try {
      const detail = await rentalService.getRentalRequest(rental.id);
      setSelectedRental({ ...rental, ...detail, product: rental.product });
    } catch {
      // Modal still works with list data
    }
  };

  const handleCloseRentalDetails = () => {
    setSelectedRental(null);
  };

  const handleStatusAction = async (rentalId: string, action: string) => {
    try {
      if (action === 'accept') {
        await rentalService.acceptRental(rentalId);
      } else if (action === 'reject') {
        await rentalService.rejectRental(rentalId);
      } else if (action === 'cancel') {
        await rentalService.cancelRental(rentalId);
      } else {
        return;
      }
      setSelectedRental(null);
      await fetchRentals();
    } catch {
      // Service already toasts the error
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white pt-12">
      <NavBar />

      <div className="py-6 px-2 sm:px-6 md:px-12 lg:px-20 mt-4 mb-16">
        {/* Tab navigation */}
        <RentalsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Status filter & search */}
        <RentalsStatusFilter
          statusFilter={statusFilter}
          onStatusFilterChange={(status) => setStatusFilter(status)}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Loading and error states */}
        {loading && <div className="text-center py-8">{t('rental.page.loading')}</div>}
        {error && <div className="text-center py-8 text-red-600">{error}</div>}

        {/* Tab content */}
        {!loading && !error && (
          activeTab === 'myRentals' ? (
            <MyRentalsTab
              rentals={getFilteredSortedRentals(myRentals)}
              onViewDetails={handleViewRentalDetails}
              onStatusAction={handleStatusAction}
            />
          ) : (
            <MyListingsRentalsTab
              rentals={getFilteredSortedRentals(myListingsRentals)}
              onViewDetails={handleViewRentalDetails}
              onStatusAction={handleStatusAction}
            />
          )
        )}
      </div>

      {/* Rental Detail Modal */}
      {selectedRental && (
        <RentalDetailModal
          rental={selectedRental}
          onClose={handleCloseRentalDetails}
          onStatusAction={handleStatusAction}
          userRole={activeTab === 'myRentals' ? 'renter' : 'owner'}
        />
      )}

      <Footer />
    </div>
  );
};

export default Rentals;
