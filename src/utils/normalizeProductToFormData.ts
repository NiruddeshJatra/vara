import { Product, ListingFormData } from '@/types/listings';

/**
 * Converts a Product object from the API to a ListingFormData object suitable for the listing stepper form.
 * Ensures all nested fields are present and correctly typed.
 */
export function normalizeProductToFormData(product: Product): ListingFormData {
  return {
    title: product.title || '',
    category: product.category || '',
    product_type: product.product_type || '',
    location: product.location || '',
    description: product.description || '',
    security_deposit: Number(product.security_deposit) || 0,
    purchase_year: product.purchase_year || '',
    original_price: Number(product.original_price) || 0,
    ownership_history: product.ownership_history || '',
    images: [], // No File objects for backend images
    existingImages: product.images || [],
    pricing_tiers: product.pricing_tiers || [],
    unavailable_periods: product.unavailable_periods || [],
  };
}
