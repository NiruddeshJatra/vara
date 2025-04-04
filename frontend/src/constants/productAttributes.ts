/**
 * Product attribute constants for the frontend
 * These align with the backend CONDITION_CHOICES and OWNERSHIP_HISTORY_CHOICES
 */

export enum ProductCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  PENDING = 'pending'
}

export enum OwnershipHistory {
  FIRSTHAND = 'firsthand',
  SECONDHAND = 'secondhand'
}

export const PRODUCT_CONDITION_VALUES = Object.values(ProductCondition);
export const OWNERSHIP_HISTORY_VALUES = Object.values(OwnershipHistory);

export const PRODUCT_CONDITION_DISPLAY: Record<ProductCondition, string> = {
  [ProductCondition.EXCELLENT]: 'Excellent',
  [ProductCondition.GOOD]: 'Good',
  [ProductCondition.FAIR]: 'Fair',
  [ProductCondition.PENDING]: 'Pending Review'
};

export const PRODUCT_CONDITION_DESCRIPTIONS: Record<ProductCondition, string> = {
  [ProductCondition.EXCELLENT]: 'Like new, minimal wear and tear',
  [ProductCondition.GOOD]: 'Some wear and tear, but fully functional',
  [ProductCondition.FAIR]: 'Visible wear and tear, but still usable',
  [ProductCondition.PENDING]: 'Condition pending review by admin'
};

export const PRODUCT_CONDITION_COLORS: Record<ProductCondition, string> = {
  [ProductCondition.EXCELLENT]: 'bg-green-100 text-green-800',
  [ProductCondition.GOOD]: 'bg-blue-100 text-blue-800',
  [ProductCondition.FAIR]: 'bg-yellow-100 text-yellow-800',
  [ProductCondition.PENDING]: 'bg-gray-100 text-gray-800'
};

export const OWNERSHIP_HISTORY_DISPLAY: Record<OwnershipHistory, string> = {
  [OwnershipHistory.FIRSTHAND]: 'First Hand',
  [OwnershipHistory.SECONDHAND]: 'Second Hand'
};

export const OWNERSHIP_HISTORY_DESCRIPTIONS: Record<OwnershipHistory, string> = {
  [OwnershipHistory.FIRSTHAND]: 'I am the original owner of this item',
  [OwnershipHistory.SECONDHAND]: 'I purchased this item from someone else'
}; 