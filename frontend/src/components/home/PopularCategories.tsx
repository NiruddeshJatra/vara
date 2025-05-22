import React from 'react';
import { MonitorSmartphone, Hammer, Tent, Camera, PartyPopper, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const categories = [
  {
    icon: <MonitorSmartphone className="h-8 w-8 text-green-600" />,
    name: 'Electronics & Gadgets',
    items: '1,245 items',
    bgColor: 'bg-green-50'
  },
  {
    icon: <Hammer className="h-8 w-8 text-green-600" />,
    name: 'Tools & Equipment',
    items: '892 items',
    bgColor: 'bg-green-50'
  },
  {
    icon: <Tent className="h-8 w-8 text-green-600" />,
    name: 'Outdoor & Adventure Gear',
    items: '783 items',
    bgColor: 'bg-green-50'
  },
  {
    icon: <Camera className="h-8 w-8 text-green-600" />,
    name: 'Photography & Video',
    items: '561 items',
    bgColor: 'bg-green-50'
  },
  {
    icon: <PartyPopper className="h-8 w-8 text-green-600" />,
    name: 'Party & Event Supplies',
    items: '478 items',
    bgColor: 'bg-green-50'
  },
  {
    icon: <Car className="h-8 w-8 text-green-600" />,
    name: 'Vehicles & Transportation',
    items: '329 items',
    bgColor: 'bg-green-50'
  }
];

const PopularCategories = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <section id="browse-items" className="section relative bg-gradient-to-b from-green-50 to-white nature-pattern animate-fade-up">
      <div className="container mx-auto">
        <div className="section-title animate-fade-up">
          <span className="inline-block px-4 py-1.5 text-xs md:text-sm font-medium rounded-full bg-green-600/10 text-green-600 mb-4">
            {t('home.categories.badge')}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-green-800 mb-4">
            {t('home.categories.title')}
          </h2>
          <p className="text-green-700/80 mb-3 text-center text-[0.85rem]">
            {t('home.categories.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {categories.map((category, index) => (
            <a
              key={index}
              href="#"
              className="group bg-white/90 backdrop-blur-sm rounded-xl border border-green-100 overflow-hidden shadow-subtle hover:shadow-lg hover:shadow-green-100/40 transition-all duration-300 animate-fade-up hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center p-6">
                <div className={`${category.bgColor} w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-lg text-green-800 group-hover:text-green-600 transition-colors">{category.name}</h3>
                  <p className="text-sm text-green-700/80">{category.items}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="flex justify-center mt-10 animate-fade-up" style={{ animationDelay: '600ms' }}>
          <a
            href="#"
            className="text-green-600 font-medium hover:text-green-700 inline-flex items-center transition-all"
            onClick={e => {
              e.preventDefault();
              navigate('/advertisements');
            }}
          >
            {t('home.categories.viewAll')}
            <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;