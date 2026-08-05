import React from 'react';
import { Calendar } from 'lucide-react';
import AvailabilityCalendar from '@/components/listings/UnavailabilityCalendar';

import { useTranslation } from 'react-i18next';
interface DateRange {
  start: Date;
  end: Date;
}

interface AvailabilitySectionProps {
  unavailable_periods: (Date | DateRange)[];
}

export default function AvailabilitySection({ unavailable_periods }: AvailabilitySectionProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-10 pb-10 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('listings.availability')}</h2>
        <div className="flex items-center text-sm text-green-700 bg-green-50 px-2 py-1 rounded-md">
          <Calendar className="h-4 w-4 mr-1" />
          {t('itemDetail.availableNow')}
        </div>
      </div>
      
      <AvailabilityCalendar unavailable_periods={unavailable_periods} />
    </div>
  );
} 