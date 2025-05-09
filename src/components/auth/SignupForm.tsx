
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth, UserRole } from '@/contexts/AuthContext';
import FaceCapture from './FaceCapture';
import { Camera } from 'lucide-react';
import { toast } from "sonner";
import { registerFace, base64ToFile } from '@/services/faceAuthService';

interface SignupFormProps {
  onToggleForm: () => void;
  onSuccess?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleForm, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [showFaceScanner, setShowFaceScanner] = useState(false);
  const [faceImageFile, setFaceImageFile] = useState<File | null>(null);
  const [faceImagePreview, setFaceImagePreview] = useState<string | null>(null);
  const { signup } = useAuth();

  const handleFaceCapture = (imageFile: File) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the faceAuthService to register
      const result = await registerFace(
        { name, email, password, role },
        faceImageFile
      );

      if (result.success) {
        // Use Auth context to set the user state
        const success = await signup(name, email, password, role, result.token, result.userId);
        if (success && onSuccess) onSuccess();
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  if (showFaceScanner) {
    return (
      <FaceCapture
        onCapture={handleFaceCapture}
        onCancel={() => setShowFaceScanner(false)}
        capturedImage={faceImagePreview}
      />
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">Enter your details to create a new account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
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
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Account Type</Label>
          <RadioGroup 
            value={role} 
            onValueChange={(value) => setRole(value as UserRole)}
            className="flex flex-col space-y-1 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="customer" id="customer" />
              <Label htmlFor="customer" className="cursor-pointer">Customer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="restaurant_owner" id="restaurant_owner" />
              <Label htmlFor="restaurant_owner" className="cursor-pointer">Restaurant Owner</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Face Authentication (Required)</Label>
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
                onClick={() => setShowFaceScanner(true)}
                className="flex items-center justify-center"
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture Face
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Face scanning provides an additional layer of security for your account.
            </p>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !faceImagePreview}
        >
          {isLoading ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        Already have an account?{' '}
        <button 
          type="button"
          onClick={onToggleForm} 
          className="text-primary hover:underline font-medium"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
