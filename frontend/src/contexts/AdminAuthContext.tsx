import { createContext, useContext, useState, ReactNode } from "react";

interface AdminAuthContextType {
  isAdmin: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(
    // Check if admin token exists in localStorage on initialization
    localStorage.getItem('admin_token') !== null
  );

  const adminLogin = async (email: string, password: string) => {
    try {
      // Call your API to verify admin credentials
      // const response = await api.post('/admin/login', { email, password });
      
      // For demo, simulate successful login for admin@vara.com
      if (email === 'admin@vara.com' && password === 'adminpassword') {
        setIsAdmin(true);
        localStorage.setItem('admin_token', 'sample_admin_jwt_token');
        return true;
      }
      return false;
    } catch (error) {
      console.error("Admin login error:", error);
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_token');
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, adminLogin, adminLogout }}>
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