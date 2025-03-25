// components/rentals/steps/ConfirmationStep.tsx
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ConfirmationStep = () => {
  return (
    <div className="text-center space-y-8">
      <div className="text-green-600">
        <CheckCircle size={64} className="mx-auto" />
      </div>
      <h2 className="text-2xl font-bold">Request Submitted!</h2>
      
      <div className="text-left max-w-xl mx-auto space-y-4">
        <h3 className="font-medium">Next Steps:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Owner will review your request</li>
          <li>Receive notification of decision</li>
          <li>Complete payment if approved</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link to="/dashboard/rentals">View Requests</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">Browse More</Link>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;