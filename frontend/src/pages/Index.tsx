import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import ValueProposition from '@/components/ValueProposition';
import HowItWorks from '@/components/HowItWorks';
import FeaturedListings from '@/components/FeaturedListings';
import PopularCategories from '@/components/PopularCategories';
import Testimonials from '@/components/Testimonials';
import TrustSafety from '@/components/TrustSafety';
import FooterCTA from '@/components/FooterCTA';
import Footer from '@/components/Footer';
import MobileNavBar from '@/components/MobileNavBar';
import '../styles/main.css';

const Index = () => {
  // Add scroll reveal effect on scroll
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
    <div className="bg-gradient-green nature-pattern modern-background" style={{minHeight: '100vh'}}>
      <NavBar />
      <Hero />
      <FeaturedListings />
      <PopularCategories />
      <ValueProposition />
      <HowItWorks />
      <Testimonials />
      <TrustSafety />
      <FooterCTA />
      <Footer />
      <MobileNavBar />
    </div>
  );
};

export default Index;
