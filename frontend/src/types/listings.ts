export type DurationUnit = 'hour' | 'day' | 'week' | 'month';

export type Product = {
  id: string;
  title: string;
  owner: string;
  category: string;
  description: string;
  location: string;
  basePrice: number;
  durationUnit: DurationUnit;
  minRentalPeriod: number;
  maxRentalPeriod?: number;
  images: string[];
  availabilityPeriods: AvailabilityPeriod[];
  securityDeposit?: number;
  averageRating?: number;
  totalRentals?: number;
  condition?: 'excellent' | 'good' | 'fair';
  itemAge?: number;
};

export type ListingFormData = {
  title: string;
  category: string;
  description: string;
  location: string;
  available: boolean;
  images: File[];
  basePrice: number;
  durationUnit: DurationUnit;
  minRentalPeriod: number;
  maxRentalPeriod?: number;
  availabilityPeriods: AvailabilityPeriod[];
  securityDeposit?: number;
};

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

export type RentalStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'canceled' 
  | 'completed';

export type FormErrors = {
  [key: string]: string;
};

export const DURATION_CHOICES = [
  { value: 'hour', label: 'Per Hour' },
  { value: 'day', label: 'Per Day' },
  { value: 'week', label: 'Per Week' },
  { value: 'month', label: 'Per Month' },
] as const;

export const CATEGORY_CHOICES = [
  'Photography',
  'Camping',
  'Audio',
  'Electronics',
  'Party',
  'Tools',
  'Vehicles',
  'Furniture',
  'Gaming',
  'Sports',
  'Other',
] as const;