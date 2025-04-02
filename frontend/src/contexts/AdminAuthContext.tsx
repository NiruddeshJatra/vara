import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "sonner";

interface AdminAuthContextType {
  isAdmin: boolean;
  loading: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if admin token exists in localStorage on initialization
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      // Verify the token with the backend
      verifyAdminToken(adminToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAdminToken = async (token: string) => {
    try {
      const response = await axios.get(`${config.baseUrl}/api/admin/verify/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.is_admin) {
        setIsAdmin(true);
      } else {
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error("Admin token verification error:", error);
      localStorage.removeItem('admin_token');
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`${config.baseUrl}/api/admin/login/`, {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        setIsAdmin(true);
        toast.success('Admin login successful');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast.error(error.response?.data?.detail || 'Admin login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_token');
    toast.success('Admin logged out successfully');
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, loading, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}; 