// components/rentals/RentalRequestStepper.tsx
import { useState } from 'react';
import ProductDetailsStep from './steps/ProductDetailsStep';
import PriceCalculationStep from './steps/PriceCalculationStep';
import AdditionalDetailsStep from './steps/AdditionalDetailsStep';
import ConfirmationStep from './steps/ConfirmationStep';
import { FormErrors, DurationUnit, AvailabilityPeriod, Product, RentalRequestFormData } from '@/types/listings';

interface Props {
  product: Product;
}

const RentalRequestStepper = ({ product }: Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RentalRequestFormData>({
    startDate: null,
    duration: product.minRentalPeriod,
    purpose: '',
    notes: '',
    pickupMethod: 'self',
    deliveryAddress: '',
    deliveryTime: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const calculateTotalCost = () => {
    const baseCost = product.basePrice * formData.duration;
    const serviceFee = baseCost * 0.05;
    const securityDeposit = product.securityDeposit || 0;
    return {
      totalCost: baseCost + serviceFee + securityDeposit,
      serviceFee,
      securityDeposit,
    };
  };

  const validateStep = () => {
    const newErrors: FormErrors = {};
    switch(currentStep) {
      case 1:
        if (!formData.startDate) {
          newErrors.startDate = 'Start date is required';
        } else if (formData.startDate < new Date()) {
          newErrors.startDate = 'Start date must be in the future';
        }
        if (formData.duration < product.minRentalPeriod) {
          newErrors.duration = `Minimum ${product.minRentalPeriod} ${product.durationUnit}s`;
        }
        if (product.maxRentalPeriod && formData.duration > product.maxRentalPeriod) {
          newErrors.duration = `Maximum ${product.maxRentalPeriod} ${product.durationUnit}s`;
        }
        break;
      case 3:
        if (!formData.purpose) newErrors.purpose = 'Purpose is required';
        if (formData.pickupMethod === 'delivery' && !formData.deliveryAddress) {
          newErrors.deliveryAddress = 'Delivery address is required';
        }
        break;
    }
    return newErrors;
  };

  const handleNextStep = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length === 0) {
      if (currentStep === 3) {
        // Submit data here
        setCurrentStep(4);
      } else {
        setCurrentStep(prev => prev + 1);
      }
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const getStepLabel = (step: number) => {
    switch(step) {
      case 1: return "Rental Details";
      case 2: return "Price Review";
      case 3: return "Additional Info";
      case 4: return "Confirmation";
      default: return "";
    }
  };

  return (
    <main className="flex-grow pt-4 pb-4 md:pt-8 md:pb-8 lg:pt-16 lg:pb-16">
      <div className="bg-gradient-to-b from-green-300 to-lime-100/20 pt-4 md:pt-8 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-lime-50 rounded-lg shadow-subtle p-4 md:p-6 lg:p-8 overflow-hidden">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 mb-2">Request Rental</h1>
            <p className="text-sm md:text-base text-gray-500">Complete the following steps to request your rental</p>
          </div>

          {/* Stepper navigation */}
          <div className="mb-6 md:mb-8 lg:mb-12">
            <div className="flex justify-between items-center relative">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div className={`
                    w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold 
                    ${currentStep >= step ? 'bg-green-600 text-white ring-2 sm:ring-4 ring-green-100' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {step}
                  </div>
                  <div className="mt-1 text-center">
                    <span className={`text-[10px] sm:text-xs ${currentStep === step ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                      {getStepLabel(step)}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Connecting lines between steps */}
              <div className="absolute top-3 sm:top-3.5 md:top-4.5 left-0 right-0 h-1 bg-gray-200 -z-0">
                <div 
                  className="h-full bg-green-500 transition-all duration-300 ease-in-out" 
                  style={{ 
                    width: 
                      currentStep === 1 ? '0%' : 
                      currentStep === 2 ? '33.33%' : 
                      currentStep === 3 ? '66.66%' : 
                      '100%' 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-4 md:mt-8">
            {currentStep === 1 && (
              <ProductDetailsStep
                product={product}
                formData={formData}
                errors={errors}
                onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 2 && (
              <PriceCalculationStep
                product={product}
                formData={{ ...formData, ...calculateTotalCost() }}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
            )}

            {currentStep === 3 && (
              <AdditionalDetailsStep
                formData={formData}
                errors={errors}
                onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
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