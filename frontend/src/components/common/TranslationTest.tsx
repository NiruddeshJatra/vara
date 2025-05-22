import React from 'react';
import { useTranslation } from 'react-i18next';

const TranslationTest: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 bg-green-50 rounded-lg mt-4 mb-4 border border-green-200">
      <h3 className="text-green-800 font-semibold mb-2">Translation Test</h3>
      <ul className="space-y-2">
        <li>
          <span className="font-semibold">Common.language:</span> {t('common.language')}
        </li>
        <li>
          <span className="font-semibold">Common.english:</span> {t('common.english')}
        </li>
        <li>
          <span className="font-semibold">Common.bangla:</span> {t('common.bangla')}
        </li>
        <li>
          <span className="font-semibold">Footer.company:</span> {t('footer.company')}
        </li>
        <li>
          <span className="font-semibold">Footer.aboutUs:</span> {t('footer.aboutUs')}
        </li>
      </ul>
    </div>
  );
};

export default TranslationTest;
