import {
  ChevronLeft,
  ChevronRight,
  Calculator,
  Clock,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RentalRequestFormData } from "@/types/rentals";
import { Product } from "@/types/listings";
import { useTranslation } from "react-i18next";
import { formatDateLong } from "@/utils/formatDate";
import { calculateEndDate } from "@/utils/validations/rental.validations";

interface Props {
  product: Product;
  formData: RentalRequestFormData;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const PriceCalculationStep = ({
  product,
  formData,
  onNext,
  onPrev,
  loading,
}: Props) => {
  const { t } = useTranslation();
  const selectedTier = product.pricing_tiers?.find(
    (tier) => tier.duration_unit === formData.duration_unit
  ) || { duration_unit: "day", price: 0, max_period: 30 };

  // Mirrors the backend pricing snapshot: unit_price, base_cost,
  // security_deposit (service fee is deducted from the owner's payout,
  // never charged to the renter)
  const basePrice = selectedTier.price || 0;
  const duration = formData.duration || 0;
  const baseCost = basePrice * duration;
  const security_deposit = Number(product.security_deposit) || 0;
  const duration_unit = formData.duration_unit || "day";

  const formatDate = (date: Date | null) => {
    if (!date) return t('requestRental.notSet');
    return formatDateLong(date);
  };

  // Get end date using the shared function
  const getEndDate = () => {
    if (!formData.start_date) return t('requestRental.notSet');
    const end_date = calculateEndDate(
      formData.start_date,
      duration,
      duration_unit
    );
    return formatDateLong(end_date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h4 className="text-md md:text-xl font-semibold text-green-800">
        {t('requestRental.priceCalculation')}
      </h4>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50/50 rounded-lg border border-gray-200 p-4 space-y-3">
          <h5 className="text-md md:text-lg font-medium text-gray-800 flex items-center">
            <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5 text-green-700" />
            {t('rental.modal.rentalPeriod')}
          </h5>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('listings.startDate')}:</span>
              <span className="font-medium text-gray-900">
                {formatDate(formData.start_date)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('listings.endDate')}:</span>
              <span className="font-medium text-gray-900">{getEndDate()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('rental.modal.duration')}:</span>
              <span className="font-medium text-gray-900">
                {duration} {t('rental.units.' + duration_unit, { count: duration })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-green-50/50 rounded-lg border border-gray-200 p-4 space-y-3">
          <h5 className="text-md md:text-lg font-medium text-gray-800 flex items-center">
            <Calculator className="mr-2 h-4 w-4 md:h-5 md:w-5 text-green-700" />
            {t('requestRental.costBreakdown')}
          </h5>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('requestRental.pricingTier')}:</span>
              <span className="font-medium text-gray-900">
                {t('rental.units.' + selectedTier.duration_unit, { count: 1 })} ({selectedTier.max_period} {t('requestRental.max')})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('rental.modal.basePrice')}:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(basePrice)} / {t('rental.units.' + duration_unit, { count: 1 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('requestRental.rentalCost')}:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(baseCost)}
              </span>
            </div>
            {security_deposit > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center">
                  <Shield className="h-3.5 w-3.5 mr-1 text-green-600" />
                  {t('listings.securityDeposit')}:
                </span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(security_deposit)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg border border-green-200 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-md md:text-lg font-semibold text-green-800">{t('requestRental.totalCost')}</h4>
            <p className="text-sm text-green-700">
              {t('requestRental.forDuration', { duration, unit: t('rental.units.' + duration_unit, { count: duration }) })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-800">
              {formatCurrency(baseCost)}
            </div>
            <p className="text-xs text-green-700">
              {security_deposit > 0
                ? t('requestRental.plusDeposit', { amount: formatCurrency(security_deposit) })
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 space-x-2">
        <Button
          variant="outline"
          className="border-green-300 hover:bg-green-50"
          onClick={onPrev}
          disabled={loading}
        >
          <ChevronLeft size={16} className="mr-1" /> {t('common.back')}
        </Button>

        <Button
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="mr-2">{t('common.processing')}</span>
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              {t('requestRental.continueAdditional')}{" "}
              <ChevronRight size={16} className="ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PriceCalculationStep;
