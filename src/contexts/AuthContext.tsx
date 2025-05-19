
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
 * Mock user database 
 * @backend-integration
 * In a real application:
 * 1. This would be stored in a secure database (e.g., PostgreSQL with Supabase)
 * 2. Passwords would be hashed using bcrypt or Argon2
 * 3. Face data would be stored as embeddings (vectors), not raw images
 * 4. Proper authentication tokens would be used (JWT, session tokens)
 */
const MOCK_USERS: Record<string, User & { password: string; faceId?: string }> = {};

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
   * @backend-implementation
   * In a real backend:
   * 1. Validate credentials against database
   * 2. Hash password comparison
   * 3. Generate and return auth tokens
   * 4. Log authentication attempts for security monitoring
   */
  const login = async (
    email: string, 
    password: string, 
    faceImageData: string | null = null
  ): Promise<boolean> => {
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

    // If face data provided, verify it as an additional check
    if (faceImageData && userEntry.faceId) {
      toast.info("Verifying face ID...");
      try {
        const verifyResult = await verifyFace(userEntry.id, faceImageData);
        if (!verifyResult.success) {
          toast.error("Face verification failed");
          return false;
        }
        toast.success("Face verified successfully");
      } catch (error) {
        console.error("Face verification error:", error);
        toast.error("Face verification failed");
        return false;
      }
    }

    // Create user object without password
    const loggedInUser = {
      id: userEntry.id,
      email: userEntry.email,
      name: userEntry.name,
      role: userEntry.role,
      hasFaceId: !!userEntry.faceId
    };

    // Store user in state and localStorage
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    toast.success(`Welcome back, ${loggedInUser.name}!`);
    return true;
  };
  
  /**
   * Login with face only
   * @backend-implementation
   * In a real backend:
   * 1. Look up user by email
   * 2. Compare face embeddings with stored face data
   * 3. Generate auth tokens on successful match
   * 4. Implement anti-spoofing measures
   */
  const loginWithFace = async (email: string, faceImageData: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const userEntry = Object.values(MOCK_USERS).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (!userEntry) {
      toast.error("User not found");
      return false;
    }
    
    if (!userEntry.faceId) {
      toast.error("Face ID not set up for this account");
      return false;
    }
    
    // Verify face
    toast.info("Verifying your face...");
    try {
      const verifyResult = await verifyFace(userEntry.id, faceImageData);
      if (!verifyResult.success) {
        toast.error("Face verification failed");
        return false;
      }
    } catch (error) {
      console.error("Face verification error:", error);
      toast.error("Face verification failed");
      return false;
    }
    
    // Create user object without password
    const loggedInUser = {
      id: userEntry.id,
      email: userEntry.email,
      name: userEntry.name,
      role: userEntry.role,
      hasFaceId: true
    };
    
    // Store user in state and localStorage
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    toast.success(`Welcome back, ${loggedInUser.name}!`);
    return true;
  };

  /**
   * Signup with email/password and optional face data
   * @backend-implementation
   * In a real backend:
   * 1. Validate input data
   * 2. Check for existing users with same email
   * 3. Hash password before storing
   * 4. Process and store face embedding if provided
   * 5. Create user record in database
   * 6. Generate auth tokens for immediate login
   */
  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    faceImageData: string | null = null
  ): Promise<boolean> => {
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
    const newUser = {
      id: newUserId,
      email,
      name,
      role,
      password,
      faceId: faceImageData ? `face-${Date.now()}` : undefined
    };
    
    // Register face if provided
    if (faceImageData) {
      toast.info("Registering your face...");
      try {
        const registerResult = await registerFace(newUserId, faceImageData);
        if (!registerResult.success) {
          toast.error("Face registration failed");
          // Continue with signup anyway, just without face authentication
          newUser.faceId = undefined;
        }
      } catch (error) {
        console.error("Face registration error:", error);
        toast.error("Face registration failed");
        // Continue with signup anyway, just without face authentication
        newUser.faceId = undefined;
      }
    }

    // Add user to mock database
    MOCK_USERS[newUserId] = newUser;

    // Create user object without password for frontend
    const loggedInUser = {
      id: newUserId,
      email,
      name,
      role,
      hasFaceId: !!newUser.faceId
    };

    // Store user in state and localStorage
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
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
    loginWithFace,
    signup,
    logout,
    isAuthenticated: !!user,
    isRestaurantOwner: user?.role === 'restaurant_owner'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
