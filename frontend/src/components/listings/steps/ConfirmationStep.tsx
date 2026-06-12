// components/listings/ConfirmationStep.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit, Calendar, Image, MapPin, Tag, DollarSign, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ListingFormData } from '@/types/listings';
import { format, parseISO } from 'date-fns';
import { CATEGORY_DISPLAY } from '@/constants/productTypes';

interface Props {
  formData: ListingFormData;
  onEdit: () => void;
  isEditing?: boolean;
  productId?: string;
}

const ConfirmationStep = ({ formData, onEdit, isEditing = false, productId }: Props) => {
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
            {isEditing ? 'Listing Updated Successfully!' : 'Listing Created Successfully!'}
          </h2>
          <p className="text-gray-600 text-xs sm:text-base">
            {isEditing
              ? 'Your product listing has been updated.'
              : 'Your product is now available for rent.'}
          </p>
        </div>

        <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            <div className="font-semibold text-green-700 text-xs sm:text-sm">Title</div>
            <div className="text-gray-600 truncate text-xs sm:text-sm">{formData.title}</div>

            <div className="font-semibold text-green-700 text-xs sm:text-sm">Category</div>
            <div className="text-gray-600 truncate text-xs sm:text-sm">{CATEGORY_DISPLAY[formData.category]}</div>

            <div className="font-semibold text-green-700 text-xs sm:text-sm">Location</div>
            <div className="text-gray-600 truncate text-xs sm:text-sm">{formData.location}</div>

            <div className="font-semibold text-green-700 text-xs sm:text-sm">Images</div>
            <div className="text-gray-600 text-xs sm:text-sm">{formData.images.length} uploaded</div>

            <div className="font-semibold text-green-700 text-xs sm:text-sm">Pricing</div>
            <div className="space-y-2">
              {formData.pricing_tiers.map((tier, index) => (
                <div key={index} className="text-gray-600 whitespace-nowrap text-xs sm:text-sm">
                  {tier.price} Taka 
                  {tier.duration_unit === 'day' ? ' daily' :
                    tier.duration_unit === 'week' ? ' weekly' :
                      tier.duration_unit === 'month' ? ' monthly' :
                        (tier.duration_unit as string).charAt(0).toUpperCase() + (tier.duration_unit as string).slice(1) + 'ly'} <br />
                  {tier.max_period && ` (Max: ${tier.max_period} ${tier.duration_unit}${tier.max_period > 1 ? 's' : ''})`}
                </div>
              ))}
            </div>

            {formData.security_deposit > 0 && (
              <>
                <div className="font-semibold text-green-700 text-xs sm:text-sm">Security Deposit</div>
                <div className="text-gray-600 text-xs sm:text-sm">{formData.security_deposit} Taka</div>
              </>
            )}

            <div className="font-semibold text-green-700 text-xs sm:text-sm">Unavailable Dates</div>
            <div className="text-gray-600 text-xs sm:text-sm">
              {unavailableRanges.length === 0 ? (
                <span>None</span>
              ) : (
                <ul className="list-disc pl-4 space-y-1">
                  {unavailableRanges.map((range, idx) => (
                    <li key={idx}>
                      {format(range.start, 'LLL dd, yyyy')}
                      {range.end > range.start ? ` - ${format(range.end, 'LLL dd, yyyy')}` : ''}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-left max-w-xl mx-auto space-y-4">
        <h4 className="font-semibold text-gray-600">What happens next?</h4>
        <ul className="text-sm sm:text-md list-disc list-inside space-y-1 text-green-700">
          <li>Your listing is now live and available for rent</li>
          <li>You'll receive notifications when someone requests to rent</li>
          <li>You can edit your listing anytime from your dashboard</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <Button
          variant="outline"
          onClick={handleEditAgain}
          className="w-full text-gray-600 font-bold border-gray-300 hover:border-green-500 hover:text-green-600"
        >
          Edit Again
        </Button>
        <Button
          onClick={() => navigate('/my-listings')}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          View My Listings
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;