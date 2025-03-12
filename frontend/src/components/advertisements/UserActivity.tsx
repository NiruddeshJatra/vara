
import React from 'react';
import { Button } from '@/components/ui/button';

type RecentlyViewedItem = {
  id: number;
  name: string;
  image: string;
};

type RentalRequest = {
  id: number;
  itemName: string;
  image: string;
  status: string;
  dates: string;
};

type UserActivityProps = {
  recentlyViewedItems: RecentlyViewedItem[];
  rentalRequests: RentalRequest[];
};

const UserActivity = ({ recentlyViewedItems, rentalRequests }: UserActivityProps) => {
  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-8">Your Recent Activity</h2>
        
        {/* Recently Viewed */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-green-800">Recently Viewed</h3>
            <a href="#" className="text-green-600 text-sm hover:text-green-700">View All</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {recentlyViewedItems.map(item => (
              <a key={item.id} href="#" className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium text-green-800 truncate">{item.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        {/* Rental Requests */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-green-800">Your Rental Requests</h3>
            <a href="#" className="text-green-600 text-sm hover:text-green-700">View All Requests</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rentalRequests.map(request => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex">
                <div className="w-24 h-24 flex-shrink-0">
                  <img src={request.image} alt={request.itemName} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-green-800">{request.itemName}</h4>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      request.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{request.dates}</p>
                  <Button className="mt-2 text-xs h-8 px-3 bg-green-600 hover:bg-green-700 text-white">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserActivity;