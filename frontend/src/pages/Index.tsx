import { useEffect } from 'react';
import NavBar from '@/components/home/NavBar';
import Hero from '@/components/home/Hero';
import ValueProposition from '@/components/home/ValueProposition';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturedListings from '@/components/home/FeaturedListings';
import PopularCategories from '@/components/home/PopularCategories';
import Testimonials from '@/components/home/Testimonials';
import TrustSafety from '@/components/home/TrustSafety';
import FooterCTA from '@/components/home/FooterCTA';
import Footer from '@/components/home/Footer';
import MobileNavBar from '@/components/home/MobileNavBar';
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
    <div className="bg-gradient-green nature-pattern modern-background" style={{ minHeight: '100vh' }}>
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
