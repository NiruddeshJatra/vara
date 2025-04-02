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
import {DurationUnit, DURATION_CHOICES, ListingFormData, FormErrors, CATEGORY_CHOICES } from '@/types/listings';


const CreateListingStepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    category: '',
    description: '',
    location: '',
    images: [],
    pricingTiers: [{ durationUnit: 'day', price: 0 }],
    unavailableDates: [],
    purchaseYear: new Date().getFullYear().toString(),
    originalPrice: undefined,
    ownershipHistory: 'firsthand',
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

  const validateBasicDetails = () => {
    const newErrors: FormErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.location) newErrors.location = 'Location is required';
    return newErrors;
  };

  const validateImageUpload = () => {
    const newErrors: FormErrors = {};
    if (formData.images.length === 0) newErrors.images = 'At least one image required';
    return newErrors;
  };

  const validateProductHistory = () => {
    const newErrors: FormErrors = {};
    if (!formData.purchaseYear) newErrors.purchaseYear = 'Purchase year is required';
    if (!formData.originalPrice) newErrors.originalPrice = 'Original price is required';
    if (!formData.ownershipHistory) newErrors.ownershipHistory = 'Ownership history is required';
    return newErrors;
  };

  const validatePricing = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.pricingTiers || formData.pricingTiers.length === 0) {
      newErrors.pricingTiers = 'At least one pricing tier is required';
    } else {
      formData.pricingTiers.forEach((tier, index) => {
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

  const handleNextStep = () => {
    let stepErrors = {};
    
    switch(currentStep) {
      case 1: stepErrors = validateBasicDetails(); break;
      case 2: stepErrors = validateImageUpload(); break;
      case 3: stepErrors = validateProductHistory(); break;
      case 4: stepErrors = validatePricing(); break;
    }

    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => prev + 1);
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    const pricingErrors = validatePricing();
    
    if (Object.keys(pricingErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Here you would call the API to submit the form
        console.log('Submitting form data:', formData);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Move to confirmation step
    setCurrentStep(6);
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
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 mb-2">Upload Your Product</h1>
            <p className="text-sm md:text-base text-gray-500">Join the Vara community to rent and lend items</p>
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
                      currentStep === 1 ? '0%' : 
                      currentStep === 2 ? '20%' : 
                      currentStep === 3 ? '40%' : 
                      currentStep === 4 ? '60%' : 
                      '80%' 
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
                  categories={CATEGORY_CHOICES}
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
                  onNext={handleNextStep}
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

            {currentStep === 6 && <ConfirmationStep formData={formData} onEdit={() => setCurrentStep(5)} />}
            </form>

          <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col-reverse md:flex-row justify-between gap-3 md:gap-4">
            {currentStep > 1 && currentStep < 6 && (
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