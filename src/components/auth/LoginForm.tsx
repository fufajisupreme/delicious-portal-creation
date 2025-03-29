
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { Camera } from 'lucide-react';
import FaceAuthCapture from './FaceAuthCapture';
import { toast } from "sonner";

interface LoginFormProps {
  onToggleForm: () => void;
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFaceAuthCapture, setShowFaceAuthCapture] = useState(false);
  const [faceImageData, setFaceImageData] = useState<string | null>(null);
  const { login, loginWithFace } = useAuth();

  const handleFaceCapture = async (imageData: string) => {
    setFaceImageData(imageData);
    setShowFaceAuthCapture(false);
    toast.success("Face captured successfully!");
    
    // If we have email, we can try to log in with face immediately
    if (email) {
      await handleFaceLogin(imageData);
    }
  };

  const handleFaceLogin = async (imageData: string = faceImageData || '') => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await loginWithFace(email, imageData);
      if (success && onSuccess) onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If we have face data, try to use it with regular login
      const success = await login(email, password, faceImageData);
      if (success && onSuccess) onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  if (showFaceAuthCapture) {
    return (
      <FaceAuthCapture
        onCapture={handleFaceCapture}
        onCancel={() => setShowFaceAuthCapture(false)}
      />
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to log in to your account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
            {faceImageData ? (
              <div className="border rounded-md p-3 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Face scan captured</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFaceAuthCapture(true)}
                >
                  Rescan
                </Button>
              </div>
            ) : (
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setShowFaceAuthCapture(true)}
                className="flex items-center justify-center w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                Log in with Face
              </Button>
            )}
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log in with Password'}
        </Button>

        {faceImageData && (
          <Button 
            type="button"
            className="w-full" 
            variant="secondary"
            disabled={isLoading}
            onClick={() => handleFaceLogin()}
          >
            {isLoading ? 'Logging in...' : 'Log in with Face Only'}
          </Button>
        )}
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
