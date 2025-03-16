// components/listings/CreateListingStepper.tsx
import { useListingsApi } from '@/hooks/useListingApi';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BasicDetailsStep from './steps/BasicDetailsStep';
import ImageUploadStep from './steps/ImageUploadStep';
import PricingStep from './steps/PricingStep';
import AvailabilityStep from './steps/AvailabilityStep';
import ConfirmationStep from './steps/ConfirmationStep';
import {DurationUnit, DURATION_CHOICES, ListingFormData, AvailabilityPeriod, FormErrors, CATEGORY_CHOICES } from '@/types/listings';


const CreateListingStepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    category: '',
    description: '',
    location: '',
    available: true,
    images: [],
    basePrice: 0,
    durationUnit: 'day',
    minRentalPeriod: 1,
    availabilityPeriods: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});

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

  const validatePricing = () => {
    const newErrors: FormErrors = {};
    if (formData.basePrice <= 0) newErrors.basePrice = 'Must be ≥ 0';
    if (formData.minRentalPeriod < 1) newErrors.minRentalPeriod = 'Must be ≥ 1';
    if (formData.maxRentalPeriod && formData.maxRentalPeriod <= formData.minRentalPeriod) {
      newErrors.maxRentalPeriod = 'Must be greater than minimum period';
    }
    return newErrors;
  };

  const handleNextStep = () => {
    let stepErrors = {};
    
    switch(currentStep) {
      case 1: stepErrors = validateBasicDetails(); break;
      case 2: stepErrors = validateImageUpload(); break;
      case 3: stepErrors = validatePricing(); break;
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
  };

  const handleSubmit = async () => {
    // Submission logic here
    setCurrentStep(5);
  };

  return (
    <main className="flex-grow pt-8 pb-8 md:pt-16 md:pb-16">
        <div className="bg-gradient-to-b from-green-300 to-lime-100/20 pt-4 md:pt-8 px-4">
          <div className="max-w-3xl mx-auto bg-gradient-to-b from-white to-lime-50 rounded-lg shadow-subtle p-4 md:p-8 lg:p-16 overflow-hidden">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">List Your Product</h1>
              <p className="text-gray-600">Join the Bhara community to rent and lend items</p>
            </div>

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

            <form onSubmit={handleSubmit}>
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
                <PricingStep
                  formData={formData}
                  errors={errors}
                  durationOptions={DURATION_CHOICES}
                  onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                />
              )}

              {currentStep === 4 && (
                <AvailabilityStep
                  periods={formData.availabilityPeriods}
                  onChange={(periods) => setFormData(prev => ({ ...prev, availabilityPeriods: periods }))}
                  onSubmit={handleSubmit}
                />
              )}

              {currentStep === 5 && <ConfirmationStep />}
            </form>

            <div className="mt-6 md:mt-8 flex flex-col-reverse md:flex-row justify-between gap-4">
              {currentStep > 1 && currentStep < 4 && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handlePrevStep}
                    className="w-full md:w-auto"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Previous
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
                    onClick={handleNextStep}
                  >
                    Next Step <ChevronRight size={16} className="ml-1" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
    </main>
  );
};

export default CreateListingStepper;