import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  AlertCircle,
  Mail,
  User,
  Lock,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { RegistrationData, RegistrationFormErrors } from "@/types/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useState } from "react";


interface Props {
  formData: RegistrationData;
  password: string;
  confirmPassword: string;
  errors: RegistrationFormErrors;
  onChange: (data: Partial<RegistrationData>) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onNext: (e: React.FormEvent) => void;
  loading?: boolean;
  showConsent?: boolean;
}

const BasicInfoStep = ({
  formData,
  password,
  confirmPassword,
  errors,
  onChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onNext,
  loading = false,
  showConsent = false,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const renderPasswordStrength = () => {
    const { password1 } = formData;
    if (!password1) return null;

    let strength = 0;
    let label = "";
    let colorClass = "";

    if (password1.length >= 8) strength += 1;
    if (/[A-Z]/.test(password1)) strength += 1;
    if (/[a-z]/.test(password1)) strength += 1;
    if (/[0-9]/.test(password1)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password1)) strength += 1;

    if (strength <= 2) {
      label = "Weak";
      colorClass = "bg-red-500";
    } else if (strength <= 4) {
      label = "Medium";
      colorClass = "bg-yellow-500";
    } else {
      label = "Strong";
      colorClass = "bg-green-500";
    }

    return (
      <div className="mt-1">
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${colorClass}`}
              style={{ width: `${(strength / 5) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h4 className="text-md md:text-xl font-semibold text-green-800">
        Basic Information
      </h4>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="youremail@example.com"
              value={formData.email}
              onChange={(e) => onChange({ email: e.target.value })}
              error={!!errors.email}
              className="pl-9 h-9 sm:h-10 text-sm"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.email ? (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.email}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              We'll send a verification link to this email
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Username <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="username"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => onChange({ username: e.target.value })}
              error={!!errors.username}
              className="pl-9 h-9 sm:h-10 text-sm"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.username ? (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.username}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              This will be visible to other users
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password1}
              onChange={(e) => onPasswordChange(e.target.value)}
              error={!!errors.password1}
              className="pl-9 pr-10 h-9 sm:h-10 text-sm"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </button>
          </div>
          {renderPasswordStrength()}
          {errors.password1 ? (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.password1}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              At least 8 characters with letters and numbers
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              error={!!errors.confirmPassword}
              className="pl-9 pr-10 h-9 sm:h-10 text-sm"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? "Hide password" : "Show password"}
              </span>
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      {showConsent && (
        <div className="bg-green-50/50 rounded-lg border border-gray-200 p-4 space-y-4">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <Shield className="h-5 w-5" />
            <h3 className="text-lg font-medium">Terms & Conditions</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Checkbox 
                  id="termsAgreed"
                  checked={formData.termsAgreed}
                  onCheckedChange={(checked) =>
                    onChange({ termsAgreed: checked === true })
                  }
                  className="h-4 w-4 border-2 border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white rounded mt-1"
                  disabled={loading}
                />
              </div>
              <div className="ml-3 grid gap-1 sm:gap-1.5 leading-none">
                <label htmlFor="termsAgreed" className="text-xs/5 sm:text-sm/6 text-gray-700 font-medium leading-tight sm:leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the <Link to="/terms" className="text-green-600 hover:text-green-700 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-green-600 hover:text-green-700 hover:underline">Privacy Policy</Link> <span className="text-red-500">*</span>
                </label>
                {errors.termsAgreed && (
                  <p className="mt-1 text-xs/5 sm:text-sm/6 text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} className="text-red-500" /> {errors.termsAgreed}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Checkbox 
                  id="marketingConsent"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) =>
                    onChange({ marketingConsent: checked === true })
                  }
                  className="h-4 w-4 border-2 border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white rounded mt-1"
                  disabled={loading}
                />
              </div>
              <div className="ml-3 grid gap-1 sm:gap-1.5 leading-none">
                <label htmlFor="marketingConsent" className="text-xs sm:text-sm text-gray-700 font-medium leading-tight sm:leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to receive marketing communications from Bhara
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 gap-4 sm:gap-0">
        <div className="flex items-center space-x-2 order-2 sm:order-1">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          <span className="text-xs sm:text-sm text-gray-500">
            Your information is secure
          </span>
        </div>
        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 w-full sm:w-auto order-1 sm:order-2"
          disabled={loading || !formData.email || !formData.username || !formData.password1 || !formData.password2 || !formData.termsAgreed}
          onClick={onNext}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              Create Account <ChevronRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoStep;
