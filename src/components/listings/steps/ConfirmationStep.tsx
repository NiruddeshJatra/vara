// components/listings/ConfirmationStep.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit, Calendar, Image, MapPin, Tag, DollarSign, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ListingFormData } from '@/types/listings';
import { format, parseISO } from 'date-fns';
import { CATEGORY_DISPLAY } from '@/constants/productTypes';
import { useTranslation } from 'react-i18next';
import { formatDate as formatDateIntl } from '@/utils/formatDate';

interface Props {
  formData: ListingFormData;
  onEdit: () => void;
  isEditing?: boolean;
  productId?: string;
}

const ConfirmationStep = ({ formData, onEdit, isEditing = false, productId }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleEditAgain = () => {
    console.log("Edit Again clicked - using onEdit callback");
    console.log("Current productId:", productId);
    onEdit();
  };

  // Group unavailable dates into ranges
  const getUnavailableDateRanges = () => {
    if (!formData.unavailable_periods || formData.unavailable_periods.length === 0) {
      return [];
    }

    // Filter out null dates and convert to Date objects
    const validDates = formData.unavailable_periods
      .filter(date => date.date !== null)
      .map(date => ({
        date: parseISO(date.date!),
        is_range: date.is_range,
        range_start: date.range_start ? parseISO(date.range_start) : null,
        range_end: date.range_end ? parseISO(date.range_end) : null
      }));

    // Sort dates
    const sortedDates = [...validDates].sort((a, b) => a.date.getTime() - b.date.getTime());

    const ranges = [];
    let range_start = sortedDates[0].date;
    let range_end = sortedDates[0].date;

    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i].date;
      const prevDate = sortedDates[i - 1].date;

      // Check if dates are consecutive
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        // Consecutive date, extend the range
        range_end = currentDate;
      } else {
        // Non-consecutive date, add the current range and start a new one
        ranges.push({ start: range_start, end: range_end });
        range_start = currentDate;
        range_end = currentDate;
      }
    }

    // Add the last range
    ranges.push({ start: range_start, end: range_end });

    return ranges;
  };

  const unavailableRanges = getUnavailableDateRanges();

  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="space-y-10 sm:space-y-12">
        <div className="text-center">
          <div className="text-green-600">
            <CheckCircle size={48} className="mx-auto my-3" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
            {isEditing ? t('listing.confirm.updatedTitle') : t('listing.confirm.createdTitle')}
          </h2>
          <p className="text-gray-600 text-xs sm:text-base">
            {isEditing
              ? t('listing.confirm.updatedSubtitle')
              : t('listing.confirm.createdSubtitle')}
          </p>
        </div>

        <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            <div className="font-semibold text-green-700 text-xs sm:text-sm">{t('listing.titleLabel')}</div>
            <div className="text-gray-600 truncate text-xs sm:text-sm">{formData.title}</div>

            <div className="font-semibold text-green-700 text-xs sm:text-sm">{t('listings.category')}</div>
            <div className="text-gray-600 truncate text-xs sm:text-sm">{t('categories.' + formData.category, { defaultValue: CATEGORY_DISPLAY[formData.category] })}</div>

            <div className="font-semibold text-green-700 text-xs sm:text-sm">{t('listings.location')}</div>
            <div className="text-gray-600 truncate text-xs sm:text-sm">{formData.location}</div>

            <div className="font-semibold text-green-700 text-xs sm:text-sm">{t('listing.confirm.images')}</div>
            <div className="text-gray-600 text-xs sm:text-sm">{t('listing.confirm.uploadedCount', { count: formData.images.length })}</div>

            <div className="font-semibold text-green-700 text-xs sm:text-sm">{t('listing.pricing.title')}</div>
            <div className="space-y-2">
              {formData.pricing_tiers.map((tier, index) => (
                <div key={index} className="text-gray-600 whitespace-nowrap text-xs sm:text-sm">
                  {tier.price} {t('common.taka')} ({t('listing.pricing.per')} {t('rental.units.' + tier.duration_unit, { count: 1 })}) <br />
                  {tier.max_period && ` (${t('requestRental.max')}: ${tier.max_period} ${t('rental.units.' + tier.duration_unit, { count: tier.max_period })})`}
                </div>
              ))}
            </div>

            {formData.security_deposit > 0 && (
              <>
                <div className="font-semibold text-green-700 text-xs sm:text-sm">{t('listings.securityDeposit')}</div>
                <div className="text-gray-600 text-xs sm:text-sm">{formData.security_deposit} {t('common.taka')}</div>
              </>
            )}

            <div className="font-semibold text-green-700 text-xs sm:text-sm">{t('listing.confirm.unavailableDates')}</div>
            <div className="text-gray-600 text-xs sm:text-sm">
              {unavailableRanges.length === 0 ? (
                <span>{t('listing.confirm.none')}</span>
              ) : (
                <ul className="list-disc pl-4 space-y-1">
                  {unavailableRanges.map((range, idx) => (
                    <li key={idx}>
                      {formatDateIntl(range.start)}
                      {range.end > range.start ? ` - ${formatDateIntl(range.end)}` : ''}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-left max-w-xl mx-auto space-y-4">
        <h4 className="font-semibold text-gray-600">{t('requestRental.confirm.whatNext')}</h4>
        <ul className="text-sm sm:text-md list-disc list-inside space-y-1 text-green-700">
          <li>{t('listing.confirm.next1')}</li>
          <li>{t('listing.confirm.next2')}</li>
          <li>{t('listing.confirm.next3')}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <Button
          variant="outline"
          onClick={handleEditAgain}
          className="w-full text-gray-600 font-bold border-gray-300 hover:border-green-500 hover:text-green-600"
        >
          {t('listing.confirm.editAgain')}
        </Button>
        <Button
          onClick={() => navigate('/my-listings')}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {t('listing.confirm.viewListings')}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;