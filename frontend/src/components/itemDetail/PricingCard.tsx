import React, { useState } from 'react';
import { ShieldCheck, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@/types/listings';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';
import { toast } from '@/components/ui/use-toast';

import { useTranslation } from 'react-i18next';
interface PricingCardProps {
  product: Product;
}

const PricingCard: React.FC<PricingCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isOwner = !!user && product.owner?.id === user.id;

  const handleRequestRental = () => {
    if (!isAuthenticated) {
      toast({
        title: t('itemDetail.authRequiredTitle'),
        description: t('itemDetail.authRequiredDesc'),
        variant: 'destructive',
      });
      navigate('/auth/login/');
      return;
    }
    if (!user?.profile_completed) {
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
        return t('itemDetail.daily');
      case 'week':
        return t('itemDetail.weekly');
      case 'month':
        return t('itemDetail.monthly');
      default:
        return unit.charAt(0).toUpperCase() + unit.slice(1) + 'ly';
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-leaf-50 rounded-lg border border-gray-200 shadow-md p-6">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6 pb-2 sm:pb-3 border-b">{t('itemDetail.pricingDetails')}</h2>
      <div className="space-y-2 sm:space-y-4">
        {product.pricing_tiers?.map((tier, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <span className="font-medium text-xs sm:text-base">
                {formatDurationUnit(tier.duration_unit)}
              </span>
              {tier.max_period && (
                <span className="text-xs sm:text-sm text-gray-500 ml-2">
                  ({t('requestRental.max')}: {tier.max_period} {t('rental.units.' + tier.duration_unit, { count: tier.max_period })})
                </span>
              )}
            </div>
            <span className="font-semibold text-green-600 pr-2 sm:pr-4 text-xs sm:text-base">৳{tier.price}</span>
          </div>
        ))}
      </div>
      
      <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t">
        {product.security_deposit ? (
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-medium">{t('listings.securityDeposit')}</h3>
              <div className="flex items-center text-gray-700">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 mr-2" />
                <span className="text-green-500 pr-2 sm:pr-4 text-xs sm:text-base">৳{product.security_deposit}</span>
              </div>
            </div>
          </div>
        ) : null}

        {isOwner ? (
          <p className="text-xs sm:text-sm text-gray-600 text-center py-2 bg-gray-50 rounded-md">
            {t('itemDetail.ownListing')}
          </p>
        ) : (
          <>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 h-10 sm:h-12 text-xs sm:text-base"
              onClick={handleRequestRental}
            >
              {t('itemDetail.requestRentalNow')}
            </Button>
            <p className="text-xs text-gray-500 mt-2 sm:mt-3 text-center">
              {t('itemDetail.noUpfront')}
            </p>
          </>
        )}
      </div>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title={t('profileCompletion.title')}
        description={t('profileCompletion.rentDescription')}
      />
    </div>
  );
};

export default PricingCard;