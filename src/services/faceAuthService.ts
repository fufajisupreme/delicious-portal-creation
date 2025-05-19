
// Face authentication service that connects to the specified API endpoints

/**
 * Base API URL for the face authentication service
 * In a production environment, this would be configured via environment variables
 */
const API_BASE_URL = 'https://your-api-url.com'; // Replace with your actual API URL

/**
 * Verifies a face against stored face data via API
 * @param email - User email (if known)
 * @param faceImageData - Base64 encoded face image
 * @returns Promise resolving to verification result
 */
export const verifyFace = async (
  email: string | null, 
  faceImageData: string
): Promise<{ success: boolean; message: string; token?: string }> => {
  try {
    console.log('Face verification requested', { 
      email: email || 'unknown', 
      imageSize: faceImageData.length 
    });
    
    const response = await fetch(`${API_BASE_URL}/login-face`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: faceImageData
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.detail || 'Face verification failed'
      };
    }
    
    return {
      success: true,
      message: 'Face verification successful',
      token: data.access_token
    };
  } catch (error) {
    console.error('Face verification error:', error);
    return {
      success: false,
      message: 'Face verification service error'
    };
  }
};

/**
 * Registers a new face for a user
 * @param email - User email
 * @param password - User password
 * @param faceImageData - Base64 encoded face image
 * @returns Promise resolving to registration result
 */
export const registerFace = async (
  email: string, 
  password: string,
  faceImageData: string
): Promise<{ success: boolean; message: string; token?: string }> => {
  try {
    console.log('Face registration requested', { 
      email,
      imageSize: faceImageData.length 
    });
    
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        image: faceImageData
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.detail || 'Face registration failed'
      };
    }
    
    return {
      success: true,
      message: 'Face registration successful',
      token: data.access_token
    };
  } catch (error) {
    console.error('Face registration error:', error);
    return {
      success: false,
      message: 'Face registration service error'
    };
  }
};
