import { ProductStatus } from '../constants/productStatus';
import { OwnershipHistory } from '../constants/productAttributes';
import { ProductType, Category } from '../constants/productTypes';
import { DurationUnit } from '../constants/rental';

export type { ProductStatus, OwnershipHistory, ProductType, Category, DurationUnit };

export type ProductOwner = {
    id: string;
    full_name: string;
    trust_level: 'unverified' | 'verified' | 'partner';
    average_rating: string;
};

export type Product = {
    id: string;
    owner: ProductOwner;
    title: string;
    category: string;
    product_type: string;
    description: string;
    location: string;
    security_deposit: string;
    purchase_year: string;
    original_price: string;
    ownership_history: string;
    status: string;
    images: ProductImage[];
    unavailable_periods: UnavailablePeriod[];
    pricing_tiers: PricingTier[];
    views_count: number;
    rental_count: number;
    average_rating: string;
    created_at: string;
    updated_at: string;
};

export type ProductImage = {
    id: string;
    image: string;
    created_at: string;
};

export type UnavailablePeriod = {
    id: string;
    date: string | null;
    is_range: boolean;
    range_start: string | null;
    range_end: string | null;
};

export type PricingTier = {
    id: string;
    duration_unit: DurationUnit;
    price: number;
    max_period: number | null;
};

export type ListingFormData = {
    title: string;
    category: string;
    product_type: string;
    description: string;
    location: string;
    security_deposit: number | null;
    purchase_year: string;
    original_price: number;
    ownership_history: string;
    images: File[];
    existingImages?: ProductImage[];
    unavailable_periods: {
        date: string | null;
        is_range: boolean;
        range_start: string | null;
        range_end: string | null;
    }[];
    pricing_tiers: {
        duration_unit: DurationUnit;
        price: number;
        max_period: number | null;
    }[];
};

export type FormError = {
    [K in keyof ListingFormData]?: string[];
} & {
    // Additional error fields that might come from backend validation
    'pricing_tiers'?: string[];
    'pricing_tiers.*.price'?: string[];
    'pricing_tiers.*.duration_unit'?: string[];
    'pricing_tiers.*.max_period'?: string[];
    'unavailable_periods'?: string[];
    'unavailable_periods.*.date'?: string[];
    'unavailable_periods.*.range_start'?: string[];
    'unavailable_periods.*.range_end'?: string[];
    'images'?: string[];
    'images.*'?: string[];
    // Generic error for non-field specific errors
    'non_field_errors'?: string[];
};
