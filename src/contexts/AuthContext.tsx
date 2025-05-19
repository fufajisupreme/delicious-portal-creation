import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { verifyFace, registerFace } from '@/services/faceAuthService';

// User role type
export type UserRole = 'customer' | 'restaurant_owner';

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hasFaceId?: boolean;
  token?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, faceImageData?: string | null) => Promise<boolean>;
  loginWithFace: (email: string, faceImageData: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole, faceImageData?: string | null) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isRestaurantOwner: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  loginWithFace: async () => false,
  signup: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isRestaurantOwner: false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

/**
 * Mock user database for non-face auth users
 * This will be used as a fallback when face auth is not used
 */
const MOCK_USERS: Record<string, User & { password: string; }> = {};

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

  /**
   * Login with email/password
   */
  const login = async (
    email: string, 
    password: string, 
    faceImageData: string | null = null
  ): Promise<boolean> => {
    // If face data provided, try face login
    if (faceImageData) {
      return loginWithFace(email, faceImageData);
    }

    // Otherwise, fall back to mock login
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
      name: userEntry.name,
      role: userEntry.role,
      hasFaceId: false
    };

    // Store user in state and localStorage
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    toast.success(`Welcome back, ${loggedInUser.name}!`);
    return true;
  };
  
  /**
   * Login with face only - uses the face API
   */
  const loginWithFace = async (email: string, faceImageData: string): Promise<boolean> => {
    toast.info("Verifying your face...");
    
    try {
      const verifyResult = await verifyFace(email, faceImageData);
      
      if (!verifyResult.success) {
        toast.error(verifyResult.message || "Face verification failed");
        return false;
      }
      
      // For demo purposes, create a mock user if we don't have user details
      // In a real implementation, the API would return user details
      const mockUserId = `user-${Date.now()}`;
      const loggedInUser = {
        id: mockUserId,
        email: email,
        name: email.split('@')[0],  // Use part of the email as name
        role: 'customer' as UserRole,
        hasFaceId: true,
        token: verifyResult.token
      };
      
      // Store user in state and localStorage
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      toast.success(`Welcome back!`);
      return true;
    } catch (error) {
      console.error("Face login error:", error);
      toast.error("Face verification failed");
      return false;
    }
  };

  /**
   * Signup with email/password and optional face data
   */
  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    faceImageData: string | null = null
  ): Promise<boolean> => {
    // Check if email is already registered in mock database
    const userExists = Object.values(MOCK_USERS).some(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      toast.error("Email is already registered");
      return false;
    }

    // If face data provided, register with the API
    if (faceImageData) {
      toast.info("Registering your face...");
      try {
        const registerResult = await registerFace(email, password, faceImageData);
        
        if (!registerResult.success) {
          toast.error(registerResult.message || "Face registration failed");
          return false;
        }
        
        // Create user object for frontend
        const newUserId = `user-${Date.now()}`;
        const newUser = {
          id: newUserId,
          email,
          name,
          role,
          hasFaceId: true,
          token: registerResult.token
        };
        
        // Store user in state and localStorage
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        toast.success(`Welcome, ${name}!`);
        return true;
      } catch (error) {
        console.error("Face registration error:", error);
        toast.error("Face registration failed");
        return false;
      }
    } else {
      // No face data, use mock registration
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new user in mock database
      const newUserId = `user-${Date.now()}`;
      const newUser = {
        id: newUserId,
        email,
        name,
        role,
        password,
        hasFaceId: false
      };
      
      // Add user to mock database
      MOCK_USERS[newUserId] = newUser;

      // Create user object without password for frontend
      const loggedInUser = {
        id: newUserId,
        email,
        name,
        role,
        hasFaceId: false
      };

      // Store user in state and localStorage
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      toast.success(`Welcome, ${name}!`);
      return true;
    }
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
    loginWithFace,
    signup,
    logout,
    isAuthenticated: !!user,
    isRestaurantOwner: user?.role === 'restaurant_owner'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
