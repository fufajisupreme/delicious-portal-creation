
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X } from 'lucide-react';
import { detectFace } from '@/services/faceAuthService';
import { toast } from "sonner";

interface ImageUploaderProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onCapture, onCancel }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);

    try {
      // Read the file and convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;
        setPreviewUrl(imageData);

        // Check if a face is detected in the image
        try {
          const result = await detectFace(imageData);
          if (!result.detected) {
            toast.error("No face detected in the uploaded image. Please try another image.");
            setPreviewUrl(null);
            setIsUploading(false);
            return;
          }

          // If we got here, a face was detected
          toast.success("Face detected in image");
          onCapture(imageData);
        } catch (error) {
          console.error("Error detecting face:", error);
          toast.error("Error processing image. Please try again.");
          setPreviewUrl(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-background">
      <div className="text-lg font-semibold">Upload Face Image</div>
      
      <div className="relative bg-black rounded-md overflow-hidden w-[320px] h-[240px] flex items-center justify-center">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Uploaded face" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 text-gray-500">
            <Upload size={48} />
            <span className="text-sm mt-2">Upload an image of your face</span>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="flex space-x-4">
        <Button 
          onClick={handleUploadClick} 
          className="flex items-center"
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Processing...' : 'Upload Image'}
        </Button>
        
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Upload a clear image of your face. The image will be used for authentication purposes only.
      </p>
    </div>
  );
};

export default ImageUploader;
