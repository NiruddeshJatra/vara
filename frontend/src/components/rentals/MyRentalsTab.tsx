
import { Rental } from "@/pages/Rentals";
import RentalSection from "./RentalSection";

interface MyRentalsTabProps {
  rentals: Rental[];
  onViewDetails: (rental: Rental) => void;
  onStatusAction: (rentalId: number, action: string) => void;
}

const MyRentalsTab = ({ rentals, onViewDetails, onStatusAction }: MyRentalsTabProps) => {
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
        description="Items you are currently renting"
        rentals={activeRentals}
        userRole="renter"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage="You don't have any active rentals. Browse available items to rent something."
      />
      
      {/* Upcoming Rentals */}
      <RentalSection
        title="Upcoming Rentals"
        description="Items you will be renting soon"
        rentals={upcomingRentals}
        userRole="renter"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage="You don't have any upcoming rentals."
      />
      
      {/* Pending Requests */}
      <RentalSection
        title="Pending Requests"
        description="Rental requests awaiting owner approval"
        rentals={pendingRentals}
        userRole="renter"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage="You don't have any pending rental requests."
      />
      
      {/* Rental History */}
      <RentalSection
        title="Rental History"
        description="Your past rentals"
        rentals={historyRentals}
        userRole="renter"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage="Your rental history will appear here once you complete a rental."
      />
    </div>
  );
};

export default MyRentalsTab;
