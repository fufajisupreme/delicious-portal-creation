
// Chat service that connects to API endpoint

type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const chatService = {
  // Send a message and get a response from the API
  sendMessage: async (message: string): Promise<ChatMessage> => {
    try {
      // Call the API endpoint
      const response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      
      return {
        id: generateId(),
        content: data.response || "Sorry, I couldn't get an answer right now.",
        sender: 'bot',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error fetching chat response:', error);
      
      // Return a fallback message if the API call fails
      return {
        id: generateId(),
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
    }
  }
};
