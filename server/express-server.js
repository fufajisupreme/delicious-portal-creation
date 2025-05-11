/**
 * Express server for face authentication
 * 
 * This file would be in a separate Node.js project, not part of the React frontend.
 * It's included here for documentation purposes only.
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;
const FASTAPI_URL = 'http://localhost:8000'; // FastAPI server for face recognition
const JWT_SECRET = 'your-jwt-secret'; // Should be in environment variables

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/faceauth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  faceId: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Ensure uploads directory exists
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

// Routes

// Signup route
app.post('/auth/signup', upload.single('faceImage'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already registered' 
      });
    }
    
    // Validate inputs
    if (!name || !email || !password || !req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Send face image to FastAPI for embedding
    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));
    
    const fastApiResponse = await axios.post(`${FASTAPI_URL}/register`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });
    
    if (!fastApiResponse.data.success) {
      return res.status(400).json({
        success: false,
        message: 'Face registration failed: ' + fastApiResponse.data.message
      });
    }
    
    // Create new user with face embedding ID
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      faceId: fastApiResponse.data.embedding_id
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      userId: newUser._id.toString()
    });
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Login route
app.post('/auth/login', upload.single('faceImage'), async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check authentication method
    if (req.file) {
      // Face authentication
      const formData = new FormData();
      formData.append('image', fs.createReadStream(req.file.path));
      formData.append('user_id', user.faceId);
      
      const fastApiResponse = await axios.post(`${FASTAPI_URL}/verify`, formData, {
        headers: {
          ...formData.getHeaders(),
        }
      });
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      if (!fastApiResponse.data.success) {
        return res.status(401).json({
          success: false,
          message: 'Face verification failed'
        });
      }
    } else if (password) {
      // Password authentication
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
    } else {
      // No authentication provided
      return res.status(400).json({ 
        success: false, 
        message: 'Password or face image required' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasFaceId: !!user.faceId
    };
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Authentication middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No authentication token provided' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Protected route example
app.get('/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }
    
    // Simple AI response logic (placeholder)
    // In a real app, you would integrate with an AI service like OpenAI, Azure, etc.
    let response = '';
    
    if (message.toLowerCase().includes('food')) {
      response = "Our app offers a wide variety of food options from top-rated restaurants in your area. You can filter by cuisine, price range, or dietary preferences!";
    } else if (message.toLowerCase().includes('delivery')) {
      response = "We deliver to most locations within 20-30 minutes. You can track your delivery in real-time through our app!";
    } else if (message.toLowerCase().includes('restaurant')) {
      response = "We partner with hundreds of restaurants in your area. From local favorites to well-known chains, we've got you covered!";
    } else if (message.toLowerCase().includes('payment')) {
      response = "We accept all major credit cards, digital wallets like Apple Pay and Google Pay, and even cash on delivery in some areas.";
    } else {
      response = "Thanks for reaching out! Feel free to ask about our food options, delivery times, restaurant partners, or anything else you'd like to know about our service.";
    }
    
    // Simulate a delay to make it feel more natural
    setTimeout(() => {
      res.status(200).json({
        success: true,
        response
      });
    }, 500);
  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error processing your request' 
    });
  }
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
