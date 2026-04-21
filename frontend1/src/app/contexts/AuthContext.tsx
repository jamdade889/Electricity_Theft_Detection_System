import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; email: string; loginTime?: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string; loginTime?: string } | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('powerguard_auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setUser(authData.user);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Mock authentication - check credentials
    // In production, this would be an API call
    if (username === 'admin' && password === 'admin123') {
      const userData = {
        username: 'Admin User',
        email: 'admin@powerguard.ai',
        loginTime: new Date().toISOString()
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      
      // Persist to localStorage
      localStorage.setItem('powerguard_auth', JSON.stringify({ user: userData }));
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('powerguard_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}