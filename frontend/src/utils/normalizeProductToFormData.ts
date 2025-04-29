import { Product, ListingFormData } from '@/types/listings';

/**
 * Converts a Product object from the API to a ListingFormData object suitable for the listing stepper form.
 * Ensures all nested fields are present and correctly typed.
 */
export function normalizeProductToFormData(product: Product): ListingFormData {
  return {
    title: product.title || '',
    category: product.category || '',
    productType: product.productType || '',
    location: product.location || '',
    description: product.description || '',
    securityDeposit: product.securityDeposit || 0,
    purchaseYear: product.purchaseYear || '',
    originalPrice: product.originalPrice || 0,
    ownershipHistory: product.ownershipHistory || '',
    images: [], // No File objects for backend images
    existingImages: product.images || [],
    pricingTiers: product.pricingTiers || [],
    unavailableDates: product.unavailableDates || [],
  };
}
