import { ListingFormData, FormError } from '@/types/listings';

export const validateBasicDetails = (data: ListingFormData): FormError => {
    const newErrors: FormError = {};
    if (!data.title) newErrors.title = ['Title is required'];
    if (!data.productType) newErrors.productType = ['Product type is required'];
    if (!data.description) newErrors.description = ['Description is required'];
    if (!data.location) newErrors.location = ['Location is required'];
    return newErrors;
};

export const validateImageUpload = (data: ListingFormData): FormError => {
    const newErrors: FormError = {};
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (data.images.length === 0) {
        newErrors.images = ['At least one image required'];
    } else {
        // Check each image's size
        data.images.forEach((file, index) => {
            if (file.size > MAX_FILE_SIZE) {
                newErrors.images = [`Image ${index + 1} is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 5MB.`];
            }
        });
    }
    return newErrors;
};

export const validateProductHistory = (data: ListingFormData): FormError => {
    const newErrors: FormError = {};
    if (!data.purchaseYear) newErrors.purchaseYear = ['Purchase year is required'];
    if (!data.originalPrice || data.originalPrice <= 0) newErrors.originalPrice = ['Original price is required and must be greater than 0'];
    if (!data.ownershipHistory) newErrors.ownershipHistory = ['Ownership history is required'];
    return newErrors;
};

export const validatePricing = (data: ListingFormData): FormError => {
    const newErrors: FormError = {};

    if (!data.pricingTiers || data.pricingTiers.length === 0) {
        newErrors.pricingTiers = ['At least one pricing tier is required'];
    } else {
        // Check for duplicate duration units
        const durationUnits = new Set();
        data.pricingTiers.forEach((tier, index) => {
            if (durationUnits.has(tier.durationUnit)) {
                newErrors[`pricingTiers.${index}.durationUnit`] = ['Duplicate duration unit is not allowed'];
            } else {
                durationUnits.add(tier.durationUnit);
            }

            if (!tier.price || tier.price <= 0) {
                newErrors[`pricingTiers.${index}.price`] = ['Price is required and must be greater than 0'];
            }
            if (tier.maxPeriod && tier.maxPeriod < 1) {
                newErrors[`pricingTiers.${index}.maxPeriod`] = ['Maximum period must be at least 1'];
            }
        });
    }

    return newErrors;
};

export const validateUnavailability = (data: ListingFormData): FormError => {
    const newErrors: FormError = {};

    if (!data.unavailableDates || data.unavailableDates.length === 0) {
        return newErrors; // Unavailable dates are optional
    }

    // Validate individual dates/ranges
    data.unavailableDates.forEach((date, index) => {
        // For single dates
        if (!date.isRange && date.date) {
            const selectedDate = new Date(date.date);
            if (selectedDate < new Date()) {
                newErrors[`unavailableDates.${index}.date`] = ['Cannot select dates in the past'];
            }
        }

        // For date ranges
        if (date.isRange) {
            if (date.rangeStart && date.rangeEnd) {
                const startDate = new Date(date.rangeStart);
                const endDate = new Date(date.rangeEnd);
                const today = new Date();

                if (startDate < today) {
                    newErrors[`unavailableDates.${index}.rangeStart`] = ['Range start date cannot be in the past'];
                }

                if (endDate < startDate) {
                    newErrors[`unavailableDates.${index}.rangeEnd`] = ['Range end date must be after start date'];
                }
            } else {
                if (!date.rangeStart) {
                    newErrors[`unavailableDates.${index}.rangeStart`] = ['Range start date is required'];
                }
                if (!date.rangeEnd) {
                    newErrors[`unavailableDates.${index}.rangeEnd`] = ['Range end date is required'];
                }
            }
        }
    });

    return newErrors;
};

export const validateAllSteps = (data: ListingFormData): FormError => {
    return {
        ...validateBasicDetails(data),
        ...validateImageUpload(data),
        ...validateProductHistory(data),
        ...validatePricing(data),
        ...validateUnavailability(data)
    };
};