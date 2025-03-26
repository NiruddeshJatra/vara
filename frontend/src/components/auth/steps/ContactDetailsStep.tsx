import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, AlertCircle, User, Phone, MapPin, Calendar } from 'lucide-react';
import { FormData, FormErrors } from '@/types/auth';

interface Props {
  formData: FormData;
  errors: FormErrors;
  onChange: (data: Partial<FormData>) => void;
  onNext: (e: React.FormEvent) => void;
  onPrev: () => void;
}

const ContactDetailsStep = ({ formData, errors, onChange, onNext, onPrev }: Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-800">Contact Details</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              error={!!errors.firstName}
              className="pl-9"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              error={!!errors.lastName}
              className="pl-9"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.lastName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              value={formData.phoneNumber}
              onChange={(e) => onChange({ phoneNumber: e.target.value })}
              error={!!errors.phoneNumber}
              className="pl-9"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.phoneNumber ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.phoneNumber}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Valid Bangladeshi number format required</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="location"
              name="location"
              placeholder="City, Area"
              value={formData.location}
              onChange={(e) => onChange({ location: e.target.value })}
              error={!!errors.location}
              className="pl-9"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.location ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.location}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Your primary location for rentals</p>
          )}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <div className="relative">
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => onChange({ dateOfBirth: e.target.value })}
              error={!!errors.dateOfBirth}
              className="pl-9"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.dateOfBirth ? (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.dateOfBirth}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Must be 18 years or older</p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
        <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <MapPin size={16} className="text-amber-600" />
          Location Tips
        </h3>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>Provide your primary location for better rental matches</li>
          <li>Include area details for more accurate delivery options</li>
          <li>Update your location if you move to a different area</li>
          <li>This helps owners determine delivery feasibility</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onPrev}
          className="border-green-200 text-green-700 hover:bg-green-50"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Basic Info
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onNext}
        >
          Continue to Verification <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default ContactDetailsStep; 