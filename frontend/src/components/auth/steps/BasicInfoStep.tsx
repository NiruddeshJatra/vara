import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight, AlertCircle, Mail, User, Lock, Shield } from 'lucide-react';
import { FormData, FormErrors } from '@/types/auth';

interface Props {
  formData: FormData;
  errors: FormErrors;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
}

const BasicInfoStep = ({ formData, errors, onChange, onNext }: Props) => {
  const renderPasswordStrength = () => {
    const { password } = formData;
    if (!password) return null;
    
    let strength = 0;
    let label = '';
    let colorClass = '';
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength <= 2) {
      label = 'Weak';
      colorClass = 'bg-red-500';
    } else if (strength <= 4) {
      label = 'Medium';
      colorClass = 'bg-yellow-500';
    } else {
      label = 'Strong';
      colorClass = 'bg-green-500';
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
      <h2 className="text-2xl font-semibold text-green-800">Basic Information</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              data-error={!!errors.email}
              className="pl-9"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.email ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.email}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">We'll send a verification link to this email</p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="username"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => onChange({ username: e.target.value })}
              data-error={!!errors.username}
              className="pl-9"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.username ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.username}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">This will be visible to other users</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => onChange({ password: e.target.value })}
              data-error={!!errors.password}
              className="pl-9"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {renderPasswordStrength()}
          {errors.password ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.password}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">At least 8 characters with letters and numbers</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => onChange({ confirmPassword: e.target.value })}
              data-error={!!errors.confirmPassword}
              className="pl-9"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

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
          onClick={onNext}
        >
          Continue to Contact Details <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoStep; 