/**
 * Product status constants for the frontend
 * These align with the backend STATUS_CHOICES
 */

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  SUSPENDED = 'suspended'
}

export const PRODUCT_STATUS_VALUES = Object.values(ProductStatus);

export const PRODUCT_STATUS_DISPLAY: Record<ProductStatus, string> = {
  [ProductStatus.DRAFT]: 'Draft - Pending Review',
  [ProductStatus.ACTIVE]: 'Active - Available for Rent',
  [ProductStatus.MAINTENANCE]: 'Under Maintenance - Needs Action',
  [ProductStatus.SUSPENDED]: 'Suspended - Listing Disabled'
};

export const PRODUCT_STATUS_COLORS: Record<ProductStatus, string> = {
  [ProductStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [ProductStatus.ACTIVE]: 'bg-green-100 text-green-800',
  [ProductStatus.MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
  [ProductStatus.SUSPENDED]: 'bg-red-100 text-red-800'
};

export const PRODUCT_STATUS_ICONS: Record<ProductStatus, string> = {
  [ProductStatus.DRAFT]: '📝',
  [ProductStatus.ACTIVE]: '✅',
  [ProductStatus.MAINTENANCE]: '🔧',
  [ProductStatus.SUSPENDED]: '🚫'
};

export const PRODUCT_STATUS_DESCRIPTIONS: Record<ProductStatus, string> = {
  [ProductStatus.DRAFT]: 'Your listing is in draft mode and not visible to users. Submit for review when ready.',
  [ProductStatus.ACTIVE]: 'Your listing is live and available for rent.',
  [ProductStatus.MAINTENANCE]: 'Your listing is temporarily unavailable due to maintenance.',
  [ProductStatus.SUSPENDED]: 'Your listing has been suspended. Please contact support for more information.'
};

export const PRODUCT_STATUS_ACTIONS: Record<ProductStatus, string[]> = {
  [ProductStatus.DRAFT]: ['submit_for_review'],
  [ProductStatus.ACTIVE]: ['deactivate'],
  [ProductStatus.MAINTENANCE]: ['activate'],
  [ProductStatus.SUSPENDED]: ['contact_support']
}; 