import { Rental } from "@/types/rentals";
import { RentalStatus } from "@/constants/rental";
import RentalSection from "./RentalSection";

interface MyListingsRentalsTabProps {
  rentals: Rental[];
  onViewDetails: (rental: Rental) => void;
  onStatusAction: (rentalId: number, action: string) => void;
}

const MyListingsRentalsTab = ({ rentals, onViewDetails, onStatusAction }: MyListingsRentalsTabProps) => {
  // Filter rentals by status
  const activeRentals = rentals.filter(rental => rental.status === RentalStatus.APPROVED);
  const pendingRentals = rentals.filter(rental => rental.status === RentalStatus.PENDING);
  const historyRentals = rentals.filter(rental => 
    [RentalStatus.COMPLETED, RentalStatus.REJECTED, RentalStatus.CANCELLED].includes(rental.status)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-2 sm:p-4 md:p-6">
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
