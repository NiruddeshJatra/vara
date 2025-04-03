/**
 * Product attribute constants for the frontend
 * These align with the backend CONDITION_CHOICES and OWNERSHIP_HISTORY_CHOICES
 */

export type ProductCondition = 'excellent' | 'good' | 'fair' | 'pending';

export type OwnershipHistory = 'firsthand' | 'secondhand';

export const CONDITION_DISPLAY: Record<ProductCondition, string> = {
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  pending: 'Pending Review'
};

export const CONDITION_DESCRIPTIONS: Record<ProductCondition, string> = {
  excellent: 'Like new, minimal wear and tear',
  good: 'Some wear and tear, but fully functional',
  fair: 'Visible wear and tear, but still usable',
  pending: 'Condition will be reviewed by our team'
};

export const CONDITION_COLORS: Record<ProductCondition, string> = {
  excellent: 'bg-green-100 text-green-800',
  good: 'bg-blue-100 text-blue-800',
  fair: 'bg-amber-100 text-amber-800',
  pending: 'bg-gray-100 text-gray-800'
};

export const OWNERSHIP_HISTORY_DISPLAY: Record<OwnershipHistory, string> = {
  firsthand: 'First Hand',
  secondhand: 'Second Hand'
};

export const OWNERSHIP_HISTORY_DESCRIPTIONS: Record<OwnershipHistory, string> = {
  firsthand: 'You are the original owner of this item',
  secondhand: 'You purchased this item from someone else'
}; 