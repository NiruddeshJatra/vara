import { ProductStatus } from '../constants/productStatus';
import { OwnershipHistory } from '../constants/productAttributes';
import { ProductType, Category } from '../constants/productTypes';
import { DurationUnit } from '../constants/rental';

export type { ProductStatus, OwnershipHistory, ProductType, Category, DurationUnit };

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
    maxPeriod: number | null;
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
    existingImages?: ProductImage[];
    unavailableDates: {
        date: string | null;
        isRange: boolean;
        rangeStart: string | null;
        rangeEnd: string | null;
    }[];
    pricingTiers: {
        durationUnit: DurationUnit;
        price: number;
        maxPeriod: number | null;
    }[];
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