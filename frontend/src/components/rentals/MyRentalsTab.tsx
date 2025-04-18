import { Rental } from "@/types/rentals";
import { RentalStatus } from "@/constants/rental";
import RentalSection from "./RentalSection";

interface MyRentalsTabProps {
  rentals: Rental[];
  onViewDetails: (rental: Rental) => void;
  onStatusAction: (rentalId: number, action: string) => void;
}

const MyRentalsTab = ({ rentals, onViewDetails, onStatusAction }: MyRentalsTabProps) => {
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
        description="Items you are currently renting"
        rentals={activeRentals}
        userRole="renter"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage="You don't have any active rentals. Browse available items to rent something."
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
