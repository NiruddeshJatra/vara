import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, AlertCircle, FileText, Shield } from 'lucide-react';
import { ProfileFormData, ProfileFormErrors } from '@/types/auth';

interface Props {
  profileFormData: ProfileFormData;
  errors: ProfileFormErrors;
  onChange: (data: Partial<ProfileFormData>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, field: 'nationalIdFront' | 'nationalIdBack') => void;
  onNext: (e: React.FormEvent) => void;
  onPrev: () => void;
  loading?: boolean;
}

const NationalIdStep = ({ profileFormData, errors, onChange, onFileUpload, onNext, onPrev, loading = false }: Props) => {
  const [previewFront, setPreviewFront] = useState<string | null>(null);
  const [previewBack, setPreviewBack] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'nationalIdFront' | 'nationalIdBack') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'nationalIdFront') {
          setPreviewFront(reader.result as string);
        } else {
          setPreviewBack(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
      onFileUpload(e, field);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-800">National ID Verification</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="nationalIdNumber" className="block text-sm font-medium text-gray-700 mb-1">
            National ID Number <span className="text-red-500">*</span>
          </label>
          <Input
            id="nationalIdNumber"
            name="nationalIdNumber"
            type="text"
            value={profileFormData.nationalIdNumber}
            onChange={(e) => onChange({ nationalIdNumber: e.target.value })}
            error={!!errors.nationalIdNumber}
            className={`w-full ${errors.nationalIdNumber ? 'border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.nationalIdNumber && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.nationalIdNumber}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Please enter your 17-digit National ID number
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              National ID Front <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="h-6 w-6 text-gray-400 mb-2" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    id="nationalIdFront"
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg"
                    onChange={(e) => handleFileChange(e, 'nationalIdFront')}
                    disabled={loading}
                  />
                </label>
              </div>
              {previewFront && (
                <div className="mt-4">
                  <img
                    src={previewFront}
                    alt="National ID Front"
                    className="w-full h-48 object-contain rounded-lg"
                  />
                </div>
              )}
              {errors.nationalIdFront && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.nationalIdFront}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              National ID Back <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="h-6 w-6 text-gray-400 mb-2" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    id="nationalIdBack"
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg"
                    onChange={(e) => handleFileChange(e, 'nationalIdBack')}
                    disabled={loading}
                  />
                </label>
              </div>
              {previewBack && (
                <div className="mt-4">
                  <img
                    src={previewBack}
                    alt="National ID Back"
                    className="w-full h-48 object-contain rounded-lg"
                  />
                </div>
              )}
              {errors.nationalIdBack && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.nationalIdBack}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-amber-50/50 rounded-lg border border-amber-200 p-4 space-y-4">
          <div className="flex items-center gap-2 text-amber-800 mb-2">
            <Shield className="h-5 w-5" />
            <h3 className="text-lg font-medium">Important Information</h3>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              We need your National ID for verification purposes only. Your information will be kept confidential and used solely for account verification.
            </p>
            <p className="text-sm text-gray-600">
              Please ensure both sides of your National ID are clearly visible and the text is legible.
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={loading}
          >
            <ChevronLeft size={16} className="mr-2" /> Back
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Complete'} <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NationalIdStep;
