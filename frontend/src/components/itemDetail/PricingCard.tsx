import React, { useState } from 'react';
import { Clock, ShieldCheck, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { DurationUnit, PricingTier } from '@/types/listings';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';

interface PricingCardProps {
  pricingTiers: PricingTier[];
  minRentalPeriod: number;
  maxRentalPeriod: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  pricingTiers,
  minRentalPeriod,
  maxRentalPeriod,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRequestRental = () => {
    if (!user?.profileComplete) {
      setShowProfileModal(true);
      return;
    }
    navigate(`/request-rental/${pricingTiers[0].productId}`, { 
      state: { 
        product: {
          id: pricingTiers[0].productId,
          basePrice: pricingTiers[0].price,
          durationUnit: pricingTiers[0].durationUnit,
          minRentalPeriod,
          maxRentalPeriod,
          securityDeposit: pricingTiers[0].securityDeposit
        }
      }
    });
  };

  return (
    <div className="sticky top-24 h-fit">
      <div className="bg-gradient-to-b from-white to-leaf-50 rounded-lg border border-gray-200 shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-6 pb-3 border-b">Pricing Details</h2>
        <div className="space-y-4">
          {pricingTiers.map((tier, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <span className="font-medium">
                  {tier.durationUnit.charAt(0).toUpperCase() + tier.durationUnit.slice(1)}ly
                </span>
                {tier.maxPeriod && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Max: {tier.maxPeriod} {tier.durationUnit}{tier.maxPeriod > 1 ? 's' : ''})
                  </span>
                )}
              </div>
              <span className="font-medium">৳{tier.price}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <div className="text-sm text-gray-600">
            <p>Minimum rental period: {minRentalPeriod} {pricingTiers[0]?.durationUnit}s</p>
            <p>Maximum rental period: {maxRentalPeriod} {pricingTiers[0]?.durationUnit}s</p>
          </div>
        </div>
        <div className="pt-4 border-t">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Security Deposit</h3>
            <div className="flex items-center text-gray-700">
              <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
              <Banknote className="h-4 w-4 mr-1 text-gray-600" />
              <span>{pricingTiers[0]?.securityDeposit}</span>
              <span className="text-xs text-gray-500 ml-2">(Refundable)</span>
            </div>
          </div>

          <Button
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
            onClick={handleRequestRental}
          >
            Request Rental Now
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            No upfront payment required. Vhara handles the logistics.
          </p>
        </div>
      </div>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Complete Your Profile"
        description="You need to complete your profile before you can request rentals."
      />
    </div>
  );
};

export default PricingCard; 