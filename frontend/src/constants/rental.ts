/**
 * Rental-related constants for the frontend
 */

export enum DurationUnit {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month'
}

export enum RentalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export const DURATION_UNIT_VALUES = Object.values(DurationUnit);

export const DURATION_UNIT_DISPLAY: Record<DurationUnit, string> = {
  [DurationUnit.DAY]: 'Day',
  [DurationUnit.WEEK]: 'Week',
  [DurationUnit.MONTH]: 'Month'
};

export const RENTAL_STATUS_DISPLAY: Record<RentalStatus, string> = {
  [RentalStatus.PENDING]: 'Pending',
  [RentalStatus.APPROVED]: 'Approved',
  [RentalStatus.REJECTED]: 'Rejected',
  [RentalStatus.CANCELLED]: 'Cancelled',
  [RentalStatus.COMPLETED]: 'Completed'
};

export const RENTAL_STATUS_COLORS: Record<RentalStatus, string> = {
  [RentalStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [RentalStatus.APPROVED]: 'bg-green-100 text-green-800',
  [RentalStatus.REJECTED]: 'bg-red-100 text-red-800',
  [RentalStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
  [RentalStatus.COMPLETED]: 'bg-blue-100 text-blue-800'
};

export const RENTAL_STATUS_ICONS: Record<RentalStatus, string> = {
  pending: '⏳',
  approved: '✅',
  rejected: '❌',
  cancelled: '🚫',
  completed: '🏁'
}; 