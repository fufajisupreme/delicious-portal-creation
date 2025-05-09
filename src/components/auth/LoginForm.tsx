
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { Camera } from 'lucide-react';
import FaceCapture from './FaceCapture';
import { toast } from "sonner";
import { verifyFace } from '@/services/faceAuthService';

interface LoginFormProps {
  onToggleForm: () => void;
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFaceScanner, setShowFaceScanner] = useState(false);
  const [faceImageFile, setFaceImageFile] = useState<File | null>(null);
  const [faceImagePreview, setFaceImagePreview] = useState<string | null>(null);
  const [isFaceLogin, setIsFaceLogin] = useState(false);
  const { login } = useAuth();

  const handleFaceCapture = async (imageFile: File) => {
    setFaceImageFile(imageFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFaceImagePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(imageFile);
    
    setShowFaceScanner(false);
    toast.success("Face captured successfully!");
    
    // If we have email, we can try to log in with face immediately
    if (email && isFaceLogin) {
      await handleFaceLogin();
    }
  };

  const handleFaceLogin = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    
    if (!faceImageFile) {
      setShowFaceScanner(true);
      setIsFaceLogin(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the face verification service
      const result = await verifyFace(email, null, faceImageFile);
      
      if (result.success && result.token && result.user) {
        // Use the auth context to log the user in
        const success = await login(email, '', result.token, result.user);
        if (success && onSuccess) onSuccess();
      } else {
        toast.error(result.message || "Face verification failed");
      }
    } catch (error) {
      console.error("Face login error:", error);
      toast.error("An error occurred during face login");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the verification service with password (and face if provided)
      const result = await verifyFace(email, password, faceImageFile);
      
      if (result.success && result.token && result.user) {
        // Use the auth context to log the user in
        const success = await login(email, password, result.token, result.user);
        if (success && onSuccess) onSuccess();
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  if (showFaceScanner) {
    return (
      <FaceCapture
        onCapture={handleFaceCapture}
        onCancel={() => {
          setShowFaceScanner(false);
          setIsFaceLogin(false);
        }}
        capturedImage={faceImagePreview}
      />
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to log in to your account</p>
      </div>
      
      <form onSubmit={handlePasswordLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button type="button" className="text-xs text-primary hover:underline">
              Forgot password?
            </button>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Face Authentication</Label>
          <div className="flex flex-col space-y-2">
            {faceImagePreview ? (
              <div className="border rounded-md p-3 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Face scan captured</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFaceScanner(true)}
                >
                  Rescan
                </Button>
              </div>
            ) : (
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setShowFaceScanner(true);
                  setIsFaceLogin(false);
                }}
                className="flex items-center justify-center w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                Add Face Verification
              </Button>
            )}
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log in with Password'}
        </Button>

        <Button 
          type="button"
          className="w-full" 
          variant="secondary"
          disabled={isLoading}
          onClick={handleFaceLogin}
        >
          {isLoading ? 'Logging in...' : 'Log in with Face Only'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <button 
          type="button"
          onClick={onToggleForm} 
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
