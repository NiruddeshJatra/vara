import { ProductStatus } from '../constants/productStatus';
import { OwnershipHistory } from '../constants/productAttributes';
import { ProductType, Category } from '../constants/productTypes';
import { DurationUnit, RentalStatus } from '../constants/rental';

export type { ProductStatus, OwnershipHistory, ProductType, Category, DurationUnit, RentalStatus };


export type Product = {
  id: string;
  owner: string; // Only the owner ID is exposed
  title: string;
  category: string;
  productType: string;
  description: string;
  location: string;
  securityDeposit: number | null;
  purchaseYear: string; // Required field, no longer nullable
  originalPrice: number;
  ownershipHistory: string;
  status: string;
  statusMessage: string | null;
  statusChangedAt: string | null;
  images: ProductImage[];
  unavailableDates: UnavailableDate[];
  pricingTiers: PricingTier[];
  viewsCount: number;
  rentalCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductImage = {
  id: string;
  image: string;
  createdAt: string;
};

export type UnavailableDate = {
  id: string;
  date: string | null;
  isRange: boolean;
  rangeStart: string | null;
  rangeEnd: string | null;
};

export type PricingTier = {
  id: string;
  durationUnit: DurationUnit;
  price: number;
  maxPeriod?: number; // Optional, defaults to 30 in backend
};

export type ListingFormData = {
  title: string;
  category: string;
  productType: string;
  description: string;
  location: string;
  securityDeposit: number | null;
  purchaseYear: string; // Required field, no longer nullable
  originalPrice: number;
  ownershipHistory: string;
  images: File[];
  unavailableDates: {
    date: string | null;
    isRange: boolean;
    rangeStart: string | null;
    rangeEnd: string | null;
  }[];
  pricingTiers: {
    durationUnit: DurationUnit;
    price: number;
    maxPeriod?: number;
  }[];
};

export type RentalRequest = {
  id: string;
  product: string;
  renter: string;
  startDate: string;
  endDate: string;
  durationUnit: DurationUnit;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type RentalRequestFormData = {
  product: string;
  startDate: string;
  endDate: string;
  durationUnit: DurationUnit;
};

export type FormError = {
  [K in keyof ListingFormData]?: string[];
} & {
  // Additional error fields that might come from backend validation
  'pricingTiers'?: string[];
  'pricingTiers.*.price'?: string[];
  'pricingTiers.*.durationUnit'?: string[];
  'pricingTiers.*.maxPeriod'?: string[];
  'unavailableDates'?: string[];
  'unavailableDates.*.date'?: string[];
  'unavailableDates.*.rangeStart'?: string[];
  'unavailableDates.*.rangeEnd'?: string[];
  'images'?: string[];
  'images.*'?: string[];
  // Generic error for non-field specific errors
  'non_field_errors'?: string[];
};

export interface User {
  id: string;
  name: string;
  email: string;
}