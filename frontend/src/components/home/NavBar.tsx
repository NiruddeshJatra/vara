import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, Home, Package, MessageSquare, Plus, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CompactSearchBar from '@/components/advertisements/CompactSearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const filepath = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [showSearchInNav, setShowSearchInNav] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('GEC, Chittagong');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const isHomePage = filepath.pathname === '/';
  const isAdvertismentsPage = filepath.pathname === '/advertisements';
  const isUploadProductPage = filepath.pathname === '/upload-product';

  useEffect(() => {
    const handleScroll = () => {
      const shouldShowSearch = window.scrollY > 50;
      setIsScrolled(window.scrollY > 50);
      setShowSearchInNav(shouldShowSearch);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine header style: transparent only on homepage when not scrolled
  const headerStyle = (showSearchInNav ||!isHomePage && !isAdvertismentsPage || isScrolled) 
    ? 'py-3 bg-green-50/90 backdrop-blur-md shadow-subtle' 
    : 'py-5 bg-transparent';

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUploadProduct = () => {
    if (!user?.profileComplete) {
      setShowProfileModal(true);
      return;
    }
    navigate('/upload-product');
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
          {isAuthenticated && !showSearchInNav && !isUploadProductPage && (
            <>
              <Button 
                className={"text-sm font-semibold text-black/70 hover:text-white border border-green-600 text-green-700 bg-green-50/50 hover:bg-lime-600 hover:border-none px-5"}
                onClick={handleUploadProduct}
              >
                <Plus size={16} className="mr-1" />Upload Product
              </Button>
            </>
          )}
          {isAuthenticated && showSearchInNav && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-gray-300 hover:bg-green-50 text-green-800 rounded-full px-3 sm:px-4 mt-3 sm:mt-0 sm:ml-4 sm:mr-10 text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              <span>Filters</span>
            </Button>
          )}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4 mr-8">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer border-2 border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 backdrop:bg-gray-50 hover:shadow-sm hover:scale-105 transition-all duration-200">
                <Menu size={24} />
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user?.username?.charAt(0).toUpperCase()}</span>
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
              {/* Show login button if we're not on the login page */}
              {!filepath.pathname.includes('/auth/login/') && (
                <Link to="/auth/login/">
                  <Button variant="outline" size="sm" className="border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800">Log In</Button>
                </Link>
              )}
              {/* Show register button if we're not on the register page */}
              {!filepath.pathname.includes('/auth/registration/') && (
                <Link to="/auth/registration/">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Sign Up</Button>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button - Moved to the right */}
        <div className="md:hidden flex items-center ml-auto">
          <button 
            className="flex items-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-green-100 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col items-center space-y-4">
            <Link to="/" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Home</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/advertisements" className="text-sm font-medium py-2 hover:text-green-600 transition-colors flex items-center gap-2">
                  <Home size={16} /> Browse Items
                </Link>
                <Link to="/rentals" className="text-sm font-medium py-2 hover:text-green-600 transition-colors flex items-center gap-2">
                  <Package size={16} /> My Rentals
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
                {/* Show login link if we're on the register page */}
                {filepath.pathname.includes('/auth/registration/') && (
                  <Link to="/auth/login/" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Login</Link>
                )}
                {/* Show register link if we're on the login page */}
                {filepath.pathname.includes('/auth/login/') && (
                  <Link to="/auth/registration/" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Register</Link>
                )}
                {/* Show these links on other pages */}
                {!filepath.pathname.includes('/auth/') && (
                  <>
                    <Link to="/auth/login/" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Login</Link>
                    <Link to="/auth/registration/" className="text-sm font-medium py-2 hover:text-green-600 transition-colors">Register</Link>
                  </>
                )}
              </>
            )}
            
            <div className="pt-4 flex flex-col items-center space-y-3">
              {!isAuthenticated && (
                <>
                  {/* Show login button if we're not on the login page */}
                  {!filepath.pathname.includes('/auth/login/') && (
                    <Link to="/auth/login/" className="w-full">
                      <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">Log In</Button>
                    </Link>
                  )}
                  {/* Show register button if we're not on the register page */}
                  {!filepath.pathname.includes('/auth/registration/') && (
                    <Link to="/auth/registration/" className="w-full">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Sign Up</Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Completion Modal */}
      <ProfileCompletionModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Complete Your Profile"
        description="You need to complete your profile before you can upload products."
      />
    </header>
  );
};

export default NavBar;