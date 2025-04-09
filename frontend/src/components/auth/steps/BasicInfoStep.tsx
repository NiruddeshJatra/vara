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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-800">
        Basic Information
      </h2>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
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
              className="pl-9"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.email ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
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
            className="block text-sm font-medium text-gray-700 mb-1"
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
              className="pl-9"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.username ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
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
            className="block text-sm font-medium text-gray-700 mb-1"
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
              className="pl-9 pr-10"
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
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
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
            className="block text-sm font-medium text-gray-700 mb-1"
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
              className="pl-9 pr-10"
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
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
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
                  onCheckedChange={(checked) => onChange({ termsAgreed: checked as boolean })}
                  className="h-4 w-4 border-2 border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white rounded"
                  disabled={loading}
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
                  id="marketingConsent"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => onChange({ marketingConsent: checked as boolean })}
                  className="h-4 w-4 border-2 border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white rounded"
                  disabled={loading}
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
      )}

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
        <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Shield size={16} className="text-amber-600" />
          Security Tips
        </h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>Use a strong, unique password</li>
          <li>Never share your password with anyone</li>
          <li>Enable two-factor authentication if available</li>
          <li>Keep your account information up to date</li>
        </ul>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          type="submit"
          disabled={loading || !formData.email || !formData.username || !formData.password1 || !formData.password2 || !formData.termsAgreed}
        >
          {loading ? 'Creating account...' : 'Create Account'} <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoStep;
