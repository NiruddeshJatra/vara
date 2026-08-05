import { Rental } from "@/types/rentals";
import { RentalStatus } from "@/constants/rental";
import RentalSection from "./RentalSection";
import { useTranslation } from "react-i18next";

interface MyRentalsTabProps {
  rentals: Rental[];
  onViewDetails: (rental: Rental) => void;
  onStatusAction: (rentalId: string, action: string) => void;
}

const MyRentalsTab = ({ rentals, onViewDetails, onStatusAction }: MyRentalsTabProps) => {
  const { t } = useTranslation();
  // Filter rentals by status
  const activeRentals = rentals.filter(rental =>
    [RentalStatus.ACCEPTED, RentalStatus.IN_PROGRESS].includes(rental.status)
  );
  const pendingRentals = rentals.filter(rental => rental.status === RentalStatus.PENDING);
  const historyRentals = rentals.filter(rental => 
    [RentalStatus.COMPLETED, RentalStatus.REJECTED, RentalStatus.CANCELLED].includes(rental.status)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-2 sm:p-4 md:p-6">
      {/* Active Rentals */}
      <RentalSection
        title={t('rental.sections.activeTitle')}
        description={t('rental.sections.renterActiveDesc')}
        rentals={activeRentals}
        userRole="renter"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage={t('rental.sections.renterActiveEmpty')}
      />
      
      {/* Pending Requests */}
      <RentalSection
        title={t('rental.sections.pendingTitle')}
        description={t('rental.sections.renterPendingDesc')}
        rentals={pendingRentals}
        userRole="renter"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage={t('rental.sections.renterPendingEmpty')}
      />
      
      {/* Rental History */}
      <RentalSection
        title={t('rental.sections.historyTitle')}
        description={t('rental.sections.renterHistoryDesc')}
        rentals={historyRentals}
        userRole="renter"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage={t('rental.sections.renterHistoryEmpty')}
      />
    </div>
  );
};

export default MyRentalsTab;
