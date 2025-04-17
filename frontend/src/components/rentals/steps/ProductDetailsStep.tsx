// components/rentals/steps/ProductDetailsStep.tsx
import { useState, useEffect } from "react";
import {
  AlertCircle,
  ChevronRight,
  MapPin,
  Clock,
  Shield,
  Banknote,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { RentalRequestFormData, RentalErrors } from "@/types/rentals";
import { Product } from "@/types/listings";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORY_DISPLAY,
  PRODUCT_TYPE_DISPLAY,
} from "@/constants/productTypes";
import { DurationUnit } from "@/constants/rental";
import { format } from "date-fns";

interface Props {
  product: Product;
  formData: RentalRequestFormData;
  errors: RentalErrors;
  onChange: (data: Partial<RentalRequestFormData>) => void;
  onNext: () => void;
  loading?: boolean;
}

const ProductDetailsStep = ({
  product,
  formData,
  errors,
  onChange,
  onNext,
  loading,
}: Props) => {
  const pricingTiers = product.pricingTiers || [];

  // State to keep track of the selected pricing tier
  const [selectedTierIndex, setSelectedTierIndex] = useState(
    pricingTiers.findIndex(
      (tier) => tier.durationUnit === formData.durationUnit
    ) > -1
      ? pricingTiers.findIndex(
          (tier) => tier.durationUnit === formData.durationUnit
        )
      : 0
  );

  // State to control calendar visibility
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const selectedTier =
    pricingTiers.length > 0
      ? pricingTiers[selectedTierIndex]
      : { durationUnit: "day" as DurationUnit, price: 0, maxPeriod: 30 };

  const handleChangeTier = (index: number) => {
    setSelectedTierIndex(index);
    onChange({
      durationUnit: pricingTiers[index].durationUnit,
      duration: 1, // Reset duration when changing unit
    });
  };

  // Calculate the end date based on selected duration
  const calculateEndDate = () => {
    if (!formData.startDate) return null;

    const endDate = new Date(formData.startDate);

    switch (selectedTier.durationUnit) {
      case "day":
        endDate.setDate(endDate.getDate() + formData.duration);
        break;
      case "week":
        endDate.setDate(endDate.getDate() + formData.duration * 7);
        break;
      case "month":
        endDate.setMonth(endDate.getMonth() + formData.duration);
        break;
    }

    return endDate;
  };

  const endDate = calculateEndDate();

  useEffect(() => {
    // Initialize with default values if not already set
    if (!formData.durationUnit && pricingTiers.length > 0) {
      onChange({
        durationUnit: pricingTiers[0].durationUnit,
      });
    }
  }, [formData.durationUnit, pricingTiers, onChange]);

  // Add a handler to clear errors when input changes
  const handleInputChange = (data: Partial<RentalRequestFormData>) => {
    onChange(data);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h4 className="text-md md:text-xl font-semibold text-green-800">
        Item Details
      </h4>

      {/* Product Information Card */}
      <div className="bg-gradient-to-br from-white to-lime-100 rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 mb-6">
          {/* Product Image */}
          <div className="min-w-[120px] w-full md:w-1/3 md:max-w-[280px]">
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[0].image
                  : "/placeholder-image.jpg"
              }
              alt={product.title}
              className="w-full h-[160px] object-cover rounded-md"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-medium text-gray-800">
              {product.title}
            </h3>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-100"
              >
                {CATEGORY_DISPLAY[product.category] || product.category}
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-100"
              >
                {PRODUCT_TYPE_DISPLAY[product.productType] ||
                  product.productType}
              </Badge>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center">
                <MapPin size={14} className="text-green-600 mr-1.5" />
                <span className="text-gray-700">
                  {product.location || "Location not specified"}
                </span>
              </div>

              {product.securityDeposit && (
                <div className="flex items-center">
                  <Shield size={14} className="text-green-600 mr-1.5" />
                  <span className="text-gray-700">
                    Security Deposit: {product.securityDeposit} Taka
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-5">
          {/* Pricing Tier Selection */}
          <div>
            <label className="block text-base font-medium text-gray-800 mb-3">
              Select Pricing Option
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pricingTiers.map((tier, index) => (
                <div
                  key={index}
                  onClick={() => handleChangeTier(index)}
                  className={`p-4 rounded-md cursor-pointer border transition flex flex-col ${
                    selectedTierIndex === index
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-gray-200 hover:border-green-300 bg-white"
                  }`}
                >
                  <div className="font-medium text-md sm:text-lg flex items-center mb-1">
                    <Banknote size={16} className="text-green-600 mr-1.5" />
                    {tier.price} Taka
                  </div>
                  <div className="text-gray-700">per {tier.durationUnit}</div>
                  {tier.maxPeriod && (
                    <div className="text-xs text-gray-500 mt-1">
                      Maximum: {tier.maxPeriod} {tier.durationUnit}s
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rental Duration Section */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Start Date */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Rental Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  value={
                    formData.startDate
                      ? format(formData.startDate, "MMMM d, yyyy")
                      : ""
                  }
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  readOnly
                  placeholder="Select start date"
                  className={`pl-4 h-9 sm:h-10 text-sm w-full rounded-md border ${
                    errors.startDate
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-green-300 focus:border-green-500 focus:ring-green-500"
                  } focus:outline-none focus:ring-1 focus:ring-green-500`}
                />
                {isCalendarOpen && (
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => {
                      handleInputChange({ startDate: date });
                    }}
                    className="rounded-md border border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white absolute top-full left-0 mt-2 z-10"
                    classNames={{
                      day_selected:
                        "bg-green-600 text-white hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white rounded-md",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                      day_range_end: "bg-green-600 text-white",
                      day_range_middle: "bg-green-600 text-white",
                    }}
                  />
                )}
              </div>
              {errors.startDate ? (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.startDate}
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Choose when you want to start renting
                </p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Rental Duration <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <div className="relative w-full">
                  <input
                    type="number"
                    value={formData.duration || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      onChange({
                        duration: value === "" ? 0 : parseInt(value),
                      });
                    }}
                    min={1}
                    className={`pl-9 pr-3 py-2 h-9 sm:h-10 text-sm w-full rounded-md border ${
                      errors.duration ? "border-red-300" : "border-green-300"
                    } focus:outline-none focus:ring-1`}
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Clock size={16} />
                  </span>
                </div>
                <span className="text-sm sm:text-md ml-2 text-gray-700">
                  {selectedTier.durationUnit}(s)
                </span>
              </div>
              {errors.duration ? (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.duration}
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedTier.maxPeriod
                    ? `Maximum ${selectedTier.maxPeriod} ${selectedTier.durationUnit}s`
                    : ""}
                </p>
              )}
            </div>
          </div>

          {/* Rental Period Summary */}
          {formData.startDate && formData.duration > 0 && (
            <div className="bg-green-50 p-3 rounded-md border border-green-100 mt-3">
              <h4 className="text-sm font-medium text-green-800 mb-2">
                Rental Period Summary
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-600">Start Date:</span>
                  <span className="ml-1.5 text-green-700 font-medium">
                    {format(formData.startDate, "MMMM d, yyyy")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">End Date:</span>
                  <span className="ml-1.5 text-green-700 font-medium">
                    {endDate ? format(endDate, "MMMM d, yyyy") : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-1.5 text-green-700 font-medium">
                    {formData.duration} {selectedTier.durationUnit}
                    {formData.duration > 1 ? "s" : ""}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="ml-1.5 text-green-700 font-medium">
                    {selectedTier.price * formData.duration} Taka
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 sm:p-4 rounded-lg border border-amber-200 mt-4">
        <h3 className="text-xs sm:text-sm font-medium text-amber-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
        <Lightbulb size={14} className="text-amber-600 sm:w-4 sm:h-4" />
          Rental Tips
        </h3>
        <ul className="text-xs/5 sm:text-sm/6 text-amber-700 space-y-0.5 sm:space-y-1 list-disc pl-4 sm:pl-5">
          <li>Choose dates when you'll be available to pick up and return the item</li>
          <li>Consider any setup or learning time you might need</li>
          <li>Check the item's availability calendar for open slots</li>
          <li>Book for the full duration you need to avoid extensions</li>
        </ul>
      </div>

      <div className="flex justify-end pt-4">
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
              Continue to Price Details{" "}
              <ChevronRight size={16} className="ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailsStep;
