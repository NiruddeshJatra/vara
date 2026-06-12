import { useState, useEffect } from 'react';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import RentalsTabs from '@/components/rentals/RentalsTabs';
import RentalsStatusFilter from '@/components/rentals/RentalsStatusFilter';
import MyRentalsTab from '@/components/rentals/MyRentalsTab';
import MyListingsRentalsTab from '@/components/rentals/MyListingsRentalsTab';
import RentalDetailModal from '@/components/rentals/RentalDetailModal';
import { useToast } from '@/hooks/use-toast';
import rentalService from '@/services/rental.service';
import { RentalStatus } from '@/constants/rental';
import { Product } from '@/types/listings';
import { Rental, Review } from '@/types/rentals';
import '../styles/main.css';

const Rentals = () => {
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

  // Map RentalRequest (API) to Rental (UI)
  function mapRentalRequestToRental(req: any): Rental {
    return {
      id: req.id,
      product: {
        id: req.product?.id,
        owner: typeof req.product?.owner === 'object' ? req.product.owner.username : req.product.owner,
        title: req.product?.title || '',
        category: req.product?.category || '',
        product_type: req.product?.product_type || '',
        description: req.product?.description || '',
        location: req.product?.location || '',
        security_deposit: req.product?.security_deposit ?? null,
        purchase_year: req.product?.purchase_year || '',
        original_price: req.product?.original_price ? Number(req.product.original_price) : 0,
        ownership_history: req.product?.ownership_history || '',
        status: req.product?.status || '',
        statusMessage: req.product?.statusMessage || null,
        statusChangedAt: req.product?.statusChangedAt || null,
        images: (req.product?.images || req.product?.productImages || []).map((img: any) => ({
          id: img.id,
          image: img.image,
          created_at: img.created_at,
        })),
        unavailable_periods: req.product?.unavailable_periods || [],
        pricing_tiers: req.product?.pricing_tiers || [],
        views_count: req.product?.views_count || 0,
        rental_count: req.product?.rental_count || 0,
        average_rating: req.product?.average_rating ? Number(req.product.average_rating) : 0,
        created_at: req.product?.created_at || '',
        updated_at: req.product?.updated_at || '',
      },
      reviews: req.reviews || [],
      start_date: req.startTime,
      end_date: req.endTime,
      duration: req.duration,
      duration_unit: req.duration_unit,
      base_cost: req.base_cost !== undefined && req.base_cost !== null && !isNaN(Number(req.base_cost)) ? Number(req.base_cost) : (req.product?.pricing_tiers?.[0]?.price || 0),
      service_fee: req.service_fee !== undefined && req.service_fee !== null && !isNaN(Number(req.service_fee)) ? Number(req.service_fee) : 0,
      security_deposit: req.security_deposit !== undefined && req.security_deposit !== null && !isNaN(Number(req.security_deposit)) ? Number(req.security_deposit) : 0,
      status: req.status,
      status_history: req.status_history || [],
      created_at: req.created_at,
      updated_at: req.updated_at,
      notes: req.notes,
      renter: typeof req.renter === 'object' ? req.renter.username : req.renter,
      owner: typeof req.owner === 'object' ? req.owner.username : req.owner,
    };
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchRentals = async () => {
      try {
        if (activeTab === 'myRentals') {
          const rentals = await rentalService.getUserRentals();
          const mapped = rentals.map(mapRentalRequestToRental).filter(Boolean);
          setMyRentals(mapped);
        } else {
          const rentals = await rentalService.getUserListingsRentals();
          const mapped = rentals.map(mapRentalRequestToRental).filter(Boolean);
          setMyListingsRentals(mapped);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch rentals');
        toast({
          title: 'Error',
          description: err.message || 'Failed to fetch rentals',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Filter and sort rentals based on UI state
  const getFilteredSortedRentals = (rentals: Rental[]) => {
    let filtered = rentals.filter(rental => {
      if (statusFilter !== 'all' && rental.status !== statusFilter) return false;
      if (searchTerm && !rental.product.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (dateRange.from && new Date(rental.start_date) < dateRange.from) return false;
      if (dateRange.to && new Date(rental.end_date) > dateRange.to) return false;
      return true;
    });
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'priceHighToLow':
          return b.base_cost - a.base_cost;
        case 'priceLowToHigh':
          return a.base_cost - b.base_cost;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return filtered;
  };

  const handleViewRentalDetails = (rental: Rental) => {
    setSelectedRental(rental);
  };

  const handleCloseRentalDetails = () => {
    setSelectedRental(null);
  };

  const handleStatusAction = (rentalId: number, action: string) => {
    toast({
      title: "Action taken",
      description: `${action} action for rental #${rentalId} was successful.`,
      variant: "default"
    });
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
        {loading && <div className="text-center py-8">Loading rentals...</div>}
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
