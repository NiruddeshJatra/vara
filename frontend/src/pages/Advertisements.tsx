
import { useState } from 'react';
import { Search, MapPin, Filter, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import '../styles/main.css';

// Sample data for featured categories
const categories = [
  {
    id: 1,
    name: 'Photography & Videography',
    icon: 'camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 345
  },
  {
    id: 2,
    name: 'Sports & Fitness',
    icon: 'dumbbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 452
  },
  {
    id: 3,
    name: 'Outdoor & Camping',
    icon: 'tent',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 287
  },
  {
    id: 4,
    name: 'Audio & Entertainment',
    icon: 'headphones',
    image: 'https://images.unsplash.com/photo-1558379330-cbcc3e522b5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 368
  },
  {
    id: 5,
    name: 'Electronics & Gadgets',
    icon: 'smartphone',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 512
  },
  {
    id: 6,
    name: 'Event & Party',
    icon: 'party-popper',
    image: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 189
  },
  {
    id: 7,
    name: 'Tools & Equipment',
    icon: 'wrench',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    count: 276
  }
];

// Sample data for recent listings
const recentListings = [
  {
    id: 1,
    name: 'DSLR Camera with 2 Lenses',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Photography & Videography',
    price: 35,
    duration: 'day',
    distance: 1.2,
    rating: 4.8,
    reviewCount: 32
  },
  {
    id: 2,
    name: 'Electric Mountain Bike',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Sports & Fitness',
    price: 25,
    duration: 'day',
    distance: 0.8,
    rating: 4.6,
    reviewCount: 48
  },
  {
    id: 3,
    name: '4-Person Camping Tent',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Outdoor & Camping',
    price: 20,
    duration: 'day',
    distance: 2.5,
    rating: 4.5,
    reviewCount: 24
  },
  {
    id: 4,
    name: 'Bluetooth Party Speaker',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Audio & Entertainment',
    price: 15,
    duration: 'day',
    distance: 1.5,
    rating: 4.7,
    reviewCount: 39
  },
  {
    id: 5,
    name: 'MacBook Pro 16"',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Electronics & Gadgets',
    price: 45,
    duration: 'day',
    distance: 3.0,
    rating: 4.9,
    reviewCount: 56
  },
  {
    id: 6,
    name: 'Wireless Drill Set',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    category: 'Tools & Equipment',
    price: 18,
    duration: 'day',
    distance: 2.2,
    rating: 4.4,
    reviewCount: 28
  }
];

// Sample data for popular listings (same structure, different data)
const popularListings = recentListings.map(item => ({
  ...item,
  id: item.id + 100, // Different IDs for sample data
  rentalCount: Math.floor(Math.random() * 50) + 20
}));

// Sample data for recently viewed items
const recentlyViewedItems = recentListings.slice(0, 4).map(item => ({
  id: item.id,
  name: item.name,
  image: item.image
}));

// Sample data for rental requests
const rentalRequests = [
  {
    id: 1,
    itemName: 'Sony A7 III Camera Kit',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    status: 'Pending',
    dates: 'May 15 - May 18, 2025'
  },
  {
    id: 2,
    itemName: 'Mountain Bike (Trek)',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    status: 'Accepted',
    dates: 'May 20 - May 22, 2025'
  }
];

const Advertisements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const handleQuickView = (itemId: number) => {
    setSelectedItem(itemId);
    setIsItemModalOpen(true);
  };

  const getSelectedItem = () => {
    return [...recentListings, ...popularListings].find(item => item.id === selectedItem);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">Discover Items Available Near You</h1>
              <p className="text-green-700 text-lg">Browse thousands of items available for rent in your community</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-green-600/60" />
                  <Input
                    type="text"
                    placeholder="What are you looking for?"
                    className="pl-9 h-12 border-green-100 focus:border-green-300 focus:ring-green-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-600/60" />
                  <Input
                    type="text"
                    placeholder="Select your location"
                    className="pl-9 h-12 border-green-100 focus:border-green-300 focus:ring-green-200"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline"
                  className="h-12 md:w-auto border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button className="h-12 bg-green-700 hover:bg-green-800 text-white">
                  Search Items
                </Button>
              </div>

              {/* Advanced Filters Panel */}
              {filtersOpen && (
                <div className="mt-4 p-4 border-t border-green-100 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-green-800">Price Range</label>
                      <div className="pt-6">
                        <Slider 
                          defaultValue={[0, 100]} 
                          max={100} 
                          step={1} 
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-green-700 mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-green-800">Category</label>
                      <select className="w-full h-10 rounded-md border border-green-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-green-800">Minimum Rating</label>
                      <select className="w-full h-10 rounded-md border border-green-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                        <option value="">Any Rating</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="3">3+ Stars</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50">Reset</Button>
                    <Button className="bg-green-700 hover:bg-green-800 text-white">Apply Filters</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Categories Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
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
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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

        {/* Recent Listings Section */}
        <section className="py-16 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-1">Recently Added Items</h2>
                <p className="text-green-700">Fresh listings in your area</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentListings.map((item, index) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <button className="rounded-full bg-white/80 p-2 hover:bg-white">
                        <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-green-800 hover:text-green-600 truncate">{item.name}</h3>
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        {item.distance} mi
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">{item.category}</p>
                    <div className="flex items-center mt-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-sm font-medium text-gray-700">{item.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({item.reviewCount})</span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="font-medium text-green-900">${item.price} <span className="text-sm text-gray-500">per {item.duration}</span></div>
                      <Button 
                        variant="outline" 
                        className="text-xs border-green-100 hover:bg-green-50 text-green-700"
                        onClick={() => handleQuickView(item.id)}
                      >
                        Quick View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button className="bg-green-600 hover:bg-green-700 text-white mx-auto">
                Load More Items
              </Button>
            </div>
          </div>
        </section>

        {/* Popular Listings Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-1">Popular Near You</h2>
                <p className="text-green-700">Most viewed and rented items</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularListings.map((item, index) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <button className="rounded-full bg-white/80 p-2 hover:bg-white">
                        <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-green-700/80 text-white text-xs font-medium rounded-full py-1 px-2">
                      {item.rentalCount}+ rentals
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-green-800 hover:text-green-600 truncate">{item.name}</h3>
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        {item.distance} mi
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">{item.category}</p>
                    <div className="flex items-center mt-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-sm font-medium text-gray-700">{item.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({item.reviewCount})</span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="font-medium text-green-900">${item.price} <span className="text-sm text-gray-500">per {item.duration}</span></div>
                      <Button 
                        variant="outline" 
                        className="text-xs border-green-100 hover:bg-green-50 text-green-700"
                        onClick={() => handleQuickView(item.id)}
                      >
                        Quick View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button className="bg-green-600 hover:bg-green-700 text-white mx-auto">
                See All Popular Items
              </Button>
            </div>
          </div>
        </section>

        {/* User Activity Section */}
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
                {recentlyViewedItems.map((item) => (
                  <a 
                    key={item.id} 
                    href="#" 
                    className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
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
                {rentalRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={request.image} 
                        alt={request.itemName} 
                        className="w-full h-full object-cover"
                      />
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
                      <Button 
                        className="mt-2 text-xs h-8 px-3 bg-green-600 hover:bg-green-700 text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* List Your Item CTA Section */}
        <section className="py-16 bg-gradient-to-b from-green-700 to-green-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Have Items to Share?</h2>
              <p className="text-lg text-green-100 mb-8">Start earning by lending your unused items</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-green-800/50 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="font-semibold text-xl mb-2">Set Your Terms</h3>
                  <p className="text-green-100">You control prices, availability, and rental conditions.</p>
                </div>
                <div className="bg-green-800/50 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="font-semibold text-xl mb-2">Reach Borrowers</h3>
                  <p className="text-green-100">Connect with thousands of potential renters in your area.</p>
                </div>
                <div className="bg-green-800/50 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="font-semibold text-xl mb-2">Secure Payments</h3>
                  <p className="text-green-100">Get paid safely through our protected payment system.</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button className="bg-white text-green-800 hover:bg-green-100 px-8 py-6 h-auto text-lg font-medium">
                  List an Item
                </Button>
                <a href="#" className="text-green-100 hover:text-white underline">Learn how it works</a>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-green-800">Verified Users</h3>
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
                  <h3 className="font-medium text-green-800">Coverage Available</h3>
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
                  <h3 className="font-medium text-green-800">24/7 Support</h3>
                  <p className="text-sm text-gray-600">Help when you need it</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Item Quick View Modal */}
        <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-green-800">
                Item Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedItem && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={getSelectedItem()?.image} 
                      alt={getSelectedItem()?.name} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 space-y-4">
                  <h2 className="text-xl font-bold text-green-800">{getSelectedItem()?.name}</h2>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm font-medium">{getSelectedItem()?.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({getSelectedItem()?.reviewCount} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600">{getSelectedItem()?.category}</p>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="ml-1 text-sm">{getSelectedItem()?.distance} miles away</span>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-green-800">${getSelectedItem()?.price} <span className="text-sm font-normal">per {getSelectedItem()?.duration}</span></div>
                    <p className="text-sm text-gray-600 mt-1">$100 security deposit required</p>
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minimum rental:</span>
                        <span className="font-medium">1 day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maximum rental:</span>
                        <span className="font-medium">14 days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-gray-600">
                      This is a sample description for the {getSelectedItem()?.name}. The actual description would contain details about the item's condition, specifications, and any special notes from the owner.
                    </p>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Request Rental
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 border-green-200">
                        View Full Details
                      </Button>
                      <Button variant="outline" className="border-green-200">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default Advertisements;