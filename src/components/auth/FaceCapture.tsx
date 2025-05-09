
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FaceCaptureProps {
  onCapture: (imageFile: File) => void;
  onCancel: () => void;
  capturedImage?: string | null;
  showFileUpload?: boolean;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ 
  onCapture, 
  onCancel,
  capturedImage,
  showFileUpload = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [displayImage, setDisplayImage] = useState<string | null>(capturedImage);

  // Start camera when component mounts
  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }
    
    return () => stopCamera(); // Cleanup
  }, [capturedImage]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: "user" 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsScanning(true);
      setErrorMessage(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMessage("Could not access camera. Please ensure camera access is allowed.");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsScanning(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data as base64 string
    const imageData = canvas.toDataURL('image/png');
    setDisplayImage(imageData);

    // Convert base64 to File
    fetch(imageData)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "face-image.png", { type: "image/png" });
        onCapture(file);
        stopCamera();
      });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDisplayImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // Pass file to parent
      onCapture(file);
      setIsScanning(false);
    }
  };

  const retakePhoto = () => {
    setDisplayImage(null);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-background">
      <div className="text-lg font-semibold">Face Authentication</div>
      
      {errorMessage && (
        <div className="text-destructive text-sm p-2 bg-destructive/10 rounded-md w-full">
          {errorMessage}
        </div>
      )}
      
      <div className="relative bg-black rounded-md overflow-hidden w-[320px] h-[240px] flex items-center justify-center">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt="Captured face" 
            className="w-full h-full object-cover"
          />
        ) : isScanning ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Camera size={48} />
            <span className="text-sm mt-2">Camera initializing...</span>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for capturing image */}
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="flex flex-wrap gap-4 justify-center">
        {!displayImage && isScanning && (
          <Button onClick={captureImage} className="flex items-center">
            <Camera className="mr-2 h-4 w-4" />
            Capture
          </Button>
        )}
        
        {displayImage && (
          <Button variant="outline" onClick={retakePhoto} className="flex items-center">
            <Camera className="mr-2 h-4 w-4" />
            Retake
          </Button>
        )}

        {!displayImage && showFileUpload && (
          <div>
            <input 
              type="file" 
              accept="image/*" 
              id="face-upload" 
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="face-upload">
              <Button variant="outline" className="flex items-center cursor-pointer" as="span">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </label>
          </div>
        )}
        
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Your face scan will be used for identification purposes only.
        We do not store the complete image of your face.
      </p>
    </div>
  );
};

export default FaceCapture;
