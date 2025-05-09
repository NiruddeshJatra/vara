import React from 'react';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

// Import team images
import nasifulImage from '../assets/images/team/nasiful.jpg';
import riadImage from '../assets/images/team/riad.jpg';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-12">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4 font-['Hind_Siliguri']">
              আমাদের সম্পর্কে
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto font-['Hind_Siliguri']">
              Bhara হল বাংলাদেশের প্রথম ভরসাযোগ্য ভাড়া ভিত্তিক মার্কেটপ্লেস যেখানে আপনি নিরাপদে আপনার জিনিসপত্র ভাড়া দিতে পারেন বা অন্যদের কাছ থেকে ভাড়া নিতে পারেন।
            </p>
          </div>

          {/* Company Story & Mission */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-10">
            <h2 className="text-2xl font-bold text-green-800 mb-6 font-['Hind_Siliguri']">আমাদের গল্প ও লক্ষ্য</h2>
            
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
                  Bhara'র যাত্রা শুরু হয়েছে ২০২৫ সালে, যখন আমাদের ফাউন্ডাররা একটি সমস্যা লক্ষ্য করেন - বাংলাদেশে ভাড়া নেওয়া বা দেওয়ার জন্য একটি নিরাপদ ও বিশ্বস্ত প্ল্যাটফর্মের অভাব। ঢাকা বা চট্টগ্রামের মত শহরে, যেখানে জায়গা সীমিত এবং দাম বেশি, সবকিছু কেনার সামর্থ্য বা প্রয়োজন সবার নেই।
                </p>
                
                <p className="text-gray-700">
                  <strong>আমাদের লক্ষ্য:</strong> এমন একটি প্ল্যাটফর্ম তৈরি করা যেখানে মানুষ নিরাপদে এবং সহজে তাদের ব্যবহৃত ও অব্যবহৃত সামগ্রী ভাড়া দিতে পারে এবং প্রয়োজনীয় জিনিস স্বল্প মূল্যে ভাড়া নিতে পারে। আমরা একটি শেয়ারিং ইকোনমি গড়ে তুলতে চাই যেখানে ভোগ্যপণ্যের প্রতি আসক্তি কমিয়ে পরিবেশ সংরক্ষণে সহায়তা করা যায়।
                </p>
                
                <p className="text-gray-700">
                  Bhara'র মাধ্যমে আমরা ভাড়া প্রক্রিয়াকে সহজ, নিরাপদ এবং উপভোগ্য করার চেষ্টা করছি। আমরা মধ্যস্থতাকারী হিসেবে কাজ করি, যাতে দুই পক্ষের মধ্যে বিশ্বাস ও নিরাপত্তা নিশ্চিত করা যায়।
                </p>
              </div>
            </div>
          </div>

          {/* How Bhara Works */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-10">
            <h2 className="text-2xl font-bold text-green-800 mb-6 font-['Hind_Siliguri']">Bhara কীভাবে কাজ করে</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-800">১</span>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2 font-['Hind_Siliguri']">আপলোড</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">আপনার প্রোডাক্ট ছবি, বিবরণ ও ভাড়ার হার সহ আপলোড করুন। আমরা সেগুলো যাচাই করে অনুমোদন দিব।</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-800">২</span>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2 font-['Hind_Siliguri']">রিকুয়েস্ট</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">ভাড়া নিতে চাওয়া ব্যক্তি রিকুয়েস্ট পাঠান। আমরা আপনার অনুমতি নিয়ে প্রোডাক্ট সংগ্রহ করি।</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-800">৩</span>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2 font-['Hind_Siliguri']">ডেলিভারি ও ফেরত</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">আমরা ভাড়া গ্রহণকারীকে প্রোডাক্ট দেই এবং সময় শেষে চেক করে আপনার কাছে ফেরত দেই।</p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <p className="text-center font-semibold text-green-800 font-['Hind_Siliguri']">
                Bhara'র মূল বৈশিষ্ট্য হল আমরা মধ্যস্থতাকারী হিসেবে থাকি - আপনাকে কখনোই সরাসরি অপরিচিত ব্যক্তির সাথে লেনদেন করতে হবে না। আমরাই দায়িত্ব নিই!
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-10">
            <h2 className="text-2xl font-bold text-green-800 mb-8 text-center font-['Hind_Siliguri']">আমাদের টিম</h2>
            
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
                <h4 className="text-lg font-semibold text-green-800 mb-1">নাসিফুল আলম</h4>
                {/* <p className="text-green-600 mb-3 font-['Hind_Siliguri']">ফাউন্ডার ও সিইও</p>
                <p className="text-center text-gray-700 max-w-md font-['Hind_Siliguri']">
                  নাসিফ সফটওয়্যার ইঞ্জিনিয়ারিং পটভূমি থেকে এসেছেন এবং তিনি বাংলাদেশের শেয়ারিং ইকোনমিকে উন্নত করার জন্য Bhara প্রতিষ্ঠা করেছেন। তিনি বিশ্বাস করেন কিনে ফেলার পরিবর্তে ভাড়া নেওয়া বাংলাদেশের জন্য টেকসই ও অর্থনৈতিক সমাধান।
                </p> */}
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-green-100">
                  <img 
                    src={riadImage} 
                    alt="Riad Ashraf" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop";
                    }}
                  />
                </div>
                <h4 className="text-lg font-semibold text-green-800 mb-1">রিয়াদ আশরাফ</h4>
                {/* <p className="text-green-600 mb-3 font-['Hind_Siliguri']">কো-ফাউন্ডার ও সিওও</p>
                <p className="text-center text-gray-700 max-w-md font-['Hind_Siliguri']">
                  রিয়াদ মার্কেটিং ও অপারেশন্স ব্যাকগ্রাউন্ড থেকে এসেছেন। তিনি Bhara'র দৈনন্দিন অপারেশন ও বিজনেস ডেভেলপমেন্ট দেখাশোনা করেন। নিরাপদ ও সুরক্ষিত ভাড়া সিস্টেম তৈরি করাই তার মূল লক্ষ্য।
                </p> */}
              </div>
            </div>
          </div>

          {/* Values & Commitments */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-10">
            <h2 className="text-2xl font-bold text-green-800 mb-6 font-['Hind_Siliguri']">আমাদের মূল্যবোধ ও প্রতিশ্রুতি</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-green-100 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-green-800 mb-3 font-['Hind_Siliguri']">বিশ্বাস ও নিরাপত্তা</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">
                  আমরা বিশ্বাস করি নিরাপত্তা সবচেয়ে গুরুত্বপূর্ণ। তাই আমরা প্রতিটি রেন্টাল পরিচয় যাচাই, চুক্তি এবং সিকিউরিটি ডিপোজিট নিয়ে নিশ্চিত করি।
                </p>
              </div>
              
              <div className="border border-green-100 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-green-800 mb-3 font-['Hind_Siliguri']">স্বচ্ছতা</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">
                  আমরা সব ধরনের ফি, শর্তাবলী এবং ক্ষতিপূরণ প্রক্রিয়া সম্পর্কে সম্পূর্ণ স্বচ্ছতা বজায় রাখি। আপনার কোন প্রশ্ন থাকলে আমরা সবসময় উত্তর দিতে প্রস্তুত।
                </p>
              </div>
              
              <div className="border border-green-100 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-green-800 mb-3 font-['Hind_Siliguri']">দায়িত্বশীলতা</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">
                  প্রতিটি রেন্টাল লেনদেনে আমরা দায়িত্বশীলতার সাথে কাজ করি। আমরা সবসময় প্রোডাক্ট মালিক ও ভাড়া গ্রহণকারী উভয়ের স্বার্থ রক্ষা করি।
                </p>
              </div>
              
              <div className="border border-green-100 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-green-800 mb-3 font-['Hind_Siliguri']">পরিবেশ সচেতনতা</h3>
                <p className="text-gray-700 font-['Hind_Siliguri']">
                  ভাড়া অর্থনীতি সমর্থন করে আমরা পরিবেশ সংরক্ষণে ভূমিকা রাখি। নতুন জিনিস কেনার বদলে ভাড়া নেওয়া সম্পদের সর্বোত্তম ব্যবহার নিশ্চিত করে এবং অপচয় কমায়।
                </p>
              </div>
            </div>
          </div>

          {/* Achievements or Milestones */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-10">
            <h2 className="text-2xl font-bold text-green-800 mb-6 font-['Hind_Siliguri']">আমাদের অর্জন</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-800 mb-2">১৫+</div>
                <p className="text-gray-700 font-['Hind_Siliguri']">নিবন্ধিত ব্যবহারকারী</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-800 mb-2">০</div>
                <p className="text-gray-700 font-['Hind_Siliguri']">সফল রেন্টাল</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-800 mb-2">৮+</div>
                <p className="text-gray-700 font-['Hind_Siliguri']">ক্যাটাগরি</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-green-800 mb-2">০%</div>
                <p className="text-gray-700 font-['Hind_Siliguri']">সন্তুষ্ট গ্রাহক</p>
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
            <h2 className="text-2xl font-bold text-green-800 mb-6 font-['Hind_Siliguri']">যোগাযোগ করুন</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center p-4 border border-green-100 rounded-lg hover:bg-green-50 transition-colors group">
                <FiMail className="text-2xl text-green-600 mr-3 group-hover:text-green-700" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 font-['Hind_Siliguri']">ইমেইল</h3>
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
                  <h3 className="text-sm font-medium text-gray-500 font-['Hind_Siliguri']">ফোন</h3>
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
                  <h3 className="text-sm font-medium text-gray-500 font-['Hind_Siliguri']">ঠিকানা</h3>
                  <a 
                    href="https://www.google.com/maps/search/কুয়ার+পাড়,+জামালখান,+চট্টগ্রাম" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-700 transition-colors hover:underline font-['Hind_Siliguri']"
                  >
                    কুয়ার পাড়, জামালখান, চট্টগ্রাম
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="font-['Hind_Siliguri'] text-gray-700">
                আমাদের সাথে সোশ্যাল মিডিয়ায় যোগাযোগ রাখুন
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
