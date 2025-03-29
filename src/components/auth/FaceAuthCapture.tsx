
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Upload } from 'lucide-react';
import FaceScanner from './FaceScanner';
import ImageUploader from './ImageUploader';

interface FaceAuthCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

const FaceAuthCapture: React.FC<FaceAuthCaptureProps> = ({ onCapture, onCancel }) => {
  const [mode, setMode] = useState<'select' | 'camera' | 'upload'>('select');

  if (mode === 'camera') {
    return (
      <FaceScanner
        onCapture={(imageData) => {
          onCapture(imageData);
        }}
        onCancel={() => setMode('select')}
      />
    );
  }

  if (mode === 'upload') {
    return (
      <ImageUploader
        onCapture={(imageData) => {
          onCapture(imageData);
        }}
        onCancel={() => setMode('select')}
      />
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-6 border rounded-lg bg-background">
      <div className="text-xl font-semibold text-center">Face Authentication</div>
      
      <p className="text-sm text-center text-muted-foreground">
        Choose how you'd like to set up face authentication
      </p>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <Button
          variant="outline"
          size="lg"
          className="flex flex-col h-36 items-center justify-center gap-2 p-4"
          onClick={() => setMode('camera')}
        >
          <Camera size={36} />
          <span className="text-sm font-medium">Use Camera</span>
          <span className="text-xs text-muted-foreground text-center">
            Take a photo now
          </span>
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="flex flex-col h-36 items-center justify-center gap-2 p-4"
          onClick={() => setMode('upload')}
        >
          <Upload size={36} />
          <span className="text-sm font-medium">Upload Image</span>
          <span className="text-xs text-muted-foreground text-center">
            Use an existing photo
          </span>
        </Button>
      </div>
      
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};

export default FaceAuthCapture;
