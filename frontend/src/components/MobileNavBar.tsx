
import { Home, Search, LayoutGrid, User } from 'lucide-react';
import '../styles/main.css';

const MobileNavBar = () => {
  return (
    <div className="mobile-nav">
      <a href="/" className="mobile-nav-item mobile-nav-active">
        <Home className="mobile-nav-icon" />
        <span className="mobile-nav-label">Home</span>
      </a>
      <a href="#browse-items" className="mobile-nav-item mobile-nav-inactive">
        <LayoutGrid className="mobile-nav-icon" />
        <span className="mobile-nav-label">Items</span>
      </a>
      <a href="#search" className="mobile-nav-item mobile-nav-inactive">
        <Search className="mobile-nav-icon" />
        <span className="mobile-nav-label">Search</span>
      </a>
      <a href="#profile" className="mobile-nav-item mobile-nav-inactive">
        <User className="mobile-nav-icon" />
        <span className="mobile-nav-label">Profile</span>
      </a>
    </div>
  );
};

export default MobileNavBar;
