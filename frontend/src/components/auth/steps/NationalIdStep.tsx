import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, AlertCircle, FileText, Shield, X } from 'lucide-react';
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

  const handleRemoveFile = (field: 'nationalIdFront' | 'nationalIdBack') => {
    if (field === 'nationalIdFront') {
      setPreviewFront(null);
      onChange({ nationalIdFront: null });
    } else {
      setPreviewBack(null);
      onChange({ nationalIdBack: null });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-green-800">National ID Verification</h2>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="nationalIdNumber" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            National ID Number <span className="text-red-500">*</span>
          </label>
          <Input
            id="nationalIdNumber"
            name="nationalIdNumber"
            type="text"
            value={profileFormData.nationalIdNumber}
            onChange={(e) => onChange({ nationalIdNumber: e.target.value })}
            error={!!errors.nationalIdNumber}
            className={`w-full h-9 sm:h-10 text-sm ${errors.nationalIdNumber ? 'border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.nationalIdNumber && (
            <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.nationalIdNumber}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Please enter your 17-digit National ID number
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              National ID Front <span className="text-red-500">*</span>
            </label>
            {!previewFront ? (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
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
            ) : (
              <div className="mt-4 relative">
                <img
                  src={previewFront}
                  alt="National ID Front"
                  className="w-full h-48 object-contain rounded-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1"
                  onClick={() => handleRemoveFile('nationalIdFront')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {errors.nationalIdFront && (
              <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.nationalIdFront}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              National ID Back <span className="text-red-500">*</span>
            </label>
            {!previewBack ? (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
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
            ) : (
              <div className="mt-4 relative">
                <img
                  src={previewBack}
                  alt="National ID Back"
                  className="w-full h-48 object-contain rounded-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1"
                  onClick={() => handleRemoveFile('nationalIdBack')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {errors.nationalIdBack && (
              <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.nationalIdBack}
              </p>
            )}
          </div>
        </div>

        <div className="bg-amber-50/50 rounded-lg border border-amber-200 p-3 sm:p-4 space-y-4">
          <div className="flex items-center gap-2 text-amber-800 mb-2">
            <Shield className="h-5 w-5" />
            <h3 className="text-xs sm:text-sm font-medium">Important Information</h3>
          </div>
          <div className="space-y-3">
            <p className="text-xs/5 sm:text-sm/6 text-amber-700">
              We need your National ID for verification purposes only. Your information will be kept confidential and used solely for account verification.
            </p>
            <p className="text-xs/5 sm:text-sm/6 text-amber-700">
              Please ensure both sides of your National ID are clearly visible and the text is legible.
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4 space-x-6">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={loading}
          >
            <ChevronLeft size={16} className="mr-2" /> Back
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 w-full sm:w-auto"
            onClick={onNext}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Submit <ChevronRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NationalIdStep;
