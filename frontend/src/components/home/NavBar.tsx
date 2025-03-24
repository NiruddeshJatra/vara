import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, Home, Package, MessageSquare, Plus, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CompactSearchBar from '@/components/advertisements/CompactSearchBar';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const filepath = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSearchInNav, setShowSearchInNav] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('GEC, Chittagong');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const isHomePage = filepath.pathname === '/';
  const isAdvertismentsPage = filepath.pathname === '/advertisements';

  useEffect(() => {
    const handleScroll = () => {
      const shouldShowSearch = window.scrollY > 50;
      setIsScrolled(window.scrollY > 50);
      setShowSearchInNav(shouldShowSearch);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
   // Simulate logged in state for profile, advertisements, and rentals pages
    const authorizedPages = ['/profile', '/advertisements', '/rentals'];
    const isAuthorizedPage = authorizedPages.includes(filepath.pathname);
    
    if (isAuthorizedPage) {
      setIsLoggedIn(true);
    }
  }, [filepath.pathname]);

  // Determine header style: transparent only on homepage when not scrolled
  const headerStyle = (showSearchInNav ||!isHomePage && !isAdvertismentsPage || isScrolled) 
    ? 'py-3 bg-green-50/90 backdrop-blur-md shadow-subtle' 
    : 'py-5 bg-transparent';

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    // In a real app, you would clear session/tokens here
  };

  // Redirect to advertisements page after login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerStyle}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" className={`text-xl md:text-2xl font-bold flex items-center ${(!isHomePage || isScrolled) ? "text-green-900" : "text-green-300"}`}>
            <span className="text-lime-500 mr-1">V</span>ara
          </Link>
          {/* Conditional Slogan */}
          {!showSearchInNav && (
            <p className={`hidden md:block text-xs mt-1 ${
              (!isHomePage || isScrolled) ? "text-green-600" : "text-green-400/80"
            }`}>
              Borrow What You Need, Lend What You Don't
            </p>
          )}
        </div>
        
        {showSearchInNav && (
          <div className="hidden md:flex flex-1 mx-4 items-center justify-center">
            <CompactSearchBar 
              inNav={true}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              location={location}
              setLocation={setLocation}
              filtersOpen={filtersOpen}
              setFiltersOpen={setFiltersOpen}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 ml-auto mr-12">
          {isLoggedIn && !showSearchInNav && (
            <>
              <Link to="/create-listing">
                <Button className={"text-sm font-semibold text-black/70 hover:text-white border border-green-600 text-green-700 bg-green-50/50 hover:bg-lime-600 hover:border-none px-5"}>
                  <Plus size={16} className="mr-1" />Create Listing
                </Button>
              </Link>
            </>
          )}
          {isLoggedIn && showSearchInNav && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-gray-300 rounded-full px-4"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          )}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4 mr-8">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer border-2 border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 backdrop:bg-gray-50 hover:shadow-sm hover:scale-105 transition-all duration-200">
                <Menu size={24} />
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">V</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mr-16 mt-1 border-green-100 shadow-lg">
                <DropdownMenuItem asChild className="focus:bg-green-50 focus:text-green-700">
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-green-600" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-green-50 focus:text-green-700">
                  <Link to="/rentals" className="flex items-center">
                    <Package className="mr-2 h-4 w-4 text-green-600" />
                    <span>My Rentals</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-green-100" />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="focus:bg-green-50 focus:text-green-700 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4 text-green-600" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
            {filepath.pathname !== '/login' && (
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50">Log In</Button>
              </Link>
            )}
            {filepath.pathname !== '/register' && (
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
          <div className="container mx-auto px-4 py-4 flex flex-col items-center space-y-4">
            <Link to="/" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Home</Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/advertisements" className="text-sm font-medium py-2 hover:text-green-600 transition-colors flex items-center gap-2">
                  <Home size={16} /> Browse Items
                </Link>
                <Link to="#" className="text-sm font-medium py-2 hover:text-green-600 transition-colors flex items-center gap-2">
                  <Package size={16} /> My Items
                </Link>
                <Link to="/rentals" className="text-sm font-medium py-2 hover:text-green-600 transition-colors flex items-center gap-2">
                  <Package size={16} /> My Rentals
                </Link>
                <Link to="#" className="text-sm font-medium py-2 hover:text-green-600 transition-colors flex items-center gap-2">
                  <MessageSquare size={16} /> Messages
                </Link>
                <Link to="/profile" className="text-sm font-medium py-2 hover:text-green-600 transition-colors flex items-center gap-2">
                  <User size={16} /> Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium py-2 hover:text-green-600 transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </>
            ) : (
              <>
                {filepath.pathname === '/register' ? (
                  <Link to="/login" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Login</Link>
                ) : filepath.pathname === '/login' ? (
                  <Link to="/register" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Register</Link>
                ) : (
                  <>
                    <Link to="/how-it-works" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">How It Works</Link>
                    <Link to="/browse-items" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Browse Items</Link>
                  </>
                )}
              </>
            )}
            
            <div className="pt-4 flex flex-col items-center space-y-3">
              {!isLoggedIn && (
                <>
                  {filepath.pathname !== '/login' && (
                    <Link to="/login" className="w-full">
                      <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">Log In</Button>
                    </Link>
                  )}
                  {filepath.pathname !== '/register' && (
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