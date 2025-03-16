// types/listings.ts
export type DurationUnit = 'hour' | 'day' | 'week' | 'month';

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
};

export type AvailabilityPeriod = {
  startDate: string;
  endDate: string;
  available: boolean;
  notes: string;
};

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