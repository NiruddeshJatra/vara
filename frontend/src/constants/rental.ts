/**
 * Rental-related constants for the frontend
 */

export type DurationUnit = 'day' | 'week' | 'month';

export type RentalStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'canceled' 
  | 'completed';

export const DURATION_CHOICES = [
  { value: 'day', label: 'Per Day' },
  { value: 'week', label: 'Per Week' },
  { value: 'month', label: 'Per Month' }
] as const;

export const RENTAL_STATUS_DISPLAY: Record<RentalStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  canceled: 'Canceled',
  completed: 'Completed'
};

export const RENTAL_STATUS_COLORS: Record<RentalStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  canceled: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800'
};

export const RENTAL_STATUS_ICONS: Record<RentalStatus, string> = {
  pending: '⏳',
  approved: '✅',
  rejected: '❌',
  canceled: '🚫',
  completed: '🏁'
}; 