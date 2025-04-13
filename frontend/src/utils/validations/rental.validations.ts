import { RentalRequestFormData, RentalErrors } from '@/types/rentals';
import { DurationUnit } from '@/constants/rental';
import { UnavailableDate } from '@/types/listings';

export const calculateEndDate = (startDate: Date, duration: number, durationUnit: DurationUnit): Date => {
    const endDate = new Date(startDate);
    switch(durationUnit) {
        case 'day':
            endDate.setDate(endDate.getDate() + duration);
            break;
        case 'week':
            endDate.setDate(endDate.getDate() + (duration * 7));
            break;
        case 'month':
            endDate.setMonth(endDate.getMonth() + duration);
            break;
    }
    return endDate;
};

const isDateRangeOverlapping = (
    startDate: Date,
    endDate: Date,
    unavailableDates: UnavailableDate[]
): boolean => {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    return unavailableDates.some(unavailable => {
        if (unavailable.isRange && unavailable.rangeStart && unavailable.rangeEnd) {
            const rangeStart = new Date(unavailable.rangeStart).getTime();
            const rangeEnd = new Date(unavailable.rangeEnd).getTime();
            return (startTime <= rangeEnd && endTime >= rangeStart);
        } else if (unavailable.date) {
            const unavailableDate = new Date(unavailable.date).getTime();
            return (startTime <= unavailableDate && endTime >= unavailableDate);
        }
        return false;
    });
};

export const validateRentalDetails = (
    formData: RentalRequestFormData, 
    selectedTierMaxPeriod: number | null, 
    currentDurationUnit: DurationUnit,
    unavailableDates: UnavailableDate[]
): RentalErrors => {
    const newErrors: RentalErrors = {};

    if (!formData.startDate) {
        newErrors.startDate = 'Start date is required';
    } else {
        // Check if start date is in the future
        if (formData.startDate < new Date()) {
            newErrors.startDate = 'Start date must be in the future';
        } else if (formData.duration) {
            // Calculate end date and check for conflicts
            const endDate = calculateEndDate(formData.startDate, formData.duration, formData.durationUnit);
            if (isDateRangeOverlapping(formData.startDate, endDate, unavailableDates)) {
                newErrors.startDate = 'Selected dates overlap with unavailable dates';
            }
        }
    }
    
    if (formData.duration < 1) {
        newErrors.duration = 'Minimum duration is 1';
    }
    
    if (selectedTierMaxPeriod && formData.duration > selectedTierMaxPeriod) {
        newErrors.duration = `Maximum ${selectedTierMaxPeriod} ${currentDurationUnit}s`;
    }

    return newErrors;
};

export const validateAdditionalDetails = (formData: RentalRequestFormData): RentalErrors => {
    const newErrors: RentalErrors = {};

    if (!formData.purpose) {
        newErrors.purpose = 'Please select a purpose for the rental';
    }

    return newErrors;
};

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