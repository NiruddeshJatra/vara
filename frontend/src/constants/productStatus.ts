/**
 * Product status constants for the frontend
 * These align with the backend STATUS_CHOICES
 */

export const ProductStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  SUSPENDED: 'suspended'
} as const;

export const PRODUCT_STATUS_VALUES = Object.values(ProductStatus);

export const PRODUCT_STATUS_COLORS: Record<string, string> = {
  [ProductStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [ProductStatus.ACTIVE]: 'bg-green-100 text-green-800',
  [ProductStatus.SUSPENDED]: 'bg-red-100 text-red-800'
};

export const PRODUCT_STATUS_ICONS: Record<string, string> = {
  [ProductStatus.DRAFT]: '📝',
  [ProductStatus.ACTIVE]: '✅',
  [ProductStatus.SUSPENDED]: '🚫'
};

