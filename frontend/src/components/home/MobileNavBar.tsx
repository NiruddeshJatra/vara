import { Home, Search, LayoutGrid, User } from 'lucide-react';

const MobileNavBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 shadow-sm md:hidden grid grid-cols-4 gap-1 z-50">
      <a href="/" className="flex flex-col items-center justify-center py-3 text-green-600 hover:bg-green-50 transition">
        <Home className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">Home</span>
      </a>
      <a href="#browse-items" className="flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600 hover:bg-green-50 transition">
        <LayoutGrid className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">Items</span>
      </a>
      <a href="#search" className="flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600 hover:bg-green-50 transition">
        <Search className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">Search</span>
      </a>
      <a href="#profile" className="flex flex-col items-center justify-center py-3 text-gray-500 hover:text-green-600 hover:bg-green-50 transition">
        <User className="w-5 h-5 mb-1" />
        <span className="text-xs font-medium">Profile</span>
      </a>
    </div>
  );
};

export default MobileNavBar;