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
    <div className="w-full p-4 bg-green-50/50 backdrop-blur-lg rounded-xl shadow-sm border border-green-300">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-green-900">{title}</h2>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      
      {rentals.length > 0 ? (
        <div className="relative h-64">
          {rentals.map((rental, index) => (
            <div 
              key={rental.id}
              className={`absolute w-full transition-all duration-300 ease-out 
                ${index === 0 ? 'z-30' : 'z-20'} 
                hover:z-40 hover:scale-105 hover:shadow-lg`
              }
              style={{ 
                top: `${index * 12}px`,
                transform: `rotate(${index * -0.5}deg)`,
                marginLeft: `${index * 8}px`
              }}
            >
              <RentalCard
                rental={rental}
                userRole={userRole}
                onViewDetails={onViewDetails}
                onStatusAction={onStatusAction}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-green-50/30 rounded-lg text-center">
          <PackageOpen className="mx-auto h-8 w-8 text-green-300 mb-2" />
          <p className="text-green-600 text-sm">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default RentalSection;