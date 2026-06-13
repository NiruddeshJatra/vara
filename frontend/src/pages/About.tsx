import React from 'react';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// Import team images
import nasifulImage from '../assets/images/team/nasiful.jpg';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-12">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4 font-['Hind_Siliguri']">
              {t('aboutPage.title')}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto font-['Hind_Siliguri']">
              {t('aboutPage.subtitle')}
            </p>
          </div>

          {/* Company Story & Mission */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-10">
            <h2 className="text-2xl font-bold text-green-800 mb-6 font-['Hind_Siliguri']">{t('aboutPage.storyTitle')}</h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <img 
                  src="/images/about/mission.jpg" 
                  alt="Bhara Mission" 
                  className="rounded-lg shadow-md w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1469&auto=format&fit=crop";
                  }}
                />
              </div>
              
              <div className="md:w-2/3 space-y-4 font-['Hind_Siliguri']">
                <p className="text-gray-700">
                  {t('aboutPage.storyP1')}
                </p>
                
                <p className="text-gray-700">
                  <strong>{t('aboutPage.missionLabel')}:</strong> {t('aboutPage.storyP2')}
                </p>
                
                <p className="text-gray-700">
                  {t('aboutPage.storyP3')}
                </p>
              </div>
            </div>
          </div>

          {/* How Bhara Works */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-10">
            <h2 className="text-2xl font-bold text-green-800 mb-6 font-['Hind_Siliguri']">{t('aboutPage.howTitle')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-800">১</span>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2 font-['Hind_Siliguri']">{t('aboutPage.step1Title')}</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">{t('aboutPage.step1Desc')}</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-800">২</span>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2 font-['Hind_Siliguri']">{t('aboutPage.step2Title')}</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">{t('aboutPage.step2Desc')}</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-800">৩</span>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2 font-['Hind_Siliguri']">{t('aboutPage.step3Title')}</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">{t('aboutPage.step3Desc')}</p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <p className="text-center font-semibold text-green-800 font-['Hind_Siliguri']">
                {t('aboutPage.mediatorNote')}
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-10">
            <h2 className="text-2xl font-bold text-green-800 mb-8 text-center font-['Hind_Siliguri']">{t('aboutPage.teamTitle')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-green-100">
                  <img 
                    src={nasifulImage} 
                    alt="Nasiful Alam" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1374&auto=format&fit=crop";
                    }}
                  />
                </div>
                <h4 className="text-lg font-semibold text-green-800 mb-1">{t('aboutPage.member1')}</h4>
                {/* <p className="text-green-600 mb-3 font-['Hind_Siliguri']">ফাউন্ডার ও সিইও</p>
                <p className="text-center text-gray-700 max-w-md font-['Hind_Siliguri']">
                  নাসিফ সফটওয়্যার ইঞ্জিনিয়ারিং পটভূমি থেকে এসেছেন এবং তিনি বাংলাদেশের শেয়ারিং ইকোনমিকে উন্নত করার জন্য Bhara প্রতিষ্ঠা করেছেন। তিনি বিশ্বাস করেন কিনে ফেলার পরিবর্তে ভাড়া নেওয়া বাংলাদেশের জন্য টেকসই ও অর্থনৈতিক সমাধান।
                </p> */}
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-green-100">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop" 
                    alt="Riad Ashraf" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop";
                    }}
                  />
                </div>
                <h4 className="text-lg font-semibold text-green-800 mb-1">{t('aboutPage.member2')}</h4>
                {/* <p className="text-green-600 mb-3 font-['Hind_Siliguri']">কো-ফাউন্ডার ও সিওও</p>
                <p className="text-center text-gray-700 max-w-md font-['Hind_Siliguri']">
                  রিয়াদ মার্কেটিং ও অপারেশন্স ব্যাকগ্রাউন্ড থেকে এসেছেন। তিনি Bhara'র দৈনন্দিন অপারেশন ও বিজনেস ডেভেলপমেন্ট দেখাশোনা করেন। নিরাপদ ও সুরক্ষিত ভাড়া সিস্টেম তৈরি করাই তার মূল লক্ষ্য।
                </p> */}
              </div>
            </div>
          </div>

          {/* Values & Commitments */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-10">
            <h2 className="text-2xl font-bold text-green-800 mb-6 font-['Hind_Siliguri']">{t('aboutPage.valuesTitle')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-green-100 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-green-800 mb-3 font-['Hind_Siliguri']">{t('aboutPage.value1Title')}</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">
                  {t('aboutPage.value1Desc')}
                </p>
              </div>
              
              <div className="border border-green-100 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-green-800 mb-3 font-['Hind_Siliguri']">{t('aboutPage.value2Title')}</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">
                  {t('aboutPage.value2Desc')}
                </p>
              </div>
              
              <div className="border border-green-100 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-green-800 mb-3 font-['Hind_Siliguri']">{t('aboutPage.value3Title')}</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">
                  {t('aboutPage.value3Desc')}
                </p>
              </div>
              
              <div className="border border-green-100 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-green-800 mb-3 font-['Hind_Siliguri']">{t('aboutPage.value4Title')}</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">
                  {t('aboutPage.value4Desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Achievements or Milestones */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-10">
            <h2 className="text-2xl font-bold text-green-800 mb-6 font-['Hind_Siliguri']">{t('aboutPage.achievementsTitle')}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-800 mb-2">{t('aboutPage.stat1Value')}</div>
                <p className="text-gray-700 font-['Hind_Siliguri']">{t('aboutPage.stat1Label')}</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-800 mb-2">{t('aboutPage.stat2Value')}</div>
                <p className="text-gray-700 font-['Hind_Siliguri']">{t('aboutPage.stat2Label')}</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-800 mb-2">{t('aboutPage.stat3Value')}</div>
                <p className="text-gray-700 font-['Hind_Siliguri']">{t('aboutPage.stat3Label')}</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-800 mb-2">{t('aboutPage.stat4Value')}</div>
                <p className="text-gray-700 font-['Hind_Siliguri']">{t('aboutPage.stat4Label')}</p>
              </div>
            </div>
            
            {/* <div className="mt-8 p-4 bg-green-50 rounded-lg text-center">
              <p className="font-semibold text-green-800 font-['Hind_Siliguri']">
                ২০২৫ সালে লঞ্চ হওয়ার পর থেকে, Bhara ক্রমাগত বেড়ে চলেছে। আমরা ঢাকা শহরে শুরু করেছি এবং ক্রমাগত অন্যান্য শহরে সম্প্রসারিত হচ্ছি।
              </p>
            </div> */}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6 font-['Hind_Siliguri']">{t('aboutPage.contactTitle')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center p-4 border border-green-100 rounded-lg hover:bg-green-50 transition-colors group">
                <FiMail className="text-2xl text-green-600 mr-3 group-hover:text-green-700" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 font-['Hind_Siliguri']">{t('aboutPage.email')}</h3>
                  <a 
                    href="mailto:service.vara2025@gmail.com" 
                    className="text-gray-700 hover:text-green-700 transition-colors hover:underline"
                  >
                    service.vara2025@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center p-4 border border-green-100 rounded-lg hover:bg-green-50 transition-colors group">
                <FiPhone className="text-2xl text-green-600 mr-3 group-hover:text-green-700" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 font-['Hind_Siliguri']">{t('aboutPage.phone')}</h3>
                  <a 
                    href="tel:+8801626181662" 
                    className="text-gray-700 hover:text-green-700 transition-colors hover:underline"
                  >
                    +8801626181662
                  </a>
                </div>
              </div>
              
              <div className="flex items-center p-4 border border-green-100 rounded-lg hover:bg-green-50 transition-colors group">
                <FiMapPin className="text-2xl text-green-600 mr-3 group-hover:text-green-700" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 font-['Hind_Siliguri']">{t('aboutPage.address')}</h3>
                  <a 
                    href="https://www.google.com/maps/search/কুয়ার+পাড়,+জামালখান,+চট্টগ্রাম" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-700 transition-colors hover:underline font-['Hind_Siliguri']"
                  >
                    {t('aboutPage.addressValue')}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="font-['Hind_Siliguri'] text-gray-700">
                {t('aboutPage.social')}
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <a href="#" className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 5.75v8.5L15.25 12 11 7.75z"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 2C5.6 4 4 5.6 4 7.6v8.8c0 2 1.6 3.6 3.6 3.6h8.8c2 0 3.6-1.6 3.6-3.6V7.6c0-2-1.6-3.6-3.6-3.6H7.6zm9.65 1.5c.7 0 1.25.55 1.25 1.25s-.55 1.25-1.25 1.25-1.25-.55-1.25-1.25.55-1.25 1.25-1.25zM12 7c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm0 2c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
