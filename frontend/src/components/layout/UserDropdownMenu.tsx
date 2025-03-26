import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Shield } from "lucide-react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

interface UserDropdownMenuProps {
  username: string;
  avatarUrl?: string;
  onLogout: () => void;
}

export function UserDropdownMenu({ username, avatarUrl, onLogout }: UserDropdownMenuProps) {
  const { isAdmin, adminLogout } = useAdminAuth();

  const handleLogout = () => {
    if (isAdmin) {
      adminLogout();
    }
    onLogout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-gray-200 p-1 pr-4 hover:bg-gray-50">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>{username.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{username}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link to="/admin/dashboard" className="flex items-center cursor-pointer text-green-600">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 