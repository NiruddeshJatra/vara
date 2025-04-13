// components/rentals/steps/ConfirmationStep.tsx
/**
 * ConfirmationStep Component
 * 
 * Displays a success message and next steps after a rental request submission.
 * Includes a visual confirmation, next steps information, and navigation buttons.
 * 
 * @component
 * @example
 * ```tsx
 * <ConfirmationStep />
 * ```
 */
import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ConfirmationStep = () => {
  return (
    <div className="space-y-6 md:space-y-8 px-2 py-6">
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Request Submitted</h2>
        <p className="text-gray-600 max-w-md mb-6">
          Your rental request has been submitted successfully. The owner will review your request shortly.
        </p>
        
        <div className="w-full max-w-md bg-green-50 rounded-lg p-6 mb-6 border border-green-100">
          <h3 className="font-medium text-green-800 mb-3">What happens next?</h3>
          <ol className="space-y-3 text-sm text-left">
            <li className="flex items-start gap-2">
              <div className="bg-green-100 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-xs font-bold text-green-700">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-700">Owner Approval</p>
                <p className="text-gray-600">The owner will review your rental request and respond within 24 hours.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-green-100 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-xs font-bold text-green-700">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-700">Product Verification</p>
                <p className="text-gray-600">After approval, Vara will contact the owner to inspect and collect the product for safekeeping.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-green-100 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-xs font-bold text-green-700">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-700">Product Collection</p>
                <p className="text-gray-600">Vara will contact you to arrange product pickup or delivery based on your preference.</p>
              </div>
            </li>
          </ol>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button asChild className="bg-green-600 hover:bg-green-700 flex-1">
            <Link to="/rentals">
              View My Rentals
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-green-300 hover:bg-green-50 flex-1">
            <Link to="/advertisements">
              Browse More Items
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;