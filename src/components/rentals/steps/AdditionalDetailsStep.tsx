// components/rentals/steps/AdditionalDetailsStep.tsx
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RentalRequestFormData, RentalErrors } from "@/types/rentals";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  formData: RentalRequestFormData;
  errors: RentalErrors;
  onChange: (data: Partial<RentalRequestFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
}

const AdditionalDetailsStep = ({
  formData,
  errors,
  onChange,
  onNext,
  onPrev,
  loading = false,
}: Props) => {
  const { t } = useTranslation();
  const PURPOSE_OPTIONS = [
    { value: "event", label: t('requestRental.purpose.event') },
    { value: "personal", label: t('requestRental.purpose.personal') },
    { value: "professional", label: t('requestRental.purpose.professional') },
    { value: "other", label: t('requestRental.purpose.other') },
  ];

  // Add a handler to clear errors when input changes
  const handleInputChange = (data: Partial<RentalRequestFormData>) => {
    onChange(data);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h4 className="text-md md:text-xl font-semibold text-green-800">
        {t('requestRental.additionalInfo')}
      </h4>

      <div className="space-y-6">
        <div>
          <label className="block text-xs sm:text-sm md:text-md font-medium text-gray-700 mb-1">
            {t('requestRental.purposeLabel')} <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.purpose || ""}
            onValueChange={(value) => handleInputChange({ purpose: value })}
          >
            <SelectTrigger className={`h-9 sm:h-10 text-xs sm:text-sm md:text-md ${errors.purpose ? 'border-red-500' : ''}`}>
              {formData.purpose
                ? PURPOSE_OPTIONS.find((opt) => opt.value === formData.purpose)
                    ?.label
                : t('requestRental.selectPurpose')}
            </SelectTrigger>
            <SelectContent className="text-xs sm:text-sm md:text-md">
              {PURPOSE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.purpose && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.purpose}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm md:text-md font-medium text-gray-700 mb-1">
            {t('requestRental.notesLabel')}
          </label>
          <Textarea
            value={formData.notes || ""}
            onChange={(e) => handleInputChange({ notes: e.target.value })}
            className="min-h-[100px] text-xs sm:text-sm md:text-md"
            placeholder={t('requestRental.notesPlaceholder')}
          />
          <p className="text-xs text-gray-500">
            {t('requestRental.notesHint')}
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
          <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <Info size={16} className="text-amber-600" />
            {t('requestRental.importantInfo')}
          </h3>
          <ul className="text-xs/5 sm:text-sm/6 text-amber-700 space-y-0.5 sm:space-y-1 list-disc pl-4 sm:pl-5">
            <li>{t('requestRental.info1')}</li>
            <li>{t('requestRental.info2')}</li>
            <li>{t('requestRental.info3')}</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          className="border-green-300 hover:bg-green-50"
          onClick={onPrev}
          disabled={loading}
        >
          <ChevronLeft size={16} className="mr-1" /> {t('common.back')}
        </Button>

        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onNext}
          disabled={loading}
        >
          {loading ? t('common.processingEllipsis') : t('requestRental.reviewConfirm')}{" "}
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default AdditionalDetailsStep;
