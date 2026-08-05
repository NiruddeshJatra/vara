import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthState, User } from '@/types/auth';
import api from '@/lib/axios';
import config from '../config';
import { queryClient } from '../lib/react-query';

interface AuthContextValue extends AuthState {
  login: (accessToken: string, user: User) => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load: try silent token refresh to restore session
  useEffect(() => {
    const tryRestoreSession = async () => {
      try {
        const response = await api.post(config.auth.refreshTokenEndpoint);
        const { access_token } = response.data.data;
        window.__accessToken__ = access_token;
        setAccessToken(access_token);

        // Fetch user profile with new token
        const profileResponse = await api.get(config.auth.profileEndpoint);
        setUserState(profileResponse.data.data);
      } catch {
        // No valid session - user must log in
        window.__accessToken__ = null;
      } finally {
        setIsLoading(false);
      }
    };
    tryRestoreSession();
  }, []);

  const login = (token: string, userData: User) => {
    window.__accessToken__ = token;
    setAccessToken(token);
    setUserState(userData);
  };

  const logout = async () => {
    try {
      await api.post(config.auth.logoutEndpoint);
    } finally {
      window.__accessToken__ = null;
      setAccessToken(null);
      setUserState(null);

      // Clear user-scoped React Query caches
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['profile'] });
      queryClient.removeQueries({ queryKey: ['userProducts'] });
      queryClient.removeQueries({ queryKey: ['rentals'] });
    }
  };

  const setUser = (userData: User) => setUserState(userData);

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
