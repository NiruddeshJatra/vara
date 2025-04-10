import { ProductStatus } from '../constants/productStatus';
import { OwnershipHistory } from '../constants/productAttributes';
import { ProductType, Category } from '../constants/productTypes';
import { DurationUnit, RentalStatus } from '../constants/rental';

export type { ProductStatus, OwnershipHistory, ProductType, Category, DurationUnit, RentalStatus };


export type Product = {
  id: string;
  owner: string;
  title: string;
  category: string;
  productType: string;
  description: string;
  location: string;
  securityDeposit: number | null;
  purchaseYear: string;
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
  purchaseYear: string;
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
  product: string | Product; // Can be either a product ID or the full product object
  renter: string; // User ID of the renter
  owner: string; // User ID of the product owner
  startDate: string; // ISO format date
  endDate: string; // ISO format date
  duration: number; // Number of duration units
  durationUnit: DurationUnit; // The duration unit (day, week, month)
  totalCost: number; // Total rental cost including fees
  serviceFee: number; // Service fee amount
  securityDeposit: number; // Security deposit amount
  purpose?: string; // Purpose of rental
  notes?: string; // Additional notes
  pickupMethod: 'self' | 'delivery'; // How the item will be picked up
  deliveryAddress?: string; // Delivery address if applicable
  deliveryTime?: string; // ISO format date-time for delivery
  status: RentalStatus; // Current status of the rental
  statusHistory?: { // Optional history of status changes
    status: RentalStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export type RentalRequestFormData = {
  startDate: Date | null;
  duration: number;
  durationUnit?: DurationUnit; // Which unit the renter selected
  purpose?: string;
  notes?: string;
  pickupMethod?: 'self' | 'delivery';
  deliveryAddress?: string;
  deliveryTime?: Date | null;
  totalCost?: number;
  serviceFee?: number;
  securityDeposit?: number;
};

export type AvailabilityPeriod = {
  start: Date;
  end: Date;
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

export type FormErrors = {
  [key: string]: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
}