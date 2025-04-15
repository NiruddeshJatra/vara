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
      product: req.product,
      reviews: req.reviews,
      startDate: req.start_date,
      endDate: req.end_date,
      duration: req.duration,
      durationUnit: req.duration_unit,
      totalCost: req.total_cost,
      serviceFee: req.service_fee,
      securityDeposit: req.security_deposit,
      status: req.status,
      statusHistory: req.status_history,
      createdAt: req.created_at,
      updatedAt: req.updated_at,
      notes: req.notes,
      renter: req.renter,
      owner: req.owner,
    };
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchRentals = async () => {
      try {
        if (activeTab === 'myRentals') {
          const rentals = await rentalService.getUserRentals();
          setMyRentals(rentals.map(mapRentalRequestToRental));
        } else {
          const rentals = await rentalService.getUserListingsRentals();
          setMyListingsRentals(rentals.map(mapRentalRequestToRental));
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
      if (dateRange.from && new Date(rental.startDate) < dateRange.from) return false;
      if (dateRange.to && new Date(rental.endDate) > dateRange.to) return false;
      return true;
    });
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priceHighToLow':
          return b.totalCost - a.totalCost;
        case 'priceLowToHigh':
          return a.totalCost - b.totalCost;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="py-8 mt-8 mb-16">
        <div className="py-6 px-20">
          {/* Tab navigation */}
          <RentalsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Status filter & search */}
          <RentalsStatusFilter
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
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
