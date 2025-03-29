
// Custom 2D face scan authentication service
// This implementation uses API calls to a Python face recognition model

/**
 * Base URL for the face recognition API
 * In a real application, this would be your deployed API endpoint
 */
const API_BASE_URL = 'https://api.example.com/face-recognition'; // Replace with your actual API URL

/**
 * Interface for face detection position data
 */
interface FacePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Extract face features from an image by calling the API
 * @param imageData - Base64 encoded image data
 * @returns Promise resolving to face features
 */
const sendImageToAPI = async (
  endpoint: string,
  imageData: string,
  userId?: string
): Promise<any> => {
  try {
    // Remove data URL prefix if present to reduce payload size
    const base64Image = imageData.includes('base64,')
      ? imageData.split('base64,')[1]
      : imageData;
    
    // Prepare the request body
    const requestBody: any = {
      image: base64Image
    };
    
    // Add userId if provided
    if (userId) {
      requestBody.userId = userId;
    }
    
    // Call the API
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error calling ${endpoint} API:`, error);
    throw error;
  }
};

/**
 * Simulated database of face features
 * In a real application, these would be stored in a secure database
 */
const faceFeatureDatabase: Record<string, any> = {};

/**
 * Verifies a face against stored face data
 * @param userId - The user's ID (if known)
 * @param faceImageData - Base64 encoded face image
 * @returns Promise resolving to verification result
 */
export const verifyFace = async (
  userId: string | null, 
  faceImageData: string
): Promise<{ success: boolean; message: string; confidence?: number }> => {
  console.log('Face verification requested', { 
    userId: userId || 'unknown', 
    imageSize: faceImageData.length 
  });
  
  try {
    // If no userId provided, we can't verify against stored data
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required for verification'
      };
    }
    
    // Simulate API delay for demo purposes
    // (you can remove this in a real implementation)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Call the verification API endpoint
    const result = await sendImageToAPI('verify', faceImageData, userId);
    
    return {
      success: result.verified,
      message: result.verified ? 'Face verification successful' : 'Face verification failed',
      confidence: result.confidence
    };
  } catch (error) {
    console.error('Error during face verification:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Face verification failed'
    };
  }
};

/**
 * Registers a new face for a user
 * @param userId - The user's ID
 * @param faceImageData - Base64 encoded face image
 * @returns Promise resolving to registration result
 */
export const registerFace = async (
  userId: string, 
  faceImageData: string
): Promise<{ success: boolean; message: string; }> => {
  console.log('Face registration requested', { 
    userId, 
    imageSize: faceImageData.length 
  });
  
  try {
    // Simulate API delay for demo purposes
    // (you can remove this in a real implementation)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Call the registration API endpoint
    const result = await sendImageToAPI('register', faceImageData, userId);
    
    // Store success in our simulated database
    if (result.registered) {
      faceFeatureDatabase[userId] = true;
    }
    
    return {
      success: result.registered,
      message: result.registered ? 'Face registered successfully' : 'Face registration failed'
    };
  } catch (error) {
    console.error('Error during face registration:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Face registration failed'
    };
  }
};

/**
 * Check if a face is detected in an image
 * Useful for validating face scans before attempting registration or verification
 * @param imageData - Base64 encoded image data
 * @returns Promise resolving to face detection result
 */
export const detectFace = async (
  imageData: string
): Promise<{ 
  detected: boolean; 
  message: string; 
  faceData?: { 
    position: FacePosition;
    confidence: number;
  } 
}> => {
  try {
    // For demo purposes, add a small delay to simulate API call
    // (you can remove this in a real implementation)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Call the detection API endpoint
    const result = await sendImageToAPI('detect', imageData);
    
    if (!result.detected) {
      return {
        detected: false,
        message: 'No face detected in the image'
      };
    }
    
    return {
      detected: true,
      message: 'Face detected successfully',
      faceData: {
        position: result.position,
        confidence: result.confidence
      }
    };
  } catch (error) {
    console.error('Error during face detection:', error);
    return {
      detected: false,
      message: error instanceof Error ? error.message : 'Face detection failed'
    };
  }
};
