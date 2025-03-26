// components/rentals/steps/ConfirmationStep.tsx
import { CheckCircle, ArrowRight, Bell, CreditCard, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ConfirmationStep = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-semibold text-green-800">Request Submitted Successfully!</h2>
        <p className="text-gray-600 mt-2">Your rental request has been sent to the owner for review.</p>
      </div>
      
      <div className="bg-green-50/50 rounded-lg border border-gray-200 p-6 space-y-6">
        <h4 className="font-medium text-gray-700">What Happens Next?</h4>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <MessageCircle size={20} className="text-green-700" />
            </div>
            <div>
              <h4 className="text-xl font-medium text-green-900">Owner Review</h4>
              <p className="text-gray-600 text-sm">The owner will review your request details and requirements.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Bell size={20} className="text-green-700" />
            </div>
            <div>
              <h4 className="text-xl font-medium text-green-900">Notification</h4>
              <p className="text-gray-600 text-sm">You'll receive a notification once the owner makes a decision.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CreditCard size={20} className="text-green-700" />
            </div>
            <div>
              <h4 className="text-xl font-medium text-green-900">Payment</h4>
              <p className="text-gray-600 text-sm">If approved, you'll be prompted to complete the payment securely.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          <span className="font-medium">Tip:</span> You can track the status of your rental request in your dashboard under "My Rentals".
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          <Link to="/dashboard/rentals" className="flex items-center justify-center">
            View My Rentals <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1 border-green-200 text-green-700 hover:bg-green-50">
          <Link to="/" className="flex items-center justify-center">
            Browse More Items
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;