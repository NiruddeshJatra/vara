import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Home, Package, Plus, SlidersHorizontal, PackageOpen, Info, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CompactSearchBar from '@/components/advertisements/CompactSearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCompletionModal } from '@/components/common/ProfileCompletionModal';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/images/logo, icon & loader/logo.png';

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
  const [availability, setAvailability] = useState('any');
  const isHomePage = filepath.pathname === '/';
  const isAdvertismentsPage = filepath.pathname === '/advertisements';
  const isUploadProductPage = filepath.pathname === '/upload-product';
  const { t } = useTranslation();

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
    if (!user?.profileCompleted) {
      setShowProfileModal(true);
      return;
    }
    navigate('/upload-product');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerStyle}`}>
      <div className="container mx-auto px-3 lg:px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4 ml-4 md:ml-4 lg:ml-0">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img
              src={logo}
              alt="Bhara Logo"
              className={`h-6 w-auto transition-all duration-300 ${(!isHomePage || isScrolled) ? "opacity-100" : "opacity-80"}`}
            />
          </Link>
          {/* Conditional Slogan */}
          {!showSearchInNav && (
            <p className={`hidden md:block text-xs ml-2 mt-1 ${(!isHomePage || isScrolled) ? "text-green-600" : "text-green-400/80"}`}>
              Borrow What You Need, Lend What You Don't
            </p>
          )}
        </div>
        
        {showSearchInNav && (
          <div className="hidden md:flex flex-1 mx-6 lg:mx-auto max-w-sm lg:max-w-xl items-center justify-center ml-12">
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
              availability={availability}
              setAvailability={setAvailability}
            />
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-3 md:space-x-4 lg:space-x-8 ml-auto mr-4 lg:mr-12">
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
        <div className="hidden md:flex items-center space-x-2 md:space-x-3 lg:space-x-4 mr-4 lg:mr-12">
          <LanguageSwitcher compact={true} />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="profile-menu-button flex items-center gap-2 cursor-pointer border-2 border-green-500 px-4 py-2 rounded-full hover:bg-green-50 hover:border-green-600 hover:shadow-sm hover:scale-105 transition-all duration-300">
                <Menu size={24} className="text-green-600" />
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center animate-[profileButtonPulse_2s_infinite]">
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
                <DropdownMenuItem asChild className="focus:bg-green-50 focus:text-green-700">
                  <Link to="/my-listings" className="flex items-center">
                    <PackageOpen className="mr-2 h-4 w-4 text-green-600" />
                    <span>My Listings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-green-50 focus:text-green-700">
                  <Link to="/about" className="flex items-center">
                    <Info className="mr-2 h-4 w-4 text-green-600" />
                    <span>About Us</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-green-50 focus:text-green-700">
                  <Link to="/faq" className="flex items-center">
                    <HelpCircle className="mr-2 h-4 w-4 text-green-600" />
                    <span>{t('navigation.faq')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-green-100" />
                <DropdownMenuSeparator />
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
                  <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800 font-semibold py-1 lg:py-2 px-4 md:px-4 lg:px-5 rounded-full hover:scale-105 transition-all duration-200 text-xs md:text-xs lg:text-sm">Log In</Button>
                </Link>
              )}
              {/* Show register button if we're not on the register page */}
              {!filepath.pathname.includes('/auth/registration/') && (
                <Link to="/auth/registration/">
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 lg:py-2 px-4 md:px-4 lg:px-5 rounded-full hover:scale-105 transition-all duration-200 text-xs md:text-xs lg:text-sm">Sign Up</Button>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button with Animation */}
        <div className="md:hidden flex items-center gap-2">
          {isAuthenticated && (
            <div className="flex items-center mr-2">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center animate-[profileButtonPulse_2s_infinite]">
                <span className="text-white font-bold text-sm">{user?.username?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          )}
          <div id="menuToggle">
            <input 
              id="checkbox" 
              type="checkbox" 
              checked={isMobileMenuOpen}
              onChange={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            <label className="toggle" htmlFor="checkbox">
              <div className={`bar bar--top ${(!isHomePage || isScrolled) ? "bg-green-600" : "bg-green-500"}`}></div>
              <div className={`bar bar--middle ${(!isHomePage || isScrolled) ? "bg-green-600" : "bg-green-500"}`}></div>
              <div className={`bar bar--bottom ${(!isHomePage || isScrolled) ? "bg-green-600" : "bg-green-500"}`}></div>
            </label>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-green-50 backdrop-blur-sm animate-[menuSlideIn_0.3s_ease-out]">
          <div className="container mx-auto px-4 py-4 flex flex-col items-center space-y-4">
            {isAuthenticated && (
              <>
                <Link to="/rentals" className="text-base font-semibold py-2 text-green-700 hover:text-green-900 transition-colors w-full text-center flex items-center justify-center gap-2 menu-item-fade-in">
                  <Package size={18} /> My Rentals
                </Link>
                <Link to="/my-listings" className="text-base font-semibold py-2 text-green-700 hover:text-green-900 transition-colors w-full text-center flex items-center justify-center gap-2 menu-item-fade-in-delay-1">
                  <PackageOpen size={18} /> My Listings
                </Link>
                <Link to="/profile" className="text-base font-semibold py-2 text-green-700 hover:text-green-900 transition-colors w-full text-center flex items-center justify-center gap-2 menu-item-fade-in-delay-2">
                  <User size={18} /> Profile
                </Link>
                <Link to="/about" className="text-base font-semibold py-2 text-green-700 hover:text-green-900 transition-colors w-full text-center flex items-center justify-center gap-2 menu-item-fade-in-delay-3">
                  <Info size={18} /> About Us
                </Link>
                <Link to="/faq" className="text-base font-semibold py-2 text-green-700 hover:text-green-900 transition-colors w-full text-center flex items-center justify-center gap-2 menu-item-fade-in-delay-4">
                  <HelpCircle size={18} /> {t('navigation.faq')}
                </Link>
                <div className="mobile-menu-language-toggle menu-item-fade-in-delay-5">
                  <LanguageSwitcher />
                </div>
                <Button
                  onClick={handleUploadProduct}
                  className="w-full bg-green-600 hover:bg-green-700 hover:scale-105 text-white font-semibold py-2 rounded-full mt-2 flex items-center justify-center gap-2 menu-item-fade-in-delay-6"
                >
                  <Plus size={18} /> Upload Product
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:scale-105 font-semibold py-2 rounded-full mt-2 flex items-center justify-center gap-2 menu-item-fade-in-delay-7"
                >
                  <LogOut size={18} /> Log Out
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/about" className="text-base font-semibold py-2 text-green-700 hover:text-green-900 transition-colors w-full text-center flex items-center justify-center gap-2 menu-item-fade-in">
                  <Info size={18} /> About Us
                </Link>
                <Link to="/faq" className="text-base font-semibold py-2 text-green-700 hover:text-green-900 transition-colors w-full text-center flex items-center justify-center gap-2 menu-item-fade-in-delay-1">
                  <HelpCircle size={18} /> {t('navigation.faq')}
                </Link>
                <div className="mobile-menu-language-toggle menu-item-fade-in-delay-2">
                  <LanguageSwitcher />
                </div>
                <Link to="/auth/login/" className="w-full menu-item-fade-in-delay-3">
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 font-semibold py-2 rounded-full mt-2">Log In</Button>
                </Link>
                <Link to="/auth/registration/" className="w-full menu-item-fade-in-delay-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-full mt-2">Sign Up</Button>
                </Link>
              </>
            )}
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