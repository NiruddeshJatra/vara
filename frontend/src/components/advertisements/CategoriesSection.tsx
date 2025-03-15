
import React from 'react';

type Category = {
  id: number;
  name: string;
  icon: string;
  image: string;
  count: number;
};

type CategoriesSectionProps = {
  categories: Category[];
};

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  return (
    <section className="bg-white py-0">
      <div className="container mx-auto px-4 bg-gradient-to-b from-green-50 to-white py-[64px]">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">Browse by Category</h2>
          <p className="text-green-700">Find exactly what you need from our wide range of categories</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <a 
              key={category.id} 
              href="#" 
              className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium text-lg">{category.name}</h3>
                <p className="text-white/80 text-sm">{category.count} items</p>
              </div>
            </a>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a href="#" className="text-green-600 font-medium inline-flex items-center hover:text-green-700 transition-colors">
            See All Categories
            <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
