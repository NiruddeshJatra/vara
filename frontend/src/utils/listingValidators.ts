// utils/listingValidators.ts
import { ListingFormData } from '@/types/listings';

export const validateBasicDetails = (formData: ListingFormData) => {
  const errors: Record<string, string> = {};
  if (!formData.title) errors.title = 'Title is required';
  if (!formData.category) errors.category = 'Category is required';
  if (!formData.description) errors.description = 'Description is required';
  if (!formData.location) errors.location = 'Location is required';
  if (formData.securityDeposit < 0) errors.securityDeposit = 'Must be ≥ 0';
  return errors;
};

export const validateImageUpload = (images: File[]) => {
  const errors: Record<string, string> = {};
  if (images.length === 0) errors.images = 'At least one image required';
  return errors;
};

export const validatePricing = (formData: ListingFormData) => {
  const errors: Record<string, string> = {};
  if (formData.basePrice <= 0) errors.basePrice = 'Must be ≥ 0';
  if (formData.minRentalPeriod < 1) errors.minRentalPeriod = 'Must be ≥ 1';
  if (formData.maxRentalPeriod && formData.maxRentalPeriod <= formData.minRentalPeriod) {
    errors.maxRentalPeriod = 'Must be greater than minimum period';
  }
  return errors;
};