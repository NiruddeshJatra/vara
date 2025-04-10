import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BasicDetailsStep from './steps/BasicDetailsStep';
import ImageUploadStep from './steps/ImageUploadStep';
import ProductHistoryStep from './steps/ProductHistoryStep';
import PricingStep from './steps/PricingStep';
import UnavailabilityStep from './steps/UnavailabilityStep';
import ConfirmationStep from './steps/ConfirmationStep';
import { ListingFormData, FormError } from '@/types/listings';
import { Category, ProductType } from '@/constants/productTypes';
import { DURATION_UNIT_DISPLAY, DurationUnit } from '@/constants/rental';
import { OwnershipHistory } from '@/constants/productAttributes';
import productService from '@/services/product.service';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

interface ProductResponse {
  id: string;
}

interface Props {
  initialData?: ListingFormData;
  isEditing?: boolean;
  productId?: string;
  onSubmit: (data: ListingFormData) => Promise<ProductResponse>;
  onEditComplete?: () => void;
}

const CreateListingStepper = ({ initialData, isEditing: initialIsEditing = false, productId: initialProductId, onSubmit, onEditComplete }: Props) => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [productId, setProductId] = useState(initialProductId);
  const [formData, setFormData] = useState<ListingFormData>(() => {
    if (location.state?.initialData) {
      return location.state.initialData;
    }
    
    return initialData || {
      title: '',
      category: Category.PHOTOGRAPHY_VIDEOGRAPHY,
      productType: ProductType.CAMERA,
      description: '',
      location: '',
      images: [],
      unavailableDates: [],
      securityDeposit: 0,
      purchaseYear: new Date().getFullYear().toString(),
      originalPrice: 0,
      ownershipHistory: OwnershipHistory.FIRSTHAND,
      pricingTiers: [{ durationUnit: 'day', price: 0, maxPeriod: 30 }]
    };
  });
  const [errors, setErrors] = useState<FormError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state) {
      if (location.state.isEditing !== undefined) {
        setIsEditing(location.state.isEditing);
      }
      if (location.state.productId) {
        setProductId(location.state.productId);
      }
    }
  }, [location.state]);

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
    const newErrors: FormError = {};
    if (!data.title) newErrors.title = ['Title is required'];
    if (!data.productType) newErrors.productType = ['Product type is required'];
    if (!data.description) newErrors.description = ['Description is required'];
    if (!data.location) newErrors.location = ['Location is required'];
    return newErrors;
  };

  const validateImageUpload = (data: ListingFormData) => {
    const newErrors: FormError = {};
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (data.images.length === 0) {
      newErrors.images = ['At least one image required'];
    } else {
      // Check each image's size
      data.images.forEach((file, index) => {
        if (file.size > MAX_FILE_SIZE) {
          newErrors.images = [`Image ${index + 1} is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 5MB.`];
        }
      });
    }
    return newErrors;
  };

  const validateProductHistory = (data: ListingFormData) => {
    const newErrors: FormError = {};
    if (!data.purchaseYear) newErrors.purchaseYear = ['Purchase year is required'];
    if (!data.originalPrice || data.originalPrice <= 0) newErrors.originalPrice = ['Original price is required and must be greater than 0'];
    if (!data.ownershipHistory) newErrors.ownershipHistory = ['Ownership history is required'];
    return newErrors;
  };

  const validatePricing = (data: ListingFormData) => {
    const newErrors: FormError = {};

    if (!data.pricingTiers || data.pricingTiers.length === 0) {
      newErrors.pricingTiers = ['At least one pricing tier is required'];
    } else {
      // Check for duplicate duration units
      const durationUnits = new Set();
      data.pricingTiers.forEach((tier, index) => {
        if (durationUnits.has(tier.durationUnit)) {
          newErrors[`pricingTiers.${index}.durationUnit`] = ['Duplicate duration unit is not allowed'];
        } else {
          durationUnits.add(tier.durationUnit);
        }

        if (!tier.price || tier.price <= 0) {
          newErrors[`pricingTiers.${index}.price`] = ['Price is required and must be greater than 0'];
        }
        if (tier.maxPeriod && tier.maxPeriod < 1) {
          newErrors[`pricingTiers.${index}.maxPeriod`] = ['Maximum period must be at least 1'];
        }
      });
    }

    return newErrors;
  };

  const validateUnavailability = (data: ListingFormData) => {
    const newErrors: FormError = {};
    // Implementation of validateUnavailability
    return newErrors;
  };

  const handleNextStep = () => {
    let newErrors: FormError = {};
    setErrors({}); // Clear any existing errors before validation

    // Validate current step
    if (currentStep === 1) {
      newErrors = validateBasicDetails(formData);
    } else if (currentStep === 2) {
      newErrors = validateImageUpload(formData);
    } else if (currentStep === 3) {
      newErrors = validateProductHistory(formData);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
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

  const handleEdit = () => {
    setIsEditing(true);
    setProductId(productId);
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    // Validate all steps before submission
    const basicDetailsErrors = validateBasicDetails(formData);
    const imageErrors = validateImageUpload(formData);
    const productHistoryErrors = validateProductHistory(formData);
    const pricingErrors = validatePricing(formData);
    const unavailabilityErrors = validateUnavailability(formData);

    // Combine all errors
    const allErrors = {
      ...basicDetailsErrors,
      ...imageErrors,
      ...productHistoryErrors,
      ...pricingErrors,
      ...unavailabilityErrors
    };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (isEditing && productId) {
        response = await productService.updateProduct(productId, formData);
      } else {
        response = await productService.createProduct(formData);
      }
      
      if (response?.id) {
        setProductId(response.id);
        setCurrentStep(6);
      }
      toast.success(isEditing ? 'Listing updated successfully!' : 'Listing created successfully!');
    } catch (error: any) {
      toast.error(error instanceof Error ? error.message : 'Failed to save listing. Please try again.');

      if (error.response?.data) {
        // Handle validation errors from the backend
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          setErrors(errorData);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepLabel = (step: number) => {
    switch (step) {
      case 1: return "Basic Details";
      case 2: return "Images";
      case 3: return "Product History";
      case 4: return "Pricing";
      case 5: return "Unavailable Dates";
      default: return "";
    }
  };

  const handleFormDataChange = (data: Partial<ListingFormData>) => {
    // Clear errors for the fields that are being updated
    const newErrors = { ...errors };
    Object.keys(data).forEach(key => {
      // Clear the main field error
      delete newErrors[key];
      
      // Clear any nested errors (for pricing tiers)
      Object.keys(newErrors).forEach(errorKey => {
        if (errorKey.startsWith(`${key}.`)) {
          delete newErrors[errorKey];
        }
      });
    });
    setErrors(newErrors);
    setFormData(prev => ({ ...prev, ...data }));
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
                onChange={handleFormDataChange}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 2 && (
              <ImageUploadStep
                images={formData.images}
                error={errors.images}
                onChange={(images) => handleFormDataChange({ images })}
              />
            )}

            {currentStep === 3 && (
              <ProductHistoryStep
                formData={formData}
                errors={errors}
                onChange={handleFormDataChange}
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            )}

            {currentStep === 4 && (
              <PricingStep
                formData={formData}
                errors={errors}
                durationOptions={Object.entries(DURATION_UNIT_DISPLAY).map(([value, label]) => ({
                  value: value as DurationUnit,
                  label
                }))}
                onChange={handleFormDataChange}
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            )}

            {currentStep === 5 && (
              <UnavailabilityStep
                formData={formData}
                errors={errors}
                onChange={handleFormDataChange}
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            )}

            {currentStep === 6 && (
              <ConfirmationStep
                formData={formData}
                onEdit={handleEdit}
                isEditing={isEditing}
                productId={productId}
              />
            )}
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