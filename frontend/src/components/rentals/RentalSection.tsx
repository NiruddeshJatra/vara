import { Rental } from "@/types/rentals";
import RentalCard from "./RentalCard";
import { PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [animatedRentals, setAnimatedRentals] = useState<Rental[]>([]);

  // Add animation by staggering the appearance of rentals
  useEffect(() => {
    setAnimatedRentals([]); // Reset to trigger animation
    
    // Stagger the animation
    const timer = setTimeout(() => {
      setAnimatedRentals(rentals);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [rentals]);

  return (
    <div className="w-full p-4 sm:p-6 bg-white/50 backdrop-blur-lg rounded-xl shadow-sm border">
      <div className="mb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-green-800 mb-1">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{description}</p>
      </div>
      
      {rentals.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {rentals.map((rental, index) => (
            <div 
              key={rental.id}
              className={`transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${
                animatedRentals.includes(rental) ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ 
                animationDelay: `${index * 150}ms`,
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