
import { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const isProfilePage = location.pathname === '/profile';
    // If user visits profile page, simulate logged in state
    if (isProfilePage) {
      setIsLoggedIn(true);
    }
  }, [location.pathname]);

  // Determine header style: transparent only on homepage when not scrolled
  const headerStyle = (!isHomePage || isScrolled) 
    ? 'py-3 bg-green-50/90 backdrop-blur-md shadow-subtle' 
    : 'py-5 bg-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerStyle}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className={`text-xl md:text-2xl font-bold text-foreground flex items-center ${(!isHomePage || isScrolled) ? "text-green-900" : "text-green-300"}`}>
            <span className="text-lime-500 mr-1">B</span>hara
          </Link>
          <p className={`hidden md:block text-xs ml-8 mt-1 ${(!isHomePage || isScrolled) ? "text-green-600" : "text-green-400/80"}`}>Borrow What You Need, Lend What You Don't</p>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <Link to="/profile">
              <Avatar className="w-9 h-9 border-2 border-green-100">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" />
                <AvatarFallback className="bg-green-100 text-green-800">SJ</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <>
            {location.pathname !== '/login' && (
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50">Log In</Button>
              </Link>
            )}
            {location.pathname !== '/register' && (
              <Link to="/register">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Sign Up</Button>
              </Link>
            )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-green-100 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Home</Link>
            {isLoggedIn ? (
              <Link to="/profile" className="text-sm font-medium py-2 hover:text-green-600 transition-colors flex items-center gap-2">
                <User size={16} /> Profile
              </Link>
            ) : (
              <>
                {location.pathname === '/register' ? (
                  <Link to="/login" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Login</Link>
                ) : location.pathname === '/login' ? (
                  <Link to="/register" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Register</Link>
                ) : (
                  <>
                    <Link to="/how-it-works" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">How It Works</Link>
                    <Link to="/browse-items" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Browse Items</Link>
                  </>
                )}
              </>
            )}
            <div className="pt-4 flex flex-col space-y-3">
              {!isLoggedIn && (
                <>
                  {location.pathname !== '/login' && (
                    <Link to="/login" className="w-full">
                      <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">Log In</Button>
                    </Link>
                  )}
                  {location.pathname !== '/register' && (
                    <Link to="/register" className="w-full">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Sign Up</Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
