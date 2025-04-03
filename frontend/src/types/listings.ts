import { ProductStatus } from '../constants/productStatus';
import { ProductCondition, OwnershipHistory } from '../constants/productAttributes';
import { ProductType, Category } from '../constants/productTypes';
import { DurationUnit, RentalStatus } from '../constants/rental';

export type Product = {
  id: string;
  title: string;
  owner: string;
  category: string;
  description: string;
  location: string;
  basePrice: number;
  durationUnit: DurationUnit;
  images: string[];
  unavailableDates: Date[];
  securityDeposit?: number;
  averageRating?: number;
  totalRentals?: number;
  condition?: ProductCondition;
  itemAge?: number;
  pricingTiers?: PricingTier[];
  status?: ProductStatus;
  statusMessage?: string;
  statusChangedAt?: string;
};

export type PricingTier = {
  durationUnit: DurationUnit;
  price: number;
  maxPeriod?: number;
};

export interface ListingFormData {
  title: string;
  category: Category;
  productType: ProductType;
  description: string;
  location: string;
  basePrice: number;
  durationUnit: DurationUnit;
  images: File[];
  unavailableDates: Date[];
  securityDeposit: number;
  condition: ProductCondition;
  itemAge: number;
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
  itemAge: number;
  purchaseYear: string;
  originalPrice: number;
  ownershipHistory: OwnershipHistory;
  pricingTiers: PricingTier[];
  owner: User;
  status: ProductStatus;
  statusMessage?: string;
  statusChangedAt?: string;
}