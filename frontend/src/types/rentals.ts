import { Product } from './listings';
import { DurationUnit, RentalStatus } from '@/constants/rental';

export type RentalRequestFormData = {
    startDate: Date | null;
    duration: number;
    durationUnit: DurationUnit;
    purpose: string;
    notes: string | null;
    baseCost?: number;
    serviceFee?: number;
    securityDeposit?: number;
    totalCost?: number;
};

export type RentalRequest = {
    id: string;
    product: string | Product;
    renter: string;
    owner: string;
    startDate: string;
    endDate: string;
    duration: number;
    durationUnit: DurationUnit;
    totalCost: number;
    serviceFee: number;
    securityDeposit: number;
    purpose?: string;
    notes?: string;
    status: RentalStatus;
    statusHistory?: {
        status: RentalStatus;
        timestamp: string;
        note?: string;
    }[];
    createdAt: string;
    updatedAt: string;
};

export type Review = {
    id: string;
    userName: string;
    userImage?: string;
    rating: number;
    comment: string;
    createdAt: string;
};

export type Rental = {
    id: number;
    product: Product;
    reviews: Review[];
    startDate: string;
    endDate: string;
    duration: number;
    durationUnit: DurationUnit;
    totalCost: number;
    serviceFee: number;
    securityDeposit: number;
    status: RentalStatus;
    statusHistory?: {
        status: RentalStatus;
        timestamp: string;
        note?: string;
    }[];
    createdAt: string;
    updatedAt: string;
    notes?: string;
    renter: string;
    owner: string;
};

export type RentalErrors = {
    [key: string]: string;
};