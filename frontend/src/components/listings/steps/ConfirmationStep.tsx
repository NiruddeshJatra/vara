// components/listings/ConfirmationStep.tsx
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ListingFormData } from '@/types/listings';
import { format } from 'date-fns';

type Props = {
  formData: ListingFormData;
  onEdit: () => void;
};

const ConfirmationStep = ({ formData, onEdit }: Props) => {
  return (
    <div className="text-center space-y-8">
      <div className="text-green-600">
        <CheckCircle size={64} className="mx-auto" />
      </div>
      <h2 className="text-2xl font-bold">Listing Created Successfully!</h2>
      
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex justify-between">
          <span className="font-medium">Listing Title:</span>
          <span>{formData.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Category:</span>
          <span>{formData.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Location:</span>
          <span>{formData.location}</span>
        </div>
      </div>

      <div className="text-left max-w-xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-green-800">Pricing Tiers</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEdit}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Edit size={16} className="mr-1" /> Edit
          </Button>
        </div>
        
        <div className="space-y-2">
          {formData.pricingTiers.map((tier, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between">
                <span className="font-medium">
                  {tier.durationUnit.charAt(0).toUpperCase() + tier.durationUnit.slice(1)}ly Rate:
                </span>
                <span>{tier.price} Taka</span>
              </div>
              {tier.maxPeriod && (
                <div className="text-sm text-gray-500">
                  Max: {tier.maxPeriod} {tier.durationUnit}{tier.maxPeriod > 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {formData.securityDeposit && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">Security Deposit:</span>
              <span>{formData.securityDeposit} Taka</span>
            </div>
          </div>
        )}
      </div>

      {formData.unavailableDates && formData.unavailableDates.length > 0 && (
        <div className="text-left max-w-xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-green-800 flex items-center">
              <Calendar size={18} className="mr-2" />
              Unavailable Dates
            </h3>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex flex-wrap gap-2">
              {formData.unavailableDates.map((date, index) => (
                <span key={index} className="bg-red-50 text-red-700 px-2 py-1 rounded-md text-sm">
                  {format(date, "PPP")}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

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