import { RentalRequestFormData, RentalErrors } from '@/types/rentals';
import { UnavailableDate } from '@/types/listings';
import { isWithinInterval } from 'date-fns';
import { DurationUnit } from '@/constants/rental';

/**
 * Validate rental details
 */
export const validateRentalDetails = (
  data: RentalRequestFormData,
  maxPeriod: number | null,
  durationUnit: DurationUnit,
  unavailableDates: UnavailableDate[]
): RentalErrors => {
  const errors: RentalErrors = {};

  // Start date validation
  if (!data.startDate) {
    errors.startDate = 'Start date is required';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(data.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      errors.startDate = 'Start date cannot be in the past';
    }

    // Calculate end date for the rental period
    const endDate = calculateEndDate(startDate, data.duration || 1, data.durationUnit || durationUnit);

    // Check if any part of the rental period overlaps with unavailable dates
    if (unavailableDates?.length > 0) {
      for (const unavailable of unavailableDates) {
        if (unavailable.isRange && unavailable.rangeStart && unavailable.rangeEnd) {
          const unavailStart = new Date(unavailable.rangeStart);
          const unavailEnd = new Date(unavailable.rangeEnd);
          
          // Check if rental period overlaps with unavailable range
          if (
            (startDate <= unavailEnd && endDate >= unavailStart) || // Rental period overlaps with unavailable range
            (startDate >= unavailStart && endDate <= unavailEnd) // Rental period is within unavailable range
          ) {
            errors.startDate = 'The selected rental period overlaps with unavailable dates';
            break;
          }
        } else if (unavailable.date) {
          const unavailableDate = new Date(unavailable.date);
          // Check if single unavailable date falls within rental period
          if (unavailableDate >= startDate && unavailableDate <= endDate) {
            errors.startDate = 'The selected rental period includes unavailable dates';
            break;
          }
        }
      }
    }
  }

  // Duration validation
  if (!data.duration || data.duration < 1) {
    errors.duration = 'Duration must be at least 1';
  } else if (maxPeriod && data.duration > maxPeriod) {
    errors.duration = `Maximum allowed duration is ${maxPeriod} ${durationUnit}${maxPeriod > 1 ? 's' : ''}`;
  }

  // Duration unit validation
  if (!data.durationUnit) {
    errors.durationUnit = 'Duration unit is required';
  } else if (data.durationUnit !== durationUnit) {
    errors.durationUnit = `This item can only be rented by ${durationUnit}`;
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
export const calculateEndDate = (startDate: Date, duration: number, durationUnit: DurationUnit): Date => {
  const endDate = new Date(startDate);
  
  switch (durationUnit) {
    case 'day':
      endDate.setDate(endDate.getDate() + duration);
      break;
    case 'week':
      endDate.setDate(endDate.getDate() + (duration * 7));
      break;
    case 'month':
      endDate.setMonth(endDate.getMonth() + duration);
      break;
    default:
      throw new Error(`Invalid duration unit: ${durationUnit}`);
  }
  
  return endDate;
};

/**
 * Validate all rental steps
 */
export const validateAllRentalSteps = (
  formData: RentalRequestFormData,
  selectedTierMaxPeriod: number | null,
  currentDurationUnit: DurationUnit,
  unavailableDates: UnavailableDate[]
): RentalErrors => {
  return {
    ...validateRentalDetails(formData, selectedTierMaxPeriod, currentDurationUnit, unavailableDates),
    ...validateAdditionalDetails(formData)
  };
};