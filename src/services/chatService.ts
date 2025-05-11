
/**
 * Chat service for communicating with the backend AI chat API
 */

const API_URL = "http://localhost:3001"; // Node.js/Express backend URL

/**
 * Send a message to the AI chat service
 * @param message - The user's message
 * @returns Promise with chat response
 */
export const sendChatMessage = async (
  message: string
): Promise<{ success: boolean; response?: string; message?: string }> => {
  try {
    if (!message.trim()) {
      return { success: false, message: "Please enter a message" };
    }

    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    return {
      success: false,
      message: "Failed to send message. Please try again."
    };
  }
};

export default {
  sendChatMessage
};
