import { useState, useEffect } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { toast } from '@/components/ui/use-toast';
import { useLocation } from 'react-router-dom';
import { 
  validateBasicDetails, 
  validateImageUpload, 
  validateProductHistory, 
  validatePricing, 
  validateUnavailability,
  validateAllSteps 
} from '@/utils/validations/product.validations';

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
  const [isEditing, setIsEditing] = useState(initialIsEditing || location.state?.isEditing || false);
  const [productId, setProductId] = useState(initialProductId || location.state?.productId || null);
  const [formData, setFormData] = useState<ListingFormData>(() => {
    return location.state?.initialData || initialData || {
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
    // Validate all steps using the combined validation
    const allErrors = validateAllSteps(formData);

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive"
      });
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

      // Call the completion callback if provided
      if (isEditing && onEditComplete) {
        onEditComplete();
      }

      toast({
        title: "Success",
        description: isEditing ? "Listing updated successfully!" : "Listing created successfully!",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save listing. Please try again.",
        variant: "destructive"
      });

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
    <main className="flex-grow pt-12 sm:pt-12 md:pt-16 pb-4 sm:pb-8 md:pb-12">
      <div className="bg-gradient-to-b from-green-300 to-lime-100/20 pt-6 sm:pt-8 md:pt-10 px-3 sm:px-5 md:px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-white to-lime-50 rounded-lg shadow-subtle p-6 sm:p-8 md:p-10 overflow-hidden">
          <div className="text-center mb-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-1">{isEditing ? "Edit Listing" : "Create New Listing"}</h1>
            <p className="text-xs sm:text-sm text-gray-500">Complete the following steps to {isEditing ? "update" : "create"} your listing</p>
          </div>

          {/* Stepper navigation */}
          <div className="mb-3 sm:mb-6 md:mb-8">
            <div className="flex justify-between items-center relative">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div
                    className={`
                      w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] md:text-xs font-bold 
                      ${currentStep >= step ? 'bg-green-600 text-white ring-1 sm:ring-2 ring-green-100' : 'bg-gray-200 text-gray-600'}
                    `}
                  >
                    {step}
                  </div>
                  <div className="mt-0 sm:mt-1 text-center">
                    <span className={`text-[7px] sm:text-[8px] md:text-xs ${currentStep === step ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                      {getStepLabel(step)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Connecting lines between steps */}
              <div className="absolute top-2 sm:top-2.5 md:top-3.5 left-0 right-0 h-0.5 sm:h-1 bg-gray-200 -z-0">
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

          <form onSubmit={(e) => { e.preventDefault(); }} className="mt-3 md:mt-6">
            {/* Display validation errors from backend */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-4 space-y-2">
                {Object.entries(errors).map(([key, value]) => (
                  <div key={key} className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 mr-2" />
                      <div>
                        <h3 className="text-xs sm:text-sm font-medium text-red-800 capitalize">
                          {key.split('_').join(' ')}
                        </h3>
                        <p className="text-xs text-red-700 mt-0.5 sm:mt-1">
                          {Array.isArray(value) ? value[0] : value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

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

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 gap-2 sm:gap-0">
            {currentStep > 1 && currentStep < 6 && (
              <Button
                variant="outline"
                onClick={handlePrevStep}
                className="border-green-600 text-green-700 hover:bg-green-50 w-full sm:w-auto order-2 sm:order-1 h-9 sm:h-10 text-xs sm:text-sm"
              >
                <ChevronLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Previous
              </Button>
            )}
            
            {currentStep < 5 && (
              <Button 
                onClick={handleNextStep}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto sm:ml-auto order-1 sm:order-2 h-9 sm:h-10 text-xs sm:text-sm"
              >
                Next
                <ChevronRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
            
            {currentStep === 5 && (
              <Button 
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto sm:ml-auto order-1 sm:order-2 h-9 sm:h-10 text-xs sm:text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-t-2 border-b-2 border-white mr-1 sm:mr-2"></div>
                    {isEditing ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    {isEditing ? 'Update Listing' : 'Submit Listing'}
                    <ChevronRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateListingStepper;