import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ListingFormData, FormError } from '@/types/listings';
import { Info } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { OwnershipHistory } from '@/constants/productAttributes';
import { useTranslation } from 'react-i18next';

type Props = {
  formData: ListingFormData;
  onChange: (data: Partial<ListingFormData>) => void;
  errors?: FormError;
  onNext: () => void;
  onBack: () => void;
};

const ProductHistoryStep = ({ formData, onChange, errors = {} }: Props) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - i);

  const handleChange = (field: keyof ListingFormData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 mt-5">
        <h4 className="text-md md:text-xl font-semibold text-green-800">{t('listing.history.title')}</h4>
        <p className="text-xs/5 md:text-sm/6 text-gray-600">
          {t('listing.history.subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="purchase_year" className="text-xs md:text-sm font-medium text-gray-700">
              {t('listing.history.purchaseYear')} <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.purchase_year} 
              onValueChange={(value) => handleChange('purchase_year', value)}
            >
              <SelectTrigger className={`h-9 sm:h-10 text-xs md:text-sm ${errors.purchase_year ? "border-red-500" : ""}`}>
                {formData.purchase_year || t('listing.history.selectYear')}
              </SelectTrigger>
              <SelectContent className="text-xs md:text-sm">
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.purchase_year && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">{errors.purchase_year[0]}</p>
            )}
            <p className="text-xs text-gray-500">
              {t('listing.history.purchaseYearHint')}
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="original_price" className="text-xs md:text-sm font-medium text-gray-700">
              {t('listing.history.originalPrice')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="original_price"
              type="number"
              min="0"
              value={formData.original_price || ''}
              onChange={(e) => handleChange('original_price', e.target.value ? Number(e.target.value) : undefined)}
              className={`h-10 text-sm ${errors.original_price ? "border-red-500" : ""}`}
              placeholder={t('listing.history.originalPricePlaceholder')}
            />
            {errors.original_price && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">{errors.original_price[0]}</p>
            )}
            <p className="text-xs text-gray-500">
              {t('listing.history.originalPriceHint')}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs md:text-sm font-medium text-gray-700">
            {t('listing.history.ownership')} <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.ownership_history}
            onValueChange={(value) => handleChange('ownership_history', value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value={OwnershipHistory.FIRSTHAND} 
                id="ownership-firsthand" 
                className="text-green-600 h-4 w-4" 
              />
              <Label htmlFor="ownership-firsthand" className="text-xs md:text-sm">{t('listing.history.firstHand')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value={OwnershipHistory.SECONDHAND} 
                id="ownership-secondhand" 
                className="text-green-600 h-4 w-4" 
              />
              <Label htmlFor="ownership-secondhand" className="text-xs md:text-sm">{t('listing.history.secondHand')}</Label>
            </div>
          </RadioGroup>
          {errors.ownership_history && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">{errors.ownership_history[0]}</p>
          )}
          <p className="text-xs text-gray-500">
            {t('listing.history.ownershipHint')}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 mt-4">
        <h4 className="text-xs font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Info size={14} className="text-amber-600" />
          {t('listing.history.whyTitle')}
        </h4>
        <ul className="text-xs/5 sm:text-sm/6 text-amber-700 space-y-1 list-disc pl-5">
          <li>{t('listing.history.why1')}</li>
          <li>{t('listing.history.why2')}</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductHistoryStep;
