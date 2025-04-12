import { RentalRequestFormData, RentalErrors } from '@/types/rentals';
import { DurationUnit } from '@/constants/rental';

export const validateRentalDetails = (formData: RentalRequestFormData, selectedTierMaxPeriod: number | null, currentDurationUnit: DurationUnit): RentalErrors => {
    const newErrors: RentalErrors = {};

    if (!formData.startDate) {
        newErrors.startDate = 'Start date is required';
    } else if (formData.startDate < new Date()) {
        newErrors.startDate = 'Start date must be in the future';
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

export const validateAllRentalSteps = (formData: RentalRequestFormData, selectedTierMaxPeriod: number | null, currentDurationUnit: DurationUnit): RentalErrors => {
    return {
        ...validateRentalDetails(formData, selectedTierMaxPeriod, currentDurationUnit),
        ...validateAdditionalDetails(formData)
    };
};