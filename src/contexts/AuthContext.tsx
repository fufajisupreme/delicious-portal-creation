
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Mock user database (in a real app, this would be in your backend)
const MOCK_USERS: Record<string, User & { password: string }> = {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user exists and password matches
    const userEntry = Object.values(MOCK_USERS).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!userEntry || userEntry.password !== password) {
      toast.error("Invalid email or password");
      return false;
    }

    // Create user object without password
    const loggedInUser = {
      id: userEntry.id,
      email: userEntry.email,
      name: userEntry.name
    };

    // Store user in state and localStorage
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    toast.success(`Welcome back, ${loggedInUser.name}!`);
    return true;
  };

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email is already registered
    const userExists = Object.values(MOCK_USERS).some(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      toast.error("Email is already registered");
      return false;
    }

    // Create new user
    const newUserId = `user-${Date.now()}`;
    MOCK_USERS[newUserId] = {
      id: newUserId,
      email,
      name,
      password
    };

    // Create user object without password
    const newUser = {
      id: newUserId,
      email,
      name
    };

    // Store user in state and localStorage
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    toast.success(`Welcome, ${name}!`);
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info("You've been logged out");
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
