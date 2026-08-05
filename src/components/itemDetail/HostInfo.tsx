import React from 'react';
import { User } from 'lucide-react';

import { useTranslation } from 'react-i18next';
export default function HostInfo() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 h-14 w-14 bg-green-100 rounded-full flex items-center justify-center">
          <User className="h-7 w-7 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t('itemDetail.hostedByBhara')}</h2>
          <p className="text-sm sm:text-base text-gray-600">{t('itemDetail.hostedByBharaDesc')}</p>
        </div>
      </div>
    </div>
  );
} 