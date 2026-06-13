import i18n from '@/i18n';
import { ListingFormData, FormError } from '@/types/listings';

export const validateBasicDetails = (data: ListingFormData): FormError => {
    const newErrors: FormError = {};
    if (!data.title) newErrors.title = [i18n.t('validation.titleRequired')];
    if (!data.product_type) newErrors.product_type = [i18n.t('validation.productTypeRequired')];
    if (!data.description) newErrors.description = [i18n.t('validation.descriptionRequired')];
    if (!data.location) newErrors.location = [i18n.t('validation.locationRequired')];
    return newErrors;
};

export const validateImageUpload = (data: ListingFormData): FormError => {
    const newErrors: FormError = {};
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (data.images.length === 0) {
        newErrors.images = [i18n.t('validation.imageRequired')];
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
    if (!data.purchase_year) newErrors.purchase_year = [i18n.t('validation.purchaseYearRequired')];
    if (!data.original_price || data.original_price <= 0) newErrors.original_price = [i18n.t('validation.originalPriceRequired')];
    if (!data.ownership_history) newErrors.ownership_history = [i18n.t('validation.ownershipRequired')];
    return newErrors;
};

export const validatePricing = (data: ListingFormData): FormError => {
    const newErrors: FormError = {};

    if (!data.pricing_tiers || data.pricing_tiers.length === 0) {
        newErrors.pricing_tiers = [i18n.t('validation.tierRequired')];
    } else {
        // Check for duplicate duration units
        const durationUnits = new Set();
        data.pricing_tiers.forEach((tier, index) => {
            if (durationUnits.has(tier.duration_unit)) {
                newErrors[`pricing_tiers.${index}.duration_unit`] = [i18n.t('validation.duplicateUnit')];
            } else {
                durationUnits.add(tier.duration_unit);
            }

            if (!tier.price || tier.price <= 0) {
                newErrors[`pricing_tiers.${index}.price`] = [i18n.t('validation.priceRequired')];
            }
            if (tier.max_period && tier.max_period < 1) {
                newErrors[`pricing_tiers.${index}.max_period`] = [i18n.t('validation.maxPeriodMin')];
            }
        });
    }

    return newErrors;
};

export const validateUnavailability = (data: ListingFormData): FormError => {
    const newErrors: FormError = {};

    if (!data.unavailable_periods || data.unavailable_periods.length === 0) {
        return newErrors; // Unavailable dates are optional
    }

    // Validate individual dates/ranges
    data.unavailable_periods.forEach((date, index) => {
        // For single dates
        if (!date.is_range && date.date) {
            const selectedDate = new Date(date.date);
            if (selectedDate < new Date()) {
                newErrors[`unavailable_periods.${index}.date`] = [i18n.t('validation.datePast')];
            }
        }

        // For date ranges
        if (date.is_range) {
            if (date.range_start && date.range_end) {
                const start_date = new Date(date.range_start);
                const end_date = new Date(date.range_end);
                const today = new Date();

                if (start_date < today) {
                    newErrors[`unavailable_periods.${index}.range_start`] = [i18n.t('validation.rangeStartPast')];
                }

                if (end_date < start_date) {
                    newErrors[`unavailable_periods.${index}.range_end`] = [i18n.t('validation.rangeEndAfterStart')];
                }
            } else {
                if (!date.range_start) {
                    newErrors[`unavailable_periods.${index}.range_start`] = [i18n.t('validation.rangeStartRequired')];
                }
                if (!date.range_end) {
                    newErrors[`unavailable_periods.${index}.range_end`] = [i18n.t('validation.rangeEndRequired')];
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