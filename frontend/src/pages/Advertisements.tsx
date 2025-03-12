import { useState, useEffect } from 'react';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import HeroSection from '@/components/advertisements/HeroSection';
import CategoriesSection from '@/components/advertisements/CategoriesSection';
import RecentListings from '@/components/advertisements/RecentListings';
import PopularListings from '@/components/advertisements/PopularListings';
import UserActivity from '@/components/advertisements/UserActivity';
import ListItemCTA from '@/components/advertisements/ListItemCTA';
import TrustIndicators from '@/components/advertisements/TrustIndicators';
import ItemModal from '@/components/advertisements/ItemModal';
import '../styles/main.css';

// Sample data for featured categories
const categories = [{
  id: 1,
  name: 'Photography & Videography',
  icon: 'camera',
  image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  count: 345
}, {
  id: 2,
  name: 'Sports & Fitness',
  icon: 'dumbbell',
  image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  count: 452
}, {
  id: 3,
  name: 'Outdoor & Camping',
  icon: 'tent',
  image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  count: 287
}, {
  id: 4,
  name: 'Audio & Entertainment',
  icon: 'headphones',
  image: 'https://images.unsplash.com/photo-1623998019820-99c01e6d2e5b?q=80&w=964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  count: 368
}, {
  id: 5,
  name: 'Electronics & Gadgets',
  icon: 'smartphone',
  image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  count: 512
}, {
  id: 6,
  name: 'Event & Party',
  icon: 'party-popper',
  image: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  count: 189
}, {
  id: 7,
  name: 'Tools & Equipment',
  icon: 'wrench',
  image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  count: 276
}];

// Sample data for recent listings
const recentListings = [{
  id: 1,
  name: 'DSLR Camera with 2 Lenses',
  image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  category: 'Photography & Videography',
  price: 35,
  duration: 'day',
  distance: 1.2,
  rating: 4.8,
  reviewCount: 32
}, {
  id: 2,
  name: 'Electric Mountain Bike',
  image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  category: 'Sports & Fitness',
  price: 25,
  duration: 'day',
  distance: 0.8,
  rating: 4.6,
  reviewCount: 48
}, {
  id: 3,
  name: '4-Person Camping Tent',
  image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  category: 'Outdoor & Camping',
  price: 20,
  duration: 'day',
  distance: 2.5,
  rating: 4.5,
  reviewCount: 24
}, {
  id: 4,
  name: 'Bluetooth Party Speaker',
  image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  category: 'Audio & Entertainment',
  price: 15,
  duration: 'day',
  distance: 1.5,
  rating: 4.7,
  reviewCount: 39
}, {
  id: 5,
  name: 'MacBook Pro 16"',
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  category: 'Electronics & Gadgets',
  price: 45,
  duration: 'day',
  distance: 3.0,
  rating: 4.9,
  reviewCount: 56
}, {
  id: 6,
  name: 'Wireless Drill Set',
  image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  category: 'Tools & Equipment',
  price: 18,
  duration: 'day',
  distance: 2.2,
  rating: 4.4,
  reviewCount: 28
}];

// Sample data for popular listings
const popularListings = recentListings.map(item => ({
  ...item,
  id: item.id + 100,
  // Different IDs for sample data
  rentalCount: Math.floor(Math.random() * 50) + 20
}));

// Sample data for recently viewed items
const recentlyViewedItems = recentListings.slice(0, 4).map(item => ({
  id: item.id,
  name: item.name,
  image: item.image
}));

// Sample data for rental requests
const rentalRequests = [{
  id: 1,
  itemName: 'Sony A7 III Camera Kit',
  image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  status: 'Pending',
  dates: 'May 15 - May 18, 2025'
}, {
  id: 2,
  itemName: 'Mountain Bike (Trek)',
  image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
  status: 'Accepted',
  dates: 'May 20 - May 22, 2025'
}];

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
    return [...recentListings, ...popularListings].find(item => item.id === selectedItem) || null;
  };

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-fade-up, .animate-fade-in, .animate-slide-in-right, .animate-scale-in');
      
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        // Check if element is in viewport
        if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
          element.classList.add('opacity-100');
          element.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };
    
    // Set initial state
    document.querySelectorAll('.animate-fade-up, .animate-fade-in, .animate-slide-in-right, .animate-scale-in').forEach((element) => {
      if (!element.classList.contains('opacity-0')) {
        element.classList.add('opacity-0', 'translate-y-10');
      }
    });
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Trigger initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-green nature-pattern modern-background">
      <NavBar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          location={location}
          setLocation={setLocation}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          categories={categories}
        />

        {/* Featured Categories Section */}
        <CategoriesSection categories={categories} />

        {/* Recent Listings Section */}
        <RecentListings items={recentListings} onQuickView={handleQuickView} />

        {/* Popular Listings Section */}
        <PopularListings items={popularListings} onQuickView={handleQuickView} />

        {/* User Activity Section */}
        <UserActivity recentlyViewedItems={recentlyViewedItems} rentalRequests={rentalRequests} />

        {/* List Your Item CTA Section */}
        <ListItemCTA />

        {/* Trust Indicators Section */}
        <TrustIndicators />

        {/* Item Quick View Modal */}
        <ItemModal 
          isOpen={isItemModalOpen} 
          onOpenChange={setIsItemModalOpen} 
          selectedItem={getSelectedItem()} 
        />
      </main>

      <Footer />
    </div>
  );
};

export default Advertisements;