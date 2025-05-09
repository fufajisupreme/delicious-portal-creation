
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// User role type
export type UserRole = 'customer' | 'restaurant_owner';

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hasFaceId?: boolean;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, token: string, userData: any) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole, token: string, userId: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isRestaurantOwner: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isRestaurantOwner: false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login with credentials from backend
   */
  const login = async (
    email: string,
    password: string,
    token: string,
    userData: any
  ): Promise<boolean> => {
    try {
      // Create user object from backend response
      const loggedInUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as UserRole,
        hasFaceId: !!userData.hasFaceId
      };

      // Store user and token in state and localStorage
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', token);
      
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      return true;
    } catch (error) {
      console.error("Login error in context:", error);
      return false;
    }
  };

  /**
   * Signup with credentials from backend
   */
  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    token: string,
    userId: string
  ): Promise<boolean> => {
    try {
      // Create user object
      const newUser = {
        id: userId,
        email,
        name,
        role,
        hasFaceId: true // Since we require face registration
      };

      // Store user in state and localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', token);
      
      toast.success(`Welcome, ${name}!`);
      return true;
    } catch (error) {
      console.error("Signup error in context:", error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.info("You've been logged out");
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isRestaurantOwner: user?.role === 'restaurant_owner'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
