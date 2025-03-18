// components/listings/ConfirmationStep.tsx
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConfirmationStep = () => {
  return (
    <div className="text-center space-y-8">
      <div className="text-green-600">
        <CheckCircle size={64} className="mx-auto" />
      </div>
      <h2 className="text-2xl font-bold">Listing Created Successfully!</h2>
      
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex justify-between">
          <span className="font-medium">Listing Title:</span>
          <span>Modern Apartment</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Listing ID:</span>
          <span>#12345</span>
        </div>
      </div>

      <div className="text-left max-w-xl mx-auto space-y-4">
        <h3 className="font-medium">What happens next?</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Your listing is now live and available for rent</li>
          <li>You'll receive notifications when someone requests to rent</li>
          <li>You can edit your listing anytime from your dashboard</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link to="/listings/123">View My Listing</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/advertisements">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;