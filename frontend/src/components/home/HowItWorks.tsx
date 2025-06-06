import React from 'react';
import { UserPlus, Search, MessageSquare, CreditCard, RotateCw } from 'lucide-react';
import '../../styles/main.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const steps = [
    {
      icon: <UserPlus className="h-8 w-8 text-green-700" />,
      title: t('process.step1Title', 'Sign Up'),
      description: t('process.step1Desc', 'Create your free account with basic information to join our trusted community.')
    },
    {
      icon: <Search className="h-8 w-8 text-green-700" />,
      title: t('process.step2Title', 'Browse or List'),
      description: t('process.step2Desc', 'Search for items to rent or list your own items to lend to others.')
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-green-700" />,
      title: t('process.step3Title', 'Request & Approve'),
      description: t('process.step3Desc', 'Send rental requests or approve incoming requests from potential borrowers.')
    },
    {
      icon: <CreditCard className="h-8 w-8 text-green-700" />,
      title: t('process.step4Title', 'Secure Payment'),
      description: t('process.step4Desc', 'Pay through our secure platform. Funds are held safely until rental is complete.')
    },
    {
      icon: <RotateCw className="h-8 w-8 text-green-700" />,
      title: t('process.step5Title', 'Exchange & Return'),
      description: t('process.step5Desc', 'Meet to exchange the item and return it in the same condition when done.')
    }
  ];

  
  return (
    <section id="how-it-works" className="py-12 md:py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="inline-block text-xs font-medium bg-green-100 text-green-700 px-4 py-1 rounded-full mb-3 tracking-wide">{t('home.howItWorks.badge')}</span>
          <h2 className="text-2xl md:text-4xl font-bold text-green-800 mb-3">{t('home.howItWorks.title')}</h2>
          <p className="text-green-700/80 mb-3 text-center text-[0.85rem]">{t('home.howItWorks.subtitle')}</p>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-0 mt-12">
          {steps.map((step, index) => (
            <div className="relative z-10 flex flex-col items-center bg-transparent shadow-none border-none p-0 md:w-48 lg:w-60 mx-auto" style={{ animationDelay: `${index * 0.1}s` }} key={index}>
              <div className="relative flex justify-center items-center mb-2">
                <span className="absolute -top-2 -left-3 w-7 h-7 rounded-full bg-lime-600 text-white text-xs font-bold flex items-center justify-center border border-green-200 -z-10">{index + 1}</span>
                <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                  {React.cloneElement(step.icon, { className: 'h-5 w-5 text-lime-600' })}
                </span>
              </div>
              <h3 className="font-semibold text-green-700 text-base lg:text-lg text-center mb-1 mt-2">{step.title}</h3>
              <p className="text-center text-gray-500 text-xs/5 lg:text-sm/6 max-w-[16rem]">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            className="px-8 py-3 rounded-full bg-green-600 text-white font-semibold text-base md:text-lg hover:bg-green-700 transition-colors animate-fade-up shadow-md"
            style={{ animationDelay: '0.5s' }}
            onClick={() => navigate('/auth/login/')}
          >
            {t('home.howItWorks.buttonText')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
