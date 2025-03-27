import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileTopNavProps {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  notificationCount: number;
  onNotificationClick: () => void;
  onToggleMobileMenu: () => void;
}

const ProfileTopNav = ({
  title,
  searchTerm,
  onSearchChange,
  notificationCount,
  onNotificationClick,
  onToggleMobileMenu
}: ProfileTopNavProps) => {
  return (
    <header className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-10">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-green-700 hover:text-green-900 focus:outline-none"
            onClick={onToggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="md:hidden font-bold text-green-800 text-lg">{title}</div>
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 h-10 border-green-200 focus:border-green-500 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="relative p-2 text-green-700 hover:text-green-900 hover:bg-green-100 rounded-full"
            onClick={onNotificationClick}
          >
            <Bell className="h-6 w-6" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full text-xs text-white flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="md:hidden px-4 pb-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 h-10 w-full border-green-200 focus:border-green-500 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};

export default ProfileTopNav; 