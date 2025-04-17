import React, { useState } from 'react';
import { ShieldCheck, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@/types/listings';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';

interface PricingCardProps {
  product: Product;
}

const PricingCard: React.FC<PricingCardProps> = ({ product }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRequestRental = () => {
    if (!user?.profileCompleted) {
      setShowProfileModal(true);
      return;
    }

    navigate(`/request-rental/${product.id}`, { 
      state: { product }
    });
  };

  // Format duration unit properly
  const formatDurationUnit = (unit: string): string => {
    switch (unit.toLowerCase()) {
      case 'day':
        return 'Daily';
      case 'week':
        return 'Weekly';
      case 'month':
        return 'Monthly';
      default:
        return unit.charAt(0).toUpperCase() + unit.slice(1) + 'ly';
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-leaf-50 rounded-lg border border-gray-200 shadow-md p-6">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6 pb-2 sm:pb-3 border-b">Pricing Details</h2>
      <div className="space-y-2 sm:space-y-4">
        {product.pricingTiers?.map((tier, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <span className="font-medium text-xs sm:text-base">
                {formatDurationUnit(tier.durationUnit)}
              </span>
              {tier.maxPeriod && (
                <span className="text-xs sm:text-sm text-gray-500 ml-2">
                  (Max: {tier.maxPeriod} {tier.durationUnit}{tier.maxPeriod > 1 ? 's' : ''})
                </span>
              )}
            </div>
            <span className="font-semibold text-green-600 pr-2 sm:pr-4 text-xs sm:text-base">৳{tier.price}</span>
          </div>
        ))}
      </div>
      
      <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t">
        {product.securityDeposit ? (
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-medium">Security Deposit</h3>
              <div className="flex items-center text-gray-700">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 mr-2" />
                <span className="text-green-500 pr-2 sm:pr-4 text-xs sm:text-base">৳{product.securityDeposit}</span>
              </div>
            </div>
          </div>
        ) : null}

        <Button
          className="w-full bg-green-600 hover:bg-green-700 h-10 sm:h-12 text-xs sm:text-base"
          onClick={handleRequestRental}
        >
          Request Rental Now
        </Button>
        <p className="text-xs text-gray-500 mt-2 sm:mt-3 text-center">
          No upfront payment required. Vara handles the logistics.
        </p>
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