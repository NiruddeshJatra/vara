import React, { useState, useEffect, useRef } from 'react';
import { Clock, ShieldCheck, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { DurationUnit, PricingTier } from '@/types/listings';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';

interface PricingCardProps {
  pricingTiers: PricingTier[];
  maxRentalPeriod: number;
  securityDeposit?: number | null;
  productId?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  pricingTiers,
  maxRentalPeriod,
  securityDeposit = null,
  productId = 'unknown',
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Set up the intersection observer to detect when the card comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the card is visible on screen (enters viewport)
        if (entry.isIntersecting) {
          setIsSticky(true);
        } else if (entry.boundingClientRect.top > 0) {
          // Reset stickiness if scrolling back up to the top
          setIsSticky(false);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleRequestRental = () => {
    if (!user?.profileComplete) {
      setShowProfileModal(true);
      return;
    }
    navigate(`/request-rental/${productId}`, { 
      state: { 
        product: {
          id: productId,
          basePrice: pricingTiers[0].price,
          durationUnit: pricingTiers[0].durationUnit,
          maxRentalPeriod,
          securityDeposit: securityDeposit || 0
        }
      }
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
    <div 
      ref={cardRef}
      className={`${isSticky ? 'sticky top-24' : ''} h-fit transition-all duration-300`}
    >
      <div className="bg-gradient-to-b from-white to-leaf-50 rounded-lg border border-gray-200 shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-6 pb-3 border-b">Pricing Details</h2>
        <div className="space-y-4">
          {pricingTiers.map((tier, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <span className="font-medium">
                  {formatDurationUnit(tier.durationUnit)}
                </span>
                {tier.maxPeriod && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Max: {tier.maxPeriod} {tier.durationUnit}{tier.maxPeriod > 1 ? 's' : ''})
                  </span>
                )}
              </div>
              <span className="font-semibold text-green-600 pr-4">৳{tier.price}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-6 mt-6 border-t">
          {securityDeposit ? (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Security Deposit</h3>
                <div className="flex items-center text-gray-700">
                  <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
                  <Banknote className="h-4 w-4 mr-1 text-gray-600" />
                  <span className="text-green-500 pr-4">{securityDeposit}</span>
                </div>
              </div>
            </div>
          ) : null}

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