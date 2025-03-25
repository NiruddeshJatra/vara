// components/rentals/RentalRequestStepper.tsx
import { useState } from 'react';
import ProductDetailsStep from './steps/ProductDetailsStep';
import PriceCalculationStep from './steps/PriceCalculationStep';
import AdditionalDetailsStep from './steps/AdditionalDetailsStep';
import ConfirmationStep from './steps/ConfirmationStep';
import { FormErrors, DurationUnit, AvailabilityPeriod } from '@/types/listings';


export interface RentalRequestFormData {
  startDate: Date | null;
  duration: number;
  purpose: string;
  notes: string;
  pickupMethod: 'self' | 'delivery';
  deliveryAddress: string;
  deliveryTime: Date | null;
  totalCost?: number;
  securityDeposit?: number;
  serviceFee?: number;
}

interface Product {
  id: number;
  title: string;
  owner: string;
  category: string;
  description: string;
  basePrice: number;
  durationUnit: DurationUnit;
  minRentalPeriod: number;
  maxRentalPeriod?: number;
  location: string;
  images: string[];
  availabilityPeriods: AvailabilityPeriod[];
}

const RentalRequestStepper = ({ product }: { product: Product }) => {
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
    const securityDeposit = 0; // Should come from product data
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

  const handlePrevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <main className="flex-grow pt-8 pb-8 md:pt-16 md:pb-16">
      <div className="bg-gradient-to-b from-green-300 to-lime-100/20 pt-4 md:pt-8 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-lime-50 rounded-lg shadow-subtle p-4 md:p-8 lg:p-16 overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">Request Rental</h1>
            <p className="text-gray-600">Complete the following steps to request your rental</p>
          </div>

          {/* Stepper Progress */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`h-1 flex-1 ${currentStep >= step ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium 
                    ${currentStep >= step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
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
    </main>
  );
};

export default RentalRequestStepper;