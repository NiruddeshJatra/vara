/**
 * Product status constants for the frontend
 * These align with the backend STATUS_CHOICES
 */

export type ProductStatus = 'draft' | 'active' | 'maintenance' | 'suspended';

export const PRODUCT_STATUS_DISPLAY: Record<ProductStatus, string> = {
  draft: 'Draft - Pending Review',
  active: 'Active - Available for Rent',
  maintenance: 'Under Maintenance - Needs Action',
  suspended: 'Suspended - Listing Disabled'
};

export const PRODUCT_STATUS_COLORS: Record<ProductStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  maintenance: 'bg-amber-100 text-amber-800',
  suspended: 'bg-red-100 text-red-800'
};

export const PRODUCT_STATUS_ICONS: Record<ProductStatus, string> = {
  draft: '📝',
  active: '✅',
  maintenance: '🔧',
  suspended: '🚫'
};

export const PRODUCT_STATUS_DESCRIPTIONS: Record<ProductStatus, string> = {
  draft: 'Your listing is in draft mode and not visible to users. Submit for review when ready.',
  active: 'Your listing is live and available for rent.',
  maintenance: 'Your listing is temporarily unavailable due to maintenance.',
  suspended: 'Your listing has been suspended. Please contact support for more information.'
};

export const PRODUCT_STATUS_ACTIONS: Record<ProductStatus, string[]> = {
  draft: ['Submit for Review', 'Edit', 'Delete'],
  active: ['Edit', 'Mark as Maintenance', 'Delete'],
  maintenance: ['Edit', 'Mark as Active', 'Delete'],
  suspended: ['Contact Support', 'Delete']
}; 