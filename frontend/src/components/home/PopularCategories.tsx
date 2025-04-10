import React from 'react';
import { Smartphone, Hammer, Tent, Camera, PartyPopper, Car, Speaker, Guitar, Book } from 'lucide-react';
import { Category, CATEGORY_DISPLAY } from '@/constants/productTypes';

const categories = [
  {
    icon: <Smartphone className="h-8 w-8 text-green-600" />,
    name: CATEGORY_DISPLAY[Category.ELECTRONICS],
    items: '1,245 items',
    bgColor: 'bg-green-50'
  },
  {
    icon: <Hammer className="h-8 w-8 text-green-600" />,
    name: CATEGORY_DISPLAY[Category.TOOLS_EQUIPMENT],
    items: '892 items',
    bgColor: 'bg-green-50'
  },
  {
    icon: <Tent className="h-8 w-8 text-green-600" />,
    name: CATEGORY_DISPLAY[Category.PARTY_EVENTS],
    items: '783 items',
    bgColor: 'bg-green-50'
  },
  {
    icon: <Camera className="h-8 w-8 text-green-600" />,
    name: CATEGORY_DISPLAY[Category.PHOTOGRAPHY_VIDEOGRAPHY],
    items: '561 items',
    bgColor: 'bg-green-50'
  },
  {
    icon: <PartyPopper className="h-8 w-8 text-green-600" />,
    name: CATEGORY_DISPLAY[Category.SPORTS_FITNESS],
    items: '478 items',
    bgColor: 'bg-green-50'
  },
  {
    icon: <Car className="h-8 w-8 text-green-600" />,
    name: CATEGORY_DISPLAY[Category.AUTOMOTIVE],
    items: '329 items',
    bgColor: 'bg-green-50'
  }
];

const PopularCategories = () => {
  return (
    <section id="browse-items" className="section relative bg-gradient-to-b from-green-50 to-white nature-pattern animate-fade-up">
      {/* Background elements */}
      <div className="fluid-shape fluid-shape-1"></div>
      <div className="dots-pattern dots-pattern-1"></div>
      
      <div className="container mx-auto">
        <div className="section-title animate-fade-up">
          <span className="inline-block text-sm font-medium bg-green-600/10 text-green-600 px-4 py-1.5 rounded-full mb-4">Categories</span>
          <h2 className="font-bold text-green-800 mb-3">What Are You Looking For?</h2>
          <p className="text-green-700/80 mb-3">Explore our most popular categories with thousands of items available to rent</p>
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
                <div className={`${category.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-green-800 group-hover:text-green-600 transition-colors">{category.name}</h3>
                  <p className="text-sm text-green-700/80">{category.items}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="flex justify-center mt-10 animate-fade-up" style={{ animationDelay: '600ms' }}>
          <a href="#" className="text-green-600 font-medium hover:text-green-700 inline-flex items-center transition-all">
            Explore All Categories
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