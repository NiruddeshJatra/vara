import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="animate-scale-up">
            <h1 className="text-9xl font-bold text-green-700 mb-2">404</h1>
            <div className="w-16 h-1 bg-green-500 mx-auto mb-8 animate-shimmer"></div>
          </div>
          
          <div className="animate-fade-up delay-300 mb-8">
            <h2 className="text-2xl font-semibold text-green-800 mb-3">Page Not Found</h2>
            <p className="text-green-600/80 mb-8">
              Oops! It seems like you've ventured into uncharted territory. 
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-500">
            <Link to="/" className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-medium hover-lift">
              <Home size={18} />
              <span>Back to Home</span>
            </Link>
            
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-green-600 text-green-700 font-medium hover-glow"
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
