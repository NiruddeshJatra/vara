
import React from 'react';
import { Button } from '@/components/ui/button';

const ListItemCTA = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-green-700 to-green-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Have Items to Share?</h2>
          <p className="text-lg text-green-100 mb-8">Start earning by lending your unused items</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="backdrop-blur-sm rounded-lg p-6 bg-green-900">
              <h3 className="font-semibold text-xl mb-2">Set Your Terms</h3>
              <p className="text-green-100">You control prices, availability, and rental conditions.</p>
            </div>
            <div className="backdrop-blur-sm rounded-lg p-6 bg-green-900">
              <h3 className="font-semibold text-xl mb-2">Reach Borrowers</h3>
              <p className="text-green-100">Connect with thousands of potential renters in your area.</p>
            </div>
            <div className="backdrop-blur-sm rounded-lg p-6 bg-green-900">
              <h3 className="font-semibold text-xl mb-2">Secure Payments</h3>
              <p className="text-green-100">Get paid safely through our protected payment system.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button className="px-8 h-auto text-lg font-medium py-[10px] bg-lime-500 hover:bg-lime-400 text-green-950">
              List an Item
            </Button>
            <a href="#" className="text-green-100 hover:text-white underline">Learn how it works</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListItemCTA;
