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
import { CheckCircle2, Clock, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ConfirmationStep = () => {
  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="space-y-10 sm:space-y-12">
        <div className="text-center">
          <div className="text-green-600">
            <CheckCircle size={48} className="mx-auto my-3" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
            Request Submitted
          </h2>
          <p className="text-gray-600 text-xs/5 sm:text-base">
            Your rental request has been submitted successfully. The owner will
            review your request shortly.
          </p>
        </div>

        <div className="text-left max-w-xl mx-auto space-y-4">
        <h4 className="font-semibold text-gray-600">What happens next?</h4>
        <ul className="text-sm sm:text-md list-disc list-inside space-y-1 text-green-700">
            <li className="flex items-start gap-2">
              <div className="bg-green-100 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-xs font-bold text-green-700">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-700">Owner Approval</p>
                <p className="text-gray-600">
                  The owner will review your rental request and respond within
                  24 hours.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-green-100 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-xs font-bold text-green-700">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-700">
                  Product Verification
                </p>
                <p className="text-gray-600">
                  After approval, Vara will contact the owner to inspect and
                  collect the product for safekeeping.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-green-100 rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-xs font-bold text-green-700">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-700">Product Collection</p>
                <p className="text-gray-600">
                  Vara will contact you to arrange product pickup or delivery
                  based on your preference.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-green-600 hover:bg-green-700 flex-1">
            <Link to="/rentals">View My Rentals</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-green-300 hover:bg-green-50 flex-1"
          >
            <Link to="/advertisements">Browse More Items</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
