
import React from 'react';
import { SearchX } from 'lucide-react';

import { useTranslation } from 'react-i18next';
const EmptyState = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <SearchX className="h-16 w-16 text-vhara-300" />
      </div>
      <h3 className="text-xl font-medium mb-2">{t('ads.noItemsTitle')}</h3>
      <p className="text-gray-500">
        Try adjusting your search or filter to find what you're looking for.
      </p>
    </div>
  );
};

export default EmptyState;
