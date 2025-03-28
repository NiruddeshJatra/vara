import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { Link, Shield } from "lucide-react";

const Navbar = () => {
  const { isAdmin } = useAdminAuth();
  
  // Rest of your existing Navbar code
  
  // Add this somewhere in your navigation links, assuming you have a user dropdown or nav links
  {isAdmin && (
    <Link 
      to="/admin/dashboard" 
      className="flex items-center gap-2 px-4 py-2 text-sm rounded-md text-green-700 hover:bg-green-50"
    >
      <Shield className="h-4 w-4" />
      <span>Admin Dashboard</span>
    </Link>
  )}
  
  // Continue with the rest of the Navbar code
} 