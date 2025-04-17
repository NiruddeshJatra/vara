import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight, AlertCircle, User, Phone, MapPin } from 'lucide-react';
import { ProfileFormData, ProfileFormErrors } from '@/types/auth';
import { DateOfBirthPicker } from '@/components/common/DateOfBirthPicker';

interface Props {
  profileFormData: ProfileFormData;
  errors: ProfileFormErrors;
  onChange: (data: Partial<ProfileFormData>) => void;
  onNext: (e: React.FormEvent) => void;
  loading?: boolean;
}

const ContactDetailsStep = ({ profileFormData, errors, onChange, onNext, loading = false }: Props) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h4 className="text-md md:text-xl font-semibold text-green-800">Contact Details</h4>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="firstName"
              name="firstName"
              value={profileFormData.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              error={!!errors.firstName}
              className="pl-9 h-9 sm:h-10 text-sm"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="lastName"
              name="lastName"
              value={profileFormData.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              error={!!errors.lastName}
              className="pl-9 h-9 sm:h-10 text-sm"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.lastName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              value={profileFormData.phoneNumber}
              onChange={(e) => onChange({ phoneNumber: e.target.value })}
              error={!!errors.phoneNumber}
              className="pl-9 h-9 sm:h-10 text-sm"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.phoneNumber ? (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.phoneNumber}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Valid Bangladeshi number format required</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="location"
              name="location"
              placeholder="City, Area"
              value={profileFormData.location}
              onChange={(e) => onChange({ location: e.target.value })}
              error={!!errors.location}
              className="pl-9 h-9 sm:h-10 text-sm"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.location ? (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.location}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Your primary location for rentals</p>
          )}
        </div>

        <div>
          <DateOfBirthPicker
            value={profileFormData.dateOfBirth}
            onChange={(date) => onChange({ dateOfBirth: date })}
            error={!!errors.dateOfBirth}
            label="Date of Birth"
            required={true}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.dateOfBirth}
            </p>
          )}
          {!errors.dateOfBirth && (
            <p className="mt-1 text-xs text-gray-500">Must be 18 years or older</p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Next'} <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsStep;