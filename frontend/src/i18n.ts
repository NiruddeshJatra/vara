import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  common: {
    language: 'Language',
    english: 'English',
    bangla: 'Bangla',
  },
  footer: {
    description: 'The trusted community marketplace for lending and borrowing everyday items. Save money, earn income, and live more sustainably.',
    company: 'Company',
    aboutUs: 'About Us',
    careers: 'Careers',
    press: 'Press',
    blog: 'Blog',
    support: 'Support',
    helpCenter: 'Help Center',
    contactUs: 'Contact Us',
    faq: 'FAQ',
    trustSafety: 'Trust & Safety',
    legal: 'Legal',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    cookie: 'Cookie Policy',
    copyright: '© 2025 Bhara, Inc. All rights reserved.',
  },
};

// Bangla translations
const bnTranslations = {
  common: {
    language: 'ভাষা',
    english: 'ইংরেজি',
    bangla: 'বাংলা',
  },
  footer: {
    description: 'প্রতিদিনের জিনিসপত্র ধার দেওয়া এবং নেওয়ার জন্য বিশ্বস্ত কমিউনিটি মার্কেটপ্লেস। টাকা বাঁচান, আয় করুন এবং আরও টেকসই জীবনযাপন করুন।',
    company: 'কোম্পানি',
    aboutUs: 'আমাদের সম্পর্কে',
    careers: 'ক্যারিয়ার',
    press: 'প্রেস',
    blog: 'ব্লগ',
    support: 'সাপোর্ট',
    helpCenter: 'সাহায্য কেন্দ্র',
    contactUs: 'যোগাযোগ করুন',
    faq: 'সাধারণ প্রশ্ন',
    trustSafety: 'বিশ্বাস ও নিরাপত্তা',
    legal: 'আইনি',
    terms: 'সেবার শর্তাবলী',
    privacy: 'গোপনীয়তা নীতি',
    cookie: 'কুকি নীতি',
    copyright: '© ২০২৫ ভাড়া, ইনক। সর্বস্বত্ব সংরক্ষিত।',
  },
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: enTranslations,
      bn: bnTranslations,
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
