// components/listings/CreateListingStepper.tsx
import { useListingsApi } from '@/hooks/useListingApi';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BasicDetailsStep from './steps/BasicDetailsStep';
import ImageUploadStep from './steps/ImageUploadStep';
import ProductHistoryStep from './steps/ProductHistoryStep';
import PricingStep from './steps/PricingStep';
import UnavailabilityStep from './steps/UnavailabilityStep';
import ConfirmationStep from './steps/ConfirmationStep';
import {ListingFormData, FormErrors } from '@/types/listings';
import { Category, ProductType } from '@/constants/productTypes';
import { DURATION_CHOICES } from '@/constants/rental';

interface Props {
  initialData?: ListingFormData;
  isEditing?: boolean;
  onSubmit?: (data: ListingFormData) => void;
}

const CreateListingStepper = ({ initialData, isEditing = false, onSubmit }: Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>(initialData || {
    title: '',
    category: 'Photography & Videography' as Category,
    productType: 'camera' as ProductType,
    description: '',
    location: '',
    basePrice: 0,
    durationUnit: 'day',
    images: [],
    unavailableDates: [],
    securityDeposit: 0,
    condition: 'excellent',
    purchaseYear: new Date().getFullYear().toString(),
    originalPrice: undefined,
    ownershipHistory: 'firsthand',
    pricingTiers: [{ durationUnit: 'day', price: 0, maxPeriod: 1 }]
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (formData.title || formData.description) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [formData]);

  const validateBasicDetails = (data: ListingFormData) => {
    const newErrors: FormErrors = {};
    if (!data.title) newErrors.title = 'Title is required';
    if (!data.productType) newErrors.productType = 'Product type is required';
    if (!data.description) newErrors.description = 'Description is required';
    if (!data.location) newErrors.location = 'Location is required';
    return newErrors;
  };

  const validateImageUpload = (data: ListingFormData) => {
    const newErrors: FormErrors = {};
    if (data.images.length === 0) newErrors.images = 'At least one image required';
    return newErrors;
  };

  const validateProductHistory = (data: ListingFormData) => {
    const newErrors: FormErrors = {};
    if (!data.purchaseYear) newErrors.purchaseYear = 'Purchase year is required';
    if (!data.originalPrice) newErrors.originalPrice = 'Original price is required';
    if (!data.ownershipHistory) newErrors.ownershipHistory = 'Ownership history is required';
    return newErrors;
  };

  const validatePricing = (data: ListingFormData) => {
    const newErrors: FormErrors = {};
    
    if (!data.pricingTiers || data.pricingTiers.length === 0) {
      newErrors.pricingTiers = 'At least one pricing tier is required';
    } else {
      data.pricingTiers.forEach((tier, index) => {
        if (tier.price <= 0) {
          newErrors[`pricingTiers.${index}.price`] = 'Price must be greater than 0';
        }
        if (tier.maxPeriod && tier.maxPeriod <= 1) {
          newErrors[`pricingTiers.${index}.maxPeriod`] = 'Maximum period must be greater than 1';
    }
      });
    }
    
    return newErrors;
  };

  const validateUnavailability = (data: ListingFormData) => {
    const newErrors: FormErrors = {};
    // Implementation of validateUnavailability
    return newErrors;
  };

  const handleNextStep = () => {
    let newErrors: Record<string, string> = {};

    // Skip validation for ProductHistoryStep since it's handled in the component
    if (currentStep === 3) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    // Validate current step
    if (currentStep === 1) {
      newErrors = validateBasicDetails(formData);
    } else if (currentStep === 2) {
      newErrors = validateImageUpload(formData);
    } else if (currentStep === 4) {
      newErrors = validatePricing(formData);
    } else if (currentStep === 5) {
      newErrors = validateUnavailability(formData);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    const pricingErrors = validatePricing(formData);
    
    if (Object.keys(pricingErrors).length === 0) {
      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(formData);
        } else {
          // Default behavior for creating new listing
          console.log('Creating new listing:', formData);
          // TODO: Call API to create listing
          setCurrentStep(6);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(pricingErrors);
    }
  };

  const getStepLabel = (step: number) => {
    switch(step) {
      case 1: return "Basic Details";
      case 2: return "Images";
      case 3: return "Product History";
      case 4: return "Pricing";
      case 5: return "Unavailable Dates";
      default: return "";
    }
  };

  return (
    <main className="flex-grow pt-4 pb-4 md:pt-8 md:pb-8 lg:pt-16 lg:pb-16">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20 pt-4 md:pt-8 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-lime-50 rounded-lg shadow-subtle p-4 md:p-6 lg:p-8 overflow-hidden">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 mb-2">
              {isEditing ? 'Edit Your Product' : 'Upload Your Product'}
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              {isEditing ? 'Update your product details' : 'Join the Vara community to rent and lend items'}
            </p>
            </div>

          {/* Stepper navigation */}
          <div className="mb-6 md:mb-8 lg:mb-12">
            <div className="flex justify-between items-center relative">
              {[1, 2, 3, 4, 5].map((step, index) => (
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
                      currentStep === 1 ? '5%' : 
                      currentStep === 2 ? '25%' : 
                      currentStep === 3 ? '50%' : 
                      currentStep === 4 ? '70%' :
                      currentStep === 5 ? '90%' :
                      '100%' 
                  }}
                ></div>
              </div>
              </div>
            </div>

          <form onSubmit={(e) => { e.preventDefault(); }} className="mt-4 md:mt-8">
              {currentStep === 1 && (
                <BasicDetailsStep
                  formData={formData}
                  errors={errors}
                  onChange={(data: Partial<ListingFormData>) => setFormData(prev => ({ ...prev, ...data }))}
                  onNext={handleNextStep}
                />
              )}

              {currentStep === 2 && (
                <ImageUploadStep
                  images={formData.images}
                  error={errors.images}
                  onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                />
              )}

              {currentStep === 3 && (
                <ProductHistoryStep
                  formData={formData}
                  errors={errors}
                  onNext={(data) => {
                    setFormData(prev => ({ ...prev, ...data }));
                    handleNextStep();
                  }}
                  onBack={handlePrevStep}
                />
              )}

              {currentStep === 4 && (
                <PricingStep
                  formData={formData}
                  errors={errors}
                  durationOptions={DURATION_CHOICES}
                  onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                />
              )}

              {currentStep === 5 && (
                <UnavailabilityStep
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleSubmit}
                  onBack={handlePrevStep}
                />
              )}

            {currentStep === 6 && (
              <ConfirmationStep 
                formData={formData} 
                onEdit={() => setCurrentStep(1)}
                isEditing={isEditing}
              />
            )}
            </form>

          <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col-reverse md:flex-row justify-between gap-3 md:gap-4">
            {currentStep > 1 && currentStep < 6 && currentStep !== 3 && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handlePrevStep}
                  className="w-full md:w-auto border-green-300 text-green-700 hover:bg-green-50 hover:border-green-300"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Previous
                  </Button>
                
                {currentStep < 5 && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto shadow-sm"
                    onClick={handleNextStep}
                  >
                    Next Step <ChevronRight size={16} className="ml-1" />
                  </Button>
                )}
                
                {currentStep === 5 && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto shadow-sm"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Listing'}
                  </Button>
                )}
                </>
              )}
            </div>
          </div>
        </div>
    </main>
  );
};

export default CreateListingStepper;