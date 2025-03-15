
import { Rental } from "@/pages/Rentals";
import RentalSection from "./RentalSection";

interface MyListingsRentalsTabProps {
  rentals: Rental[];
  onViewDetails: (rental: Rental) => void;
  onStatusAction: (rentalId: number, action: string) => void;
}

const MyListingsRentalsTab = ({ rentals, onViewDetails, onStatusAction }: MyListingsRentalsTabProps) => {
  // Filter rentals by status
  const activeRentals = rentals.filter(rental => rental.status === 'in_progress');
  const upcomingRentals = rentals.filter(rental => rental.status === 'accepted');
  const pendingRentals = rentals.filter(rental => rental.status === 'pending');
  const historyRentals = rentals.filter(rental => 
    ['completed', 'rejected', 'cancelled'].includes(rental.status)
  );

  return (
    <div className="space-y-10">
      {/* Active Rentals */}
      <RentalSection
        title="Active Rentals"
        description="Your items currently being rented"
        rentals={activeRentals}
        userRole="owner"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage="You don't have any items currently being rented."
      />
      
      {/* Upcoming Rentals */}
      <RentalSection
        title="Upcoming Rentals"
        description="Your items that will be rented soon"
        rentals={upcomingRentals}
        userRole="owner"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage="You don't have any upcoming rentals for your items."
      />
      
      {/* Pending Requests */}
      <RentalSection
        title="Pending Requests"
        description="Requests to rent your items"
        rentals={pendingRentals}
        userRole="owner"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage="You don't have any pending rental requests for your items."
      />
      
      {/* Rental History */}
      <RentalSection
        title="Rental History"
        description="Past rentals of your items"
        rentals={historyRentals}
        userRole="owner"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage="Your items' rental history will appear here once you complete a rental."
      />
    </div>
  );
};

export default MyListingsRentalsTab;
