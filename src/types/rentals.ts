import { Product } from './listings';
import { DurationUnit, RentalStatus } from '@/constants/rental';

export type RentalRequestFormData = {
    start_date: Date | null;
    duration: number;
    duration_unit: DurationUnit;
    purpose: string;
    notes: string | null;
};

// Minimal public info about a rental party — no phone number (contact is
// handled by Bhara off-platform)
export type RentalPartyInfo = {
    full_name: string;
    trust_level: 'unverified' | 'verified' | 'partner';
    average_rating: string | null;
};

export type StatusHistoryEntry = {
    status: RentalStatus;
    timestamp: string;
    actor_id: string;
    note: string;
};

export type PaymentRecord = {
    id: string;
    record_type: 'rent_collected' | 'deposit_collected' | 'deposit_returned' | 'deposit_withheld' | 'owner_payout' | 'refund';
    amount: string;
    method: 'cash' | 'bkash' | 'nagad' | 'bank';
    reference: string;
    note: string;
    recorded_by: string;
    recorded_by_name: string;
    created_at: string;
};

export type Settlement = {
    rent_paid: string;
    deposit_held: string;
    deposit_returned: string;
    owner_paid: string;
};

export type RentalRequest = {
    id: string;
    product: string | Product;
    product_title: string;
    renter: string;
    renter_info: RentalPartyInfo;
    owner: string;
    owner_info: RentalPartyInfo;
    start_date: string;
    end_date: string;
    duration: number;
    duration_unit: DurationUnit;
    // Pricing snapshot — frozen at request time by the backend
    unit_price?: string;
    base_cost: string;
    service_fee?: string;
    owner_payout?: string;
    security_deposit: string;
    purpose?: string;
    notes?: string;
    status: RentalStatus;
    status_history?: StatusHistoryEntry[];
    payment_records?: PaymentRecord[];
    settlement?: Settlement;
    created_at: string;
    updated_at?: string;
};

export type Review = {
    id: string;
    rental: string;
    reviewer: string;
    reviewer_name: string;
    reviewee: string;
    reviewee_name: string;
    product: string;
    direction: 'renter_to_owner' | 'owner_to_renter';
    rating: number;
    comment: string;
    created_at: string;
};

export type Rental = RentalRequest;

export type RentalErrors = {
    [key: string]: string;
};
