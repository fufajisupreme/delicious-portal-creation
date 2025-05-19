
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FaceScannerProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

const FaceScanner: React.FC<FaceScannerProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameraStatus, setCameraStatus] = useState<'initializing' | 'ready' | 'error'>('initializing');

  // Start camera when component mounts
  useEffect(() => {
    const startCamera = async () => {
      try {
        console.log('Requesting camera access...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: "user" 
          } 
        });
        
        console.log('Camera access granted, setting up video stream...');
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, trying to play...');
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  console.log('Camera stream started successfully');
                  setIsScanning(true);
                  setCameraStatus('ready');
                })
                .catch(err => {
                  console.error('Error playing video:', err);
                  setErrorMessage('Error starting video stream');
                  setCameraStatus('error');
                });
            }
          };
        }
        
        setErrorMessage(null);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setErrorMessage("Could not access camera. Please ensure camera access is allowed.");
        setIsScanning(false);
        setCameraStatus('error');
      }
    };

    startCamera();

    // Cleanup: stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => {
          console.log('Stopping camera track:', track.label);
          track.stop();
        });
      }
    };
  }, []);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas reference is not available');
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      console.error('Could not get canvas context');
      return;
    }
    
    console.log('Capturing image from video feed');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data as base64 string
    const imageData = canvas.toDataURL('image/png');
    console.log('Image captured, size:', imageData.length);
    
    // Stop camera
    if (video.srcObject) {
      const stream = video.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    setIsCaptured(true);
    setIsScanning(false);
    
    // Pass image data to parent component
    onCapture(imageData);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-background">
      <div className="text-lg font-semibold">Face Scan Authentication</div>
      
      {errorMessage && (
        <div className="text-destructive text-sm p-2 bg-destructive/10 rounded-md w-full">
          {errorMessage}
        </div>
      )}
      
      <div className="relative bg-black rounded-md overflow-hidden w-[320px] h-[240px] flex items-center justify-center">
        {isScanning ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror the video for more natural selfie experience
          />
        ) : isCaptured ? (
          <div className="flex items-center justify-center h-full w-full bg-primary/10">
            <Check size={48} className="text-primary" />
            <span className="text-primary font-semibold ml-2">Face captured!</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Camera size={48} />
            <span className="text-sm mt-2">
              {cameraStatus === 'initializing' ? 'Camera initializing...' : 'Camera not available'}
            </span>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for capturing image */}
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="flex space-x-4">
        {isScanning && !isCaptured && (
          <Button onClick={captureImage} className="flex items-center">
            <Camera className="mr-2 h-4 w-4" />
            Capture
          </Button>
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

export default FaceScanner;
