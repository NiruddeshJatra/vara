import {
  ChevronLeft,
  ChevronRight,
  Calculator,
  Clock,
  Shield,
  BadgePercent,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RentalRequestFormData } from "@/types/rentals";
import { Product } from "@/types/listings";
import { format } from "date-fns";
import { calculateEndDate } from "@/utils/validations/rental.validations";

interface Props {
  product: Product;
  formData: RentalRequestFormData & {
    baseCost: number;
    serviceFee: number;
    securityDeposit: number;
    totalCost: number;
  };
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
  const selectedTier = product.pricingTiers?.find(
    (tier) => tier.durationUnit === formData.durationUnit
  ) || { durationUnit: "day", price: 0, maxPeriod: 30 };

  const basePrice = selectedTier.price || 0;
  const duration = formData.duration || 0;
  const baseCost = basePrice * duration;
  // Service fee is now deducted from owner's earnings, not added to renter's price
  const serviceFee = Math.round(baseCost * 0.08); // 8% service fee
  const securityDeposit = product.securityDeposit || 0;
  // Total cost for renter does NOT include service fee
  const totalCost = baseCost; // Only base cost for renter
  const durationUnit = formData.durationUnit || "day";

  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return format(date, "MMMM dd, yyyy");
  };

  // Get end date using the shared function
  const getEndDate = () => {
    if (!formData.startDate) return "Not set";
    const endDate = calculateEndDate(
      formData.startDate,
      duration,
      durationUnit
    );
    return format(endDate, "MMMM dd, yyyy");
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
        Price Calculation
      </h4>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50/50 rounded-lg border border-gray-200 p-4 space-y-3">
          <h5 className="text-md md:text-lg font-medium text-gray-800 flex items-center">
            <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5 text-green-700" />
            Rental Period
          </h5>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium text-gray-900">
                {formatDate(formData.startDate)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">End Date:</span>
              <span className="font-medium text-gray-900">{getEndDate()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-900">
                {duration} {durationUnit}
                {duration > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-green-50/50 rounded-lg border border-gray-200 p-4 space-y-3">
          <h5 className="text-md md:text-lg font-medium text-gray-800 flex items-center">
            <Calculator className="mr-2 h-4 w-4 md:h-5 md:w-5 text-green-700" />
            Cost Breakdown
          </h5>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pricing Tier:</span>
              <span className="font-medium text-gray-900">
                {selectedTier.durationUnit} ({selectedTier.maxPeriod} max)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Price:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(basePrice)} per {durationUnit}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rental Cost:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(baseCost)}
              </span>
            </div>
            {securityDeposit > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center">
                  <Shield className="h-3.5 w-3.5 mr-1 text-green-600" />
                  Security Deposit:
                </span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(securityDeposit)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-lg border border-green-200 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-md md:text-lg font-semibold text-green-800">Total Cost</h4>
            <p className="text-sm text-green-700">
              For {duration} {durationUnit}
              {duration > 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-800">
              {formatCurrency(totalCost)}
            </div>
            <p className="text-xs text-green-700">
              {securityDeposit > 0
                ? `(Includes refundable ${formatCurrency(
                    securityDeposit
                  )} deposit)`
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
          <ChevronLeft size={16} className="mr-1" /> Back
        </Button>

        <Button
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="mr-2">Processing</span>
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Continue to Additional Info{" "}
              <ChevronRight size={16} className="ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PriceCalculationStep;
