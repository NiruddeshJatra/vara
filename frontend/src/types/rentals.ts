import { Product } from './listings';
import { DurationUnit, RentalStatus } from '@/constants/rental';

export type RentalRequestFormData = {
    startDate: Date | null;
    duration: number;
    durationUnit: DurationUnit;
    purpose: string;
    notes: string | null;
    totalCost?: number;
    serviceFee?: number;
    securityDeposit?: number;
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

export type RentalErrors = {
    [key: string]: string;
};