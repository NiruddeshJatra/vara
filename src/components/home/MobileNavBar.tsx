import { LayoutGrid, Package, Upload, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MobileNavBar = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 shadow-sm md:hidden grid grid-cols-4 gap-1 z-50">
      <Link to="/advertisements" className="flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600 hover:bg-green-50 transition">
        <LayoutGrid className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">{t('navigation.explore')}</span>
      </Link>
      <Link to={isAuthenticated ? "/rentals" : "/auth/login"} className="flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600 hover:bg-green-50 transition">
        <Package className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">{t('profile.myRentals')}</span>
      </Link>
      <Link to={isAuthenticated ? "/upload-product" : "/auth/login"} className="flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600 hover:bg-green-50 transition">
        <Upload className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">{t('navigation.listItem')}</span>
      </Link>
      <Link to={isAuthenticated ? "/profile" : "/auth/login"} className="flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600 hover:bg-green-50 transition">
        <User className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">{t('navigation.profile')}</span>
      </Link>
    </div>
  );
};

export default MobileNavBar;