// components/rentals/RentalRequestStepper.tsx
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ProductDetailsStep from "./steps/ProductDetailsStep";
import PriceCalculationStep from "./steps/PriceCalculationStep";
import AdditionalDetailsStep from "./steps/AdditionalDetailsStep";
import ConfirmationStep from "./steps/ConfirmationStep";
import { Product } from "@/types/listings";
import { RentalRequestFormData, RentalErrors } from "@/types/rentals";
import { DurationUnit } from "@/constants/rental";
import rentalService from "@/services/rental.service";
import {
  validateRentalDetails,
  validateAdditionalDetails,
} from "@/utils/validations/rental.validations";

interface Props {
  product: Product;
}

const RentalRequestStepper = ({ product }: Props) => {
  const pricingTier =
    product.pricingTiers && product.pricingTiers.length > 0
      ? product.pricingTiers[0]
      : { durationUnit: "day" as DurationUnit, price: 0, maxPeriod: 30 };

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RentalRequestFormData>({
    startDate: null,
    duration: 1,
    durationUnit: pricingTier.durationUnit,
    purpose: "",
    notes: "",
  });
  const [errors, setErrors] = useState<RentalErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Track overall form processing
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(
    null
  );

  const calculateTotalCost = () => {
    const selectedTier =
      product.pricingTiers?.find(
        (tier) => tier.durationUnit === formData.durationUnit
      ) || pricingTier;
    const baseCost = selectedTier.price * formData.duration;
    const serviceFee = Math.round(baseCost * 0.08); // 8% service fee
    const securityDeposit = product.securityDeposit || 0;
    const totalCost = baseCost + serviceFee; // Total doesn't include deposit as it's refundable

    return {
      baseCost,
      serviceFee,
      securityDeposit,
      totalCost,
    };
  };

  const validateStep = () => {
    const selectedTier =
      product.pricingTiers?.find(
        (tier) => tier.durationUnit === formData.durationUnit
      ) || pricingTier;

    switch (currentStep) {
      case 1:
        return validateRentalDetails(
          formData,
          selectedTier.maxPeriod,
          selectedTier.durationUnit,
          product.unavailableDates || []
        );
      case 3:
        return validateAdditionalDetails(formData);
      default:
        return {};
    }
  };

  const handleInputChange = (data: Partial<RentalRequestFormData>) => {
    // Clear errors for the fields that are being updated
    const newErrors = { ...errors };
    Object.keys(data).forEach((key) => {
      delete newErrors[key];
      delete newErrors.detail; // Clear any general errors as well
      // Clear any nested errors
      Object.keys(newErrors).forEach((errorKey) => {
        if (errorKey.startsWith(`${key}.`)) {
          delete newErrors[errorKey];
        }
      });
    });
    setErrors(newErrors);
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNextStep = async () => {
    // Prevent rapid submissions
    if (lastSubmissionTime && Date.now() - lastSubmissionTime < 2000) {
      return;
    }

    const stepErrors = validateStep();
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      setIsProcessing(true);

      if (currentStep === 2) {
        const costs = calculateTotalCost();
        setFormData((prev) => ({ ...prev, ...costs }));
      }

      if (currentStep === 3) {
        setIsSubmitting(true);
        setLastSubmissionTime(Date.now());

        try {
          await rentalService.createRentalRequest(product.id, formData);
          toast({
            title: "Success",
            description: "Your rental request has been submitted successfully!",
            variant: "default",
          });
          setCurrentStep(4);
          // Reset form after successful submission
          setFormData({
            startDate: null,
            duration: 1,
            durationUnit: "day",
            purpose: "",
            notes: "",
          });
          setErrors({});
        } catch (error: any) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to submit rental request. Please try again.";
          toast({
            title: "Request Failed",
            description: errorMessage,
            variant: "destructive",
          });
          // Update the form errors if they exist in the response
          if (error.response?.data?.errors) {
            setErrors(error.response.data.errors);
          }
        } finally {
          setIsSubmitting(false);
          setLastSubmissionTime(null);
        }
      } else {
        setCurrentStep((prev) => prev + 1);
      }
      setIsProcessing(false);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    // Clear all errors when going back
    setErrors({});
    setIsProcessing(false);
    setLastSubmissionTime(null);
    // Clear any step-specific form validation errors
    if (currentStep === 3) {
      setFormData((prev) => ({
        ...prev,
        purpose: "",
        notes: "",
      }));
    }
  };

  const getStepLabel = (step: number) => {
    switch (step) {
      case 1:
        return "Rental Details";
      case 2:
        return "Price Details";
      case 3:
        return "Additional Info";
      case 4:
        return "Confirmation";
      default:
        return "";
    }
  };

  return (
    <main className="flex-grow pt-12 sm:pt-12 md:pt-16 pb-4 sm:pb-8 md:pb-12">
      <div className="bg-gradient-to-b from-green-300 to-lime-100/20 pt-6 sm:pt-8 md:pt-10 px-3 sm:px-5 md:px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-white to-lime-50 rounded-lg shadow-subtle p-6 sm:p-8 md:p-10 overflow-hidden">
          <div className="text-center mb-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-1">
              Request Rental
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Complete the following steps to request your rental
            </p>
          </div>

          {/* Stepper navigation */}
          <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-12">
            <div className="flex justify-between items-center relative">
              {[1, 2, 3, 4].map((step, index) => (
                <div
                  key={step}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`
                    w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-bold 
                    ${
                      currentStep >= step
                        ? "bg-green-600 text-white ring-1 sm:ring-2 md:ring-4 ring-green-100"
                        : "bg-gray-200 text-gray-600"
                    }
                  `}
                  >
                    {step}
                  </div>
                  <div className="mt-1 text-center">
                    <span
                      className={`text-[8px] sm:text-[10px] md:text-xs ${
                        currentStep === step
                          ? "text-green-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {getStepLabel(step)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Connecting lines between steps */}
              <div className="absolute top-2.5 sm:top-3.5 md:top-4.5 left-0 right-0 h-1 bg-gray-200 -z-0">
                <div
                  className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                  style={{
                    width:
                      currentStep === 1
                        ? "0%"
                        : currentStep === 2
                        ? "33.33%"
                        : currentStep === 3
                        ? "66.66%"
                        : "100%",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Display validation errors from backend */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 space-y-2">
              {Object.entries(errors).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800 capitalize">
                        {key === "detail" ? "Error" : key.split("_").join(" ")}
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        {Array.isArray(value) ? value[0] : value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Steps */}
          <div className="mt-4 md:mt-8">
            {currentStep === 1 && (
              <ProductDetailsStep
                product={product}
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
                onNext={handleNextStep}
                loading={isProcessing}
              />
            )}

            {currentStep === 2 && (
              <PriceCalculationStep
                product={product}
                formData={{ ...formData, ...calculateTotalCost() }}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                loading={isProcessing}
              />
            )}

            {currentStep === 3 && (
              <AdditionalDetailsStep
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                loading={isSubmitting}
              />
            )}

            {currentStep === 4 && <ConfirmationStep />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default RentalRequestStepper;
