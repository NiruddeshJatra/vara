import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

const testimonials = [
  {
    id: 1,
    name: "Shamima Akter",
    location: "Dhaka",
    quote: "I rented a Canon camera for my cousin's wedding. The process was smooth and saved us a lot! Highly recommend Bhara for anyone needing quality gear in Dhaka.",
    avatar: "/mock/camera-user.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "Rafiq Islam",
    location: "Chattogram",
    quote: "Needed a mountain bike for a quick trip. Found one in my area and the owner was very friendly. Bhara made it super easy!",
    avatar: "/mock/bicycle-user.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    location: "Sylhet",
    quote: "Booked a tent for our family picnic at Ratargul. The tent was clean and spacious. Loved the convenience!",
    avatar: "/mock/tent-user.jpg",
    rating: 5
  }
];

const Testimonials = () => {
  const { t } = useTranslation();
  return (
    <section id="testimonials" className="section relative bg-gradient-to-b from-green-50 to-white">
      {/* Nature-inspired background elements */}
      <div className="absolute inset-0 -z-10 opacity-5 bg-center bg-cover"></div>
      
      <div className="container mx-auto">
        <div className="section-title animate-fade-up">
          <span className="inline-block px-4 py-1.5 text-xs md:text-sm font-medium rounded-full bg-green-600/10 text-green-600 mb-4" style={{fontSize: '0.68rem'}}>{t('home.reviews.badge')}</span>
          <h2 className="text-2xl md:text-4xl font-bold text-green-800 mb-4">{t('home.reviews.title')}</h2>
          <p className="text-green-700/80 mb-3 text-center text-[0.85rem]">{t('home.reviews.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-green-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 animate-fade-up" 
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="flex items-center mb-3">
                <Avatar className="h-12 w-12 mr-4 border-2 border-green-100">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="bg-green-100 text-green-700">{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-green-800 text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-green-700">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              
              <p className="italic text-green-700 text-[0.82rem]">
                “{testimonial.quote}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
