import React from 'react';
import { RefreshCw, Check } from 'lucide-react';

import { useTranslation } from 'react-i18next';
export default function VharaService() {
  const { t } = useTranslation();
  return (
    <div className="mb-10 pb-10 border-b border-gray-200">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">{t('itemDetail.bharaService')}</h3>
      <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-5 bg-green-50 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-green-800">{t('itemDetail.serviceTitle')}</h2>
              <p className="text-sm sm:text-base text-green-700">{t('itemDetail.serviceSubtitle')}</p>
            </div>
          </div>
        </div>
        <div className="py-4 sm:py-6 px-6 bg-green-50/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-green-900">{t('itemDetail.service1Title')}</h4>
                <p className="text-sm sm:text-base text-gray-600">{t('itemDetail.service1Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-green-900">{t('itemDetail.service2Title')}</h4>
                <p className="text-sm sm:text-base text-gray-600">{t('itemDetail.service2Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-green-900">{t('itemDetail.service3Title')}</h4>
                <p className="text-sm sm:text-base text-gray-600">{t('itemDetail.service3Desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-100 p-1.5 flex-shrink-0">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-green-900">{t('itemDetail.service4Title')}</h4>
                <p className="text-sm sm:text-base text-gray-600">{t('itemDetail.service4Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 