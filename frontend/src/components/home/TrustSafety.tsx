import {
  ShieldCheck,
  CheckCircle,
  ShieldOff,
  MessageSquare,
} from "lucide-react";
import "../../styles/main.css";
import { useTranslation } from 'react-i18next';

const TrustSafety = () => {
  const { t } = useTranslation();

  const trustFeatures = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-green-700" />,
      title: t('trust.verifiedTitle', 'Verified Community'),
      description: t('trust.verifiedDesc', 'All users undergo ID verification and background checks before participating'),
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-700" />,
      title: t('trust.approvedTitle', 'Admin-Approved Listings'),
      description: t('trust.approvedDesc', 'Every listing is manually verified by our team before being published'),
    },
    {
      icon: <ShieldOff className="h-8 w-8 text-green-700" />,
      title: t('trust.protectionTitle', 'Damage Protection'),
      description: t('trust.protectionDesc', 'Security deposits held in escrow until safe return confirmation'),
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-green-700" />,
      title: t('trust.mediationTitle', 'Mediation Support'),
      description: t('trust.mediationDesc', 'Dedicated team resolves disputes and oversees product handoffs/returns'),
    },
  ];

  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span
            className="inline-block px-4 py-1.5 text-xs md:text-sm font-medium rounded-full bg-green-600/10 text-green-600 mb-4"
            style={{ fontSize: "0.68rem" }}
          >
            {t('home.trustSafety.badge')}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-green-900 mb-3 text-center">
            {t('home.trustSafety.title')}
          </h2>
          <p className="text-green-700/80 mb-3 text-center text-[0.85rem]">
            {t('home.trustSafety.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white/90 border border-green-100 rounded-xl shadow-sm p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg animate-fade-up lg:min-w-[17rem] lg:max-w-[22rem] w-full"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-green-700 text-lg text-center mb-2">
                {feature.title}
              </h3>
              <p className="text-center text-gray-500 text-[0.82rem]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="flex justify-center mt-12 animate-fade-up"
          style={{ animationDelay: "750ms" }}
        >
          <button className="bg-transparent border border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-colors duration-300 font-medium rounded-full px-8 py-3">
            {t('home.trustSafety.buttonText')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;
