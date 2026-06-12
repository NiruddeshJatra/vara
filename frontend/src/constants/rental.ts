/**
 * Rental-related constants for the frontend
 */

export type DurationUnit = 'day' | 'week' | 'month';
export type RentalPurpose = 'event' | 'personal' | 'professional' | 'other';

// Matches backend status strings exactly (rentals/state_machine.py)
export enum RentalStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export const DURATION_UNIT_VALUES: DurationUnit[] = ['day', 'week', 'month'];

export const DURATION_UNIT_DISPLAY: Record<DurationUnit, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month'
};

export const RENTAL_PURPOSE_OPTIONS = [
  { value: 'event', label: 'Event/Party' },
  { value: 'personal', label: 'Personal Use' },
  { value: 'professional', label: 'Professional Use' },
  { value: 'other', label: 'Other' }
] as const;

export const RENTAL_STATUS_DISPLAY: Record<RentalStatus, string> = {
  [RentalStatus.PENDING]: 'Pending',
  [RentalStatus.ACCEPTED]: 'Accepted',
  [RentalStatus.IN_PROGRESS]: 'In Progress',
  [RentalStatus.COMPLETED]: 'Completed',
  [RentalStatus.REJECTED]: 'Rejected',
  [RentalStatus.CANCELLED]: 'Cancelled'
};

export const RENTAL_STATUS_COLORS: Record<RentalStatus, string> = {
  [RentalStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [RentalStatus.ACCEPTED]: 'bg-blue-100 text-blue-800',
  [RentalStatus.IN_PROGRESS]: 'bg-green-100 text-green-800',
  [RentalStatus.COMPLETED]: 'bg-purple-100 text-purple-800',
  [RentalStatus.REJECTED]: 'bg-red-100 text-red-800',
  [RentalStatus.CANCELLED]: 'bg-orange-100 text-orange-800'
};

export const RENTAL_STATUS_ICONS: Record<RentalStatus, string> = {
  pending: '⏳',
  accepted: '✅',
  in_progress: '🚚',
  completed: '🏁',
  rejected: '❌',
  cancelled: '🚫'
};
