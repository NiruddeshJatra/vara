import { ProductStatus, PRODUCT_STATUS_VALUES } from '../constants/productStatus';
import { ProductCondition, PRODUCT_CONDITION_VALUES, OwnershipHistory, OWNERSHIP_HISTORY_VALUES } from '../constants/productAttributes';
import { ProductType, PRODUCT_TYPE_VALUES, Category, CATEGORY_VALUES } from '../constants/productTypes';
import { DurationUnit, DURATION_UNIT_VALUES, RentalStatus } from '../constants/rental';

export type { ProductStatus, ProductCondition, OwnershipHistory, ProductType, Category, DurationUnit, RentalStatus };

export const ProductStatusValues = PRODUCT_STATUS_VALUES;
export const ProductConditionValues = PRODUCT_CONDITION_VALUES;
export const OwnershipHistoryValues = OWNERSHIP_HISTORY_VALUES;
export const ProductTypeValues = PRODUCT_TYPE_VALUES;
export const CategoryValues = CATEGORY_VALUES;
export const DurationUnitValues = DURATION_UNIT_VALUES;

export type Product = {
  id: string;
  title: string;
  owner: {
    id: string;
    username: string;
    email: string;
  };
  category: Category;
  productType: ProductType;
  description: string;
  location: string;
  images: string[]; // URLs from API
  unavailableDates: string[]; // ISO date strings from API
  securityDeposit: number;
  condition: ProductCondition;
  purchaseYear: string | null;
  originalPrice: number;
  ownershipHistory: OwnershipHistory;
  pricingTiers: PricingTier[];
  status: ProductStatus;
  statusMessage: string | null;
  statusChangedAt: string | null;
  views_count: number;
  rental_count: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
};

export type PricingTier = {
  durationUnit: DurationUnit;
  price: number;
  maxPeriod: number;
};

export interface ListingFormData {
  title: string;
  category: Category;
  productType: ProductType;
  description: string;
  location: string;
  images: File[]; // Files for upload
  unavailableDates: Date[]; // Date objects for form handling
  securityDeposit: number;
  condition: ProductCondition;
  purchaseYear: string;
  originalPrice: number;
  ownershipHistory: OwnershipHistory;
  pricingTiers: PricingTier[];
}

export type AvailabilityPeriod = {
  startDate: string;
  endDate: string;
  available: boolean;
  notes: string;
};

export type RentalRequestFormData = {
  startDate: Date | null;
  duration: number;
  purpose: string;
  notes: string;
  pickupMethod: 'self' | 'delivery';
  deliveryAddress: string;
  deliveryTime: Date | null;
  totalCost?: number;
  securityDeposit?: number;
  serviceFee?: number;
};

export type RentalRequest = {
  id: string;
  productId: string;
  productTitle: string;
  ownerId: string;
  renterId: string;
  status: RentalStatus;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  securityDeposit: number;
  serviceFee: number;
  purpose: string;
  notes?: string;
  pickupMethod: 'self' | 'delivery';
  deliveryAddress?: string;
  deliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type FormErrors = {
  [key: string]: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Listing {
  id: string;
  title: string;
  category: Category;
  productType: ProductType;
  description: string;
  location: string;
  basePrice: number;
  durationUnit: DurationUnit;
  images: string[];
  unavailableDates: Date[];
  securityDeposit: number;
  condition: ProductCondition;
  purchaseYear: string;
  originalPrice: number;
  ownershipHistory: OwnershipHistory;
  pricingTiers: PricingTier[];
  owner: User;
  status: ProductStatus;
  statusMessage?: string;
  statusChangedAt?: string;
}