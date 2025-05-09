
// Face authentication service that communicates with our Node.js backend

const API_URL = "http://localhost:3001"; // Node.js/Express backend URL
const FASTAPI_URL = "http://localhost:8000"; // FastAPI server for face recognition

/**
 * Register a face for a user during signup
 * @param userData - User data including name, email, password
 * @param faceImage - The face image file
 * @returns Promise with registration result
 */
export const registerFace = async (
  userData: { name: string; email: string; password: string; role: string },
  faceImage: File | null
): Promise<{ success: boolean; message: string; token?: string; userId?: string }> => {
  try {
    if (!faceImage) {
      return { success: false, message: "No face image provided" };
    }

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("role", userData.role);
    formData.append("faceImage", faceImage);

    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during face registration:", error);
    return {
      success: false,
      message: "Failed to register face. Please try again."
    };
  }
};

/**
 * Verify a user's face during login
 * @param email - User's email
 * @param password - User's password (optional for face-only login)
 * @param faceImage - The face image file
 * @returns Promise with verification result
 */
export const verifyFace = async (
  email: string,
  password: string | null,
  faceImage: File | null
): Promise<{ success: boolean; message: string; token?: string; user?: any }> => {
  try {
    if (!faceImage && !password) {
      return { success: false, message: "Please provide password or face image" };
    }

    const formData = new FormData();
    formData.append("email", email);
    
    if (password) {
      formData.append("password", password);
    }
    
    if (faceImage) {
      formData.append("faceImage", faceImage);
    }

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during face verification:", error);
    return {
      success: false,
      message: "Failed to verify face. Please try again."
    };
  }
};

/**
 * Converts a base64 image to a File object
 * @param base64String - Base64 encoded image string
 * @returns File object
 */
export const base64ToFile = (base64String: string): File => {
  // Extract base64 data (remove data:image/png;base64, part)
  const base64Data = base64String.split(',')[1];
  const byteString = atob(base64Data);
  
  // Create an array buffer from the decoded base64 string
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  // Create a Blob and then a File from the ArrayBuffer
  const blob = new Blob([ab], { type: 'image/png' });
  return new File([blob], "face-image.png", { type: 'image/png' });
};

export default {
  registerFace,
  verifyFace,
  base64ToFile
};
