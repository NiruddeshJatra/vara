// components/listings/ConfirmationStep.tsx
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit, Calendar, Image, MapPin, Tag, DollarSign, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ListingFormData } from '@/types/listings';
import { format } from 'date-fns';

type Props = {
  formData: ListingFormData;
  onEdit: () => void;
};

const ConfirmationStep = ({ formData, onEdit }: Props) => {
  // Group unavailable dates into ranges
  const getUnavailableDateRanges = () => {
    if (!formData.unavailableDates || formData.unavailableDates.length === 0) {
      return [];
    }

    // Sort dates
    const sortedDates = [...formData.unavailableDates].sort((a, b) => a.getTime() - b.getTime());
    
    const ranges = [];
    let rangeStart = sortedDates[0];
    let rangeEnd = sortedDates[0];
    
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const prevDate = sortedDates[i - 1];
      
      // Check if dates are consecutive
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive date, extend the range
        rangeEnd = currentDate;
      } else {
        // Non-consecutive date, add the current range and start a new one
        ranges.push({ start: rangeStart, end: rangeEnd });
        rangeStart = currentDate;
        rangeEnd = currentDate;
      }
    }
    
    // Add the last range
    ranges.push({ start: rangeStart, end: rangeEnd });
    
    return ranges;
  };

  const unavailableRanges = getUnavailableDateRanges();

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="text-green-600">
          <CheckCircle size={48} className="mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-green-800 mt-4">Listing Created Successfully!</h2>
      </div>
      
      <div className="max-w-lg mx-auto">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="w-1/3 text-right pr-8">
              <span className="text-xl font-medium text-gray-700">Title</span>
            </div>
            <div className="w-2/3 text-left">
              <span className="text-xl font-medium text-green-800">{formData.title}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-1/3 text-right pr-8">
              <span className="text-xl font-medium text-gray-700">Category</span>
            </div>
            <div className="w-2/3 text-left">
              <span className="text-xl font-medium text-green-800">{formData.category}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-1/3 text-right pr-8">
              <span className="text-xl font-medium text-gray-700">Location</span>
            </div>
            <div className="w-2/3 text-left">
              <span className="text-xl font-medium text-green-800">{formData.location}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-1/3 text-right pr-8">
              <span className="text-xl font-medium text-gray-700">Images</span>
            </div>
            <div className="w-2/3 text-left">
              <span className="text-xl font-medium text-green-800">{formData.images.length} uploaded</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-1/3 text-right pr-8">
              <span className="text-xl font-medium text-gray-700">Pricing</span>
            </div>
            <div className="w-2/3 text-left">
              {formData.pricingTiers.map((tier, index) => (
                <div key={index} className="text-xl font-medium text-green-800">
                  {tier.durationUnit.charAt(0).toUpperCase() + tier.durationUnit.slice(1)}ly: {tier.price} Taka
                  {tier.maxPeriod && ` (Max: ${tier.maxPeriod} ${tier.durationUnit}${tier.maxPeriod > 1 ? 's' : ''})`}
                </div>
              ))}
              {formData.securityDeposit && (
                <div className="text-xl font-medium text-green-800 mt-1">
                  Security Deposit: {formData.securityDeposit} Taka
                </div>
              )}
            </div>
          </div>
          
          {unavailableRanges.length > 0 && (
            <div className="flex items-start">
              <div className="w-1/3 text-right pr-8 pt-1">
                <span className="text-xl font-medium text-gray-700">Unavailable Dates</span>
              </div>
              <div className="w-2/3 text-left">
                <div className="flex flex-wrap gap-2">
                  {unavailableRanges.map((range, index) => (
                    <div key={index} className="text-sm bg-red-50 text-red-800 px-3 py-1.5 rounded-md">
                      {format(range.start, "MMM d")} - {format(range.end, "MMM d, yyyy")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-left max-w-xl mx-auto space-y-4">
        <h3 className="font-medium text-green-800">What happens next?</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Your listing is now live and available for rent</li>
          <li>You'll receive notifications when someone requests to rent</li>
          <li>You can edit your listing anytime from your dashboard</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link to="/listings">View My Listings</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;