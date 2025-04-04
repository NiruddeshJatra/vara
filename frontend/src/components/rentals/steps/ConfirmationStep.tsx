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
import { CheckCircle, ArrowRight, Bell, CreditCard, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ConfirmationStepProps {
  /** Optional custom title for the confirmation message */
  title?: string;
  /** Optional custom description for the confirmation message */
  description?: string;
  /** Optional custom next steps to display */
  nextSteps?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  /** Optional custom tip message */
  tip?: string;
  /** Optional custom primary action button text */
  primaryActionText?: string;
  /** Optional custom secondary action button text */
  secondaryActionText?: string;
}

const ConfirmationStep = ({
  title = "Request Submitted Successfully!",
  description = "Your rental request has been sent to the owner for review.",
  nextSteps = [
    {
      icon: <MessageCircle size={20} className="text-green-700" />,
      title: "Owner Review",
      description: "The owner will review your request details and requirements."
    },
    {
      icon: <Bell size={20} className="text-green-700" />,
      title: "Notification",
      description: "You'll receive a notification once the owner makes a decision."
    },
    {
      icon: <CreditCard size={20} className="text-green-700" />,
      title: "Payment",
      description: "If approved, you'll be prompted to complete the payment securely."
    }
  ],
  tip = "You can track the status of your rental request in your dashboard under \"My Rentals\".",
  primaryActionText = "View My Rentals",
  secondaryActionText = "Browse More Items"
}: ConfirmationStepProps) => {
  return (
    <div className="space-y-8" role="alert" aria-live="polite">
      <div className="text-center">
        <div 
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4"
          aria-hidden="true"
        >
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-semibold text-green-800">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
      
      <div className="bg-green-50/50 rounded-lg border border-gray-200 p-6 space-y-6">
        <h3 className="font-medium text-gray-700">What Happens Next?</h3>
        
        <div className="space-y-4">
          {nextSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div 
                className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"
                aria-hidden="true"
              >
                {step.icon}
              </div>
              <div>
                <h4 className="text-xl font-medium text-green-900">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          <span className="font-medium">Tip:</span> {tip}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          <Link to="/dashboard/rentals" className="flex items-center justify-center">
            {primaryActionText} <ArrowRight size={16} className="ml-2" aria-hidden="true" />
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1 border-green-200 text-green-700 hover:bg-green-50">
          <Link to="/" className="flex items-center justify-center">
            {secondaryActionText}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;