import { RentalRequestFormData, RentalErrors } from '@/types/rentals';
import { UnavailableDate } from '@/types/listings';
import { isWithinRange } from 'date-fns';
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
    errors.startDate = ['Start date is required'];
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(data.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      errors.startDate = ['Start date cannot be in the past'];
    }

    // Check if the date falls within any unavailable ranges
    if (unavailableDates?.length > 0) {
      for (const unavailable of unavailableDates) {
        if (unavailable.isRange && unavailable.rangeStart && unavailable.rangeEnd) {
          const start = new Date(unavailable.rangeStart);
          const end = new Date(unavailable.rangeEnd);
          if (isWithinRange(startDate, start, end)) {
            errors.startDate = ['This date is not available for rental'];
            break;
          }
        } else if (unavailable.date) {
          const unavailableDate = new Date(unavailable.date);
          if (startDate.getTime() === unavailableDate.getTime()) {
            errors.startDate = ['This date is not available for rental'];
            break;
          }
        }
      }
    }
  }

  // Duration validation
  if (!data.duration || data.duration < 1) {
    errors.duration = ['Duration must be at least 1'];
  } else if (maxPeriod && data.duration > maxPeriod) {
    errors.duration = [`Maximum allowed duration is ${maxPeriod} ${durationUnit}${maxPeriod > 1 ? 's' : ''}`];
  }

  // Duration unit validation
  if (!data.durationUnit) {
    errors.durationUnit = ['Duration unit is required'];
  } else if (data.durationUnit !== durationUnit) {
    errors.durationUnit = [`This item can only be rented by ${durationUnit}`];
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
    errors.purpose = ['Please specify the purpose of rental'];
  } else if (data.purpose.length < 10) {
    errors.purpose = ['Please provide more detail about your rental purpose'];
  } else if (data.purpose.length > 500) {
    errors.purpose = ['Purpose description is too long (maximum 500 characters)'];
  }

  // Notes validation (optional)
  if (data.notes && data.notes.length > 1000) {
    errors.notes = ['Notes are too long (maximum 1000 characters)'];
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