import { RentalRequestFormData, RentalErrors } from '@/types/rentals';
import { UnavailablePeriod } from '@/types/listings';
import { isWithinInterval } from 'date-fns';
import { DurationUnit } from '@/constants/rental';

/**
 * Validate rental details
 */
export const validateRentalDetails = (
  data: RentalRequestFormData,
  max_period: number | null,
  duration_unit: DurationUnit,
  unavailable_periods: UnavailablePeriod[]
): RentalErrors => {
  const errors: RentalErrors = {};

  // Start date validation
  if (!data.start_date) {
    errors.start_date = 'Start date is required';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start_date = new Date(data.start_date);
    start_date.setHours(0, 0, 0, 0);

    if (start_date < today) {
      errors.start_date = 'Start date cannot be in the past';
    }

    // Calculate end date for the rental period
    const end_date = calculateEndDate(start_date, data.duration || 1, data.duration_unit || duration_unit);

    // Check if any part of the rental period overlaps with unavailable dates
    if (unavailable_periods?.length > 0) {
      for (const unavailable of unavailable_periods) {
        if (unavailable.is_range && unavailable.range_start && unavailable.range_end) {
          const unavailStart = new Date(unavailable.range_start);
          const unavailEnd = new Date(unavailable.range_end);
          
          // Check if rental period overlaps with unavailable range
          if (
            (start_date <= unavailEnd && end_date >= unavailStart) || // Rental period overlaps with unavailable range
            (start_date >= unavailStart && end_date <= unavailEnd) // Rental period is within unavailable range
          ) {
            errors.start_date = 'The selected rental period overlaps with unavailable dates';
            break;
          }
        } else if (unavailable.date) {
          const unavailable_period = new Date(unavailable.date);
          // Check if single unavailable date falls within rental period
          if (unavailable_period >= start_date && unavailable_period <= end_date) {
            errors.start_date = 'The selected rental period includes unavailable dates';
            break;
          }
        }
      }
    }
  }

  // Duration validation
  if (!data.duration || data.duration < 1) {
    errors.duration = 'Duration must be at least 1';
  } else if (max_period && data.duration > max_period) {
    errors.duration = `Maximum allowed duration is ${max_period} ${duration_unit}${max_period > 1 ? 's' : ''}`;
  }

  // Duration unit validation
  if (!data.duration_unit) {
    errors.duration_unit = 'Duration unit is required';
  } else if (data.duration_unit !== duration_unit) {
    errors.duration_unit = `This item can only be rented by ${duration_unit}`;
  }

  return errors;
};

/**
 * Validate additional rental details
 */
export const validateAdditionalDetails = (data: RentalRequestFormData): RentalErrors => {
  const errors: RentalErrors = {};

  // Purpose validation
  if (!data.purpose) {
    errors.purpose = 'Please specify the purpose of rental';
  }

  // Notes validation (optional)
  if (data.notes && data.notes.length > 1000) {
    errors.notes = 'Notes are too long (maximum 1000 characters)';
  }

  return errors;
};

/**
 * Calculate end date based on start date, duration, and duration unit
 */
export const calculateEndDate = (start_date: Date, duration: number, duration_unit: DurationUnit): Date => {
  const end_date = new Date(start_date);
  
  switch (duration_unit) {
    case 'day':
      end_date.setDate(end_date.getDate() + duration);
      break;
    case 'week':
      end_date.setDate(end_date.getDate() + (duration * 7));
      break;
    case 'month':
      end_date.setMonth(end_date.getMonth() + duration);
      break;
    default:
      throw new Error(`Invalid duration unit: ${duration_unit}`);
  }
  
  return end_date;
};

/**
 * Validate all rental steps
 */
export const validateAllRentalSteps = (
  formData: RentalRequestFormData,
  selectedTierMaxPeriod: number | null,
  currentDurationUnit: DurationUnit,
  unavailable_periods: UnavailablePeriod[]
): RentalErrors => {
  return {
    ...validateRentalDetails(formData, selectedTierMaxPeriod, currentDurationUnit, unavailable_periods),
    ...validateAdditionalDetails(formData)
  };
};