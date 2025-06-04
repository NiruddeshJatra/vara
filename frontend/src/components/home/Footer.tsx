import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";


const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gradient-to-b from-lime-50 to-white text-green-900 pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10 lg:gap-14 xl:gap-20 mb-10 md:mb-12 lg:mb-14 xl:mb-16">
          {/* Logo & Description */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 max-w-lg pr-4 lg:pr-8">
            <a href="/" className="flex items-center text-lg md:text-xl font-bold mb-2 md:mb-3">
              <span className="text-lime-600">Bh</span>ara
            </a>
            <p className="text-gray-500 text-xs/5 md:text-sm/6 mb-3 md:mb-4">
              {t('footer.description')}
            </p>
            <div className="flex gap-2 md:gap-3">
              <a href="#" className="rounded-full bg-white p-2 hover:bg-lime-50 border-2 border-gray-200 transition"><Facebook size={18} className="text-gray-500" /></a>
              <a href="#" className="rounded-full bg-white p-2 hover:bg-lime-50 border-2 border-gray-200 transition"><Twitter size={18} className="text-gray-500" /></a>
              <a href="#" className="rounded-full bg-white p-2 hover:bg-lime-50 border-2 border-gray-200 transition"><Instagram size={18} className="text-gray-500" /></a>
              <a href="#" className="rounded-full bg-white p-2 hover:bg-lime-50 border-2 border-gray-200 transition"><Linkedin size={18} className="text-gray-500" /></a>
            </div>
          </div>
          {/* Company Links */}
          <div>
            <h4 className="text-green-900 font-semibold mb-2 md:mb-3 text-sm md:text-base lg:text-lg">{t('footer.company')}</h4>
            <ul className="space-y-1 md:space-y-2">
              <li><Link to="/about" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">{t('footer.aboutUs')}</Link></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">{t('footer.careers')}</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">{t('footer.press')}</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">{t('footer.blog')}</a></li>
            </ul>
          </div>
          {/* Support Links */}
          <div>
            <h4 className="text-green-900 font-semibold mb-2 md:mb-3 text-sm md:text-base lg:text-lg">{t('footer.support')}</h4>
            <ul className="space-y-1 md:space-y-2">
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">{t('footer.contactUs')}</a></li>
              <li><Link to="/faq" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">{t('footer.faq')}</Link></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">{t('footer.trustSafety')}</a></li>
            </ul>
          </div>
          {/* Legal Links */}
          <div>
            <h4 className="text-green-900 font-semibold mb-2 md:mb-3 text-sm md:text-base lg:text-lg">{t('footer.legal')}</h4>
            <ul className="space-y-1 md:space-y-2">
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">{t('footer.privacy')}</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">{t('footer.cookie')}</a></li>
            </ul>
            {/* Language Switcher */}
            <div className="mt-4 md:mt-6">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="pt-6 mt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
