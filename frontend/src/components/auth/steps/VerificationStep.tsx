import { Button } from '@/components/ui/button';
import { ChevronLeft, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FormData, FormErrors } from '@/types/auth';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  formData: FormData;
  errors: FormErrors;
  onChange: (data: Partial<FormData>) => void;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const VerificationStep = ({ formData, errors, onChange, onPrev, onSubmit }: Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-800">Verification & Consent</h2>

      <div className="space-y-6">
        <div className="bg-green-50/50 rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <Shield className="h-5 w-5" />
            <h3 className="text-lg font-medium">Terms & Conditions</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Checkbox 
                  id="termsAgreed"
                  checked={formData.termsAgreed}
                  onCheckedChange={(checked) => onChange({ termsAgreed: checked as boolean })}
                  className="h-4 w-4 border-2 border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="termsAgreed" className="text-sm font-medium text-gray-700">
                  I agree to the <Link to="/terms" className="text-green-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link> <span className="text-red-500">*</span>
                </label>
                {errors.termsAgreed && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} className="text-red-500" /> {errors.termsAgreed}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Checkbox 
                  id="dataConsent"
                  checked={formData.dataConsent}
                  onCheckedChange={(checked) => onChange({ dataConsent: checked as boolean })}
                  className="h-4 w-4 border-2 border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="dataConsent" className="text-sm font-medium text-gray-700">
                  I consent to the processing of my personal data <span className="text-red-500">*</span>
                </label>
                {errors.dataConsent && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} className="text-red-500" /> {errors.dataConsent}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Checkbox 
                  id="marketingConsent"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => onChange({ marketingConsent: checked as boolean })}
                  className="h-4 w-4 border-2 border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="marketingConsent" className="text-sm font-medium text-gray-700">
                  I would like to receive updates and offers
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
        <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <CheckCircle size={16} className="text-amber-600" />
          Account Security
        </h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>Your data is encrypted and securely stored</li>
          <li>We never share your personal information with third parties</li>
          <li>You can update your preferences anytime in your account settings</li>
          <li>Marketing emails can be unsubscribed at any time</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onPrev}
          className="border-green-200 text-green-700 hover:bg-green-50"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Contact Details
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onSubmit}
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default VerificationStep; 