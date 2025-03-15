
import React from 'react';

const TrustIndicators = () => {
  return (
    <section className="py-12 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-green-800 text-2xl">Verified Users</h3>
              <p className="text-sm text-gray-600">ID verification for all</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-green-800 text-2xl">Coverage Available</h3>
              <p className="text-sm text-gray-600">For peace of mind</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-green-800 text-2xl">24/7 Support</h3>
              <p className="text-sm text-gray-600">Help when you need it</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
