
// Simple in-memory chat service
// In a real application, this would connect to a backend API

type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Pre-defined responses for common questions
const botResponses: Record<string, string[]> = {
  default: [
    "Thanks for your message! How can I help you today?",
    "I'm here to assist you with food delivery questions.",
    "Let me know if you have questions about our restaurants or delivery options.",
    "Is there anything specific you'd like to know about our service?"
  ],
  greeting: [
    "Hello there! How can I help you with your food order today?",
    "Hi! Looking for some delicious food? I can help!",
    "Welcome! How may I assist you with your dining needs?"
  ],
  menu: [
    "Our restaurants offer a wide variety of cuisines. You can browse all options in the 'Restaurants' section.",
    "We have everything from Italian to Japanese cuisine. Check out our featured restaurants section for popular choices."
  ],
  delivery: [
    "We typically deliver within 30-45 minutes depending on your location and order.",
    "Delivery times vary by restaurant and location, but we aim for under 45 minutes for most orders."
  ],
  payment: [
    "We accept all major credit cards, digital wallets like Apple Pay and Google Pay, and cash on delivery in select areas.",
    "You can pay with credit/debit cards or digital wallets. Payment options are shown at checkout."
  ]
};

export const chatService = {
  // Send a message and get a response
  sendMessage: async (message: string): Promise<ChatMessage> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Determine which response category to use
    let responseCategory = 'default';
    
    if (lowerMessage.match(/hi|hello|hey|greetings/)) {
      responseCategory = 'greeting';
    } else if (lowerMessage.match(/menu|food|dish|cuisine|eat/)) {
      responseCategory = 'menu';
    } else if (lowerMessage.match(/delivery|deliver|time|fast|quick/)) {
      responseCategory = 'delivery';
    } else if (lowerMessage.match(/pay|payment|card|cash/)) {
      responseCategory = 'payment';
    }
    
    // Get random response from appropriate category
    const responses = botResponses[responseCategory];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: generateId(),
      content: randomResponse,
      sender: 'bot',
      timestamp: new Date()
    };
  }
};
