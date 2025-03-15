
import { Rental } from "@/pages/Rentals";
import RentalCard from "./RentalCard";
import { PackageOpen } from "lucide-react";

interface RentalSectionProps {
  title: string;
  description: string;
  rentals: Rental[];
  userRole: 'renter' | 'owner';
  onViewDetails: (rental: Rental) => void;
  onStatusAction: (rentalId: number, action: string) => void;
  emptyMessage: string;
}

const RentalSection = ({ 
  title, 
  description, 
  rentals, 
  userRole,
  onViewDetails,
  onStatusAction,
  emptyMessage
}: RentalSectionProps) => {
  return (
    <section>
      <div className="text-center mb-6 p-6">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      
      {rentals.length > 0 ? (
        <div className="space-y-4">
          {rentals.map(rental => (
            <RentalCard
              key={rental.id}
              rental={rental}
              userRole={userRole}
              onViewDetails={onViewDetails}
              onStatusAction={onStatusAction}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <PackageOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
};

export default RentalSection;
