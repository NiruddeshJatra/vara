import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  compact?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language.substring(0, 2));

  // Keep the state in sync with i18n language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language.substring(0, 2));
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'bn' : 'en';
    // i18next re-renders subscribed components live — no reload needed
    i18n.changeLanguage(newLanguage);
  };

  if (compact) {
    return (
      <div className="language-toggle-container">
        <input 
          type="checkbox" 
          id="language-toggle" 
          checked={currentLanguage === 'bn'}
          onChange={toggleLanguage}
          className="language-toggle-input"
        />
        <label htmlFor="language-toggle" className="language-toggle-label">
          <Globe className="language-toggle-icon" />
          <div className="language-toggle-action">
            <span className="language-option-1">EN</span>
            <span className="language-option-2">বাং</span>
          </div>
        </label>
      </div>
    );
  }
  
  return (
    <div className="language-toggle-container">
      <input 
        type="checkbox" 
        id="language-toggle" 
        checked={currentLanguage === 'bn'}
        onChange={toggleLanguage}
        className="language-toggle-input"
      />
      <label htmlFor="language-toggle" className="language-toggle-label">
        <Globe className="language-toggle-icon" />
        <div className="language-toggle-action">
          <span className="language-option-1">{t('common.english')}</span>
          <span className="language-option-2">{t('common.bangla')}</span>
        </div>
      </label>
    </div>
  );
};

export default LanguageSwitcher;
