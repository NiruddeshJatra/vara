
import React from 'react';

import { useTranslation } from 'react-i18next';
type LoadMoreTriggerProps = {
  visible: boolean;
};

const LoadMoreTrigger = ({ visible }: LoadMoreTriggerProps) => {
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <div 
      id="load-more-trigger"
      className="text-center mt-10 py-4"
    >
      <div className="animate-pulse text-gray-400">{t('ads.loadingMore')}</div>
    </div>
  );
};

export default LoadMoreTrigger;
