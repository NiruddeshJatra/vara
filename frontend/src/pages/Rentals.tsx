
import { useState } from 'react';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import RentalsTabs from '@/components/rentals/RentalsTabs';
import RentalsStatusFilter from '@/components/rentals/RentalsStatusFilter';
import MyRentalsTab from '@/components/rentals/MyRentalsTab';
import MyListingsRentalsTab from '@/components/rentals/MyListingsRentalsTab';
import RentalDetailModal from '@/components/rentals/RentalDetailModal';
import { useToast } from '@/hooks/use-toast';
import '../styles/main.css';

export type RentalStatus = 'all' | 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';

export interface Rental {
  id: number;
  itemId: number;
  itemTitle: string;
  itemImage: string;
  itemCategory: string;
  ownerName: string;
  ownerImage: string;
  renterName: string;
  renterImage: string;
  startTime: string;
  endTime: string;
  status: RentalStatus;
  totalPrice: number;
  basePrice: number;
  securityDeposit: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  ownerRating?: number;
  renterRating?: number;
}

const Rentals = () => {
  const [activeTab, setActiveTab] = useState<'myRentals' | 'myListingsRentals'>('myRentals');
  const [statusFilter, setStatusFilter] = useState<RentalStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const { toast } = useToast();

  // Sample data for now (in a real app, this would come from an API)
  const sampleRentals: Rental[] = [
    {
      id: 1,
      itemId: 101,
      itemTitle: "Professional DSLR Camera",
      itemImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      itemCategory: "Electronics",
      ownerName: "Sarah Johnson",
      ownerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      renterName: "Alex Smith",
      renterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      startTime: "2025-07-10T09:00:00Z",
      endTime: "2025-07-15T18:00:00Z",
      status: "in_progress",
      totalPrice: 250,
      basePrice: 50,
      securityDeposit: 200,
      createdAt: "2025-07-01T14:30:00Z",
      updatedAt: "2025-07-10T09:00:00Z"
    },
    {
      id: 2,
      itemId: 102,
      itemTitle: "Mountain Bike",
      itemImage: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      itemCategory: "Outdoor",
      ownerName: "Mike Peterson",
      ownerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      renterName: "Alex Smith",
      renterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      startTime: "2025-07-20T09:00:00Z",
      endTime: "2025-07-22T18:00:00Z",
      status: "accepted",
      totalPrice: 80,
      basePrice: 40,
      securityDeposit: 100,
      createdAt: "2025-07-05T11:20:00Z",
      updatedAt: "2025-07-05T14:30:00Z"
    },
    {
      id: 3,
      itemId: 103,
      itemTitle: "Camping Tent (4-Person)",
      itemImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      itemCategory: "Outdoor",
      ownerName: "Lisa Chen",
      ownerImage: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      renterName: "Alex Smith",
      renterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      startTime: "2025-07-01T10:00:00Z",
      endTime: "2025-07-05T16:00:00Z",
      status: "pending",
      totalPrice: 120,
      basePrice: 30,
      securityDeposit: 50,
      createdAt: "2025-06-25T09:15:00Z",
      updatedAt: "2025-06-25T09:15:00Z"
    },
    {
      id: 4,
      itemId: 104,
      itemTitle: "Toolkit Set (Professional)",
      itemImage: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      itemCategory: "Tools",
      ownerName: "Daniel Brown",
      ownerImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      renterName: "Alex Smith",
      renterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      startTime: "2025-06-05T09:00:00Z",
      endTime: "2025-06-07T18:00:00Z",
      status: "cancelled",
      totalPrice: 60,
      basePrice: 30,
      securityDeposit: 0,
      createdAt: "2025-06-01T10:45:00Z",
      updatedAt: "2025-06-02T14:20:00Z"
    },
    {
      id: 5,
      itemId: 105,
      itemTitle: "Lawn Mower",
      itemImage: "https://images.unsplash.com/photo-1608624076549-9e27ec6fd229?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      itemCategory: "Garden",
      ownerName: "James Wilson",
      ownerImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      renterName: "Alex Smith",
      renterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      startTime: "2025-06-10T08:00:00Z",
      endTime: "2025-06-11T18:00:00Z",
      status: "completed",
      totalPrice: 45,
      basePrice: 45,
      securityDeposit: 50,
      createdAt: "2025-06-08T15:30:00Z",
      updatedAt: "2025-06-11T18:30:00Z"
    },
  ];

  // Filter rentals based on active filters
  const filteredRentals = sampleRentals.filter(rental => {
    // Status filter
    if (statusFilter !== 'all' && rental.status !== statusFilter) return false;

    // Search term filter
    if (searchTerm && !rental.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())) return false;

    // Date range filter
    if (dateRange.from && new Date(rental.startTime) < dateRange.from) return false;
    if (dateRange.to && new Date(rental.endTime) > dateRange.to) return false;

    return true;
  });

  // Sort rentals based on selected sort option
  const sortedRentals = [...filteredRentals].sort((a, b) => {
    switch (sortOption) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'priceHighToLow':
        return b.totalPrice - a.totalPrice;
      case 'priceLowToHigh':
        return a.totalPrice - b.totalPrice;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleViewRentalDetails = (rental: Rental) => {
    setSelectedRental(rental);
  };

  const handleCloseRentalDetails = () => {
    setSelectedRental(null);
  };

  const handleStatusAction = (rentalId: number, action: string) => {
    // In a real app, this would call an API to update the rental status
    toast({
      title: "Action taken",
      description: `${action} action for rental #${rentalId} was successful.`,
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

          {/* Tab content */}
          {activeTab === 'myRentals' ? (
            <MyRentalsTab
              rentals={sortedRentals}
              onViewDetails={handleViewRentalDetails}
              onStatusAction={handleStatusAction}
            />
          ) : (
            <MyListingsRentalsTab
              rentals={sortedRentals}
              onViewDetails={handleViewRentalDetails}
              onStatusAction={handleStatusAction}
            />
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
