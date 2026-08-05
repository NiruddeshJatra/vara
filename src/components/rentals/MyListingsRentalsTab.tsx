import { Rental } from "@/types/rentals";
import { RentalStatus } from "@/constants/rental";
import RentalSection from "./RentalSection";
import { useTranslation } from "react-i18next";

interface MyListingsRentalsTabProps {
  rentals: Rental[];
  onViewDetails: (rental: Rental) => void;
  onStatusAction: (rentalId: string, action: string) => void;
}

const MyListingsRentalsTab = ({ rentals, onViewDetails, onStatusAction }: MyListingsRentalsTabProps) => {
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
        description={t('rental.sections.ownerActiveDesc')}
        rentals={activeRentals}
        userRole="owner"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage={t('rental.sections.ownerActiveEmpty')}
      />
      
      {/* Pending Requests */}
      <RentalSection
        title={t('rental.sections.pendingTitle')}
        description={t('rental.sections.ownerPendingDesc')}
        rentals={pendingRentals}
        userRole="owner"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage={t('rental.sections.ownerPendingEmpty')}
      />
      
      {/* Rental History */}
      <RentalSection
        title={t('rental.sections.historyTitle')}
        description={t('rental.sections.ownerHistoryDesc')}
        rentals={historyRentals}
        userRole="owner"
        onViewDetails={onViewDetails}
        onStatusAction={onStatusAction}
        emptyMessage={t('rental.sections.ownerHistoryEmpty')}
      />
    </div>
  );
};

export default MyListingsRentalsTab;
