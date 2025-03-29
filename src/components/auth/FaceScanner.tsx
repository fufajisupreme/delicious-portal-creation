
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Check, X, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { detectFace } from '@/services/faceAuthService';

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
  const [faceDetected, setFaceDetected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Start camera when component mounts
  useEffect(() => {
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

    startCamera();

    // Cleanup: stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Periodically check for face in the frame
  useEffect(() => {
    if (!isScanning || isCaptured) return;

    const checkForFace = async () => {
      if (!videoRef.current || !canvasRef.current || isProcessing) return;
      
      setIsProcessing(true);
      
      try {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data as base64 string
        const imageData = canvas.toDataURL('image/png');
        
        // Check if a face is detected using our API service
        const result = await detectFace(imageData);
        setFaceDetected(result.detected);
        
        if (result.detected && result.faceData) {
          // Draw rectangle around face if detected
          if (context && result.faceData.position) {
            const { x, y, width, height } = result.faceData.position;
            context.strokeStyle = '#4ade80';
            context.lineWidth = 2;
            context.strokeRect(x, y, width, height);
          }
        }
      } catch (error) {
        console.error('Error checking for face:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    const intervalId = setInterval(checkForFace, 500);
    return () => clearInterval(intervalId);
  }, [isScanning, isCaptured, isProcessing]);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    
    try {
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
      
      // Verify that a face is present in the captured image
      const result = await detectFace(imageData);
      
      if (!result.detected) {
        setErrorMessage("No face detected. Please position your face in the frame.");
        setIsProcessing(false);
        return;
      }
      
      // Stop camera
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      setIsCaptured(true);
      setIsScanning(false);
      setErrorMessage(null);
      
      // Pass image data to parent component
      onCapture(imageData);
    } catch (error) {
      console.error("Error capturing face:", error);
      setErrorMessage("Error capturing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-background">
      <div className="text-lg font-semibold">Face Scan Authentication</div>
      
      {errorMessage && (
        <div className="text-destructive text-sm p-2 bg-destructive/10 rounded-md w-full flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {errorMessage}
        </div>
      )}
      
      <div className="relative bg-black rounded-md overflow-hidden w-[320px] h-[240px] flex items-center justify-center">
        {isScanning ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            {faceDetected && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Face Detected
              </div>
            )}
          </>
        ) : isCaptured ? (
          <div className="flex items-center justify-center h-full w-full bg-primary/10">
            <Check size={48} className="text-primary" />
            <span className="text-primary font-semibold ml-2">Face captured!</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Camera size={48} />
            <span className="text-sm mt-2">Camera initializing...</span>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for capturing and processing image */}
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="flex space-x-4">
        {isScanning && !isCaptured && (
          <Button 
            onClick={captureImage} 
            className="flex items-center"
            disabled={isProcessing || !faceDetected}
          >
            <Camera className="mr-2 h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Capture'}
          </Button>
        )}
        
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Position your face in the frame and ensure good lighting for best results.
        Your face scan will be used for identification purposes only.
      </p>
    </div>
  );
};

export default FaceScanner;
