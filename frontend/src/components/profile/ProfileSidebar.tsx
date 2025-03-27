import { 
  User, 
  PackageOpen, 
  History, 
  MessageSquare, 
  Settings,
  LogOut,
  Star,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProfileSidebarProps {
  userData: {
    firstName: string;
    lastName: string;
    username: string;
    profilePicture: string;
    notificationCount: number;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const ProfileSidebar = ({ userData, activeTab, onTabChange, onLogout }: ProfileSidebarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex-col bg-gradient-to-r from-green-900 to-green-700 shadow-lg transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex border-r border-green-700`}
      >
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center gap-2">
            <User className="h-7 w-7 text-white" />
            <h1 className="text-xl font-bold text-white">My Profile</h1>
          </div>
        </div>
        
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={userData.profilePicture} />
              <AvatarFallback className="bg-white text-green-700">
                {userData.firstName[0]}{userData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-white">{userData.firstName} {userData.lastName}</p>
              <p className="text-xs text-green-200">@{userData.username}</p>
            </div>
            {userData.notificationCount > 0 && (
              <Badge className="ml-auto bg-green-200 text-green-800 border-0">
                {userData.notificationCount}
              </Badge>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md group ${
                  activeTab === "profile" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                }`}
                onClick={() => handleTabChange("profile")}
              >
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md group ${
                  activeTab === "listings" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                }`}
                onClick={() => handleTabChange("listings")}
              >
                <PackageOpen className="h-5 w-5" />
                <span>My Listings</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "history" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                }`}
                onClick={() => handleTabChange("history")}
              >
                <History className="h-5 w-5" />
                <span>Rental History</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "favorites" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                }`}
                onClick={() => handleTabChange("favorites")}
              >
                <Heart className="h-5 w-5" />
                <span>Favorites</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "reviews" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                }`}
                onClick={() => handleTabChange("reviews")}
              >
                <Star className="h-5 w-5" />
                <span>Reviews</span>
              </button>
            </li>
            <li>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === "settings" ? "bg-white/20 text-white font-medium" : "text-green-100 hover:bg-white/10"
                }`}
                onClick={() => handleTabChange("settings")}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-green-700">
          <Button 
            variant="default" 
            size="sm" 
            onClick={onLogout}
            className="w-full bg-white text-green-700 hover:bg-green-100 hover:text-green-800 font-semibold"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar; 