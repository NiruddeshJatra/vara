import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-12 lg:pt-24 pb-16 overflow-hidden">
      {/* Nature-inspired background with gradients and overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-800 to-green-600"></div>
      
      {/* Dots pattern top-right */}
      <svg className="absolute -z-10 w-72 h-72 top-[20%] right-[10%] opacity-20" aria-hidden="true"><defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#BEF264" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      {/* Dots pattern bottom-left */}
      <svg className="absolute -z-10 w-72 h-72 bottom-[30%] left-[5%] opacity-20" aria-hidden="true"><rect width="100%" height="100%" fill="url(#dots)" /></svg>
      
      <div className="container mx-auto flex flex-col justify-center items-center min-h-[70vh] px-2 sm:px-4 text-center">
        {/* Text content */}
        <div className="flex flex-col items-center animate-fade-up w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
          <span className="text-xs sm:text-sm font-medium bg-white/10 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-6">
            {t('common.welcome')}
          </span>
          <h1 className="font-bold text-4xl sm:text-5xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 leading-tight text-white">
            {t('home.hero.title')} <span className="text-lime-300">{t('home.hero.title2')}</span>
          </h1>
          <p className="text-xs/5 sm:text-sm/5 md:text-base/6 lg:text-base/7 text-white/80 mb-6 sm:mb-8 max-w-xs sm:max-w-lg md:max-w-xl">
            {t('home.hero.subtitle')}
          </p>
          
          {/* Search UI */}
          <div className="w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl bg-white/80 backdrop-blur-sm border border-green-100 rounded-xl shadow-sm p-2 sm:p-4 mb-4 sm:mb-6 md:mb-8 mx-auto">
            <div className="flex flex-col md:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 sm:top-4 h-4 w-4 text-green-600/60" />
                <Input
                  type="text"
                  placeholder={t('home.hero.searchPlaceholder')}
                  className="pl-9 h-10 sm:h-12 text-xs border-green-100 focus:border-green-300 focus:ring-green-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 sm:top-4 h-4 w-4 text-green-600/60" />
                <Input
                  type="text"
                  placeholder={t('home.hero.locationPlaceholder')}
                  className="pl-9 h-10 sm:h-12 text-xs border-green-100 focus:border-green-300 focus:ring-green-200"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button
                className="h-10 sm:h-12 px-4 sm:px-8 bg-green-700 hover:bg-green-800 text-sm sm:text-base font-medium font-['Helvetica_Neue_Light']"
                onClick={() => {
                  // Navigate to Advertisements with searchTerm and location as query params
                  const params = new URLSearchParams();
                  if (searchTerm) params.append('search', searchTerm);
                  if (location) params.append('location', location);
                  navigate(`/advertisements${params.toString() ? `?${params}` : ''}`);
                }}
              >
                {t('home.hero.buttonText')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;